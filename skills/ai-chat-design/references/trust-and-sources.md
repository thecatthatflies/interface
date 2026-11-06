# Trust, sources, and uncertainty

Read this when an assistant answers questions people will act on: citations, uncertainty, explanations, feedback. Tags: **[E]** empirical, **[S]** standard or institutional guidance, **[P]** practitioner, **[J]** judgment.

The goal is calibrated reliance: people accept the assistant when it is right and catch it when it is wrong (Lee and See 2004). Maximizing trust is the wrong target.

## Contents

1. What the evidence says
2. Citations
3. Uncertainty
4. Explanations and reasoning displays
5. Feedback and correction
6. HAX and PAIR mapped to chat
7. Sources

## 1. What the evidence says

| Finding | Strength | Source |
|---|---|---|
| Explanations raise acceptance of AI advice whether or not the advice is right | Strong | Bansal et al. 2021 [E] |
| Explanations can reduce overreliance when the task is hard and the explanation makes verification cheap | Moderate | Vasconcelos et al. 2023, N = 731 [E] |
| Designs that support verification, not explanation, are the lever | Argument from review | Fok and Weld 2024 [E] |
| Cognitive forcing (decide first, or wait before seeing the AI answer) reduces overreliance, and people like it least | Moderate | Buçinca et al. 2021, N = 199 [E] |
| First-person uncertainty ("I'm not sure, but...") reduced overreliance; general-perspective phrasing had weaker effects | Moderate | Kim et al. 2024, N = 404 [E] |
| People relied on LLM answers about equally whether they were plainly stated or strongly confident; models favored confident phrasing, and early overconfidence had lasting effects on reliance | Moderate, preprint | Zhou et al. 2024 [E] |
| People overestimate LLM accuracy with default explanations; longer explanations raise confidence without raising accuracy; wording that tracks the model's internal confidence narrows the gap | Moderate | Steyvers et al. 2025, Nature Machine Intelligence [E] |
| In an audit of four generative search engines, 51.5% of sentences were fully supported by their citations, and 74.5% of citations supported their sentence | Moderate, 2023 systems | Liu, Zhang, Liang 2023 [E] |
| Human plus AI often performs worse than the better of the two, with losses in decisions and gains in content creation | Strong | Vaccaro et al. 2024, 106 studies [E] |
| Stated and observed accuracy both shape trust | Moderate | Yin et al. 2019 [E] |

Implications [J]: write shorter answers when the model is unsure, put sources where they can be checked in one step, and reserve friction for answers whose errors are costly.

## 2. Citations

- Cite at the claim, not at the end of the answer. Each marker has an accessible name ("Source 2: Refund policy, help.acme.com"). [J], WCAG 2.4.4
- Open to the passage: a popover or side panel shows the quoted excerpt, title, domain, and date, with a link to the exact location. [J], Fok and Weld 2024
- Distinguish what came from sources and what came from the model's general knowledge, in text. [S] foundation (it tells the truth)
- Show the full list of sources consulted, including ones not cited, when the person may want to know what was ignored. [J]
- Prefer primary sources; show the domain so people can judge it. A citation to a forum post is not a citation to a policy. [J]
- Never invent a citation. If the retrieval did not return it, it is not a source. Test with questions whose answers are not in the corpus. [S] OWASP LLM09:2025
- Citation precision and recall are measurable: sample answers and check whether each cited passage supports its sentence. Track it as a product metric. [E] Liu, Zhang, Liang 2023 method

## 3. Uncertainty

- Express doubt in specific words, in the first person, attached to the doubtful part: "I couldn't find whether this applies to contractors." [E] Kim et al. 2024
- Only when it is real. Hedging everything is noise, and people learn to skip it. [J]
- No numeric confidence unless it is calibrated on this task and shown per answer. A fixed-looking "High confidence" badge is decoration. [E] McGuirl and Sarter 2006; Zhang et al. 2020
- Say what was not checked: "I didn't run the code", "This is from the 2024 policy; I can't see newer ones." [E] Dissanayake 2026, weak, via foundation
- For high-stakes domains (health, money, law, safety), state the limit and the human route once, near the answer, not as a wall of disclaimers. [J]

## 4. Explanations and reasoning displays

- A visible chain of "thinking" makes answers feel vetted. Treat it as activity, not proof: label it, collapse it by default, and keep evidence (sources, tool results) separate and primary. [E] Bansal et al. 2021; Steyvers et al. 2025, [J]
- Do not present a summary of reasoning as the literal process if it is a post-hoc summary. [S] foundation (it tells the truth)
- Contrast is more useful than justification: "This assumes you're on the Pro plan; on Basic, the limit is 5." [J]

## 5. Feedback and correction

- Thumbs and "report" are optional, one tap, and say what happens to the feedback. [S] Amershi G15; PAIR Feedback + Control
- Corrections in the conversation should take effect in the conversation ("Use metric units") and, if remembered, appear in memory where the person can see them. [S] Amershi G12, G13
- Showing a track record ("This assistant answers billing questions correctly about N% of the time in audits") helps calibration if the number is real and current. [E] Yin et al. 2019

## 6. HAX and PAIR mapped to chat

The 18 HAX guidelines were validated for clarity and relevance with practitioners, not for outcomes; PAIR is institutional guidance. Use them as a checklist. [S]

| HAX guideline | In a chat interface |
|---|---|
| G1 Make clear what the system can do | Empty state, scope line |
| G2 Make clear how well it can do it | Limits line, uncertainty, track record |
| G3 Time services based on context | Proactive suggestions only at natural pauses |
| G4 Show contextually relevant information | Use the current page or selection, and show that it did |
| G5 Match relevant social norms | Plain, polite, not human-impersonating |
| G6 Mitigate social biases | Test prompts across names, dialects, languages |
| G7 Support efficient invocation | Shortcut to open, slash commands with a visible list |
| G8 Support efficient dismissal | Stop, close, dismiss suggestions |
| G9 Support efficient correction | Edit, regenerate, versions |
| G10 Scope services when in doubt | Ask a clarifying question instead of guessing on consequential tasks |
| G11 Make clear why the system did what it did | Sources, tool steps |
| G12 Remember recent interactions | Conversation context, visible memory |
| G13 Learn from user behavior | Memory the person can inspect |
| G14 Update and adapt cautiously | No sudden behavior changes mid-task |
| G15 Encourage granular feedback | Per-message feedback, per-source reporting |
| G16 Convey the consequences of user actions | Approval cards state the effect |
| G17 Provide global controls | Memory off, training opt-out, autonomy mode |
| G18 Notify users about changes | Model and behavior change notes |

PAIR chapters most relevant here: Mental Models (set expectations), Explainability + Trust, Feedback + Control, Errors + Graceful Failure.

## 7. Sources

- Amershi, S., et al. (2019). Guidelines for human-AI interaction. CHI '19. https://doi.org/10.1145/3290605.3300233
- Google PAIR. People + AI Guidebook. https://pair.withgoogle.com/guidebook/
- Bansal, G., et al. (2021). Does the whole exceed its parts? CHI '21. https://doi.org/10.1145/3411764.3445717
- Buçinca, Z., Malaya, M. B., and Gajos, K. Z. (2021). To trust or to think. PACM HCI 5(CSCW1). https://doi.org/10.1145/3449287
- Fok, R., and Weld, D. S. (2024). In search of verifiability. AI Magazine 45(3). https://doi.org/10.1002/aaai.12182
- Kim, S. S. Y., et al. (2024). "I'm not sure, but...". FAccT '24. https://doi.org/10.1145/3630106.3658941
- Lee, J. D., and See, K. A. (2004). Trust in automation. Human Factors 46(1). https://doi.org/10.1518/hfes.46.1.50.30392
- Liu, N. F., Zhang, T., and Liang, P. (2023). Evaluating verifiability in generative search engines. Findings of EMNLP 2023. https://arxiv.org/abs/2304.09848
- McGuirl, J. M., and Sarter, N. B. (2006). Human Factors 48(4). https://doi.org/10.1518/001872006779166334
- Steyvers, M., et al. (2025). What large language models know and what people think they know. Nature Machine Intelligence. https://doi.org/10.1038/s42256-024-00976-7
- Vaccaro, M., Almaatouq, A., and Malone, T. (2024). Nature Human Behaviour 8(12). https://doi.org/10.1038/s41562-024-02024-1
- Vasconcelos, H., et al. (2023). Explanations can reduce overreliance on AI systems during decision-making. PACM HCI 7(CSCW1). https://doi.org/10.1145/3579605
- Yin, M., Wortman Vaughan, J., and Wallach, H. (2019). CHI '19. https://doi.org/10.1145/3290605.3300509
- Zhang, Y., Liao, Q. V., and Bellamy, R. K. E. (2020). FAT* '20. https://doi.org/10.1145/3351095.3372852
- Zhou, K., Hwang, J. D., Ren, X., and Sap, M. (2024). Relying on the unreliable. arXiv:2401.06730. https://arxiv.org/abs/2401.06730

Limits: most entries were read at abstract level or through the family's research digests; Zhou 2024 was read as a preprint.
