# ADR-013 — Project–Goal Relationship

**Status:** IN_REVIEW  
**Date opened:** 2026-11-16  
**Proposal owner:** Product owner

## Context

The initial product concept included Projects and Goals. However, requiring users to create a Project before creating a Goal introduces an additional step and may conflict with FLOW-UP's goal-first product direction.

The MVP now uses one shared Workspace without authentication. Goals should be created directly inside this Workspace.

The relationship between Project and Goal must be clarified before database and API contracts are finalized.

## Options Considered

### Option A — Project contains multiple Goals

- Workspace contains Projects.
- Each Project contains multiple Goals.
- Goals cannot exist outside a Project.

Advantages:
- Clear grouping for related goals.
- Project-level reporting can be introduced later.

Disadvantages:
- Adds a required concept before users can create a Goal.
- Increases MVP domain and UI complexity.

### Option B — Project is the root Goal

- Project and Goal share one conceptual hierarchy.
- A Project is treated as a special type of Goal.

Advantages:
- A single hierarchy model.
- Avoids separate Project-to-Goal relationships.

Disadvantages:
- Project semantics may differ from personal goals.
- Can complicate future reporting and project-specific behavior.

### Option C — Workspace contains Goals directly

- Workspace is the root container for MVP data.
- Goals are created directly inside Workspace.
- Project is not required in the MVP.
- Future Project grouping remains open.

Advantages:
- Supports goal-first product entry.
- Reduces setup steps and MVP complexity.
- Avoids introducing an unnecessary entity before its value is proven.

Disadvantages:
- Large numbers of Goals may require better filtering or grouping later.
- Project-level reporting is not available in MVP.
- Future Project support may require schema and contract changes.

## Proposed Decision

Option C.

- The MVP has one shared Workspace.
- Goals are created directly inside the Workspace.
- Project creation is not required before creating a Goal.
- Project is not a required parent of Goal in the MVP.
- Whether Project should exist in a later release remains open.

## Reasons

The MVP should validate the core goal execution loop before introducing additional organizational concepts.

The shared Workspace provides a single root container for all MVP data.

## Consequences / Trade-offs

- Workspace is the root data container.
- Goal hierarchy does not depend on a Project entity.
- Project-specific screens, relationships, and reporting are excluded from MVP.
- Future Project support may require domain and database changes.
- The domain model must not assume that Project is permanently removed from the product.

## Affected Modules / Contracts

- Workspace module
- Goal module
- Project module, if introduced in the future
- Database schema
- Goal creation and retrieval API
- Workspace data access rules

## Implementation Boundary

This ADR remains IN_REVIEW.

Do not treat this proposal as an approved implementation contract until the product owner explicitly approves it.

## Approval

**Status:** IN_REVIEW  
**Approver:** Pending  
**Date:** 2026-11-16