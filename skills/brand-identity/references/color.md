# Color

Evidence tags: **[E]** empirical, **[S]** standard, **[P]** practitioner, **[J]** judgment.

## Contents

1. What color meaning research supports
2. Choosing seeds
3. Building the system
4. Roles, not values
5. Dark mode
6. Accessibility
7. Checks

## 1. What color meaning research supports

- Color associations exist but are weak, context-dependent, and culture-bound. Labrecque and Milne 2012 (*Journal of the Academy of Marketing Science*) [E] found links between hue, saturation, value and perceived brand personality (for example blue with competence, red with excitement), but with modest effects. Treat them as tiebreakers.
- Elliot and Maier 2014 (*Annual Review of Psychology*) [E] review color psychology: many popular claims rest on thin evidence, and context changes meaning (red signals danger in one place and appetite in another).
- Meanings differ across cultures (white with mourning in parts of East Asia, red with luck in China) [E: cross-cultural survey work, e.g. Jonauskaite et al. 2020, *Psychological Science*, which also found substantial universal associations]. Check target markets.
- What matters more in practice: **distinctiveness in the category** (if every competitor is blue, blue is invisible) and **consistency over time** (Sharp, *How Brands Grow* [P]: distinctive assets work by being repeated, not by meaning).

Say "this color fits the idea and stands apart from competitors", not "blue builds trust".

## 2. Choosing seeds

- **Primary:** the brand's own color, from the idea (the kiln's ember orange). One, and it should be ownable in the category.
- **Accent (optional):** a second color with a job, such as highlighting or illustration, usually a contrasting hue or a deep companion.
- **Neutral tint:** a hint of the primary hue in grays makes the system cohesive; pure gray next to a saturated brand reads dead [J]. `palette.mjs` tints by default; set `neutral.chroma` to 0 for pure gray.
- **Status colors** stay conventional (green, amber, red, blue) and separate from the brand [S: ISA-101 and platform guidance keep alarm colors reserved]. A red brand still needs a distinct danger red, and the brand red must not be used for errors.
- Avoid choosing several saturated hues of equal weight. One loud color, everything else quiet, reads as a decision.

## 3. Building the system

- Work in **OKLCH** (CSS Color 4 [S], Ottosson 2020): lightness is perceptual, so steps at the same L look equally light across hues, which HSL does not do (HSL yellow and blue at 50% lightness differ enormously).
- Ramps of 11 steps (50 to 950) with fixed target lightness per step and chroma tapering toward the ends, which is what `palette.mjs` builds. The seed stays exact at its nearest step so the brand color is never "approximately" itself.
- Out-of-gamut colors are mapped by reducing chroma at constant lightness and hue, so they stay the same lightness and hue.
- Name tokens by role (`--color-primary`, `--color-text-muted`), not by value (`--orange-600`) in components; ramps exist for the rare case a role does not cover.

## 4. Roles, not values

Minimum role set: `bg`, `surface`, `surface-sunken`, `border`, `border-strong`, `text`, `text-muted`, `primary`, `on-primary`, `primary-text`, `primary-subtle`, `focus`, and for each status `-text`, `-subtle`, `-border`. Each role has a light and dark value. Components only use roles. This lets dark mode, high contrast, and rebrands change values without touching components.

## 5. Dark mode

- Not inverted: dark backgrounds are near-black with a hint of the neutral tint, surfaces step lighter as they rise, saturated colors come down in chroma and up in lightness so they do not vibrate [S: Material 3 dark theme guidance; P].
- Brand color in dark mode is usually a lighter step (300 to 400), not the seed.
- Offer it as a preference, following the system setting; do not claim it reduces eye strain (evidence is weak, see interface-guidelines evidence.md).

## 6. Accessibility

- WCAG 2.2 [S]: text 4.5:1 (3:1 at 24 px, or 18.66 px bold, and larger), non-text UI components and graphics needed to understand them 3:1 (1.4.11), focus indicators 3:1 against adjacent colors (2.4.13, AAA in 2.2).
- A labeled button's fill does not have to contrast 3:1 with the page: the label identifies the control. `palette.mjs` reports that pair as advisory. Its label must still reach 4.5:1 on the fill.
- Never use color alone to carry meaning (1.4.1): pair status color with words or icons.
- APCA (the candidate WCAG 3 method) handles light-on-dark and font weight better; it is not yet a standard, so meet WCAG 2.2 and use APCA as a second opinion if available [S].
- About 8% of men of Northern European descent have red-green color vision deficiency [E]. Do not rely on red versus green alone; check charts and status with a simulator.

## 7. Checks

- `palette.mjs` exits 1 when a required pair fails; fix seeds or roles until it passes.
- Look at `palette.html`: are the ramps even? Do light and dark demos feel like the same brand?
- Put the primary, accent, and neutrals next to two competitors' palettes: is it distinct?
