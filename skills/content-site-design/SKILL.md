---
name: content-site-design
description: Design, build, write, and review sites people come to read - documentation, developer docs and API references, help centers and knowledge bases, blogs, editorial and news articles, guides, changelogs, and personal or company writing - so readers find the answer fast and agents can read, cite, and navigate them. Use when someone says "build a docs site", "set up our help center", "make my blog", "our docs are hard to navigate", "restructure the knowledge base", "nobody finds anything with search", "write this page so people understand it", "make our docs work for AI coding agents", or when choosing page structure, headings, navigation, search, typography for long reading, or llms.txt and Markdown versions of pages. Not for marketing or launch pages meant to convert (use landing-page-design), app screens (use web-app-design), or visual identity (use brand-identity).
---

# Content site design

A content site exists so a reader can find a page, confirm it is the right one, get the answer or understanding they came for, and move to the next thing. Most readers arrive from search on a deep page, scan before they read, and leave once they have what they need. The most common way models get it wrong is to design the shell (hero, cards, sidebar, dark-mode toggle) and neglect the content's own structure: vague titles, headings that do not say anything ("Overview", "Introduction"), the answer three paragraphs down, a page that mixes tutorial, reference, and opinion, link text like "here", no dates, and site search that returns nothing useful.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first. Body type size, line length, contrast, and reflow are covered there (`references/human-interface.md` sections 6 and 7); this skill covers content structure, navigation, search, and the agent reader.

## Brief

- **Kind of site:** documentation, help center, knowledge base, editorial or blog, or a mix. Mixed sites name a primary job per section.
- **Readers and their arrival:** from search to a deep page, from inside a product ("?" link), browsing, or subscribed. Who is new and who is expert?
- **Top tasks:** the 10 to 20 questions readers bring, in their words. Take them from search logs, support tickets, and forum posts, not from the org chart.
- **Content types:** for docs, which of tutorial, how-to, reference, explanation; for editorial, which of news, analysis, opinion, guide.
- **Freshness:** how often content changes, who owns each page, what happens when a product version changes.
- **Agent readers:** coding agents reading docs, search and answer engines citing pages, browser agents navigating. What must they get right?
- **Who writes:** staff only, or also users (comments, community answers)? Mark outsider-written content.

## Rules

Tags: **[E]** empirical, **[S]** standard or institutional, **[P]** practitioner, **[J]** judgment. Sources are in the reference files.

### Pages

- **Answer first.** The first two paragraphs carry the main point; detail follows in descending importance (inverted pyramid) [S: GOV.UK; P: NN/g]. Readers read a fraction of a page's words, an estimate Nielsen put at about 20 to 28% [P: Nielsen 2008, from Weinreich et al. 2008 data].
- **One page, one job.** A tutorial teaches, a how-to guide directs, reference describes, explanation discusses; do not mix them on one page [P: Procida, Diátaxis].
- **Titles are unique, specific, and front-loaded,** in the reader's words, about 65 characters or fewer so search results do not cut them [S: GOV.UK]. Task pages start with a verb ("Rotate an API key"); guidance about a task uses the -ing form ("Rotating API keys") [S: GOV.UK].
- **A summary under the title** of one sentence, 160 characters or fewer, that adds words the title lacks; the same text serves as the meta description [S: GOV.UK].
- **Headings say what the section says,** front-loaded, not "Overview" or "More info", and not phrased as questions; content still makes sense with headings removed [S: GOV.UK]. Heading levels follow structure: one `h1`, no skipped levels [S: WCAG 1.3.1, 2.4.6].
- **Short sentences and paragraphs, plain words.** Split sentences over about 25 words, keep paragraphs to five sentences or fewer, explain a specialist term on first use [S: GOV.UK]. Address the reader as "you", active voice, condition before instruction ("To delete a project, open Settings") [S: Google developer style guide].
- **Numbered lists for steps, bullets for sets, tables for comparisons** [S: Google developer style guide; GOV.UK].
- **Format for the scan:** meaningful headings and front-loaded paragraphs counter the F-shaped scan, where readers skip the right side and the lower parts of a page [P: Pernice, NN/g 2017].
- **Dates that mean something:** "Last updated 4 Nov 2026" with a short change note for substantive changes, and a published date on articles. Old pages that are still accurate say "Reviewed" [S: GOV.UK change notes; J].
- **Footnotes:** GOV.UK bans them for service content; scholarly and long-form editorial may need them. Decide by whether readers must verify sources [S: GOV.UK; J].

### Links

- **Link text names the destination,** front-loaded and unique per destination on the page; never "click here", "read more", or "here" [S: GOV.UK, WCAG 2.4.4].
- **Say when a link leaves the site, opens a file, or changes language:** "Pricing sheet (PDF, 240 KB)" [S: GOV.UK].
- **Links where they help, not piled at the bottom** in "Further reading"; next steps at the end of a task page are fine when specific [S: GOV.UK].
- **Every heading has a stable anchor** (`#rotate-a-key`), with a visible copy-link control. Renaming a heading keeps the old anchor working [J].
- **URLs are readable and permanent.** When a page moves, redirect the old URL; never let docs links 404 [J].

### Navigation

- **Readers land deep.** Every page shows where it is (breadcrumb or highlighted section) and what is next and nearby [S: WCAG 2.4.8; P: NN/g breadcrumbs].
- **Navigation labels use readers' words and predict their contents** (information scent) [E: Pirolli and Card 1999].
- **At least two ways to reach a page:** navigation plus search, or a site map [S: WCAG 2.4.5].
- **An on-page contents list** for long pages, generated from `h2` and `h3`, highlighting the current section [J].
- **Pagination or "Load more" over infinite scroll** for archives and search results, so readers can reach the footer, return to a place, and share a position [P: NN/g infinite scrolling].
- **Docs:** one sidebar organized by reader task and Diátaxis type, a visible version switcher where versions differ, and a banner on pages for old versions linking to the current page [P: Procida; J].

### Search

- Search is a primary path, not an add-on. The box is visible on every page, not hidden behind an icon on desktop [P: NN/g; J].
- Results show the page title, its section or type, a snippet with the matched words, and the date. Tolerate typos and synonyms from real queries [J].
- No-results pages suggest spelling corrections, broader terms, and top pages, and log the query [J].
- Review zero-result and top queries monthly; each one names a missing page, a missing synonym, or a bad title [P: common docs practice; J].

### Reading comfort

- Body type, measure, line height, contrast, and reflow follow the foundation. On phones, readers comprehend short, simple text as well as on desktop but slow down on difficult text, so difficult content needs extra structure on mobile [P: Moran, NN/g 2016].
- No interstitials or sticky elements that cover text; ads and newsletter prompts never interrupt the first screen of the answer [S: WCAG 2.4.11 for focus; J].
- Images that carry information have alt text that states the information; decorative images have empty alt [S: WCAG 1.1.1]. Diagrams have a text explanation nearby [J].
- Code samples are text, never images, with a copy control and the language labeled. Tabs for language variants keep all variants in the DOM [J].
- Print and reader modes produce the content without navigation chrome [J].

### For agents

- **The content is in the HTML,** server-rendered, not assembled by client JavaScript after load, so crawlers and agents that do not run scripts get it [J].
- **Semantic structure is the interface:** headings, lists, tables, `code` and `pre` with language classes, `figure` and `figcaption` [S: WCAG 1.3.1].
- **Stable, citable URLs and anchors,** a canonical URL per page, and a date in the page [J].
- **A clean Markdown copy of each docs page** at the same URL with `.md` appended, linked with `rel="alternate" type="text/markdown"`, is a cheap way to give coding agents the content without chrome. `llms.txt` at the site or docs root is a community proposal; low demand has been measured for general sites, but it fits docs read by coding agents [P: Howard, llms.txt; foundation agent-surfaces section 6].
- **No hidden instructions for agents** in page text, comments, or invisible elements. They are indistinguishable from prompt injection [J; foundation oversight section 5].
- **User-generated content** (comments, community answers, forum posts) is marked as such in the markup and visually, with author and date, so agents and people can weigh it [J].

## Build order

1. **Top tasks and content inventory:** each existing or planned page with its type, owner, last review, and the task it serves. Delete or merge pages that serve no task.
2. **Information architecture:** sections from reader tasks and content types; label with readers' words; test labels with a tree test (people find five tasks in a text-only tree) [P: NN/g tree testing].
3. **Page templates per content type:** title, summary, dates, body structure, next steps. For docs: tutorial, how-to, reference, explanation templates (`references/docs.md`).
4. **Write or rewrite the top-task pages first** with `references/writing.md`; one complete, good page beats twenty stubs.
5. **Semantic HTML shell:** landmarks, skip link, breadcrumb, sidebar as `nav` with `aria-current`, on-page contents, footer. Server-rendered.
6. **Search** with real queries from logs or the top-tasks list; tune synonyms.
7. **Agent layer:** canonical URLs, anchors, Markdown copies, sitemap, optional `llms.txt`.
8. **Style** for long reading; brand owns the look (`brand-identity`).
9. **Verify** (below).

## Verify

1. **Rendered audit** on a home page, a long article or reference page, a search results page, and a 404:

   ```bash
   node <interface-guidelines>/scripts/audit.mjs <dist-or-url> --out audit-output
   ```

2. **Top-task test:** for each top task, start from a search engine query or the home page, and reach the answer. Count steps and note where the scent failed. Do it once as a person by keyboard at phone width, and once as an agent with only the accessibility snapshot.
3. **Content lint** on every page (`references/writing.md` section 8 has a script outline): one `h1`; no skipped heading levels; titles unique and 65 characters or fewer; summary present and 160 or fewer; no generic headings or link texts ("Overview", "click here", "read more"); sentences over 25 words flagged; images with missing alt; last-updated date present.
4. **Links:** crawl for broken internal links and missing anchors; check that old URLs redirect.
5. **No-JS check:** fetch a page with `curl` and confirm the main content and headings are in the HTML.
6. **Search:** run the 20 top queries and 5 misspellings; the right page is in the top three.
7. **Agent read:** give an agent only the URL of a docs page or its `.md` copy and ask it to perform the task; check it follows the current version and cites the right section anchor.

## Traps

- Card grids of article teasers as the docs home, with no task entry points or search.
- Headings named "Introduction", "Overview", "Details", or written as questions.
- FAQ pages that collect unrelated questions instead of answering them on the pages where they arise.
- The answer below a long preamble about why the topic matters.
- A tutorial that turns into reference halfway through, or reference padded with opinion.
- Undated articles, and "last updated" set to the build date on every page.
- Content rendered only by client JavaScript, tabs whose hidden panels are not in the DOM, code as screenshots.
- Infinite scroll on archives and search results.
- Instruction text for AI crawlers hidden in the page.
- Restyling a docs site while titles, headings, and search stay broken.

## References

| File | Read when |
|---|---|
| `references/writing.md` | Writing or editing pages: titles, summaries, headings, sentences, links, dates, numbers, editorial specifics, and a lint outline |
| `references/docs.md` | Documentation and help centers: Diátaxis types with templates, API reference pages, code samples, versions, changelogs, docs for coding agents |
| `references/navigation-search.md` | Site structure, labels, sidebars, breadcrumbs, contents lists, archives, search results, 404s |
