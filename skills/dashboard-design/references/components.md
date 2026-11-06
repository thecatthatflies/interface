# Dashboard components and worked layouts

Read this when building the parts of a dashboard. Each component lists what it must contain, its markup for both readers, and the common mistake. Chart-type choice and axis rules live in `interface-guidelines/references/dashboards.md` sections 2 and 3; they are not repeated here.

Tags: **[E]** empirical, **[S]** standard or institutional, **[P]** practitioner, **[J]** judgment.

## Contents

1. Status sentence
2. KPI tile
3. Bullet graph
4. Sparkline
5. Time-series panel
6. Data table
7. Alarm and incident list
8. Filter and time bar
9. Panel states
10. Worked layouts: operational, analytical, small business

## 1. Status sentence

The first text under the `h1`. It answers the one question with numbers and is computed from the same data as the panels [J].

```html
<p role="status" aria-atomic="true" id="summary">
  2 of 14 services degraded: checkout (p95 1.8 s, target 0.5 s) and search (errors 4.2%).
  <time datetime="2026-11-05T14:02Z">As of 14:02 UTC</time>.
</p>
```

- Generated from data with a template per state (all healthy, some degraded, data missing). "All systems operational" is only ever the output of a check, never a literal [J].
- If data is stale, the sentence says so first: "No data since 13:40 UTC (22 min). Status unknown." [S: foundation states, AWS S3 2017].
- Do not put the whole sentence in a live region that updates every second; update it when its meaning changes [S: WCAG 4.1.3; J].

## 2. KPI tile

Parts: name, value with unit, comparator, normal band or target, history, data time, link onward (SKILL.md shows the anatomy).

```html
<section aria-labelledby="k-lat">
  <h2 id="k-lat">Checkout p95 latency</h2>
  <p class="value">420 ms</p>
  <p>Target under 500 ms. Was 380 ms at this time last week (up 40 ms, within normal).</p>
  <svg aria-hidden="true"><!-- sparkline --></svg>
  <p><time datetime="2026-11-05T14:02Z">As of 14:02 UTC</time></p>
  <a href="/latency?service=checkout&from=-7d">Latency by endpoint</a>
</section>
```

- The value's precision fits the decision: 420 ms, not 419.73 ms; 3.1%, not 3.0947% [P: Few].
- Abbreviate large numbers in the tile ("$1.2M") only if the exact figure is reachable in text or the table [J].
- Status words beside color: "Above target", "Within normal" [S: WCAG 1.4.1].
- Tiles have no hover-only content; everything above is visible or in the DOM [S: USWDS, Chartability].
- Mistake: a tile per metric the database happens to have. Tiles are for the handful of figures that answer the question.

## 3. Bullet graph

For one measure against a target and qualitative ranges [P: Few spec]:

- One bar for the featured measure, a short perpendicular line for the target, 2 to 5 background bands (3 is typical) for poor, satisfactory, good.
- Bands in shades of one hue, so it survives color-vision deficiency and grayscale [P: Few].
- Linear scale from zero for the bar [E: Yang 2021; Correll 2020].
- Text equivalent: "Q4 revenue $3.1M of $4.0M target (78%), 61 of 92 days elapsed."
- Use instead of radial gauges and progress rings, which are read less accurately [E: Waldner 2019].

## 4. Sparkline

A word-sized line showing shape, not values [P: Tufte].

- Always print the current value beside it, and preferably the min and max or a normal band [P: Tufte].
- State the window ("last 7 days") in the tile, not only in a tooltip [J].
- Shared y scale across a row of sparklines that will be compared, or a clear note that each is scaled to itself [S: Smith and Mosier single-scale; J].
- Under 80 px tall, treat it as shape only and never ask the reader to read a value from it [E: Heer and Bostock 2010].
- Mistake: a sparkline generated from random data to fill space. If there is no history, show none and say why.

## 5. Time-series panel

- Title states the finding ("Errors rose after the 13:20 deploy"); subtitle states measure, unit, window, time zone [S: Analysis Function].
- Lines labeled directly at their ends; at most about 4 lines, otherwise small multiples on a shared scale [S: Analysis Function; E: Javed 2010].
- Target or threshold drawn as a labeled line; normal band as a light area [P: Tufte, Hollifield].
- Event annotations (deploys, incidents, data gaps) as labeled markers, also listed in text below the chart [P: Grafana; J].
- Gaps drawn as gaps, not zero and not bridged [E: Song and Szafir].
- The current, incomplete bucket is visually distinct and excluded from "change" calculations [J].
- Agent and screen-reader layer: summary sentence and a table of the plotted values, or a link to download them, inside the same `figure` (foundation `dashboards.md` section 10).

## 6. Data table

```html
<table>
  <caption>Services by status, worst first. 14 services. As of 14:02 UTC.</caption>
  <thead><tr>
    <th scope="col">Service</th><th scope="col">Status</th>
    <th scope="col" class="num">p95 latency (ms)</th><th scope="col" class="num">Errors (%)</th>
    <th scope="col">Last deploy</th>
  </tr></thead>
  <tbody><tr>
    <th scope="row"><a href="/svc/checkout">checkout</a></th><td>Degraded: latency above target</td>
    <td class="num">1,800</td><td class="num">0.4</td><td>13:20 UTC (v4.12)</td>
  </tr></tbody>
</table>
```

- Caption states the sort and the count [J].
- Row header is the entity name and its link; unique action names per row ("Acknowledge INC-2290") [S: WCAG 2.4.6; foundation].
- Numeric columns right-aligned, tabular numerals, one precision per column, units in headers [S: GOV.UK, Smith and Mosier].
- Sticky header for long tables; horizontal scroll inside the table on small screens rather than squashing columns [J].
- Rows hold position during refresh; new rows arrive via "3 new, show" [J].

## 7. Alarm and incident list

Each item: severity word and icon, what is wrong in plain words, since when, current value against threshold, acknowledgment state with who and when, the next step or runbook link, and a link to the evidence view with its time range [S: SRE, ISA-18.2, 14 CFR 25.1322; P: Grafana].

```text
CRITICAL  Checkout latency above 1.5 s for 12 min (now 1.8 s, threshold 1.5 s)
          Unacknowledged · started 13:50 UTC · likely related: deploy v4.12 at 13:20
          Runbook: Checkout latency · View latency 13:00-now
```

- Sorted by severity, then age. Cascades grouped under one root with a count [S: ISA-18.2; E: Woods, secondary].
- Acknowledged items stay listed, styled differently, until they clear [S: 14 CFR, ASM].
- Text from alert annotations or log lines written by outside systems is quoted data, not the alarm's title [J].

## 8. Filter and time bar

- Native controls (`select`, date inputs, checkboxes) with visible labels; current values shown as text ("Region: EMEA · Last 7 days · UTC") [S: WCAG 3.3.2; foundation agent rules].
- Every filter is in the URL; Back and reload restore it [J].
- A visible "Reset filters" when any filter differs from default [J].
- Filters apply to every panel on the page, or each panel states its own scope [J].
- Changing a filter keeps old values visible with a "Updating" status until new ones arrive [S: Smith and Mosier 2.0/1].

## 9. Panel states

Each panel implements the foundation's state table (`dashboards.md` section 7). Copy patterns:

| State | Panel text |
|---|---|
| Loading, first time | "Loading checkout latency..." in the reserved space |
| Valid zero | "0 failed payments today" with the axis drawn |
| No data yet | "No orders yet. Orders appear here within a minute of being placed." |
| Stale | "Last data 13:40 UTC (22 min ago). Expected every minute." with the old values dimmed but readable |
| Partial | "Excludes EU region: source unavailable since 13:55 UTC." |
| Error | "Could not load latency: query timed out. Showing last good data from 13:58. Retry" |
| Frozen | "Paused at 14:02:10. 37 updates waiting. Resume" |

## 10. Worked layouts

**Operational (on-call console, 1440 px, practiced reader).**

```text
h1 Payments production
[status sentence: 2 of 14 degraded ... As of 14:02 UTC]          [Pause] [Last 1 h, UTC]
[Alarm list: 2 items, severity order]
[Golden signals table: 14 services, worst first, inline sparklines with values]
[Recent changes: deploys, flags, incidents, last 2 h]
Download this view (CSV)
```

Neutral palette at rest; alert hues only on abnormal rows. Nothing needed during an incident sits behind hover or a modal.

**Analytical (weekly growth review, read at a desk, mixed audience).**

```text
h1 Growth, week of 27 Oct
Headline: Sign-ups up 9% vs prior week, driven by the referral campaign (61% of the increase).
[Chart: sign-ups by day, 8 weeks, campaign annotated] [Table under chart]
[Small multiples: sign-ups by channel, shared scale]
[Funnel table: visit > sign-up > activation, counts and step rates, same cohort]
Definitions and data sources
```

**Small business (bakery owner, phone).**

```text
h1 Today, Thursday 6 Nov
"14 orders for Saturday pickup. 3 are unpaid ($86)."
[List: unpaid orders with name, amount, pickup time, "Send reminder to Ana" button]
[List: low stock: flour 2 bags (usually 6)]
"Sales this week $1,240, about the same as last week ($1,190)."
[One small bar chart: sales per week, last 8 weeks, labeled]
```
