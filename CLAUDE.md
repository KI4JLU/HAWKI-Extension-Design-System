# HAWKI Extension Design System

> **Single source of truth for the agent network.** The `project-manager` skill and every agent it
> spawns (worker, reviewer, researcher, web-researcher, planner) reads this file on every request.
> Keep it lean — detail belongs in `docs/`, linked from here.

## Context & goal

A **Svelte 5 component library** extracted from HAWKI's frontend and published for HAWKI extension
authors. Source of the extraction: `hawk-digital-environments/HAWKI`, branch
`feature/svelte-frontend`, path `resources/js/components/ui/` — a behavioural reference to port from,
not a tree to copy.

Card 06 (KI-570) landed the skeleton: `package.json`, `vite.config.ts`, `svelte.config.js`,
`tsconfig.json`, `eslint.config.js`, a `src/lib/` library root published by `svelte-package`, and a
vitest suite. **Storybook is not set up yet** — `npm run storybook` deliberately exits 1 until card 07.
Do not report a gate as passing that does not exist.

Read `docs/DESIGN_SYSTEM.md` before touching tokens, cascade layers, dark mode or scope. Work is
tracked on the `HAWKI-Extension-Design-System` kanban board (`kanban-doku` skill); card refs are
`KI-###` and the numbers in card titles (`01`…`20`) are the intended order with the dependency chain
in the descriptions.

## How work runs here

The developer talks to **one** session: the project manager. The PM plans, records state on the
kanban board, and spawns subagents for the carded work. The pipeline and its rules live in
`.claude/skills/project-manager/SKILL.md`; board coordinates in
`.claude/skills/kanban-doku/SKILL.md`; the whole harness is described in `.claude/README.md`.

- **Routing follows the request, not an agent's judgement of how big its own work is.** A board
  card, or "implement X" / "port the X component" / "fix the bug where" → the pipeline (worker →
  reviewer). Anything the developer brings ad hoc — investigate, explore, explain, tweak, set up,
  probe → the PM does it itself, directly. There is no lane to enter, no scope test, no size
  threshold and no sentinel; do not reintroduce a "too small to review" path.
- **The guarded paths are never the PM's, however the request arrived.** In the main session
  `.claude/hooks/pm-no-direct-edit.sh` always refuses the **published contract** (`src/lib/styles/`,
  `styles/`, `src/lib/index.ts`, `docs/DESIGN_SYSTEM.md`, `scripts/check-token-usage.sh`,
  `eslint-plugin/`) plus `package.json`, `vite.config.ts`, `svelte.config.js`, `eslint.config.js`,
  `.storybook/`, `.github/workflows/`, `.npmrc`, and the harness's own `.claude/settings*.json`,
  `.claude/hooks/` and `.claude/tools/`.
  Those change through the pipeline only — card, worker, independent reviewer. Nothing lifts the
  guard; subagents pass through it because their hook input carries `agent_id`. The contract half has
  one copy (`CONTRACT_REVIEW_PATHS` in `.claude/tools/card-scope.mjs`, which the hook imports) and both
  halves are tested (`.claude/hooks/pm-guard.test.mjs`).
- **A refused Edit or Write is never retried through Bash.** The hook matches the file-editing
  tools only, so `sed -i`, a heredoc redirect or `tee` would go through — which makes this an
  instruction, and the instruction is absolute: a refusal is the routing answer, not an obstacle.
  Reach for the pipeline (card → worker → reviewer), never for another tool that reaches the same
  path.
- **Nothing is verified until an independent reviewer re-derived it.** The worker's own claims are
  not evidence.
- **One card in `In Progress` at a time**, and it mirrors what is actually being worked.
- **One review path per card, and no cheaper one exists.** A review-tiering experiment in the repo
  this harness came from was removed after measurement: full reviews cost 98k–180k tokens and the one
  cheap-tier run cost 114k, because the expensive half is running the gates and re-deriving the
  findings, not the reading. Ad-hoc work the PM does itself is not a cheaper review — it is **no**
  review, and is reported as such.

## Commands (exact invocations — worker and reviewer run these every request)

From the repo root. These are real, and were run green on the harness branch; a wrong command here
costs a wasted implement-review round, so whoever changes a script updates this section.

- Lint + format check: `npm run lint` (`eslint . && prettier --check .`)
- Type/component check: `npm run check` (`svelte-check`)
- Tests: `npm test` (`vitest run`) — **this includes the harness suites**: vitest's default include
  picks up `.claude/tools/card-scope.test.mjs` and `.claude/hooks/pm-guard.test.mjs`, so the guarded
  surface is gated by the repo's own test command with no extra wiring. 133 tests today.
- One suite: `npx vitest run .claude/hooks/pm-guard.test.mjs`
- Library build: `npm run build` (`svelte-package`, `src/lib` → `dist`)
- Token guardrail: `bash scripts/check-token-usage.sh src/lib` (non-zero on a primitive token or a
  literal colour; any directory may be scanned)
- Collect the current card's file set:
  `node .claude/tools/card-scope.mjs --base <claim-base sha>` (fallback: `--base main`)
- Produce the diff text a reviewer reads:
  `node .claude/tools/card-scope.mjs --base <claim-base sha> --format diff`
- Print the mandatory-contract-review trigger paths: `node .claude/tools/card-scope.mjs --guarded-paths`

Not available yet: `npm run storybook` / `npm run build-storybook` exit 1 with a pointer to card 07.

Pre-handoff check (run all three):

```bash
npm run lint && npm run check && npm test
```

## Architecture invariants (breaking one is a review FAIL)

Each of these is written down in `docs/DESIGN_SYSTEM.md` with the reasoning and the evidence.

- **Semantic aliases only.** A component never references a primitive token (`--color-accent-500`)
  or a literal colour — including inside a `var()` fallback. `scripts/check-token-usage.sh` is the
  mechanical check. Two upstream violations are documented (Avatar's primitive, Switch's dead
  `--shadow-xs` with a live `rgb()` fallback); neither may be ported in.
- **The bare `@layer` statement belongs to exactly one entry point.** `styles/full.css` (the
  standalone entry) opens with `@layer reset, tokens, base, components, utilities;` as its very first
  rule, before any `@import`. `styles/tokens.css` (the hosted entry) **never** emits it — it would
  reorder the layers of a host document that already declared its own. Layer order is set by first
  encounter, not by comments; upstream relies on bundler-dependent ordering luck and this package
  must not. Card 12's lint rule checks both halves. (`docs/DESIGN_SYSTEM.md`, "Cascade layer order".)
- **Dark mode is `html.darkMode`.** No `data-theme`, no `prefers-color-scheme` in shipped CSS, no
  ported `lightMode` bookkeeping. The divergence from JLU-DS is deliberate; do not harmonise it.
- **Storybook is the single source of truth** (card 07). Props, variants and states are documented in
  stories plus doc comments — never in a parallel markdown component reference. **If it isn't in a
  story, it isn't supported.** `docs/*.md` is for decision records only.
- **The published surface does not change silently.** A removed or renamed export, token or CSS custom
  property needs an explicit human decision, not a worker's judgment.
- **Any change touching the published contract must additionally go through the `contract-review`
  skill** before it is reported as ready — a second review pass by a fresh `code-reviewer` with an
  adversarial brief, plus an explicit statement to the developer that the contract changed. The
  authoritative path list is `CONTRACT_REVIEW_PATHS` in `.claude/tools/card-scope.mjs`
  (`--guarded-paths`) — one copy, referenced by `code-reviewer`, the PM's Step 5 gate and imported by
  the PM guard hook, never restated.
- **The harness depends on no per-developer tooling.** Everything a mandatory gate needs must be in
  the repo and available to whoever clones it — `git`, `node`, and the project's own scripts. A gate
  wired to an MCP or CLI that only one machine has does nothing for everyone else while still reading
  as enforced, which is worse than not having it. (This is why the second reader is another
  `code-reviewer` and not an external model: see `.claude/skills/contract-review/SKILL.md`.)
- **Upstream HAWKI is GPLv3 and the licence/provenance question is deferred** (card KI-589). Port
  behaviour, cite `path:line`, and do not paste large verbatim blocks into the repo, cards or prompts
  to external services. The decouplings the triage table names (the chat-plugin import in
  `CitationReference.svelte`, `useTranslator` as a hard dependency) are requirements, not suggestions.

## Working style

- **No big-bang.** Every request lands as a runnable, testable artifact. Too large for one pass →
  the planner splits it into cards first.
- **Keep the board honest** (`kanban-doku` skill). Every milestone is a card; finished work moves to
  `Code Review` then `Done`, never parked in `To Do`.
- **Tests derive from stories, and every test states its oracle.** A test asserting the code's output
  against values the same code produced proves nothing. Legitimate oracles here: the story's
  documented contract, the a11y requirements (keyboard reachable, focus visible, name announced), the
  token contract. "The rendered class list equals what it rendered" is not one.
- **A DoD that says "demonstrate" is not met by a claim.** Several cards require showing a check
  fail — do that, and paste the output.
- **Mark uncertainty explicitly** in code and docs (`// TODO: … not yet confirmed`). Never launder a
  guess into a stated fact. `docs/DESIGN_SYSTEM.md` sets the standard: it says what was read and what
  was measured, and flags what was inferred.
- **A probe is never a deliverable.** An exploratory experiment (a clone of upstream, a scratch repo)
  lives outside the tree or behind an existing ignore rule, and is deleted when it has answered its
  question. **The finding is the artifact:** record it on the card or in `docs/` so it survives, and
  any later work that depends on it says where the number came from.
- **Work the PM did itself is unreviewed.** Say so plainly when reporting it — never "verified",
  "reviewed" or "validated". Green gates mean the tree still builds, not that the change is right.
- **Document before code** where a design decision is load-bearing: the decision record lands in
  `docs/` before or alongside the code that depends on it.
- Docs and cards on this board are written in **English**.

## Non-goals

- **No routing.** The upstream client router is documented, not migrated (card 18, decision recorded
  in the triage table).
- **No brand marks.** `HawkLogo` is out of scope; this package ships primitives, not HAWKI's wordmark.
- **No application state.** No HAWKI stores, API calls, i18n hooks or chat-plugin imports as hard
  dependencies of a component — those become props, callbacks or slots, or the component stays out.
- **No second source of truth for component documentation** — no `docs/*.md` component reference
  beside Storybook, no code sample duplicated between MDX and a story, no hand-maintained token
  table.
- **No secrets, tokens, or credentials** in the repo, in board cards, or in prompts to external
  services — including an npm publish token in `.npmrc`.
- Agents do not edit `.mcp.json`, `.claude/settings.json`, or `.claude/settings.local.json` unless
  explicitly asked.
- **No headless, scheduled, or cron-driven operation of the dev harness**: the pipeline runs only in
  an interactive session with the developer present — no autonomous main loop, no unattended runs.

## Git conventions

Conventional Commits, one short lowercase summary line:

```
feat(tokens): semantic alias for the avatar neutral fill
```

- Format: `type(scope): summary` — types: feat, fix, chore, docs, refactor, test, ci
- Reference the card in the body: `KI-###`.
- Do NOT add a `Co-Authored-By: Claude` trailer. Co-author trailers are for humans only.
- Work happens on a feature branch; `main` is integrated via PR against
  `KI4JLU/HAWKI-Extension-Design-System`. No direct pushes to `main`.
- **No agent commits, pushes, or merges without the developer asking for it in the conversation.**
  A reviewer PASS is a report, not authorization.
- No destructive git operations (`reset --hard`, force-push, history rewrite) unless explicitly
  requested.

> The two commits that predate this file (`Add component inventory triage table (KI-567)`,
> `Add styling contract decision record (KI-568)`) do not follow the convention above. It is the one
> to use from here on — do not imitate the older style.
