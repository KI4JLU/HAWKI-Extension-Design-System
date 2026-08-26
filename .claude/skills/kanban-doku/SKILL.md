---
name: kanban-doku
description: Tracks work progress, decisions, and milestones for the HAWKI Extension Design System as cards on this repo's kanban board (kanban-mcp). Use whenever a task is started, the status of an in-progress task changes (e.g. in progress, in review, done), or an interim result/decision should be recorded. Trigger phrases: "put it on the board", "kanban", "create/move a card", "track progress", completing a milestone.
---

# Kanban tracking (kanban-mcp)

This project tracks tasks and progress on a Kanban board in addition to the Markdown docs, so that
across sessions it stays visible what is open / in progress / done.

The board is also the **plan of record**: cards are numbered (`01`…`20` in their titles) and carry
the dependency chain in their descriptions (`Depends on 07`, `Blocks 14–17`). Before picking up
work, read the card — its DoD is the acceptance criterion, and several cards explicitly forbid
copying a JLU-DS solution without re-deciding it.

## Board coordinates (kanban-mcp tools)

- Workspace: `KI` — publicId `o8h0ip5s4bvv`
- Board: `HAWKI-Extension-Design-System` — publicId `kuxahclrsjq4` (slug `hawki-extension-design-system`)

**Lists** (in order) — use these publicIds directly:

| List | publicId | Meaning |
|---|---|---|
| `Backlog` | `16dowyjbely1` | Known future work, not scheduled yet |
| `To Do` | `0mqxxufa9daa` | Scheduled, ready to pick up next |
| `In Progress` | `zryn9k9c0362` | **Actively being worked right now** |
| `Code Review` | `l9y5adsvupqi` | Finished, awaiting review/verification |
| `Done` | `2v3ylflyl9be` | Finished and verified |

**Blocked-on-a-decision rule:** this board has **no `Needs Decision` list** (unlike the JLU Design
System board). When a card is blocked on input only the user can give (a go/no-go, a scope choice,
infrastructure, priorities): attach the **`Blocked`** label, leave the card in its current list, and
**append a "Decision needed:" section to the card description** stating the concrete question and
the options, so the user can decide asynchronously from the board alone. Once decided, remove the
label and record the decision (with date and who decided) in the description — the existing decision
records use "(decided by Sten Seegel)" inline, keep that style.

**Labels** — publicIds:

| Label | publicId | Use for |
|---|---|---|
| `Bug` | `20el4z2kxx7v` | |
| `Feature` | `g6msk799lkvk` | |
| `Enhancement` | `g0ynlfbnrl2z` | |
| `Critical` | `8kmb2hkanyxy` | |
| `Documentation` | `u4cxd8b31aht` | Decision records, governance, MDX pages |
| `Refactor` | `345rkroyclqp` | |
| `Test` | `57i5e2fgpbuo` | |
| `Plan` | `1avp7ldq65y5` | |
| `Blocked` | `8wkna354n4oa` | Blocked on user input — see rule above |
| `deferred` | `om6htw8b132h` | Decided to postpone (e.g. licence, package name) |
| `prio high` | `ca5o45h72wmn` | |
| `prio medium` | `wu7e79upms0f` | |
| `prio low` | `6th5644064sk` | |
| `review: approved` | `pekdc0s6z538` | Outcome of a `Code Review` pass |
| `review: changes requested` | `llf38eovpon0` | Outcome of a `Code Review` pass |
| `review: comments` | `qllncgnydgva` | Outcome of a `Code Review` pass |

> If a call fails with a stale-id error (board recreated, lists renamed, etc.), re-resolve:
> `list_workspaces` → the workspace → `get_board` with the board publicId → read the current
> `lists`/`labels` ids, **and update the tables above in this file** so the next session is correct
> again. Do **not** use `find_board_by_name` (throws an internal error on a name mismatch instead of
> a clean "not found"); use `get_board` / `get_board_by_slug`.

## Language

Cards on this board are written in **English** (titles and descriptions).

## The core rule: `In Progress` must mirror reality

**Whenever you are actively working a milestone, exactly that card must be in `In Progress`.**
Concretely, on every substantive task:

1. **Before starting work** — make sure a card exists for it (create one if not) and move it to
   `In Progress` (`update_card` with the `In Progress` list publicId, `index: 0`). If a card
   is already in `In Progress` for the previous task, resolve it first (step 3) — don't leave
   two cards in `In Progress` unless both really are in flight.
2. **While working** — keep interim results/decisions on the card. Update the card **description** to
   capture the "why" of a decision. *(See caveat on comments below.)*
3. **When finishing** — move the card **out of `In Progress`**:
   - → `Code Review` if someone should verify the result first (default for milestones that produce
     an artifact to inspect), **or**
   - → `Done` if it is a small, self-evidently complete step.

**Anti-patterns to actively avoid:**
- Working on something while `In Progress` is empty. If you catch this, move the right card in.
- Leaving a completed task sitting in `To Do`/`Backlog`. If work is done, it belongs in
  `Code Review` or `Done`, never in a pre-start list.
- A card in `In Progress` that nobody is working on. Pausing mid-milestone is fine (it *is* in
  progress) — but a finished one must be moved.
- Moving a card to `Code Review`/`Done` without meeting its **DoD**. Most cards here demand a
  *demonstration* ("demonstrate it, don't assert it") — e.g. the check must be shown failing.
  A DoD that says "demonstrate" is not satisfied by a claim in the card description.

At the start of a session, `get_board` and reconcile before doing new work.

## When to create a card

- A new milestone is started.
- A non-trivial bug or open uncertainty is found that should be tracked beyond this session.

Create in `Backlog` or directly in `To Do` (`create_card`). Title short and concrete, matching the
board's existing cards — the numbered plan cards read `NN topic: summary`; ad-hoc cards can drop the
number. Description with context and a reference to the related decision record in
`docs/DESIGN_SYSTEM.md` if any. Attach the right label (`toggle_card_label`).

Follow-ups already recorded in `docs/DESIGN_SYSTEM.md` under "Open follow-ups" / "Open" should get
cards rather than staying prose-only.

## Tooling caveats (verified on this kanban server)

- **`update_label`** may require `colourCode` even when you only want to rename a label.
- Use `update_card` `index: 0` to place a moved card at the **top** of its target list.

## What does not belong on the board

- No secrets/credentials/tokens in card text or comments.
- Nothing the repo's docs mark as off-limits for a hosted third-party service.
- No upstream HAWKI source dumps — reference `path:line` in `hawk-digital-environments/HAWKI`
  (branch `feature/svelte-frontend`) instead. HAWKI is GPLv3 and the licence/provenance question
  is still open (card KI-589, `deferred`).
