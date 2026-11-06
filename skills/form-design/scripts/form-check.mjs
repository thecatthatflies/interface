#!/usr/bin/env node
// Rendered form check. Opens a real page and checks every form control the way a person with
// assistive technology, a browser's autofill, and an agent reading the accessibility tree will meet it.
//
//   node form-check.mjs <url|file.html|dist-dir> [--width 390] [--try-submit] [--form <css>] [--json <file>] [--quiet]
//
// Checks: a computed accessible name that does not come from placeholder or title; a visible label;
// a valid autocomplete value and a sensible one for recognizable personal-data fields; no type=number
// on identifiers; paste not blocked; native radios and checkboxes not removed from the tree; groups
// named by a legend; invalid fields tied to visible error text; a submit button that names its outcome.
// With --try-submit it submits the form empty once and checks where focus lands and how errors are
// exposed. Use --try-submit only against a local or test environment: it really submits.
//
// Exit 0 when no error-level finding, 1 when there is one, 2 on crash.
// Dependencies (playwright-core) resolve from this folder, the current project, or the cache folder
// shared with interface-guidelines/scripts/audit.mjs, installing there on first use.

import { execFileSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { homedir } from 'node:os'
import { basename, dirname, extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

function loadPlaywright() {
  const cache = join(homedir(), '.cache', 'interface-guidelines-audit')
  for (const root of [join(here, 'x.js'), join(process.cwd(), 'x.js'), join(cache, 'x.js')]) {
    try {
      return createRequire(root).resolve('playwright-core')
    } catch {}
  }
  mkdirSync(cache, { recursive: true })
  if (!existsSync(join(cache, 'package.json'))) writeFileSync(join(cache, 'package.json'), '{"private":true}')
  process.stderr.write(`Installing playwright-core into ${cache}\n`)
  execFileSync('npm', ['install', '--no-audit', '--no-fund', '--prefix', cache, 'playwright-core@1.56.1'], { stdio: 'ignore' })
  return createRequire(join(cache, 'x.js')).resolve('playwright-core')
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon' }

function serve(dir, entry) {
  return new Promise((done) => {
    const server = createServer((req, res) => {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
      let file = normalize(join(dir, path))
      if (file !== dir && !file.startsWith(dir + sep)) return res.writeHead(403).end()
      if (!existsSync(file) || statSync(file).isDirectory()) file = join(dir, entry)
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
      createReadStream(file).pipe(res)
    })
    server.listen(0, '127.0.0.1', () => done({ server, url: `http://127.0.0.1:${server.address().port}/${entry}` }))
  })
}

// Runs in the page. Tags each control and gathers everything that does not need the accessibility tree.
function probe(formSelector) {
  const AUTOFILL = new Set('name honorific-prefix given-name additional-name family-name honorific-suffix nickname organization-title username new-password current-password one-time-code organization street-address address-line1 address-line2 address-line3 address-level4 address-level3 address-level2 address-level1 country country-name postal-code cc-name cc-given-name cc-additional-name cc-family-name cc-number cc-exp cc-exp-month cc-exp-year cc-csc cc-type transaction-currency transaction-amount language bday bday-day bday-month bday-year sex url photo tel tel-country-code tel-national tel-area-code tel-local tel-local-prefix tel-local-suffix tel-extension email impp'.split(' '))
  const CONTACT = new Set('tel tel-country-code tel-national tel-area-code tel-local tel-local-prefix tel-local-suffix tel-extension email impp'.split(' '))
  const validAutocomplete = (v) => {
    const t = v.trim().toLowerCase().split(/\s+/).filter(Boolean)
    if (t.length === 0) return true
    if (t.length === 1 && (t[0] === 'on' || t[0] === 'off')) return true
    if (t[t.length - 1] === 'webauthn') t.pop()
    if (t[0]?.startsWith('section-')) t.shift()
    if (t[0] === 'shipping' || t[0] === 'billing') t.shift()
    let contactHint = false
    if (['home', 'work', 'mobile', 'fax', 'pager'].includes(t[0])) {
      t.shift()
      contactHint = true
    }
    if (t.length !== 1) return false
    if (contactHint && !CONTACT.has(t[0])) return false
    return AUTOFILL.has(t[0])
  }
  const visible = (el) => {
    if (!el) return false
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1) return false
    const s = getComputedStyle(el)
    return s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05
  }
  const text = (el) => (el?.innerText ?? el?.textContent ?? '').replace(/\s+/g, ' ').trim()
  const short = (el) => {
    const id = el.id ? `#${el.id}` : el.name ? `[name=${el.name}]` : ''
    return `${el.tagName.toLowerCase()}${el.type && el.tagName === 'INPUT' ? `[type=${el.type}]` : ''}${id}`
  }

  const scope = formSelector ? document.querySelector(formSelector) : document
  if (!scope) return { error: `No element matches ${formSelector}` }
  const controls = [...scope.querySelectorAll('input, select, textarea, [contenteditable="true"], [role=textbox], [role=combobox], [role=checkbox], [role=radio], [role=switch]')].filter((el) => {
    if (el.tagName === 'INPUT' && ['hidden', 'submit', 'button', 'reset', 'image'].includes(el.type)) return false
    return true
  })

  const fields = controls.map((el, i) => {
    el.setAttribute('data-form-check', String(i))
    const labelEls = [...(el.labels ?? [])]
    const labelledby = (el.getAttribute('aria-labelledby') || '').split(/\s+/).filter(Boolean).map((id) => document.getElementById(id)).filter(Boolean)
    const visibleLabel = [...labelEls, ...labelledby].some((l) => visible(l) && text(l).length > 0)
    const labelText = [...labelEls, ...labelledby].map(text).join(' ')
    const describedby = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean)
    const errormessage = (el.getAttribute('aria-errormessage') || '').split(/\s+/).filter(Boolean)
    const refs = [...describedby, ...errormessage]
    const missingRefs = refs.filter((id) => !document.getElementById(id))
    const refTexts = refs.map((id) => document.getElementById(id)).filter(Boolean).filter((e) => visible(e) || e.getAttribute('aria-hidden') !== 'true').map(text).filter(Boolean)
    const visibleRefTexts = refs.map((id) => document.getElementById(id)).filter((e) => e && visible(e)).map(text).filter(Boolean)

    let pasteBlocked = false
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      try {
        const ev = new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: new DataTransfer() })
        pasteBlocked = !el.dispatchEvent(ev)
      } catch {}
    }

    const cs = getComputedStyle(el)
    const type = el.tagName === 'INPUT' ? el.type : el.tagName.toLowerCase()
    const isChoice = type === 'radio' || type === 'checkbox'
    let group = null
    if (type === 'radio' || (type === 'checkbox' && el.name && scope.querySelectorAll(`input[type=checkbox][name="${CSS.escape(el.name)}"]`).length > 1)) {
      const fs = el.closest('fieldset')
      const legend = fs?.querySelector(':scope > legend')
      const rg = el.closest('[role=radiogroup],[role=group]')
      const rgName = rg && (rg.getAttribute('aria-label') || (rg.getAttribute('aria-labelledby') || '').split(/\s+/).map((id) => text(document.getElementById(id))).join(' ').trim())
      group = { name: el.name, named: Boolean((legend && text(legend)) || rgName) }
    }
    return {
      i,
      ref: short(el),
      tag: el.tagName.toLowerCase(),
      type,
      nameAttr: el.getAttribute('name') || '',
      id: el.id || '',
      placeholder: el.getAttribute('placeholder') || '',
      autocomplete: el.getAttribute('autocomplete'),
      autocompleteValid: el.hasAttribute('autocomplete') ? validAutocomplete(el.getAttribute('autocomplete')) : true,
      inputmode: el.getAttribute('inputmode') || '',
      maxlength: el.getAttribute('maxlength'),
      required: el.required || el.getAttribute('aria-required') === 'true',
      invalidAttr: el.getAttribute('aria-invalid') === 'true',
      nativeInvalid: typeof el.checkValidity === 'function' ? !el.checkValidity() : false,
      validationMessage: el.validationMessage || '',
      labelText,
      visibleLabel,
      ariaLabel: el.getAttribute('aria-label') || '',
      visible: visible(el),
      removedFromTree: isChoice && (cs.display === 'none' || cs.visibility === 'hidden'),
      choiceLabelVisible: isChoice ? labelEls.some(visible) : false,
      group,
      refs,
      missingRefs,
      refTexts,
      visibleRefTexts,
      pasteBlocked,
      fontSize: parseFloat(cs.fontSize),
      disabled: el.disabled === true,
    }
  })

  const forms = [...(formSelector ? [scope] : document.querySelectorAll('form'))].map((f, i) => {
    f.setAttribute('data-form-check-form', String(i))
    const submits = [...f.querySelectorAll('button:not([type]), button[type=submit], input[type=submit], input[type=image]')]
    const outside = f.id ? [...document.querySelectorAll(`button[form="${CSS.escape(f.id)}"], input[type=submit][form="${CSS.escape(f.id)}"]`)] : []
    const all = [...submits, ...outside]
    return {
      i,
      ref: f.id ? `form#${f.id}` : f.getAttribute('name') ? `form[name=${f.getAttribute('name')}]` : `form ${i + 1}`,
      novalidate: f.noValidate,
      submits: all.map((b) => ({ text: (b.tagName === 'INPUT' ? b.value : text(b)) || b.getAttribute('aria-label') || '', disabled: b.disabled || b.getAttribute('aria-disabled') === 'true' })),
    }
  })
  return { fields, forms, title: document.title }
}

// Runs in the page after a submit attempt.
function afterSubmit() {
  const a = document.activeElement
  const describe = (el) => (el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.getAttribute?.('role') ? `[role=${el.getAttribute('role')}]` : ''}` : 'none')
  const summary = [...document.querySelectorAll('[role=alert], .govuk-error-summary, [data-error-summary], [class*=error-summary], [class*=errorSummary]')].find((el) => el.querySelector('a[href^="#"]'))
  const summaryLinks = summary ? [...summary.querySelectorAll('a[href^="#"]')].map((l) => ({ text: l.textContent.trim(), target: l.getAttribute('href').slice(1), resolves: Boolean(document.getElementById(l.getAttribute('href').slice(1))) })) : []
  const focusInSummary = Boolean(summary && a && (a === summary || summary.contains(a)))
  const focusOnField = Boolean(a && a.matches?.('input, select, textarea') && (a.getAttribute('aria-invalid') === 'true' || (typeof a.checkValidity === 'function' && !a.checkValidity())))
  return { focused: describe(a), focusInSummary, focusOnField, hasSummary: Boolean(summary), summaryLinks, title: document.title, url: location.href }
}

const GENERIC_SUBMIT = /^(submit|ok|okay|send|go|yes|done|confirm|click here|proceed|enter|save changes\?)$/i

const PURPOSES = [
  { id: 'otp', re: /one[\s-]?time|\botp\b|verification code|auth(entication)? code|2fa|security code sent/, tokens: ['one-time-code'], identifier: true, numeric: true },
  { id: 'card number', re: /card ?number|cc-?num|cardnumber|credit ?card|debit ?card/, tokens: ['cc-number'], identifier: true, numeric: true },
  { id: 'card security code', re: /\bcvc\b|\bcvv\b|\bcsc\b|security code/, tokens: ['cc-csc'], identifier: true, numeric: true },
  { id: 'card expiry', re: /expir|exp(iry)? ?date|mm ?\/ ?yy/, tokens: ['cc-exp', 'cc-exp-month', 'cc-exp-year'] },
  { id: 'name on card', re: /name on card|card ?holder/, tokens: ['cc-name'] },
  { id: 'email', re: /e-?mail/, tokens: ['email', 'username'], type: 'email' },
  { id: 'password', re: /pass(word|code|phrase)/, tokens: ['current-password', 'new-password'], type: 'password' },
  { id: 'username', re: /user ?name|login id|user id/, tokens: ['username', 'email'] },
  { id: 'phone', re: /phone|mobile number|\btel\b|telephone/, tokens: ['tel', 'tel-national', 'tel-local', 'tel-country-code', 'tel-area-code'], type: 'tel', identifier: true },
  { id: 'postal code', re: /post ?code|\bzip\b|zip ?code|postal/, tokens: ['postal-code'], identifier: true },
  { id: 'address line 2', re: /address(-|_| )?line ?2|apartment|\bsuite\b|\bapt\b|flat number/, tokens: ['address-line2'] },
  { id: 'street address', re: /address(-|_| )?line ?1|street|\baddress\b/, tokens: ['street-address', 'address-line1'] },
  { id: 'town or city', re: /\bcity\b|\btown\b|locality|suburb/, tokens: ['address-level2'] },
  { id: 'region', re: /\bstate\b|province|county|region|prefecture/, tokens: ['address-level1'] },
  { id: 'country', re: /country/, tokens: ['country', 'country-name'] },
  { id: 'given name', re: /first[\s_-]?name|given[\s_-]?name|\bfname\b|forename/, tokens: ['given-name'] },
  { id: 'family name', re: /last[\s_-]?name|surname|family[\s_-]?name|\blname\b/, tokens: ['family-name'] },
  { id: 'organization', re: /company|organi[sz]ation|business name|employer/, tokens: ['organization'] },
  { id: 'date of birth', re: /birth|\bdob\b|bday/, tokens: ['bday', 'bday-day', 'bday-month', 'bday-year'] },
  { id: 'website', re: /website|\burl\b|homepage/, tokens: ['url'], type: 'url' },
  { id: 'full name', re: /full name|your name|^name$|\bname\b/, tokens: ['name', 'given-name', 'family-name', 'nickname'] },
]

function purposeOf(f) {
  if (!['text', 'email', 'tel', 'password', 'number', 'url', 'search', 'textarea', 'select'].includes(f.type)) return null
  const hay = [f.labelText, f.ariaLabel, f.nameAttr.replace(/[_-]/g, ' '), f.id.replace(/[_-]/g, ' '), f.placeholder].join(' | ').toLowerCase()
  if (!hay.replace(/[|\s]/g, '')) return null
  return PURPOSES.find((p) => p.re.test(hay)) ?? null
}

async function run(target, opts) {
  const { chromium } = await import(pathToFileURL(loadPlaywright()).href).then((m) => m.default ?? m)
  let served = null
  let url = target
  if (!/^https?:/.test(target)) {
    const abs = resolve(target)
    if (!existsSync(abs)) throw new Error(`Not found: ${abs}`)
    const isDir = statSync(abs).isDirectory()
    const dir = isDir ? abs : dirname(abs)
    const entry = isDir ? 'index.html' : basename(abs)
    if (!existsSync(join(dir, entry))) throw new Error(`No ${entry} in ${dir}`)
    served = await serve(dir, entry)
    url = served.url
  }
  let browser
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true })
  } catch {
    browser = await chromium.launch({ headless: true })
  }
  const findings = []
  const add = (level, check, where, detail) => findings.push({ level, check, where, detail })
  let submitReport = null
  try {
    const context = await browser.newContext({ viewport: { width: opts.width, height: 900 }, deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => page.goto(url, { waitUntil: 'load', timeout: 30000 }))
    await page.waitForTimeout(300)

    const inspect = async () => {
      const data = await page.evaluate(probe, opts.form ?? null)
      if (data.error) throw new Error(data.error)
      const cdp = await context.newCDPSession(page)
      const { root } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true })
      for (const f of data.fields) {
        const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: `[data-form-check="${f.i}"]` })
        f.axName = ''
        f.axNameFrom = ''
        if (!nodeId) continue
        const { nodes } = await cdp.send('Accessibility.getPartialAXTree', { nodeId, fetchRelatives: false }).catch(() => ({ nodes: [] }))
        const node = nodes.find((n) => !n.ignored) ?? nodes[0]
        f.axName = node?.name?.value ?? ''
        f.axRole = node?.role?.value ?? ''
        const winner = (node?.name?.sources ?? []).find((s) => (s.value?.value ?? '') !== '' && !s.superseded)
        f.axNameFrom = winner ? winner.attribute || winner.nativeSource || winner.type : ''
      }
      await cdp.detach()
      return data
    }

    const data = await inspect()
    if (data.fields.length === 0) add('warn', 'controls-found', 'page', 'No form controls found. If the form renders late, check the URL or pass --form.')

    const smallText = []
    for (const f of data.fields) {
      const where = f.ref
      if (!f.visible && !f.removedFromTree) continue
      if (f.removedFromTree) {
        add('error', 'native-control-in-tree', where, `${f.type} is display:none or visibility:hidden${f.choiceLabelVisible ? ' behind a styled label' : ''}. It vanishes from the accessibility tree and keyboard; hide it with opacity and position instead.`)
        continue
      }
      if (!f.axName) add('error', 'accessible-name', where, 'No accessible name. Associate a visible <label for>.')
      else if (/placeholder|title/i.test(f.axNameFrom)) add('error', 'label-not-placeholder', where, `Name "${f.axName}" comes only from the ${f.axNameFrom} attribute. Placeholders vanish on input and title is not shown on touch; give it a visible label.`)
      else if (!f.visibleLabel && !['radio', 'checkbox'].includes(f.type)) add('warn', 'visible-label', where, `Named "${f.axName}" by ${f.axNameFrom || 'a hidden source'}, with no visible label. Fine only when the purpose is visually obvious (a search box beside a Search button).`)
      if (['radio', 'checkbox'].includes(f.type) && !f.visibleLabel) add('warn', 'visible-label', where, 'Choice without a visible associated label; the label text should be part of the click target.')

      if (f.group && !f.group.named) add('warn', 'group-legend', where, `Group "${f.group.name}" has no <fieldset><legend> or named role=radiogroup, so each option is read without its question.`)

      if (!f.autocompleteValid) add('error', 'autocomplete-valid', where, `autocomplete="${f.autocomplete}" is not a valid WHATWG autofill value.`)
      const p = purposeOf(f)
      if (p) {
        const tokens = (f.autocomplete || '').toLowerCase().split(/\s+/)
        const off = tokens.includes('off')
        const matches = p.tokens.some((t) => tokens.includes(t))
        if (!f.autocomplete || (!matches && !off)) add('warn', 'autocomplete-purpose', where, `Looks like ${p.id}; expected autocomplete="${p.tokens[0]}"${p.tokens.length > 1 ? ` (or ${p.tokens.slice(1).join(', ')})` : ''}, found ${f.autocomplete ? `"${f.autocomplete}"` : 'none'}. Required for the user's own data (WCAG 1.3.5); omit only when it is someone else's data.`)
        else if (off) add('warn', 'autocomplete-off', where, `${p.id} has autocomplete="off". Browsers ignore it for many fields and it blocks password managers; use the purpose token.`)
        if (p.type && f.type !== p.type && !(p.id === 'email' && f.type === 'text' && tokens.includes('username'))) add('warn', 'input-type', where, `Looks like ${p.id}; type="${p.type}" gives the right keyboard and autofill (found type="${f.type}").`)
        if (p.identifier && f.type === 'number') add('error', 'no-number-for-identifiers', where, `${p.id} uses type="number", which drops leading zeros, accepts scroll-wheel changes and confuses dictation. Use type="text" inputmode="numeric".`)
        if (p.numeric && f.type === 'text' && f.inputmode !== 'numeric') add('warn', 'inputmode', where, `${p.id} is digits; add inputmode="numeric" for the number keypad.`)
        if (p.id === 'password' && f.maxlength && Number(f.maxlength) < 64) add('warn', 'password-length', where, `Password maxlength=${f.maxlength}. Do not cap length low; NIST SP 800-63B-4 asks verifiers to accept at least 64 characters.`)
      }
      if (f.type === 'number' && !p) add('info', 'number-type', where, 'type="number" is fine for true quantities only; use text with inputmode="numeric" for codes and identifiers.')
      if (f.pasteBlocked) add('error', 'paste-allowed', where, 'A paste handler cancels paste. Blocking paste breaks password managers and fails WCAG 3.3.8 on sign-in fields.')
      if (f.fontSize && f.fontSize < 16 && opts.width < 768 && ['text', 'email', 'tel', 'password', 'number', 'url', 'search', 'textarea', 'select'].includes(f.type)) smallText.push(`${where} ${f.fontSize}px`)
      if (f.missingRefs.length) add('error', 'described-by-exists', where, `aria-describedby/aria-errormessage point to missing id(s): ${f.missingRefs.join(', ')}.`)
      if (f.invalidAttr && f.visibleRefTexts.length === 0) add('error', 'error-associated', where, 'aria-invalid="true" but no visible error text is referenced by aria-describedby. Tie the visible message to the field.')
    }

    if (smallText.length) add('warn', 'mobile-font-size', `${smallText.length} field(s)`, `Text under 16px at ${opts.width}px wide makes iOS Safari zoom on focus: ${smallText.slice(0, 6).join(', ')}${smallText.length > 6 ? ', ...' : ''}.`)

    for (const form of data.forms) {
      if (form.submits.length === 0) add('warn', 'submit-exists', form.ref, 'No submit button. Enter will not submit reliably and agents look for a named submit control.')
      for (const s of form.submits) {
        if (!s.text) add('error', 'submit-named', form.ref, 'Submit button has no name.')
        else if (GENERIC_SUBMIT.test(s.text.trim())) add('warn', 'submit-names-outcome', form.ref, `Submit button says "${s.text}". Name the outcome: "Create account", "Pay £42.00", "Send application". "Continue" is fine between steps.`)
        if (s.disabled) add('warn', 'submit-not-disabled', form.ref, `Submit "${s.text}" is disabled at load. Keep it enabled and validate on submit so people and agents learn what is missing.`)
      }
    }

    if (opts.trySubmit) {
      const formIdx = 0
      const sel = opts.form ? `${opts.form} button:not([type]), ${opts.form} button[type=submit], ${opts.form} input[type=submit]` : `form[data-form-check-form="${formIdx}"] button:not([type]), form[data-form-check-form="${formIdx}"] button[type=submit], form[data-form-check-form="${formIdx}"] input[type=submit]`
      const button = page.locator(sel).first()
      if ((await button.count()) === 0) add('warn', 'try-submit', 'page', 'No submit button to try.')
      else {
        const before = page.url()
        await button.click({ timeout: 5000 }).catch((e) => add('error', 'try-submit', 'page', `Could not click submit: ${e.message.split('\n')[0]}`))
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {})
        await page.waitForTimeout(600)
        const after = await page.evaluate(afterSubmit)
        const again = await inspect()
        const invalid = again.fields.filter((f) => f.visible && (f.invalidAttr || f.nativeInvalid))
        const exposed = invalid.filter((f) => f.invalidAttr && f.visibleRefTexts.length > 0)
        const bubbleOnly = invalid.filter((f) => f.nativeInvalid && !f.invalidAttr && f.visibleRefTexts.length === 0)
        submitReport = { navigated: after.url !== before, ...after, invalidCount: invalid.length, exposedCount: exposed.length, bubbleOnly: bubbleOnly.map((f) => f.ref) }
        if (invalid.length === 0 && !submitReport.navigated) add('warn', 'empty-submit', 'page', 'Submitting the empty form showed no invalid fields and did not navigate. Check that required fields are validated and that errors are rendered in the page.')
        if (bubbleOnly.length) add('error', 'errors-in-page', bubbleOnly.map((f) => f.ref).join(', '), 'Errors exist only as browser validation bubbles, which disappear, are not page text agents can read, and cannot be styled or linked. Add novalidate, render messages in the page, and keep server validation.')
        if (invalid.length && !after.focusInSummary && !after.focusOnField) add('error', 'focus-after-error', 'page', `After a failed submit, focus is on ${after.focused}. Move it to the error summary or the first invalid field.`)
        if (invalid.length > 1 && !after.hasSummary) add('warn', 'error-summary', 'page', `${invalid.length} fields invalid and no error summary with links found. List each problem at the top, linked to its field.`)
        for (const l of after.summaryLinks) if (!l.resolves) add('error', 'summary-links', 'error summary', `Link "${l.text}" points to #${l.target}, which does not exist.`)
        if (invalid.length && after.hasSummary && !/^error/i.test(after.title)) add('info', 'error-title', 'page', `Title is "${after.title}". GOV.UK prefixes "Error: " so screen reader users hear it on load.`)
      }
    }
    await context.close()
  } finally {
    await browser.close()
    served?.server.close()
  }
  return { target, url, width: opts.width, at: new Date().toISOString(), findings, submit: submitReport }
}

function parseArgs(argv) {
  const opts = { width: 390, trySubmit: false, quiet: false }
  let target = null
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--width') opts.width = Number(argv[++i])
    else if (a === '--try-submit') opts.trySubmit = true
    else if (a === '--form') opts.form = argv[++i]
    else if (a === '--json') opts.json = argv[++i]
    else if (a === '--quiet') opts.quiet = true
    else target = a
  }
  return { target, opts }
}

const { target, opts } = parseArgs(process.argv.slice(2))
if (!target) {
  console.error('Usage: node form-check.mjs <url|file.html|dist-dir> [--width 390] [--try-submit] [--form <css>] [--json <file>] [--quiet]')
  process.exit(2)
}
run(target, opts)
  .then((report) => {
    if (opts.json) writeFileSync(opts.json, JSON.stringify(report, null, 2))
    const order = { error: 0, warn: 1, info: 2 }
    const list = [...report.findings].sort((a, b) => order[a.level] - order[b.level])
    if (!opts.quiet) for (const f of list) console.log(`${f.level.toUpperCase().padEnd(5)} ${f.check} ${f.where}: ${f.detail}`)
    if (report.submit && !opts.quiet) console.log(`\nAfter empty submit: ${report.submit.invalidCount} invalid, ${report.submit.exposedCount} with linked visible errors, focus on ${report.submit.focused}${report.submit.navigated ? `, navigated to ${report.submit.url}` : ''}.`)
    const errors = report.findings.filter((f) => f.level === 'error').length
    const warns = report.findings.filter((f) => f.level === 'warn').length
    console.log(`\n${errors} errors, ${warns} warnings.${opts.json ? ` Report: ${opts.json}` : ''}`)
    process.exit(errors ? 1 : 0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(2)
  })
