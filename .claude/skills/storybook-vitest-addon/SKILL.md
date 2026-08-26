---
name: storybook-vitest-addon
description: Install, configure, or troubleshoot @storybook/addon-vitest in this Svelte 5 library (runs stories as Vitest tests). Use when standing up the test harness (cards 07/11), when story tests fail with "does not provide an export named" errors, when sidebar test statuses look wrong/stuck, when a11y warnings need to be inspected, or when the vitest projects config in vite.config.ts needs adjusting.
---

# Storybook Vitest Addon (install & troubleshoot)

The addon runs every story as a Vitest test, including a11y checks when
`@storybook/addon-a11y` is present. That is exactly the shape cards 07
(`KI-574`, Storybook as single source of truth) and 11 (`KI-575`, stories as
tests) prescribe: one definition — the story — consumed by docs, tests and the
Chromatic baseline.

**Status in this repo: not installed yet.** There is no `package.json` at all
(card 06 lands it first). Everything below is either an install path or a
pitfall carried over from the sibling JLU Design System repo, where this setup
is running in production. Pitfalls marked *(verified in JLU-DS, React + jsdom
project alongside browser mode)* have not yet been re-observed on Svelte —
treat them as things to expect, not as facts about this repo.

## Decisions this repo must make itself

Card 11 explicitly forbids copying JLU-DS's setup without re-deciding:

1. **Browser mode vs jsdom.** JLU-DS runs the storybook project in browser mode
   (headless Chromium via Playwright) and a separate jsdom project for unit
   tests. Here the library is overlay-heavy (dialog, popover, tooltip,
   dropdown-menu, sheet, command palette) — focus management, pointer events and
   portals, all of which jsdom approximates badly. Browser mode is the likely
   answer; evaluate `vitest-browser-svelte` and **record the reason** in the
   card, per its DoD.
2. **Story format.** Card 07 wants Svelte CSF (`*.stories.svelte` via
   `@storybook/addon-svelte-csf`) because the library is snippet-heavy.
   Confirm it supports the Storybook + Svelte 5 versions actually in use before
   committing; if it lags, fall back to CSF3 and write down why.
3. **Plain unit tests are the exception.** Pure helpers, variant maps, a
   class-merge utility. Every one needs a stated reason why a story is the wrong
   home.

Also from card 11: state each test's **oracle**. "The rendered class list equals
what it rendered" is not one. Legitimate oracles here are the story's documented
contract, the a11y requirements (keyboard reachable, focus visible, name
announced), and the token contract (a variant resolves to a semantic token, not
a literal colour — `scripts/check-token-usage.sh` covers the static half).

## Install

1. Prerequisites: Storybook ≥ 9 on a Vite-based Svelte framework
   (`@storybook/svelte-vite`) and Vitest ≥ 3. Check current versions rather than
   copying JLU-DS's pins.
2. Run the official installer — do NOT wire it up by hand:
   ```sh
   npx storybook add @storybook/addon-vitest --yes
   ```
   It installs `@vitest/browser-playwright`, `@vitest/coverage-v8`,
   `playwright` (+ Chromium binaries), registers the addon in
   `.storybook/main.ts`, and rewrites the vitest config into a
   `test.projects` array.
3. Review the merged `vite.config.ts`: any pre-existing `test` config must
   survive as its own project entry (`extends: true`), with the new
   `storybook` project alongside it. The installer does this correctly, but
   verify it didn't drop custom fields (setupFiles, include globs).
4. `.storybook/preview` must apply the styling contract from
   `docs/DESIGN_SYSTEM.md` in the right cascade order, and expose a theme
   toolbar that toggles `html.darkMode` (**not** `data-theme` — that is the
   JLU-DS convention and diverges here on purpose). Story tests inherit
   whatever `preview` sets, so a wrong theme hook silently tests one theme
   twice.
5. Verify: `npm test` must pass every project — the unit tests and one test
   per story. Don't stop at "the addon loads". Then break a documented
   behaviour on purpose and confirm the suite goes red; card 11's DoD demands
   that demonstration.

## Known pitfall: CJS deps in browser mode

*(verified in JLU-DS)*

Symptom: every story file fails with
`SyntaxError: The requested module '.../aria-query/...' does not provide an
export named 'elementRoles'` (or similar named-export errors from other
packages).

Cause: Vitest browser mode serves modules through Vite's dev server. CJS-only
packages (e.g. `aria-query`, imported by `@testing-library/dom`) can't expose
named exports unless Vite pre-bundles them.

Fix: add the offending package and its importers to `optimizeDeps.include`
**inside the storybook project entry** in `vite.config.ts`:

```ts
{
  extends: true,
  plugins: [storybookTest({ configDir: path.join(dirname, '.storybook') })],
  optimizeDeps: {
    include: ["aria-query", "@testing-library/dom"]
  },
  test: { name: 'storybook', browser: { /* ... */ } }
}
```

For new named-export errors, identify the CJS package from the error message
and append it (plus the package that imports it) to the same list. Which
packages appear depends on the query layer chosen in decision 1 — a
`vitest-browser-svelte` setup pulls a different dependency graph than
`@testing-library/*`, so expect a different (possibly empty) list here.

## Running

- Everything: `npm test`
- Story tests only: `npx vitest --project=storybook`
- Interactively: start Storybook (`npm run storybook`) and use the test
  widget at the bottom of the sidebar; each story shows pass/fail.

## Sidebar statuses are snapshots, not live

*(verified in JLU-DS)*

The pass/fail/warning markers in the sidebar reflect the LAST widget test
run — they do not update on file changes. Before believing a red/amber
marker (or its absence), trigger a fresh run from the test widget. A story
edited mid-development often shows failures that a re-run clears.

## Stuck "Running…" state

*(verified in JLU-DS)*

If story files are edited while a widget run is in flight, the embedded
vitest child can crash and the widget wedges permanently in "Running…"
(the run button stays disabled; there is NO cancel UI). Only fix: restart
the Storybook dev server (`kill $(lsof -t -iTCP:6006 -sTCP:LISTEN)`, then
`npm run storybook`). Browsers reconnect automatically.

Related flake: the first widget/CLI run after adding new dependencies may
fail all stories in a file with "Re-optimizing dependencies" noise — just
re-run before diagnosing.

## a11y warnings are invisible in the CLI

With `parameters.a11y.test: 'todo'` (JLU-DS's setting), axe violations surface
ONLY as amber markers in the Storybook UI — CLI runs stay green and even
`--reporter=verbose` shows nothing. Card 01's a11y requirements are part of the
test oracle here, so decide deliberately whether this repo runs a11y as `'todo'`
or `'error'`; `'error'` is the setting that makes CI actually enforce it.

To get the concrete violations either way:
- temporarily set `a11y: { test: 'error' }` and run the storybook project, or
- run axe directly against the story iframes with Playwright: load
  `node_modules/axe-core/axe.min.js` into
  `http://localhost:6006/iframe.html?id=<story-id>&viewMode=story` and call
  `axe.run(document.getElementById('storybook-root'))` (story ids come from
  `http://localhost:6006/index.json`).

Run it in **both** themes. Contrast is the failure class that differs between
light and dark, and the toolbar toggle is the only thing that changes it.

What this caught in JLU-DS, translated to this library's stack — worth checking
first on the equivalent components here:
- `aria-label` on a plain `<span>` (prohibited — needs `role="img"`); relevant
  to `status-dot`, `radial-progress`, `loader`, icon-only buttons.
- Insufficient text colour contrast (status-tone text on a surface).
- An unlabelled select trigger: the label must wrap the rendered **trigger**
  element, not a DOM-less wrapper component. In JLU-DS that was Radix's
  `Select`; here the equivalent risk lives in the `bits-ui`-based `select`,
  `dropdown-menu`, `popover` and `command` components.
