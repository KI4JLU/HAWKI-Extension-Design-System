---
name: contract-review
description: A second, independent review pass over a change to this package's published contract — the shipped styles/tokens, the export barrel, docs/DESIGN_SYSTEM.md, or the guardrails that enforce it. Runs AFTER code-reviewer has already rendered PASS, and adds a fresh reviewer with an adversarial brief plus explicit developer sign-off. Trigger phrases: "contract review", "second opinion", "second pass".
---

# Contract review — the second pass on the published surface

A change to the published contract is the one class of defect this package cannot walk back quietly:
a renamed token, a dropped export or a missing layer statement breaks every consumer at once, at a
version they already pinned, and no type checker or story sees it. So that surface gets a **second
independent pass** on top of the ordinary review.

**This is not a review depth.** Every card already got one full independent review from
`code-reviewer`. This adds a second *reader*, with a different brief, on the surface where being
wrong is expensive.

**No external service is involved.** An earlier version of this skill called a cross-model MCP
(Gemini via `gemini-cli`). That was removed: the MCP is configured on one developer's machine and is
not shared by the project team, so a harness that depends on it silently does nothing for everyone
else — the worst failure mode a mandatory gate can have. A gate that only fires for one person is not
a gate. The second pass therefore runs inside this harness, with the tools everybody has.

> If a second model family is ever configured **for the team**, this is where it plugs in: as an
> additional reader in step 3, never as a replacement for the reviewer's verdict. Do not reintroduce
> a per-machine MCP dependency here.

## Procedure

1. **Confirm the trigger.** `contractReviewRequired` in the Step 4 output of
   `node .claude/tools/card-scope.mjs --base <claim-base sha>` is computed from `CONTRACT_REVIEW_PATHS`
   — the single copy of the list, printable with `--guarded-paths`. Escalate by hand when the semantic
   clause in `agents/code-reviewer.md` applies (anything that defines, aliases, renames, removes or
   re-exports something a consumer can depend on) even if the script did not flag it.

2. **Assemble what the second reader gets.** The card's own diff
   (`node .claude/tools/card-scope.mjs --base <claim-base sha> --format diff`), plus `CLAUDE.md` and
   `docs/DESIGN_SYSTEM.md` — without those two it cannot know this repo's rules, and its findings
   would be generic. Skip lockfiles and generated files.

3. **Spawn a fresh `code-reviewer` with an adversarial brief.** A *new* invocation, not the one that
   already passed the card: it must not be defending its own verdict. Tell it in the prompt that the
   card has already passed an ordinary review and that its job is narrower and hostile — **find the
   way this change breaks a consumer who upgrades without reading the changelog.** Point it at:
   - **Contract drift** — a primitive token or literal colour where a semantic alias is required
     (including inside a `var()` fallback); a token, custom property or export removed or renamed
     without a decision; `styles/full.css` not opening with
     `@layer reset, tokens, base, components, utilities;`, or `styles/tokens.css` emitting that
     statement at all; dark mode expressed as anything other than `html.darkMode`.
   - **Cascade and specificity failures** a test cannot see: layer order that only works because of
     import order, `@property` wrapped in a layer, a rule whose weight depends on the consumer's own
     stylesheet.
   - **The consumer's view, not the repo's** — what `styles/full.css` versus `styles/tokens.css`
     actually delivers to a page that already has its own reset; what an extension that pins the
     previous version sees change.
   - **Accessibility** — name/role/state, keyboard operability, focus management in the overlay
     components, contrast in *both* themes.
   - **Guardrail narrowing** — if the diff touches `scripts/check-token-usage.sh` or
     `eslint-plugin/`, whether the change makes a real violation invisible. A passing suite is not
     evidence that narrowing a check was right.

4. **Verify the findings yourself before passing them on.** Check each against the code. Report only
   confirmed or credibly-plausible findings, marked as such. A finding whose named path does not
   exist is not thereby wrong — check the claim, then check whether the concern lands somewhere that
   does exist. **You own the verdict; the second pass is input, not authority.** A real defect is a
   new FAIL round (PM Step 3), never a repair you make yourself.

5. **Tell the developer, in as many words, that the published contract changed.** Name what a
   consumer would have to do about it: nothing, a token rename to follow, a version bump that has to
   be major. This is the sign-off the second pass exists to inform — a contract change is reported to
   a human explicitly, never buried in a PASS.

## Limits, stated plainly

- **The second reader is the same model family as the first.** It brings a fresh context and a
  hostile brief, not an independent architecture — a whole class of shared blind spot survives both
  passes. That is the cost of not depending on a tool the team does not have, and it is written down
  here rather than papered over.
- The pass is only as good as the file set it is handed: scope it with the card's `claim-base`, never
  `--no-base`.

## No secrets leave the repo

Nothing here sends the diff anywhere — that is now true by construction. It stays true if a team-wide
external reader is added later: never send credential values, and a live credential in the diff is a
FAIL about the tree, reported immediately.
