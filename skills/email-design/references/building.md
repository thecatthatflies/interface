# Building an email

Patterns that hold up across clients. Each was checked with `scripts/check-email.mjs`; render them in real clients before relying on them. Tags as in `CONTRIBUTING.md`; sources in `sources.md`.

## Contents

1. Skeleton
2. Preheader
3. Containers and columns
4. Buttons
5. Images
6. Type and color from brand tokens
7. Dark mode
8. Data tables (receipts)
9. Plain-text part
10. Frameworks and ESP editors

## 1. Skeleton

```html
<!doctype html>
<html lang="en" dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Order 4471 has shipped</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body { margin: 0; padding: 0; }
  @media (prefers-color-scheme: dark) { .bg { background-color: #1b1b1b !important; } .fg { color: #f2f2f2 !important; } }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background-color:#f4f4f4;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Arriving Thursday 14 November. Track it any time.</div>
  <div lang="en" dir="ltr" role="article" aria-roledescription="email" aria-label="Order 4471 has shipped">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4;">
      <tr><td align="center" style="padding:24px 12px;">
        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;">
          <tr><td class="fg" style="padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#1a1a1a;">
            <h1 style="font-size:24px;line-height:1.25;margin:0 0 8px;">Order 4471 has shipped</h1>
            <p style="margin:0 0 16px;">It should arrive on Thursday 14 November.</p>
          </td></tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td></tr>
    </table>
  </div>
</body>
</html>
```

Why each part is there:

- `lang` and `dir` twice: Gmail and others replace `<html>` and `<body>`, so the wrapper keeps them [S] (EMC report; Can I Email `html-lang`, `html-dir`).
- `role="article"` with `aria-roledescription="email"` and `aria-label` gives screen readers a named region in webmail where the message sits inside a larger page [P] (pattern popularized by Mark Robbins, *Good Email Code*).
- `x-apple-disable-message-reformatting` stops Apple Mail scaling the layout [P].
- The `PixelsPerInch` block keeps images sized correctly in classic Outlook at high DPI [P].
- The outer table is full width and carries the background; the inner one caps width at 600 px; the MSO conditional table gives classic Outlook, which ignores `max-width`, a fixed width [P].

## 2. Preheader

- The first element in `<body>`. It continues the subject, it does not repeat it: subject "Order 4471 has shipped", preheader "Arriving Thursday 14 November. Track it any time." [J]
- Hidden with `display:none;max-height:0;overflow:hidden;mso-hide:all`. Some teams append spacer characters (`&#8199;&#65279;&#847;`) so the preview does not pull in following body text; keep that short.
- Keep it under about 90 characters; preview lengths vary by client and device [J].
- It must be true and match the content. A preheader that promises something the body does not deliver is deceptive.

## 3. Containers and columns

- Single column is the default. It reads in order on every client and in a screen reader [J].
- Two columns side by side on desktop, stacked on phones: use `display:inline-block` cells with `max-width` inside a centered container, and MSO conditional table cells for classic Outlook (the "hybrid" or "spongy" method) [P]. Media queries alone fail in Gmail with non-Google accounts and in classic Outlook.
- Spacing with `padding` on `<td>`, not `margin`: Outlook and Gmail support `margin` only partially (Can I Email `css-margin`) [S].
- Source order is reading order. Do not use `dir` tricks or `float` to reorder content for desktop.

## 4. Buttons

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
  <td style="background-color:#0b5d3b;border-radius:4px;">
    <a href="https://example.com/orders/4471" style="display:inline-block;padding:12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Track order 4471</a>
  </td>
</tr></table>
```

- Real text, so it survives images off and reads in a screen reader [P] (Litmus).
- Label names the outcome; unique per email when there are several.
- Classic Outlook shows square corners (`border-radius` unsupported). Accept it, or add a VML `v:roundrect` in a conditional comment if the brand insists [P].
- At least 44 px tall for touch [S] (WCAG 2.5.5 AAA, Apple HIG).

## 5. Images

- `src` absolute https; `width` attribute (and `height` where known); `style="display:block;border:0;"` to avoid gaps; `alt` always [S][P].
- Alt text says what the image says. A banner reading "20% off all tea until Sunday" gets exactly that alt. Decorative images get `alt=""`.
- PNG or JPEG. WebP fails in classic Outlook and Outlook for Mac; SVG is rasterized in Gmail and missing in older Outlook [S] (Can I Email `image-webp`, `image-svg`).
- Retina: export at 2x and set the display width in the attribute.
- Background images need VML for classic Outlook, and Gmail may strip styles containing `url()`. Always set a solid background color that keeps text readable alone [S] (Can I Email `css-background-image`).
- Animated GIF: classic Outlook shows only the first frame, so put the message in frame one [P].

## 6. Type and color from brand tokens

- `brand-identity` produces `tokens.css` (custom properties) and `tokens.json`. Email cannot use custom properties in most clients, so resolve each token to its literal value at build time [S] (Can I Email `css-variables`).
- Use the brand's light-theme pairs, which were contrast-checked there. Check any new pairing yourself at 4.5:1.
- Web fonts load only in Apple Mail, Outlook for Mac, Samsung and a few others; Gmail, Outlook.com and Yahoo use the fallback [S] (Can I Email `css-at-font-face`). Choose a fallback stack that keeps the brand's character (`Georgia, 'Times New Roman', serif` for a serif brand) and design with it, not around it.
- Body 16 px, line height about 1.5; headings in proportion. Do not go below 14 px for any text a reader needs [J].

## 7. Dark mode

Litmus groups clients by behaviour [P]:

| Behaviour | Clients (Litmus, current guide) |
|---|---|
| No change | Apple Mail (macOS, iOS) by default, Gmail web, Yahoo, AOL |
| Partial invert (light areas darkened) | Outlook.com, Outlook iOS and Android, Gmail Android, Office 365 Mac |
| Full invert | Classic Outlook and Office 365 on Windows, Windows Mail, Gmail iOS |

Design to survive all three:

- Logos and icons: transparent PNG with a thin light outline or glow, or placed on a solid tile that is part of the image.
- No text inside images, since it will not invert with the surrounding text.
- Avoid pure `#ffffff` on `#000000`; mid-dark and off-white backgrounds invert more predictably.
- Set color on every text cell, and both `bgcolor` and `background-color` on cells with backgrounds.
- Enhance for clients that allow it: `prefers-color-scheme` in `<head>` plus the `color-scheme` meta (Apple Mail, Outlook.com and mobile apps honor the media query; Gmail does not) [S] (Can I Email). Outlook.com adds `data-ogsc` and `data-ogsb` attributes when it recolors, which some teams target [P].
- Test the full-invert clients in screenshots; they are where logos vanish.

## 8. Data tables (receipts)

Order lines, invoices and itineraries are data. Use a real table without `role="presentation"`, with `<caption>` or a heading, `<th scope="col">` headers, and amounts right-aligned with currency [S] (WCAG 1.3.1). Totals labelled in words ("Total paid, including VAT"). On phones, a two-column table (item, amount) usually fits; stack details under the item name rather than adding columns.

## 9. Plain-text part

- Send `multipart/alternative` with the text part first and the HTML last [S] (RFC 2046 §5.1.4: alternatives are ordered from simplest to richest).
- Write it: subject idea as the first line, the facts, each action as "Label: URL" on its own line, the footer with address and unsubscribe for marketing [J].
- Same facts and same links as the HTML. `check-email.mjs --text` reports links missing from it.
- No HTML tags, no tracking-pixel URLs, no "This email requires HTML".
- Many ESPs auto-generate it; read what they produce.

## 10. Frameworks and ESP editors

- **MJML**, **React Email** and **Maizzle** generate table layouts and inline CSS; they remove much hand-coding but not the content rules here. Run `check-email.mjs` on the compiled output, not the source.
- Templating placeholders (`{{name}}`, `*|FNAME|*`, `%%name%%`) need fallbacks for empty values ("Hi there" when the name is missing), and escaping of user-written values.
- ESP drag-and-drop editors often omit `lang`, `role="presentation"` and a real text part. Check the exported HTML.
- Some ESPs add tracking and rewrite links after your check, adding size. Check the final message from a test send.
