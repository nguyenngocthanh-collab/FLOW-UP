# FLOW-UP — Current Status

**Last updated:** 2026-11-16  
**Project phase:** MVP Scope Alignment → Production Preparation  
**Blueprint version:** v0.2  
**Implementation status:** Not yet started / awaiting repository and implementation kickoff

## 1. Current Product Direction

FLOW-UP is a Goal Execution & Progress Management Platform.

Its core loop is:

`Outcome → Breakdown → Measure → Action → Schedule → Execute → Review → Adjust`

The MVP focuses on demonstrating this loop end-to-end.

The product is not intended to become a general-purpose project management clone.

## 2. Current MVP Model

### Access Model

- One shared Workspace.
- No authentication or registration.
- No user management.
- All visitors access the same dataset.
- Data persists across refreshes, browser sessions, and visitors.
- The application must clearly communicate that the Workspace is shared.

Reference decision:

`ADR-014_SHARED_WORKSPACE_WITHOUT_AUTH.md`

### Goal and Project Model

- Goals are intended to be created directly inside Workspace.
- Project is not required before creating a Goal.
- Project grouping is excluded from the MVP proposal.

Reference decision:

`ADR-013_PROJECT_GOAL_RELATIONSHIP.md`

**Note:** ADR-013 remains IN_REVIEW. Do not treat its proposed domain relationship as an approved implementation contract yet.

## 3. MVP Scope

### Must Have

- Shared Workspace.
- Goal creation.
- Goal/Milestone hierarchy.
- List/Outline view.
- Basic measurement and measurement history.
- Action creation and status.
- Action scheduling.
- Simple calendar.
- Action completion.
- Transparent progress calculation.
- Basic plan-versus-actual review.
- Persistent shared data.
- Seeded demo data.

### Deferred

- Authentication and user management.
- Multiple personal Workspaces.
- Project management.
- AI-generated plans.
- Paid AI dependencies.
- Team collaboration and permissions.
- Custom table builder.
- Arbitrary user-authored formulas.
- Advanced notifications.
- Native mobile application.
- Complex widget builder.

The authoritative scope is:

`docs/01_PRODUCT/MVP_SCOPE.md`

## 4. Decisions

| ID | Subject | Status |
|---|---|---|
| ADR-001 to ADR-012 | Existing product and technical proposals | PROPOSED |
| ADR-013 | Project–Goal relationship | IN_REVIEW |
| ADR-014 | Shared Workspace without Authentication | APPROVED |

Only explicitly approved decisions may be treated as binding implementation requirements.

## 5. Production Preparation

### Confirmed Product Direction

- Shared Web Demo.
- One shared Workspace.
- No Authentication.
- No User Management.
- Goal-first entry.
- Focus on the complete goal execution loop.
- No dependency on live AI generation.

### Technical Direction

Existing technical proposals remain in the Decision Log.

The following are not yet fully approved:

- Backend framework and API architecture.
- Frontend/backend integration contract.
- Database schema.
- Database access policies.
- Hosting and deployment configuration.
- Progress calculation rules.

Do not assume that a previously discussed implementation suggestion is an approved technical decision.

## 6. Immediate Priorities

1. Complete the scope and decision-document updates.
2. Resolve the remaining Project–Goal decision.
3. Define the minimal Domain Model.
4. Define GoalNode, Action, Schedule, and Measurement contracts.
5. Define transparent Progress calculation rules.
6. Confirm the minimum technical architecture.
7. Split frontend and backend implementation tasks.
8. Build and test the first end-to-end vertical slice.

## 7. First Vertical Slice

The first working flow should demonstrate:

1. Open the shared Workspace.
2. Create a Goal.
3. Add a child Milestone.
4. Create an Action.
5. Schedule the Action.
6. Record a measurement update or complete the Action.
7. Persist the change.
8. Display the updated progress.
9. Verify that another browser sees the same data.

## 8. Team Working Model

### Product Owner

Responsible for:
- Product direction.
- Scope and priority.
- Domain behavior approval.
- Acceptance criteria.
- UX quality.
- Final integration review.

### Implementation Owner

Responsible for:
- Technical implementation.
- Backend and database work.
- API implementation.
- Technical testing.
- Technical proposals and implementation reports.

Shared responsibilities:
- Integration.
- End-to-end testing.
- Defect resolution.
- Demo preparation.

## 9. Operating Rule

The Blueprint must support production, not delay it.

- Do not expand documents without a concrete implementation need.
- Do not specify deferred features.
- Do not silently change approved contracts.
- Record important decisions and their impact.
- Keep implementation tasks small and testable.
- Update documentation when actual decisions or implementation contracts change.

The next milestone is a working end-to-end vertical slice, not completion of every Blueprint document.