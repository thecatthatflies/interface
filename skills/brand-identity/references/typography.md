# Typography

Evidence tags: **[E]** empirical, **[S]** standard, **[P]** practitioner, **[J]** judgment.

## Choosing faces

- Start from the idea and the reading context. A display face carries the voice (headlines, logo, big numbers); a text face carries reading and interface. Often one family with a good range of weights is enough and is more coherent than a pairing [P: Lupton, *Thinking with Type*; Bringhurst, *The Elements of Typographic Style*].
- Serif versus sans has no reliable readability difference on screens; choose on tone, rendering, and range (Arditi and Cho 2005 [E]; see interface-guidelines evidence.md).
- Check before committing: weights you need (at least regular, medium or semibold, bold), italics, language and script coverage for target markets, tabular and lining figures if numbers matter (prices, dashboards), legibility at 14 to 16 px (open apertures, distinct Il1 and O0), and how it renders on Windows as well as macOS.
- Avoid using the most common defaults as the brand voice without a reason (Inter, Roboto, system UI for everything); they are excellent text faces but rarely ownable as display. Pair a distinctive display face with a workhorse text face [J].

## Pairing

- Pair by contrast with a shared quality: a high-contrast serif display with a neutral grotesque text face, a geometric display with a humanist text face. Avoid two faces that are similar but not the same; they look like a mistake [P: Lupton].
- Match x-heights roughly when faces appear on one line, or adjust sizes.
- Monospace only where code or aligned data appears, or as a deliberate brand voice for technical products.

## Licensing

- Prefer SIL Open Font License families (most of Google Fonts) unless the user has a license; OFL allows commercial use, embedding, and modification with conditions [S: SIL OFL 1.1].
- Commercial faces need a license for each use (desktop, web, app embedding). Do not ship a commercial font file without it; name it as the user's step.
- Record license and source per face in `brand.json` (`type.display.license`).

## Scale and rhythm

- Use a modular scale (base 16 to 18 px, ratio 1.2 to 1.333) for consistency; `book.mjs` writes it as rem custom properties and floors small steps at 12 px [P].
- Body line length 45 to 75 characters, line height about 1.4 to 1.6 for text, 1.05 to 1.2 for display [P: Bringhurst; S: WCAG 1.4.12 requires text to survive line height 1.5 and spacing changes].
- Sizes in rem so they respect browser settings [S: WCAG 1.4.4].
- Tighten tracking on large display sizes slightly, loosen on small caps and all-caps labels [P].

## Web loading

- Self-host or use Google Fonts with `display=swap`; preload the one or two files above the fold; subset to needed scripts.
- Variable fonts reduce files when you need many weights.
- Provide metric-compatible fallbacks (`size-adjust`, `ascent-override`) to reduce layout shift on swap [S: CSS Fonts 5].
- The logo never depends on font loading: it is outlined SVG.
