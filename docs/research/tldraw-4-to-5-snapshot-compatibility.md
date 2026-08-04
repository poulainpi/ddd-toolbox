# Does tldraw 5 still load documents saved by tldraw 4?

Research for [issue #46](https://github.com/poulainpi/ddd-toolbox/issues/46). Date: 2026-08-04.

## The question

This application is pinned to tldraw `4.0.3` (`/Users/pierre/orca/workspaces/ddd-toolbox/upgrade-dependencies/package.json` line 39). Users save documents to `.json` and reload them. The saved artifact is the `document` half of the snapshot — `{ store, schema }` — written straight to JSON, and it is passed back as `loadSnapshot(editor.store, { document: jsonContent })`.

If we upgrade to tldraw 5, do those saved files still open?

## Verdict

**tldraw 5 exists and is the current stable release** — `latest` is `5.2.5`. This is not a hypothetical upgrade.

| Sub-question                                                                                   | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Does tldraw 5 ship store migrations covering the v4 → v5 boundary for tldraw-owned records? | **Yes.** Verified from v5.2.5 source. tldraw 5 _appends_ to the same migration sequences that v4 shipped; it never renumbers or resets them. A v4 document's tldraw-owned records migrate forward automatically.                                                                                                                                                                                                                                                                                                   |
| 2. Do this repository's custom shape records migrate too?                                      | **They do not need to — and they will load unchanged.** Because every custom shape util here declares _no_ migrations, tldraw registers an **empty** migration sequence for it. An empty sequence means zero migrations to apply, so the custom props pass through untouched. No `createShapePropsMigration` work is required _for the upgrade itself_. The real exposure is elsewhere — see sub-question 3.                                                                                                       |
| 3. What happens on failure?                                                                    | **LOUD, and it throws — but where it throws determines whether the user sees anything useful.** `loadSnapshot` throws a plain `Error` on migration failure. In `loadFromUrlIfNeeded` that throw is caught and surfaced as a toast. In `open()` it is **not caught**, so a failed file open rejects an unhandled promise: no toast, no message, the canvas silently stays on the previous document. The _data_ is never silently corrupted, but the _user experience_ of a failure is silent in the file-open path. |

**Bottom line: the v4 → v5 upgrade is very unlikely to break saved documents, and if it does break, it breaks loudly at the data layer.** The defect worth fixing is the missing `try/catch` in `open()`, which turns a loud engine error into a silent no-op for the user.

---

## Evidence

### tldraw 5 is released and stable

`npm view tldraw dist-tags` returns:

```
beta:     2.0.0-canary.3b92faa5cf0a
revision: 4.5.12
latest:   5.2.5
internal: 5.3.0-internal.1640468db8fd
next:     5.3.0-next.7654e7ac2a02
canary:   5.3.0-canary.c16b27b77fef
```

`latest` is `5.2.5`. Note also that the v4 line kept moving — `revision` points at `4.5.12`, well past our pinned `4.0.3`.

Verified locally: `package.json` line 39 is `"tldraw": "4.0.3"`, and `node_modules/tldraw/package.json` confirms the installed version is `4.0.3`.

### Sub-question 1: tldraw-owned records migrate across the v4 → v5 boundary

**Verified from primary source** — the published v5.2.5 sources (`npm pack @tldraw/tlschema@5.2.5`), compared against the v4.0.3 sources in `node_modules`.

The migration machinery is version-keyed by _sequence id_ and _integer version_, not by package major version. `StoreSchema.getMigrationsSince` reads the persisted schema, finds where each sequence left off, and applies everything after that point (`.../node_modules/@tldraw/store/src/lib/StoreSchema.ts` lines 162-228, specifically the slice at line 216: `this.migrations[sequenceId].sequence.slice(idx + 1)`).

So the question reduces to: _did v5 preserve the v4 sequences and simply append, or did it renumber?_ It appended. Comparing the two sources:

The store-level sequence is byte-identical at the low versions — v4 and v5 both begin `RemoveCodeAndIconShapeTypes: 1, AddInstancePresenceType: 2, RemoveTLUserAndPresenceAndAddPointer: 3, RemoveUserDocument: 4, FixIndexKeys: 5` (v4: `.../@tldraw/tlschema/src/store-migrations.ts`; v5: same path in the v5.2.5 tarball).

Per-record sequences grew rather than reset:

| Sequence                 | v4.0.3 highest version | v5.2.5 highest version |
| ------------------------ | ---------------------- | ---------------------- |
| `shapes/TLGeoShape.ts`   | 10                     | 11                     |
| `shapes/TLArrowShape.ts` | 7                      | 8                      |
| `shapes/TLNoteShape.ts`  | 9                      | 13                     |
| `records/TLShape.ts`     | 4                      | 4                      |
| `records/TLInstance.ts`  | 25                     | 26                     |

The note shape makes the pattern unambiguous. v4 ends at `AddRichText: 9`. v5 has the identical list 1-9 and then adds `AddRichTextAttrs: 10, AddFirstEditedBy: 11, MakeFontSizeAdjustmentRatio: 12, RenameFirstEditedByToLast: 13`. Existing ids are untouched.

This is exactly the shape of a working forward-migration path: a v4 file records `com.tldraw.shape.note: 9` in its schema, v5's `getMigrationsSince` finds index 9, slices from 10, and runs migrations 10-13.

Corroborating the intent, `createMigrationSequence`'s own doc comment points at the persistence guide (`.../@tldraw/store/src/lib/migrate.ts` line 27), and tldraw's API reference for `loadStoreSnapshot` states: _"Loads a store snapshot into the current store. The snapshot will be automatically migrated to the current schema version if needed."_ (https://tldraw.dev/reference/store/Store, retrieved via context7).

**Caveat, stated plainly:** the official v5.0.0 release notes are **silent** on document compatibility. Fetched from https://raw.githubusercontent.com/tldraw/tldraw/main/apps/docs/content/releases/v5.0.0.mdx, the notes cover breaking _API_ changes (theme system, `OverlayUtil`, `getIndicatorPath`, `useTldrawUser` removal) and mention migrations only in the context of the _new_ `createCustomRecordMigrationIds()` / `createCustomRecordMigrationSequence()` APIs for custom record types. The terms "persistence", "loadSnapshot", "document compatibility", "backwards compatibility", and "data format" do not appear. **There is no explicit written guarantee that v4 documents load in v5.** The conclusion above is derived from reading the v5 source and confirming the sequences were appended to, not renumbered. That is strong evidence, but it is inference from code, not a documented promise.

### Sub-question 2: custom shapes with no declared migrations

**Verified — zero migration definitions exist in this repository.** Grepping `libs/` and `apps/` for `createShapePropsMigration`, `createMigrationSequence`, `createRecordPropsMigrationSequence`, and `migrations` returns **no matches** in any `.ts`/`.tsx` source file.

The custom shape utils declare `static override type` and `static override props` (validators) but never `static migrations`. Confirmed across all of:

- `libs/feature-domain-storytelling/src/lib/shapes/` — `actor-shape-util.tsx`, `work-object-shape-util.tsx`, `comment-shape-util.tsx`
- `libs/feature-event-storming/src/lib/shapes/sticky-note-shape-util.tsx`
- `libs/feature-bounded-context-canvas/src/lib/shapes/` — `attribution-section-shape-util.tsx`, `ubiquitous-language-business-decisions-section-shape-util.tsx`, `abstract-text-section-shape-util.tsx`, `abstract-section-shape-util.tsx`, `classification/*`, `communication/*`

**What "no declared migrations" means to the engine.** `ShapeUtil.migrations` is an optional static (`.../@tldraw/editor/src/lib/editor/shapes/ShapeUtil.ts` line 138: `static migrations?: LegacyMigrations | TLPropsMigrations | MigrationSequence`). When absent, `processPropsMigrations` takes the null branch and registers an _empty but present_ sequence:

```ts
for (const [subType, { migrations }] of Object.entries(records)) {
    const sequenceId = `com.tldraw.${typeName}.${subType}`
    if (!migrations) {
        // provide empty migrations sequence to allow for future migrations
        result.push(
            createMigrationSequence({ sequenceId, retroactive: true, sequence: [] })
        )
    }
```

Verified identical in both versions — v4 at `.../@tldraw/tlschema/src/recordsWithProps.ts` lines 52-73, and v5.2.5 at the same path lines 158-173. The comment and logic are unchanged.

The consequence: a shape type like `actor` gets sequence id `com.tldraw.shape.actor` with an empty sequence, serialized into the saved file's schema as version `0` (`StoreSchema.serialize`, `.../@tldraw/store/src/lib/StoreSchema.ts` lines 338-348 — `sequence.length ? ...version : 0`). On load, `getMigrationsSince` finds nothing to apply, and the custom props are handed through verbatim.

**So custom shapes are not a v4 → v5 upgrade risk.** They are version `0` before and version `0` after; the tldraw major bump does not touch them. `createShapePropsMigration` work becomes necessary only when _we_ change our own props shape — that is a separate, self-inflicted concern, not something the v5 upgrade forces.

One residual risk worth naming: custom shape props are still **validated** on load against `static override props`. If v5 tightened any shared validator that our props compose (for example a `StyleProp` or a rich-text field reused from tldraw), a v4-authored record could fail validation even though no migration was needed. See "Confidence and open questions".

### Sub-question 3: the failure mode is a throw — trace of the actual code path

**Verified end to end.** The path is `loadSnapshot` → `migrateStoreSnapshot` → `loadStoreSnapshot`, and it throws at two separate points.

**Step 1 — `loadSnapshot` (the editor wrapper).** `.../@tldraw/editor/src/lib/config/TLEditorSnapshot.ts` lines 33-56. Note the branch: our call site passes `{ document: jsonContent }`, which has no top-level `store` key, so it takes the `else` branch at line 53 and is treated as a `TLEditorSnapshot`. The inline migration at lines 42-45 is skipped. (Had it taken the `'store' in _snapshot` branch, it would throw `'Failed to migrate store snapshot: ' + migrationResult.reason` at line 44.)

**Step 2 — `store.loadStoreSnapshot(snapshot.document)`,** called at line 68 inside a `store.atomic(...)` block.

**Step 3 — the throw.** `.../@tldraw/store/src/lib/Store.ts` lines 539-544:

```ts
loadStoreSnapshot(snapshot: StoreSnapshot<R>): void {
    const migrationResult = this.schema.migrateStoreSnapshot(snapshot)

    if (migrationResult.type === 'error') {
        throw new Error(`Failed to migrate snapshot: ${migrationResult.reason}`)
    }
```

Verified **unchanged in v5.2.5** — same method, same throw, at `Store.ts` lines 873-877 of the v5 tarball. Note this throw happens _before_ `this.clear()` at line 550, so a migration failure leaves the existing store intact rather than half-wiped.

**What `migrateStoreSnapshot` returns on error.** `.../@tldraw/store/src/lib/StoreSchema.ts` lines 285-331. It returns `{ type: 'error', reason: MigrationFailureReason.MigrationError }` in exactly two situations: when `getMigrationsSince` fails (line 294), and when a migration function throws while running (line 327, after `console.error('Error migrating store', e)`).

**The enum.** `.../@tldraw/store/src/lib/migrate.ts` lines 340-347:

```ts
export enum MigrationFailureReason {
  IncompatibleSubtype = 'incompatible-subtype',
  UnknownType = 'unknown-type',
  TargetVersionTooNew = 'target-version-too-new',
  TargetVersionTooOld = 'target-version-too-old',
  MigrationError = 'migration-error',
  UnrecognizedSubtype = 'unrecognized-subtype',
}
```

**Which reason would a v4 file hit?** `MigrationFailureReason.MigrationError` — and only that one. This is worth being precise about, because the store-snapshot path is narrower than the enum suggests. `migrateStoreSnapshot` can _only_ produce `MigrationError`; it has no code path that returns `TargetVersionTooNew`, `TargetVersionTooOld`, `IncompatibleSubtype`, or `UnknownType`. Those other variants belong to `migratePersistedRecord` (lines 230-283), the single-record path used for network sync, not for loading a document snapshot.

Concretely, a v4 file would produce `MigrationError` via `getMigrationsSince` returning `Result.err('Incompatible schema?')` (`StoreSchema.ts` lines 210-215) — the case where the persisted version id is not found in the current sequence. That is the failure you would see if v5 _had_ renumbered a sequence. Since the evidence above shows v5 appended rather than renumbered, this should not trigger.

So the user-visible message on the worst realistic case is: `Error: Failed to migrate snapshot: migration-error`, preceded by a `console.error('Error migrating store', ...)`.

**A second, distinct loud failure: validation.** Even after migrations succeed, `loadStoreSnapshot` calls `this.put(...)` which validates every record. Validation failures route through `onValidationFailure` — and tldraw's implementation **rethrows unconditionally** (`.../@tldraw/tlschema/src/TLStore.ts` lines 143-169, ending in `throw error` at line 168). The `isExistingValidationIssue` flag computed at lines 149-152 is only attached as error metadata for reporting; it does **not** suppress the throw despite the comment about allowing "old buggy data". This matters: a v4 record that survives migration but fails a tightened v5 validator still throws rather than being dropped.

**Nothing is silently dropped.** There is no path in `migrateStoreSnapshot` or `loadStoreSnapshot` that skips an unmigratable record and continues. It is all-or-nothing: either the whole snapshot loads, or an exception propagates.

#### The asymmetry in our own call sites — this is the real problem

All in `/Users/pierre/orca/workspaces/ddd-toolbox/upgrade-dependencies/libs/shared-canvas/src/lib/hooks/use-document-persistence.tsx`:

**`open()` — NOT protected (line 40):**

```ts
const jsonContent = JSON.parse(await fileWithHandle.text())
loadSnapshot(editor.store, { document: jsonContent }) // line 40 — no try/catch
editor.clearHistory()
goToContent(editor)
```

`open` is an `async` function with no `try/catch` anywhere in its body (lines 33-53). A throw here produces an **unhandled promise rejection**. There is no `.catch()` at the call site either. The user picks a file, and nothing happens: no toast, no error, no state change — because the throw at `Store.ts` line 543 fires _before_ `this.clear()`, the previous document is still on screen. From the user's point of view the click did nothing. **This is where a loud engine error becomes a silent user experience.**

**`loadFromUrlIfNeeded()` — protected (lines 107-132):**

```ts
try {
    ...
    loadSnapshot(editor.store, { document })   // line 117
    ...
} catch (error) {
    console.error('Failed to load document from URL:', error)
    toast.error('Failed to load document', {
        description: 'The shared link appears to be invalid or corrupted.',
    })
    return false
}
```

Same underlying throw, but caught, logged, and surfaced as a toast.

**Third call site**, `/Users/pierre/orca/workspaces/ddd-toolbox/upgrade-dependencies/libs/shared-canvas/src/lib/menus/menubar.tsx` line 50:

```ts
editor.loadSnapshot({ schema: editor.store.schema.serialize(), store: {} })
```

This one is not a compatibility risk — it builds a fresh empty snapshot from the _current_ schema (`schema.serialize()`), so there is never a version gap to migrate. It is the "new document" action.

---

## What this means for the decision

1. **The upgrade is very unlikely to break saved documents.** v5 preserves and extends the v4 migration sequences rather than resetting them, and our custom shapes sit on empty version-`0` sequences that the major bump does not touch. The mechanism designed to handle exactly this case is present and intact in v5.

2. **We are not blocked on writing migrations.** No `createShapePropsMigration` work is required to make the upgrade safe. That work only becomes necessary when we change our own shape props.

3. **If it does break, it breaks loudly at the data layer — never silently corrupting data.** No partial loads, no quietly dropped shapes. Either the document loads whole or an exception is thrown before the store is cleared, leaving the previous document intact.

4. **But the file-open path swallows that loudness, and that is a bug worth fixing regardless of the upgrade.** `open()` at line 40 has no `try/catch`, so any load failure — a corrupt file, a hand-edited JSON, a future incompatibility — becomes an unhandled rejection with zero user feedback. `loadFromUrlIfNeeded` already demonstrates the right pattern twenty lines below. Bringing `open()` to parity is small, self-contained, and converts the one genuinely bad user experience here into a clear error message. **Recommend doing this before the upgrade**, so that if anything unexpected does surface, users report a real error instead of "the open button doesn't work."

5. **Validate empirically before shipping.** Because the compatibility conclusion rests on reading source rather than a documented guarantee, the cheap decisive test is: save a document with 4.0.3, upgrade a branch to 5.2.5, and open it. Cover every custom shape type — the three domain-storytelling shapes, the event-storming sticky note, and the bounded-context-canvas sections. That test costs far less than the reading did and settles the question definitively.

---

## Confidence and open questions

**High confidence (verified from primary sources):**

- tldraw 5 exists; `latest` is `5.2.5` (npm dist-tags).
- v5 appends to the v4 migration sequences rather than renumbering them (direct diff of v4.0.3 `node_modules` sources against the v5.2.5 npm tarball).
- This repository declares zero migrations anywhere (exhaustive grep).
- A shape util with no `migrations` static gets an empty, retroactive sequence — identical logic in v4 and v5 (`recordsWithProps.ts`).
- The failure mode is a thrown `Error`, in both v4 and v5, before the store is cleared (`Store.ts`).
- `migrateStoreSnapshot` can only yield `MigrationFailureReason.MigrationError`; the other enum variants belong to the single-record path.
- `onValidationFailure` rethrows unconditionally (`TLStore.ts` line 168).
- The `try/catch` asymmetry between `open()` and `loadFromUrlIfNeeded` (direct read).

**Inference, not documented fact:**

- **That v4 documents load cleanly in v5 is a conclusion drawn from source, not a published guarantee.** The v5.0.0 release notes never address document or snapshot compatibility. The code strongly implies compatibility; tldraw has not written it down. Treat the empirical test in point 5 as the real confirmation.

**Open questions:**

- **Tightened validators.** Did v5 make any shared validator stricter in a way that a v4-authored record would now fail? Migrations would run fine, then `put()` would throw during validation. Not investigated in depth — the empirical test would catch it.
- **Intermediate versions.** This compared `4.0.3` directly against `5.2.5`. The v4 line continued to `4.5.12`, and migrations added between `4.0.3` and `4.5.12` are presumably included in v5's sequences, but the specific 4.0.3 → 4.5.x delta was not enumerated. This should not matter, since `getMigrationsSince` slices from whatever version the file records.
- **Session state.** Only the `document` half is saved here, so the `session` half is never restored. Unchanged by the upgrade, but worth noting that `TLSessionStateSnapshot` has its own separate versioning.
- **Non-shape custom records.** v5 adds `createCustomRecordMigrationSequence()` for custom _record types_ (distinct from custom shapes). This repository has none, so it does not apply.

### Sources

- `npm view tldraw dist-tags` / `npm view tldraw versions --json`
- v4.0.3 sources under `/Users/pierre/orca/workspaces/ddd-toolbox/upgrade-dependencies/node_modules/.pnpm/@tldraw+{store,tlschema,editor}@4.0.3*/node_modules/@tldraw/`
- v5.2.5 sources via `npm pack @tldraw/{tlschema,store,editor}@5.2.5`
- https://raw.githubusercontent.com/tldraw/tldraw/main/apps/docs/content/releases/v5.0.0.mdx
- https://tldraw.dev/reference/store/Store and https://tldraw.dev/sdk-features/persistence (via context7 `/llmstxt/tldraw_dev_llms_txt`)
- Local: `libs/shared-canvas/src/lib/hooks/use-document-persistence.tsx`, `libs/shared-canvas/src/lib/menus/menubar.tsx`, `libs/feature-*/src/lib/shapes/*`
