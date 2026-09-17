# FanSuite chat

Expo + TypeScript chat screen and subscription paywall built against local
mocks (no real backend, no real billing). See [`CLAUDE.md`](CLAUDE.md) for
the full spec this was built against.

This README covers the **chat feature** only (Phases 1–3, 5, 6 as scoped for
chat). Paywall docs weren't in scope for this pass.

## Get started

```bash
npm install
npx expo start        # iOS / Android
npx expo start --web  # currently broken, see Platform limits below
```

## The duplicate-message bug, and the fix

The bug this project is built to reproduce and then prevent: a client sends
a message, the server accepts it and replies, but the *reply* is lost (e.g.
a dropped response on a flaky connection). A naive client sees "no
confirmation" and assumes the send never happened, so it retries with a
**new** message id — the server has no way to know it's the same message,
and a duplicate lands in the thread.

The fix is idempotency keyed on a stable `clientId`:

- Every outgoing message gets a `clientId` (uuid v4) once, at compose time,
  in [`chatStore.sendMessage`](src/features/chat/store/chatStore.ts).
- That same `clientId` is reused for every retry attempt and survives app
  restarts (it's written to disk via `outboxRepo` before anything else
  happens — see below).
- [`mocks/backend.ts`](src/mocks/backend.ts) keeps a
  `Map<clientId, ServerMessage>` of everything it has ever accepted. On
  `send(clientId, text)`, if that `clientId` was already accepted, it
  returns the *original* stored message instead of allocating a new `seq`.

So a retry after a lost response is a no-op on the server: same `clientId`
in, same message back out, no duplicate. This is exercised directly by
[`dedupe.test.ts`](src/features/chat/__tests__/dedupe.test.ts).

## Key decisions

- **Outbox write ordering.** `sendMessage` awaits `outboxRepo.add()` (disk)
  *before* updating the store or attempting the network call. If the disk
  write throws, the message never enters the queue and the UI shows a
  failure instead of a false "queued" state. This is what makes the
  force-quit-mid-send case safe — see
  [`offlineRestart.test.ts`](src/features/chat/__tests__/offlineRestart.test.ts).
- **Persistence: `expo-sqlite/kv-store` over MMKV.** `shared/storage/kv.ts`
  wraps `expo-sqlite/kv-store` (AsyncStorage-shaped, no dev build required).
  MMKV would be the stronger choice here — it writes synchronously, which
  is a better match for "await the write, then claim it's queued" than an
  async AsyncStorage-shaped API. We didn't take it because MMKV needs a
  custom dev client / native module, and this project is meant to run via
  Expo Go without a native build step.
- **Thread ordering never reshuffles a pending row.** The rendered thread is
  `confirmed.sortBy(seq) ++ outbox.filter(unconfirmed).sortBy(createdAt)`.
  A row only moves once — when it confirms and takes its `seq` position.
  This is enforced in [`useChatThread`](src/features/chat/hooks/useChatThread.ts).
- **Drain loop is serial and stops on disconnect.** One in-flight send at a
  time, oldest first; non-recoverable errors (`MESSAGE_TOO_LONG`,
  `NOT_SUBSCRIBED`) stay `failed` with no retry, recoverable ones go back to
  `pending` for the next drain pass. See
  [`chatStore.drainOutbox`](src/features/chat/store/chatStore.ts).

## Reduced motion & dev panel (Phase 5)

- [`useReducedMotion`](src/features/chat/hooks/useReducedMotion.ts) reads
  `AccessibilityInfo.isReduceMotionEnabled()` and disables the message
  list's auto-scroll animation when the OS setting is on.
- [`mocks/devPanel.tsx`](src/mocks/devPanel.tsx) exposes chat failure
  injection (`offline` toggle, drop-next-response, inject-3-incoming) as a
  row of buttons rendered above the composer, `__DEV__`-only.

## Measurement

CLAUDE.md asks for a profiled scroll-and-type sequence (build mode, dropped
frames, memory) with a before/after comparison. **This wasn't measured** —
this environment has no attached device/simulator and no profiler
(Flipper / Xcode Instruments / Android Studio profiler) available to capture
real frame or memory numbers, and the `--web` target doesn't build (see
below), so there's no target to profile at all. Estimating these numbers
would be worse than not reporting them. If you can run this on a real
device or simulator, the sequence to profile would be: open chat → scroll
to load 3–4 history pages → type a full 400-char message → send it → let it
confirm.

## Test output

```
PASS src/features/chat/__tests__/offlineRestart.test.ts
  offline restart
    ✓ keeps pending sends with the same clientIds after a simulated restart (8 ms)

PASS src/features/chat/__tests__/dedupe.test.ts
  dedupe
    ✓ accepted send + lost response + retry produces exactly one copy in the thread (56 ms)

PASS src/features/paywall/__tests__/delayedConfirmation.test.ts
  delayed confirmation
    ✓ grants no access until the backend confirms, then grants access (856 ms)

Test Suites: 3 passed, 3 total
Tests:       3 passed, 3 total
```

`npx tsc --noEmit` and `npx expo lint` are both clean except for one
pre-existing lint error in the unmodified Expo template file
`src/hooks/use-color-scheme.web.ts`.

## Platform limits

- **Web bundling is broken**, on the base commit as well as with all chat
  work applied. `expo-sqlite/kv-store`'s web implementation imports a
  `wa-sqlite.wasm` worker chunk that the current Metro config can't resolve
  (`Unable to resolve module ./wa-sqlite/wa-sqlite.wasm`). This is a Phase 1
  storage-layer issue, not something introduced by the chat UI work; fixing
  it would mean changing how `kv.ts` is bundled for web, which is out of
  scope for a styling/UI pass.
- Tab bar icons (`assets/images/tabIcons/*.svg`,
  `assets/images/chatIcons/sort.svg`) are tinted via `fill="currentColor"` /
  `stroke="currentColor"`, which required editing the provided SVGs — the
  originals had the color baked into each path.

## Time spent

Not tracked — this was built across an interactive session without a
timer, so any number here would be a guess. The commit history / session
transcript is the more honest record of how the work progressed.

## Also see

[`AI.md`](AI.md) for how AI assistance was used on this project.
