// Shared helpers for the brand-identity scripts: dependency loading, a headless browser, and small utilities.
// Dependencies (playwright-core, opentype.js) resolve from this folder, the current project, or a cache
// folder they are installed into on first use. The browser is the installed Chrome, else Playwright's Chromium.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const PINS = { 'playwright-core': 'playwright-core@1.56.1', 'opentype.js': 'opentype.js@1.3.4' }

export async function load(name) {
  const cache = join(homedir(), '.cache', 'brand-identity-scripts')
  for (const root of [join(here, 'x.js'), join(process.cwd(), 'x.js'), join(cache, 'x.js')]) {
    try {
      return await import(pathToFileURL(createRequire(root).resolve(name)).href)
    } catch {}
  }
  mkdirSync(cache, { recursive: true })
  if (!existsSync(join(cache, 'package.json'))) writeFileSync(join(cache, 'package.json'), '{"private":true}')
  process.stderr.write(`Installing ${PINS[name]} into ${cache}\n`)
  execFileSync('npm', ['install', '--no-audit', '--no-fund', '--prefix', cache, PINS[name]], { stdio: 'ignore' })
  return await import(pathToFileURL(createRequire(join(cache, 'x.js')).resolve(name)).href)
}

export async function browser() {
  const pw = await load('playwright-core')
  const chromium = pw.chromium ?? pw.default.chromium
  try {
    return await chromium.launch({ channel: 'chrome', headless: true })
  } catch {
    return await chromium.launch({ headless: true })
  }
}

// Render an HTML string to a PNG file at an exact size.
export async function renderHtml(b, html, file, width, height, scale = 1) {
  const page = await b.newPage({ viewport: { width, height }, deviceScaleFactor: scale })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts?.ready)
  await page.screenshot({ path: file, omitBackground: html.includes('data-transparent') })
  await page.close()
}

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export function arg(args, flag, fallback) {
  const i = args.indexOf(flag)
  return i >= 0 ? args[i + 1] : fallback
}

// Fetch a Google Fonts family as TTF (the CSS API serves TTF to clients that do not announce woff2 support).
export async function googleFontTtf(family, weight = 400, italic = false) {
  const spec = `${family.replace(/ /g, '+')}:ital,wght@${italic ? 1 : 0},${weight}`
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${spec}`, { headers: { 'user-agent': 'Wget/1.21' } })).text()
  const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1]
  if (!url) throw new Error(`Google Fonts has no TTF for ${family} ${weight}${italic ? ' italic' : ''}. Check the family name and weight.`)
  return Buffer.from(await (await fetch(url)).arrayBuffer())
}
