---
name: landing-page-design
description: Design and build marketing pages that people remember and understand, and that agents can read accurately - product and launch pages, homepages for a product or studio, pricing pages, waitlists, feature pages, one-pagers, event and campaign pages. Covers art direction (a concept drawn from the subject, one memorable idea, composition), message and page structure, honest proof, pricing, sign-up and waitlist flows, and speed. Use whenever someone asks for a landing page, "a site for my app", "a page to announce X", "make our homepage less generic", "a pricing page", "a coming-soon page", or wants an existing marketing page redesigned or critiqued, even if they only say "make it look good". Consumes brand tokens from `brand-identity` and does not invent logos, palettes or type systems; run that skill first when no brand exists. Not for product UI behind a login (`web-app-design`), docs or blogs (`content-site-design`), storefronts and checkout (`ecommerce-design`), or HTML email (`email-design`).
---

# Landing page design

A landing page has one job: get a particular stranger to understand what this is, believe it, and take one next step. It earns attention with a distinct idea and keeps it with plain facts. Models get it wrong in two opposite ways. Most often they produce the interchangeable page: a vague headline, three icon cards, invented testimonials and a logo wall, in a style picked to look current. Told to avoid that, they chase "AI tells" and swap one set of fashionable devices for another. The fix for both is the same: start from the subject, say something specific and true, and give the page one idea that only this product could own.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first.

## Brief

Answer these in under 20 lines before any layout. If the user is away, state assumptions and continue.

- **Who arrives, from where, knowing what?** An ad click, a search for the problem, a friend's link, an investor. Their prior knowledge sets how much the first screen must explain.
- **The one next step** and what it costs them: email, card, a call, a download. Everything else on the page is secondary.
- **The claim:** one sentence saying what it is, for whom, and what changes for them. If you cannot write it, the page is not ready to design.
- **Proof on hand:** real customers, quotes with permission, numbers with a source and date, a demo, a free tier. List what exists. Missing proof is a gap to mark, not to fill.
- **Price:** public, starting-from, representative cases, or genuinely unknown.
- **Brand state:** does `brand-identity` output exist (tokens, logo, type, voice)? If not, run it first, or work from a provisional direction and say so.
- **The subject's own material:** what the product, its users and its world actually look like (section "Art direction").
- **Agent reader:** will assistants compare this product, quote its price, or sign someone up? Assume yes.
- **Constraints:** stack, CMS, performance budget, languages, legal (regulated claims, pricing law, consent).

## Art direction

The family does not prescribe a look. Bold, strange, quiet and maximal are all allowed. What is required is that the look comes from a decision about this subject, and that it leaves the floor intact (readable, fast, operable). Do this step in writing before code; `references/art-direction.md` has the method and worked examples.

1. **Gather the subject's material** [J]. List 10 to 20 concrete nouns from the product and its world: objects it handles, what users make with it, places, artefacts, sounds, textures, the domain's own visual language (a tide table, a recipe card, a circuit trace, a shipping label). Generic words ("speed", "innovation", "seamless") do not count.
2. **Find the concept** [J]. One sentence that turns that material into a page idea: "the page is the product's own output", "a field guide", "a departures board for your deploys". Apply the swap test: if a competitor could use the concept unchanged, rewrite it.
3. **Pick one memorable move** [J]. One element carries the concept and gets the boldness budget: a real product moment shown large, a working demo, a typographic gesture from the brand, an object you can handle, a photograph only this company could take. Everything else serves reading. A page with five signature moves has none.
4. **Compose** [J]. Decide the reading path of each screen: where the eye lands first, second, third, and what size and contrast make that happen. Set the grid, then break it once, on purpose. Design the phone composition as its own layout, not a collapsed desktop.
5. **Pitch two or three directions** in a few lines each (concept, signature move, how brand tokens are used, the risk), pick one, and say why. Directions should differ in idea, not just palette.

**Brand boundary.** Colors, type, logo, voice and tokens come from `brand-identity` (its `tokens.css` or `tokens.json`). Art direction decides how this page uses them: scale, crop, density, rhythm, imagery, motion. Do not add new brand colors, redraw the logo, or swap typefaces for one page. If the page needs something the brand lacks (an illustration style, a photographic direction), note it as a brand gap and propose it to the brand owner.

**Taste is not evidence.** Removing gradients, eyebrows or a particular font does not make a page better: taste-skill's own blind tests won 4 of 16 brief-rounds against no skill despite zero detector failures, and its model judges kept preferring richer pages full of template devices [E, model jurors only]. So judge directions by the swap test and the reader's task, not by a list of banned devices.

## Rules

### Message

- **The first screen states what it is, for whom, and the next step, in words a stranger understands** [E]. Visitors decide to leave within the first 10 to 20 seconds (Liu, White, Dumais 2010, via NN/g), and the first screenful gets about 57% of viewing time (NN/g 2018, n=120). A clever line can lead, but a plain descriptive line must sit right beside it.
- **The `h1` is the claim, not the brand name or a greeting** [S]. It is the page's outline root for screen readers and agents (WCAG 2.4.6).
- **Concrete beats promotional** [E]. Concise, scannable, objective copy scored 124% better on usability than promotional copy (Nielsen 1997, n=51; old, but the direction has held). Say "Sends invoices from your timesheets", not "Supercharge your workflow".
- **Every section makes one claim and shows its proof; delete sections without one** [J]. Write the page as a list of claims before designing it (an idea borrowed from taste-skill).
- **Show the product itself** [J]: real screens, real output, real photographs. A drawn abstraction of "productivity" says nothing and an invented UI misrepresents the product.
- **People scroll, so avoid false floors** [P]. Below the first screen, attention falls off but does not vanish (NN/g 2018). A full-bleed hero that looks complete hides everything after it.

### Proof and honesty

- **Only real proof** [S]. Fake or AI-generated reviews and testimonials are unlawful in the US (FTC 16 CFR Part 465, 2024), and endorsements must reflect real experience (FTC Endorsement Guides, 16 CFR Part 255). Logos only with permission and only of actual customers.
- **When proof is missing, mark it** [J]. Use visible placeholders such as `{{quote: customer, name, role}}` and list them in the hand-off. Never write a convincing fake to fill the gap.
- **Numbers carry a source and a date** [J]. "12,000 teams" needs "as of March 2026". A number nobody can check is decoration at best.
- **No manufactured urgency** [E]. Fake countdowns and false scarcity were among the deceptive patterns found at scale (Mathur et al. 2019), and they also mislead agents: six web agents fell for dark patterns 41% of the time on average (Ersoy et al. 2025, preprint).

### Pricing

- **Show prices** [P]. Missing prices drive buyers to competitors (Nielsen 2002). When price truly varies, show representative cases with their prices (Nielsen 2006).
- **Prices are text**: amount, currency, period, and what is included, never only inside an image [J]. Plan comparison is a real `<table>` with features in words.
- **State the total a buyer will pay**, including mandatory fees [S]. US law requires it for live-event tickets and short-term lodging (FTC Rule on Unfair or Deceptive Fees, 2025); elsewhere it is honest practice. EU discount claims must show the lowest price of the prior 30 days (Directive 98/6/EC, Art. 6a).
- **Billing toggles show state and default** [J]. If annual pricing is shown by default, say "billed annually" beside the number.

### Next step

- **One primary action, repeated at decision points, labelled with what happens** [J]: "Start a 14-day trial, no card", "Join the waitlist". Secondary actions look secondary.
- **Waitlist and sign-up forms ask for the minimum and say what follows** [J]: what they get, when, and how often you will email. Consent boxes start unticked. Hand longer flows to `form-design`.
- **Success is a state, not a toast** [J]. After submit, replace the form with what happened and what to expect.

### Speed and robustness

- **Meet Google's Core Web Vitals at the 75th percentile: LCP 2.5 s, INP 200 ms, CLS 0.1** [S]. These are targets partly set by achievability, not thresholds of human perception. Faster mobile pages correlated with higher retail conversion in a Google-commissioned study (Deloitte 2020) [E, correlational].
- **The hero is usually the LCP element** [S]: a real `<img>` with `width`, `height` and `fetchpriority="high"`, never lazy-loaded, never a CSS background behind text that waits on script (web.dev).
- **Content is visible without JavaScript and without motion** [J]. Scroll reveals start from the visible state and animate only when supported; with reduced motion, nothing hides. Agents and screenshots otherwise get blanks.
- **No auto-advancing carousels** [P]. Rotating heroes hid the offer from users in testing (Nielsen 2013), and motion over 5 seconds needs a pause control (WCAG 2.2.2).

### The agent reader

- **Facts an assistant will quote are text on the page**: what it is, price, plan limits, platforms, trial terms, contact [J]. Agents compare products from exactly these.
- **Structured data and meta tags mirror the visible page and add nothing** [S]: `title`, meta description, Open Graph, and JSON-LD (`Organization`, `SoftwareApplication` or `Product`) with the same price and name the page shows. Bolted-on markup did not help agents in testing (Affora, in `interface-guidelines`).
- **No text addressed to AI agents**, hidden or visible [J]. It reads as prompt injection, and hidden text is a spam signal.

## Build order

1. Brief, then the claims-and-proof list, with placeholders for gaps.
2. Art direction: subject material, concept, one move, two or three pitches, choice.
3. Text wireframe: sections in order, each with its claim, proof and action.
4. Semantic HTML with real copy: one `h1`, landmarks, headings that outline the argument, pricing table, forms with labels.
5. Brand tokens from `brand-identity`, then layout and the signature move.
6. States: form validation, success, failure, sold out or closed waitlist, no-JS, reduced motion.
7. Images, fonts and scripts within the performance budget.
8. Verify, fix at most twice, hand off.

## Verify

- `node <interface-guidelines>/scripts/audit.mjs <dist|url> --out audit-output`, then look at every screenshot at all three widths, in light and dark if both exist.
- **First-screen test:** show only the first-screen screenshot to someone (or a fresh agent with no context) and ask what it is, who it is for, and what to do next. Wrong answers mean the message failed, however good it looks.
- **Swap test:** replace the product name with a competitor's. If the page still works, the concept and copy are generic.
- **Agent test:** from the accessibility snapshot alone, read each plan's price and limits, and complete the sign-up. Compare with the JSON-LD.
- **Speed:** Lighthouse or PageSpeed Insights on a throttled mobile profile; field data (CrUX) if the page is live.
- **Robustness:** load with JavaScript disabled and with `prefers-reduced-motion: reduce`. Nothing important may be missing.
- **Proof audit:** every quote, logo, number and rating traced to a source, or shown as a marked placeholder.

## Traps

- Invented testimonials, logo walls of companies that are not customers, made-up user counts or ratings.
- A headline that could sit on any product ("Build the future of work"), with the real explanation three screens down.
- Chasing or banning "AI tells" instead of deciding from the subject. A new list of fashionable replacements is the next tell.
- Decoration quotas: motion everywhere, a picture in every section, a different layout per section for its own sake.
- Hero copy or the CTA hidden until a scroll animation fires; low-opacity "reveal" text that fails contrast until then.
- Price only in an image, or "Contact us" with no indication of scale.
- Redefining brand colors or redrawing the logo for one page instead of using `brand-identity` tokens.
- A pricing toggle that silently shows annual-per-month figures.
- An instruction to AI assistants hidden in the page.

## References

| File | Read when |
|---|---|
| `references/art-direction.md` | Always, before choosing a look: method, worked examples, composition, using brand tokens, judging directions |
| `references/structure-and-copy.md` | Writing the page: section patterns by page type, headlines, proof, pricing pages, waitlists, forms |
| `references/performance-and-agents.md` | Building and shipping: Core Web Vitals, images, fonts, motion, metadata, structured data, no-JS |
| `references/sources.md` | Before citing a number, or when someone asks why a rule exists |
