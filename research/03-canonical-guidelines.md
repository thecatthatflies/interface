# Canonical interface guidelines: what the trusted human-written sources agree on

Researched 2026-11-02 and 2026-11-03. Digest 01 covers the Macintosh HIG (1992) in depth, so this file only notes where the rest of the canon converges with it.

## How to read this file

**Evidence tiers** follow `SCOPE.md`: E = empirical, I = institutional or standard, P = practitioner.

**Verification marks** say how I checked each source. They matter more than the ranking.

| Mark | Meaning |
|---|---|
| **[R]** | Primary text read: raw page, PDF text or page scan. |
| **[X]** | Primary page read through a fetch tool that returns a summarised extract. Treat exact wording as paraphrase. |
| **[S]** | Only an excerpt, table of contents or secondary summary reached me. Do not quote it as if the book were read. |

**Who wrote what.** Rules and numbers come from the cited source. Every "agent translation", every "decide" line and the "most LLM UI misses this" claims are my judgment and need testing. Quotes are short and attributed. Everything else is paraphrase.

## Bottom line

1. **The canon is far more unanimous on behaviour than on appearance.** Sources spanning 1982 to 2026 agree on undo over confirmation, keeping the user's input, error content, proportional feedback, recognition over recall and rationing interruptions. They disagree on durations, button order, capitalisation and visual style.
2. **Sources rarely conflict over a principle. They conflict over which user and which frequency the principle serves.** Almost every disagreement in section 3 resolves by asking who the user is, how often they do this, and what an error costs.
3. **The underrated source for this project is Smith and Mosier (1986).** It is 944 guidelines written for terminals, with no pointing assumption, so it maps onto CLIs and agents more directly than any modern system. It supplies hooks for needs digest 01 could not source in the Mac HIG: show old and new values before a change, change data only on explicit action, re-enter only the wrong part, and mark the end of a list.
4. **The convention-versus-research gap is real and should be stated.** Several popular "rules" have weak or contested evidence: 66 characters, 7 plus or minus 2, and button order. The skill should mark them as convention.
5. **Humans and agents split in predictable places.** Motion, target size and visual hierarchy have no agent meaning. Their semantic twins do: state, names and order. Section 6 gives the mapping for each principle.

---

## 1. Ranked sources

The rank blends trust, influence and how usable the source is for testable rules. It is my judgment. "Basis" names what the source actually rests on, which is often less than its reputation suggests.

| # | Source | Who, when | Basis | Check | URL |
|---|---|---|---|---|---|
| 1 | WCAG 2.2 | W3C, Rec. 12 Dec 2024 | I, testable criteria, legal force in many places | R/X | https://www.w3.org/TR/WCAG22/ |
| 2 | Nielsen's 10 heuristics | Nielsen and Molich 1990; refined 1994 by factor analysis of 249 problems; reviewed 2024 | E (derived) and P | X | https://www.nngroup.com/articles/ten-usability-heuristics/ |
| 3 | GOV.UK Design System and design principles | UK GDS; principles updated 2 Apr 2025 | I and E (tested on live national services) | X | https://design-system.service.gov.uk/ · https://www.gov.uk/guidance/government-design-principles |
| 4 | Apple HIG (current) | Apple; principles reintroduced 8 Jun 2026 | I (vendor convention, cites little) | X | https://developer.apple.com/design/human-interface-guidelines/ |
| 5 | ARIA Authoring Practices | W3C WAI, living | I | X | https://www.w3.org/WAI/ARIA/apg/ |
| 6 | Shneiderman's 8 Golden Rules | Original list 1985; text from *DTUI* 6th ed., 2016 | P, with a research-led author. He says they need validation per domain | R | https://www.cs.umd.edu/~ben/goldenrules.html |
| 7 | Windows UX Interaction Guidelines | Microsoft, Windows 7 era; marked as not updated since | I and internal research. The best-written reasoning of any vendor guide | R | https://learn.microsoft.com/en-us/windows/win32/uxguide/guidelines |
| 8 | Research-Based Web Design & Usability Guidelines | US HHS with GSA, 2006; 209 guidelines | E. The only major guide rating each rule on evidence (1-5) and importance (1-5). Dated | R | https://www.govinfo.gov/app/details/GOVPUB-HE-PURL-LPS73842 |
| 9 | Guidelines for Designing User Interface Software | Smith and Mosier, MITRE, ESD-TR-86-278, Aug 1986; 944 guidelines | I. The authors admit all guidelines rest on judgment and that a citation is not proof | R/X | https://hcibib.org/sam/ |
| 10 | Material Design 3 (and M2 where still published) | Google, living | I, some internal research | R | https://m3.material.io/ · https://m2.material.io/ |
| 11 | Norman, *The Design of Everyday Things* | 1988; revised 2013 | P, from cognitive science | S (own site and preface only) | https://jnd.org/books/the-design-of-everyday-things-revised-and-expanded-edition/ |
| 12 | Tognazzini, First Principles of Interaction Design | Revised web edition | P, some cited studies | X | https://asktog.com/atc/principles-of-interaction-design/ |
| 13 | IBM Carbon | IBM, living | I | X | https://carbondesignsystem.com/ |
| 14 | GitHub Primer | GitHub, living | I, with rare candour on what fails | X | https://primer.style/ |
| 15 | USWDS | US GSA; principles updated 21 Feb 2025 | I, publishes accessibility test results | X | https://designsystem.digital.gov/ |
| 16 | Xerox Star principles | Smith, Irby, Kimball, Verplank, Harslem, *BYTE*, Apr 1982 | P, with user testing behind the product | X (reprint) | https://www.guidebookgallery.org/articles/designingthestaruserinterface |
| 17 | Apple Human Interface Guidelines | Apple, 1987 | I. Ancestor of digest 01 | R | https://andymatuschak.org/files/papers/Apple%20Human%20Interface%20Guidelines%201987.pdf |
| 18 | Few, dashboard and colour writing | Stephen Few, 2004 to 2014 | P, drawing on perception research | R (colour) / S (definition) | https://www.perceptualedge.com/articles/ie/dashboard_confusion.pdf |
| 19 | Graphical perception | Cleveland and McGill 1984, replicated by Heer and Bostock, CHI 2010 | E | R (Heer) | https://homes.cs.washington.edu/~jheer/files/2010-MTurk-CHI.pdf |
| 20 | Alarm management: EEMUA 191, ISA-18.2, IEC 62682 | Process industries | I, born from incident investigations | S (IChemE/ABB slides, not the standards) | https://www.icheme.org/media/16019/icheme-alarm-management-practical-guide-06_05_2021.pdf |
| 21 | UK Government Analysis Function chart guidance | ONS-based team, 2022 and later | I | X | https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/ |
| 22 | Grudin, The Case Against User Interface Consistency | *CACM*, Oct 1989 | E and analysis | R (pp. 2-3 only) | https://cacm.acm.org/research/the-case-against-user-interface-consistency/ |
| 23 | Web Vitals and RAIL | Google | I and E (RAIL is older guidance) | X | https://web.dev/articles/vitals · https://web.dev/articles/rail |
| 24 | Vercel Web Interface Guidelines | Vercel, undated | P. Very concrete, no evidence given | X | https://vercel.com/design/guidelines |
| 25 | GNOME HIG | GNOME, living | I, open source | X | https://developer.gnome.org/hig/ |
| 26 | KDE HIG | KDE, living | I, open source | X | https://develop.kde.org/hig/ |
| 27 | NeXTSTEP User Interface Guidelines | NeXT, Release 3, 1990-92 (printed 1993) | I | R | https://www.mirrorservice.org/sites/www.bitsavers.org/pdf/next/Release_3_Nov93/NeXTSTEP_User_Interface_Guidelines_Release_3_Nov93.pdf |
| 28 | Zen of Palm | Palm, 2001; PalmSource revision 13 Jun 2003 | P, shipped product experience | R | https://archive.org/download/zen-of-palm/zenofpalm.pdf |
| 29 | Butterick, *Practical Typography* | Matthew Butterick, living | P | X | https://practicaltypography.com/ |
| 30 | Bringhurst, *Elements of Typographic Style* | Bringhurst; web adaptation by Richard Rutter | P, print tradition | S (quoted at Rutter's site) | https://webtypography.net/2.1.2 |
| 31 | Salesforce Lightning principles | JD Vogt, 4 Feb 2016 | I. Notable for ranking its principles | X | https://medium.com/salesforce-ux/b647b68fb057 |
| 32 | Raskin, *The Humane Interface* | Raskin, 2000 | P, quantified arguments | S (third-party Raskin Center summary) | https://www.raskincenter.org/rchi/core-principles |
| 33 | Krug, *Don't Make Me Think* | Krug, 2000; Revisited 2014 | P | S (publisher excerpt, TOC) | https://www.pearson.com/en-au/media/zollwzef/9780321965516.pdf |
| 34 | Refactoring UI | Wathan and Schoger, 2018 | P | S (their article and TOC) | https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886 · https://refactoringui.com/ |
| 35 | Rauno Freiberg, Web Interface Guidelines | Rauno Freiberg | P | X | https://interfaces.rauno.me/ |
| 36 | Emil Kowalski, animation essays | Emil Kowalski | P | X | https://emilkowal.ski/ui/great-animations · https://emilkowal.ski/ui/you-dont-need-animations |
| 37 | Atlassian, Polaris | Atlassian; Shopify | I | X / S | https://atlassian.design/ · https://polaris.shopify.com/ |
| 38 | Laws of UX | Popularisation; states no sources on the home page | Secondary, cite the originals instead | X | https://lawsofux.com/ |
| 39 | Linear and Stripe writing | Saarinen 2024-25; Koopersmith and Miner 2019; Leach 2017 | P. Linear is opinion. Stripe's posts are concrete engineering | X | https://linear.app/now/why-is-quality-so-rare · https://stripe.com/blog/accessible-color-systems · https://stripe.com/blog/idempotency |
| 40 | Inclusive Design Principles; NHS principles; ISO 9241-110:2020 | Swan, Pouncey, Pickering, Watson; NHS; ISO (paywalled, principle names only) | P / I / I | X / X / S | https://inclusivedesignprinciples.info/ · https://service-manual.nhs.uk/design-system/design-principles · https://www.iso.org/standard/75258.html |

**Asked for but not properly reached.** Do not cite these for specifics until someone reads them.

- **Cooper, *About Face*:** bibliographic facts only. I could not verify the "excise" wording or the quotes commonly attributed to it.
- **Tidwell, *Designing Interfaces*:** pattern names only, such as Safe Exploration and Deferred Choices. I ignored a pirated PDF that appeared in search results.
- **IBM CUA and OS/2:** document lists only. The copies I tried were dead links.
- **Sun Java Look and Feel:** the book exists (1999, 2nd ed. 2001). One review calls it a component reference rather than a principles text. The hosted PDF did not download.
- **Gerhardt-Powals' cognitive engineering principles (1996):** named by a study deck only. Her 1993 dissertation is open access at Drexel and worth a later read.
- **BBC GEL:** fetching was blocked.

---

## 2. Convergence map

This is the strongest signal in the file. The traditions I count are:

- **86:** Smith and Mosier, written for terminals and defence systems
- **Desk:** Star, Apple, NeXT, Microsoft
- **OSS:** GNOME, KDE
- **Gov:** GOV.UK, USWDS, NHS, HHS
- **DS:** Carbon, Primer, Polaris, Atlassian, Lightning, Material
- **HCI:** Nielsen, Shneiderman, Norman, Tog, Raskin, Krug
- **Prac:** Vercel, Rauno, Kowalski
- **Std:** WCAG, APG, ISO

**A caution on independence.** These traditions are not fully independent. Apple descends from Star. Shneiderman wrote a foreword to HHS. Practitioner lists share an audience and overlap. Convergence across a 40-year span and across the terminal, GUI and web eras is still hard to explain by copying alone.

### Very strong: at least six traditions

**C1. Make errors impossible, then make them undoable, and confirm only what remains.**
Order of preference: prevent, then undo, then confirm. Confirm only actions that are consequential, rare, and irreversible or unexpected.
- 86: UNDO for preceding actions (6.0/21), and a separate second-step confirm for destructive entries (6.0/18-20).
- Desk: Windows treats a confirmation need as a possible design flaw, and lists prevent, undo, feedback, assume-and-allow-change, or remove the choice as alternatives. Apple does not alert on common undoable actions, even destructive ones, and does not warn when loss is the expected result.
- OSS: GNOME prefers undo because people click through confirmations.
- HCI: Shneiderman rules 5 and 6; Nielsen heuristics 3 and 5; Tog says undo removes the need for dialogs that slow everyone; Raskin; NN/g 2018.
- Prac: Vercel, with undo or confirm as alternatives.
- Std: WCAG 3.3.4 requires reversible, checked or confirmed for legal, financial and data-changing submissions.
- Mac HIG: Forgiveness (digest 01 §1.8).

**C2. Confirmations lose force with use.**
People learn to dismiss what they see often, so frequent confirmation offers little protection. Windows, GNOME, NN/g, Raskin and Apple all state this. Windows gives a test: if one answer is chosen about 98% of the time, remove the confirmation, except for security, legal or safety cases. Windows also says "Don't show this again" must not be used to excuse an unnecessary prompt.

**C3. Never discard what the person entered.**
- 86: 1.0/11 (paging or opening help must not erase partial entries), 4.3/14-15 (keep the error displayed, re-enter only the wrong part), 6.0/5.
- Desk: Windows, "Don't clear incorrect input".
- HCI: Shneiderman rule 5 (repair only the faulty part); Tog, "Protect Users' Work".
- Gov: GOV.UK keeps valid and invalid answers.
- DS: Primer keeps entries on failed save; Carbon keeps the dialog open.
- Prac: Vercel warns before losing data.

**C4. An error says what happened and what to do, in the user's terms, without blame.**
- 86: 4.3/1, 4.3/5, 4.3/6 (neutral, no humour, no blaming).
- Desk: Windows' problem, cause, solution; also relevant, actionable, specific and rare. Apple: no "Error 329347".
- HCI: Nielsen 9; Shneiderman 5; Tog.
- Gov: GOV.UK bans vague messages and codes.
- DS: Polaris, Primer, Carbon.
- Prac: Vercel: tell users how to fix it.
- Std: WCAG 3.3.1, 3.3.3.
Windows adds that good errors are a software design problem. The code must know the cause before anyone can write the message.

**C5. Put the error where the problem is, and take the person there.**
Move focus to the first problem or to a summary that links to each field. S&M 4.3/13 and 4.4/16, Windows, GOV.UK, Vercel, Tog.

**C6. Every action gets a prompt response proportional to its weight and duration. Silence is a failure.**
S&M 3.0/14 calls silence unacceptable as an indicator of processing. Shneiderman 3 scales response to how frequent and major the action is. Also Nielsen 1, Apple 1987, Windows, Tog (50 ms), Primer ("should never fail silently"), and WCAG 4.1.3 for non-visual delivery. Mac HIG: Feedback and Dialog.

**C7. Honest progress.**
Show real progress. Show lack of progress. Do not jump to 99% or go backwards. Provide a way out. Windows gives the fullest treatment, and Tog cites an estimate that was wildly wrong. Nielsen, Apple and S&M 4.2/3-4 agree.

**C8. Show, don't make people remember.**
Keep options and needed information visible, and do not require memory across screens. Star, "seeing vs remembering". S&M 2.0/11 and 4.4/1. Apple 1987 ("recognition, not recall"). Nielsen 6, Shneiderman 8, Windows, GNOME (no hover-only actions), and Tog ("Hiding complexity increases it").
Empirical support: NN/g's 179-person study found hidden navigation cut discoverability by more than 20% and made desktop tasks at least 39% slower.

**C9. Ask once.**
Never make someone re-enter what the system already has. S&M 1.0/1 (1986) and WCAG 3.3.7 (2023) state nearly the same rule 37 years apart. GOV.UK, Shneiderman 8.

**C10. The same thing is always the same word, place and behaviour.**
Star, S&M 3.0/6 and 2.0/6, NeXT, Shneiderman 1, Nielsen 4, GOV.UK, USWDS, Apple, WCAG 3.2.3, 3.2.4, 3.2.6, Inclusive Design. HHS 2:3 rates this at evidence level 5.
Limited by the disagreement in D2.

**C11. Follow convention unless you have a clear advantage.**
Nielsen 4, Tog ("if no clear advantage, follow expectations"), Apple 1987 ("consistency should be valued above idiosyncratic cleverness"), Apple 2026 Familiarity, Windows 11 Familiar, KDE standard controls, GOV.UK.

**C12. Design for the probable. Prominence follows frequency, and effort follows rarity.**
- Windows: focus on the likely, reduce or hide the unlikely, eliminate the impossible.
- Zen of Palm: the 80/20 rule, fewer steps the more common the task.
- Also Apple Purpose, GOV.UK "Do less", HHS, Tog (Fitts), KDE ("Under-promise and over-deliver, never the reverse").

**C13. Simplicity means removing what the target user considers unessential, not removing what they need.**
Microsoft defines it this way and warns that removing the essential just produces a poor design. Apple: "Simplicity isn't minimalism." Tog warns against the "Illusion of Simplicity". GOV.UK: "Do the hard work to make it simple." NHS: absorb the complexity yourself. Tesler's law (via Laws of UX).

**C14. Interrupt in proportion to importance.**
Alerts are rare and carry an action. Apple, S&M, Windows ("Rare"), GNOME, KDE (never stack dialogs), Carbon (dialogs should be user-initiated, system events go to toast), GOV.UK (one banner per page), Primer (about five or fewer outage messages), Carbon (more than five or six indicators overwhelm), and alarm standards (section 4.7). Raskin frames it through the locus of attention. Apple 1987: a barrage of alerts means something is wrong with the design.

**C15. Colour never carries meaning alone.**
WCAG 1.4.1, Carbon, Primer, GOV.UK, Atlassian, Vercel, Tog, HHS 3:3 (importance 5), Analysis Function (avoid legends that depend on colour).

**C16. Everything works by keyboard, focus stays visible and focus is managed.**
WCAG 2.1.1, 2.4.7, 2.4.11; APG; GNOME; Material; Vercel; Apple on macOS. APG adds that focus must not silently fall to the page body. M3 adds that shortcuts should use two or more keys by default, for the benefit of speech users.

**C17. Labels name the outcome.**
Use a specific verb and avoid generic words. Apple, Carbon, GNOME, Polaris, Windows, NN/g, USWDS, Vercel.
Limit: on one point Windows dissents (D4).

**C18. Text is scanned, so cut it and front-load it.**
Windows, "Users don't read, they scan". Krug. Tog (key words first in labels). GOV.UK (key words first; add help only if research shows it is needed). S&M 6.3/20 (distinguishing part of a name near the beginning). GNOME. HHS 16:2 (importance 5). Reading-age targets: Primer about grade 7, Atlassian ages 12-14.

**C19. Users can always get out.**
They can leave, cancel or interrupt at any time. Esc works. S&M 3.0/4 and 3.0/21. Windows (Esc always closes; Cancel versus Stop). Apple (flows easy to skip). Nielsen 3. Shneiderman 7. GNOME (Esc cancels pointer operations). Tog (tell users where they can resume). WCAG 2.5.2.

**C20. Avoid modes. If unavoidable, make them chosen, visible and easy to leave.**
Star. NeXT (freely chosen, easy way out, visually apparent; only three sanctioned uses, one of them spring-loaded). Raskin (quasimodes). S&M 3.0/9, 4.1/5, 6.0/15-16. Apple 2026. Mac HIG.
Note the independent arrival at "spring-loaded" (NeXT) and "quasimode" (Raskin).

**C21. Motion serves meaning, stays brief, is never the only signal and respects the setting.**
Apple, Kowalski, Rauno, Vercel, Carbon, Material, Windows ("Don't use unnecessary animations"), WCAG 2.2.2, 2.3.1, 2.3.3, Atlassian.
A sharper sub-rule from independent sources: **do not animate frequent actions.** Apple, Kowalski, Rauno. HHS 14:4 rates meaningful use of animation at evidence level 5.

**C22. Separate risky commands from common ones, and make the default safe.**
S&M 6.0/12-13 (physically separate, default to NO). Windows (separate destructive commands; risky default is do not proceed). Zen of Palm ("Conceal risky functions"; symmetry is not always desirable; the stapler and staple remover). Apple. GNOME (destructive is never the Return default). APG (consider focusing the least destructive action). NN/g (no default).

### Strong: three to five traditions

**C23. One focal point and one primary action per surface.**
Windows ("There should be only one focal point"), Carbon, Polaris, Refactoring UI (hierarchy of button styles), USWDS (limit buttons).

**C24. Show status near the thing it describes.**
Apple, Rauno, Primer, GOV.UK error placement, Carbon empty-state replacement.

**C25. Never leave a dead end.**
Empty, loading, error and degraded states all carry a next step. Carbon, Vercel, Rauno, Primer, Apple.

**C26. Degrade by showing what failed, not by implying loss.**
Primer: hide counts when data is unavailable and do not imply data is gone. Apple: cached data with a label instead of a launch alert.

**C27. Native first.**
APG, "No ARIA is better than bad ARIA". Vercel. GOV.UK (links styled as buttons remain links). WebAIM 2026: pages with ARIA averaged 59.1 errors against 42 without, a correlation the report warns is confounded by page complexity.

**C28. Stability is a feature, and change should be gradual.**
Mac HIG Perceived Stability. WCAG 3.2.1-3.2.2. Apple 2026 (preserve context). Tog ("Continuity"). Bloomberg: plans redesigns as incremental updates over weeks or months, and tells of thousands of complaints after a font change.

**C29. Data charts: honest scales, simple types, direct labels.**
Bars start at zero: S&M 2.4.1/6, Analysis Function. Same scale when comparing: S&M 2.4.1/2. One scale per axis: S&M 2.4.1/9, and Analysis Function avoids dual axes. Common chart types: Apple. Colour only for meaning: Few rules 3-5. Tables when people only look values up: Apple. Tufte's data-ink and lie factor [S].

**C30. Test with real people, and judge behaviour over opinion.**
GOV.UK, USWDS, NHS, Krug, Tog (test beyond the first 20 minutes), Raskin (quantify), HHS, Zen of Palm.
The aesthetic-usability effect (Kurosu and Kashimura 1995, 252 participants) shows that appeal skews perceived ease. People praise what they struggled with. **This bears directly on our experiment:** judges looking at screenshots are exposed to this bias.

---

## 3. Disagreements and how to decide

**D1. Density versus simplicity.**
- For less: Nielsen 8, Windows 11 Calm, HHS 6:1, GNOME, Zen of Palm.
- For more: Material (dense lists and tables are easier to scan and compare, but not pickers, dialogs or alerts), Apple macOS (more content in fewer nested levels), Linear (kept density high), Bloomberg, S&M 2.0/11 (keep needed data together).
- Decide by task:
  - Repeated scanning and comparison by practised users: go dense.
  - Occasional focused decisions: go sparse.
  - Within one screen: dense data, roomy controls. Material pairs dense components with wider margins and gutters.
  - The caveat: Material says high density falls below its accessibility baseline, so users must opt in. That applies to its touch targets, so do not shrink targets to gain density.
  - Density is judged per task, because Microsoft defines simplicity by what the target user considers unessential.

**D2. Consistency versus fit to task.**
- Grudin (1989) separates internal, external and analogic consistency and argues none is a reliable guide. His household image: knives are stored by use, not by kind. His keypad example: arithmetic keys in the learned order were easy to learn and hard to use, and the star-shaped cursor keys experts favoured lost to the inverted T. He writes that "We generally build user interfaces, not learner interfaces."
- Microsoft warns of "misguided efforts in consistency". Lightning ranks consistency third, under clarity and efficiency, so as not to lock in weak patterns. GOV.UK: "Be consistent, not uniform." Tog: things that act differently should look different. Zen of Palm: symmetry is not always desirable.
- Against all that: S&M, Nielsen, Shneiderman, HHS at evidence level 5.
- Decide: be consistent in meaning and behaviour by default. Break it only when task analysis shows a real gain for the main user, and make the difference visible. Tog's ladder helps: invisible structures and interpretation of user behaviour need the strictest consistency, visual language less.

**D3. Platform convention versus brand.**
- Apple asks for familiarity and also "Find new ways". Vercel flags its own copy rules as brand preferences, "They aren't universal guidelines." Tog: "Fashion should never override usability."
- Decide: brand owns colour, type, voice and imagery. Convention owns interaction, control behaviour, shortcuts and semantic structure.

**D4. Yes/No versus specific verbs in confirmations.**
- Apple, NN/g, Carbon and GNOME: specific verbs, avoid Yes/No.
- Microsoft: use specific labels when the reason is obvious, otherwise Yes/No, because reflexively clicking "Uninstall" defeats the point. It offers the alternative "Uninstall anyway".
- Decide: use verbs that name the outcome. Add the reason not to proceed in the text, and use "anyway" wording for unintended consequences. This keeps Microsoft's speed bump without Yes/No. Agents also benefit, because a verb binds to the action.

**D5. Disabled controls.**
- Against: GOV.UK (avoid unless research supports it), Vercel (do not pre-disable submit), Primer (generally do not disable before validation), USWDS (explain why and how to enable).
- For: GNOME (main button disabled until choices are made), KDE (disable confirm while invalid), Shneiderman (gray out), Windows (when the reason is easy to deduce), S&M 3.1.4/12, Apple 1987 (dim rather than remove).
- Decide:
  - Long forms: keep enabled and validate on submit.
  - Short modal choices with an obvious missing input: disabling is acceptable.
  - Menus and toolbars: keep dimmed items for stability, and use `aria-disabled` so they stay discoverable (APG).
  - Always make the reason available. An agent needs this as text.

**D6. When to validate.**
- GOV.UK: on submission only, on long live-service experience.
- S&M 4.3/10: only after explicit entry.
- LukeW 2009 (22 participants, each saw all forms, so learning effects are possible): the best inline version had 22% more success and 42% less time than submit-only, validating after leaving a field, while premature errors did harm.
- KDE: inline.
- Decide: everyone agrees **do not flag while the person is still typing a first attempt.** Server validation is non-negotiable. Blur validation is defensible for format-sensitive fields, with weak evidence. For a service with very mixed abilities, follow GOV.UK. Never rely on the client alone. Agents should get the same structured result from both.

**D7. Motion duration.**
- Rauno: 200 ms or less for interaction. Kowalski: under 300 ms, with 180 ms feeling better than 400 ms. Carbon: 70-240 ms for most, 90-120 ms micro-interactions, 400-700 ms for large or background moves.
- M3: Standard 200-300 ms, Emphasized 200-500 ms. It notes M3 durations are longer than M2's, and is migrating to spring physics. M2: 100 ms switch, 200-300 ms sheets and cards. Apple gives no numbers.
- Decide: productive tools take Carbon's productive range; 100-200 ms is the common core. Exits run shorter than entrances (M2 and M3 agree). Longer durations only for rare, large, expressive transitions, and never on keyboard-triggered actions.

**D8. Line length: speed versus preference.**
- Conventions: Bringhurst 45-75, 66 ideal; Butterick 45-90; USWDS 45-90, 66 for long text; GOV.UK about 75; WCAG 1.4.8 (AAA) 80 or fewer.
- Research: HHS 6:12 says use 75-100 characters if reading speed matters and about 50 if acceptance matters, and always at least 50 per line (S&M 2.1/5 agrees). Dyson and others found longer lines read faster on screen and shorter lines preferred, with mixed comprehension results [S].
- Decide: default to 60-75 for prose, as this satisfies preference and every convention. Treat 66 as convention, not as a finding. Tables and logs are exempt.

**D9. Line height.**
- Butterick: 120-145%. GOV.UK's body is 19/25 (about 1.32). USWDS: at least 1.5 for long text. WCAG 1.4.8 (AAA): at least 1.5. Rello 2016: line spacing effects were marginal.
- Note that WCAG 1.4.12 does not require 1.5. It requires that nothing breaks when users apply it. An LLM commonly conflates them.
- Decide: 1.3-1.5 for prose, tighter for headings and dense UI, and test the 1.4.12 override.

**D10. Error tone.**
- GOV.UK: no "please" or "sorry" for validation, no humour. S&M 4.3/6: do not personalise the computer. Primer: no humour in errors, do not over-apologise.
- Atlassian: use "we" and "you" to sound friendlier. Apple's Delight: use everyday interactions, including error messages, for character.
- Decide: plain and specific always. Warmth only when stakes are low. Never humour on failure. Apologise only for the system's own serious failures (GOV.UK and Polaris agree).

**D11. Toasts.**
- Primer: avoid on github.com due to accessibility problems. GOV.UK: uses banners and confirmation pages. GNOME: fine, especially with undo. Carbon: for system-generated alerts. Vercel: announce with `aria-live`.
- Decide: a toast can never be the only record of something important. Pair with a persistent place (list state, log). Undo toasts must respect WCAG 2.2.1 timing thinking, and the undo must also exist elsewhere. Toasts are transient state, so they are bad for agents.

**D12. Button order and alignment.**
- Apple, Carbon, GNOME, Polaris: confirm on the right. Windows: OK first. GOV.UK: left-aligned so it is not missed.
- Nielsen calls it a minor matter where platform consistency dominates, and says on the web to check who your users are.
- Decide: pick one and hold it everywhere. Do not spend A/B effort. For agents it does not matter at all.

**D13. Capitalisation.**
Primer, Polaris, Atlassian, GOV.UK: sentence case. Vercel and Apple buttons: title case. GNOME: mixed by element. Decide: sentence case by default for product UI, since the system-level sources lean that way. It is a convention, not evidence.

**D14. Contrast metric.**
Vercel prefers APCA. Primer says only WCAG 2.2 counts, because an APCA-passing colour may fail WCAG. Decide: WCAG 2.2 is the requirement. APCA may be a secondary perceptual check, never a replacement.

**D15. Fewer steps versus simpler steps.**
- Fewer: Zen of Palm, HHS 16:5, Shneiderman rule 8 (long forms compacted to one display), Vercel.
- Simpler: GOV.UK (one thing per page), Krug's second law (the click count matters less if each click is unambiguous).
- Decide by familiarity and frequency. Daily expert work: fewer steps, one screen. Rare, high-stress or low-literacy tasks: one question at a time. S&M 3.1.1/2 already favoured one at a time for question-and-answer dialogue.

**D16. Reveal versus hide.**
Tog: hiding complexity increases it, and essential controls must be visible. Apple: appear when needed. Zen of Palm: power features can use a "secret handshake". Windows: progressive disclosure, but never hide needed information.
Decide: hide only what is optional for this user's main path, and never hide status or the way out. Shortcuts may stay hidden if the visible path also exists (NeXT: keyboard alternatives optional, visual representations never).

**D17. Explicit save versus automatic.**
- S&M 1.0/9: always explicit ENTER. Raskin: continuous persistence.
- A working synthesis exists in KDE, Primer and Rauno: switches and toggles apply at once; text inputs and multi-field forms save explicitly. Never mix within one form (Primer).
- Agents care too: a change on input is a side effect of a field fill, and should be advertised as such.

**D18. Judgment versus measurement.**
Linear rejects A/B culture in favour of taste and asks whether something improves quality. GOV.UK, HHS and Raskin put evidence first. Tog says trained visual designers should own visuals, then benchmark. Decide: use taste to generate and evidence to reject. Our project needs both, with results reported honestly.

**D19. Light on dark.**
HHS 11:1 reports black-on-white read up to 32% faster than light-on-dark, from old displays. Primer requires both themes pass contrast. Decide: offer both where people work long hours, check each separately, and treat the 32% as dated.

---

## 4. Concrete testable rules

Numbers are as the source gives them. "Hard" means a standard requirement. "Default" means a good starting point.

### 4.1 Contrast and colour

| Rule | Value | Source |
|---|---|---|
| Normal text | at least 4.5:1 (AA), 7:1 (AAA) | WCAG 1.4.3, 1.4.6 |
| Large text (18 pt, or 14 pt bold) | at least 3:1 (AA), 4.5:1 (AAA) | same |
| UI components, needed graphics | at least 3:1 against adjacent colours | WCAG 1.4.11 |
| Status colours against each other and the background | 3:1 | Carbon |
| Disabled controls | exempt from contrast | Primer, M3 |
| Palette design: any two steps 5 levels apart pass 4.5:1; 4 levels for icons and large text | requires a perceptual scale | Stripe 2019 |
| Few colours for encoding; soft for most data, saturated for emphasis; single-hue sequential; no red with green | rules 3-8 | Few 2008 |

### 4.2 Target size and spacing

| Rule | Value | Source |
|---|---|---|
| Web minimum (hard) | 24 × 24 CSS px, or 24 px circles do not overlap; equivalent, inline, user-agent and essential exceptions | WCAG 2.5.8 AA |
| Web enhanced | 44 × 44 CSS px | WCAG 2.5.5 AAA |
| iOS, iPadOS, watchOS | default 44 × 44 pt, minimum 28 × 28 | Apple |
| macOS | default 28 × 28 pt, minimum 20 × 20 | Apple |
| visionOS / tvOS | 60 (min 28) / 66 (min 56) pt | Apple |
| Spacing around controls | about 12 pt with a bezel, about 24 pt without | Apple |
| Android, Material touch | 48 × 48 dp (about 9 mm), spacing 8 dp; recommended 7-10 mm | M3 |
| Material pointer | 44 × 44 dp | M3 |
| Windows | 7.5 mm (40 × 40 px at 135 PPI); larger for frequent or high-consequence targets | Microsoft |
| Empirical, one-handed thumb | 9.2 mm discrete, 9.6 mm serial | Parhi, Karlson, Bederson 2006 [S, abstract] |
| Practitioner | at least 24 px desktop, at least 44 px mobile; hit area may exceed visual | Vercel |

### 4.3 Type

| Rule | Value | Source |
|---|---|---|
| Line length | see D8 | |
| Web body size | at least 16 px effective | USWDS |
| GOV.UK body and small | 19/25 px; 16/20 px; every line height a multiple of 5 px | GOV.UK |
| Body range | 15-25 px | Butterick |
| Empirical | readability and comprehension improved up to 18 pt in a 104-person study | Rello et al., CHI 2016 [S] |
| Older floor | at least 12 pt, 14 pt for over-65s, never below 9 | HHS 11:8 (2006; dated units) |
| Apple defaults (minimums) | iOS 17 (11) pt; macOS 13 (10) pt | Apple |
| Mobile inputs | at least 16 px to stop iOS zoom | Vercel, Rauno |
| Weights | avoid Thin, Ultralight and Light; no weights below 400 | Apple, Rauno, Refactoring UI |
| Typefaces | one or very few | Apple |
| Text resize / reflow | 200% without loss; no 2D scroll at 320 CSS px wide | WCAG 1.4.4, 1.4.10 |
| Spacing tolerance | line 1.5×, paragraph 2×, letter 0.12×, word 0.16× must not break | WCAG 1.4.12 |
| Text enlargement | at least 200% (140% watchOS) | Apple |
| Paragraph gap | 1-1.5 em; list items at least 0.5 em | USWDS |

### 4.4 Response and progress

| Delay | Requirement | Source |
|---|---|---|
| Up to 50 ms | handle input; acknowledge every click | RAIL; Tog |
| 100 ms | feels instant; direct manipulation limit | Nielsen; Miller 1968; Card 1991; RAIL |
| 200 ms | keystroke echo limit (1986) | S&M 1.0/4 |
| 200 ms at p75 | INP "good" | Web Vitals |
| 400 ms | productivity target | Doherty and Thadani 1982, via Laws of UX [S] |
| 500 ms | mutating requests complete | Vercel (no evidence given) |
| 1 s | flow of thought limit | Nielsen |
| Under about 1 s | no spinner or skeleton | NN/g |
| At least 2 s | treat as lengthy, show feedback | Windows |
| 2-10 s | spinner or busy state | NN/g |
| Up to 5 s | activity indicator, not a bar; become a bar after 5 s | Windows |
| Up to 10 s | skeleton, for full-page load only | NN/g |
| Over 10 s | percent-done, estimate and interrupt | Nielsen, NN/g |
| Over 30 s | modeless progress so work can continue | Windows dialog guide |
| Over 2 min | notify on completion, sound only if important | Windows |
| Show delay / minimum time | delay spinner 150-300 ms; hold 300-500 ms once shown | Vercel |
| Page load | LCP at most 2.5 s; CLS at most 0.1 at p75 | Web Vitals |
| Time remaining | update at least every 5 s | Windows |

Progress bar rules from Windows:

- Never restart or go backward.
- Start at no more than 33% if the phase is early.
- Do not hit 100% until finished.
- Do not steal focus.
- Label the halt control **Cancel** if it restores the prior state, **Stop** if partial work remains.

### 4.5 Motion

| Rule | Value | Source |
|---|---|---|
| Moves or flashes | no more than 3 flashes per second | WCAG 2.3.1 |
| Auto-moving content over 5 s | must pause, stop or hide | WCAG 2.2.2 |
| Interaction-triggered motion | can be disabled unless essential | WCAG 2.3.3 AAA |
| Durations | see D7 | |
| Press scale | about 0.96-0.9; dialog enter from about 0.8, not 0 | Rauno |
| Properties | `transform`, `opacity`; no `transition: all` | Vercel, Kowalski |
| Frame budget | 10 ms of work per frame for 60 fps | RAIL |

### 4.6 Forms and input

| Rule | Value | Source |
|---|---|---|
| Label each field, visible, not by placeholder | hard | WCAG 3.3.2; NN/g gives 7 harms of placeholder labels |
| Mark optional, no asterisks | | GOV.UK |
| HTML `autocomplete` for personal data | | WCAG 1.3.5 |
| Accept stray spaces, hyphens, paste artefacts | | GOV.UK |
| Never block paste | | Vercel |
| "Error:" title prefix; summary at top with links; match wording to the field message | | GOV.UK |
| Radios up to 3 short options; combo up to 10; list beyond | | KDE |
| Label alignment | top-aligned 50 ms saccade; right-aligned 170-240 ms; left-aligned about 500 ms; bold slowed to 80 ms | Penzo 2006 (small eye-tracking test) |
| Time limits | turn off, extend at least 10×, or 20 s warning | WCAG 2.2.1 |
| Debounce double submits; server protection required | | GOV.UK; Vercel (idempotency key) |
| Long codes grouped in 3-4 | | S&M 2.2/14 |

### 4.7 Tables, charts, dashboards, alarms

| Rule | Value | Source |
|---|---|---|
| Numbers align on the decimal; right-justify integers; text left | | S&M 2.3/15-16 |
| Tabular numerals in tables and timers | | Vercel, Rauno |
| Keep significant zeros; units in the label or column | | S&M 2.3/17, 2.3/11 |
| Blank row every five in dense tables | | S&M 2.3/14 |
| Ticks at 1, 2, 5, 10 multiples | | S&M 2.4.1/5 |
| Number larger than its label | | Tog |
| Accuracy of reading encodings | position outperforms length; area worse than angle; both worse than position | Heer and Bostock 2010, Cleveland and McGill 1984 |
| Chart height | 40 px gave more error; little gain above 80 px on a 0-100 scale | Heer and Bostock |
| Gridline spacing | at least 8 px apart | Heer and Bostock |
| Lines per chart | up to 4 | Analysis Function |
| Stack or cluster | up to 4 parts; pie up to 5 with one dominant | Analysis Function |
| Gridlines | up to about 10, light gray; no 3D or dual axes; direct labels over legends; two-part titles | Analysis Function |
| Dashboard definition | one screen, monitored at a glance | Few [S] |
| Levels | macro, mid, micro | Apple; also Shneiderman 1996 mantra [S] |
| Consolidated status | show the worst child | Carbon |
| Indicators per screen | up to 5-6 | Carbon |
| Alarm rate in normal operation | about 1 per 10 min per operator | EEMUA 191, IEC 62682 (via IChemE) [S] |
| Alarm rate in upset | under 10 in first 10 min | same |
| Standing alarms | under 5 (IEC), under 10 (EEMUA) | same |
| Every alarm | relevant, truthful, understandable, with a defined response | EEMUA 191 via IChemE [S] |

### 4.8 Conditions for dialogs and focus

- Modal focus goes to the first focusable element. For a final irreversible step, consider the least destructive action. Return focus to the invoker on close. (APG)
- Never dialog on dialog. (KDE, Carbon)
- No alerts at launch. (Apple)
- Focused element not fully hidden by sticky UI. (WCAG 2.4.11 AA)
- Focus ring at least 2 px perimeter and 3:1 change. (WCAG 2.4.13 AAA)

### 4.9 Common failures to test first

WebAIM Million, February 2026, home pages:

| Failure | Share of pages |
|---|---|
| Any detected WCAG failure | 95.9% |
| Low-contrast text | 83.9% |
| Missing alt text | 53.1% |
| Missing input labels | 51% |
| Empty links | 46.3% |
| Empty buttons | 30.6% |

Average 56.1 errors per page. Labels and button names matter twice for us, because those same gaps blind accessibility-tree agents.

---

## 5. Underrated gems

Which of these LLM UI misses is my judgment, to be confirmed against baselines.

**Behaviour and safety**

1. **Cancel versus Stop.** Windows: Cancel means nothing is left behind, Stop means partial work remains. The label can change mid-operation when rollback stops being possible. Almost nobody does this, and it is an exact honesty rule for agents.
2. **The 98% test.** Windows: if one answer would be picked nearly always, remove the confirmation.
3. **"Anyway".** Windows: the single word turns a reflexive click into a reminder that there is a reason not to proceed.
4. **Warn on the unexpected, not the requested.** Apple: moving to Trash is intended, so no warning. Warn on unexpected irreversible loss.
5. **Apple marks a button destructive only when the person did not deliberately choose it.** The usual red-everything habit misses this.
6. **Show old and new values before changing.** S&M 6.3/16, 1986: a human diff before commit.
7. **Warn if a new name closely resembles an existing one.** S&M 6.3/20.
8. **Unrecognised input changes nothing.** S&M 6.0/14.

**Feedback and status**

9. **Show success sparingly.** Apple: people expect success, so they mainly need to hear about failures. LLM UIs tend to toast everything.
10. **Do not put text on a progress bar.** Windows: percent text on the bar is not accessible.
11. **"End of list".** S&M 4.2/7: say so, and show "Page x of y" on continued lists. Applies directly to infinite scroll and agent pagination.
12. **Date-stamp data whose currency matters.** S&M 4.1/9. Live dashboards often show numbers with no as-of time.
13. **Never "as soon as possible".** S&M 4.1/3: state status and when service returns.
14. **Hide counts when their data is unavailable.** Primer: never show a misleading 0. A null is not zero.
15. **A failed condition may be a page, not an error.** GOV.UK: do not use validation for ineligibility, permission or capacity problems the person cannot fix.

**Forms and text**

16. **Do not reject stray characters.** GOV.UK: ignore spaces and hyphens in numbers and codes, and dictation artefacts.
17. **"Continue" versus "Save and continue".** GOV.UK: the label must match whether data was saved.
18. **Remove a progress indicator first.** GOV.UK: one team removed a 12-step indicator with no drop in completion or time. Test without one first.
19. **Avoid range sliders.** GOV.UK: hard for some people, and KDE only pairs them with spin boxes for precision.
20. **Do not change font weight on hover.** Rauno: layout shift.
21. **Icon scaling.** Refactoring UI: do not blow up 16-24 px icons, and avoid gray text on coloured backgrounds.
22. **Data bigger than labels.** Tog: numbers lack the redundancy of language.
23. **Do not chart what people only look up.** Apple: if people just need the values, a searchable, sortable table may work better.

**Attention and systems**

24. **Density rule.** Material: dense components need wider gutters. LLM dashboards shrink everything evenly.
25. **Alarms need a defined response.** EEMUA 191: if no one must do anything, it is not an alarm. Use this for "critical" badges on dashboards.
26. **Averages hide floods.** Emerson on alarm reporting: use peak rates as well [S].
27. **Do less rather than lie.** NeXT: if in doubt whether to act for the user, do not. The result of an automatic action must equal the user doing it. This is a very good rule for agent automation.
28. **Temporary states get physical.** NeXT spring-loaded and Raskin quasimodes: state that lasts only while held cannot be forgotten.
29. **Test long-term use.** Tog: for habitual tools, do not test only the first 20 minutes. Our test agents have the same blind spot, since they are all first-time users.
30. **Rank your principles.** Lightning's forced ranking, Clarity then Efficiency then Consistency then Beauty, decides real conflicts. A principle list with no order cannot settle anything. It should inform how the skill is structured.
31. **Roll visual changes out slowly and before a weekend.** Bloomberg: gradual changes over months and Friday night releases.

---

## 6. Do the principles translate to agents?

Ratings match digest 01: **Direct** (same rule, new channel), **Amended**, **Partial**, **None**. The translations are mine.

| Principle | Rating | How it translates | Canon hook |
|---|---|---|---|
| C1 Prevent, undo, then confirm | Amended | Prevent by schema and constraints. Dry-run replaces preview. Undo stays as a compensating action. Confirmation goes to the human with a precise statement of the effect. Reversibility should be declared per action | WCAG 3.3.4; S&M 6.3/16 |
| C2 Confirmation fatigue | Amended | Agents do not habituate but they do auto-approve. The human approving an agent's steps does habituate, so ration approvals to consequential, irreversible actions | Windows 98% test |
| Retry safety | New, with roots | Not undo: digest 01's correction stands. An idempotency key answers "did it happen?" under uncertainty | Stripe 2017; GOV.UK double click; Vercel; Tog |
| C3 Keep input | Direct | Failed calls return which fields passed, and the agent re-sends only what failed. Partial success is explicit | S&M 4.3/15 |
| C4 Error content | Direct, two fields | Machine code, field, cause, fix and retryability, plus a human sentence. Digest 01 conflict 6 is resolved by giving both | Windows; GOV.UK specific errors |
| C5 Error location | Direct | Field path and link to the problem. For the DOM: `aria-invalid`, `aria-describedby`, and the summary as links | GOV.UK; WCAG 3.3.1 |
| C6 Feedback | Direct | Structured result for every call, and exposed status text. Toasts must be in `aria-live` or a log | WCAG 4.1.3; S&M 3.0/14; Primer |
| C7 Honest progress | Direct | Job IDs, polling, real percent or step counts, explicit stalled state. Cancel versus Stop semantics in the API | Windows; S&M 4.2/3-4 |
| C8 Show, don't remember | Direct, with cost | Discoverable tools, listed enum values, state in the response. Reading costs tokens, so paginate (digest 01 conflict 4). Hover-only actions are invisible to accessibility-tree agents | Star; WCAG 1.4.13; GNOME |
| C9 Ask once | Direct | Return IDs and accept references. Avoid making agents re-supply context | S&M 1.0/1; WCAG 3.3.7 |
| C10 Consistency | Direct, and stricter | Same verb, same parameter name, same error shape. Agents generalise from one example, and synonyms are costly | S&M 3.0/6; WCAG 3.2.4 |
| C11 Convention | Direct | Native elements, standard roles, HTTP semantics, CLI flags (`--json`, `--dry-run`). Strong prior knowledge is the agent's "habit" | APG; Nielsen 4 |
| C12 Design for the probable | Partial | A narrow, high-level tool set beats exposing every endpoint, since every tool costs context. But the rare path must remain reachable | Windows; Zen of Palm; Kay's maxim in Star |
| C13 Simplicity vs essential | Direct | Fewer tools, not less capability. Hiding needed data just causes extra calls | Microsoft |
| C14 Interrupt in proportion | Amended | For the human overseer: escalate rarely, with a defined response. For agents: blocking modals can stall a run, so report them structurally | EEMUA 191; KDE |
| C15 Colour alone | Direct | Colour-only status is invisible in the tree. Text status is the fix | WCAG 1.4.1; Carbon |
| Contrast, type, target size, motion | None for agents | Human perception only. Exceptions: small or overlapping targets can break coordinate clicks, and animation or layout shifts can break screenshot-driven agents. Test with `prefers-reduced-motion` | WCAG 2.5.8; CLS |
| C16 Keyboard and focus | Direct (proxy) | Keyboard operability strongly predicts automatability. Role, name and state exposed. Focus return prevents a lost agent | WCAG 2.1.1, 4.1.2; APG |
| C17 Verb labels | Direct | Accessible names and tool names equal the outcome, unique per screen. "Delete invoice INV-204", not repeated "Delete". WCAG 2.5.3 keeps visible and machine names aligned | WCAG 2.5.3; Apple |
| C18 Scanning | Amended | Agents read all of it, at a cost. Front-loading helps truncation. Plain language helps both. Do not write hidden text for the machine that differs from what the human sees | Tog; S&M 6.3/20 |
| C19 Way out | Direct | Timeouts, cancellation tokens, a stop control the human can reach. No state that can only be exited by a gesture | S&M 3.0/4; WCAG 2.5.2 |
| C20 Modes | Direct | Hidden session mode is a top cause of wrong agent actions. Prefer explicit parameters over session state. Show the mode (dry-run, production) in every response and on screen | S&M 6.0/16; NeXT |
| C21 Motion | None, with one catch | Wait for settled state. Expose `aria-busy` | Apple |
| C22 Separate risky commands | Direct | Separate tools or scopes for read, write and destroy. Safe defaults. Annotations are hints, not enforcement | S&M 6.0/13; Zen of Palm |
| C23 One primary action | Partial | A clear next action, expressed as the single suggested step or `next_actions`. Visual weight itself is none | Windows |
| C24 Status near the object | Direct | Associate state with the element or record. A global banner is hard to link to a row | Apple; Primer |
| C25 No dead ends | Direct | Empty results explain why and what to try. Pagination and truncation are stated | Carbon; S&M 4.2/7 |
| C26 Degrade honestly | Direct, critical | Null, stale and unavailable are distinct from zero. Agents draw conclusions from a bad 0 with no human suspicion | Primer; S&M 4.1/9 |
| C27 Native first | Direct | The accessibility tree is built from native semantics. Bad ARIA misleads agents and screen readers equally | APG |
| C28 Stability | Direct, stricter | Stable IDs and versioned schemas. Humans adapt in a day, but a script fails at once. Bloomberg's gradualism applies differently: use deprecation rather than slow visual drift | WCAG 3.2; Bloomberg |
| C29 Honest charts | Amended | Agents cannot read canvas charts. Provide the data as a table or download. That is also required for humans who need exact values | Apple; Analysis Function |
| C30 Test | Amended | Test with both kinds of user. Agents are cheap but miss habit, stress and long-term learning, so they cannot replace human research | Tog; GOV.UK |

**What the canon cannot supply.** Prompt injection through displayed content, tool annotations and agent identity are absent from all the human guidance, as you would expect. Digest 02 and the agent-facing research must cover them. The nearest old hook is S&M 6.0/14: unrecognised input must never change stored data.

**Where the human and agent versions collide, beyond digest 01 §2.2:**

- **D5, disabled buttons.** Humans lose out when the reason is hidden, and agents lose out with no reason exposed. Use `aria-disabled` plus text.
- **Reduced text versus self-description.** GOV.UK cuts words for people, but tool descriptions need more of them. Keep them on separate channels, with the visible label inside the accessible name.
- **Hidden shortcuts.** Discreet power features suit humans (Zen of Palm), but agents cannot use what is undiscoverable.

---

## 7. Verification notes and limits

- **Extracts.** Sources marked [X] came through a summarising fetch. I saw raw text for Microsoft's pages, M3 and M2 (browser), Shneiderman, Apple 1987, NeXT, Zen of Palm, HHS, Heer, Few, the Penzo article's relevant passages, IChemE and pp. 2-3 of Grudin.
- **WCAG numbers** were extracted over two passes of the Recommendation. Spot-check against the text before they go into an audit script.
- **Alarm figures** come from an IChemE-hosted presentation, ABB and Emerson material, not the paywalled standards. Sources vary slightly on normal-rate thresholds. Do not state them as direct quotes from the standards.
- **Dated evidence.** HHS (2006) and S&M (1986) predate modern displays. Their reasoning holds better than their numbers. S&M 4.3/11's 2-4 second error delay and its response-time table should not be adopted.
- **Weak studies flagged.** LukeW (22 people, all conditions per person), Penzo (small), Doherty (seen via Laws of UX), line-length work via secondary summaries.
- **"7 plus or minus 2".** Shneiderman still cites it for short-term memory. Laws of UX warns against using it to justify arbitrary limits. Treat chunking as the lesson, and do not use it to cap menu length.
- **Fetched text was treated as data.** Nothing in it directed this work.
