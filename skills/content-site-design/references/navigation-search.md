# Navigation and search on content sites

Read this when structuring a content site, labeling its sections, building sidebars, breadcrumbs, archives, and search, or handling missing pages.

Tags: **[E]** empirical, **[S]** standard or institutional, **[P]** practitioner, **[J]** judgment.

## Contents

1. Structure from tasks
2. Labels and information scent
3. Page furniture: sidebar, breadcrumb, contents list, next steps
4. Archives, tags, and listing pages
5. Search
6. Missing and moved pages
7. Markup for both readers
8. Sources

## 1. Structure from tasks

- Start from the top-tasks list in readers' words. Group pages by what readers try to do, then name the groups [S: GOV.UK user needs; J].
- Keep the hierarchy shallow where readers browse and specific where they search: broad top sections with clear labels perform better than deep trees of vague ones [J; see interface-guidelines evidence on Hick's law misuse].
- One canonical place per page. If a page belongs in two sections, link to it from the second; do not duplicate it [J].
- Test the structure before building it: a tree test asks people to find answers in a text-only outline of the navigation [P: NN/g tree testing]. Agents can run the same test cheaply, but they do not replace people [J].

## 2. Labels and information scent

- Readers follow the link whose words best match their goal, and leave when the scent fades (information foraging) [E: Pirolli and Card 1999].
- Labels use the words readers use in search queries and tickets, not internal product or team names [S: GOV.UK titles guidance; J].
- Avoid labels that predict nothing: "Resources", "Solutions", "Learn", "More" [J; foundation agent-surfaces on generic triggers].
- The same label means the same section everywhere [S: WCAG 3.2.4].

## 3. Page furniture

**Sidebar (docs).** A `nav` with a heading, sections expanded around the current page, the current page marked with `aria-current="page"` and visibly, and its scroll position kept on navigation [S: WCAG 2.4.8; J]. On phones, the sidebar collapses behind a labeled "Menu" or "Contents" button, never only an icon [J].

**Breadcrumb.** Shows location in the hierarchy (not history), each level a link except the current page, in a `nav aria-label="Breadcrumb"` [P: NN/g breadcrumbs; S: ARIA APG breadcrumb pattern].

**On-page contents list.** For pages longer than about three screens: links to `h2` and `h3` anchors, highlighting the section in view. Place it before the content in the DOM or after the `h1` so keyboard and tree readers reach it [J].

**Next steps.** End task pages with two or three specific links ("Revoke a key", "Set up key expiry alerts"), not a generic list [S: GOV.UK on links; J].

**Header and footer.** Logo links home, search is visible, the footer holds contact, legal, and the site map [J].

## 4. Archives, tags, and listing pages

- Listing pages show title, date, type, and a one-line summary per item; the newest or most relevant first, with the sort stated [J].
- Pagination or a "Load more" button rather than infinite scroll, so readers can reach the footer, keep a position, and share it. NN/g recommends infinite scroll only for feeds people browse without a goal [P: NN/g infinite scrolling].
- Page numbers and filters live in the URL [J].
- Tag pages need a short description of the tag, or they are thin lists that confuse both readers and search engines [J].
- Show the count: "Showing 1-20 of 214 articles" [J; foundation agent rules].

## 5. Search

- A visible search field on every page at desktop widths, labeled, with a submit button; on phones a labeled "Search" control is acceptable [P: NN/g; J].
- Results page: the query repeated in the field, the count, and per result the title, section or type, date, and a snippet with the matched terms highlighted [J].
- Handle the queries readers actually type: typos, plurals, synonyms, product names in old forms, error codes pasted whole [J].
- Facets for type (guide, reference, article), product area, and version, shown as filters with counts [J].
- Zero results: say so, suggest a correction, offer the top pages for that section, and give a contact path [J].
- Log queries; review zero-result queries and queries followed by a second search, and fix titles, synonyms, or missing pages [J].
- Results load as a real page with the query in the URL (`/search?q=rotate+key`), so agents and people can link to it [J].

## 6. Missing and moved pages

- Redirect every moved or renamed page permanently (301) from the old URL [J].
- The 404 page says the page was not found, offers search with the failed path's words prefilled, and links to the home and top sections. It returns a real 404 status [J].
- Removed content gets a short page that says what happened and where to go, when readers or other sites still link to it [S: GOV.UK publishing guidance on retiring content; J].

## 7. Markup for both readers

```html
<a class="skip" href="#main">Skip to content</a>
<header>... <form role="search" action="/search"><label for="q">Search docs</label><input id="q" name="q" type="search"><button>Search</button></form></header>
<nav aria-label="Breadcrumb"><ol><li><a href="/docs">Docs</a></li><li><a href="/docs/keys">API keys</a></li><li aria-current="page">Rotate an API key</li></ol></nav>
<nav aria-label="Docs">... <a href="/docs/keys/rotate" aria-current="page">Rotate an API key</a> ...</nav>
<main id="main">
  <article>
    <h1>Rotate an API key</h1>
    <p>Create a new key, move your apps to it, then revoke the old one without downtime.</p>
    <p>Last updated <time datetime="2026-11-04">4 November 2026</time></p>
    <nav aria-label="On this page">...</nav>
    <h2 id="create-the-new-key">Create the new key</h2> ...
  </article>
</main>
```

- Landmarks, one `h1`, and `aria-current` give agents the same orientation as people; `aria-current` is dropped by some serializers, so the visible styling and breadcrumb text carry it too [J; foundation agent-surfaces section 1].
- `rel="canonical"`, a sitemap, and stable anchors make pages citable [J].

## 8. Sources

- Pirolli, P. and Card, S. "Information foraging." *Psychological Review* 106(4), 1999.
- NN/g: breadcrumbs (Laubheimer), tree testing (Whitenton), infinite scrolling (Loranger), search visibility (Nielsen): https://www.nngroup.com/articles/
- W3C ARIA Authoring Practices, Breadcrumb pattern: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
- WCAG 2.2: 2.4.5 Multiple Ways, 2.4.8 Location, 3.2.4 Consistent Identification: https://www.w3.org/TR/WCAG22/
- GOV.UK publishing guidance: https://guidance.publishing.service.gov.uk/
