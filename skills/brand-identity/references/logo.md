# Logo

Evidence tags: **[E]** empirical, **[S]** standard or platform guideline, **[P]** respected practitioner, **[J]** judgment.

## Contents

1. What a logo has to do
2. Types and complexity tiers
3. Concept methods
4. Construction
5. SVG craft
6. Wordmarks and lockups
7. Testing
8. What the research says

## 1. What a logo has to do

A logo is a signature, not a description (Rand [P]). It has to be recognized again, not understood at first sight, and it has to survive every place it is reproduced: a 16 px browser tab, an embroidered cap, a fax, a dark-mode header, a photo overlay. Meaning helps memory and makes it ownable, but legibility and distinctiveness come first (Henderson and Cote 1998 [E]).

## 2. Types and complexity tiers

| Type | Use when | Watch for |
|---|---|---|
| Wordmark | The name is short, distinctive, and must be learned | Needs custom detail to be ownable; a typed name in a stock font is not a logo |
| Lettermark / monogram | Long name, or a strong initial | Initials alone are hard to own; do something with negative space, cut, or fold |
| Symbol (abstract or pictorial) | Global, icon-heavy, or app-first brands | Abstract marks need repetition to gain meaning; pictorial marks risk cliché |
| Combination (symbol + wordmark) | Most new brands: the wordmark teaches the name, the symbol carries the idea | Define how they lock up and when the symbol stands alone |
| Emblem / badge | Heritage, institutions, food and drink | Falls apart small; always provide a simplified mark |

Complexity tiers, chosen by context and idea:

1. **Simple:** one to three geometric primitives, one color, reads at 16 px unchanged. Default for digital products.
2. **Considered:** a mark with one meaningful twist (a cut, a negative-space shape, a fold) that rewards a second look. Still one color, still holds at 16 px.
3. **Complex and symbolic:** layered meaning, illustration-like detail, several shapes or colors. Allowed when the idea needs it (heritage, editorial, food, culture). It must come with a reduced small-size mark derived from it, and a one-color version.

## 3. Concept methods

Use one, or combine two at most [J, adapted from studio practice]:

- **Monogram plus meaning.** The initial carries a metaphor through negative space or a cut (a K whose counter is a kite).
- **Product action.** The thing the product does, abstracted: build becomes a frame, protect a boundary, convert a turn.
- **Material or place.** What it is made of or where it comes from: grain, weave, a skyline, a river's bend.
- **Metaphor fusion.** Two ideas that share a silhouette (a kiln door and a flame, an eye and a lens).
- **Name literalism with a twist.** For names with an image (Kiln, Owl, Harbor), draw the image and then do one thing to it that no competitor would.

Write the idea in one sentence before drawing. If the sentence needs "and" twice, the mark is carrying too much.

## 4. Construction

- Draw on a grid (8, 12, 16, 24, or 64 units). Use whole or half units for primary geometry so edges land on pixels at common sizes [J].
- Build from primitives (circles, squares, arcs, 45-degree angles), then correct optically: round shapes overshoot flat ones by about 1 to 3% of height to look the same size, horizontal strokes are slightly thinner than vertical ones to look equal, and the visual center sits slightly above the geometric center [P: type design practice].
- Keep stroke weights consistent across the mark, or vary them on purpose.
- Negative space is part of the mark: make counters and gaps large enough to stay open at 16 px (roughly one-eighth of the mark's width or more) [J].
- Check the silhouette: fill the whole mark black. If you cannot recognize it as a blob, it will not be recognized at a glance.

## 5. SVG craft

- Root: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 W H">`. No fixed width or height in the master file; let the context size it.
- `fill="currentColor"` for single-color marks, so one file works on light, dark, and brand backgrounds.
- Cutouts are holes: combine subpaths in one `<path>` with `fill-rule="evenodd"`, or subtract shapes. A white shape painted on top becomes a block in one-color use and on photos.
- No `<text>` (outline it with `logo.mjs outline`), no raster `<image>`, no scripts, no external references, no filters in the master.
- Round coordinates to 1 or 2 decimals; keep the file small (usually under 5 KB for a mark).
- Add `<title>` with the brand name when the SVG is used as an image; inline usage gets `role="img"` and an accessible name.
- Multi-color marks: limit to two or three flat colors from the palette, and also deliver a one-color version.
- Path writing: use absolute commands while drafting so the geometry is legible; arcs (`A`) for true circular segments; cubic curves for organic shapes with handles at about 0.55 of the radius for circle-like curves (the common circle approximation constant is about 0.5523).

## 6. Wordmarks and lockups

- Start from a typeface that fits the idea, set the name, then customize: adjust spacing (logos usually need tighter or looser tracking than text), redraw one or two letters, connect or cut where the idea suggests, fix awkward kerning pairs by hand.
- Outline it so it no longer depends on the font.
- Lockups: horizontal (mark left of name) for headers, stacked (mark above) for square spaces, mark alone for icons and avatars. Align optically: the name's x-height or cap height relates visibly to the mark's height; the gap between mark and name is a defined unit (often the width of a stroke or a counter).
- Define clear space as a unit taken from the logo itself (for example the height of the wordmark's x-height), and a minimum size in pixels and millimeters.

## 7. Testing

Run `logo.mjs check` and `logo.mjs sheet`, then look:

- 16, 24, 32 px: does it read as itself, or as a smudge?
- One color, black and reversed: does every part survive? Did any cutout fill in?
- On brand color and on a busy image.
- In context: a browser tab next to other tabs, an app icon next to other icons, a social avatar cropped to a circle.
- Squint test and the blob test (all black): is the silhouette distinctive?
- Similarity: does it look like a famous mark or a stock icon? If someone could mistake it for another brand in the category, change it. A trademark search is the user's step before launch; say so.

## 8. What the research says

- Henderson and Cote 1998, *Journal of Marketing* [E]: across 195 logos, moderate elaborateness and natural (representational) design improved recognition and affect; very simple and very complex marks did worse on some measures. Use it to justify a mark with one meaningful idea over bare geometry.
- Luffarelli, Mukesh and Mahmood 2019, *Journal of Marketing Research* [E]: descriptive logos (that show what the business does) improved brand impressions and purchase intention in their studies, less so for negative-associated categories. A meaningful, legible idea is not only taste.
- Jiang, Gorn, Galli and Chattopadhyay 2016, *Journal of Consumer Research* [E]: rounded logo shapes evoked softness and comfort, angular shapes durability and sturdiness. Small effects; use as a tiebreaker consistent with the idea, not as a rule.
- Paul Rand, *Design, Form, and Chaos* (1993) [P]: a logo derives meaning from what it symbolizes, not the other way around.
- Alina Wheeler, *Designing Brand Identity* [P]: process (research, strategy, design, touchpoints, asset management) and the case for a single source of truth.
- Apple Human Interface Guidelines, App icons [S]: simple, recognizable at small sizes, no text in icons, provide the platform sizes.
