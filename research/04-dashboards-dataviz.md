# 04. Dashboards, data display, and monitoring

Research digest for the `interface-guidelines` skill. Written 2026-11-03. Everything is paraphrased. Web content was treated as data.

**Evidence tags**, matching the tiers in `SCOPE.md`:

| Tag | Meaning |
|---|---|
| **[E]** | Empirical, peer reviewed or replicated |
| **[S]** | Standard, regulation, or long-lived institutional guidance |
| **[P]** | Respected practitioner work |
| **[J]** | My judgment or inference. Not a sourced fact |

**How each source was read:** *full* means I read the relevant text. *abstract* means abstract or search excerpt only. *secondary* means another source reporting it. Section 15 lists what I could not verify.

---

## 1. The findings that matter most

1. **Gray-by-default has field evidence, but less than its reputation.** The "5x better detection" figure traces to one study of 21 operators, and the method's advocates ran the main studies. The principle is still well supported by separate reasoning and by aviation regulation (section 5).
2. **Alarm budgets exist and web dashboards ignore them.** About 1 alarm per 10 minutes per operator is the acceptable average, 2 is the manageable maximum, and more than 10 in 10 minutes is a flood. SRE's equivalent is at most 2 incidents per 12-hour shift. The rate is a design requirement, so a dashboard with no alarm-rate budget is unfinished (section 6).
3. **Truncation misleads even people who were warned.** Across five studies, 83.5% of participants showed the effect. An explanation shortly before viewing reduced it but did not remove it (d about 1.26 unwarned in Study 1, about 0.5 warned). Broken-axis marks and gradient bases also fail to remove it.
4. **Values people read must change at most once per second, in a fixed position.** This rule dates from 1986 and no AI-era source mentions it. WCAG adds a pause requirement for auto-updating content, and it has no 5-second exemption, contrary to common belief.
5. **The KPI row is not the problem. The unsupported delta is.** Single values appear in 88% of a 144-dashboard review. The harm comes from a two-point percent change with no period, base, or noise check. NHS guidance names exactly this practice as misleading.
6. **Several "AI slop" complaints are only unfashionable.** Donuts read about as accurately as pies, and dark mode has no demonstrated performance penalty on dashboards in what I could read. Gradients are cosmetic at a zero baseline and misleading above one. Section 10 sorts these.
7. **Agents should not read pixels.** One cited result: GPT-4 got 31% of chart questions right without the data and 87% with it. Vision models also confuse colors. Expose values as text in the accessibility tree. `data-*` attributes and JSON blobs are invisible to an accessibility-tree agent.
8. **LLM judges are unreliable on chart honesty.** A 2026 study of three current models calls them unreliable at identifying misleading chart elements, and they invent flaws even on corrected charts. This directly affects the experiment. Chart honesty must be scripted rather than left to comparator agents (section 13).
9. **Preference does not predict performance.** People prefer decorated charts, and dark-mode readers report no difference while performing worse. Blind aesthetic judging will reward the wrong things unless task measures sit beside it.

---

## 2. Ranked sources

### Tier 1: empirical

| Source | Basis | Read | URL |
|---|---|---|---|
| Yang, Vargas Restrepo, Stanley, Marsh 2021. Truncating bar graphs persistently misleads | 5 experiments, incl. quantitative PhD students | full | https://www.gwern.net/doc/psychology/cognitive-bias/2021-yang-4.pdf |
| Correll, Bertini, Franconeri 2020. Truncating the Y-axis | 3 crowd experiments, n=40/32/25 | full | https://ar5iv.arxiv.org/html/1907.02035 |
| Cleveland, McGill 1984. Graphical perception | Lab experiments, the original ranking | secondary | https://vis.pku.edu.cn/course/visclass_f25/material/Graphical_perception.pdf |
| Heer, Bostock 2010. Crowdsourcing graphical perception | Replication, n=50 per chart | full | https://homes.cs.washington.edu/~jheer/files/2010-MTurk-CHI.pdf |
| Saket, Endert, Demiralp 2019. Task-based effectiveness | 180 participants, 5 charts, 10 tasks | full | https://ar5iv.arxiv.org/html/1709.08546 |
| Ondov, Jardine, Elmqvist, Franconeri 2018. Face to Face | 200 participants, staircase method | full (results) | https://cs.au.dk/~elm/pdf/face2face.pdf |
| Javed, McDonnel, Elmqvist 2010. Multiple time series | Lab, 2/4/8 series, 48/96/192 px | full (results) | https://cs.au.dk/~elm/pdf/multilinevis.pdf |
| Robertson et al. 2008. Animation in trend visualization | Controlled study, Test of Time award | abstract | https://faculty.cc.gatech.edu/~stasko/papers/infovis08-anim.pdf |
| Liu, Heer 2014. Interactive latency | n=16 analysts, +500 ms | full (results) | https://idl.uw.edu/papers/latency |
| Rensink, O'Regan, Clark 1997. Change blindness | Flicker paradigm | abstract | https://homepage.villanova.edu/diego.fernandezduque/Teaching/CognitivePsychology/Lectures_and_Labs/s3Attention/sReading/Rensink_etal_97.pdf |
| Bartram, Ware, Calvert 2003. Moticons | Detection and distraction experiments | abstract | https://www.interruptions.net/literature/Bartram-IJHCS03.pdf |
| Bonafide et al. 2015. Nonactionable alarms and response time | 36 nurses, 210 h video, 5,070 alarms | abstract | https://cdn.mdedge.com/files/s3fs-public/pdfs/journals/jhm2331.pdf |
| Paine et al. 2016. Systematic review of monitor alarms | 32 articles | full | https://community.the-hospitalist.org/content/review-physiologic-monitor-alarms |
| Drew et al. 2014. ICU alarms | 31 days, 5 ICUs | secondary | https://psnet.ahrq.gov/issue/insights-problem-alarm-fatigue-physiologic-monitor-devices-comprehensive-observational-study |
| Bliss 1993; Bliss, Gilson, Deaton 1995. Probability matching | Alarm reliability 25/50/75% | abstract | https://stars.library.ucf.edu/rtd/3614/ and https://stars.library.ucf.edu/scopus1990/1980 |
| Woods 1995. The alarm problem and directed attention | Field-study synthesis (DOI 10.1080/00140139508925274) | secondary notes | https://ferd.ca/notes/paper-the-alarm-problem-and-directed-attention-in-dynamic-fault-management.html |
| Errington 2006. ASM vs traditional (NOVA Chemicals) | 21 operators, simulator, consortium-run | trade article | https://www.chemicalprocessing.com/articles/2006/041 |
| EPRI 1017637, Hollifield (PAS) 2009. Coal plant case study | 8 operators, crossover, 4 scenarios, method's author ran it | full (results) | https://restservice.epri.com/publicdownload/000000000001017637/0/Product |
| Drews, Doig 2014. Configural vital signs display | 42 ICU nurses, simulation | abstract | https://metatoc.com/papers/1387-evaluation-of-a-configural-vital-signs-display-for-intensive-care-unit-nurses |
| Endsley 1995. Situation awareness theory | Theory and error taxonomy | abstract | https://trid.trb.org/View/426377 |
| Waldner et al. 2019. Radial vs linear | n=92 | full | https://arxiv.org/pdf/1907.13534 |
| Skau, Kosara 2016. Arcs, angles, or areas | 2 crowd studies | abstract | https://eagereyes.org/publications/Skau-EuroVis-2016 |
| Zacks, Tversky 1999. Bars and lines | 3 experiments | abstract | https://link.springer.com/content/pdf/10.3758/bf03201236.pdf |
| Ajani et al. 2022. Declutter and focus | Six graph topics | abstract | https://visualthinking.psych.northwestern.edu/projects/DeclutterFocus |
| Bateman et al. 2010. Useful junk | Accuracy and 2-3 week recall | abstract | https://vis.csail.mit.edu/classes/6.859/readings/pdfs/Bateman-UsefulJunk.pdf |
| Borgo et al. 2012. Visual embellishments | Dual-task experiment | abstract | https://ieeevis.org/year/2012/paper/infovis/empirical-study-using-visual-embellishments-visualization |
| Blasio, Bisantz 2002. Data-ink in dynamic monitoring | Process-control task | abstract | https://researchconnect.suny.edu/en/publications/a-comparison-of-the-effects-of-data-ink-ratio-on-performance-with/ |
| Inbar, Tractinsky, Meyer 2007. Attitudes to minimalism | Short conference paper | abstract | https://cris.bgu.ac.il/en/publications/minimalism-in-information-visualization-attitudes-towards-maximiz/ |
| Song, Szafir 2019. Where's my data? | Missing-data experiments | abstract | https://cmci.colorado.edu/visualab/MissingData |
| Hullman et al. 2018. In pursuit of error | Survey of 86 uncertainty studies | abstract | https://mucollective.northwestern.edu/project/uncertainty-eval-survey |
| Hullman, Resnick, Adar 2015; Kale et al. 2019. HOPs | Crowd experiments | abstract | https://mucollective.northwestern.edu/project/hops and https://idl.uw.edu/papers/hops-trends |
| Belia et al. 2005. Researchers misread error bars | Published-author survey | abstract | https://pubmed.ncbi.nlm.nih.gov/16392994/ |
| Fisher et al. 2012; Moritz et al. 2017. Partial and approximate results | Analyst teams | abstract | https://www.microsoft.com/en-us/research/publication/trust-me-im-partially-right-incremental-visualization-lets-analysts-explore-large-datasets-faster/ and https://idl.uw.edu/papers/trust-but-verify |
| Sharif et al. 2021. Screen-reader users and charts | 36 + 36 users | abstract | https://faculty.uw.edu/wobbrock/pubs/assets-21.01.pdf |
| Lundgard, Satyanarayan 2022. Four-level description model | 2,147 sentences, 30 blind + 90 sighted | abstract | https://arxiv.org/pdf/2110.04406.pdf |
| Zong et al. 2022. Rich screen reader experiences | 13 blind/low-vision readers | abstract | https://arxiv.org/pdf/2205.04917 |
| Jung et al. 2021. Alt text for visualizations | 22 interviews | abstract | https://ar5iv.labs.arxiv.org/html/2108.03657 |
| Seo et al. 2024. MAIDR | 11 blind participants | abstract | https://arxiv.org/pdf/2403.00717 |
| Seto et al. 2026. LLMs as visualization judges | 3 models, 9,420 misleader trials | full | https://arxiv.org/html/2606.15136 |
| Bendeck, Stasko 2024. GPT-4 on vis literacy | 4 task sets | abstract | https://aa.ieeevis.org/year/2024/program/paper_v-full-1147.html |
| Charts-of-Thought 2025 | 3 models, VLAT | full | https://arxiv.org/html/2508.04842v1 |
| Bach et al. 2023. Dashboard design patterns | 144 dashboards, 42 patterns | full | https://arxiv.org/pdf/2205.00757 |
| Purich et al. 2023. Census of dashboards | 25,620 Tableau Public dashboards | full (results) | https://arxiv.org/pdf/2306.16513 |
| Sarikaya et al. 2019. What do we talk about... | 83 dashboards, 15 aspects | abstract | https://tableau.com/research/publications/what-do-we-talk-about-when-we-talk-about-dashboards |
| Sultanum, Setlur 2026. Not always top-left | 18 authors + 16 users | abstract | https://arxiv.org/abs/2608.06845 |
| Stokes et al. 2022. Text and charts | n=302 | abstract | https://arxiv.org/abs/2208.01780 |
| Ivanković et al. 2021. Actionable COVID dashboards | 158 dashboards, expert panel | secondary | https://www.jmir.org/2021/2/e25682/ |
| Riley, Burhouse, Nicholas 2021. Making Data Count boards | 61 boards; adoption, no outcomes | full | https://bmjleader.bmj.com/content/5/4/252 |
| Rossi et al. 2025. Effective dashboards | Conceptual, cites two reviews | full | https://pmc.ncbi.nlm.nih.gov/articles/PMC12016087/ |
| Franconeri et al. 2021. Science of visual data communication | Major review, PSPI | abstract | https://www.psychologicalscience.org/publications/visual-data-communication.html |
| Ettling et al. 2025. Dark vs light on dashboards | ETRA eye tracking (DOI 10.1145/3715669.3725879) | abstract | https://www.alexandria.unisg.ch/handle/20.500.14171/122292 |

### Tier 2: standards and institutions

| Source | Basis | Read | URL |
|---|---|---|---|
| 14 CFR 25.1322, Flightcrew alerting (FAA 2010) | US regulation | full | https://www.govinfo.gov/content/pkg/FR-2010-11-02/pdf/2010-27629.pdf |
| ISA-18.2 metrics table | Standard, via a published reproduction | full (of table) | https://www.processonline.com.au/articles/65390-Improving-alarm-management-with-ISA-18-2-Part-2 |
| EEMUA 191 | Industry guide, via HumanFactors101, Honeywell, Emerson | secondary | https://humanfactors101.com/topics/alarms/ |
| Smith, Mosier 1986. Guidelines for user interface software | MITRE/USAF guideline report | full (sections) | https://hcibib.org/sam/2.html |
| ASM Consortium display guidelines (2009 slides) | Consortium guideline set | full | https://process.honeywell.com/content/dam/process/en/documents/document-lists/doc_asm-consortium/presentations/July%2014%202009%20-%20ASM%20Display%20Guidelines%20-%20Overview%20Slides.pdf |
| Google SRE book, ch. 6 and ch. 11; SRE workbook ch. 5 | Long-lived institutional practice | full | https://sre.google/sre-book/monitoring-distributed-systems/ , https://sre.google/sre-book/being-on-call/ , https://sre.google/workbook/alerting-on-slos/ |
| UK Government Analysis Function, charts | Government guidance | full | https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/ |
| Scottish Government design system, charts | Government guidance | full | https://designsystem.gov.scot/guidance/charts |
| USWDS data visualizations | US government | full | https://designsystem.digital.gov/components/data-visualizations/ |
| GOV.UK Design System, table | Government | full | https://design-system.service.gov.uk/components/table/ |
| W3C WAI complex images; WCAG 2.2.2; WCAG 4.1.3; Graphics-ARIA | W3C | full | https://www.w3.org/WAI/tutorials/images/complex/ , https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html , https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html , https://www.w3.org/TR/graphics-aria-1.0/ |
| Chartability (Elavsky, Bennett, Moritz 2022) | Peer-reviewed audit framework, 50 tests | full (workbook) | https://chartability.github.io/POUR-CAF/ |
| Joint Commission Sentinel Event Alert 50 (2013) | Accreditor alert | secondary | https://digitalassets.jointcommission.org/api/public/content/f65e5c9df2b94000a99445e0a7877007 |
| NHS England, Making Data Count | National programme guidance | full (sections) | https://www.england.nhs.uk/wp-content/uploads/2019/12/making-data-count-strengthening-your-decisions.pdf |
| BEA AF447 final report presentation (2012) | Accident investigation | full | https://bea.aero:443/fileadmin/uploads/tx_elyextendttnews/presentation.rapport.final.05juillet2012.en_04.pdf |
| NRC Three Mile Island backgrounder | Regulator | full | https://www.nrc.gov/reading-rm/doc-collections/fact-sheets/3mile-isle.html |
| AWS S3 post-event summary (2017) | Vendor postmortem | full | https://aws.amazon.com/message/41926/ |
| Carbon Design System, dashboards and palettes | Corporate design system | full | https://carbondesignsystem.com/data-visualization/dashboards/ , https://carbondesignsystem.com/data-visualization/color-palettes/ |
| Grafana dashboard best practices | Vendor docs | full | https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/ |
| EU Data Visualisation Guide, double y axes | EU Publications Office | full | https://data.europa.eu/apps/data-visualisation-guide/line-charts-double-y-axes |

### Tier 3: practitioners

| Source | Basis | Read | URL |
|---|---|---|---|
| Few 2006/2013. Common Pitfalls in Dashboard Design | 13 pitfalls | full | https://www.perceptualedge.com/articles/Whitepapers/Common_Pitfalls.pdf |
| Few 2013. Bullet Graph Design Spec | Spec | full | https://www.perceptualedge.com/articles/misc/Bullet_Graph_Design_Spec.pdf |
| Few 2005. Effectively Communicating Numbers | Tables vs graphs, 7 relationships | full | https://www.perceptualedge.com/articles/Whitepapers/Communicating_Numbers.pdf |
| Few 2008. Dual-scaled axes | Argument | full | https://www.perceptualedge.com/articles/visual_business_intelligence/dual-scaled_axes.pdf |
| Hollifield. The High Performance HMI | Practitioner, sells the method | full | https://www.automation.com/article/the-high-performance-hmi |
| Tufte. Sparkline theory and practice | Practitioner | full | https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/ |
| Wilke. Fundamentals of Data Visualization | Open textbook | full (2 chapters) | https://clauswilke.com/dataviz/proportional-ink.html , https://clauswilke.com/dataviz/color-pitfalls.html |
| Munzner. Rules of thumb | Textbook slides | abstract | https://cs.ubc.ca/~tmm/talks/vad/VAD-rules.pdf |
| Gleicher. Considerations for visualizing comparison | Comparison taxonomy | full | https://pages.graphics.cs.wisc.edu/VisSnacks/papers/comparison |
| FT Visual Vocabulary | Newsroom | full | https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary |
| Datawrapper Academy and blog | Tool maker | full | https://www.datawrapper.de/academy/why-our-column-and-bar-charts-start-at-zero , https://www.datawrapper.de/blog/colors-for-data-vis-style-guides |
| NN/g: dashboards; dark mode; response times | Practitioner research | full | https://www.nngroup.com/articles/dashboards-preattentive/ , https://www.nngroup.com/articles/dark-mode/ , https://www.nngroup.com/articles/response-times-3-important-limits/ |
| Schwabish 2020. Ten guidelines for better tables | Journal, practitioner guidance | abstract | https://www.cambridge.org/core/journals/journal-of-benefit-cost-analysis/article/abs/ten-guidelines-for-better-tables/74C6FD9FEB12038A52A95B9FBCA05A12 |
| Gregg. USE method | Practitioner | full | https://www.brendangregg.com/usemethod.html |

**Named in the brief but not read directly:** Ware, Cairo, the full texts of Few's and Tufte's books, ISA-101, EEMUA 191, ColorBrewer, Tableau's research beyond the papers above, Material Design (page returned no content). See section 15.

---

## 3. Decision guide: task to display

Start from what the reader must do. Saket 2019 found no chart wins across tasks and task strongly changes the result. [E]

| Reader's task | Default | Avoid | Evidence |
|---|---|---|---|
| Look up an exact value, compare a few precise values, audit | **Table** | Chart with tooltips | Few 2005 [P]. Saket: tables fastest for derived values, tied for retrieving values [E] |
| Mixed units in one view | **Table** | Dual axis | Few 2005, 2008 [P] |
| Know one current value against a threshold or target | **Number + comparator + range, or bullet graph** | Radial gauge, bare number | Few spec [P]; NN/g [P]; Waldner on radial error [E] |
| Answer a yes/no status question | **Sentence or status word** | Any chart | Few's plain-table example [P]; bakery case [J] |
| Only 2-3 data points | **Number or small table** | Line chart | [J], consistent with Few 2005 |
| Trend, 1-4 series | **Line chart, labeled directly** | Bars for multiple time series | Zacks & Tversky [E]; Analysis Function [S] |
| Trend, more than 4 series, or comparisons far apart in time | **Small multiples, shared scale** | Spaghetti chart | Javed [E]. Analysis Function limit of 4 [S] |
| Local comparison between a few series at the same time | **Overlaid lines** | Separate charts | Javed [E]; Ondov [E] |
| Rank or compare categories | **Sorted horizontal bars, zero base** | Alphabetical order, pie | Saket: bars top overall [E]. NN/g on sorting [P] |
| Two values many times (before/after, plan/actual) | **Mirrored or overlaid bars, or explicit delta** | Stacked charts one above the other | Ondov: overlaid > adjacent > stacked; mirrored bars better on both tasks [E] |
| Biggest mover between two states | **Computed delta, sorted** | Asking the eye to subtract | Gleicher's explicit encoding [P]; [J] on sorted |
| Part of a whole, dominant category, 5 or fewer parts | **Pie or donut acceptable** | Over 5 slices, similar sizes | Analysis Function [S]; Skau & Kosara [E] |
| Part of a whole, comparison of parts | **Sorted bars** | Pie; stacks over 4 categories | NN/g [P]; Analysis Function [S] |
| Distribution, latency, spread | **Histogram, percentiles, dot or box plot** | Mean alone | SRE ch. 6 [S]; Franconeri [E] |
| Correlation between two measures | **Scatter, or lines** | Tables, pies | Saket G2, G5 [E] |
| Find outliers among many items | **Scatter** | Line chart | Saket G3 [E] |
| Daily or periodic pattern | **Linear chart** | Clock-style radial | Waldner: locate-time error 9% vs 30% [E] |
| Triage many entities | **Table sorted by severity, status in words + icon** | Grid of equal cards | ASM overview and hierarchy [S]; [J] on the table form |
| Tell whether a value is normal | **Value on a scale with normal band** | Bare digital number | Hollifield [P]; Tufte's band [P]; Drews & Doig [E] |
| Where something is | **Map, only if location itself matters** | Decorative map | FT [P] |
| Non-technical reader, casual prompt | **Sentences and short tables first, charts with annotations** | Analyst-style grid | Stokes: heavily annotated charts preferred over sparse or text-only [E]; [J] on the bakery case |

**Note on the perceptual ranking.** Position beats length, and angle and area come later (Cleveland & McGill 1984). Heer & Bostock replicated the order. Two corrections to the folk version: angle did not do worse than length in their data, and square rectangles were the hardest area comparison. A later reanalysis finds bars clearly best while the order among the rest is ambiguous (https://arxiv.org/pdf/2212.10533, abstract). Use the ranking as a framework rather than a law, as the 1984 authors themselves said.

**Note on the dashboard itself.** NN/g separates operational from analytical dashboards, Carbon separates presentation from exploration, and Sarikaya shows dashboards serve many purposes. Few's single-screen rule fits operational monitoring. It does not fit analytics, where 42% of dashboards in Bach's review use multiple pages. Decide the genre before applying his list.

---

## 4. Testable rules

"Test" says how the audit script or a harness could check it.

### Axes and scales

| # | Rule | Source | Test |
|---|---|---|---|
| A1 | Bars and filled areas start at zero on linear scales. On log scales, bars start at 1 and represent ratios; for amounts use dots. | Yang [E]; Datawrapper [P]; Analysis Function [S]; Wilke [P]; Smith & Mosier 2.4.1/6 [S] | Inspect chart config for `domain`; check bar base pixel equals `y(0)` |
| A2 | Lines may start above zero when the task is reading a trend. Choose the range from the size of change that matters, start on a round number (50-90%, not 54.3-93.5%), and say so in the description. | Correll [E]; Analysis Function [S] | Non-zero line domain requires text mention |
| A3 | Do not treat a break mark or fading bar base as making truncation safe. They did not remove the exaggeration. | Correll [E] | Flag axis-break patterns on bars |
| A4 | No shading under a truncated line. | Wilke [P] | Area mark plus non-zero domain fails |
| A5 | No dual y-axis by default. Use separate adjacent charts, or index both series to a common start. Connected scatter is a third option. | Few 2008 [P]; Analysis Function [S]; EU guide [S]. Controlled evidence is thin, see section 9 | Two value axes in one chart fails |
| A6 | Tick intervals of 1, 2, 5, or 10 times a power of 10. | Smith & Mosier 2.4.1/5 [S] | Read tick values |
| A7 | At most about 10 gridlines, light gray, at least 8 px apart. | Analysis Function [S]; Heer & Bostock [E] | Geometry |
| A8 | Charts used for value comparison are at least 80 px tall. 40 px produced significantly more error on a 0-100 scale; above 80 px gains were small. | Heer & Bostock [E] | Bounding box |
| A9 | Below 80 px, treat a chart as shape only: it needs a printed value and no claim of reading accuracy. | [J] from A8, Bach's miniature charts, Tufte | Mini chart must have adjacent number |
| A10 | Small multiples share a y scale unless labeled otherwise. | Single-scale principle, Smith & Mosier 2.4.1/9 [S]; extension is [J] | Compare domains across siblings |

### Series and color

| # | Rule | Source | Test |
|---|---|---|---|
| C1 | At most 4 lines per chart; 4 bars per cluster; 4 categories per stack; 5 pie slices. | Analysis Function [S] | Count series |
| C2 | Categorical hues in one chart: aim for 3-5. Past about 8, use direct labels. Across a dashboard, at most 7 color codes with one meaning each. | Wilke [P]; ASM 6.1 [S] | Distinct-hue count per SVG |
| C3 | Treat Carbon's 14-color sequence as capacity, not a target. | Carbon [S]; [J] | Same as C2 |
| C4 | Essential marks and adjacent colors at 3:1, text at 4.5:1, no text under 12 px. Datawrapper notes most published palettes miss 3:1, so outline marks where needed. | Chartability critical tests [S]; Scottish Gov [S]; Datawrapper [P] | Computed contrast |
| C5 | Color is never the sole channel. About 8% of men and 0.5% of women have color vision deficiency. | Chartability [S]; NN/g [P]; Hollifield [P] | Grayscale screenshot task; status has text or icon |
| C6 | Start from a tested palette (Okabe-Ito has 8 colors), then run a CVD simulator, including on thin lines. Safe palettes still fail on small marks. | Wilke [P]; Datawrapper [P]; Stone et al. 2014 [E] on size dependence (https://www.tableau.com/en-gb/research/publications/engineering-model-color-difference-function-size) | Simulated difference on rendered marks |
| C7 | Red, amber, and yellow mean alert and nothing else. | 14 CFR 25.1322(f) [S]; Hollifield [P]; Scottish Gov [S] | CSS audit of hue use outside alert elements |
| C8 | Fed an all-normal fixture, the dashboard shows no alert hues. | Hollifield [P]; ASM 3.1 [S] | Pixel-count screenshot on normal fixture |
| C9 | One data set has one color everywhere; never reuse a color for another variable. | Carbon [S]; USWDS [S] | Series-to-color map across charts |
| C10 | Where categories have natural colors, use them. | Lin et al. 2013 [E] (https://www.tableau.com/research/publications/selecting-semantically-resonant-colors-data-visualization) | Manual |

### Labels and tables

| # | Rule | Source | Test |
|---|---|---|---|
| T1 | Title states the message; a subtitle states measure, units, and period. | Analysis Function [S]; Ajani on focus [E] | Heading exists, has verb or finding (LLM-assisted) |
| T2 | Label lines directly. Avoid legends on line and pie charts. | Analysis Function [S]; Scottish Gov [S] | Legend present on line chart |
| T3 | Hover is never the only route to a value. | USWDS [S]; Chartability [S] | Values present without hover |
| T4 | Show the precision the decision needs. | Few pitfall 3 [P]; exact digits are [J] | Significant digits on KPI text |
| T5 | Right-align numeric columns and headers, align decimals, same decimal places per column, left-align text. | GOV.UK [S]; Smith & Mosier 2.3/16 [S]; Schwabish [P] | Computed `text-align` |
| T6 | Use tabular numerals in numeric columns and in any live value. | Table review (https://pmc.ncbi.nlm.nih.gov/articles/PMC10346464) [P]; live-value extension is [J] | `font-variant-numeric`, or measure digit widths |
| T7 | Sort by the column that answers the question, not alphabetically by default. | NN/g [P]; Few pitfall 9 [P] | Column values monotonic |

### Speed

| # | Rule | Source | Test |
|---|---|---|---|
| L1 | Interaction response: 0.1 s feels direct; beyond 1 s show progress; beyond 10 s give percent done and cancel. | Nielsen [P] | Timed trace |
| L2 | Filter and brush latency stays well under 500 ms. An added 500 ms cut activity, data coverage, and rates of observation and hypothesis, and exposure carried over into later low-latency use. | Liu & Heer, n=16 [E] | Timed interaction |
| L3 | Operational view call-up averages 1 s, 3 s at most. | ASM 5.5 [S]; Smith & Mosier 2.7.1/6 gives 0.5-1 s for simple requests [S] | Navigation timing |

Live-data rules are in section 7 and alarm rules in section 6.

---

## 5. Lessons from high-stakes displays that web dashboards ignore

### 5.1 Neutral by default, color means abnormal

Practice: gray and half-intensity equipment, bright color reserved for abnormal conditions (Hollifield; ASM 3.1). Aviation's dark cockpit has lights out when systems are normal, so a lit one is conspicuous (FlightGlobal, secondary: https://www.flightglobal.com/airbus-at-thirty-technology-innovations/35502.article). A 1988 NASA memo on mission control takes a similar view, that display color needs to carry information and decorative color only distracts (excerpt only: https://ntrs.nasa.gov/api/citations/19880012270/downloads/19880012270.pdf).

**How strong is the evidence? Moderate, and it deserves honest wording:**

| Study | Design | Result |
|---|---|---|
| ASM/NOVA 2004 | 21 operators, 10 vs 11, one site, simulator, consortium-run | Detected before alarm: 48% vs 10%. Completed: 96% vs 70%. Time: 10.6 vs 18.1 min |
| EPRI 2009 | 8 operators, crossover, four scenarios, run by Hollifield's firm | One malfunction detected by 6/8 vs 3/8. No significant difference in duration for several scenarios. One mismatch was caught **faster on old graphics** |

The "5x" number circulates through vendor and thesis material as if independently repeated, but it is the ASM result. Both studies bundle many changes (overview, trends, layout, color), so neither isolates gray. Operators' reports that gray is dull and sleepy are anecdotal (https://www.automationworld.com/products/control/blog/13310828/engineers-agree-to-disagree-on-hmi-direction) and untested. I found no independent replication.

**Apply:** C7 and C8. Charts stay gray or one neutral hue, with a highlight for what the question is about. Do not copy low-contrast gray text: WCAG contrast still applies. **Test:** normal-fixture screenshot versus abnormal-fixture screenshot; only the abnormal one shows alert hue, and it localizes the fault.

### 5.2 Show value against normal, not a bare number

Hollifield's analog indicator shows value, normal range, and alarm distance at a glance. Tufte independently gives sparklines a printed end value and a normal-range band, and calls an unscaled line dequantified. Few's bullet graph does the same, with 2-5 ranges (ideally 3) in single-hue intensity rather than red/yellow/green, so that it survives color deficiency. Drews & Doig: 42 ICU nurses read a configural trend display faster and more accurately than numbers.

**Apply:** every monitored number states its normal range, target, or history. **Test:** KPI element contains a comparator with a label.

### 5.3 Put trends in the view

Hollifield reports that fetching a trend on demand works poorly in practice. ASM 2.3 requires trends when decisions depend on behavior over time. An EPRI operator missed having them on the old graphics.

**Apply:** the primary metric's recent history is visible, not behind a click.

### 5.4 A display hierarchy with a flat path

Hollifield's four levels: overview with no control actions, unit control, unit detail, diagnostic. ASM adds overview for span of control (1.1), dedicated upset displays (1.5), and simple flat navigation (5.1). Shneiderman's mantra points the same way, but it rests on experience: Craft & Cairns found it had not been adequately validated (https://www-users.york.ac.uk/~pc530/pubs/craft_cairns.pdf). The control-room version has at least some simulator evidence behind it.

**Apply:** overview answers "is anything wrong, and where?" One click reaches the affected item with filter and time range preserved. An incident has its own view.

### 5.5 Show what was observed, not what was commanded

At Three Mile Island, control room instruments told staff the relief valve was closed while it was stuck open (NRC). Secondary accounts say the light showed the signal sent, not valve position. This is the most transferable lesson for `agent-fleet-control`: "restart requested" is not "restarted", and optimistic UI on a control surface repeats this failure.

**Apply:** separate `requested` from `confirmed`, each with a timestamp and source. **Test:** after a mutating action on a delayed backend, the UI says pending until confirmation. An injected failure must not show success.

### 5.6 If the system knows the data disagree, say so

BEA lists among AF447's contributing factors the lack of a clear cockpit display of the airspeed inconsistencies the computers had identified, and the crew not taking the stall warning into account. Secondary coverage reports that the warning does not sound below 60 knots, so it could go silent because data became invalid (https://www.aviationsafetymagazine.com/?p=10688). Silence read as recovery is the failure.

**Apply:** silence requires a positive reading. A panel with no data shows "no data since 14:02", never a green check or an empty calm chart. Data-source disagreement appears on the panel.

### 5.7 Monitoring must not share a failure with what it monitors

During the 2017 S3 outage, AWS could not update service status on its health dashboard because the admin console depended on S3 (AWS). Prometheus's Watchdog alert fires constantly to an external receiver, which raises an alarm when notifications stop (https://runbooks.prometheus-operator.dev/runbooks/general/watchdog/).

**Apply:** the "all clear" needs a heartbeat. Client-side, the UI computes staleness from data timestamps and its own clock, so a dead backend cannot look healthy.

### 5.8 Separate common from special variation

NHS Making Data Count argues two-point comparisons and red/amber/green reports are misleading. RAG hides trends, can mask improvement in red and deterioration in green, and sends teams chasing changes that are noise. Its alternative uses process-limit charts, orange for concerning special cause, blue for improvement, gray for no significant change, plus an icon summary report for boards. Evidence is adoption, not outcomes (61 boards; 85% of papers had at least six such charts after training). ISS telemetry monitoring has also used control charts (lead, unread: https://saemobilus.sae.org/content/TBMG-14866/).

**Apply:** color a delta only if it clears a noise check. **Test:** feed a noise-only fixture; no change indicator should alarm.

### 5.9 Project, don't only report

Endsley's three levels are perception, comprehension, and projection. Most dashboards stop at the first. EPRI notes that values moving toward a trip were clearly shown and noticed on the new graphics. SRE's burn rate is a projection metric.

**Apply:** show time-to-threshold where it is computable ("disk full in about 3 h"), labeled as an estimate.

### 5.10 The field tests displays with task measures, not opinions

Preference misleads. Inbar found people prefer the decorated bars. Dark-mode readers reported no difference while proofreading worse (Piepenbrock via NN/g). In Saket, tables were preferred on tasks where they performed poorly, though overall preference did correlate with accuracy (r=0.68), so preference is a weak signal rather than a useless one.

---

## 6. Alarms and alert fatigue

Digest 02 found no AI-era source on this. It is probably the largest gap this skill can fill.

### 6.1 The numbers

**Process industries, per operator position** (ISA-18.2 table, based on at least 30 days of data):

| Metric | Very likely acceptable | Maximum manageable |
|---|---|---|
| Alarms per day | 150 | 300 |
| Alarms per hour | 6 | 12 |
| Alarms per 10 min | 1 | 2 |

| Metric | Target |
|---|---|
| Hours with more than 30 alarms | under 1% |
| 10-minute periods with more than 10 alarms | under 1% |
| Maximum alarms in any 10 minutes | 10 or fewer |
| Time in flood condition | under 1% |
| Chattering and fleeting alarms | zero |
| Stale alarms (standing over about 24 h) | under 5 per day |
| Priority split, three levels | 80% low, 15% medium, 5% high |
| Priority levels | no more than 3-4 |
| Unauthorized suppression | zero |

- **Flood** (EEMUA 191 via VanCamp 2016): begins at more than 10 new alarms in 10 minutes and continues until a 10-minute interval has fewer than 5. Simple form: more than 10 in 10 minutes.
- **Chattering:** commonly 3 or more activations in a minute. (https://www.chemengonline.com/alarm-management-numbers/)
- **After an upset:** EEMUA asks for under 10 alarms in the first 10 minutes. Honeywell's benchmark of 37 consoles found only 2 came close, about a third met the steady-state target, and about a quarter more met the 1-2 "manageable" band (https://process.honeywell.com/content/dam/process/en/documents/document-lists/doc_asm-consortium/white-papers/February%2028%202005%20-%20Acheiving%20Effective%20Alarm%20System%20Performance%20Benchmarking.pdf). So these are hard targets for real plants, and poor systems often exceed 250 in 10 minutes.

**Software on-call** (Google SRE):

- At most 2 incidents per 12-hour shift, because one incident costs about 6 hours in total. Median should be 0, and a median above 1 a day is a warning sign.
- Tune toward one alert per incident.
- Every page is actionable, requires intelligence, and concerns something novel. Page on symptoms; causes are debugging aids.
- Burn-rate alerts for a 99.9% SLO:

| Severity | Long window | Short window | Burn rate | Budget consumed |
|---|---|---|---|---|
| Page | 1 h | 5 min | 14.4 | 2% |
| Page | 6 h | 30 min | 6 | 5% |
| Ticket | 3 d | 6 h | 1 | 10% |

The two budgets look far apart but share logic: **the sustainable rate is set by what a response costs.** A plant alarm takes seconds to minutes, an incident takes hours. **[J]** Derive the budget from response time and state it.

### 6.2 What alarm overload does

- **Milford Haven 1994:** two operators faced 275 alarms in the last 11 minutes, one every 2-3 seconds earlier in the event. Most of 2,040 alarms showed as high priority, many merely informational, and safety-critical ones were not distinguished (HSE via HumanFactors101).
- **Hospitals:** the Joint Commission recorded 98 alarm-related events from January 2009 to June 2012, 80 of them deaths, and says about 85-99% of alarm signals need no clinical intervention. These figures are not epidemiological.
- **Drew 2014:** 2,558,760 alarms in 31 days across five adult ICUs. 88.8% of 12,671 annotated arrhythmia alarms were false positives. (That percentage covers the annotated subset, a commonly lost detail.)
- **Paine 2016:** 74-99% of monitor alarms not actionable across settings.
- **Bonafide 2015:** 87.1% of PICU and 99.0% of ward alarms were nonactionable. Response time rose stepwise with exposure to nonactionable alarms in the prior 2 hours. It is observational and exploratory, and is among the few direct field measurements of fatigue.
- **Cry wolf:** in Bliss's work with 25/50/75% reliable alarms, about 90% of subjects matched response rate to perceived reliability rather than answering all alarms. A reliability figure of 50% therefore plausibly means about half of alarms are ignored, including real ones. An Illinois report (Dixon/Wickens line, probable source https://apps.dtic.mil/sti/pdfs/ADA496817.pdf) finds false-alarm-prone automation hurts both compliance and reliance. Miss-prone automation hurts only reliance. A driver-warning study separates false alarms, which reduce compliance, from unnecessary but correct ones, which did not (https://www.psychologie.uni-freiburg.de/Members/kiesel/Publications/Naujoks-Kiesel-Neukum-2016.pdf/at_download/file). Access to raw data or validity information can reduce the effect (excerpt level).

### 6.3 Reducing alarms has tradeoffs

Paine's interventions: lowering the SpO2 alarm limit from 90% to 85% cut alarms 61%, but hypoxemia lasting over a minute rose from 2% to 6%. Multicomponent changes cut audible alarms 89%; one pediatric ward went from 180 to 40 per patient-day. Most of these studies were quasi-experimental. **Lesson:** the threshold choice is a precision/recall decision, as SRE's four attributes (precision, recall, detection time, reset time) make explicit. Surface it instead of hiding it in a default.

### 6.4 Rules

| # | Rule | Source | Test |
|---|---|---|---|
| AL1 | State an alarm budget and show actual rate against it. | ISA-18.2, SRE [S] | Rate shown; fixture counts |
| AL2 | At most 3 priorities, with mostly low. If over about 5% are top priority, priority has lost meaning. | ISA-18.2 [S]; Milford Haven | Compute distribution on fixture |
| AL3 | Each tier is defined by response: immediate awareness and immediate action; immediate awareness and later action; awareness only. | 14 CFR 25.1322(b) [S] | Each priority has documented response |
| AL4 | An alarm names what is wrong and what to do, or links to it. No action means it is a log entry. | 14 CFR (a)(1) [S]; SRE [S]; Woods [E] | Alarm text includes object + action link |
| AL5 | Top-tier alerts use at least two channels. On the web: color + icon + text + position, optional sound. | 14 CFR (c)(2) analog [S]; adaptation is [J] | No color-only alert |
| AL6 | Prevent inappropriate alerts by design: deadbands, delays, and dedup to stop chatter. | 14 CFR (d)(1) [S]; ISA-18.2 [S] | Oscillating fixture must not re-fire |
| AL7 | Alerts clear when the condition ends, and acknowledged looks distinct from unacknowledged. | 14 CFR (a)(3) [S]; ASM 6.1 [S] | State transitions in fixture |
| AL8 | Acknowledge silences the attention-getting part, not the fact. Standing alarms stay listed. | 14 CFR (c)(3) [S]; [J] | After ack, still in list |
| AL9 | Any suppression or mute is visibly announced and not one reflex click away. | 14 CFR (d)(2) [S] | Muted state visible in text and tree |
| AL10 | Group cascades: one fault's alarms bundle under a root, with count, and support queuing. | Woods [E, via notes] | Burst fixture yields a group |
| AL11 | Stable, dedicated alarm location. Fixed positions allow peripheral reading. | Woods [E, via notes] | Location constant across states |
| AL12 | Don't make every alarm an interrupt: no modals or toasts stealing focus. Toasts that vanish lose standing alarms. | Woods [E, via notes]; WCAG 4.1.3 [S] | Alarm doesn't move focus; persists |
| AL13 | Flag departure from expected for this context, not raw threshold crossing. | Woods; NHS [S] | Seasonal/noise fixture |
| AL14 | Let the responder check the alarm against raw data in place. | Cry-wolf mitigation [E, excerpt] | Alarm links to data with time window |
| AL15 | Track and show chattering, stale, and top-10 contributors. | ISA-18.2 [S]; VanCamp [P] | Alarm-health view exists where a console is in scope |

**Caution on the top-10 metric.** The reproduction of ISA-18.2 gives under 1% to 5% maximum for top-10 contribution, while VanCamp says over 20% signals a problem. They disagree, and I could not check the standard. Don't cite a threshold.

---

## 7. Live data that moves while you read

Digest 02 found no AI-era source on this. The primary risk is the reader losing their place or missing a change, and pausing is the gap.

**Evidence base.** Dasgupta et al. 2018 point out that most visual-analysis models assume a static snapshot, and survey how streaming designs handle change perception (https://diglib.eg.org/handle/10.1111/cgf13264). Controlled evidence specific to dashboards is thin. The rules below rest on the older guidance plus attention research.

- **Change blindness:** in the flicker paradigm, large repeated changes took up to 20 seconds to find even when viewers expected them (excerpt). A motion transient elsewhere masks a change. So an update you did not mark is an update many viewers will miss, and a page-wide re-render is itself a mask. **[J]**
- **Motion captures attention:** moving icons were detected well in dense displays, often better than color and shape, and also distract (Bartram). So motion is a limited, valuable resource. ASM 3.2 restricts animation to communicating process-critical or safety activity.
- **Animation for trends:** static displays were faster than animation for analysis, and small multiples more accurate (Robertson). Animated transitions can aid perception when moving between views (Heer & Robertson, https://idl.uw.edu/papers/animated-transitions).

| # | Rule | Source | Test |
|---|---|---|---|
| V1 | Any value someone must read updates at most once per second, in a fixed position. Slower may be required. | Smith & Mosier 2.7.3/3 [S] | MutationObserver: text changes per second per node |
| V2 | Set data refresh from process dynamics. If data changes hourly, a 30 s refresh is pointless. For a 99.9% target, probing more than once or twice a minute is probably unnecessary. | ASM 2.2 [S]; NRC audit via search [S]; Grafana [S]; SRE [S] | Refresh interval vs fixture cadence |
| V3 | Separate the two rates. Data can arrive fast while the display coalesces. | [J] from V1, V2 | Burst fixture: display rate stays ≤1 Hz |
| V4 | Provide pause or freeze for auto-updating content in parallel with other content. There is no 5-second exemption for auto-updating content. Controlling update frequency also satisfies it. | WCAG 2.2.2 [S]; Smith & Mosier 2.7.3/5 [S] | Named pause control exists, works |
| V5 | A frozen display is labeled as frozen, with its time. | Smith & Mosier 2.7.3/6 [S] | Text in tree |
| V6 | Resume at current real time by default. Show how many updates arrived while paused. | Smith & Mosier 2.7.3/8 [S]; WCAG real-time note [S]; count is [J] | Resume test |
| V7 | Hover, focus, selection, or text selection pauses reordering of the row under the pointer. | [J] from layout-shift concerns | Hold pointer on row during updates; row identity holds |
| V8 | Rows do not jump. New items appear via a "N new" affordance, or insert above the viewport without moving what is being read. | [J] | Bounding box of focused row stable |
| V9 | Never blank the display during update. Keep the old value until the new one arrives. | Smith & Mosier 2.0/1 [S] | No empty frame during poll |
| V10 | Keep stable reference elements around changing graphics: axes, thresholds, fixed ordering. | Smith & Mosier 2.4.8/18 [S] | Axis domain stable, or shifts announced |
| V11 | Mark changes explicitly with a persistent cue and offer a change log. | Smith & Mosier 2.4.8/16 [S]; Rensink [E] | Change indicator persists more than a few seconds |
| V12 | No entrance animation, count-up, or pulse repeats on data refresh. A count-up shows false values while running. | Bartram [E]; ASM 3.2 [S]; count-up point is [J] | Animation count during polling; reduced-motion check |
| V13 | "Live" badges derive from the actual age of data, not a constant. | §5.6, §5.7 | Stop backend: badge must change |
| V14 | Screen reader updates: `role=status` with `aria-atomic` for values, `role=log` for feeds, `role=alert` only for important time-sensitive messages. Do not put a ticking chart into a live region. Using alert on unimportant content is a listed failure. | WCAG 4.1.3 [S] | Tree inspection; announcements per minute |
| V15 | Numbers don't shift width as they change: tabular numerals, fixed column width. | T6 [J] | Width stability across updates |

**Agent note.** An agent reading a tree twice can get inconsistent values. Expose a data timestamp next to each value, and let it request a frozen snapshot. **[J]**

---

## 8. Stressed operators

Thin direct evidence, all of it marked. A NASA review summarizes acute stress as tunneling of attention, reduced working memory, and degraded judgment (Young 2008, https://human-factors.arc.nasa.gov/flightcognition/Publications/Young_TM2008_215375_final.pdf, excerpt; Staal 2004 is the fuller review, https://ntrs.nasa.gov/citations/20060017835, not read). Woods observes the densest alarm periods coincide with the highest cognitive load, which is when bad alarms cost most. 14 CFR requires alerts to be detectable under all foreseeable conditions, including multiple alerts at once.

Design rules that follow. All are **[J]** reasoning from these sources unless noted:

- **Recognition, not recall.** Normal range and next action on screen. Hollifield points to the load of memorizing over a thousand values per operator.
- **Everything for the task in one place.** An EPRI operator praised runback graphics for this; usually the data was spread across many screens. ASM 1.5 calls for dedicated upset displays.
- **Eyes beat memory** (Munzner). No toggling between metrics to compare.
- **No hover, no modal, no deep menu** for anything needed during an incident. Direct access with no menu directory (ASM 5.3).
- **Stable layout across states.** The incident view must not rearrange the normal one.
- **Default to severity order**, with a visible list of what changed in the last N minutes.
- **Words over codes.** Plain status text.
- **Dangerous actions stay reachable and hard to misfire.** Compare 14 CFR's requirement that suppression not be operable by habitual reflex. Details belong in the action-safety digest.
- **Test under time pressure.** Measure time and error with a limit. Agents judging static screenshots cannot see any of this.

---

## 9. Comparison as a primary task

Digest 02 flags this as uncovered, and notes one AI-era source recommending one series per chart with metric toggles. Toggling turns a visual comparison into a memory task, which Munzner's rule and change blindness both argue against. **Do not adopt that default on comparison tasks.**

**Framework.** Gleicher: every comparison design is juxtaposition (separate coordinates), superposition (same coordinates), or explicit encoding (compute the relationship and draw it). Difficulty comes from too many items, items too large, or complex relationships; responses are scanning, subsetting, or summarizing.

**Evidence.**

- **Ondov 2018** (200 participants): for finding the biggest mover, overlaid beat adjacent, which beat stacked. Horizontally mirrored bars improved both biggest-mover and correlation tasks. Animating between two states helped for bars and donuts, but not slope charts, and did not help for correlation. The authors warn these low-level tasks may not represent real use.
- **Javed 2010:** shared-space lines are better for nearby comparisons, separate charts for widely spaced ones. Total size had little effect on time, but small allocations hurt correctness. An informal follow-up to 16 series suggests split layouts scale better.
- **Robertson 2008:** for many time steps, static beats animated for analysis. **[J]** This fits with Ondov if you separate "flip between two states to spot a delta" from "watch a long sequence".
- **Saket 2019:** lines and scatter for correlation, bars for clustering, avoid tables and pies for correlation.
- **Cleveland & McGill / Heer & Bostock:** adjacent aligned bars outperform stacked segments. Position on a common scale beats non-aligned.

| # | Rule | Source | Test |
|---|---|---|---|
| CM1 | Put compared things on the same screen at the same time, without toggling. | Munzner [P]; Rensink [E] | Both visible together in default state |
| CM2 | Use the same scale, window, and units. | Smith & Mosier [S]; [J] | Domain and period equal |
| CM3 | Few items, nearby comparison: overlay. Many items or far apart: small multiples. | Javed, Ondov [E] | Series count vs layout |
| CM4 | If the difference is what matters, compute and show it, sorted. | Gleicher [P]; [J] | Delta column present |
| CM5 | Two distributions of bars: mirror or overlay, never stack. | Ondov [E] | Layout check |
| CM6 | Name the comparator every time ("vs previous 28 days", "vs plan"). | Few pitfall 2 [P] | Delta text has comparator |
| CM7 | Compare like with like: a partial current period is excluded or matched to the same elapsed time. | [J]; see section 11 states | Fixture ending mid-period |
| CM8 | Don't reduce a whole series to two points when the history is available. NHS notes year-on-year overlay lines prompt two-point thinking. | NHS [S] | KPI delta accompanied by history |
| CM9 | Different units: separate adjacent charts or index to a common start. Then line crossings mean something. | Few 2008 [P]; EU guide [S] | No dual axis |
| CM10 | Linked views mirror filter and zoom. | Carbon [S]; Bach reports brushing/linking in 18% | Filter propagates; state visible |
| CM11 | Use reference lines for target, mean, or last period. | Smith & Mosier 2.4/7 [S] | Reference mark present |

**Dual-axis evidence is weaker than people assume.** Isenberg et al. 2011 is widely cited against dual axes, but it studies charts with two scales through zoom or cut-out regions rather than two-unit y-axes (15 participants, per a critique), favoring cut-outs over superimposition (https://hal-universite-paris-saclay.archives-ouvertes.fr/LISN/inria-00638535). I found no controlled experiment on two-unit y-axes. A case-study paper, "Why Two Y-Axes", argues the advice is over-generalized and counts 179 dual-axis charts of 944 time-series charts in 25 financial publications (not peer reviewed as far as I can see, https://www.uncharted.software/assets/WhyTwoYAxes_Y2Y.pdf). Grafana recommends dual axes for different units. Few's logical argument stands: crossings and relative heights mean nothing since scales are arbitrary. So keep the default against, labeled **[P/S], no direct experiment**, with an exception for expert audiences who read a specific paired view routinely.

---

## 10. Failure modes in LLM-generated dashboards

**Status: hypotheses.** I found no peer-reviewed study characterizing LLM-made *dashboards*. Nearby work: LLM charts scored below human-quality ones on visual question answering, with color and label choices as weak points (https://aclanthology.org/2025.coling-main.501.pdf). PlotCraft shows charts that looked polished yet missed requirements (https://arxiv.org/pdf/2511.00010). **Count these in the `without_skill` arm to establish real prevalence.**

Verdict key: **Harmful** = evidence or strong standard against. **Conditional** = harmful in specific conditions. **Unfashionable** = no evidence of harm found.

| Pattern | Verdict | Why | Fix and test |
|---|---|---|---|
| KPI row in itself | **Unfashionable** | Single value 88%, numbers 62% of Bach's review. Common and legitimate. Harm comes from equal weight and missing context | Keep it, with fewer metrics |
| "+12.4%" delta, no period or base | **Harmful** | NHS two-point critique; Few pitfall 2. Small bases swing widely (Wainer, not re-read) | Comparator, base, history. Test: regex for comparator near percent |
| Delta invented because data lacks a prior period | **Harmful** | Fabricated data | Test: delta traceable to fixture |
| Green up / red down arrows | **Harmful** | Color-only fails CVD. Up isn't always good: Few's spec notes bullets must show whether high or low is good. Latency up in green is an error | Sign, word, direction-of-good. Test: latency metric polarity |
| Sparkline with no scale, value, or band | **Conditional** | Tufte himself says an unscaled line loses quantity; he adds end value and normal band. Auto-scaling is truncation in effect (**[J]** from Correll). Bach: miniature charts suit trend only. Fine if complete | End value + band + stated range. Test: real data, number adjacent |
| Sparkline from decorative mock data | **Harmful** | Fabricated. Tells the reader a trend exists | Test: path derives from fixture |
| Gradient fill under a line, zero baseline | **Unfashionable** | No harm evidence found. It adds non-data ink. Decluttering raised professionalism ratings only | Taste |
| Gradient fill under a truncated line | **Harmful** | Wilke: shading implies height is the quantity. Correll: gradient-base doesn't fix it | A4 |
| Y domain from `dataMin` for drama on bars | **Harmful** | Yang, Correll | A1 |
| Donut rather than pie | **Unfashionable** | Skau & Kosara: as accurate as pie. Saket: labeled pies equal bars on several tasks | Rule C1 only |
| Donut for comparing near-equal parts or over 5 slices | **Harmful** | NN/g, Analysis Function; poor for correlation, distribution, anomalies per Saket | Sorted bars |
| Radial progress rings and gauges | **Harmful for reading**, mild otherwise | Waldner: read-value error up to 41% for radial vs 14% for linear. NN/g, Few: large and uninformative | Bullet or bar |
| Dark mode as such | **Unfashionable** | Light won for normal-vision reading (Piepenbrock); no difference in daytime glancing (Dobres). On dashboards, dark gave lower perceived workload with higher pupil dilation (Ettling; I lack their time and accuracy results). Low-vision users may benefit | Support both, test both |
| Neon saturated palette on dark | **Harmful in monitoring**, cosmetic in a demo | Spends color before an alarm needs it (§5.1). 14 CFR (f). Rainbow-scale over-saturation (Wilke). Thin bright lines are hard to separate | C2, C7, C8 |
| Glow, glass, soft shadow | **Unfashionable, mild cost** | No direct evidence. Few pitfall 11. Evidence on junk is split: Bateman found accuracy no worse and recall better; Borgo better memory but **slower visual search**; Blasio & Bisantz faster out-of-range response with higher data-ink, no SA effect. So monitoring pays and memorability gains | Strip on monitoring views |
| 3D charts | **Harmful** | NN/g; Analysis Function | Ban |
| Same-weight bento grid | **Conditional** | Few pitfall 10; Carbon: most important gets largest area and contrast. Fine for peers, bad for triage | One clear primary |
| 8+ rainbow series on one chart | **Harmful** | Wilke; Javed on thin lines | C1, C2 |
| Same color, different meaning across charts | **Harmful** | USWDS; Carbon | C9 |
| Pulsing green "Live" or "All systems operational", hard-coded | **Harmful** | The TMI and AWS failure class. Motion spent on normal state | V13 |
| "Updated just now" constant | **Harmful** | As above | Derive from timestamp |
| Average latency only | **Harmful** | SRE: tails hide in means | Percentiles |
| Over-precise values (94.2847%) | **Mild harm** | Few pitfall 3 | T4 |
| Tooltip as only access to values | **Harmful** | USWDS; Chartability; invisible to agents | T3 |
| Chart with no table or summary | **Harmful** | §12 | Tree audit |
| Count-up numbers, staggered entrance on every poll | **Conditional** | One-off on load: taste. On every refresh: false values and motion theft | V12 |
| Happy path only | **Harmful** | Rossi: outdated or incomplete data drives disuse | §11 fixtures |
| Curved line interpolation | **Unknown** | No evidence found. Curve can overshoot data and imply values between samples [J] | Prefer linear or step when values are sparse |
| Stacked area by default | **Conditional** | Grafana warns it can mislead; afcharts urges care with stacks; upper segments lose a common baseline | Off by default |
| Alphabetical bars | **Mild harm** | NN/g, Few pitfall 9 | T7 |
| Inter on gray, rounded cards | **Unfashionable** | No performance evidence | Out of scope. Other digests cover tells |

**Few's list for reference:** single screen exceeded; inadequate context; excessive detail or precision; expressing measures indirectly (book version differs); wrong display media; meaningless variety; poorly designed media; inaccurate encoding; poor arrangement; ineffective highlighting; useless decoration; misused color; unappealing display. Note that his bar is not minimalism for its own sake: the last pitfall says an ugly display is also a failure, and Ajani found focus improves clarity and memory while decluttering affected professionalism ratings.

---

## 11. States, freshness, and uncertainty

### State table

Few sources specify these, so most behavior below is **[J]**, anchored where noted.

| State | Show | Never | Machine-readable |
|---|---|---|---|
| **Loading, first time** | Reserved layout, chart frame and title. Progress after 1 s, percent and cancel past 10 s (Nielsen). I found no evidence favoring skeletons over other forms | Spinner replacing layout; fake data | `aria-busy=true`, status text |
| **Refreshing** | Old values stay, subtle status (Smith & Mosier 2.0/1) | Blanking, flashing | `aria-busy`, timestamp stays old until replaced |
| **Empty, valid zero** | Axes, "0 orders today", what would change it | Blank chart | Value 0 as text |
| **Empty, no data yet** | Explain why and next step | Showing 0 | State word |
| **Missing/gap in series** | Visible gap or marked imputed points | Zero-fill or silent bridge | `null`; gap noted in table |
| **Partial current period** | Dotted final segment, excluded from delta. Amplitude and Fathom use dotted lines; Mixpanel uses an asterisk | A sharp "drop" at the end. Fathom added this precisely to separate real drops from incomplete data | "partial: 12 h of 24" text |
| **Partial sources** | Which source failed, what totals exclude; total labeled as partial | Quiet undercount | Per-source status |
| **Stale** | Last-known value, dimmed or struck, age in words, expected cadence. Also change value text | Fresh-looking number; banner only | `stale`, `as_of` as text |
| **Error** | What failed, last good value and time, retry, who to contact | Empty panel; raw stack; red for a 1-panel transient at dashboard level | `role=alert` if it matters, otherwise status |
| **Invalid or conflicting data** | Flag or remove the value. Say sources disagree | Showing a precise number | Quality word |
| **Monitoring down** | Global statement from client-side clock | Green | Global state |
| **Frozen** | Labeled, with time (V5) | Looks live | State word |
| **Suppressed filter/alerts** | Visible notice (14 CFR d2) | Silent | State word |
| **Permission denied** | Name the missing permission, who to ask | Empty chart | State word |

**Anchors:**

- Song & Szafir: designs that highlight imputed values raise perceived quality; breaking visual continuity lowers it and can bias readings; downplaying imputation or removing information degrades it. So a discreet gap is not automatically honest: pair it with a marker.
- Aviation requires detection and removal of invalid attitude, airspeed, and altitude data and annunciation of conflicts (SKYbrary excerpt, https://skybrary.aero/articles/se034-displays-and-alerting-systems).
- An NRC audit faulted a safety display for having no clear indication of poor-quality data beyond an ambiguous label, and recommended excluding invalid data from status calculations (search excerpts of NRC documents, exact doc unverified).
- Ignition's HMI default overlays bad-quality tags with a red marker (forum and blog, official page unread). A user reported a null value marked good, so a quality flag does not replace a validity check.
- Partial results are usable. Fisher: analysts work well with incremental results. Moritz: confidence rose when preliminary answers could be verified later. Label them.

### Freshness

**Observed practice.** 64% of Bach's dashboards explicitly show update information (73% counting implicit), 41%/69% data sources, 38% disclaimers. Of 158 COVID dashboards only 31 (19.6%) explained quality and meaning, and 20 (12.7%) rated highly actionable. Rossi names data lag and outdated data as reasons for abandonment. The only numeric usage figure there is one study in which 28% used the dashboard at least once. I found no credible telemetry on abandonment rates; a widely repeated 72% figure was untraceable.

**Rules [J unless noted]:**

1. Show **data time**, not render time. A page rendered now can show 2-hour-old data.
2. Give absolute and relative time with time zone: "as of 14:02 UTC, 6 min ago".
3. Per-panel freshness when sources differ. One global stamp is a lie when one pipeline stalled.
4. Declare expected cadence, and derive stale state from it: stale past about twice the cadence is a reasonable starting point (my number, not sourced).
5. Client computes age, so a dead server cannot claim freshness (§5.7).
6. Say the time range the panel covers and whether filters apply. Keep it in the URL so views can be shared.
7. Use `<time datetime>` so tools get an unambiguous value.

### Uncertainty

- Hullman's survey of 86 studies warns evaluation has assumed more statistically predictable judgment than people show, so accuracy is not enough; measure decisions.
- Belia: published researchers misjudged what error bars imply. Don't assume expert fluency. Spell out what a band means.
- HOPs produced much better judgments than error bars and violins for comparing 2-3 quantities (Hullman 2015), and untrained viewers inferred trends in ambiguous data at lower evidence levels (Kale 2019). But animation conflicts with V12 and with screen readers, so keep HOPs for analysis on demand. **[J]**
- Chartability includes clear uncertainty as a non-critical test: conventions plus text explanation.

**Rules:** forecasts look different from actuals (dashed, with a band); intervals are labeled in words ("90% of outcomes fall in here"); estimates say they are estimates; rounding matches uncertainty, so no 94.28% on a sample of 50; give the sample size when rates may rest on few events. Noise-only changes don't get color (§5.8). The last three are **[J]**, in the spirit of Few pitfall 3 and NHS.

---

## 12. Exposing charts to agents and screen readers

### Why this is not optional

- Screen-reader users extracted information 61.48% less accurately and spent 210.96% more time on online charts than others (Sharif), and they suggested tabular and textual alternatives.
- GPT-4: fine on trends and extremes, poor at simple value retrieval without the dataset, unreliable with colors, sometimes hallucinates (Bendeck & Stasko). As cited by Charts-of-Thought: 31% accuracy without data, 87% with data. That paper raised a newer model to 70% from image alone with a structured-extraction prompt, and color-dependent charts stayed weak. Seto 2026 shows much better literacy now (about 80-94% on VLAT), but a 6-20% error on reading values remains unacceptable for an agent acting on them, when exact values could just be exposed. **[J]**

### Real guidance

- **W3C WAI:** complex images need a short description plus a long one. Best association is `<figure role="group">` with the long description in `<figcaption>`, which may include headings and a table. `aria-describedby` only suits text-only descriptions, since structure is flattened. Prefer visible long descriptions.
- **Chartability critical tests (14 of 50):** contrast; content not visual-only; text size; seizure risk; keyboard parity; interaction cues; not overriding AT controls; explanation of how to read; title or summary; reading grade 9 or lower; **a human-readable table** unless the text conveys all relevant information; data density handled; navigation not tedious; user style respected. Good base for a scripted audit.
- **Analysis Function:** text description that doesn't repeat the title or list every point, placed under the chart; a table if users need values; "if both, give both"; a specifically labeled download link.
- **Scottish Gov:** large HTML tables are hard to navigate, so give a spreadsheet for large data. HTML over SVG over PNG.
- **USWDS:** a screen-reader table, plus a plain-language summary, with SVG hidden via `aria-hidden` when an equivalent exists. Notes a table is not equal to a narrative. Understanding must not require interaction.
- **Lundgard & Satyanarayan:** four levels: encodings; statistics; perceptual trends; domain insight. Blind readers value statistics and trends, sharply diverge from sighted readers on the outer levels, and rank low-level encoding descriptions low. **Write summaries at levels 2-3.** "Bar chart with blue bars" is the wrong thing to say.
- **Jung:** ground alt text in data, not visuals. People want to retrieve values as sighted readers do.
- **Zong:** three dimensions for rich experiences: structure (what can be traversed), navigation (how), description (content, verbosity). Olli implements a tree of chart, axis, intervals, values.
- **Graphics-ARIA (W3C Rec 2018):** `graphics-document` for a chart root, `graphics-object` for meaningful parts, `graphics-symbol` for a simple icon.
- **Apple AXChartDescriptor:** a useful schema precedent: title, summary, axes, series, points, packaged as chart semantics (https://developer.apple.com/documentation/accessibility/audio-graphs.md). **MAIDR** similarly defines a JSON schema for chart data per plot type.
- **Stack note, Recharts:** `accessibilityLayer` defaults to on in 3.0. It adds `role="application"`, one Tab stop, arrow-key traversal of points, and VoiceOver needs QuickNav off. The point data is reachable through tooltip behavior, so an accessibility-tree agent may see an opaque application. **Test this first; assume it is insufficient on its own.** Highcharts' module is richer (descriptions, keyboard), but I could not read its docs (403).

### Recommended contract **[J, built on the above]**

```html
<figure role="group" aria-labelledby="c1-title" aria-describedby="c1-summary" id="revenue-by-region">
  <figcaption>
    <h3 id="c1-title">EMEA fell 8% while other regions grew</h3>
    <p>Net revenue, USD, Jan to Jun 2026.
       <time datetime="2026-07-01T06:00Z">Data as of 1 Jul, 06:00 UTC</time></p>
  </figcaption>

  <svg aria-hidden="true"><!-- visual only --></svg>

  <p id="c1-summary">EMEA ended at $4.1M, down from $4.5M.
     Americas rose 5% to $9.2M. Status: complete.</p>

  <table class="visually-hidden-or-visible">
    <caption>Net revenue by region and month, USD</caption>
    <thead><tr><th scope="col">Month</th><th scope="col">EMEA</th></tr></thead>
    <tbody><tr><th scope="row">Jan</th><td>4,500,000</td></tr></tbody>
  </table>

  <a href="revenue.csv" download>Download the data for this chart (CSV)</a>
</figure>
```

Points specific to agent use, each worth a harness test:

1. **Only what's in the accessibility tree counts for tree-based agents.** `data-*`, JSON-in-script, and CSS meaning don't reach it. Use real text and table semantics. Provide structured extras as additions, never substitutes.
2. **A closed `<details>` likely removes its table from the tree**, as does `display:none`. Visually-hidden CSS keeps it. Confirm empirically. Humans also benefit from a visible toggle, so test both.
3. **Exact values go in cells.** Abbreviated "1.2M" in KPIs needs the exact value reachable. A mismatched `aria-label` risks WCAG label-in-name, so use the table.
4. **Units in the header or caption, one format per column.** Status as words, not color. Thresholds appear as values.
5. **State as text:** stale, partial, frozen, requested vs confirmed, as-of, filter and range in effect.
6. **Virtualized tables hide rows from the tree.** Offer summary counts and CSV, or an API.
7. **Stable names.** Landmark and heading structure lets an agent reach the right panel. Use stable ids.
8. **Filtered chart and table agree.** Test: apply filter, compare table against known answer.
9. **Tool surface for WebMCP or MCP**, modeled on AXChartDescriptor and MAIDR: `get_chart_data(id)` returns `{title, summary, unit, as_of, state, range, filters, series[], thresholds[], source}`. Same numbers as the screen. Test for drift.
10. **Labels are data.** Series names and cell text from outside sources may contain instructions. Keep them inside table cells and never interpolate them into agent-facing instructions. Details belong in the agent-surface digest.
11. **Row limits:** a 5,000-cell hidden table harms screen-reader navigation (Chartability's tedium test). Summarize and link to a download past a few dozen rows; the number is **[J]**.

---

## 13. What this means for the experiment

1. **Don't rely on comparator agents for chart honesty.** Seto 2026 finds LLMs unreliable at misleader identification, with invented flaws on corrected charts (250 to 625 by model, in trials on 285 corrected charts), and small size is the most hallucinated. Bendeck found GPT-4 fooled by truncated axes. Script axis, series, and color checks. Have judges score other things, and report their false-positive rate on a known-clean control.
2. **Pair preference with task measures** (§5.10). Agent task success and time are already planned; add reading-accuracy tasks on the charts themselves.
3. **Add live-data and state fixtures.** Every case should have: all-normal, one fault, alarm flood, noise-only, stale, missing, partial current period, backend down. Most rules here cannot be seen on a happy-path screenshot.
4. **Scriptable checks in rough priority:** hue audit on normal fixture (C8); bar baseline (A1); text-change rate (V1); pause control present (V4); timestamp in tree and changes when backend stops (V13); table or summary per chart (Chartability); dual-axis and series counts (A5, C1); KPI comparator regex (CM6); numeric alignment and tabular numerals (T5, T6); color-only status via grayscale diff (C5); alert persistence and focus (AL12).
5. **Case mapping.**
   - `incident-console`: sections 5, 6, 7, 8.
   - `revenue-analytics`: sections 3, 4, 9, and KPI delta rules.
   - `agent-fleet-control`: §5.5 requested vs confirmed; §12; alarm budget per supervisor.
   - `bakery-orders`: mostly not alarms. Tests whether the skill over-applies control-room rules. Sentences and short tables should win; a gray HMI aesthetic there would count as overfitting.

---

## 14. Where sources disagree

| Question | Positions | My call |
|---|---|---|
| Line chart baseline | USWDS: zero unless noted. Datawrapper, Analysis Function, Correll: not required | Follow the latter, with stated range. Correll shows truncation inflates lines too, so disclose it |
| Dual y-axes | Analysis Function, Few, EU: against. Grafana: use them. Uncharted: over-generalized | Against by default, no direct experiment (§9) |
| Color count | Analysis Function 4 (archived post); FAA ATC page 4 (excerpt); Wilke 3-5, max ~8; ASM 7; Carbon 14 | 3-5 in a chart, 7 semantic |
| RAG colors | Carbon's alert palette, Few and NHS oppose RAG in different ways | Reserve alert hues; don't traffic-light performance metrics |
| Good/bad color | Grafana blue/red; NHS blue/orange/gray; Datawrapper blue/red over green/red | Blue/orange or blue/red with redundant cues |
| Chartjunk | Tufte, Few vs Bateman, Inbar. Borgo's mixed findings resolve some of it | Task-dependent: strip in monitoring |
| Reading order | Carbon: F-shape. Sultanum & Setlur: layout is one of six factors | Primary at top-left is reasonable; don't treat it as law |
| Dashboard scope | Few: single screen. Bach, Sarikaya: many genres | Single screen for operational only |

---

## 15. Gaps and unverified items

**Could not read (paywall, block, size, or fetch failure):**

- **ISA-101, ISA-18.2, and EEMUA 191 originals.** Numbers come from reproductions; the ISA table is a direct reproduction.
- **FAA AC 25-11B** returned 403, so I cite no specific update rates or invalid-data clauses from it. **HF-STD-001B** not found. **NUREG-0700** exceeded the fetch size, so its guidance on data quality, update rate, and flash rates (sections 1.3.10 and 1.4 in Rev. 2) is unread and worth a follow-up, since it is probably the richest single source for live display. **NASA HIDH** not read for display update numbers.
- **Mission control:** the 1988 memo is a scan and read only as an excerpt. I found no documented convention for stale-data flags in MCC.
- **Staal 2004** fetch failed. The stress section is thin as a result.
- **Books:** Ware, Cairo, Munzner, and Few and Tufte's full books. Material Design returned no content. Observable Plot docs returned 429, so its zero-baseline defaults are unconfirmed. Highcharts docs 403.

**Numbers I dropped because I could not verify them:**

- Jones & Endsley's "76% of SA errors at level 1".
- Healey's "seven isoluminant colors" (the abstract gives no count).
- Ware's "about twelve colors".
- Any TMI alarm count ("over 100").
- Wheeler's XmR constant and NHS's minimum number of data points.
- Carbon's "white space adds about 20% comprehension" is on its page, but I treat it as unsupported.
- "72% abandon dashboards for spreadsheets" is a vendor claim that could not be traced.

**Secondary or excerpt-only claims:**

- AF447's 60-knot behavior comes from trade press. The BEA text I read lists the factors but not this mechanism.
- TMI "command not position" comes from secondary accounts; NRC confirms only that instruments indicated closed.
- Dark cockpit from trade press.
- Dixon/Wickens from a report's summary. Wickens & Dixon 2007's 70% reliability figure was not found, so it's not used.
- The Woods content comes from Fred Hebert's reading notes, not the paper.
- NRC audit statements come from search excerpts.
- Ettling 2025 time and accuracy results unavailable.
- Heer et al. 2009 horizon graph thresholds unavailable.
- Cited-only: the 31%/87% comparison comes through Charts-of-Thought, not Bendeck & Stasko directly, and on an older model.

**Open questions no source answered:**

- Skeleton screens versus other loading states on dashboards.
- Comparison of pausing designs for streams.
- Reading stability with live reordering tables (V7, V8 are judgment).
- Any LLM-dashboard failure prevalence.
- Controlled evidence on two-unit y-axes.
- Independent replication of HP-HMI.
- Whether a closed `<details>` hides tables from each agent's tree (test it).
