# FLOW-UP — Open Questions

**Last updated:** 2026-11-16

This document contains unresolved product, domain, and technical questions that may affect MVP implementation.

Do not treat proposed answers as approved decisions.

Resolve questions in priority order. Do not investigate deferred features unless they block the MVP.

## 1. Product and Domain Questions

### Q-001 — Project–Goal Relationship

**Status:** IN_REVIEW  
**Priority:** P0

Should Goals be created directly inside the shared Workspace, without requiring a Project?

Current proposal:
- Workspace contains Goals directly.
- Project is not required in MVP.
- Project grouping is deferred.

Related decision:

`ADR-013_PROJECT_GOAL_RELATIONSHIP.md`

### Q-002 — Goal and Milestone Hierarchy

**Status:** OPEN  
**Priority:** P0

What hierarchy is allowed?

Questions:
- Can a Goal contain another Goal?
- Can a Milestone contain child Milestones?
- Is Goal/Milestone a single hierarchical entity with a type?
- What is the maximum supported depth for MVP?

The hierarchy must support the List/Outline view without making the Tree view the source of truth.

### Q-003 — Action Ownership

**Status:** OPEN  
**Priority:** P0

How must an Action relate to the Goal hierarchy?

Questions:
- Must every Action belong to exactly one Goal or Milestone?
- Can an Action exist independently?
- Can one Action contribute to multiple Goals?
- Should an Action belong to the nearest parent Milestone or directly to the Goal?

Initial implementation should avoid many-to-many relationships unless the product requires them.

### Q-004 — Progress Calculation

**Status:** OPEN  
**Priority:** P0

How is Goal progress calculated?

Possible inputs:
- Completed Actions.
- Child Milestone progress.
- Measurement current value versus target value.

Questions:
- Is progress based on completed Actions, Measurement, or a combination?
- How are child Milestones weighted?
- What happens when a Goal has no Actions or Measurements?
- Can users manually override progress?
- How are cancelled or archived Actions treated?

Progress must be deterministic and explainable to users.

### Q-005 — Measurement History

**Status:** OPEN  
**Priority:** P1

How should measurement updates be recorded?

Questions:
- Does each update create a history record?
- Can users edit or delete an earlier record?
- Is current value calculated from the latest record or stored separately?
- How are increasing and decreasing targets represented?

The MVP must retain enough history to support basic review.

### Q-006 — Action Scheduling

**Status:** OPEN  
**Priority:** P1

What scheduling rules are required?

Questions:
- Can an Action have only one scheduled time range?
- Are start and end times optional independently?
- Can scheduled Actions overlap?
- Can an Action be rescheduled after completion?
- Does a date-only Action differ from a timed Action?

Keep scheduling simple for MVP.

## 2. Technical Questions

### Q-007 — Backend Architecture

**Status:** OPEN  
**Priority:** P0

What is the minimum backend architecture?

Options to evaluate:
- Supabase database with controlled API access.
- Supabase Edge Functions.
- A small Node.js API service connected to PostgreSQL.

A previously discussed Express API is a proposal, not an approved decision.

The chosen design must:
- Keep privileged credentials out of the browser.
- Validate all writes.
- Preserve data integrity.
- Support the shared Workspace.
- Remain simple to deploy and test.

### Q-008 — Database Access and Public Writes

**Status:** OPEN  
**Priority:** P0

How will public visitors access the shared dataset safely?

Questions:
- Which operations can visitors perform?
- Which database roles or API permissions are required?
- How will write access be restricted?
- How will input validation and rate limiting work?
- How will destructive operations be protected?

No privileged database key may be exposed to the frontend.

### Q-009 — Demo Data and Reset

**Status:** OPEN  
**Priority:** P1

How will seeded data and demo reset work?

Questions:
- Is there one fixed seed dataset?
- Can visitors reset the shared Workspace?
- Should reset require a protected administrative operation?
- How will accidental deletion be recovered?

A public reset operation must not be allowed to destroy shared data without protection.

### Q-010 — Deployment

**Status:** OPEN  
**Priority:** P1

What deployment configuration will be used?

Questions:
- Where will the frontend be hosted?
- Where will the backend run?
- How will environment variables and secrets be managed?
- How will migrations be applied?
- What backup or recovery mechanism is needed for the demo?

Existing hosting proposals remain subject to confirmation.

## 3. Deferred Questions

These questions do not block MVP and should not be investigated now:

- Authentication and personal Workspace ownership.
- Multiple Workspaces.
- Project grouping and reporting.
- Team collaboration and role-based permissions.
- AI-generated plans.
- Custom table builder.
- Arbitrary formulas.
- Advanced notifications.
- Native mobile application.
- Offline multi-device synchronization.

Revisit these only after the MVP demonstrates the core product loop.

## 4. Resolution Rules

For each question:

1. Identify the affected product behavior or implementation.
2. Present viable options and trade-offs.
3. Recommend a minimal MVP solution.
4. Obtain product owner approval when the decision affects product behavior or shared contracts.
5. Record the decision in the Decision Log and create an ADR when appropriate.
6. Update affected specifications and contracts.
7. Do not silently treat an unresolved proposal as approved.

## 5. Immediate Resolution Order

1. Q-001 — Project–Goal Relationship.
2. Q-002 — Goal and Milestone Hierarchy.
3. Q-003 — Action Ownership.
4. Q-004 — Progress Calculation.
5. Q-007 — Backend Architecture.
6. Q-008 — Database Access and Public Writes.

Other questions can be resolved when the relevant implementation task begins.