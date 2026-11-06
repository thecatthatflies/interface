# Accessibility semantics and automation on mobile

Read this when writing any native or cross-platform component, and when tests or agents will drive the app. Tags: **[E]** empirical, **[S]** platform documentation, **[P]** practitioner, **[J]** judgment.

On mobile, the accessibility tree is the shared channel for three readers: screen reader users (VoiceOver, TalkBack), switch and voice control users, and machines (XCUITest, Espresso, UiAutomator, Appium, Maestro, Detox, and agents that drive phones through the accessibility service or screenshots). A control that is unnamed for VoiceOver is usually unfindable for an agent too.

## Contents

1. What every control needs
2. Labels versus identifiers
3. API cheat sheet by framework
4. Grouping and custom actions
5. Announcements and live updates
6. How tests and agents find controls
7. Checks
8. Sources

## 1. What every control needs

| Property | Meaning | Rule |
|---|---|---|
| Label | What it is or does, spoken first | Names the outcome: "Delete message", not "Trash icon". No role word: "Submit", not "Submit button" [S] Android accessibility |
| Role or trait | Button, link, header, switch, image, adjustable | Use the native control so it is set for you [S] |
| Value or state | Selected, checked, expanded, 3 of 5, "On" | Exposed in the tree and visible on screen [S] |
| Hint | What happens, when not obvious | Optional, brief; people can turn hints off [S] Apple |
| Identifier | Stable handle for code | Not spoken, not localized, unique on screen [S] Apple |

- Each label is unique within a list: "Delete message from Ana, 10:42" rather than ten "Delete" buttons. Build it from data the system owns (IDs, timestamps, the person's own contact names), and keep outsider-written text out of control labels. [S] Android accessibility, foundation `oversight-and-safety.md`
- Decorative images are hidden from the tree. [S]
- Reading order follows visual order. Fix it with grouping or sort priority, not by moving views. [S]

## 2. Labels versus identifiers

| | Label | Identifier |
|---|---|---|
| iOS | `accessibilityLabel` | `accessibilityIdentifier` |
| Android Views | `contentDescription` or visible text | `android:id` resource ID |
| Compose | `contentDescription`, `Text` content | `Modifier.testTag`, visible to UiAutomator only with `testTagsAsResourceId = true` |
| React Native | `accessibilityLabel` or `aria-label` | `testID` |
| Flutter | `Semantics(label:)` | `Key`, `Semantics(identifier:)` |
| Web | accessible name | `id`, `data-testid` |

- Labels are for people and for agents that read the tree as a person would. They are localized and may change with copy edits. [S]
- Identifiers are for scripts that must survive copy and language changes. Apple's identifier is explicitly not presented to the user. [S] Apple UIAccessibilityIdentification
- Use both. An identifier never substitutes for a label: a test that finds a button by identifier passes while VoiceOver says "button". [J]
- Make identifiers semantic and stable (`compose.send`, `inbox.row.<messageId>`), not positional (`button3`) or generated per render. [J]
- In Compose, set `testTagsAsResourceId = true` once high in the hierarchy so UiAutomator, Appium, and Maestro can see tags; then find with `By.res("tag")`, not `By.res(package, id)`. [S] Android Compose testing interoperability

## 3. API cheat sheet by framework

**SwiftUI** [S] Apple

```swift
Button { send() } label: { Image(systemName: "paperplane") }
  .accessibilityLabel("Send message")
  .accessibilityIdentifier("compose.send")

Toggle("Wi-Fi only", isOn: $wifiOnly)         // label, role, and value for free

HStack { avatar; VStack { name; preview }; time }
  .accessibilityElement(children: .combine)   // one element per row
  .accessibilityAction(named: "Archive") { archive(id) }
  .accessibilityAction(named: "Delete") { delete(id) }

Text("3 unsent").accessibilityAddTraits(.updatesFrequently)
```

- Tap gestures on `Text` or `Image` are not buttons. Use `Button`, or add `.accessibilityAddTraits(.isButton)` plus a label. [S]
- `.accessibilityHidden(true)` on decoration. `.accessibilityAddTraits(.isHeader)` on section titles so the rotor can jump. [S]

**UIKit** [S] Apple: `isAccessibilityElement`, `accessibilityLabel`, `accessibilityValue`, `accessibilityTraits`, `accessibilityCustomActions`, `accessibilityIdentifier`; `UIAccessibility.post(notification: .announcement, argument:)`.

**Jetpack Compose** [S] Android

```kotlin
IconButton(onClick = onSend, modifier = Modifier.testTag("compose.send")) {
  Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Send message")
}

Row(Modifier
  .semantics(mergeDescendants = true) {
    customActions = listOf(
      CustomAccessibilityAction("Archive") { archive(id); true },
      CustomAccessibilityAction("Delete") { delete(id); true })
  }) { /* avatar, name, preview, time */ }

Text(status, Modifier.semantics { liveRegion = LiveRegionMode.Polite })
```

- `Modifier.clickable(onClickLabel = "Open message", role = Role.Button)`. `stateDescription` for custom toggles. `heading()` for section titles. `contentDescription = null` for decorative icons. [S]
- Custom clickable elements need `minimumInteractiveComponentSize()`. [S]

**React Native** [S] React Native accessibility docs

```jsx
<Pressable
  onPress={send}
  accessibilityRole="button"
  accessibilityLabel="Send message"
  accessibilityState={{ disabled: !canSend }}
  testID="compose.send">
  <SendIcon aria-hidden />
</Pressable>
```

- `accessibilityActions` plus `onAccessibilityAction` for swipe-row actions. `accessibilityLiveRegion` (`polite`, `assertive`) is Android only; on iOS use `AccessibilityInfo.announceForAccessibility`. [S]
- `accessible={true}` on a container groups its children into one element; children's own buttons then become unreachable, so expose them as actions. [S], [J]

**Flutter** [S] Flutter: `Semantics(label:, button: true, identifier:)`, `MergeSemantics`, `ExcludeSemantics`, `SemanticsService.announce`, `customSemanticsActions`. Flutter renders its own pixels, so missing `Semantics` means the element is absent for every tree reader.

## 4. Grouping and custom actions

- A list row is one element with a combined label, so a screen reader user swipes once per row, not five times. [S] Apple, Android
- Everything a swipe, long press, or drag does on that row is also a named custom action, and also visible somewhere for sighted touch users (an edit mode, a context menu, a detail screen). [S] Apple HIG, WCAG 2.5.1, 2.5.7
- Agents that read the tree see custom actions in some frameworks and not in others; the visible control is the reliable path. [J]

## 5. Announcements and live updates

- Announce results that appear away from focus: "Message sent", "Upload failed, tap to retry". Keep them short and polite. [S]
- Do not announce every tick of a timer or progress bar. Announce start, milestones, and finish. [J]
- After a screen change, move focus to the new screen's title or first meaningful element (`.accessibilityFocused`, `AccessibilityNodeInfo` focus, `AccessibilityInfo.setAccessibilityFocus`). [S]
- Every announcement also leaves a visible, persistent trace, since agents and people who missed the speech need it. [S] foundation

## 6. How tests and agents find controls

| Tool | Finds by | Implication |
|---|---|---|
| XCUITest | Identifier or label (`app.buttons["compose.send"]`, matches either) | Identifiers keep tests stable across localization [S] Apple |
| Espresso | View ID, text, content description; Compose via `ComposeTestRule` semantics | Merged semantics change what is matchable [S] Android |
| UiAutomator | Resource ID, text, description | Compose tags need `testTagsAsResourceId` [S] Android |
| Appium, Maestro, Detox | Accessibility ID (iOS identifier, Android content description), text, resource ID | Cross-platform scripts need the same identifier on both platforms [J] |
| On-device and cloud phone agents | Accessibility tree text and labels, or screenshots with coordinates | Unnamed icons and gesture-only actions are invisible to tree agents; tiny or overlapping targets break coordinate taps [J], foundation `agent-surfaces.md` |

- Give the same action the same label and identifier on iOS and Android. [J]
- Transient UI (snackbars, toasts, haptics) is gone by the agent's next observation. Leave the outcome on screen. [S] foundation
- Custom-drawn surfaces (canvas, game engines, maps, charts) expose nothing unless you add semantics. Provide a list or table alternative for data. [S]
- System permission dialogs and biometric prompts are outside your app's tree; tests handle them with platform interrupt monitors, and an agent should hand them to the person. [S] Apple, [J]

## 7. Checks

- Xcode Accessibility Inspector: audit each screen, and inspect a few controls by hand. [S]
- Android Accessibility Scanner on a device; in Compose tests, `enableAccessibilityChecks()` in recent Compose UI test versions. [S]
- VoiceOver and TalkBack walkthrough of each primary task with the screen curtain on (VoiceOver: three-finger triple tap). [S]
- Voice Control on iOS and Voice Access on Android: say "Tap Send message". If the visible text and the label differ, it fails. [S] WCAG 2.5.3
- A UI test per primary task that uses identifiers, plus one that uses only labels, so both channels stay correct. [J]

## 8. Sources

- Apple: Accessibility HIG, https://developer.apple.com/design/human-interface-guidelines/accessibility; `accessibilityIdentifier`, https://developer.apple.com/documentation/uikit/uiaccessibilityidentification/accessibilityidentifier; SwiftUI accessibility modifiers; XCUITest documentation.
- Android: Make apps more accessible, https://developer.android.com/guide/topics/ui/accessibility/apps; Compose testing interoperability (testTagsAsResourceId), https://developer.android.com/develop/ui/compose/testing/interoperability; Compose accessibility semantics.
- React Native: Accessibility, https://reactnative.dev/docs/accessibility; View `testID`, https://reactnative.dev/docs/view#testid.
- Flutter: Accessibility and `Semantics`, https://docs.flutter.dev/ui/accessibility-and-internationalization/accessibility.
- WCAG 2.2, 2.5.1, 2.5.3, 2.5.7.

Limits: Appium, Maestro, and Detox matching rules change between versions, so the table states them as judgment; check the version in use.
