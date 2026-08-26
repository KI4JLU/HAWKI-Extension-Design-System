# Component inventory triage

Decision record for **KI-567 — "02 decision: component inventory triage — what is in scope"**.

**Source (measured):** `hawk-digital-environments/HAWKI`, branch `feature/svelte-frontend`, path
`resources/js/components/ui/` — 91 files total, 59 `.svelte` components, 29 subdirectories + `Txt.svelte`,
verified by cloning the branch and inspecting each directory directly (not inferred from names).

Cards 13–16 draw their scope from this table and nothing else.

## Inventory

| Directory | Files | Verdict | Reason |
|---|---|---|---|
| `Txt.svelte` | 1 | **In** | Read the file: pure typography primitive (`cva`-driven size/weight/line-height mapped to design tokens). No i18n wrapper, no HAWKI store/API coupling. |
| `alert` | 1 | **In** | UI primitive, no domain coupling. |
| `avatar` | 1 | **In** | UI primitive, no domain coupling. |
| `badge` | 1 | **In** | UI primitive, no domain coupling. |
| `border-beam` | 3 | **In** | Visual effect primitive, no domain coupling. |
| `button` | 2 | **In** | `Button` + `ButtonWithTooltip`, no domain coupling. |
| `citations` | 6 | **In** (decided by Sten Seegel) | Feature-level, but approved for inclusion. **Caveat found on read-through:** `CitationReference.svelte` imports `citationAnchorId` from `$plugins/core/modules/chat/components/message/injectCitationsIntoMarkdown.js` — a chat-plugin-specific module — and both `CitationReference.svelte`/`CitationList.svelte` use `useTranslator` (app i18n hook). Extraction (cards 13–16) must replace the chat-plugin import with a prop/callback and define an i18n contract (slot or callback prop) instead of taking `useTranslator` as a hard dependency. |
| `command` | 2 | **Needs confirmation** | `CommandPalette` + `CommandPaletteTrigger`, raised in the same open question as `citations` ("feature-level components with domain semantics — in or out?"). Sten's reply covered `citations` explicitly but not `command`. Read-through found no HAWKI store/API coupling — only `bits-ui`, `icons`, `tooltip`, and a platform-detection util (`isApple`) — so no technical blocker either way. Recommend **in**, pending explicit sign-off. |
| `dialog` | 3 | **In** | `Dialog`/`ConfirmDialog`/`InfoDialog`, no domain coupling. |
| `dropdown-menu` | 10 | **In** | UI pattern, no domain coupling. |
| `icons` | 1 | **In** (decided by Sten Seegel) | "Icons should be specified via design system." `index.ts` only exports the `IconComponent` type contract; the actual iconset is generated at build time by a Vite plugin (see card 06) and is a hard dependency of batch 1 (card 08). The design system defines/consumes the `IconComponent` contract — it does not vendor the generated iconset itself. |
| `kbd` | 2 | **In** | UI primitive, no domain coupling. |
| `loader` | 1 | **In** | UI primitive, no domain coupling. |
| `logo` | 1 | **Out** (decided by Sten Seegel: "ignore logo") | Read the file: `HawkLogo.svelte` renders a hardcoded SVG wordmark spelling "HAWKI" with a fixed accessible label default of `'hawki'`. It is a brand mark, not a generalized `Logo` primitive — matches the JLU-DS precedent noted on the card, but the decision is to exclude rather than generalize. |
| `menu-list` | 3 | **In** | UI pattern, no domain coupling. |
| `popover` | 2 | **In** | UI primitive, no domain coupling. |
| `radial-progress` | 1 | **In** | UI primitive, no domain coupling. |
| `radio-card` | 3 | **In** | UI pattern, no domain coupling. |
| `routing` | 26 (measured; card estimated 30) | **Out — document only** (decided by Sten Seegel: "routing should only be documented, not transferred to design system.") | Full client router: `RouterState`, middleware stack, data loader/cache, hash/path/transient strategies, `hooks/`, `logistics/`, `strategy/`. Application infrastructure, not a design system concern. Gets its own card (**17**) for documentation; not migrated. |
| `select` | 1 | **In** | `SingleSelect`, no domain coupling. |
| `separator` | 1 | **In** | UI primitive, no domain coupling. |
| `sheet` | 1 | **In** | `BottomSheet`, no domain coupling. |
| `sidebar` | 9 | **In** | UI pattern, no domain coupling. |
| `slider` | 1 | **In** | UI primitive, no domain coupling. |
| `status-dot` | 1 | **In** | UI primitive, no domain coupling. |
| `switch` | 1 | **In** | UI primitive, no domain coupling. |
| `tabs` | 1 | **In** | UI primitive, no domain coupling. |
| `textarea` | 1 | **In** | UI primitive, no domain coupling. |
| `toast` | 2 | **In** | UI pattern, no domain coupling. |
| `tooltip` | 2 | **In** | UI primitive, no domain coupling. |

## Open follow-ups

- **`command/`** — needs an explicit in/out call from Sten (or whoever owns scope decisions); no technical blocker found either way.
- **`citations/`** — extraction work (cards 13–16) must budget for decoupling the chat-plugin import (`injectCitationsIntoMarkdown.js`) and defining an i18n contract to replace `useTranslator`.
- **`routing/`** — card 17 to document (not migrate) the router.
- **`icons/`** — card 06/08 own the generated iconset and its Vite plugin; this card only confirms the `IconComponent` type contract belongs in the design system.

# Styling contract

Decision record for **KI-568 — "03 decision: styling contract — tokens, cascade layers, dark mode"**.

Verified by cloning upstream `feature/svelte-frontend` and reading `resources/css/app.css`, every file under
`resources/css/tokens/`, `resources/css/layers/`, `resources/css/properties.css`, `.svelte/ComponentCssLayerProcessor.js`,
`vite.config.ts`, `resources/js/plugins/core/stores/ThemeStore.svelte.ts`, and every component `<style>` block —
not inferred from the card's own summary.

## Consumption model

Two decisions, both made explicitly (not inferred):

- **Rendering mode** (Sten Seegel): extensions render **standalone**, but both consumption modes are still needed
  by the package.
- **DOM isolation** (this card, asked before deciding per the card's own instruction): extensions share the host's
  DOM directly — **no iframe, no Web Component / Shadow DOM, no separate document root**.

Together this means: an extension is its own top-level HTML document (so it fully owns `<html>` and must supply
its own reset/tokens/base), but there is no shadow boundary or cross-document messaging to design around —
plain CSS cascade rules apply throughout. This also means the "components share the host DOM" case (a component
rendered directly inside an already-running HAWKI page, tokens/layers already present) is the *secondary* mode
this contract must not break, since the card says both are needed.

**Two entry points, both required:**

| Entry point | Contents | Consumer |
|---|---|---|
| `styles/full.css` | layer-order statement + reset + tokens + base + utilities | A standalone extension page, Storybook, or any consumer with no pre-existing HAWKI CSS environment. |
| `styles/tokens.css` | layer-order statement + tokens only | A consumer that already has its own reset/base in the same document (e.g. HAWKI's own `app.css`) and only needs the design tokens. |

Component `<style>` blocks always land in the `components` layer regardless of which entry point is used — that
placement happens per-component at compile time (see below), not via either CSS file.

**What must be on `<html>`:** nothing but the dark-mode toggle. Default (no class) is light;
`html.darkMode` switches to dark. That is the *entire* dark-mode contract — see below.

## Token architecture

Two-layer model, confirmed by reading `tokens/colors.css` end to end: **primitives** (`--color-accent-100..900`,
`--color-accent-dark-300..500`, raw `oklch()` values) vs **semantic aliases** (`--color-interactive`,
`--color-accent-fill`, `--color-text`, `--color-focus-ring`, …). Components must reference semantic aliases only.
The split is specific to color — `spacing`, `borders`, `radius`, `transitions`, and `typography` are single-tier
scales with no primitive/semantic distinction and no literal values leaking in (checked all five files).

**The rule does not hold universally — verified, not assumed, per the card's own instruction:**

1. `components/ui/avatar/Avatar.svelte:80` — `background: var(--color-accent-100);` references the **primitive**
   directly instead of a semantic alias. Migration (card 13) must either point this at an existing semantic alias
   or add a new one — none of the current aliases (`--color-active-surface` etc.) carry the right semantics for an
   avatar's neutral fill, so this likely needs a new token, not a substitution.
2. `components/ui/switch/Switch.svelte:95` — `box-shadow: var(--shadow-xs, 0 1px 2px rgb(0 0 0 / 0.18));` references
   `--shadow-xs`, which **does not exist** in `tokens/shadows.css` (that file only defines `--elevation-none/1/2/legacy`).
   The token reference is dead; the component silently runs on the literal `rgb()` fallback today. Migration must
   either add a `--shadow-xs` token or repoint the component at `--elevation-1`.

Other notes:
- `tokens/layers.css` defines `--layer-overlay` / `--layer-app-chrome` / `--layer-toast` / `--layer-tooltip` — a
  **numeric z-index scale**, unrelated to CSS Cascade Layers (`@layer`). Same word, two different mechanisms;
  worth calling out explicitly so nobody conflates them while writing consumer docs.
- `properties.css` registers `--drill-stop-1/2/3`, `--nav-track`, `--aside-track` via `@property`. Per the CSS
  spec `@property` cannot be wrapped in `@layer` (it isn't a conditional rule) — ship it as a separate, unlayered
  import in both entry points, same as upstream does.

## Cascade layer order — real risk, needs a fix the upstream code doesn't have

`app.css` documents the intended order in a comment: `reset → tokens → base → components → utilities`. It never
writes the actual pre-registration statement anywhere in the codebase (searched every `.css`/`.svelte`/`.ts` file
for a bare `@layer name, name, …;` statement — none exists).

CSS Cascade Layers order is set by **first encounter**, not by comments. Tracing `app.css`'s real `@import`
sequence: `tokens/*.css` is imported and opens `@layer tokens {}` *before* `layers/reset.css` opens `@layer reset {}`
and `layers/base.css` opens `@layer base {}`. So the order upstream actually produces today is
**tokens, reset, base, utilities** — not the documented **reset, tokens, base, utilities**. This has apparently
been harmless only because `reset` and `tokens` never declare rules for the same element/property.

The `components` layer is injected per component at Svelte-preprocess time — confirmed by reading
`.svelte/ComponentCssLayerProcessor.js`: every component's non-layered `<style>` content is wrapped in
`@layer components { … }` during preprocessing. Its position in the *final* cascade order therefore depends on
which component's compiled CSS the bundler happens to encounter first, which depends on the JS module graph — a
bundler-specific detail no package can promise to a consumer.

**Contract requirement:** every entry point this package ships must open with an explicit bare statement —

```css
@layer reset, tokens, base, components, utilities;
```

as the very first rule, before any `@import`. This pre-registers the five layers in the intended order once and
for all; it no longer matters in what sequence the actual `@layer name { … }` rule blocks are encountered
afterward, because a name's relative position is fixed on first mention and a bare statement is unambiguous.
Card 11's lint rule should also check that this statement exists verbatim in both `styles/full.css` and
`styles/tokens.css`.

## Dark mode

The only selector in the entire codebase that branches on theme is `:global(html.darkMode)` (confirmed: no
`data-theme`, no `prefers-color-scheme` in any `.css` file). `ThemeStore.svelte.ts` additionally toggles a
`lightMode` class and falls back to `prefers-color-scheme` for its own initial JS-side detection, but **no CSS
anywhere reads `lightMode` or the media query** — those are bookkeeping for the store's reactive state only, not
part of the styling contract. Consumers therefore only need: apply `.darkMode` to `<html>` to opt into dark;
omit it (regardless of `lightMode`) for light. Do not port `lightMode` handling into the package's CSS — it would
be dead weight. This diverges intentionally from JLU-DS's `data-theme="dark"` convention; do not harmonise it.

## Guardrail

`scripts/check-token-usage.sh` — greps a target directory's `.svelte` files for (1) direct use of a primitive
color token and (2) any literal color value (`oklch()`, `hsl()`, `rgb()`, hex — including inside `var()`
fallbacks). Exit code is non-zero on any hit, so it's CI-runnable as-is. Card 11 turns this into an eslint rule.

Validated against upstream: run against `resources/js/components/ui/`, it correctly flags exactly the two real
violations documented above (Avatar's primitive, Switch's dead-token literal-fallback) plus the excluded
`HawkLogo.svelte`'s literal fallback (irrelevant since `logo/` is out of scope per KI-567). Run against this
repo's current `src/` (empty — no components migrated yet), it passes cleanly, as expected before cards 13–16 land.

## Open

- The layer-order fix above is a **new** requirement this package adds — it does not exist upstream today.
  Flagging for Sten: should the same bare `@layer` statement be back-ported into HAWKI's own `app.css`, given it
  is currently relying on undocumented, bundler-dependent ordering luck?
