# Sending, law and machine-readable email

What the template must carry for the message to be lawful and delivered, and what to hand to the sending platform. Not legal advice; rules differ by market. Tags as in `CONTRIBUTING.md`; sources in `sources.md`.

## Contents

1. Transactional or marketing
2. CAN-SPAM in the template
3. Gmail sender requirements
4. Consent outside the US
5. Unsubscribe and preferences design
6. Authentication and headers
7. Gmail email markup
8. AI assistants as readers

## 1. Transactional or marketing

The FTC's CAN-SPAM guide decides by **primary purpose** [S]:

- **Transactional or relationship** content is narrow: confirming an agreed transaction, warranty or safety information, changes to an account or subscription, employment or benefit information, delivering goods or services already agreed. Such messages are exempt from most CAN-SPAM provisions but must not have false or misleading routing information.
- A message mixing the two is **commercial** if a recipient would read the subject line as an ad, or if the transactional part does not appear mainly at the beginning.

So: a receipt with a small "You might also like" block after the order details stays transactional; a receipt whose subject is "20% off your next order" does not [S].

## 2. CAN-SPAM in the template

For commercial email [S] (FTC, *CAN-SPAM Act: A Compliance Guide for Business*):

| Requirement | In the template |
|---|---|
| Accurate header information | From name and address identify the sender; Reply-To works |
| Non-deceptive subject | Subject matches the content |
| Identify as an ad | Clear and conspicuous; wording is flexible |
| Physical postal address | Street address, registered PO box, or registered private mailbox, in the footer |
| Opt-out | Clear explanation and a working mechanism; option to stop all marketing |
| Honour opt-outs | Within 10 business days; mechanism works for at least 30 days after sending; no fee, no information beyond email address and preferences, no more than one page visit |
| Responsibility | Applies even when a vendor sends on your behalf |

Penalties reach $53,088 per violating email (as adjusted January 2024).

## 3. Gmail sender requirements

From Google's *Email sender guidelines* (in force since February 2024) [S]:

- **All senders:** SPF or DKIM; valid forward and reverse DNS; TLS; spam rate in Postmaster Tools below 0.3% (aim under 0.1%); RFC 5322 formatting; HTML that follows standards; no content hidden with HTML and CSS.
- **Bulk senders (over 5,000 messages a day to Gmail):** SPF, DKIM and DMARC; From domain aligned with SPF or DKIM; marketing and subscribed messages support one-click unsubscribe and include a visible unsubscribe link in the body.
- **One-click unsubscribe:** headers `List-Unsubscribe: <https://example.com/u/abc123>` and `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (RFC 8058). The mail client sends a POST to that URL; the endpoint must unsubscribe without further interaction. A `mailto:` value may be included as well.

These headers are set in the sending platform, not the HTML. The checker cannot see them; inspect a received test message.

## 4. Consent outside the US

[S] Broadly, and check the market:

- **EU:** the ePrivacy Directive (Art. 13) requires prior consent for marketing email, with a narrow exception for similar products to existing customers who were given a chance to object; consent must meet GDPR Art. 7.
- **UK:** PECR, with the same "soft opt-in" structure.
- **Canada:** CASL requires express or implied consent, sender identification and an unsubscribe mechanism.

Sign-up forms that feed marketing lists use an unticked consent box and say what will be sent and how often (`landing-page-design`, `form-design`).

## 5. Unsubscribe and preferences design

- The link says "Unsubscribe", in body-size text with sufficient contrast, in the footer and before any clipping point [J].
- One click (or one confirming click) unsubscribes. Offer frequency or topic choices on that page as an alternative, never as a gate [J].
- Do not require sign-in [S] (CAN-SPAM limits what an opt-out may require).
- Confirm on the page: "You are unsubscribed from Northwind news. You will still get order and account emails." [J]
- Transactional mail does not need an unsubscribe, but account-notification email (comments, mentions) should link to notification settings [J].

## 6. Authentication and headers

The template team rarely owns DNS, but should know what a received test must show [S]: `spf=pass`, `dkim=pass`, `dmarc=pass` in Authentication-Results; a `Message-ID`; one each of From, To, Subject, Date; and, for marketing, both List-Unsubscribe headers.

## 7. Gmail email markup

Gmail supports schema.org markup inside email (JSON-LD or microdata) for orders, parcel deliveries, reservations, and one-click actions such as confirming or saving [S] (Google, *Email Markup*). Senders must register with Google and meet its guidelines before markup is shown. The markup must match the visible message. It is an enhancement for Gmail only; the visible text remains the source for everyone else.

## 8. AI assistants as readers

Mail clients and assistants now summarize and triage messages [J]:

- Put the fact, amount, date, reference and the one action in the first lines of the text and HTML parts.
- Keep the plain-text part complete; some tools read it rather than the HTML.
- Never include text addressed to an AI model, visible or hidden. It is indistinguishable from prompt injection, and hidden content is a Gmail spam signal.
- Treat inserted user-written text (names, comments, messages) as quoted data, escaped, inside a fixed sentence. Do not let it form subject lines, link text or anything that reads as an instruction from the sender.
