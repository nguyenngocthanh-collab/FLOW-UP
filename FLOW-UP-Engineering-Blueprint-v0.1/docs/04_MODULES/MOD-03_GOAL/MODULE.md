# MOD-03 — Goal Management

**Module ID:** MOD-03  
**Parent:** FLOW-UP / Application  
**Version:** 0.1  
**Status:** PROPOSED  
**Owner:** TBD  
**Updated:** 2026-11-16

## Purpose
Own the creation, retrieval, update, archival/deletion rules, and parent-child organization of user goals. This module does not own visual rendering or calendar scheduling.

## In scope (proposed)
- Goal identity and basic attributes.
- Parent-child hierarchy.
- Goal lifecycle.
- Project association.
- Queries needed by List and optional Tree views.

## Out of scope
- Action scheduling.
- Measurement history.
- Progress calculation.
- Tree visualization implementation.
- AI-generated goal breakdown.

## Child specification index

| Child ID | Artifact | Level | Version | Status | Path |
|---|---|---:|---|---|---|
| MOD-03-REQ-001 | Goal requirements | L3 | 0.1 | DRAFT | requirements/GOAL_REQUIREMENTS.md |
| MOD-03-DOM-001 | Goal domain model | L3 | 0.1 | DRAFT | domain/GOAL_DOMAIN_MODEL.md |
| MOD-03-ARCH-001 | Goal component architecture | L3 | 0.1 | DRAFT | architecture/GOAL_COMPONENT_ARCHITECTURE.md |
| MOD-03-DB-001 | Goal persistence proposal | L3 | 0.1 | DRAFT | database/GOAL_PERSISTENCE.md |
| MOD-03-API-001 | Goal interface proposal | L3 | 0.1 | DRAFT | api/GOAL_INTERFACE.md |
| MOD-03-UI-001 | Goal List interaction | L3 | 0.1 | DRAFT | ui/GOAL_LIST_INTERACTION.md |
| MOD-03-TEST-001 | Goal test plan | L3 | 0.1 | DRAFT | testing/GOAL_TEST_PLAN.md |

## Direct dependencies
- MOD-02 Workspace & Project: project ownership/reference.
- MOD-01 Identity & Access: authenticated user context.

## Consumers
- MOD-04 Action Management
- MOD-05 Measurement
- MOD-08 Progress Engine
- MOD-09 Review & Dashboard
- MOD-10 List/Tree Views

## Shared contracts
- C-002 Project Reference
- C-003 Goal Summary (proposed)

## Open questions
- Can one Goal have multiple parent relationships? Proposed answer: no for hierarchy; cross-links are separate relations.
- Is Goal distinct from Milestone? Open.
- Can a Goal exist without a Project? Open.
- What is the exact deletion/archive behavior? Open.

## Next tasks
1. Approve domain terminology.
2. Deep-dive requirements and lifecycle.
3. Resolve Project/Goal relationship.
4. Approve Goal contract before frontend/backend implementation.
