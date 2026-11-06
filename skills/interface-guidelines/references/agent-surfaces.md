# Agent surfaces

Read this when agents will operate the interface: any web UI that may be driven by a browser agent, plus tools, MCP servers, CLIs, and APIs.

Evidence tags: **[M]** controlled measurement (mostly preprints), **[P]** probe of real tools, **[S]** standard or documentation, **[G]** vendor or practitioner guidance, **[U]** plausible but unmeasured, **[J]** judgment. Status checked November 2026. This field moves quickly, so verify anything marked as a proposal.

## Contents

1. How agents read a page
2. What the evidence supports
3. Web UI rules
4. Where people and agents conflict
5. Exposing actions: layers
6. WebMCP status
7. Tools and MCP
8. CLI
9. API

## 1. How agents read a page

An interface works through up to three channels at once: the **accessibility tree** (role, name, state, text), **pixels** (screenshots with coordinates), and **tools** (MCP, WebMCP). They must agree. Any divergence is both a bug and an injection path.

No two tree serializers emit the same thing. In a probe of agent-browser 0.27 and Playwright 1.56 [P]:

| Page pattern | What happens |
|---|---|
| Native `<button>` | Works everywhere |
| `<div onClick>` | Heuristic in one tool, plain text in the other |
| Div with `addEventListener` and no pointer cursor | Not an action in either |
| `aria-pressed`, `aria-expanded`, progress values | Each tool drops different ones |
| `aria-sort`, `aria-current`, `aria-busy`, `aria-rowcount`, `datetime`, `data-*`, `title` | Dropped by both |
| `aria-invalid` | Dropped; adjacent error text survives |
| Reveal via `display:none` on hover | Control absent until hover |
| Reveal via `opacity:0` | Present for tree, invisible in screenshots |
| CSS ellipsis | Full text survives |
| JS-sliced text with full value in `title` | Lost |
| Native `<select>` | All options listed |
| Custom dropdown or closed combobox | Current value only, no choices |
| `display:none` radio with a styled label | Radio gone |
| `<canvas>` | No content |
| Div "table" | Rows and columns lost |
| `aria-rowcount=1000` with 6 rows rendered | Reads as 6 rows |
| Button under a transparent overlay | One tool reports success while the overlay takes the click |
| `role=dialog aria-modal` alone | Background stays operable; clicks report success with no effect |
| Native `showModal()`, or `aria-modal` plus `inert` | Tree collapses to the dialog in one tool |
| 2-second toast | Gone by a later observation |

**The working rule follows from that table: anything critical must appear as visible text, not only in an ARIA attribute.** Use both, but do not rest on the attribute.

Which text reaches which reader:

| Technique | Person | Tree | Note |
|---|---|---|---|
| `display:none`, `hidden` | No | No | Safe |
| `aria-hidden` | Yes | No | |
| sr-only, off-screen, `font-size:0`, `opacity:0`, white on white | No | **Yes** | Injection surface when attacker-writable |
| `aria-label` overriding visible text | Sees text | **Sees label** | Also an injection surface |
| Closed `<details>` | No | Varies | Do not rely on it |
| `data-*`, comment, `<template>` | No | No | Invisible to tree agents |

## 2. What the evidence supports

Evidence is thin: mostly one-author and unreviewed preprints, no field A/B tests, nothing on live dashboards. Treat these as the strongest current leads.

| Finding | Numbers | Source |
|---|---|---|
| Native HTML beats component libraries | 91% vs 68-87% | Affora [M] |
| Semantic repair alone helps, exposing choices and state helps more | 43%, then 67%, then 90% | Affora [M] |
| Bolt-on ARIA and structured data added to existing pages did nothing consistent | 77% to 75% | Affora [M] |
| Themes barely matter when meaning is intact | 99.5% across 16 themes | Affora [M] |
| Hidden native inputs are very damaging | 8% to 68% when fixed | Affora [M] |
| Label does not predict what hides behind it | 23% to 64% when surfaced | Affora [M] |
| Critical state visible in the current screen | about +0.2 success | Liu 2026 [M] |
| Stable layout and consistent labels | about +0.1 to 0.27 | Liu 2026 [M] |
| Explicit forward, back, recover controls | about +0.2 | Liu 2026 [M] |
| Failures that name their remedy improve recovery | | Affora [M] |
| Structured tools beat screen driving | Steps 10 to 4.5; 69-70% to 75-86% | CI4A [M] |

**Null or mixed, so do not oversell:** explaining why a control is disabled showed no consistent agent gain, and stating constraints before an attempt was null (Affora). Keep both for people. Navigation consistency was null in Affora and positive in Liu. Added confirmation and split forms raised agent cost with no completion gain.

**Unmeasured:** virtualization, infinite scroll, iframes, dynamic IDs, toast duration, canvas charts, layout shift. Mechanisms are shown by probes; task effects are not. Dynamic IDs are probably overrated for live snapshot agents, since snapshots do not show them, though they matter for replay and scripts.

**Passing automated checks does not predict task success** (Affora). Test by having an agent do the job.

## 3. Web UI rules

### Finding controls

- Every interactive element has a name. A click handler goes on `<button>`, `<a href>`, or a native control. Navigation is `<a>`, action is `<button>`.
- The accessible name contains the visible text (WCAG 2.5.3).
- Names are unique per role in a view. Visible "Edit", name "Edit INC-42". Build the name from a system ID, never from attacker-writable text.
- Visible labels on fields, never placeholder only.
- Generic triggers like "More" or "..." hide what agents and people cannot predict. Name the contents, or surface the top actions.
- A control's center hit-tests to itself: no overlays covering it.
- Every drag has a named command equivalent (WCAG 2.5.7).

### Hidden choices

- No action exists only on hover. Reveal with `opacity`, not `display`, and also on `:focus-within`. For screenshot agents and touch, keep the common action always visible.
- Keep native inputs in the tree: hide visually with `opacity:0` over a label, not `display:none`.
- Use native `<select>` for short fixed lists, since options are enumerable. Large sets get type-to-search plus a typed path.

### State and outcome

- Status is words, not color or a dot.
- State visible in the current view: filters in effect, sort, count, page, mode.
- Outcomes outlast the toast: the changed row, a status region, an activity log.
- Separate requested from confirmed. Say what changed: "INC-42 acknowledged by Maya at 07:14".
- Errors sit next to their cause, say what failed and the remedy, and persist. Give both a sentence and a stable code where relevant.
- Loading is expressed as text. `aria-busy` alone is dropped.
- Times in text carry an absolute value: "2 h ago (10:00 UTC)". `datetime` is dropped by serializers, though use it anyway.
- Never slice text in JS. Use CSS ellipsis, keep the full value in the DOM, and give people a way to expand.

### Data

- Real `<table>` semantics. Status, units, thresholds as text.
- Virtualized sets state their true size in visible text ("1-50 of 1,204"), with search and a paginated or export route.
- View state lives in the URL: filter, sort, selection, range. Reload restores it. Agents and people can share and return.
- Offer "download this view" as a real link.
- Critical chart data per `dashboards.md` section 10.

### Modals and focus

- Use native `<dialog>` with `showModal()`, or mark the background `inert`. `role=dialog` alone leaves the background operable.
- No fake modals: a fixed overlay with no dialog role.
- Dialogs name the target and count. Confirm buttons state the effect: "Roll back checkout to v2", not "OK".
- Focus enters and returns correctly (APG).

### Stability

- Live refresh updates text in place with stable keys. Controls are not remounted.
- Names stay stable across refresh. Put live counters in adjacent text, not in the control's name.
- Toggles keep a stable name plus state, and show visible state text nearby.
- No infinite animation on controls: Playwright refuses to click a moving target [P].
- Reserve layout space. CLS at most 0.1 (Web Vitals [S]).

### Structure and size

- One `main`, navigation landmark, one `h1`, ordered headings. Heading levels reflect structure, not font size.
- Title and `h1` change with the route.
- Keep the tree small: one named control per row rather than five, `aria-hidden` on decorative icons, filters to scope. 42% of raw DOM snapshots exceed a 128k-token window (D2Snap [M]).

## 4. Where people and agents conflict

Do not pretend these away. Each needs an explicit choice.

| Conflict | Person | Agent | Resolution |
|---|---|---|---|
| What "stable" means | Looks stay the same | References survive re-render | Require both, test both |
| Density | Comparison on one screen | Small snapshot | Keep density, cut repetition in the tree |
| Hover and tooltips | Calm rows | Action must be present | Reveal with opacity and on focus. Tooltips never hold unique information |
| Repeated labels | "Edit" is clear in context | Ambiguous | Visible "Edit", name "Edit INC-42" |
| Toggle label | May flip (Pause, Resume) | Stable name | Stable name, `aria-pressed`, visible state word |
| Confirmation | Guards against slips | Costs steps, and an agent can click it | Reversible: undo, no dialog. Irreversible: dialog for the person, authority enforced on the server. **Never remove a gate to help an agent** |
| Multi-step forms | Less overwhelming | More cost | Keep the steps, offer one call or prefilled URL too |
| Progressive disclosure | Reduces clutter | Hidden choices fail | Predictive labels, keep small sets in the DOM, search for large ones |
| Technical detail | Avoid jargon | Needs codes | Two channels: a sentence plus a stable code. Never only one |
| Toasts | Unobtrusive | Gone by next look | Toast plus a persistent record |
| Live updates | Fresh numbers | Stable refs | Text in place, offer pause |
| Virtualization | Performance | Whole set knowable | Keep it, plus count, search, export |
| Charts | See patterns | Need values | Chart, summary, and table together |
| CAPTCHAs | Abuse protection | Should not solve them | Limit to abuse-prone steps. When one appears, say a person must take over |
| Identifying agents | | | Never fork the UI by agent detection. Gate by action and authority |

**Does not transfer at all:** beauty, motion, target size (except that small or overlapping targets break coordinate clicks), visual hierarchy. Design those for people freely. Themes do not harm agents if meaning is intact.

## 5. Exposing actions: layers

Each layer must work with the ones after it absent.

| Layer | Serves | Status |
|---|---|---|
| 1. One shared action service | All | Your code. Buttons and tools call the same functions, so they cannot drift |
| 2. Semantic DOM with visible state | People, screen readers, tree and screenshot agents | Shipping. **This is the requirement** |
| 3. State in URL, real link to CSV or JSON of the current view | Any agent, people | Shipping |
| 4. WebMCP | Browser agents that support it | Origin trial; enhancement only |
| 5. MCP server or API on the same service | Headless agents | Shipping |

Most dashboards need layers 1 to 3 and stop. Add 4 or 5 only when the user wants them. An agent-only surface that replaces the UI is the fear WebKit and the W3C TAG raised, and it hurts accessibility incentives.

## 6. WebMCP status

As of November 2026: **a proposal, not a standard.** Community Group draft. Chrome origin trial, 149 to 162. WebKit opposed, Mozilla neutral, W3C TAG review open. No confirmed production agent consumer found.

- The API moved: `document.modelContext` replaces `navigator.modelContext`, and `provideContext` is gone in favor of `registerTool` with an `AbortSignal`. Most guides are stale. Feature-detect with `'modelContext' in document`. Chrome 149 exposes only the old `navigator` form, so use a newer build to test.
- `use-webmcp-tool` from GoogleChromeLabs is the recommended wrapper. Keep all WebMCP code in one file, since it has changed twice in 2026.
- WebMCP annotations default to low risk (`readOnlyHint`, `untrustedContentHint`, `consequentialHint`), while MCP defaults to potentially destructive (`destructiveHint` true). Do not share annotation code.
- **The task must still pass with WebMCP absent.**

Do not add it unprompted, and do not claim it makes a page "agent-ready". llms.txt: 97% of published files got zero requests in one log study (Ahrefs, an interested party). Low priority, useful mainly for docs. Schema.org and JSON-LD show no evidence of helping agents operate pages.

## 7. Tools and MCP

| Rule | Source |
|---|---|
| Task-shaped tools, not API wrappers. `search_contacts` over `list_contacts`. Fold workflows into one call | Anthropic |
| Single purpose, no overlap. Each tool raises the chance of choosing wrong | Anthropic, Chrome |
| Names are verbs that say what happens. `create_event` does it; `start_event_creation` opens the form | MCP, Chrome |
| Descriptions say what and when, in terms a new hire would understand | Anthropic, OpenAI |
| Enums, specific types, unambiguous params (`user_id`), no contradictory booleans. Strict schemas where supported | Anthropic, OpenAI |
| Do not make the model supply what the app knows, or do arithmetic | OpenAI, Chrome |
| Change args so mistakes are impossible, such as absolute paths | Anthropic |
| Return high-signal fields, readable names, and IDs for follow-up. Offer concise and detailed formats | Anthropic |
| Paginate and truncate by default, and say how to narrow when truncated. State "end of list" | Anthropic, Smith and Mosier |
| Structured output plus serialized text | MCP |
| Expected failures are returned values with the fix; `isError: true`. Protocol errors are for malformed calls | MCP |
| Explicit handles for state, a clear error on expiry | MCP |
| Honest annotations with pessimistic defaults. They are hints, not enforcement | MCP |
| Bind consequential calls to resource ID, state version, plan hash. Recompute on confirm | Chrome |
| Validate inputs, enforce access, rate limit, sanitize outputs (MCP MUST) | MCP |
| One application service behind UI, tools, and tests | Chrome |
| Stable, deterministic tool list | Chrome, MCP |
| Evaluate with realistic tasks, read transcripts, measure calls and tokens | Anthropic |

Keep three mechanisms distinct, since none replaces another:

- **Preview:** dry-run, plan, validation mode. "What would happen?"
- **Reversal:** undo, soft delete, revert. "Take it back."
- **Repeat safety:** idempotency keys. "Did it happen? Safe to send again."

## 8. CLI

clig.dev and 12 Factor CLI were written for people and scripts. They fit agents through the scripting path. The agent benefit is unmeasured [G].

| Rule | Test |
|---|---|
| Data to stdout, logs and errors to stderr | `cmd --json 2>/dev/null \| jq .` |
| `--json` with a stable, additive schema | Snapshot keys across versions |
| Zero on success, distinct non-zero per failure class | Trigger each |
| No prompt without a TTY; `--no-input` fails naming the missing flag | `timeout 5 cmd </dev/null` exits |
| `--dry-run` on anything that mutates, with a machine-readable plan | Assert no state change |
| Confirmation scales with severity; `--force` or `--confirm=<name>` non-interactively | Destructive command with no flag and no TTY refuses |
| Safe to re-run | Run twice, same state |
| No animation or color when not a TTY; honor `NO_COLOR` | No escape codes in piped output |
| Errors state cause and fix | Bad input gives a suggestion |
| `--help` with examples at each level; flags over positional args; `--version` | Parse help |
| `--fields` and pagination; NDJSON for streams | Output size |
| Reject control characters and `../` in IDs | Fuzz |

Do not put secrets in flags or environment variables by default (clig.dev). Keep flags, add `--json` input, use short-lived scoped credentials from a file or helper.

## 9. API

| Rule | Source |
|---|---|
| Errors as `application/problem+json`; `detail` helps fix it; clients do not parse `detail` | RFC 9457 |
| Stable machine reason and metadata | AIP-193 |
| Client idempotency key on POST: store first result, error if params differ, prune no sooner than 24 h | Stripe, IETF draft |
| Validation mode runs the same checks without executing | AIP-163 |
| Freshness precondition on writes | AIP-154 |
| Cursor pagination | AIP-158, Microsoft |
| Long jobs return an operation handle; distinguish accepted, validated, applied (Mac HIG p. 182) | AIP-151, MCP Tasks |
| 429 when throttled, with retry guidance | Microsoft |
| Soft delete where feasible | AIP-164 |
| Field masks and partial responses | AIP-157, AIP-161 |
| Check permission before existence | AIP-193 |
| OpenAPI description with examples | OAI |
