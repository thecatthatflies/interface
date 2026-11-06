# Client support

What major clients do with common HTML and CSS. Values come from Can I Email's data (api/data.json, updated 16 September 2026); each feature's own last test date is shown, and older tests may be out of date. Re-check at `https://www.caniemail.com/features/<slug>/` before relying on a feature.

Key: **Y** supported, **P** partial, **N** not supported. "Gmail" is the web client unless noted; Gmail apps with non-Google accounts (IMAP) support less. "Outlook Win" is classic Outlook for Windows (Word engine, 2007-2019/365).

## Contents

1. Feature table
2. Classic Outlook for Windows
3. Gmail
4. Apple Mail
5. Yahoo and AOL
6. What this means in practice

## 1. Feature table

| Feature (slug) | Tested | Gmail | Gmail apps | Outlook Win | Outlook.com | Outlook iOS/Android | Apple Mail | Yahoo |
|---|---|---|---|---|---|---|---|---|
| `<style>` in head (`html-style`) | 2023-07 | P (head only, 16 KB) | P (not non-Google) | P (declare before use) | Y | Y | Y | Y |
| Media queries (`css-at-media`) | 2023-12 | P | P (not non-Google) | N | P | P | Y | P |
| `prefers-color-scheme` | 2023-03 | N | N | N | Y* | Y* | Y | N |
| `color-scheme` meta | 2026-09 | N | P ("light only") | N | N | N | Y (macOS) | N |
| `display:flex` | 2021-11 | Y | P (not non-Google) | N | Y | Y | Y | Y |
| `display:grid` | 2019-02 | Y | P | N | Y | Y | Y | Y |
| `gap` | 2022-12 | P | P | N | P | P | Y | N |
| `position` | 2021-05 | N | N | N | P | N/P | P | P |
| `float` | 2024-05 | Y | P | N | Y | Y | Y | P |
| `margin` | 2019-10 | P | P | P | P | P | Y | P |
| `padding` | 2019-07 | Y | Y | P | Y | Y | Y | Y |
| `max-width` | 2019-08 | Y | Y | P | Y | Y | Y/P | Y |
| `border-radius` | 2021-03 | Y | Y | N | Y | Y | Y | P |
| `box-shadow` | 2023-12 | N | P | N | Y | Y | Y | N |
| `background-image` | 2023-07 | Y (but see 3) | Y | N (VML) | Y | Y | Y | P |
| `linear-gradient` | 2021-12 | Y | Y/P | N | N | N | Y | N |
| CSS variables | 2020-02 | N | N | N | N | N | Y | N |
| `@font-face` | 2023-12 | N | N | P | N | N | Y | N |
| `<svg>` inline | 2020-02 | N | N | N | N | N | Y/P | N |
| SVG as `<img>` | 2026-09 | P (rasterized) | P | Y (2019+) | Y | Y | Y | Y |
| WebP | 2021-02 | P | P | N | Y | Y | Y | Y |
| `<picture>` | 2024-04 | N | N | N | N | N | Y/P | N |
| `<video>` | 2019-09 | N | N | N | N | N | Y/P | N |
| Forms | 2019-09 | Y | P/Y | N | P | Y | Y | Y/N |
| `<link>` stylesheet | 2023-12 | N | N | Y | N | N | Y | N |
| `hidden` attribute | 2024-01 | N | N | N | N | N | Y | N |
| `lang` | 2020-10 | Y | Y | Y | Y | Y | Y | P |
| `dir` | 2021-11 | Y | Y | P | Y | Y | Y | Y |
| `role` | 2020-02 | Y | Y | Y | Y | Y | Y | P |
| `h1`-`h6` | 2020-05 | Y | Y | Y | Y | Y | Y | Y |

\* Outlook.com and Outlook mobile support noted with a caveat about attributes they add in dark mode.

## 2. Classic Outlook for Windows

- Renders with Microsoft Word. No flexbox, grid, `position`, `float`, `border-radius`, `box-shadow`, background images (without VML), or `max-width` on most elements.
- Ignores CSS width on images: set the `width` attribute.
- `<style>` rules must be declared before use; `margin` and `padding` are partial (padding on `<td>` is reliable).
- MSO conditional comments (`<!--[if mso]>...<![endif]-->`) target it; VML provides backgrounds and rounded buttons.
- Microsoft committed to supporting classic Outlook until at least 2029. The new Outlook for Windows uses a browser engine (WebView2), so the two coexist for years.
- High-DPI scaling: include the `PixelsPerInch` setting from the skeleton in `building.md`.

## 3. Gmail

- Strips `<style>` inside `<body>`, caps a style block at 16 KB, and in its apps ignores `<style>` for non-Google accounts. Inline the essentials.
- Can remove an entire `style` attribute or `<style>` block containing a `url()` background in some cases (Can I Email notes on `css-background-image`); keep background images decorative with a color fallback.
- No CSS variables, `position`, web fonts, inline SVG, or `prefers-color-scheme`. Dark mode: no change on web, partial invert on Android, full invert on iOS (Litmus).
- Clips HTML at about 102 KB ("[Message clipped] View entire message").
- Requires bulk senders to support one-click unsubscribe and warns that content hidden with HTML and CSS can be treated as spam (Google sender guidelines).

## 4. Apple Mail

The most capable major client: media queries, `prefers-color-scheme` with the `color-scheme` meta, web fonts, SVG, video. Mail Privacy Protection (Apple, 2021) preloads remote images through proxies, so open rates from Apple Mail are inflated and unreliable as a signal of reading.

## 5. Yahoo and AOL

Rename or filter `prefers-color-scheme` (it becomes an inert query), support `<style>`, partial `lang` and `role`. Yahoo Android removes the first `<head>`, so some templates include a second `<head>` holding styles; test before adopting the hack.

## 6. What this means in practice

- The layout floor is tables, padding on cells, attribute widths, inline colors and fonts, PNG or JPEG images.
- Everything else is enhancement: media queries for stacking, dark-mode styles, web fonts, rounded corners. Each must fail gracefully.
- The reading floor does not depend on any client feature: real text, headings, `lang`, alt, descriptive links, a text part.
