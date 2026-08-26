# v1 component inventory

Decision record for **KI-567 — "05 scope: v1 component inventory (HAWKI as behavioural reference)"**.
Supersedes the directory-level table this section originally held (see Revision history at the bottom).

**Source (measured):** `hawk-digital-environments/HAWKI` @ `feature/svelte-frontend`, tip
`ddaae17ea5bd12131005873b47e6743c7cdfcb63` (read 2026-08-26) — 91 files, 59 `.svelte` components, 29
subdirectories + `Txt.svelte`, verified by cloning the branch and reading each file directly, not inferring
from names. HAWKI's component set is used as **behavioural evidence of what an extension needs**, not as a
delivery plan to mirror — hence the additions in the last table with no HAWKI reference at all.

Cards 14–17 (component batches) draw their scope from this table and nothing else.

## Directories excluded or deferred wholesale

| Directory | Files | Verdict | Reason |
|---|---|---|---|
| `routing/` | 26 (measured; card text estimated 30) | **Out — document only** | Sten Seegel: "routing should only be documented, not transferred to design system." Full client router (`RouterState`, middleware stack, data loader/cache, hash/path/transient strategies). Application infrastructure, not a design system concern. Card **18** owns the write-up; not migrated. |
| `logo/` | 1 | **Out** | Sten Seegel: "ignore logo." Confirmed by reading `HawkLogo.svelte`: a hardcoded SVG wordmark spelling "HAWKI" with a fixed `'hawki'` accessible-label default — a brand mark, not a generalizable `Logo` primitive. |
| `icons/` | 1 | **In v1 — contract only** | Sten Seegel: "icons should be specified via design system." `index.ts` exports only the `IconComponent` type contract; the generated iconset is a build-time Vite plugin output owned by cards **09** (icon layer) and **10** (codegen) — the design system consumes the contract, it does not vendor the generated set. |

## Components — HAWKI reference exists

One row per exported `.svelte` component (helper files — `*Context.ts`, `types.ts`, `index.ts` — are
implementation detail, not separate rows).

| Component | HAWKI reference | Verdict | Reason |
|---|---|---|---|
| `Txt` | `Txt.svelte` | **In v1** | Investigated per Sten's instruction ("investigate before deciding"): pure typography primitive (`cva`-driven size/weight/line-height on design tokens), no i18n wrapper, no store coupling. |
| `Alert` | `alert/` | **In v1** | UI primitive, no domain coupling. |
| `Avatar` | `avatar/` | **In v1** | UI primitive, no domain coupling. Note: its `<style>` block references the primitive `--color-accent-100` directly instead of a semantic alias — a styling-contract fix for the batch that migrates it (KI-568), not a scope issue. |
| `Badge` | `badge/` | **In v1** | UI primitive, no domain coupling. |
| `BorderBeam` | `border-beam/BorderBeam.svelte` | **In v1** | Visual-effect primitive, no domain coupling. |
| `Button` | `button/Button.svelte` | **In v1** | No domain coupling. |
| `ButtonWithTooltip` | `button/ButtonWithTooltip.svelte` | **In v1** | No domain coupling. |
| `Citation` | `citations/Citation.svelte` | **In v1** | Sten Seegel: "citations in." |
| `CitationRoot` | `citations/CitationRoot.svelte` | **In v1** | Sten Seegel: "citations in." |
| `CitationList` | `citations/CitationList.svelte` | **In v1** | Sten Seegel: "citations in." Uses `useTranslator` (app i18n hook) — must consume an i18n contract instead (card **20**) rather than a hard dependency. |
| `CitationReference` | `citations/CitationReference.svelte` | **In v1** | Sten Seegel: "citations in." Imports `citationAnchorId` from a chat-plugin module (`$plugins/core/modules/chat/components/message/injectCitationsIntoMarkdown.js`) — must become a prop/callback; this is real domain coupling that has to be broken during migration, not a reason to exclude the component. Citations overall isn't covered by batches 14–17 as currently scoped — still needs an owning card. |
| `CommandPalette` | `command/CommandPalette.svelte` | **In v1** | Confirmed in — no domain coupling found on read-through (`bits-ui`, icons, tooltip, `isApple` platform check only). Lands in card **17**. |
| `CommandPaletteTrigger` | `command/CommandPaletteTrigger.svelte` | **In v1** | Same as above. |
| `Dialog` | `dialog/Dialog.svelte` | **In v1** | No domain coupling. |
| `ConfirmDialog` | `dialog/ConfirmDialog.svelte` | **In v1** | No domain coupling. |
| `InfoDialog` | `dialog/InfoDialog.svelte` | **In v1** | No domain coupling. |
| `DropdownMenu` | `dropdown-menu/DropdownMenu.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuItem` | `dropdown-menu/DropdownMenuItem.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuCheckboxItem` | `dropdown-menu/DropdownMenuCheckboxItem.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuRadioGroup` | `dropdown-menu/DropdownMenuRadioGroup.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuRadioItem` | `dropdown-menu/DropdownMenuRadioItem.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuSwitchItem` | `dropdown-menu/DropdownMenuSwitchItem.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuGroup` | `dropdown-menu/DropdownMenuGroup.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuLabel` | `dropdown-menu/DropdownMenuLabel.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuSeparator` | `dropdown-menu/DropdownMenuSeparator.svelte` | **In v1** | No domain coupling. |
| `DropdownMenuDetailView` | `dropdown-menu/DropdownMenuDetailView.svelte` | **In v1** | No domain coupling. |
| `Kbd` | `kbd/Kbd.svelte` | **In v1** | No domain coupling. |
| `KbdIndicator` | `kbd/KbdIndicator.svelte` | **In v1** | No domain coupling. |
| `Loader` | `loader/` | **In v1** | UI primitive, no domain coupling. |
| `MenuList` | `menu-list/MenuList.svelte` | **In v1** | No domain coupling. |
| `MenuListItem` | `menu-list/MenuListItem.svelte` | **In v1** | No domain coupling. |
| `Popover` | `popover/Popover.svelte` | **In v1** | No domain coupling. |
| `InfoPopover` | `popover/InfoPopover.svelte` | **In v1** | No domain coupling. |
| `RadialProgress` | `radial-progress/` | **In v1** | UI primitive, no domain coupling. |
| `RadioCard` | `radio-card/RadioCard.svelte` | **In v1** | No domain coupling. |
| `RadioCardGroup` | `radio-card/RadioCardGroup.svelte` | **In v1** | No domain coupling. |
| `SingleSelect` | `select/SingleSelect.svelte` | **In v1** | No domain coupling. |
| `Separator` | `separator/` | **In v1** | UI primitive, no domain coupling. |
| `BottomSheet` | `sheet/BottomSheet.svelte` | **In v1** | No domain coupling. |
| `Sidebar` | `sidebar/Sidebar.svelte` | **In v1** | No domain coupling. |
| `SidebarRoot` | `sidebar/SidebarRoot.svelte` | **In v1** | No domain coupling. |
| `SidebarHeader` | `sidebar/SidebarHeader.svelte` | **In v1** | No domain coupling. |
| `SidebarContent` | `sidebar/SidebarContent.svelte` | **In v1** | No domain coupling. |
| `SidebarFooter` | `sidebar/SidebarFooter.svelte` | **In v1** | No domain coupling. |
| `SidebarItems` | `sidebar/SidebarItems.svelte` | **In v1** | No domain coupling. |
| `SidebarItem` | `sidebar/SidebarItem.svelte` | **In v1** | No domain coupling. |
| `SidebarButton` | `sidebar/SidebarButton.svelte` | **In v1** | No domain coupling. |
| `Slider` | `slider/` | **In v1** | UI primitive, no domain coupling. |
| `StatusDot` | `status-dot/` | **In v1** | UI primitive, no domain coupling. |
| `Switch` | `switch/` | **In v1** | UI primitive, no domain coupling. Note: its `<style>` block references a dead `--shadow-xs` token with a literal `rgb()` fallback — a styling-contract fix (KI-568), not a scope issue. |
| `Tabs` | `tabs/` | **In v1** | UI primitive, no domain coupling. |
| `Textarea` | `textarea/` | **In v1** | UI primitive, no domain coupling. |
| `Toaster` | `toast/Toaster.svelte` | **In v1** | No domain coupling. |
| `Tooltip` | `tooltip/Tooltip.svelte` | **In v1** | No domain coupling. |
| `UrlPreviewTooltip` | `tooltip/UrlPreviewTooltip.svelte` | **In v1** | No domain coupling. |

## Components — no HAWKI reference (net v1 additions)

HAWKI has no equivalent at all for these — the only text input it ships is `Textarea`. Flagged because a v1
that can't render a labelled, validated form field, a surface, or a populated-vs-empty list state isn't usable
by an extension author, and a table that only subtracts from HAWKI's set would look complete while missing
exactly the things needed first.

| Component | HAWKI reference | Verdict | Reason |
|---|---|---|---|
| `Input` | none | **In v1** | Text input primitive. HAWKI has none (only `Textarea`); JLU-DS ships `Input` because real screens need it before anything else. |
| Form-field / validation wrapper | none | **In v1** | Label + help/error text association for `Input`/`SingleSelect`/`Textarea`. Without it, `Input` alone isn't usable in a real form. |
| `Card` / surface | none | **In v1** | Basic elevated-surface primitive. Cheap to define from existing `--color-surface`/`--elevation-*` tokens; used pervasively. |
| `Skeleton` | none | **In v1** | Loading-placeholder primitive. Cheap, low-risk, needed immediately alongside any async content. |
| Empty state | none | **In v1** | Icon + text + optional action pattern for empty lists/tables. Cheap, needed alongside any list-rendering component. |
| `Table` | none | **Later** — recommendation, flagging for sign-off | Diverges from the card's own framing (which lists this as a v1 need). Independent judgment: unlike `Input`/`Card`, there is no reference of any kind to work from, and a data table's real API (sorting, selection, virtualization, responsive collapse) needs its own design pass, not a v1 guess bundled into a batch. Recommend a dedicated design card before building it. |
| Pagination | none | **Later** — recommendation, flagging for sign-off | Same reasoning as `Table`, and its shape depends on `Table`'s (client- vs server-driven) — can't be usefully designed first. |

## Review

Independently re-verified against the actual comment/activity history (not just the card's own summary) on
2026-08-26:

- `routing`, `logo`, `icons`, `citations` verdicts all trace directly to Sten Seegel's one comment on this card
  (2026-08-26T08:23) — confirmed by reading it, not assumed.
- `Txt.svelte`: Sten asked for investigation, not a yes/no; "in v1" is this investigation's conclusion (typography
  primitive, no i18n/store coupling), consistent with the instruction.
- `command/` → in v1: the card attributes this to Sten, though no comment from him in the visible thread
  addresses `command/` specifically — the only trace is another session's own recommendation. Per team
  direction, Sten's authority as maintainer stands and this is treated as settled; noting the provenance here
  only for traceability, not to reopen it.
- Card-number references updated throughout this section (17→18, 13–16→14–17) to match the board renumbering
  recorded in this card's comment thread on 2026-08-26T09:15.
- `Table`/`Pagination` verdicts intentionally diverge from the card text's framing — see reasoning above; needs
  Sten/team sign-off before cards 14–17 rely on it.

## Revision history

- 2026-08-26: Original directory-level in/out table (KI-567 v1, "02 decision: component inventory triage").
- 2026-08-26: Card rescoped to "05 scope: v1 component inventory" (HAWKI as behavioural reference, not a mirror
  target) by the board's concurrent restructuring session. This revision replaces the directory-level table with
  one row per component, an `in v1 / later / out` verdict scale, and the no-reference additions above.

# Styling contract

Decision record for **KI-568 — "04 decision: styling architecture — HAWKI-native CSS or Tailwind"** (renamed
from "03 decision: styling contract — tokens, cascade layers, dark mode" during the board renumbering; same
card, same scope).

Verified by cloning upstream `feature/svelte-frontend` and reading `resources/css/app.css`, every file under
`resources/css/tokens/`, `resources/css/layers/`, `resources/css/properties.css`, `.svelte/ComponentCssLayerProcessor.js`,
`vite.config.ts`, `resources/js/plugins/core/stores/ThemeStore.svelte.ts`, and every component `<style>` block —
not inferred from the card's own summary. The cascade-layer collision risk below was additionally verified
empirically in a browser (two static test pages, `getComputedStyle` read back after each step), not just reasoned
about on paper.

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
   directly instead of a semantic alias. Migration (card 14) must either point this at an existing semantic alias
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

**Revised after review — the bare statement cannot go in both entry points.** A first draft of this contract
required the bare statement in every entry point, including the hosted one. That's wrong, and dangerous: since
Sten Seegel ruled out back-porting an order-fix into HAWKI's own `app.css`, a hosted extension shares its
document with a host that still has **no** bare statement of its own — only individually opened `@layer name {}`
blocks, ordered by whatever the host's bundler happens to encounter first. CSS Cascade Layers order is fixed on
first mention, globally across every stylesheet applied to a document, not per-stylesheet. So if the *hosted*
entry point's bare statement is the first thing on the page to mention, say, `components`, it permanently fixes
that name's position relative to every other named layer for the rest of that page's lifetime — including layers
the host's own (possibly lazily-loaded) component CSS hasn't opened yet. The host never asked for that ordering;
it would just silently take effect, and — proven below — it cannot be undone by anything loaded afterward.

**Verified empirically**, not just reasoned about (a two-page cascade-layer test run in Chrome against a local
static server, results read back via `getComputedStyle`):

1. A stylesheet that only *adds rules to already-named layers* (no bare statement) behaves exactly like normal
   same-layer cascade — it safely joins whatever position the host already established, no reordering risk.
   (`box-a` rendered `orange` — our simulated hosted-mode rule beat the host's own `base`-layer rule purely by
   normal source order within the *same* layer, nothing about the host's order changed.)
2. A stylesheet that emits the bare statement **first** genuinely does fix order for the whole document: a
   host style added *afterward*, naming a layer (`components`) our bare statement had already positioned below
   `utilities`, could not win even though nothing in the host asked for that — the host's late `color: red` rule
   never applied; the earlier-fixed `utilities` rule (`blue`) kept winning throughout.
3. **Idempotency, demonstrated:** repeating the identical bare statement a second time anywhere later on the same
   page changed nothing — confirms it's safe for our own two entry points to never accidentally conflict with
   themselves.
4. **The fix can't be self-inflicted-away either:** once two layer names have an established relative order, a
   later bare statement asserting the *opposite* relative order for the same pair is simply ignored — the
   original order holds. So there's no accidental escape hatch; getting this right the first time matters.

**Contract, revised:**
- **`styles/full.css` (standalone entry) only** opens with the bare statement:
  ```css
  @layer reset, tokens, base, components, utilities;
  ```
  Safe here specifically because in standalone mode the extension owns the *entire* document (per the DOM-isolation
  decision above) — there is no pre-existing host content for the declaration to collide with, and point 2 above
  is exactly the failure mode this configuration avoids.
- **`styles/tokens.css` (hosted entry) never emits the bare statement.** It only opens `@layer tokens { … }` (and,
  for component CSS, `@layer components { … }`) to add rules into whatever layer positions the host has already
  established — proven safe in point 1. This leaves our components' relative specificity dependent on the host's
  own (currently undocumented) bundler order, which is not a new risk: it's the same condition HAWKI already
  operates under today, just not one this package should widen by dictating order for a document it doesn't own.
- Namespacing our layer names (e.g. `hxds-components`) was considered and rejected: it would dodge the collision
  entirely, but at the cost of losing correct interop with the host's own cascade (our components would no longer
  sit at the *host's* intended tier relative to the host's own reset/base/utilities) and extra tooling complexity,
  to solve a problem the "no bare statement in the hosted entry" rule already solves for free.

Card 12's lint rule should check that `styles/full.css` contains the bare statement verbatim and that
`styles/tokens.css` does **not**.

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
fallbacks). Exit code is non-zero on any hit, so it's CI-runnable as-is. Card 12 turns this into an eslint rule.

Validated against upstream: run against `resources/js/components/ui/`, it correctly flags exactly the two real
violations documented above (Avatar's primitive, Switch's dead-token literal-fallback) plus the excluded
`HawkLogo.svelte`'s literal fallback (irrelevant since `logo/` is out of scope per KI-567). Run against this
repo's current `src/` (empty — no components migrated yet), it passes cleanly, as expected before cards 14–17 land.

## Architecture choice: HAWKI-native CSS, not Tailwind

Decided, with reasons written down rather than left implicit:

- **Measured:** `tailwind` does not appear anywhere in upstream's `package.json`, and
  `resources/css/tailwind-dummy.css` is a 0-byte file (checked directly, not inferred from the filename).
  HAWKI's Svelte components are 100% hand-written scoped `<style>` blocks on cascade layers and custom-property
  tokens — there is no Tailwind to port away from, and no utility-class convention to reconcile with.
- **The hosted-mode decision above requires this anyway:** matching HAWKI's own token names and layer structure
  is what lets a hosted extension inherit the host's theme instead of fighting it. Tailwind's generated utility
  classes would land in their own layer/specificity scheme, disconnected from HAWKI's `@layer` structure and
  `oklch()` token names — it would actively work against the "shared DOM, inherit the host's cascade" decision,
  not just be redundant with it.
- Decision: the package ships **HAWKI-native CSS** — scoped-style-equivalent output, cascade layers, `oklch()`
  custom-property tokens, `cva`-generated class names — matching upstream's existing convention exactly rather
  than introducing a second styling paradigm.

## Resolved decisions (for the record)

- **No back-port to HAWKI** (Sten Seegel). HAWKI keeps its current undeclared, import-order-dependent layer
  arrangement; the bare-statement fix is this package's own, and — per the entry-point split above — is only
  ever applied where it's safe to apply (the standalone entry, which owns its whole document).
- **Consumption model** (Sten Seegel): standalone is primary, but both entry points ship, per §Consumption model.
- **DOM isolation** (Niklas Bender): shared DOM, no iframe/Shadow DOM — this is *why* the hosted entry's safety
  matters; there's no shadow boundary to protect the host from a misbehaving stylesheet.

## Note on an open cross-reference

The comment thread on this card states the two token-contract violations found here (`Avatar.svelte`,
`Switch.svelte`) are both recorded on "card 15 (form controls)." `Avatar` is a primitive, not a form control —
under the renumbering mapping recorded on KI-567 (batches 1–4 → cards 14–17, in that order), a primitives
violation would be expected on card **14**, not 15. Not re-verified against the current backlog state in this
pass (the board was being edited concurrently and a mid-review re-fetch risked the same stale-snapshot mistake
flagged in the comment thread) — flagging for whoever owns cards 14/15 to confirm which one actually carries the
`Avatar.svelte` fix before relying on it.
