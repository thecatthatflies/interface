# Native platforms: iOS and Android

Read this when building native or cross-platform screens. Tags: **[E]** empirical, **[S]** standard or platform guideline, **[P]** practitioner, **[J]** judgment. Platform guidance was read in November 2026; both platforms revise it every year, so check the live page when a detail matters.

## Contents

1. Navigation
2. Sizes and spacing
3. Reach: what the evidence does and does not say
4. Type and Dynamic Type
5. Safe areas and edge-to-edge
6. Sheets, alerts, menus, and confirmations
7. Gestures and haptics
8. Adaptive layouts: tablets, foldables, landscape
9. Icons and symbols
10. Where the platforms disagree
11. Sources

## 1. Navigation

| Need | iOS | Android |
|---|---|---|
| 3 to 5 top-level sections | Tab bar, bottom, always visible except under a modal [S] HIG Tab bars | Navigation bar at compact width; navigation rail at medium and wider [S] Material 3, Android adaptive navigation |
| More sections | Customizable tabs; sidebar on iPad; "More" overflow [S] HIG | Navigation drawer at expanded width, modal drawer at compact [S] Material 3 |
| Drill into detail | Navigation stack with a Back button showing the previous title; large title that collapses on scroll [S] HIG Navigation bars, Toolbars | Top app bar with up arrow, plus system back [S] Material 3 |
| Focused subtask | Sheet (medium or large detent) [S] HIG Sheets | Bottom sheet or full-screen dialog [S] Material 3 |
| Actions on current view | Toolbar, not the tab bar [S] HIG Tab bars | Top app bar actions, FAB for the one primary action [S] Material 3 |

Rules:

- **Tabs navigate; they never act.** "Use a tab bar to support navigation, not to provide actions" (HIG Tab bars). A "+" tab that opens a composer is a common pattern in social apps, but it breaks this rule; if you use it, it must open a modal, never switch the selected tab. [S], [J]
- **Do not hide or disable tabs** because a section is empty. Explain the empty state inside the section (HIG Tab bars). [S]
- **Keep each tab's stack.** Switching tabs and returning restores where the person was. Tapping the active tab scrolls to top or pops to root, as the platform does. [S] HIG, [J]
- **Back is predictable.** On Android, system back must always work and must match the up arrow inside a task. Apps targeting API 36 on Android 16 get predictive back animations by default, and `onBackPressed` and `KEYCODE_BACK` are no longer delivered; use `OnBackPressedCallback` or `BackHandler`. [S] Android 16 behavior changes
- **Deep links land in a stack**, so Back goes somewhere sensible rather than out of the app. [J]

## 2. Sizes and spacing

| Platform | Target | Spacing |
|---|---|---|
| iOS, iPadOS | Default 44 x 44 pt, minimum 28 x 28 pt [S] HIG Accessibility | About 12 pt around bezeled elements, 24 pt around unbezeled [S] HIG |
| Android | At least 48 x 48 dp, "larger is even better" [S] Android accessibility | 8 dp between targets [S] Material 3 |
| Web | 24 x 24 CSS px minimum, 44 x 44 enhanced [S] WCAG 2.5.8, 2.5.5 | |
| Empirical | About 9.6 mm for one-handed discrete thumb taps [E] Parhi, Karlson, Bederson 2006, one study | |

Use the 28 pt iOS minimum only for secondary controls in dense, precise contexts. Primary and destructive actions get at least the default, and more if people use the app while moving. Lab sizes underestimate field error (Findlater 2017) [E].

Compose Material components enforce 48 dp minimum touch size; custom `clickable` elements do not, so add `Modifier.minimumInteractiveComponentSize()` or `sizeIn(minWidth = 48.dp, minHeight = 48.dp)`. [S] Android

## 3. Reach: what the evidence does and does not say

What was observed:

- Hoober 2013 logged 1,333 people using phones in public over two months; of 780 touching the screen, 49% used one hand, 36% cradled the phone in one hand and tapped with the other, and 15% used two hands. People changed grip often, even within a task. [E] Hoober 2013, UXmatters, observational
- Hoober 2017, from later touch studies, reports people tap most accurately and confidently near the center of the screen, with tolerance from about 7 mm at the center to about 12 mm in the corners, and that people scroll content to the middle before tapping it. [E] Hoober 2017, UXmatters, practitioner research with limited methods detail

Caveats to state when citing it:

- Field observation from 2013 phones, which were smaller. Grip distribution on today's 6.1 to 6.9 inch phones is not well measured. [J]
- The popular "thumb zone" heat maps are illustrations derived from these observations, not measurements of reach. Treat them as a sketch, not a map. [J]
- Accuracy in the corners is a reason for larger targets there, not a ban on placing things there.

What to do with it:

- Bottom navigation (both platforms already do this) and a reachable primary action are sensible defaults for phones. [S], [E] weak
- Put rare and dangerous actions away from where reflex taps land, never adjacent to the frequent action. Hoober's example: formatting controls next to Send. [P]
- Do not rearrange the whole platform to chase reach. The iOS top-right primary action in navigation bars is a convention people know; moving it costs more than the stretch. Decide by frequency: an action done dozens of times a session belongs within easy reach; one done once a session can sit in the convention's place. [J]
- Make targets in the top corners and along edges larger, not smaller. [E] Hoober 2017

## 4. Type and Dynamic Type

- Use system text styles (`.body`, `.headline`, `MaterialTheme.typography.bodyLarge`). They scale with the person's setting and bold-text preference. iOS body default is 17 pt, minimum 11 pt. [S] HIG Typography
- Apple asks that text enlarge to at least 200%. Android font scale reaches 200% from Android 14. [S] HIG Accessibility, Android 14 features, nonlinear font scaling
- **SwiftUI:** `.font(.body)`; for custom fonts, `.font(.custom("Brand", size: 17, relativeTo: .body))`; for custom metrics, `@ScaledMetric`. `.font(.system(size: 17))` does not scale. [S] Apple
- **UIKit:** `UIFont.preferredFont(forTextStyle:)` or `UIFontMetrics(forTextStyle:).scaledFont(for:)`, plus `adjustsFontForContentSizeCategory = true`. [S]
- **Compose and Views:** text and line height in `sp`, never `dp`, or large text clips. Scaling is nonlinear from Android 14, so do not assume `sp` values add up; test at 200%. [S] Android 14 features
- **React Native:** `allowFontScaling` is on by default; do not turn it off globally. `maxFontSizeMultiplier` is acceptable on a few space-limited labels, never on body text. [S] React Native, [J]
- **Flutter:** respect `MediaQuery.textScaler`; do not clamp to 1.0. [S] Flutter, [J]
- At accessibility sizes, switch side-by-side rows to stacked layouts and reduce columns rather than truncating (HIG Typography). SwiftUI: `ViewThatFits` or `dynamicTypeSize.isAccessibilitySize`. [S]
- Icons that carry meaning scale with text. SF Symbols scale with Dynamic Type automatically. [S] HIG

## 5. Safe areas and edge-to-edge

- Backgrounds and scrolling content may run under the status bar, Dynamic Island, and home indicator; controls and text must sit inside the safe area. [S] HIG Layout
- Android 15 enforces edge-to-edge for apps targeting API 35. Android 16 deprecates and disables the opt-out for apps targeting API 36 on Android 16 devices. Apply `WindowInsets` (`Modifier.safeDrawingPadding()`, `windowInsetsPadding`, or `Scaffold`'s content padding) and handle the IME inset. [S] Android 15 and 16 behavior changes
- A custom bottom bar adds the bottom inset beneath its targets rather than placing targets in the gesture area. [S], [J]
- Landscape on phones has side insets for the camera housing. Test both landscape directions. [J]

## 6. Sheets, alerts, menus, and confirmations

- **Sheets:** one at a time; closing a sheet returns to the parent, not another sheet. A Done button is paired with Cancel or Back; never show all three. Include a grabber on resizable sheets; it is also how VoiceOver users resize them. Use the medium detent for progressive disclosure, full height for composing. [S] HIG Sheets
- **Swipe-to-dismiss a sheet with unsaved input** asks first, offering to discard or keep editing. SwiftUI: `interactiveDismissDisabled(hasChanges)` plus a confirmation dialog. [S] HIG, [J]
- **Alerts:** use sparingly; none for common undoable actions even when destructive; title says what happened; buttons are verbs ("Delete", "Erase"), "Cancel" for cancel, no OK unless purely informational; destructive style only when the destructive result was not what the person deliberately chose. [S] HIG Alerts
- **Action sheets / confirmation dialogs** for choices following an intentional action, like discard draft, save draft, keep editing. [S] HIG Alerts
- **Snackbars and toasts** carry undo for reversible actions, and they disappear, so the change must also be visible in place. [S] Material 3, foundation

## 7. Gestures and haptics

- Use standard gestures for their standard meanings: tap, swipe to navigate back, pull to refresh, long press for context menu, pinch to zoom. Custom gestures are shortcuts that supplement visible controls; they never replace a Back button or a delete action. [S] HIG Gestures
- Avoid the screen edges and the home indicator area for custom gestures. [S] HIG Gestures
- Every multipoint or path-based gesture has a single-pointer alternative (WCAG 2.5.1), and every drag has a non-drag alternative (WCAG 2.5.7). Long press is a shortcut; the same actions appear somewhere visible. [S]
- Haptics: use system patterns for their documented meanings, consistently, as a complement to visual and audio feedback, and keep them short in apps. [S] HIG Playing haptics. People can turn haptics off, so never use them as the only signal. [J]

## 8. Adaptive layouts: tablets, foldables, landscape

| Width class | Range | Typical layout |
|---|---|---|
| Compact | under 600 dp | Single pane, navigation bar |
| Medium | 600 to 839 dp | Single pane or list-detail, navigation rail |
| Expanded | 840 to 1199 dp | List-detail or supporting pane, rail or drawer |
| Large, extra-large | 1200 dp and up | Multi-pane, desktop windowing |

[S] Android window size classes. Compact width covers 99.96% of phones in portrait; compact height covers 99.78% of phones in landscape, where two panes are impractical. "Window size classes are not intended for isTablet-type logic." The class changes during the app's life.

- For apps targeting API 36, Android ignores orientation, resizability, and aspect-ratio restrictions on displays at least 600 dp wide; games are exempt. So save UI state across configuration changes and design for landscape. [S] Android 16 behavior changes
- On iPad, the tab bar can become a sidebar; support Split View and Slide Over unless the app truly cannot. [S] HIG
- Cap reading width on wide windows instead of stretching text lines. [S] foundation

## 9. Icons and symbols

- Prefer SF Symbols on Apple platforms and Material Symbols on Android: they match system weight, scale with text, and people recognize them. [S] HIG, Material 3
- An icon with no visible text still needs an accessibility label, and ambiguous icons need a visible label too. Bottom navigation items carry text labels. [S] Material 3, [J]

## 10. Where the platforms disagree

| Topic | iOS | Android | Decide by |
|---|---|---|---|
| Primary action | Trailing in navigation bar, or toolbar | FAB or bottom of screen | Follow each platform in native apps; in a single cross-platform design, pick the bottom placement only if the action is frequent |
| Back | Visible Back button plus edge swipe | System back gesture or button | Each platform's own; never hide the iOS Back button |
| Dialog buttons | Cancel leading, default trailing | Dismissive left, confirming right, as text buttons | Use the native dialog component and let it place them |
| Tab state on reselect | Pops to root or scrolls to top | Same in Material, less consistent in apps | Implement it; people reach for it |
| Target size | 44 pt | 48 dp | Use 48 everywhere in shared code; the difference is under 10% |

## 11. Sources

- Apple Human Interface Guidelines, read November 2026: Tab bars, Navigation bars, Toolbars, Sheets, Alerts, Accessibility, Typography, Layout, Gestures, Playing haptics, Privacy, Managing notifications, Loading. https://developer.apple.com/design/human-interface-guidelines/
- Material Design 3, navigation bar, navigation rail, and layout guidance. https://m3.material.io/
- Android Developers: Make apps more accessible, https://developer.android.com/guide/topics/ui/accessibility/apps; Use window size classes, https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes; Android 16 behavior changes, https://developer.android.com/about/versions/16/behavior-changes-16; Android 15 behavior changes (edge-to-edge), https://developer.android.com/about/versions/15/behavior-changes-15
- Hoober, S. (2013). How do users really hold mobile devices? UXmatters. https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php
- Hoober, S. (2017). Design for fingers, touch, and people, part 3. UXmatters. https://www.uxmatters.com/mt/archives/2017/07/design-for-fingers-touch-and-people-part-3.php
- Parhi, P., Karlson, A. K., and Bederson, B. B. (2006). Target size study for one-handed thumb use on small touchscreen devices. MobileHCI '06. https://doi.org/10.1145/1152215.1152260
- Findlater, L., et al. (2017). Differences in crowdsourced vs. lab-based mobile and desktop input performance data. CHI '17. https://doi.org/10.1145/3025453.3025820
- Android 14 features: nonlinear font scaling to 200%. https://developer.android.com/about/versions/14/features
- WCAG 2.2, success criteria 1.4.4, 2.5.1, 2.5.2, 2.5.5, 2.5.7, 2.5.8. https://www.w3.org/TR/WCAG22/

Limits: Hoober's 2017 figures were read through his column summary and a companion page, not raw data. The Material 3 pages render client-side and were read through Android developer documentation that mirrors them.
