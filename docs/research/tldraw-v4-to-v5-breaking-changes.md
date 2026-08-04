# tldraw 4.0.3 → 5.2.5 breaking changes

Research note for issue #45 (part of map issue #44).

**Version range covered:** `tldraw@4.0.3` (published 2025-10-02) → `tldraw@5.2.5` (published 2026-07-15).
This spans the intermediate minors `4.1.0`, `4.2.0`, `4.3.0`, `4.4.0`, `4.5.0` (plus their patches) and
`5.0.0`, `5.1.0`, `5.2.0`. Breaking changes introduced anywhere in that range are covered below, because
upgrading from 4.0.3 crosses all of them.

## Summary

|                             | Count  |
| --------------------------- | ------ |
| Breaking changes catalogued | 34     |
| **Applicable to this repo** | **12** |
| Not applicable              | 22     |

Every breaking change from the release notes is listed below, including the ones that do not apply — a
"does not apply" entry is deliberate signal, not an omission.

### Method / confidence

Claims here are verified two ways, and each entry says which:

1. **Release notes** — the `💥` API-change entries in the tldraw GitHub releases (primary source, cited per entry).
2. **Empirical** — I downloaded `tldraw@5.2.5`, `@tldraw/editor@5.2.5` and `@tldraw/tlschema@5.2.5`, and
   compiled probe files against the real `.d.ts`, comparing against the installed `4.0.3` types in
   `node_modules/.pnpm/@tldraw+editor@4.0.3_*/`. Where an entry says "verified by compiling", the behaviour was
   observed directly rather than inferred from prose.

One useful negative result up front: I compiled a file importing **all 59 tldraw symbols this repo imports**
against 5.2.5. Only one error came back, and it was a mistake in my own probe. **No symbol this repo imports
was removed in v5.** All the breakage below is in _signatures, types and semantics_, not in missing exports.

## Highest-risk areas for this repo

Ordered by expected effort and by how quietly the change can slip through.

1. **`ShapeUtil.getIndicatorPath()` is abstract, and `indicator()` silently stops working.** This is the single
   biggest item. Every concrete `ShapeUtil` in the repo must now implement `getIndicatorPath()` returning a
   `Path2D`, not JSX. The dangerous half: v5 keeps a deprecated `indicator()` stub on the base class, so the
   repo's 4 existing `override indicator()` methods **still type-check and still compile — they just never
   render anything**. TypeScript will flag the missing abstract member, but if that is satisfied anywhere up the
   chain, the dead `indicator()` overrides will not be flagged. Search for them by hand.
2. **`ShapeUtil<Shape extends TLShape>` generic constraint (was `TLUnknownShape`).** Every custom shape type
   built with `TLBaseShape<'my-type', Props>` now fails the constraint. The fix is a `TLGlobalShapePropsMap`
   module augmentation per custom shape — 11 files declare `TLBaseShape`, and the three-level bounded-context
   inheritance chain is generic over `Type extends string`, so the augmentation has to be threaded through
   the abstract layers.
3. **The three-level inheritance chain amplifies items 1 and 2.**
   `AbstractSectionShapeUtil` → `AbstractTextSectionShapeUtil` / `AbstractClassificationSectionShapeUtil` /
   `AbstractCommunicationSectionShapeUtil` → 10 concrete sections. `getIndicatorPath` and the generic
   constraint both live on the abstract root, so a single correct change at the root fixes all descendants —
   but a wrong one breaks all of them at once. Fix the root first, then typecheck.
4. **`DefaultArrowShapeUtil` (`ArrowShapeUtil`) subclassing — lower risk than expected.** The repo overrides
   only `onEditEnd`, which **survives v5 unchanged** (`onEditEnd?(shape: Shape): void` on the `ShapeUtil` base).
   Verified by compiling a subclass. The arrow util is _not_ a migration blocker.
5. **Saved-document compatibility — resolved, and the news is good.** See the dedicated section below.
6. **`PlainTextLabel` prop renames**, including a genuinely silent one: `align="middle"` is no longer a legal
   value and the repo uses it in 3 of 4 call sites.

## Saved-document / store-schema compatibility (map #44 open question)

**Answer: v4-authored documents load correctly into v5.2.5. This is not a blocker.**

I tested this rather than reasoning about it. I generated a real document snapshot using the repo's installed
`@tldraw/editor@4.0.3`, then loaded it into `@tldraw/editor@5.2.5` through the exact call the app makes —
`loadSnapshot(store, { document })`:

- v4 document written with `schemaVersion: 2`, `com.tldraw.store: 5`, `com.tldraw.shape.note: 9`.
- Loading into v5.2.5 **succeeded**. The note record migrated `9 → 13`, and v5's new
  `textLastEditedBy` prop was populated automatically (`null`) by the migration chain.
- `getSnapshot(store): TLEditorSnapshot` and
  `loadSnapshot(store, _snapshot: Partial<TLEditorSnapshot> | TLStoreSnapshot, opts?)` are **signature-identical**
  between 4.0.3 and 5.2.5.

Two specifics worth recording for this repo:

- `libs/shared-canvas/src/lib/hooks/use-document-persistence.tsx` persists **only** `document.document`
  (the store half), discarding the session half, and reloads it as `{ document: jsonContent }`. That is exactly
  the shape `loadSnapshot` accepts in v5, and it is the half that carries `schema`, so migrations run. Unchanged.
- **The repo defines no shape migrations at all** — `git grep` for `static migrations`,
  `createShapePropsMigration`, `MigrationSequence` and `getShapeMigrations` returns nothing. The custom shapes
  (sections, sticky notes, domain objects, comments) are unversioned, so tldraw's migrator passes their props
  through untouched. No custom-shape migration work is required _for this upgrade_, because v5 does not change
  the props of any shape this repo defines.

Caveat worth stating plainly: this was verified with a built-in `note` shape, since that is what exercises
tldraw's own migration chain. Custom shapes carry no migrations and are passed through, so the risk is low, but
a smoke test opening a real saved `.json` from each of the three tools is still the right pre-merge check.

---

# Applicable breaking changes

## 1. `ShapeUtil.indicator()` → `ShapeUtil.getIndicatorPath()`

- **Changed API:** `ShapeUtil.indicator(shape): JSX.Element`
- **Changed to:** `abstract getIndicatorPath(shape: Shape): TLIndicatorPath | undefined`, where
  `type TLIndicatorPath = { additionalPaths?: Path2D[]; clipPath?: Path2D; path: Path2D } | Path2D`.
  Indicators now render onto a 2D canvas overlay layer instead of as React elements. `indicator()` remains on
  the base class as a **deprecated non-abstract stub** typed `indicator(_shape: Shape): any`, retained only so
  legacy subclasses calling `super.indicator()` keep type-checking. It is never rendered.
- **Affected files (4 overrides):**
  - `libs/feature-bounded-context-canvas/src/lib/shapes/abstract-section-shape-util.tsx:46` — the chain root; fixing this covers all 10 concrete sections
  - `libs/feature-domain-storytelling/src/lib/shapes/comment-shape-util.tsx:122`
  - `libs/feature-domain-storytelling/src/lib/shapes/domain-object-shape-util.tsx:68` (covers `actor-shape-util.tsx`, `work-object-shape-util.tsx`)
  - `libs/feature-event-storming/src/lib/shapes/sticky-note-shape-util.tsx:87`
- **Verified by compiling:** a `ShapeUtil` subclass that overrides only `indicator()` fails with
  `TS2515: Non-abstract class 'A' does not implement inherited abstract member getIndicatorPath`. The
  `override indicator()` method itself produces **no error** — confirming the silent-dead-code risk.
- **Source:** [v5.0.0 release notes, #8469](https://github.com/tldraw/tldraw/releases/tag/v5.0.0) — "Replace `ShapeUtil.indicator()` (returned JSX) with `ShapeUtil.getIndicatorPath()`"; and `@tldraw/editor@5.2.5` `dist-cjs/index.d.ts`.

## 2. `ShapeUtil<Shape extends TLUnknownShape>` → `ShapeUtil<Shape extends TLShape>`

- **Changed API:** `abstract class ShapeUtil<Shape extends TLUnknownShape = TLUnknownShape>` (v4.0.3, `@tldraw/editor` `index.d.ts:5068`)
- **Changed to:** `abstract class ShapeUtil<Shape extends TLShape = TLShape>` (v5.2.5, `index.d.ts:6309`).
  Custom shape types must be registered into the `TLShape` union via module augmentation of
  `TLGlobalShapePropsMap` (`@tldraw/tlschema`); a bare `TLBaseShape<'x', Props>` no longer satisfies the bound.
- **Affected files (11 declare `TLBaseShape`; 20 files contain shape-util subclasses):**
  - `libs/feature-bounded-context-canvas/src/lib/shapes/abstract-section-shape-util.tsx` and the whole section chain (`abstract-text-section-shape-util.tsx`, `classification/abstract-classification-section-shape-util.tsx`, `classification/domain-roles-section-shape-util.tsx`, `classification/strategic-classification-section-shape-util.tsx`, `communication/abstract-communication-section-shape-util.tsx`, `attribution-section-shape-util.tsx`, `ubiquitous-language-business-decisions-section-shape-util.tsx`)
  - `libs/feature-domain-storytelling/src/lib/shapes/comment-shape-util.tsx`, `domain-object-shape-util.tsx`
  - `libs/feature-event-storming/src/lib/shapes/sticky-note-shape-util.tsx`
- **Verified by compiling:** `ShapeUtil<TLBaseShape<'sec', {...}>>` fails with
  `TS2344: Type 'S' does not satisfy the constraint 'TLShape'`. Adding
  `declare module '@tldraw/tlschema' { interface TLGlobalShapePropsMap { sec: {...} } }` and deriving the shape as
  `Extract<TLShape, { type: 'sec' }>` compiles cleanly (exit 0).
- **Source:** `@tldraw/editor` 4.0.3 vs 5.2.5 type definitions; `TLGlobalShapePropsMap` documented in `@tldraw/tlschema@5.2.5` (`"Custom shapes should be defined by augmenting the TLGlobalShapePropsMap type"`).
- **Note:** this specific constraint change is **not** called out in the v5.0.0 release notes. It was found by
  diffing the shipped types. Treat the fix shape as verified (it compiles), but expect the migration to need
  iteration across the generic abstract layers.

## 3. `PlainTextLabelProps`: `font` → `fontFamily`, `align` → `textAlign`, `fill` removed

- **Changed API (v4.0.3):** `{ font: TLDefaultFontStyle; align: TLDefaultHorizontalAlignStyle; fill?: TLDefaultFillStyle; ... }`
- **Changed to (v5.2.5):** `{ fontFamily: string; textAlign: 'center' | 'end' | 'start'; ... }` — `fill` removed,
  and `type` narrowed from `string` to `ExtractShapeByProps<{ text: string }>['type']`.
  **`align="middle"` is no longer a legal value** — the union is `'center' | 'end' | 'start'`.
- **Affected files (4 call sites, 3 of which pass the now-illegal `"middle"`):**
  - `libs/feature-bounded-context-canvas/src/lib/shapes/abstract-text-section-shape-util.tsx:50-58` — `align={this.isInline() ? 'start' : 'middle'}`, `font="draw"`
  - `libs/feature-domain-storytelling/src/lib/shapes/comment-shape-util.tsx:99-107` — `align="start"`, `font="draw"`
  - `libs/feature-domain-storytelling/src/lib/shapes/domain-object-shape-util.tsx:46-54` — `align="middle"`, `font="draw"`
  - `libs/feature-event-storming/src/lib/shapes/sticky-note-shape-util.tsx:66-74` — `align="middle"`, `font="draw"`
- **Verified by compiling:** passing `align="middle" font="draw"` to v5 `PlainTextLabel` yields
  `TS2322: Type 'string' is not assignable to type 'never'`.
- **Source:** [v5.0.0 release notes, #8410](https://github.com/tldraw/tldraw/releases/tag/v5.0.0) — "Change `PlainTextLabelProps` and `RichTextLabelProps`: `font` → `fontFamily`, `align` → `textAlign`, `fill` removed"; confirmed against both packages' `.d.ts`.

## 4. `getDefaultColorTheme()` removed

- **Changed API:** `getDefaultColorTheme({ isDarkMode: boolean }): TLDefaultColorTheme`
- **Changed to:** removed entirely. Use `editor.getCurrentTheme()` and read
  `theme.colors[editor.getColorMode()]`. `TLDefaultColorTheme` and `DefaultColorThemePalette` are removed too.
- **Affected files:**
  - `libs/feature-domain-storytelling/src/lib/shapes/comment-shape-util.tsx:12` (import), `:46` —
    `getDefaultColorTheme({ isDarkMode: this.editor.user.getIsDarkMode() })`
- **Verified:** `grep -c getDefaultColorTheme` on `tldraw@5.2.5` `index.d.ts` returns `0`.
- **Source:** [v5.0.0 release notes, #8410](https://github.com/tldraw/tldraw/releases/tag/v5.0.0) — "Remove `defaultColorNames`, `DefaultColorThemePalette`, `DefaultLabelColorStyle`, `TLDefaultColorTheme` type, and `getDefaultColorTheme()`".

## 5. `useDefaultColorTheme()` removed

- **Changed API:** `useDefaultColorTheme(): TLDefaultColorTheme`
- **Changed to:** removed. Use `editor.getCurrentTheme()` together with `useColorMode()`.
- **Affected files:**
  - `libs/feature-domain-storytelling/src/lib/shapes/domain-object-shape-util.tsx:9` (import), `:34` —
    `const theme = useDefaultColorTheme()`, consumed at `:54` as `theme[shape.props.color].fill`
- **Verified:** `grep -c useDefaultColorTheme` on `tldraw@5.2.5` `index.d.ts` returns `0`.
- **Source:** [v5.0.0 release notes, #8410](https://github.com/tldraw/tldraw/releases/tag/v5.0.0) — "Remove `ARROW_LABEL_FONT_SIZES`, `FONT_FAMILIES`, ... and `useDefaultColorTheme()`".

## 6. `TLDefaultColorTheme` type removed

- **Changed API:** `TLDefaultColorTheme` (exported type from `@tldraw/tlschema`)
- **Changed to:** removed; replaced by `TLThemeColors` / `TLTheme`.
- **Affected files:** the two theme call sites above consume the theme object's indexed shape
  (`theme[shape.props.color].fill`, `comment-shape-util.tsx:46`). The repo does not import the
  `TLDefaultColorTheme` name directly, but both consumers depend on its structure, so both must be reshaped to
  the `TLThemeColors` layout.
- **Verified:** `grep -c TLDefaultColorTheme` on `tldraw@5.2.5` `index.d.ts` returns `0`.
- **Source:** [v5.0.0 release notes, #8410](https://github.com/tldraw/tldraw/releases/tag/v5.0.0).

## 7. `getColorValue()` first argument type changed

- **Changed API:** `getColorValue(theme: TLDefaultColorTheme, ...)`
- **Changed to:** `getColorValue(colors: TLThemeColors, ...)`
- **Affected files:** the repo does not call `getColorValue` directly. **Applies indirectly** — it is the
  documented replacement path for entries 4–6, so the fix for those will likely route through it.
- **Source:** [v5.0.0 release notes, #8410](https://github.com/tldraw/tldraw/releases/tag/v5.0.0).

## 8. `Tldraw` `cameraOptions` / `textOptions` / `deepLinks` props moved into `options`

- **Changed API:** `<Tldraw cameraOptions={...} textOptions={...} deepLinks />`
- **Changed to:** `<Tldraw options={{ camera, text, deepLinks }} />`. Deprecated in 4.4.0 (still working), then
  the standalone props were consolidated in 5.0.0.
- **Affected files:** none currently pass these props — `git grep` for `cameraOptions|textOptions|deepLinks`
  across `libs/` and `apps/` returns nothing. Listed as **applicable-adjacent**: the three `<Tldraw>` mount
  points (`bounded-context-canvas.tsx:197`, `domain-storytelling.tsx:43`, `event-storming.tsx:34`) are where
  this would surface if any are added before the upgrade lands.
- **Source:** [v5.0.0 release notes](https://github.com/tldraw/tldraw/releases/tag/v5.0.0); deprecation in [v4.4.0, #7888](https://github.com/tldraw/tldraw/releases/tag/v4.4.0).

## 9. `TLHandle.canSnap` deprecated in favour of `snapType`

- **Changed API:** `TLHandle.canSnap?: boolean`
- **Changed to:** still present but marked `@deprecated`; replaced by `snapType?: 'align' | 'point'`.
  v5 also adds `snapReferenceHandleId?: string`. **Not yet removed — this compiles in 5.2.5.**
- **Affected files:**
  - `libs/feature-bounded-context-canvas/src/lib/shapes/abstract-section-shape-util.tsx:77` — `canSnap: false`
    inside `getHandles()` (`:69`)
- **Verified by compiling:** a `getHandles()` returning `{ canSnap: false }` compiles without error against 5.2.5.
- **Severity:** low — cleanup, not a blocker.
- **Source:** [v4.1.0 release notes](https://github.com/tldraw/tldraw/releases/tag/v4.1.0) — "Adds a `snapType?: 'point' | 'align'` property to the `TLHandle` class. Deprecates the `canSnap` property."; confirmed in `@tldraw/tlschema@5.2.5`.

## 10. Node.js minimum raised to `>=22.12.0`

- **Changed API:** minimum supported Node was 20.
- **Changed to:** `>=22.12.0`. Node 20 (EOL) is no longer supported, so tldraw can depend on ESM-only packages.
- **Affected files:** build/CI configuration rather than source. **Already satisfied** —
  `.github/workflows/ci.yml:35` pins `node-version: 22`, the root `package.json` declares no `engines` field,
  and the environment used for this research runs Node v22.14.0. Confirm local toolchains are on `>=22.12.0`;
  no repo change is expected.
- **Source:** [v5.2.0 release notes, #9098](https://github.com/tldraw/tldraw/releases/tag/v5.2.0).

## 11. Collaborator user-id APIs typed as `TLUserId` instead of `string`

- **Changed API:** `TLInstancePresence.userId` / `followingUserId`, `TLInstance.followingUserId` /
  `highlightedUserIds`, `Editor.startFollowingUser()`, `Editor.zoomToUser()`, `usePresence()`, `usePeerIds()` — all `string`.
- **Changed to:** all typed `TLUserId`, a **branded string**. Runtime behaviour is unchanged; plain strings must
  be cast at the call site (`editor.startFollowingUser(userId as TLUserId)`).
- **Affected files:** none — the repo calls none of these APIs (`git grep` for
  `startFollowingUser|zoomToUser|usePresence|usePeerIds` returns nothing) and is single-player. Listed as
  applicable only because `TLInstancePresence` records live in the store; since the repo persists only the
  document half (not the session/presence half), even that has no effect.
- **Source:** [v5.2.0 release notes, #9002](https://github.com/tldraw/tldraw/releases/tag/v5.2.0).

## 12. TipTap upgraded v2 → v3 (rich text)

- **Changed API:** tldraw's rich-text editor is built on TipTap; tldraw 4.2.0 upgraded TipTap v2 → v3.
- **Changed to:** TipTap v3. tldraw's own rich-text surface (`toRichText`, `renderPlaintextFromRichText`,
  `TLRichText`) is unchanged and still exported in 5.2.5 — **verified by compiling**. Breakage is limited to
  custom TipTap kit configuration, which this repo does not do.
- **Affected files:** the repo's rich-text usage is confined to tldraw's own helpers, all of which survive:
  - `libs/shared-canvas/src/lib/utils/rich-text-helper.ts` (`renderPlaintextFromRichText`)
  - `libs/feature-domain-storytelling/src/lib/shapes/arrow-shape-util.tsx` (`toRichText`, 4 call sites)
  - `libs/feature-domain-storytelling/src/lib/shape-menu.tsx` (`TLRichText`)
    No custom TipTap extensions or editor kit overrides exist in the repo, so **no action is expected**.
- **Related:** 4.3.0 removed the `TextDirection` export and added an optional `attrs` property to
  `richTextValidator`, noting "a migration may be necessary for older clients/custom shapes". The repo does not
  import `TextDirection` and defines no rich-text custom shapes; the v4→v5 document load test above passed with
  a rich-text-bearing note.
- **Source:** [v4.2.0 release notes](https://github.com/tldraw/tldraw/releases/tag/v4.2.0); [v4.3.0 release notes, #7304](https://github.com/tldraw/tldraw/releases/tag/v4.3.0).

---

# Breaking changes that do NOT apply to this repo

Each verified by grepping `libs/` and `apps/` for the affected symbol.

| #   | Breaking change                                                                                                                                                                                                                        | Why it does not apply                                                                                                                                                                                                                                                                                      | Source                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| 13  | `inferDarkMode` prop → `colorScheme` (`boolean` → `'light' \| 'dark' \| 'system'`)                                                                                                                                                     | Repo never passes `inferDarkMode`. Its own `colorScheme` hits are `TLUserPreferences.colorScheme` (a different, unchanged API) in `app-menu.tsx`, `default-user-preferences.tsx`, `use-theme.ts`, `theme.ts`, `theme-toggle.tsx`, `Layout.astro`                                                           | v5.0.0 #8410                    |
| 14  | `useIsDarkMode()` → `useColorMode()`                                                                                                                                                                                                   | `useIsDarkMode` not imported anywhere                                                                                                                                                                                                                                                                      | v5.0.0 #8410                    |
| 15  | `FONT_FAMILIES`, `FONT_SIZES`, `LABEL_FONT_SIZES`, `STROKE_SIZES`, `TEXT_PROPS`, `ARROW_LABEL_FONT_SIZES` removed                                                                                                                      | None imported; grep returns zero hits                                                                                                                                                                                                                                                                      | v5.0.0 #8410                    |
| 16  | `SvgExportContext.themeId` → `colorMode` (`string` → `'light' \| 'dark'`)                                                                                                                                                              | `SvgExportContext` never used; no custom `toSvg` overrides                                                                                                                                                                                                                                                 | v5.0.0 #8410                    |
| 17  | Overlay component slots removed from `TLEditorComponents` (`Brush`, `ZoomBrush`, `Scribble`, `SnapIndicator`, `Handle`, `Handles`, `SelectionForeground`, `SelectionBackground`, `CollaboratorHint`) → `OverlayUtil` subclasses        | The repo's three `TLComponents` objects override only `Toolbar`, `MenuPanel`, `NavigationPanel`, `StylePanel`, `ContextMenu`, `InFrontOfTheCanvas` — **all of which survive v5**. Notably `InFrontOfTheCanvas` is the slot v5 explicitly recommends for React overlays                                     | v5.0.0 #8469                    |
| 18  | `ShapeIndicator`, `ShapeIndicators`, `ShapeIndicatorErrorFallback` removed from `TLEditorComponents`                                                                                                                                   | Not overridden in any `TLComponents` object                                                                                                                                                                                                                                                                | v5.0.0 #8469                    |
| 19  | Overlay CSS variables/selectors removed (`--tl-color-snap`, `--tl-color-brush-fill`, `--tl-color-brush-stroke`, `--tl-color-laser`, `--tl-layer-overlays-custom`, `.tl-brush`, `.tl-scribble`, `.tl-snap-indicator`, `.tl-handle*`, …) | No repo CSS targets these; the repo styles via Tailwind                                                                                                                                                                                                                                                    | v5.0.0 #8469                    |
| 20  | `assetValidator` removed → `imageAssetValidator` / `videoAssetValidator` / `bookmarkAssetValidator`                                                                                                                                    | Repo defines no assets and imports no asset validators                                                                                                                                                                                                                                                     | v5.0.0 #8031                    |
| 21  | `getMediaAssetInfoPartial` removed → `AssetUtil.getAssetFromFile`                                                                                                                                                                      | Not used                                                                                                                                                                                                                                                                                                   | v5.0.0 #8031                    |
| 22  | `notifyIfFileNotAllowed(file, options)` → `(editor, file, options)`                                                                                                                                                                    | Not used                                                                                                                                                                                                                                                                                                   | v5.0.0 #8031                    |
| 23  | `getAssetInfo(file, options, assetId?)` → `(editor, file, assetId?)`, returns `TLAsset \| null`                                                                                                                                        | Not used                                                                                                                                                                                                                                                                                                   | v5.0.0 #8031                    |
| 24  | `embeds` prop removed from `<Tldraw>` → `EmbedShapeUtil.configure({ embedDefinitions })`                                                                                                                                               | No `embeds=` prop at any of the three mount points                                                                                                                                                                                                                                                         | v5.0.0; deprecated v4.5.0 #8034 |
| 25  | `setDefaultEditorAssetUrls()` / `setDefaultUiAssetUrls()` demoted to `@internal` → pass `assetUrls` to `<Tldraw>`                                                                                                                      | Neither is called                                                                                                                                                                                                                                                                                          | v5.0.0                          |
| 26  | `useTldrawUser` removed → `users` prop (`TLUserStore`) + `TLUserPreferences`                                                                                                                                                           | Not imported. Repo uses `getUserPreferences` / `setUserPreferences`, which are unchanged and still exported (verified by compiling)                                                                                                                                                                        | v5.0.0 #8147                    |
| 27  | `TLDrawShapeSegment.points` → `getPointsFromDrawSegment(segment, scaleX, scaleY)`                                                                                                                                                      | Repo does not use draw shapes or segments                                                                                                                                                                                                                                                                  | v5.0.0                          |
| 28  | `BindingUtil` hook params: `fromShapeType` / `toShapeType` removed in favour of full `fromShape` / `toShape` records                                                                                                                   | Repo defines **no** `BindingUtil` subclasses. It only _reads_ arrow bindings via `getBindingsFromShape` / `getArrowBindings` and casts `binding.props as TLArrowBindingProps` — all unchanged and still exported (`arrow-shape-util.tsx`, `activities-arrows.ts`, `use-story-play.tsx`, `arrow-helper.ts`) | v5.0.0                          |
| 29  | `'middle-legacy'` added to the `align` union resolved by `PlainTextLabel` / `RichTextLabel`                                                                                                                                            | Covered by entry 3; the repo passes `align` literals directly rather than mapping a legacy union through                                                                                                                                                                                                   | v5.0.0                          |
| 30  | `Cmd+Shift+C` moved from "Copy as SVG" to "Copy as PNG"                                                                                                                                                                                | Default keyboard shortcut behaviour; repo defines no conflicting shortcut                                                                                                                                                                                                                                  | v5.0.0 #8532                    |
| 31  | Multi-click simplified to double-click only: `triple_click` / `quadruple_click` events and `onTripleClick` / `onQuadrupleClick` removed; `TLClickEventName` is now `'double_click'`                                                    | No handler in the repo; grep returns zero hits. The `StateNode` subclasses (`ClickedArrowToolUtil`, `PreviewPlacementOnCreateToolUtil` and its 3 subclasses) use pointer events only                                                                                                                       | v5.2.0 #8897                    |
| 32  | `ShapeIndicatorOverlayUtil` / `TLShapeIndicatorOverlay` moved from `@tldraw/editor` to `tldraw`                                                                                                                                        | Neither imported; repo imports only from `tldraw`, never `@tldraw/editor` directly                                                                                                                                                                                                                         | v5.2.0 #9018                    |
| 33  | `StrokePoint.vector` and `setStrokePointRadii` removed from the freehand pipeline                                                                                                                                                      | Not used; repo has no freehand/draw customization                                                                                                                                                                                                                                                          | v5.2.0 #9154                    |
| 34  | `DefaultSelectionBackground`, `TLSelectionBackgroundProps`, `TLEditorComponents.SelectionBackground`, and `useTransform` removed                                                                                                       | None used                                                                                                                                                                                                                                                                                                  | v5.2.0 #9362                    |
| —   | `DefaultTopPanel` export removed                                                                                                                                                                                                       | Not imported                                                                                                                                                                                                                                                                                               | v4.3.0 #7568                    |
| —   | `TextDirection` export removed → use TipTap's native extension                                                                                                                                                                         | Not imported (see entry 12)                                                                                                                                                                                                                                                                                | v4.3.0 #7304                    |
| —   | `editor.spatialIndex` removed from public API → `getShapesAtPoint()` / `getShapeAtPoint()`                                                                                                                                             | Not used                                                                                                                                                                                                                                                                                                   | v4.4.0 #7699                    |
| —   | Excalidraw embed definition removed                                                                                                                                                                                                    | No embeds used                                                                                                                                                                                                                                                                                             | v4.2.0 #6897                    |

---

# Verified-unchanged surface

Worth recording, because it bounds the upgrade. These are the repo's heaviest tldraw dependencies, and **none of
them break**. All verified by compiling against `tldraw@5.2.5`.

- **Reactivity — 37 occurrences of `useValue` / `track`** across `libs/` and `apps/` (the issue's estimate of 37
  is exactly right). `useValue`, `track`, `atom`, `useEditor`, `useReadonly` are all still exported with
  compatible signatures. **No change required.**
- **Validation — `RecordProps` and `T.*` validators.** The issue estimated 49 occurrences; the actual count is
  **73** (`RecordProps` plus `T.` validator references). `RecordProps<S>` and the `T` namespace are unchanged.
  The only caveat is that `RecordProps<S>` inherits the `TLShape` constraint from entry 2, so it is fixed by the
  same augmentation.
- **`StateNode` subclassing (5 classes):** `ClickedArrowToolUtil`, `PreviewPlacementOnCreateToolUtil` and its
  three subclasses (`CommentToolUtil`, `DomainObjectToolUtil`, `StickyNoteToolUtil`). `StateNode` is unchanged
  apart from the additive `static trackPerformance` opt-in. **No change required.**
- **Persistence:** `getSnapshot` / `loadSnapshot` signatures identical; see the compatibility section above.
- **Arrow bindings:** `getArrowBindings`, `TLArrowBinding`, `TLArrowBindingProps`, `TLArrowShape` all unchanged.
- **Geometry & containers:** `Geometry2d`, `Rectangle2d`, `Box`, `Vec`, `HTMLContainer` unchanged.

## Suggested migration order

1. Bump Node if needed (entry 10), then bump `tldraw` to `5.2.5` in the root `package.json`.
2. Add `TLGlobalShapePropsMap` augmentations for all custom shapes (entry 2) — start at
   `abstract-section-shape-util.tsx`, `domain-object-shape-util.tsx`, `comment-shape-util.tsx`,
   `sticky-note-shape-util.tsx`.
3. Convert the 4 `indicator()` overrides to `getIndicatorPath()` (entry 1), and grep for any leftover
   `indicator(` afterwards — the compiler will not catch stragglers.
4. Fix the 4 `PlainTextLabel` call sites (entry 3), mapping `align="middle"` → `textAlign="center"`.
5. Rework the two theme call sites onto `editor.getCurrentTheme()` (entries 4–7).
6. Replace `canSnap: false` with `snapType` (entry 9, optional cleanup).
7. Run `npx nx typecheck` and `npx nx lint` per project, then smoke-test opening a saved `.json` document in
   each of the three tools.
