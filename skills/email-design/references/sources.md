# Sources

Sources behind the [E], [S] and [P] tags in this skill. Checked November 2026.

## Empirical [E]

- Email Markup Consortium (2026). *Email Accessibility Report 2026*. 376,348 HTML emails sent May 2025 to May 2026; 99.88% with Serious or Critical issues; 8 passed all automated checks. Most common issues: missing `dir` (97.41%), missing `lang` on body content (95.66%), layout tables without `role="presentation"` or `none` (83.78%), no `h1` (74.23%), links without discernible text (71.23%), missing `lang` on `<html>` (62.16%), insufficient contrast (58.48%), images without alt (47.88%), missing `<title>` (45.21%). https://emailmarkup.org/en/reports/accessibility/2026

## Standards, platform documentation and law [S]

- Can I Email, feature data (`https://www.caniemail.com/api/data.json`, updated 2026-09-16), including `html-style`, `css-at-media`, `css-at-media-prefers-color-scheme`, `html-meta-color-scheme`, `css-display-flex`, `css-display-grid`, `css-gap`, `css-position`, `css-float`, `css-margin`, `css-padding`, `css-max-width`, `css-border-radius`, `css-box-shadow`, `css-background-image`, `css-linear-gradient`, `css-variables`, `css-at-font-face`, `css-at-import`, `html-svg`, `image-svg`, `image-webp`, `html-picture`, `html-video`, `html-form`, `html-button-submit`, `html-link`, `html-hidden`, `html-lang`, `html-dir`, `html-role`, `html-h1-h6`. Per-feature test dates range from 2019 to 2026.
- Microsoft, *New Outlook for Windows: a guide to product availability* (2024): classic Outlook supported until at least 2029. https://techcommunity.microsoft.com/blog/outlook/new-outlook-for-windows-a-guide-to-product-availability/4078895
- Google, *Email sender guidelines*: requirements for all senders and bulk senders; one-click unsubscribe; spam rate; "don't use HTML and CSS to hide content". https://support.google.com/a/answer/81126
- Google, *Email Markup* (schema.org in Gmail; registration required). https://developers.google.com/gmail/markup
- RFC 8058, Signaling One-Click Functionality for List Email Headers. RFC 2369, List-Unsubscribe. RFC 2046 §5.1.4, multipart/alternative. RFC 5322, Internet Message Format.
- FTC, *CAN-SPAM Act: A Compliance Guide for Business*: header, subject, ad identification, postal address, opt-out within 10 business days and working 30 days, primary-purpose test, penalty up to $53,088 per email (2024 adjustment). https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business
- EU ePrivacy Directive 2002/58/EC Art. 13; GDPR Art. 7; UK PECR; Canada's Anti-Spam Legislation (CASL).
- WCAG 2.2: 1.3.1, 1.4.3, 2.4.4, 2.5.5. https://www.w3.org/TR/WCAG22/
- Apple (2021), Mail Privacy Protection, announced at WWDC 2021.

## Practitioners [P]

- Litmus, *7 Simple Tricks to Make Your Email Code More Accessible* (`lang`, alt text, `role="presentation"` on every table, semantic headings and paragraphs, left-aligned copy, contrast). https://www.litmus.com/blog/7-simple-tricks-to-make-your-email-code-more-accessible
- Litmus, *The Ultimate Guide to Dark Mode for Email Marketers* (three behaviours and clients, transparent PNG outlines, color-scheme meta, `prefers-color-scheme`, `[data-ogsc]`). https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers
- Gmail clipping near 102 KB: documented by ESPs (Mailchimp, Litmus, Klaviyo, ActiveCampaign help centres); Google does not publish the threshold.
- Mark Robbins, *Good Email Code* (goodemailcode.com): accessible email patterns including the `role="article"` wrapper.
- Hybrid ("spongy") fluid layout, MSO conditional tables, VML buttons and backgrounds: long-standing community practice documented by Litmus, Email on Acid and Campaign Monitor.

## Not verified here

- Exact preview-text lengths per client, and mobile Gmail clipping at sizes below 102 KB (reported by one ESP), were not checked against primary sources.
- Yahoo's bulk-sender requirements were not checked; this skill cites Google's only.
- The 600 to 640 px width is long practice, not a measured optimum.
