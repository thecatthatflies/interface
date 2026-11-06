#!/usr/bin/env node
// Static mobile checks for source trees: mobile web, SwiftUI/UIKit, Jetpack Compose and Android XML,
// React Native, and Flutter. It reads files only; it renders nothing and changes nothing.
//
//   node mobile-check.mjs <src-dir> [--json] [--strict]
//
// Each finding is a heuristic with a file and line. Review it; do not treat the list as a verdict.
// Exit code: 0 when there are no errors, 1 when at least one error (or any warning with --strict), 2 on bad usage.
// No dependencies. Node 18 or later.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

const args = process.argv.slice(2)
const root = args.find((a) => !a.startsWith('--'))
const asJson = args.includes('--json')
const strict = args.includes('--strict')
if (!root) {
  console.error('usage: node mobile-check.mjs <src-dir> [--json] [--strict]')
  process.exit(2)
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'build', 'dist', 'out', 'Pods', 'DerivedData', '.gradle', '.dart_tool', '.next', 'coverage', 'vendor'])
const EXTS = new Set(['.html', '.htm', '.css', '.scss', '.less', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro', '.swift', '.kt', '.xml', '.dart'])
const MAX_BYTES = 1_000_000

function walk(dir, out) {
  let entries
  try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.') continue
    const p = join(dir, e.name)
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(p, out) }
    else if (EXTS.has(extname(e.name).toLowerCase())) {
      try { if (statSync(p).size <= MAX_BYTES) out.push(p) } catch {}
    }
  }
  return out
}

const findings = []
const add = (level, rule, file, line, message) => findings.push({ level, rule, file: relative(root, file) || file, line, message })
const lineOf = (text, index) => text.slice(0, index).split('\n').length

// Returns every match of re (must be global) with its line number.
function each(text, re, fn) {
  for (const m of text.matchAll(re)) fn(m, lineOf(text, m.index))
}

const WEB = new Set(['.html', '.htm', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro'])
const STYLE = new Set(['.css', '.scss', '.less', '.html', '.htm', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.astro'])

let sawViewportCover = null
let sawSafeAreaInset = false

function checkWeb(file, text, ext) {
  if (WEB.has(ext)) {
    each(text, /<meta[^>]*name=["']viewport["'][^>]*>/gi, (m, line) => {
      const tag = m[0]
      if (/user-scalable\s*=\s*(no|0)/i.test(tag) || /maximum-scale\s*=\s*1(\.0+)?\b/i.test(tag)) {
        add('error', 'web-zoom-disabled', file, line, 'Viewport disables zoom. Remove user-scalable=no and maximum-scale=1 (WCAG 1.4.4). Prevent focus zoom with 16px inputs instead.')
      }
      if (/viewport-fit\s*=\s*cover/i.test(tag) && !sawViewportCover) sawViewportCover = { file, line }
    })
    if ((ext === '.html' || ext === '.htm') && /<head[\s>]/i.test(text) && !/name=["']viewport["']/i.test(text)) {
      add('warn', 'web-viewport-missing', file, 1, 'HTML document has no viewport meta; phones will render it at desktop width.')
    }
    // Inputs whose name says what they hold but whose type or inputmode does not.
    each(text, /<input\b[^>]*>/gis, (m, line) => {
      const tag = m[0]
      const ident = ((tag.match(/\b(?:name|id|autoComplete|autocomplete)\s*=\s*["']([^"']+)["']/gi) || []).join(' ')).toLowerCase()
      const type = (tag.match(/\btype\s*=\s*["']([^"']+)["']/i) || [])[1]?.toLowerCase()
      const inputmode = (tag.match(/\binput[mM]ode\s*=\s*["']([^"']+)["']/i) || [])[1]?.toLowerCase()
      const autocomplete = (tag.match(/\bauto[cC]omplete\s*=\s*["']([^"']+)["']/i) || [])[1]?.toLowerCase()
      if (!ident || type === 'hidden') return
      if (/e-?mail/.test(ident) && type !== 'email') add('warn', 'web-input-type', file, line, 'Email field without type="email": no email keyboard, weaker autofill.')
      else if (/\b(phone|tel|mobile)\b|phone|telephone/.test(ident) && type !== 'tel') add('warn', 'web-input-type', file, line, 'Phone field without type="tel": no phone keypad.')
      else if (/otp|one-time|verification|2fa|passcode|sms.?code/.test(ident) && autocomplete !== 'one-time-code') add('warn', 'web-input-otp', file, line, 'Code field without autocomplete="one-time-code" (and inputmode="numeric"): no SMS code suggestion.')
      if (type === 'number' && /zip|postal|card|cc-number|cvc|cvv|otp|code|phone|account|iban/.test(ident)) add('warn', 'web-input-number', file, line, 'type="number" on an identifier: drops leading zeros and adds spinners. Use type="text" inputmode="numeric".')
      if (!type && !inputmode && /amount|price|qty|quantity/.test(ident)) add('info', 'web-input-mode', file, line, 'Numeric field without inputmode: consider inputmode="decimal" or "numeric".')
    })
  }
  if (STYLE.has(ext)) {
    if (/safe-area-inset|safeAreaInset|SafeAreaView|useSafeAreaInsets/.test(text)) sawSafeAreaInset = true
    const lines = text.split('\n')
    lines.forEach((l, i) => {
      if (/(^|[^\w.-])100vh\b/.test(l)) {
        const near = lines.slice(Math.max(0, i - 3), i + 4).join('\n')
        if (!/\b\d+(dvh|svh|lvh)\b/.test(near)) add('warn', 'web-100vh', file, i + 1, '100vh on mobile includes the area under the browser toolbar. Use 100dvh or 100svh, with 100vh as a fallback line before it.')
      }
      const fs = l.match(/font-size\s*:\s*(\d+(?:\.\d+)?)px/i)
      if (fs && Number(fs[1]) < 16 && /\b(input|textarea|select)\b/i.test(lines.slice(Math.max(0, i - 6), i + 1).join('\n'))) {
        add('warn', 'web-input-font', file, i + 1, `Input text at ${fs[1]}px makes iOS Safari zoom on focus. Use at least 16px.`)
      }
    })
  }
}

function checkSwift(file, text) {
  each(text, /\.font\(\s*\.system\(\s*size\s*:/g, (m, line) => add('warn', 'swift-fixed-font', file, line, 'Fixed-size system font ignores Dynamic Type. Use a text style (.body) or .custom(_:size:relativeTo:) / @ScaledMetric.'))
  each(text, /\.font\(\s*\.custom\([^)]*size\s*:[^)]*\)/g, (m, line) => {
    if (!/relativeTo/.test(m[0])) add('warn', 'swift-fixed-font', file, line, 'Custom font without relativeTo: does not scale with Dynamic Type.')
  })
  if (/UIFont\.(systemFont|boldSystemFont)\(ofSize/.test(text) && !/UIFontMetrics|preferredFont/.test(text)) {
    each(text, /UIFont\.(systemFont|boldSystemFont)\(ofSize/g, (m, line) => add('warn', 'uikit-fixed-font', file, line, 'Fixed UIFont size without UIFontMetrics: ignores Dynamic Type.'))
  }
  // Image-only buttons with no accessibility label nearby.
  each(text, /Button\s*(\([^)]*\))?\s*\{[^{}]*\}\s*label\s*:\s*\{\s*Image\(systemName:[^}]*\}/g, (m, line) => {
    const after = text.slice(m.index + m[0].length, m.index + m[0].length + 300)
    if (!/accessibilityLabel/.test(m[0] + after.split('\n').slice(0, 5).join('\n'))) add('warn', 'swift-icon-button-label', file, line, 'Icon-only Button without .accessibilityLabel: VoiceOver reads the symbol name or nothing useful.')
  })
  each(text, /\b(Image|Text)\([^)]*\)\s*\n?\s*\.onTapGesture/g, (m, line) => add('warn', 'swift-tap-not-button', file, line, 'onTapGesture on Image or Text is not a button for VoiceOver, Voice Control, or tests. Use Button, or add .accessibilityAddTraits(.isButton) and a label.'))
}

function checkKotlin(file, text) {
  each(text, /\b(fontSize|lineHeight)\s*=\s*[\d.]+\s*\.dp\b/g, (m, line) => add('error', 'compose-text-dp', file, line, `${m[1]} in dp does not follow the font scale. Use sp.`))
  each(text, /\bIconButton\s*\(/g, (m, line) => {
    const block = text.slice(m.index, m.index + 400)
    if (/contentDescription\s*=\s*null/.test(block.split('\n').slice(0, 6).join('\n'))) add('warn', 'compose-icon-button-label', file, line, 'IconButton whose icon has contentDescription = null: TalkBack says "Button, unlabeled". Describe the action.')
  })
  each(text, /override\s+fun\s+onBackPressed\s*\(/g, (m, line) => add('warn', 'android-back', file, line, 'onBackPressed is not called for apps targeting API 36 on Android 16. Use OnBackPressedCallback or BackHandler.'))
}

function checkAndroidXml(file, text) {
  each(text, /android:textSize\s*=\s*"[\d.]+dp"/g, (m, line) => add('error', 'android-text-dp', file, line, 'textSize in dp does not follow the font scale. Use sp.'))
  each(text, /windowOptOutEdgeToEdgeEnforcement/g, (m, line) => add('warn', 'android-edge-to-edge', file, line, 'Edge-to-edge opt-out is disabled for apps targeting API 36 on Android 16. Handle insets instead.'))
  each(text, /android:screenOrientation\s*=\s*"(portrait|landscape|sensorPortrait|userPortrait|sensorLandscape)"/g, (m, line) => add('info', 'android-orientation', file, line, 'Orientation lock is ignored on displays 600dp and wider for apps targeting API 36. Make the layout work in both.'))
  each(text, /<ImageButton\b[^>]*>/gs, (m, line) => {
    if (!/contentDescription/.test(m[0]) && !/importantForAccessibility\s*=\s*"no"/.test(m[0])) add('warn', 'android-image-button-label', file, line, 'ImageButton without contentDescription.')
  })
}

function checkReactNative(file, text) {
  if (!/from\s+['"]react-native['"]/.test(text)) return
  each(text, /allowFontScaling\s*(=\s*\{\s*false\s*\}|:\s*false|=\s*false)/g, (m, line) => add('warn', 'rn-font-scaling-off', file, line, 'allowFontScaling false ignores the person\'s text size. Use maxFontSizeMultiplier on a few tight labels instead, never on body text.'))
  each(text, /<(Pressable|TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback)\b([^>]*)>([\s\S]{0,400}?)<\/\1>/g, (m, line) => {
    const attrs = m[2], kids = m[3]
    const named = /accessibilityLabel|aria-label|aria-labelledby/.test(attrs)
    const hasText = /<Text\b/.test(kids)
    if (!named && !hasText) add('warn', 'rn-unlabeled-touchable', file, line, `${m[1]} with no Text child and no accessibilityLabel: unnamed for VoiceOver, TalkBack, and tree-reading agents.`)
    if (!/accessibilityRole|role=/.test(attrs)) add('info', 'rn-touchable-role', file, line, `${m[1]} without accessibilityRole="button" (or role): announced without a role on some platforms.`)
  })
}

function checkFlutter(file, text) {
  each(text, /TextScaler\.noScaling|textScaleFactor\s*:\s*1(\.0)?\b|TextScaler\.linear\(\s*1(\.0)?\s*\)/g, (m, line) => add('warn', 'flutter-text-scale', file, line, 'Text scaling clamped to 1: ignores the person\'s text size.'))
  each(text, /IconButton\s*\(/g, (m, line) => {
    const block = text.slice(m.index, m.index + 400).split('\n').slice(0, 8).join('\n')
    if (!/tooltip\s*:|semanticLabel\s*:|Semantics\(/.test(block)) add('warn', 'flutter-icon-button-label', file, line, 'IconButton without tooltip or semanticLabel: unnamed for TalkBack and VoiceOver.')
  })
}

const files = walk(root, [])
for (const file of files) {
  let text
  try { text = readFileSync(file, 'utf8') } catch { continue }
  const ext = extname(file).toLowerCase()
  checkWeb(file, text, ext)
  if (ext === '.swift') checkSwift(file, text)
  if (ext === '.kt') checkKotlin(file, text)
  if (ext === '.xml') checkAndroidXml(file, text)
  if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) checkReactNative(file, text)
  if (ext === '.dart') checkFlutter(file, text)
}
if (sawViewportCover && !sawSafeAreaInset) {
  add('warn', 'web-safe-area', sawViewportCover.file, sawViewportCover.line, 'viewport-fit=cover is set but no safe-area-inset is used anywhere: content will sit under the notch and home indicator.')
}

const order = { error: 0, warn: 1, info: 2 }
findings.sort((a, b) => order[a.level] - order[b.level] || a.file.localeCompare(b.file) || a.line - b.line)
const counts = { error: 0, warn: 0, info: 0 }
for (const f of findings) counts[f.level]++

if (asJson) {
  console.log(JSON.stringify({ root, files: files.length, counts, findings }, null, 2))
} else {
  for (const f of findings) console.log(`${f.level.padEnd(5)} ${f.rule.padEnd(26)} ${f.file}:${f.line}  ${f.message}`)
  console.log(`\n${files.length} files scanned: ${counts.error} errors, ${counts.warn} warnings, ${counts.info} notes.`)
  if (!findings.length) console.log('No static findings. Rendering, screen readers, and devices are outside what this script can check.')
}
process.exit(counts.error > 0 || (strict && counts.warn > 0) ? 1 : 0)
