# Platforms

Read this for exact per-platform conventions, Electron and Tauri specifics, and sources. Tags as in SKILL.md.

## Contents

1. Menu structure by platform
2. Shortcut map
3. Title bars and window chrome
4. Notifications, tray, menu bar extras
5. Electron specifics
6. Tauri specifics
7. Accessibility APIs and how agents read them
8. Sources

## 1. Menu structure by platform

**macOS** (Apple HIG, The menu bar) [S]

| Menu | Typical items, in order |
|---|---|
| App name | About, Settings… (Cmd+,), app-level items, Services, Hide, Hide Others, Show All, Quit (Cmd+Q) |
| File | New Item, Open…, Open Recent, Close, Save, Duplicate, Rename…, Move To…, Export As…, Revert To, Page Setup…, Print… |
| Edit | Undo, Redo, Cut, Copy, Paste, Paste and Match Style, Delete, Select All, Find submenu, Spelling and Grammar, Substitutions, Transformations, Speech |
| Format | Font, Text (only for formatted text) |
| View | Show/Hide Tab Bar, Toolbar, Sidebar; Enter/Exit Full Screen |
| App menus | Task-named menus |
| Window | Minimize, Zoom, window list, Bring All to Front, panel show/hide |
| Help | Search field (added by the system), app help |

Apple's guidance includes: always show the same set of items and disable rather than hide; prefer one-word menu titles; prefer Duplicate to Save As; Undo and Redo name their target; Open Recent lists names in recency order, not paths; About comes first in its own group; menu bar extras may be hidden by the system, so expose the same functions elsewhere, for example a Dock menu.

**Windows** (Windows UX guidelines, Menus; Windows 7 era but still the most complete) [S]

- Standard categories for document programs: File, Edit, View, Tools, Help. Other programs may use task-oriented categories. At most 10 categories; avoid categories with one or two items.
- Groups of seven or fewer related items, separators between groups, at most 25 items per level, at most three levels.
- Disable inapplicable menu-bar items; remove inapplicable context-menu items, except standard sets (Cut, Copy, Paste).
- Access keys on every menu item; shortcut keys on the most frequent; never make a shortcut or context menu the only way.
- Ellipsis only when the command needs more input before acting.
- Sentence-style capitalization. "Options" for program settings.
- Context menu order: primary (Open, Run, Print), secondary, transfer (Cut, Copy, Paste), object settings, object commands (Delete, Rename), Properties. Default command in bold. No shortcuts shown in context menus.

**GNOME** (GNOME HIG, header bars and menus) [S]

- Header bar instead of a menu bar: title centred, a few controls, primary menu at the trailing end ("Main Menu").
- Primary menu ends with Preferences, Keyboard Shortcuts, Help, About (About required); no Close or Quit.
- Secondary menus hold actions for the current view only.
- 3 to 12 items per menu, 3 to 6 per submenu, no nested submenus, access key on every item.

## 2. Shortcut map

| Command | macOS | Windows | GNOME |
|---|---|---|---|
| Undo / Redo | Cmd+Z / Shift+Cmd+Z | Ctrl+Z / Ctrl+Y | Ctrl+Z / Shift+Ctrl+Z |
| Cut, Copy, Paste | Cmd+X, C, V | Ctrl+X, C, V | Ctrl+X, C, V |
| Select all | Cmd+A | Ctrl+A | Ctrl+A |
| Find / Find next | Cmd+F / Cmd+G | Ctrl+F / F3 | Ctrl+F / Ctrl+G |
| New, Open, Save | Cmd+N, O, S | Ctrl+N, O, S | Ctrl+N, O, S |
| Print | Cmd+P | Ctrl+P | Ctrl+P |
| Close window or tab | Cmd+W | Ctrl+W | Ctrl+W |
| Quit | Cmd+Q | Alt+F4 (closes window) | Ctrl+Q |
| Settings | Cmd+, | (none standard) | Ctrl+, (common) |
| Rename | Return in Finder lists | F2 | F2 |
| Next pane | (app-defined; Cmd+` cycles windows) | F6 / Shift+F6 | F6 |
| Refresh | Cmd+R | F5 or Ctrl+R | F5 or Ctrl+R |
| Zoom in, out, reset | Cmd+Plus, Minus, 0 | Ctrl+Plus, Minus, 0 | Ctrl+Plus, Minus, 0 |
| Menu bar or primary menu | Ctrl+F2 (keyboard navigation on) | Alt or F10 | F10 |
| Context menu | Ctrl+click, or VoiceOver menu | Shift+F10 or Menu key | Shift+F10 or Menu key |

Sources: Apple HIG Keyboards and The menu bar; Microsoft keyboard accelerators (common accelerators table); GNOME HIG keyboard. Ctrl+, on GNOME and some macOS rows (Cmd+G, Ctrl+F2) are common practice rather than quoted from these pages. [S, J where noted]

Custom shortcut rules: Apple says define them only for the most frequent app commands, avoid Control as a modifier, list modifiers as Control, Option, Shift, Command, and do not add a modifier to an existing shortcut for an unrelated command. Windows says use Ctrl for large-scale effects, function keys for small-scale ones, Shift to extend or reverse, no Ctrl+Alt, avoid locale-dependent characters, and offer remapping when there are many. GNOME says Ctrl+letter, Shift+Ctrl for reverse or extend, avoid Alt (access keys) and Super (system). [S]

## 3. Title bars and window chrome

Windows title bar guidance [S]: all empty space and non-interactive elements are draggable; right-click shows the system window menu; double-click toggles maximize; window icon click shows the system menu; title text scales with text-size settings and may truncate, but icon and caption buttons stay fully visible; elements go semi-transparent when inactive; colours follow high contrast and light/dark; a global search box may sit centred in a taller (48 px) title bar; tabs may occupy the title bar with caption controls anchored at the end.

Apple [S]: avoid custom window frames; if custom, use the system appearances for main, key, and inactive windows; keep window controls clear of toolbar items.

Electron [S]: `titleBarStyle: 'hidden'` keeps macOS traffic lights; on Windows and Linux add `titleBarOverlay` to get native controls back, with `env(titlebar-area-*)` to avoid overlapping them. Mark the bar `app-region: drag`; anything clickable inside needs `app-region: no-drag` or it will not receive clicks; set `user-select: none`; avoid custom context menus on drag regions, where some platforms show the system menu.

Tauri [S]: `decorations: false` removes the frame; add window permissions (`allow-start-dragging`, close, minimize, toggle-maximize); `data-tauri-drag-region` applies only to the element that carries it, not its children; on macOS a custom bar loses some system window features, so prefer the transparent title bar style there.

## 4. Notifications, tray, menu bar extras

Apple Notifications [S]: concise and informative; never several notifications for the same thing; no tasks or instructions in them; errors belong in the app as alerts, not notifications; no sensitive data in previews; provide generic text for when previews are hidden; actions do real work, not just open the app; prefer non-destructive actions; badges only for unread notification counts, kept current, never the only channel.

Windows notifications [S]: informative and actionable; not noisy, since too many interruptions make people turn the channel off; respect Focus sessions; clicking launches into the notification's context; background actions (quick reply) do not launch the app; remove notifications once the item has been seen anywhere.

Windows notification area (Windows 7 era) [S]: only for notifications, status, and features without a window; one icon per component; tooltip names the program and status; left-click shows what people most likely want, right-click the context menu with the default in bold; include Exit, suspend or resume for background tasks, and a way to hide the icon; do not flash or animate continuously; minimize-to-tray only as an opt-in.

## 5. Electron specifics

- **Menus:** `Menu.setApplicationMenu` sets the macOS menu bar and each window's menu on Windows and Linux; `null` removes it. Without one, Electron supplies a default with File, Edit, View, Window. Use `role` items (`appMenu`, `fileMenu`, `editMenu`, `viewMenu`, `windowMenu`, `undo`, `redo`, `cut`, `copy`, `paste`, `selectAll`, `about`, `quit`) to get native behaviour; `&` in labels sets Windows and Linux access keys. [S: Electron Menu, MenuItem]
- **Accessibility:** Electron exposes Chromium's accessibility tree to the OS and turns it on when assistive technology is detected; `app.setAccessibilitySupportEnabled(true)` forces it, and third-party tools on macOS can set `AXManualAccessibility`. [S: Electron accessibility]
- **Updates:** `autoUpdater` emits `checking-for-update`, `update-available` (downloads automatically), `update-downloaded`; `quitAndInstall()` restarts; an update downloaded but not installed applies on next launch. macOS requires a signed app. Squirrel.Windows briefly locks files after first run, so delay the first check. [S: Electron autoUpdater]
- **Single instance and files:** `app.requestSingleInstanceLock()` and the `second-instance` event route a second launch to the running app; `open-file` delivers documents on macOS. [S: Electron app API]
- **Security posture shapes UI trust:** keep `contextIsolation` on and Node out of renderers that show remote or outsider content. [S: Electron security checklist]

## 6. Tauri specifics

- **Web engine per OS:** WebView2 (Chromium) on Windows, WKWebView on macOS, WebKitGTK on Linux, each versioned differently. Test features and accessibility per engine. [S: Tauri webview versions]
- **Menus:** native menus for windows and tray; predefined items (Copy, Paste, Cut, Undo, Redo, Select All, Separator); on macOS all items must sit in submenus and the first submenu becomes the app menu. [S: Tauri window menu]
- **Updates:** the updater requires signed updates, which cannot be disabled; `check()` then `downloadAndInstall()` with Started, Progress, Finished events for a progress display; `relaunch()` restarts; on Windows the default passive install mode shows a small progress window and exits the app. [S: Tauri updater]

## 7. Accessibility APIs and how agents read them

| OS | API | Inspector |
|---|---|---|
| macOS | NSAccessibility (AX) | Accessibility Inspector (Xcode) |
| Windows | UI Automation | Accessibility Insights for Windows, Inspect |
| Linux | AT-SPI | Accerciser |

Computer-use agents combine screenshots with these trees. What they need is what screen readers need: roles, names that match visible text, states (checked, expanded, selected, disabled), and window titles that identify the document. Microsoft's keyboard accelerators invoke controls through UI Automation patterns (Invoke, Toggle, Selection, Expand/Collapse), which is also how automation tools act on them, so standard controls are operable by agents without extra work. [S: Microsoft keyboard accelerators; J]

## 8. Sources

- Apple Human Interface Guidelines: The menu bar, Keyboards, Windows, Drag and drop, Notifications, Settings, Sidebars. https://developer.apple.com/design/human-interface-guidelines/
- Apple, Macintosh Human Interface Guidelines (1992); digest in `research/01-macintosh-hig.md`.
- Microsoft, Windows UX Interaction Guidelines: Menus, https://learn.microsoft.com/en-us/windows/win32/uxguide/cmd-menus; Notification area, https://learn.microsoft.com/en-us/windows/win32/uxguide/winenv-notification.
- Microsoft, Windows app title bar, https://learn.microsoft.com/en-us/windows/apps/design/basics/titlebar-design; Keyboard accelerators, https://learn.microsoft.com/en-us/windows/apps/design/input/keyboard-accelerators; Notifications design basics, https://learn.microsoft.com/en-us/windows/apps/design/shell/tiles-and-notifications/toast-ux-guidance.
- GNOME Human Interface Guidelines: Header bars, Menus, Keyboard. https://developer.gnome.org/hig/
- Electron docs: Menu, MenuItem, Accessibility, autoUpdater, Custom title bar, Custom window interactions. https://www.electronjs.org/docs/latest/
- Tauri v2 docs: Window customization, Window menu, Updater, Webview versions. https://v2.tauri.app/
- WCAG 2.2: 2.1.1, 2.1.4, 2.5.7. https://www.w3.org/TR/WCAG22/
- WAI-ARIA APG, Window splitter pattern. https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

**Limits.** The Windows menu and notification-area guidance dates from Windows 7 and Microsoft marks it as not updated; its principles still match current Fluent guidance, but its visuals do not. Update UX and close-versus-quit behaviour have no platform standard on the web stacks; the rules here are judgment.
