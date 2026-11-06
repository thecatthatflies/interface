# Mobile web and PWAs

Read this to decide between native and web, and when building any web page whose main reader holds a phone. Tags: **[E]** empirical, **[S]** standard, platform or browser documentation, **[P]** practitioner, **[J]** judgment. Browser support moves; check current support before relying on anything marked "Chromium only" or "support varies".

## Contents

1. Native, cross-platform, or web: how to decide
2. Viewport and zoom
3. Viewport height and the on-screen keyboard
4. Safe-area insets
5. Input types and the keyboard
6. Touch, hover, and pointer
7. Offline, storage, and network
8. Install, notifications, and device APIs
9. Agents and mobile web
10. Sources

## 1. Native, cross-platform, or web: how to decide

Ask these in order. The first strong answer usually decides. [J], drawing on the platform facts below.

| Question | Leans native | Leans web |
|---|---|---|
| Do people arrive from a link, search, or QR code and use it once or rarely? | | Yes: no install step |
| Is it used daily, for minutes at a time? | Yes | |
| Does it need background work, reliable push, widgets, Live Activities, health, Bluetooth, NFC on iOS, or deep OS integration? | Yes | |
| Must it work fully offline with large local data? | Yes, or a PWA on Android only | |
| Is the team web-only, and does the content change daily? | | Yes |
| Must it reach people who will not install anything (government services, checkout, booking)? | | Yes |

- Cross-platform frameworks (React Native, Flutter, Kotlin Multiplatform, .NET MAUI) are native apps for these purposes. They inherit native accessibility only if you use their accessibility props; Flutter draws its own widgets and exposes semantics through its `Semantics` tree. [S] framework docs
- A web view wrapped as an app gets the worst of both unless its pages are built to mobile-web standards and its navigation feels native. [J]
- Even with a native app, keep a mobile web path for links people share and for agents that cannot install apps. [J]

## 2. Viewport and zoom

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

- Never `user-scalable=no` or `maximum-scale=1`. They block people with low vision, WCAG requires 200% text resize, and iOS ignores them by default anyway. [S] MDN viewport, WCAG 1.4.4
- Use `viewport-fit=cover` only if you also pad with safe-area insets (section 4). [S] MDN
- Prevent the iOS zoom-on-focus by giving inputs a computed font size of at least 16 px, not by disabling zoom. [P] Vercel, Rauno, see foundation

## 3. Viewport height and the on-screen keyboard

- `100vh` on mobile browsers equals the height with the browser toolbar retracted, so a `100vh` layout puts its bottom under the toolbar. Use `100dvh` (dynamic), `100svh` (smallest, stable), or `100lvh` (largest). Prefer `svh` for layouts that should not jump while scrolling, `dvh` for full-screen app shells. Keep a `100vh` fallback before it for old browsers. [S] CSS Values and Units 4
- Keyboard behavior differs by browser. The `interactive-widget` viewport key (`resizes-visual` default, `resizes-content`, `overlays-content`) controls whether the keyboard resizes the layout viewport; support varies, so test on iOS Safari and Android Chrome. [S] MDN viewport
- The Visual Viewport API (`window.visualViewport`, its `resize` event) tells you the area the keyboard leaves. Use it to keep a fixed bottom bar above the keyboard or to scroll the focused field into view. [S] MDN
- A `position: fixed; bottom: 0` button can end up behind the keyboard on iOS. Put the submit button in the document flow after the last field, or reposition with `visualViewport`. [J]
- Call `element.scrollIntoView({ block: 'center' })` on focus only if the browser did not already; double scrolling jumps. [J]

## 4. Safe-area insets

```css
.bottom-bar {
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

- `env(safe-area-inset-*)` returns non-zero values only with `viewport-fit=cover`. [S] MDN env()
- Add the inset to padding below the targets; do not shrink the targets to fit. [J]
- Landscape phones have left and right insets. [J]

## 5. Input types and the keyboard

Specific to mobile; general form rules belong to `form-design`.

| Field | Markup | Why |
|---|---|---|
| Email | `type="email" autocomplete="email"` | Email keyboard, autofill [S] HTML |
| Phone | `type="tel" autocomplete="tel"` | Phone pad [S] |
| One-time code | `inputmode="numeric" autocomplete="one-time-code"` | Number pad, SMS code suggestion [S] HTML, WebKit |
| Card number, ZIP with digits only | `inputmode="numeric"`, not `type="number"` | `type="number"` adds spinners, drops leading zeros, accepts "e" [S] MDN, GOV.UK |
| Amount with decimals | `inputmode="decimal"` | Decimal pad [S] |
| Search | `type="search" enterkeyhint="search"` | Search key [S] |
| Last field before submit | `enterkeyhint="done"` or `"send"` | Key label matches outcome [S] HTML |
| Names, free text | `autocapitalize="words"` or `"sentences"`; `autocorrect="off"` for usernames and codes | [S] HTML |

- Labels stay visible above the field while typing; placeholder text disappears. [S] foundation
- Do not autofocus a field on page load on phones; the keyboard covers the page before the person has read it. Exception: a page whose only job is that field, like search. [J]
- Native `<select>` and `<input type="date">` open the platform pickers, which are accessible and enumerable. A custom dropdown on mobile is usually worse for both readers. [S] foundation `agent-surfaces.md`, [J]

## 6. Touch, hover, and pointer

- Gate hover effects with `@media (hover: hover) and (pointer: fine)`; on touch, a `:hover` state sticks after a tap. [S] Media Queries 4
- Nothing exists only on hover. [S] foundation
- `touch-action: manipulation` on controls removes the double-tap-to-zoom delay without disabling pinch zoom. [S] MDN
- Do not `preventDefault` on `touchmove` for the whole page; it breaks scroll and system gestures. Use passive listeners. [S] MDN
- Pull-to-refresh in the browser conflicts with custom pull gestures; `overscroll-behavior: contain` on inner scrollers stops scroll chaining. [S] MDN

## 7. Offline, storage, and network

- `navigator.onLine === true` does not mean the internet works; only `false` is reliable. Detect failure from real requests, with a timeout. [S] MDN Navigator.onLine
- A service worker can serve the shell and cached data offline. Show the data's age, and mark it as cached. [S] web.dev, foundation
- Safari may delete script-writable storage (IndexedDB, localStorage, service worker caches) for sites without user interaction in the last seven days of browser use; Home Screen web apps are exempt. Do not keep the only copy of unsent work there for long. Request `navigator.storage.persist()` where supported. [S] WebKit 2020 tracking prevention update, MDN StorageManager
- Background Sync is Chromium only. On iOS, retry when the page is next open and visible. [S] MDN

## 8. Install, notifications, and device APIs

- **Install:** a web app manifest with name, icons, `display: standalone`, and `start_url`. Android Chrome can prompt; iOS installs only through Share then Add to Home Screen, which few people find. Do not build a flow that depends on install. [S] MDN manifest, [J]
- **Web push on iOS** works only for web apps added to the Home Screen, from iOS and iPadOS 16.4. In the browser tab, it is not available. [S] WebKit 2023
- **Permission timing:** ask only after a user gesture, in context. In Chrome data, 77% of desktop permission prompts appeared without a signal of user intent and 12% of those were allowed; after interaction, 30%. Browsers now quiet or auto-block prompts from sites with low acceptance. [S] web.dev permissions best practices
- **Pre-prompt pattern on the web:** an in-page explanation with a button that triggers the browser prompt; if the person declines in the page, do not call the browser prompt, so they can still be asked later. [S] web.dev
- **Camera, location, contacts:** the Contact Picker is Chromium Android only; geolocation and camera need HTTPS and a gesture. [S] MDN

## 9. Agents and mobile web

- Browser agents usually run with a desktop or emulated phone viewport and read the accessibility tree. A layout that hides the navigation behind a closed hamburger at phone width hides it from them too, unless the menu button has a name and the menu items are reachable once opened. [S] foundation `agent-surfaces.md`, [J]
- Bottom sheets and drawers built from divs with transforms often lack `dialog` semantics and leave the background operable. Use `<dialog>` with `showModal()`. [S] foundation
- Keep the same accessible names at every width. A button that says "Filter" at desktop and is an unnamed funnel icon on mobile breaks scripts and agents that switch viewports. [J]
- Run the foundation audit, which includes a phone-width pass: `node <interface-guidelines>/scripts/audit.mjs <url>`.

## 10. Sources

- MDN: `<meta name="viewport">`, https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport; `env()`; Visual Viewport API; `Navigator.onLine`; `StorageManager.persist()`; `touch-action`; `overscroll-behavior`; Web app manifest; Background Synchronization API.
- CSS Values and Units Level 4 (viewport-percentage lengths: `svh`, `lvh`, `dvh`). https://www.w3.org/TR/css-values-4/
- HTML Living Standard: `inputmode`, `enterkeyhint`, `autocomplete` tokens including `one-time-code`. https://html.spec.whatwg.org/
- web.dev, Permissions best practices for the web. https://web.dev/articles/permissions-best-practices
- WebKit blog (2020), Full third-party cookie blocking and more (seven-day cap on script-writable storage). https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
- WebKit blog (2023), Web Push for web apps on iOS and iPadOS. https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- WCAG 2.2, 1.4.4 Resize Text. https://www.w3.org/TR/WCAG22/
- GOV.UK Design System, Text input: numbers. https://design-system.service.gov.uk/components/text-input/
