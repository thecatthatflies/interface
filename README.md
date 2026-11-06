# interface

Skills that teach coding agents to design interfaces people find intuitive and agents can operate reliably.

An interface now has two readers: a person looking at the screen, and an agent reading the accessibility tree or calling tools. These skills are built on the long-lived, human-written guideline canon (the 1992 Macintosh Human Interface Guidelines, WCAG, GOV.UK, Apple and Microsoft guidance, control-room display standards, and peer-reviewed HCI research) rather than on model taste. Every rule is tagged with the strength of its evidence, and the skills ship scripts that check the real rendered result instead of trusting the code.

## The skills

| Skill | Use it for |
|---|---|
| [`interface-guidelines`](skills/interface-guidelines) | The foundation. Ranked principles for both readers, a brief, build, verify, operate workflow, and a rendered-page audit (axe-core plus 26 human and agent checks at three widths, light and dark). Every other skill builds on it. |
| [`brand-identity`](skills/brand-identity) | Logos, color, type, assets and themes as real files: OKLCH palettes checked against WCAG, SVG logos from simple wordmarks to complex symbolic marks with a 16 px to 512 px contact sheet, favicons, app and social assets, design tokens, and a brand guidelines page. |
| [`dashboard-design`](skills/dashboard-design) | Monitoring, analytics and KPI pages, live data, alarms, honest charts and tables |
| [`landing-page-design`](skills/landing-page-design) | Marketing pages, launches, pricing, waitlists, with real art direction |
| [`web-app-design`](skills/web-app-design) | SaaS and internal tools: navigation, lists and detail, tables, settings, empty states, permissions |
| [`mobile-app-design`](skills/mobile-app-design) | Native iOS and Android and mobile web: platform conventions, reach, gestures, safe areas, offline |
| [`form-design`](skills/form-design) | Sign-up, checkout, onboarding and multi-step flows, validation and errors |
| [`ai-chat-design`](skills/ai-chat-design) | Chat and assistant interfaces: streaming, sources, tool calls, approvals, trust calibration |
| [`agent-tool-design`](skills/agent-tool-design) | Surfaces only agents use: MCP tools, CLIs, APIs, structured errors, with a tool-definition linter |
| [`ecommerce-design`](skills/ecommerce-design) | Storefronts, product pages, cart and checkout, product data shopping agents can read |
| [`content-site-design`](skills/content-site-design) | Docs, blogs, editorial and knowledge bases: reading, navigation, search |
| [`desktop-app-design`](skills/desktop-app-design) | Electron, Tauri and native desktop: menus, shortcuts, windows, dense multi-pane layouts |
| [`email-design`](skills/email-design) | Transactional and marketing HTML email that survives real clients and dark mode |

Skills trigger on their own when a request fits, including casual ones ("make me a simple page for my bakery orders").

## Install

**Claude Code**

```bash
/plugin marketplace add thecatthatflies/interface
/plugin install interface@interface
```

**Any agent that reads a skills folder** (Claude Code, Codex, and others)

```bash
git clone https://github.com/thecatthatflies/interface.git
cd interface
./install.sh                      # all skills into ~/.claude/skills
./install.sh --codex              # into ~/.codex/skills
./install.sh brand-identity       # one skill (the foundation comes with it)
```

The scripts need Node 18 or later. Browser checks use your installed Chrome, or download Playwright's Chromium on first use.

## What makes these different

- **Two readers, one semantic layer.** What exists, what is possible, what state things are in, what happened, why something was refused, and how to undo it serve people and agents alike. Pointing, motion and beauty serve only people. The skills say where the two conflict instead of pretending they do not.
- **Evidence over folklore.** Rules carry tags: empirical, standard, practitioner, or judgment. Popular claims that do not survive a check (the 400 ms Doherty threshold, Hick's law as "fewer options", 7 ± 2 for menus, "skeletons feel faster") are listed with what to say instead.
- **Checked in a real browser.** The audit renders the page and checks what people and agents actually get: contrast, names, keyboard reach, targets, overflow, reduced motion, layout stability, and whether agent references survive live updates.
- **No house style.** The skills own behavior, structure and honesty. The look comes from the product, or from `brand-identity`.

## Results

On an on-call console built three ways by the same model, the version built with `interface-guidelines` passed 26 of 26 audit checks with no serious accessibility violations; the version built with no skill passed 19, and one built with an established design skill passed 23. The no-skill version looked more finished, and the skill was revised in response. Full results, costs, screenshots and limits are in [benchmarks](benchmarks).

## Repository

```
skills/<name>/SKILL.md        instructions the agent reads first
skills/<name>/references/     detail, read on demand
skills/<name>/scripts/        checks and generators
skills/<name>/evals/          test prompts
research/                     source digests behind the rules
benchmarks/                   how the foundation was tested
```

Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Apache 2.0](LICENSE)
