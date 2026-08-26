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

Conventional Commits, one short lowercase summary line:

```
feat(tokens): semantic alias for the avatar neutral fill
```

- Format: `type(scope): summary` — types: feat, fix, chore, docs, refactor, test, ci
- Reference the card in the body: `KI-###`.
- Do NOT add a `Co-Authored-By: Claude` trailer. Co-author trailers are for humans only.

> The two commits that predate this file (`Add component inventory triage table (KI-567)`,
> `Add styling contract decision record (KI-568)`) do not follow it. The convention above is
> the one to use from here on — do not imitate the older style.
