# Empirical HCI: what is proven, what is folklore

Research digest for the `interface-guidelines` skill. It covers motor and decision laws, timing, memory and attention, visual perception, forms, warnings, motion, dark patterns, and human-AI oversight.

## How to read this file

**Evidence ratings**

| Rating | Meaning |
|---|---|
| Strong | Meta-analysis, or repeated independent replication, in conditions close to real interface use |
| Moderate | Solid controlled studies, but few, or in narrow conditions |
| Weak | Small, unreplicated, vendor-run, or without statistics. Also expert consensus with no outcome data |
| Debunked | Failed replication, or the claim is not in its cited source |

**How each claim was checked**

| Tag | Meaning |
|---|---|
| [A] | I read the abstract or full text in this session |
| [S] | I saw only a secondary account, or a summary of the abstract |
| [E] | The DOI resolves and the paper exists, but the specifics come from my recollection. Re-read before quoting |
| [U] | Not verified. Do not cite without checking |

**Limits of this review**

- Most papers were checked at abstract level through Crossref, OpenAlex and PubMed, so effect sizes are only those the abstracts give.
- Web tools were unavailable for part of the session, which left some gaps. Section 8 lists them.
- Several of the strongest recent numbers on approval fatigue come from Anthropic, which sells the product being evaluated and also makes the model that wrote this digest. They are labelled "vendor" and should not be read as independent findings.

## Top findings

1. **The 400 ms "Doherty threshold" is not in the Doherty and Thadani paper, at least in the transcription I checked.** A text search for 400 ms or 0.4 s found nothing relevant. The paper tabulates 3.0, 2.0, 1.0, 0.6 and 0.3 s and argues for sub-second response. A later controlled test found a much smaller, linear effect, limited to data entry (Martin and Corl 1986).
2. **Hick's law does not support "fewer options is better".** Logarithmic growth is an argument against that reading, and most interface choice is visual search and deliberation, not choice reaction (Liu et al. 2020). The mean choice-overload effect across studies is about zero (Scheibehenne et al. 2010).
3. **Per-action approval is a weak safeguard.** In a controlled study of computer-use agents, users blocked 21% of the problematic actions that reached execution, and that rate did not differ reliably across oversight strategies (Chen et al. 2026). In a vendor study, humans caught 13.6% of a planted dangerous command.
4. **Warning fatigue is real, but it is not the whole story.** Attention falls after repeated exposure (Anderson et al. 2015; Vance et al. 2018). A large field study still found no single dominant failure in modern warnings (Reeder et al. 2018), and comprehension and timing fail too (Felt et al. 2012; Chen et al. 2026).
5. **Explanations often raise acceptance rather than accuracy** (Bansal et al. 2021). What helps is letting people verify the output (Fok and Weld 2024) and making engagement worth the effort (Vasconcelos et al. 2023).

---

## 1. Claims table

### 1.1 Motor and decision

| Claim | Evidence | Key citations | Effect size or limits | What a designer should do |
|---|---|---|---|---|
| Pointing time grows with distance and shrinks with target size (Fitts) | **Strong** | MacKenzie 1992 [A]; Soukoreff and MacKenzie 2004 [E] | Reviews 27 years of work. ISO-style throughput rarely exceeds about 5 bits/s for the mouse [S]. Models speed and accuracy, not whether users find the target | Enlarge and bring closer the frequent and urgent targets. Separate dangerous targets from common ones |
| Plain Fitts' law underfits small touch targets | **Strong** | Bi et al. 2013 [A]; Henze et al. 2011 [A]; Holz and Baudisch 2010 [A] | FFitts R² ≥ 0.91. Finger touch has an absolute precision floor that care cannot remove. 120 million touches show systematic position skew | Do not assume slower tapping fixes small targets. Size targets for the finger |
| About 9.6 mm is enough for discrete one-handed thumb taps | **Moderate** | Parhi et al. 2006 [A] | No significant error differences at ≥9.6 mm (discrete) or ≥7.7 mm (serial). One study, one device class | Use 44 to 48 px for primary touch controls. Treat these as guidance, not physiology |
| Lab input data does not transfer simply to the field | **Moderate** | Findlater et al. 2017 [A] | n = 30 lab, 303 crowd. Touch vs mouse error ordering reversed between lab and online | Add margin to lab-derived sizes on mobile |
| Trajectory tasks follow the steering law (time scales with path length over width) | **Strong** for the task class | Accot and Zhai 1997 [E]; Ahlström 2005 [A] | Cascading menu model r² > 0.90 across three devices | Avoid long narrow hover paths. Use forgiving hover corridors, or click-to-open |
| Screen-edge and impenetrable-border targets are faster | **Moderate** | Walker and Smelcer 1990 [A] | Pre-touch study, desktop only | Use edges on desktop. Do not carry this to touch or browser-embedded UI without checking |
| Keystroke-level and GOMS models predict expert task time | **Strong** for skilled, error-free routine work | Card et al. 1980 [E]; John and Kieras 1996 [A]; Gray et al. 1993 [A] | Project Ernestine models predicted a real field-trial outcome. Does not model novices, errors or learning. The operator values often quoted (K about 0.2 s, P 1.1 s, H 0.4 s, M 1.35 s) are from memory [E] | Use KLM to compare step counts on repeated expert flows such as triage |
| Reaction time grows with log(number of equally likely options) (Hick-Hyman) | **Strong** in its domain, which is choice reaction | Hick 1952 [A]; Hyman 1953 [A]; Proctor and Schneider 2018 [A] | Challenged by stimulus-response compatibility, practice, very large sets and sequence effects | Use it for practiced, compatible stimulus-to-response mappings only |
| "Hick's law says fewer options is better" | **Debunked** as stated | Liu et al. 2020 [A]; Seow 2005 [A]; Cockburn et al. 2007 [A]; Landauer and Nachbar 1985 [A] | Log growth favors one wide menu over a deep tree. Novices are modeled by visual search, and Hick-Hyman applies to experts | Decide by search, grouping and familiarity. Do not remove options citing Hick |
| Broad, shallow menus usually beat deep ones, but extreme breadth loses | **Moderate** | Larson and Czerwinski 1998 [A]; Landauer and Nachbar 1985 [A] | Medium depth and breadth beat the broadest structure on the web | Avoid deep trees. Do not flatten until scent is lost |
| More options reduce choice (the jam study) | **Weak** as a general law; conditional | Iyengar and Lepper 2000 [E]; Scheibehenne et al. 2010 [A]; Chernev et al. 2015 [A] | Mean effect about zero (63 conditions, N = 5,036). Overload appears with complex sets, hard tasks, uncertain preferences and effort-minimizing goals (99 observations, N = 7,202) | Cut options only when those moderators hold. Prefer good defaults and filters |
| Default options move behavior | **Moderate to strong** | Jachimowicz et al. 2019 [A] | d = 0.68 [0.53, 0.83] across 58 studies, with wide variation and some negative results | Set safe defaults, because the default effectively makes the decision. Publication bias caveat below |
| Nudges work at the size journals report | **Debunked** as to size | Mertens et al. 2022 [A]; Maier et al. 2022 [A]; DellaVigna and Linos 2022 [A] | Journals: 8.7 pp. Nudge-unit RCTs: 1.4 pp (23 million people). Meta-analytic d = 0.45 shrinks to no evidence after bias correction, on one analysis | Expect small effects from wording and layout tweaks. Do not promise lifts from papers |
| Shortcuts get adopted as people gain experience | **Debunked** as an assumption | Lane et al. 2005 [A]; Scarr et al. 2011 [A]; Cockburn et al. 2014 [A]; Grossman et al. 2007 [A] | 251 experienced Word users rarely used shortcuts. Feedback and cost changes speed hotkey learning | Actively teach expert paths in context. Do not assume users migrate |

### 1.2 Timing and perceived performance

| Claim | Evidence | Key citations | Effect size or limits | What a designer should do |
|---|---|---|---|---|
| Faster is generally better for frequent users | **Moderate to strong** | Shneiderman 1984 [A]; Dabrowski and Munson 2011 [A]; Attig et al. 2017 [A] | Frequent users prefer under 1 s. Error rates can rise at both too-short and too-long responses. Users pick up the pace of the system | Reduce latency, and consider slower pacing where errors are costly |
| 400 ms is a productivity threshold (Doherty) | **Debunked** as attributed | Doherty and Thadani 1982, transcription [A]; Laws of UX [A]; Martin and Corl 1986 [A]; Lambert 1984 [A]; Thadhani 1981 [A] | Source reports 180 tx/hr at 3 s and 371 at 0.3 s, with no 400 ms figure. It is an IBM marketing-adjacent brief with limited method detail. Lambert, also IBM, reports +62% with sub-second response. Martin and Corl found a far smaller, linear effect, for data entry only, absent in problem solving | Say "sub-second helps routine entry". Do not cite 400 ms as a finding |
| 0.1 / 1 / 10 s are perceptual limits | **Weak** as empirical constants; useful heuristic | Miller 1968 [A, S]; Card et al. 1991 [E]; Nielsen 1993 [S]; Web Performance Calendar 2018 [S] | Traced to Miller's essay, which reports no experiment according to the Web Performance Calendar critique. Nielsen says his limits restate Miller and Card | Use as round design bands, labelled as heuristic |
| 100 ms is the instantaneity threshold | **Moderate**, but varies by task; not a universal limit | Forch et al. 2017 [A, S]; Kaaresoja et al. 2014 [S]; Jota et al. 2013 [A]; Deber et al. 2015 [A] | Mouse thresholds around 60 ms (reported range 34 to 137 ms, n = 20). Touch simultaneity about 85 ms or less. Drag performance degrades as latency rises | Target ≤100 ms for feedback to direct input, and lower for dragging and inking |
| Control tasks and conversational tasks need different timing | **Moderate** (review synthesis) | Dabrowski and Munson 2011 [A] | Immediate response for control. Some delay can suit conversational pacing | Treat dragging and typing differently from asking a question |
| Google's INP 200 ms and LCP 2.5 s are perceptual thresholds | **Debunked** as a reading | web.dev 2020 [S] | Research suggested about 100 ms for INP. 200 ms and 2.5 s were chosen partly for field achievability. CLS 0.1 came from internal testing | Treat as industry targets at p75, not as human limits |
| Delays reduce performance and attitudes on the web | **Moderate** | Galletta et al. 2004 [A] | n = 196, delays of 0 to 12 s, non-linear. Explained variance is modest: about 2% performance, 5% attitudes, 7% intentions | Fix latency, but do not expect delay alone to explain most behavior |
| Progress indicators are preferred | **Moderate** | Myers 1985 [A] | People prefer them. The study's replication of the preference for constant over variable time was not significant | Show progress on long operations |
| Bar behavior changes perceived duration | **Moderate** | Harrison et al. 2007 [A, S]; Harrison et al. 2010 [A] | Backward-moving decelerating ribbing cut perceived duration 11%. People tolerate early pauses more than late ones [S] | Avoid late stalls. Never fake progress on an operation whose outcome matters |
| Skeleton screens feel faster than spinners | **Weak to debunked** as a general claim | Mejtoft et al. 2018 [A]; Viget 2017 [A]; NN/g [A] | Mejtoft reported no significant difference in any comparison, which is often misquoted as a win. Viget (n = 136, no statistics): skeleton 2.82 s perceived, spinner 2.41 s, blank 2.29 s. NN/g gives guidance without outcome data | Choose skeletons to prevent layout shift and show structure, not to reduce perceived wait. No indicator under about 1 s (heuristic) |
| Giving people something to do shortens waits | **Weak** | van Nimwegen and van Rijn 2022 [A] | n = 410. Passive reading was estimated longer than active or no activity, so content during waits can backfire | Do not assume distraction helps |

### 1.3 Memory and attention

| Claim | Evidence | Key citations | Effect size or limits | What a designer should do |
|---|---|---|---|---|
| "Limit menus and nav to 7±2 items" | **Debunked** as a design rule | Miller 1956 [A]; Cowan 2001 [A]; MeasuringU [S] | Miller's number concerns span and recoding, and Cowan describes it as a rough estimate and rhetorical device. Menus sit on screen, so they do not need to be held in memory | Do not cap visible lists by this number. Group them |
| Working memory holds about 3 to 5 chunks | **Strong** | Cowan 2001 [A]; Cowan 2010 [A]; Mathy and Feldman 2012 [E] | Holds where rehearsal and chunking are blocked. Measured in young adults. Varies among individuals | Do not require carrying more than a few items across screens. Show the values instead |
| People miss large changes when attention is elsewhere or at a transient | **Strong** | Simons and Levin 1997 [E]; Durlach 2004 [A]; Varakin et al. 2004 [A] | Screen flashes, blinks, relocation and distractions all mask changes | Do not rely on an in-place update to be seen. Mark changes persistently (see Baudisch 2006) |
| Designers overestimate what users will notice | **Moderate to strong** | Levin et al. 2000 [A]; Varakin et al. 2004 [A] | Most people predict they would detect changes that observers rarely detect | Test noticing with users. Do not trust the designer's intuition |
| Unexpected items go unseen under load | **Strong** | Simons and Chabris 1999 [A] | Depends on similarity to attended objects and task difficulty, not spatial proximity | During busy tasks, put critical alerts in the task's own attention set |
| Users are blind to anything banner-like | **Moderate**, with limits | Benway 1998 [A]; Burke et al. 2005 [A]; Resnick and Albert 2014 [A]; Hervet et al. 2011 [A] | Strongest in goal-directed tasks and in right-rail positions. Hervet: most people do fixate ads at least once. Burke: ads rarely fixated, yet they still slow search | Do not put critical content in ad-shaped boxes or positions |
| Flashing and animation capture attention usefully | **Weak** | Burke et al. 2005 [A] | Flashing raised perceived workload. Animated banners were remembered less than static ones | Reserve motion for real state change |
| Cognitive load theory applies directly to UI | **Moderate** as a frame, **weak** as a measurement | Sweller 1988 [A]; de Jong 2010 [A]; Hollender et al. 2010 [E]; Oviatt 2006 [A] | Built for learning, with open conceptual and measurement issues | Use it to explain, not to quantify. Measure task outcomes |
| Recognition beats recall | **Strong** for memory, **moderate** for UI | Textbook memory result, primary not re-checked [U]; Gray and Fu 2004 [A]; Cockburn et al. 2014 [A] | People trade perfect on-screen knowledge against imperfect memory depending on effort, so "visible" is not enough if access is costly | Keep commands visible and cheap to reach, and also provide a recall path for experts |
| Interruptions always slow work | **Moderate**, with a twist | Mark et al. 2008 [A]; McFarlane 2002 [A]; Iqbal and Horvitz 2007 [A] | Interrupted tasks finished faster with no quality loss, but with more stress and effort. Negotiated interruption was best overall, except where small differences in timeliness are critical, when immediate wins (n = 36) | Default to negotiated timing, and interrupt immediately only for the time-critical |
| Batching notifications helps | **Moderate** | Fitz et al. 2019 [E] | Well-being outcome. Specifics not re-read | Batch non-urgent approvals and alerts (inference for agents) |

### 1.4 Visual

| Claim | Evidence | Key citations | Effect size or limits | What a designer should do |
|---|---|---|---|---|
| Gestalt grouping (proximity, similarity, common region, connectedness) | **Strong** as perception | Wagemans et al. 2012 [A]; Palmer 1992 [E] | Mostly lab displays. Relative strength of cues in real UI is less well studied | Use it to structure layout, then test real tasks |
| Appeal judgments form in 50 ms | **Moderate to strong**, narrowly | Lindgaard et al. 2006 [A]; Lindgaard et al. 2011 [A]; Reinecke et al. 2013 [A] | Applies to visual appeal. Trust and usability judgments at 50 ms are also driven largely by appeal, but processed differently. Complexity and colorfulness models explain about half of the variance at 500 ms | Say "appeal forms fast". Do not claim users assess usability or decide to stay in 50 ms |
| "What is beautiful is usable" | **Moderate** before or early in use; **weak** as a general causal law | Kurosu and Kashimura 1995 [A]; Tractinsky et al. 2000 [A]; Sonderegger and Sauer 2010 [A]; Hassenzahl and Monk 2010 [A]; Tuch et al. 2012 [S]; Hassenzahl 2004 [A] | Across 25 correlations in 15 papers coefficients varied widely. The beauty-usability link is wholly mediated by overall goodness. Tuch (N = 80): aesthetics did not change perceived usability, and bad usability lowered post-use beauty, reversing the claim. Sonderegger: aesthetics also sped up adolescents (n = 60) | Do not rely on polish to hide usability problems. Do not read a good rating of a pretty prototype as usable |
| Visual preference is culturally and demographically varied | **Strong** for existence | Reinecke and Gajos 2014 [A] | 2.4 million ratings, about 40,000 people. Peak complexity and colorfulness vary by country, education and gender. Self-selected volunteers | Do not hard-code one density as universally best. Know the audience |
| Dark text on light outperforms light on dark | **Strong** for proofreading and acuity | Buchner and Baumgartner 2007 [A]; Piepenbrock et al. 2013 [A]; Piepenbrock et al. 2014a, 2014b [A]; Dobres et al. 2017 [A] | Holds across ages and ambient light. Larger at small sizes and consistent with a luminance mechanism. No physiological strain or self-reported fatigue difference in Buchner. Studies use normal-vision samples and short tasks | Light default for reading-heavy work is defensible. Offer dark as a preference, and avoid small text in dark |
| "Dark mode is easier on the eyes" | **Weak**; no support found | Buchner and Baumgartner 2007 [A] | No evidence found of an eyestrain benefit in these studies. Low-vision users may benefit, but that was not verified here [U] | Offer it as a preference, not as a health claim |
| Black on white causes myopia, so use dark | **Weak** | Aleman et al. 2018 [A] | Choroid thinned about 16 µm with black-on-white and thickened about 10 µm with white-on-black within an hour, in young subjects. A short-term proxy, not myopia outcomes | Do not base UI decisions on this |
| 45 to 75 characters per line is optimal | **Moderate** for preference; **weak** for speed | Bailey 2002 [A]; Nanavati and Bias 2005 [S]; Dyson and Haselgrove 2001 [S]; Ling and van Schaik 2006 [E] | On screen, longer lines are often read faster, while readers prefer moderate ones. Very short lines are slower. Print studies differ | Use about 50 to 75 cpl for prose and say it is a preference and comfort choice. Wider is fine for scanning and tables |
| Short lines help readers who struggle | **Moderate** | Schneps et al. 2013 [A] | High-school students with dyslexia: 27% faster, 11% fewer fixations, less than half the regressions, with no comprehension cost on a small device | Provide reflow and narrow reading views |
| Bigger text is more readable on the web | **Moderate** | Rello et al. 2016 [A]; Bernard et al. 2001 [A]; Beymer et al. 2008 [A]; Legge and Bigelow 2011 [A] | Rello: N = 104, Wikipedia, 18 pt+ better than smaller. Line spacing has only marginal effects, at the extremes. Fluent range is wide: x-height about 0.2° to 2° | Use 16 px as a floor and go larger for long reading. For dense expert UIs, test legibility rather than copying 18 pt |
| Serif vs sans determines legibility | **Debunked** | Arditi and Cho 2005 [A]; Beymer et al. 2008 [A] | No meaningful legibility or reading speed difference | Choose by tone and rendering |
| One best font exists | **Debunked** | Wallace et al. 2022 [A] | Fastest vs slowest font varies by individual, by 35% in reading speed, without a comprehension change. Size normalized for perception | Allow user font and size changes. Do not break browser zoom |
| Dyslexia fonts help | **Debunked** | Kuster et al. 2018 [A]; Wery and Diliberto 2017 [A] | Dyslexie (n = 170, 102, 45) and OpenDyslexic: no speed or accuracy gain, and children did not prefer them | Offer them as an option at most. Support spacing and reflow instead |
| Hard-to-read fonts increase careful thinking | **Debunked** | Meyer et al. 2015 [A] | Pooled 17 experiments: no effect on solution rates | Do not add friction through poor legibility |
| Color semantics shift performance (red impairs thinking) | **Debunked** as robust | Gnambs 2020 [A]; Elliot and Maier 2014 [E] | Anagrams d = −0.06, knowledge d = −0.04, reasoning d = −0.34, and no evidential value after bias correction | Use color for encoding and status, paired with a non-color cue. Do not cite color psychology for conversion |
| Bar and position charts read more accurately than angle or area | **Strong** | Cleveland and McGill 1984 [A]; Heer and Bostock 2010 [A] | Replicated by crowdsourcing | Prefer position and length for precise comparison |
| Chart junk always hurts | **Weak** as absolute | Bateman et al. 2010 [A] | Accuracy no worse, and recall 2 to 3 weeks later was better with embellished charts. Task was description and memory, not fast decisions | Stay minimal for monitoring and analysis. Embellish only where recall is the goal |

### 1.5 Text, forms and errors

| Claim | Evidence | Key citations | Effect size or limits | What a designer should do |
|---|---|---|---|---|
| Applying form guidelines as a bundle works | **Moderate** | Seckler et al. 2014 [A] | N = 65: faster completion, fewer submission attempts, fewer eye movements, higher satisfaction. Combined effect of 20 rules, so no rule can be isolated | Apply them as a set. Do not credit any single one |
| Inline validation raises success 22% | **Weak** | Wroblewski 2009 [A] | Etre test, n = 22, no statistics reported. Other figures: 22% fewer errors, 31% satisfaction, 42% faster, 47% fewer fixations. On-blur beat on-keypress; "before and while" was worst | Validate on blur, after the user finishes the field, not during typing |
| Immediate error feedback is best | **Debunked** as universal; conflict unresolved | Bargas-Avila et al. 2007 [A]; Wroblewski 2009 [A] | Two studies (77 and 90): immediate feedback was worst and often ignored, while listing errors after completion was best. Conflicts with Wroblewski. Implementation of "immediate" differs | Never fire before the user has finished. Always re-show all errors at submit, then link to each one. Test on your form |
| Top-aligned labels are fastest | **Weak** | Penzo 2006 [A]; Das et al. 2008 [A]; Jarrett 2010 [S] | Penzo: an ad hoc eye-tracking test, inferring load from about 500 ms saccades on left-aligned labels. Das (about 11 users): right-aligned fastest, contradicting Wroblewski's recommendation. Left-aligned is weakest in both | Use top labels for mobile fit and simplicity, not as a proven speed win |
| Checkout length drives abandonment | **Weak to moderate** (commercial, self-report) | Baymard 2025 [A] | Mean abandonment 70.22% across 50 studies. 17% of US shoppers report leaving because of a long or complicated checkout. Benchmark 23.48 form elements (14.88 fields) against a claimed ideal of 12 to 14 (7 to 8 fields). Not peer reviewed | Remove fields you do not use. Use Baymard for finding problems, not for effect sizes |
| Button wording changes decisions | **Moderate** | Böhme and Köpsell 2010 [A]; Felt et al. 2015 [A] | 80,000 users: voluntary wording and polite requests reduced consent, and dialogs resembling EULAs got blind acceptance. Opinionated visual design moved nearly 30% more users to the safe choice even though comprehension goals failed | Name the action and consequence. Make the safe path visually dominant where safety matters. No controlled study found of "Delete" vs "OK" |
| Plain, specific error messages help | **Moderate** in concept, **mixed** on outcomes | Shneiderman 1982 [E]; Denny et al. 2014 [A]; Becker et al. 2016 [A]; Barik et al. 2017 [A] | Enhanced compiler messages: no effect in one controlled study, positive in another. Developers do read messages, and message difficulty predicts task performance (n = 56). Mostly programmers and students | Say what happened, where and how to fix it, and test whether it changes recovery |

### 1.6 Warnings, confirmation and undo

| Claim | Evidence | Key citations | Effect size or limits | What a designer should do |
|---|---|---|---|---|
| Repeated dialogs lose attention | **Strong** | Bravo-Lillo et al. 2014 [A]; Anderson et al. 2015 [A]; Vance et al. 2018 [A]; Böhme and Köpsell 2010 [A]; Ancker et al. 2017 [A] | Three-fold drop in noticing a changed field with habituation. Visual processing drop by the second exposure. Adherence falls over three weeks, and attention partly recovers between days | Prompt rarely. Repeat prompts for the same object count as low-value noise |
| Habituation is the main reason warnings fail | **Weak** as a sole explanation | Reeder et al. 2018 [A]; Felt et al. 2012a [A]; Jenkins et al. 2016 [A] | 6,000+ in-situ Chrome and Firefox users: no single dominant failure. Android: 17% attended, 3% answered all comprehension questions. Dual-task interference also lowers adherence | Fix comprehension, timing and context, as well as frequency |
| Warnings do not work | **Debunked** | Akhawe and Felt 2013 [A]; Egelman et al. 2008 [A] | 25 million impressions: click-through 10% to 25% for malware and phishing, 33% to 70.2% for SSL, by browser. Active warnings heeded by 79%, passive by one participant out of about 60 | Use active, blocking warnings for the rare, serious case. Design matters a lot |
| Forcing interaction with the risky content resists habituation | **Moderate** | Bravo-Lillo et al. 2013 [A]; Bravo-Lillo et al. 2014 [A] | Attractors that forced interaction with the changed field were resilient. Delays helped less | For severe actions, have users type or select the specific target value |
| Varying a warning's look slows habituation | **Moderate** | Anderson et al. 2015 [A]; Vance et al. 2018 [A] | Fields confirm reduced decline over three weeks. Not tested at long horizons | Reserve a distinct treatment for severe actions. Do not add randomness to everyday UI |
| Only severe permissions deserve attention | **Moderate** (analytic) | Felt et al. 2012b [A]; Roesner et al. 2012 [A] | By paper analysis of 83 permissions: 55% auto-grant, 23% trusted UI, 16% runtime dialog, 6% install-time. Not an outcome trial | Use the ladder in Section 3 |
| Rare targets get missed | **Strong** | Wolfe et al. 2005 [A, S]; Wolfe et al. 2007 [A]; Mitroff and Biggs 2014 [A] | Miss about 30% at 1% prevalence vs about 7% at 50% [S, one source says 40%]. It is a criterion shift, and hard to instruct away. Detection falls logarithmically with frequency (R² = .92) | Assume a rare bad prompt will be missed. Do not rely on vigilance |
| Allowing correction removes the rare-target problem | **Moderate**, contested | Fleck and Mitroff 2007 [A]; Van Wert et al. 2009 [E, S] | Many misses are response errors that people catch when allowed to correct. Not eliminated with harder targets | Provide a chance to reverse even when it does not cover perception failures |
| Alarm response tracks reliability | **Moderate to strong** | Bliss et al. 1995 [A]; Dixon et al. 2007 [A]; Wickens and Dixon 2007 [A]; Drew et al. 2014 [A]; van der Sijs et al. 2006 [A]; Alahmadi et al. 2022 [A] | About 90% of subjects match response rate to alarm probability. False alarms hurt more than misses (n = 32). Automation below about 0.70 reliability is worse than none (35 data points). 88.8% of ICU arrhythmia alarms false. 49% to 96% of drug alerts overridden, often justifiably | Treat alert precision as a design metric. Separate "technically right but benign" from truly actionable |
| Undo beats confirmation | **Weak** (expert consensus; no controlled comparison found) | Raskin 2000 [U]; Felt et al. 2012b [A]; Akers et al. 2009 [A] | I found no controlled study comparing error outcomes. Support is indirect: habituation and correctable search | Prefer undo where the action is truly reversible, and say this rests on inference. Undo events also serve as usability telemetry (over 90% of severe problems in Akers) |

### 1.7 Motion

| Claim | Evidence | Key citations | Effect size or limits | What a designer should do |
|---|---|---|---|---|
| Animated transitions help people track change | **Moderate** | Heer and Robertson 2007 [A]; Bederson and Boltman 2003 [E] | Significantly better graphical perception for chart transitions | Animate between related states of the same data |
| Animation helps analysis | **Debunked** for trend analysis | Robertson et al. 2008 [A]; Tversky et al. 2002 [E] | Animation slowest for analysis, with many errors even in presentation, despite being enjoyed | Use small multiples or traces for analysis |
| Staggering helps | **Debunked** for tracking | Chevalier et al. 2014 [A] | Loses common-motion grouping and start-time predictability. Benefits not demonstrated | Move related elements together |
| Users should wait for an explanation of change | **Moderate** against | Baudisch et al. 2006 [A] | Instant result with afterglow supports both inexperienced and expert users | Update at once and leave a trace, especially on live dashboards |
| 200 to 300 ms is the optimal duration | **Weak** | Thesis only; practitioner sources [S] | No peer-reviewed controlled test found | Treat as craft judgment, not evidence |
| Parallax and large motion trigger vestibular symptoms on 2D web pages | **Weak** direct evidence; plausible mechanism | Clinical and VR literature [S]; WCAG 2.3.3 [U] | No controlled study found on web pages with vestibular participants, and none showing `prefers-reduced-motion` reduces symptoms. Prevalence figures on blogs are not traceable | Honor reduced motion as low-cost, standards-based accessibility. Do not cite prevalence numbers |

### 1.8 Dark patterns

| Claim | Evidence | Key citations | Effect size or limits | What a designer should do |
|---|---|---|---|---|
| Dark patterns are common | **Strong** | Mathur et al. 2019 [A]; Di Geronimo et al. 2020 [A]; Nouwens et al. 2020 [A]; Gray et al. 2018 [A] | 1,818 instances on about 11,000 shopping sites, with 183 sites deceptive. 95% of 240 apps. 11.8% of CMPs meet minimal legal requirements | Audit your flows. Do not treat them as edge cases |
| They work | **Strong** | Luguri and Strahilevitz 2021 [A]; Nouwens et al. 2020 [A] | Mild: more than 2x sign-up. Aggressive: nearly 4x, with backlash only at aggressive. Removing first-page opt-out adds 22 to 23 points of consent (n = 40). Hidden information, trick questions and obstruction are strongest; "act now" urgency was not effective | Symmetric paths. Equal prominence for accept and decline |
| Awareness protects users | **Debunked** | Bongard-Blanchy et al. 2021 [A]; Di Geronimo et al. 2020 [A] | n = 406: aware but not able to resist | Do not rely on education |
| Agents are immune | **Debunked** | Ersoy et al. 2025 [A, S]; Tang et al. 2025 [A]; DECEPTICON [S] | Six agents: 41.1% average susceptibility, range 12.1% to 72.3%. Obstruction 52.2%, social engineering 47.9%. Prompting cut about 32%. Vision generally worsened it. Humans and agents fail differently; humans overseeing added attentional tunneling | Honest UI is an agent reliability feature too. Avoid obstruction patterns in anything agents operate |

### 1.9 Folklore that was checked and has no support

| Folklore | Finding | Citation |
|---|---|---|
| Three-click rule | No published data supports it. Dropoff did not rise past three clicks in Porter's test | NN/g [A]; Porter 2003 [S] |
| 8-second attention span | I found no primary data. The related claim of a 10 to 15 minute lecture decline also rests on scant, flawed studies | Bradbury 2016 [A] |
| Golden ratio makes layouts better | The aesthetic claims are poorly supported | Markowsky 1992 [E] |
| Pretty proves usable | See 1.4 | Hassenzahl and Monk 2010 [A] |
| "Users cannot resist confirm dialogs, so dialogs never work" | Active warnings can work when rare and well designed | Egelman et al. 2008 [A] |
| A single "best" A/B lift from a blog applies to you | Published effects shrink at scale | DellaVigna and Linos 2022 [A]; Kohavi et al. 2014 [A] |

---

## 2. Numbers safe to cite, and numbers that are not

### Safe, with the stated scope

| Number | Exact scope | Source |
|---|---|---|
| 3 to 5 chunks | Working memory in young adults, when chunking is blocked | Cowan 2010 |
| ≥9.6 mm discrete, ≥7.7 mm serial | One-handed thumb, no significant error reduction beyond this | Parhi et al. 2006 |
| 70.2% and 10% | Chrome SSL and Firefox malware warning click-through, 2013 | Akhawe and Felt 2013 |
| 79% vs one participant | Active vs passive phishing warnings, lab, n = 60 | Egelman et al. 2008 |
| About 60 ms | Mouse latency perception threshold, n = 20 students, wide variation | Forch et al. 2017 |
| 11% | Perceived-duration reduction from one progress bar treatment | Harrison et al. 2010 |
| d = 0.68 | Default effect, before accounting for wide heterogeneity | Jachimowicz et al. 2019 |
| 8.7 pp vs 1.4 pp | Nudge effects in journals vs at scale | DellaVigna and Linos 2022 |
| g = −0.23 | Human-AI combination vs the better of human or AI alone, 106 studies | Vaccaro et al. 2024 |
| 0.70 | Reliability crossover for diagnostic automation, older literature | Wickens and Dixon 2007 |
| 2x and 4x | Mild and aggressive dark patterns, one service offer | Luguri and Strahilevitz 2021 |
| 21% (29 of 138) | Problematic computer-use agent actions blocked by users, preprint | Chen et al. 2026 |
| 41.1% | Agent dark pattern susceptibility, six 2025 agents | Ersoy et al. 2025 |
| 49% to 96% | Drug-alert override range; many overrides justified | van der Sijs et al. 2006 |

### Cite only with the caveat attached

| Number | Caveat |
|---|---|
| 0.1 / 1 / 10 s | Heuristics that trace to an essay. Not measured thresholds |
| 200 ms INP, 2.5 s LCP, 0.1 CLS | Google's targets, partly set by achievability |
| 22% inline validation lift | n = 22, no statistics |
| 50 ms | Visual appeal only, not trust or a decision to leave |
| 17% checkout abandonment; 70.22% cart abandonment | Self-report; average of mixed commercial sources |
| 93% and 97% of prompts approved | Vendor telemetry, from March and August 2026. High approval can be correct behavior if most requests are fine |
| 13.6% vs 89% | Vendor study with paid testers, a test environment, no real stakes, one planted command |
| About 1 in 3 threats missed (Wauters) | Self-selected game, 34% threat rate, 60 s clock |
| 16 px body text, 18 pt for reading | Convention and one Wikipedia study |
| 50 to 75 cpl | Preference more than speed |

### Do not cite as findings

| Number | Why |
|---|---|
| 400 ms Doherty threshold | Not in the source text checked |
| 7±2 for menu or nav length | Misapplied. Not a list length rule |
| 8-second attention span | No primary data found |
| 3 clicks | No supporting data |
| 11.3 checkout form fields attributed to Baymard | Baymard's page I checked gives 23.48 elements and 14.88 fields |
| 18% too long or complicated | Baymard's current page says 17%. Older versions may differ |
| 200 to 300 ms "optimal" animation | No peer-reviewed evidence found |
| Vestibular prevalence numbers from blogs | Untraceable and inconsistent |
| "Skeleton screens are perceived X% faster" | The studies do not show this |
| "Up to 50% faster" Facebook skeleton figure | Uncited on the blogs where it appears |

---

## 3. Human-AI: designing oversight of agents

### 3.1 What the current evidence says

**Direct studies of agent oversight (recent; mostly preprints)**

Chen et al. 2026 (arXiv preprint; within-subject, 48 people, 192 sessions, six live browser tasks with one embedded problem each):

| Strategy | Problem occurred | User intervened (given occurrence) | Uncorrected failure |
|---|---|---|---|
| Action confirmation (approve every action) | 83.3% | 22.5% | 64.6% |
| Risk-gated (agent escalates flagged risks) | 87.5% | 26.2% | 64.6% |
| Supervisory co-execution (plan, then steps) | 56.2% | 7.4% | 52.1% |
| Structurally enriched (plan, risk labels, on-demand revision) | 60.4% | 24.1% | 45.8% |

- Strategy changed occurrence and failure, not intervention. Plans cut the odds of occurrence by 76%, but the approved plan was injected into the agent's prompt, so this is partly an agent-behavior effect rather than a human oversight effect.
- Across 109 failure episodes, 56% were **mistimed authority**: the risky content was already in place before the approval point, or no gate existed when the risk emerged.
- 68% were **procedural approval**, with little observable deliberation.
- "Approve similar" auto-approved actions in 28 of 53 failures under the conditions offering it.
- A risk cue was present in 100 of 109 failures, and it named the risk explicitly in only 49. Users often checked whether the agent followed the workflow, not whether the step should happen.
- Plans could make later actions seem already vetted.
- Limits: one lightweight model, researcher-built sites, bundled configurations, and context confounded with scenario.

Dissanayake et al. 2026 (arXiv preprint; programming agents, 36 people):

- Silent defects that passed visible checks were resolved in 27.8% of tasks in round 1 and 51.4% in round 2.
- 79% of failed silent-defect tasks had confidence ratings of 4 or 5 out of 5, and confidence did not recalibrate.
- Resolved tasks took about twice as long (10.8 vs 5.8 min).
- 23 of 71 silent-defect instances failed with generic checks only.
- A visible failure raised detection only for the task right after it (50% vs 9.1% with one correct task between, on small samples).
- Gaze and physiology did not reliably predict detection. Interventions were not tested.

He et al. 2025 (CHI; N = 248; plan-then-execute in simulation):

- User involvement did not reliably calibrate trust, because plausible plans earn trust even when wrong.
- Involvement raised cognitive load and lowered confidence, and in planning it sometimes harmed good plans.
- Execution-stage involvement gave more consistent benefit than planning-stage involvement.

**Vendor telemetry and experiments (Anthropic; not peer reviewed; the vendor has a stake)**

- March 2026 post: users accepted 93% of prompts. Classifier full-pipeline false positive rate 0.4% (n = 10,000); false negative rate 17% on real overeager actions (n = 52, small).
- August 2026 post: users approve 97% of prompts, but individual permission requests are rejected 3% of the time vs 39% for plan approvals.
- August 2026 experiment (1,053 paid testers, test environment, told they were being evaluated, one prompt replaced by a clearly dangerous command): humans caught 13.6% and the classifier blocked 89%. Humans blocked 6 that the classifier allowed.
- Human block rate fell from about 17% early in a session to about 5% after 50+ prior prompts.
- 25% of interactive sessions started in bypass mode and 49.5% of active CLI users had a manual Bash allow-rule (June 2026). That suggests prompts push people to remove controls altogether.
- February 2026 telemetry: full auto-approve rises from about 20% of sessions (under 50 sessions) to over 40% (by 750 sessions), while interrupt rate rises from about 5% to about 9% of turns. The authors read this as a shift from approving each step to monitoring and intervening. That is their interpretation, not a tested causal claim.
- About 0.8% of API actions appeared irreversible (classified by Claude; 998,481 tool calls). If this generalizes, most actions need no human gate.

Independent commentary: Willison 2026 accepts that prompts are ineffective but doubts the prompt-injection result and wants independent verification.

**Community game**: Wauters 2026 (40,000+ runs, 409,000 decisions, 34% threats, 60 s clock). Misses: destructive 11.7%, persistent mutation 23.8%, exfiltration and code execution 33.4%, scope violations 35.0%. `npm run analyze` was approved 64.7% of the time even though the script was viewable in the log. Safe commands were over-blocked too, for example `rm -rf dist/` at 45%. This suggests people judge how a command looks, not what it does in context.

**Position**: Mitchell, Ghosh and Passi 2026 argue current agent design erodes oversight. No new data as far as the abstract shows. Green 2022 surveyed 41 policies and argues that human-oversight mandates give false assurance and should be justified by evidence.

**Older automation evidence that carries over**

| Finding | Evidence | Citation | Limit |
|---|---|---|---|
| Complacency and automation bias affect experts and novices, and practice, training or instruction do not simply remove them | Strong | Parasuraman and Manzey 2010 [A] | Mostly non-LLM. Goddard et al. 2012 does list training among mitigators |
| Mitigators: accountability, advice position, updated confidence, information rather than recommendation | Moderate | Goddard et al. 2012 [A] | Clinical focus, 74 papers |
| More automation helps routine performance and hurts failure performance and situation awareness, especially past the shift from information analysis to action selection | Moderate, contested | Onnasch et al. 2014 [A]; Jamieson and Skraaning 2020 [A]; Wickens et al. 2020 [A] | Licensed nuclear crews did not show the tradeoff. Wickens disputes that test |
| Passive monitoring harms takeover | Strong | Endsley and Kiris 1995 [A]; Bainbridge 1983 [E] | Bainbridge is argument and classic synthesis, not an experiment |
| Levels of automation vary by function: acquisition, analysis, decision, action | Framework | Parasuraman et al. 2000 [A]; Sheridan and Verplank 1978 [U] | A way to reason, not an outcome result |
| Dynamic confidence display improves calibration and performance | Moderate | McGuirl and Sarter 2006 [A]; Zhang et al. 2020 [A] | Pilots, n = 30. Zhang: calibration alone is not enough without complementary human knowledge |
| Confidence stated in the first person reduces over-reliance | Moderate | Kim et al. 2024 [A] | N = 404, medical questions. Wording matters: general-perspective phrasing effects were weaker |
| Explanations raise acceptance regardless of correctness | Strong-ish | Bansal et al. 2021 [A]; Schemmer et al. 2022 [A]; Fok and Weld 2024 [A] | Vasconcelos et al. 2023 shows they can reduce over-reliance when the task is hard and explanations cheap to use (N = 731) |
| Cognitive forcing reduces over-reliance, but users dislike it most | Moderate | Buçinca et al. 2021 [A] | N = 199. Helps those higher in need for cognition more |
| Human + AI is often worse than the better of the two | Strong | Vaccaro et al. 2024 [A] | g = −0.23. Losses in decisions, gains in content creation. Possible publication bias |
| Transparency improves situation awareness and performance without added workload | Moderate, with limits | van de Merwe et al. 2022 [A]; Mercado et al. 2016 [A]; Skraaning and Jamieson 2021 [A] | 17 experiments. Benefits at component level did not clearly extend to agent-oriented automation in nuclear simulator work |
| Mode errors arise as modes multiply | Strong in aviation | Sarter and Woods 1995 [A] | Direct evidence comes from cockpits |
| Stated and observed accuracy both shape trust | Moderate | Yin et al. 2019 [A]; Kaplan et al. 2023 [A]; Hoff and Bashir 2015 [A]; Hancock et al. 2011 [A] | Performance is the strongest factor. Kaplan notes some predictors have no bearing on actual performance |
| Updating a model can harm team performance if it breaks expectations | Moderate | Bansal et al. 2019 [A] | Announce behavior changes |
| Span of control is bounded by interaction time and situation awareness | Moderate | Olsen and Wood 2004 [A]; Crandall et al. 2005 [A]; Cummings and Mitchell 2008 [A] | Capacity predictions drop by up to 67% once wait times are included, and by 36% even under management by exception. Robots and UAVs, not LLM agents |
| AI assistance can raise false confidence | Moderate | Perry et al. 2023 [A] | Less secure code and more belief in its security |

**Guideline sets**

| Set | What the evidence actually is |
|---|---|
| Microsoft HAX, Amershi et al. 2019 | Consolidated from over 150 recommendations and tested by 49 design practitioners against 20 products. This validates clarity and relevance, not outcomes |
| Li et al. 2023 follow-up | Factorial surveys comparing applied vs violated guidelines. A secondary account reports 1,043 participants, and applied versions perceived better in 16 of 18 experiments [S]. Perceptions from vignettes, not behavior |
| Google PAIR Guidebook | I could not retrieve its evidence statement. Treat as institutional guidance |
| Apple ML HIG | Not retrieved. Treat as institutional guidance |

So these are good checklists, but they do not show that a guideline improves safety or decision quality.

### 3.2 How approval fatigue should shape what requires confirmation

Everything in this subsection is **design inference from the evidence above**. No study has yet tested this full approach as a package.

**Core position.** A confirmation prompt spends scarce attention, and its value depends on how rarely it fires and how well it can be understood. High approval rates are not in themselves proof of failure, since most requests may be fine. The failure is that people miss the rare bad one (Wolfe 2007; vendor experiment; Chen 2026). So design for approval to be rare and meaningful, and do not rely on it as the only safeguard.

**Ladder: use the highest rung that fits.** Adapted from Felt et al. 2012b's mechanism order, in increasing order of attention cost:

| Rung | Mechanism | When | Evidence |
|---|---|---|---|
| 1 | **Do it, log it, offer undo** | Easily reversible or low severity | Felt 2012b; Fleck and Mitroff 2007 (partial); vendor estimate that about 0.8% of actions look irreversible |
| 2 | **Contain it** (sandbox, scoped credentials, dry run, staging) | Agent needs freedom and blast radius can be limited | Reasoned, with vendor and practitioner support; no controlled outcome data found |
| 3 | **Grant through the user's own action** (chooser, explicit selection, edit-before-apply) | The user initiates it, or can adjust its scope | Felt 2012b; Roesner et al. 2012 |
| 4 | **Automated policy or classifier, with fallback to a person** | Many actions, machine-checkable risk | Vendor data; classifier false negatives remain 11% to 17%, and it is still not a substitute for review of high-stakes changes |
| 5 | **Plan or batch review** | Multi-step, where direction matters | Plans rejected 39% vs permission prompts 3% (vendor); batching (Fitz 2019, inference). Plan approval must not authorize later steps (Chen 2026) |
| 6 | **Per-action blocking confirmation** | Irreversible and severe, and the human holds context the system lacks | Egelman 2008; Felt 2012b; Bravo-Lillo 2014 |

**Test before adding a prompt.** Ask all of these. If any answer is no, move the action to another rung.

1. Is the action severe and hard to reverse?
2. Can the reviewer tell a good instance from a bad one using what the prompt shows? (Fok and Weld 2024.)
3. Does the person have knowledge or authority the system lacks? (Zhang 2020; Vaccaro 2024.)
4. Is this the last point at which stopping still prevents the harm? (Chen 2026.)
5. Would a meaningful share of these prompts ever be rejected? (Bliss 1995; Dixon 2007.) Track the rejection rate per prompt type. If nobody ever rejects a type, automate or remove it, or check whether people are not really reviewing.

**What a prompt must contain when it fires**

- The **consequence in plain terms**, not a risk label or raw command: what data goes where, and what cannot be undone (Chen 2026; Wauters 2026).
- **How the agent got here**, in short, and what the approval authorizes (Chen 2026).
- The **exact scope** of approval: this action, this resource, this session (Chen 2026 on "approve similar").
- **Something checkable**: a diff, the resolved script contents, the destination (Fok and Weld 2024; Wauters 2026 on `npm run`).
- For the most severe actions, **forced interaction** with the specific value, such as typing the target's name (Bravo-Lillo 2014). Expect users to dislike it (Buçinca 2021), so ration it.
- Honest uncertainty, in first-person language where that fits, when the agent is unsure (Kim 2024).

**Timing and grouping rules**

- Gate before the irreversible step or before sensitive data is entered, not only at the final submit (Chen 2026).
- Do not ask during a demanding task unless it is time critical. Otherwise offer a negotiated or batched queue (McFarlane 2002; Jenkins 2016).
- Expect decay inside a session. The vendor saw it past 50 prompts, and Vance saw recovery between days. Consider a prompt budget for each session, and escalate on repeated denials rather than asking again (vendor rule: 3 consecutive or 20 total).
- Make "always allow" scoped, visible and renewable, with an easy way to revoke it (Chen 2026).
- Give high-severity prompts a look nothing else uses, so that repetition of routine prompts does not carry over (Anderson 2015; Vance 2018; Felt 2012b notes transfer between similar warnings).

**Metrics to report**

- Prompts per session
- Rejection rate by type
- Time at the decision point
- Seeded-problem catch rate in testing
- Share of sessions in bypass mode (a sign of prompt overload)
- Undo use
- Actions that reached execution and were later found harmful

A/B testing only "user satisfaction" will mislead, because the most protective designs are often liked least (Buçinca 2021), and people feel confident when wrong (Dissanayake 2026).

**What not to conclude**

- Do not conclude that humans should be removed. Humans and classifiers miss different things, and people caught 6 cases the classifier missed.
- Do not conclude classifiers are enough. Their miss rate is real, and that evidence is from the vendor.
- Do not conclude plans solve oversight. They reduce some problems and also reduce runtime scrutiny.
- Do not treat any study here as measuring long-term expert behavior with real stakes. None does.

### 3.3 Activity display and trust calibration

| Rule | Basis | Strength |
|---|---|---|
| Show current state, recent actions and what is pending, with mode always visible | van de Merwe 2022; Sarter and Woods 1995; Anthropic Feb 2026 recommendation | Moderate, with Skraaning's caution about agent-level transparency |
| Show consequences and evidence, not only reasoning | Fok and Weld 2024; Bansal 2021 | Moderate |
| Say what checks did and did not establish, including untested requirements | Dissanayake 2026 (a design implication, not a tested one) | Weak |
| Show case-level confidence that actually tracks accuracy | McGuirl and Sarter 2006; Goddard 2012; Zhang 2020 | Moderate |
| Show a track record for this kind of task, including errors | Yin 2019; Lee and See 2004; Hoff and Bashir 2015 | Moderate |
| Provide a stop and take-over at any point, and make it cheap | Anthropic Feb 2026 (interrupt reasons); Endsley and Kiris 1995 | Moderate |
| Announce agent behavior changes after updates | Bansal 2019 | Moderate |
| In fleets, sort by who needs a human, show how long each has been waiting, and support fast reorientation | Olsen and Wood 2004; Crandall 2005; Cummings and Mitchell 2008 | Moderate, from robotics |
| Mark new changes persistently, and show them instantly with a trace | Durlach 2004; Baudisch 2006 | Moderate |
| Separate alert types, and rank alerts by actionability | Alahmadi 2022; Drew 2014; Bliss 1995 | Moderate |
| Calibrate, do not maximize, trust | Lee and See 2004 | Framework |
| Treat page content the agent reads as a possible attack and a possible manipulation | Ersoy 2025; Tang 2025; Chen 2026 | Moderate |

---

## 4. Use this, not that

Each rule is traceable to the citations listed. "Inference" means the rule extends the evidence beyond what was tested.

| # | Use this | Not that | Source |
|---|---|---|---|
| 1 | "Sub-second response helps routine entry; heuristic bands are 0.1, 1 and 10 s" | "400 ms Doherty threshold" | Doherty and Thadani 1982; Martin and Corl 1986; Miller 1968 |
| 2 | ≤100 ms feedback for direct input, less for dragging | "Anything under 100 ms is instantaneous for everyone" | Forch 2017; Jota 2013 |
| 3 | Design for search and grouping | "Hick's law: remove options" | Liu 2020; Cockburn 2007 |
| 4 | Cut choices when the set is complex, the task hard, preferences unclear | "Too many choices always hurts" | Scheibehenne 2010; Chernev 2015 |
| 5 | Show values, and carry no more than a few items across steps | "Limit nav to 7±2" | Cowan 2001; Cowan 2010 |
| 6 | Enlarge frequent and urgent targets, and distance them from destructive ones | Equal-size controls next to a destructive one | MacKenzie 1992; Parhi 2006 |
| 7 | About 44 to 48 px touch targets, with margin for field use | Lab numbers treated as exact limits | Parhi 2006; Findlater 2017 |
| 8 | Use skeletons to preserve layout | "Skeletons feel faster" | Mejtoft 2018; Viget 2017 |
| 9 | Determinate progress for long operations, avoiding late stalls | Spinner for long waits, or fake progress on outcomes that matter | Myers 1985; Harrison 2007, 2010 |
| 10 | Persistently mark changes on live data | Trust people to see an in-place update | Durlach 2004; Levin 2000; Baudisch 2006 |
| 11 | Keep critical information out of ad-shaped positions | Banner-style placement for critical status | Benway 1998; Resnick and Albert 2014 |
| 12 | Reserve motion for real state change | Flashing or animated emphasis | Burke 2005 |
| 13 | Animate between states of the same data; use small multiples for analysis | Animated trends for analysis | Heer and Robertson 2007; Robertson 2008 |
| 14 | Move related items together | Staggered reveals for tracked elements | Chevalier 2014 |
| 15 | Support reduced motion as accessibility baseline, and label it as standards-based | Quote vestibular prevalence numbers | Section 1.7 |
| 16 | Light mode as a defensible reading default; dark as an offered preference, with larger text | "Dark mode reduces eyestrain" | Buchner 2007; Piepenbrock 2013, 2014a |
| 17 | About 50 to 75 cpl for prose, as comfort | "Optimal line length is proven" | Bailey 2002; Nanavati and Bias 2005 |
| 18 | Allow user font and size control | "The most readable font" or a dyslexia font as a fix | Wallace 2022; Kuster 2018; Wery 2017 |
| 19 | Choose typeface on tone and rendering | Serif vs sans as a readability rule | Arditi and Cho 2005; Beymer 2008 |
| 20 | Prioritize actual usability, then test aesthetics separately | "Beautiful makes it usable" | Hassenzahl and Monk 2010; Tuch 2012 |
| 21 | Say "visual appeal forms quickly" | "Users judge your product in 50 ms" | Lindgaard 2006, 2011 |
| 22 | Match density and color to the audience | One universal complexity level | Reinecke and Gajos 2014 |
| 23 | Validate on blur, then summarize at submit | Validate on keystroke before the user is done | Wroblewski 2009; Bargas-Avila 2007 |
| 24 | Top labels for layout simplicity | "Top labels are proven fastest" | Penzo 2006; Das 2008 |
| 25 | Apply form guidance as a bundle and remove unneeded fields | Credit a single rule with a percentage lift | Seckler 2014; Baymard |
| 26 | Button labels that state the action, and safe-path prominence for risky choices | Generic OK, or EULA-like dialogs | Böhme and Köpsell 2010; Felt 2015 |
| 27 | Symmetric accept and decline paths | Obstruction, hidden information, trick wording | Luguri and Strahilevitz 2021; Nouwens 2020; Ersoy 2025 |
| 28 | Undo for reversible actions, labelled as inference | "Undo is proven better than confirm" | Felt 2012b; Section 1.6 |
| 29 | Blocking confirmation only for rare, severe and irreversible | Confirm everything | Felt 2012b; Egelman 2008; Bravo-Lillo 2014 |
| 30 | Forced interaction with the specific target for top-severity actions | "Are you sure?" on everything | Bravo-Lillo 2014 |
| 31 | Measure prompt rejection and alert precision | Treat prompt count as safety | Bliss 1995; Dixon 2007; Drew 2014 |
| 32 | Assume rare-event misses, and add containment | Instruct people to "pay attention" | Wolfe 2007; Parasuraman and Manzey 2010 |
| 33 | Gate before the harm is locked in | Approval only at final submit | Chen 2026 |
| 34 | Show consequence and scope in the prompt | Raw command plus generic risk label | Chen 2026; Wauters 2026 |
| 35 | Scoped, renewable "always allow" | Unbounded "approve similar" | Chen 2026 |
| 36 | Plan review as direction, with runtime checks still active | Plan approval as authorization | Chen 2026; He 2025 |
| 37 | Give evidence people can verify | Explanations as a trust booster | Fok and Weld 2024; Bansal 2021 |
| 38 | First-person, specific uncertainty, tested with users | Decorative confidence percentages | Kim 2024; McGuirl and Sarter 2006; Zhang 2020 |
| 39 | Measure seeded-error catch rate and outcomes | Rely on user confidence or satisfaction | Dissanayake 2026; Buçinca 2021 |
| 40 | Combine humans and AI where the human adds something distinct | Assume a human in the loop improves results | Vaccaro 2024; Green 2022 |
| 41 | Size fleets by interaction time and reorientation | Assume automation scales supervision linearly | Olsen and Wood 2004; Cummings and Mitchell 2008 |
| 42 | Keep mode visible and modes few | Hidden autonomy states | Sarter and Woods 1995 |
| 43 | Expect small effects from tweaks and test locally | Promise lifts from published nudges | DellaVigna and Linos 2022; Maier 2022 |

---

## 5. Implications for the skill

1. **Reword or remove laws-of-UX folklore.** Doherty, Hick and Miller are often cited wrongly, and the skill should name the correction, since model defaults are likely to repeat them.
2. **Keep craft-judgment labels.** Animation timing, undo over confirm, label position, and line length are defensible but not proven. The scope file requires these to be marked.
3. **`agent-fleet-control` and `incident-console` cases can test this research.** Plausible rubric items: consequence-based prompts, scope displayed in approvals, gates before the risky step, wait-time sort, persistent change marks, prompt rate visible.
4. **Honest UI helps both audiences.** Obstruction and hidden information hurt both humans and agents, which supports the scope's one-principle-set bet. The failure modes differ, though (Tang 2025): humans use shortcuts while agents miss procedural details.
5. **The undo-to-idempotency translation is a sensible mapping but not an evidence-backed one.** I found no study on it.

---

## 6. Conflicts in the evidence

| Topic | Disagreement | Current reading |
|---|---|---|
| Error timing | Bargas-Avila 2007 (end of form best) vs Wroblewski 2009 (on-blur best) | Unresolved; the stronger study favors later feedback. Both oppose premature validation |
| Label position | Penzo vs Das | Left-aligned is weakest; the rest is thin |
| Lumberjack effect | Onnasch 2014 vs Jamieson and Skraaning 2020 vs Wickens 2020 | Open. Tradeoff seems real in labs and is less clear with experts |
| Transparency | van de Merwe 2022 vs Skraaning and Jamieson 2021 | Promising, less certain for agent-level automation |
| Explanations | Bansal 2021 vs Vasconcelos 2023 | Depends on task difficulty and the cost of engaging |
| Habituation | Vance 2018 vs Reeder 2018 | Real, and not the only failure |
| Rare-target correction | Fleck and Mitroff 2007 vs Van Wert 2009 | Helps with response slips, not with perception failures |
| Enhanced error messages | Denny 2014 vs Becker 2016 | Mixed |
| Prompt approval rate | 93% (March) vs 97% (August), same vendor | Different dates and perhaps definitions; do not merge |

---

## 7. References

Links are DOIs unless noted. Bracket tags on the claims show how far each was checked.

### Motor and decision

- Accot, J., & Zhai, S. (1997). Beyond Fitts' law: models for trajectory-based HCI tasks. *CHI '97*, 295-302. https://doi.org/10.1145/258549.258760
- Ahlström, D. (2005). Modeling and improving selection in cascading pull-down menus using Fitts' law, the steering law and force fields. *CHI '05*, 61-70. https://doi.org/10.1145/1054972.1054982
- Bi, X., Li, Y., & Zhai, S. (2013). FFitts law: modeling finger touch with Fitts' law. *CHI '13*, 1363-1372. https://doi.org/10.1145/2470654.2466180
- Card, S. K., Moran, T. P., & Newell, A. (1980). The keystroke-level model for user performance time with interactive systems. *CACM*, 23(7), 396-410. https://doi.org/10.1145/358886.358895
- Chernev, A., Böckenholt, U., & Goodman, J. (2015). Choice overload: A conceptual review and meta-analysis. *Journal of Consumer Psychology*, 25(2), 333-358. https://doi.org/10.1016/j.jcps.2014.08.002
- Cockburn, A., Gutwin, C., & Greenberg, S. (2007). A predictive model of menu performance. *CHI '07*, 627-636. https://doi.org/10.1145/1240624.1240723
- Cockburn, A., Gutwin, C., Scarr, J., & Malacria, S. (2014). Supporting novice to expert transitions in user interfaces. *ACM Computing Surveys*, 47(2), 1-36. https://doi.org/10.1145/2659796
- DellaVigna, S., & Linos, E. (2022). RCTs to scale: comprehensive evidence from two nudge units. *Econometrica*, 90(1), 81-116. https://doi.org/10.3982/ECTA18709
- Findlater, L., Zhang, J., Froehlich, J., & Moffatt, K. (2017). Differences in crowdsourced vs. lab-based mobile and desktop input performance data. *CHI '17*, 6813-6824. https://doi.org/10.1145/3025453.3025820
- Gray, W. D., John, B. E., & Atwood, M. E. (1993). Project Ernestine: validating a GOMS analysis for predicting and explaining real-world task performance. *Human-Computer Interaction*, 8(3), 237-309. https://doi.org/10.1207/s15327051hci0803_3
- Grossman, T., Dragicevic, P., & Balakrishnan, R. (2007). Strategies for accelerating on-line learning of hotkeys. *CHI '07*, 1591-1600. https://doi.org/10.1145/1240624.1240865
- Henze, N., Rukzio, E., & Boll, S. (2011). 100,000,000 taps. *MobileHCI '11*, 133-142. https://doi.org/10.1145/2037373.2037395
- Hick, W. E. (1952). On the rate of gain of information. *QJEP*, 4(1), 11-26. https://doi.org/10.1080/17470215208416600
- Holz, C., & Baudisch, P. (2010). The generalized perceived input point model and how to double touch accuracy by extracting fingerprints. *CHI '10*, 581-590. https://doi.org/10.1145/1753326.1753413
- Hyman, R. (1953). Stimulus information as a determinant of reaction time. *JEP*, 45(3), 188-196. https://doi.org/10.1037/h0056940
- Iyengar, S. S., & Lepper, M. R. (2000). When choice is demotivating. *JPSP*, 79(6), 995-1006. https://doi.org/10.1037/0022-3514.79.6.995
- Jachimowicz, J. M., Duncan, S., Weber, E. U., & Johnson, E. J. (2019). When and why defaults influence decisions. *Behavioural Public Policy*, 3(2), 159-186. https://doi.org/10.1017/bpp.2018.43
- John, B. E., & Kieras, D. E. (1996). The GOMS family of user interface analysis techniques. *TOCHI*, 3(4), 320-351. https://doi.org/10.1145/235833.236054
- Kohavi, R., Deng, A., Longbotham, R., & Xu, Y. (2014). Seven rules of thumb for web site experimenters. *KDD '14*, 1857-1866. https://doi.org/10.1145/2623330.2623341
- Landauer, T. K., & Nachbar, D. W. (1985). Selection from alphabetic and numeric menu trees using a touch screen. *ACM SIGCHI Bulletin*, 16(4), 73-78. https://doi.org/10.1145/1165385.317470
- Lane, D. M., Napier, H. A., Peres, S. C., & Sandor, A. (2005). Hidden costs of graphical user interfaces. *IJHCI*, 18(2), 133-144. https://doi.org/10.1207/s15327590ijhc1802_1
- Larson, K., & Czerwinski, M. (1998). Web page design: implications of memory, structure and scent for information retrieval. *CHI '98*, 25-32. https://doi.org/10.1145/274644.274649
- Liu, W., Gori, J., Rioul, O., Beaudouin-Lafon, M., & Guiard, Y. (2020). How relevant is Hick's law for HCI? *CHI '20*. https://doi.org/10.1145/3313831.3376878
- MacKenzie, I. S. (1992). Fitts' law as a research and design tool in human-computer interaction. *Human-Computer Interaction*, 7(1), 91-139. https://doi.org/10.1207/s15327051hci0701_3
- Maier, M., et al. (2022). No evidence for nudging after adjusting for publication bias. *PNAS*, 119(31). https://doi.org/10.1073/pnas.2200300119
- Mertens, S., Herberz, M., Hahnel, U. J. J., & Brosch, T. (2022). The effectiveness of nudging. *PNAS*, 119(1). https://doi.org/10.1073/pnas.2107346118
- Parhi, P., Karlson, A. K., & Bederson, B. B. (2006). Target size study for one-handed thumb use on small touchscreen devices. *MobileHCI '06*, 203-210. https://doi.org/10.1145/1152215.1152260
- Proctor, R. W., & Schneider, D. W. (2018). Hick's law for choice reaction time: a review. *QJEP*, 71(6), 1281-1299. https://doi.org/10.1080/17470218.2017.1322622
- Scarr, J., Cockburn, A., Gutwin, C., & Quinn, P. (2011). Dips and ceilings. *CHI '11*, 2741-2750. https://doi.org/10.1145/1978942.1979348
- Scheibehenne, B., Greifeneder, R., & Todd, P. M. (2010). Can there ever be too many options? *Journal of Consumer Research*, 37(3), 409-425. https://doi.org/10.1086/651235
- Seow, S. C. (2005). Information theoretic models of HCI. *Human-Computer Interaction*, 20(3), 315-352. https://doi.org/10.1207/s15327051hci2003_3
- Soukoreff, R. W., & MacKenzie, I. S. (2004). Towards a standard for pointing device evaluation. *IJHCS*, 61(6), 751-789. https://doi.org/10.1016/j.ijhcs.2004.09.001
- Walker, N., & Smelcer, J. B. (1990). A comparison of selection time from walking and pull-down menus. *CHI '90*, 221-226. https://doi.org/10.1145/97243.97277

### Timing

- Attig, C., Rauh, N., Franke, T., & Krems, J. F. (2017). System latency guidelines then and now. *HCI International 2017, LNCS*, 3-14. https://doi.org/10.1007/978-3-319-58475-1_1
- Card, S. K., Robertson, G. G., & Mackinlay, J. D. (1991). The information visualizer, an information workspace. *CHI '91*, 181-186. https://doi.org/10.1145/108844.108874
- Dabrowski, J., & Munson, E. V. (2011). 40 years of searching for the best computer system response time. *Interacting with Computers*, 23(5), 555-564. https://doi.org/10.1016/j.intcom.2011.05.008
- Deber, J., Jota, R., Forlines, C., & Wigdor, D. (2015). How much faster is fast enough? *CHI '15*, 1827-1836. https://doi.org/10.1145/2702123.2702300
- Doherty, W. J., & Thadani, A. J. (1982). The economic value of rapid response time. IBM. Transcription checked: https://jlelliotton.blogspot.com/p/the-economic-value-of-rapid-response.html. The original scan was not seen, and no journal record was found through Crossref.
- Forch, V., Franke, T., Rauh, N., & Krems, J. F. (2017). Are 100 ms fast enough? *LNCS*, 45-56. https://doi.org/10.1007/978-3-319-58475-1_4
- Galletta, D. F., Henry, R., McCoy, S., & Polak, P. (2004). Web site delays: how tolerant are users? *JAIS*, 5(1), 1-28. https://doi.org/10.17705/1jais.00044
- Harrison, C., Amento, B., Kuznetsov, S., & Bell, R. (2007). Rethinking the progress bar. *UIST '07*, 115-118. https://doi.org/10.1145/1294211.1294231
- Harrison, C., Yeo, Z., & Hudson, S. E. (2010). Faster progress bars. *CHI '10*, 1545-1548. https://doi.org/10.1145/1753326.1753556
- Jota, R., Ng, A., Dietz, P., & Wigdor, D. (2013). How fast is fast enough? *CHI '13*, 2291-2300. https://doi.org/10.1145/2470654.2481317
- Kaaresoja, T., Brewster, S., & Lantz, V. (2014). Towards the temporally perfect virtual button. *TAP*, 11(2), 1-25. https://doi.org/10.1145/2611387
- Lambert, G. N. (1984). A comparative study of system response time on program developer productivity. *IBM Systems Journal*, 23(1), 36-43. https://doi.org/10.1147/sj.231.0036
- Laws of UX. Doherty Threshold. https://lawsofux.com/doherty-threshold/
- Martin, G. L., & Corl, K. G. (1986). System response time effects on user productivity. *Behaviour & IT*, 5(1), 3-13. https://doi.org/10.1080/01449298608914494
- Mejtoft, T., Långström, A., & Söderström, U. (2018). The effect of skeleton screens. *ECCE '18*, 1-4. https://doi.org/10.1145/3232078.3232086
- Miller, R. B. (1968). Response time in man-computer conversational transactions. *AFIPS Fall Joint Computer Conference*, 267-277. https://doi.org/10.1145/1476589.1476628
- Myers, B. A. (1985). The importance of percent-done progress indicators for computer-human interfaces. *ACM SIGCHI Bulletin*, 16(4), 11-17. https://doi.org/10.1145/1165385.317459
- Nielsen, J. (1993, updated 2014). Response Times: The 3 Important Limits. https://www.nngroup.com/articles/response-times-3-important-limits/
- NN/g. Skeleton Screens. https://www.nngroup.com/articles/skeleton-screens/
- NN/g. The 3-Click Rule for Navigation Is False. https://www.nngroup.com/articles/3-click-rule/ (Source for Porter, J. (2003), Testing the Three-Click Rule, UIE, which I did not read directly.)
- Drexel University (2018). Determining the optimum duration of user interface animation (master's thesis, 25 participants; search snippet only). https://researchdiscovery.drexel.edu/esploro/outputs/graduate/991014632266904721
- Shneiderman, B. (1984). Response time and display rate in human performance with computers. *ACM Computing Surveys*, 16(3), 265-285. https://doi.org/10.1145/2514.2517
- Thadhani, A. J. (1981). Interactive user productivity. *IBM Systems Journal*, 20(4), 407-423. https://doi.org/10.1147/sj.204.0407
- van Nimwegen, C., & van Rijn, K. (2022). Time swipes when you're having fun. *Behaviour & IT*, 42(3), 307-315. https://doi.org/10.1080/0144929X.2022.2155576
- Viget (2017). A Bone to Pick with Skeleton Screens. https://www.viget.com/articles/a-bone-to-pick-with-skeleton-screens/
- web.dev (2020). Defining the Core Web Vitals metrics thresholds. https://web.dev/articles/defining-core-web-vitals-thresholds
- Web Performance Calendar (2018). Magic numbers. https://calendar.perfplanet.com/2018/magic-numbers/

### Memory and attention

- Benway, J. P. (1998). Banner blindness. *HFES Annual Meeting*, 42(5), 463-467. https://doi.org/10.1177/154193129804200504
- Bradbury, N. A. (2016). Attention span during lectures. *Advances in Physiology Education*, 40(4), 509-513. https://doi.org/10.1152/advan.00109.2016
- Burke, M., Hornof, A., Nilsen, E., & Gorman, N. (2005). High-cost banner blindness. *TOCHI*, 12(4), 423-445. https://doi.org/10.1145/1121112.1121116
- Cowan, N. (2001). The magical number 4 in short-term memory. *BBS*, 24(1), 87-114. https://doi.org/10.1017/S0140525X01003922
- Cowan, N. (2010). The magical mystery four. *Current Directions in Psychological Science*, 19(1), 51-57. https://doi.org/10.1177/0963721409359277
- de Jong, T. (2010). Cognitive load theory, educational research, and instructional design. *Instructional Science*, 38(2), 105-134. https://doi.org/10.1007/s11251-009-9110-0
- Durlach, P. J. (2004). Change blindness and its implications for complex monitoring and control systems design and operator training. *Human-Computer Interaction*, 19(4), 423-451. https://doi.org/10.1207/s15327051hci1904_10
- Fitz, N., et al. (2019). Batching smartphone notifications can improve well-being. *Computers in Human Behavior*, 101, 84-94. https://doi.org/10.1016/j.chb.2019.07.016
- Gray, W. D., & Fu, W.-T. (2004). Soft constraints in interactive behavior. *Cognitive Science*, 28(3), 359-382. https://doi.org/10.1207/s15516709cog2803_3
- Hervet, G., Guérard, K., Tremblay, S., & Chtourou, M. S. (2011). Is banner blindness genuine? *Applied Cognitive Psychology*, 25(5), 708-716. https://doi.org/10.1002/acp.1742
- Hollender, N., Hofmann, C., Deneke, M., & Schmitz, B. (2010). Integrating cognitive load theory and concepts of human-computer interaction. *Computers in Human Behavior*, 26(6), 1278-1288. https://doi.org/10.1016/j.chb.2010.05.031
- Iqbal, S. T., & Horvitz, E. (2007). Disruption and recovery of computing tasks. *CHI '07*, 677-686. https://doi.org/10.1145/1240624.1240730
- Levin, D. T., Momen, N., Drivdahl, S. B., & Simons, D. J. (2000). Change blindness blindness. *Visual Cognition*, 7(1-3), 397-412. https://doi.org/10.1080/135062800394865
- Mark, G., Gudith, D., & Klocke, U. (2008). The cost of interrupted work. *CHI '08*, 107-110. https://doi.org/10.1145/1357054.1357072
- Mathy, F., & Feldman, J. (2012). What's magic about magic numbers? *Cognition*, 122(3), 346-362. https://doi.org/10.1016/j.cognition.2011.11.003
- McFarlane, D. C. (2002). Comparison of four primary methods for coordinating the interruption of people in HCI. *Human-Computer Interaction*, 17(1), 63-139. https://doi.org/10.1207/S15327051HCI1701_2
- MeasuringU. Five HCI laws for user experience design. https://measuringu.com/?p=156
- Miller, G. A. (1956). The magical number seven, plus or minus two. *Psychological Review*, 63(2), 81-97. https://doi.org/10.1037/h0043158
- Oviatt, S. (2006). Human-centered design meets cognitive load theory. *ACM Multimedia '06*, 871-880. https://doi.org/10.1145/1180639.1180831
- Resnick, M., & Albert, W. (2014). The impact of advertising location and user task on the emergence of banner ad blindness. *IJHCI*, 30(3), 206-219. https://doi.org/10.1080/10447318.2013.847762
- Simons, D. J., & Chabris, C. F. (1999). Gorillas in our midst. *Perception*, 28(9), 1059-1074. https://doi.org/10.1068/p2952
- Simons, D. J., & Levin, D. T. (1997). Change blindness. *Trends in Cognitive Sciences*, 1(7), 261-267. https://doi.org/10.1016/S1364-6613(97)01080-2
- Sweller, J. (1988). Cognitive load during problem solving. *Cognitive Science*, 12(2), 257-285. https://doi.org/10.1207/s15516709cog1202_4
- Varakin, D. A., Levin, D. T., & Fidler, R. (2004). Unseen and unaware. *Human-Computer Interaction*, 19(4), 389-422. https://doi.org/10.1207/s15327051hci1904_9

### Visual

- Aleman, A. C., Wang, M., & Schaeffel, F. (2018). Reading and myopia: contrast polarity matters. *Scientific Reports*, 8(1). https://doi.org/10.1038/s41598-018-28904-x
- Arditi, A., & Cho, J. (2005). Serifs and font legibility. *Vision Research*, 45(23), 2926-2933. https://doi.org/10.1016/j.visres.2005.06.013
- Bailey, B. (2002). Optimal line length. Human Factors International. https://www.humanfactors.com/newsletters/optimal_line_length.asp
- Bateman, S., et al. (2010). Useful junk? *CHI '10*, 2573-2582. https://doi.org/10.1145/1753326.1753716
- Bernard, M., Liao, C. H., & Mills, M. (2001). The effects of font type and size on the legibility and reading time of online text by older adults. *CHI EA '01*, 175-176. https://doi.org/10.1145/634067.634173
- Beymer, D., Russell, D., & Orton, P. (2008). An eye tracking study of how font size and type influence online reading. *BCS HCI*. https://doi.org/10.14236/ewic/hci2008.23
- Buchner, A., & Baumgartner, N. (2007). Text-background polarity affects performance irrespective of ambient illumination and colour contrast. *Ergonomics*, 50(7), 1036-1063. https://doi.org/10.1080/00140130701306413
- Burmistrov, I., et al. (2015). Flat design vs traditional design. *INTERACT, LNCS*, 106-114. https://doi.org/10.1007/978-3-319-22668-2_10
- Cleveland, W. S., & McGill, R. (1984). Graphical perception. *JASA*, 79(387), 531-554. https://doi.org/10.1080/01621459.1984.10478080
- Dobres, J., Chahine, N., & Reimer, B. (2017). Effects of ambient illumination, contrast polarity, and letter size on text legibility under glance-like reading. *Applied Ergonomics*, 60, 68-73. https://doi.org/10.1016/j.apergo.2016.11.001
- Dyson, M. C., & Haselgrove, M. (2001). The influence of reading speed and line length on the effectiveness of reading from screen. *IJHCS*, 54(4), 585-612. https://doi.org/10.1006/ijhc.2001.0458
- Elliot, A. J., & Maier, M. A. (2014). Color psychology. *Annual Review of Psychology*, 65, 95-120. https://doi.org/10.1146/annurev-psych-010213-115035
- Gnambs, T. (2020). Limited evidence for the effect of red color on cognitive performance. *Psychonomic Bulletin & Review*, 27(6), 1374-1382. https://doi.org/10.3758/s13423-020-01772-1
- Hassenzahl, M. (2004). The interplay of beauty, goodness, and usability in interactive products. *Human-Computer Interaction*, 19(4), 319-349. https://doi.org/10.1207/s15327051hci1904_2
- Hassenzahl, M., & Monk, A. (2010). The inference of perceived usability from beauty. *Human-Computer Interaction*, 25(3), 235-260. https://doi.org/10.1080/07370024.2010.500139
- Heer, J., & Bostock, M. (2010). Crowdsourcing graphical perception. *CHI '10*, 203-212. https://doi.org/10.1145/1753326.1753357
- Kurosu, M., & Kashimura, K. (1995). Apparent usability vs. inherent usability. *CHI '95 companion*, 292-293. https://doi.org/10.1145/223355.223680
- Kuster, S. M., et al. (2018). Dyslexie font does not benefit reading in children with or without dyslexia. *Annals of Dyslexia*, 68(1), 25-42. https://doi.org/10.1007/s11881-017-0154-6
- Legge, G. E., & Bigelow, C. A. (2011). Does print size matter for reading? *Journal of Vision*, 11(5), 8. https://doi.org/10.1167/11.5.8
- Lindgaard, G., Fernandes, G., Dudek, C., & Brown, J. (2006). Attention web designers. *Behaviour & IT*, 25(2), 115-126. https://doi.org/10.1080/01449290500330448
- Lindgaard, G., Dudek, C., Sen, D., Sumegi, L., & Noonan, P. (2011). An exploration of relations between visual appeal, trustworthiness and perceived usability of homepages. *TOCHI*, 18(1), 1-30. https://doi.org/10.1145/1959022.1959023
- Ling, J., & van Schaik, P. (2006). The influence of font type and line length on visual search and information retrieval in web pages. *IJHCS*, 64(5), 395-404. https://doi.org/10.1016/j.ijhcs.2005.08.015
- Markowsky, G. (1992). Misconceptions about the golden ratio. *College Mathematics Journal*, 23(1), 2-19. https://doi.org/10.1080/07468342.1992.11973428
- Meyer, A., et al. (2015). Disfluent fonts don't help people solve math problems. *JEP: General*, 144(2), e16-e30. https://doi.org/10.1037/xge0000049
- Nanavati, A. A., & Bias, R. G. (2005). Optimal line length in reading: a literature review. *Visible Language*, 39(2). https://journals.uc.edu/index.php/vl/article/view/5765
- Palmer, S. E. (1992). Common region. *Cognitive Psychology*, 24(3), 436-447. https://doi.org/10.1016/0010-0285(92)90014-S
- Piepenbrock, C., Mayr, S., Mund, I., & Buchner, A. (2013). Positive display polarity is advantageous for both younger and older adults. *Ergonomics*, 56(7), 1116-1124. https://doi.org/10.1080/00140139.2013.790485
- Piepenbrock, C., Mayr, S., & Buchner, A. (2014a). Positive display polarity is particularly advantageous for small character sizes. *Human Factors*, 56(5), 942-951. https://doi.org/10.1177/0018720813515509
- Piepenbrock, C., Mayr, S., & Buchner, A. (2014b). Smaller pupil size and better proofreading performance with positive than with negative polarity displays. *Ergonomics*, 57(11), 1670-1677. https://doi.org/10.1080/00140139.2014.948496
- Reinecke, K., et al. (2013). Predicting users' first impressions of website aesthetics. *CHI '13*, 2049-2058. https://doi.org/10.1145/2470654.2481281
- Reinecke, K., & Gajos, K. Z. (2014). Quantifying visual preferences around the world. *CHI '14*, 11-20. https://doi.org/10.1145/2556288.2557052
- Rello, L., Pielot, M., & Marcos, M.-C. (2016). Make it big! *CHI '16*, 3637-3648. https://doi.org/10.1145/2858036.2858204
- Schneps, M. H., et al. (2013). Shorter lines facilitate reading in those who struggle. *PLoS ONE*, 8(8), e71161. https://doi.org/10.1371/journal.pone.0071161
- Sonderegger, A., & Sauer, J. (2010). The influence of design aesthetics in usability testing. *Applied Ergonomics*, 41(3), 403-410. https://doi.org/10.1016/j.apergo.2009.09.002
- Tractinsky, N., Katz, A. S., & Ikar, D. (2000). What is beautiful is usable. *Interacting with Computers*, 13(2), 127-145. https://doi.org/10.1016/S0953-5438(00)00031-X
- Tuch, A. N., Roth, S. P., Hornbæk, K., Opwis, K., & Bargas-Avila, J. A. (2012). Is beautiful really usable? *Computers in Human Behavior*, 28(5), 1596-1607. https://doi.org/10.1016/j.chb.2012.03.024
- Wagemans, J., et al. (2012). A century of Gestalt psychology in visual perception: I. *Psychological Bulletin*, 138(6), 1172-1217. https://doi.org/10.1037/a0029333
- Wallace, S., et al. (2022). Towards individuated reading experiences. *TOCHI*, 29(4), 1-56. https://doi.org/10.1145/3502222
- Wery, J. J., & Diliberto, J. A. (2017). The effect of a specialized dyslexia font, OpenDyslexic, on reading rate and accuracy. *Annals of Dyslexia*, 67(2), 114-127. https://doi.org/10.1007/s11881-016-0127-1

### Forms and errors

- Barik, T., et al. (2017). Do developers read compiler error messages? *ICSE '17*, 575-585. https://doi.org/10.1109/ICSE.2017.59
- Bargas-Avila, J. A., et al. (2007). Usable error message presentation in the World Wide Web. *Interacting with Computers*, 19(3), 330-341. https://doi.org/10.1016/j.intcom.2007.01.003
- Baymard Institute (last updated 2025). Cart abandonment rate statistics. https://baymard.com/lists/cart-abandonment-rate
- Becker, B. A., et al. (2016). Effective compiler error message enhancement for novice programming students. *Computer Science Education*, 26(2-3), 148-175. https://doi.org/10.1080/08993408.2016.1225464
- Das, S., McEwan, T., & Douglas, D. (2008). Using eye-tracking to evaluate label alignment in online forms. *NordiCHI '08*, 451-454. https://doi.org/10.1145/1463160.1463217
- Denny, P., Luxton-Reilly, A., & Carpenter, D. (2014). Enhancing syntax error messages appears ineffectual. *ITiCSE '14*, 273-278. https://doi.org/10.1145/2591708.2591748
- Jarrett, C. (2010). Label placement on forms (conference slides). https://www.effortmark.co.uk/wp-content/uploads/2010/04/Label-placement-on-forms-STC-Seattle-2010.pdf
- Penzo, M. (2006). Label placement in forms. *UXmatters*. https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php
- Seckler, M., et al. (2014). Designing usable web forms. *CHI '14*, 1275-1284. https://doi.org/10.1145/2556288.2557265
- Shneiderman, B. (1982). Designing computer system messages. *CACM*, 25(9), 610-611. https://doi.org/10.1145/358628.358639
- Wroblewski, L. (2009). Inline validation in web forms. *A List Apart*. https://alistapart.com/article/inline-validation-in-web-forms/

### Warnings, alarms, undo

- Akers, D., et al. (2009). Undo and erase events as indicators of usability problems. *CHI '09*, 659-668. https://doi.org/10.1145/1518701.1518804
- Akhawe, D., & Felt, A. P. (2013). Alice in Warningland. *USENIX Security '13*, 257-272. https://www.usenix.org/conference/usenixsecurity13/technical-sessions/presentation/akhawe
- Alahmadi, B. A., Axon, L., & Martinovic, I. (2022). 99% false positives. *USENIX Security '22*, 2783-2800. https://www.usenix.org/conference/usenixsecurity22/presentation/alahmadi
- Ancker, J. S., et al. (2017). Effects of workload, work complexity, and repeated alerts on alert fatigue. *BMC Med Inform Decis Mak*, 17(1). https://doi.org/10.1186/s12911-017-0430-8
- Anderson, B. B., et al. (2015). How polymorphic warnings reduce habituation in the brain. *CHI '15*, 2883-2892. https://doi.org/10.1145/2702123.2702322
- Bliss, J. P., Gilson, R. D., & Deaton, J. E. (1995). Human probability matching behaviour in response to alarms of varying reliability. *Ergonomics*, 38(11), 2300-2312. https://doi.org/10.1080/00140139508925269
- Böhme, R., & Köpsell, S. (2010). Trained to accept? *CHI '10*, 2403-2406. https://doi.org/10.1145/1753326.1753689
- Bravo-Lillo, C., et al. (2013). Your attention please. *SOUPS '13*, 1-12. https://doi.org/10.1145/2501604.2501610
- Bravo-Lillo, C., Cranor, L., Komanduri, S., Schechter, S., & Sleeper, M. (2014). Harder to ignore? *SOUPS '14*, 105-111. https://www.usenix.org/conference/soups2014/proceedings/presentation/bravo-lillo
- Dixon, S. R., Wickens, C. D., & McCarley, J. S. (2007). On the independence of compliance and reliance. *Human Factors*, 49(4), 564-572. https://doi.org/10.1518/001872007X215656
- Drew, B. J., et al. (2014). Insights into the problem of alarm fatigue with physiologic monitor devices. *PLoS ONE*, 9(10), e110274. https://doi.org/10.1371/journal.pone.0110274
- Egelman, S., Cranor, L. F., & Hong, J. (2008). You've been warned. *CHI '08*, 1065-1074. https://doi.org/10.1145/1357054.1357219
- Felt, A. P., et al. (2012a). Android permissions. *SOUPS '12*, 1-14. https://doi.org/10.1145/2335356.2335360
- Felt, A. P., Egelman, S., Finifter, M., Akhawe, D., & Wagner, D. (2012b). How to ask for permission. *HotSec '12*. https://www.usenix.org/conference/hotsec12/workshop-program/presentation/felt
- Felt, A. P., et al. (2015). Improving SSL warnings. *CHI '15*, 2893-2902. https://doi.org/10.1145/2702123.2702442
- Fleck, M. S., & Mitroff, S. R. (2007). Rare targets are rarely missed in correctable search. *Psychological Science*, 18(11), 943-947. https://doi.org/10.1111/j.1467-9280.2007.02006.x
- Jenkins, J. L., et al. (2016). More harm than good? *Information Systems Research*, 27(4), 880-896. https://doi.org/10.1287/isre.2016.0644
- Mitroff, S. R., & Biggs, A. T. (2014). The ultra-rare-item effect. *Psychological Science*, 25(1), 284-289. https://doi.org/10.1177/0956797613504221
- Raskin, J. (2000). *The Humane Interface*. Addison-Wesley. (From recollection, not re-read.)
- Reeder, R. W., et al. (2018). An experience sampling study of user reactions to browser warnings in the field. *CHI '18*, 1-13. https://doi.org/10.1145/3173574.3174086
- Roesner, F., et al. (2012). User-driven access control. *IEEE S&P '12*, 224-238. https://doi.org/10.1109/SP.2012.24
- van der Sijs, H., Aarts, J., Vulto, A., & Berg, M. (2006). Overriding of drug safety alerts in CPOE. *JAMIA*, 13(2), 138-147. https://doi.org/10.1197/jamia.M1809
- Van Wert, M. J., Horowitz, T. S., & Wolfe, J. M. (2009). Even in correctable search, some types of rare targets are frequently missed. *Attention, Perception, & Psychophysics*, 71(3), 541-553. https://doi.org/10.3758/APP.71.3.541
- Vance, A., et al. (2018). Tuning out security warnings. *MIS Quarterly*, 42(2), 355-380. https://doi.org/10.25300/MISQ/2018/14124
- Wickens, C. D., & Dixon, S. R. (2007). The benefits of imperfect diagnostic automation. *TIES*, 8(3), 201-212. https://doi.org/10.1080/14639220500370105
- Wolfe, J. M., Horowitz, T. S., & Kenner, N. M. (2005). Rare items often missed in visual searches. *Nature*, 435, 439-440. https://doi.org/10.1038/435439a
- Wolfe, J. M., et al. (2007). Low target prevalence is a stubborn source of errors in visual search tasks. *JEP: General*, 136(4), 623-638. https://doi.org/10.1037/0096-3445.136.4.623

### Motion

- Baudisch, P., et al. (2006). Phosphor. *UIST '06*, 169-178. https://doi.org/10.1145/1166253.1166280
- Bederson, B. B., & Boltman, A. (2003). Does animation help users build mental maps of spatial information? In *The Craft of Information Visualization*, 87-94. https://doi.org/10.1016/B978-155860915-0/50015-9
- Chevalier, F., Dragicevic, P., & Franconeri, S. (2014). The not-so-staggering effect of staggered animated transitions on visual tracking. *IEEE TVCG*, 20(12), 2241-2250. https://doi.org/10.1109/TVCG.2014.2346424
- Heer, J., & Robertson, G. (2007). Animated transitions in statistical data graphics. *IEEE TVCG*, 13(6), 1240-1247. https://doi.org/10.1109/TVCG.2007.70539
- Robertson, G., et al. (2008). Effectiveness of animation in trend visualization. *IEEE TVCG*, 14(6), 1325-1332. https://doi.org/10.1109/TVCG.2008.125
- Tversky, B., Morrison, J. B., & Betrancourt, M. (2002). Animation: can it facilitate? *IJHCS*, 57(4), 247-262. https://doi.org/10.1006/ijhc.2002.1017

### Dark patterns

- Bongard-Blanchy, K., et al. (2021). "I am definitely manipulated, even when I am aware of it." *DIS '21*, 763-776. https://doi.org/10.1145/3461778.3462086
- DECEPTICON: How dark patterns manipulate web agents (2025). arXiv:2512.22894. https://arxiv.org/abs/2512.22894 (Secondary summary only.)
- Di Geronimo, L., et al. (2020). UI dark patterns and where to find them. *CHI '20*, 1-14. https://doi.org/10.1145/3313831.3376600
- Ersoy, D., et al. (2025). Investigating the impact of dark patterns on LLM-based web agents. Accepted to IEEE S&P 2026. arXiv:2510.18113. https://arxiv.org/abs/2510.18113
- Gray, C. M., et al. (2018). The dark (patterns) side of UX design. *CHI '18*, 1-14. https://doi.org/10.1145/3173574.3174108
- Luguri, J., & Strahilevitz, L. J. (2021). Shining a light on dark patterns. *Journal of Legal Analysis*, 13(1), 43-109. https://doi.org/10.1093/jla/laaa006
- Mathur, A., et al. (2019). Dark patterns at scale. *PACM HCI*, 3(CSCW), 1-32. https://doi.org/10.1145/3359183
- Mathur, A., Kshirsagar, M., & Mayer, J. (2021). What makes a dark pattern... dark? *CHI '21*, 1-18. https://doi.org/10.1145/3411764.3445610
- Nouwens, M., et al. (2020). Dark patterns after the GDPR. *CHI '20*, 1-13. https://doi.org/10.1145/3313831.3376321
- Tang, J., et al. (2025). Dark patterns meet GUI agents. arXiv:2509.10723. https://arxiv.org/abs/2509.10723

### Human-AI and automation

- Amershi, S., et al. (2019). Guidelines for human-AI interaction. *CHI '19*, 1-13. https://doi.org/10.1145/3290605.3300233
- Anthropic (2026, Feb 18). Measuring AI agent autonomy in practice. https://www.anthropic.com/research/measuring-agent-autonomy (Vendor.)
- Anthropic / Hughes, J. (2026, Mar 25). How we built Claude Code auto mode. https://www.anthropic.com/engineering/claude-code-auto-mode (Vendor.)
- Anthropic (2026, Aug 7; updated Oct 22). Auto mode is now the default in Claude Code. https://claude.com/blog/auto-mode-default-in-claude-code (Vendor.)
- Bainbridge, L. (1983). Ironies of automation. *Automatica*, 19(6), 775-779. https://doi.org/10.1016/0005-1098(83)90046-8
- Bansal, G., et al. (2019). Updates in human-AI teams. *AAAI*, 33(01), 2429-2437. https://doi.org/10.1609/aaai.v33i01.33012429
- Bansal, G., et al. (2021). Does the whole exceed its parts? *CHI '21*, 1-16. https://doi.org/10.1145/3411764.3445717
- Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To trust or to think. *PACM HCI*, 5(CSCW1), 1-21. https://doi.org/10.1145/3449287
- Chen, C., et al. (2026). Comparing human oversight strategies for computer-use agents. arXiv:2604.04918. https://arxiv.org/abs/2604.04918
- Crandall, J. W., et al. (2005). Validating human-robot interaction schemes in multitasking environments. *IEEE TSMC-A*, 35(4), 438-449. https://doi.org/10.1109/TSMCA.2005.850587
- Cummings, M. L., & Mitchell, P. J. (2008). Predicting controller capacity in supervisory control of multiple UAVs. *IEEE TSMC-A*, 38(2), 451-460. https://doi.org/10.1109/TSMCA.2007.914757
- Dissanayake, D., et al. (2026). Looks fine to me: understanding oversight in agentic interactions. arXiv:2610.27801. https://arxiv.org/abs/2610.27801
- Endsley, M. R., & Kiris, E. O. (1995). The out-of-the-loop performance problem and level of control in automation. *Human Factors*, 37(2), 381-394. https://doi.org/10.1518/001872095779064555
- Fok, R., & Weld, D. S. (2024). In search of verifiability. *AI Magazine*, 45(3), 317-332. https://doi.org/10.1002/aaai.12182
- Goddard, K., Roudsari, A., & Wyatt, J. C. (2012). Automation bias. *JAMIA*, 19(1), 121-127. https://doi.org/10.1136/amiajnl-2011-000089
- Green, B. (2022). The flaws of policies requiring human oversight of government algorithms. *Computer Law & Security Review*, 45, 105681. https://doi.org/10.1016/j.clsr.2022.105681
- Hancock, P. A., et al. (2011). A meta-analysis of factors affecting trust in human-robot interaction. *Human Factors*, 53(5), 517-527. https://doi.org/10.1177/0018720811417254
- He, G., Demartini, G., & Gadiraju, U. (2025). Plan-then-execute. *CHI '25*, 1-22. https://doi.org/10.1145/3706598.3713218
- Hoff, K. A., & Bashir, M. (2015). Trust in automation. *Human Factors*, 57(3), 407-434. https://doi.org/10.1177/0018720814547570
- Jamieson, G. A., & Skraaning, G. (2020). The absence of degree of automation trade-offs in complex work settings. *Human Factors*, 62(4), 516-529. https://doi.org/10.1177/0018720819842709
- Kaplan, A. D., et al. (2023). Trust in artificial intelligence: meta-analytic findings. *Human Factors*, 65(2), 337-359. https://doi.org/10.1177/00187208211013988
- Kim, S. S. Y., et al. (2024). "I'm not sure, but...". *FAccT '24*, 822-835. https://doi.org/10.1145/3630106.3658941
- Lee, J. D., & See, K. A. (2004). Trust in automation: designing for appropriate reliance. *Human Factors*, 46(1), 50-80. https://doi.org/10.1518/hfes.46.1.50.30392
- Li, T., Vorvoreanu, M., DeBellis, D., & Amershi, S. (2023). Assessing human-AI interaction early through factorial surveys. *TOCHI*, 30(5), 1-45. https://doi.org/10.1145/3511605
- McGuirl, J. M., & Sarter, N. B. (2006). Supporting trust calibration and the effective use of decision aids by presenting dynamic system confidence information. *Human Factors*, 48(4), 656-665. https://doi.org/10.1518/001872006779166334
- Mercado, J. E., et al. (2016). Intelligent agent transparency in human-agent teaming for multi-UxV management. *Human Factors*, 58(3), 401-415. https://doi.org/10.1177/0018720815621206
- Mitchell, M., Ghosh, A., & Passi, S. (2026). AI agents push humans out of the loop. arXiv:2608.23642. https://arxiv.org/abs/2608.23642
- Olsen, D. R., & Wood, S. B. (2004). Fan-out. *CHI '04*, 231-238. https://doi.org/10.1145/985692.985722
- Onnasch, L., Wickens, C. D., Li, H., & Manzey, D. (2014). Human performance consequences of stages and levels of automation. *Human Factors*, 56(3), 476-488. https://doi.org/10.1177/0018720813501549
- Parasuraman, R., & Manzey, D. H. (2010). Complacency and bias in human use of automation. *Human Factors*, 52(3), 381-410. https://doi.org/10.1177/0018720810376055
- Parasuraman, R., Sheridan, T. B., & Wickens, C. D. (2000). A model for types and levels of human interaction with automation. *IEEE TSMC-A*, 30(3), 286-297. https://doi.org/10.1109/3468.844354
- Perry, N., Srivastava, M., Kumar, D., & Boneh, D. (2023). Do users write more insecure code with AI assistants? *CCS '23*, 2785-2799. https://doi.org/10.1145/3576915.3623157
- Sarter, N. B., & Woods, D. D. (1995). How in the world did we ever get into that mode? *Human Factors*, 37(1), 5-19. https://doi.org/10.1518/001872095779049516
- Schemmer, M., et al. (2022). A meta-analysis of the utility of explainable AI in human-AI decision-making. *AIES '22*, 617-626. https://doi.org/10.1145/3514094.3534128
- Sheridan, T. B., & Verplank, W. L. (1978). Human and computer control of undersea teleoperators. MIT technical report. (Not retrieved.)
- Skraaning, G., & Jamieson, G. A. (2021). Human performance benefits of the automation transparency design principle. *Human Factors*, 63(3), 379-401. https://doi.org/10.1177/0018720819887252
- Vaccaro, M., Almaatouq, A., & Malone, T. (2024). When combinations of humans and AI are useful. *Nature Human Behaviour*, 8(12), 2293-2303. https://doi.org/10.1038/s41562-024-02024-1
- van de Merwe, K., Mallam, S., & Nazir, S. (2024). Agent transparency, situation awareness, mental workload, and operator performance. *Human Factors*, 66(1), 180-208. https://doi.org/10.1177/00187208221077804
- Vasconcelos, H., et al. (2023). Explanations can reduce overreliance on AI systems during decision-making. *PACM HCI*, 7(CSCW1), 1-38. https://doi.org/10.1145/3579605
- Wauters, A. (2026). AI agent permissions game statistics. https://scalex.dev/blog/ai-agent-permissions-stats/ (Coverage: *The Register*, 6 Aug 2026.)
- Wickens, C. D., Onnasch, L., Sebok, A., & Manzey, D. (2020). Absence of DOA effect but no proper test of the lumberjack effect. *Human Factors*, 62(4), 530-534. https://doi.org/10.1177/0018720820901957
- Willison, S. (2026, Aug 8). Auto mode. https://simonwillison.net/2026/aug/8/auto-mode
- Yin, M., Wortman Vaughan, J., & Wallach, H. (2019). Understanding the effect of accuracy on trust in machine learning models. *CHI '19*, 1-12. https://doi.org/10.1145/3290605.3300509
- Zhang, Y., Liao, Q. V., & Bellamy, R. K. E. (2020). Effect of confidence and explanation on accuracy and trust calibration in AI-assisted decision making. *FAT* '20*, 295-305. https://doi.org/10.1145/3351095.3372852

---

## 8. Not verified, and worth checking if it matters

- **Doherty and Thadani original.** I searched a transcription, not a scan. Laws of UX says it appeared in the *IBM Systems Journal*, and Crossref found no such record. One other site (ux360.design) independently says 400 ms is absent. Where 400 ms first appeared is unknown.
- **DOIs.** DOIs were taken from Crossref lookups during research. A final bulk re-check of the whole list was rate-limited by Crossref and did not complete, so spot-check any DOI before publishing it.
- **Abstract-level reading.** Most peer-reviewed entries were read at abstract level. Effect sizes beyond the abstracts were not extracted. The two arXiv oversight studies, the Felt HotSec paper and He et al. were read in full text or large part, with some sections truncated.
- **Preprints.** Chen et al. 2026 and Dissanayake et al. 2026 are recent preprints without confirmed peer review.
- **Vendor data.** Anthropic's experiments have not been independently replicated, and the 93% vs 97% gap is unexplained.
- **Dark mode field evidence.** I found no modern long-duration field study. Low-vision benefit is unverified here.
- **Line length.** Dyson and Haselgrove's and Ling and van Schaik's specifics come from secondary accounts or memory. The commonly cited 55 cpl figure was not confirmed. Shaikh 2005 was not found.
- **Burmistrov 2015 and flat design.** The paper exists, but its abstract was unavailable, so I made no claim from it.
- **Google PAIR and Apple ML HIG.** I could not retrieve their evidence statements.
- **Not checked at all:** F-pattern, the fold, hamburger menus, carousels, placeholder-as-label harm, the "23 minutes to recover" interruption figure, one-question-per-page, single vs multi-column forms, and color-button conversion stories. Do not use these as proven until checked.
- **Standards referred to but not re-read here:** WCAG 2.3.3, and the 24 px and 44 px target criteria in WCAG 2.5.8 and 2.5.5.
