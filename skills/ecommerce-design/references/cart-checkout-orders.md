# Cart, checkout and orders

Detail for the money path. Field-level form rules (labels, validation timing, autocomplete tokens, error summaries) live in `form-design`; this file covers what is specific to stores. Tags as in `CONTRIBUTING.md`; sources in `sources.md`.

## Contents

1. Why shoppers leave
2. Cart
3. Checkout structure
4. Accounts
5. Fields
6. Delivery and payment
7. Placing the order
8. Confirmation, status, changes and returns
9. Agents in the money path

## 1. Why shoppers leave

Baymard's survey of US shoppers who abandoned during checkout (excluding "just browsing") [E]:

| Reason | Share |
|---|---|
| Extra costs too high (shipping, tax, fees) | 40% |
| Delivery too slow | 20% |
| Did not trust the site with card details | 19% |
| Site required an account | 18% |
| Checkout too long or complicated | 17% |
| Website errors or crashes | 17% |
| Unsatisfactory returns policy | 13% |
| Could not see or calculate the total up front | 12% |
| Card declined | 10% |
| Not enough payment methods | 9% |

Average documented cart abandonment is about 70% across 50 studies (2006-2025) [E], much of it browsing; design for the fixable share above. Most of these are honesty and clarity problems, not visual ones.

## 2. Cart

- Line items: image, name, chosen variant in words, unit price, quantity control, line total, remove [J].
- Quantity: minus and plus buttons around an editable number field (95% of sites miss this) [P]. Debounce updates; show the new totals in place and announce them politely.
- Totals: subtotal, discounts, shipping (or "calculated from postcode" with an estimate), tax, fees, total. Each labelled; each estimate marked as an estimate [J].
- Shipping estimate before checkout: postcode or country selector in the cart, remembered [J].
- Coupon behind a link (35% show it open) [P].
- Price or stock changed since adding: a message on that line in words ("Price dropped from £52 to £48", "Only 1 left, quantity reduced from 2") [J].
- Gifting in the cart if the store sells gifts (68% lack it) [P].
- Empty cart: say it is empty and offer the way back, recently viewed items, or saved items [J].

## 3. Checkout structure

- Average checkout is 5.1 steps; field count matters more than step count, and problems rise beyond about 8 steps [P] (Baymard 2024).
- Accordion or multi-step: collapse completed steps into readable summaries with an edit link (72% fail) [P].
- Order summary with total visible at every step, collapsible on phones but showing the total when collapsed [J].
- Keep entered data through back, reload, payment failure and session refresh [J]. Losing a form is the most expensive error a store can make.
- No unrelated navigation or promotions inside checkout [J]. Keep a way back to the cart.

## 4. Accounts

- Guest checkout is the first and most prominent option at the account step [P] (47% of sites with guest checkout fail to make it prominent, Baymard).
- Offer account creation after the order, on the confirmation page, needing only a password since details are known (84% do not delay it, Baymard 2024; 56% offer it too early, Baymard 2024 checkout benchmark) [P].
- Returning customers can sign in, and passkeys or email links reduce password friction [J]. Never require sign-in to see the price or the delivery date.

## 5. Fields

Baymard's 2024 count: 11.3 fields on average, 8 needed [P]. The five largest savings:

1. One "Full name" field instead of first and last (89% split them).
2. Address line 2 behind a link (75% show it).
3. Coupon behind a link (35% show it).
4. Billing address same as shipping by default, fields hidden (24% do not).
5. Account creation delayed to confirmation (84% do not).

Also [P]: mark both required and optional fields (50% do not); explain why a phone number is needed or make it optional (47% require it unexplained); use address lookup with manual entry always available; error messages adapt to the actual problem, not a generic "invalid" (98% of sites fall short on adaptive messages).

Use `autocomplete` tokens on every field (`name`, `shipping street-address`, `postal-code`, `email`, `tel`, `cc-number`) [S] (WCAG 1.3.5, HTML autofill).

## 6. Delivery and payment

- Delivery options show the date range and price for each, and include every fulfilment method (pickup, lockers) in one selector (53% split them) [P]. Prefer a countdown to the cut-off over a static time (83% use static) [P].
- Payment methods visible before the payment step, ideally in the cart [J].
- Wallets (Apple Pay, Google Pay, PayPal) as alternatives, not replacements; the card form remains available [J].
- Card fields: one number field with spacing as typed, card type detected and shown, expiry as MM/YY, security code with a short explanation [J].
- 3-D Secure and wallet popups: keep the checkout page intact behind them and handle cancel and timeout with a clear message [J].
- Declined payment: say it was declined, that no money was taken, and what to try (another card, contact bank). Keep everything else filled [J].

## 7. Placing the order

- The final button names the action and amount: "Pay £54.20" or "Place order, £54.20" [J]. Show the full summary (items, delivery address, date, payment method, total) directly above it.
- Disable the button while submitting and show progress in text. On the server, accept an idempotency key per checkout so repeated requests create one order and one charge [S] (Stripe, *Idempotent requests*).
- If the result is unknown (network drop), check status before offering to retry; never invite a second charge [J].
- Legal text required at this step (terms, withdrawal right in the EU) as links, readable without leaving checkout [S] (Consumer Rights Directive 2011/83/EU Art. 8: the button must say the order implies an obligation to pay, for example "Order with obligation to pay" or an equivalent unambiguous wording).

## 8. Confirmation, status, changes and returns

- Confirmation page: order number, items, total charged, payment method (last four digits), delivery address and date, what happens next, link to order status, and the confirmation email address [J]. Offer account creation here.
- Order status page: a list of events with timestamps and time zone, carrier and tracking link, current state in words, and the next expected event [J]. Reachable by a link without signing in (order number plus email) for guests.
- Changes: cancel or edit within a stated window, with the window shown ("You can cancel until 18:00 today") [J].
- Returns: start from the order, choose items and reason, see refund amount and method and any fee before confirming, get a label or drop-off code [J]. Make returning as easy as buying; obstruction is a dark pattern [E] (Luguri and Strahilevitz 2021).
- Subscriptions: cancel online, as easily as signing up [S]. US federal law (the Restore Online Shoppers' Confidence Act) requires a simple cancellation mechanism, and several US states and EU countries require online cancellation; check the market.

## 9. Agents in the money path

- Agents may browse, compare, filter, fill carts and reach the payment step. Payment, saved-card use, and address changes are consequential and irreversible actions: the store should require the person's confirmation through its own authenticated step, not through a dialog an agent can click (`interface-guidelines/references/oversight-and-safety.md`).
- Every cart and checkout fact appears as labelled text in the tree: line names, variants, quantities, prices, discounts, shipping, tax, total.
- Errors say what to change in words next to the field, so an agent can recover.
- Rate limits and bot defences should not block assistive technology; CAPTCHAs only after other signals, with an accessible alternative [S] (W3C, *Inaccessibility of CAPTCHA*).
