#!/usr/bin/env node
// Brand color system from a few seed colors. No dependencies.
//
//   node palette.mjs <brand.json> [--out <dir>]
//
// Reads brand.json "colors" (see SKILL.md), builds perceptual OKLCH ramps (50..950) for each brand
// color, a tinted neutral ramp, and status ramps, then maps semantic roles for light and dark themes
// and checks every role pair against WCAG 2.2 contrast. Seeds keep their exact value: each seed is
// anchored at the ramp step whose lightness is closest.
//
// Writes: tokens.json (W3C Design Tokens format), tokens.css (custom properties, light + dark),
// tailwind.preset.cjs, palette.html (swatches + contrast report), contrast.json.
// Exit code 1 when a required contrast pair fails.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

// ---------- color math (Björn Ottosson's OKLab, sRGB D65) ----------
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

function rgbToOklab([r, g, b]) {
  const [lr, lg, lb] = [r, g, b].map(toLinear)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
function oklabToLinear([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}
const oklchToOklab = ([L, C, H]) => [L, C * Math.cos((H * Math.PI) / 180), C * Math.sin((H * Math.PI) / 180)]
function oklabToOklch([L, a, b]) {
  const C = Math.hypot(a, b)
  let H = (Math.atan2(b, a) * 180) / Math.PI
  if (H < 0) H += 360
  return [L, C, C < 1e-4 ? 0 : H]
}
const inGamut = (lin) => lin.every((c) => c >= -1e-4 && c <= 1 + 1e-4)

// Reduce chroma (keeping L and H) until the color fits sRGB. This is the CSS Color 4 approach in spirit.
function fitOklch([L, C, H]) {
  if (inGamut(oklabToLinear(oklchToOklab([L, C, H])))) return [L, C, H]
  let lo = 0, hi = C
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (inGamut(oklabToLinear(oklchToOklab([L, mid, H])))) lo = mid
    else hi = mid
  }
  return [L, lo, H]
}
function oklchToHex(lch) {
  const rgb = oklabToLinear(oklchToOklab(fitOklch(lch))).map((c) => Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, c))))) * 255))
  return '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('')
}
function parseColor(input) {
  const s = String(input).trim().toLowerCase()
  let m = s.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/)
  if (m) {
    let h = m[1]
    if (h.length === 3) h = [...h].map((c) => c + c).join('')
    return oklabToOklch(rgbToOklab([0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)))
  }
  m = s.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*\)$/)
  if (m) return [m[2] ? +m[1] / 100 : +m[1], +m[3], +m[4]]
  throw new Error(`Cannot read color "${input}". Use #rrggbb or oklch(L C H).`)
}
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const fmtLch = ([L, C, H]) => `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${H.toFixed(1)})`

// ---------- ramps ----------
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
// Target OKLCH lightness per step. Spaced so neighbouring steps read as distinct and 500/600 sit mid-scale.
const LIGHTNESS = { 50: 0.975, 100: 0.945, 200: 0.89, 300: 0.815, 400: 0.72, 500: 0.63, 600: 0.545, 700: 0.465, 800: 0.385, 900: 0.31, 950: 0.225 }
// Chroma envelope: full chroma mid-scale, tapering toward white and black where sRGB cannot hold it anyway.
const ENVELOPE = { 50: 0.18, 100: 0.32, 200: 0.55, 300: 0.78, 400: 0.94, 500: 1, 600: 1, 700: 0.92, 800: 0.8, 900: 0.66, 950: 0.52 }

function ramp(seedLch, { anchor = true, hueShift = 0 } = {}) {
  const [, C, H] = seedLch
  const out = {}
  for (const step of STEPS) {
    // Small hue drift toward warmer darks and cooler lights reads more natural than a flat hue. Optional.
    const t = (STEPS.indexOf(step) - 5) / 5
    out[step] = fitOklch([LIGHTNESS[step], C * ENVELOPE[step], (H + hueShift * t + 360) % 360])
  }
  let anchoredAt = null
  if (anchor) {
    anchoredAt = STEPS.reduce((best, s) => (Math.abs(LIGHTNESS[s] - seedLch[0]) < Math.abs(LIGHTNESS[best] - seedLch[0]) ? s : best), 500)
    out[anchoredAt] = seedLch
  }
  return { steps: Object.fromEntries(STEPS.map((s) => [s, { hex: oklchToHex(out[s]), oklch: fmtLch(out[s]) }])), anchoredAt }
}

// ---------- main ----------
const args = process.argv.slice(2)
if (!args[0] || args[0] === '--help') {
  console.log('usage: node palette.mjs <brand.json> [--out <dir>]')
  process.exit(args[0] ? 0 : 1)
}
const brandPath = resolve(args[0])
const outDir = resolve(args.includes('--out') ? args[args.indexOf('--out') + 1] : join(dirname(brandPath), 'tokens'))
const brand = JSON.parse(readFileSync(brandPath, 'utf8'))
const colors = brand.colors ?? {}
if (!colors.primary) {
  console.error('brand.json needs colors.primary (hex or oklch).')
  process.exit(1)
}

const ramps = {}
const anchors = {}
for (const [name, value] of Object.entries(colors)) {
  if (['neutral', 'status'].includes(name)) continue
  const r = ramp(parseColor(value), { hueShift: brand.colors.hueShift ?? 0 })
  if (name === 'hueShift') continue
  ramps[name] = r.steps
  anchors[name] = { seed: value, step: r.anchoredAt }
}

// Neutral: tinted toward the primary hue by default, because pure gray beside a saturated brand reads dead.
const n = colors.neutral ?? {}
const neutralHue = n.hue ?? parseColor(n.tint ? colors[n.tint] ?? n.tint : colors.primary)[2]
ramps.neutral = ramp([0.6, n.chroma ?? 0.012, neutralHue], { anchor: false }).steps
// Extremes for page background and text, slightly off pure white and black.
ramps.neutral[0] = { hex: oklchToHex([0.995, (n.chroma ?? 0.012) * 0.25, neutralHue]), oklch: fmtLch([0.995, (n.chroma ?? 0.012) * 0.25, neutralHue]) }
ramps.neutral[1000] = { hex: oklchToHex([0.16, (n.chroma ?? 0.012) * 0.6, neutralHue]), oklch: fmtLch([0.16, (n.chroma ?? 0.012) * 0.6, neutralHue]) }

// Status colors stay recognisable (green ok, amber warning, red danger, blue info) and are never the brand
// color, so a red brand still needs a separate danger red that reads as "danger" in context.
const status = { success: 'oklch(62% 0.15 150)', warning: 'oklch(75% 0.15 75)', danger: 'oklch(58% 0.19 27)', info: 'oklch(60% 0.13 250)', ...(colors.status ?? {}) }
for (const [name, value] of Object.entries(status)) ramps[name] = ramp(parseColor(value), { anchor: false }).steps

// Pick the lightest/darkest step that still meets a contrast target against a given background.
// bgHex may be one background or a list; the chosen step must pass against every one.
function pick(rampName, bgHex, target, prefer, from) {
  const bgs = [].concat(bgHex)
  const order = prefer === 'dark' ? STEPS.filter((s) => s >= from) : [...STEPS].reverse().filter((s) => s <= from)
  for (const s of order) if (bgs.every((b) => contrast(ramps[rampName][s].hex, b) >= target)) return s
  return prefer === 'dark' ? 950 : 50
}
const onColor = (hex) => (contrast(hex, '#ffffff') >= contrast(hex, ramps.neutral[1000].hex) ? '#ffffff' : ramps.neutral[1000].hex)

function themeRoles(mode) {
  const L = mode === 'light'
  const N = ramps.neutral
  const bg = L ? N[0].hex : N[1000].hex
  const roles = {
    bg,
    surface: L ? '#ffffff' : N[950].hex,
    'surface-sunken': L ? N[50].hex : N[1000].hex,
    border: L ? N[200].hex : N[800].hex,
    'border-strong': N[pick('neutral', [bg, L ? '#ffffff' : N[950].hex], 3, L ? 'dark' : 'light', L ? 400 : 600)].hex,
    text: L ? N[950].hex : N[50].hex,
    'text-muted': N[pick('neutral', bg, 4.5, L ? 'dark' : 'light', L ? 500 : 400)].hex,
  }
  // Primary fill for buttons. Keep the exact brand color when its label can reach 4.5:1 (a light brand gets
  // dark text). A labeled button does not need its fill to contrast with the page under WCAG 1.4.11, because
  // the label identifies it; that pair is reported as advisory. Otherwise walk toward a step that passes.
  const seedStep = anchors.primary?.step ?? 600
  let pStep = L ? seedStep : Math.min(seedStep, 400)
  for (let i = 0; i < STEPS.length; i++) {
    const hex = ramps.primary[pStep].hex
    if (contrast(hex, onColor(hex)) >= 4.5) break
    pStep = L ? STEPS[Math.min(STEPS.length - 1, STEPS.indexOf(pStep) + 1)] : STEPS[Math.max(0, STEPS.indexOf(pStep) - 1)]
  }
  roles.primary = ramps.primary[pStep].hex
  roles['on-primary'] = onColor(roles.primary)
  roles['primary-text'] = ramps.primary[pick('primary', bg, 4.5, L ? 'dark' : 'light', L ? 600 : 300)].hex
  roles['primary-subtle'] = L ? ramps.primary[100].hex : ramps.primary[900].hex
  roles.focus = ramps.primary[pick('primary', bg, 3, L ? 'dark' : 'light', L ? 500 : 400)].hex
  for (const name of Object.keys(ramps)) {
    if (['primary', 'neutral'].includes(name) || Object.keys(status).includes(name)) continue
    roles[name] = ramps[name][L ? 500 : 400].hex
    roles[`${name}-text`] = ramps[name][pick(name, bg, 4.5, L ? 'dark' : 'light', L ? 600 : 300)].hex
  }
  for (const name of Object.keys(status)) {
    roles[`${name}-subtle`] = L ? ramps[name][50].hex : ramps[name][950].hex
    roles[`${name}-text`] = ramps[name][pick(name, [bg, roles[`${name}-subtle`]], 4.5, L ? 'dark' : 'light', L ? 600 : 300)].hex
    roles[`${name}-border`] = ramps[name][pick(name, bg, 3, L ? 'dark' : 'light', L ? 500 : 400)].hex
  }
  return roles
}
const themes = { light: themeRoles('light'), dark: themeRoles('dark') }

// Contrast checks on the pairs people actually see.
const checks = []
for (const [mode, r] of Object.entries(themes)) {
  const req = (fg, bg, min, why, advisory = false) => {
    const ratio = contrast(r[fg], r[bg])
    checks.push({ theme: mode, fg, bg, ratio: +ratio.toFixed(2), min, pass: ratio >= min, why, advisory: advisory || min === 7 })
  }
  req('text', 'bg', 7, 'body text (AAA target for long reading)')
  req('text', 'surface', 4.5, 'body text on cards')
  req('text-muted', 'bg', 4.5, 'secondary text')
  req('text-muted', 'surface', 4.5, 'secondary text on cards')
  req('on-primary', 'primary', 4.5, 'button label')
  req('primary', 'bg', 3, 'button fill against page: advisory, the label identifies a button', true)
  req('primary-text', 'bg', 4.5, 'links and brand-colored text')
  req('focus', 'bg', 3, 'focus ring (2.4.13)')
  req('border-strong', 'surface', 3, 'input borders (1.4.11)')
  for (const s of Object.keys(status)) {
    req(`${s}-text`, 'bg', 4.5, `${s} text`)
    req(`${s}-text`, `${s}-subtle`, 4.5, `${s} text on its tinted banner`)
  }
  for (const name of Object.keys(ramps)) if (r[`${name}-text`] && !Object.keys(status).includes(name)) req(`${name}-text`, 'bg', 4.5, `${name} text`)
}
const failed = checks.filter((c) => !c.pass && !c.advisory)
const softFailed = checks.filter((c) => !c.pass && c.advisory)

// ---------- outputs ----------
mkdirSync(outDir, { recursive: true })
const dtcg = { color: {} }
for (const [name, steps] of Object.entries(ramps)) {
  dtcg.color[name] = {}
  for (const [s, v] of Object.entries(steps)) dtcg.color[name][s] = { $type: 'color', $value: v.hex, $description: v.oklch }
}
for (const [mode, r] of Object.entries(themes)) {
  dtcg[mode] = {}
  for (const [role, hex] of Object.entries(r)) dtcg[mode][role] = { $type: 'color', $value: hex }
}
writeFileSync(join(outDir, 'tokens.json'), JSON.stringify(dtcg, null, 2))

const cssVars = (r) => Object.entries(r).map(([k, v]) => `  --color-${k}: ${v};`).join('\n')
const rampVars = Object.entries(ramps).flatMap(([n, st]) => Object.entries(st).map(([s, v]) => `  --${n}-${s}: ${v.hex};`)).join('\n')
writeFileSync(
  join(outDir, 'tokens.css'),
  `/* Generated by brand-identity/scripts/palette.mjs. Edit brand.json, not this file. */
:root {
${rampVars}
}
:root, [data-theme="light"] {
  color-scheme: light;
${cssVars(themes.light)}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${cssVars(themes.dark).replace(/^/gm, '  ')}
  }
}
[data-theme="dark"] {
  color-scheme: dark;
${cssVars(themes.dark)}
}
`,
)

const tw = { theme: { extend: { colors: {} } } }
for (const [n, st] of Object.entries(ramps)) tw.theme.extend.colors[n] = Object.fromEntries(Object.entries(st).map(([s, v]) => [s, v.hex]))
for (const role of Object.keys(themes.light)) tw.theme.extend.colors[role] = `var(--color-${role})`
writeFileSync(join(outDir, 'tailwind.preset.cjs'), `// Generated by palette.mjs. Use as a Tailwind preset; semantic names follow the active theme.\nmodule.exports = ${JSON.stringify(tw, null, 2)}\n`)
writeFileSync(join(outDir, 'contrast.json'), JSON.stringify({ anchors, checks }, null, 2))

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const swatchRows = Object.entries(ramps)
  .map(([n, st]) => `<tr><th scope="row">${esc(n)}${anchors[n] ? `<br><small>seed ${esc(anchors[n].seed)} at ${anchors[n].step}</small>` : ''}</th>${Object.entries(st).map(([s, v]) => `<td style="background:${v.hex};color:${onColor(v.hex)}" title="${v.oklch}"><span>${s}</span><code>${v.hex}</code></td>`).join('')}</tr>`)
  .join('\n')
const themeDemo = (mode) => {
  const r = themes[mode]
  return `<section style="background:${r.bg};color:${r.text};border:1px solid ${r.border}" class="demo"><h3>${mode}</h3>
  <div style="background:${r.surface};border:1px solid ${r.border}" class="card"><p>Body text on a surface.</p><p style="color:${r['text-muted']}">Muted secondary text.</p>
  <p><a style="color:${r['primary-text']}" href="#">A link in primary text</a></p>
  <button style="background:${r.primary};color:${r['on-primary']}">Primary action</button>
  <button style="background:transparent;color:${r.text};border:1px solid ${r['border-strong']}">Secondary</button></div>
  ${Object.keys(status).map((s) => `<p style="background:${r[`${s}-subtle`]};color:${r[`${s}-text`]};border:1px solid ${r[`${s}-border`]}" class="banner"><strong>${s}</strong> message text</p>`).join('')}
  </section>`
}
const checkRows = checks.map((c) => `<tr class="${c.pass ? 'ok' : c.advisory ? 'soft' : 'bad'}"><td>${c.theme}</td><td>${c.fg} on ${c.bg}</td><td>${c.ratio}:1</td><td>${c.min}:1</td><td>${c.pass ? 'pass' : c.advisory ? 'advisory' : 'FAIL'}</td><td>${esc(c.why)}</td></tr>`).join('\n')
writeFileSync(
  join(outDir, 'palette.html'),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(brand.name ?? 'Brand')} palette</title>
<style>body{font:15px/1.5 system-ui,sans-serif;margin:24px;background:#fff;color:#111}table{border-collapse:collapse;width:100%}
.ramps td{width:8%;height:64px;vertical-align:bottom;padding:6px;font-size:11px}.ramps td span{display:block;font-weight:600}.ramps th{text-align:left;padding-right:12px;font-weight:600}
.demos{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}.demo{padding:16px;border-radius:12px}.card{padding:16px;border-radius:8px;margin-bottom:12px}
button{font:inherit;padding:8px 14px;border-radius:6px;border:0;margin-right:8px}.banner{padding:8px 12px;border-radius:6px;margin:6px 0}
.checks td{border-bottom:1px solid #ddd;padding:4px 8px}.bad{background:#fde8e8}.soft{background:#fff7e0}@media(max-width:700px){.demos{grid-template-columns:1fr}.ramps{display:block;overflow-x:auto}}</style></head>
<body><h1>${esc(brand.name ?? 'Brand')} color system</h1><p>${failed.length ? `<strong>${failed.length} required contrast pair(s) fail.</strong>` : 'All required contrast pairs pass WCAG 2.2 AA.'} ${softFailed.length ? `${softFailed.length} advisory pair(s) below target.` : ''}</p>
<h2>Ramps</h2><table class="ramps"><tbody>${swatchRows}</tbody></table>
<h2>Themes</h2><div class="demos">${themeDemo('light')}${themeDemo('dark')}</div>
<h2>Contrast</h2><table class="checks"><thead><tr><th>Theme</th><th>Pair</th><th>Ratio</th><th>Needs</th><th>Result</th><th>Used for</th></tr></thead><tbody>${checkRows}</tbody></table></body></html>`,
)

console.log(`Palette for ${brand.name ?? 'brand'}: ${Object.keys(ramps).length} ramps, ${checks.length} contrast pairs checked.`)
for (const [n, a] of Object.entries(anchors)) console.log(`  ${n}: seed ${a.seed} kept exactly at step ${a.step}`)
for (const c of [...failed, ...softFailed]) console.log(`  ${c.advisory ? 'note' : 'FAIL'} ${c.theme}: ${c.fg} on ${c.bg} = ${c.ratio}:1 (needs ${c.min}:1, ${c.why})`)
console.log(`Wrote ${outDir}/tokens.json, tokens.css, tailwind.preset.cjs, palette.html, contrast.json`)
process.exit(failed.length ? 1 : 0)
