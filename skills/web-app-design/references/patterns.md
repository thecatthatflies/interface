# Web app patterns

Read this for the detail behind the rules in SKILL.md and their sources. Tags as in SKILL.md.

## Contents

1. Navigation models
2. Table anatomy
3. Bulk actions, step by step
4. Permission states
5. Tenants and environments
6. Optimistic updates and undo
7. Command palettes and shortcuts
8. URL as state
9. Sources

## 1. Navigation models

| App shape | Model | Notes |
|---|---|---|
| A few object types, daily use | Persistent sidebar or top bar of nouns | Visible on desktop; collapses to a menu button below about 768 px [J] |
| Many object types, grouped | Sidebar with labelled groups, collapsible | Groups named by the person's domain, not by team [J] |
| Deep hierarchy (projects > repos > files) | Sidebar for top level, breadcrumbs for depth | Breadcrumbs show hierarchy, current item unlinked [P: NN/g] |
| One object type with views | Tabs or segmented views within the page | Tabs are links when each view has a URL [J] |

Mark the current item with `aria-current="page"` plus a visible change other than colour alone (WCAG 1.4.1). Put search where every page can reach it. Keep the same items in the same order on every page (WCAG 3.2.3).

## 2. Table anatomy

From top to bottom:

1. **Title and count:** "Orders" and "1,204 orders" (or "38 of 1,204" when filtered).
2. **Toolbar:** search, filter controls, applied-filter chips with Clear all, view options (columns, density), primary create action.
3. **Bulk bar** (replaces or overlays the toolbar when rows are selected): "3 selected", the actions, Cancel. Carbon disables single-row actions while bulk mode is active. [P: Carbon]
4. **Header row:** sticky; sortable headers are buttons with `aria-sort` on the active one; numeric columns right-aligned with units in the header.
5. **Rows:** identity column first (sticky when wide); status as words; times with absolute values; row actions inline or in a named overflow ("More actions for INV-2041").
6. **Footer:** range and total, page controls, page size. "End of list" on the last page.

Numbers: tabular figures, right-aligned, same precision per column. Missing is "–" with a legend or "Not recorded", never 0. [S: foundation dashboards]

Wide tables: let the table scroll horizontally inside its container (exempt from WCAG reflow 1.4.10), keep the identity column sticky, and offer column hiding. [S: WCAG 1.4.10 exception; P: NN/g]

Editing in place: suitable for one quick field (status, owner); anything more opens a panel. Inline edits save explicitly with Enter and cancel with Esc, and show the saved state. [J]

## 3. Bulk actions, step by step

1. Select: row checkboxes with names ("Select INV-2041"); header checkbox selects the page and is indeterminate when some are selected.
2. Offer scope: after selecting the page, a banner offers "Select all 1,204 matching orders". The bar always states which scope is active.
3. Act: the action names count and scope ("Archive 1,204 orders"). Severe actions get a dialog stating the effect; reversible ones run and offer Undo.
4. Run: long jobs run in the background with progress and a way to stop; the table stays usable.
5. Report: per-item outcome summary with a link to failures and their reasons; selection clears.
6. Undo: available from the result and from the activity log, server-backed.

Agents: the bulk action must be one call with an explicit list or filter, idempotent with a key, and return per-item results. [S: foundation agent-surfaces 9]

## 4. Permission states

| Situation | Show | Why |
|---|---|---|
| Can do it | Enabled control | |
| Normally can, not now (record locked, missing prerequisite) | Disabled (`aria-disabled`, still focusable) with the reason in visible text or a description | Mac HIG 1992: disabled items say why; agents read text, not grey [S] |
| Role lacks it, others have it | Disabled with "Only admins can export. Ask Maya Chen." and a request-access path | People can act on it [J] |
| Must not know it exists (other tenants' data, unreleased features) | Absent | [J] |
| Whole page forbidden | A page: what this is, why no access, who grants it, a way back | GOV.UK: conditions people cannot fix are pages [S] |

Effective permissions should be inspectable: a "Your role: Editor" line and a page listing what each role can do. Show agents' and integrations' permissions the same way, attributed to their principal. [S: Mac HIG 1992 pp. 28-29; J]

## 5. Tenants and environments

- The switcher shows the current tenant name (and avatar or colour, never colour alone), lists the others, and offers search when there are many. [J]
- Switching navigates to the new tenant's home or the equivalent page if it exists; it clears selections, drafts in progress get saved or a prompt. [J]
- Put the tenant in the URL (`/acme/orders`), so tabs in two tenants do not interfere and links are unambiguous. [J]
- Production and non-production environments differ in text ("Production") and in a persistent visual band. Destructive actions in production name the environment: "Delete 3 rows from production". [S: foundation sec. 1; J]

## 6. Optimistic updates and undo

The Mac HIG separates entered, checked, and in effect (1992 p. 182). Optimistic UI collapses them; do it only where the collapse is safe.

| Action | Optimistic? | Pattern |
|---|---|---|
| Star, mark read, reorder, toggle a personal preference | Yes | Update at once; on failure, revert and say why next to the item |
| Rename, edit a field | Partly | Show the new value with a pending marker until confirmed |
| Archive, delete to trash | Yes, with undo | Remove from view, toast with Undo, keep Undo in Trash or history |
| Send, publish, pay, invite, permanent delete | No | Busy state on the control, then the confirmed result |

React's `useOptimistic` shows the temporary value only while the action is pending and returns to the real value if it throws; you still need to show the error. [S: React docs]

Undo: name what it undoes ("Undo archive of 3 orders"); keep it available after the toast; make it a server operation. Raskin's argument against warnings for reversible actions is practitioner reasoning, not a controlled finding; the foundation's evidence file marks "undo is proven better than confirm" as unproven. [P: Raskin 2007]

## 7. Command palettes and shortcuts

- Open with a documented shortcut (commonly Ctrl/Cmd+K) and from a visible control.
- Search commands and objects by name and synonyms; show the shortcut beside each command; show the scope (this record, this workspace).
- Commands that need input end with an ellipsis and open the form; commands do not run on highlight.
- Do not override standard browser shortcuts (Ctrl/Cmd+L, T, W, R) or assistive technology keys. [S: Apple keyboards; Windows keyboard accelerators]
- Single-character shortcuts: only when focus is not in a text field, and with a setting to turn them off (WCAG 2.1.4). [S]

## 8. URL as state

Encode in the URL: route, tenant, object ID, tab, filters, sort, search query, page or cursor, date range, selected record in a split view. Do not encode: secrets, personal data in query strings, transient UI (an open tooltip). [S: foundation agent-surfaces 3; J]

Use `pushState` for navigations people would expect Back to undo (opening a record, changing page) and `replaceState` for refinements typed character by character (search box). [J]

## 9. Sources

- Nielsen Norman Group: Data tables, https://www.nngroup.com/articles/data-tables/; Infinite scrolling, https://www.nngroup.com/articles/infinite-scrolling/; Empty states, https://www.nngroup.com/articles/empty-state-interface-design/; Breadcrumbs, https://www.nngroup.com/articles/breadcrumbs/; Filter categories and values, https://www.nngroup.com/articles/filter-categories-values/; Mobile app onboarding, https://www.nngroup.com/articles/mobile-app-onboarding/; User control and freedom, https://www.nngroup.com/articles/user-control-and-freedom/.
- IBM Carbon, Data table usage. https://carbondesignsystem.com/components/data-table/usage/
- GitHub Primer, Empty states and Saving patterns. https://primer.style/product/ui-patterns/empty-states/, https://primer.style/product/ui-patterns/saving/
- W3C ARIA APG, Sortable table example. https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/
- WCAG 2.2: 1.4.1, 1.4.10, 2.1.4, 2.4.2, 2.4.8, 2.5.8, 3.2.3. https://www.w3.org/TR/WCAG22/
- Apple, Human Interface Guidelines: Settings; Keyboards. https://developer.apple.com/design/human-interface-guidelines/settings
- Apple, Macintosh Human Interface Guidelines (1992), digest in `research/01-macintosh-hig.md`.
- Microsoft, Windows menus guidance and keyboard accelerators. https://learn.microsoft.com/en-us/windows/win32/uxguide/cmd-menus, https://learn.microsoft.com/en-us/windows/apps/design/input/keyboard-accelerators
- Visual Studio Code, Command Palette UX guidelines. https://code.visualstudio.com/api/ux-guidelines/command-palette
- Raskin, A. 2007. Never use a warning when you mean undo. A List Apart. https://alistapart.com/article/neveruseawarning/
- React, useOptimistic. https://react.dev/reference/react/useOptimistic
- Smith and Mosier 1986; Google AIP-154, 164, 193: see `interface-guidelines/references/evidence.md`.

**Limits.** Tenant switching, bulk-scope banners, and URL encoding rules are judgment drawn from common practice, not from a tested guideline. No controlled study compares pagination and infinite scroll for admin tables; NN/g's guidance is qualitative.
