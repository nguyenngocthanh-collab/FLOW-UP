# Quality Gates

## Before specification approval
- Purpose and scope are clear.
- Owned data is explicit.
- Dependencies and contracts are listed.
- Open questions are visible.
- Acceptance criteria are testable.

## Before implementation
- Specification is approved.
- Required contracts are approved.
- No unresolved blocking dependency.
- Branch/task scope is assigned.

## Before merge
- TypeScript typecheck passes.
- Lint/format checks pass.
- Relevant unit tests pass.
- Integration tests pass where applicable.
- RLS tests prove another user's records cannot be accessed.
- No secrets or personal data committed.
- Documentation/registries updated.

## Before release/demo
- E2E critical path passes.
- Seed data is available.
- Error/empty/loading states are acceptable.
- Demo has been rehearsed.
- Known limitations are documented.
