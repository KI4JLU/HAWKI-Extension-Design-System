---
name: kanban-doku
description: Board coordinates and conventions for the HAWKI Extension Design System's kanban board (kanban-mcp) — list/label ids, the "In Progress mirrors reality" rule, the Needs Decision rule and the review-verdict labels. Read by the project-manager skill and every agent it spawns. Use whenever a task is started, the status of an in-progress task changes (e.g. in progress, in review, done), or an interim result/decision should be recorded. Trigger phrases: "put it on the board", "kanban", "create/move a card", "track progress", completing a milestone.
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
| `Needs Decision` | `3kcslqu68n0u` | **Blocked on user input** — see rule below |
| `In Progress` | `zryn9k9c0362` | **Actively being worked right now** |
| `Code Review` | `l9y5adsvupqi` | Finished, awaiting review/verification |
| `Done` | `2v3ylflyl9be` | Finished and verified |

**`Needs Decision` rule:** whenever a card is blocked on input only the user can give
(a go/no-go, a scope choice, infrastructure, priorities), move it to `Needs Decision`
instead of leaving it in Backlog/To Do — and **append a "Decision needed:" section to the
card description** stating the concrete question and the options, so the user can decide
asynchronously from the board alone. Once decided, move the card back into the normal flow
and record the decision (with date) in the description. The existing decision records write
this as "(decided by Sten Seegel)" inline — keep that style.

> The list was created after the other five, and this kanban server has no list-reorder tool,
> so it renders **last** on the board (after `Done`) rather than between `To Do` and
> `In Progress`. Position is cosmetic; drag it in the Kan UI if it should sit in flow order.

**Labels** — publicIds:

| Label | publicId | Use for |
|---|---|---|
| `Bug` | `20el4z2kxx7v` | |
| `Feature` | `g6msk799lkvk` | |
| `Critical` | `8kmb2hkanyxy` | |
| `Documentation` | `u4cxd8b31aht` | Decision records, governance, MDX pages |
| `Refactor` | `345rkroyclqp` | |
| `Test` | `57i5e2fgpbuo` | |
| `Plan` | `1avp7ldq65y5` | |
| `Blocked` | `8wkna354n4oa` | Blocked on another card or an external dependency (for blocked on *user input*, use the `Needs Decision` list instead) |
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

## Who writes to this board

The `project-manager` skill (main session) creates, moves and annotates cards. `milestone-worker`
claims its card (`In Progress`) and hands it on (`Code Review`). `code-reviewer` records the REVIEW
note, stamps the `review:` label and moves a passing card to `Done`. `planner` creates cards only.
Nobody else writes here.

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

## Review-verdict labels (`review: …`)

After a review the card wears its verdict as a label, the way a GitHub PR wears its review state, so
the board shows the outcome without anyone opening the card.

| Label | publicId | Meaning |
|---|---|---|
| `review: approved` | `pekdc0s6z538` | reviewer PASS |
| `review: changes requested` | `llf38eovpon0` | reviewer FAIL, the card goes back to a worker |
| `review: comments` | `qllncgnydgva` | **non-blocking** findings are on the card and a human should read them |

- **`approved` and `changes requested` are mutually exclusive.** A new review round **replaces** the
  state label — remove the old one before setting the new one. A card carrying both is an error state,
  not a history.
- **`comments` is additive** and may sit next to `approved`. "Passed, but with open remarks" is the
  most common real outcome, and exactly the one that used to get lost.
- **`comments` is not a verdict** but an open in-tray: it stays on the card until the remarks are
  worked off or explicitly dropped. It is not removed just because the card passed.
- **The reviewer stamps, not the project manager.** The reviewer renders the verdict, so it records it
  — `code-reviewer` holds `toggle_card_label` for exactly this. Letting the PM set the label would make
  the PM the transmitter of a verdict, which is the role the pipeline deliberately keeps away from the
  agent that spawned the worker and wants the card closed. The board write does not weaken the
  reviewer's independence: it has `update_card` for the REVIEW note anyway, and it still has no
  Edit/Write.
- The non-blocking findings themselves live in the REVIEW note under a literal `NON-BLOCKING:`
  heading, one list item per finding with file and line. The label advertises them; it does not
  replace them.
- **The PM reads an existing `review: comments` out to the developer** when it reports the card. A
  yellow label nobody mentions is as ineffective as the buried prose it was introduced to replace.
- **Never create a new `review: …` label** — these three exist, with the ids above.

## Externally blocked cards (`Blocked`)

A card can be scheduled and still be unworkable — waiting on a third party, another team, or a system
nobody here can reach. `To Do` means "ready to pick up next", so an externally blocked card sitting
there will be picked as the next milestone by a later session. Mark it:

1. **The card gets the `Blocked` label** (id in the label table above).
2. **The blocker is named in the description**: what is being waited on, who owns it, since when, and
   what would unblock it. The label without that sentence is useless to the next session.
3. **The card stays in `To Do`/`Backlog`** — `In Progress` is for work actually in flight.
4. **The project manager skips `Blocked` cards when choosing the next work** and spawns no
   `milestone-worker` for one. If the developer names such a card anyway, report the blocker instead of
   starting on it.
5. **When the blocker clears**, remove the label and record in the description what resolved it.

`Blocked` and `Needs Decision` are different states: `Blocked` is "someone else has to act",
`Needs Decision` is "the developer has to choose". A card waiting on the developer belongs in the
list, not under the label.

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
- **`toggle_card_label` toggles, it does not set.** Called on a label the card already carries, it
  **removes** it. Read the card's current `labels` with `get_card` first and then toggle only what has
  to change — otherwise the call strips the very label you meant to apply (a PASS that silently ends
  up unlabelled, or a FAIL that reads as approved).
- Use `update_card` `index: 0` to place a moved card at the **top** of its target list.
- **`update_card`/`create_card` expect real line breaks in the description, not JSON-escaped `\n`.**
  Passing a string that contains literal `\n` sequences renders the whole card as one unreadable
  line. Write the description as actual multi-line text; Markdown in it is rendered.
- **`update_card` replaces the description; it does not append.** `get_card` first and pass the whole
  text back with your addition — this is how REVIEW notes, CONTEXT BRIEFs and RESEARCH notes
  accumulate instead of overwriting each other.
- There is **no list-reorder tool** on this server (see the note under the lists table).

## What does not belong on the board

- No secrets/credentials/tokens in card text or comments.
- Nothing the repo's docs mark as off-limits for a hosted third-party service.
- No upstream HAWKI source dumps — reference `path:line` in `hawk-digital-environments/HAWKI`
  (branch `feature/svelte-frontend`) instead. HAWKI is GPLv3 and the licence/provenance question
  is still open (card KI-589, `deferred`).
