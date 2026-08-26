---
name: cross-review
description: Independent cross-model review of pending changes via the gemini-cli MCP (Gemini 2.5 Pro). Use before merging any nontrivial branch, and ALWAYS when a change touches this package's published contract — the shipped styles/tokens, the export barrel, docs/DESIGN_SYSTEM.md, or the guardrails that enforce it. Trigger phrases: "cross-review", "second opinion", "gemini review".
---

# Cross-model review via gemini-cli

Get an independent review from a non-Claude model family before the work is reported as done. The
reviewer is `mcp__gemini-cli__ask-gemini`. It is advisory-only: it reads, you verify and act.

**It is not a review depth.** Every card already got one full independent review from
`code-reviewer`. This adds a second *model* on the surface where a silent mistake reaches every
consumer at once.

## Procedure

1. **Determine scope.** Prefer the card's own file set:
   `node .claude/tools/card-scope.mjs --base <claim-base sha> --format diff`. Failing that, diff the
   branch against `main` (`git diff main...HEAD`). Skip lockfiles and generated files (a generated
   iconset, `*.gen.*`).

2. **Collect context.** Convert the changed files to absolute paths. **Always include `CLAUDE.md` and
   `docs/DESIGN_SYSTEM.md`** — without them the reader cannot know this repo's rules and its
   "missed invariants" pass is generic. If more than ~15 files changed, pass the containing folders.

3. **Ask for the review.** Call `mcp__gemini-cli__ask-gemini` with a `prompt` that uses `@` syntax to
   include the files (`@CLAUDE.md @docs/DESIGN_SYSTEM.md @src/styles/tokens.css …`), plus the actual
   diff text, a one-paragraph statement of intent, and a request for concrete `file:line` findings —
   not style commentary. Ask specifically about:
   - **Contract drift** — a primitive token or literal colour used where a semantic alias is
     required (including inside a `var()` fallback); a token or export removed/renamed without a
     decision; a missing `@layer reset, tokens, base, components, utilities;` statement at the top of
     a shipped entry point; dark mode expressed as anything other than `html.darkMode`.
   - **Cascade and specificity bugs** a type checker cannot see: layer order, `@property`
     registration outside a layer, a rule that only works because of import order.
   - **Accessibility**: name/role/state, keyboard operability, focus management in the overlay
     components, contrast in *both* themes.
   - **Correctness and edge cases** in the component logic, and whether the stories actually cover
     the states the card claims are supported.

4. **Escalate contested findings.** For a finding that seems plausible but uncertain, run a second
   pass with a different `model` override and compare.

5. **Verify before reporting.** Check each finding against the code yourself. Report only confirmed
   or credibly-plausible findings, marked as such; silently drop hallucinated ones (note the count).
   A finding whose named path does not exist is not thereby wrong — upstream, an external reviewer
   invented a package name while pointing at a real gap. Check the claim, then check whether the
   concern lands somewhere that does exist. **You own the verdict — the external review is input,
   not authority.**

## Mandatory triggers

Run this skill without being asked whenever pending work touches the published contract:

```sh
node .claude/tools/card-scope.mjs --guarded-paths     # the authoritative list, one copy
```

`crossReviewRequired` in `card-scope.mjs`'s output is computed from that list — do not keep a second
copy of it in any prompt file. Escalate by hand beyond the list when the semantic clause in
`agents/code-reviewer.md` applies (anything that defines, aliases, renames, removes or re-exports
something a consumer can depend on).

## No secrets leave the repo

The diff goes to a third-party service. Never send credential values — an npm publish token in
`.npmrc` is the realistic one here. A live credential in the diff is a FAIL about the tree, reported
immediately, and the diff is not sent at all.
