#!/usr/bin/env node
// Rendered interface audit. Checks a real page, in a real browser, for both of its audiences:
// the person looking at it and the agent operating it through the accessibility tree.
//
//   node audit.mjs <dist-dir|url> [--out <dir>] [--stability-ms 7000] [--canary <text>] [--no-screens] [--quiet]
//
// A dist directory is served on a throwaway local port. Output: <out>/audit.json, <out>/screens/*.png,
// and a compact summary on stdout. Exit code 0 when every required check passes, 1 when one fails, 2 on crash.
// Dependencies (playwright-core, axe-core) resolve from this folder, the current project, or a cache folder
// that the script installs into on first use. It drives the installed Chrome, and falls back to Playwright's Chromium.

import { execFileSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'
import { gzipSync } from 'node:zlib'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

function loadDeps() {
  const roots = [join(here, 'x.js'), join(process.cwd(), 'x.js')]
  const cache = join(homedir(), '.cache', 'interface-guidelines-audit')
  roots.push(join(cache, 'x.js'))
  for (const root of roots) {
    try {
      const req = createRequire(root)
      return { axePath: req.resolve('axe-core/axe.min.js'), pwPath: req.resolve('playwright-core') }
    } catch {}
  }
  mkdirSync(cache, { recursive: true })
  if (!existsSync(join(cache, 'package.json'))) writeFileSync(join(cache, 'package.json'), '{"private":true}')
  process.stderr.write(`Installing playwright-core and axe-core into ${cache}\n`)
  execFileSync('npm', ['install', '--no-audit', '--no-fund', '--prefix', cache, 'playwright-core@1.56.1', 'axe-core@4.10.3'], { stdio: 'ignore' })
  const req = createRequire(join(cache, 'x.js'))
  return { axePath: req.resolve('axe-core/axe.min.js'), pwPath: req.resolve('playwright-core') }
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ico': 'image/x-icon', '.map': 'application/json', '.txt': 'text/plain' }

function serve(dir) {
  return new Promise((done) => {
    const server = createServer((req, res) => {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
      let file = normalize(join(dir, path))
      if (file !== dir && !file.startsWith(dir + sep)) {
        res.writeHead(403).end()
        return
      }
      if (!existsSync(file) || statSync(file).isDirectory()) file = join(dir, 'index.html')
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
      createReadStream(file).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => done({ server, url: `http://127.0.0.1:${server.address().port}/` }))
  })
}

// Runs in the page before any app code, so tool registration and layout shifts are captured from the start.
function initScript() {
  window.__audit = { tools: [], cls: 0 }
  const record = (tool) => {
    window.__audit.tools.push({ name: tool?.name, description: tool?.description, hasSchema: Boolean(tool?.inputSchema), annotations: tool?.annotations ?? null })
  }
  const stub = {
    provideContext: (ctx) => (ctx?.tools ?? []).forEach(record),
    registerTool: (tool) => {
      record(tool)
      return { unregister() {} }
    },
    unregisterTool() {},
    clearContext() {},
  }
  for (const host of [document, navigator]) {
    try {
      Object.defineProperty(host, 'modelContext', { configurable: true, value: stub })
    } catch {}
  }
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__audit.cls += entry.value
    }).observe({ type: 'layout-shift', buffered: true })
  } catch {}
}

// Runs in the page. Everything measured from the DOM.
function domProbe() {
  const INTERACTIVE = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab],[role=menuitem],[role=checkbox],[role=switch],[role=radio],[role=combobox],[role=slider],[role=spinbutton],[contenteditable=true],[tabindex]:not([tabindex="-1"])'
  const NATIVE = new Set(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY', 'LABEL', 'OPTION', 'DETAILS'])
  const ACTIVE_ROLES = new Set(['button', 'link', 'tab', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'checkbox', 'switch', 'radio', 'combobox', 'slider', 'spinbutton', 'option', 'treeitem', 'row', 'gridcell', 'textbox', 'searchbox'])
  const vis = (el) => {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return false
    const s = getComputedStyle(el)
    return s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) !== 0
  }
  const label = (el) => {
    const t = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ')
    const c = typeof el.className === 'string' ? el.className.split(/\s+/)[0] : ''
    return `${el.tagName.toLowerCase()}${c ? '.' + c : ''}${t ? ` "${t.slice(0, 40)}"` : ''}`
  }

  const vw = window.innerWidth
  const overflowBy = document.documentElement.scrollWidth - vw
  const offenders = []
  if (overflowBy > 1) {
    for (const el of document.querySelectorAll('body *')) {
      if (offenders.length >= 5) break
      const r = el.getBoundingClientRect()
      if (r.right <= vw + 1 || r.width === 0) continue
      let clipped = false
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX
        if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') {
          clipped = true
          break
        }
      }
      if (!clipped) offenders.push(`${label(el)} right=${Math.round(r.right)}`)
    }
  }

  const controls = [...document.querySelectorAll(INTERACTIVE)].filter(vis)
  const small24 = []
  let below44 = 0
  for (const el of controls) {
    const r = el.getBoundingClientRect()
    let w = r.width
    let h = r.height
    const parentLabel = el.closest('label')
    if (parentLabel) {
      const lr = parentLabel.getBoundingClientRect()
      w = Math.max(w, lr.width)
      h = Math.max(h, lr.height)
    }
    if (el.id) {
      const forLabel = document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
      if (forLabel) {
        const lr = forLabel.getBoundingClientRect()
        w = Math.max(w, lr.width)
        h = Math.max(h, lr.height)
      }
    }
    // WCAG 2.5.8 exempts links inline with text.
    const inlineLink = el.tagName === 'A' && getComputedStyle(el).display === 'inline'
    if (inlineLink) continue
    if (w < 24 || h < 24) small24.push(`${label(el)} ${Math.round(w)}x${Math.round(h)}`)
    if (w < 44 || h < 44) below44++
  }

  const nonSemantic = []
  for (const el of document.querySelectorAll('body *')) {
    if (NATIVE.has(el.tagName) || !vis(el)) continue
    const role = el.getAttribute('role')
    if (role && ACTIVE_ROLES.has(role)) continue
    if (role === 'presentation' || role === 'none' || role === 'dialog') continue
    if (el.getAttribute('aria-hidden') === 'true') continue
    const key = Object.keys(el).find((k) => k.startsWith('__reactProps$'))
    const props = key ? el[key] : null
    const reactClick = props && typeof props.onClick === 'function'
    if (!reactClick) continue
    // A full-viewport click catcher behind a dialog is a backdrop, not a control.
    const r = el.getBoundingClientRect()
    if (r.width >= vw * 0.95 && r.height >= window.innerHeight * 0.95 && getComputedStyle(el).position === 'fixed') continue
    // Handlers that only stop propagation on dialog panels look like clicks but do nothing an agent needs.
    if (/stopPropagation/.test(String(props.onClick)) && String(props.onClick).length < 80) continue
    nonSemantic.push(label(el))
  }

  // WCAG 2.5.3: the accessible name contains the visible text. A mismatch is also an injection channel.
  const labelMismatch = []
  for (const el of controls) {
    const al = el.getAttribute('aria-label')
    const text = el.innerText?.trim().replace(/\s+/g, ' ').toLowerCase()
    if (al && text && !al.toLowerCase().includes(text)) labelMismatch.push(`${label(el)} named "${al.slice(0, 40)}"`)
  }

  // Hidden native inputs vanish from the tree. Measured as very damaging to agents.
  const hiddenInputs = [...document.querySelectorAll('input[type=radio],input[type=checkbox]')].filter((el) => {
    const st = getComputedStyle(el)
    return st.display === 'none' || st.visibility === 'hidden'
  }).length

  // Status carried only by a colored shape.
  const colorOnly = []
  for (const el of document.querySelectorAll('[class*=status],[class*=state],[class*=pill],[class*=badge],[class*=dot],[class*=severity],[class*=health]')) {
    if (vis(el) && !el.children.length && !el.textContent.trim() && !el.getAttribute('aria-label') && !el.getAttribute('title') && el.getAttribute('aria-hidden') !== 'true') colorOnly.push(label(el))
  }

  // Text cut in JavaScript loses the value for tree readers. CSS ellipsis keeps it.
  const slicedText = []
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length || !vis(el)) continue
    if (/(…|\.\.\.)$/.test(el.textContent.trim()) && el.textContent.trim().length > 4) slicedText.push(el.textContent.trim().slice(-30))
  }

  // Actions revealed only on hover, read from the stylesheets.
  let hoverOnlyHard = 0
  let hoverOnlySoft = 0
  for (const sheet of document.styleSheets) {
    let rules = []
    try {
      rules = [...sheet.cssRules]
    } catch {}
    for (const rule of rules) {
      if (!rule.selectorText?.includes(':hover')) continue
      const changes = ['display', 'visibility', 'opacity'].filter((p) => rule.style?.[p])
      if (!changes.length) continue
      const base = rule.selectorText.replace(/:hover/g, '')
      let focusPartner = false
      for (const other of rules) if (other.selectorText?.includes(':focus') && other.selectorText.replace(/:focus(-within|-visible)?/g, '') === base) focusPartner = true
      let targets = []
      try {
        targets = [...document.querySelectorAll(base)]
      } catch {}
      for (const t of targets) {
        const st = getComputedStyle(t)
        const hasControl = t.matches('a,button,input,select,[role=button]') || t.querySelector('a,button,input,select,[role=button]')
        if (!hasControl) continue
        if (st.display === 'none' || st.visibility === 'hidden') hoverOnlyHard++
        else if (Number(st.opacity) === 0 && !focusPartner) hoverOnlySoft++
      }
    }
  }

  const charts = []
  const shapes = 'path,rect,circle,line,polyline,polygon'
  for (const svg of document.querySelectorAll('svg')) {
    if (!vis(svg) || svg.parentElement?.closest('svg')) continue
    if (svg.querySelectorAll(shapes).length < 6) continue
    const r = svg.getBoundingClientRect()
    if (r.width < 48 && r.height < 48) continue // an icon, not a chart
    charts.push(svg)
  }
  const canvases = [...document.querySelectorAll('canvas')].filter(vis)
  let chartsExposed = 0
  const hidden = []
  for (const el of [...charts, ...canvases]) {
    const name = (el.getAttribute('aria-label') || el.querySelector?.('title')?.textContent || '').trim()
    const labelled = el.getAttribute('aria-labelledby')
    const figure = el.closest('figure')
    const caption = figure?.querySelector('figcaption')?.textContent?.trim()
    let describedTable = figure?.querySelector('table') ?? null
    // A data table counts when it sits right beside the chart, in an ancestor holding no other chart.
    for (let p = el.parentElement, depth = 0; p && !describedTable && depth < 3 && p !== document.body; p = p.parentElement, depth++) {
      if (p.querySelectorAll('svg,canvas').length > 1) break
      describedTable = p.querySelector('table')
    }
    const fallback = el.tagName === 'CANVAS' && el.textContent.trim().length > 10
    if (name.length >= 12 || labelled || (caption && caption.length >= 12) || describedTable || fallback) chartsExposed++
    else hidden.push(label(el))
  }

  const numeric = /^[\s$€£¥+\-−]*[\d][\d,.\s]*(%|ms|s|k|K|m|M|b|B|h|d)?\s*$/
  let numericCells = 0
  let numericAligned = 0
  let numericTabular = 0
  for (const td of document.querySelectorAll('td')) {
    const t = td.textContent.trim()
    if (!t || !numeric.test(t) || !vis(td)) continue
    numericCells++
    const s = getComputedStyle(td)
    const inner = td.firstElementChild ? getComputedStyle(td.firstElementChild) : s
    if (s.textAlign === 'right' || s.textAlign === 'end' || inner.justifyContent === 'flex-end' || inner.textAlign === 'right' || inner.textAlign === 'end') numericAligned++
    const font = (s.fontFamily + ' ' + inner.fontFamily).toLowerCase()
    if (`${s.fontVariantNumeric} ${inner.fontVariantNumeric}`.includes('tabular-nums') || /mono|menlo|consolas|courier/.test(font)) numericTabular++
  }

  const sizes = {}
  const families = {}
  let tiny11 = 0
  let tiny12 = 0
  const tinySamples = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let textChars = ''
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.textContent.trim()
    if (!t || !n.parentElement || !vis(n.parentElement) || n.parentElement.closest('svg,script,style,noscript')) continue
    const s = getComputedStyle(n.parentElement)
    const px = parseFloat(s.fontSize)
    sizes[px] = (sizes[px] ?? 0) + 1
    const family = s.fontFamily.split(',')[0].replace(/["']/g, '').trim()
    families[family] = (families[family] ?? 0) + 1
    if (px < 11) {
      tiny11++
      if (tinySamples.length < 5) tinySamples.push(`${px}px "${t.slice(0, 30)}"`)
    }
    if (px < 12) tiny12++
    textChars += t + ' '
  }

  let gradients = 0
  let shadows = 0
  let blurs = 0
  const radii = {}
  const chroma = {}
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el)
    if (s.backgroundImage.includes('gradient')) gradients++
    if (s.boxShadow !== 'none') shadows++
    if (s.backdropFilter && s.backdropFilter !== 'none') blurs++
    if (s.borderTopLeftRadius !== '0px') radii[s.borderTopLeftRadius] = (radii[s.borderTopLeftRadius] ?? 0) + 1
    for (const c of [s.color, s.backgroundColor, s.borderTopColor]) {
      const m = c.match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)/)
      if (!m) continue
      const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])]
      if (Math.max(r, g, b) - Math.min(r, g, b) > 24) {
        const hue = Math.round(rgbHue(r, g, b) / 30) * 30
        chroma[hue] = (chroma[hue] ?? 0) + 1
      }
    }
  }
  function rgbHue(r, g, b) {
    const max = Math.max(r, g, b)
    const d = max - Math.min(r, g, b)
    if (d === 0) return 0
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    return (h * 60 + 360) % 360
  }

  const body = getComputedStyle(document.body)
  const root = getComputedStyle(document.documentElement)
  return {
    overflowBy,
    overflowOffenders: offenders,
    controlCount: controls.length,
    small24: small24.slice(0, 12),
    small24Count: small24.length,
    below44,
    nonSemantic: nonSemantic.slice(0, 12),
    nonSemanticCount: nonSemantic.length,
    chartCount: charts.length + canvases.length,
    canvasCount: canvases.length,
    chartsExposed,
    chartsHidden: hidden.slice(0, 8),
    labelMismatch: labelMismatch.slice(0, 8),
    labelMismatchCount: labelMismatch.length,
    hiddenInputs,
    colorOnly: colorOnly.slice(0, 8),
    colorOnlyCount: colorOnly.length,
    slicedText: slicedText.slice(0, 5),
    slicedTextCount: slicedText.length,
    hoverOnlyHard,
    hoverOnlySoft,
    numericCells,
    numericAligned,
    numericTabular,
    tableCount: document.querySelectorAll('table').length,
    thCount: document.querySelectorAll('th').length,
    captionCount: document.querySelectorAll('caption').length,
    timeWithDatetime: document.querySelectorAll('time[datetime]').length,
    liveRegions: document.querySelectorAll('[aria-live],[role=status],[role=alert],[role=log]').length,
    tiny11,
    tiny12,
    tinySamples,
    fontSizes: sizes,
    fontFamilies: families,
    gradients,
    shadows,
    backdropBlurs: blurs,
    radii,
    chromaHues: chroma,
    emDashes: (textChars.match(/[—–]/g) ?? []).length,
    emoji: (textChars.match(/\p{Extended_Pictographic}/gu) ?? []).length,
    placeholderText: /lorem ipsum|todo:|placeholder text/i.test(textChars),
    title: document.title,
    lang: document.documentElement.lang,
    metaDescription: Boolean(document.querySelector('meta[name=description]')),
    background: body.backgroundColor === 'rgba(0, 0, 0, 0)' ? root.backgroundColor : body.backgroundColor,
    textColor: body.color,
    domNodes: document.querySelectorAll('*').length,
  }
}

const INTERACTIVE_ROLES = new Set(['button', 'link', 'textbox', 'searchbox', 'combobox', 'checkbox', 'radio', 'switch', 'tab', 'menuitem', 'menuitemcheckbox', 'menuitemradio', 'slider', 'spinbutton', 'listbox', 'treeitem'])
const LANDMARKS = new Set(['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form', 'region'])

async function axTree(context, page) {
  const cdp = await context.newCDPSession(page)
  await cdp.send('Accessibility.enable')
  const { nodes } = await cdp.send('Accessibility.getFullAXTree')
  await cdp.detach()
  const roles = {}
  const interactive = []
  const headings = []
  const landmarks = []
  for (const node of nodes) {
    if (node.ignored) continue
    const role = node.role?.value
    const name = (node.name?.value ?? '').trim()
    if (!role) continue
    roles[role] = (roles[role] ?? 0) + 1
    if (INTERACTIVE_ROLES.has(role)) {
      const disabled = node.properties?.some((p) => p.name === 'disabled' && p.value?.value === true) ?? false
      interactive.push({ role, name, disabled })
    }
    if (role === 'heading') {
      const level = node.properties?.find((p) => p.name === 'level')?.value?.value
      headings.push({ level, name: name.slice(0, 60) })
    }
    if (LANDMARKS.has(role)) landmarks.push(role)
  }
  const unnamed = interactive.filter((i) => !i.name)
  const counts = new Map()
  for (const i of interactive) {
    if (!i.name) continue
    const k = `${i.role}|${i.name}`
    counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  const ambiguous = [...counts.entries()].filter(([, n]) => n > 1).map(([k, n]) => `${k.replace('|', ' "')}" x${n}`)
  const ambiguousCount = [...counts.values()].filter((n) => n > 1).reduce((s, n) => s + n, 0)
  let skipped = 0
  for (let i = 1; i < headings.length; i++) if (headings[i].level - headings[i - 1].level > 1) skipped++
  return {
    nodeCount: nodes.length,
    roles,
    interactiveCount: interactive.length,
    interactiveKeys: interactive.map((i) => `${i.role}|${i.name}`),
    unnamed: unnamed.slice(0, 10).map((u) => u.role),
    unnamedCount: unnamed.length,
    ambiguous: ambiguous.slice(0, 10),
    ambiguousCount,
    headings: headings.slice(0, 40),
    h1Count: headings.filter((h) => h.level === 1).length,
    skippedHeadingLevels: skipped,
    landmarks,
  }
}

async function runAxe(page, axeSource) {
  await page.addScriptTag({ content: axeSource })
  const result = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'], resultTypes: ['violations'] })
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target?.join(' ') ?? '', summary: (v.nodes[0]?.failureSummary ?? '').split('\n')[1]?.trim() ?? '' }))
  })
  return result
}

async function keyboardWalk(page, limit = 70) {
  await page.evaluate(() => {
    document.activeElement?.blur?.()
    window.scrollTo(0, 0)
  })
  const seen = new Map()
  let noRing = 0
  const noRingSamples = []
  let stuck = 0
  let last = null
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press('Tab')
    const info = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el === document.body) return null
      if (!el.dataset.auditKb) el.dataset.auditKb = String(Math.random()).slice(2)
      const read = () => {
        const s = getComputedStyle(el)
        return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderTopColor, s.backgroundColor, s.textDecorationLine].join('|')
      }
      const focused = read()
      const s = getComputedStyle(el)
      const hasOutline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
      const r = el.getBoundingClientRect()
      const offscreen = r.bottom < 0 || r.top > window.innerHeight
      return { key: el.dataset.auditKb, focused, hasOutline, boxShadow: s.boxShadow !== 'none', offscreen, tag: el.tagName, text: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40) }
    })
    if (!info) {
      if (seen.size > 0) break // tabbed out of the document: the whole order has been walked
      continue
    }
    if (info.key === last) {
      stuck++
      if (stuck >= 3) break
    } else stuck = 0
    if (seen.has(info.key)) break
    last = info.key
    const ring = info.hasOutline || info.boxShadow
    let changed = ring
    if (!ring) {
      changed = await page.evaluate((focused) => {
        const el = document.activeElement
        const read = () => {
          const s = getComputedStyle(el)
          return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderTopColor, s.backgroundColor, s.textDecorationLine].join('|')
        }
        el.blur()
        const blurred = read()
        el.focus()
        return blurred !== focused
      }, info.focused)
    }
    if (!changed) {
      noRing++
      if (noRingSamples.length < 8) noRingSamples.push(`${info.tag} "${info.text}"`)
    }
    seen.set(info.key, info)
  }
  const expected = await page.evaluate(() => {
    const sel = 'a[href],button:not([disabled]),input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])'
    const groups = new Set()
    let total = 0
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0 || getComputedStyle(el).visibility === 'hidden') continue
      if (el.tagName === 'INPUT' && el.type === 'radio' && el.name) {
        if (groups.has(el.name)) continue
        groups.add(el.name)
      }
      total++
    }
    return total
  })
  return { reached: seen.size, expected, limitHit: seen.size >= limit, noRing, noRingSamples, trapped: stuck >= 3 }
}

async function stability(page, ms) {
  await page.evaluate(() => {
    const sel = 'a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[role=link],[role=tab],[role=checkbox],[role=switch]'
    window.__auditNodes = [...document.querySelectorAll(sel)]
    window.__audit.cls = 0
    const buckets = new Map()
    window.__audit.maxRate = 0
    window.__auditMo = new MutationObserver((list) => {
      const sec = Math.floor(performance.now() / 1000)
      for (const m of list) {
        const node = m.type === 'characterData' ? m.target.parentElement : m.target
        if (!node || node.closest?.('svg,style,script')) continue
        const key = node
        const entry = buckets.get(key) ?? { sec, n: 0 }
        if (entry.sec !== sec) {
          entry.sec = sec
          entry.n = 0
        }
        entry.n++
        buckets.set(key, entry)
        if (entry.n > window.__audit.maxRate) window.__audit.maxRate = entry.n
      }
    })
    window.__auditMo.observe(document.body, { subtree: true, characterData: true, childList: true })
  })
  await page.waitForTimeout(ms)
  return page.evaluate(() => {
    const nodes = window.__auditNodes
    const kept = nodes.filter((n) => n.isConnected).length
    window.__auditMo.disconnect()
    return { cls: Number(window.__audit.cls.toFixed(4)), nodesAtStart: nodes.length, nodesKept: kept, maxUpdatesPerSecond: window.__audit.maxRate }
  })
}

const ANIMATIONS = () =>
  document.getAnimations().filter((a) => {
    if (a.playState !== 'running') return false
    const t = a.effect?.getComputedTiming?.()
    if (!t) return false
    return t.iterations === Infinity || t.duration > 150
  }).length

async function run(target, opts) {
  const { axePath, pwPath } = loadDeps()
  const { chromium } = await import(pathToFileURL(pwPath).href).then((m) => m.default ?? m)
  const axeSource = readFileSync(axePath, 'utf8')
  mkdirSync(join(opts.out, 'screens'), { recursive: true })

  let served = null
  let url = target
  let bundle = null
  if (!/^https?:/.test(target)) {
    const dir = resolve(target)
    if (!existsSync(join(dir, 'index.html'))) throw new Error(`No index.html in ${dir}. Build first.`)
    served = await serve(dir)
    url = served.url
    bundle = bundleSize(dir)
  }

  let browser
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true })
  } catch {
    browser = await chromium.launch({ headless: true })
  }

  const scenarios = [
    { id: 'desktop-light', width: 1440, height: 900, scheme: 'light', full: true },
    { id: 'desktop-dark', width: 1440, height: 900, scheme: 'dark', full: false },
    { id: 'tablet-light', width: 768, height: 1024, scheme: 'light', full: false },
    { id: 'phone-light', width: 375, height: 812, scheme: 'light', full: false, touch: true },
    { id: 'phone-dark', width: 375, height: 812, scheme: 'dark', full: false, touch: true },
  ]

  const report = { target, at: new Date().toISOString(), bundle, canariesChecked: (opts.canaries ?? []).length > 0, scenarios: {} }
  for (const sc of scenarios) {
    const context = await browser.newContext({ viewport: { width: sc.width, height: sc.height }, colorScheme: sc.scheme, reducedMotion: 'no-preference', hasTouch: Boolean(sc.touch), deviceScaleFactor: 1 })
    await context.addInitScript(initScript)
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`.slice(0, 240)))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`console: ${m.text()}`.slice(0, 240))
    })
    page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`.slice(0, 240)))
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => errors.push(`goto: ${e.message}`.slice(0, 240)))
    await page.waitForTimeout(800)
    const dom = await page.evaluate(domProbe)
    const ax = await axTree(context, page)
    const out = { errors, dom, ax, axe: await runAxe(page, axeSource) }
    const snap = await page.locator('body').ariaSnapshot().catch(() => '')
    out.snapshotTokens = Math.round(snap.length / 4)
    out.canaryInNames = (opts.canaries ?? []).filter((c) => ax.interactiveKeys.concat(ax.headings.map((h) => h.name)).some((n) => n.toLowerCase().includes(c.toLowerCase())))
    if (!opts.noScreens) {
      await page.screenshot({ path: join(opts.out, 'screens', `${sc.id}.png`), fullPage: false })
      await page.screenshot({ path: join(opts.out, 'screens', `${sc.id}-full.png`), fullPage: true })
    }
    if (sc.full) {
      out.tools = await page.evaluate(() => window.__audit.tools)
      const before = ax.interactiveKeys
      out.stability = await stability(page, opts.stabilityMs)
      const afterAx = await axTree(context, page)
      const a = new Set(before)
      const b = new Set(afterAx.interactiveKeys)
      const same = [...a].filter((k) => b.has(k)).length
      out.stability.namesStable = a.size === 0 ? 1 : Number((same / new Set([...a, ...b]).size).toFixed(3))
      out.keyboard = await keyboardWalk(page)
    }
    delete out.ax.interactiveKeys
    report.scenarios[sc.id] = out
    await context.close()
  }

  // Reduced motion: compare running animations with and without the preference.
  for (const pref of ['no-preference', 'reduce']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: pref })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {})
    await page.waitForTimeout(300)
    const early = await page.evaluate(ANIMATIONS)
    await page.waitForTimeout(1200)
    const late = await page.evaluate(ANIMATIONS)
    report[`motion_${pref === 'reduce' ? 'reduce' : 'default'}`] = { early, late }
    await context.close()
  }

  await browser.close()
  served?.server.close()
  report.checks = evaluate(report)
  report.summary = summarize(report.checks)
  writeFileSync(join(opts.out, 'audit.json'), JSON.stringify(report, null, 1))
  return report
}

function bundleSize(dir) {
  let js = 0
  let css = 0
  const walk = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (f.endsWith('.js')) js += gzipSync(readFileSync(p)).length
      else if (f.endsWith('.css')) css += gzipSync(readFileSync(p)).length
    }
  }
  walk(dir)
  return { jsGzipKb: Math.round(js / 1024), cssGzipKb: Math.round(css / 1024) }
}

function evaluate(report) {
  const sc = report.scenarios
  const all = Object.entries(sc)
  const desk = sc['desktop-light']
  const phone = sc['phone-light']
  const checks = []
  const add = (id, audience, pass, detail, required = true) => checks.push({ id, audience, pass: Boolean(pass), required, detail })

  const errs = all.flatMap(([id, s]) => s.errors.map((e) => `${id}: ${e}`))
  add('no-runtime-errors', 'both', errs.length === 0, errs.length ? errs.slice(0, 5).join('; ') : 'no console, page or network errors in any scenario')

  const serious = {}
  for (const [id, s] of all) for (const v of s.axe) if (v.impact === 'serious' || v.impact === 'critical') (serious[v.id] ??= new Set()).add(id)
  add('axe-no-serious-violations', 'both', Object.keys(serious).length === 0, Object.keys(serious).length ? Object.entries(serious).map(([k, v]) => `${k} (${[...v].join(', ')})`).join('; ') : 'no serious or critical axe-core violations, light and dark')

  const overflow = all.filter(([, s]) => s.dom.overflowBy > 1).map(([id, s]) => `${id} by ${s.dom.overflowBy}px: ${s.dom.overflowOffenders.join(', ')}`)
  add('no-horizontal-overflow', 'human', overflow.length === 0, overflow.length ? overflow.join('; ') : 'no page-level horizontal scroll at 1440, 768 or 375 px')

  const small = all.filter(([, s]) => s.dom.small24Count > 0).map(([id, s]) => `${id}: ${s.dom.small24Count}, e.g. ${s.dom.small24.slice(0, 3).join(', ')}`)
  add('targets-at-least-24px', 'human', small.length === 0, small.length ? small.join('; ') : 'all targets meet WCAG 2.5.8 (24 CSS px)')

  const touchRatio = phone.dom.controlCount ? 1 - phone.dom.below44 / phone.dom.controlCount : 1
  add('phone-targets-44px', 'human', touchRatio >= 0.9, `${Math.round(touchRatio * 100)}% of ${phone.dom.controlCount} controls at 375 px are at least 44x44 (needs 90%)`)

  const nonSem = desk.dom.nonSemanticCount
  add('clickables-are-real-controls', 'agent', nonSem === 0, nonSem ? `${nonSem} clickable elements with no control role: ${desk.dom.nonSemantic.slice(0, 5).join(', ')}` : 'every click handler sits on a native or role-bearing control')

  add('controls-have-names', 'agent', desk.ax.unnamedCount === 0, desk.ax.unnamedCount ? `${desk.ax.unnamedCount} interactive accessibility-tree nodes have no name` : `all ${desk.ax.interactiveCount} interactive nodes are named`)

  const ambRatio = desk.ax.interactiveCount ? desk.ax.ambiguousCount / desk.ax.interactiveCount : 0
  add('controls-are-distinguishable', 'agent', ambRatio <= 0.1, `${Math.round(ambRatio * 100)}% of interactive nodes share role and name with another (limit 10%)${desk.ax.ambiguous.length ? ': ' + desk.ax.ambiguous.slice(0, 4).join(', ') : ''}`)

  const hasMain = desk.ax.landmarks.includes('main')
  add('landmarks-and-headings', 'both', hasMain && desk.ax.h1Count === 1 && desk.ax.skippedHeadingLevels === 0, `main landmark: ${hasMain}; h1 count: ${desk.ax.h1Count}; skipped heading levels: ${desk.ax.skippedHeadingLevels}; landmarks: ${[...new Set(desk.ax.landmarks)].join(', ') || 'none'}`)

  const chartOk = desk.dom.chartCount === desk.dom.chartsExposed
  add('charts-have-text-alternatives', 'both', chartOk, desk.dom.chartCount === 0 ? 'no chart graphics found' : `${desk.dom.chartsExposed} of ${desk.dom.chartCount} charts expose text or data${chartOk ? '' : ': missing on ' + desk.dom.chartsHidden.slice(0, 3).join(', ')}`)

  const tablesOk = desk.dom.tableCount === 0 || desk.dom.thCount > 0
  add('tables-have-headers', 'both', tablesOk, `${desk.dom.tableCount} tables, ${desk.dom.thCount} header cells`)

  const numericOk = desk.dom.numericCells === 0 || (desk.dom.numericAligned / desk.dom.numericCells >= 0.8 && desk.dom.numericTabular / desk.dom.numericCells >= 0.8)
  add('numbers-align-in-tables', 'human', numericOk, desk.dom.numericCells === 0 ? 'no numeric table cells' : `${desk.dom.numericAligned} of ${desk.dom.numericCells} numeric cells right aligned; ${desk.dom.numericTabular} tabular`)

  const kb = desk.keyboard
  const reachOk = !kb.trapped && (kb.limitHit || kb.reached >= kb.expected * 0.9)
  add('keyboard-reaches-controls', 'both', reachOk, `Tab reached ${kb.reached} of ${kb.expected} expected controls${kb.limitHit ? ' (walk limit hit)' : ''}${kb.trapped ? '; focus trap detected' : ''}`)
  add('focus-is-visible', 'human', kb.noRing === 0, kb.noRing ? `${kb.noRing} focus stops with no visible change: ${kb.noRingSamples.slice(0, 3).join(', ')}` : 'each focus stop changes appearance')

  const m = report.motion_reduce
  add('reduced-motion-respected', 'human', m.late === 0, `running animations with reduced motion set: ${m.early} just after load, ${m.late} after settling (default: ${report.motion_default.late})`)

  const st = desk.stability
  add('layout-stays-stable', 'human', st.cls < 0.1, `cumulative layout shift ${st.cls} over the watch period (limit 0.1)`)
  const retention = st.nodesAtStart ? st.nodesKept / st.nodesAtStart : 1
  add('agent-refs-stay-valid', 'agent', st.namesStable >= 0.9 && retention >= 0.9, `${Math.round(st.namesStable * 100)}% of role+name pairs and ${Math.round(retention * 100)}% of control DOM nodes survive the watch period`)

  add('name-contains-visible-text', 'agent', desk.dom.labelMismatchCount === 0, desk.dom.labelMismatchCount ? `${desk.dom.labelMismatchCount} controls: ${desk.dom.labelMismatch.slice(0, 3).join(', ')}` : 'accessible names include visible text (WCAG 2.5.3)')
  add('native-inputs-in-tree', 'agent', desk.dom.hiddenInputs === 0, `${desk.dom.hiddenInputs} radio or checkbox inputs hidden with display or visibility`)
  add('no-color-only-status', 'both', desk.dom.colorOnlyCount === 0, desk.dom.colorOnlyCount ? `${desk.dom.colorOnlyCount} empty status shapes: ${desk.dom.colorOnly.slice(0, 3).join(', ')}` : 'no empty status shapes found')
  add('no-hover-only-actions', 'both', desk.dom.hoverOnlyHard === 0 && desk.dom.hoverOnlySoft === 0, `${desk.dom.hoverOnlyHard} removed until hover, ${desk.dom.hoverOnlySoft} transparent until hover with no focus reveal`)
  add('text-not-cut-in-script', 'agent', desk.dom.slicedTextCount === 0, desk.dom.slicedTextCount ? `${desk.dom.slicedTextCount} strings end in an ellipsis: ${desk.dom.slicedText.slice(0, 2).join(', ')}` : 'no script-truncated text found')
  add('live-values-readable', 'human', st.maxUpdatesPerSecond <= 3, `busiest element changed ${st.maxUpdatesPerSecond} times in one second during the watch period`)
  if (report.canariesChecked) add('untrusted-text-not-in-names', 'agent', desk.canaryInNames.length === 0, desk.canaryInNames.length ? `canaries found in control names or headings: ${desk.canaryInNames.join(', ')}` : 'canaries appear in no control name or heading')

  add('document-metadata', 'both', desk.dom.lang && desk.dom.title && !/^vite/i.test(desk.dom.title), `lang="${desk.dom.lang}" title="${desk.dom.title}"`)

  add('text-at-least-11px', 'human', desk.dom.tiny11 === 0 && phone.dom.tiny11 === 0, desk.dom.tiny11 + phone.dom.tiny11 === 0 ? 'no text below 11 px' : `${desk.dom.tiny11} desktop and ${phone.dom.tiny11} phone text nodes below 11 px: ${desk.dom.tinySamples.slice(0, 3).join(', ')}`)

  add('status-messages-announced', 'both', desk.dom.liveRegions > 0, `${desk.dom.liveRegions} live regions present at load`)

  // Informational: useful context that does not by itself mean good or bad.
  const dark = sc['desktop-dark']
  add('honors-color-scheme', 'human', dark.dom.background !== desk.dom.background, `background light ${desk.dom.background}, dark ${dark.dom.background}`, false)
  add('exposes-webmcp-tools', 'agent', (desk.tools ?? []).length > 0, `${(desk.tools ?? []).length} tools: ${(desk.tools ?? []).map((t) => t.name).slice(0, 12).join(', ')}`, false)
  add('machine-readable-times', 'agent', desk.dom.timeWithDatetime > 0, `${desk.dom.timeWithDatetime} time elements with a datetime`, false)
  const hues = Object.keys(desk.dom.chromaHues).length
  add('style-profile', 'human', true, `${Object.keys(desk.dom.fontSizes).length} font sizes, ${Object.keys(desk.dom.fontFamilies).length} families (${Object.keys(desk.dom.fontFamilies).slice(0, 3).join(', ')}), ${hues} hue bands, ${desk.dom.gradients} gradients, ${desk.dom.shadows} shadows, ${desk.dom.backdropBlurs} backdrop blurs, ${desk.dom.emoji} emoji, ${desk.dom.emDashes} em or en dashes, ${desk.dom.domNodes} DOM nodes`, false)
  add('snapshot-size', 'agent', desk.snapshotTokens <= 8000, `accessibility snapshot about ${desk.snapshotTokens} tokens on load (guide: 8000)`, false)
  if (report.bundle) add('bundle-size', 'both', report.bundle.jsGzipKb <= 300, `${report.bundle.jsGzipKb} KB JS and ${report.bundle.cssGzipKb} KB CSS, gzipped`, false)
  return checks
}

function summarize(checks) {
  const required = checks.filter((c) => c.required)
  const passed = required.filter((c) => c.pass).length
  const by = (aud) => {
    const list = required.filter((c) => c.audience === aud || c.audience === 'both')
    return `${list.filter((c) => c.pass).length}/${list.length}`
  }
  return { passed, total: required.length, passRate: Number((passed / required.length).toFixed(3)), human: by('human'), agent: by('agent') }
}

function parseArgs(argv) {
  const opts = { out: 'audit-output', stabilityMs: 7000, noScreens: false, quiet: false }
  let target = null
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--out') opts.out = argv[++i]
    else if (a === '--stability-ms') opts.stabilityMs = Number(argv[++i])
    else if (a === '--canary') (opts.canaries ??= []).push(argv[++i])
    else if (a === '--no-screens') opts.noScreens = true
    else if (a === '--quiet') opts.quiet = true
    else target = a
  }
  return { target, opts }
}

const { target, opts } = parseArgs(process.argv.slice(2))
if (!target) {
  console.error('Usage: node audit.mjs <dist-dir|url> [--out <dir>] [--stability-ms 7000] [--canary <text>] [--no-screens] [--quiet]')
  process.exit(2)
}
run(target, opts)
  .then((report) => {
    if (!opts.quiet) {
      for (const c of report.checks) {
        const mark = c.pass ? 'pass' : c.required ? 'FAIL' : 'info'
        console.log(`${mark.padEnd(4)} [${c.audience}] ${c.id}: ${c.detail}`)
      }
    }
    console.log(`\n${report.summary.passed}/${report.summary.total} required checks pass (human ${report.summary.human}, agent ${report.summary.agent}). Report: ${join(opts.out, 'audit.json')}`)
    process.exit(report.checks.some((c) => c.required && !c.pass) ? 1 : 0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(2)
  })
