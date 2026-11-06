#!/usr/bin/env node
// Lint MCP tool definitions, and optionally sample tool results, for the problems that make agents
// pick the wrong tool, pass the wrong arguments, or fail to recover.
//
//   node lint-tools.mjs <tools.json> [--results <results.json>] [--json] [--strict]
//
// <tools.json> may be a tools/list result ({ "tools": [...] }), a full JSON-RPC response
// ({ "result": { "tools": [...] } }), or a bare array of tool definitions.
// <results.json> is an array of { "tool": "<name>", "arguments": {...}, "result": <CallToolResult> },
// for example captured from real calls, including at least one deliberate bad input per tool.
//
// Levels: error (breaks the spec or misleads the model), warn (likely to cost agent success),
// note (worth a look). Exit 0 when there are no errors (no errors or warnings with --strict), 1 otherwise, 2 on bad input.
// No dependencies. Heuristics are heuristics: a warning is a question to answer, not a verdict.

import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const opt = { json: false, strict: false, results: null, file: null }
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a === '--json') opt.json = true
  else if (a === '--strict') opt.strict = true
  else if (a === '--results') opt.results = args[++i]
  else if (a === '-h' || a === '--help') { usage(0) }
  else if (!opt.file) opt.file = a
  else { process.stderr.write(`Unexpected argument: ${a}\n`); usage(2) }
}
if (!opt.file) usage(2)

function usage(code) {
  const text = 'Usage: node lint-tools.mjs <tools.json> [--results <results.json>] [--json] [--strict]\n' +
    'Example: node lint-tools.mjs tools.json --results calls.json\n'
  ;(code === 0 ? process.stdout : process.stderr).write(text)
  process.exit(code)
}

function readJson(path, what) {
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch (e) {
    process.stderr.write(`Could not read ${what} from ${path}: ${e.message}\n`)
    process.exit(2)
  }
}

const raw = readJson(opt.file, 'tool definitions')
const tools = Array.isArray(raw) ? raw : Array.isArray(raw?.tools) ? raw.tools : Array.isArray(raw?.result?.tools) ? raw.result.tools : null
if (!tools) { process.stderr.write('Expected an array of tools, { "tools": [...] }, or { "result": { "tools": [...] } }.\n'); process.exit(2) }

const findings = []
const add = (level, tool, check, message) => findings.push({ level, tool, check, message })

// Vocabulary
const READ_VERBS = new Set(['get', 'list', 'search', 'find', 'read', 'fetch', 'describe', 'count', 'query', 'lookup', 'show', 'view', 'check', 'inspect', 'preview', 'validate', 'diff', 'explain', 'summarize', 'download', 'export', 'status', 'estimate', 'plan'])
const WRITE_VERBS = new Set(['create', 'add', 'update', 'set', 'edit', 'patch', 'put', 'post', 'send', 'reply', 'write', 'upload', 'move', 'rename', 'copy', 'assign', 'merge', 'close', 'open', 'start', 'stop', 'restart', 'cancel', 'approve', 'reject', 'publish', 'deploy', 'rollback', 'schedule', 'book', 'invite', 'enable', 'disable', 'archive', 'restore', 'run', 'execute', 'trigger', 'apply', 'import', 'sync', 'tag', 'label', 'comment', 'acknowledge', 'ack', 'resolve', 'transfer', 'pay', 'refund', 'charge', 'submit', 'save', 'insert', 'upsert', 'commit', 'push', 'lock', 'unlock', 'grant', 'revoke', 'mute', 'unmute', 'pause', 'resume', 'retry', 'scale', 'install', 'uninstall', 'build', 'release', 'message', 'notify', 'post'])
const DESTRUCTIVE_VERBS = new Set(['delete', 'remove', 'drop', 'purge', 'destroy', 'erase', 'wipe', 'truncate', 'overwrite', 'reset', 'revoke', 'terminate', 'kill', 'force'])
const GENERIC_NAMES = new Set(['run', 'execute', 'exec', 'do', 'handle', 'process', 'tool', 'api', 'call', 'invoke', 'action', 'request', 'main', 'helper', 'util', 'query', 'function'])
const AMBIGUOUS_PARAMS = new Set(['id', 'user', 'data', 'value', 'input', 'obj', 'object', 'params', 'args', 'arguments', 'payload', 'item', 'info', 'body', 'options', 'opts', 'thing', 'target', 'entity', 'record', 'misc', 'extra', 'config'])
const STOP = new Set('a an the and or of to for in on at by with from this that it is are be as use when if then into your you can will not any all its their'.split(' '))

const NAME_RE = /^[A-Za-z0-9_.-]{1,128}$/
const HIDDEN_CHARS = /[​-‏‪-‮⁠-⁤⁦-⁩﻿]|[\u{E0000}-\u{E007F}]/u
const INJECTION_PATTERNS = [
  /ignore (all |any )?(previous|prior|above|other) (instructions|rules)/i,
  /<\s*(important|system|instructions?)\s*>/i,
  /(do not|don't|never) (tell|mention|inform|reveal|show)\b.{0,30}\buser/i,
  /without (telling|informing|asking) the user/i,
  /(read|cat|open|send|upload|include) .{0,40}(\.ssh|id_rsa|\.env|credentials|api[_ -]?key|password)/i,
  /\byou must (always|first|also) (call|use|run|send|read)\b/i,
  /\b(system prompt|developer message)\b/i,
]

function tokens(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[\s._-]+/)
    .map(t => t.toLowerCase())
    .filter(Boolean)
}
function words(text) {
  return new Set(String(text || '').toLowerCase().match(/[a-z][a-z0-9]+/g)?.filter(w => !STOP.has(w) && w.length > 2) || [])
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0
  let inter = 0
  for (const w of a) if (b.has(w)) inter++
  return inter / (a.size + b.size - inter)
}
const isObj = v => v && typeof v === 'object' && !Array.isArray(v)
const fmt = v => JSON.stringify(v)

// Walk every property in a schema, with its path, so nested objects are checked too.
function eachProperty(schema, path, fn) {
  if (!isObj(schema)) return
  if (isObj(schema.properties)) {
    for (const [k, v] of Object.entries(schema.properties)) {
      fn(k, v, path ? `${path}.${k}` : k, schema)
      eachProperty(v, path ? `${path}.${k}` : k, fn)
    }
  }
  if (isObj(schema.items)) eachProperty(schema.items, `${path}[]`, fn)
}

const seen = new Map()
const seenLower = new Map()
tools.forEach((tool, index) => {
  const label = typeof tool?.name === 'string' && tool.name ? tool.name : `#${index}`
  if (!isObj(tool)) { add('error', label, 'shape', 'Tool definition is not an object.'); return }

  // Name
  const name = tool.name
  if (typeof name !== 'string' || !name) add('error', label, 'name', 'Missing name.')
  else {
    if (!NAME_RE.test(name)) add('error', label, 'name', 'Name should be 1-128 characters of A-Z, a-z, 0-9, _, - and . only (MCP spec, Tool Names).')
    if (seen.has(name)) add('error', label, 'name', `Duplicate name; also tool ${seen.get(name)}.`)
    else seen.set(name, `#${index}`)
    const lower = name.toLowerCase()
    if (seenLower.has(lower) && seenLower.get(lower) !== name) add('warn', label, 'name', `Differs from "${seenLower.get(lower)}" only by case; names are case-sensitive but models and people confuse them.`)
    else seenLower.set(lower, name)
    const t = tokens(name)
    if (t.length === 1 && GENERIC_NAMES.has(t[0])) add('warn', label, 'name', 'Generic name. Say what happens and to what, for example "search_orders" or "refund_payment".')
    else if (!t.some(w => READ_VERBS.has(w) || WRITE_VERBS.has(w) || DESTRUCTIVE_VERBS.has(w))) add('note', label, 'name', 'No recognisable verb in the name. Tool names that state the action ("create_invoice") are easier to choose correctly.')
  }

  // Description
  const d = tool.description
  if (typeof d !== 'string' || !d.trim()) add('error', label, 'description', 'Missing description. The model chooses tools mainly from name and description.')
  else {
    const len = d.trim().length
    if (len < 40) add('warn', label, 'description', `Description is ${len} characters. Say what it does, when to use it, and what it returns.`)
    if (len > 2000) add('warn', label, 'description', `Description is ${len} characters. Move detail into parameter descriptions or docs; every tool description costs context on every turn.`)
    if (!/\b(use (this |it )?(when|to|for|if|instead)|when you|for example|e\.g\.|instead of|rather than|use only|only (when|if|for|after)|do not use|don't use)\b/i.test(d)) add('note', label, 'description', 'Description does not say when to use the tool (or when not to). Add one clause, especially if a sibling tool is similar.')
    if (/^(this (tool|function)|a tool|tool (that|to))\b/i.test(d.trim())) add('note', label, 'description', 'Starts with "This tool". Lead with the verb: "Search open orders by customer email."')
    if (HIDDEN_CHARS.test(d)) add('error', label, 'description', 'Contains zero-width, bidi-control or Unicode tag characters. These hide text from people while the model still reads it.')
    for (const re of INJECTION_PATTERNS) {
      const m = d.match(re)
      if (m) { add('error', label, 'description', `Contains instruction-like text ("${m[0].slice(0, 60)}") that reads as tool poisoning. Tool metadata describes the tool; it does not direct the agent.`); break }
    }
  }
  if (tool.title !== undefined && typeof tool.title !== 'string') add('error', label, 'title', 'title must be a string.')

  // Input schema
  const s = tool.inputSchema
  if (s === undefined || s === null) add('error', label, 'inputSchema', 'Missing inputSchema. Use {"type":"object","additionalProperties":false} for a tool with no parameters.')
  else if (!isObj(s)) add('error', label, 'inputSchema', 'inputSchema must be a JSON Schema object.')
  else {
    if (s.type !== 'object') add('error', label, 'inputSchema', `inputSchema.type should be "object", got ${fmt(s.type)}.`)
    const props = isObj(s.properties) ? s.properties : {}
    const names = Object.keys(props)
    if (Array.isArray(s.required)) for (const r of s.required) if (!(r in props)) add('error', label, 'inputSchema', `required lists "${r}", which is not in properties.`)
    if (names.length && !Array.isArray(s.required)) add('note', label, 'inputSchema', 'No "required" array. State which parameters are required, even if none are.')
    if (s.additionalProperties !== false) add('note', label, 'inputSchema', 'additionalProperties is not false. Unknown arguments will be accepted silently; strict-mode clients also expect it.')

    const boolNames = []
    eachProperty(s, '', (key, prop, path) => {
      if (!isObj(prop)) { add('error', label, 'inputSchema', `Property "${path}" is not a schema object.`); return }
      if (!prop.description && !prop.enum && !prop.const) add('warn', label, 'params', `Parameter "${path}" has no description. State format, units, and an example.`)
      if (AMBIGUOUS_PARAMS.has(key.toLowerCase())) add('warn', label, 'params', `Parameter "${path}" is ambiguous. Qualify it ("customer_id", "invoice_data") so the model cannot pass the wrong kind of value.`)
      const type = Array.isArray(prop.type) ? prop.type : [prop.type]
      if (type.includes('boolean')) boolNames.push(key.toLowerCase())
      if (type.includes('string') && !prop.enum && typeof prop.description === 'string' && /\b(one of|either|must be (one|either)|possible values|valid values)\b/i.test(prop.description)) add('warn', label, 'params', `Parameter "${path}" lists allowed values in prose. Use an enum so they are enumerable and validated.`)
      if (type.includes('string') && /(^|_)(date|time|timestamp|at|since|until|before|after)$/i.test(key) && !prop.format && !/iso|rfc ?3339|yyyy|format/i.test(prop.description || '')) add('warn', label, 'params', `Parameter "${path}" looks like a date or time with no stated format. Say "ISO 8601, e.g. 2026-11-05T14:00:00Z" and whether a time zone is required.`)
      if (prop.type === undefined && !prop.enum && !prop.const && !prop.anyOf && !prop.oneOf && !prop.$ref) add('warn', label, 'params', `Parameter "${path}" has no type.`)
    })
    for (const b of boolNames) {
      const m = b.match(/^(enable|include|show|allow)(.*)$/)
      if (m) {
        const opposite = { enable: 'disable', include: 'exclude', show: 'hide', allow: 'deny' }[m[1]] + m[2]
        if (boolNames.includes(opposite)) add('warn', label, 'params', `Booleans "${b}" and "${opposite}" can contradict each other. Use one enum.`)
      }
    }

    // Unbounded lists
    const t = typeof name === 'string' ? tokens(name) : []
    if (t.some(w => ['list', 'search', 'find', 'query'].includes(w))) {
      const paging = names.some(n => /^(limit|max_results|max|page_size|per_page|top|first|cursor|page_token|after|offset|page)$/i.test(n))
      if (!paging) add('warn', label, 'pagination', 'A list or search tool with no limit or cursor parameter. Bound the result size and return a cursor and the total.')
    }
  }

  // Output schema
  if (tool.outputSchema !== undefined && !isObj(tool.outputSchema)) add('error', label, 'outputSchema', 'outputSchema must be a JSON Schema object.')

  // Annotations
  const an = tool.annotations
  const t = typeof name === 'string' ? tokens(name) : []
  const readVerb = t.some(w => READ_VERBS.has(w)) && !t.some(w => WRITE_VERBS.has(w) && !READ_VERBS.has(w)) && !t.some(w => DESTRUCTIVE_VERBS.has(w))
  const destructiveVerb = t.some(w => DESTRUCTIVE_VERBS.has(w))
  const writeVerb = t.some(w => WRITE_VERBS.has(w) && !READ_VERBS.has(w))
  if (an === undefined) {
    add('warn', label, 'annotations', 'No annotations. Clients then assume not read-only, destructive, not idempotent, open-world. Set them honestly.')
  } else if (!isObj(an)) add('error', label, 'annotations', 'annotations must be an object.')
  else {
    for (const k of ['readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint']) if (an[k] !== undefined && typeof an[k] !== 'boolean') add('error', label, 'annotations', `${k} must be a boolean.`)
    if (an.readOnlyHint === true && (destructiveVerb || writeVerb)) add('error', label, 'annotations', 'readOnlyHint is true but the name says the tool changes something. One of them is wrong.')
    if (an.readOnlyHint === true && (an.destructiveHint !== undefined || an.idempotentHint !== undefined)) add('note', label, 'annotations', 'destructiveHint and idempotentHint are meaningful only when readOnlyHint is false.')
    if (destructiveVerb && an.destructiveHint === false) add('error', label, 'annotations', 'The name says it deletes or overwrites, but destructiveHint is false.')
    if (readVerb && an.readOnlyHint !== true) add('warn', label, 'annotations', 'The name reads like a read-only tool, but readOnlyHint is not true. If it really is read-only, say so; clients may otherwise prompt for every call.')
    const outbound = isObj(tool.inputSchema?.properties) && Object.keys(tool.inputSchema.properties).find(k => /^(destination|dest|url|webhook|webhook_url|callback|callback_url|endpoint|recipient|recipients|to|email_to|upload_url|target_url)$/i.test(k))
    if (an.readOnlyHint === true && outbound) add('warn', label, 'annotations', `readOnlyHint is true but parameter "${outbound}" suggests data is sent somewhere. Sending data out is an effect clients should be able to gate; check readOnlyHint and openWorldHint.`)
    if (an.readOnlyHint !== true && an.idempotentHint === undefined) add('note', label, 'annotations', 'Mutating tool with idempotentHint unset. Say whether a retry with the same arguments is safe.')
  }
})

// Overlap between tools
const descWords = tools.map(t => words(`${t?.name ? tokens(t.name).join(' ') : ''} ${t?.description || ''}`))
for (let i = 0; i < tools.length; i++) {
  for (let j = i + 1; j < tools.length; j++) {
    const sim = jaccard(descWords[i], descWords[j])
    if (sim >= 0.6) add('warn', `${tools[i]?.name} / ${tools[j]?.name}`, 'overlap', `Descriptions overlap heavily (${Math.round(sim * 100)}% shared words). Merge them, or say in each when to use the other.`)
  }
}
if (tools.length > 40) add('warn', '(server)', 'count', `${tools.length} tools. Consider fewer, task-shaped tools, or deferred loading through a search tool.`)
else if (tools.length > 20) add('note', '(server)', 'count', `${tools.length} tools. OpenAI suggests aiming for fewer than 20 available at once; test selection accuracy at this size.`)

// Results
if (opt.results) {
  const rawResults = readJson(opt.results, 'tool results')
  const results = Array.isArray(rawResults) ? rawResults : null
  if (!results) { process.stderr.write('Expected results as an array of { tool, arguments, result }.\n'); process.exit(2) }
  const byName = new Map(tools.map(t => [t?.name, t]))
  results.forEach((r, i) => {
    const label = `${r?.tool ?? '?'} (result #${i})`
    const res = r?.result
    if (!isObj(res)) { add('error', label, 'result', 'result is missing or not an object.'); return }
    const def = byName.get(r.tool)
    if (!def) add('warn', label, 'result', `No tool named "${r.tool}" in the definitions.`)
    const content = Array.isArray(res.content) ? res.content : []
    const text = content.filter(c => c?.type === 'text').map(c => c.text || '').join('\n')
    if (!content.length && res.structuredContent === undefined) add('error', label, 'result', 'Result has neither content nor structuredContent.')
    if (text.length / 4 > 25000) add('warn', label, 'size', `About ${Math.round(text.length / 4)} tokens of text. Claude Code caps tool output at 25,000 tokens by default; paginate or summarise.`)

    if (res.isError === true) {
      if (!text.trim()) add('error', label, 'error-shape', 'Error result with no text. Say what failed, why, and what to do next.')
      else {
        if (/Traceback \(most recent call last\)|^\s+at [^\n]+:\d+:\d+\)?$|Exception in thread|\bpanic: /m.test(text)) add('error', label, 'error-shape', 'Error text contains a stack trace. Return the cause and the fix; log the trace on the server.')
        const bare = text.trim().length < 25 || /^(error|internal (server )?error|bad request|failed|invalid( input)?|err_[a-z0-9_]+|\d{3})[.!:]?$/i.test(text.trim())
        if (bare) add('error', label, 'error-shape', `Error text "${text.trim().slice(0, 60)}" gives the model nothing to act on.`)
        else if (!/\b(try|use|must|expected|should|retry|provide|pass|check|valid|allowed|instead|call|wait|ask|set|change|remove|add|create|between|format|e\.g\.|for example)\b/i.test(text)) add('warn', label, 'error-shape', 'Error text names no remedy. Add what a valid input looks like, or which tool or step comes next.')
      }
    } else {
      if (def?.outputSchema && res.structuredContent === undefined) add('error', label, 'output', 'Tool declares outputSchema but the result has no structuredContent.')
      if (def?.outputSchema && res.structuredContent !== undefined) {
        const errs = validate(res.structuredContent, def.outputSchema, '$')
        for (const e of errs.slice(0, 5)) add('error', label, 'output', `structuredContent does not match outputSchema: ${e}`)
      }
      if (res.structuredContent !== undefined && !text) add('warn', label, 'output', 'structuredContent with no text block. The spec says to also return the serialized JSON as text for older clients.')
      if (/\btruncated\b|\.\.\.\s*$/i.test(text) && !/\b(cursor|next|page|narrow|filter|limit|more)\b/i.test(text)) add('warn', label, 'output', 'Output looks truncated but does not say how to get the rest or narrow the query.')
    }
  })
}

// Minimal JSON Schema check: type, enum, const, required, properties, items. Enough to catch drift.
function validate(value, schema, path) {
  const errs = []
  if (!isObj(schema)) return errs
  const types = schema.type === undefined ? null : Array.isArray(schema.type) ? schema.type : [schema.type]
  if (types) {
    const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value
    const ok = types.some(t => t === actual || (t === 'integer' && Number.isInteger(value)) || (t === 'number' && actual === 'number'))
    if (!ok) { errs.push(`${path} is ${actual}, expected ${types.join(' or ')}`); return errs }
  }
  if (Array.isArray(schema.enum) && !schema.enum.some(e => JSON.stringify(e) === JSON.stringify(value))) errs.push(`${path} is not one of ${fmt(schema.enum)}`)
  if (schema.const !== undefined && JSON.stringify(schema.const) !== JSON.stringify(value)) errs.push(`${path} is not ${fmt(schema.const)}`)
  if (isObj(value)) {
    for (const r of schema.required || []) if (!(r in value)) errs.push(`${path}.${r} is required`)
    if (isObj(schema.properties)) for (const [k, v] of Object.entries(schema.properties)) if (k in value) errs.push(...validate(value[k], v, `${path}.${k}`))
  }
  if (Array.isArray(value) && isObj(schema.items)) value.forEach((v, i) => errs.push(...validate(v, schema.items, `${path}[${i}]`)))
  return errs
}

// Report
const order = { error: 0, warn: 1, note: 2 }
findings.sort((a, b) => order[a.level] - order[b.level] || String(a.tool).localeCompare(String(b.tool)))
const counts = { error: 0, warn: 0, note: 0 }
for (const f of findings) counts[f.level]++
const failed = counts.error > 0 || (opt.strict && counts.warn > 0)

if (opt.json) {
  process.stdout.write(JSON.stringify({ tools: tools.length, counts, passed: !failed, findings }, null, 2) + '\n')
} else {
  for (const f of findings) process.stdout.write(`${f.level.padEnd(5)}  ${f.tool}  [${f.check}]  ${f.message}\n`)
  process.stdout.write(`\n${tools.length} tools: ${counts.error} errors, ${counts.warn} warnings, ${counts.note} notes. ${failed ? 'FAIL' : 'PASS'}\n`)
}
process.exit(failed ? 1 : 0)
