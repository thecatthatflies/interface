# Validation, errors, and flow

Read this when deciding when to validate, building the error state, writing messages, choosing between one page and many, or citing the evidence. Tags as in SKILL.md.

## Contents

1. What the evidence says, and how strong it is
2. When to validate
3. The error state, built
4. Writing error messages
5. One thing per page, or one page
6. Check answers, confirmation, save and return
7. Checkout specifics
8. Agents filling forms
9. Sources

## 1. What the evidence says, and how strong it is

| Claim | Strength | Basis | Use it as |
|---|---|---|---|
| Applying form guidelines as a bundle speeds completion and cuts errors | Moderate | Seckler et al. 2014, CHI, n=65, 20 rules applied together | Apply the set; do not credit any single rule |
| Errors listed after completion beat immediate per-field errors | Moderate, conflicting | Bargas-Avila et al. 2007, two studies (77 and 90 people) | Do not fire while typing; always show all errors at submit |
| On-blur inline validation raised success 22% and cut time 42% | Weak | Wroblewski 2009, ALA, 22 people, no statistics; "before and while typing" was worst | Inline only after a field is finished |
| Premature inline errors frustrate; errors should clear as soon as fixed | Practitioner | Baymard inline validation research; 31% of sites have none | Check on blur or on reaching expected length; clear on correction |
| Top-aligned labels are fastest | Weak | Penzo 2006 (informal eye-tracking, sample not reported, short forms); Das et al. 2008 (about 11 users) found right-aligned fastest; Jarrett 2010 disputes the workload inference | Choose top labels for narrow screens, zoom, translation; not as a proven speed win |
| Field count matters more than step count at checkout | Practitioner, commercial | Baymard 2024 benchmark: 5.1 steps, 11.3 fields average; 8 fields suffice for most | Cut fields first |
| One thing per page helps people understand, recover from errors, and use phones | Institutional | GOV.UK service manual; no published effect sizes | Default for rare or stressful public services; merge when research shows |
| Placeholder-only labels harm | Standard and practitioner | WCAG 3.3.2; NN/g | Never |

Expect small effects from individual tweaks. Fix the evident problems (missing labels, lost input, vague errors) before tuning.

## 2. When to validate

| Moment | Do | Why |
|---|---|---|
| While typing a first attempt | Nothing | All sources agree premature errors hurt |
| Field left, value complete and checkable alone (email shape, postcode format, card checksum) | Optional inline message | Wroblewski, Baymard; GOV.UK only if research shows benefit |
| Field reaches expected length (card number, postcode, one-time code) | May validate, or trigger a lookup | Baymard: postcode lookup on last digit, not on blur |
| Error shown, person edits | Re-check on each keystroke and clear as soon as valid | Baymard: stale errors mislead |
| Submit | Validate everything, client then server, show summary | GOV.UK; Bargas-Avila |
| Cross-field and server-only checks (account exists, stock, eligibility) | On submit or explicit check | Cannot be known reliably on the client |

Positive confirmation (a tick on a valid field) is reasonable for fields people often get wrong, such as card details; do not decorate every field. [P: Baymard]

Never disable submit to enforce validity on a long form; people and agents cannot learn what is missing. [S: GOV.UK button; foundation]

## 3. The error state, built

On a failed submit, all of these at once:

1. Keep every value entered, except a failed password.
2. Prefix the document title: `Error: Your details - Service name`.
3. Error summary at the top of `main`, below Back, above the `h1`: heading "There is a problem", then one link per error, in page order, each linking to the field (the first field of a group, the first radio of a set).
4. Move focus to the summary (make it focusable with `tabindex="-1"`).
5. Beside each field: the same message, as visible text, between label/hint and input, tied by `aria-describedby`; `aria-invalid="true"` on the input.
6. Keep server-rendered errors identical to client ones.

```html
<div class="error-summary" role="alert" tabindex="-1" aria-labelledby="error-summary-title">
  <h2 id="error-summary-title">There is a problem</h2>
  <ul>
    <li><a href="#email">Enter an email address in the correct format, like name@example.com</a></li>
    <li><a href="#dob-day">Date of birth must be in the past</a></li>
  </ul>
</div>
...
<label for="email">Email address</label>
<p id="email-error" class="error-message"><span class="visually-hidden">Error:</span> Enter an email address in the correct format, like name@example.com</p>
<input id="email" name="email" type="email" autocomplete="email" spellcheck="false"
       aria-invalid="true" aria-describedby="email-hint email-error" value="jo@">
```

`aria-errormessage` has better semantics (announced only when invalid) but uneven screen reader support; reference the message from `aria-describedby` as well. [P: Roselli 2023; WebAIM 2025]

Bad: a red border and a shake animation. Bad: a toast reading "Please fix the errors". Bad: `setCustomValidity` bubbles only. Good: the structure above.

## 4. Writing error messages

GOV.UK's error message guidance, condensed [S]:

- Say what went wrong and how to fix it, in plain words, without blame: "Enter your National Insurance number", not "Invalid input" or "You forgot".
- Be specific to the cause. Write separate messages for empty, wrong format, too long, out of range, and not allowed.
- Use the field's own words, so the summary link and the label match.
- For format errors, give an example: "Enter a postcode, like SW1A 1AA".
- For ranges, name the range: "Amount must be between £1 and £10,000".
- Do not use "valid", "invalid", "error", "oops", or humour.

| Cause | Bad | Good |
|---|---|---|
| Empty | "Required" | "Enter your full name" |
| Format | "Invalid date" | "Date of birth must include a month" |
| Range | "Out of range" | "Date of birth must be in the past" |
| Server | "Something went wrong" | "We could not check your postcode right now. Enter your address manually, or try again in a few minutes." |

## 5. One thing per page, or one page

GOV.UK starts each form by splitting it so each page holds one thing: one piece of information, one decision, or one question. It lists the benefits: people understand what is asked, focus on one answer, find their way through an unfamiliar process, use phones, and recover from errors; teams can save as people go and analyse each question. Merge pages only when research shows it works, as for internal services where staff repeat and switch tasks quickly. [S: GOV.UK form structure]

Decide by the three questions from the foundation:

| | One question per page | One page, grouped |
|---|---|---|
| Frequency | Rare, once in a while | Daily, repeated |
| Expertise | Unfamiliar process | Practiced staff |
| Device | Phone likely | Desk, keyboard |
| Branching | Heavy | Little |
| Cost per extra page load | Acceptable | Adds up |

For agents, extra pages add steps and cost with no completion gain in one measured study (Affora, interface-guidelines agent reference), so do not split a short, simple form for its own sake.

On question pages: the question is the `h1` (the `label` or `legend` itself), a caption names the section, a Back link sits at the top, the button says "Continue", and the browser's Back button works. [S: GOV.UK question pages]

Progress: show "Step 2 of 4" or section names only when the length is fixed and known; with heavy branching a step counter lies. [J]

## 6. Check answers, confirmation, save and return

**Check answers** [S: GOV.UK]

- Summary list of every answer under the original questions, grouped by section.
- One Change link per answer, whose accessible name includes the field ("Change date of birth").
- After a change, return to check answers; ask any new questions the change triggers first.
- State that the submission is not complete until they confirm, and place any declaration above the button.
- Button names the act: "Accept and send", "Send application", "Pay £42.00".

**Confirmation** [S: GOV.UK confirmation pages]

- Panel with the outcome and a reference number, then what happens next and when, how to get help, and whether an email was sent.
- Survives reload and is reachable later (an account page or the email).

**Save and return** [J]

- Save as people go on one-thing-per-page flows; say so ("Your answers are saved").
- Before timing out, warn with time remaining and a way to extend (WCAG 2.2.1); after timeout, keep answers where policy allows.
- A returning person lands on the task list or the first unanswered question.

## 7. Checkout specifics

From Baymard's checkout research [P], which is commercial and not peer reviewed but large and repeated:

- Guest checkout prominent; offer account creation on the confirmation page.
- One full-name field; address line 2, company, and coupon code behind links.
- Billing same as shipping, checked by default, with billing fields hidden rather than prefilled.
- City and region autodetected from postcode where reliable, below the postcode, editable.
- Explain why phone is needed if required.
- Order summary with total visible at every step on desktop and reachable on mobile.
- Delivery date or range before payment, not after.

For store-level layout, cart, and product pages, use `ecommerce-design`.

## 8. Agents filling forms

What helps an agent also helps autofill and assistive technology [J, from the agent-surface evidence in interface-guidelines]:

- Names: each control's accessible name is its visible label; repeated sections are distinguished ("Traveller 2 date of birth").
- Choices are enumerable in the tree: native `select`, visible radios. Hidden native radios behind styled labels drop out of the tree entirely.
- Constraints appear as text before submission. A `pattern` attribute is invisible.
- Errors are text, adjacent to the field and in the summary, and persist until fixed.
- Submit is safe to retry; the confirmation states what was recorded so the agent can report it.
- Consequential steps keep authority on the server. Check-answers pages help people; an agent can click through them.

## 9. Sources

**Standards and institutional**

- WCAG 2.2: 1.3.1 Info and relationships, 1.3.5 Identify input purpose, 2.2.1 Timing adjustable, 2.5.7 Dragging, 3.3.1 Error identification, 3.3.2 Labels or instructions, 3.3.3 Error suggestion, 3.3.4 Error prevention (legal, financial, data), 3.3.7 Redundant entry, 3.3.8 Accessible authentication (minimum), 3.3.9 (enhanced). https://www.w3.org/TR/WCAG22/ and Understanding documents.
- WHATWG HTML, Autofill (autocomplete tokens, `section-`, `shipping`/`billing`, `webauthn`). https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill
- GOV.UK Design System: question pages, check answers, validation, error summary, error message, button, date input, addresses, passwords, password input, task list, character count, confirmation pages. https://design-system.service.gov.uk/
- GOV.UK Service Manual, Structuring forms. https://www.gov.uk/service-manual/design/form-structure
- GOV.UK technology blog, "Why the GOV.UK Design System team changed the input type for numbers", 24 Feb 2020. https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/
- NIST SP 800-63B-4, section 3.1.1 Password verifiers. https://pages.nist.gov/800-63-4/sp800-63b.html
- W3C Internationalization, Personal names around the world. https://www.w3.org/International/questions/qa-personal-names
- MDN, `inputmode`. https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode
- WAI-ARIA Authoring Practices, combobox and radio group patterns. https://www.w3.org/WAI/ARIA/apg/
- GitHub Primer, Saving pattern. https://primer.style/product/ui-patterns/saving/
- CJEU, Planet49 (C-673/17), 1 Oct 2019, on pre-ticked consent.

**Empirical**

- Seckler, M., et al. 2014. Designing usable web forms. CHI '14. https://doi.org/10.1145/2556288.2557265
- Bargas-Avila, J. A., et al. 2007. Usable error message presentation in the World Wide Web. Interacting with Computers 19(3). https://doi.org/10.1016/j.intcom.2007.01.003
- Das, S., McEwan, T., Douglas, D. 2008. Using eye-tracking to evaluate label alignment in online forms. NordiCHI '08. https://doi.org/10.1145/1463160.1463217
- Penzo, M. 2006. Label placement in forms. UXmatters. https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php (informal; treat as weak)

**Practitioner**

- Wroblewski, L. 2009. Inline validation in web forms. A List Apart. https://alistapart.com/article/inline-validation-in-web-forms/ (n=22, no statistics)
- Baymard Institute: checkout form fields (2024 benchmark), inline form validation, postcode autodetection. https://baymard.com/blog/checkout-flow-average-form-fields, https://baymard.com/blog/inline-form-validation, https://baymard.com/blog/zip-code-auto-detection
- Jarrett, C. 2010. Label placement on forms (slides). https://www.effortmark.co.uk/wp-content/uploads/2010/04/Label-placement-on-forms-STC-Seattle-2010.pdf
- Roselli, A. 2023. Exposing field errors. https://adrianroselli.com/2023/04/exposing-field-errors.html
- WebAIM 2025, Up and coming ARIA. https://webaim.org/blog/up-and-coming-aria/
- web.dev, Sign in with a passkey through form autofill. https://web.dev/articles/passkey-form-autofill
- Stripe, Idempotent requests. https://docs.stripe.com/api/idempotent_requests
- Nielsen Norman Group, placeholder text in form fields. https://www.nngroup.com/articles/form-design-placeholders/

**Limits.** The Wroblewski figures come through secondary summaries and the research digest in `research/05-empirical-hci.md`; GOV.UK's start-page, confirmation-page, error-message, and conditional-reveal guidance were not re-read for this skill; Baymard's card-field recommendations (order, type detection, spacing) are from its public articles as commonly summarized and were not re-read; the NIST 64-character maximum was not re-read in revision 4.
