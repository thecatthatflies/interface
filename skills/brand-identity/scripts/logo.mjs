#!/usr/bin/env node
// Logo tooling. Three commands:
//
//   node logo.mjs outline --text "Kiln" (--font <file.ttf|otf> | --google "Family:700") [--tracking 0.02] [--out wordmark.svg]
//       Turns a wordmark into SVG paths, so it renders identically everywhere without the font installed.
//       Tracking is in em. Kerning from the font is applied.
//
//   node logo.mjs check <logo.svg> [more.svg ...]
//       Lints the file for things that break logos in the wild: no viewBox, raw <text>, embedded raster,
//       scripts or external references, transforms of the whole file, strokes that vanish at small sizes,
//       too many colors to reproduce in one ink, and file size.
//
//   node logo.mjs sheet <logo.svg> [--mark mark.svg] [--colors tokens/tokens.json] [--out logo-sheet.png]
//       Renders one contact sheet: 16, 24, 32, 48, 64, 128 and 512 px, on light, dark and brand backgrounds,
//       one-color black, one-color white, and on a busy photo-like background. Look at it before calling a
//       logo done: it is the cheapest way to see what disappears at favicon size.
import { readFileSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { arg, browser, esc, googleFontTtf, load, renderHtml } from './lib.mjs'

const [cmd, ...args] = process.argv.slice(2)

async function outline() {
  const text = arg(args, '--text')
  if (!text) throw new Error('outline needs --text "Name"')
  const opentype = (await load('opentype.js')).default ?? (await load('opentype.js'))
  let buf
  if (arg(args, '--google')) {
    const [family, weight = '400'] = arg(args, '--google').split(':')
    buf = await googleFontTtf(family, +weight)
  } else if (arg(args, '--font')) buf = readFileSync(resolve(arg(args, '--font')))
  else throw new Error('outline needs --font <file> or --google "Family:weight"')
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
  const size = 100
  const tracking = +(arg(args, '--tracking', '0')) * size
  // Lay glyphs out one by one so tracking can be added; kerning comes from the font's tables.
  const glyphs = font.stringToGlyphs(text)
  let x = 0
  const parts = []
  glyphs.forEach((g, i) => {
    parts.push(g.getPath(x, 0, size).toPathData(2))
    const next = glyphs[i + 1]
    x += (g.advanceWidth / font.unitsPerEm) * size + (next ? (font.getKerningValue(g, next) / font.unitsPerEm) * size + tracking : 0)
  })
  const d = parts.join(' ')
  // Tight box from the font's outline bounds; the user adds clear space, not the file.
  const bb = font.getPath(text, 0, 0, size).getBoundingBox()
  const minX = Math.floor(bb.x1), minY = Math.floor(bb.y1)
  const width = Math.ceil(Math.max(bb.x2, x) - minX), height = Math.ceil(bb.y2 - minY)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" role="img" aria-labelledby="t"><title id="t">${esc(text)}</title><path fill="currentColor" d="${d}"/></svg>\n`
  const out = resolve(arg(args, '--out', 'wordmark.svg'))
  writeFileSync(out, svg)
  console.log(`Wrote ${out} (${font.names.fullName?.en ?? 'font'}, ${glyphs.length} glyphs, ${(svg.length / 1024).toFixed(1)} KB). The text is now paths; keep the font name in brand.json for everything else.`)
}

function lint(file) {
  const src = readFileSync(file, 'utf8')
  const issues = []
  const warn = (level, msg) => issues.push({ level, msg })
  const vb = src.match(/viewBox\s*=\s*"([^"]+)"/)
  if (!vb) warn('error', 'No viewBox: the logo cannot scale. Add viewBox="minX minY width height".')
  const [, , vw = 0, vh = 0] = vb ? vb[1].trim().split(/[\s,]+/).map(Number) : []
  if (/<text[\s>]/.test(src)) warn('error', '<text> depends on the viewer having the font. Outline it: node logo.mjs outline.')
  if (/<image[\s>]|data:image\/(png|jpe?g|webp|gif)/.test(src)) warn('error', 'Embedded raster image. A logo must be vector to stay sharp.')
  if (/<script[\s>]|on[a-z]+\s*=/.test(src)) warn('error', 'Script or event handler in the SVG. Remove it; many hosts strip or block these.')
  if (/(href|src)\s*=\s*"(https?:)?\/\//.test(src)) warn('error', 'External reference. Logos must be self-contained.')
  if (/<foreignObject/.test(src)) warn('error', 'foreignObject does not render in many tools and in email.')
  if (/<filter[\s>]/.test(src)) warn('warn', 'Filter effects (blur, shadow) do not survive one-color, embroidery, or print reproduction. Keep them out of the master logo.')
  if (/<(linear|radial)Gradient/.test(src)) warn('warn', 'Gradient in the master logo. Fine as a variant, but also provide a flat one-color version.')
  if (/<style[\s>]/.test(src) && !/prefers-color-scheme/.test(src)) warn('warn', '<style> block: some renderers ignore it. Prefer presentation attributes.')
  if (/\swidth\s*=\s*"\d/.test(src.split('>')[0]) && /\sheight\s*=\s*"\d/.test(src.split('>')[0])) warn('info', 'Fixed width and height on the root. Fine for files, but drop them when inlining so CSS controls size.')
  const colors = new Set([...src.matchAll(/(?:fill|stroke|stop-color)\s*[:=]\s*"?\s*(#[0-9a-f]{3,8}|rgb[a]?\([^)]+\)|[a-z]+)/gi)].map((m) => m[1].toLowerCase()).filter((c) => !['none', 'currentcolor', 'transparent', 'inherit'].includes(c)))
  if (/fill\s*[:=]\s*"?\s*(#fff\b|#ffffff|white)/i.test(src)) warn('warn', 'White fill used inside the logo. If it is a cutout, cut it from the shape (fill-rule="evenodd" or a combined path) so it stays a hole in one-color and on photos; a white shape turns into a solid block.')
  if (colors.size > 3) warn('warn', `${colors.size} distinct colors. Most logos need to work in one ink; check the one-color renders on the sheet.`)
  // Thin strokes: at 16 px wide, anything under about 1 px turns to mush or vanishes.
  const scale16 = vw ? 16 / Math.max(vw, vh) : 0
  const strokes = [...src.matchAll(/stroke-width\s*[:=]\s*"?([\d.]+)/g)].map((m) => +m[1])
  if (strokes.length && scale16) {
    const thinnest = Math.min(...strokes)
    if (thinnest * scale16 < 1) warn('warn', `Thinnest stroke is ${(thinnest * scale16).toFixed(2)} px at 16 px. Provide a simplified mark for favicons, or thicken it.`)
  }
  const kb = Buffer.byteLength(src) / 1024
  if (kb > 30) warn('warn', `${kb.toFixed(1)} KB. Logos are usually under 10 KB; simplify paths (svgo) or reduce nodes.`)
  const nodes = (src.match(/<(path|circle|rect|ellipse|polygon|polyline|line)[\s/>]/g) ?? []).length
  if (!/<title[\s>]/.test(src)) warn('info', 'No <title>. When inlined as an image, give it role="img" and a title with the brand name.')
  const ratio = vw && vh ? vw / vh : 1
  return { file, issues, nodes, colors: [...colors], ratio: +ratio.toFixed(2), kb: +kb.toFixed(1) }
}

function check() {
  if (!args.length) throw new Error('check needs at least one SVG file')
  let errors = 0
  for (const f of args.filter((a) => a.endsWith('.svg'))) {
    const r = lint(resolve(f))
    console.log(`${basename(f)}: ${r.nodes} shapes, ${r.colors.length} colors, aspect ${r.ratio}:1, ${r.kb} KB`)
    for (const i of r.issues) console.log(`  ${i.level.toUpperCase()} ${i.msg}`)
    if (!r.issues.length) console.log('  clean')
    errors += r.issues.filter((i) => i.level === 'error').length
  }
  process.exit(errors ? 1 : 0)
}

async function sheet() {
  const file = resolve(args.find((a) => a.endsWith('.svg')))
  const mark = arg(args, '--mark') ? readFileSync(resolve(arg(args, '--mark')), 'utf8') : null
  const logo = readFileSync(file, 'utf8')
  let brand = '#1f4fd1', ink = '#16181d', paper = '#fbfaf8'
  const tokensPath = arg(args, '--colors')
  if (tokensPath) {
    const t = JSON.parse(readFileSync(resolve(tokensPath), 'utf8'))
    brand = t.light?.primary?.$value ?? brand
    ink = t.light?.text?.$value ?? ink
    paper = t.light?.bg?.$value ?? paper
  }
  // currentColor drives one-color versions; multi-color logos are forced to one ink with a CSS override.
  const inline = (svg, color, force) => `<span class="logo${force ? ' force' : ''}" style="color:${color}">${svg.replace(/<\?xml[^>]*>/, '')}</span>`
  const small = mark ?? logo
  const sizes = [16, 24, 32, 48, 64, 128]
  const row = (label, bg, color, force, svg = logo) => `<div class="row" style="background:${bg}"><div class="lab" style="color:${color}">${label}</div><div class="big">${inline(svg, color, force)}</div><div class="sizes">${sizes.map((s) => `<div class="sz" style="width:${s}px;height:${s}px">${inline(small, color, force)}</div>`).join('')}</div></div>`
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;font:12px/1.3 system-ui,sans-serif}
  .row{display:grid;grid-template-columns:120px 1fr 420px;align-items:center;gap:24px;padding:20px 24px;height:140px;box-sizing:border-box}
  .big{height:96px;display:flex;align-items:center}.big .logo svg{height:96px;width:auto;max-width:100%}
  .sizes{display:flex;align-items:center;gap:16px}.sz svg{width:100%;height:100%}
  .logo{display:inline-flex}.logo svg{display:block}
  .force svg *{fill:currentColor!important;stroke:currentColor!important}
  </style></head><body>
  ${row('As drawn on paper', paper, ink, false)}
  ${row('As drawn on dark', '#111317', '#f4f4f2', false)}
  ${row('One color, black', '#ffffff', '#000000', true)}
  ${row('One color, reversed', '#000000', '#ffffff', true)}
  ${row('Reversed on brand', brand, '#ffffff', true)}
  ${row('On a busy photo', 'radial-gradient(circle at 20% 30%,#c9a27a 0 18%,transparent 19%),radial-gradient(circle at 70% 60%,#5d7b8f 0 22%,transparent 23%),repeating-linear-gradient(35deg,#8a6d4f 0 6px,#d8cbb6 6px 14px)', '#ffffff', true)}
  </body></html>`
  const b = await browser()
  const out = resolve(arg(args, '--out', 'logo-sheet.png'))
  await renderHtml(b, html, out, 1100, 140 * 6, 2)
  await b.close()
  console.log(`Wrote ${out}. Look at it: does the ${mark ? 'mark' : 'logo'} still read at 16 and 24 px, and does every one-color row survive?`)
}

try {
  if (cmd === 'outline') await outline()
  else if (cmd === 'check') check()
  else if (cmd === 'sheet') await sheet()
  else {
    console.log('usage: node logo.mjs outline|check|sheet ... (see the header of this file)')
    process.exit(cmd ? 1 : 0)
  }
} catch (e) {
  console.error(e.message)
  process.exit(2)
}
