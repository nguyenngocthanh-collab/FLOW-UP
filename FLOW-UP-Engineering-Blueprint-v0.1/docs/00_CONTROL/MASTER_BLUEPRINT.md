# FLOW-UP Master Blueprint

**ID:** FEB-000  
**Version:** 0.1  
**Status:** PROPOSED  
**Owner:** Product owner / technical lead  
**Last reviewed:** 2026-11-16

## 1. Product statement

FLOW-UP is a goal execution and progress management platform. It helps a person turn a desired outcome into measurable milestones and executable actions, schedule those actions, record actual progress, and review whether the plan is working.

The product is not defined by one visualization (Tree, List, Calendar, or Table). The underlying domain data is authoritative; visualizations are replaceable views over that data.

## 2. Product loop

`Outcome → Breakdown → Measure → Action → Schedule → Execute → Review → Adjust`

The MVP must demonstrate this loop end-to-end with persistent data.

## 3. Core product principles

1. Outcome-first: start with a result the user wants, not an empty task list.
2. Measurable: a goal may have a target, current value, unit, and update history.
3. Executable: plans must produce concrete actions.
4. Time-aware: actions may be scheduled in a calendar.
5. Feedback-oriented: actual progress is compared with the plan.
6. User-controlled: the system may show gaps and options; it must not silently rewrite goals or schedules.
7. View-independent: Tree/List/Calendar are views, not sources of truth.
8. Evidence-led: usability and product assumptions are hypotheses until tested.

## 4. Scope boundary

### MVP candidate
- Personal workspace / project
- Goal and milestone hierarchy
- Action items
- List view as primary view
- Optional simple tree visualization
- Basic measurement (current, target, unit)
- Measurement update history
- Schedule an action
- Calendar view
- Completion and progress calculation
- Simple review showing planned versus actual
- Seeded demo scenario and live user flow

### Explicitly deferred
- Team collaboration and permissions beyond personal ownership
- Custom data-table builder
- General-purpose calculation/algorithm library
- Arbitrary user-authored formulas
- AI-generated plans as a required workflow
- Autonomous AI recommendations or rescheduling
- Advanced notifications
- Native mobile applications
- Complex widgets / plugin ecosystem
- Offline-first conflict resolution

## 5. Source-of-truth hierarchy

1. Approved product decisions: `docs/00_CONTROL/DECISION_LOG.md`
2. Approved requirements: `docs/01_PRODUCT/`
3. Domain model and business rules: `docs/02_DOMAIN/`
4. System and module architecture: `docs/03_ARCHITECTURE/` and `docs/04_MODULES/`
5. API and data contracts: `docs/05_CONTRACTS/`
6. Database migrations: `supabase/migrations/` (once created)
7. Tests and test results: `docs/08_QUALITY/` and repository test output
8. Current delivery status: `docs/00_CONTROL/CURRENT_STATUS.md`

Chat history is not a source of truth.

## 6. Decomposition levels

- L0 Product: FLOW-UP
- L1 System areas: Product, Web Client, Backend Platform, Database, Delivery/Operations
- L2 Domains/modules: Workspace, Goal, Measurement, Action, Schedule, Progress, Review, Identity/Access
- L3 Components: UI, application service, repository/data access, validation, tests
- L4 implementation units: functions, files, SQL objects, component tests

A decomposition tree records ownership and containment. A separate dependency graph records cross-module relationships. Do not use the tree as a substitute for the dependency graph.

## 7. Required registries

- Module Registry: `docs/04_MODULES/MODULE_REGISTRY.md`
- Dependency Registry: `docs/03_ARCHITECTURE/DEPENDENCY_REGISTRY.md`
- Contract Registry: `docs/05_CONTRACTS/CONTRACT_REGISTRY.md`
- Traceability Matrix: `docs/08_QUALITY/TRACEABILITY_MATRIX.md`
- Decision Log: `docs/00_CONTROL/DECISION_LOG.md`
- Risk Register: `docs/00_CONTROL/RISK_REGISTER.md`

## 8. Module independence rule

A module is independently assignable only when it has:
- approved purpose and scope
- explicit owned data
- input/output contracts
- business rules and invariants
- dependency list
- failure/error behavior
- acceptance criteria
- test plan
- integration points
- known limitations

If any of these are unknown, the AI session must report the gap rather than invent an answer.

## 9. Change-impact rule

Any change to an entity, field, status, event, API, permission, or calculation must:
1. identify the changed contract;
2. query the Dependency Registry;
3. list affected modules and tests;
4. propose migration/backward compatibility;
5. update relevant specifications;
6. obtain approval before implementation if a shared contract changes.

## 10. Approval status vocabulary

`PROPOSED → IN_REVIEW → APPROVED → IMPLEMENTED → VERIFIED → RELEASED`

A status may be `REJECTED` or `DEPRECATED`. Do not skip approval for shared contracts.
