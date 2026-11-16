# Specification Tree Rules

## 1. Where detail grows

A module's detail belongs inside its own folder, not in the Master Blueprint.

Example:
`docs/04_MODULES/MOD-03_GOAL/`

- `MODULE.md`: parent module overview, scope, child index, status.
- `requirements/`: use cases and functional requirements.
- `domain/`: entities, invariants, lifecycle, business rules.
- `architecture/`: component design and internal dependency.
- `database/`: tables, fields, constraints, indexes, RLS proposals.
- `api/`: endpoint/use-case contracts.
- `ui/`: screens, states, interactions, accessibility.
- `testing/`: test plan and cases.
- `decisions/`: module-local decisions.
- `implementation/`: implementation plan, file map, build notes.

## 2. Specification levels

- L0: product blueprint.
- L1: system area.
- L2: module.
- L3: submodule/component.
- L4: implementation unit.

Every child artifact must identify its parent ID. Every parent `MODULE.md` must index its children.

## 3. Stable IDs

Examples:
- `MOD-03`: Goal Management module.
- `MOD-03-DOM-001`: Goal domain model.
- `MOD-03-REQ-001`: Goal requirements.
- `MOD-03-API-001`: Goal API contract.
- `MOD-03-UI-001`: Goal List view.
- `MOD-03-TEST-001`: Goal test plan.
- `TASK-2026-001`: implementation task.

Do not reuse IDs. If an artifact is retired, mark it deprecated and retain its ID/history.

## 4. Child artifact metadata

Every specification begins with:
- ID
- Title
- Parent ID
- Version
- Status
- Owner
- Last updated
- Depends on
- Used by
- Related contracts
- Related requirements

## 5. Parent-child consistency

When a child spec is created or changed:
1. update the parent module's child index;
2. update dependency registry if cross-module dependencies change;
3. update contract registry if interfaces change;
4. update traceability matrix if requirements/tests change;
5. update current status;
6. create a change-impact record when shared behavior changes.

## 6. Do not over-decompose

Create a child specification when it has at least one of:
- independent responsibility;
- distinct contract;
- separate implementation owner/session;
- substantial business rules;
- meaningful independent test boundary.

Do not create a separate spec for every tiny function or CSS class. The objective is independent work without fragmenting the system into unmanageable pieces.
