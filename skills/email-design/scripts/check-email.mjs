#!/usr/bin/env node
// Static checker for HTML email. Finds what Gmail, Outlook and other clients are known to break,
// plus the accessibility and compliance basics that most sent email misses.
//
//   node check-email.mjs <email.html> [--text <email.txt>] [--kind marketing|transactional] [--width 640] [--json]
//
// If --text is omitted, a sibling file with the same name and a .txt extension is used when present.
// Exit code 0 when nothing fails, 1 when at least one check fails, 2 on bad usage.
// No dependencies. It reads markup with regular expressions, so it is a floor, not a renderer:
// a clean result does not mean the email renders well. Render it in real clients too.
//
// Client support facts come from Can I Email (caniemail.com, data updated 2026-09-16); each finding
// names the feature slug so you can re-check it at https://www.caniemail.com/features/<slug>/.

import { existsSync, readFileSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'

const args = process.argv.slice(2)
const opt = { kind: null, width: 640, json: false, text: null, file: null }
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a === '--json') opt.json = true
  else if (a === '--kind') opt.kind = args[++i]
  else if (a === '--width') opt.width = Number(args[++i])
  else if (a === '--text') opt.text = args[++i]
  else if (a === '--help' || a === '-h') usage(0)
  else if (!opt.file) opt.file = a
  else usage(2)
}
if (!opt.file || !existsSync(opt.file)) usage(2)
if (opt.kind && !['marketing', 'transactional'].includes(opt.kind)) usage(2)
if (!Number.isFinite(opt.width) || opt.width <= 0) usage(2)

function usage(code) {
  process.stderr.write('usage: node check-email.mjs <email.html> [--text <email.txt>] [--kind marketing|transactional] [--width 640] [--json]\n')
  process.exit(code)
}

const raw = readFileSync(opt.file, 'utf8')
const findings = []
const add = (level, id, message, where) => findings.push({ level, id, message, ...(where ? { where } : {}) })

// ---------- helpers ----------
const noComments = raw.replace(/<!--(?!\[if)[\s\S]*?-->/g, '') // keep MSO conditionals, drop ordinary comments
const html = noComments.replace(/<!--\[if[\s\S]*?<!\[endif\]-->/gi, '') // view that non-Outlook clients get
const lineOf = (index) => raw.slice(0, Math.max(0, index)).split('\n').length
const tags = (name, src = html) => {
  const out = []
  const re = new RegExp(`<${name}\\b([^>]*)>`, 'gi')
  let m
  while ((m = re.exec(src))) out.push({ attrs: m[1], index: m.index, raw: m[0] })
  return out
}
const attr = (attrs, name) => {
  const m = new RegExp(`(?:^|\\s)${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(attrs)
  return m ? (m[2] ?? m[3] ?? m[4] ?? '') : null
}
const hasAttr = (attrs, name) => new RegExp(`(?:^|\\s)${name}(\\s*=|\\s|$)`, 'i').test(attrs)
const textOf = (s) => s.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;|&#xa0;/gi, ' ').replace(/&zwnj;|&#8204;|&#x200c;|‌|͏|&#847;/gi, '').replace(/\s+/g, ' ').trim()
const styleBlocks = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => ({ css: m[1], index: m.index }))
const inlineStyles = [...html.matchAll(/\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi)].map((m) => ({ css: m[2] ?? m[3], index: m.index }))
const allCss = [...styleBlocks, ...inlineStyles]

// ---------- size: Gmail clips around 102 KB of HTML ----------
const bytes = Buffer.byteLength(raw, 'utf8')
if (bytes > 102 * 1024) add('fail', 'size-clipped', `HTML is ${(bytes / 1024).toFixed(1)} KB. Gmail clips messages over about 102 KB, hiding the rest (often including the unsubscribe link and footer).`)
else if (bytes > 90 * 1024) add('warn', 'size-near-clip', `HTML is ${(bytes / 1024).toFixed(1)} KB, close to Gmail's ~102 KB clipping point. ESP link rewriting and tracking add size after this check.`)

// ---------- document basics ----------
const htmlTag = tags('html')[0]
if (!htmlTag) add('fail', 'no-html-element', 'No <html> element. Write a full document: doctype, html with lang and dir, head with charset, viewport and title.')
else {
  if (!attr(htmlTag.attrs, 'lang')) add('fail', 'html-lang', '<html> has no lang attribute. Screen readers fall back to the reader\'s default language and mispronounce the message. (caniemail: html-lang)')
  if (!attr(htmlTag.attrs, 'dir')) add('warn', 'html-dir', '<html> has no dir attribute. Add dir="ltr" or dir="rtl"; some clients drop <html>, so repeat lang and dir on the outer wrapper too. (caniemail: html-dir)')
}
const bodyMatch = /<body\b[^>]*>/i.exec(html)
const wrapperHasLang = /<(div|table|td|center)\b[^>]*\slang\s*=/i.test(html)
if (htmlTag && attr(htmlTag.attrs, 'lang') && !wrapperHasLang) add('warn', 'wrapper-lang', 'lang is only on <html>. Gmail and others replace <html> and <body>, so put lang and dir on the outermost wrapper element as well.')
if (!/<meta\b[^>]*charset/i.test(html) && !/<meta\b[^>]*content=["'][^"']*charset=/i.test(html)) add('warn', 'charset', 'No charset meta. Declare <meta charset="utf-8"> (or the http-equiv form) so non-ASCII text survives.')
if (!/<meta\b[^>]*name=["']viewport["']/i.test(html)) add('warn', 'viewport', 'No viewport meta. Mobile clients may render the email zoomed out.')
const titleMatch = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)
if (!titleMatch || !textOf(titleMatch[1])) add('warn', 'title', 'No <title> or an empty one. Some clients and screen readers announce it, and it names the email when opened in a browser. Use the subject line.')
if (!bodyMatch) add('fail', 'no-body', 'No <body> element.')

// ---------- preheader ----------
const bodyHtml = bodyMatch ? html.slice(bodyMatch.index + bodyMatch[0].length) : html
const firstTextChunk = (() => {
  const re = /<([a-z0-9]+)\b([^>]*)>([^<]*)/gi
  let m
  while ((m = re.exec(bodyHtml))) {
    if (/^(style|script|title)$/i.test(m[1])) continue
    const t = textOf(m[3])
    if (t) return { tag: m[1], attrs: m[2], text: t }
  }
  return null
})()
const hiddenStyle = (attrs) => {
  const s = (attr(attrs, 'style') || '').toLowerCase().replace(/\s+/g, '')
  return /display:none|max-height:0|opacity:0|mso-hide:all|font-size:0|visibility:hidden/.test(s) || /preheader|preview/i.test(attr(attrs, 'class') || '')
}
if (!firstTextChunk) add('fail', 'no-text', 'The body has no text at all. An image-only email is blank with images off, unreadable to screen readers, and looks like spam.')
else if (!hiddenStyle(firstTextChunk.attrs) && !/preheader|preview/i.test(firstTextChunk.attrs)) {
  add('warn', 'preheader', `No preheader found. Inbox previews will show the first body text instead: "${firstTextChunk.text.slice(0, 60)}". Write a preview line that continues the subject, as the first element in <body>. If that first text is already the intended preview, ignore this.`)
}

// ---------- tables ----------
for (const t of tags('table')) {
  const role = (attr(t.attrs, 'role') || '').toLowerCase()
  const end = html.indexOf('</table>', t.index)
  const inner = html.slice(t.index, end === -1 ? undefined : end)
  const isData = /<th\b/i.test(inner) || /<caption\b/i.test(inner)
  if (!isData && role !== 'presentation' && role !== 'none') add('warn', 'table-role', 'Layout table without role="presentation". Screen readers announce rows and columns of every layout table. (caniemail: html-role)', `line ${lineOf(t.index)}`)
  if (isData && (role === 'presentation' || role === 'none')) add('warn', 'data-table-role', 'A table with <th> or <caption> is marked presentation. If it holds real data (an order summary), drop the role so headers are announced.', `line ${lineOf(t.index)}`)
}

// ---------- width ----------
const widthHits = []
for (const name of ['table', 'td', 'img', 'div']) {
  for (const t of tags(name)) {
    const w = attr(t.attrs, 'width')
    if (w && /^\d+$/.test(w) && Number(w) > opt.width) widthHits.push(`<${name} width="${w}"> line ${lineOf(t.index)}`)
    const s = attr(t.attrs, 'style') || ''
    for (const m of s.matchAll(/(?:^|;)\s*(?:min-|max-)?width\s*:\s*(\d+(?:\.\d+)?)px/gi)) if (Number(m[1]) > opt.width) widthHits.push(`<${name} style width ${m[1]}px> line ${lineOf(t.index)}`)
  }
}
if (widthHits.length) add('warn', 'width', `Fixed widths over ${opt.width}px: ${widthHits.slice(0, 5).join('; ')}${widthHits.length > 5 ? ` and ${widthHits.length - 5} more` : ''}. Wider content overflows reading panes and forces sideways scrolling on phones.`)

// ---------- images ----------
for (const t of tags('img')) {
  const where = `line ${lineOf(t.index)}`
  const src = attr(t.attrs, 'src') || ''
  const alt = attr(t.attrs, 'alt')
  if (alt === null) add('fail', 'img-alt', `Image without alt (${basename(src) || 'no src'}). With images blocked or a screen reader, it becomes a file name or nothing. Use alt="" only for pure decoration.`, where)
  else if (/\.(png|jpe?g|gif|webp|svg)$/i.test(alt.trim()) || /^(image|img|logo|photo|banner|picture)$/i.test(alt.trim())) add('warn', 'img-alt-weak', `Alt text "${alt}" says nothing. Describe what the image tells the reader, or repeat the text inside it.`, where)
  if (!attr(t.attrs, 'width')) add('warn', 'img-width', 'Image has no width attribute. Classic Outlook for Windows ignores CSS width on images and shows them at intrinsic size.', where)
  if (src && !/^(https:|cid:|data:|\{\{|\*\||%%|\$\{|\[)/i.test(src)) add('warn', 'img-src', `Image src "${src.slice(0, 60)}" is not an absolute https URL. Relative paths break once the email leaves your server.`, where)
  if (/^data:/i.test(src)) add('warn', 'img-data-uri', 'Image uses a data: URI. Gmail and Outlook.com do not display them, and they add to message size.', where)
  if (/\.svg(\?|$)/i.test(src)) add('warn', 'img-svg-src', 'SVG used as an image file. Gmail rasterizes it and older Outlook versions do not show it; ship a PNG. (caniemail: image-svg)', where)
  if (/\.webp(\?|$)/i.test(src)) add('warn', 'img-webp', 'WebP image. Classic Outlook for Windows and Outlook for Mac do not show it; use PNG or JPEG. (caniemail: image-webp)', where)
}
const imgCount = tags('img').length
const visibleText = textOf(bodyHtml)
if (imgCount > 0 && visibleText.length < 200) add('warn', 'image-heavy', `Only ${visibleText.length} characters of live text alongside ${imgCount} image(s). With images off the message says almost nothing; put the content in text.`)

// ---------- elements clients drop ----------
const elementRules = [
  ['svg', 'fail', 'html-svg', 'Inline <svg> is not shown in Gmail, Outlook.com, Outlook for Windows or Yahoo. Use a PNG.'],
  ['script', 'fail', null, '<script> is stripped by every major client and raises spam scores.'],
  ['form', 'warn', 'html-form', '<form> does not work in Outlook for Windows or Mac and is partial elsewhere. Link to a web page instead.'],
  ['input', 'warn', 'html-form', 'Form inputs are unreliable in email. Link to a web page instead.'],
  ['video', 'warn', 'html-video', '<video> plays almost nowhere (not Gmail, not Outlook). Use a linked poster image.'],
  ['picture', 'warn', 'html-picture', '<picture> is ignored by Gmail and most Outlook versions; only the fallback <img> shows.'],
  ['iframe', 'fail', null, '<iframe> is stripped by email clients.'],
  ['link', 'warn', 'html-link', '<link> stylesheets are dropped by Gmail, Outlook.com and Yahoo. Inline the CSS or use <style> in <head>.'],
  ['button', 'warn', 'html-button-submit', '<button> does not work as a link in Outlook. Use a styled <a> (a "bulletproof" button).'],
]
for (const [name, level, slug, msg] of elementRules) {
  const found = tags(name)
  if (name === 'link') {
    const sheets = found.filter((t) => /stylesheet/i.test(attr(t.attrs, 'rel') || ''))
    if (sheets.length) add(level, 'el-link', `${msg} (caniemail: ${slug})`, `line ${lineOf(sheets[0].index)}`)
    continue
  }
  if (found.length) add(level, `el-${name}`, `${msg}${slug ? ` (caniemail: ${slug})` : ''}`, `line ${lineOf(found[0].index)}${found.length > 1 ? ` and ${found.length - 1} more` : ''}`)
}

// ---------- <style> placement and size ----------
const headEnd = html.search(/<\/head>/i)
for (const b of styleBlocks) {
  if (headEnd !== -1 && b.index > headEnd) add('warn', 'style-in-body', '<style> inside <body> is removed by Gmail. Move it to <head>. (caniemail: html-style)', `line ${lineOf(b.index)}`)
}
const styleBytes = styleBlocks.reduce((n, b) => n + Buffer.byteLength(b.css, 'utf8'), 0)
if (styleBytes > 16 * 1024) add('warn', 'style-size', `<style> content is ${(styleBytes / 1024).toFixed(1)} KB. Gmail drops style blocks over 16 KB. (caniemail: html-style)`)
if (styleBlocks.some((b) => /@import/i.test(b.css))) add('warn', 'css-import', '@import is ignored by Gmail, Outlook.com and Yahoo. (caniemail: css-at-import)')

// ---------- CSS that major clients drop ----------
const cssRules = [
  [/display\s*:\s*(inline-)?flex/i, 'warn', 'css-display-flex', 'display:flex is not supported in Outlook for Windows (Word engine), and Gmail drops it for non-Google accounts. Lay out with tables.'],
  [/display\s*:\s*(inline-)?grid/i, 'warn', 'css-display-grid', 'display:grid is not supported in Outlook for Windows. Lay out with tables.'],
  [/(^|[;\s{])position\s*:\s*(absolute|fixed|relative|sticky)/i, 'warn', 'css-position', 'position is removed by Gmail and Outlook for Windows. Overlapping layouts collapse.'],
  [/var\(\s*--/i, 'warn', 'css-variables', 'CSS custom properties (var(--x)) are not supported in Gmail, Outlook.com, Outlook for Windows or Yahoo. Resolve brand tokens to literal values at build time.'],
  [/@font-face/i, 'info', 'css-at-font-face', '@font-face web fonts do not load in Gmail, Outlook.com or Yahoo. Make sure the fallback stack looks right on its own.'],
  [/linear-gradient|radial-gradient/i, 'warn', 'css-linear-gradient', 'CSS gradients are not supported in Outlook (any) or Yahoo. Set a solid background-color before the gradient as the fallback.'],
  [/box-shadow/i, 'info', 'css-box-shadow', 'box-shadow is dropped by Gmail web, Outlook for Windows and Yahoo. Do not rely on it to separate content.'],
  [/text-shadow/i, 'info', 'css-text-shadow', 'text-shadow is dropped by Gmail and most Outlook versions.'],
  [/(^|[;\s{])gap\s*:|column-gap|row-gap/i, 'warn', 'css-gap', 'gap is not supported in Outlook for Windows or Yahoo. Use cell padding.'],
  [/object-fit/i, 'info', 'css-object-fit', 'object-fit is unsupported in Outlook for Windows and Yahoo. Crop images to size before sending.'],
  [/(^|[;\s{])float\s*:/i, 'info', 'css-float', 'float is unsupported in Outlook for Windows. Use table cells (align attribute) for side-by-side content.'],
]
for (const [re, level, slug, msg] of cssRules) {
  const hit = allCss.find((c) => re.test(c.css))
  if (hit) add(level, slug, `${msg} (caniemail: ${slug})`, `line ${lineOf(hit.index)}`)
}
const bgHit = allCss.find((c) => /background(-image)?\s*:[^;]*url\(/i.test(c.css))
if (bgHit || /\sbackground\s*=\s*["'][^"']+["']/i.test(html)) {
  add('warn', 'css-background-image', 'Background image found. Outlook for Windows needs VML to show it, and Gmail can strip a whole style attribute or block containing url(). Put a solid background-color fallback and keep text readable without the image. (caniemail: css-background-image)', bgHit ? `line ${lineOf(bgHit.index)}` : undefined)
}
const hasMediaDark = styleBlocks.some((b) => /prefers-color-scheme\s*:\s*dark/i.test(b.css))
if (hasMediaDark) add('info', 'dark-mode-media', 'prefers-color-scheme styles apply in Apple Mail, Outlook.com and Outlook mobile, but not in Gmail or Outlook for Windows, which recolor on their own. Check the email in forced dark mode too. (caniemail: css-at-media-prefers-color-scheme)')
const hasColorSchemeMeta = /<meta\b[^>]*name=["'](color-scheme|supported-color-schemes)["']/i.test(html)
if (hasMediaDark && !hasColorSchemeMeta) add('warn', 'color-scheme-meta', 'Dark-mode media query present without <meta name="color-scheme" content="light dark">. Apple Mail needs the meta to apply your dark styles. (caniemail: html-meta-color-scheme)')
if (/<[^>]+\shidden(\s|>|=)/i.test(html)) add('warn', 'hidden-attr', 'The hidden attribute is ignored by most clients (only Apple Mail honors it). Content you meant to hide will show. (caniemail: html-hidden)')

// ---------- links ----------
const anchors = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
let unnamed = 0
const vague = []
for (const m of anchors) {
  const attrs = m[1]
  const inner = m[2]
  const href = attr(attrs, 'href')
  const where = `line ${lineOf(m.index)}`
  if (href === null || href === '' || href === '#') add('warn', 'link-href', 'Link with no destination.', where)
  else if (/^javascript:/i.test(href)) add('fail', 'link-js', 'javascript: link. Clients strip it and it looks like phishing.', where)
  else if (/^http:/i.test(href)) add('warn', 'link-http', `Insecure http link (${href.slice(0, 60)}). Use https.`, where)
  const imgAlts = [...inner.matchAll(/<img\b([^>]*)>/gi)].map((i) => attr(i[1], 'alt') || '').join(' ')
  const name = (textOf(inner) + ' ' + imgAlts + ' ' + (attr(attrs, 'aria-label') || '')).trim()
  if (!name) unnamed++
  else if (/^(click here|here|read more|learn more|more|link|this|go)$/i.test(name)) vague.push(name)
}
if (unnamed) add('fail', 'link-name', `${unnamed} link(s) with no text and no image alt. A screen reader announces only "link".`)
if (vague.length) add('warn', 'link-vague', `Link text that means nothing out of context: ${[...new Set(vague)].map((v) => `"${v}"`).join(', ')}. Name the destination ("Track order 4471").`)

// ---------- headings ----------
if (!/<h1\b/i.test(html)) add('warn', 'h1', 'No <h1>. Screen reader users jump between headings to scan; make the main message a real heading. (caniemail: html-h1-h6 is supported everywhere)')

// ---------- centred long copy ----------
const centred = [...html.matchAll(/<(p|td|div)\b([^>]*)>([^<]{240,})/gi)].filter((m) => /text-align\s*:\s*center|align=["']?center/i.test(m[2]))
if (centred.length) add('info', 'centred-copy', `${centred.length} long passage(s) centred. Left-align copy longer than two lines; ragged left edges are hard to track.`, `line ${lineOf(centred[0].index)}`)

// ---------- hidden content beyond the preheader ----------
const hiddenBlocks = [...bodyHtml.matchAll(/<([a-z0-9]+)\b([^>]*style\s*=\s*["'][^"']*(display\s*:\s*none|font-size\s*:\s*0|opacity\s*:\s*0)[^"']*["'][^>]*)>([^<]*)/gi)]
const hiddenText = hiddenBlocks.map((m) => textOf(m[4])).filter((t) => t.length > 0)
const hiddenChars = hiddenText.reduce((n, t) => n + t.length, 0)
if (hiddenChars > 250) add('warn', 'hidden-text', `About ${hiddenChars} characters of text are hidden with CSS. Beyond a short preheader and responsive swaps, hidden text is a spam signal (Gmail sender guidelines) and reads like prompt injection to AI mail assistants.`)

// ---------- marketing requirements ----------
const plainVisible = visibleText.toLowerCase()
const hasUnsub = /unsubscribe|opt[ -]?out|email preferences|manage (your )?(email|subscription)/i.test(plainVisible) || anchors.some((m) => /unsubscribe|opt-?out|preferences/i.test(attr(m[1], 'href') || ''))
if (opt.kind === 'marketing') {
  if (!hasUnsub) add('fail', 'unsubscribe', 'Marketing email with no visible unsubscribe link. Required by CAN-SPAM and by the Gmail bulk-sender rules (which also require the List-Unsubscribe and List-Unsubscribe-Post headers; set those in your sending platform).')
  if (!/\b\d{1,6}\s+\w+|p\.?\s?o\.?\s?box|postcode|zip/i.test(visibleText) && !/address/i.test(plainVisible)) add('warn', 'postal-address', 'No postal address detected. CAN-SPAM requires a valid physical postal address in commercial email. (Heuristic: confirm by eye.)')
} else if (!opt.kind) {
  add('info', 'kind', 'Pass --kind marketing or --kind transactional to check unsubscribe and address requirements.')
}

// ---------- plain-text alternative ----------
let textPath = opt.text
if (!textPath) {
  const sibling = join(dirname(opt.file), basename(opt.file, extname(opt.file)) + '.txt')
  if (existsSync(sibling)) textPath = sibling
}
if (!textPath) add('warn', 'plain-text', 'No plain-text alternative found (pass --text or place a .txt next to the HTML). Send multipart/alternative with a written text part: some readers, filters and AI mail assistants use it, and a missing or junk text part hurts deliverability.')
else if (!existsSync(textPath)) add('fail', 'plain-text', `Plain-text file ${textPath} not found.`)
else {
  const txt = readFileSync(textPath, 'utf8')
  if (txt.trim().length < 40) add('fail', 'plain-text-empty', 'Plain-text part is empty or nearly so.')
  const hrefs = anchors.map((m) => attr(m[1], 'href')).filter((h) => h && /^https?:/i.test(h) && !/\{\{|\*\||%%/.test(h))
  const missing = [...new Set(hrefs)].filter((h) => !txt.includes(h))
  if (missing.length) add('warn', 'plain-text-links', `${missing.length} link(s) in the HTML are absent from the text part, e.g. ${missing[0].slice(0, 80)}. The text part should carry the same actions.`)
  if (/<[a-z][^>]*>/i.test(txt)) add('warn', 'plain-text-markup', 'Plain-text part contains HTML tags. Write it as text.')
  if (opt.kind === 'marketing' && !/unsubscribe|opt[ -]?out|preferences/i.test(txt)) add('fail', 'plain-text-unsubscribe', 'Plain-text part has no unsubscribe instruction.')
}

// ---------- report ----------
const order = { fail: 0, warn: 1, info: 2 }
findings.sort((a, b) => order[a.level] - order[b.level])
const counts = { fail: 0, warn: 0, info: 0 }
for (const f of findings) counts[f.level]++
if (opt.json) {
  process.stdout.write(JSON.stringify({ file: opt.file, bytes, counts, findings }, null, 2) + '\n')
} else {
  process.stdout.write(`${opt.file}: ${(bytes / 1024).toFixed(1)} KB, ${counts.fail} fail, ${counts.warn} warn, ${counts.info} info\n`)
  for (const f of findings) process.stdout.write(`  ${f.level.toUpperCase().padEnd(4)} ${f.id}${f.where ? ` (${f.where})` : ''}: ${f.message}\n`)
  if (!counts.fail && !counts.warn) process.stdout.write('  No static problems found. This does not mean it renders well: check it in real clients.\n')
}
process.exit(counts.fail ? 1 : 0)
