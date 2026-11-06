---
name: mobile-app-design
description: Design, build, and review phone and tablet interfaces, native and web, that work for people holding a device in one hand on a bad connection and for agents and test tools reading the accessibility tree. Covers iOS (SwiftUI, UIKit) and Android (Compose, Views) conventions, React Native and Flutter, mobile web and PWAs, tab bars and navigation rails, sheets, Dynamic Type and font scaling, safe areas and edge-to-edge, touch targets, thumb reach, gestures with visible alternatives, haptics, permission and notification prompts, offline and flaky networks, VoiceOver and TalkBack, and accessibility identifiers for XCUITest, Espresso, UiAutomator, Appium, or Maestro. Use for "make an app for", "mobile version", "it looks bad on my phone", "iPhone app", "Android screen", "PWA", "bottom nav", "the keyboard covers the button", or any screen whose main reader holds a phone. Not for the form logic itself (form-design), chat UI (ai-chat-design), or desktop apps (desktop-app-design).
---

# Mobile app design

A mobile interface serves someone with partial attention, one free thumb, a screen the size of a hand, a keyboard that eats half of it, and a network that comes and goes. It has to feel like the platform it runs on, and it has to expose itself to VoiceOver, TalkBack, test frameworks, and phone-driving agents through the same accessibility tree. The most common way models get it wrong is building a shrunken desktop web page: hover menus, tiny icon buttons with no names, a hamburger hiding the four places people go daily, layouts that break at 200% text, a keyboard covering the submit button, permission prompts fired at launch, and an app that shows a blank screen or spinner forever the moment the train enters a tunnel.

Apply the ranked principles of `interface-guidelines` (everyone can use it > it tells the truth > it says what it means > the answer comes first > mistakes are survivable > it stays put > the possible is visible > convention > polish). If that skill is installed, read its SKILL.md first.

## Brief

Add these to the foundation brief:

- **Native, cross-platform, or web?** Decide with `references/mobile-web.md` section 1 before anything else. It changes every later answer.
- **Which platforms, and how faithfully?** One shared design, or each platform's own navigation, back behavior, and controls? Default: shared content and brand, platform behavior.
- **Grip and context:** walking, one-handed, gloved, in sunlight, in a car, on a shared tablet? This sets target size, density, and where actions sit.
- **Window sizes:** phone only, or also tablets, foldables, split screen, landscape? Android 16 ignores orientation locks on large screens for apps targeting API 36, so "phone only" is rarely true.
- **Network:** what must work offline, what is read-only offline, what queues? What happens to a half-sent action?
- **Device capabilities and their timing:** camera, location, contacts, notifications. For each, the moment a person first needs it.
- **Agent and test reader:** will UI tests, Appium-style automation, or an on-device agent drive it? Then every control needs a name and a stable identifier.

## Rules

### Platform and navigation

- Follow the platform's navigation model. iOS: tab bar for top-level sections, navigation stack with a Back button, sheets for focused tasks. Android: navigation bar (compact) or rail (medium and wider), system back, top app bar. Shared brand, native behavior. [S] Apple HIG, Material 3
- Tab bars and navigation bars are for 3 to 5 top-level destinations, not actions. Keep them visible across sections, and do not hide or disable a tab because its content is empty; explain the empty state inside it. [S] Apple HIG Tab bars, Material 3
- Put the destinations people use daily in the bar, not behind a hamburger. Hidden navigation reduces discoverability. [E] NN/g, see foundation
- Choose layout by window size class, never by device type. Compact under 600 dp, medium 600 to 839, expanded 840 and up; the class changes with rotation, folding, and split screen. [S] Android window size classes
- Support system back everywhere on Android, including predictive back. Apps targeting API 36 no longer receive `onBackPressed`. A swipe-back on iOS supplements a visible Back button; it does not replace it. [S] Android 16 behavior changes, Apple HIG Gestures
- One sheet at a time. A sheet with Done also offers Cancel or Back. Long, multi-step, or full-media tasks get a full-screen modal or a pushed screen, not a sheet. [S] Apple HIG Sheets
- Alerts are rare. No alert for common, undoable actions, even destructive ones; alert for uncommon irreversible ones, with verb button titles, never OK. [S] Apple HIG Alerts

### Touch, reach, and gestures

- Targets at least 44 x 44 pt on iOS and 48 x 48 dp on Android, with the hit area allowed to exceed the visual. Space them: about 12 pt around bezeled controls, 24 pt around unbezeled ones. [S] Apple HIG Accessibility, Android accessibility
- Put frequent controls where reach is easy and risky ones away from reflex taps. People shift grip constantly and tap most accurately near the middle of the screen; accuracy falls toward the corners. Do not treat a "thumb zone" heat map as a measured law. [E] Hoober 2013, 2017, weak; read `references/platforms.md` section 3
- Every gesture has a visible control that does the same thing, and an accessibility action. Swipe-to-delete also appears in an edit mode or a menu, and as a VoiceOver or TalkBack custom action. [S] Apple HIG, WCAG 2.5.1, 2.5.7
- Do not fight system gestures: screen edges, the home indicator, notification shade. [S] Apple HIG Gestures, Android edge-to-edge
- Actions fire on release, and sliding off cancels. [S] WCAG 2.5.2
- Haptics complement visible feedback, mean one thing consistently, use system patterns for their documented meaning, and stay short. Never the only signal. [S] Apple HIG Playing haptics

### Text, layout, and safe areas

- Use the platform's text styles so text scales: Dynamic Type on iOS, `sp` on Android, relative units on the web. Test at the largest accessibility size. At large sizes, stack rows that were side by side instead of truncating. [S] Apple HIG Typography, WCAG 1.4.4
- Respect safe areas and draw edge to edge: backgrounds extend under system bars, content and controls stay inside insets. Android 15 enforces edge-to-edge for API 35, and Android 16 removes the opt-out for API 36. [S] Apple HIG Layout, Android 15 and 16 behavior changes
- Keep the focused field and its submit action visible above the keyboard. Scroll the field into view, and do not pin a primary button where the keyboard covers it. [J]
- Support both orientations and resizing unless the task truly needs one. [S] Android 16 behavior changes

### Network, permissions, and notifications

- Show cached content with its age ("Updated 10:42") rather than a blank screen or an endless spinner. Distinguish "you are offline" from "the server failed" from "this is empty". [S] foundation, Smith and Mosier 4.1/9
- Queue writes made offline, mark each pending item as pending, say when it syncs, and never silently drop or duplicate it. Use idempotency keys so a retry cannot double-charge or double-send. [J], Stripe idempotency
- Never lose typed input to a network failure, app switch, rotation, or process death. Save drafts locally. [S] Mac HIG, Android 16 on state loss in rotation
- Ask for a permission when the person first uses the feature that needs it, not at launch, unless the app cannot work without it. Write a specific purpose string. [S] Apple HIG Privacy; web.dev permission prompts (allow rate 12% without a user signal vs 30% after interaction, desktop Chrome)
- A pre-permission screen has one button that opens the system prompt, titled "Continue", not "Allow", and no incentive. [S] Apple HIG Privacy
- After a denial, the feature still works in a reduced way or explains how to enable it in Settings with a direct link. On Android, two denials end the system prompt for good. [S] Android runtime permissions
- Notification permission is a feature request, asked after the person has seen what the notifications would be for. Marketing pushes need separate opt-in and an in-app setting to change it. [S] Apple HIG Managing notifications, Android 13 `POST_NOTIFICATIONS`

### Both readers

- Every control has an accessible label that names the outcome, a role, and its state. Icon-only buttons need a label in code, not a tooltip. [S] Apple HIG VoiceOver, Android accessibility
- Give important controls a stable, non-localized identifier for tests and scripts (`accessibilityIdentifier`, Compose `testTag`, React Native `testID`), in addition to, never instead of, the label. Agents that read the tree match on labels; scripts match on identifiers. [S] Apple, Android, React Native docs
- Group a card or row into one element with a combined label, and expose its secondary actions as named custom actions rather than five unlabeled taps. [S] SwiftUI and Compose accessibility APIs
- Announce outcomes that appear away from focus (sent, saved, failed) through the platform's announcement or live region, and keep a persistent record: a snackbar alone vanishes before an agent's next look. [S] foundation, `agent-surfaces.md`
- Outsider-written text (names, messages, reviews) never goes into an accessibility label as if it were a control's purpose. [S] foundation, `oversight-and-safety.md`

## Build order

1. Write the brief, decide native or web, and list the size classes you will support.
2. Navigation skeleton: top-level destinations, back behavior on each platform, where sheets and modals appear.
3. Each screen at compact width with the platform's text styles, safe areas, and real components. Labels, roles, and identifiers go in as the components are written, not after.
4. States: loading, empty, offline with cached data, offline with nothing cached, error, permission denied, and pending writes.
5. Keyboard behavior for every form: input types, autofill, return-key action, field visibility.
6. Medium and expanded layouts (rail, list-detail), then landscape.
7. Permission and notification moments, placed in the flows that need them.
8. Motion, haptics, and brand last.

## Verify

- **Device range:** smallest supported phone (a 320 to 375 pt wide screen), a large phone, a tablet or foldable, landscape, split screen. Both light and dark.
- **Text size:** largest Dynamic Type accessibility size and Android font scale 200%. Nothing truncated that matters, nothing overlapping, every action reachable.
- **Screen reader:** do each primary task with VoiceOver and with TalkBack, eyes off the screen. Every control is announced with a name, role, and state; order follows reading order; custom actions exist for gestures.
- **Automated accessibility:** Xcode Accessibility Inspector audit, Android Accessibility Scanner or Compose `enableAccessibilityChecks()`, and `node <interface-guidelines>/scripts/audit.mjs <url>` for any web surface.
- **Static checks:** `node scripts/mobile-check.mjs <src-dir>` flags disabled zoom, `100vh`, unscaled fixed font sizes, missing input types and autofill, and controls without labels. It is a heuristic linter; review each finding.
- **Network:** airplane mode mid-task, a throttled 3G profile, and the server returning 500 and 429. Typed input survives, pending writes say so, nothing duplicates on retry.
- **Lifecycle:** background the app mid-form, kill it, rotate, return. State and drafts survive.
- **As an agent:** drive the primary tasks using only the accessibility tree (XCUITest `app.buttons["..."]`, UiAutomator `By.desc`, Maestro, or an agent reading the hierarchy). Anything only reachable by coordinates or gesture is a defect.
- **Permissions:** deny every permission and use the app. Revoke one in Settings while the app runs.

## Traps

- Hamburger menu for primary destinations because "it is cleaner".
- Icon-only toolbar buttons with no accessibility label; TalkBack says "Button, unlabeled".
- A custom bottom bar that ignores the home indicator inset, or content hidden under the status bar after the edge-to-edge change.
- Fixed `font-size: 12px`, `.font(.system(size: 12))`, or `fontSize = 12.dp`: text that ignores the person's size setting.
- `100vh` layouts on the web that put the action under the browser's toolbar, and `user-scalable=no`.
- Swipe as the only way to delete, archive, or go back.
- Asking for location, notifications, contacts, and tracking in a row on first launch.
- A spinner with no timeout when offline, or optimistic UI that shows "Sent" for a message that never left the device.
- Using `accessibilityIdentifier` or `testID` as the only name, so tests pass while VoiceOver users hear nothing useful.
- Different labels for the same action on iOS and Android, so cross-platform tests and agents need two scripts.
- Phone layout stretched to a tablet with 1,200-point-wide text lines.

## References

| File | Read when |
|---|---|
| `references/platforms.md` | Building native iOS or Android: navigation, components, sizes, type, safe areas, haptics, reach, adaptive layouts, OS behavior changes |
| `references/mobile-web.md` | Deciding native vs web, or building mobile web or a PWA: viewport, keyboard, safe-area insets, input types, offline, install, web push |
| `references/accessibility-and-automation.md` | Labels, traits, grouping, custom actions, announcements in SwiftUI, UIKit, Compose, React Native, Flutter; identifiers and how tests and agents find controls |
| `references/states-network-permissions.md` | Offline, sync, retries, permission and notification prompts, lifecycle and state restoration |
