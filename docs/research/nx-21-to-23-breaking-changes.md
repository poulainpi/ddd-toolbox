# Nx 21 -> 23 breaking changes for this workspace

**What this is:** research notes for GitHub issue #47 — enumerating the breaking changes across Nx 21 -> 22 -> 23 as they affect *this* workspace, plus a recommended upgrade procedure.

**Date:** 2026-08-04
**Versions researched:** `nx` 21.6.10 (current) -> 23.1.1 (target). Latest published at time of writing: 22.7.8 (last 22.x), 23.1.1 (latest 23.x).
**Method:** primary sources only — npm registry metadata, `migrations.json` at the `22.0.0`/`23.0.0` git tags, nx.dev docs and release blogs, and the **shipped code inside the packed npm tarballs** (`npm pack <pkg>@23.1.1`). Claims are tagged `[docs]` (an Nx source says it), `[registry]` (npm package metadata), `[tarball]` (read from the published code that will actually run — the strongest evidence available), or `[workspace]` (I derived it from files in this repo).

---

## Verdict / TL;DR

1. **`nx migrate` can do the jump, but do not do it in one hop.** Nx's official guidance is "update, at most, one major version at a time" ([docs](https://nx.dev/docs/guides/tips-n-tricks/advanced-update)). Nx 23 does support crossing multiple majors and will prompt via `--multi-major-mode`, but there is no reason to take that risk here. **Go 21.6.10 -> 22.7.8 -> 23.1.1.** The hard Angular caveat ("only the migrations for the latest major version will be applied") does not apply — no Angular here `[workspace]`.

2. **There IS a version conflict, and it is the single most important finding.** `@nx/vite` v23 ships a `packageJsonUpdate` that bumps **`vite` to `^8.0.0`** and `@vitejs/plugin-react` to `^6.0.0` (`packages/vite/migrations.json` @ `23.0.0`, key `"23.0.0"`). It is gated on `requires: {"vite": ">=7.0.0 <8.0.0"}` — and this workspace is on vite 7.1.7, so **the gate matches and it will fire.** Meanwhile Astro 5.14.1 depends on `vite ^6.3.6` `[registry]`. Vite 8 is not reachable for Astro until **Astro 7** (`astro@7.0.0` -> `vite ^8.0.13`) `[registry]`. Accepting that bump would put the root on Vite 8 while Astro wants Vite 6 — a two-major spread.

   **The saving grace:** `alwaysAddToPackageJson: false`. That means Nx only rewrites `vite` if it is already in `package.json` — which it is (`"vite": "7.1.7"` in root devDependencies) `[workspace]`. So the bump is *not* avoidable by accident; it must be **explicitly declined / reverted**. See the procedure.

   Critically, **`@nx/vite@23.1.1` peer-allows Vite 7**: `"vite": "^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0"` `[registry]`. Nx 23 **supports** Vite 8; it does not **require** it. Staying on Vite 7 is fully supported.

3. **Recommended order: move the Nx wall FIRST, then Astro.** Nx 23 does not force Vite 8 (peer range includes `^7.0.0`), so Nx can land while Astro stays put. The reverse is not true — see [Upgrade order](#upgrade-order-nx-before-astro).

4. **Highest-risk items for this workspace**, in order: (a) the Vite 8 `packageJsonUpdate` above; (b) the **`@nx/vite` -> `@nx/vitest` package split**, which rewires how tests are inferred — note this lands in **hop 1 (the 22 hop)**, not hop 2, and the `migrate-vitest-to-vitest-package` migration rewrites `nx.json` automatically `[tarball]`; (c) the **vitest 3 -> 4** bump, a separate major with its own breaking changes.

   Item (d) from an earlier draft — `@nx/js/typescript` build inference for `package.json`-less libs — has since been **resolved as a non-issue**: the inference gate accepts `package.json` **or** `project.json`, and every project here has the latter `[tarball]`. See [open questions](#open-questions--unverified) item 2.

5. **Good news on the `tsconfig.base.json` paths layout:** I found **no** migration in v22 or v23 that removes, deprecates, or rewrites the `paths`-based layout, and no migration that converts a workspace to TypeScript project references. Nx's "workspaces + project references" setup remains an **opt-in** documented as a manual guide, not a forced migration. See [the paths layout](#the-tsconfigbasejson-paths-layout-lower-risk-than-feared).

6. **Node is fine.** Nx 23 requires Node 22+ `[docs]`; this machine runs **v22.14.0** `[workspace]`. TypeScript 5.9.3 is fine — `@nx/js` v23 needs TS >= 5.4 `[docs]` and there is no upper cap and no TS bump targeting 5.9.

---

## Version constraints

| Package | Current here | Nx 22 constraint | Nx 23 constraint | Source | Verdict |
|---|---|---|---|---|---|
| `vite` | 7.1.7 | `^5 \|\| ^6 \|\| ^7` (peer of `@nx/vite@22.0.0`) | `^5 \|\| ^6 \|\| ^7 \|\| ^8` (peer of `@nx/vite@23.1.1`) | `[registry]` `npm view @nx/vite@23.1.1 peerDependencies` | **Vite 7 OK on both.** Nx 23 supports Vite 8 but does not require it. |
| `vite` (migration pressure) | 7.1.7 | — | `packageJsonUpdate` -> `^8.0.0`, gated `requires vite >=7.0.0 <8.0.0` | `packages/vite/migrations.json` @ tag `23.0.0` | **Will fire. Must decline.** Conflicts with Astro. |
| `vitest` | 3.2.4 | peer `^1.3.1 \|\| ^2 \|\| ^3` on `@nx/vite@22.0.0` | peer `^3.0.0 \|\| ^4.0.0` on **`@nx/vitest@23.1.1`** | `[registry]` | **Vitest 3 stays valid in 23.** Vitest 2 and below dropped. |
| `vitest` (migration pressure) | 3.2.4 | `22.2.0` update -> `^4.0.0`, gated `requires vitest >=3.0.0` | `23.0.0-vitest-v4` -> `^4.0.0`, gated `requires vitest >=3.0.0 <4.0.0` | `packages/vite/migrations.json` @ both tags | **Will fire in BOTH 22 and 23.** Decide deliberately. |
| `typescript` | 5.9.3 | last TS bump targets 5.9, gated `requires >=5.8.0 <5.9.0` | same; no 22.x/23.x TS `packageJsonUpdate` at all | `packages/js/migrations.json` @ tag `23.0.0` | **No-op — already 5.9.3, gate does not match.** No upper cap. |
| `typescript` (floor) | 5.9.3 | — | `@nx/js` minimum TS >= 5.4 | [nx-23-release blog](https://nx.dev/blog/nx-23-release) | Satisfied. |
| **Node** | **v22.14.0** | Node 20 still supported | **Node 20 dropped; minimum Node 22** | [nx-23-release blog](https://nx.dev/blog/nx-23-release) | **Satisfied.** No action. |
| `eslint` | 9.36.0 | — | ESLint 8 dropped in 23.1 | [nx-23-1-release blog](https://nx.dev/blog/nx-23-1-release) | Already on 9. No-op. |
| `typescript-eslint` | 8.45.0 | update gated `>8.0.0 <8.29.0` -> `^8.29.0` | same gate | `packages/eslint/migrations.json` @ tag `23.0.0` | **No-op** — 8.45.0 is above the gate ceiling. |
| `@swc/cli` | 0.7.8 | `22.5.0-swc-cli` gated `>=0.6.0 <0.7.0` | `23.0.0-swc-cli` gated `>=0.7.0 <0.8.0` -> `~0.8.0` | `packages/js/migrations.json` @ tag `23.0.0` | **v23 gate matches (0.7.8). Will bump to ~0.8.0.** Low risk — SWC is not on the Astro build path. |
| `@swc/core` | 1.13.5 | `22.5.0` -> `^1.15.5` (ungated) | same | `packages/js/migrations.json` @ tag `23.0.0` | Will fire during the 22 hop. Low risk. |
| `astro` (root) | 5.14.1 | depends on `vite ^6.3.6` | unchanged | `[registry]` `npm view astro@5.14.1 dependencies` | **The constraint that blocks Vite 8.** |
| `astro` (app) | 5.7.4 | separate install via root `postinstall` | — | `[workspace]` `apps/ddd-toolbox/package.json` | Resolves its own `vite@6.4.3` under `apps/ddd-toolbox/node_modules` `[workspace]`. |

### The Vite situation, precisely

Verified installed state `[workspace]` (`ls node_modules/.pnpm`):
- Root store has **both** `vite@6.3.6` (pulled in by Astro 5.14.1) and `vite@7.1.7` (the direct devDependency, used by Nx/vitest).
- `apps/ddd-toolbox/node_modules/.pnpm` separately has `astro@5.7.4` and `vite@6.4.3`.

So pnpm is *already* keeping two Vite majors side by side, and Astro is *already* not using the root's Vite 7. This is why Nx and Astro have been able to disagree about Vite so far — and it is why the Nx upgrade is less coupled to Astro than it first appears. Adding a Vite 8 to that mix, however, would mean **three** concurrent Vite majors in one lockfile. Not worth it for zero benefit.

Astro's ladder to Vite 8 `[registry]`:

| Astro | Vite dependency |
|---|---|
| 5.14.1 (current) | `^6.3.6` |
| 5.16.0 | `^6.4.1` |
| 6.0.0 | `^7.3.1` |
| 7.0.0 / 7.1.6 (latest) | `^8.0.13` |

Astro only reaches Vite 8 at **Astro 7**, which also requires Node `>=22.12.0` `[registry]` (satisfied by v22.14.0).

---

## Nx 22 breaking changes

Derived from `migrations.json` at tag `22.0.0` for every installed `@nx/*` package, plus the release docs.

### Applies here

| Change | Detail | Impact |
|---|---|---|
| `@swc/core` / `@swc/helpers` / `@swc-node/register` bump | `packages/js/migrations.json` key `22.5.0` -> `@swc/core ^1.15.5`, `@swc/helpers ^0.5.18`, `@swc-node/register ^1.11.1`. Ungated. | Low. Workspace has `@swc/core` 1.13.5, `@swc/helpers` 0.5.17. Will bump. SWC is only used by Nx tooling, not the Astro build `[workspace]`. |
| `@swc/cli` bump | `22.5.0-swc-cli`, gated `>=0.6.0 <0.7.0`. Workspace has **0.7.8** — gate does **not** match. | **No-op at 22.** (The v23 gate `>=0.7.0 <0.8.0` DOES match — see Nx 23.) |
| **`vitest` 3 -> 4** | `packages/vite/migrations.json` key `22.2.0`, gated `requires: {"vitest": ">=3.0.0"}` -> bumps `vitest`, `@vitest/coverage-v8`, `@vitest/coverage-istanbul`, `@vitest/ui` to `^4.0.0`. Workspace is on 3.2.4 -> **gate matches, will fire.** | **Medium-high.** Vitest 4 is its own major with its own breaking changes. `alwaysAddToPackageJson: false`, but all four are in root devDependencies `[workspace]`, so all four get rewritten. Decide deliberately; `@nx/vitest@23.1.1` peer-accepts vitest 3, so declining is supported. |
| `.gitignore` additions | `22-6-1-add-claude-worktrees-to-git-ignore`, `22-7-0-add-polygraph-to-git-ignore`, `22-6-0-add-claude-settings-local-to-git-ignore`, `22-7-0-add-self-healing-to-gitignore` (`packages/nx/migrations.json` @ tag `23.0.0`) | Trivial. Appends `.claude/worktrees`, `.nx/polygraph`, `.claude/settings.local.json`, `.nx/self-healing`. Review the diff — this repo has a `.claude/` directory. |
| `update-nx-wrapper` (`22-1-0`) | Updates `.nx/nxw.js` if present. | No-op unless the wrapper exists. Verify. |
| `remove-redundant-ts-project-references` | `packages/js/migrations.json` `22.1.0-rc.1` — removes redundant TS project references from `tsconfig.json` when runtime tsconfigs exist. | **Watch this one.** Root `tsconfig.json` has `"references": []` (already empty) and each lib has `tsconfig.lib.json`/`tsconfig.spec.json` `[workspace]`. Likely a no-op since there is nothing redundant to remove, but it is the one v22 migration that touches this workspace's tsconfig layout. Diff it. |
| `update-executor-lint-inputs` | `packages/eslint/migrations.json` `22.7.0-beta.12` — adds missing inputs to `@nx/eslint:lint` executor **targetDefaults**. | Probably no-op: `targetDefaults` here contains only `e2e-ci--**/*`, and lint comes from the inferred `@nx/eslint/plugin`, not an executor target `[workspace]`. May add a `targetDefaults` entry — review. |

### Does NOT apply here

| Change | Why not |
|---|---|
| `remove-external-options-from-js-executors` (`packages/js` `22.0.0-beta.0`) — drops `external`/`externalBuildTargets` from `@nx/js:swc` / `@nx/js:tsc` | Every `project.json` has empty `targets: {}`; no executors are configured at all `[workspace]`. |
| `update-22-0-0-add-svgr-to-webpack-config` (`packages/react`) | No webpack. Bundler is Vite `[workspace]`. |
| `22-0-0-release-version-config-changes`, `22-0-0-consolidate-release-tag-config` (`packages/nx`) | `nx.json` has no `release` block `[workspace]`. |
| Module Federation bumps (`packages/react` `22.2.0`, `22.6.0`), gated on `@module-federation/enhanced` | Not installed `[workspace]`. |
| `react-router` / `react-router-dom` bumps (`packages/react` `22.3.4`, `22.7.0`) | Not installed. Routing is Astro's `[workspace]`. |
| `@emotion/*` bumps (`packages/react` `22.2.0-emotion`) | Not installed. Styling is Tailwind `[workspace]`. |
| Analog bumps (`packages/vite` `22.2.0-analog*`) | Angular-only. |
| `verdaccio` bump (`packages/js` `22.6.4`) | Not installed. |
| All Angular / Jest / Cypress / webpack / Rspack / Next / Nuxt / Vue migrations | None of those packages installed `[workspace]`. |

---

## Nx 23 breaking changes

### Applies here

| Change | Detail | Impact |
|---|---|---|
| **Node 20 dropped, Node 22 minimum** | [nx-23-release blog](https://nx.dev/blog/nx-23-release) | **Satisfied** — Node v22.14.0 `[workspace]`. But pin it: add/confirm an `engines` field or `.nvmrc` so CI does not silently run Node 20. |
| **`vitest` split out of `@nx/vite` into `@nx/vitest`** | `@nx/vite@23.1.1` now `dependencies` include `"@nx/vitest": "23.1.1"` `[registry]`. Migration `ensure-vitest-package-migration-23` (`packages/vite/migrations.json` @ `23.0.0`) is described as a "safety net: ensure any remaining `@nx/vite:test` executor usages are swapped to `@nx/vitest:test` and `@nx/vitest` is installed." | **High relevance.** Because `@nx/vite` depends on `@nx/vitest`, the package arrives automatically. But this workspace uses **no executors** — the `test` target is inferred by `@nx/vite/plugin` `[workspace]`. Open question: whether the `test` target inference moves to a new `@nx/vitest/plugin` entry in `nx.json`. **Verify the `nx.json` diff and re-run `nx show project ui` after migrating.** See [Open questions](#open-questions--unverified). |
| **`vite` -> `^8.0.0`** | `packages/vite/migrations.json` @ `23.0.0`, key `"23.0.0"`, gated `requires: {"vite": ">=7.0.0 <8.0.0"}`. Also bumps `@vitejs/plugin-react` -> `^6.0.0`. | **Highest risk. Decline this.** Conflicts with Astro (`vite ^6.3.6`). `@nx/vite@23.1.1` peer-accepts `^7.0.0`, so staying on Vite 7 is supported `[registry]`. |
| `rename-rollup-options-to-rolldown-options` | `packages/vite/migrations.json` @ `23.0.0` — renames `rollupOptions` -> `rolldownOptions` in vite configs, because "Vite 8 replaced Rollup with Rolldown." | **Only relevant if you accept Vite 8.** If declining Vite 8, this migration must be skipped or reverted — renaming to `rolldownOptions` on Vite 7 would break the configs. Grep the `vite.config.ts`/`.mts` files for `rollupOptions` first. |
| `create-ai-instructions-for-vite-8` | `packages/vite/migrations.json` @ `23.0.0` — "Create AI Instructions to help migrate users workspaces past breaking changes for Vite 8." | Writes an AI-instruction file, part of Nx 23's new prompt-based migration category ([nx-23-release blog](https://nx.dev/blog/nx-23-release)). Harmless but pointless if declining Vite 8. Delete the artifact if generated. |
| `migrate-to-vitest-3` / `migrate-to-vitest-4` | `packages/vite/migrations.json` @ `23.0.0` (`23.0.0-beta.22`) | `migrate-to-vitest-3` should be a no-op (already 3.2.4). `migrate-to-vitest-4` applies if you took the vitest 4 bump. |
| **`vitest` -> `^4.0.0`** | `23.0.0-vitest-v4`, gated `requires: {"vitest": ">=3.0.0 <4.0.0"}` | Fires if you declined it at 22. Same decision point. |
| `update-devkit-deep-imports` | `packages/devkit/migrations.json` @ `23.0.0` — rewrites `@nx/devkit/src/...` imports to `@nx/devkit` or `@nx/devkit/internal`, "since deep imports are no longer reachable through the package exports map." | **Verify by grep.** `@nx/devkit` is a devDependency `[workspace]`. If nothing imports from it, no-op. |
| `update-23-0-0-rename-create-nodes-v2-types` | `packages/devkit/migrations.json` @ `23.0.0` — renames `CreateNodesV2`, `CreateNodesContextV2`, `CreateNodesResultV2`, `CreateNodesFunctionV2`, `NxPluginV2` to canonical names. | Only matters if this repo has custom Nx plugins. Grep says verify — likely none `[workspace]`. |
| `update-23-0-0-migrate-create-nodes-v2-import` (x5) | Present in `packages/{js,eslint,react,playwright,vite,vitest}/migrations.json` @ `23.0.0`. Renames `createNodesV2` imports to `createNodes`. | Only affects custom plugin code importing from `@nx/*/plugin`. Almost certainly no-op here. |
| `rewrite-*-internal-subpath-imports` (js, eslint, react, web) | The `./src/*` wildcard was removed from the exports maps of `@nx/js`, `@nx/eslint`, `@nx/react`, `@nx/web`. Imports get routed to `@nx/<pkg>` or the new `@nx/<pkg>/internal`. | **This is the real Nx 23 theme: exports-map tightening.** No-op unless source code deep-imports `@nx/*/src/*`. Grep before migrating. |
| `@swc/cli` -> `~0.8.0` | `packages/js/migrations.json` @ `23.0.0`, key `23.0.0-swc-cli`, gated `>=0.7.0 <0.8.0`. Workspace has 0.7.8 -> **matches.** | Low risk. |
| `23-0-0-add-migrate-runs-to-git-ignore` | `packages/nx/migrations.json` @ `23.0.0` — adds `.nx/migrate-runs`. | Trivial. |
| **`targetDefaults` spread token (`...`)** | Nx 23 adds `...` as a spread token controlling where inherited defaults are inserted when merging target configs ([nx-23-release blog](https://nx.dev/blog/nx-23-release)). | **Additive, not breaking.** This workspace's `targetDefaults` has one entry, `e2e-ci--**/*`, with no spread usage. I found **no migration and no doc statement** removing pattern-based `targetDefaults` keys. Treat as safe but **verify empirically** (see procedure step 8). |

### Does NOT apply here

| Change | Why not |
|---|---|
| Removed generators: `@nx/angular:ngrx`, `@nx/angular:move`, `@nx/{angular,react,next}:setup-tailwind` | Tailwind is configured manually via `@tailwindcss/vite` `[workspace]`; `setup-tailwind` is a generator, not runtime — removing it does not affect existing config. |
| Component generator `js` option removed; deprecated stylesheet options removed | Affects `nx generate` invocations only. `nx.json` `generators` block sets `style: "tailwind"` for `@nx/react`, which is **not** one of the removed deprecated stylesheet options (those were styled-jsx, styled-module, etc.) `[workspace]`. |
| Flat `releaseTagPattern`/`releaseTagPrefix` removed; `adjustSemverBumpsForZeroMajorVersion` / `strictPreid` default changes | No `release` block in `nx.json` `[workspace]`. |
| `nx watch --includeDependentProjects` renamed to `--includeDependencies` | Grep for `nx watch` in CI/scripts. Not present in `package.json` scripts `[workspace]`. |
| SVGR option removed from `@nx/rspack`; legacy TS plugin removed from `@nx/rollup`; `@nx/angular/module-federation` entry point removed | None of those packages installed. |
| Angular v19 dropped (23.1); ESLint v8 dropped (23.1) ([nx-23-1-release blog](https://nx.dev/blog/nx-23-1-release)) | No Angular; ESLint already 9.36.0 `[workspace]`. |
| `@nx/react` module-federation / react-router / emotion bumps | Not installed. |

### `@nx/web` still exists

Checked directly: `npm view @nx/web@23.1.1` returns version `23.1.1` with no `deprecated` field `[registry]`. **`@nx/web` was not removed, renamed, or merged in 22 or 23.** Its entire v23 `migrations.json` is one entry (`rewrite-web-internal-subpath-imports`) and an empty `packageJsonUpdates` — confirming it is stable, just exports-tightened.

That said: nothing in this workspace obviously uses `@nx/web` (no webpack, no `@nx/web:*` executors, empty `targets: {}` everywhere) `[workspace]`. **Consider dropping it** as separate cleanup — but verify with `nx graph` first, since `@nx/react` may pull it transitively.

---

## Per-plugin notes

| Package | 22 | 23 | Net risk here |
|---|---|---|---|
| **`@nx/devkit`** | No 22.x migrations | Deep imports (`@nx/devkit/src/...`) no longer in exports map; `CreateNodes*V2` types renamed | Low — no custom plugins `[workspace]`. Grep to confirm. |
| **`@nx/eslint`** | `update-executor-lint-inputs` (22.7.0) adds targetDefaults inputs | `./src/*` removed from exports map; `createNodesV2` -> `createNodes` | Low. ESLint 9 already satisfied. Watch for a new `targetDefaults` entry. |
| **`@nx/eslint-plugin`** | `migrations.json` is 71 bytes — **empty** at both tags | Empty | **Zero migrations.** Version bump only. |
| **`@nx/js`** | `remove-external-options-*` (no-op), `remove-redundant-ts-project-references`, SWC bumps | `./src/*` -> `@nx/js/internal`; `createNodesV2` rename; `@swc/cli` -> `~0.8.0`; TS floor >= 5.4 | **Medium** — this is the plugin that owns the tsconfig layout. See [paths layout](#the-tsconfigbasejson-paths-layout-lower-risk-than-feared). |
| **`@nx/playwright`** | `migrations.json` is 23 bytes — **empty** | One entry: `createNodesV2` -> `createNodes` | **Near zero.** No `@playwright/test` version bump in either major. |
| **`@nx/react`** | SVGR/webpack (no-op), MF/react-router/emotion bumps (all no-op) | `NxReactWebpackPlugin` import path change (no-op, no webpack); `./src/*` exports tightening; `createNodesV2` rename | **Low.** Every v22/v23 `@nx/react` change is gated on packages not installed here. |
| **`@nx/vite`** | vitest 3 -> 4 bump | **Split: vitest moved to `@nx/vitest`**; vite -> `^8`; `rollupOptions` -> `rolldownOptions`; vitest 3/4 migrations | **HIGHEST.** The one plugin that genuinely needs care. |
| **`@nx/web`** | `migrations.json` is 51 bytes — **empty** | One entry: `./src/*` exports tightening. Empty `packageJsonUpdates` | **Near zero.** Package still published at 23.1.1. Candidate for removal as cleanup. |
| **`@nx/vitest`** (new in 23) | n/a | New package. Peers: `vite ^5\|^6\|^7\|^8`, `vitest ^3\|^4`, `@nx/eslint 23.1.1` — all `optional: true` `[registry]` | Arrives automatically as a dependency of `@nx/vite`. |

---

## The `tsconfig.base.json` paths layout (lower risk than feared)

This was flagged as the highest-risk unknown. **Findings do not support that fear**, with one caveat.

**What I verified:**

1. **No forced migration.** I read every `generators` entry in `packages/{js,vite,eslint,eslint-plugin,react,playwright,web,devkit,workspace,nx}/migrations.json` at tags `22.0.0` and `23.0.0`. **None** converts `tsconfig.base.json` `paths` to project references, removes `paths`, or requires per-project `package.json` files. The only tsconfig-touching migration is `remove-redundant-ts-project-references` (`@nx/js` 22.1.0-rc.1), which only *removes redundant* references — and this workspace's root `tsconfig.json` already has `"references": []` `[workspace]`.

2. **Project references are opt-in.** Nx documents the workspaces/project-references setup at [switch-to-workspaces-project-references](https://nx.dev/docs/technologies/typescript/guides/switch-to-workspaces-project-references) — a **manual guide**, not an automated migration `[docs]`. The `@nx/js/typescript` plugin config shown there is essentially identical to what is already in this `nx.json` `[workspace]`.

3. **Inference works today without `package.json`.** Empirically `[workspace]`:

   ```
   $ npx nx show project ui --json
   targets: typecheck, build, build-deps, watch-deps, test, lint
   ```

   No lib has a `package.json` (`ls libs/*/package.json` -> no matches) `[workspace]`, yet `typecheck`, `build`, `build-deps`, and `watch-deps` are all inferred by `@nx/js/typescript`.

**The caveat — a genuine tension I could not fully resolve.** Nx's own docs state `[docs]`:

> "The TypeScript plugin automatically adds a `typecheck` task to any project containing a `tsconfig.json` file. A **build task is added only if the project has a runtime tsconfig file and a `package.json`** with entry points referencing compiled output rather than source files."
> — [nx.dev/docs/technologies/typescript/introduction](https://nx.dev/docs/technologies/typescript/introduction)

That documented rule says these libs should **not** get a `build` target — but they demonstrably do on Nx 21.6.10. Either the docs are imprecise, or the `build.configName: "tsconfig.lib.json"` option in `nx.json` `[workspace]` relaxes the `package.json` requirement. **I could not confirm which from a primary source.**

**Why it probably does not matter here:** nothing consumes those inferred `build` targets. The real build is Astro's (`nx build ddd-toolbox` -> `astro build`), and libs are consumed as TypeScript source through `tsconfig.base.json` `paths`, not as compiled output `[workspace]`. If Nx 23 tightened inference and the lib `build` targets vanished, the app build would be unaffected. The one thing that *would* break is `targetDefaults`' `dependsOn: ["^build"]` on `e2e-ci--**/*`, which would silently resolve to fewer dependencies.

**Action:** this is a **verification point, not a blocker**. Snapshot inferred targets before and after each hop (procedure step 1 and 8).

---

## What `nx migrate` will actually run here

Concrete list after filtering every `migrations.json` entry against this workspace. "Fires" = gate matches and it will do real work.

### Hop 1: 21.6.10 -> 22.7.8

**Fires:**
- `@nx/js`: `@swc/core` -> `^1.15.5`, `@swc/helpers` -> `^0.5.18`, `@swc-node/register` -> `^1.11.1` (key `22.5.0`, ungated)
- `@nx/vite`: **`vitest` + `@vitest/coverage-v8` + `@vitest/ui` -> `^4.0.0`** (key `22.2.0`, gate `vitest >=3.0.0` matches 3.2.4) — **decision point**
- `nx`: `.gitignore` additions x4 (`.claude/worktrees`, `.nx/polygraph`, `.claude/settings.local.json`, `.nx/self-healing`)
- `nx`: `22-1-0-update-nx-wrapper` (only if `.nx/nxw.js` exists)

**Runs but expected no-op (verify diff is empty):**
- `@nx/js`: `remove-external-options-from-js-executors` (no executors configured)
- `@nx/js`: `remove-redundant-ts-project-references` (references already `[]`)
- `@nx/eslint`: `update-executor-lint-inputs` (lint is inferred, not an executor target)
- `@nx/react`: `update-22-0-0-add-svgr-to-webpack-config` (no webpack)
- `nx`: both `22-0-0-*release*` migrations (no `release` block)

**Not offered:** `@nx/eslint-plugin`, `@nx/playwright`, `@nx/web` — empty `migrations.json` at 22.

### Hop 2: 22.7.8 -> 23.1.1

**Fires:**
- `@nx/vite`: **`vite` -> `^8.0.0`, `@vitejs/plugin-react` -> `^6.0.0`** (gate `vite >=7.0.0 <8.0.0` matches 7.1.7) — **DECLINE**
- `@nx/vite`: `rename-rollup-options-to-rolldown-options` — **skip if declining Vite 8**
- `@nx/vite`: `create-ai-instructions-for-vite-8` — pointless if declining Vite 8
- `@nx/vite`: `ensure-vitest-package-migration-23` (installs `@nx/vitest`, rewires `@nx/vite:test` -> `@nx/vitest:test`)
- `@nx/vite`: `migrate-to-vitest-4` (if vitest 4 accepted) / `migrate-to-vitest-3` (no-op)
- `@nx/js`: `@swc/cli` -> `~0.8.0` (gate `>=0.7.0 <0.8.0` matches 0.7.8)
- `nx`: `23-0-0-add-migrate-runs-to-git-ignore`

**Runs but expected no-op (verify by grep first):**
- `rewrite-*-internal-subpath-imports` x4 (`@nx/js`, `@nx/eslint`, `@nx/react`, `@nx/web`) — no-op unless source deep-imports `@nx/*/src/*`
- `update-devkit-deep-imports`, `update-23-0-0-rename-create-nodes-v2-types`
- `update-23-0-0-migrate-create-nodes-v2-import` x5 — no-op, no custom plugins
- `@nx/react`: `update-23-0-0-remove-nx-react-webpack-plugin-import` (no webpack)
- `@nx/workspace`: `23-0-0-move-typescript-compilation-import`
- `nx`: `23-0-0-consolidate-release-tag-config` (no `release` block)

**Already checked: the `@nx/vite/plugins/*` imports are safe.** All six lib `vite.config.*` files import `@nx/vite/plugins/nx-tsconfig-paths.plugin` and `@nx/vite/plugins/nx-copy-assets.plugin` `[workspace]`. These *look* like deep imports and would be the obvious casualty of the exports-map tightening — but both are **explicitly listed as first-class entries in `@nx/vite@23.1.1`'s `exports` map** `[tarball]` (alongside `./plugin`, `./executors`, `./plugins/rollup-replace-files.plugin`). **The vite configs need no changes.** Likewise `@nx/eslint-plugin` (7 eslint configs) and `@nx/playwright/preset` are public root/subpath entries. A repo-wide grep for `@nx/*/src/*` returned **zero matches** `[workspace]`, confirming the entire subpath-rewrite family is a no-op here.

**Pre-flight grep that decides half of the above:**

```bash
grep -rn "@nx/devkit/src\|@nx/js/src\|@nx/eslint/src\|@nx/react/src\|@nx/web/src\|createNodesV2\|rollupOptions" \
  --include=*.ts --include=*.mts --include=*.tsx --include=*.mjs --include=*.js \
  apps libs tools *.ts *.mjs 2>/dev/null
```

If that returns nothing, every "expected no-op" above is confirmed no-op and hop 2 reduces to: the Vite/vitest decision, `@swc/cli`, `@nx/vitest` arriving, and a `.gitignore` line.

---

## Recommended upgrade procedure

Two hops, each its own commit, with a verification gate between them. Do **not** run `nx migrate latest` in one shot.

### Step 0 — Pre-flight

```bash
git switch -c chore/nx-23-upgrade      # do not work on main
node -v                                 # must be >= 22 (currently v22.14.0)
grep -rn "@nx/devkit/src\|@nx/js/src\|@nx/eslint/src\|@nx/react/src\|@nx/web/src\|createNodesV2\|rollupOptions" \
  --include=*.ts --include=*.mts --include=*.tsx --include=*.mjs apps libs tools 2>/dev/null
```

Record the result. If empty, most Nx 23 migrations are confirmed no-ops.

### Step 1 — Snapshot the inferred-target baseline

This is the safety net for the whole `project.json`-with-empty-`targets` layout.

```bash
for p in ddd-toolbox ddd-toolbox-e2e ui util shared-canvas \
         domain-storytelling event-storming feature-bounded-context-canvas; do
  npx nx show project "$p" --json > "/tmp/nx-baseline-$p.json"
done
```

Diff these after each hop. **If a target silently disappears, that is the failure mode to catch.**

Also capture a green baseline:

```bash
npx nx run-many -t typecheck lint test --all
npx nx build ddd-toolbox
```

### Step 2 — Hop 1: migrate to 22.7.8

```bash
npx nx migrate 22.7.8
```

This rewrites `package.json` and writes `migrations.json`. **Do not install yet — read both diffs first.**

**Decision point — vitest 4.** `git diff package.json` will show `vitest`/`@vitest/*` -> `^4.0.0`. Recommendation: **decline for now** — revert those four lines to `3.2.4`. Rationale: vitest 4 is an independent major with its own breaking changes, and `@nx/vitest@23.1.1` peer-accepts vitest 3 `[registry]`. Keep the Nx upgrade and the vitest upgrade as separate, independently revertable changes. Do vitest 4 as its own follow-up.

```bash
pnpm install
npx nx migrate --run-migrations --interactive
```

`--interactive` lets you skip individual migrations rather than accepting all. Then:

```bash
git diff .gitignore nx.json          # review gitignore + any targetDefaults additions
rm migrations.json
```

### Step 3 — Verify hop 1

```bash
for p in ui ddd-toolbox ddd-toolbox-e2e; do
  npx nx show project "$p" --json | diff "/tmp/nx-baseline-$p.json" - && echo "$p targets unchanged"
done
npx nx run-many -t typecheck lint test --all
npx nx build ddd-toolbox              # the Astro build — the one that matters
```

**Commit here.** `chore: upgrade nx to 22.7.8`. Do not proceed on a red build.

### Step 4 — Hop 2: migrate to 23.1.1

```bash
npx nx migrate 23.1.1
```

**Decision point — Vite 8. This is the critical one.** `git diff package.json` will show `vite` -> `^8.0.0` and `@vitejs/plugin-react` -> `^6.0.0`. **Revert both to `7.1.7` and `5.0.4`.**

Rationale: `@nx/vite@23.1.1` peer-allows `vite ^7.0.0` `[registry]`, so Vite 7 is fully supported. Astro 5.14.1 needs `vite ^6.3.6` `[registry]`; accepting Vite 8 would put three Vite majors in one lockfile for zero benefit. Vite 8 becomes reachable only alongside Astro 7.

Then edit `migrations.json` to **delete** these two entries before running:
- `rename-rollup-options-to-rolldown-options` — renaming to `rolldownOptions` on Vite 7 would break the configs
- `create-ai-instructions-for-vite-8` — irrelevant, and it writes a stray file

```bash
pnpm install
npx nx migrate --run-migrations --interactive
```

Nx 23 runs migrations agentically in an interactive terminal ([nx-23-release blog](https://nx.dev/blog/nx-23-release)). If you want strictly deterministic behavior, review each diff before accepting.

### Step 5 — Verify the `@nx/vitest` rewiring

This is the least-predictable part of hop 2.

```bash
git diff nx.json                     # did an @nx/vitest/plugin entry appear?
npx nx show project ui --json | diff /tmp/nx-baseline-ui.json -
npx nx test ui                       # tests must still run
```

If the `test` target vanished, add the `@nx/vitest/plugin` entry to `nx.json` `plugins` manually, mirroring the `testTargetName: "test"` option currently on `@nx/vite/plugin` `[workspace]`.

### Step 6 — Verify the Astro side explicitly

The root `postinstall` runs `cd apps/ddd-toolbox && pnpm install`, so the app has its own dependency tree `[workspace]`.

```bash
pnpm install                          # triggers postinstall
npx nx build ddd-toolbox
ls apps/ddd-toolbox/node_modules/.pnpm | grep -E '^(vite|astro)@'   # expect astro@5.7.4, vite@6.x
ls node_modules/.pnpm | grep -E '^vite@'                            # expect vite@6.3.6 AND vite@7.1.7 — NOT 8
```

Seeing `vite@8` in the root store means the Vite 8 bump slipped through. Revert it.

### Step 7 — Full verification

```bash
npx nx run-many -t typecheck lint test --all
npx nx build ddd-toolbox
npx nx e2e ddd-toolbox-e2e            # exercises the e2e-ci--**/* targetDefaults path
rm migrations.json
```

### Step 8 — Verify `targetDefaults` still resolves

The `e2e-ci--**/*` pattern key is the one piece of `nx.json` config with no documented guarantee in 23.

```bash
npx nx show project ddd-toolbox-e2e --json | \
  python3 -c "import json,sys; d=json.load(sys.stdin); \
  print({k: v.get('dependsOn') for k,v in d['targets'].items() if k.startswith('e2e-ci')})"
```

Every `e2e-ci--*` target must still show `dependsOn: ["^build"]`. If the pattern key stopped matching, replace it with explicit per-target entries.

**Commit.** `chore: upgrade nx to 23.1.1`.

### Step 9 — Follow-ups (separate PRs)

- **vitest 3 -> 4** on its own, now that Nx is settled.
- **Drop `@nx/web`** if `nx graph` confirms nothing depends on it.
- **Vite 8** only as part of the Astro 6 -> 7 wall.

---

## Upgrade order: Nx before Astro

**Recommendation: move the Nx wall FIRST, then Astro.** (Issue #44 plans separate walls for tldraw, Nx, and Astro.)

**Why Nx first:**

1. **Nx 23 does not force Vite 8.** `@nx/vite@23.1.1` peer-allows `^7.0.0` `[registry]`. The Vite 8 `packageJsonUpdate` is a suggestion gated behind `alwaysAddToPackageJson: false` and is declinable. So Nx 23 can land with Astro untouched on Vite 6.
2. **Astro is already insulated.** Astro resolves its own Vite (`vite@6.3.6` at root, `vite@6.4.3` under `apps/ddd-toolbox`) independently of the root's Vite 7 `[workspace]`. The Nx upgrade does not perturb it.
3. **The reverse order is strictly worse.** Going Astro-first to Astro 7 pulls in `vite ^8.0.13` `[registry]`. You would then be on Nx **21**, whose `@nx/vite@21.x` peer range tops out at `^7.0.0` — an unsupported combination. Astro-first forces both walls to move simultaneously.
4. **Nx 23's migration tooling helps with the Astro hop later.** Doing Nx first means the Astro wall gets the better tooling.

**Sequenced plan:**

| Order | Wall | Vite at root | Notes |
|---|---|---|---|
| 1 | **Nx 21 -> 23.1.1** | stays **7.1.7** | Decline the Vite 8 bump. Astro untouched. |
| 2 | vitest 3 -> 4 | 7.1.7 | Small, independent, easily reverted. |
| 3 | tldraw | 7.1.7 | Independent of Vite/TS. |
| 4 | **Astro 5 -> 6 -> 7** | 7 -> **8** | Astro 6 needs `vite ^7.3.1`; Astro 7 needs `^8.0.13`. Nx 23 already peer-allows `^8.0.0`, so **no Nx change needed** at this point. Take `rename-rollup-options-to-rolldown-options` here. |

The elegance: by declining Vite 8 during the Nx hop, the Astro wall later moves Vite 7 -> 8 with Nx 23 *already* peer-compatible. The two walls never need to move together.

---

## Open questions / unverified

Honest gaps — things I could not confirm from a primary source.

1. ~~**Does `@nx/vitest` require a new `nx.json` `plugins` entry?**~~ — **RESOLVED from the shipped code** `[tarball]`. Yes, and the migration handles it automatically:
   - In the packed `@nx/vite@23.1.1`, `dist/plugin.js` contains **zero** occurrences of `testTargetName`. The `@nx/vite/plugin` inference **no longer creates the `test` target at all.**
   - In the packed `@nx/vitest@23.1.1`, `dist/src/plugins/plugin.js` **does** contain the test-target inference (`TargetName ??= 'test'`).
   - The migration that moves it is **`migrate-vitest-to-vitest-package`** (`packages/vite/migrations.json` @ `23.0.0`, version `22.2.0-beta.2`) — i.e. it lands during **hop 1 (the 22 hop)**, not hop 2. Its compiled source (`dist/src/migrations/update-22-2-0/migrate-vitest-to-vitest-package.js`) references `plugins`, `'@nx/vitest'`, `'@nx/vitest:test'`, `testTargetName` and `@nx/vite/plugin` — it rewrites the `nx.json` `plugins` array, not just executor usages.

   So the expected `nx.json` outcome is: `testTargetName` is **removed** from the `@nx/vite/plugin` options and a new `@nx/vitest` plugin entry appears carrying it. Step 5's verification still stands as the empirical check, but the manual fallback described there should not be needed.

2. ~~**`build` target inference for `package.json`-less libs.**~~ — **RESOLVED from the shipped code** `[tarball]`. The docs are imprecise; the libs are safe. In the packed `@nx/js@23.1.1`, `dist/src/plugins/typescript/plugin.js`, `checkIfConfigFileShouldBeProject` reads:

   ```js
   // Do not create a project if package.json and project.json isn't there.
   const siblingFiles = readdirSync(config.project.absolute);
   if (!siblingFiles.includes('package.json') && !siblingFiles.includes('project.json')) return false;
   ```

   The condition is `package.json` **OR** `project.json`. Every project here has a `project.json` `[workspace]`, so inference continues to work at v23. That same file contains **zero** occurrences of `isUsingTsSolutionSetup`, `tsconfig.base.json`, or `workspaces` — the paths-based layout is not gated, deprecated in code, or rejected. This also independently confirms finding #5 in the TL;DR. Empirically on 21.6.10, `npx nx show project ui --json` returns targets `build, build-deps, lint, test, typecheck, watch-deps` `[workspace]`.

3. ~~**Pattern keys in `targetDefaults` under Nx 23.**~~ — **RESOLVED from the shipped schema** `[tarball]`. In the packed `nx@23.1.1`, `schemas/nx-schema.json` documents `targetDefaults` as *"a map keyed by target name, **glob (e.g. `'e2e-ci--*'`)**, or executor"*. Glob keys are explicitly supported, so this workspace's `e2e-ci--**/*` key remains valid. The new `...` spread token and the ordered-array form are **additive**. Step 8 is still worth running as a cheap confirmation, but this is no longer an unknown. The same schema confirms **`neverConnectToCloud` is still a valid top-level property at 23.1.1**, which also closes item 6 below.

4. ~~**`nx migrate --multi-major-mode` exact option values.**~~ — **RESOLVED from the shipped code** `[tarball]`. In the packed `nx@23.1.1`, `dist/src/command-line/migrate/multi-major.js`:
   - The multi-major path triggers when `major(target) - major(installed) >= 2` — exactly the 21 -> 23 case.
   - The literal values are **`direct`** and **`gradual`**, via `--multi-major-mode=<value>` or the `NX_MULTI_MAJOR_MODE` env var.
   - In `gradual` it resolves the latest stable in the current major, migrates there, logs `Migrating to nx@<X> (one step toward nx@<target>).`, and you re-run `nx migrate` to continue.
   - Interactively it prompts with *"latest in current major"* marked **[recommended]** — confirming the two-hop plan below is Nx's own recommendation, not just ours.

5. **Nx 22's own breaking changes are thinly documented.** I could not find a dedicated "Nx 22 breaking changes" page (the expected `docs/shared/deprecated/22-breaking-changes.md` 404s at tag `22.0.0`). The Nx 22 section above is derived almost entirely from `migrations.json` at tag `22.0.0` — reliable for *what migrations run*, but it may miss breaking changes that ship without a migration. **Known gap.** Mitigation: hop 1 has its own verification gate.

6. ~~**`neverConnectToCloud`.**~~ — **RESOLVED** `[tarball]`. `neverConnectToCloud` is still a valid top-level property in `schemas/nx-schema.json` at `nx@23.1.1`. Note separately that the `nx` core migration `22-6-0-enable-analytics-prompt` (`packages/nx/migrations.json`) is **interactive** and prompts to enable usage analytics during hop 1 — answer it deliberately.

7. **Whether `@nx/web` is actually needed.** It is installed but I found no usage `[workspace]`. I did not fully trace whether `@nx/react` requires it transitively. Verify with `nx graph` before removing.

---

## Sources

**npm registry** (via `npm view`, 2026-08-04):
- `@nx/vite@23.1.1` — `peerDependencies`, `dependencies` (revealed the `@nx/vitest` dependency)
- `@nx/vite@22.0.0` — `peerDependencies`
- `@nx/vitest@23.1.1` — `peerDependencies`, `peerDependenciesMeta`
- `@nx/js@23.1.1` — `peerDependencies`, `dependencies`
- `@nx/web@23.1.1` — confirmed published, not deprecated
- `nx@23.1.1`, `nx@22.0.0` — `engines`, `peerDependencies`
- `astro@{5.14.1,5.15.0,5.16.0,6.0.0,7.0.0,7.1.6}` — `dependencies.vite`, `engines`
- `@astrojs/react@{4.4.0,latest}` — `peerDependencies`
- `vite`, `vitest` — published version lists

**`migrations.json` at git tags** (raw.githubusercontent.com/nrwl/nx/<tag>/packages/<pkg>/migrations.json):
- Tag `22.0.0`: `js`, `vite`, `eslint`, `eslint-plugin`, `react`, `playwright`, `web`, `devkit`, `workspace`, `nx`
- Tag `23.0.0`: same set, plus `vitest`

**nx.dev documentation and blogs:**
- https://nx.dev/blog/nx-23-release — Nx 23 breaking changes, Node 22 minimum, TS >= 5.4, vitest split, targetDefaults spread token, agentic migrate
- https://nx.dev/blog/nx-23-1-release — TypeScript 6 support, Angular 19 dropped, ESLint 8 dropped
- https://nx.dev/docs/guides/tips-n-tricks/advanced-update — multi-major guidance, migrate flow
- https://nx.dev/docs/features/automate-updating-dependencies — `migrations.json`, `--run-migrations`, multi-major prompt
- https://nx.dev/docs/technologies/typescript/introduction — `@nx/js/typescript` inference rules
- https://nx.dev/docs/technologies/typescript/guides/switch-to-workspaces-project-references — project references as opt-in manual guide

**Packed npm tarballs** (`npm pack <pkg>@23.1.1`, then read the published code — used to resolve four of the open questions above):
- `nx@23.1.1` — `schemas/nx-schema.json` (targetDefaults glob keys, `neverConnectToCloud`, `migrate.*` options); `dist/src/command-line/migrate/multi-major.js` (multi-major trigger + `direct`/`gradual`); `migrations.json`
- `@nx/js@23.1.1` — `dist/src/utils/versions.js` (`minSupportedTypescriptVersion = '5.8.0'`, `typescriptVersion = '~6.0.3'`); `dist/src/plugins/typescript/plugin.js` (`checkIfConfigFileShouldBeProject`)
- `@nx/vite@23.1.1` — `package.json` `exports` (confirms `./plugins/nx-tsconfig-paths.plugin` and `./plugins/nx-copy-assets.plugin` survive v23); `dist/plugin.js` (no `testTargetName`); `dist/src/migrations/update-22-2-0/migrate-vitest-to-vitest-package.js`
- `@nx/vitest@23.1.1` — `package.json` `exports`; `dist/src/plugins/plugin.js` (owns test-target inference)

**Workspace inspection** (read-only, this repo @ `poulainpi/upgrade-dependencies`):
- `package.json`, `nx.json`, `tsconfig.base.json`, `tsconfig.json`, `apps/ddd-toolbox/package.json`
- `npx nx show project {ui,ddd-toolbox-e2e} --json` — inferred target verification
- `ls node_modules/.pnpm`, `ls apps/ddd-toolbox/node_modules/.pnpm` — resolved Vite/Astro versions
- `node -v` (v22.14.0), `pnpm -v` (10.8.1)
