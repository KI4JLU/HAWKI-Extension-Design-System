# HAWKI Extension Design System

Svelte 5 component library extracted from HAWKI's `feature/svelte-frontend`
(`resources/js/components/ui/`), packaged for HAWKI extension authors. The repo is still a
skeleton: `docs/DESIGN_SYSTEM.md` (scope + styling contract) and
`scripts/check-token-usage.sh` (token guardrail) — no `package.json`, Svelte, Vite or
Storybook setup yet (cards 06/07).

Read `docs/DESIGN_SYSTEM.md` before touching tokens, cascade layers or dark mode. Two of its
decisions are easy to break by copying JLU-DS habits:

- Dark mode is `html.darkMode`, **not** `data-theme="dark"`. This divergence is intentional —
  do not harmonise it.
- Every shipped CSS entry point opens with the bare statement
  `@layer reset, tokens, base, components, utilities;` as its first rule.

Work is tracked on the `HAWKI-Extension-Design-System` kanban board — see the `kanban-doku`
skill. Card refs are `KI-###`; the numbers in card titles (`01`…`20`) are the intended order.

## Documentation lives in Storybook

Card 07 makes Storybook the single source of truth and **deliberately rejects JLU-DS's split**
between `docs/*.md` and Storybook. So:

- Component props/behaviour/variants belong in stories + doc comments, never in a parallel
  markdown component reference.
- Governance pages (Introduction, Tokens, Theming, Consumer integration, Contribution) belong
  in MDX inside Storybook.
- `docs/*.md` is for **decision records** (why a contract is what it is) only. If markdown
  duplicates something a story could show, that is drift — fix it by embedding the story.

Until Storybook exists, decision records in `docs/` are the only written surface; do not grow
them into component documentation in the meantime.

## Commit messages

Imperative summary line ending in the card ref, then a body explaining the *why* (wrapped at
~72 chars):

```
Add styling contract decision record (KI-568)

Documents the token/cascade-layer/dark-mode contract the package
promises consumers, based on reading app.css, all token files, ...
```

- Summary: imperative mood, no `type(scope):` prefix — this repo does **not** use Conventional
  Commits (that is the JLU-DS convention; don't carry it over).
- Always reference the card: `(KI-###)`.
- The body says what was verified and why the decision went that way, not what the diff shows.
- Do NOT add a `Co-Authored-By: Claude` trailer. Co-author trailers are for humans only.
