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
