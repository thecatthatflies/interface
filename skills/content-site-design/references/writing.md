# Writing pages people and agents can use

Read this when writing or editing any page on a content site. Most rules come from GOV.UK's publishing guidance, which is tested on national services with readers of every literacy level, and from Google's developer documentation style guide.

Tags: **[E]** empirical, **[S]** standard or institutional, **[P]** practitioner, **[J]** judgment.

## Contents

1. How people read pages
2. Titles and summaries
3. Structure and headings
4. Sentences and words
5. Links
6. Dates, numbers, and change notes
7. Editorial specifics
8. Content lint outline
9. Sources

## 1. How people read pages

- Readers scan. In Nielsen's analysis of browser logs from 25 people (Weinreich et al. 2008), readers had time for at most about 28% of a page's words, likely nearer 20%. The figure is a model estimate on a small, above-average sample, so use it as direction, not a constant [P: Nielsen 2008].
- Without strong cues, eyes follow an F-shaped pattern: across the top, a shorter line lower down, then down the left edge. Other patterns appear with better structure: layer-cake (headings only), spotted (looking for a number or link), commitment (reading everything, which is rare) [P: Pernice, NN/g 2017].
- So: put the point in the first two paragraphs, make headings informative, start paragraphs and list items with the words that differ, and cut what nobody needs [S: GOV.UK; P: NN/g].
- On phones, short simple text was understood as well as on desktop; difficult text was read more slowly [P: Moran, NN/g 2016]. Earlier work reporting much lower mobile comprehension used a different measure [P: NN/g notes the conflict].
- Agents read every word, at a cost in context. Front-loading helps them too, because summaries and truncation keep the beginning [J].

## 2. Titles and summaries

| Rule | Example | Source |
|---|---|---|
| 65 characters or fewer, unique on the site | "Rotate an API key" | GOV.UK [S] |
| Readers' words, checked against search terms | "Cancel my order", not "Order termination process" | GOV.UK [S] |
| Verb for a task done on the page; -ing form for guidance about it | "Apply for a refund" vs "Applying for a refund" | GOV.UK [S] |
| No content-type words or org name unless needed to be unique | Not "Guidance: ..." | GOV.UK [S] |
| Summary 160 characters or fewer, ends with a full stop, adds words the title lacks | "How to create a new key, update your apps, and revoke the old key without downtime." | GOV.UK [S] |
| `<title>` and `h1` match, plus the site name in `<title>` | `Rotate an API key - Acme Docs` | WCAG 2.4.2 [S]; [J] |

## 3. Structure and headings

- Inverted pyramid: key point, then supporting detail, then background [S: GOV.UK; P: NN/g].
- Do not repeat the summary as the first paragraph [S: GOV.UK].
- Headings are descriptive, front-loaded, not questions, and removable without breaking the text [S: GOV.UK].

  ```text
  Bad:  Overview / How does it work? / Additional information
  Good: Keys expire after 90 days / Create the new key / Revoke the old key
  ```

- One `h1`; `h2` for sections; `h3` and `h4` only when they divide an `h2`. Levels reflect structure, not size [S: WCAG 1.3.1].
- Numbered lists for sequences, bullets for sets, description lists for term and meaning, tables for comparisons across the same attributes [S: Google developer style guide].
- No FAQ pages: "If you write content by starting with user needs, you will not need to use FAQs" [S: GOV.UK A to Z]. Answer each question on the page where it arises. A help center may still list top questions as links to those pages [J].
- Warnings and notes sit before the step they concern, not after [S: Google style, condition before instruction; J].

## 4. Sentences and words

- Split sentences longer than about 25 words; paragraphs of five sentences or fewer [S: GOV.UK].
- Plain words: "buy" not "purchase", "help" not "facilitate". Explain a specialist term the first time [S: GOV.UK].
- "You" for the reader; active voice; present tense [S: Google developer style guide].
- "Must" for requirements, "need to" for necessary steps, "can" for options [S: GOV.UK].
- Do not say "click"; say "select" or name the control, because not everyone clicks [S: GOV.UK A to Z].
- UI element names in bold, code in code font, exactly as they appear [S: Google developer style guide].
- One term per concept across docs, UI, and API [S: Mac HIG via interface-guidelines].
- WCAG 3.1.5 (AAA) asks for supplementary content when text needs more than lower secondary reading ability; a plain summary at the top often meets it [S: WCAG 3.1.5].

## 5. Links

- Descriptive and front-loaded: "Download the pricing sheet (PDF, 240 KB)", not "Click here to download" [S: GOV.UK, WCAG 2.4.4].
- Task links start with a verb; information links use the destination's title [S: GOV.UK].
- Same text for the same destination, different text for different destinations [S: GOV.UK].
- Say when a link goes off-site, to a file (format and size), or to another language [S: GOV.UK].
- Do not open links in new tabs by default; if you must, say "(opens in new tab)" [J; GOV.UK labels its own].
- Links in context where needed, not a pile at the end; no unsorted "Further reading" [S: GOV.UK].

## 6. Dates, numbers, and change notes

- Show "Published" and "Last updated" dates on articles and docs; set "updated" only for substantive changes, with a one-line note of what changed [S: GOV.UK change notes; J].
- Unambiguous dates: "4 November 2026" or ISO 8601 in technical contexts; never "04/11/26" [S: Google developer style guide].
- Mark time-sensitive content: "Prices as of November 2026." [J].
- Numerals for numbers in running text that readers compare; units always [J].
- In markup, `<time datetime="2026-11-04">` alongside the visible text [J].

## 7. Editorial specifics

- Byline with a link to the author's page; date and time of publication; corrections noted at the end with what changed and when [J; common newsroom practice].
- Headline states the news; standfirst (summary) adds the most important detail not in the headline [J].
- Opinion and analysis labeled as such above the headline [J].
- Pull quotes, related-article rails, and newsletter boxes must not split a sentence or push the first paragraph below the first screen [J].
- Sponsored content labeled as such where it appears and in its listing [J].

## 8. Content lint outline

A small script over built HTML catches the mechanical problems. Outline, in Node with any HTML parser [J]:

```js
for (const page of pages) {
  const h1s = $('h1'); if (h1s.length !== 1) report(page, `${h1s.length} h1 elements`)
  let prev = 1
  $('h2,h3,h4,h5,h6').each((_, h) => { const lvl = +h.tagName[1]; if (lvl > prev + 1) report(page, `skipped to h${lvl}`); prev = lvl })
  const title = $('title').text(); if (title.length > 80) report(page, 'title over 65 characters plus site name')
  if (titles.has(title)) report(page, `duplicate title with ${titles.get(title)}`); titles.set(title, page)
  const desc = $('meta[name=description]').attr('content') || ''; if (!desc || desc.length > 160) report(page, 'summary missing or over 160')
  $('h2,h3').each((_, h) => { if (/^(overview|introduction|details|more|misc|other|faq)$/i.test($(h).text().trim()) || /\?$/.test($(h).text().trim())) report(page, `generic or question heading: ${$(h).text()}`) })
  $('a').each((_, a) => { if (/^(click here|here|read more|more|learn more|this)$/i.test($(a).text().trim())) report(page, `vague link text: ${$(a).text()}`) })
  $('img:not([alt])').each(() => report(page, 'image without alt'))
  $('main p').each((_, p) => $(p).text().split(/(?<=[.!?])\s+/).forEach(s => { if (s.split(/\s+/).length > 25) report(page, `long sentence: ${s.slice(0, 60)}...`) }))
  if (!$('time').length) report(page, 'no date')
}
```

Treat long sentences as prompts to edit, not failures; code and legal text may need them.

## 9. Sources

- GOV.UK, Writing to GOV.UK standards: clear structure, clear language, clear titles, summaries, add links, change notes, A to Z style guide: https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/
- Google developer documentation style guide, highlights: https://developers.google.com/style/highlights
- Nielsen, J. "How little do users read?" NN/g, 2008: https://www.nngroup.com/articles/how-little-do-users-read/ (data from Weinreich, Obendorf, Herder, Mayer, *ACM Transactions on the Web*, 2008)
- Pernice, K. "F-shaped pattern of reading on the web: misunderstood, but still relevant." NN/g, 2017: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- Moran, K. "Reading content on mobile devices." NN/g, 2016: https://www.nngroup.com/articles/mobile-content/
- NN/g, "Inverted pyramid: writing for comprehension": https://www.nngroup.com/articles/inverted-pyramid/
- WCAG 2.2: 1.1.1, 1.3.1, 2.4.2, 2.4.4, 2.4.6, 3.1.5: https://www.w3.org/TR/WCAG22/
