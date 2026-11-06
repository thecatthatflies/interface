---
name: desktop-app-design
description: Design, build, and review desktop applications that feel native to macOS, Windows, and Linux and that assistive technology and computer-use agents can operate - Electron, Tauri, and native apps; menu bars and context menus, keyboard shortcuts, windows and multi-window state, multi-pane layouts and density, drag and drop with keyboard alternatives, title bars, notifications, tray and menu bar extras, file associations, auto-update, settings windows. Use whenever someone builds or reviews a desktop app or wraps a web app for desktop ("turn our web app into an Electron app", "add a menu bar", "custom title bar", "our Tauri app feels like a website", "add a tray icon", "how should updates work"), even if they never say "native". Not for the in-window web UI patterns themselves such as tables and settings pages (web-app-design), forms (form-design), mobile apps (mobile-app-design), or CLIs and tools for agents (agent-tool-design).
---

# Desktop app design

A desktop app lives among other apps the person already knows. They expect its menus, shortcuts, windows, drag and drop, and system services to behave like everyone else's on that platform, and they use it for hours, often with a keyboard and several windows. The most common model failure is shipping a website in a frame: no real menu bar so Cmd+C and Cmd+Q break, a custom title bar that cannot be dragged or hides the window controls, one platform's conventions forced on the others, drag and drop as the only way to do something, notifications for everything, and an updater that restarts the app mid-work.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first. On desktop, "follow convention" means the host platform's convention, and the platform's accessibility API is the channel both assistive technology and agents read.

## Brief

- **Platforms** in scope, and which one most users are on. Ship each platform's conventions, not one design everywhere.
- **Stack:** native, Electron, or Tauri (which renders with a different web engine per OS). This sets what is free and what you must build.
- **Document-based or not?** Documents imply File menu, recent files, autosave, versions, file associations, multiple windows.
- **Session length and expertise:** hours a day by experts (dense, keyboard-first, customizable) or occasional (sparser, discoverable).
- **Background work:** sync, downloads, builds. Decides tray or menu bar extra, notifications, and what keeps running after the last window closes.
- **Risky operations** and whether they are undoable; what happens to unsaved work on quit, crash, and update.
- **Agent reader:** computer-use agents read the OS accessibility tree (AX on macOS, UI Automation on Windows, AT-SPI on Linux) and screenshots. Is there also a CLI or API?

## Rules

### Menus and commands

- **Provide a real native menu bar** on macOS (App, File, Edit, Format, View, app menus, Window, Help, in that order) and a menu bar or equivalent on Windows and Linux. The menu is where people learn what the app can do. [S: Apple HIG The menu bar; Windows menus]
- **Include the standard Edit items using the framework's roles** (Electron `role: 'editMenu'` or `undo`, `copy`, `paste`; Tauri predefined items). On macOS, text-editing shortcuts are routed through these menu items; leaving them out is the classic cause of broken Cmd+C/V in wrapped apps. [S: Apple HIG; Electron Menu and MenuItem docs; J for the cause]
- **Keep menu items present and disable them when unavailable,** so the menu stays learnable. Context menus are the exception: remove items that do not apply. [S: Apple HIG The menu bar; Windows menus]
- **Never make a context menu, shortcut, or drag the only way to do something.** Every command is also in the menu bar or visible UI. [S: Windows menus; Apple HIG drag and drop]
- **Ellipsis means more input is needed before the command runs** ("Export As…"), not "opens a window". [S: Apple HIG; Windows menus]
- **Show/hide items name the current effect** ("Hide Sidebar" while it is shown); Undo and Redo name the operation ("Undo Move 3 Files"). [S: Apple HIG The menu bar]
- **Labels:** verbs for commands, adjectives for attributes; title case on macOS menus, sentence case on Windows; GNOME and Windows assign access keys to every menu item. [S: Apple HIG; Windows menus; GNOME HIG menus]
- **Platform homes differ:** macOS Settings… in the app menu with Cmd+, ; Windows uses Options or Settings under Tools or File; GNOME puts Preferences, Keyboard Shortcuts, Help, About in the primary menu, with no Quit. [S: Apple HIG Settings; Windows menus; GNOME HIG]

### Keyboard

- **Everything works by keyboard,** including focus moving between panes (F6 on Windows, Cmd+` between windows on macOS) and menus (F10 on GNOME and Windows). [S: WCAG 2.1.1; Windows keyboard accelerators; GNOME HIG keyboard]
- **Respect standard shortcuts and never repurpose them:** copy, paste, undo, redo, find, save, close, quit, settings. Use each platform's mapping (Cmd on macOS, Ctrl elsewhere; Redo is Shift+Cmd+Z on macOS and Ctrl+Y or Ctrl+Shift+Z elsewhere). [S: Apple HIG Keyboards; Windows keyboard accelerators; GNOME HIG]
- **Custom shortcuts only for frequent commands,** shown in the menu beside the item and in tooltips. Avoid Control as a macOS modifier and Ctrl+Alt on Windows (it is AltGr in some layouts); list modifiers in platform order (macOS: Control, Option, Shift, Command). [S: Apple HIG Keyboards; Windows menus]
- **Let people remap** when the app defines many shortcuts. [S: Windows menus; WCAG 2.1.4 for single keys]

### Windows and layout

- **Use the system window frame unless you have a strong reason.** Custom frames rarely match system behaviour. [S: Apple HIG Windows]
- **If you draw a custom title bar,** keep the native window controls (macOS traffic lights; `titleBarOverlay` on Windows and Linux in Electron), make all empty title-bar space draggable, mark every interactive element in it `no-drag`, keep double-click to maximize and right-click for the system window menu, keep the window title text, and keep active and inactive appearances distinct. [S: Windows title bar; Electron custom title bar; Tauri window customization]
- **Restore state:** window size, position, open documents, pane sizes, selection, and scroll return as they were on relaunch, and onto a visible display if monitors changed. [S: Mac HIG 1992 p. 140; Apple HIG Windows; J]
- **Set a minimum window size** at which the layout still works, and let content reflow down to it. [S: Apple HIG Windows]
- **Multi-pane layouts:** sidebar for navigation, content in the middle, inspector on the trailing side; each pane is a landmark-like region with a name, collapsible from the View menu, resizable with a keyboard-reachable splitter. [S: Apple HIG sidebars, View menu; APG window splitter; J]
- **Density for long sessions:** dense content, comfortable targets, honour system text size and contrast settings. [S: foundation; Windows title bar (text scaling, high contrast)]
- **Do not put critical actions in a bottom bar,** which people often push off-screen. [S: Apple HIG Windows]
- **Open new windows when it helps compare or multitask,** not by default; use the word "window" in UI text. [S: Apple HIG Windows]

### Drag and drop

- **Support it where people will try it,** with continuous feedback: a drag image, valid destinations highlighted, invalid ones refused visibly, progress when content takes time to transfer. [S: Apple HIG drag and drop]
- **Move within a container, copy across containers,** with the platform modifier to force copy; dropped content stays selected; drops are undoable. [S: Apple HIG drag and drop]
- **Every drag has a non-drag path:** Cut and Paste, Move To…, keyboard reordering (for example Alt+Up/Down), and a named command an agent can call. [S: WCAG 2.5.7; Apple HIG drag and drop]

### System integration

- **Notifications are for events the person wants while elsewhere,** concise, without sensitive content in the preview, never repeated for the same event, never used for errors the app should show itself, and cleared when the item is seen in the app. Actions do real work and do not just open the app. [S: Apple HIG Notifications; Windows notifications design basics]
- **Tray icon or menu bar extra only for background status or features with no window,** with a tooltip naming the app and status, a menu that includes the app's real controls (open, pause or resume, quit), and an option to hide it. Do not rely on its presence; macOS may hide extras. [S: Windows notification area; Apple HIG The menu bar]
- **Closing the last window:** follow the platform. On macOS document apps usually keep running; on Windows and Linux closing usually quits unless background work is the point, in which case say so the first time and offer a setting. [S: Windows notification area (opt in to minimize to tray); J]
- **File associations and Open With:** register the document types the app really handles, open them into the running instance (Electron single-instance lock and `open-file` / `second-instance`), and list recent documents with names, not paths. [S: Apple HIG The menu bar (Open Recent); J]
- **Badges count unread items only.** [S: Apple HIG Notifications]

### Updates

- **Updates download in the background and apply on the person's terms:** a non-modal "Restart to update" with the version and what changed, applied on next launch by default, never mid-work without consent. [J; Electron autoUpdater applies on next launch]
- **Sign updates and verify them** (Tauri requires signatures; Squirrel.Mac requires a signed app). [S: Tauri updater; Electron autoUpdater]
- **Before restarting, save state and offer to reopen everything,** so an update never loses work. [S: Mac HIG 1992 p. 105 (failure must not destroy work); J]
- **Show the installed version** in About and say where release notes live. [J]

### Saving and safety

- **Autosave documents and offer version history** where possible; Revert lists versions. [S: Apple HIG The menu bar]
- **Quit with unsaved work asks once, with verbs:** "Save", "Don't Save", "Cancel"; never the default on the destructive choice. [S: Mac HIG 1992 pp. 102-103, 206]
- **Crash recovery** reopens with the unsaved work and says what was recovered. [J]

### Accessibility and the agent reader

- **The OS accessibility tree is the agent's view.** Native controls expose roles, names, and states through AX, UI Automation, or AT-SPI. Electron exposes Chromium's tree, built from your HTML, so web semantics apply in full; it enables it when assistive technology is detected, and agents may need `app.setAccessibilitySupportEnabled(true)` or the macOS `AXManualAccessibility` attribute to see it. [S: Electron accessibility]
- **Tauri renders with WebView2 on Windows, WKWebView on macOS, and WebKitGTK on Linux;** semantics and accessibility differ by engine, so test on each. [S: Tauri webview versions]
- **Native menus are readable by agents and screen readers;** HTML menus drawn inside a frameless window are not part of the system menu and must be fully accessible on their own. [J]
- **Window titles name the document or view,** so agents and window switchers can tell windows apart. [S: Apple HIG Windows; Windows title bar]
- **Offer a scriptable path for repeatable work** (CLI, URL scheme, AppleScript or Shortcuts, an API) where agents will automate it; see `agent-tool-design`. [J]

## Build order

1. Platforms and conventions table: menu structure, shortcut map, close and quit behaviour, settings location for each OS.
2. Native menu bar with standard roles, then app commands, each wired to one command function also used by buttons, palette, and shortcuts.
3. Window: system frame (or custom title bar done fully), minimum size, state restoration.
4. Panes and keyboard focus movement between them.
5. Documents: open, save, autosave, recent, associations, single instance.
6. Drag and drop with keyboard and menu equivalents.
7. Background work: notifications, tray or menu bar extra, updates.
8. Style last; `brand-identity` owns the look, the platform owns behaviour.

## Verify

- Web content inside the window: `node <interface-guidelines>/scripts/audit.mjs <dist-dir>` on the renderer build.
- **Each OS, by hand:** Cmd/Ctrl+C, V, X, Z, A, F, S, W, Q, comma work in text fields and lists; menus open by keyboard (F10, Alt, or Ctrl+F2 on macOS with Full Keyboard Access).
- **Accessibility inspector:** macOS Accessibility Inspector, Windows Accessibility Insights or Inspect, Linux Accerciser. Every control has a role, name, and state; window title is meaningful.
- **Screen reader pass:** VoiceOver, Narrator or NVDA, Orca.
- **Agent pass:** drive a primary task through a computer-use agent or the platform automation API from the accessibility tree alone.
- **Title bar:** drag from every empty spot, double-click, right-click, controls reachable, RTL layout.
- **State:** quit and relaunch with two windows, panes resized; unplug the second monitor; force-quit during an edit.
- **Update:** simulate an update while a document is dirty.

## Traps

- `Menu.setApplicationMenu(null)` or a menu without Edit roles, breaking copy and paste on macOS.
- Frameless window with a title bar that cannot be dragged, or buttons inside the drag region that swallow clicks.
- macOS conventions on Windows (traffic lights, Cmd labels) or the reverse.
- Hover-only toolbars and context-menu-only commands.
- Drag-only reordering and file import.
- A notification for every sync, and badges for non-notification numbers.
- Tray icon that cannot quit the app; closing the window silently leaves it running.
- An updater that force-restarts, or one that is unsigned.
- Ignoring system text size, high contrast, reduced motion, and accent colour.
- Testing only in Chromium when Tauri ships WebKit on two platforms.

## References

| File | Read when |
|---|---|
| `references/platforms.md` | Exact menu layouts, shortcut maps, notification and tray rules per platform, Electron and Tauri specifics, and the sources behind this skill |
