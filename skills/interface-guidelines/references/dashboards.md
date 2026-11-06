# Dashboards and data display

Read this when an interface shows data someone reads, monitors, or compares.

Evidence tags: **[E]** empirical, **[S]** standard or institutional, **[P]** respected practitioner, **[J]** judgment. Citations are short; `evidence.md` holds the source list and strength notes.

## Contents

1. Decide the genre first
2. Task to display
3. Honest numbers and charts
4. Color
5. Alarms and attention
6. Live data
7. States
8. Comparison
9. Stressed readers
10. Charts for agents and screen readers
11. Common failure patterns, sorted by real harm

## 1. Decide the genre first

Rules that help one genre harm another, so pick before designing.

| Genre | Reader's question | Shape |
|---|---|---|
| Operational monitoring | Is anything wrong, and where? | One screen, neutral at rest, severity order, one click to the affected item (Few [P], ASM [S]) |
| Analytical review | Why did this change? What should we do? | Multi-section or multi-page is fine. 42% of dashboards in Bach's review use several pages [E]. Few's single-screen rule does not apply here |
| Personal or small-business status | What do I do next? | Sentences and short lists first, charts only where they answer something. Do not import control-room density or gray styling |
| Supervision of automation | What is it doing, what needs me? | See `oversight-and-safety.md` |

Name the screen's one question and its current answer. Put that answer where it is read first, as words. The answer is also the summary an agent should find. This matters more than any styling decision.

## 2. Task to display

Start from what the reader must do. No chart type wins across tasks (Saket 2019 [E]).

| Reader's task | Default | Avoid |
|---|---|---|
| Look up an exact value, audit | Table | Chart with tooltips |
| Mixed units in one view | Table | Dual axis |
| One value against target or normal | Number, comparator, and range, or a bullet graph | Radial gauge (read-value error up to 41% against 14% linear, Waldner [E]), bare number |
| Yes or no status | A sentence or status word | Any chart |
| Only 2 or 3 data points | Number or small table | Line chart |
| Trend, 1 to 4 series | Line, labeled directly | Bars for several time series (Zacks and Tversky [E]) |
| Trend, more than 4 series | Small multiples on a shared scale | Spaghetti chart (Javed [E]) |
| Rank categories | Sorted horizontal bars from zero | Alphabetical order, pie |
| Before and after, plan and actual | Mirrored or overlaid bars, or an explicit delta | Stacked charts (Ondov [E]) |
| Biggest mover | Computed delta, sorted | Asking the eye to subtract |
| Part of whole, 5 or fewer parts, one dominant | Pie or donut is fine | Over 5 slices, or similar sizes |
| Latency, spread | Percentiles, histogram | Mean alone (SRE [S]) |
| Periodic pattern | Linear chart | Radial (error 9% against 30%, Waldner [E]) |
| Triage many entities | Table sorted by severity, status in words | Grid of equal cards |
| Is this value normal? | Value on a scale with a normal band | Bare number (Drews and Doig, 42 ICU nurses [E]) |
| Non-technical reader | Sentences and short tables, then annotated charts (Stokes [E]) | Analyst-style grid |

## 3. Honest numbers and charts

| Rule | Basis |
|---|---|
| Bars and filled areas start at zero. Truncation misled 83.5% of participants across 5 studies, and warnings or break marks reduced but did not remove it | Yang 2021, Correll 2020 [E] |
| Lines may start above zero when the task is reading a trend. Pick a round start and say so in the description | Correll [E], Analysis Function [S] |
| No shaded area under a truncated line | Wilke [P] |
| No dual y-axis by default. Use adjacent charts or index both to a common start. No direct experiment exists on two-unit axes; the argument is logical (crossings mean nothing) | Few [P], Analysis Function [S] |
| Charts read for value are at least 80 px tall. Below that, treat them as shape only and print the value beside them | Heer and Bostock [E] |
| At most about 4 lines per chart, 4 parts per stack, 5 pie slices | Analysis Function [S] |
| Ticks at 1, 2, 5 or 10 times a power of 10; at most about 10 light gridlines | Smith and Mosier, Analysis Function [S] |
| Hover is never the only route to a value | USWDS, Chartability [S] |
| Right-align numeric columns and their headers, one decimal format per column, tabular numerals, left-align text | GOV.UK, Smith and Mosier [S] |
| Sort by the column that answers the question, not alphabetically | NN/g, Few [P] |
| Keep precision to what the decision needs: no 94.28% on a sample of 50 | Few [P], [J] |
| Label a title with the finding and a subtitle with measure, units, period | Analysis Function [S] |

**Data truth.** These prevent the most damaging failures, and they apply to every data screen:

- A fact shown twice comes from one variable. Totals compute from rows. If two figures must agree, assert it in code.
- Every relative figure names its baseline and period: "up 4% vs previous 28 days". A two-point percent change with no comparator is misleading (NHS [S], Few [P]).
- Never invent a delta, sparkline, trend, or status the data does not support. Say what is missing instead.
- Zero prints as 0. Missing prints as a dash, with the reason where it matters. A null is not a zero (Primer [S]).
- A partial current period is marked, and excluded from deltas or matched to the same elapsed time. Otherwise the last point looks like a collapse.
- Color on a change means good or bad, not up or down: latency rising is bad.
- Use no percent change on a noise-level difference. Color a delta only if it clears a noise check (NHS [S]).
- Label demo values as demo. Do not write "Live" or "All systems operational" as constants; derive them from data age.
- Show what was observed, not what was commanded. "Restart requested" is not "restarted". At Three Mile Island, instruments showed a stuck valve as closed (NRC [S]).

## 4. Color

- Neutral at rest; bright color means abnormal or is the point of the question. Fed all-normal data, a monitoring screen shows no alert hues (ASM, Hollifield; aviation's dark cockpit [S, P]). Evidence is moderate: one 21-operator study and one mixed 8-operator study, both run by advocates. Do not cite "5x".
- Red, amber, and yellow mean alert and nothing else on monitoring surfaces (14 CFR 25.1322 [S]).
- Never make color the only channel. Add a word, sign, or icon (WCAG 1.4.1). About 8% of men have color vision deficiency.
- 3 to 5 categorical hues in a chart, at most 7 color codes with one meaning each across a dashboard (Wilke [P], ASM [S]).
- One series, one color everywhere (Carbon, USWDS [S]).
- Essential marks at 3:1 against adjacent colors, text at 4.5:1 (WCAG). Start from a tested palette such as Okabe-Ito, then check thin lines, since safe palettes fail on small marks (Stone [E]).
- Gray text still must pass contrast. "Gray by default" does not excuse illegible labels.

## 5. Alarms and attention

No common web guidance covers this. Control rooms learned it through accidents.

**Budgets.** Rate is a design requirement, set by what one response costs.

| Context | Budget |
|---|---|
| Process plant, per operator (ISA-18.2 [S]) | 1 per 10 min acceptable, 2 maximum, over 10 in 10 min is a flood |
| Software on-call (Google SRE [S]) | At most 2 incidents per 12 h shift, median 0, tune to one alert per incident |

**Why it matters.** People match their response rate to perceived reliability: around 90% of subjects in Bliss's studies did so [E]. Response times rose stepwise with nonactionable alarm exposure (Bonafide 2015, 36 nurses [E]). 74-99% of hospital monitor alarms were not actionable (Paine 2016 [E]). At Milford Haven two operators faced 275 alarms in 11 minutes, most marked high priority.

| Rule | Basis |
|---|---|
| At most 3 priorities. If over about 5% are top, priority has lost meaning | ISA-18.2 [S] |
| Define each tier by the response it demands: act now, act later, awareness only | 14 CFR 25.1322 [S] |
| An alarm names what is wrong and what to do, or links to it. With no action, it is a log entry | EEMUA, SRE [S] |
| Top-tier alerts use at least two channels: color, icon, text, position | 14 CFR, adapted [J] |
| Stop chatter: deadbands, delays, dedup | ISA-18.2 [S] |
| Acknowledged looks different from unacknowledged. Acknowledging silences the attention-getter, not the fact: it stays listed | 14 CFR, ASM [S] |
| Mutes and suppressions stay visibly announced, and cannot be set by reflex | 14 CFR [S] |
| Group cascades under one root with a count | Woods [E, secondary] |
| Alarms have a fixed location. They do not steal focus or live only in vanishing toasts | Woods, WCAG 4.1.3 |
| Flag departure from expected for this context, not a raw threshold | Woods, NHS |
| Let the responder check the alarm against raw data in place | Cry-wolf mitigation [E, excerpt] |

Reducing alarms is a precision and recall trade. Lowering one SpO2 limit cut alarms 61% and tripled long hypoxemia events (Paine). State the choice, do not bury it in a default.

## 6. Live data

- Values people read update at most once per second, in a fixed position (Smith and Mosier 2.7.3/3 [S]). Data can arrive faster; the display coalesces.
- Set refresh from how fast the thing actually changes (ASM, Grafana [S]).
- Provide a labeled pause for auto-updating content. WCAG 2.2.2 has no 5-second exemption for auto-updating content. Controlling update frequency also satisfies it.
- A frozen display says it is frozen and when. Resume at real time and say how many updates arrived (Smith and Mosier [S]).
- Rows do not jump under the reader. New items arrive through "3 new" or insert without moving what is being read. Hover, focus, or text selection hold the row [J].
- Keep the old value on screen until the new one arrives. Never blank on refresh [S].
- Mark changes with a cue that lasts more than a few seconds and offer a change log, because change blindness is strong (Rensink [E]).
- No count-up, pulse, or entrance animation on data refresh. A count-up shows false values while running, and motion is a scarce signal (Bartram [E], ASM [S]).
- Use `role=status` with `aria-atomic` for key values, `role=log` for feeds, `role=alert` only for important time-sensitive messages. Do not put a ticking chart in a live region (WCAG 4.1.3).
- Update text in place with stable keys so control references survive (see `agent-surfaces.md`).
- Tabular numerals and fixed widths stop numbers shifting as they change.

## 7. States

Build these, not only the happy path. Happy-path dashboards are the most universal failure, and outdated or incomplete data is a named cause of abandonment (Rossi [E]). Test with worst-case data: none, one, huge numbers, the longest real name.

| State | Show | Never |
|---|---|---|
| First load | Reserved layout, title, status text. Progress after 1 s, percent and cancel past 10 s | Layout replaced by a spinner; fake data |
| Refreshing | Old values with subtle status | Blanking, flashing |
| Valid zero | "0 orders today" with axes, and what would change it | Blank chart |
| No data yet | Why, and the next step | A misleading 0 |
| Gap in series | Visible gap with a marker | Zero-fill, silent bridge (Song and Szafir [E]) |
| Partial period | Marked final segment, excluded from delta, "12 h of 24" | A sharp fake drop |
| Partial sources | Which failed, what totals exclude | Quiet undercount |
| Stale | Last value, marked, age in words, expected cadence | Fresh-looking number |
| Error | What failed, last good value and time, retry | Empty panel, stack trace |
| Conflicting data | Say the sources disagree. AF447 investigators cited the absence of a clear display of known airspeed inconsistency (BEA [S]) | A precise number |
| Monitoring down | Global statement from the client clock (AWS S3 2017 [S]) | Green |
| Frozen, muted, filtered | Labeled state word | Silence |

**Silence requires a positive reading.** A panel with no data says "no data since 14:02", never a green check.

**Freshness.** Show data time, not render time, absolute and relative with time zone: "as of 14:02 UTC, 6 min ago". Give each panel its own freshness when sources differ. Compute age on the client, so a dead server cannot claim freshness. Treat about twice the cadence as stale to start with [J].

**Uncertainty.** Forecasts look different from actuals. Intervals are labeled in words, since published researchers misread error bars (Belia [E]). Give sample size when rates rest on few events.

## 8. Comparison

Toggling between metrics turns seeing into remembering. Put compared things on one screen, same scale, window, and units.

- Few items, nearby comparison: overlay. Many items or far apart: small multiples (Javed, Ondov [E]).
- If the difference is the point, compute it and show it sorted (Gleicher [P]).
- Two bar distributions: mirror or overlay, never stack (Ondov [E]).
- Use static displays for long sequences (Robertson [E]). Animation helps only flipping between two states (Ondov [E]).
- Name the comparator every time. Add reference lines for target or prior period.
- Linked views mirror filters, and the filter state is visible.

## 9. Stressed readers

Direct evidence is thin. Stress narrows attention and working memory (NASA review, excerpt). The rules below are reasoned from that [J]:

- Normal range and next action on screen, not in memory.
- Everything for the task in one place. No hover, modal, or deep menu for what an incident needs.
- Same layout in calm and crisis.
- Severity order by default, plus what changed in the last N minutes.
- Plain status words over codes, with codes available alongside.
- Dangerous actions reachable but hard to misfire.
- Project where you can: "disk full in about 3 h", marked as estimate (Endsley's third level).

## 10. Charts for agents and screen readers

Screen-reader users extracted information 61% less accurately from online charts, taking 211% longer (Sharif 2021 [E]). Models read chart values poorly without data, and vision models confuse colors: exposing exact values costs little, and misreading can cost a lot.

Default pattern:

```html
<figure role="group" aria-labelledby="c1-title">
  <figcaption>
    <h3 id="c1-title">EMEA fell 8% while other regions grew</h3>
    <p>Net revenue, USD, Jan to Jun 2026.
       <time datetime="2026-07-01T06:00Z">Data as of 1 Jul, 06:00 UTC</time></p>
  </figcaption>
  <svg aria-hidden="true"><!-- visual only --></svg>
  <p>EMEA ended at $4.1M, down from $4.5M. Americas rose 5% to $9.2M.</p>
  <table>
    <caption>Net revenue by region and month, USD</caption>
    <thead><tr><th scope="col">Month</th><th scope="col">EMEA</th></tr></thead>
    <tbody><tr><th scope="row">Jan</th><td>4,500,000</td></tr></tbody>
  </table>
  <a href="revenue.csv" download>Download the data for this chart (CSV)</a>
</figure>
```

- Write summaries about statistics and trends, not encodings. "Bar chart with blue bars" is what blind readers rank lowest (Lundgard and Satyanarayan [E]).
- `data-*` attributes, JSON in a script tag, and CSS meaning do not reach a tree agent. Put values in text and table cells.
- A closed `<details>` hides its table from some serializers. A visible table, or visually-hidden CSS, stays in the tree. Offer an export too.
- Recharts 3's `accessibilityLayer` adds `role="application"` with values behind arrow keys, which a tree agent may see as opaque. Test it and assume it is insufficient on its own.
- Exact values go in cells. KPI text can abbreviate if the exact number is reachable.
- Past a few dozen rows, summarize and link a download, since very long hidden tables are hard to navigate [J].
- Filtered chart and table must agree.

## 11. Common failure patterns, sorted by real harm

| Pattern | Verdict | Fix |
|---|---|---|
| Percent delta with no period or base | Harmful | Comparator, base, history |
| Delta or sparkline invented because data lacks it | Harmful | Show what exists |
| Green up, red down arrows | Harmful | Direction-of-good, sign, word |
| Y domain from data min on bars | Harmful | Zero base |
| Tooltip as only access to values | Harmful | Text or table |
| Hard-coded "Live" or "Updated just now" | Harmful | Derive from timestamps |
| Average latency only | Harmful | Percentiles |
| Happy path only | Harmful | Section 7 |
| Same color with different meanings | Harmful | One meaning per color |
| Radial gauges for reading values | Harmful for reading | Bullet or bar |
| Neon saturated palette on monitoring views | Harmful there | Save color for abnormal |
| Same-weight card grid for triage | Conditional | A clear primary |
| Sparkline with no value, scale, or band | Conditional | Add end value and normal band (Tufte [P]) |
| Stacked area by default | Conditional | Off by default |
| Curved lines on sparse data | Unknown | Prefer linear or step [J] |
| KPI row itself | Fine | Single values appear in 88% of dashboards (Bach [E]). Fix the context, not the row |
| Donut instead of pie | Fine | As accurate as pie (Skau and Kosara [E]) |
| Dark mode | Fine | Support both where people work long hours; test each |
| Gradient under a zero-based line | Taste | |
| Particular fonts, rounded cards | Taste | Not a usability question |

Patterns under "Fine" and "Taste" are not defects. Do not rewrite them to look less generated: removing them does not make an interface better. taste-skill's own blind tests found 0 audit failures still lost to baselines with 8 to 13.
