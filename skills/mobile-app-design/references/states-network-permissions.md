# States, network, permissions, and lifecycle

Read this when a mobile screen loads data, saves anything, uses a device capability, or sends notifications. Tags: **[E]** empirical, **[S]** standard or platform guidance, **[P]** practitioner, **[J]** judgment.

## Contents

1. The states every data screen needs
2. Offline and flaky networks
3. Writes, queues, and retries
4. Lifecycle and state restoration
5. Permission prompts
6. Notification consent and content
7. Sources

## 1. The states every data screen needs

| State | Show | Not |
|---|---|---|
| First load, fast | Nothing extra under about 1 s, then a placeholder keeping layout | A spinner flashing for 200 ms [S] foundation |
| First load, slow | Placeholder plus text ("Loading orders") and, after about 10 s, a way out | An endless spinner [S] foundation, HIG Loading |
| Loaded from cache, refreshing | Cached content plus "Updating..." | Blanking the list to reload it [J] |
| Offline, cache available | Content plus "Offline. Showing data from 10:42" | A full-screen error over usable data [S] Smith and Mosier 4.1/9, [J] |
| Offline, nothing cached | What this screen will show, that the device is offline, and a Retry | "Something went wrong" [S] foundation |
| Server error | What failed in the person's terms, whether retry may help, Retry | A raw status code alone [S] foundation |
| Rate limited (429) | When to try again, counting down | Silent failure [S] foundation |
| Empty | Why it is empty and the first action | A blank screen [S] HIG Tab bars, foundation |
| Permission denied | What is unavailable, why, and a button that opens Settings | Repeated prompts [S] Apple, Android |

Distinguish offline, server error, and empty with different words, not one generic illustration. [J]

## 2. Offline and flaky networks

- Assume the network fails mid-request. Set timeouts; a request with no timeout leaves a spinner forever. [J]
- Detect connectivity from request results, not only the OS reachability flag. On the web, `navigator.onLine === true` does not mean internet access. On native, "connected to Wi-Fi" can still mean a captive portal. [S] MDN, [J]
- Show the connection state once, in a stable place (a slim banner under the app bar), not as a toast on every failure. Remove it when the connection returns, and say "Back online". [J]
- Read paths: cache-first with a timestamp for content people revisit (lists, recent items, tickets, boarding passes). The age is part of the data. [S] Smith and Mosier 4.1/9
- Large downloads respect the person's data saver and cellular settings, and ask before using cellular for big media. [J]

## 3. Writes, queues, and retries

- Separate three states for every write: **saved on device**, **sending**, **confirmed by the server**. Show them differently. Optimistic UI is fine only if the item is visibly pending until confirmed and failure is shown on that item. [S] Mac HIG p. 182, via foundation
- Every queued write has a client-generated idempotency key, so a retry after a timeout cannot create a duplicate payment, message, or order. [S] Stripe idempotent requests, IETF Idempotency-Key draft
- Failed writes stay in place with the reason and Retry, and Delete or Edit. Never drop them silently. [J]
- Conflicts (the same record edited on two devices) are shown, not resolved by silent last-write-wins on anything a person typed. [J]
- Payments, bookings, and other irreversible actions do not queue offline. Say they need a connection, and keep the person's input. [J]

## 4. Lifecycle and state restoration

- The OS kills background apps without warning. Persist drafts, scroll position on long lists, and in-progress forms so that returning restores them. SwiftUI `@SceneStorage`, Android `rememberSaveable` and `SavedStateHandle`. [S] Apple, Android
- Rotation, folding, and window resizing recreate Android activities; Android 16 makes rotation possible on large screens even if the app asked not to. Test state survival through each. [S] Android 16 behavior changes
- On return from background, refresh stale data in place, keeping scroll position and any open sheet. [J]
- Sensitive screens (banking, health) may blur in the app switcher; this is the person's data, not a reason to log them out on every switch. [J]

## 5. Permission prompts

Rules [S] Apple HIG Privacy unless noted:

- Request only data the feature needs, and only when the person shows interest in that feature. Launch-time requests are for apps that cannot work without the resource, like navigation and location.
- The purpose string is a brief, complete sentence about how the app uses the resource: "Scan receipts with your camera to add expenses", not "This app needs camera access".
- A custom screen before the system alert may explain; it has one button titled like "Continue" that opens the system alert, no "Allow" wording, no close or skip that avoids the alert, and no incentive. App Store review rejects pre-alert screens that mislead.
- Prefer scoped, user-driven grants over broad permissions: the photo picker instead of full library access, the location button for one-time location, the contact picker. These need no prompt at all. [S] Apple, Android photo picker
- Android: if the person taps Deny for the same permission more than once, the system stops showing the dialog for the life of the install. Check `shouldShowRequestPermissionRationale` and switch to an explanation with a Settings link. [S] Android Request runtime permissions
- After denial, the rest of the app works. The feature explains what it cannot do and offers Settings. Do not ask again on every visit. [S] Apple, Android
- On the web, ask only after a gesture; prompts without a user signal were allowed 12% of the time vs 30% after interaction in Chrome data. [S] web.dev

## 6. Notification consent and content

- Ask for notification permission when the person has done something notifications would serve (followed an order, set a reminder), with copy about what they will receive. [S] web.dev, Apple HIG, [J]
- Android 13 and later require the runtime `POST_NOTIFICATIONS` permission; the same timing rules apply. [S] Android 13
- Marketing notifications need their own explicit opt-in and an in-app setting to change it; never send marketing at Time Sensitive level. [S] Apple HIG Managing notifications
- Let people choose categories in the app (orders, messages, offers) rather than all or nothing. [S] Apple HIG, Android notification channels
- A notification states the event in full, so the lock screen alone is useful: "Your order #4821 is out for delivery, arriving 14:00 to 15:00", not "You have an update!". Keep private content off the lock screen by default for sensitive apps. [J]
- Tapping a notification opens the exact item, with a working Back. [J]
- Anything the notification says is also in the app, since notifications are dismissed and missed. [S] foundation (outcomes outlast toasts)

## 7. Sources

- Apple HIG: Privacy, https://developer.apple.com/design/human-interface-guidelines/privacy; Managing notifications, https://developer.apple.com/design/human-interface-guidelines/managing-notifications; Loading, https://developer.apple.com/design/human-interface-guidelines/loading.
- Android: Request runtime permissions, https://developer.android.com/training/permissions/requesting; Notification runtime permission (Android 13), https://developer.android.com/develop/ui/views/notifications/notification-permission; Android 16 behavior changes; Save UI states, https://developer.android.com/topic/libraries/architecture/saving-states.
- web.dev, Permissions best practices for the web, https://web.dev/articles/permissions-best-practices.
- Stripe, Idempotent requests, https://docs.stripe.com/api/idempotent_requests.
- Smith, S. L., and Mosier, J. N. (1986). Guidelines for Designing User Interface Software. MITRE. https://hcibib.org/sam/
