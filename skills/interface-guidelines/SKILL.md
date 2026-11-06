---
name: interface-guidelines
description: Design, build, and review interfaces that work for people and for the AI agents that operate them, grounded in the Human Interface Guidelines tradition, empirical HCI, WCAG, control-room display practice, and agent-surface research. Use whenever building or reviewing a dashboard, admin panel, internal tool, console, data table, form, settings page, or other product UI, including casual requests from non-technical owners ("a simple page for my orders"), and whenever designing a CLI, MCP server, tool definition, or API agents will call, or a page that supervises AI agents, even if nobody mentions guidelines. Not for marketing pages or brand identity.
---

# Interface guidelines

An interface now has two readers: a person looking at pixels, and an agent reading the accessibility tree or calling tools. Serve both without pretending they want the same things.

**What transfers** is the semantic layer: what exists, what is possible now, what state things are in, what just happened, why something was refused, how to reverse it. Get it right once and expose it through every channel.

**What does not transfer** is the sensorimotor layer: pointing, dragging, position, motion, beauty. Design those freely for people. Where the two readers conflict, choose explicitly (`references/agent-surfaces.md` section 4).

## Principles, in rank order

When two collide, the earlier one wins.

1. **Everyone can use it.** Keyboard, contrast, accessible names, reflow. A missing name blinds a screen reader and an agent alike: accessibility is the channel the two readers share. Native elements first; wrong ARIA misleads everyone.
2. **It tells the truth.** Never invent data, deltas, trends, or status. Totals come from rows. Zero is not missing. Partial periods are marked. Show what was observed, not what was requested. Silence is not health.
3. **It says what it means.** Status in words, not only color. Buttons name outcomes ("Roll back to v2.3", not "Confirm"). Errors say what failed, why, and what to do next, in the reader's terms.
4. **The answer comes first.** Name the screen's one question and put its current answer where it is read first. Prominence follows frequency. Density follows practice: experts scanning daily get dense, occasional users get sparse.
5. **Mistakes are survivable.** Prevent, then undo, then confirm. Confirmations wear out and an agent can click them, so gate only what is severe and irreversible, state the exact effect, and keep real authority on the server. Preview, reversal, and repeat-safety are three separate mechanisms.
6. **It stays put.** People need stable layout; agents need references that survive re-render. Different tests, require both. Update values in place, do not reorder rows under the pointer, keep names stable while numbers tick.
7. **What is possible is visible.** Recognition over recall, for both readers. No action only on hover. Choices enumerable. Mode, filters, and sort shown, and in the URL. An outcome outlasts its toast.
8. **Follow convention.** Unusual controls cost learning and break tools. Brand owns the look; convention owns the behavior.
9. **Then make it handsome.** Polish builds trust and matters for long use, and it comes last. Typeface and accent are decisions for this product, not rules.

## Workflow

### 1. Brief (before any code)

Write a short brief, under 20 lines, in your notes or `BRIEF.md`. If the user is away, state assumptions and keep going.

- **Reader:** who, how practiced, in what conditions (phone with floury hands, 3 a.m. page)?
- **Frequency** of each task, and the **cost of an error**.
- **Genre:** operational, analytical, personal status, or supervision (`references/dashboards.md` section 1).
- **The one question** the first screen answers.
- **Primary tasks** with their steps. These become your test script.
- **Agent reader:** accessibility tree, tools, or none? Assume a web UI may be agent-driven unless told otherwise.
- **Who writes each displayed field?** Mark anything an outsider can write (ticket text, webhook payloads, agent output, customer notes).
- **Risky actions,** each placed on the ladder in `references/oversight-and-safety.md` section 2.
- **Data truth:** what is missing, partial, stale, or demo?

Reader, frequency, and error cost settle most disputes. Do not import control-room density into a bakery owner's phone page, or friendly spaciousness into an on-call console.

### 2. Read only what the brief needs

| File | Read when |
|---|---|
| `references/human-interface.md` | Any screen a person uses |
| `references/dashboards.md` | Data, charts, tables, monitoring, alarms, live values |
| `references/agent-surfaces.md` | Agents may operate it; also CLI, MCP, tools, API |
| `references/oversight-and-safety.md` | People supervise agents, consequential actions, or outsider-written text is displayed |
| `references/evidence.md` | Before citing a number or a "law"; much UX folklore is wrong |

### 3. Build structure before style

1. **Semantic skeleton.** Landmarks, one `h1`, headings that outline the page, real `<table>` for tabular data, labeled fields, native `<button>`/`<a>`/`<select>`. Repeated actions get unique names from system IDs ("Acknowledge INC-2290", not five "Ack" buttons).
2. **One function per action**, shared by every control that triggers it. Separate *requested* from *confirmed* state, and announce outcomes in a polite live region as well as visually.
3. **States, now, not later:** loading, empty, error, stale, partial, each with real words.
4. **Truth:** totals from rows, one variable per fact, comparators named ("vs Sep"), zero distinct from missing, nothing invented.
5. **Style** for this reader. Neutral at rest on monitoring screens so alarm color means something. Do not chase or avoid "AI tells"; ask whether a choice serves this reader's task.

### 4. Verify in a real browser

Your code says what you intended, not what rendered.

```bash
node <skill-dir>/scripts/audit.mjs <dist-dir-or-url> --out audit-output --canary "<a sample of outsider-written text>"
```

It checks three widths in light and dark: axe-core, overflow, target sizes, keyboard reach, focus, reduced motion, layout shift, accessible names, and whether agent references survive live updates. Fix each failure or record why it stays. Then look at the screenshots in `audit-output/screens/` and fix what looks wrong. The audit is a floor: passing it does not predict task success.

### 5. Operate it as both readers

- **As an agent:** do each primary task using only the accessibility snapshot, no pixels, no source (`agent-browser snapshot`, then `click @e3`). Confirm each outcome from a fresh snapshot; some tools report success on missed clicks. If you cannot find a value or tell what changed, that is an interface defect.
- **As a person:** do the tasks by keyboard and at phone width, in the brief's conditions.
- **With bad data:** none, one, huge numbers, the longest name, stale feed. Nothing blank, nothing misleading.

At most two fix rounds. Open-ended self-review burns effort without improving the result.

### 6. Hand off honestly

State what you built, what you verified, what you did not, what is demo data, and any accepted exceptions with reasons. Do not score your own work.

## Traps

- An agent can click a confirmation dialog. A dialog is not authority.
- Outsider-written text never goes into control names, headings, or anything styled as an instruction. Show it as quoted data with its source.
- Do not write instructions to agents in page content; it looks exactly like an attack.
- Bolting on ARIA, JSON-LD, llms.txt, or WebMCP does not make a page agent-ready; meaning has to be in the page. WebMCP is an unshipped proposal: add it only on request, as an enhancement.
- Removing purple, gradients, or particular fonts is taste work, not quality work.
- A number nobody can act on is decoration. Every figure on the first screen should change a decision.
