# Fields

Read this when choosing the control, `type`, `inputmode`, and `autocomplete` for a field, and for the patterns behind common questions. Tags as in SKILL.md. Sources are listed at the end of `validation-and-flow.md`.

## Contents

1. Choosing a control
2. Type, inputmode, autocomplete: quick table
3. Names
4. Email and phone
5. Addresses
6. Dates and times
7. Numbers, money, quantities
8. Payment cards
9. Passwords, passkeys, one-time codes
10. Choices, consent, and declarations
11. Files
12. Free text

## 1. Choosing a control

| Situation | Control | Basis |
|---|---|---|
| One of 2 to about 5 options people should compare | Radios in a `fieldset` with `legend` | [S] GOV.UK; counts are craft, see foundation |
| One of a closed list up to about a dozen, familiar values | Native `select` | [S] Mac HIG 1992 pp. 85-86; [J] |
| One of a long list (countries, airports, occupations) | Text input with type-ahead suggestions (combobox) plus free entry where valid | [S] APG combobox; [J] |
| Any number of a few options | Checkboxes in a `fieldset` | [S] GOV.UK |
| A yes/no question that must be answered | Two radios, not one checkbox | [S] GOV.UK; Mac HIG p. 213 (a checkbox needs a clear opposite) |
| A setting that applies immediately | Switch, outside any submit form | [S] Primer saving; foundation |
| A precise number | Text input | [S] GOV.UK (avoid sliders where precision matters) |
| A memorable date | Three text inputs | [S] GOV.UK date input |
| A date chosen relative to a calendar (booking) | Text input plus an optional calendar, never calendar only | [J] |

Custom dropdowns and comboboxes expose only their current value to most agent serializers when closed; native `select` lists every option (probe in `interface-guidelines/references/agent-surfaces.md`). Prefer native unless type-ahead is needed.

## 2. Type, inputmode, autocomplete: quick table

`autocomplete` tokens come from the WHATWG HTML autofill list. Prefix with `shipping` or `billing` where a form has both, and `section-<name>` where it collects two of the same thing (two travellers). `home`, `work`, `mobile` may precede contact tokens only.

| Field | `type` | `inputmode` | `autocomplete` | Notes |
|---|---|---|---|---|
| Full name | text | | `name` | One field by default |
| Given / family name | text | | `given-name` / `family-name` | Only when the parts are used |
| Email | email | | `email` (or `username` on sign-in) | `spellcheck="false"`; do not ask twice |
| Phone | tel | | `tel` (or `tel-national` with `tel-country-code`) | Accept spaces, dashes, `+` |
| Organization | text | | `organization` | Usually optional, hide behind a link at checkout |
| Street address, one box | textarea | | `street-address` | International manual entry |
| Address lines | text | | `address-line1`, `address-line2` | Line 2 behind a link |
| Town or city | text | | `address-level2` | |
| State, province, county | text or select | | `address-level1` | Only for countries that use it |
| Postcode / ZIP | text | (text; letters in many countries) | `postal-code` | Never `number`; optional for countries without postcodes |
| Country | select or combobox | | `country` (code) or `country-name` | Put it first when it changes the rest |
| Date of birth | 3 x text | numeric | `bday-day`, `bday-month`, `bday-year` | Accept month names |
| Website | url | | `url` | Accept without `https://` and add it |
| Username | text | | `username` | `autocapitalize="none"`, `spellcheck="false"` |
| Current password | password | | `current-password` | Show toggle; paste allowed |
| New password | password | | `new-password` | No confirm field when Show exists |
| Passkey-capable username | text or email | | `username webauthn` | With a conditional WebAuthn request |
| One-time code | text | numeric | `one-time-code` | One field; paste allowed |
| Card number | text | numeric | `cc-number` | Accept spaces; group in 4s visually |
| Card expiry | text (MM / YY) or 2 x text | numeric | `cc-exp` or `cc-exp-month` + `cc-exp-year` | Match the card's printed format |
| Security code | text | numeric | `cc-csc` | Say where to find it |
| Name on card | text | | `cc-name` | |
| Money amount | text | decimal | `transaction-amount` only for the person's own payment amount | Currency symbol outside the input |
| Quantity | number is acceptable, or text with numeric inputmode | numeric | | Only true quantities may be `number` |
| Search | search | | `off` is acceptable | Visible Search button |

GOV.UK replaced `type="number"` with `type="text" inputmode="numeric"` in 2020 after finding Dragon dictation could not fill it, NVDA announced it inconsistently, arrow keys and scroll wheels silently changed values, large values rounded or turned exponential, and Chrome discarded letters without feedback. [S]

## 3. Names

- One "Full name" field unless parts drive a behavior. Ask separately for "What should we call you?" if you greet people. [S: W3C i18n]
- Never require a family name; many people have one name. Mandatory family-name fields produce junk data. [S: W3C i18n]
- Accept any Unicode letters, spaces, hyphens, apostrophes, periods. Never force upper case or change case. Store in UTF-8 and size by bytes. [S: W3C i18n]
- Do not reject single letters as "initials"; warn if you must. Titles are optional. [S: W3C i18n]
- If you need a name in Latin script for a document as well as the native form, ask for both in separate fields and say why. [S: W3C i18n]

Bad: "First name*" and "Last name*" with `/^[A-Za-z]+$/`. Good: "Full name" with `autocomplete="name"` and no character rule.

## 4. Email and phone

- Ask for email once. Confirmation fields double effort and still pass typos; catch typos by suggesting a correction for common domain misspellings ("Did you mean gmail.com?") and by verifying through a sent link when it matters. [J]
- Validate email loosely (something@something). Strict regexes reject valid addresses. [J]
- Phone: say why you need it next to the field. Accept international format, spaces, dashes, parentheses; normalize on the server (E.164). If you split country code, use a country selector with the dial code visible and `tel-country-code`. [J]
- Do not require a phone at checkout unless delivery needs it; say so when it does. [P: Baymard]

## 5. Addresses

- **UK and other countries with a good address database:** postcode lookup first, results as a list, a "My address is not listed" or "Enter address manually" link always present. Accept postcodes in any case, with or without spaces. [S: GOV.UK addresses]
- **International:** ask country first, then show that country's fields, or use one `textarea` with `street-address` that accepts any format and allows paste. [S: GOV.UK addresses]
- **Multiple fields only when you know the countries** and have a format that fits them all. Make only the fields you truly need required; county optional or gone. [S: GOV.UK addresses]
- **Postcode optional for countries without one** (Ireland had none before Eircode; several countries still do not). [J]
- **Autofill city and region from the postal code where reliable,** placing them below the postcode and keeping them editable. Baymard reports that over half of testers in an older study misspelled city or state when typing. [P: Baymard]
- **Hide address line 2 behind a link.** [P: Baymard]
- Every field carries its `autocomplete` token, with `shipping` or `billing` where both exist. [S: WCAG 1.3.5; WHATWG]

## 6. Dates and times

- Memorable or look-up-able dates (birth, issue date): three labelled text inputs for day, month, year in a `fieldset` whose legend is the question, hint "For example, 27 3 2007". Accept "jan", "January", and numbers; Apply for teacher training saw errors drop sharply after accepting month names. [S: GOV.UK date input]
- Order fields by the respondent's locale convention, and say the order in the hint. [J]
- Date pickers suit choosing a date relative to today or to a calendar (bookings). Keep a typed path; calendar-only pickers are slow by keyboard and opaque to agents. [J]
- Times: say the time zone in words and, when respondents are spread out, show the converted local time. [J]
- Validate the range with a message that names it: "Date of birth must be in the past". [S: GOV.UK error message]

## 7. Numbers, money, quantities

- Text input with `inputmode="decimal"` for money; currency symbol as a visible prefix outside the input, not typed. Accept "1,200.50", "1200.5", and locale separators. [S: GOV.UK; J]
- Units next to the field ("kg", "per month"), and the period for recurring amounts. [S: GOV.UK]
- `type="number"` only for genuine small quantities where the stepper helps. [S: GOV.UK 2020]
- State limits before entry ("Up to £10,000"). [J]

## 8. Payment cards

- Order: card number, expiry, security code, name on card, in the order printed on most cards. [P: Baymard; J]
- Do not ask for card type; detect it from the number and show the brand. [P: Baymard]
- Accept spaces in the number and format in groups of four as typed, without moving the caret. [P: Baymard]
- Explain where the security code is, inline, not only in a tooltip. [P: Baymard]
- Use the payment provider's hosted fields where possible; check they still expose labels, `autocomplete`, and errors to the accessibility tree. [J]
- Show the total, currency, and what the charge is for on the final button: "Pay £42.00". [S: GOV.UK button; J]

## 9. Passwords, passkeys, one-time codes

NIST SP 800-63B-4, section 3.1.1.2, for password verifiers:

| Rule | Level |
|---|---|
| Minimum 15 characters when the password is the only factor; minimum 8 when used within multi-factor | SHALL |
| No other composition rules (mixtures of character types) | SHALL NOT |
| No periodic forced change; force change on evidence of compromise | SHALL NOT / SHALL |
| No hints available to unauthenticated users | SHALL NOT |
| Allow password managers and autofill | SHALL |
| Permit paste where autofill APIs are unavailable | SHOULD |
| Offer to display the password while typing | SHOULD |

GOV.UK password input adds: hidden by default with a Show button; `autocomplete="new-password"` on creation, otherwise `current-password`; no confirm-password field; `spellcheck="false"` and `autocapitalize="off"`; no `maxlength`; do not say which of username or password was wrong; allow 5 to 10 attempts before lockout. [S]

**Passkeys.** Add `autocomplete="username webauthn"` to the username field and start `navigator.credentials.get({ mediation: 'conditional', ... })` on load; the browser then offers passkeys in autofill alongside saved passwords and the password path keeps working. After a password sign-in, offer to create a passkey. Do not ask people to choose "passkey or password" before they type. [S: WHATWG autofill `webauthn` token; P: web.dev]

**One-time codes.** One input, `autocomplete="one-time-code"`, `inputmode="numeric"`. Say where the code was sent and offer resend with a visible wait time. Six separate boxes are acceptable only if paste of the full code fills all of them and each box has a name ("Digit 1 of 6"); WCAG 3.3.8 fails split fields that reject paste. [S: WCAG 3.3.8]

**CAPTCHA.** Distorted text and logic puzzles fail WCAG 3.3.8 at AA without a non-cognitive alternative; object recognition is excepted at AA but not at AAA (3.3.9). Prefer invisible risk scoring and rate limits. [S: WCAG 3.3.8]

## 10. Choices, consent, and declarations

- Consent checkboxes start unchecked, and each covers one thing named in its label. Pre-ticked consent is invalid under GDPR (Planet49, CJEU 2019). [S]
- Declarations ("I confirm the information is correct") come at the end, after check answers, next to the binding button. [S: GOV.UK check answers]
- Sensitive questions (sex, gender, ethnicity, disability) say why they are asked, what happens if skipped, and include "Prefer not to say" where lawful. [J]
- "Other" options reveal a text field directly below, tied to the choice. [S: GOV.UK conditional reveal]

## 11. Files

- Native `<input type="file">` with a visible label; drag-and-drop is an addition, not the only path (WCAG 2.5.7). [S]
- State accepted types and maximum size before upload, in words. [J]
- Show each uploaded file with its name, size, and a Remove button named for the file ("Remove passport.pdf"). [J]
- Upload errors name the file and the remedy: "passport.heic is not a supported type. Upload a JPG, PNG, or PDF." [S: GOV.UK error message; J]

## 12. Free text

- Size the `textarea` to the expected answer, and show a character count that announces politely when near the limit, without blocking typing past it; validate on submit. [S: GOV.UK character count]
- Say what a good answer contains in the hint, not a placeholder. [S: GOV.UK]
- Text written here may be displayed to staff or agents later: treat it as untrusted data everywhere downstream. [J; see interface-guidelines oversight reference]
