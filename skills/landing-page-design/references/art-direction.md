# Art direction for landing pages

Read this before choosing a look. It turns "make it distinctive" into steps an agent can carry out and a reviewer can check. Nothing here sets a style: the same method can end in a quiet typographic page or a loud illustrated one.

## Contents

1. Why a method instead of a style
2. Step 1: the subject's material
3. Step 2: the concept
4. Step 3: one memorable move
5. Step 4: composition
6. Step 5: pitching directions
7. Working inside the brand
8. Worked examples
9. Judging a direction
10. The floor that boldness must keep

## 1. Why a method instead of a style

Generic pages come from starting at the style ("modern SaaS", "editorial", "brutalist") and filling it with the product's name. The look then belongs to the style, so any competitor could use it unchanged. Lists of banned devices do not fix this: in the AI-era skill corpus, each published list of replacements became the next tell, and the sources contradict each other on almost every device (gradients, eyebrows, fonts, blur). Across 68 catalogued tells, about two thirds had no clean usability basis (see `interface-guidelines/references/evidence.md`).

A distinctive page starts from the subject instead. Its look is an argument about this product, which is why it cannot be swapped.

## 2. Step 1: the subject's material

Write a list of 10 to 20 concrete things from the product's world. Look in four places:

- **The product's objects and outputs:** what it handles or produces (invoices, waveforms, seed packets, pull requests, floor plans).
- **The user's world:** where and how they work, the tools on their desk, the documents they already trust.
- **The domain's visual language:** forms, charts, signage and artefacts the field already uses (tide tables, nautical charts, lab notebooks, transit maps, cooking timers, ledgers).
- **The company's own assets:** real photography, the founder's sketches, the hardware, the office, the actual interface.

Reject abstractions ("speed", "trust", "innovation", "the future") and stock metaphors (rockets, lightbulbs, puzzle pieces, handshakes). They belong to everyone.

## 3. Step 2: the concept

Combine the material into one sentence that says what the page is, as an idea. Useful shapes:

| Shape | Example |
|---|---|
| The page is the product's output | A typesetting tool whose page is set as a specimen sheet in its own engine |
| The page borrows a domain artefact | A deploy tool's page structured as a departures board, each section a "gate" |
| The page shows the before and after | A noise-cancelling app where the page literally gets quieter as you scroll |
| The page is a specimen of the material | A bakery's page built around flour weights and proofing times |
| The page is a working sample | A form builder whose hero is a live form you can fill in |

Test it with the **swap test**: put a competitor's name on it. If it still fits, it is a category concept, not this product's. Then test it against the brief: does the concept make the claim easier to understand, or does it bury it? A clever concept that hides what the product does fails the page's job.

## 4. Step 3: one memorable move

Choose the single element that carries the concept and gets the boldness budget. Examples: a huge real product moment, a demo that works on the page, one typographic gesture taken from the brand system, a photographic series only this company could shoot, an object you can drag or turn, a data visualization of the product's real output.

Spend boldness there and let the rest of the page be calm and readable. A memorable page usually has one thing people describe afterwards ("the one with the departures board"). Several competing signature moves cancel out and cost speed.

The move must survive three conditions: phone width, reduced motion, and no JavaScript. Design what it becomes in each, not just whether it disappears.

## 5. Step 4: composition

- **Reading path.** For each screen, decide what is read first, second and third, and use size, weight, contrast and space to make that happen. Visual order must match DOM order: screen readers and agents read the DOM, and WCAG 1.3.2 requires a meaningful sequence.
- **Scale contrast.** Distinct pages usually have a wide gap between their largest and smallest elements. Uniform medium sizes read as a template.
- **Grid, then one break.** Set a grid that suits the content, then break it once where the concept needs emphasis. Breaking it everywhere is no grid.
- **Rhythm.** Vary section density deliberately: a dense proof section after a sparse claim. Do not vary layout per section just to avoid repetition; consistent structure helps reading.
- **Phone first as a composition.** On a phone, the first screen is about 390 by 700 CSS px. Compose it: what fits, in what order, how large. A desktop hero squeezed into a column usually pushes the claim below the fold.
- **Imagery.** Prefer the product's real material. If illustration is needed and the brand has no illustration style, flag it as a brand gap rather than inventing one.

## 6. Step 5: pitching directions

Write two or three directions before building. Each pitch has five lines:

```
Concept:      the page is a field guide to the birds in your garden
Signature:    a hand-drawn plate per species, captioned with real sightings from the app
Brand use:    brand serif at display sizes for plate captions; accent only on the sign-up action
Composition:  plates in a two-column catalogue on desktop, one per screen on phone
Risk:         illustration cost; plates must load fast and degrade to captions
```

Directions must differ in idea, not in palette. Pick one and state why in a sentence tied to the reader and claim. If the user is present, show the pitches and let them choose.

## 7. Working inside the brand

`brand-identity` owns color, type, logo, voice, and the tokens file (`tokens.css` with custom properties for light and dark, and `tokens.json` in the W3C Design Tokens format). This page:

- **Uses** the tokens as given: semantic roles for text, surface, accent, status. Contrast pairs were checked there; keep the pairs together.
- **Decides** scale, crop, density, rhythm, imagery, motion, and which brand elements get emphasis on this page.
- **Does not** add brand colors, alter the logo, switch typefaces, or set a new voice. If the concept needs one more color or an illustration style, write it down as a request to the brand owner and use a token in the meantime.

When no brand exists and the user wants a page now, build on a minimal provisional set (one typeface or a system stack, one accent, neutrals), label it provisional in the hand-off, and suggest running `brand-identity`.

## 8. Worked examples

These show the method, not looks to copy.

**Weekly vegetable box, small farm.** Material: crates, soil, the delivery van, handwritten crop notes, a weekly harvest list, the farm's fields by season. Concept: the page is this week's harvest note. Move: the hero is the actual list of what is in this week's box, set large, with a real photograph of the crate; it changes weekly. Composition: the list dominates the first screen; price per box and the subscribe action sit directly under it. Why it beats the generic version ("Fresh, local, sustainable" over a stock salad): it answers "what would I get?" in the first screen, and no other farm can use it.

**Database migration CLI.** Material: terminal sessions, schema diffs, rollbacks, the 3 a.m. pager. Concept: the page is a migration that succeeds. Move: a real recorded run (text, not video) that plays a diff, a dry-run and a rollback, with each step captioned. Static and reduced-motion versions show the final transcript. Why: developers trust real output over adjectives, and an agent can read the transcript.

**Independent architect.** Material: drawings, models, built rooms, light at different hours. Concept: the page is a drawing set. Move: full-width photographs of finished rooms paired with the plan drawing of the same room. Composition: one project per screen, the contact line repeated after every third project. Why: the work is the proof; the plan and photo pairing is specific to this practice.

## 9. Judging a direction

Ask in order:

1. Does a stranger understand what it is, for whom, and the next step, from the first screen? (First-screen test.)
2. Could a competitor use it unchanged? (Swap test.)
3. Is every claim true and every proof real?
4. Does it keep the floor in section 10?
5. Is there one thing a visitor would describe afterwards?

Do not ask "does this look AI-made?". That question is about origin, not use, and it rewards swapping one fashion for another. Do not score your own direction; show it.

## 10. The floor that boldness must keep

Bold looks are allowed as long as these hold:

- Text contrast 4.5:1 (3:1 for large text) in every state, including during animation and over images (WCAG 1.4.3).
- Reading order equals visual order (WCAG 1.3.2). Headings outline the argument.
- Reflow to 320 CSS px without sideways scrolling (WCAG 1.4.10).
- Motion respects `prefers-reduced-motion`; nothing essential depends on it; no more than three flashes per second (WCAG 2.3.1).
- Content readable without JavaScript.
- Core Web Vitals targets met on a mid-range phone (`performance-and-agents.md`).
- Brand tokens used as given.
