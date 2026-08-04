# Astro 5.14 to 7: breaking-change surface and integration compatibility

Research for [#48](https://github.com/poulainpi/ddd-toolbox/issues/48), part of the upgrade map [#44](https://github.com/poulainpi/ddd-toolbox/issues/44).

All version facts were read from the npm registry (`npm view`) and from each project's GitHub repository on 2026-08-04. Breaking changes come from the official Astro upgrade guides.

## Headline

Three findings change the shape of the upgrade:

1. **Astro 7 requires Vite 8, and Vitest 3 cannot run on Vite 8.** The repository is on Vite 7.1.7 and Vitest 3.2.4. Astro 7 therefore drags in a Vitest 4 major upgrade that is not currently on the map. This is the constraint most likely to force a reordering.
2. **`@astrolib/seo` is abandoned and will never declare Astro 7.** No commit upstream since July 2024, no publish since October 2024. It is also only three source files, and replacing it is cheap.
3. **`@yeskunall/astro-umami` already supports Astro 7 upstream, but the fix is unreleased.** The commit exists on `main`; the published `0.0.9` still caps at Astro 6.

Neither of the risky two is a genuine blocker. Details and options below.

## Version and compatibility matrix

| Package | In repo | Latest | Astro 7 ready? |
| --- | --- | --- | --- |
| `astro` | 5.14.1 | 7.1.6 | n/a |
| `@astrojs/react` | 4.4.0 | 6.0.2 | Yes, via the v6 major |
| `@astrojs/sitemap` | 3.6.0 | 3.7.3 | Yes, no major needed |
| `@astrolib/seo` | 1.0.0-beta.8 | 1.0.0-beta.8 (Oct 2024) | **No, and never will be** |
| `@yeskunall/astro-umami` | 0.0.7 | 0.0.9 | **Committed upstream, unreleased** |
| `vite` | 7.1.7 | 8.2.0 | Astro 7 needs Vite 8 |
| `vitest` | 3.2.4 | 4.1.10 | **Vitest 3 caps at Vite 7** |
| `nx` / `@nx/vite` | 21.6.10 | 23.1.1 | Accepts Vite 5-8, no conflict |

Astro's own Vite dependency per major, read from the registry:

- `astro@5.14.1` depends on `vite@^6.3.6`, Node `18.20.8 || ^20.3.0 || >=22.0.0`
- `astro@6.0.0` depends on `vite@^7.3.1`, Node `^20.19.1 || >=22.12.0`
- `astro@6.4.8` depends on `vite@^7.3.2`, Node `>=22.12.0`
- `astro@7.1.6` depends on `vite@^8.0.13`, Node `>=22.12.0`

## The Vite conflict, and what it forces

There is **no conflict with Nx**. `@nx/vite@23.1.1` declares `vite: ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0`, so Nx 23 is happy on either Vite 7 or Vite 8. The Nx 23 wall and the Astro wall do not fight each other over Vite.

The conflict is with **Vitest**, which the map does not currently list as a wall:

- `vitest@3.2.4` (and the newest 3.x, `3.2.7`) depends on `vite: ^5.0.0 || ^6.0.0 || ^7.0.0-0`. Vite 8 is outside that range. `@vitest/mocker@3.2.4` has the same ceiling.
- `vitest@4.1.10` declares `vite: ^6.0.0 || ^7.0.0 || ^8.0.0`.

So **Astro 7 implies Vite 8 implies Vitest 4**. Vitest 4 is its own major with its own breaking changes, and it governs the only unit tests in the repository. Two ways to sequence this:

- **Stop at Astro 6 for now.** Astro 6 wants Vite 7, which is exactly where the repo already is, and Vitest 3.2.4 is fine there. This decouples the Astro wall from the Vitest wall entirely and is the lower-risk path if the goal is steady progress.
- **Go to Astro 7 and add a Vitest 4 wall before it.** Legitimate, but it widens the effort by a major the map did not scope. If chosen, Vitest 4 should land as its own commit *before* Astro 7, so a test-runner regression is never tangled with an Astro regression.

Other Vite 8 consumers in the repo are already clear: `@tailwindcss/vite@4.3.3` accepts `^5.2.0 || ^6 || ^7 || ^8`, and `@vitejs/plugin-react-swc@4.3.3` accepts `^4 || ^5 || ^6 || ^7 || ^8`. Note `@vitejs/plugin-react` is the exception — the repo's 5.0.4 caps at Vite 7, and `@vitejs/plugin-react@6.0.5` requires `vite: ^8.0.0`.

Node is not a blocker: Astro 6 and 7 both require Node `>=22.12.0`, and the local toolchain is on v22.14.0.

## Breaking changes that actually apply to this app

The upgrade guides list roughly sixty changes across the two majors. Most concern content collections, adapters, actions, i18n, images, and the `@astrojs/db` package — none of which this app uses. `apps/ddd-toolbox` has no content collections, no adapter (it is a static build), no middleware, no view transitions, and no markdown pipeline. What follows is the filtered set.

### Astro 6

- **Node 22.12+ and Vite 7.** Already satisfied by the repo's Vite 7.1.7 and Node 22.14.
- **Zod 4.** Astro 6 bundles Zod 4, and the repo separately depends on `zod@4.1.11`, so this is aligned. Worth noting only because `astro:schema` was removed and `z` is no longer re-exported from `astro:content`; neither is imported anywhere in this app.
- **CommonJS config files removed.** `astro.config.mjs` is already ESM, so no action.
- **`Astro.glob()` removed.** Not used.
- **`<ViewTransitions />` removed** in favour of `<ClientRouter />`. Not used. Relevant indirectly: the umami integration injects a `data-astro-rerun` attribute keyed on a view-transitions meta tag, which is inert here.
- **Experimental flags removed** (`staticImportMetaEnv`, `preserveScriptOrder`, `headingIdCompat`, `csp`, `fonts`, and others). The config declares no `experimental` block, so nothing to strip.
- **Script and style order is now preserved by default.** `Layout.astro` has one inline theme script in `<head>`; ordering is not load-bearing.

Net effect on this app: Astro 6 is close to a no-op beyond the version bump. The `@astrojs/react` v4 to v5 move is the real work, and even that is mostly a peer bump.

### Astro 7

- **Vite 8.** The consequential one, covered above.
- **`compressHTML` default changed from `true` to `'jsx'`.** This app **explicitly sets `compressHTML: true`** in `apps/ddd-toolbox/astro.config.mjs`, so the default change does not silently alter behaviour — the explicit value keeps v6 semantics. Leave it as-is unless there is a reason to opt into JSX whitespace rules, which strip whitespace between inline elements and can require explicit `{" "}` insertions.
- **The Rust compiler replaces the Go compiler, and is now the only compiler.** This is the highest-risk item for this app, because it validates HTML more strictly: unclosed tags are now errors, and semantically invalid HTML is no longer auto-corrected. Files to check are `Layout.astro`, `structured-data.astro`, `LoadingScreen.astro` and the four pages. It also matters for `@astrolib/seo`, which ships uncompiled `.astro` source that the consuming app's compiler must parse — see below.
- **`getContainerRenderer()` import path moved** to `@astrojs/react/container-renderer`. Not used.
- **`src/fetch.ts` is now a reserved filename** for advanced routing. The app has no such file. Its only endpoint is `src/pages/robots.txt.ts`, which is unaffected.
- **Sätteri replaces the remark/rehype markdown pipeline.** The app renders no markdown, so no `@astrojs/markdown-remark` install is needed. (Note `astro@7.1.6` declares a peer on `@astrojs/markdown-remark@7.2.2`.)
- **`@astrojs/db` removed** and **deprecated `astro:transitions` internals removed.** Neither is used.

Config options the app relies on are all still valid in v7: `site`, `build.format: 'file'`, `build.inlineStylesheets: 'auto'`, `compressHTML`, and the `vite` passthrough including `vite.ssr.noExternal`.

### Islands and partial hydration

No breaking changes to client directives across either major. The app uses `client:load` (three components in `index.astro`) and `client:only="react"` (the three canvas pages plus `Toaster` in `Layout.astro`). These directives are unchanged in v6 and v7. The `slot="fallback"` pattern used with `client:only` on the canvas pages also still stands.

## Integration verdicts

### `@astrojs/react` — ready, two majors

Current 4.4.0, latest **6.0.2**. Two majors, but the surface is thin: this package's breaking changes are essentially the Vite and Node bumps it inherits.

- `4.4.0` → `vite@^6.3.6`, `@vitejs/plugin-react@^4.7.0`
- `5.0.7` → `vite@^7.3.2`, `@vitejs/plugin-react@^5.2.0`, Node `>=22.12.0`
- `6.0.2` → `vite@^8.0.13`, `@vitejs/plugin-react@^5.2.0`, Node `>=22.12.0`

React peers on 6.0.2 are `^17.0.2 || ^18.0.0 || ^19.0.0`, so React 19.1.1 is fine. **Pair `@astrojs/react` v5 with Astro 6, and v6 with Astro 7.** The only code-level change in v7 is the `getContainerRenderer()` import path, which this app does not use.

### `@astrojs/sitemap` — ready, no major

Current 3.6.0, latest **3.7.3**, still on the 3.x line. No Astro peer dependency is declared, and the config uses `sitemap()` with no options. A patch-level bump; no migration work.

## The risky two

### `@yeskunall/astro-umami` — resolvable, but currently blocked on a release

**Published state:** latest is `0.0.9` (June 2026) with peer `astro: ^3 || ^4 || ^5 || ^6`. The repo pins `0.0.7`, whose peer is even narrower (`^3 || ^4 || ^5`). So no published version declares Astro 7.

**Upstream state:** commit `03e8e412e`, "fix(astro): support Astro 7" (2026-07-15), widens the peer range to include `^7.0.0`. The `packages/astro-umami/package.json` on `main` reads `^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0`. It has simply not been published yet. The project is actively maintained — last push 2026-07-27, regular dependency bumps and releases.

**Does it actually work on Astro 7?** Almost certainly. The whole integration is one `astro:config:setup` hook calling `injectScript("head-inline", ...)`. Both APIs are current in Astro 7: `InjectedScriptStage` still includes `'head-inline'` in `packages/astro/src/types/public/integrations.ts` upstream. The upstream fix was a peer-range widening, not a code change, which confirms nothing in the implementation broke.

**Options, best first:**

1. **Wait for the release, or ask for one.** The work is done; opening an issue asking the maintainer to cut `0.0.10` is low-effort and the project is responsive. Best option if Astro 7 is not urgent.
2. **Ship it anyway on the published `0.0.9`.** The repo sets `strict-peer-dependencies=false` in `.npmrc`, so an unsatisfied Astro peer produces a warning, not an install failure. The code works. This is pragmatic and reversible, at the cost of a peer warning until the release lands.
3. **Use a git or pnpm `overrides` pin to the fixed commit.** More ceremony than option 2 with little added safety.
4. **Inline it.** The integration is ~30 lines of script-injection logic. Vendoring it into the app is entirely feasible if the dependency ever becomes a nuisance, but it is not warranted today.

**Verdict: not a blocker.** Do not hold Astro back for this one.

### `@astrolib/seo` — abandoned, replace it

**This is the one that needs a decision.** It is dead upstream:

- Last publish `1.0.0-beta.8`, **October 2024**. It has been a beta for its entire life.
- Last commit to `onwidget/astrolib`, **July 2024** — roughly two years of silence with 16 open issues.
- Peer range stops at `^5.0.0`. It predates Astro 6 entirely, so it will never declare 7.

**Two extra fragilities worth knowing**, both discovered by unpacking the tarball:

- It ships **uncompiled `.astro` and `.ts` source** (`main: "index.ts"`, no build output). The consuming app compiles it. Under Astro 7 that means the **new Rust compiler** must parse `AstroSeo.astro`. The file is simple — a frontmatter destructure of `Astro.props` and a single `<Fragment set:html={...} />` — so it will very likely parse, but this is untested territory rather than a declared guarantee, and it is why `@astrolib/seo` appears in `vite.ssr.noExternal`.
- `buildTags.ts` imports `html-escaper`, which the package declares **only as a devDependency, not a runtime dependency**. It resolves today by luck of hoisting. Any stricter install topology breaks it.

**How much is actually at stake:** very little. Usage is two pages (`index.astro` and `domain-storytelling.astro`, plus the other canvas pages), and each passes only `title` and `description`. The full public surface in use is two props.

**Options:**

1. **Replace with `astro-seo` (recommended).** The de facto community standard: 1370 stars, last push January 2026, current version 1.1.0. It **declares no `astro` peer dependency at all**, so it can never block an Astro major again — a structural improvement over the current situation. Migration is a rename: `import { AstroSeo } from '@astrolib/seo'` becomes `import { SEO } from 'astro-seo'`, and `<AstroSeo title description />` becomes `<SEO title description />`. Both take `title`, `titleTemplate`, `description`, `canonical`, `openGraph`, `twitter`, `languageAlternates`, and `noindex`/`nofollow`, so the two props in use map directly. The differences are at the edges: `astro-seo` adds `titleDefault`, `charset` and `extend`, and expresses robots directives as flat `noarchive`/`nocache`/`robotsExtras` props rather than astrolib's `robotsProps` object. None of those are used here.
2. **Drop it and hand-roll the tags.** Also viable given the tiny usage. The app already hand-writes canonical and robots tags in `Layout.astro` and builds JSON-LD by hand in `structured-data.astro`, so adding `<title>`, `<meta name="description">` and Open Graph tags there would be consistent with existing style and would remove a dependency outright. Costs the Open Graph/Twitter scaffolding if it is ever wanted later.
3. **Fork or vendor it.** ~960 lines across three files, MIT licensed, so it is forkable. Not recommended: it means owning SEO tag generation forever, and option 1 gets a maintained equivalent for a one-line import change.
4. **Hold Astro back at 5.** Not warranted. Nothing else forces this, and it would forfeit both majors over a two-prop dependency.

**Verdict: replace with `astro-seo`.** It is the cheapest option and it removes the peer-range trap permanently. It can be done independently of, and before, the Astro upgrade.

## Suggested wall order

Assuming Astro 7 is the target:

1. **Replace `@astrolib/seo` with `astro-seo`.** Independent of everything else, can land immediately on Astro 5, and defuses the only true blocker.
2. **Astro 5 → 6**, with `@astrojs/react` 4 → 5 and `@astrojs/sitemap` → 3.7.3 in the same commit (the integrations must match the core major). Stays on Vite 7, so Vitest 3 and Nx are untouched.
3. **Vitest 3 → 4**, on its own, before any Vite 8 move.
4. **Astro 6 → 7**, with `@astrojs/react` 5 → 6, Vite 7 → 8, and `@vitejs/plugin-react` 5 → 6. Expect the Rust compiler to surface any latent HTML sloppiness here.
5. **`@yeskunall/astro-umami`**: either bump to a released Astro 7 version if one exists by then, or accept the peer warning on `0.0.9`.

If the Vitest 4 major is unwelcome, stopping at step 2 leaves the app on Astro 6 with every integration satisfied and no peer warnings.

## Sources

- Astro v6 upgrade guide — https://docs.astro.build/en/guides/upgrade-to/v6/
- Astro v7 upgrade guide — https://docs.astro.build/en/guides/upgrade-to/v7/
- Astro configuration reference — https://docs.astro.build/en/reference/configuration-reference/
- `InjectedScriptStage` in `withastro/astro`, `packages/astro/src/types/public/integrations.ts`
- npm registry metadata for `astro`, `@astrojs/react`, `@astrojs/sitemap`, `@astrolib/seo`, `astro-seo`, `@yeskunall/astro-umami`, `vite`, `vitest`, `@vitest/mocker`, `@nx/vite`, `@vitejs/plugin-react`, `@vitejs/plugin-react-swc`, `@tailwindcss/vite`
- `yeskunall/astro-umami` commit `03e8e412e` and `packages/astro-umami/package.json` on `main`
- `onwidget/astrolib` repository activity and published tarball contents for `@astrolib/seo@1.0.0-beta.8`
- Local: `apps/ddd-toolbox/astro.config.mjs`, `package.json`, `.npmrc`, `pnpm-lock.yaml`
