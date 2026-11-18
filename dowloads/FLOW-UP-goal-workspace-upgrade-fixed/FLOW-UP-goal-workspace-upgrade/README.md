# FLOW-UP Goal Workspace multi-view upgrade

## Files
- `src/app/App.tsx` — integrates the new Goal workspace and loads workspace-wide Actions while the Goals page is open.
- `src/goals/GoalWorkspace.tsx` — Tree, Flow board, Reverse Horizon, List and contextual Goal detail.
- `src/goals/goal-workspace.css` — responsive design.

## Apply
Copy the three files into the same paths in `W:\Projects\FLOW-UP`, overwriting `src/app/App.tsx` and adding the two files under `src/goals`.

## Design decisions
- Goal, Milestone and Action remain the source-of-truth entities. No database migration or new status is introduced.
- Tree is for parent/child outcome structure.
- Flow board groups existing Action statuses (In progress / To do / Completed). Staleness and overdue dates are advisory signals only; they never mutate statuses.
- Reverse Horizon uses the Goal's actual target date and actual Milestones. Unknown intermediate horizons stay explicitly unresolved.
- List supports quick scanning.
- The Focus strip surfaces the next open Action across the currently filtered Goals.

## Validation
Run:
```powershell
pnpm typecheck
pnpm build
pnpm test
```
This package was generated from the supplied 2026-11-18 project dump. It has not been executed in the user's local environment.


## Follow-up test/typecheck corrections
- Removed the legacy `GoalTree` / `GoalTreeNode` helpers from `App.tsx`; the new `GoalWorkspace` owns tree rendering.
- Updated the existing measurement test to query the new accessible button name, `+ Add measurement`.
- The test file is included at `tests/app.test.tsx` so the selector update is not missed.
