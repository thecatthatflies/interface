---
name: brand-identity
description: Create a complete brand identity as real, usable files - strategy and vibe, a verified color system (OKLCH ramps, light and dark themes, WCAG-checked roles), typography, a professional logo in SVG (from a clean wordmark or geometric mark to a complex, meaningful symbol), favicons, app and social assets, design tokens, and a brand guidelines page. Use whenever someone asks for a logo, brand, brand kit, identity, color palette, theme, font pairing, visual direction, "vibe", rebrand, favicon or app icon, or says things like "make it look like a real company", "I need branding for my bakery/app/startup", or "what colors should we use", even if they only ask for one piece. Not for laying out pages or screens; those skills (landing-page-design, web-app-design and siblings) consume the tokens this one produces.
---

# Brand identity

A brand identity is a small set of decisions that hold up everywhere: one idea, a mark that carries it, colors and type that sound like it, and rules that keep it consistent. The common failure is decoration without an idea: a gradient blob, a generic sans, a palette chosen by mood, and a logo that dies at favicon size or in one color. This skill produces the decisions as files and checks them in a real renderer.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish) wherever the identity meets an interface. If that skill is installed, its audit script checks the guidelines page this skill generates.

## Brief

Answer these before drawing anything. If the user is away, state assumptions in `brand.json` and keep going.

- **What is it, for whom, and against whom?** Category, audience, two or three competitors. The identity has to be distinguishable from those, not from brands in general.
- **The one idea.** A single sentence about what the brand is that a symbol can carry ("A kiln turns soft clay into something permanent"). Take it from the subject itself, its material, process, place, or promise, not from a style. See `references/strategy.md`.
- **Personality:** three traits, each with what it means in practice and what it rules out. "Warm: earth tones and plain words, never slick."
- **Where it must work:** favicon and app icon, phone screens, signage, print, embroidery, social avatars, dark mode, email. The hardest context sets the complexity ceiling.
- **Constraints:** existing equity to keep (a color customers know, a name), budget for licensed fonts, cultural markets (color and symbol meanings vary).
- **Complexity tier** for the mark (`references/logo.md` section 2): wordmark only, simple geometric mark, or a layered symbolic mark. Choose by context and idea, not by ambition. Complex marks need a simplified version for small sizes.

## Workflow

### 1. Directions, then one decision

Develop three directions that differ in idea, not just color. For each: the idea in one sentence, the logo concept method (`references/logo.md` section 3), a palette sketch (two or three seeds), a type pairing, and one sentence on how it feels. Write them down and show them if the user is present; pick one and say why if not. Do not blend directions; a blend usually loses the idea that made each one work.

### 2. Write `brand.json`

It is the source of truth every script reads. Minimal shape:

```json
{
  "name": "Kiln", "tagline": "Small-batch ceramics, fired in Leeds.", "url": "https://kiln.example",
  "idea": "One sentence the mark carries.",
  "personality": [{ "trait": "Warm", "means": "Earth tones and plain words, never slick." }],
  "voice": { "is": ["Plain", "Specific"], "isnt": ["Twee", "Salesy"], "examples": [{ "say": "Fired at 1,260°C.", "not": "Lovingly handcrafted!" }] },
  "colors": { "primary": "#d9480f", "accent": "#0b7285", "neutral": { "chroma": 0.01 } },
  "type": { "display": { "family": "Fraunces", "weights": [400, 700] }, "text": { "family": "Inter", "weights": [400, 600] }, "scale": { "base": 16, "ratio": 1.25 } },
  "logo": { "primary": "logo/lockup.svg", "mark": "logo/mark.svg", "story": "Why the mark looks like this.", "minSizePx": 16 }
}
```

### 3. Color

Pick two or three seeds with meaning (`references/color.md`), then:

```bash
node <skill-dir>/scripts/palette.mjs brand.json
```

It builds perceptual OKLCH ramps, keeps each seed exact at its nearest step, tints neutrals toward the brand, keeps status colors (success, warning, danger, info) separate from the brand so danger always reads as danger, maps semantic roles for light and dark, and checks every visible pair against WCAG 2.2. Fix failures by changing seeds or roles, not by ignoring them. Open `tokens/palette.html` and look at the light and dark demos.

### 4. Typography

Choose a display face and a text face (often one family is enough), with a reason tied to the idea and the reading context (`references/typography.md`). Check license, language coverage, weights, tabular figures if numbers matter, and how it renders at 14 to 16 px. Prefer open-licensed families (SIL OFL) unless the user has a license.

### 5. Logo

Draw the mark as SVG by hand: plan the geometry on a grid, write paths with intent, and make cutouts real holes (`fill-rule="evenodd"` or combined paths), never white shapes painted on top. Turn the wordmark into outlines so it does not depend on installed fonts:

```bash
node <skill-dir>/scripts/logo.mjs outline --text "Kiln" --google "Fraunces:700" --tracking -0.01 --out logo/wordmark.svg
node <skill-dir>/scripts/logo.mjs check logo/*.svg
node <skill-dir>/scripts/logo.mjs sheet logo/lockup.svg --mark logo/mark.svg --colors tokens/tokens.json --out logo/sheet.png
```

Look at the sheet. At 16 and 24 px the mark must still read as itself; in one-color black, reversed, and on a busy image every part must survive. If detail vanishes, simplify or draw a separate small-size mark. Iterate: most good marks take several rounds of reduction. Build the lockup (mark plus wordmark) with optical, not mathematical, alignment, and define clear space and minimum size. Details and SVG craft: `references/logo.md`.

### 6. Assets and system

```bash
node <skill-dir>/scripts/assets.mjs brand.json    # favicons, ICO, Apple touch, PWA and maskable icons, Open Graph card, manifest, head tags
node <skill-dir>/scripts/book.mjs brand.json      # brand guidelines page + type.css
```

Then add what the brief needs beyond these: social avatars, email header, a pattern or texture drawn from the mark, an icon style, illustration or photography direction (`references/system.md`). Every asset uses the tokens, not copied hex values.

### 7. Verify and hand off

- Run the interface-guidelines audit on the guidelines page if available: `node <interface-guidelines>/scripts/audit.mjs brand-book`.
- Read the logo sheet, the palette page, the Open Graph card, and the icons yourself. Fix what looks wrong.
- Test the identity in context: put the logo and tokens on one real screen of the product (a header and a button at minimum), light and dark.
- Hand off: the idea, what each file is, what you verified, what you did not (trademark search, cultural review in target markets, print proofs), and any accepted contrast exceptions with reasons.

## Traps

- **No idea, only style.** Choosing "modern, clean, bold" is not an idea. If you cannot say what the mark means in one sentence, it does not mean anything yet.
- **Generic marks:** a lightning bolt, a swoosh, a spark, a hexagon, a gradient orb, an initial in a circle with nothing done to it. Use them only if the idea demands it and something about them is ownable.
- **Painted cutouts.** White shapes on a colored mark turn into solid blocks in one color, on photos, and when inverted. `logo.mjs check` flags them.
- **Detail that dies small.** Thin strokes and inner detail vanish at 16 px. The sheet shows it; provide a small-size mark.
- **`<text>` in a logo SVG.** It renders in a fallback font wherever the font is missing. Outline it.
- **Brand color as danger, or danger as brand.** A red brand still needs a distinct, recognizable danger color, and its error text must pass contrast.
- **Color meaning as fact.** "Blue means trust" is a weak, culture-bound association, not a law (`references/color.md` section 1). Choose for distinctiveness in the category and for the idea.
- **Copying.** Do not recreate or closely imitate an existing brand's mark, name, or trade dress. Note that a real trademark search is the user's step before launch.
- **Imitating a real organization** for a user who is not that organization is not branding; decline.

## References

| File | Read when |
|---|---|
| `references/strategy.md` | Finding the idea, personality, naming the vibe, writing directions |
| `references/logo.md` | Any logo work: types, complexity tiers, concept methods, construction, SVG craft, lockups, testing |
| `references/color.md` | Choosing seeds, color meaning evidence, OKLCH, roles, dark mode, accessibility |
| `references/typography.md` | Choosing and pairing faces, licensing, scale, numerals, web loading |
| `references/system.md` | Icons, patterns, imagery, motion, voice, assets, tokens, guidelines |
