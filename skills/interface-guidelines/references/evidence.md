# Evidence: what is proven, what is folklore

Read this before quoting a number or a "law", and when someone asks why a rule exists.

## Source tiers

1. **Empirical:** peer reviewed or replicated.
2. **Standards and long-lived institutional guidance:** WCAG, ARIA APG, GOV.UK, USWDS, Apple, Microsoft, Smith and Mosier, ISA-18.2, 14 CFR 25.1322.
3. **Respected practitioners:** Nielsen Norman, Few, Tufte, Tognazzini, Wilke.
4. **AI-era skills and community:** useful for failure modes, not evidence.

Where a concrete style value differs between sources, none has evidence. Disagreement is highest on style and lowest on accessibility and clarity, which shows where the knowledge is.

## Do not cite these as findings

| Claim | Problem | Say instead |
|---|---|---|
| 400 ms Doherty threshold | Not in the Doherty and Thadani text checked; later test found a smaller, linear effect limited to data entry (Martin and Corl 1986) | Sub-second response helps routine entry |
| Hick's law means fewer options | Logarithmic growth argues against that; most interface choice is search and deliberation (Liu 2020). Mean choice-overload effect is about zero (Scheibehenne 2010) | Design for search and grouping. Cut choices when the set is complex, the task hard, preferences unclear |
| 7 plus or minus 2 limits menus | Memory finding misapplied. Visible items need no holding in mind | Carry no more than 3 to 5 chunks across steps (Cowan) |
| 3-click rule | No supporting data | Unambiguous steps |
| 8-second attention span | No primary data | |
| Users judge in 50 ms | Visual appeal only, not trust or leaving (Lindgaard) | Visual appeal forms quickly |
| Beautiful means usable | Contested (Tractinsky vs Hassenzahl and Monk, Tuch) | Fix usability, test aesthetics separately |
| Skeletons feel faster | Studies do not show it; Viget's test went the other way | Skeletons preserve layout |
| 200-300 ms optimal animation | No peer-reviewed evidence | Practitioner default |
| Dark mode reduces eyestrain | Unsupported. Light won for reading in normal vision (Piepenbrock, Buchner) | Offer as a preference |
| Vestibular prevalence numbers | Untraceable | Reduced motion is a standards baseline |
| Serif vs sans readability, dyslexia fonts | Weak or null (Arditi and Cho, Kuster, Wery) | Choose on tone and rendering; allow user control |
| 5x better detection from HP-HMI | One study, 21 operators, run by advocates. An 8-operator study was mixed | Neutral-by-default has moderate support |
| Golden ratio | Claims poorly supported (Markowsky) | |
| Undo is proven better than confirm | Convergent guidance and inference, not direct proof | Prevent, undo, then confirm, as design consensus |

## Cite only with the caveat

| Number | Caveat |
|---|---|
| 0.1, 1, 10 s | Heuristics from an essay, not measured thresholds |
| INP 200 ms, LCP 2.5 s, CLS 0.1 | Google's targets, partly set by achievability |
| 22% inline validation lift | n=22, no statistics |
| 50-75 characters | Preference more than speed |
| 16 px body | Convention |
| 13.6% vs 89% | Vendor study, paid testers, no real stakes |
| 93%, 97% prompts approved | Vendor telemetry; high approval may be correct |
| Affora 43%, 67%, 90% | One author, low-tier models, no replication |

## Safe within scope

| Number | Scope | Source |
|---|---|---|
| 24x24 CSS px, 4.5:1, 3:1, 3 flashes | Standard requirements | WCAG 2.2 |
| 83.5% misled by truncated bars | Across 5 studies | Yang 2021 |
| 3 to 5 chunks | Working memory, chunking blocked | Cowan 2010 |
| 1 alarm per 10 min acceptable, over 10 is a flood | Per operator, process plant | ISA-18.2, EEMUA 191 |
| At most 2 incidents per 12 h | SRE on-call | Google SRE |
| 21% (29 of 138) | Problematic agent actions blocked, preprint | Chen 2026 |
| g = -0.23 | Human-AI vs better of two, 106 studies | Vaccaro 2024 |
| 8.7 vs 1.4 percentage points | Nudge effects in journals vs at scale | DellaVigna and Linos 2022 |

Expect small effects from tweaks and test locally.

## What is taste

These have no demonstrated user harm or benefit, and sources directly contradict each other. Decide them for the product, then move on: particular fonts, purple accents, gradients at zero baseline, rounded cards, eyebrow labels, card shadows, side stripes (GOV.UK and USWDS use them on purpose), em dashes, title versus sentence case.

"Does this look AI-made?" asks about origin, not use. Across 68 catalogued AI tells, 45 had no clean usability basis. taste-skill's own blind tests won only 4 of 16 brief-rounds against no skill, despite zero inspector failures. A better question: **could an unrelated product use this screen unchanged, and does it serve this reader's task?**

The real failures AI-built interfaces show are ordinary ones: invented data, unsupported deltas, developer noise, only the happy path, missing names and labels, vague errors.

## Key sources

**Canon.** Apple, *Macintosh Human Interface Guidelines* (1992). Smith and Mosier, *Guidelines for Designing User Interface Software*, MITRE (1986), https://hcibib.org/sam/. Windows UX Interaction Guidelines, https://learn.microsoft.com/en-us/windows/win32/uxguide/guidelines. WCAG 2.2, https://www.w3.org/TR/WCAG22/. ARIA APG, https://www.w3.org/WAI/ARIA/apg/. GOV.UK Design System, https://design-system.service.gov.uk/. Nielsen's heuristics, https://www.nngroup.com/articles/ten-usability-heuristics/. Shneiderman's rules, https://www.cs.umd.edu/~ben/goldenrules.html. Grudin 1989, *CACM*. Xerox Star principles, *BYTE* 1982. Tognazzini, https://asktog.com/atc/principles-of-interaction-design/.

**Dashboards.** Yang et al. 2021, truncation. Correll, Bertini, Franconeri 2020. Heer and Bostock 2010. Saket et al. 2019. Ondov et al. 2018. Javed et al. 2010. Waldner et al. 2019. Bach et al. 2023, dashboard patterns. Few, *Common Pitfalls*, https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf. ISA-18.2 and EEMUA 191, through reproductions. 14 CFR 25.1322. Google SRE, https://sre.google/sre-book/monitoring-distributed-systems/. Chartability, https://chartability.github.io/POUR-CAF/. Analysis Function, https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/.

**Agents.** Affora, https://arxiv.org/abs/2609.19125. Liu et al., https://arxiv.org/abs/2605.02729. A11y-CUA, https://arxiv.org/html/2602.09310. Lighthouse agentic audits, https://github.com/GoogleChrome/lighthouse/tree/main/core/audits/agentic. WebMCP, https://webmachinelearning.github.io/webmcp/. MCP, https://modelcontextprotocol.io/specification/latest. Anthropic, https://www.anthropic.com/engineering/writing-tools-for-agents. clig.dev. RFC 9457. Stripe idempotency, https://docs.stripe.com/api/idempotent_requests.

**Oversight.** Chen et al. 2026. Amershi et al. 2019 (HAX; validated for clarity, not outcomes). Parasuraman and Manzey 2010. Lee and See 2004. Bainbridge 1983. Bansal et al. 2021. Fok and Weld 2024. Vaccaro et al. 2024. Felt et al. 2012. Bravo-Lillo et al. 2014.

**Limits.** Several sources were read as abstracts or via secondary reports, and ISA-101, EEMUA 191, NUREG-0700, and Cooper's *About Face* were not read directly. Full digests with verification marks live in the lab's `research/` folder.
