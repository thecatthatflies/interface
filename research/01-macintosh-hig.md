# Macintosh Human Interface Guidelines (1992): digest

**Source.** Apple Computer, Inc., *Macintosh Human Interface Guidelines*. Addison-Wesley, first printing November 1992, ISBN 0-201-62216-5. Read from https://dn721903.ca.archive.org/0/items/apple-hig/Macintosh_HIG_1992.pdf (410 PDF pages).

**Page references** are printed page numbers. In the body of this PDF, PDF page = printed page + 24. Figures have no text layer, so I rendered the pages for every figure cited here and read them as images.

**Coverage.** Read in full: chapters 1 to 7, 9, 10, 11, and Appendix C (the checklist). Read in part: chapter 8 (pp. 224-233; the rest is pixel-level icon production) and Appendix B (the sections cited below).

**What is Apple's and what is mine.** The "Apple meant" lines and the rule tables paraphrase the book. Every "Agent translation", every "Agent:" note, every WCAG, ARIA, MCP or CLI cross-reference, and the verdicts are my analysis. The book says nothing about software agents, scripting or automation. Its only nods to a non-human reader or operator are a text-to-speech warning (p. 19), assistive software that emulates input (p. 27), a macro-key reservation (p. 280), and a localization aside about HyperTalk (p. 19). WCAG and ARIA references here come from my own knowledge and should be confirmed against the standards digest.

**Evidence grade.** Tier 2 under SCOPE.md (long-lived institutional guideline), with a caveat. This is a platform vendor's convention guide, not a research report. It almost never cites evidence inline, and its numeric thresholds (2 to 7 radio buttons, 5 to 12 pop-up items, 8 to 12 menu items) come with no citation. Treat those numbers as craft judgment. The bibliography lists research worth chasing: Miller 1981 on menu depth and breadth, and Walker and Smelcer 1990 on pull-down menus (both p. 342; the PDF prints the second name as Silencer), plus Hutchins, Hollan and Norman 1986 on direct manipulation, and Grudin 1989 arguing against consistency (both p. 341).

## Bottom line

The project's hypothesis is that the same principles serve people and agents. **It holds for the semantic part of the principles and fails for the sensorimotor part.**

- **What transfers:** what exists, what is possible right now, what state things are in, what just happened, why something was refused, and how to reverse it.
- **What does not transfer:** anything about the hand, the eye, or beauty, such as pointing, dragging, button position, animation, and pleasantness.
- **Tally of the 13 named items:** 7 direct, 2 hold only after amendment, 3 partial, 1 stretch (table in section 2.1).
- **Real conflicts:** the audiences want different things in six places (section 2.2). A skill claiming one principle set must state these outright.
- **Real gaps:** four agent needs have no genuine source in this book (section 2.3). Idempotency is one of them, so the SCOPE.md shorthand "undo becomes idempotency and dry-run" needs correcting: those are three separate mechanisms, and only two are in the book.

**Ratings used below.**

- **Direct:** the same rule, through a new channel.
- **Amended:** it holds only after changing something substantive.
- **Partial:** one part carries over and the other does not.
- **Stretch:** an analogy only; I would not put it in a shared principle set.

## 1. The principles

Apple names 11 design principles (pp. 4-13) and adds two further issues, audience and accessibility (pp. 13-14). It says up front that you will not be able to honor all of them all the time and must choose by what matters most for the task at hand (p. 4). The checklist repeats this: trade-offs are allowed if the spirit is kept (p. 351).

### 1.1 Metaphors (pp. 4-5). Stretch

**Apple meant.** Borrow what people already know about the physical world so they arrive with expectations: folders for storage, the desktop as a work surface, menus as lists of choices. A metaphor suggests a use without capping it. A screen folder need not share a paper folder's limits, so balance the borrowed expectation against what the computer can add.

**Agent translation.** An agent has no desk, and a folder icon reaches it only as a name. The nearest real equivalent is vocabulary: an agent arrives with expectations from other software, so `archive`, `trash`, `commit` and `draft` import assumptions the way a folder icon does. That is useful, but it is really Consistency with expectations (1.4) under another name. Metaphor adds one live warning: a borrowed word hides limits. Whether `trash` is recoverable, and for how long, must be stated, because the agent cannot infer it from looks. I would keep Metaphors as human-facing guidance and leave it out of the shared core.

### 1.2 Direct Manipulation (pp. 5-6). Partial

**Apple meant.** The object stays visible while the person acts on it and the effect shows at once, so it feels like handling the thing itself. The section then widens into what people want from tools: to see which actions are available, to learn of grave consequences while they can still back out, to get clues that a command is running, and if it cannot run, to learn why and what to do instead. Animation, used sparingly, reassures during long operations.

**Agent translation.** The physical half fails. Agents do not drag, so a drag-only path is a missing path. This is the one principle where the human optimum is actively bad for agents unless an equivalent command exists (a Move To command, `move(id, dest)`). WCAG 2.5.7 reaches the same rule for motor reasons. Animation is invisible unless it also sets `aria-busy` or a status. The semantic half transfers: address the object by a handle that stays valid during the operation, and return the changed object in the response so the effect can be seen without a second search. The list of wants on p. 6 is the best single paragraph in the book for tool design: available actions, consequences before commit, an in-progress signal, and a reason plus an alternative on refusal.

### 1.3 See-and-Point (p. 7; also pp. 52, 286). Direct for discovery, with limits

**Apple meant.** Two assumptions: people can see what they are doing, and they can point at what they see. Action takes a noun-then-verb form. Select an object, then choose from menus that list everything available for it, so nobody has to remember a command. A second form drags one object onto another that carries a meaning, such as the Trash.

**Agent translation.** Recognition over recall matters even more here, because an invented command or parameter is a recall failure. Enumerate everything: every action is a named control in the tree with nothing revealed only on hover, `--help` works at each CLI level, `tools/list` is complete, and objects report per-object availability the way GitHub's GraphQL `viewerCanUpdate` does. The book frames command lines as what the Mac replaced (pp. 268-269), but a CLI with layered help meets the same need. The principle is about enumerated choices, not graphics. Noun-first maps onto CLI grammar (`gh pr create` versus `kubectl get pods`), though nothing in the book shows one order is better for machines; the consistent pattern is what counts.

Three limits apply:
- Persistent selection is a liability for an agent, because the target can change between steps. Prefer an explicit `verb(id)` on each call. If a UI has select-then-act, expose the selected set and its count.
- The drag-onto-object form has no equivalent.
- Scanning a menu is free for a person, while reading a list costs an agent tokens (section 2.2).

### 1.4 Consistency (pp. 7-8; also pp. 39, 233). Direct

**Apple meant.** Learned skills, visual and behavioral, transfer between applications. Apple gives five questions: is the product consistent within itself, with earlier versions, with platform standards, in its metaphors, and with people's expectations? The last is the hardest and must be weighed against the target audience. Elsewhere: people read meaning into gratuitous differences (p. 233), and a standard element must never get new behavior (p. 39).

**Agent translation.** The same rule, and each of Apple's five questions has a concrete form.
- **Within the product:** the same parameter names, error shape and verbs across tools. `user_id`, `userId` and `uid` will be read as three things, which is exactly the p. 233 point.
- **Earlier versions:** API compatibility and stable selectors.
- **Platform standards:** native elements and correct ARIA roles, POSIX flag conventions, HTTP status meanings. A `div` acting as a button breaks the p. 39 rule in a way the tree makes measurable.
- **Expectations:** this becomes testable. Watch what an agent tries first. If its first attempt is wrong, the name or shape is wrong.

Apple's own bibliography lists Grudin's 1989 case against consistency (p. 341), so even Apple did not treat this as settled.

### 1.5 WYSIWYG (pp. 8-9). Amended, by reinterpretation

**Apple meant.** Two separate claims share the name. First, do not hide features behind abstract commands: everything should be findable, and anything initially hidden must show where more can be found (stepped interfaces, p. 35). Second, the screen matches the printout, and changes show quickly enough that nobody has to imagine the result.

**Agent translation.** The first claim is See-and-Point again, and it is direct. The second is literally about paper. My re-reading, which is not Apple's: the two renditions are now pixels and tree. Any significant difference between what a person sees and what an agent reads is the modern WYSIWYG bug. Examples are a grayed button with no `aria-disabled`, a chart with no data equivalent, a value clipped on screen but whole in the DOM, or text hidden from sight but present in the tree. That last case is also a prompt-injection path, so parity doubles as a safety check. A second pair of renditions is plan and apply: a dry run that does not match what runs is a broken printout. Unlike most of this list, parity can be checked by script.

### 1.6 User Control (p. 9; also pp. 183, 352). Partial

**Apple meant.** The person, not the computer, starts and steers actions. Apple criticizes software that decides what is good for the user or leaves them merely reacting. The balance it proposes is to warn with an alert and still let them proceed.

**Agent translation.** This splits into two relationships that behave differently.
- **Agent as operator.** No silent decisions: no auto-correcting arguments, no surprise retries or side effects, explicit parameters and overrides. This transfers directly.
- **Human supervising an agent.** Here the principle has the most force, because the agent is now the computer that acts while the person reacts. Apple's complaint is the core risk of agent supervision, and it supports approvals, visible activity and a stop control. The checklist rule that a background application must not seize control by posting an alert (p. 352) is a ready-made rule for background agents.
- **What does not transfer** is warn-and-proceed as the only safeguard. If the agent can press Proceed, the warning protects nothing. Authority has to sit with the person or a permission system, not in the dialog. Apple's better hook is access privileges (pp. 28-29).

### 1.7 Feedback and Dialog (pp. 9-10; also pp. 56-57, 270-271, 311). Direct

**Apple meant.** Keep people informed, as immediately as possible. Acknowledge input, say how long things take, and when busy explain what to expect, why, for how long, and how to get out. Messages must be plain: a crash notice carrying only a numeric ID helps nobody, whereas naming the cause lets the person avoid it next time.

**Agent translation.** The strongest match in the book.
- **Acknowledge:** a response or a job ID, never silence.
- **Duration:** HTTP 202 with a status URL, `Retry-After`, structured progress.
- **Busy, why, and the way out:** `aria-busy`, `role="status"`, `role="progressbar"` with values, and a cancel endpoint.
- **Errors:** what, why and next as separate fields.

Two amendments. An agent cannot perceive animation, so a spinner with no exposed state is no feedback at all. And an agent can act on codes, so the human rule against raw codes becomes: never only a code (section 2.2).

### 1.8 Forgiveness (p. 10; also pp. 113-114, 206-209). Amended

**Apple meant.** Actions are generally reversible, so people explore without fear. Warn before irretrievable loss. Clear options and timely feedback should make learning nearly error-free, so frequent alerts signal a design problem.

**Agent translation.** It holds, with three amendments.
1. **Separate the mechanisms.** Preview before acting (dry run, `terraform plan`, Apple's sample area on p. 209). Reversal after acting (Undo, soft delete, revert). Repeat safety (idempotency). The first two are in the book; the third is not (section 2.3).
2. **Scale.** Apple's norm is one level of undo (p. 113), which suits someone who notices at once. An agent may take 40 steps before anyone looks, so reversal needs a journal and grouping by run.
3. **Warnings.** An alert the agent can dismiss guards nothing. Apple's smell test survives, though: if an agent hits confirmation prompts constantly, make the operation safer instead of adding prompts. Severity should also be machine-readable, as with MCP's `readOnlyHint` and `destructiveHint` (which are hints, not guarantees).

### 1.9 Perceived Stability (p. 11; also pp. 52-55, 358). Direct, and stricter for agents

**Apple meant.** People coping with complexity need stable reference points. Visually: the desktop and fixed elements such as the menu bar and window border. Conceptually: a clear, finite set of objects and actions, with unavailable actions dimmed rather than removed. Apple notes that the goal is the perception of stability, not stability in a strict physical sense.

**Agent translation.** A finite, stable tool set. Dim rather than remove: `aria-disabled` plus a reason, or an API that answers with a reason instead of 404. A tool list that changes mid-session is the agent's version of a menu bar whose titles change. Apple's caveat flips, however. An agent has no perception, so it needs real identity stability. A re-render that looks identical to a person may give every node a new reference and break the agent, while a layout shift that disturbs a person means nothing to the agent. The two audiences need different things under the same word, so the skill should require both: no layout shift, and stable identifiers.

### 1.10 Aesthetic Integrity (pp. 11-12; also pp. 62, 72-75, 353). Partial, mostly human

**Apple meant.** Information is well organized and pleasant to look at for long stretches. Keep the display simple with few elements and no clutter, and consider paying for a graphic designer. Keep the meaning of standard items, avoid arbitrary symbols, make an element look like how it behaves, and let people adjust the look and keep what they set.

**Agent translation.** Beauty has no translation; an agent does not tire of a screen. A vision-driven agent gains a little from clear layout, but that is legibility rather than aesthetics. Three sub-rules carry over:
- Well organized becomes headings, landmarks and reading order.
- Few elements becomes a smaller tree and tool list, which costs fewer tokens.
- No arbitrary symbols becomes: an icon-only control with no accessible name is unreadable, the same failure Apple describes for people.

Move those three into the shared set and keep the rest as human-facing guidance.

### 1.11 Modelessness (pp. 12-13; also pp. 178, 189, 352). Direct

**Apple meant.** Avoid modes, because they restrict what people can do and lock them into one operation. Acceptable kinds are long-term (each application is a mode), spring-loaded (physically held, like Shift), and alert modes (keep rare). Others are fine if they mimic a real-life modal situation, change only attributes, or deliberately block on an unrecoverable error. Any mode needs a clear indicator near the affected object and easy entry and exit. The checklist goes further: a visible indicator does not guarantee people track the mode, so test, and if modes cause the errors, remove them (p. 352).

**Agent translation.** Hidden state is a classic agent failure, so the rule is at least as strong. `kubectl config use-context` and the working directory are modes; `--context` and absolute paths are modeless. Prefer explicit parameters. If a mode must exist, report it in every response and in the tree (`aria-modal`, `aria-pressed`). Spring-loaded modes have no analog, since they work because muscle tension reminds you. Apple also defends modal dialogs for unambiguous, all-at-once state changes (p. 189), the closest 1992 statement of a transaction. For an agent that becomes one call with required arguments.

### 1.12 Knowledge of Your Audience (pp. 13-14; also pp. 41-46). Direct

**Apple meant.** Study real people: write day-in-the-life scenarios, visit workplaces, break tasks into steps, and test with people who fit the audience. Design for people and their capabilities rather than for computers and theirs.

**Agent translation.** Treat the agent as a second audience and specify it the way you would a persona. Does it read the tree, an API or screenshots? What is its token budget? Does it retry? Who approves its actions? Apple's observation method ports almost unchanged (section 6.1).

### 1.13 Accessibility (p. 14; also pp. 19, 24-27, 230). Direct, and the historical bridge

**Apple meant.** The computer should be usable by everyone, across ages, abilities and languages, through different input and output devices, with worldwide support built in from the start.

**Agent translation.** The hypothesis has its best textual support here. Apple warns developers not to assume text is read by a person, since it may be spoken by a converter (p. 19). It explains that assistive software drives applications by emulating keyboard and mouse input, and warns that bypassing the system's input path breaks that software (p. 27). It wants every icon named, partly so the name can be read aloud (p. 230). An agent driving an accessibility tree is a client of the same kind. Two caveats: the book anticipates the client but not the mechanism, since it describes no semantic tree. And its framing of access features as additions that must not get in the way of able users (p. 25) is dated.

### 1.14 Not named as principles, but they act like principles

- **Progressive Disclosure (pp. 8, 35-37). Direct.** Show common choices first and offer a labeled way to more (More Choices, which becomes Fewer Choices). Apple's insistence that the existence of more is announced is the part that matters. Agent: `aria-expanded`, layered `--help`, lazy tool listing. This also eases the token cost of looking.
- **Feature restraint (pp. 34-35). Direct.** Apple lists what each feature costs: size, speed, interface complexity, documentation, more possible user errors, and effects on existing features. Agent: every added tool also raises the chance of choosing the wrong tool. Apple's term is *feature cascade*.
- **Collaborative computing (pp. 27-31). Direct.** See section 3.11. It holds up surprisingly well as a model for mixed fleets of people and agents.

## 2. Testing the hypothesis

### 2.1 Scorecard

| Named item | Rating | The agent rule that survives |
|---|---|---|
| Metaphors | Stretch | Words import assumptions; state the limits. Better filed under Consistency. |
| Direct Manipulation | Partial | Stable handles, and return the changed object. Drag needs a command equivalent. |
| See-and-Point | Direct | Enumerate every action and its current availability; never require recall. |
| Consistency | Direct | Same names, shapes and semantics across tools, versions and platform norms. |
| WYSIWYG | Amended | Parity between pixels and tree, and between plan and apply. |
| User Control | Partial | No silent decisions by tools; authority stays with the person, not the dialog. |
| Feedback and Dialog | Direct | Acknowledge, report progress as data, explain refusals with what, why and next. |
| Forgiveness | Amended | Preview and reversal, at agent scale. Confirmation is not a safeguard by itself. |
| Perceived Stability | Direct | Finite stable set; disabled with a reason, not removed; real identifier stability. |
| Aesthetic Integrity | Partial | Structure and few elements carry over. Beauty does not. |
| Modelessness | Direct | Explicit parameters over hidden state; surface any mode in every response. |
| Knowledge of Your Audience | Direct | Specify the agent as a persona, and test against it. |
| Accessibility | Direct | Agents are assistive-technology-class clients; this is the shared channel. |

### 2.2 Where the audiences actually conflict

| # | Conflict | Human need (source) | Agent need | Resolution I would test |
|---|---|---|---|---|
| 1 | What "stable" means | Things look the same; the physical truth does not matter (p. 11) | Identifiers and references survive re-render; looks do not matter | Require both, and test both separately |
| 2 | Labels that change with state | A single item reads Show Ruler or Hide Ruler; Undo names its operation (pp. 75-76, 113) | Finding by name breaks when the name flips | Apple's own preference: two opposite items (p. 76). Or a stable name plus a state attribute, which is also the ARIA APG toggle-button rule |
| 3 | What a confirmation guards against | Motor slips and habit: people stop reading dialogs and go by names and positions (pp. 103, 201, 207) | No slips and no habit, but wrong target, misreading, and the ability to self-confirm | Keep the dialog for people. Add a real authority check, bound to the exact action, for agents |
| 4 | Whether looking is free | Scan menus at will, no cost (pp. 52, 56) | Every item read costs tokens and latency | Keep looking free of side effects, as Apple says, but add paging, namespaces and lazy detail |
| 5 | Gestures | Dragging and pointing are the point of the interface (pp. 5-6, 268) | Not available, or brittle | Every gesture has a named command. Apple already bans double-click as the only route (p. 272) |
| 6 | Technical detail in messages | Avoid system-oriented information the person cannot act on (p. 199); hide network details (p. 31) | Codes, request IDs and exact causes are what it can act on | Two fields: human text plus a stable code. Never only a code, never only prose |

### 2.3 Agent needs with no real source in this book

Do not cite the HIG for these. The hook column is the nearest thing in the text, and I rate its strength honestly.

| Need | Nearest hook | Strength |
|---|---|---|
| Idempotency and safe retries over unreliable transport | Applications may disregard auto-repeated keystrokes for menu commands (p. 280); style toggles reverse on repeat (p. 73) | Weak. Apple's concern is a held key, not repeated delivery |
| Cost of reading (tokens, latency) | Limit the number of elements (p. 11); the feature cost list (p. 34) | Moderate, but the motive is cognitive rather than economic |
| Boundary between data and instructions (prompt injection through displayed content) | None directly. WYSIWYG parity (1.5) is my extrapolation | Very weak |
| Delegated identity and authority (acting for a person) | User identification: an anonymous guest label tells the owner nothing (p. 28); access privileges (pp. 28-29) | Good for attribution, none for delegation |

## 3. Concrete rules that still hold

Check codes: **A** can be audited by script on a rendered page. **R** needs a reviewer reading it. **U** needs testing with people or agents.

### 3.1 Commands and menus

| Rule | Ref | Check |
|---|---|---|
| Commands are verbs or verb phrases, attributes are adjectives, menu titles are singular category words that never change. Test names by fitting them into a sentence: act on my thing, or change the selection to this | pp. 54, 58-59, 310 | R. Agent: the same sentence test works for tool names |
| One word where possible, but never give up clarity for space. Button names never exceed three words | pp. 59, 206, 310 | A for count, R for clarity |
| Group by logic first and frequency second. Separate actions from attributes | pp. 60-61 | R |
| An ellipsis means the command needs more input before it can run. It does not mean a window will open (Get Info), and it does not mean a confirmation might appear | pp. 67-70, 207 | R. Agent: this is required arguments versus none. `aria-haspopup` makes a different claim (a popup opens) |
| Unavailable items stay present and dimmed. A fully disabled menu keeps its title and can still be opened | pp. 11, 54, 60, 358 | A: present in the tree with `aria-disabled` |
| Dimmed means normally available but not right now. Never use dimmed items as dividers, section titles or status text | pp. 63, 358 | R |
| Partial state is explicit: a check means the whole selection, a dash means part of it. A custom field that would be mixed stays blank rather than guessing | pp. 64-66, 123 | A: tri-state, `aria-checked="mixed"` |
| Toggles: prefer a pair of opposite items with a check. A single item must use opposite verbs (Turn Grid On, Turn Grid Off). Avoid labels that could be state or action (Use Grid) | pp. 76-78, 358 | R. Agent: `set_grid(true)`, not `toggle_grid`, which is not retry-safe |
| Stay flat: about 8 to 12 items per menu, one submenu level at most, no submenus while top-level room remains. Submenus suit attributes better than verbs | pp. 78, 80-82, 358 | A for depth. The numbers are craft |
| Shortcuts go only on the most frequent commands. Reserved shortcuts keep their meaning even if you do not support the command | p. 129 | R |

### 3.2 Choosing the right control

| Rule | Ref | Check |
|---|---|---|
| Radio buttons for 2 to about 7 choices, pop-up menu for 5 to 12, scrolling list above 12. Prefer radios for a few choices because they stay visible | pp. 83, 85, 210 | A for counts. The numbers are craft |
| A pop-up is a single choice with a visible current value. No multi-select, no commands (a command has no current value), no nesting | pp. 85-86 | R |
| Many-from-many uses checkboxes. A checkbox label must imply a clear opposite; if it cannot, use a pair of radios | pp. 85, 212-213 | R. Agent: boolean flags should name the deviation from default, as Find's checkbox does (p. 213) |
| Radio sets never change contents by context and never start an action | p. 210 | R. Agent: stable enums |
| Limited range uses a slider with labeled range and direction. Do not repurpose a scroll bar as a slider, or a scrolling list for a limited range | pp. 214-215, 221 | R |
| List plus free text: presets stay visible, typing is optional and validated, and a custom value appears apart from the presets | pp. 91-92 | R |
| A control's label text is part of what can be clicked | p. 210 | A: associated label |
| Do not give a standard element new behavior; design a new element for new behavior. Do not mix visual cues from different elements. Create new elements cautiously and with users | pp. 39-40 | A for role versus behavior, U otherwise |

### 3.3 Dialogs and buttons

| Rule | Ref | Check |
|---|---|---|
| Name buttons with the verb they perform (Save, Don't Save, Revert, Erase Disk) rather than OK, Yes or No. If a generic word is unavoidable, the message must make the action clear | pp. 102, 206-207, 209 | A: flag OK and Yes in confirmations. Agent: verbs also survive being read out of context |
| Cancel restores the prior state. Apple's definition: "dismiss the operation I started, with no side effects" (p. 207). If that is impossible, do not call it Cancel | pp. 207-208 | U |
| Stop halts and accepts partial results. Done closes and keeps changes when rollback is impractical. Relabel Cancel to Stop once cancelling is no longer possible | p. 208 | R. Agent: `cancel` and `stop` are separate verbs, and the job reports when `cancel` stops being available |
| The default button is the most likely action, but only if it is not dangerous. If it is dangerous, use no default or a safe one such as Cancel | p. 206 | A: no default on destructive actions. The book contradicts itself here (section 6.2) |
| Action button lower right, Cancel to its left, and positions do not change with which one is default | pp. 196, 356 | A. Exact placement is platform-specific; the fixed position is what survives |
| Keep buttons that lose data physically away from safe ones (Don't Save sits at the far left, aligned with the message) | pp. 103, 201 | A. Agent: position does not exist in a tree, but reading order does, so check it |
| One key, one meaning: if Return inserts text in a field, show no default button | p. 206 | R |
| Esc and Command-period map to Cancel. Esc is a panic exit but must never destroy valuable work. During a long operation, confirm first, with Cancel as the safe default (Fig. 10-10) | pp. 206, 277-278 | A for mapping, U for loss |
| One modal ideally, two at most. Never close one modal only to open another, a trap Apple calls *tunneling*. Cancelling the second returns to the first with its state intact | pp. 192-193 | U |
| Show the effect of a choice before commit: update live, or provide a sample area. Apply is discouraged in modal dialogs because it muddies OK and Cancel | p. 209 | R. Agent: dry run |
| A close control must have one meaning. Modeless dialogs have a close box and no dismiss buttons. Movable modal dialogs have no close box, because it would be unclear whether closing accepts or discards | pp. 180, 186 | R. Today's X on an edited form has the same ambiguity |
| Preset sensible values and prefill text, so people verify rather than generate. Place the selection in the first field | p. 179 | A. Agent: defaults visible in the schema and in `value` |
| A dialog's title matches the command that opened it, minus any ellipsis | p. 179 | A: compare accessible name to the trigger's label |

### 3.4 What makes an alert useful

| Rule | Ref | Check |
|---|---|---|
| Pick the right severity: note (informational, no risk), caution (before something dangerous, two buttons), stop (it cannot be done) | pp. 194-196, 357 | R. Agent: severity as a field |
| A good message names the failure, its cause, and the way forward. Figs. 11-3 to 11-5 show the same alert improving in three stages: a generic write error, then the named document and full disk, then a suggestion to use another disk | pp. 311, 357 | R |
| Name the document and application. Without them, a run of alerts during shutdown cannot be told apart | pp. 103, 199, 202 | R |
| The strongest form turns the failure into a choice. Fig. 1-2 replaces a dead end about a missing application with an offer to open the file in another named application, using a verb button | pp. 10, 199 | R. Agent: errors carry `suggested_actions` |
| Describe rather than judge. Use plain language in the person's vocabulary, and no system detail they cannot act on | pp. 199, 310-311 | R. Agent: see conflict 6 |
| Pose questions positively, with no double negatives | p. 355 | R |
| Ask whether the alert is needed at all. Prevent the error instead: do not offer an 80-character field if only shorter names work | p. 357 | A: `maxlength`. Agent: `maxLength` in the schema |
| Frequent alerts indicate a design defect | p. 10 | U: count alerts per task |
| Warn before irreversible changes to content. Do not warn about changes to the environment, such as window position | p. 114 | R |
| When an action cannot be carried out, always say so, explain, and offer alternatives | pp. 284, 351 | U |
| Failure must not destroy work. A full disk leads to a suggestion to save elsewhere, never to losing the document | p. 105 | U |
| A background application requests attention through a notification rather than seizing the screen with an alert | pp. 71, 352 | R. Agent: background agents notify; they do not interrupt |

### 3.5 Progress and response time

| Situation | Apple's rule | Ref | Agent or tree analog |
|---|---|---|---|
| Any input | Immediate visible acknowledgment. A keyboard-triggered button inverts for eight ticks (about 133 ms if a tick is 1/60 s, my gloss) so the person can see it took effect | pp. 9, 205 | Acknowledge in the response; never return nothing |
| Very short, about 1 to 2 s | Animated watch cursor | pp. 56, 105 | Synchronous response |
| Longer than a few seconds | Status dialog with estimated total and elapsed time, absolute or proportional | pp. 56, 105, 270-271 | Job ID plus polling; `role="progressbar"` with values |
| Long | Run it asynchronously in the background. A movable modal lets people switch away | pp. 56, 187 | Background job with a webhook or notification |
| The person may have left | A cursor change will not be seen, so use a more visible form | p. 57 | Do not rely on in-page state; persist a status |
| Throughout the operation | The menu title stays highlighted until the work completes | p. 56 | Pending state stays on the triggering control, and `aria-busy` |
| On finishing | Indicate completion; provide Cancel or Stop if it can be interrupted | pp. 351-352 | Terminal state in the status; a cancel endpoint |

The threshold is not fixed. It depends on whether the person is waiting for the result (p. 57). Find shows a progress dialog at about 4 seconds because people want to act on what it finds. Empty Trash waits about 8 seconds because nobody is waiting to use the outcome. Agent: block on results the next step needs, and detach for fire-and-forget work.

### 3.6 Input and commit

| Rule | Ref | Check |
|---|---|---|
| Keep three stages distinct: when input is entered, when it is checked, and when it takes effect | p. 182 | U. Agent: accepted versus validated versus applied. HTTP 200 and 202 must not be confused |
| Validate early. Checking only at dismissal forces a modal error and a restart | pp. 183, 220, 303 | U |
| Beware pending states on sensitive settings. A half-applied permission change can leave a system exposed | pp. 183, 189 | R. Agent: atomic batches |
| Quick operations may run automatically. Long ones need an explicit start, with a warning and an estimate | p. 183 | R |

### 3.7 Safety of looking, selecting and acting

| Rule | Ref | Check |
|---|---|---|
| Looking is free. Moving the pointer, opening a menu, an exploratory press, and scrolling a list commit nothing | pp. 55-56, 87, 221, 271 | U. Agent: reads have no side effects; `readOnlyHint` |
| Selecting never alters the object, commits nothing, and carries no penalty for a wrong choice | p. 286 | U |
| Press signals intent and release completes. Sliding off a control before release means nothing happens | pp. 165, 205, 271, 360 | A. This is WCAG 2.5.2 thirty years early |
| A click that activates an inactive window does nothing else, so an existing selection cannot be lost | p. 140 | U |
| Support Undo for operations that change content, prioritizing work that is costly to recreate. Name the operation in the command, show a dimmed Can't Undo when impossible, and scroll to show the effect | p. 113 | R. Agent: the undo label doubles as an audit-trail entry |
| Show the target before acting. If the selection has scrolled away, bring it back before operating, so it is clear what is changing | p. 167 | U. Agent: echo the resolved target in the confirmation and the result |
| Never strand people. A window cannot be moved beyond reach, hidden chrome needs a visible way back, and restored state must fit the current display | pp. 55, 147, 155, 170 | U |
| A double-click must never be the only way to do something | pp. 272, 360 | R. I would generalize this to every gesture |
| Separate content from environment. Moving a window saves its position but does not ask to save or change the date stamp | pp. 147, 154 | R. Agent: reads and view changes do not bump `updated_at` |
| Do not edit derived data in place. The Edition Manager forbids editing a subscriber and offers a button that opens the source | p. 120 | R. Relevant to dashboards |

### 3.8 Wording and help

| Rule | Ref | Check |
|---|---|---|
| Use the person's terms, not developer terms. Apple's table replaces internal type codes with what users see in the Finder | pp. 199, 307 | R |
| The same term on screen and in the documentation | p. 313 | A |
| Use complete sentences. Do not build messages from concatenated fragments, because word order changes in translation | p. 19 | R |
| Leave room for up to 50 percent text growth and keep strings out of code | pp. 17-18 | A: pseudo-localization |
| Documentation cannot repair a hard interface. Write it around tasks, not an inventory of features | pp. 313-314 | R |
| Help appears within the working context with no mode switch, and stays available during modal dialogs | pp. 314, 317 | R |
| Item-level help leads with what the person most wants, in active voice, describes one method only, and fits in about 180 characters. It answers what this is, what it does, or what happens on activation | pp. 317-319, 361 | R. Agent: a ready template for tool descriptions |
| Write separate help for each state of an item, and phrase it so the current state is clear | pp. 317, 322, 361 | R. Agent: state-aware descriptions |
| Help for a disabled item says what it does, then why it is unavailable. Fig. 11-11 shows the same Cut balloon with one added sentence giving the reason | pp. 318, 320-321, 324 | A: disabled controls have a description. Agent: `disabled_reason` |
| Help serves three question types: procedural, descriptive, troubleshooting | p. 315 | R. Agent: structure tool docs the same way |
| When a long name does not fit, cut the middle, because the distinguishing part is often at the end | p. 221 | A. Agent: never truncate identifiers in machine-readable attributes |
| Be consistent in capitalization and in singular or plural. Title case is Apple's house style; the consistency is what survives | pp. 306, 309-310 | A |
| Put a skilled writer on the design team, responsible for language on screen as well as documentation | p. 306 | Process |

### 3.9 Color, icons and sound

| Rule | Ref | Check |
|---|---|---|
| Color is never the only carrier of meaning; other cues must back it up | pp. 25, 263, 352 | A in part (WCAG 1.4.1). Agent: the tree has no color, so status must be text anyway. Same fix for both audiences |
| Add color to enhance meaning rather than decorate, and let people control it | p. 258 | R |
| For categories, start with 4 to 7 distinct colors, let people change them, and limit color elsewhere | p. 265 | A for count |
| Avoid light blue for text, thin lines and small shapes. Small areas need obvious color differences | p. 265 | A: contrast |
| Present color and similar concepts in the person's model, not the hardware's | p. 261 | R |
| Icons with labels beat icons or text alone. Nouns are easy to draw and actions are hard. Use text for error messages | p. 228 | A: icon-only controls flagged |
| Every icon has a name, partly so it can be read aloud. Avoid text inside icons and in-jokes | p. 230 | A: accessible name |
| Sound never carries important information alone | p. 26 | R |

### 3.10 Focus, layout and state

| Rule | Ref | Check |
|---|---|---|
| One active area with one indicator. People must be able to tell where the next input lands | pp. 138, 140, 198-199, 355 | A. Agent: explicit target IDs avoid the question altogether |
| Tab moves forward and Shift-Tab moves back | pp. 198, 299, 356 | A |
| Put the most important information first. The first impression goes upper left and actions lower right for Western readers | pp. 197, 353 | R. Agent: tree reading order |
| Open dialogs where the person's attention is, tied to the related document, leaving context visible | pp. 151-152, 192, 355 | U |
| A reactivated window returns exactly as it was, including scroll position and selection | p. 140 | U |
| The best size is not the largest. A window's standard state is the most useful size for the content, such as page width | pp. 168, 170 | R. Directly relevant to wide dashboards and text measure |
| Page by a windowful minus one unit of overlap to keep context | p. 164 | R. Agent: overlap in paged reads is a stretch but sometimes useful |

### 3.11 Shared data (from 1992, and ready for agents)

| Rule | Ref | Agent reading |
|---|---|---|
| Show who is using a shared resource. An anonymous guest label gives the owner nothing to act on | p. 28 | Attribute actions to a named agent and its principal |
| Make privileges simple to assign and clearly displayed. Accidental exposure is the common failure | pp. 28-29 | Show an agent's effective permissions |
| Warn others before withdrawing a shared resource. Fig. 2-8 gives both the time remaining and the absolute time | p. 28 | Warn before stopping shared work; report relative and absolute time |
| Make clear what can be edited now and, if not, why | p. 30 | Lock status with holder and reason |
| Display changes to shared data at once | p. 31 | Fresh state after other actors change it; stale-read detection |
| Tell the recipient when data will be lost moving between systems | p. 31 | Flag lossy conversions in the response |
| Tell people whether their data is encrypted | p. 30 | Report security state as data |

### 3.12 Preferences

A preference is something changed rarely. If people change it many times a session, give it easy modeless access instead. Avoid one giant preferences dialog, and remove settings that are special cases (p. 38). Feature costs are in section 1.14.

## 4. Dated rules: do not copy these blindly

| Rule | Ref | Why it is dated | What survives |
|---|---|---|---|
| Pixel specs: 20 px buttons, 59 px OK and Cancel, 3 px default ring, 13 and 23 px dialog margins, 12-point Chicago | pp. 197, 204-207 | Low-resolution bitmap displays. 20 px would miss today's target-size minimum (WCAG 2.5.8) | A consistent spacing system; a visible default |
| One menu bar at the top of the screen, always visible, with fixed standard menus | pp. 52-55 | Single-application desktop OS. Web apps have no such bar | A stable, predictable home for commands |
| Press and hold to open menus; tear-off menus; the 3 px tear distance | pp. 55-56, 92-95 | One-button mouse, hold-to-open habit. Touch and sticky menus replaced this | Browsing a menu commits nothing |
| One mouse button, and no right-click, touch or context menus anywhere | p. 269 | Hardware of the time | Nothing directly; the book is silent on these inputs |
| Keyboard is secondary: keyboard navigation is only ever a shortcut for the mouse and must never be the sole path. Tab reaches only fields and lists | pp. 198, 275, 282 | **Reversed.** All functionality must now work by keyboard (WCAG 2.1.1), and all controls take focus. p. 25 points the right way | Offer more than one path; one visible focus |
| Save, Save As, Revert, and the Don't Save alert as the core safety model | pp. 102-107, 201 | Autosave and version history removed much of the risk | Verb buttons; separating destructive choices |
| One level of Undo, with Undo and Redo as a single toggle | p. 113 | Memory limits. Multi-level undo is now expected | Naming the operation; scrolling to show the effect |
| Design in black and white first; palette limits to avoid color-table flashing; dithering; true gray | pp. 260, 263-264, 353 | 1-bit screens and indexed color | Never rely on color alone, and test without it. This now extends to dark mode |
| Icon craft: 45-degree lines, 34-color palette, upper-left light source, drop shadows | pp. 231-232, 354 | Bitmap icons and skeuomorphism | Consistent icon elements |
| Literal screen-to-printer WYSIWYG | pp. 8-9, 351 | Print is now a niche case | Parity between renditions (1.5) |
| Window cascade, one-fifth vertical alert position, multi-monitor placement, zoom box | pp. 147-152, 168-170 | Native desktop windowing; the web does not control this | Open near the person's attention; keep context visible |
| Modal alert for every error, plus the system beep; modal status dialogs for progress; alerts that block switching applications | pp. 146, 188, 190, 193-196 | Inline validation and non-blocking status now handle most of this, and web tabs rule out global blocking | Severity levels, message content, reporting progress; keep modality local |
| Stop alert with only OK | p. 196 | A dead end. Apple's own Fig. 1-2 is better | Say it cannot be done, and why |
| Flags as icons for region-specific keyboard layouts | p. 127 | Flags stand for countries, not languages, and carry political risk. Current localization practice avoids them | Icons must be localizable (p. 230) |
| Symbols cross language barriers better than words | pp. 224-225 | Backed only by an uncited mention of studies, and undercut by p. 228 | Use p. 228: labeled icons |
| Passwords: never show them even while typing; require entering them twice | p. 29 | NIST 800-63B now recommends offering to show the secret. Long passwords, which Apple allowed, have held up | Allow long secrets; give feedback per character |
| Flicker range of 10 to 50 Hz | p. 27 | Use WCAG 2.3.1 (three flashes per second) | Do not flash |
| Access features as additions that must not burden able users; the 43 million figure | pp. 24-25 | Framing and data are both old | Plan access from the start (p. 24) |
| Do not copy other platforms' elements | pp. 38, 262 | The web has no single platform owner | Follow the conventions of the platform you are on |
| The 80 percent solution: do not design for power users | p. 35 | Fine for general software, wrong if the audience is experts (an incident console). Measure 80 percent of the actual audience. An agent also cannot route around a missing capability the way a person might | Do not let elite users set the default |
| Click on versus click; device-specific verbs | p. 308 | Touch, voice and agents do not click | A controlled vocabulary |

## 5. Surprising or underrated: what modern guideline sets have lost

1. **The three stages of input (p. 182).** Entered, checked and in effect are three different states, and it is the designer's job to make them distinguishable. Optimistic UI often collapses them. For an agent, confusing accepted with applied is a direct cause of wrong answers. This may be the single most useful idea here for agent-facing surfaces.
2. **Cancel, Stop and Done are different promises (pp. 207-208).** Cancel guarantees no side effects, Stop admits partial results, Done keeps changes. The relabel at the point of no return is a piece of precision I rarely see in current systems. It maps directly to job APIs.
3. **Timing thresholds depend on what the person does next (p. 57).** Modern guidance usually quotes flat figures such as 0.1, 1 and 10 seconds. Apple doubles the patience for Empty Trash because nobody is waiting on the result.
4. **Disabled controls explain themselves (pp. 318, 320-321; Fig. 11-11).** The state-specific help pattern, which says what it does and then why it is unavailable, is exactly what agents need and what grayed-out web buttons usually lack. Apple even calls for special help when a setting elsewhere caused the dimming (p. 318).
5. **Text is not always read by a person (p. 19), and assistive software operates apps by emulating input (p. 27).** These are direct 1992 ancestors of the project's thesis.
6. **The test for modes (p. 352).** A visible indicator does not mean people track the mode. Test, and delete modes that cause errors. Modern guidance usually stops at showing the state.
7. **Alert frequency as a design metric, and prevention over warning (pp. 10, 357).** The 80-character example says the input constraint is the real fix. That is the case for strict schemas in one sentence.
8. **Content state versus environment state (pp. 114, 147, 154).** This one distinction decides what needs a warning, what needs Undo, and what may change a date stamp. Modern `updated_at` pollution shows the lesson was lost.
9. **The best size is not the maximum size (pp. 168, 170).** Apple warns against treating full screen as the default, which still applies to dashboards stretched across wide monitors.
10. **Middle truncation (p. 221).** A small rule that is often ignored, and it is the reason two nearly identical names can be told apart.
11. **Mixed state is a first-class state (pp. 64-66, 123).** Dashes mark partial selection, and a blank field is preferred over a misleading value. Bulk actions on dashboards often lose this.
12. **The Find checkbox story (p. 213).** The designers chose a checkbox over clearer radios because it names the departure from normal behavior. It is a rare case where Apple documents its reasoning and a trade-off against its own rule. It also shows how to name a boolean flag.
13. **The collaboration section (pp. 27-31).** Its rules on identity, visible privileges, reasons for locks, and warning others read as if written for mixed teams of people and agents.
14. **Principles collide, and the book says so (pp. 4, 351).** It asks you to rank by task context. A guideline set that admits this is more usable than one that pretends otherwise.

## 6. Method notes

### 6.1 Apple's user observation is a template for agent-operability tests

Apple's ten steps (pp. 42-46) port with little change, which supports the plan in SCOPE.md.

| Apple's step | Agent-operability version |
|---|---|
| Limit the scope. Tasks come from task analysis, written as short instructions that do not explain what you are testing (p. 42) | Tasks with known answers. The prompt does not name the controls |
| Ask participants to think aloud (pp. 43-44) | Keep the full reasoning and tool trace, which comes for free |
| Do not help. Decide in advance when you would step in (for example, after three minutes of struggle) and give no more information than real users will have (p. 44) | The operator gets only what a real agent gets. Predefine a step budget and abort rule |
| Do not demonstrate what you are trying to test (p. 45) | No leakage of the skill or the answers to the operating agent |
| Attribute difficulty to the design, not the participant (p. 45) | Score failures as interface defects first. This is a default stance, since agents do have their own limits |
| Keep an objective record, fix, and test again (p. 46) | Transcripts, then rerun after each revision |
| This is not an experiment and produces no statistical data (p. 43) | The same honesty as SCOPE.md's stated limits |

### 6.2 Internal contradictions: do not cite one side alone

- **Default button on a dangerous action.** The caution-alert text makes OK or Continue the default unless another task is needed to prevent data loss (p. 195), and Fig. 6-19 shows OK as default on a warning of irreparable damage. The button rule says no dangerous default (p. 206). The checklist says safest or most likely (p. 356). The same Revert alert appears with Revert as default in Fig. 4-69 (p. 107) and with Cancel as default in Fig. 7-6 (p. 209). I confirmed both by zooming into the figures. **Follow p. 206.** It is the explicit rule with a stated reason.
- **Keyboard.** Provide both a mouse and a keyboard method (p. 25), but keyboard paths are only ever shortcuts (pp. 275, 282). Follow p. 25 and current WCAG.
- **Apply button.** It is treated as a natural option in modeless dialogs (p. 182) and discouraged in modal ones (p. 209). These are compatible once you note the dialog type, but easy to misquote.
- **Symbols versus labels.** Symbols are said to beat words (pp. 224-225), then labeled icons are said to beat either (p. 228). Follow p. 228.
- **Clear command.** p. 117 places it in the File menu. Everywhere else it is in Edit (pp. 109, 277). This looks like a typo.

### 6.3 What the skill can safely take from this source

- **Cite as institutional guidance:** the semantic rules in section 3, especially 3.3 to 3.7.
- **Mark as craft judgment:** every numeric threshold, unless the bibliography research confirms it.
- **Mark as my synthesis, not Apple's:** everything about agents, including the pixels-and-tree reading of WYSIWYG.
- **Needs other sources:** idempotency, token cost, prompt injection, delegated authority.
