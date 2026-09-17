# AI.md

This project was built with Claude Code (Claude Sonnet 5) as a pair-programmer,
working directly in this repo's terminal/IDE integration. This file covers the
chat feature work (Phases 3, 5, 6 as scoped to chat).

## How it was used

- All chat UI components, hooks, navigation wiring, the dev panel, and this
  documentation were written by Claude, driven by natural-language requests
  plus screenshots of the target design (no Figma file/link — screenshots
  and a couple of hex values were the only design input).
- Every change was verified against `npx tsc --noEmit`, `npx expo lint`, and
  `npx jest` before being reported as done. Where the app itself couldn't be
  run (see Platform limits in README.md), that limitation was stated rather
  than skipped silently.
- `CLAUDE.md` in this repo is the actual spec Claude was working from —
  the correctness model (outbox ordering, idempotent `clientId`, thread
  ordering, drain loop) was written before any UI work and predates this
  styling pass; Claude's job in this phase was to build UI on top of an
  already-correct data layer, not to re-derive that model.

## Where Claude asked instead of guessing

Per `CLAUDE.md`'s own instruction ("ask, don't invent the palette / don't
silently skip a requirement"), Claude stopped and asked the user rather than
guessing in a few places:

- **Exact color values** for the theme (background, primary) before writing
  any component styles.
- **Scope of the conversations-list ("inbox") screen** — the screenshots
  implied a multi-conversation UI, but the mock backend and `Outgoing`/
  `ServerMessage` types only model a single thread. The user chose to keep
  the list as static, hardcoded UI navigating to the one real chat thread,
  rather than extending the data model.
- **Scope of media/gift/reaction/attachment UI** shown in a chat-detail
  screenshot — same reasoning: none of that exists in the text-only data
  model, so it was intentionally left out rather than half-built.
- **Tab bar semantics** — which of 5 tab icons should be a real screen vs.
  a stub, and what the elevated "+" button does — since only two
  screenshots were available to infer navigation structure from.

## Known gaps / things a reviewer should double check

- The chat-detail header's contact info (`Ethan Shoots`, `@ethan_shoots`) is
  hardcoded — there's no per-contact profile in the data model to source it
  from.
- Four of the five tab-bar destinations are placeholder "coming soon"
  screens (`analytics`, `wallet`, `explore`/calendar, `more`) — only the
  chat tab is a real, working screen.
- Performance numbers requested in Phase 5 (dropped frames, memory,
  before/after) were not produced — no device/profiler was available in
  this environment, and it wasn't invented to fill the gap. See README.md.
- Web bundling doesn't currently work, for reasons unrelated to this pass
  (see README.md Platform limits) — this was verified against the base
  commit before any chat UI changes to confirm it wasn't a regression.
