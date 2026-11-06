# Performance, robustness and the agent reader

Read this when building and shipping. Marketing pages are first-visit pages: no warm cache, often a phone, often a slow network. They are also read by search crawlers and AI assistants that quote what they find.

## Contents

1. Core Web Vitals
2. Images and the hero
3. Fonts
4. Scripts and third parties
5. Motion and scroll effects
6. No-JavaScript and failure states
7. Metadata and structured data
8. What agents need from a landing page
9. Checks

## 1. Core Web Vitals

Google's "good" thresholds, measured at the 75th percentile of page loads, separately for mobile and desktop [S] (web.dev, *Web Vitals*):

| Metric | Measures | Good |
|---|---|---|
| LCP, Largest Contentful Paint | Loading of the main content | 2.5 s or less |
| INP, Interaction to Next Paint | Responsiveness to input | 200 ms or less |
| CLS, Cumulative Layout Shift | Visual stability | 0.1 or less |

These are targets chosen partly for achievability, not thresholds where human perception changes; cite them as Google's targets (`interface-guidelines/references/evidence.md`).

Why it matters commercially: a 2020 study by Deloitte and 55, commissioned by Google, across 37 brands and about 30 million mobile sessions, found a 0.1 s improvement in speed metrics associated with 8.4% more retail conversions and 9.2% higher retail order value [E]. It is correlational and vendor-commissioned; use it as direction, not a forecast.

## 2. Images and the hero

- The hero image or headline is usually the LCP element. Make the hero a real `<img>` (or `<picture>`) in the HTML, not a CSS background or a script-inserted element, so the browser finds it early [S] (web.dev, *Optimize LCP*).
- Give it `fetchpriority="high"` and do not lazy-load it. Lazy-load images below the first screen with `loading="lazy"`.
- Always set `width` and `height` (or `aspect-ratio`) to reserve space and avoid layout shift.
- Serve modern formats (AVIF, WebP) with `srcset` and `sizes` so phones do not download desktop images.
- Alt text says what the image shows that matters to the claim. Decorative images get `alt=""`.
- Product screenshots are content: write alt text that states what the screen shows, or caption them.
- Video heroes: a poster image is the LCP candidate; no autoplay with sound; a pause control; `prefers-reduced-motion` shows the poster.

## 3. Fonts

- Use the brand's faces from `brand-identity`. Load only the weights and subsets the page uses.
- Self-host or preconnect, use `font-display: swap` or `optional`, and preload the one face used in the first screen [P] (web.dev font guidance).
- Pick fallback metrics (`size-adjust`, `ascent-override`) close to the web font so the swap does not shift layout.
- A display face used only at huge sizes can be a subset of the headline's characters.

## 4. Scripts and third parties

- Analytics, chat widgets, A/B testing and tag managers are the usual INP and LCP regressions. Load them after the main content, and question each one.
- Client-side A/B tests that hide the page until a variant loads delay LCP and can flash content; prefer server-side variants [J].
- Avoid shipping a full SPA framework for a static page; render to HTML at build time where possible [J].
- Cookie banners must not cover the main action or the claim on a phone, and must offer decline as prominently as accept.

## 5. Motion and scroll effects

- Motion explains or delights; it never gates content. Elements start visible and animate in only when script and motion are allowed [J].
- Respect `prefers-reduced-motion: reduce`: no parallax, no scroll-jacking, no large movement; keep fades short or remove them [S] (WCAG 2.3.3, advisory).
- Moving, blinking or auto-updating content that lasts over 5 seconds needs a pause, stop or hide control [S] (WCAG 2.2.2).
- No auto-advancing carousels for key messages [P]. In NN/g testing a rotating hero, changing every 5 seconds, showed a discount only 20% of the time and a user concluded there were no deals (Nielsen 2013).
- Scroll-jacking (taking over scroll speed or direction) breaks keyboard, assistive tech and agent scrolling [J].
- Animate `transform` and `opacity`, not layout properties, to keep INP and CLS low.

## 6. No-JavaScript and failure states

Load the page with JavaScript disabled. The claim, product images, prices, and a working route to the primary action (a link or a server-handled form) must remain [J]. Many agents and crawlers fetch HTML without running scripts, or snapshot before hydration.

States to build and screenshot: form invalid, form submitted, server error, waitlist closed, sold out or event full, region not supported, and any embedded demo failing to load (show a still and a sentence, not a blank box).

## 7. Metadata and structured data

- `<title>`: the product and its category, not just the brand name. Matches the `h1` in substance.
- `<meta name="description">`: the claim in one or two sentences.
- Open Graph and Twitter card tags (`og:title`, `og:description`, `og:image` at 1200x630, `og:url`) so links shared in chat and social look right [S] (Open Graph protocol).
- `lang` on `<html>`; canonical URL; favicon from `brand-identity`.
- JSON-LD that mirrors what is visible [S] (schema.org; Google Search structured data guidelines require markup to describe visible content):
  - `Organization` with name, logo, url, `sameAs` profiles.
  - `SoftwareApplication` or `Product` with `offers` (price, priceCurrency) matching the pricing table, when there is a price.
  - `FAQPage` only for a real FAQ visible on the page.
  - `Event` for event pages, with start date, time zone offset, location and offers.
- Do not mark up ratings, reviews or prices that are not on the page. Adding markup to a page without fixing its meaning did not help agents in testing (Affora, cited in `interface-guidelines/references/agent-surfaces.md`).
- `llms.txt` is an informal proposal. It may help some tools; it is not a substitute for a page whose meaning is in the HTML [J].

## 8. What agents need from a landing page

An assistant asked "which of these tools is cheapest for a team of 10, and can I try it free?" will read the page through its accessibility tree or raw HTML. It needs:

- What the product is, in category words, in the first heading or paragraph.
- Each plan's name, price, currency, period, limits and trial terms as text in a real table.
- The primary action as a native `<a>` or `<button>` with an outcome label, unique on the page ("Start free trial" once in the hero, and the pricing-table buttons named per plan: "Start Pro trial").
- Platform, integration and region facts as lists, not logos alone (logo images need alt text naming the integration).
- Contact and support routes as links.
- No content that exists only in canvas, video, or images of text.
- No text addressed to AI models. It looks exactly like prompt injection, and hidden text is treated as spam by search engines.

## 9. Checks

```bash
node <interface-guidelines>/scripts/audit.mjs <dist|url> --out audit-output
npx lighthouse <url> --form-factor=mobile --only-categories=performance,accessibility,seo --output=html
```

Then: view the page source (not the DOM) to confirm the claim, prices and JSON-LD are in the initial HTML; run Google's Rich Results Test on any structured data; disable JavaScript and reload; emulate reduced motion and reload.
