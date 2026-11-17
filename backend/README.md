# FLOW-UP C02 — Workspace & Project Rules

This package contains a framework/database-independent C02 domain starter implementation and unit tests.

## Install into the existing repository

Copy the contents of `backend/src/domain/workspace-project/` into:

`W:\Projects\FLOW-UP\backend\src\domain\workspace-project\`

Copy the contents of `backend/tests/domain/workspace-project/` into:

`W:\Projects\FLOW-UP\backend\tests\domain\workspace-project\`

Do not replace the existing C01 folder.

## Run tests

From `W:\Projects\FLOW-UP\backend`:

```powershell
npx vitest run tests/domain/workspace-project
```

Then run the complete backend suite:

```powershell
npx vitest run
```

## Important implementation boundaries

- C02 does not create or persist Workspaces or Projects; B02 owns those application operations.
- Workspace uniqueness is expressed as a domain validation contract. It must also be enforced atomically by persistence when D01 is designed.
- Project ownership is resolved through `Project.workspaceId -> Workspace.ownerUserId`.
- Goal scope validation checks Workspace/Project relationships only; it does not own or mutate C03 Goal entities.
- Goal scope movement validation is a preflight contract only. It does not perform movement, hierarchy validation, dependent-resource validation, or transactions.
- No lifecycle status, archive, restore, delete, cascade, ownership transfer, or project completion policy is invented.
- Project name validation currently rejects only empty/whitespace names. Maximum length and character rules remain OPEN in the specification.
- IDs are plain string aliases pending D03 shared type consolidation.

## C01 integration note

The implementation consumes the authoritative Workspace owner relationship through small reader interfaces. This avoids coupling C02 to an unverified C01 function signature. During integration, the B02/application adapter must source and validate Workspace ownership using the existing C01 ownership engine. Do not duplicate or replace C01 logic.

## Status

Starter implementation for the approved C02 core rules. It is not a database schema, application module, or completed C02 integration.
