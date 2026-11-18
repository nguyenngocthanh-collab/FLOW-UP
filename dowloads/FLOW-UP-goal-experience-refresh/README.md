# FLOW-UP Goal Experience Refresh (frontend overlay)

## Files to replace
- `src/goals/GoalWorkspace.tsx`
- `src/goals/goal-workspace.css`

`src/app/App.tsx` and backend files are intentionally not modified. The existing props and API callbacks are reused.

## What changes
- Tree becomes a connected, expandable hierarchy map with distinct root/child nodes, selected-node state, action completion pulse, and expand/collapse all.
- Flow is grouped by Goal rather than only three global status columns. Child outcomes, per-Goal action completion, open Actions, and advisory friction signals appear in context.
- Horizon shows the real Goal destination, dated Milestones sorted chronologically, current next Action, and an actual countdown. Undated milestones stay undated.
- List shows hierarchy depth and makes each Goal selectable.
- Goal detail now explicitly lists direct Child Goals with navigation, Milestones with edit/complete, Actions with status/edit/execution, and Measurements.

## Important current API limitations
The repository currently has no archive/delete endpoints for individual Goals or Milestones. The schema uses `ON DELETE CASCADE` for Goal parent-child and Goal-to-Milestone/Action relationships, so adding a client-side delete button would risk deleting an entire subtree and dependent records. This package deliberately does not fake deletion.
The current frontend still creates Child Goals and Milestones through the existing App.tsx modals. The detail panel now makes created child Goals discoverable and clickable.

## Apply
Extract this folder into the project root, preserving paths and overwriting the two files above.

## Validate locally
Run:
```powershell
pnpm typecheck
pnpm build
pnpm test
```
These commands have not been run in the user's project environment. Treat the package as a candidate implementation until all three complete successfully and manually verify Tree expand/collapse, selecting nested Goals, adding a Child Goal, adding/editing/completing a Milestone, changing Action status, and Horizon date ordering.

## GitHub workflow
This package was built against the current `main` source fetched from `nguyenngocthanh-collab/FLOW-UP`. The connected GitHub integration denied branch creation with HTTP 403, so no commit or pull request was created. Apply it on a local feature branch, test, then push and open a PR.
