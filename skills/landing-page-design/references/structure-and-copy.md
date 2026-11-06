# Structure and copy

Read this when writing the page. It gives section patterns by page type, how to write each part, and how to handle proof, pricing and sign-up. Tags follow `CONTRIBUTING.md`: [E] empirical, [S] standard, [P] practitioner, [J] judgment. Sources are in `sources.md`.

## Contents

1. Start from claims
2. Section patterns by page type
3. The first screen
4. Headlines and body copy
5. Proof
6. Pricing pages
7. Waitlists, sign-up and contact
8. Footer and legal
9. Placeholder conventions

## 1. Start from claims

Before any layout, write the page as a numbered list:

```
1. Claim: Turns your timesheets into invoices in one click.
   Proof: 40-second demo of a real timesheet becoming an invoice.
   Action: Start free trial.
2. Claim: Works with the accounting tool you already use.
   Proof: List of integrations, each linking to its setup guide.
3. Claim: Costs less than an hour of your time each month.
   Proof: Pricing table, monthly, in GBP, VAT stated.
```

A section with no claim is cut. A claim with no proof is either softened or given a marked placeholder. This list is also the agent test script: each claim should be findable in the accessibility snapshot.

## 2. Section patterns by page type

These are common orders, not required ones. Convention helps visitors find things; the concept may reorder them for a reason.

| Page type | Usual sections | Notes |
|---|---|---|
| Product launch | Claim + action; product shown; how it works (3 to 5 steps); proof; price; objections (FAQ); action again | The demo or screenshot is usually the strongest proof |
| Waitlist or coming soon | Claim; what it will do; who it is for; the form; when they will hear; who is behind it | Say how often you will email and when the product is expected, if known |
| Pricing page | Plans table; what each includes; billing and tax; FAQ about limits, cancellation, refunds; contact for edge cases | See section 6 |
| Feature page | One feature's claim; it in use; detail; where it fits in the product; action | Link back to the main page; keep the same nav |
| Studio or personal | What you do and for whom; selected work with outcomes; how to hire; contact | Work is the proof; show results, not adjectives |
| Event or campaign | What, when (with time zone), where, cost, who it is for; agenda; speakers; register | Date, time and price as text, in the first screen |
| Open-source project | What it does in one line; install command; a minimal example; links to docs and repo; license | Developers want the command and the example first |

## 3. The first screen

Must contain, as text:

- **What it is**, in category words a stranger knows ("a time tracker for freelancers"), even if a more evocative line leads.
- **Who it is for** if not obvious from the category.
- **The primary action**, labelled with what happens.
- Usually, **the product itself**: a real screenshot, a working demo, a real photograph.

Visitors decide to stay or leave early. NN/g's reading of Liu, White and Dumais (2010) is that the first 10 seconds are critical, and that pages surviving about 30 seconds tend to be read for minutes [E]. The first screenful gets about 57% of viewing time and the first two about 74% (NN/g 2018, eye tracking, 120 participants, 1920x1080) [E]. Put key content and the main action there, and use later screens for supporting detail [P].

A false floor (a hero that looks like a complete page) stops scrolling. Let the next section show at the bottom edge [P].

## 4. Headlines and body copy

- **Specific over grand** [E]. In Nielsen's 1997 study, removing promotional language ("marketese") improved usability 27%, concise text 58%, scannable layout 47%, and all three together 124% (51 users). Old and small, but the direction matches later guidance (GOV.UK content design [S]).
- **Headline pairs.** A short evocative line can lead if a plain descriptive line sits beside it. Bad: "Unleash your potential". Better: "Invoices in one click" with "Turns your timesheets into invoices your clients can pay online".
- **Nouns from the user's world.** "Your timesheets", "your clients", not "your workflows" and "stakeholders".
- **Numbers with units and dates.** "Saves about 2 hours a month (median of 340 customers, Q3 2026)", not "Save hours every week".
- **Headings outline the argument.** Read the headings alone: they should tell the story. That is what screen-reader users and agents skim.
- **Link and button text names the outcome** ("See pricing", "Read the Acme case study"), not "Learn more" five times.
- **Left-align body copy.** Centred text is fine for one or two lines.

## 5. Proof

Ranked roughly by how much it shows rather than asserts [J]:

1. **The product working** on the page (demo, real output, free tool).
2. **Specific results** with a named customer, source and date.
3. **Quotes** from named people with role and company, used with permission. A photo only if it is really them.
4. **Customer logos**, only with permission and only of current or past customers.
5. **Aggregate numbers** (users, ratings) with a source and date.
6. **Press and awards**, linked to the original.

Legal floor [S]: in the US, the FTC rule on consumer reviews and testimonials (16 CFR Part 465, effective 21 October 2024) bans fake reviews and testimonials, including AI-generated ones and those attributed to people who do not exist or have no real experience. The Endorsement Guides (16 CFR Part 255) require that endorsements reflect honest experience and that material connections (payment, free product, employment) be disclosed. Other jurisdictions have similar rules.

Ratings shown in JSON-LD must be visible on the page and must come from real reviews.

## 6. Pricing pages

- **Publish prices** [P]. Nielsen named missing B2B prices the top web design mistake of 2002, and NN/g studies saw buyers leave for competitors that showed prices. If prices vary by customer, show representative cases ("A team of 10 on the standard plan pays about £90 a month") [P] (Nielsen 2006).
- **One real `<table>`** for plan comparison, with plan names as column headers and features as row headers (`<th scope>`). Ticks need text equivalents ("Included", "Not included"); a bare icon is unnamed for screen readers and agents.
- **State billing plainly**: currency, period, tax treatment, what "per seat" means, minimums, what happens at the limit, and how to cancel.
- **Totals include mandatory fees** [S]. In the US the FTC Rule on Unfair or Deceptive Fees (16 CFR Part 464, effective 12 May 2025) requires the total price up front for live-event tickets and short-term lodging; treat it as the honest default everywhere.
- **Discount claims** [S]. In the EU, an announced price reduction must show the lowest price applied in the prior 30 days (Price Indication Directive 98/6/EC, Art. 6a, added by the Omnibus Directive 2019/2161). National rules vary.
- **Monthly or annual toggle**: native radio group or segmented control with visible state, default declared next to the prices, and figures that change in text. Do not show annual-per-month without saying so.
- **Highlighting a plan** is fine; preselecting add-ons or making the cheaper path hard to find is a dark pattern [E] (Mathur et al. 2019; Luguri and Strahilevitz 2021 found hidden information and obstruction among the most effective, and most manipulative, patterns).
- **"Contact sales"** only for genuinely custom deals, and say what size of deal that is.

## 7. Waitlists, sign-up and contact

- Ask for the fewest fields that serve the next step. Email alone for a waitlist [J]. For anything longer, use `form-design`.
- Visible labels, not placeholders. Errors next to the field in words.
- Say what happens next and when: "We will email you once, when the beta opens (planned for January)."
- Marketing consent is a separate, unticked choice [S] (GDPR Art. 7 and the ePrivacy rules in the EU; CASL in Canada; check the jurisdiction).
- After submit, replace the form with the outcome and next step. Keep it on screen; do not rely on a toast.
- Double-submit safe: disable the button while sending, and make the server treat repeats as one sign-up.
- Spam protection that does not lock out people or assistive tech; avoid image CAPTCHAs as the only path [S] (W3C, *Inaccessibility of CAPTCHA*).

## 8. Footer and legal

Company name and contact, privacy notice, terms, cookie choices with an equal-prominence decline [E] (Nouwens et al. 2020 found most consent banners non-compliant and design strongly steers consent), and any regulatory disclosures. Links to docs, status page and pricing help both readers.

## 9. Placeholder conventions

When a fact or proof is missing, show it visibly and list it in the hand-off:

```
{{quote: from a current customer, with name, role, company, permission}}
{{price: Pro plan monthly, GBP}}
{{metric: active teams, with date and source}}
{{photo: the real product in use, not stock}}
```

Placeholders stay visible in previews so nobody ships them by accident. Never replace them with plausible inventions.
