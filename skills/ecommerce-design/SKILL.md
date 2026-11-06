---
name: ecommerce-design
description: Design, build and review online stores that shoppers can use and shopping agents can read and operate - storefronts, category and search results, filters and sorting, product detail pages, variants, cart, checkout, order confirmation, order status, returns. Grounded in Baymard Institute research, WCAG, consumer-protection law on pricing and reviews, and schema.org Product and Offer data. Use whenever someone asks for "a shop", "an online store", "a product page", "Shopify theme", "checkout flow", "my cart conversion is bad", "add filters", "order tracking page", or wants a store made readable by AI shopping assistants, even if they never say e-commerce. Leans on `form-design` for field-level checkout forms. Not for marketing pages without a cart (`landing-page-design`), order and receipt emails (`email-design`), or internal admin and inventory tools (`web-app-design`).
---

# E-commerce design

A store exists so a shopper can find the right product, trust what it costs and when it arrives, and pay without surprises; then see what happens to the order. The usual model failure is a handsome catalogue that hides the facts people buy on: total cost revealed only at the last step, sizes in an unlabeled custom dropdown, a checkout that demands an account, delivery shown as "3-5 business days" instead of a date, and structured data that disagrees with the page. Baymard's long-running benchmarks find these on most large sites, so a model copying common practice copies the problems.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first.

## Brief

- **Shoppers:** new or returning, phone or desktop, how they arrive (search, ads, marketplace, an assistant).
- **Catalogue:** size, variants (size, colour, configuration), attributes that decide a purchase in each category.
- **Money facts:** currencies, tax display rules per market, shipping rates and thresholds, fees, discounts, returns policy.
- **Delivery facts:** carriers, cut-off times, regions, pickup, what date can honestly be promised.
- **Accounts:** what an account gives the shopper; guest checkout is the default.
- **Payments:** methods, wallets, buy-now-pay-later, 3-D Secure, failure paths.
- **Post-purchase:** order status source, cancellation window, returns flow.
- **Agent readers:** shopping assistants comparing products, agents filling carts, search engines reading product data. Which actions may an agent take without the person?
- **Legal markets:** EU price-reduction rules, US fee and review rules, accessibility law (the European Accessibility Act applies to e-commerce from 28 June 2025).

## Rules

### Finding products

- **Filter by every attribute shown in list items, plus the category's own attributes** [P]. 38% of sites do not filter by attributes they display (Baymard). In Baymard's 19-site test, sites with poor list tools saw 67-90% task abandonment against 17-33% on better ones [E].
- **Show applied filters as a removable list above results, and keep the result count visible** [P] (Baymard: 32% of sites lack an applied-filter overview). Promote the two or three decisive filters above the list on mobile.
- **Offer sorting by price, rating, best-selling and newest** [P] (Baymard: 64% do not offer all four). Never let a sort silently drop items without ratings.
- **Load more beats both pagination and infinite scroll for product lists** [E] (Baymard 2016 testing). Whatever you choose, keep list state (filters, sort, page, scroll anchor) in the URL so Back returns the shopper to the same place.
- **Search tolerates misspellings, synonyms and SKUs, and a no-results page offers next steps** [J]. Zero results is a dead end for people and agents alike.
- **List items carry the facts that decide the click**: name, price with currency, the key variant facts, availability, rating with count [J].

### Product page

- **Price, availability and an estimated total near the buy button** [P]: 67% of sites give no total-cost estimate near the buy section (Baymard). Show shipping cost or the free-shipping rule there, not only in a site banner.
- **Delivery as a date with a cut-off** ("Arrives Thu 14 Nov if ordered in the next 3 h"), not a speed [P] (Baymard: 48% show speed instead of date).
- **Variants are visible, native, enumerable controls** [P][S]. Size buttons beat dropdowns (57% of sites get this wrong, Baymard). Use a radio group or native `<select>` so every option is in the accessibility tree; unavailable options stay listed with "Out of stock" in text, not just struck through.
- **Choosing a variant updates price, availability, images and URL** [J], announces the change in a polite live region, and survives reload.
- **Images include one in scale, and on-model for worn goods** [P] (Baymard: 37% and 23% of sites miss them). Alt text names what each image shows.
- **Unit price for goods sold in varying quantities** [P] (81% miss it, Baymard); it is a legal requirement in the EU for many goods [S] (Directive 98/6/EC).
- **Return policy summarized and linked in the product content** [P] (44% do not, Baymard).
- **Reviews are real, sortable, and include the negative ones** [S]. Fake or AI-written reviews and review suppression are banned in the US (FTC 16 CFR Part 465). Show the count and distribution beside the average.
- **Save for later without an account** [P] (89% of sites fail this, Baymard).

### Cart

- **Show the running total with shipping, tax and fees estimated, and say when an amount is an estimate** [E]. "Extra costs too high" is the top reason US shoppers abandon checkout (40%), and 12% leave because they cannot see the total up front (Baymard survey).
- **Quantity is buttons plus an editable field** [P] (95% of sites miss this, Baymard). Changing quantity updates line and total in place.
- **Removing a line is undoable in place** [J], not behind a confirmation dialog.
- **Coupon fields sit behind a link** [P] (35% of sites show them open, Baymard 2024). An open empty box invites shoppers to leave and hunt for codes.
- **Stock or price changes since adding are stated in words on the line item** [J], never applied silently.

### Checkout

Field-level rules belong to `form-design`. Store-specific rules:

- **Guest checkout first and most prominent; offer an account at confirmation** [E][P]. 18% abandon when forced to create an account (Baymard survey). Baymard finds 47% of sites with guest checkout do not make it prominent, and 84% do not delay account creation to the end.
- **Ask for less** [P]. The average US checkout has 11.3 fields where 8 would do (Baymard 2024): one full-name field, address line 2 behind a link, billing same as shipping by default, phone only with a stated reason.
- **Mark both required and optional fields** [P] (50% of sites do not, Baymard).
- **Show delivery options as dates with prices, and the order total at every step** [P].
- **Final button states the action and amount**: "Pay £54.20", not "Continue" [J]. The server must treat repeated submissions of one order as one (idempotency key) so a double click or an agent retry cannot charge twice.
- **Payment errors say what failed and what to try** without clearing the form [J]. A declined card is not a validation error on the card number field.
- **Trust comes from clarity, not badges** [J]. 19% abandon from distrust with card details (Baymard survey): show the total, the merchant name, accepted methods, the returns rule and a contact route.

### After purchase

- **Confirmation page and email carry the order number, items, total paid, delivery date, address and next step** [J], and a link to a status page that stays valid.
- **Order status is a page with words and times** ("Shipped 12 Nov 09:40 GMT, Royal Mail, tracking QX123"), not a progress bar alone [J].
- **Cancellation and returns are reachable from the order** in as few steps as purchase took [J]. Obstruction is among the most effective dark patterns (Luguri and Strahilevitz 2021) [E].

### Honest selling

- **No fake urgency, scarcity or social proof** [E]. Mathur et al. (2019) found deceptive countdowns, false low-stock messages and fabricated activity notices on shopping sites at scale. Web agents fall for such patterns too (41% average across six agents, Ersoy et al. 2025, preprint).
- **Discounts show the real prior price** [S]. EU: the lowest price of the prior 30 days (98/6/EC Art. 6a).
- **All-in prices** where the law requires them [S] (US FTC fee rule for tickets and lodging, 16 CFR Part 464), and as the honest default everywhere.
- **No preticked add-ons, insurance, donations or subscriptions** [S] (EU Consumer Rights Directive 2011/83/EU Art. 22 bans preticked boxes for extra payments).

### The agent reader

- **Product data in the initial HTML as JSON-LD `Product` with a single `Offer`**: name, image, price above zero, ISO 4217 currency, availability, plus shipping details and a return policy [S] (Google merchant listing docs). It must match the visible page exactly; a mismatch makes an assistant quote a price the store will not honour.
- **Variant groups as `ProductGroup` with `hasVariant` and `variesBy`** [S], each variant with its own offer.
- **Everything an agent needs to act is in the accessibility tree**: variant options enumerable, cart lines as a list or table with names, quantities and prices in text, totals labelled ("Order total, including VAT: £54.20") [J].
- **Agent checkout protocols** (OpenAI and Stripe's Agentic Commerce Protocol, 2025; Google's Universal Commerce Protocol, 2026) are emerging [S, status]. Add them only on request; they need the same truthful price, stock and policy data, and payment approval stays with the person.

## Build order

1. Brief, including money and delivery facts as data, not copy.
2. Product data model and JSON-LD from the same source the page renders from.
3. Listing: semantic list items, filters as native controls in a form, URL state, counts.
4. Product page: price block, variants, delivery date, returns, reviews, structured data.
5. Cart with live totals and estimates labelled.
6. Checkout with `form-design`: guest first, minimum fields, idempotent submit.
7. Confirmation, order status, cancellation, returns.
8. States: out of stock, partial stock, price changed, region not shipped, payment failed, session expired, empty cart, no results.
9. Brand tokens from `brand-identity`; then verify.

## Verify

- `node <interface-guidelines>/scripts/audit.mjs <url|dist> --out audit-output` on a listing, a product, the cart and each checkout step.
- `node <this-skill>/scripts/check-product-data.mjs <product-url|file>` on several products, including a sold-out one and one with variants. It fetches without JavaScript, checks Offer fields against Google's requirements, and checks that the structured price and availability match the visible text.
- **Totals test:** for a basket with a discount, a shipping threshold and two tax rates, confirm every displayed total is computed from the lines and equals what the payment step charges.
- **Agent test:** from the accessibility snapshot only, filter to a size, pick a variant, add two, read the total including shipping, and reach the payment step. Stop there; do not submit payment.
- **Phone test:** the whole purchase at 375 px by touch, and by keyboard on desktop.
- **Stress:** long product names, 40 variants, zero reviews, out-of-stock variant preselected from a shared link, currency with no minor unit (JPY).

## Traps

- Total cost, shipping or fees first appearing at the payment step.
- Custom size dropdowns or colour swatches with no names: invisible choices to screen readers and agents.
- "In stock" in JSON-LD while the page says sold out, or prices in markup that lag a sale.
- Forced account creation, or guest checkout as a small link under a big sign-in form.
- Fake countdown timers, "12 people are viewing this", "only 2 left" that never changes.
- Struck-through "was" prices with no real prior price.
- A "Place order" button that does not say the amount, and a server that charges twice on retry.
- Infinite scroll that loses the shopper's position on Back.
- Generated placeholder reviews or ratings left in a demo store that ships.

## References

| File | Read when |
|---|---|
| `references/browse-and-product.md` | Building listing, search, filters, product pages, variants, reviews |
| `references/cart-checkout-orders.md` | Building cart, checkout, payment errors, confirmation, order status, returns |
| `references/product-data.md` | Writing JSON-LD, variants, shipping and return markup, agent commerce protocols |
| `references/sources.md` | Before citing a number, or when someone asks why |
