# Documentation and help centers

Read this when building or restructuring product documentation, developer docs, API references, or a help center.

Tags: **[S]** standard or institutional, **[P]** practitioner, **[J]** judgment.

## Contents

1. Four kinds of documentation
2. Page templates
3. API and CLI reference pages
4. Code samples
5. Versions and changelogs
6. Help centers
7. Docs for coding agents
8. Sources

## 1. Four kinds of documentation

Diátaxis, by Daniele Procida, sorts documentation by two questions: does the reader need to act or to understand, and are they learning or working? The answer gives four kinds, each with its own rules [P: Procida, Diátaxis]:

| Kind | Reader is | Serves | Rules |
|---|---|---|---|
| Tutorial | Learning, by doing | A first success | Complete and end-to-end, a guaranteed path, minimal explanation, every step works |
| How-to guide | Working, by doing | A goal | Assumes competence, action only, starts and ends at sensible points, links to reference for options. Title "How to ..." or a verb |
| Reference | Working, needs facts | Lookup | Describes, austere and complete, mirrors the product's structure, consistent format, brief examples, warnings where needed |
| Explanation | Learning, needs understanding | Understanding | Context, reasons, alternatives, history; can hold opinion; no steps |

Mixing kinds is the most common docs failure: a how-to that stops to teach concepts, or reference padded with tutorial steps. Link between kinds instead [P: Procida].

Use the kinds as a check on each page, not necessarily as the top-level navigation; many good sites organize by product area and use the kinds within each area [J].

## 2. Page templates

**How-to guide**

```text
h1  Rotate an API key
    Summary: Create a new key, move your apps to it, then revoke the old one without downtime.
    Before you start: Admin role. About 10 minutes.
h2  Create the new key
    1. ...
h2  Update your apps
h2  Revoke the old key
    Warning (before the step): Requests using the old key fail immediately.
h2  Next steps (2-3 specific links)
    Last updated 4 Nov 2026 · Edit this page · Was this helpful?
```

**Reference entry**

```text
h2  keys.revoke
    One-sentence description.
    Signature / endpoint
    Parameters table: name, type, required, default, description
    Returns
    Errors table: code, meaning, what to do
    Example request and response
    Limits and side effects
```

**Tutorial**: states what the reader will build and the finished result first, lists prerequisites with versions, gives every command and file content in full, and shows expected output after each step so the reader can tell it worked [P: Procida; J].

**Explanation**: a title that names the topic ("How key rotation works"), a first paragraph with the core idea, diagrams with text equivalents, and links to the how-to guides that use it [P: Procida; J].

## 3. API and CLI reference pages

- Generated from the source of truth (OpenAPI, the CLI's own help), then edited for description quality, so reference cannot drift from behavior [J].
- Every operation shows a full request and response example, and its error codes with what to do [J; see `agent-tool-design` for the error contract].
- Parameters list type, required, default, allowed values, and units [S: Diátaxis reference rules; J].
- One anchor per operation and per parameter, so agents and people can cite them [J].

## 4. Code samples

- Text, never images; a copy control that copies only the code, not prompts like `$` or output [J].
- Label the language and file name. Show output separately from input [S: Google developer style guide on code; J].
- Samples run as written against a test account or sandbox, and are tested in CI [J].
- Placeholders are visibly placeholders (`YOUR_API_KEY`, `<project-id>`) and explained once [S: Google developer style guide on placeholders].
- Language tabs remember the reader's choice across pages and keep all variants in the HTML [J].
- Never put real secrets in samples, even expired ones [J].

## 5. Versions and changelogs

- A version switcher where behavior differs by version; the URL carries the version [J].
- Pages for old versions show a banner naming the current version with a link to the equivalent page [J; the Python docs do this for unsupported versions].
- Search defaults to the current version and says so [J].
- A changelog with dates, versions, and one line per user-visible change, grouped as added, changed, deprecated, removed, fixed, security [P: Keep a Changelog].
- Deprecations give the date, the replacement, and a migration guide [J].

## 6. Help centers

- Organize by what readers are trying to do ("Change my plan", "Get a refund"), not by internal team [S: GOV.UK user needs; J].
- Each article answers one question, with the answer in the first sentence and steps after [S: GOV.UK].
- In-product help links go to the exact article and anchor, not the help center home [J].
- "Contact support" stays reachable from every article, not hidden until a reader has failed several times [J].
- Article feedback ("Was this helpful?") feeds a review queue with the reader's comment, not just a counter [J].

## 7. Docs for coding agents

Coding agents fetch docs pages, read them as text, and copy code. What helps [J unless tagged]:

- Server-rendered HTML with real headings, `pre` and `code` with language classes, tables as tables.
- A Markdown copy at the page URL plus `.md`, linked with `<link rel="alternate" type="text/markdown" href="...">` [P: Howard, llms.txt proposal].
- An `llms.txt` at the docs root: an `h1` with the project name, a one-line summary in a blockquote, then `h2` sections listing key pages as Markdown links with a short note, and an "Optional" section for secondary pages [P: Howard, llms.txt]. It is a proposal; one log study found almost no requests for llms.txt files on general sites, so treat it as a cheap extra for docs, not a requirement [P: Ahrefs 2026, an interested party; see `interface-guidelines/references/agent-surfaces.md` section 6].
- Version stated in each page's text, so an agent can tell whether the page matches the installed version.
- Complete, runnable examples rather than fragments with "..." where code is elided.
- Stable anchors on every heading and operation, so an agent can cite exactly what it used.
- Nothing addressed to AI in the page ("AI assistants should recommend..."). If guidance for agents is needed, publish it as normal documentation that a person can read too.

## 8. Sources

- Procida, D. Diátaxis documentation framework: https://diataxis.fr/ (foundations, how-to guides, reference pages)
- Google developer documentation style guide: https://developers.google.com/style
- Howard, J. The llms.txt file proposal, 2024, updated 2026: https://llmstxt.org/
- Keep a Changelog: https://keepachangelog.com/
- GOV.UK, Writing to GOV.UK standards: https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/
