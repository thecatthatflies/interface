---
name: form-design
description: Design, build, and review forms and multi-step flows that people finish without errors and agents can fill without guessing - sign-up and sign-in, checkout and payment details, address and contact forms, applications, onboarding questionnaires, wizards, settings forms, validation and error messages, passwords and passkeys. Use whenever someone builds or fixes a form ("add a sign-up form", "our checkout converts badly", "make these errors better", "why won't autofill work", "turn this into a wizard"), even if they only mention one field. Includes a rendered-page checker for labels, autocomplete, input types, paste, and error wiring. Not for the surrounding app shell, tables, or settings navigation (web-app-design), store layout and product pages (ecommerce-design), or native desktop dialogs (desktop-app-design).
---

# Form design

A form is a conversation in which the organization asks for something and the person pays in time, effort, and risk. It works when every question earns its place, each answer can be given in the person's own terms, and every mistake is caught early, explained in place, and fixable without losing work. The most common model failure is a form that looks finished and is not: placeholder labels, invented required fields, `type="number"` for card numbers, no `autocomplete`, errors only as browser bubbles or red borders, a submit button that says "Submit", and a success path that was the only path tested.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first. Its `references/human-interface.md` section 3 holds the baseline form rules (visible labels, optional marking, paste, validation timing, disabled submit, save behavior); this skill goes further and does not repeat them.

## Brief

Answer these before drawing a field. Write them down if the form has more than five questions.

- **What is each answer for?** Name the decision or action that uses it. A field with no named use is cut.
- **Who answers, how often, on what device?** Once-in-a-lifetime applicant on a phone, or a clerk entering 200 records a day at a desk. This decides one-thing-per-page versus one dense page.
- **Whose data is it?** The person's own (autofill applies, WCAG 1.3.5 applies) or someone else's (a recipient, a patient, a customer being entered by staff).
- **Do they have the answer to hand?** Passport number, policy ID, last year's income. If not, say up front what to gather, and allow saving.
- **What does a wrong answer cost,** and what is irreversible once submitted (payment, legal declaration, public post)?
- **Where are respondents?** Countries, scripts, address formats, phone formats, name structures.
- **What can the system already know?** Never ask for it (WCAG 3.3.7).
- **Agent reader:** will an agent fill this for someone (autofill extensions, browser agents, assistants)? Assume yes for anything public.

## Rules

### Ask less

- **Cut fields before designing them.** Each field must have a named use now, not "might be useful". Baymard finds the average checkout has 11.3 fields where 8 suffice; field count hurts more than step count. [P: Baymard 2024]
- **Collect a full name in one field** unless the parts drive a specific behavior (sorting, formal address). Many names do not split into given and family. Never require a family name. [S: W3C i18n; P: Baymard]
- **Hide rarely used fields behind a link,** not a required input: address line 2, company, coupon code. [P: Baymard]
- **Default billing address to shipping** with a checked box that hides the billing fields. [P: Baymard]
- **Offer account creation after the transaction,** not as a gate before it. [P: Baymard]
- **Allow "I do not know"** where that is a valid answer, rather than forcing a guess. [S: GOV.UK question pages]
- **Derive what you can:** city and region from postal code where reliable, card type from number, country from the address lookup. Keep derived values visible and editable. [P: Baymard]

### Structure and flow

- **Pick the shape from the brief, not habit.** Rare, stressful, or unfamiliar tasks: one question per page, with the question as the `h1`/`legend`. Frequent expert entry: one page, grouped, keyboard-fast. GOV.UK starts every service one-thing-per-page and merges only when research says so. [S: GOV.UK form structure]
- **Order questions as the person thinks about them,** easiest and most certain first, and branch so nobody sees a question that cannot apply. [S: GOV.UK; J]
- **Say what the person will need before they start** (documents, time, cost), and what happens after. [S: GOV.UK start pages]
- **Long multi-session forms get a task list** with plain statuses and save-and-return. Use one only when people cannot finish in one sitting or must choose their own order. [S: GOV.UK task list]
- **Back works.** Include a Back link on question pages and never break the browser's Back button; returning shows prior answers prefilled. [S: GOV.UK]
- **End consequential flows with a check-answers page:** each answer with a Change link whose accessible name names the field ("Change date of birth"), returning to the summary after the edit. [S: GOV.UK check answers; WCAG 3.3.4]
- **Multi-column layouts break reading order** for people and agents. One column, except naturally paired short fields (expiry month and year, city and postcode). [P: Baymard, Wroblewski; J]

### Labels, hints, and grouping

- **Label above the field.** The speed advantage reported by Penzo 2006 comes from a small, informal eye-tracking test and was contradicted by Das 2008; choose top labels because they survive narrow screens, long translations, and zoom, not because they are proven fastest. [E, weak: Penzo 2006, Das 2008]
- **Hints go between label and field and are tied with `aria-describedby`.** Format examples ("For example, 27 3 2007") belong in the hint, never the placeholder. [S: GOV.UK]
- **Group related controls with `fieldset` and `legend`:** every radio set, checkbox set, and multi-part answer (date, card expiry). The legend is the question. [S: WCAG 1.3.1; GOV.UK]
- **On a one-question page, the label or legend is the page heading** so screen readers hear it once. [S: GOV.UK question pages]
- **Mark optional fields with "(optional)"** and do not use asterisks for required. If most fields are optional, question whether they belong. [S: GOV.UK]

### Input types and autofill

- **Set `autocomplete` on every field about the person,** with the exact WHATWG token (`given-name`, `email`, `postal-code`, `cc-number`, `one-time-code`, `new-password`). It powers browser autofill, password managers, and agent filling, and it is a WCAG 1.3.5 requirement. `autocomplete="off"` on personal data is a defect. [S: WHATWG autofill; WCAG 1.3.5]
- **Use `type` for meaning and `inputmode` for keyboard.** `type="email"`, `type="tel"`, `type="url"` where they apply. Identifiers made of digits (card, postcode, account, code) are `type="text" inputmode="numeric"`, never `type="number"`, which drops leading zeros, changes on scroll, rounds long values, and confuses dictation software. [S: GOV.UK 2020; MDN]
- **Native controls first.** `select` for a closed list under about a dozen options, radios for a few options people should compare, a combobox with type-ahead for long lists such as countries. Custom dropdowns hide their options from agents. [S: APG; P: probe in interface-guidelines]
- **Memorable dates are three text fields** (day, month, year) with `bday-*` tokens for birth dates, accepting month names. Date pickers suit only dates people choose relative to a calendar. [S: GOV.UK date input]
- **Size the field to the expected answer.** A postcode box as wide as a street box hints wrongly. [S: GOV.UK; J]
- **Accept answers in the person's format:** spaces and dashes in card and phone numbers, any case in postcodes, month names, leading or trailing spaces. Normalize on the server. [S: GOV.UK]
- Field-by-field patterns (names, addresses by country, phone, money, cards, files) are in `references/fields.md`.

### Validation and errors

- **Validate on submit by default; inline only after the person leaves a field they have finished, and clear an error as soon as it is fixed.** Never flag on the first keystroke. Evidence conflicts: Bargas-Avila 2007 found errors listed after completion beat immediate errors; Wroblewski 2009 found on-blur inline validation helped (n=22). GOV.UK validates on submit; Baymard recommends on-blur and removing errors on correction. Decide by form length and how checkable the field is alone. [E: Bargas-Avila 2007; E, weak: Wroblewski 2009; S: GOV.UK; P: Baymard]
- **On a failed submit:** keep every answer, put an error summary at the top with one link per problem to its field, move focus to the summary, prefix the page title with "Error: ", and show the same wording beside each field. [S: GOV.UK error summary; WCAG 3.3.1]
- **Tie each message to its field** with `aria-describedby` (add `aria-errormessage` alongside if you like; its screen reader support is still uneven) and set `aria-invalid="true"`. The message must be visible text: agent serializers drop `aria-invalid` but keep adjacent text. [S: WCAG 3.3.1; P: Roselli 2023; P: probe in interface-guidelines]
- **Turn off browser validation bubbles** (`novalidate`) and render messages in the page. Bubbles vanish, cannot be linked from a summary, and are not page text. Server validation stays authoritative. [S: GOV.UK validation]
- **Write errors that say how to fix it, specific to the cause:** "Enter a date of birth in the past", not "Invalid date". One message per cause (empty, wrong format, out of range), in the form's words. [S: GOV.UK error message; WCAG 3.3.3]
- **A condition the person cannot fix by editing** (ineligible, account locked, service down) is a page with the reason and the next step, not a field error. [S: GOV.UK]

### Sign-in, passwords, passkeys

- **Let password managers and paste work.** `autocomplete="username"` and `current-password` or `new-password`; never block paste; no `maxlength` below 64; offer Show password; drop the confirm-password field when Show is offered. [S: NIST SP 800-63B-4 3.1.1.2; GOV.UK password input; WCAG 3.3.8]
- **No composition rules, no periodic expiry, no hints.** Check new passwords against known-breached lists instead and say why one was refused. [S: NIST SP 800-63B-4]
- **Offer passkeys without forcing a choice up front:** keep the username field, add `autocomplete="username webauthn"` and a conditional WebAuthn request, then offer passkey creation after a password sign-in. [S: WHATWG autofill; P: web.dev passkey autofill]
- **One-time codes:** one field, `autocomplete="one-time-code"`, `inputmode="numeric"`, paste accepted. Split single-digit boxes that reject a pasted code fail WCAG 3.3.8. [S: WCAG 3.3.8]
- **Do not say which of username or password was wrong.** [S: GOV.UK passwords]
- **Do not gate sign-in on a puzzle CAPTCHA.** Text and logic puzzles fail WCAG 3.3.8 without a non-cognitive alternative. [S: WCAG 3.3.8]

### Commit

- **The submit button names the outcome:** "Create account", "Pay £42.00", "Send application". "Continue" between steps; "Save and continue" only if it saved. [S: GOV.UK button; foundation]
- **Legal, financial, and data-deleting submissions are reversible, checked, or confirmed** with a review step (WCAG 3.3.4). The review shows exactly what will be sent and what it costs. [S: WCAG 3.3.4]
- **Submit is idempotent:** disable re-entry while in flight, show progress on the button, and protect on the server with an idempotency key. A retry after a timeout must not charge twice. [S: GOV.UK button; P: Stripe idempotency]
- **The confirmation page states what happened, a reference number, and what happens next,** and survives reload. A toast is not a receipt. [S: GOV.UK confirmation pages; foundation]

### For the agent reader

- Every control has a programmatic name that matches its visible label, and its choices are enumerable (native `select`, visible radios). [J]
- Constraints are visible text before submission (format, length, allowed values), not only in a `pattern` attribute. [J]
- Errors are text next to the field and in a summary, stable until fixed. [J]
- Each step's URL or heading tells where in the flow the agent is; Back and Change paths exist. [J]
- Text written by outsiders (prefilled from an email, a referral note) is shown as quoted data, never as a label or instruction. [J]
- Consequential submits keep authority on the server: a check-answers page helps people; it does not stop an agent that clicks through it. [J]

## Build order

1. List the questions with the use of each answer; delete those without one.
2. Choose shape: one page, one-thing-per-page, or task list. Sketch branching.
3. Write the copy: questions, hints, every error message per cause, button labels, confirmation.
4. Build with native elements: `label for`, `fieldset`/`legend`, correct `type`, `inputmode`, `autocomplete`, `novalidate`.
5. Server validation and idempotent submit, then client validation using the same messages.
6. Error state: summary, focus, title prefix, inline messages, preserved input.
7. Check-answers and confirmation pages; save and return if multi-session.
8. Style last; brand owns the look (`brand-identity`).

## Verify

- `node <form-design>/scripts/form-check.mjs <url|file|dist> --try-submit` against a local or test build. It checks names and visible labels, autocomplete validity and purpose, input types, paste, hidden native radios, group legends, error wiring, focus after a failed submit, and submit wording. Errors exit 1. `--try-submit` really submits: never point it at production.
- `node <interface-guidelines>/scripts/audit.mjs <url|dist>` for the general rendered audit (contrast, targets, keyboard, reflow, agent stability).
- **Fill it with a password manager and browser autofill** on a real profile: every personal field fills and nothing lands in the wrong box.
- **Fill it by keyboard only** and **at 320 px with 200% text.**
- **Fill it as an agent** from the accessibility snapshot alone: find each field by name, read every choice, submit wrong, read the errors, fix them, finish.
- **Bad data:** a one-word name, a 60-character name with an apostrophe and accents, an address in Japan and one in Ireland without a postcode, a pasted card number with spaces, a double-click on submit, a session timeout mid-flow.

## Traps

- Placeholder as label, or a floating label that shrinks into the border and fails contrast.
- `type="number"` for card, phone, postcode, or codes.
- `autocomplete="off"` to "stop autofill messing up the design".
- First name / last name split, required, with ASCII-only validation.
- US-shaped address (State dropdown, 5-digit ZIP) for an international audience.
- Validation that fires on the first keystroke, or errors that stay after the fix.
- A red border as the only error signal; an error in a toast; an error only in `aria-invalid`.
- Disabled submit with no hint of what is missing.
- Clearing the form, or the password, on any error besides a failed sign-in.
- "Submit", "OK", "Next" on the final, binding step.
- Six single-digit boxes for a one-time code that refuse paste.
- A wizard of three fields per page for a daily data-entry task.
- Inventing required fields (phone, date of birth, gender) the brief never justified.

## References

| File | Read when |
|---|---|
| `references/fields.md` | Choosing the control, type, `inputmode`, and `autocomplete` for any field; names, addresses, phones, dates, money, cards, files, consent |
| `references/validation-and-flow.md` | Validation timing, error summary markup, error wording, one-thing-per-page, check answers, task lists, checkout specifics, and the evidence and sources behind this skill |
| `scripts/form-check.mjs` | Verifying a rendered form |
