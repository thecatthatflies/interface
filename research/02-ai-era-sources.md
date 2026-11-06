# Research 02: AI-era design sources

Written 2026-11-02. All sources here are **tier 4** under `SCOPE.md`: useful for failure modes and enforcement ideas, not evidence that a rule helps people. Where a claim below rests on something stronger, it says so.

## How to read this file

**Source codes used throughout**

| Code | Source | What I read |
|---|---|---|
| Tl | `design-taste-frontend`, installed copy (the superseded v2 experimental) | Whole SKILL.md |
| Tu | taste-skill upstream, v2.1.5 | SKILL.md, `tells.md`, `research.md`, `critique.md`, `app-screens.md`, `lint.mjs`, `evals.json`, changelog, parts of `rules.mjs`, `probe.mjs`, `charts.js`. Not `inspect.mjs`, `copy`, `type`, `colour`, `layout`, `motion`, `imagery`, `scenes` |
| El | Elaya: elaya.design, plus `elayadesign/ai-design-skills` and `redesign-skill` | Rendered site and accessibility snapshot; whole `landing-page-design`; headings and contrast section of `figma-designer`; opening and headings of `redesign-existing-projects` |
| ADC | `enmerasoftware/ai-design-check` | README, RESEARCH, RULES, `rules.json`, `check.js`, both skills, `proof.md`, changelog |
| Imp | `impeccable` installed v4.5.2 and upstream repo | SKILL.md, `craft-floor`, `operate`, `mode-operate`, `audit`, `critique`, `hooks`, `visualize`; 62-rule catalogue. Rust detector not read line by line |
| Crit | `critique`, installed v2.1.1 (older relative of Imp) | SKILL.md, heuristics, cognitive load |
| WIG | `web-design-guidelines` plus Vercel's `command.md` and guidelines page | All |
| UUPM | `ui-ux-pro-max` | SKILL.md and a structural profile of its CSV data |
| UFX | `user-facing-ux` | All |

**Limits of this pass**

- I did not run any third-party tool. Statements about the checkers come from reading rules and code. The pattern probes in section 1.3 used ADC's regex data in my own script.
- Website content came through a summarizing fetch, except elaya.design, which I rendered in a browser.
- Marks: **[canon]** means the claim comes from my memory of tier 1 to 3 work and was not re-verified here, so the canon digest should confirm it. Everything else was checked in this session.
- Quotation is limited to one short line. The rest is paraphrase. Names in `code` are rule identifiers.

---

## 0. Findings that should change what we do

1. **The strongest evidence in this whole corpus is against tell-removal.** Tu published its own blind tests. Across five rounds the skill beat the no-skill baseline on only 4 of 16 brief-rounds. On unseen briefs it lost 6.9 to 7.9. Its best round (7.7 against 7.8) reused those same briefs. Final builds measured 0 inspector FAILs while baselines measured 8 to 13, yet the baseline's mean score was equal or higher in every round. Removing tells does not by itself make a better interface, at least as model jurors see it. Details in section 1.1.
2. **`design-taste-frontend` as installed is a stale rival.** The local file is dated Jun 25 and explicitly excludes dashboards, data tables and multi-step product UI (its header and section 13). Upstream v2.1.5 now has a dashboard chapter, a real-browser inspector, and blind-test history. Running the local copy on `incident-console` or `revenue-analytics` would test a skill on work it refuses. `SCOPE.md`'s rival arm should pin upstream at a commit, ideally vendored into the workspace, or run both and report which is which.
3. **Tells are dated fashion, and the authors say so.** Tu's registry organizes them into waves (2023-24, 2025, 2025-26), and notes that each published list of replacements became the next tell. In its words, "Tells are not bad design in themselves" (Tu, `tells.md`). Tl recommends Geist and Outfit; upstream's lint now flags Outfit, Imp flags Geist, and El approves Geist. The detectors now name model families (`claude-palette`, `gpt-thin-border-wide-shadow`, `codex-grid-background`).
4. **No source treats an agent as a user of the interface.** Agents appear only as authors. Accidental overlap exists, listed in section 5.1, and it is mostly accessibility and honest data rules. This confirms the project's niche, and also means nothing here can be cited for the agent half of the skill.
5. **The best material is not about looks.** The durable content is: truthful data (Tu `app-screens`), harm-ordered repair (ADC), developer noise leaking into UI (UFX), concrete behavior rules (WIG), and rendered measurement with reasons required for exceptions (ADC, Imp, Tu).

---

## 1. Source by source

### 1.1 tasteskill.dev and taste-skill (Tl, Tu)

**What it is.** The landing page and docs for a very popular open-source skill set by Leon Lin and collaborators (about 108,700 stars, 7,300 forks, MIT). The site says it stops coding agents from shipping generic frontends. The site's docs lag the repo: they describe a self-checked pre-flight list and mention no tooling, while the repo now ships scripts. Its blog page is only a list of four X posts. The site makes no efficacy claims and shows no data. **Read the repo, not the site.**

**Two different products share the name.**

| | Tl (installed, superseded) | Tu (v2.1.5, 2026-10-25) |
|---|---|---|
| Form | One 87 KB markdown file | SKILL.md, 11 references, about 1.7 MB of JSON library, 5 scripts, assets, evals |
| Scope | Landing pages, portfolios, redesigns. Dashboards out of scope | Pages and app screens, with separate runs and rules |
| Direction | Agent reads the brief, sets three 1-10 dials | Script deals 3 of 20 researched directions; agent picks, then adopts |
| Enforcement | 62 self-ticked checkboxes (I counted), no tooling | `lint.mjs` (source), `inspect.mjs` (real browser at 1440/768/390), `scenes.mjs`, screenshot critique with score caps |
| Ban style | Long prose list, hard capitals | Table of house rules, each measured; a dated registry |
| Evidence | Mentions unnamed production tests | Published study and test rounds, with limits stated |

**Enforcement detail (Tu).** The inspector has about 90 rule ids, rendering most of them from computed style and geometry: `contrast`, `overflow`, `covered-text`, `clipped-text`, `broken-image`, `no-title`, `untitled-section`, `reduced-hidden`, plus many taste rules (`eyebrow`, `mono`, `hairline`, `gradient`, `palette-claude`, `palette-purple`). FAILs must reach zero. WARNs must be defensible in one sentence. A self-score of Awwwards weights (design 40, usability 30, creativity 20, content 10) is capped by inspector results, so a FAIL caps overall at 6.0.

**Its study, read critically.** 247 gallery sites from One Page Love and Awwwards, captured once, scored by **21 model reviewers from still frames**, not by people and not by real Awwwards juries. The file states these limits itself and admits the sample is fashion as much as quality. The owner openly labels some bans as personal taste: monospace labels, index numbers and thin rules are *more* common on top-scored sites, and banned anyway. The violet ban is also labelled taste, since 10 of the 23 studied product screens use violet or indigo.

I ran Fisher's exact tests on the published top (n=82) against weak (n=23) rates, reconstructing counts from rounded percentages. This is my calculation, and rough for that reason.

| Device | Top | Weak | p | After Bonferroni (18 tests, a=.0028) |
|---|---|---|---|---|
| Tiny tracked caps, three or more | 6% | 43% | .0001 | Survives |
| Tiny tracked caps, any | 16% | 57% | .0002 | Survives |
| Icon-topped feature cards (panel-observed) | 1% | 28% | .0004 | Survives, but same reader scored and observed |
| Pill above heading | 5% | 26% | .007 | No |
| Gradient fills | 22% | 52% | .008 | No |
| Shadows five or more | 10% | 30% | .02 | No |
| Identical icon-card rows | 7% | 26% | .02 | No |
| Pill badges (panel) | 14% | 34% | .03 | No |
| Shadows, any | 24% | 48% | .04 | No |
| Gradient text | 2% | 13% | .07 | No |
| Emoji | 10% | 26% | .08 | No |
| Mono anywhere | 45% | 26% | .15 | No (points the other way) |
| Mono labels (panel) | 44% | 24% | .15 | No (points the other way) |
| Index numbering (panel) | 38% | 21% | .21 | No (points the other way) |
| Italic-serif accent (panel) | 4% | 7% | .30 | No |
| Eyebrow labels (panel) | 32% | 45% | .33 | No |
| Thin rules | 61% | 52% | .48 | No |
| Backdrop blur | 32% | 39% | .62 | No |

So even inside its own data, the **eyebrow ban, which Tl calls the top violated rule in its tests, has no detectable support**. Tiny tracked capitals do, which fits a plain legibility explanation. Three further problems apply to all of it. The outcome is a model opinion, and model reviewers have read the same anti-slop discourse, so the study can be circular. The weak group is weak only among featured gallery sites. And the panel found usability does not rise with score, so high scores don't track what this project cares about.

**Its test rounds** (`research.md` section 11, six briefs, one model juror per brief per round):

| Round | Briefs | Skill | No skill | Skill wins |
|---|---|---|---|---|
| 1 | 4 | 6.6 | 7.7 | 1 of 4 |
| 2 | 3 | 7.1 | 8.0 | 0 of 3 |
| 3 | 3 | 7.5 | 7.5 | 1 of 3 |
| 4 (unseen) | 3 | 6.9 | 7.9 | 0 of 3 |
| 5 (same as 4) | 3 | 7.7 | 7.8 | 2 of 3 |

The authors note about half a point of noise per score and that jurors are models. They also report a repeated result: a richer page full of template devices beat a cleaner thin page every time. The dashboard chapter records the same: first-round screens were clean and correct, and lost to richer ones.

Reading this as a critic: (a) credit to them for publishing it, which nobody else here does; (b) the drop from round 3 to the unseen round 4 is consistent with overfitting, which supports our holdout case; (c) model jurors may reward visual richness over fitness for use, so a juror-only measure can push a skill toward decoration; (d) the fixes they derived from jurors (a product face, one element only this product has) may be fitted to jurors' boredom rather than to users' tasks.

**App screens chapter (`app-screens.md`).** The most relevant single document in this corpus, and the one to mine. It rests on 23 owner-chosen desktop product screens from 17 unnamed products, with private screenshots, so it can't be audited. It says itself that the study has no phone screens, no loading or error states, one settings page, no inbox and no dense operations table (densest about 120 data points). It marks what goes past the study as house rule, which is good practice.

**Best ideas**

- Separate runs for pages and app screens, because the rules invert between them.
- Name the screen's one question and its one finding. Put the answer in the biggest block and the finding where it is read first.
- Data discipline: a fact shown twice is one variable; totals computed from rows; figures that must agree written as assertions; every relative figure names its baseline; zero printed as zero and missing as a dash.
- Colour on a change says good or bad, not up or down. Latency rising is bad even though the number went up.
- Errors stay inside the failed block and state when the data was last good. A refresh keeps old values and updates a freshness stamp. Disabled controls stay legible and say why. One save model per view.
- Pre-writing the page as claims with proof; deleting sections that have no claim.
- Judge the pictures, not your code, because you read your intentions into code.
- Publishing cost: 30 to 45 minutes and a few hundred thousand tokens per run.

**Problems**

- Tl contains rules that actively mislead: real company logo walls from Simple Icons with no check that they are customers, invented messy-looking numbers (section 9.D) against a flag on fake-precise numbers (section 4.9), `transition: all` prescribed at motion levels 4-7, and marquees and carousels offered as list alternatives.
- Tl's palette rotation asks an agent to remember what it built last project, which it can't.
- Tu's page run requires motion (fails under eight moving elements) and at least four real pictures. These are quotas on decoration. App screens are exempt.
- Tu's `app-screens` default token is Inter, while its own tells table lists Inter or Geist on grey as the kit look. It says one chart series is the norm and tells you to switch metrics with a control instead of overlaying. On comparison work that swaps seeing for remembering.

### 1.2 elaya.design and Elaya's skills (El)

**What it is.** elaya.design is **not a guideline source**. It is a freelance product designer's portfolio and sales page, built in Framer, offering a $2,500 landing page and a $4,000 monthly partnership. No rules, no checklists, no evidence, no link to any repository. If the user named it as a taste reference, it works as that; it can't support a rule.

**The rules are elsewhere.** `elayadesign/ai-design-skills` (about 13,700 stars) holds `landing-page-design` and `figma-designer`; `elayadesign/redesign-skill` holds an audit. **The link between the site and the GitHub account is my inference** from the name, the niche and the phrasing. Neither links to the other, and neither does SlopScan, whose banner is in the repo.

**Structure.** Strategy first (intake, page structure, layout choice, conversion rules, copy formulas), then a fixed visual system: named text styles, a closed spacing table, a nested-radius formula, approved fonts and icon sets, dark backgrounds limited to six hex values. Designed to be forked: edit one values section and the rest follows. Admits borrowing from taste-skill.

**Enforcement.** A self-checked list, plus a closed token table. CI only validates skill frontmatter. No design check ships in the repo. SlopScan (slopscan.co) is a separate hosted audit with 0-100 scores and no published method.

**Best ideas**

- A closed token table is more enforceable than advice, since an out-of-table value is detectably wrong.
- The nested-radius formula is a small correct rule (also in ADC).
- Never invent facts on a real product. Missing facts become visibly marked placeholders such as `{{price}}`. This is the clearest honesty rule in the corpus.
- Intake asked in one batch, with assumptions stated rather than stalling.

**Problems**

- It claims scope over dashboards and all web UI, and offers no dashboard content.
- It *mandates* what other sources ban: gradient text on every hero, and a floating translucent blurred nav.
- It mandates its own future tell: every landing page must include a word-by-word scroll reveal starting at 25 to 35% opacity, which is low contrast by design until it fires.
- Fixed look: bans Inter, Helvetica and italics outright, requires Poppins, Manrope or Geist, forbids hyphens in copy, and sets 500 ms layout motion and a 200 ms minimum for hover. Snapping off-scale type to the step below can only shrink text.

**First-hand observation, useful to this project.** I rendered elaya.design with `agent-browser`. Visually it is polished. Its accessibility tree is poor: the hero heading is level 3 and its subtitle level 5; each booking link contains a level 1 heading, so the page has three h1s, all of them button labels; prices are level 2; 19 elements, apparently the work tiles, appear as generics with click handlers rather than links; the pricing switch is a focusable generic with no switch role. It also uses Space Grotesk and Inter (both flagged by Imp and Tu, Inter banned by El itself), a live clock and an availability dot, which Tu lists as tells. Two lessons, from one page with a site builder as a confound: **visual quality and machine legibility vary independently**, and **a respected designer's work fails the tell detectors, which says more about the detectors**.

### 1.3 enmerasoftware/ai-design-check (ADC)

**What it is.** A rule catalogue, zero-dependency checker and two agent skills from a Turkish software company, drawn from their own shipped screens. **The repository is five days old** at time of reading (created 2026-10-28, 198 stars, v0.10.1), and it changes daily. Reads Tailwind and CSS projects, SwiftUI and Compose. Aimed at dashboards and app screens, unlike most of the field.

**Structure.** 95 rules in `rules.json`, each with id, area, severity, rule, why and fix in English and Turkish, and optional check data. Commands: `inventory`, `narrow`, `system`, `story`, `hook`.

| Measure (my count from `rules.json`) | Value |
|---|---|
| Machine-checked / review-only | 57 / 38 |
| Severity error / warn / info | 9 / 64 / 22 |
| Rationale cites a standard or institution | 7 (WCAG, Microsoft, GOV.UK, Apple, Material) |
| Rationale cites their own Dribbble review | 5 |
| Rationale rests on looking generated or template-like (hand count) | about 15 |
| Rationale is assertion only | the rest |

**The evidence.** `RESEARCH.md` is a look at 16 popular Dribbble and Behance shots, with frequencies it admits came from one reading rather than a measured study. Credit for saying that, and for noting popularity isn't quality. But Dribbble shots are still images chosen for looks, and five rules came from it (`stat-card-anatomy`, `chart-highlight-one`, `dim-secondary-digits`, `no-gradient-buttons`, `no-heavy-card-shadow`).

**Enforcement.** The most complete loop in the field:

- A post-edit hook returning findings to the agent on exit code 2. CI exit codes, GitHub annotations, JSON.
- `--write-baseline` so an existing project sees only new findings.
- Inline ignores count only if they include a reason.
- `narrow` renders in Chrome at phone width and reports overflow and its cause, clipped text, shrunk text and hidden content; `--stress` reruns with long names, big numbers and 40% longer text.
- The fix skill measures gaps and radii as numbers and forbids lowering the count by removing content, and compares words and figures before and after.

**Best ideas**

- **Order of harm:** can everyone use it, is it true, does it say what it means, do the numbers agree, is it one system, is the order clear, what can go, where is the proof. This puts taste last, and it is the best workflow idea here.
- `checked` versus `review` is stated on every rule. Nobody is misled about what the tool can see.
- `inventory`: counts distinct looks per element (its README example shows 149 looks across 726 buttons). A measurable proxy for consistency.
- `worst-case-data`: test with one item, none, a huge number and the longest real name.
- `numbers-with-context`, `no-hover-only-content`, `no-greeting-headline`, `specific-action-labels`, `error-copy`.
- The four-line brief: job, claim, proof, keep.
- The skills treat repository and page text as material, not instructions. Unique in this set, though it protects the author agent rather than the interface's users.

**Problems**

- **Severity is inverted.** `sentence-case`, `type-scale`, `radius-scale`, `selector-language` and `no-ai-gradients` are errors. `legible-contrast` is a warning with no check, and `reduced-motion` is an unchecked note. Style outranks WCAG.
- **`keep-text-on-brand` tells agents not to fix failing contrast on filled buttons,** reporting the ratio instead. This conflicts with its own `legible-contrast` and with WCAG. Tier 2 beats tier 4. El's Figma skill handles the same case better by deepening the brand shade.
- `selector-language` is one company's house preference, at error level, rejecting underline tabs. Tu's product study found underline tabs the common pattern (8 screens).
- `chart-highlight-one` advises category charts use one hue in steps. For nominal categories, ordered steps imply a false order; distinct hues are the standard answer [canon]. Greying all but one series also suits explaining, not monitoring or exploring [canon].
- Static regex misses and overreaches. My probe of its patterns: `no-ai-gradients` matches Tailwind classes only, so the classic `linear-gradient(135deg,#667eea,#764ba2)` in plain CSS is not caught, and no rule's check data mentions `linear-gradient`. `no-side-stripe` fires on any `border-l-2`, `-4` or `-8`, including timelines and quotations, unless allow-listed.
- Its proof of value is a count falling to zero against its own rules, including a video generator for sharing the countdown.
- `no-decorative-uppercase` justifies itself with word-shape recognition, a model reading psychology abandoned (Larson). Imp's `all-caps-body` repeats it. All-caps may still read slower, but the stated mechanism is wrong.

### 1.4 impeccable (Imp)

**What it is.** Paul Bakaus's skill (about 100,500 stars): 24 commands in a steering vocabulary, plus a Rust detector with 62 rules (31 in its slop category, 31 in quality), hooks for many coding tools, a browser overlay, and project context files (`PRODUCT.md`, `DESIGN.md`). The only evidence offered is one with-and-without pair at one brief. The repo has extensive detector fixtures and one activation eval, and a name search of its file tree found no quality A/B evaluation.

**Enforcement.**

- Per-edit hook surfaces only the mechanical tier. A deep pass runs on stop, deduplicated. Cursor can block writes.
- Source scans give pattern rules only. Contrast and tiny text require a rendered URL, and this limit is documented.
- Findings get triaged into fix, narrow justified ignore naming who decided and why, or ask.
- `critique` runs two isolated subagents, design review before detector output so the deterministic list doesn't anchor it, and a skipped subagent must declare itself with a first-line degraded banner.
- A bounded verification ceiling: one batched look, fix, at most one more round.

**Best ideas**

- **Modes by what the visitor's success means:** Persuade, Operate, Read, Experience. Chosen per surface, not per product.
- **Earned familiarity** on Operate surfaces. The failure there is strangeness without purpose, and every control should be the standard one. This is the closest any AI-era source gets to the HIG.
- The brief wins over the anti-pattern list. Listed patterns are defaults to examine rather than prohibitions, except eyebrows.
- Severity tiers by when to interrupt. Narrowest possible exception. Advisory status for fuzzy rules such as em-dash overuse, which it admits people use too.
- **The retreat from asking whether it looks AI-made to asking whether an unrelated product could use it as is.** The older Crit makes slop detection the critical first question; current Imp replaced it with design specificity. That's a meaningful correction from the field's most careful team.

**Problems**

- The opening prompt is persona inflation (award-winning director, no hedging).
- Nielsen misuse: `critique` scores each heuristic 0 to 4 with bands and a trend line. Nielsen's 0-4 rates *individual problems* by frequency, impact and persistence, and a single evaluator is unreliable (NN/g). The output is a precise-looking number from one model, and it invites re-running to watch it improve.
- Internal conflicts: `craft-floor` says theme scrollbars while `operate` lists custom scrollbars as flavor to avoid; `craft-floor` makes kickers an absolute ban while SKILL.md says the brief always wins.
- Against Tu on dashboards: `mode-operate` says a grey screen with one accent is a default that lacks polish, and asks for a committed coloured shell. Tu's screens show about 3% coloured pixels and no dark or saturated sidebar on any of 17 light screens. Both can't be right, and neither has user evidence.
- The launcher may download a binary on first run. A heavy dependency.

### 1.5 critique (Crit), installed v2.1.1

An older relative of Imp's `critique`. Useful: independent assessments, P0-P3 by impact, five walkthrough personas that report what broke rather than generic concerns. Bad: slop detection as the critical opening test, which asks about provenance rather than usability. Also, its cognitive load file cites Cowan (2001) to cap *visible* options at four, dashboards at four metrics without scrolling and pricing at three tiers. Working memory limits concern what you must hold in mind, and visible options don't need holding [canon]. This overreach conflicts with dense at-a-glance dashboards [canon]. Current Imp dropped the dashboard and pricing lines, which suggests they noticed.

### 1.6 web-design-guidelines (WIG)

**What it is.** Vercel's rule list, about 100 terse behaviors with no tell framing. Output is `file:line` findings. The fuller page cites standards and docs, no empirical studies.

**Enforcement.** The model reads the rules and the code. No rendering, so it can't see contrast or layout. The installed skill fetches the rules from GitHub's `main` on every run, which is **unpinned**: results aren't reproducible, and text fetched at runtime becomes instructions, a supply-chain risk.

**Best ideas.** This is the most agent-friendly list here by accident. Semantic HTML before ARIA; `<a>` for navigation and `<button>` for actions; URL reflects filters, tabs and pagination; `aria-live` for async updates; destructive actions need confirmation or undo; submit stays enabled until the request starts; `Intl` formatting; `translate="no"` for identifiers; never block paste. Its section on agents treats them as code authors only.

**Problems.** Title Case for headings and buttons directly conflicts with ADC and Tu. Virtualization above 50 items can remove rows from the accessibility tree, a cost for agents it doesn't consider. It lists `overflow-x-hidden` among the fixes for unwanted scrollbars, alongside fixing the overflow; ADC warns that this hides real overflow from checks.

### 1.7 ui-ux-pro-max (UUPM)

**What it is.** A retrieval skill (about 144,300 stars): BM25 search over CSVs of styles, palettes, fonts, 161 product types and 99 UX guidelines, plus a design-system generator and a master-plus-page-override file pattern.

**Enforcement.** None beyond a self-run checklist. A priority table puts accessibility first, which is the right order.

**Best ideas.** The large quick reference has many sound points, often tagged with an origin (HIG, MD, WCAG): `escape-routes`, `undo-support`, `error-clarity`, `aria-live-errors`, `focus-on-route-change`, `state-preservation`, `deep-linking`, `data-table` for chart alternatives. The master-and-override persistence pattern is sensible.

**Problems.** Breadth without judgment.

- **No sources.** The 99-row guidelines CSV has no source column, and parenthetical attributions are unverifiable as given.
- **Charts and data are ranked last of ten, at LOW priority.** That's our main test bed.
- **Style mapped from product type, with no basis:** a decision rule adds glassmorphism when a SaaS product is data heavy, IoT dashboards get glass plus dark mode, financial dashboards get number animations and alert pulse with light mode as an anti-pattern. The palette for AI platforms is `#7C3AED`, labelled AI purple, a hex that Tu's lint fails by name.
- Smooth scrolling gets the same High severity as confirming deletion.
- **Template leakage:** its workflow calls React Native the project's only stack, while the description promises ten.

### 1.8 user-facing-ux (UFX)

**What it is.** A short hand-written skill about one failure: agents write UI that addresses developers, showing backend status, API key state and placeholder explanations.

**Enforcement.** A checklist.

**Best idea.** That failure is real, specific to agents, absent elsewhere and not a matter of fashion. It maps directly to matching the user's world.

**Problems.**

- It says never show error codes or system state. Wrong for this project in its stated form: experts and agents need them. On an incident console, connection state and data freshness *are* the content. The fix is to separate channels: a human sentence plus a stable machine code, not deletion.
- It claims skeleton screens are perceived as twice as fast. No source given, and the one controlled test I could find went the other way: Viget (2017, n=136) found skeletons had the longest perceived wait, 2.82 s against 2.41 s for a spinner. The evidence is thin and mixed.
- It disables submit until errors are fixed. WIG says keep it enabled, and GOV.UK advises avoiding disabled buttons because of poor contrast and confusion.
- Its test of whether a grandmother would understand assumes one audience, and toasts that dismiss at 3-4 seconds are easy for anyone or anything to miss.

---

## 2. Catalogue of AI tells and failure modes

Deduplicated across sources. Verdicts:

- **U**: real usability or accessibility basis (named where I can).
- **T**: truth or trust basis. The harm is misinformation, whatever it looks like.
- **P**: partial. Some harm in some uses; the tell framing overgeneralizes.
- **F**: fashion. A taste signal, with no user harm shown. It might be a fair signal that nobody decided, but isn't a usability rule.

Square brackets mean the source contradicts or requires the pattern.

### Surface and colour

| Tell | Sources | Verdict | Note |
|---|---|---|---|
| Purple or indigo accents and gradients | Tl Tu ADC Imp Crit [UUPM prescribes] | F | Tu labels its ban owner's taste; 10 of its 23 real product screens use violet |
| Gradient-filled headline text | Tl Tu ADC Imp Crit [El requires] | P | Contrast varies and automated contrast checks struggle; otherwise decoration |
| Gradients on grounds and buttons | Tu ADC El | F | Gallery gap does not survive correction |
| Neon and coloured glows | Tl Tu ADC Imp | F | ADC's exception for glow in charts has no basis either |
| Glass and backdrop blur everywhere | Tu Imp Crit, Tl partly [UUPM recommends, El requires for nav] | P | Unstable text contrast is real; gallery shows no quality gap |
| Blurred blobs and radial halos | Tu ADC Imp | F | Contrast risk only if text sits on them |
| Soft shadow under every card; hairline plus wide shadow | Tu ADC Imp | F | |
| Thick coloured stripe on one side | ADC Imp El, Tu mostly | F | **GOV.UK inset text and USWDS alerts use this on purpose** (verified in their SCSS) |
| Cards nested in cards | ADC Imp | P | Extra frames with no meaning; craft view, consistent with Tufte [canon] |
| Three identical icon-topped feature cards | Tl Tu ADC Imp Crit | P | Empty of content on a page; peer metric cards are fine in apps, as Tu says |
| One medium radius everywhere | Tu | F | Tu's own gallery finding |
| Cream ground with terracotta or brass | Tl Tu Imp | F | Tracks current model output; Tu's lint targets Claude brand hexes |
| Inter, Geist, Space Grotesk and similar as defaults | Tl Tu El Imp Crit | F | Lists contradict each other; Tu's own app tokens default to Inter |
| Italic-serif accent word | Tl Tu Imp | F | No gallery difference |
| Serif as shortcut to premium | Tl Tu | F | |
| Monospace as technical costume | Tu Imp [Tl mandates for numbers at high density] | F | More common on top-scored sites; IDs and code are a different use |
| Emoji as icons | Tl Tu ADC Imp UUPM | P | Inconsistent rendering is real; screen readers read names aloud [canon] |
| Sparkle icon for anything AI | ADC | P | The real fault is an icon that doesn't name the action |
| Pure black | Tl [Tu app tokens and El allow it] | F | |
| Decorative grids, crosshairs, hairlines | Tl Tu Imp | F | Removing non-data ink is defensible [canon], but that isn't the stated reason |

### Type and labels

| Tell | Sources | Verdict | Note |
|---|---|---|---|
| Eyebrow or kicker above headings | Tl Tu ADC Imp | F | p=.33 in Tu's own gallery; Material 2 shipped this as a named type style [canon] |
| Tiny tracked uppercase labels | Tl Tu ADC Imp | P | Survives correction; legibility from small size and low contrast is the plausible cause |
| Index numbering (01, 02, 03) | Tl Tu Imp | F | More common on top-scored sites |
| Multi-line oversized headlines | Tl Tu Imp | P | Real for first-screen comprehension on pages; irrelevant in apps |
| Long all-caps passages | Imp | U | Slower reading [canon]; the word-shape explanation is wrong (Larson) |
| Tiny text, low contrast, long measure, tight leading | Tu Imp ADC UUPM WIG | U | WCAG 1.4.3 for contrast; reading research for the rest [canon] |
| Grey text on coloured ground | ADC Imp | U | A contrast failure in most cases |
| Weight 800-900 everywhere | ADC | F | |
| Title Case labels | ADC error [WIG requires] | F | Convention varies between platform guides [canon] |

### Copy

| Tell | Sources | Verdict | Note |
|---|---|---|---|
| Buzzwords | Tl Tu ADC Imp El | P | Plain-language guidance is the real basis, not provenance |
| Em dashes | Tl total ban; Tu over four; Imp advisory | F | No usability claim made. Ordinary punctuation |
| Faux-craftsman labels and cute cadence | Tl Tu Imp | P | Harm only when meaning suffers |
| Generic labels (Submit, OK, Learn more) | Tu ADC WIG El | U | Verb-plus-object reduces errors on destructive actions [canon] |
| Vague errors with no next step | ADC WIG UFX El UUPM Crit | U | Nielsen heuristic 9; GOV.UK |
| Exclamation marks | ADC El | P | Tone; makes all messages equally urgent |
| Greeting as page title | ADC Tu | U | Weak form of descriptive headings (WCAG 2.4.6) |
| **Developer noise in the UI** | UFX | U | The most agent-specific failure here, and no one else has it |
| Placeholder as label | Tl Tu WIG UUPM | U | WCAG 3.3.2 [canon] |

### Data and truth

| Tell | Sources | Verdict | Note |
|---|---|---|---|
| Invented social proof | Tu ADC El [Tl gives real logos and invented marks] | T | |
| Lorem, John Doe, Acme | Tl Tu ADC El | P | Hides layout faults. Fixed badly, it becomes convincing fabrication |
| Invented precise or vanity figures | Tl Tu ADC El | T | Tl and ADC also tell agents to make samples look real; see section 4 |
| Totals that don't add up; a fact differing across cards | Tu | T | Testable, and a known-answer gift for agent tests |
| Status colour on direction rather than goodness; on zero or undefined change | Tu | U | Encoding must mean what readers assume |
| Fake pulsing liveness dots | Tl Tu ADC Imp | U | Trains people to ignore real alerts; serious on monitoring surfaces |
| Fake product UI from divs | Tl Tu | T | Misrepresents; also poor in tree and in pixels |
| Rainbow charts, hue per bar | Tu ADC | P | Too many hues harm lookup. ADC's fix is wrong for nominal data |
| Sparkline on every KPI | Tu ADC Imp | P | Decorative ones are noise. Real ones are core to Tufte and Few [canon] |
| Smoothed lines | Tu | U | Curves invent values between points |
| Gradient area fills | Tu | F | |
| Left-aligned or proportional figures | Tu ADC WIG UUPM | U | Practitioner consensus [canon] |
| Hero metric template | Imp | F | |

### Motion and states

| Tell | Sources | Verdict | Note |
|---|---|---|---|
| Identical fade-up on every section | Tu Imp [Tu requires per-section entrances; El requires reveals] | P | Fails when reveal doesn't fire |
| Bounce easing | ADC Imp Tu | F | Weak claim about slowing repeated work |
| Marquees and endless loops | ADC Imp Tu [Tl allows and suggests] | U | WCAG 2.2.2 when over five seconds |
| Content hidden until script fires | Imp ADC Tu | U | Robustness; agents and screenshots get blanks |
| Slow transitions on repeated actions | ADC Imp [El's 500 ms] | U | Response time thresholds [canon] |
| `transition: all` | ADC WIG Tu [Tl prescribes] | P | Engineering hygiene |
| Hover growth | ADC [UUPM allows, El allows] | F | |
| Only the static success state built | Tl Tu ADC Imp WIG El UFX | U | The most universal real failure. Feedback and system status |

### Structure and basic access

| Tell | Sources | Verdict | Note |
|---|---|---|---|
| Stock section order | Tl Tu | F | Marketing only |
| Every section the same layout | Tl Tu ADC | F | On working screens this is consistency, a virtue |
| Everything centred | Tl Tu | P | Long centred text is hard to read |
| Interchangeable with any competitor | Imp Tu ADC | P | A persuasion concern. On operator screens familiarity may be better |
| Modal as first thought | Imp | P | Matches the HIG preference for modelessness [canon] |
| Hover-only content | ADC WIG UUPM | U | WCAG 1.4.13, touch, and invisible to agents |
| Zoom lock, removed focus ring, unnamed icon button | ADC WIG UUPM Tu Imp | U | WCAG 1.4.4, 2.4.7, 4.1.2 |
| Sideways page scrolling at narrow width | ADC Tu UUPM El | U | WCAG 1.4.10 |
| Dark or tinted sidebar with coloured active pill | Tu [Imp asks for committed shell] | F | Unresolved between sources |

**Takeaway.** Of 68 rows, 26 are fashion and 19 are partial, so two thirds lack a clean usability basis, and a large share of detector rules goes to them (31 of Imp's 62 sit in its slop category). The 23 with a real basis (19 U, 4 T) would be there without any AI framing. They're ordinary accessibility, honesty and clarity rules that models violate. **The skill can drop the concept of "tells" and lose almost nothing of value.**

---

## 3. Enforcement mechanisms

No source has shown any of these work against user outcomes. The first table is my judgment, from the mechanism and from internal reports.

### Seems to work

| Mechanism | Who | Why |
|---|---|---|
| Measuring the rendered page in a real browser | Tu inspect, ADC narrow, Imp URL scan | Sees overflow, contrast, clipping, covered text. Can't be argued with. Tu reports a minifier dropped a style only seen in the built page |
| Post-edit hook returning findings | ADC, Imp | Puts the check inside the loop, where the agent acts on it. Imp's tiers reduce noise |
| Reason required for an exception, plus baseline | ADC, Imp | Exceptions stay reviewable. Existing projects adopt without a wall of findings |
| Honest split of checked and review-only | ADC, Imp, Tu | Prevents a green result from being read as approval |
| Brief or claims written before code | Tu, ADC, Imp, El | Forces decisions. Tu's one question and one finding gives the screen a structure |
| Data assertions in the build | Tu | Deterministic and directly checks truth |
| Stress data and empty, single, huge cases | ADC, Tu | Finds real failures tidy samples hide |
| Independent assessors, judged from pictures | Imp, Tu, Crit | Reduces self-justification. The degraded banner keeps it honest |
| Ceiling on review rounds | Imp, Tu | Controls cost; Imp explains that open-ended self-review burns money |
| Order of harm | ADC | Prevents polishing what doesn't work |
| Consistency counts | ADC `inventory` | Objective, cheap, and a real proxy for consistency |
| A script dealing direction | Tu `draw.mjs` | Does break model convergence. But Tu reports an ill-fitting random direction was the commonest cause of weak pages. Out of scope for us |

### Looks like theater

| Mechanism | Who | Why |
|---|---|---|
| Long self-ticked lists | Tl (62 items), El, UUPM, UFX | The author grades itself. Includes unverifiable items such as web vitals plausibly met. Upstream replaced it with scripts, which is a tacit admission |
| Zero findings as proof of quality | ADC 266 to 0, plus video; Tu 0 FAIL | Measures compliance with one's own definitions. Tu's baselines had 8 to 13 FAILs and scored higher or level. The median gallery site itself has 4 FAILs and only 4% have none |
| Numeric scores by the authoring model, with trends | Imp, Crit, Tu | False precision. Inviting a re-run to watch the score rise rewards gaming it |
| Persona and intensity prompts | Imp opening, Tl capitals | No evidence. Binary wording may improve compliance, which isn't quality |
| Rules needing memory an agent lacks | Tl palette and serif rotation | Unenforceable across sessions |
| Hex and font blocklists | Tu, Tl, Imp, El | One shade away from passing, and aimed at last quarter's models |
| Arbitrary thresholds as if measured | Tl 20-word subtext, one eyebrow per three sections; El closed sizes | Gives false rigor. Mechanical, but measures nothing shown to matter |
| Quotas on decoration | Tu `still-page`, `few-pictures`; Tl motion-shown | Fails a page for being calm. Inverts perceived stability |
| Self-reported dials | Tl | Gate nothing measurable. Gone upstream |
| Star counts | All | 100k stars is distribution, and the highest-starred source here has the weakest rules for dashboards |

---

## 4. Contradictions

### Between sources

| Topic | Positions |
|---|---|
| Gradient text | El requires it on every hero. Tl, Tu, ADC, Imp and Crit ban it |
| Blurred floating nav | El requires it. Tu warns against it |
| Inter | Banned by El, flagged by Imp's detector and Tu's lint, default in Tu's app tokens. Imp's Operate guidance permits familiar sans defaults |
| Geist | Recommended by Tl, approved by El, flagged by Imp |
| Poppins, Outfit, Playfair | El approves Poppins and Tl suggests Outfit and Playfair; Tu's lint flags all three |
| Icons | ADC names Lucide. Tl discourages Lucide. UUPM lists it. El bans Material icons |
| Case | ADC makes sentence case an error. WIG requires Title Case |
| `transition: all` | Tl prescribes. ADC, WIG and Tu's lint ban |
| Motion timing | El: 500 ms, hover no shorter than 200. ADC: under 300, 150 for press. Imp Operate: 150-250. Tu's award sites: median 420 |
| Marquees and carousels | Tl offers both for breadth. ADC and Imp ban marquees |
| Underline tabs | ADC rejects at error level. Tu's study finds them the norm |
| Shell colour on apps | Imp wants a committed coloured shell; a grey screen is unfinished. Tu finds about 3% colour and calls colour on chrome a tell |
| Sparklines | Tu bans on KPIs. ADC bans on stat cards while `numbers-with-context` asks for recent history. Imp's Operate comps want recent history and `craft-floor` refuses them only as stand-ins for content |
| Black | Tl bans. Tu's dark token and El's list include `#000000` |
| Eyebrows | Imp absolute. Tl one per three sections. Tu bans on pages and allows one on app screens. ADC warns |
| Skeleton shimmer | Tl, El, Imp, UFX favour skeletons. Tu uses flat bars and no shimmer, labelled house rule. Viget's test found skeletons slowest |
| Brand contrast | ADC keeps brand text colour even when failing. Tl requires AA. El deepens the brand shade |
| Error detail | UFX hides codes. WIG wants a fix or next step; experts and agents need identifiers |
| Disabled submit | UFX disables until valid. WIG keeps enabled. GOV.UK discourages disabled buttons |
| Sample data | Tl: messy realistic numbers, and also flags fake precision. ADC `no-placeholder-data`: uneven realistic digits; its `proof.md`: samples must look invented. El: realistic in fictional demos, marked placeholders on real products. Tu: samples listed in report, proof never invented |
| Dashboard density | Crit: at most four metrics visible. Tu: up to about 120 data points, and everything named on the first screen |
| Tables | Tl, on pages: spec tables with row lines are the worst default, use pills and carousels. Tu app screens and ADC: tables with rules and alignment |

The pattern matters more than any row. **Where two sources disagree on a concrete style value, neither has evidence.** Disagreement is highest on style values and lowest on accessibility and clarity, which suggests where the real knowledge is.

### Against the classic tradition

The Macintosh HIG and Nielsen details belong to the canon digest; these are the conflicts I can see [canon].

| Principle | Conflict | Agreement |
|---|---|---|
| Consistency | Tl and Tu pages require each section to differ. Tl forbids a layout family twice | Imp Operate, Tu app screens, ADC `inventory` and `status-system` all favour it on working screens |
| Perceived stability | Motion quotas, pinned scenes, scroll reveals, Tl's scroll-hijack skeletons | Tu keeps old values on refresh and avoids layout shift. Imp bans orchestrated page load in product UI |
| User control | Scroll hijack, autoplay, auto-dismiss toasts | WIG's interruptible motion, UUPM's `escape-routes` |
| Forgiveness | **Largest gap.** No mention of undo in Tl, Tu SKILL, ADC RULES or El, or in the Imp files I searched. Tu has only one destructive-action house rule | WIG, UUPM, Crit |
| See and point; recognition | Tu switching metrics by control rather than showing them together. Icon rails. Capped lists | ADC `no-hover-only-content`; Crit's persona flags on icon-only nav |
| Feedback | UFX hides system state | All cover states; Tu's error and freshness rules are the best |
| Aesthetic integrity | Richness over restraint and required signature elements, adopted because model jurors preferred them | Tu's colour-on-data; Imp's product restraint |
| Standard controls | Tu's page run sees familiarity as the thing to prevent | Imp Operate is explicit; Tu app screens too |

**Tier-2 systems contradict tier-4 tells directly.** GOV.UK inset text and USWDS alerts use a thick left border. GOV.UK discourages disabled buttons, which UFX mandates. WCAG 2.2.2 covers the marquees Tl suggests. Under `SCOPE.md`'s ranking, each of these resolves against the AI-era source.

---

## 5. What is missing

### 5.1 Agent-operated interfaces: effectively nothing

A search of the local skills for accessibility tree, `data-testid`, WebMCP, idempotency, machine-readable, prompt injection, dry run, stable identifiers, structured errors and tool definitions found no design guidance. The hits were Imp's own tool internals and `DESIGN.md` tokens. I read Tu's main files and ADC's rules directly and saw none either. SlopScan mentions readability for AI assistants, which is about crawling content, not operating an app, and its method isn't published.

Rules that help agents by accident:

- Names and semantics: `icon-button-name` (ADC), semantic HTML first (WIG), accessible names and keyboard reach (Tu since 2.1.5), `skipped-heading` (Imp).
- State in the URL (WIG, UUPM). This is the most valuable one for agents.
- No hover-only content (ADC); no content hidden at rest (Imp, ADC).
- Honest data: totals that reconcile, zero versus dash, freshness stamps, named baselines (Tu).
- Tu's `charts.js` gives each chart a role and a generated summary. In the lines I inspected this is a sentence, not the values, so an agent still can't read the series.

Advice that actively harms agents, and which our skill should watch for:

| Advice | Source | Harm to an agent |
|---|---|---|
| Hide error codes and system state | UFX | Removes the handle it needs to branch on |
| Toasts that vanish in 3-5 seconds | UUPM, UFX | Status gone between its observations |
| Metric switching instead of showing together | Tu | Each view costs extra steps |
| Virtualized long lists | WIG, UUPM | Rows are absent from the tree |
| Scroll-triggered reveal at low opacity | El, Tu pages | Blank or misleading screenshots; content depends on scroll |
| Heading levels chosen for size | Seen on elaya.design | A false document outline |
| Realistic invented data | Tl, ADC | An agent can't tell a demo value from a fact |
| Status only in colour or as pill styling | Mostly avoided; UUPM warns | Invisible unless named in text |

Also absent: displayed content as a prompt-injection channel. ADC treats repository and page text as data for its own authoring agent, but no source addresses what happens when an interface displays hostile text to an agent operating it.

### 5.2 Data dashboards: one serious chapter, with gaps

| Source | Dashboard coverage |
|---|---|
| Tl | Excluded, sends you to Fluent, Carbon and others |
| Tu | Rich chapter from 23 private screens |
| ADC | Directly aimed there; rules from 16 still shots and own products |
| Imp | Short Operate guidance |
| UUPM | A charts CSV, marked low priority, with questionable style advice |
| El, UFX, WIG, Crit | Passing mentions |

Nobody covers: alarms and alert fatigue, stressed operators, live data that moves while you read, pausing streams, small multiples, comparison as the primary task, role-based views, or dangerous actions at speed. Tu says plainly it has no dense operations table, so **`incident-console` gets the least support of our cases**. Nothing I read cites Few, Tufte or alarm-management standards.

### 5.3 Empirical evidence: none with people

| What exists | Quality |
|---|---|
| Tu gallery study | 247 sites, LLM panel, stills, correlational, fashion-laden |
| Tu blind rounds | Model jurors, one per brief, half a point of noise, repeated briefs |
| Tu app-screen study | 23 owner-picked private screens, not auditable |
| ADC review | 16 Dribbble and Behance shots, one reading |
| Imp | One before-and-after pair, plus detector regression tests that prove the detector, not the design |
| Everyone else | None |

Nobody has measured human task success, time, errors or preference. Nobody has shown people notice or mind these tells, or that a tell predicts harm. I didn't search the academic literature for that question; the canon digest may. The one directly relevant finding about UI claims here, on skeletons, comes from an external study and undercuts the skills.

---

## 6. What the skill should borrow and reject

### Borrow

| Idea | From | Reason |
|---|---|---|
| Split surfaces by what success means, with different rule sets | Imp, Tu | Page rules harm working screens. Protects against the largest misapplication here |
| Name the screen's one question and current finding | Tu | Fits at-a-glance dashboard guidance [canon]. Gives agents an obvious summary to expose |
| Truthful data rules: single source for repeated facts, totals from rows, named baselines, zero versus missing, freshness, last-good on error | Tu | Helps both audiences. Testable. Gives our known-answer tasks a basis |
| Colour on a change means good or bad; sign and words carry it too | Tu | Prevents misleading encoding without relying on colour alone |
| Disabled controls say why; one save model; errors stay in the failed block | Tu | Directly usable, and translates to structured errors for agents |
| Order of harm: access, truth, meaning, numbers, system, order, decoration | ADC | Puts taste last, in line with the source ranking |
| `checked` or `review` on each rule, plus a source tier | ADC plus `SCOPE.md` | Makes claims auditable, as `SCOPE.md` demands |
| Rendered audit, hook-friendly output, reasons required for exceptions, baseline | ADC, Imp, Tu | Prevents self-certification. Fits the planned audit script |
| Stress data and worst-case states | ADC, Tu | Finds real failures cheaply |
| Inventory of distinct looks and, added by us, of roles and names | ADC | Measurable consistency for both audiences |
| Independent assessors, design review before detector output, disclosed degraded runs | Imp | Better critique and cleaner evals |
| Judge what rendered, not intentions | Tu | Same reason, and applies to our critique step |
| Persona walkthroughs reporting what broke | Crit, Imp | Add a sixth persona: an agent with only the tree |
| Bounded review rounds and cost disclosure | Imp, Tu | `SCOPE.md` already weighs cost |
| Developer noise as a named failure, revised to separate channels | UFX | Real agent failure. The revision is the two-audience principle in small |
| Marked placeholders; never invent facts or proof | El, Tu | Honest for people, and essential for agents reading the page |
| Concrete behaviors: URL state, links versus buttons, live regions, confirm or undo, `Intl` | WIG | Traceable to WCAG and APG; several are key for agents |
| Label taste as taste, and publish failures | Tu | The most valuable habit in the corpus, and `SCOPE.md` asks for the same |
| A small dated, non-normative appendix of common defaults | Tu `tells.md` | Useful as prompts for examination. Dating it admits it expires |

### Reject

| Idea | From | Reason |
|---|---|---|
| Tells as normative bans | All but WIG and UFX | Fashion by the authors' own account, mutually contradictory, and expire within months. `SCOPE.md` excludes a visual style anyway |
| Asking whether a viewer would believe AI made it | Crit | Asks about origin, not use. Imp has moved off it |
| Findings at zero as evidence of quality | ADC, Tu | Tu's data shows it does not predict jurors' preference. Keep as a floor, never the goal |
| Long self-attested checklists as enforcement | Tl, El, UUPM, UFX | Self-grading |
| Authoring model scoring itself with a trend | Imp, Crit | Misuses Nielsen. One rater is unreliable per NN/g. Rewards gaming |
| Persona inflation and intensity prompts | Imp, Tl | No evidence, and burns tokens |
| Motion and picture quotas, scroll hijack, perpetual loops | Tu pages, Tl, El | Against perceived stability and WCAG 2.2.2. Out of scope |
| Required novelty on working screens (signature move, product face) | Imp, Tu | Derived from model jurors. Familiarity is the classic value here. Show the product's own objects, but don't require invention |
| Working-memory caps on visible items | Crit | Misapplied science; conflicts with dense dashboards |
| Word-shape explanation | ADC, Imp | Abandoned model (Larson) |
| Skeleton-screen speed claims | UFX, Tl, El | Unsupported, and contested by Viget. Choose by context and expose `aria-busy` |
| Realistic fabricated data, real logo walls | Tl, ADC partly | Deceptive, and worse for agents |
| Keeping failing contrast for brand | ADC | Tier 2 beats tier 4. Deepen the shade |
| Side-stripe ban | ADC, Imp, El | GOV.UK inset text and USWDS alerts use the pattern deliberately. Tier 2 beats tier 4 |
| Disabling submit until the form is valid | UFX | GOV.UK advises avoiding disabled buttons, and WIG keeps submit enabled |
| Popularity as ground truth: Dribbble, Awwwards, star counts | ADC, Tu | Still images and fashion. Tu's panel saw that usability doesn't rise with score |
| One hue in steps for categories; dim digits; grey all but one series by default | ADC | Conflicts with data-visualization canon [canon] on nominal data and monitoring |
| One series per chart and metric toggles as a default | Tu | Hides comparison; small multiples are the better answer [canon] |
| Blanket sparkline ban | Tu, ADC | Ban decorative ones and keep real ones [canon] |
| Style by product type, such as fintech dark or data-heavy glass | UUPM | Unsourced stereotypes |
| Hiding codes and system state | UFX | Fails experts and agents |
| Unpinned runtime fetch of rules; binary download as a hard dependency | WIG skill, Imp | Not reproducible for A/B tests, and an injection surface. Our rules and script should be bundled |
| Named libraries and stacks as rules | Tl, El, ADC | Adapt to the project, and these go out of date |
| Code-only review as verification | WIG, Crit partly | Can't see what rendered |

---

## 7. Implications for the experiment

These go beyond the brief but follow directly from the evidence.

1. **Fix the rival arm** before running it (finding 2 in section 0). Whichever version runs, name it and its commit in the report.
2. **Expect the baseline to be strong.** Tu's no-skill builds scored 7.5 to 8.0 and won most rounds. A skill can lose, and the report needs to be ready to say that.
3. **Use several judges per case.** Tu's one-juror design carries half a point of noise, and our sample is small.
4. **Don't let the audit script inform the blind judge,** and don't count its own findings as an outcome for our own skill. That repeats the circularity seen here. Prefer checks defined independently of the skill: axe-core and agent task success are good for this reason.
5. **Guard against richness bias.** Model jurors repeatedly preferred richer pages. Give the rubric task-based criteria, and treat complaints that a working screen looks like a kit with suspicion.
6. **Keep the holdout untouched.** Tu's round 4 is a real example of a tuned skill dropping on unseen briefs.
7. **Add dashboard stress the sources lack,** especially on `incident-console`, where nothing here helps.

---

## 8. Sources

Repositories were read at these commits on 2026-11-02.

**tasteskill / taste-skill** (`Leonxlnx/taste-skill` at `12af471f62`)
- https://www.tasteskill.dev/
- https://www.tasteskill.dev/docs
- https://www.tasteskill.dev/guide
- https://www.tasteskill.dev/blog
- https://github.com/Leonxlnx/taste-skill
- https://github.com/Leonxlnx/taste-skill/blob/main/CHANGELOG.md
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/tells.md
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/research.md
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/critique.md
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/app-screens.md
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/scripts/lint.mjs
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/scripts/lib/rules.mjs
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/evals/evals.json
- https://github.com/Leonxlnx/taste-skill-classics
- Local: `~/.claude/skills/design-taste-frontend/SKILL.md`. Tl pointers: logo walls in 4.8, invented numbers in 9.D and 4.9, `transition: all` in section 7, marquees in 4.9 and 5, out of scope in 13, pre-flight in 14.

**Elaya** (`elayadesign/ai-design-skills` at `456d9e0d3e`, `elayadesign/redesign-skill` at `7df13f6a28`)
- https://elaya.design/
- https://cal.com/elaya/15min
- https://x.com/elayadesigns
- https://github.com/elayadesign/ai-design-skills
- https://github.com/elayadesign/ai-design-skills/blob/main/skills/landing-page-design/SKILL.md
- https://github.com/elayadesign/ai-design-skills/blob/main/skills/figma-designer/SKILL.md
- https://github.com/elayadesign/redesign-skill
- https://slopscan.co
- Found through a roundup: https://www.bitdoze.com/es/mejores-skills-ia-diseno-web/

**ai-design-check** (`enmerasoftware/ai-design-check` at `2ea648cb15`)
- https://github.com/enmerasoftware/ai-design-check
- https://github.com/enmerasoftware/ai-design-check/blob/main/README.md
- https://github.com/enmerasoftware/ai-design-check/blob/main/RESEARCH.md
- https://github.com/enmerasoftware/ai-design-check/blob/main/RULES.md
- https://github.com/enmerasoftware/ai-design-check/blob/main/rules.json
- https://github.com/enmerasoftware/ai-design-check/blob/main/src/check.js
- https://github.com/enmerasoftware/ai-design-check/blob/main/skills/design/SKILL.md
- https://github.com/enmerasoftware/ai-design-check/blob/main/skills/design-fix/SKILL.md
- https://github.com/enmerasoftware/ai-design-check/blob/main/skills/design-fix/references/proof.md
- https://github.com/enmerasoftware/ai-design-check/blob/main/CHANGELOG.md
- https://www.npmjs.com/package/@enmera/ai-design-check

**impeccable** (`pbakaus/impeccable` at `9fadc41729`)
- https://github.com/pbakaus/impeccable
- https://github.com/pbakaus/impeccable/blob/main/crates/live/assets/antipatterns.json
- https://impeccable.style
- Local: `~/.claude/skills/impeccable/SKILL.md` and `reference/craft-floor.md`, `operate.md`, `mode-operate.md`, `audit.md`, `critique.md`, `hooks.md`, `visualize.md`

**Other installed skills**
- `~/.claude/skills/critique/SKILL.md` and `reference/heuristics-scoring.md`, `reference/cognitive-load.md`
- `~/.claude/skills/web-design-guidelines/SKILL.md`
- https://github.com/vercel-labs/web-interface-guidelines (at `434b7f9136`)
- https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
- https://vercel.com/design/guidelines
- `~/.claude/skills/ui-ux-pro-max/SKILL.md` and `data/` (`ux-guidelines.csv`, `charts.csv`, `ui-reasoning.csv`, `products.csv`, `colors.csv`, `styles.csv`)
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill (at `713eef51b0`)
- `~/.claude/skills/user-facing-ux/SKILL.md`

**Used as checks on the above** (higher tier)
- GOV.UK button guidance, on disabled buttons: https://design-system.service.gov.uk/components/button/
- GOV.UK inset text styles: https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/inset-text/_mixin.scss
- USWDS alert styles: https://github.com/uswds/uswds/blob/develop/packages/uswds-core/src/styles/mixins/helpers/alert-status-styles.scss
- Severity ratings, NN/g: https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/
- Larson on word recognition: https://docs.microsoft.com/en-us/typography/develop/word-recognition
- WCAG Pause, Stop, Hide: https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide
- Viget skeleton test: https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens
- Carousel findings, secondary reports of NN/g: https://usability.yale.edu/usability-best-practices/hero-imagescarousels and https://designsystem.qld.gov.au/about/exploring-our-decisions/carousels
