# The system: assets, imagery, tokens, guidelines

Evidence tags: **[E]** empirical, **[S]** standard, **[P]** practitioner, **[J]** judgment.

## Required assets

`assets.mjs` produces these from `brand.json`:

| File | Why | Spec |
|---|---|---|
| `favicon.ico` | Old browsers, Windows, some crawlers | 16, 32, 48 px, PNG-in-ICO |
| `favicon.svg` | Modern browsers, crisp at any DPI, follows light and dark scheme | SVG with a `prefers-color-scheme` style |
| `apple-touch-icon.png` | iOS home screen | 180 px, opaque background, no transparency [S: Apple] |
| `icon-192.png`, `icon-512.png` | PWA install | Web App Manifest [S: W3C] |
| `icon-maskable-512.png` | Android adaptive icons crop to shapes | Content inside the central 80% safe zone [S: W3C manifest `purpose: maskable`] |
| `og-image.png` | Link previews | 1200 × 630, key text away from edges [S: Open Graph; platform docs] |
| `site.webmanifest`, `head.html` | Wiring | Paste the head tags into the site |

Add when the brief needs them: social avatars (circle-safe crop), email header (600 px wide, retina 2x, alt text), native app icon sets (Xcode asset catalog, Android adaptive foreground and background), print (CMYK conversion and a Pantone match are the printer's step; note it).

## Visual language beyond the logo

- **Pattern or texture:** derive from the mark (repeat a shape, use the cutout as a motif, a grid from the construction). One pattern used sparingly is stronger than several.
- **Icons:** one style (outline or filled, one stroke weight matching the logo's weight, one corner radius). Use an existing open set (Lucide, Phosphor, Material Symbols) adjusted to the stroke and radius, rather than drawing a partial set [J].
- **Imagery:** write direction as rules (subject, light, color grade, framing, what to avoid). Real photographs and honest product shots beat generic stock; credit sources and check licenses.
- **Illustration:** a constrained palette from the ramps, one line weight, a consistent level of detail.
- **Shape:** one corner radius family (for example 4, 8, 16 px), tied to personality (sharp for exact, round for friendly).
- **Motion:** one easing and two or three durations; respect reduced motion [S: WCAG 2.3.3]. Motion is optional for a brand; consistency is not.

## Tokens

- Color tokens from `palette.mjs` in W3C Design Tokens format (`tokens.json`), CSS custom properties (`tokens.css`), and a Tailwind preset.
- Type tokens from `book.mjs` (`type.css`).
- Add radius, spacing (4 or 8 px base), shadow (if any), and motion tokens in the same format when the product needs them.
- Components use semantic tokens only. Other skills in this family (landing-page-design, web-app-design and siblings) consume these files.

## Guidelines page

`book.mjs` builds the page from `brand.json`. Keep it short: a person or an agent should find any rule in under a minute. It must contain the idea, logo variants with clear space, minimum size and misuse, color roles with contrast results, type specimens and scale, voice, assets, and how to use tokens. Run the interface-guidelines audit on it.

## Hand-off checklist

- [ ] One-sentence idea, three traits, voice pairs
- [ ] Logo: lockup, mark, wordmark, one-color and reversed versions, small-size mark if needed, all passing `logo.mjs check`
- [ ] Logo sheet looked at, 16 px legible
- [ ] Palette passing `palette.mjs`, light and dark
- [ ] Type with licenses recorded
- [ ] Assets exported and looked at
- [ ] Guidelines page generated and audited
- [ ] Identity shown on one real product screen
- [ ] Stated as not done: trademark search, cultural review, print proofs
