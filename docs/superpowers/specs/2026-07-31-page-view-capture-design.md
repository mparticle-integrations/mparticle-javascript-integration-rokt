# Page-View Capture into Local Session Attributes

**Date:** 2026-07-31
**Branch:** `capture-page-views` (branched off `main`; PR targets `development`)
**Module:** Rokt Web Kit (`@mparticle/web-rokt-kit`, module ID 181)
**Source file:** `src/Rokt-Kit.ts`

## Problem

The kit should record page-view events as they are logged and store them
durably ("offline") so they can be processed later. The stored history should
automatically feed into the next `selectPlacements` call as targeting context.

## Key facts established during design

- The forwarder already exposes a per-event hook: `process(event: SDKEvent)`
  (`src/Rokt-Kit.ts:1164`). It is invoked by the mParticle SDK for every logged
  event. No new registration or hook is required.
- Page views are identified by `event.EventDataType === 3`
  (`MessageType.PageView`, confirmed in `@mparticle/web-sdk` types). The page
  name is `event.EventName`.
- The full URL is **not** carried in the page-view event payload — `logPageView()`
  only attaches `{ hostname, title }`. The reliable full URL is
  `window.location.href`, read at capture time. The kit runs browser-side, so
  `window` is always available.
- `setLocalSessionAttribute(key, value)` / `getLocalSessionAttributes()` live on
  the core SDK's Rokt manager (`window.mParticle.Rokt`). `setLocalSessionAttribute`
  **persists to browser storage** (`persistenceData.gs.lsa` → `savePersistence`).
  That persistence is the "offline" durability we rely on, and values may be
  arrays/objects.
- `returnLocalSessionAttributes()` (`src/Rokt-Kit.ts:865`) already reads the
  store back into `selectPlacements`, **but** it early-returns `{}` unless a
  placement-event mapping lookup is non-empty. That guard must be relaxed for
  captured page views to reach `selectPlacements`.

## Design

### Data shape

A single local-session-attribute key, `mpPageViews`, holds a JSON array of the
last **N = 25** entries, newest last:

```ts
interface StoredPageView {
  name: string;      // event.EventName
  url: string;       // window.location.href (full, verbatim — see Security note)
  timestamp: number; // event.Timestamp
}
```

Constants:
- `PAGE_VIEWS_KEY = 'mpPageViews'`
- `MAX_PAGE_VIEWS = 25`

### Capture flow (in `process()`)

After the existing readiness check, and guarded by
`typeof mp().Rokt?.setLocalSessionAttribute === 'function'`:

1. If `event.EventDataType !== MESSAGE_TYPE_PAGE_VIEW (3)`, skip page-view
   capture (existing placement-mapping logic is unaffected).
2. Read the current list: `mp().Rokt.getLocalSessionAttributes()?.[PAGE_VIEWS_KEY]`,
   defaulting to `[]`. Coerce non-arrays to `[]` defensively.
3. Build the record: `{ name: event.EventName, url: sanitizeUrl(window.location.href), timestamp: event.Timestamp }`.
4. Append; if `list.length > MAX_PAGE_VIEWS`, drop from the front (evict oldest).
5. Write back via `mp().Rokt.setLocalSessionAttribute(PAGE_VIEWS_KEY, list)`.

Capture is wrapped so a malformed event can never throw out of the forwarder
(consistent with the rest of `process()`), and runs in addition to — not instead
of — the existing placement-event-mapping logic.

### Feeding `selectPlacements`

Relax the guard in `returnLocalSessionAttributes()` so it returns the stored
attributes whenever the store is available and populated, rather than only when
a placement-event mapping lookup is non-empty. This makes `mpPageViews` flow
into `selectPlacements` through the existing path, without duplicating the store
read.

### URL sanitization boundary

`sanitizeUrl(href: string): string` isolates URL handling. Per the decision
below it returns `href` verbatim for now. Tightening to strip the query and
fragment later is a one-line change inside this helper and touches nothing else.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Downstream purpose | Feed the next `selectPlacements` | Reuses existing `returnLocalSessionAttributes()` path |
| Payload per view | Full list, last N (name + url + timestamp) | Richest targeting signal |
| Detection | `event.EventDataType === 3` (PageView) | Standard mParticle page-view classification |
| List cap (N) | 25 | User choice; see size caveat below |
| URL handling | Full URL verbatim | User choice; see Security note |

## ⚠️ Security note (Rokt secure-coding policy)

The stored value is the **full URL including query string and fragment**. Query
strings frequently carry PII (emails, tokens, order IDs). This list is
**persisted to browser storage and sent to Rokt** on the next `selectPlacements`.
The full-URL choice is implemented as requested; the recommended safer default
is to strip the query and fragment. The `sanitizeUrl()` helper isolates this so
it can be tightened later without touching capture logic.

**Size caveat:** N = 25 full URLs is persisted to cookie/localStorage-backed
storage, which has size limits. If entries approach those limits, revisit N or
the URL handling.

## Testing

Vitest cases in `test/src/tests.spec.ts`:

1. A page-view event (`EventDataType === 3`) appends a record with correct
   `name`, `url`, and `timestamp`.
2. A non-page-view event does not append.
3. The list caps at `MAX_PAGE_VIEWS` and evicts the oldest entry.
4. Capture no-ops when `setLocalSessionAttribute` is unavailable (does not throw).
5. Stored page views surface through `returnLocalSessionAttributes()` and into
   `selectPlacements`.

## Out of scope

- No new kit setting / server-side feature gate (capture is always on when the
  store is available).
- No query-string stripping (deferred behind `sanitizeUrl()`).
- No changes to placement-event mapping behavior.
