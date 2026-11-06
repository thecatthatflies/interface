#!/usr/bin/env node
// Brand asset export from brand.json, the logo files and the palette tokens.
//
//   node assets.mjs <brand.json> [--out <dir>]
//
// Needs brand.json "logo.mark" (square symbol, uses currentColor) and ideally "logo.primary" (full lockup),
// plus tokens/tokens.json from palette.mjs. Writes:
//   favicon.svg            mark that follows the browser's light or dark scheme
//   favicon.ico            16, 32 and 48 px (PNG-in-ICO), for old browsers and Windows
//   apple-touch-icon.png   180 px on an opaque background (iOS fills transparency with black)
//   icon-192.png, icon-512.png, icon-maskable-512.png   PWA icons; maskable keeps the mark in the 80% safe zone
//   og-image.png           1200 x 630 social card with the lockup, tagline and brand color
//   site.webmanifest, head.html (the tags to paste into <head>)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { arg, browser, esc, renderHtml } from './lib.mjs'

const args = process.argv.slice(2)
if (!args[0]) {
  console.log('usage: node assets.mjs <brand.json> [--out <dir>]')
  process.exit(1)
}
const brandPath = resolve(args[0])
const base = dirname(brandPath)
const brand = JSON.parse(readFileSync(brandPath, 'utf8'))
const out = resolve(arg(args, '--out', join(base, 'assets')))
mkdirSync(out, { recursive: true })
const read = (p) => readFileSync(resolve(base, p), 'utf8').replace(/<\?xml[^>]*>/, '').trim()
if (!brand.logo?.mark) {
  console.error('brand.json needs logo.mark: a square SVG symbol that uses currentColor.')
  process.exit(1)
}
const mark = read(brand.logo.mark)
const lockup = brand.logo.primary ? read(brand.logo.primary) : mark
let t = {}
try {
  t = JSON.parse(readFileSync(resolve(base, brand.tokens ?? 'tokens/tokens.json'), 'utf8'))
} catch {
  console.error('No tokens found; run palette.mjs first for brand colors. Using neutral defaults.')
}
const c = (mode, role, fallback) => t[mode]?.[role]?.$value ?? fallback
const primary = c('light', 'primary', '#1f4fd1'), onPrimary = c('light', 'on-primary', '#ffffff')
const ink = c('light', 'text', '#16181d'), paper = c('light', 'bg', '#fbfaf8'), darkInk = c('dark', 'text', '#f2f2f0')
const iconBg = brand.icon?.background ?? primary, iconFg = brand.icon?.foreground ?? onPrimary

// favicon.svg: the mark, colored by a media query so it reads on light and dark browser chrome.
const inner = mark.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')
const vb = mark.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 64 64'
writeFileSync(
  join(out, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"><style>:root{color:${ink}}@media (prefers-color-scheme:dark){:root{color:${darkInk}}}</style>${inner}</svg>\n`,
)

const square = (size, bg, fg, pad) =>
  `<!doctype html><html${bg === 'transparent' ? ' data-transparent' : ''}><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${bg};color:${fg}"><div style="width:${size * (1 - 2 * pad)}px;height:${size * (1 - 2 * pad)}px">${mark.replace('<svg', '<svg width="100%" height="100%"')}</div></body></html>`

const b = await browser()
const pngs = {}
for (const s of [16, 32, 48]) {
  const f = join(out, `.ico-${s}.png`)
  await renderHtml(b, square(s, 'transparent', ink, s <= 16 ? 0 : 0.04), f, s, s)
  pngs[s] = readFileSync(f)
}
await renderHtml(b, square(180, iconBg, iconFg, 0.18), join(out, 'apple-touch-icon.png'), 180, 180)
await renderHtml(b, square(192, iconBg, iconFg, 0.16), join(out, 'icon-192.png'), 192, 192)
await renderHtml(b, square(512, iconBg, iconFg, 0.16), join(out, 'icon-512.png'), 512, 512)
// Maskable: platforms crop to a circle or squircle of the inner 80%, so the mark sits well inside it.
await renderHtml(b, square(512, iconBg, iconFg, 0.27), join(out, 'icon-maskable-512.png'), 512, 512)

const display = brand.type?.display?.family, text = brand.type?.text?.family
const fontLink = [display, text].filter(Boolean).map((f) => `family=${f.replace(/ /g, '+')}:wght@400;600;700`).join('&')
const og = `<!doctype html><html><head>${fontLink ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fontLink}&display=block">` : ''}</head>
<body style="margin:0;width:1200px;height:630px;background:${brand.og?.background ?? paper};color:${ink};font-family:${text ? `'${text}',` : ''}system-ui,sans-serif;display:grid;grid-template-rows:1fr auto;padding:80px;box-sizing:border-box;position:relative;overflow:hidden">
<div style="position:absolute;right:-120px;bottom:-160px;width:620px;height:620px;color:${primary};opacity:.14">${mark.replace('<svg', '<svg width="100%" height="100%"')}</div>
<div style="height:120px;color:${ink};display:flex;align-items:center">${lockup.replace('<svg', '<svg height="100%" style="max-width:640px"')}</div>
<div><p style="margin:0 0 20px;font-family:${display ? `'${display}',` : ''}Georgia,serif;font-size:64px;line-height:1.05;font-weight:700;max-width:900px;letter-spacing:-0.01em">${esc(brand.tagline ?? brand.name)}</p>
<p style="margin:0;font-size:26px;opacity:.7">${esc(brand.url ?? '')}</p></div>
<div style="position:absolute;left:0;top:0;width:100%;height:12px;background:${primary}"></div></body></html>`
await renderHtml(b, og, join(out, 'og-image.png'), 1200, 630)
await b.close()

// PNG-in-ICO container: 6-byte header, a 16-byte entry per image, then the PNG bytes.
const sizes = [16, 32, 48]
const header = Buffer.alloc(6 + 16 * sizes.length)
header.writeUInt16LE(0, 0), header.writeUInt16LE(1, 2), header.writeUInt16LE(sizes.length, 4)
let offset = header.length
sizes.forEach((s, i) => {
  const e = 6 + i * 16
  header.writeUInt8(s, e), header.writeUInt8(s, e + 1), header.writeUInt16LE(1, e + 4), header.writeUInt16LE(32, e + 6)
  header.writeUInt32LE(pngs[s].length, e + 8), header.writeUInt32LE(offset, e + 12)
  offset += pngs[s].length
})
writeFileSync(join(out, 'favicon.ico'), Buffer.concat([header, ...sizes.map((s) => pngs[s])]))
for (const s of sizes) writeFileSync(join(out, `.ico-${s}.png`), '')

writeFileSync(
  join(out, 'site.webmanifest'),
  JSON.stringify(
    {
      name: brand.name,
      short_name: brand.shortName ?? brand.name,
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      theme_color: primary,
      background_color: paper,
      display: 'standalone',
    },
    null,
    2,
  ),
)
writeFileSync(
  join(out, 'head.html'),
  `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${primary}">
<meta property="og:title" content="${esc(brand.name)}">
<meta property="og:description" content="${esc(brand.tagline ?? '')}">
<meta property="og:image" content="${esc((brand.url ?? '') + '/og-image.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
`,
)
const { unlinkSync } = await import('node:fs')
for (const s of sizes) unlinkSync(join(out, `.ico-${s}.png`))
console.log(`Wrote ${out}: favicon.svg, favicon.ico, apple-touch-icon.png, icon-192/512, icon-maskable-512, og-image.png, site.webmanifest, head.html`)
console.log('Look at og-image.png and the icons before shipping; the maskable icon is cropped by the platform.')
