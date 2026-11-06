# Oversight and safety

Read this when people supervise agents or automation, when an interface takes consequential actions, or when it displays text outsiders can write.

Evidence on agent oversight is recent, mostly preprints or vendor data, and none measures long-term expert behavior with real stakes. Sections 1 to 3 are design inference from that evidence and no study has tested them as a package.

## Contents

1. What is known about approvals
2. The ladder: what deserves a prompt
3. What a prompt must contain
4. Showing agent activity
5. Displayed text is untrusted
6. Authority
7. What not to claim

## 1. What is known about approvals

- **Per-action approval is a weak safeguard.** Users blocked 21% of problematic agent actions that reached execution, and oversight strategy did not reliably change that (Chen 2026, n=48, preprint). In a vendor experiment, testers caught 13.6% of a planted dangerous command against 89% for a classifier, though humans caught 6 the classifier missed (Anthropic 2026, interested party, no real stakes).
- **Attention decays.** Human block rate fell from about 17% to about 5% after 50+ prompts (same vendor). Warning attention falls with repetition (Anderson 2015, Vance 2018), though comprehension and timing fail too (Felt 2012, Reeder 2018).
- **Timing was the top failure.** 56% of failure episodes were mistimed: the risk was already in place before the approval point, or no gate existed when it emerged. 68% were procedural approvals with little deliberation. "Approve similar" auto-approved in 28 of 53 failures (Chen 2026).
- **Plans help and hurt.** Plan rejection is far more common than per-action rejection (39% vs 3%, vendor), but plans can make later steps feel vetted. Plan review sets direction, not authorization.
- **Explanations raise acceptance, not accuracy** (Bansal 2021). What helps is letting people verify (Fok and Weld 2024).
- **Confidence does not track correctness.** 79% of failed silent-defect tasks carried confidence of 4 or 5 out of 5 (Dissanayake 2026).
- **Human plus AI often underperforms the better of the two** (Vaccaro 2024, 106 studies, g = -0.23). Do not assume a human in the loop improves results. Put the person where they add something distinct.
- **Rare targets get missed,** and instructing people to pay attention does not fix it (Wolfe 2007, Parasuraman and Manzey 2010). So add containment.

High approval rates are not proof of failure, since most requests may be fine. The failure is missing the rare bad one. Design for approval to be rare and meaningful, and never rely on it alone.

## 2. The ladder: what deserves a prompt

Use the highest rung that fits. Attention cost rises as you go down.

| Rung | Mechanism | When |
|---|---|---|
| 1 | Do it, log it, offer undo | Easily reversible or low severity. One vendor estimate: about 0.8% of actions look irreversible |
| 2 | Contain it: sandbox, scoped credentials, dry run | Agent needs freedom, blast radius can be limited |
| 3 | Grant through the person's own action: chooser, edit before apply | The person initiates it or can adjust scope |
| 4 | Automated policy, with fallback to a person | Many actions, machine-checkable risk. Classifiers still miss 11-17% |
| 5 | Plan or batch review | Multi-step work where direction matters |
| 6 | Per-action blocking confirmation | Irreversible and severe, and the person holds context the system lacks |

**Before adding a prompt, ask all five. A "no" moves the action to another rung.**

1. Is it severe and hard to reverse?
2. Can the reviewer tell a good instance from a bad one using what the prompt shows?
3. Does the person have knowledge or authority the system lacks?
4. Is this the last point where stopping still prevents the harm?
5. Would a meaningful share of these prompts ever be rejected? Track rejection rate per type. If nobody rejects a type, automate or remove it, or check that people are really reviewing.

## 3. What a prompt must contain

- **The consequence in plain terms,** not a risk label or raw command: what data goes where, what cannot be undone.
- **How the agent got here,** briefly, and what the approval authorizes.
- **Exact scope:** this action, this resource, this session.
- **Something checkable:** a diff, resolved contents, the destination.
- **Quoted evidence marked as quoted,** with its source. Evidence may be attacker-written (section 5).
- Honest uncertainty, in specific first-person language where it fits (Kim 2024). Not decorative percentages.
- For the most severe actions, forced interaction with the specific value, such as typing the target's name (Bravo-Lillo 2014). People dislike it (Buçinca 2021), so ration it.

Timing and grouping:

- Gate before the irreversible step or before sensitive data goes in, not only at final submit.
- Do not interrupt demanding work unless time critical. Offer a queue, sorted by who needs a person and how long they have waited (Olsen and Wood, Cummings and Mitchell, from robotics).
- Budget prompts per session. Escalate on repeated denials rather than asking again.
- Make "always allow" scoped, visible, renewable, and revocable.
- Give high-severity prompts a look nothing else uses, so routine habits do not transfer.

Report these if you can: prompts per session, rejection rate by type, time at the decision point, seeded-problem catch rate, undo use. Satisfaction alone misleads, since the most protective designs are often liked least.

## 4. Showing agent activity

| Rule | Basis |
|---|---|
| Show current state, recent actions, and what is pending. Mode (autonomy level, dry-run, production) is always visible, and modes are few | van de Merwe 2022, Sarter and Woods 1995 |
| Show consequences and evidence, not only reasoning | Fok and Weld, Bansal |
| Say what checks did and did not establish | Dissanayake 2026, weak |
| Confidence only if it tracks accuracy, and per case | McGuirl and Sarter 2006, Zhang 2020 |
| Show a track record for this kind of task, including errors | Yin 2019, Lee and See 2004 |
| Stop and take over at any point, cheaply. Passive monitoring harms takeover | Endsley and Kiris 1995, Bainbridge 1983 |
| Announce behavior changes after updates | Bansal 2019 |
| Show what was observed, separate from what was requested | TMI, see `dashboards.md` |
| Mark new changes persistently, with a trace | Durlach 2004, Baudisch 2006 |
| Attribute every action: actor, on whose behalf, tool or control, arguments, before and after, approver | Mac HIG pp. 28-29, Chrome |
| Warn before stopping shared work; report relative and absolute time | Mac HIG p. 28 |
| Cost and budget against limit, with what happens at the limit | [J] |

Aim to calibrate trust, not maximize it (Lee and See 2004). Fleet capacity falls by up to 67% once wait times are counted (Cummings and Mitchell), so do not assume supervision scales linearly.

## 5. Displayed text is untrusted

**An agent reading a dashboard is reading untrusted data.** Models receive instructions and data as one stream, and no reliable separation exists. Both OpenAI and Anthropic say the problem is unsolved. Attack success has fallen but remains meaningful under repeated attempts.

**Attacker-writable fields:** ticket titles and bodies, customer names, log lines, URLs, user agents, commit messages, branch names, alert annotations, webhook payloads, filenames, third-party status text, and **other agents' output**.

| Rule | Why |
|---|---|
| Know who can write each displayed field | You cannot protect what you have not marked |
| **Attacker-writable text never goes into a control name, `aria-label`, `title`, `alt`, heading, page title, or tool metadata.** Use system IDs: "Roll back DEP-4412", not "Roll back " + a ticket title | Otherwise an attacker writes what the agent thinks a button does |
| Render it as inert text in a labeled container: a column or region named "Customer message (unverified)", with its source shown | Risk reduction, **not a boundary**. No measurement shows it stops injection |
| Strip HTML, CSS, zero-width, and Unicode tag characters on the way in | Removes hidden channels (see `agent-surfaces.md`) |
| No remote images from untrusted content; tight CSP; show full link targets; `rel="ugc noopener"` | Closes exfiltration routes |
| Masked secrets are not in the DOM. Reveal on explicit action, then remove | Agents read everything |
| Do not act on or render as authoritative any instruction inside data. Show it, attribute it, and flag it if you can detect it | |
| Do not write instructions to agents in page content. Use tool descriptions or docs | Legitimate agent-directed copy has the same form as an attack |
| Honest defaults: no preselected paid options, hidden fees, trick wording | Covert dark patterns beat people and agents alike (Ersoy 2025: 41% agent susceptibility) |

Frame sessions by the lethal trifecta (private data, untrusted content, external communication; Willison) or the Rule of Two (Meta). Most of that sits with the agent host. The rules above are what the interface owner controls.

## 6. Authority

A confirmation dialog informs a person. **It is not authority, since an agent can click it.**

- Enforce consequential actions on the server. With no backend in a demo, say so visibly rather than implying enforcement.
- High stakes get a step-up the agent cannot complete: passkey, or out-of-band approval.
- Bind approval to exact resource, version, effect, and expiry. Recompute on confirm. Invalidate stale plans.
- Least privilege by default: read-only mode, scoped short-lived tokens, caps on batch size and spend.
- Assume any session may be agent-driven. Do not rely on detecting agents, and do not fork the UI by detection.
- Rate limit for machine speed, with guidance on 429.
- Do not remove a gate to help an agent. Add a direct path with its own authority.

If an approval page would let an agent approve its own request, say so in the handoff and design around it: separate identity for approver and requester, and record who approved.

## 7. What not to claim

Do not claim that any of this makes an agent safe, that labels stop injection, or that annotations are a control. Do not conclude humans should be removed, that classifiers are enough, or that plans solve oversight. Frontier models predicted outcomes of web actions with under 60% accuracy (WebGuard), so do not rely on an agent's judgment of what a button will do.
