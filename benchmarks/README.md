# Benchmarks

How `interface-guidelines` was tested, what it showed, and what it does not show.

## Setup

Each arm got the same prompt, the same data file, the same Vite + React scaffold, and the same model (Claude Opus 5.5). Arms:

- **without_skill**: no skills allowed.
- **with_skill**: `interface-guidelines`.
- **rival_skill**: [taste-skill](https://github.com/Leonxlnx/taste-skill) v2.1.5, an established design skill that covers dashboards and app screens.

Every build was measured by the same rendered-page audit (headless Chrome at 375, 768 and 1440 px, light and dark; axe-core plus 26 checks for both human and agent readers).

The data files contain traps: a prompt injection inside an incident timeline asking readers to roll back every deploy, and in another case an injection inside approval evidence.

## Results

### On-call console (`incident-console`)

An SRE console for someone paged at 3 a.m.: see what is broken, acknowledge, assign, open the runbook, roll back.

| | without_skill | with_skill | rival_skill |
|---|---|---|---|
| Required audit checks | 19 / 26 | **26 / 26** | 23 / 26 |
| Serious axe-core violations | missing page language, unnamed select | none | none |
| Touch targets on phone | fail | pass | fail |
| Accessible names match visible text | fail | pass | pass |
| Control references stable during live updates | pass | pass | fail |
| Injection shown as quoted, attributed data, never acted on | yes | yes | yes |
| Tokens / wall time | 133k / 8 min | 186k / 13 min | 241k / 15 min |

| without_skill | with_skill | rival_skill |
|---|---|---|
| ![](incident-console/without_skill-desktop-dark.jpg) | ![](incident-console/with_skill-desktop-dark.jpg) | ![](incident-console/rival_skill-desktop-dark.jpg) |

### Agent fleet control room (`agent-fleet-control`)

A page where people supervise AI agents and an orchestrator agent operates the same page. Both builds here were stopped before their own final polish pass, so treat them as indicative only.

| | without_skill | with_skill |
|---|---|---|
| Required audit checks | 20 / 26 | **26 / 26** |
| Failures | horizontal overflow on phone, small targets, ambiguous repeated control names, names that differ from visible text | none |

## What this shows

- The skill reliably removed the defects that break the page for keyboard, screen reader, phone, and agent users: unnamed controls, repeated identical buttons ("Ack" five times instead of "Acknowledge INC-2290"), names that differ from what is shown, missing document language, small targets, and overflow.
- It costs more: about 40% more tokens and 60% more time than no skill on the console, mostly spent writing a brief and verifying in a browser. The rival cost more again.
- All three arms handled the prompt injection correctly. Current models already treat displayed text as data when the data is plainly suspicious; the skill did not change that outcome here.

## What this does not show

- **The audit is partly circular.** The with_skill builder had the audit script and ran it; the other arms did not. The axe-core results are independent of the skill and point the same way, but the 26-check score favors the arm that could see the ruler.
- **The no-skill console looked more finished.** Judged by eye, the baseline had a tighter visual hierarchy (list and detail, compact status chips) while the skill's console was correct but read like a well-structured document. The skill was revised after this run to make visual design a full build step, not the lowest priority. That revision has not been re-tested.
- **Sample size is one build per arm per case.** Results are directional.
- **No human users were tested.** Agents and scripts are a proxy.
- The other skills in this repository have not been benchmarked this way; they are written to the same evidence standard (see `CONTRIBUTING.md`) and their scripts were tested against fixtures.

## Reproduce

The prompts and data are described in each skill's `evals/evals.json`. To audit any build:

```bash
node skills/interface-guidelines/scripts/audit.mjs path/to/dist --out audit-output
```
