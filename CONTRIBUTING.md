# Contributing: authoring spec for the skill family

Every skill in `skills/` follows this spec so the family reads as one system. An agent writing or revising a skill reads this first.

## The family

| Skill | Covers | Leans on |
|---|---|---|
| `interface-guidelines` | Foundation: ranked principles for people and agents, brief-build-verify-operate workflow, rendered-page audit | — |
| `dashboard-design` | Monitoring, analytics, KPI and status pages, live data, alarms, charts and tables | foundation |
| `landing-page-design` | Marketing pages, product launches, pricing, waitlists, one-pagers | foundation, `brand-identity` |
| `web-app-design` | SaaS and internal product UI: navigation, lists and tables, detail views, settings, empty states, onboarding, permissions | foundation |
| `mobile-app-design` | Native iOS and Android apps and mobile-first web/PWA: platform conventions, thumb reach, gestures, safe areas, offline | foundation |
| `form-design` | Forms and multi-step flows: sign-up, checkout, onboarding, wizards, validation, errors | foundation |
| `ai-chat-design` | Conversational and AI-assistant UI: streaming, citations, tool use, uncertainty, approvals, memory, agent activity | foundation |
| `agent-tool-design` | Surfaces only agents use: MCP servers, tool definitions, CLIs, APIs, structured errors | foundation |
| `ecommerce-design` | Storefronts, product listing and detail, cart, checkout, order status | foundation, `form-design` |
| `content-site-design` | Docs, blogs, editorial, knowledge bases: reading, navigation, search | foundation |
| `desktop-app-design` | Electron, Tauri and native desktop: windows, menus, shortcuts, multi-pane density, system integration | foundation |
| `email-design` | Transactional and marketing HTML email: client constraints, dark mode, plain-text parity | foundation, `brand-identity` |
| `brand-identity` | Strategy and vibe, color system, typography, logo (SVG, simple to complex), assets, theme tokens, guidelines page | — |

## Shape of a skill

```
skills/<name>/
  SKILL.md              under 300 lines (foundation and brand: under 500)
  references/*.md       detail, read on demand; each over 100 lines has a contents list
  scripts/              only when a script checks or generates something better than prose can
  evals/evals.json      3 realistic prompts, at least one casual and one expert
```

### Frontmatter

```yaml
---
name: <name>
description: <what it does> + <when to use it, listing concrete trigger phrases and contexts, including casual ones> + <what it is not for, pointing to the sibling skill>. Under 1024 characters.
---
```

Descriptions should be slightly pushy so the skill triggers when relevant, and name the sibling that owns adjacent work so two skills do not both fire.

### SKILL.md body, in this order

1. **One paragraph:** what this kind of interface is for and the single most common way models get it wrong.
2. **Foundation line:** "Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first." Keep this exact ranking so the family agrees.
3. **Brief:** the questions specific to this interface type that settle design (reader, context, frequency, cost of error, plus type-specific ones). Short.
4. **Rules that are specific to this type,** grouped, each with an evidence tag: **[E]** empirical, **[S]** standard or institutional guideline, **[P]** respected practitioner, **[J]** judgment. Do not restate the foundation.
5. **Build order** for this type.
6. **Verify:** the concrete checks for this type, including `node <interface-guidelines>/scripts/audit.mjs <dist|url>` when it is a web surface, plus type-specific checks (for example: email in a real client matrix, mobile on a device size range, a CLI with `--help` and `--json`).
7. **Traps:** the failure modes models actually produce for this type.
8. **Reference table:** file, read when.

## Evidence bar

- Every rule carries a tag. **[E]** and **[S]** need a named source in the reference file (author year, or the standard and section). **[P]** names the practitioner. **[J]** is honest judgment.
- Do not cite folklore as findings. `skills/interface-guidelines/references/evidence.md` lists the common offenders (Doherty 400 ms, Hick's law as "fewer options", 7±2, 3-click rule, 50 ms trust, skeletons feel faster, dark mode reduces eyestrain). Use its "say instead" wording.
- Where respected sources disagree on a style value, say so and give the deciding question, not a fake rule.
- Platform guidance (Apple HIG, Material 3, Fluent, GOV.UK, Baymard for e-commerce, Litmus/Can I Email for email) counts as [S] or [P]; quote the rule, not the vibe.

## Writing style

- Imperative, plain, concrete. Explain why when the reason is not obvious; models follow reasons better than capital letters.
- No ALWAYS or NEVER in capitals. No filler. No emoji.
- Examples show the good and the bad side by side when the difference is subtle.
- Do not prescribe one look. Brand owns the look; the skill owns behavior, structure, and honesty. Point to `brand-identity` for visual identity.
- The two readers matter for every type: say what an agent operating or reading this interface needs, even if it is one line.

## Evals

`evals/evals.json`:

```json
{
  "skill_name": "<name>",
  "evals": [
    { "id": 1, "prompt": "realistic user request", "expected_output": "what good looks like", "files": [] }
  ]
}
```

Make prompts that sound like real people: one casual and vague, one detailed and expert, one with a trap (bad data, a risky action, an injection in displayed text, a platform constraint).
