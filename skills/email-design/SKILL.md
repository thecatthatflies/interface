---
name: email-design
description: Design, code and check HTML email that renders in real inboxes, reads well with images off, in dark mode and in a screen reader, and stays legible to AI mail assistants - transactional email (receipts, order and shipping updates, password resets, invitations, alerts) and marketing email (newsletters, announcements, promotions). Covers table-based layout for classic Outlook, Gmail's CSS limits and clipping, dark mode, preheaders, plain-text parts, accessibility, and CAN-SPAM and one-click unsubscribe basics, with a checker script. Use whenever someone asks for "an email template", "a newsletter", "a receipt email", "welcome email", "why does my email look broken in Outlook/Gmail", "make our emails work in dark mode", or builds React Email, MJML, Maizzle or ESP templates. Uses `brand-identity` tokens resolved to literal values. Not for web pages (`landing-page-design`), in-app notification UI (`web-app-design`), or deliverability infrastructure beyond what the template controls.
---

# Email design

An email is a message that has to survive hostile renderers: classic Outlook draws it with Microsoft Word, Gmail strips half of CSS and clips long messages, dark mode recolours it without asking, many people see it with images off, and a growing share is read first by an AI assistant that summarizes it. Models usually get it wrong by writing a web page: flexbox, CSS variables, web fonts, SVG, a hero image carrying the message, no plain-text part, no `lang`, and layout tables announced cell by cell to screen readers. The Email Markup Consortium's 2026 audit found serious or critical accessibility issues in 99.88% of 376,348 real emails, so copying common practice copies the failures.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first.

## Brief

- **Transactional or marketing?** It decides the law, the unsubscribe, the tone and the structure. Mixed messages are treated as marketing unless the transactional content comes first and the subject is about it (FTC).
- **The one fact or action** the reader needs, which must fit the subject line, the preheader and the first sentence.
- **Who reads it, on what:** the client mix if known (from the ESP's client report; open tracking is unreliable since Apple Mail Privacy Protection preloads images), languages and text direction.
- **Toolchain:** hand-coded, MJML, React Email, Maizzle, or an ESP editor. Who generates the plain-text part and the headers?
- **Who writes each field?** User names, invite messages, comments and product titles inserted into the template are outsider-written; mark them.
- **Brand:** `brand-identity` tokens, resolved to literal hex values and a fallback font stack.
- **Agent reader:** assistants summarize, triage and act on email. What must they extract correctly (amount, date, code, link)?

## Rules

### Structure and rendering

- **Lay out with tables, `role="presentation"` on each layout table** [S]. Classic Outlook for Windows uses Word's engine and supports neither flexbox nor grid (Can I Email), and Microsoft supports it until at least 2029. New Outlook uses a browser engine, so code for both. A table holding real data (an order summary) keeps its semantics and gets `<th>`.
- **One column, about 600 to 640 px wide, fluid below that** [P]. `width="100%"` with `max-width:600px`, plus a fixed-width table inside MSO conditional comments for Outlook. Wider layouts overflow reading panes and force sideways scrolling on phones.
- **Inline the CSS that matters; keep `<style>` in `<head>` for enhancements only** [S]. Gmail removes `<style>` in the body and drops style blocks over 16 KB; Gmail apps with non-Google accounts ignore `<style>` entirely (Can I Email).
- **Avoid what major clients drop** [S] (Can I Email): `display:flex` and `grid` (classic Outlook), `position` (Gmail, Outlook), CSS variables (Gmail, Outlook.com, Yahoo), `@font-face` (Gmail, Outlook.com, Yahoo), inline `<svg>` (Gmail, Outlook, Yahoo), `<video>`, forms, `<link>` stylesheets. Resolve brand tokens to literals at build time.
- **Keep the HTML under about 100 KB** [P]. Gmail clips messages near 102 KB behind "View entire message", often hiding the footer and unsubscribe link. Google does not publish the limit; ESPs (Mailchimp, Litmus, Klaviyo) report it.
- **Buttons are styled links, not images** [P] (Litmus): padding on the cell or link, readable text, a VML fallback only if rounded corners matter in classic Outlook.
- **Images are absolute https URLs with `width` attributes and alt text** [S][P]. Classic Outlook ignores CSS widths on images. Use PNG or JPEG, not WebP or SVG.

### Content and accessibility

- **`lang` and `dir` on `<html>` and again on the outer wrapper** [E][S]. 95.66% of audited emails lacked `lang` on body content (EMC 2026), and Gmail and others replace the `<html>` element.
- **A `<title>` matching the subject, one `<h1>`, real `<p>` and headings** [S] (Litmus; EMC: 74% lack an `h1`, 45% lack a title).
- **The message works with images off** [J]. No text baked into images without the same text in alt; no image-only emails. 47.88% of audited emails had images without alt (EMC 2026).
- **Links name their destination** ("Track order 4471"), never "click here" [S] (WCAG 2.4.4; 71% of audited emails had links with no discernible text).
- **Left-align copy longer than two lines** [P] (Litmus). Body text at least 14 to 16 px, contrast 4.5:1 in both light and forced-dark rendering [S] (WCAG 1.4.3).
- **A written preheader** [P]: the first element in the body, continuing the subject, hidden with `display:none; max-height:0; overflow:hidden; mso-hide:all`. Without one, inboxes show whatever text comes first, often "View in browser".
- **A plain-text part with the same facts and links** [S]. Send `multipart/alternative` (RFC 2046 §5.1.4), and write the text part rather than accepting a stripped dump. Text-only clients, some filters and many assistants read it.
- **No hidden text beyond the preheader** [S]. Gmail's sender guidelines warn that hiding content with HTML and CSS can get mail marked as spam, and hidden instructions look like prompt injection to AI assistants.

### Dark mode

- **Expect three behaviours** [P] (Litmus): no change (Apple Mail by default, Gmail web), partial inversion of light areas (Outlook.com, Outlook mobile, Gmail Android), full inversion (classic Outlook, Gmail iOS).
- **Design to survive inversion rather than to control it** [J]: logos as transparent PNG with a light outline or on their own solid tile, no text in images, avoid pure white on pure black, set both `bgcolor` and `background-color`.
- **`color-scheme` meta and `prefers-color-scheme` reach only some clients** [S]. Apple Mail and Outlook.com and mobile honor the media query; Gmail and classic Outlook do not (Can I Email). Add them for those clients; do not rely on them.

### Transactional email

- **The subject and first line carry the fact**: "Order 4471 shipped, arriving Thu 14 Nov", "Your Northwind code is 482 913" [J].
- **Amounts with currency, dates with time zone, reference numbers as text**, and a link to the live state (order page, account) because the email is a snapshot that goes stale [J].
- **Security email** (password reset, sign-in, new device): say what happened, when, from where, how long a link or code lasts, and what to do if it was not them. Never include a password [J].
- **Keep marketing out of transactional mail** or keep it secondary and after the transactional content [S]. Otherwise US law treats the whole message as commercial (FTC CAN-SPAM primary-purpose rule).
- **Outsider-written fields are escaped and framed as quotes**: "Maya Chen invited you" puts the inviter's name in a fixed sentence, never lets it form a link label, subject prefix or instruction [J]. Display names are a phishing vector.

### Marketing email

- **CAN-SPAM** [S] (FTC): truthful From, Reply-To and subject; identify the message as an ad; a valid postal address; a clear opt-out honored within 10 business days, working for at least 30 days after sending, asking for nothing beyond the email address and choices.
- **Gmail bulk senders (over 5,000 a day)** [S]: one-click unsubscribe with `List-Unsubscribe` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (RFC 8058), a visible unsubscribe link in the body, SPF, DKIM and DMARC, and spam complaints under 0.3% (Google sender guidelines).
- **Consent** [S]: EU, UK and Canadian rules (GDPR and ePrivacy, PECR, CASL) generally require prior consent for marketing email; check the market.
- **The unsubscribe link is plain, readable and reachable without signing in** [J]. A grey 9 px link in a clipped footer is obstruction.

### The agent reader

- **Facts an assistant must extract are text early in the message** [J]: amount, date, order or booking reference, code, deadline, and the one link.
- **Optional structured data for Gmail** [S]: schema.org markup in email (order, parcel delivery, reservations, one-click actions) is supported by Gmail for registered senders (Google, *Email Markup*). It must match the visible content.
- **Do not instruct assistants in the email**, visibly or hidden [J]. It is indistinguishable from injection.

## Build order

1. Brief, subject line, preheader and the plain-text version first: if the text part is clear, the design has a spine.
2. Skeleton from `references/building.md`: doctype, `lang`, `dir`, meta, title, preheader, wrapper, MSO conditional container.
3. Content blocks as presentation tables, one column, real headings and paragraphs.
4. Brand tokens resolved to literal values; fallback font stack; buttons as links.
5. Images with alt, width, PNG or JPEG, absolute URLs.
6. Dark-mode survivability, then optional `prefers-color-scheme` enhancements.
7. Headers via the sending platform: List-Unsubscribe and List-Unsubscribe-Post for marketing.
8. Check, render, fix, send tests.

## Verify

- `node <this-skill>/scripts/check-email.mjs email.html --text email.txt --kind marketing|transactional` (add `--json` for tooling). It flags CSS and elements major clients drop (with Can I Email slugs), missing `lang`, `dir`, title, `h1`, preheader, alt text, `role="presentation"`, widths over 640 px, size near Gmail's clipping point, vague or empty links, hidden text, missing unsubscribe and postal address for marketing, and a missing or mismatched plain-text part. It is static and a floor.
- **Real client matrix**, through Litmus or Email on Acid or real accounts: Gmail web and app (also with a non-Google account), Apple Mail iOS and macOS in light and dark, classic Outlook for Windows, new Outlook or Outlook.com, Yahoo. Look at every screenshot.
- **Images off**, **200% zoom**, and a **screen reader** pass (VoiceOver in Apple Mail): the message must make sense in each.
- **Final size** after the ESP rewrites links and adds tracking: still under about 100 KB.
- **Send a real test** and check headers (`List-Unsubscribe`, `List-Unsubscribe-Post`, authentication results) and that every link resolves.
- `node <interface-guidelines>/scripts/audit.mjs <email.html>` is useful for contrast and naming in a browser engine, but browser rendering is not inbox rendering.

## Traps

- Flexbox or grid layouts that collapse into one tall stack in classic Outlook.
- Brand tokens as `var(--brand)` that Gmail drops, leaving black text on a dark background.
- The whole message in one hero image, with `alt="banner"`.
- No preheader, so the preview reads "View this email in your browser".
- No plain-text part, or one that is a tag-stripped mess with tracking URLs.
- Layout tables without `role="presentation"`.
- A dark-mode logo that disappears on Gmail iOS's full inversion.
- Marketing footer pushed past Gmail's clip so the unsubscribe link is hidden.
- User-supplied names inserted into subject lines or link labels unescaped.
- Promotional blocks leading a receipt, turning it into commercial email.
- A hidden paragraph addressed to AI assistants.

## References

| File | Read when |
|---|---|
| `references/building.md` | Coding a template: skeleton, preheader, buttons, images, columns, dark mode, plain text, frameworks |
| `references/client-support.md` | Choosing a CSS or HTML feature; debugging Outlook, Gmail, Yahoo or Apple Mail |
| `references/sending-and-law.md` | Transactional versus marketing, unsubscribe headers, CAN-SPAM, consent, authentication, Gmail markup |
| `references/sources.md` | Before citing a number, or when someone asks why |
