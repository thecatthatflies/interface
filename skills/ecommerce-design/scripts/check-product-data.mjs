#!/usr/bin/env node
// Checks a product page's schema.org Product/Offer data against what the page visibly says.
// Shopping agents and search engines read the structured data; people read the page. They must agree.
//
//   node check-product-data.mjs <page.html|url> [--json]
//
// A URL is fetched without running JavaScript, which is what "in the initial HTML" means: markup that
// only appears after scripts run is read less often and less reliably. To check a client-rendered page,
// save the rendered HTML too and compare.
// Exit 0 when nothing fails, 1 when a check fails, 2 on bad usage or fetch error. No dependencies.
// Property requirements follow Google's merchant listing documentation (developers.google.com/search/docs/
// appearance/structured-data/merchant-listing) and schema.org. It is a floor, not a validator; run Google's
// Rich Results Test or the Schema Markup Validator as well.

import { existsSync, readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const json = args.includes('--json')
const target = args.find((a) => !a.startsWith('--'))
if (!target) {
  process.stderr.write('usage: node check-product-data.mjs <page.html|url> [--json]\n')
  process.exit(2)
}

let html
try {
  if (/^https?:\/\//i.test(target)) {
    const res = await fetch(target, { headers: { 'user-agent': 'check-product-data/1.0', accept: 'text/html' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    html = await res.text()
  } else if (existsSync(target)) html = readFileSync(target, 'utf8')
  else throw new Error('file not found')
} catch (e) {
  process.stderr.write(`cannot read ${target}: ${e.message}\n`)
  process.exit(2)
}

const findings = []
const add = (level, id, message) => findings.push({ level, id, message })

const AVAILABILITY = ['BackOrder', 'Discontinued', 'InStock', 'InStoreOnly', 'LimitedAvailability', 'OnlineOnly', 'OutOfStock', 'PreOrder', 'PreSale', 'SoldOut']
const UNAVAILABLE = ['Discontinued', 'OutOfStock', 'SoldOut']

// ---------- visible text (roughly what a person and an accessibility-tree agent read) ----------
const visible = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<template[\s\S]*?<\/template>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&#36;/g, '$').replace(/&pound;/gi, '£').replace(/&euro;/gi, '€')
  .replace(/\s+/g, ' ')
const visibleDigits = visible.replace(/(\d)[\s,.  '](?=\d{3}\b)/g, '$1') // drop thousands separators

// ---------- collect JSON-LD nodes ----------
const nodes = []
const walk = (n) => {
  if (Array.isArray(n)) return n.forEach(walk)
  if (!n || typeof n !== 'object') return
  nodes.push(n)
  for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v)
}
const blocks = [...html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
for (const b of blocks) {
  try {
    walk(JSON.parse(b[1].trim()))
  } catch (e) {
    add('fail', 'jsonld-parse', `A JSON-LD block does not parse (${e.message}). Consumers ignore the whole block.`)
  }
}
const typeOf = (n) => [].concat(n['@type'] || []).map((t) => String(t).replace(/^https?:\/\/schema\.org\//, ''))
const products = nodes.filter((n) => typeOf(n).some((t) => t === 'Product' || t === 'ProductGroup'))
const hasMicrodata = /itemtype\s*=\s*["']https?:\/\/schema\.org\/Product["']/i.test(html)

if (!products.length) {
  if (hasMicrodata) add('info', 'microdata-only', 'Product data is in microdata, not JSON-LD. This checker reads JSON-LD only; validate microdata with the Schema Markup Validator.')
  else add('fail', 'no-product', 'No schema.org Product in the initial HTML. Shopping agents and search engines get no machine-readable name, price or availability. If the markup is injected by JavaScript, put it in the server response.')
}

const str = (v) => (v == null ? '' : typeof v === 'object' ? (v.name ?? v['@id'] ?? v.url ?? '') : String(v))
const short = (v) => String(v).replace(/^https?:\/\/schema\.org\//, '')
const priceForms = (p) => {
  const n = Number(p)
  if (!Number.isFinite(n)) return []
  const fixed = n.toFixed(2)
  const forms = new Set([fixed, fixed.replace('.', ','), String(n), String(n).replace('.', ',')])
  if (Number.isInteger(n)) forms.add(String(n))
  return [...forms]
}
const textSaysUnavailable = /\b(out of stock|sold out|unavailable|no longer available|discontinued)\b/i.test(visible)
const textSaysAvailable = /\b(in stock|add to (cart|bag|basket)|buy now|ships (today|in|within))\b/i.test(visible)

for (const p of products) {
  const label = str(p.name) || '(unnamed product)'
  const isGroup = typeOf(p).includes('ProductGroup')
  if (!str(p.name)) add('fail', 'name', 'Product has no name.')
  else if (!visible.toLowerCase().includes(str(p.name).toLowerCase().slice(0, 40))) add('warn', 'name-visible', `Product name "${label}" does not appear in the visible text. Structured data should describe what the page shows.`)
  if (!isGroup && !p.image) add('fail', 'image', `${label}: no image. Required for merchant listings.`)
  if (!p.gtin && !p.gtin8 && !p.gtin12 && !p.gtin13 && !p.gtin14 && !p.isbn && !p.mpn && !isGroup) add('info', 'identifier', `${label}: no GTIN, ISBN or MPN. Global identifiers let agents match the same product across stores.`)
  if (!p.brand && !isGroup) add('info', 'brand', `${label}: no brand.`)

  const variants = isGroup ? [].concat(p.hasVariant || []) : [p]
  if (isGroup && !variants.length) add('warn', 'variants', `${label}: ProductGroup with no hasVariant. Agents cannot see which sizes or colours exist.`)
  if (isGroup && !p.variesBy) add('info', 'variesBy', `${label}: ProductGroup without variesBy. Say which attributes the variants differ by.`)

  for (const v of variants) {
    const vLabel = str(v.name) || label
    const offers = [].concat(v.offers || [])
    if (!offers.length) {
      add('fail', 'offers', `${vLabel}: no offers. Without an Offer there is no machine-readable price or availability.`)
      continue
    }
    for (const o of offers) {
      const types = typeOf(o)
      if (types.includes('AggregateOffer')) add('warn', 'aggregate-offer', `${vLabel}: AggregateOffer. Google merchant listings require a single Offer from the seller; AggregateOffer is for marketplaces comparing sellers.`)
      const spec = o.priceSpecification && !Array.isArray(o.priceSpecification) ? o.priceSpecification : {}
      const price = o.price ?? o.lowPrice ?? spec.price
      const currency = o.priceCurrency ?? spec.priceCurrency
      if (price == null || price === '') add('fail', 'price', `${vLabel}: offer has no price.`)
      else if (typeof price === 'string' && /[^\d.]/.test(price)) add('fail', 'price-format', `${vLabel}: price "${price}" must be a plain number with a dot decimal separator, no currency symbol or thousands separator.`)
      else if (!(Number(price) > 0)) add('warn', 'price-zero', `${vLabel}: price ${price}. Merchant listings require a price above zero; free items need a different treatment.`)
      else {
        const forms = priceForms(price)
        if (!forms.some((f) => visibleDigits.includes(f))) add('fail', 'price-mismatch', `${vLabel}: structured price ${price} ${currency || ''} does not appear in the visible text. A mismatch is the most damaging error here: an agent quotes one price and the page charges another.`)
      }
      if (!currency) add('fail', 'currency', `${vLabel}: no priceCurrency.`)
      else if (!/^[A-Z]{3}$/.test(currency)) add('fail', 'currency-format', `${vLabel}: priceCurrency "${currency}" is not a three-letter ISO 4217 code.`)
      const avail = o.availability ? short(o.availability) : null
      if (!avail) add('warn', 'availability', `${vLabel}: no availability. Agents will not know whether it can be bought.`)
      else if (!AVAILABILITY.includes(avail)) add('fail', 'availability-value', `${vLabel}: availability "${o.availability}" is not a schema.org ItemAvailability value (${AVAILABILITY.join(', ')}).`)
      else if (!isGroup && UNAVAILABLE.includes(avail) && textSaysAvailable && !textSaysUnavailable) add('fail', 'availability-mismatch', `${vLabel}: structured data says ${avail} but the page offers it for sale.`)
      else if (!isGroup && avail === 'InStock' && textSaysUnavailable && !textSaysAvailable) add('fail', 'availability-mismatch', `${vLabel}: structured data says InStock but the page says it is unavailable.`)
      if (!o.shippingDetails && !nodes.some((n) => n.shippingDetails || typeOf(n).includes('OfferShippingDetails'))) add('info', 'shipping', `${vLabel}: no shippingDetails. Shipping cost and delivery time are what shoppers and agents most need before checkout.`)
      if (o.priceValidUntil && Date.parse(o.priceValidUntil) < Date.now()) add('warn', 'price-expired', `${vLabel}: priceValidUntil ${o.priceValidUntil} is in the past.`)
    }
  }
}
if (products.length && !nodes.some((n) => n.hasMerchantReturnPolicy || typeOf(n).includes('MerchantReturnPolicy'))) {
  add('info', 'returns', 'No MerchantReturnPolicy. Declare the store-wide policy once on the Organization, and override per offer only where it differs.')
}
const ratings = nodes.filter((n) => typeOf(n).includes('AggregateRating'))
for (const r of ratings) {
  const value = r.ratingValue
  const count = r.reviewCount ?? r.ratingCount
  if (value != null && !visibleDigits.includes(String(value)) && !visibleDigits.includes(String(value).replace('.', ','))) add('warn', 'rating-visible', `aggregateRating ${value} does not appear on the page. Ratings in markup must be visible to people too.`)
  if (count != null && Number(count) === 0) add('fail', 'rating-empty', 'aggregateRating with zero reviews. Remove it until there are reviews.')
}

// ---------- report ----------
const order = { fail: 0, warn: 1, info: 2 }
findings.sort((a, b) => order[a.level] - order[b.level])
const counts = { fail: 0, warn: 0, info: 0 }
for (const f of findings) counts[f.level]++
if (json) process.stdout.write(JSON.stringify({ target, products: products.length, counts, findings }, null, 2) + '\n')
else {
  process.stdout.write(`${target}: ${products.length} product node(s), ${counts.fail} fail, ${counts.warn} warn, ${counts.info} info\n`)
  for (const f of findings) process.stdout.write(`  ${f.level.toUpperCase().padEnd(4)} ${f.id}: ${f.message}\n`)
}
process.exit(counts.fail ? 1 : 0)
