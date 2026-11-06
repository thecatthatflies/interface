# Conversation mechanics

Read this when building the transcript, input, streaming, stop and regenerate, empty state, history, or error states. Tags: **[E]** empirical, **[S]** standard or institutional guidance, **[P]** practitioner, **[J]** judgment.

## Contents

1. Transcript markup
2. Streaming, visually
3. Streaming, for screen readers
4. Stop, regenerate, edit, branch
5. Empty state and starter prompts
6. Input and attachments
7. Errors, rate limits, context limits
8. History
9. Sources

## 1. Transcript markup

```html
<main>
  <h1>Refund policy question</h1>
  <section aria-label="Conversation" role="log" aria-live="off">
    <article id="msg-7" aria-labelledby="msg-7-meta">
      <p id="msg-7-meta" class="meta">You, 10:41</p>
      <p>Can I refund order 4821 after 30 days?</p>
    </article>
    <article id="msg-8" aria-labelledby="msg-8-meta">
      <p id="msg-8-meta" class="meta">Assistant, 10:41, complete</p>
      ...
      <button>Copy response 8</button> <button>Regenerate response 8</button>
    </article>
  </section>
  <div role="status" class="visually-hidden" id="gen-status"></div>
  <form>
    <label for="prompt">Message the assistant</label>
    <textarea id="prompt"></textarea>
    <button type="submit">Send</button>
    <button type="button" hidden>Stop generating</button>
  </form>
</main>
```

- Author and status are text, not only an avatar or color. [S] WCAG 1.3.1, 1.4.1
- Each message has a stable ID and is linkable. [J]
- Per-message actions are named with the message number or ID. Show them on focus and on touch as well as hover, and keep them in the DOM (reveal with opacity, not `display:none`). [S] foundation `agent-surfaces.md`
- The `h1` is the conversation title, which the person can rename. [J]
- Render model Markdown through a sanitizer with HTML disabled. Tables become real `<table>`, code becomes `<pre><code>` with a language label. [S] OWASP LLM05:2025

## 2. Streaming, visually

- Show that work started within about 100 ms of Send (the person's message appears, the status says "Generating"). [S] foundation response-time table
- If the first token takes more than about a second, say what is happening in words ("Searching your documents") rather than only animating dots. [S] foundation, [J]
- Do not move content under the reader. Follow the stream only while the person is at the bottom. A "Jump to latest" button appears once they scroll up. [J]
- Buffer incomplete Markdown constructs (an unclosed code fence or table row) until they close, so the layout does not flicker between formats. [J]
- Respect `prefers-reduced-motion`: no typewriter cursor animation or smooth auto-scroll when set. [S] WCAG 2.3.3
- The final message is marked complete in text. A truncated or stopped message says so. [J]

## 3. Streaming, for screen readers

What products do (azukiazusa 2026, tested with VoiceOver and Chrome on macOS) [P]:

- ChatGPT and Claude keep the response body out of any live region and announce start and completion from a separate visually hidden `role="status"`. Claude marks the conversation as a `feed` of `article` elements.
- Components that put the transcript in `role="log"` inherit `aria-live="polite"`, and streamed text can then be read in fragments; an NVDA and Firefox report described exactly that.
- Holding announcements with `aria-busy` is optional for screen readers under WAI-ARIA ("MAY"), so it is not reliable. `aria-relevant="additions"` alone has weak support.

Do this:

- History: `role="log"` or `feed` with `aria-live="off"`. [P]
- Status: one persistent `role="status"` element, present from page load, receiving short text: "Generating response", "Response complete", "Stopped", "Response failed, your message is saved". Clear it between turns. [S] WCAG 4.1.3; [P]
- Focus stays in the input after Send. Offer a keyboard shortcut to jump to the latest response, and say it once in the input's description. [P], [J]
- Short replies (one or two sentences, such as a voice-style assistant) may announce the full text once on completion. Long replies announce completion only; the person navigates to read. [J]
- Test with NVDA plus Firefox or Chrome and VoiceOver plus Safari; behavior differs between pairs. [P]

## 4. Stop, regenerate, edit, branch

| Control | Promise | Rule |
|---|---|---|
| Stop | End generation now, keep what exists | Partial answer stays, labeled "Stopped". Tool calls already running finish or are cancelled, and the step list says which [S] Mac HIG Stop vs Cancel, via foundation |
| Regenerate | New answer to the same prompt | Earlier answers remain as versions. Side-effecting tools are not re-run; say so if the turn had any [J] |
| Edit message | Change the prompt and get a new answer | The original stays reachable as a branch; later turns belong to their branch [J] |
| Branch navigation | Move between versions | "Response 2 of 3" with named previous and next buttons [J] |
| Delete message or conversation | Remove it | Undo for a short period, then gone from history, search, and memory [S] foundation undo-first, [J] |

Stop is visible during the whole generation, in the same place as Send, and works by keyboard (Escape while focus is in the composer is a common convention). [S] Amershi G8; [J]

## 5. Empty state and starter prompts

- One sentence on what the assistant does here, in this product's words. [S] Amershi G1
- Two to four starter prompts, each a real task it does well with this person's data. They fill the input for editing rather than sending at once. [J]
- One line on limits: what it cannot see or may get wrong, and that answers should be checked for the cases that matter. [S] Amershi G2; PAIR Mental Models
- No marketing claims ("knows everything about your business"). [S] foundation

## 6. Input and attachments

- Visible label, multi-line, Enter to send and Shift+Enter for a new line on desktop (state it once); on mobile, the return key adds a line and Send is a button. [J]
- Never clear the input until the message is accepted by the server. On failure, the text stays. [S] foundation
- Attachments show name, size, type, and upload status per file, with remove. Say which file types the assistant can read, and say when it could not read one rather than answering as if it had. [S] foundation (it tells the truth), [J]
- Character or token limits shown before they are hit, as text. [J]

## 7. Errors, rate limits, context limits

| Situation | Say |
|---|---|
| Network failed mid-answer | "The answer was cut off by a network error. Your message is saved." Retry continues or regenerates |
| Model or server error | What failed in plain words, whether retrying may help, and a reference code for support |
| Rate limit (HTTP 429) | Which limit, reset time in absolute terms ("resets at 15:00"), what still works. Use `Retry-After` when present [S] RFC 6585, RFC 9110 |
| Usage cap approaching | A warning before the cap, with remaining amount [J] |
| Refusal | That it will not help with this, briefly, without moralizing, and what it can do instead [J] |
| Context too long | That earlier messages are no longer in view of the model, and an offer to continue in a new conversation with a summary [J] |
| Retrieval empty | "I found nothing about X in the Help Center" rather than a fluent guess [S] foundation |

## 8. History

- List conversations by title and last activity with absolute dates; let people rename, search, pin, delete, and export. [J]
- Titles generated by the model come from the person's own prompt, and can be edited. Generated titles are model output: escape them. [J], foundation
- Shared conversation links show exactly what will be shared before the link is created, and can be revoked. [J]
- Deleting a conversation removes it from search and from memory derived from it, or says clearly what remains. [S] GDPR Art. 17, [J]

## 9. Sources

- azukiazusa (2026, Aug 11). How should a streaming chat UI announce its response to screen readers? https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui
- WAI-ARIA 1.2, `log`, `feed`, `status`, `aria-busy`. https://www.w3.org/TR/wai-aria-1.2/
- WCAG 2.2, 1.3.1, 1.4.1, 2.3.3, 4.1.3. https://www.w3.org/TR/WCAG22/
- Amershi, S., et al. (2019). Guidelines for human-AI interaction. CHI '19. https://doi.org/10.1145/3290605.3300233
- Google PAIR, People + AI Guidebook. https://pair.withgoogle.com/guidebook/
- RFC 6585 (429 Too Many Requests); RFC 9110 (Retry-After).
- OWASP Top 10 for LLM Applications 2025. https://genai.owasp.org/llm-top-10/
