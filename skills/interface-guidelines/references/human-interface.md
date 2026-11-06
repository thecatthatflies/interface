# Human interface rules

Read this for any screen a person uses: forms, errors, feedback, layout, type, color, motion, copy.

Tags: **[S]** standard or institutional, **[E]** empirical, **[P]** practitioner, **[J]** judgment, **[H]** hard requirement in WCAG 2.2 AA. Sources converge far more on behavior than on appearance. Treat behavior rules as close to settled, and visual values as defaults.

## Contents

1. Preventing and recovering from errors
2. Feedback and progress
3. Forms and input
4. Words
5. Layout and density
6. Type
7. Color and contrast
8. Target size and touch
9. Motion
10. Keyboard and focus
11. Disputes, and how to decide them

## 1. Preventing and recovering from errors

Agreed across 1982 to 2026 sources, from Xerox Star to GOV.UK.

**Order of preference: prevent, then undo, then confirm.** Confirm only what is consequential and rare, and irreversible or unexpected (Windows, Apple, GNOME, Nielsen, Shneiderman, WCAG 3.3.4).

- **Confirmations lose force with use.** People dismiss what they see often. If one answer is chosen about 98% of the time, remove the prompt, except for security, legal, or safety cases (Windows).
- **Warn on the unexpected, not the requested.** Moving to Trash is intended, so no warning (Apple). Warn on unexpected irreversible loss.
- **Show the effect before commit.** Old and new values (Smith and Mosier 6.3/16), target and count: "Delete 3 rows from prod", not "Are you sure?".
- **Cancel, Stop, and Done are different promises.** Cancel leaves nothing behind. Stop keeps partial work. Done keeps changes. Relabel Cancel to Stop when rollback stops being possible (Mac HIG pp. 207-208, Windows).
- **Keep what the person entered.** Never clear it on error, navigation, or help. Re-enter only the wrong part (Smith and Mosier 4.3/15, Windows, GOV.UK, Primer).
- **Separate risky commands from common ones,** and never make them the Return default (Smith and Mosier 6.0/12-13, GNOME, Mac HIG p. 206).
- **Name the outcome.** Prefer verb buttons (Apple, Carbon, NN/g). Where someone might click by reflex, use the text to give the reason not to proceed, and "anyway" wording (Windows).
- **Ask once.** Never make someone re-enter what the system has (Smith and Mosier 1.0/1, WCAG 3.3.7).
- **Everyone can get out.** Esc works, Cancel works, long work can be interrupted, and nothing gets stranded (Nielsen, Shneiderman, Windows). A panic exit must never destroy work (Mac HIG).
- **Unrecognized input changes nothing** (Smith and Mosier 6.0/14).
- **Failure must not destroy work** (Mac HIG p. 105).
- **Separate content from environment.** Warn about changes to content, not to window position or view state. View changes do not bump `updated_at` (Mac HIG).

## 2. Feedback and progress

Every action gets a prompt response proportional to its weight. Silence is a failure (Smith and Mosier 3.0/14, Primer).

**Three stages of input.** Entered, checked, and in effect are different states, and should look different (Mac HIG p. 182). Optimistic UI often collapses them. If an action might fail, do not show it as done.

| Delay | Show | Basis |
|---|---|---|
| Up to 100 ms | Direct response | Miller 1968, Card 1991, Nielsen |
| Under about 1 s | No spinner | NN/g |
| 1 to 10 s | Busy state on the triggering control | Nielsen, NN/g |
| Over 10 s | Percent, estimate, way to interrupt | Nielsen |
| Over 30 s | Modeless, so work continues | Windows |
| Over 2 min | Notify on completion | Windows |

Thresholds depend on whether the person is waiting for the result: Find shows progress at about 4 s, Empty Trash at about 8 s (Mac HIG p. 57).

Web metrics: INP at most 200 ms, LCP at most 2.5 s, CLS at most 0.1 at p75 (Web Vitals [S]).

**Honest progress.** Show real progress and lack of it. Never jump to 99%, go backward, or reach 100% before the end. Do not put text on the bar (Windows). Say what, why, how long, and how to leave. Delay a spinner 150-300 ms and hold it 300-500 ms once shown (Vercel [P]).

**Show success sparingly.** People expect success and mainly need to hear about failure (Apple). A toast is never the only record of something important: pair it with the changed row or a log (Primer, Carbon).

**Interrupt in proportion to importance.** Alerts are rare and carry an action. Frequent alerts are a design defect (Mac HIG p. 10, Apple 1987). Never stack dialogs (KDE). Background work notifies; it does not seize the screen (Mac HIG p. 352).

**No dead ends.** Empty, loading, error, and degraded states carry a next step (Carbon, Primer, Apple). Say "End of list" and "Page 2 of 5" (Smith and Mosier 4.2/7). A condition the person cannot fix (permission, eligibility) is a page, not a validation error (GOV.UK).

**Degrade honestly.** Hide a count when its data is unavailable, and never show a misleading 0 (Primer). Date-stamp anything whose currency matters (Smith and Mosier 4.1/9). Say when service returns, not "as soon as possible" (Smith and Mosier 4.1/3).

## 3. Forms and input

- Visible label on every field, never placeholder only [H: 3.3.2]. NN/g lists seven harms of placeholder labels.
- Mark optional fields. Use `autocomplete` for personal data [H: 1.3.5].
- Accept stray spaces, hyphens, and paste artifacts. Never block paste (GOV.UK, Vercel).
- **Do not flag while someone is typing a first attempt.** All sources agree on this. Beyond it, GOV.UK validates on submit; LukeW found blur validation helped (22% success, 42% time, but 22 people and within-subjects). Server validation is non-negotiable.
- Error goes next to the field, and on submit, focus moves to the first problem or a summary linking to each (GOV.UK, Windows). Match wording between summary and field [H: 3.3.1, 3.3.3].
- Disabled submit: keep enabled on long forms and validate on submit (GOV.UK, Primer, Vercel). Short modal choice with an obvious missing input may disable (GNOME, KDE). Always make the reason available. Use `aria-disabled` so items stay discoverable (APG).
- Toggles apply at once. Text and multi-field forms save explicitly. Never mix them in one form (KDE, Primer).
- "Continue" versus "Save and continue" must match whether data was saved (GOV.UK).
- Debounce double submits and protect on the server too (GOV.UK).
- Time limits can be turned off, extended, or warned at 20 s [H: 2.2.1].
- Mobile inputs at least 16 px to stop iOS zoom (Vercel).
- Radios to about 5, select or combo to about 10-12, searchable list above that. These numbers are craft, not findings (Mac HIG, KDE).
- A pop-up menu has one current value and holds no commands (Mac HIG pp. 85-86). Checkbox labels imply a clear opposite; if not, use radios.
- Avoid range sliders where precision matters (GOV.UK).

## 4. Words

- Use the person's terms, not the developer's. **No developer noise in the UI:** backend status, API key state, or internal IDs, unless the reader operates that system. On an incident console, connection state *is* content. The test is the audience, not a ban.
- Errors state what happened, why, and what to do, in plain words, without blame (Windows, GOV.UK, Nielsen 9). Name the object. Good errors are a design problem: the code must know the cause first (Windows). Turn failure into a choice where possible (Mac HIG Fig. 1-2).
- Labels name outcomes: verb plus object (Apple, Carbon, GNOME).
- Front-load the words that differ. People scan (Windows, Krug, Tog). Target about grade 7-9 reading level (Primer, Atlassian).
- One word per concept everywhere: in UI, docs, and API (Mac HIG p. 313, WCAG 3.2.4).
- Sentence case by default for product UI. This is convention (Primer, Polaris, GOV.UK); Apple and Vercel differ. Pick one and hold it.
- Plain and specific always. Warmth only when stakes are low. No humor on failure. Apologize only for serious system failures (GOV.UK, Polaris).
- Complete sentences, not concatenated fragments. Allow for about 50% text growth (Mac HIG). `Intl` for numbers and dates (Vercel).
- Cut a long name in the middle where the end distinguishes it (Mac HIG p. 221).
- Never invent facts. Where something is unknown, write a visibly marked placeholder, not a plausible value.

## 5. Layout and density

**Density follows task, not fashion.** Repeated scanning and comparison by practiced users: dense. Occasional focused decisions: sparse. Within a screen: dense data, roomy controls (Material, Apple macOS, Bloomberg). Do not shrink targets to gain density. Dense components need wider gutters (Material).

- One focal point and one primary action per surface (Windows, Carbon, Polaris).
- Prominence follows frequency: focus on the likely, reduce the unlikely, remove the impossible (Windows, Zen of Palm).
- Simplicity means removing what the target user considers unessential, never what they need (Microsoft, Apple, Tog).
- Keep needed information visible rather than in memory. Hidden navigation cut discoverability over 20% and slowed desktop tasks at least 39% (NN/g, n=179 [E]).
- Show status near the thing it describes (Apple, Primer).
- Reveal only what is optional for this user's main path. Never hide status or the way out. Announce that more exists (Mac HIG p. 35).
- The best size is not the largest: limit content width (Mac HIG p. 170).
- Most important information first, in reading order, which is also tree order (Mac HIG p. 353).
- Avoid modes. Where unavoidable, make them chosen, visible, and easy to leave. Test whether people track them: a visible indicator does not guarantee it (Mac HIG p. 352).
- Do not make a card of everything. Use whitespace and alignment first. Tables stay tables.
- Reflow to 320 CSS px wide without two-dimensional scrolling, except data tables and maps [H: 1.4.10]. Text resizes to 200% [H: 1.4.4] and survives WCAG's spacing override [H: 1.4.12].
- Follow convention unless there is a clear advantage (Nielsen 4, Tog, Apple). Standard elements never get new behavior (Mac HIG p. 39). Be consistent in meaning and behavior, and break it only for a real gain to the main user, visibly (Grudin 1989, GOV.UK "consistent, not uniform").

## 6. Type

| Rule | Value | Basis |
|---|---|---|
| Web body | At least 16 px (15-25 range) | USWDS, Butterick. Comprehension improved up to 18 pt in a 104-person study (Rello 2016) |
| Dense UI, tables | 13-14 px is common; do not go below 11-12 px | Apple defaults, HHS (dated) [J] |
| Prose line length | Default 60-75 characters. **Convention.** Longer lines read faster, shorter are preferred (Dyson, HHS) | Tables and logs exempt |
| Prose line height | 1.3-1.5; tighter for headings and dense UI | Butterick, USWDS. Effects are marginal (Rello) |
| Weights | Avoid below 400 | Apple, Refactoring UI |
| Typefaces | One or very few | Apple |
| Numbers | Tabular in tables and timers; data larger than labels | Vercel, Tog |

Font choice is taste, not usability. Use the project's fonts, or a system stack. Do not chase or ban particular faces. Sources contradict each other (Inter and Geist are both banned and recommended). Do not change weight on hover, since it shifts layout (Rauno).

## 7. Color and contrast

| Rule | Value |
|---|---|
| Text | 4.5:1; large text (18 pt, or 14 pt bold) 3:1 [H: 1.4.3] |
| UI components and needed graphics | 3:1 against adjacent [H: 1.4.11] |
| Meaning | Never by color alone [H: 1.4.1] |
| Disabled controls | Exempt, but keep them readable |

WCAG 2.2 is the requirement; APCA may be a secondary check, never a replacement (Primer). If a brand color fails contrast, deepen the shade: accessibility outranks brand.

Brand owns color, type, voice, and imagery. Convention owns interaction, behavior, and structure.

Support light and dark where people work long hours, and check each theme separately. Evidence for positive polarity is real but small, and old figures like "32% faster" come from old displays. Respect the system setting and offer an override.

## 8. Target size and touch

| Context | Minimum |
|---|---|
| Web | 24x24 CSS px, or adequately spaced [H: 2.5.8] |
| Touch default | 44x44 CSS px (WCAG 2.5.5, Apple), 48x48 dp (Material) |
| Desktop pointer in dense UI | 28 pt Apple default; hit area may exceed visual |
| Thumb, one-handed | About 9-10 mm (Parhi 2006) |

Make frequent or high-consequence targets larger (Microsoft). Actions complete on release, and sliding off cancels [H: 2.5.2]. Every gesture has a single-pointer alternative [H: 2.5.7]. Never make a double-click the only way (Mac HIG).

## 9. Motion

- Motion serves meaning, stays brief, and is never the only signal. Respect `prefers-reduced-motion` (Apple, Carbon, WCAG 2.3.3).
- **Do not animate frequent actions** (Apple, Kowalski, Rauno).
- Productive tools: 100-200 ms common core; 70-240 ms for most (Carbon). Exits shorter than entrances. Longer only for rare, large transitions. Never on keyboard-triggered actions. Duration values are practitioner craft.
- Animate `transform` and `opacity`. No `transition: all` (Vercel, Kowalski).
- Moving content over 5 s can be paused [H: 2.2.2]. No more than 3 flashes per second [H: 2.3.1].

## 10. Keyboard and focus

- Everything works by keyboard [H: 2.1.1], with no traps [H: 2.1.2].
- Focus stays visible [H: 2.4.7], not hidden by sticky UI [H: 2.4.11].
- Focus never silently falls to the body. Modal focus enters, stays, and returns to the invoker (APG). For a final irreversible step, consider focusing the least destructive action.
- Native first: no ARIA beats bad ARIA (APG). Pages with ARIA averaged 59 errors against 42 without (WebAIM 2026, confounded by page complexity).
- Shortcuts use two or more keys by default for speech users (M3), or can be remapped [H: 2.1.4]. Hidden accelerators are fine if a visible path also exists (NeXT).

## 11. Disputes, and how to decide them

Respected sources rarely conflict over a principle. They conflict over **who** the user is, **how often** they do this, and **what an error costs**. Ask those three first.

| Dispute | Decide by |
|---|---|
| Density or simplicity | Frequency and expertise (section 5) |
| Fewer steps or simpler steps | Daily expert work: fewer. Rare, stressful, or low-literacy: one question at a time (GOV.UK, Zen of Palm) |
| Consistency or fit | Consistent by default, break for a real gain, make it visible |
| Brand or convention | Brand: look. Convention: behavior |
| Verbs or Yes/No | Verbs, plus the reason not to proceed |
| Button order | Pick one and hold it. Not worth testing (Nielsen). Irrelevant to agents |
| Explicit or automatic save | Toggles immediate, forms explicit, never both in one form |
| Reveal or hide | Hide only what is optional on this user's main path |
| Taste or evidence | Taste generates. Evidence rejects |

**Numbers that are convention, not findings:** 66-character lines, 7 plus or minus 2 (a memory finding, wrongly applied to menus), button order, most motion durations, radio and menu counts.

**When principles collide,** rank by: can everyone use it, is it true, does it say what it means, is it one system, is the order clear, then polish. A list with no order cannot settle anything (Lightning).
