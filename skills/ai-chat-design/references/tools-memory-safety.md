# Tools, approvals, memory, and untrusted content

Read this when the assistant calls tools, takes actions, remembers things, or reads content others wrote. It applies the foundation's `references/oversight-and-safety.md` to a conversation; read that first for the evidence and the approval ladder. Tags: **[E]** empirical, **[S]** standard or institutional guidance, **[P]** practitioner, **[J]** judgment.

## Contents

1. Showing tool calls and agent steps
2. Approvals inside a conversation
3. Modes and autonomy
4. Untrusted content and output handling
5. Memory and data controls
6. Sources

## 1. Showing tool calls and agent steps

Each step is a row in the turn, in order, with:

| Field | Example |
|---|---|
| Verb and object in plain words | "Searched orders", "Updated ticket SUP-212", "Sent email" |
| Target | "customer: Lopez", "dana@acme.com", "src/billing.ts" |
| Result | "3 results", "status: Open to Pending", "failed: permission denied" |
| Kind | Read, or Changed something (visibly different) |
| Detail on expand | Arguments and raw output, as quoted data |

[S] foundation section 4 (attribute every action; show consequences and evidence); Amershi G11, G16

- Routine read steps collapse into "Searched 3 sources" once done; failures and changes stay expanded. [J]
- Running steps say they are running in text, with elapsed time for long ones, and the turn's Stop cancels them, reporting which finished. [S] foundation
- End each acting turn with a change summary: what changed, where, and how to undo each item. [S] foundation (outcomes outlast toasts), [J]
- The assistant's prose must agree with the step log. If prose says "I've updated the ticket" and the step failed, the step wins; show the failure next to the claim. [S] foundation (show what was observed, not what was requested)
- Long tasks: a plan or checklist at the top with each item's state, so a person returning sees where it is. Approving a plan sets direction; it does not authorize each later step. [E] Chen et al. 2026, via foundation

## 2. Approvals inside a conversation

Most actions should not prompt (foundation ladder rungs 1 to 4: do and offer undo, contain, grant through the person's own action, policy). Prompt when the action is severe and hard to reverse, the person can tell good from bad from what is shown, and this is the last point to stop it.

When a prompt fires, render a card, not a sentence:

```
Send email                                         [needs your approval]
To: dana@acme.com
Subject: Refund for order 4821
Body: (shown in full, scrollable)
Attachment: invoice-4821.pdf (42 KB)
This cannot be unsent.
Why: you asked me to reply to Dana's refund request (message 7).
                                    [Edit]  [Don't send]  [Send email]
```

- The buttons name the effect. "Send email", not "Approve" or "Yes". [S] foundation, Apple HIG Alerts
- A typed "yes" in the chat is not approval for a structured action: it is ambiguous about which action and which version. [J]
- The card is bound to the exact parameters and expires. If the agent changes anything, a new card is required. The server checks the binding at execution. [S] foundation section 6
- "Always allow" is scoped (this tool, this recipient or folder, this conversation), listed somewhere the person can see and revoke it. [S] foundation section 3; Chen et al. 2026
- Quoted evidence inside the card (the email being replied to) is marked as quoted with its source, because it may be attacker-written. [S] foundation section 5
- Severe actions get a look no routine card uses. [S] foundation section 3
- Track rejection rate per card type; types nobody rejects should move up the ladder. [S] foundation section 2

## 3. Modes and autonomy

- If the assistant can run in different modes (answer only, ask before acting, act automatically, read-only), the current mode is visible in the composer area at all times, and changing it is one step. [S] Sarter and Woods 1995; foundation
- Few modes. Each named by what it allows. [S] foundation
- Switching to a more autonomous mode states what will now happen without asking. [J]

## 4. Untrusted content and output handling

What the model reads (web pages, retrieved documents, emails, files, tool results, other agents' output) can carry instructions. Indirect prompt injection through retrieved content is demonstrated against real LLM-integrated applications (Greshake et al. 2023) [E] and is the top entry in OWASP's LLM list (LLM01:2025) [S]. No interface makes it safe; these rules reduce harm.

| Rule | Why |
|---|---|
| Show retrieved content as quoted, attributed blocks, visually and semantically separate from the assistant's prose | People can see which words came from where [S] foundation section 5 |
| Never place retrieved or model text into control labels, headings styled as UI, or tool metadata | Otherwise an attacker names what a button does [S] foundation |
| Render model Markdown with HTML disabled; no auto-loading remote images, iframes, or embeds; or proxy images through an allowlist | A Markdown image whose URL carries conversation data leaks it on render [S] OWASP LLM05:2025; [P] Rehberger, embracethered.com |
| Show link targets as domains; do not auto-follow links from model output | Link text can disguise the destination [S] foundation |
| When retrieved content contains instructions, show them as a flagged quote and ask before acting | Detection is imperfect; flag when detected, never rely on it [S] foundation |
| Keep private data, untrusted content, and outbound actions from meeting in one unattended turn, or gate the outbound step | The lethal trifecta [P] Willison; Rule of Two, Meta, via foundation |
| Escape model-generated conversation titles, summaries, and memory entries everywhere they appear | They are model output and can carry injected text [J] |

## 5. Memory and data controls

- A memory page lists each remembered item in plain words, with when and from which conversation it came; each can be edited or deleted; memory as a whole can be turned off. [S] Amershi G12, G13, G17; [P] vendor practice in ChatGPT and Claude
- When an answer used memory, say so near the answer ("Using your saved preference: metric units"), linking to the item. [S] Amershi G11
- A temporary conversation that is not saved to history or memory is available, and visibly different. [P] vendor practice
- New memories are announced when saved ("Saved to memory: you prefer metric units. Undo"). [J]
- Never store secrets, credentials, or health and financial details to memory without explicit request. [J]
- Data use: one clear statement of whether conversations are used for training, with the setting next to it. Deletion of a conversation or memory propagates to search, exports, and derived memory, or the interface says what remains. [S] GDPR Art. 17, [J]
- In team or shared assistants, say whose memory and which data sources apply, and never surface one person's private conversation to another. [J]

## 6. Sources

- Greshake, K., et al. (2023). Not what you've signed up for: compromising real-world LLM-integrated applications with indirect prompt injection. AISec '23. https://arxiv.org/abs/2302.12173
- OWASP Top 10 for LLM Applications 2025: LLM01 Prompt Injection, LLM05 Improper Output Handling, LLM09 Misinformation. https://genai.owasp.org/llm-top-10/ (numbering changes between editions).
- Rehberger, J. Embrace The Red, posts on data exfiltration through Markdown image rendering in LLM chat apps. https://embracethered.com/blog/
- Chen, C., et al. (2026). Comparing human oversight strategies for computer-use agents. arXiv:2604.04918.
- Sarter, N. B., and Woods, D. D. (1995). Human Factors 37(1). https://doi.org/10.1518/001872095779049516
- Amershi, S., et al. (2019). CHI '19. https://doi.org/10.1145/3290605.3300233
- Regulation (EU) 2016/679 (GDPR), Article 17.
- `interface-guidelines/references/oversight-and-safety.md` for the approval evidence, ladder, and authority rules.
