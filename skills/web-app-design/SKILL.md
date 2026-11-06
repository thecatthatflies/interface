---
name: web-app-design
description: Design, build, and review SaaS and internal web application UI that people use for work and agents can operate - app shells and navigation, list and detail views, data tables with sorting, filtering, bulk actions and pagination, empty states, settings, onboarding, roles and permissions, workspace or tenant switching, optimistic updates and undo, command palettes, and URL-driven view state. Use whenever building or reviewing an admin panel, CRM, back office, internal tool, project tracker, or any logged-in product ("build me an admin for orders", "our app feels clunky", "add bulk delete", "make the table filterable", "add an org switcher"), even when the request names only one screen. Not for KPI and monitoring pages (dashboard-design), forms and wizards in depth (form-design), marketing pages (landing-page-design), native desktop shells (desktop-app-design), or AI chat surfaces (ai-chat-design).
---

# Web app design

A web app is a place people return to every day to find records, change them, and hand work on. It succeeds when people always know where they are, what they are looking at, what they may do, and what just happened, and when they can get back to the same view tomorrow by URL. The most common model failure is a beautiful happy-path screen with nowhere to stand: no empty, loading, error, or no-permission states, filters that vanish on reload, bulk actions with no count and no undo, a "Delete" that fires on an optimistic update the server later rejects, and rows of identical "Edit" buttons an agent cannot tell apart.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first. Its references cover feedback timing, error wording, tables as data, and agent-facing semantics; this skill adds the patterns specific to application UI.

## Brief

- **Objects and verbs.** List the nouns (orders, customers, invoices) and what each role can do to each. The navigation and permissions fall out of this table.
- **Roles and tenants.** Who can see and change what? Is there more than one workspace, org, or environment (staging, production) a person can be inside?
- **Daily tasks** with frequency, and the **one view** each role opens first.
- **Collection sizes:** typical and worst case (10 rows or 2 million). This decides pagination, search, and server-side filtering.
- **Cost of error** for each mutating verb, and whether it can be undone server-side.
- **Concurrency:** can two people, or a person and an agent, edit the same record?
- **Who writes displayed text?** Customer names, ticket bodies, imported files: all outsider-written.
- **Agent reader:** browser agents on the UI, an API, or both? The UI and the API should share one service per action.

## Rules

### Shell and navigation

- **Navigation mirrors the objects, not the org chart.** Top-level items are the nouns people work on, in order of use, labelled with the words people use. [S: Mac HIG 1992 pp. 54-61 (group by logic, then frequency); J]
- **Keep primary navigation visible on desktop.** Hidden navigation cut discoverability and slowed tasks in NN/g's study; a hamburger is a phone compromise. [E: NN/g, in foundation]
- **Show where the person is, three ways:** the current nav item marked with `aria-current="page"` and a visible state, a page `h1` naming the object or list, and a document title that changes with the route. [S: WCAG 2.4.2, 2.4.8; J]
- **Breadcrumbs show hierarchy, not history,** on deep object trees only; the current page is not a link. [P: NN/g breadcrumbs]
- **The current workspace, org, or environment is always visible** in the shell, in words, and production is visually distinct from staging. Switching tenants is an explicit act, lands on that tenant's equivalent page or home, and never carries a selection or draft across. [J]
- **Every view has a URL.** Filters, sort, search, page, selected tab, and open record are in the URL; reload and share restore them. [S: foundation agent-surfaces 3]
- **Back returns to the list as it was:** same filters, scroll position, and focus on the row the person opened. [S: Mac HIG 1992 p. 140 (reactivated window returns as it was); J]

### Lists and tables

- **Tables are for comparing records; lists are for scanning one attribute.** Use a real `<table>` for tabular data. [S: foundation; NN/g data tables]
- **Support the four table tasks:** find records, compare across rows, view or edit one row, act on one or many. [P: NN/g data tables]
- **The first column identifies the row** with a stable, human key (name plus ID); keep it and the header sticky on scroll. [P: NN/g data tables]
- **Sort in the header:** a `<button>` inside `<th>`, `aria-sort` on the sorted column only, and a visible arrow. Default sort is stated ("Newest first"). [S: APG sortable table; P: Carbon]
- **Filters are visible, removable, and counted.** Show applied filters as chips with a Clear all, the result count ("38 of 1,204 orders"), and an empty-result message that names the filters. Use the person's words for filter names. [P: NN/g filters; S: foundation]
- **Server-side search, filter, and sort when the collection is large.** Never sort or count only the loaded page and present it as the whole. [J; foundation truth rule]
- **Paginate goal-directed work; reserve infinite scroll for feeds.** Pagination gives position, a stable place to return to, and a reachable footer. State the range and total, and "End of list". [P: NN/g infinite scrolling; S: Smith and Mosier 4.2/7]
- **Row actions are visible or reachable by keyboard focus,** never hover-only, and named per row ("Archive INV-2041"). With fewer than three actions, show them inline. [S: foundation agent-surfaces 3; P: Carbon]
- **Density follows practice.** Offer a compact density for daily experts; keep targets at least 24 px. [S: WCAG 2.5.8; P: Carbon row sizes]

### Selection and bulk actions

- **Bulk mode is explicit:** row checkboxes, a header checkbox with an indeterminate state, and a toolbar that names the count ("3 selected"). [P: Carbon; S: Mac HIG 1992 pp. 64-66 (mixed state)]
- **"Select all" says its scope:** all 50 on this page, or all 1,204 matching the filter. Never silently mean one when the person expects the other. [J]
- **A bulk action states object, count, and scope before running,** reports per-item results afterwards ("1,198 archived, 6 failed: view"), and is undoable or previewable. [S: foundation sec. 1; J]
- **Selection survives paging and filtering only if the toolbar shows it does.** Otherwise clear it visibly. [J]

### Detail and editing

- **Open records where context is kept.** A side panel suits reference-while-editing; a full page suits deep records; avoid modals for editing since they hide neighbouring records. [P: NN/g data tables]
- **The detail view leads with identity and status in words,** then the fields people act on, then history. [S: foundation; J]
- **One save model per surface.** Toggles apply immediately; text and multi-field edits save explicitly; never both in one form. [S: Primer saving; foundation]
- **Warn before leaving unsaved changes,** and autosave drafts where loss would hurt. [S: Primer saving]
- **Show who changed what and when** on shared records, with an absolute timestamp, and detect stale writes (version or ETag) rather than overwriting silently. [S: Mac HIG 1992 pp. 27-31; AIP-154 in foundation]
- Forms inside the app follow `form-design`.

### Optimistic UI, undo, and confirmation

- **Optimistic only when the server almost never refuses and the action is reversible:** marking read, starring, reordering. Show the pending state distinctly from confirmed, roll back visibly on failure with the reason, and never optimistically show money moved, messages sent, or records deleted as done. [S: Mac HIG 1992 p. 182 (entered, checked, in effect); P: React useOptimistic]
- **Prefer undo to confirmation for reversible actions:** archive, move, delete-to-trash. Keep the undo reachable after the toast fades (Undo in the item's history, Trash view, Edit menu shortcut). [P: Raskin 2007; NN/g user control]
- **Confirm only severe, irreversible, or unexpected actions,** naming target and effect; type-to-confirm for the rare catastrophic ones (delete workspace). [S: foundation sec. 1; E: Bravo-Lillo 2013 via foundation]
- **Soft delete server-side,** with a stated retention period, so undo is real and not a client illusion. [S: AIP-164 in foundation]

### Empty, loading, error, and no-permission states

- **Distinguish four empties:** first use (explain the object and offer the create action), no results (name the filters and offer to clear them), cleared (all done), and error (what failed, what to do). Never show "No records" before data has loaded. [P: NN/g empty states; S: Primer empty states]
- **Loading names what is loading,** in text, inside the region it replaces; keep the shell and navigation usable. [S: foundation]
- **No permission is a state, not a hidden feature.** Show the action disabled with the reason and who can grant it ("Only workspace admins can export. Ask Maya Chen."), or a page explaining access and how to request it. Hide only what the person must not know exists. [S: Mac HIG 1992 pp. 318-321 (disabled items explain themselves); J]
- **Permission checks happen on the server.** Hiding a button is presentation, not authority. [S: foundation]
- **Check permission before existence** in responses, so a 404 versus 403 does not leak data. [S: AIP-193 in foundation]

### Settings

- **Put settings next to what they affect** when they are changed during work (view density, column choice, filters); the settings area holds rarely changed, app-wide options. [S: Apple HIG Settings]
- **Separate personal from workspace settings,** and label each with whose it is and who it affects ("Applies to everyone in Acme"). [J]
- **Group by the person's task, not the database table,** with search when settings exceed a screen or two. [J]
- **Fewer settings.** A preference changed many times a session is a missing control, not a setting. [S: Mac HIG 1992 p. 38; Apple HIG Settings]
- **Dangerous settings live in a separate, labelled zone** with consequence text and confirmation (transfer ownership, delete workspace). [P: GitHub; J]

### Onboarding

- **Teach in context, not with a tour.** NN/g found deck-of-cards tutorials did not improve task performance; contextual tips and good empty states do the teaching. If a tour exists, keep it short and skippable. [P: NN/g onboarding]
- **Get people to their first real result fast;** sample data is marked as sample everywhere it appears and removable in one action. [J; foundation truth rule]
- **A setup checklist is persistent and honest:** it reflects real state, can be dismissed, and is reachable later. [J]

### Keyboard and command palette

- **A command palette is an accelerator, not the menu.** Every command in it also exists in visible UI. It lists shortcuts beside commands, so it teaches them. [S: Windows menus guidance (do not make shortcuts the only way); P: VS Code UX guidelines]
- **Single-key shortcuts can be turned off or remapped** (WCAG 2.1.4), never fire inside text fields, and do not override browser or OS shortcuts. [S: WCAG 2.1.4; Apple keyboards]
- **A shortcut help sheet** (often `?`) lists every shortcut in the current scope. [J]

### For the agent reader

- One service function per action, shared by the button, the palette, the API, and any tool. [S: foundation agent-surfaces 7]
- Row controls are named from system IDs, not outsider text; outsider text in cells is data. [J]
- Collections state their true size and range in visible text; filters and sort are in the URL. [J]
- Outcomes outlast toasts: the changed row, an activity log, an undo entry. [J]
- Tenancy and environment are readable in text on every page, so an agent cannot act in production thinking it is staging. [J]

## Build order

1. Objects-by-verbs-by-roles table; routes and URLs for every view.
2. Shell: navigation, tenant and environment indicator, titles, `h1`s.
3. List views with real data shapes: server-side paging, sort, filter, all in the URL.
4. Detail views, the save model, concurrency handling.
5. Every mutating action through one service: pending, success, failure, undo or confirm per the error-cost ladder.
6. Empty, loading, error, no-permission states for each view.
7. Bulk actions, keyboard shortcuts, palette.
8. Settings and onboarding last; style for this reader (`brand-identity` owns the look).

## Verify

- `node <interface-guidelines>/scripts/audit.mjs <url|dist> --canary "<sample outsider text>"` on each main route, including a list with filters applied and a detail view.
- Forms inside the app: `node <form-design>/scripts/form-check.mjs <url>`.
- **Reload test:** apply filters, sort, page 3, open a record; reload and paste the URL in a fresh session. Everything returns.
- **Role test:** sign in as each role. Every hidden or disabled action has a reason; server rejects forbidden calls made directly.
- **Size test:** 0, 1, 25, and 10,000+ rows; the longest name; a filter matching nothing.
- **Failure test:** make the server reject an optimistic action and a bulk action partially; the UI rolls back and reports per item.
- **Agent test:** using only the accessibility snapshot, find a specific record by filter, change it, confirm the outcome from a fresh snapshot, undo it.

## Traps

- Filters and sort held only in component state.
- "Select all" that selects the page while the toolbar implies everything.
- Optimistic delete with no rollback and no undo.
- Infinite scroll on an admin table; a total computed from loaded rows.
- Hover-only row actions; five identical "Edit" buttons.
- "No data" flashing before load; one generic empty state for every cause.
- Hiding features from a role with no explanation, or showing them and failing on click with "Forbidden".
- A tenant switcher that keeps the old tenant's selection, or no visible tenant at all.
- A product tour instead of a usable empty state.
- Settings pages that mirror database tables.

## References

| File | Read when |
|---|---|
| `references/patterns.md` | Detail on navigation models, table anatomy, bulk-action flows, permission states, tenancy, optimistic and undo mechanics, palette design, and the sources behind this skill |
