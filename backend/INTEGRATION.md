# FLOW-UP — C03 Integration Notes

**Module:** C03 — Goal & Hierarchy Rules  
**Layer:** Domain (`C`)  
**Document type:** Implementation and integration notes  
**Version:** 1.0  
**Status:** Core validation starter; integration adapters and lifecycle remain incomplete.

## 1. Responsibility

C03 is the authoritative owner of Goal identity semantics, Goal attributes, Parent–Child hierarchy invariants, Goal tree traversal, and Goal-side scope/movement validation.

C03 does not own Workspace/Project management, Milestones, Actions, Measurements, Schedules, Progress, Reviews, authentication, HTTP, UI, or persistence.

## 2. Direct integration boundaries

| Related module | Provider / consumer relationship | C03 relies on | C03 must not do |
|---|---|---|---|
| C01 | Provider to C03 | Ownership validation for a Goal and its relationships | Reimplement identity/ownership resolution |
| C02 | Provider to C03 | Workspace/Project scope validation | Reimplement Workspace or Project rules |
| B03 | Application consumer of C03 | Goal operations and domain validation rules | Move application workflows into Domain |
| C04 | Related domain | Goal ID and scope context | Manage Milestones |
| C05 | Related domain | Goal reference and hierarchy context | Manage Actions or execution |
| C06 | Related domain | Goal reference and scope context | Manage Measurements |
| C07 | Related domain | Indirect Goal context through Action | Manage Schedules |
| C08 | Related domain | Goal hierarchy and lifecycle context | Calculate authoritative Progress |
| C09 | Related domain | Goal identity and historical context | Manage Reviews |
| D01 | Persistence provider | Future Goal repository/transaction implementation | Add schema/migrations in this package |
| D03/D04/D06 | Shared conventions | Shared identifiers, validation, error mapping when approved | Invent conflicting global conventions |

## 3. Implemented contracts in this package

- Goal attributes: required non-empty ID/title; optional description; calendar-date validation for `targetDate`.
- Goal scope: delegates Workspace/Project validity to an injected `GoalScopeValidator` port.
- Hierarchy: at most one parent is represented by `parentGoalId`; rejects self-parenting, cycles, missing parents, cross-Workspace relationships, and unresolved cross-Project scope policy.
- Retrieval: ancestor, descendant, and nested tree construction with cycle protection.
- Scope movement: preflight validation only; checks Goal existence, ownership port, destination scope port, optional hierarchy validation, and dependency-conflict port.

## 4. Integration adapter expectations

The current package uses small ports to keep C03 independent of concrete database and application implementations:

- `GoalReader` must be backed by authoritative Goal data.
- `GoalScopeValidator` must delegate to C02's approved Workspace/Project scope contract.
- `GoalOwnershipValidator` must delegate to C01 ownership validation using a canonical Goal resource reference.
- `GoalMovementDependencyReader` must report known blocking dependent-resource conflicts from the relevant modules.

These ports are seams, not replacements for the authoritative C01/C02 contracts. Adapter implementation belongs in the appropriate integration/application layer once repository conventions and D03 contracts are confirmed.

## 5. Explicit OPEN decisions preserved

This package does not implement or decide:

- Goal lifecycle enum/transitions (`GOAL-001`).
- Goal deletion, soft-delete, or retention (`GOAL-008`, `GOAL-010`, `GOAL-016`).
- Parent/descendant archival or deletion propagation.
- Maximum hierarchy depth (`GOAL-005`).
- Cross-Project Parent–Child compatibility (`GOAL-006`).
- Parent/descendant movement strategy (`GOAL-003`, `GOAL-009`).
- Automatic parent completion or Progress aggregation (`GOAL-011`, `GOAL-012`).
- Cross-module movement transaction strategy (`GOAL-017`).

When Parent and Child have different Project scopes, this starter rejects the relationship as `GOAL_SCOPE_POLICY_UNRESOLVED` rather than assuming cross-Project hierarchy is allowed.

## 6. Required next integrations

1. Confirm D03 canonical branded identifiers and replace local aliases without creating duplicate public types.
2. Bind `GoalScopeValidator` to the approved C02 API.
3. Bind `GoalOwnershipValidator` to C01's ownership graph and canonical resource type for Goal.
4. Define B03 repository/application adapters and application workflows.
5. Add D01 persistence constraints and transaction support only after D01 design is approved.
6. Add contract tests against actual C01/C02 adapters and integration tests for B03 + C03.
7. Coordinate C04–C09 dependency checks before enabling Goal movement or lifecycle operations.

## 7. Verification status

The unit tests in `tests/domain/goal-hierarchy` verify the isolated C03 starter behavior. They do not prove real C01/C02 integration, persistence correctness, HTTP behavior, security enforcement, or end-to-end workflows.
