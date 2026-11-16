# FLOW-UP MASTER BLUEPRINT

**ID:** FEB-000  
**Version:** 0.4  
**Status:** APPROVED — PRODUCT BASELINE & MVP SCOPE; DETAILED DESIGN FRAMEWORK ESTABLISHED  
**Owner:** Product Owner / Technical Lead  
**Last reviewed:** 2026-11-16  
**Purpose:** Single source of truth for FLOW-UP product architecture, MVP scope, detailed technical specifications, development assignments, and implementation sessions.

---

## TABLE OF CONTENTS

- [0. How to Use This Blueprint](#0-how-to-use-this-blueprint)
- [1. L0 — Product Architecture](#1-l0--product-architecture)
- [2. Product Model and Core Domain](#2-product-model-and-core-domain)
- [3. L1 — High-Level System Architecture](#3-l1--high-level-system-architecture)
- [4. L2 — Module Architecture](#4-l2--module-architecture)
- [5. MVP Scope and Priority](#5-mvp-scope-and-priority)
- [6. Core User Journeys](#6-core-user-journeys)
- [7. High-Level Dependency Map](#7-high-level-dependency-map)
- [8. MVP Acceptance Criteria](#8-mvp-acceptance-criteria)
- [9. Function Specification Standard](#9-function-specification-standard)
- [10. Development Board](#10-development-board)
- [11. Development Session Management](#11-development-session-management)
- [12. Decision Register](#12-decision-register)
- [13. MVP Build Order](#13-mvp-build-order)
- [14. Future Scope Register](#14-future-scope-register)
- [15. Open Architecture Questions](#15-open-architecture-questions)
- [16. Change Log](#16-change-log)
- [17. Current Architecture and Development State](#17-current-architecture-and-development-state)
- [18. UI/UX Foundation Principles](#18-uiux-foundation-principles)
- [19. Ready-to-Code Part Specification Contract](#19-ready-to-code-part-specification-contract)
- [20. New-Chat Handoff Protocol](#20-new-chat-handoff-protocol)
- [21. Friend Design Integration Notes](#21-friend-design-integration-notes)

---

# 0. HOW TO USE THIS BLUEPRINT

This document is the single source of truth for FLOW-UP architecture and development management.

All architecture decisions, module specifications, implementation tasks, development sessions, verification results, and approved changes must be maintained in this file. Do not create parallel architecture or project-management Markdown files unless the Product Owner explicitly approves an exception.

## 0.1 Architecture levels

- **L0 — Product:** Product vision, user value, core loop, MVP boundaries.
- **L1 — System Areas:** Major technical areas and their responsibilities.
- **L2 — Modules:** Functional modules, ownership, dependencies, and boundaries.
- **L3 — Components and Functions:** UI components, use cases, services, and operations.
- **L4 — Implementation Specifications:** Data contracts, algorithms, APIs, validation, errors, tests, and implementation details.
- **L5 — Development Tasks and Sessions:** Assignments, implementation progress, test results, and handoffs.

The architecture tree defines what must be built and how parts are organized. Detailed implementation specifications are completed progressively, before the affected work is implemented.

## 0.2 Status rules

Architecture and development status must not be confused.

**Architecture status**
- `NOT_STARTED`: not designed yet.
- `PROPOSED`: initial design exists but is not approved.
- `IN_REVIEW`: awaiting review.
- `APPROVED`: design is approved.
- `IMPLEMENTED`: implementation exists.
- `VERIFIED`: implementation passed its acceptance criteria.
- `DEPRECATED`: no longer current; retained for history.

**Development status**
- `AVAILABLE`: design and dependencies are ready.
- `CLAIMED`: assigned to a developer.
- `IN_PROGRESS`: implementation has started.
- `BLOCKED`: waiting for a decision or dependency.
- `REVIEW`: awaiting code review.
- `IN_TEST`: undergoing verification.
- `DONE`: acceptance criteria passed and work integrated.

A section being `APPROVED` does not mean it has been implemented.

## 0.3 Development rules

1. Do not implement a function before its required specification is approved.
2. Do not invent missing business rules, data contracts, or shared interfaces.
3. Every module must have an explicit responsibility and boundary.
4. Every cross-module interaction must follow an agreed contract.
5. A change affecting another module must have its impact assessed and recorded here.
6. Every completed function must pass its acceptance criteria and relevant tests.
7. Keep the MVP small. Future Scope must not become a hidden implementation requirement.
8. Update this file when decisions, specifications, task status, session results, or architecture change.
9. Use the smallest sufficient design. Do not over-engineer future capabilities before the MVP needs them.
10. When a decision is not yet made, mark it `OPEN`; do not silently treat a recommendation as approved.

## 0.4 Change management

For every material architecture change, record:
- What is changing and why.
- Which modules, entities, APIs, screens, and tests are affected.
- Whether existing data requires migration.
- Whether the change alters MVP scope.
- The decision status and approval.

---

# 1. L0 — PRODUCT ARCHITECTURE

## 1.1 Product

**FLOW-UP** is a personal goal execution and progress management platform that helps users turn desired outcomes into clear goals, practical plans, executable actions, and measurable progress.

FLOW-UP is not only a task manager. Its central value is helping users who may not know how to reach a goal understand what to do, organize the work, execute it, and learn from their results.

## 1.2 Product vision

Help a person move from:

> "I want to achieve something, but I do not know where to start."

to:

> "I understand what I need to do, I have a realistic plan, and I can see whether I am making progress."

## 1.3 Core product loop

`Define Goal → Understand → Break Down → Plan → Execute → Measure → Review → Adjust`

The loop must be supported by connected product capabilities rather than isolated features.

## 1.4 Core product principles

1. **Outcome-first:** Start from the result the user wants to achieve.
2. **Clarity before execution:** Help the user understand an unclear or broad goal.
3. **Action-oriented:** Turn goals into concrete work that can be performed.
4. **AI-assisted:** Use AI to help users reason about goals and construct plans.
5. **User-controlled:** AI proposes; the user reviews and decides.
6. **Measurable:** Support meaningful measurement of results and progress.
7. **Time-aware:** Allow optional deadlines and time-based planning.
8. **Feedback-oriented:** Compare intended plans with actual execution.
9. **Evidence-led:** Progress and review should use recorded system data where possible.
10. **Progressive complexity:** Present a useful overview first and reveal deeper structure when needed.
11. **Single source of truth:** Each business fact has one authoritative owner. Screens, calendars, summaries, and widgets display or derive data from that owner rather than maintaining competing copies.
12. **Consistent information routing:** A change made through one valid interface must be reflected in every relevant view through shared application/domain data and query invalidation or refresh. Do not build point-to-point synchronization between screens.
13. **Overview before detail:** The default experience emphasizes the desired outcome, current state, next meaningful checkpoint, and next executable action. Deeper hierarchy and supporting information are revealed on demand.
14. **Composable interface foundation:** UI must be built from reusable layout primitives, design tokens, and predictable interaction patterns so visual quality can improve without rewriting domain logic.


## 1.5 MVP objective

Deliver a publicly accessible web application with persistent, user-specific data and one complete personal workflow:

1. Register or sign in.
2. Access a personal workspace.
3. Create a standalone Goal or a Project.
4. Create Goals inside a Project when appropriate.
5. Use AI to clarify a Goal and propose a structured breakdown.
6. Review and approve or edit the AI proposal.
7. Organize Goals, Milestones, Actions, and Measurements.
8. Create a plan manually or request a basic AI-generated Daily Plan.
9. Schedule and execute Actions.
10. Record measurements and actual results.
11. View progress and review planned versus actual execution.

## 1.6 MVP completion condition

A user can complete the core journey in the deployed web application without manually editing the database or relying on mock data.

- User data persists after refresh and subsequent login.
- Each user can access only their own authorized data.
- AI-generated content is validated and does not become official data until the user approves it.
- The user can create and execute a plan without AI.
- The core workflow remains usable if the AI provider is temporarily unavailable.

---

# 2. PRODUCT MODEL AND CORE DOMAIN

## 2.1 Target user and release direction

**MVP:** Single-person use. Each account manages its own personal workspace and data.

**Future direction:** Team workspaces and collaboration may be added later. Team membership, roles, permissions, and collaboration workflows are not MVP requirements.

## 2.2 Workspace model

Each User has one Personal Workspace in the MVP.

A Personal Workspace can contain:
- Independent Goals.
- Multiple Projects.

The Workspace is the user's personal container and ownership boundary.

## 2.3 Project model

A Project is an optional organizational container for a collection of related Goals.

A Project is useful when a user wants to manage a larger initiative, such as developing an application.

A Project is not required for every Goal.

## 2.4 Goal model

A Goal represents an outcome the user wants to achieve.

A Goal can:
- Exist independently in the Personal Workspace.
- Belong to a Project.
- Contain child Goals.
- Have one or more Milestones.
- Have Measurement definitions and records.
- Have an optional target date or expected completion period.
- Be moved between the independent Workspace area and a Project.

Moving a Goal must preserve its identity, descendants, associated Milestones, Actions, Measurements, history, and other valid relationships. Moving must not duplicate the Goal or silently discard related data.

The exact movement rules and transactional behavior must be specified in the Goal Management design.

## 2.5 Goal hierarchy

Goal decomposition is flexible and is not restricted to a fixed number of levels.

The system must support:
- A clear top-level Goal.
- Child Goals where further decomposition is useful.
- A compact overview that communicates the overall outcome and current state.
- Expansion into deeper levels when the user wants detail.

The UI must not force users to inspect every node to understand what matters next.

## 2.6 Milestone model

A Milestone represents an important checkpoint in the progress of a Goal.

A Milestone is conceptually different from a Goal:
- Goal describes an outcome to achieve.
- Milestone describes a checkpoint on the way to that outcome.
- Action describes work that a user performs.

A Goal may have zero or more Milestones. A Milestone is associated with its owning Goal.

## 2.7 Action model

An Action is a concrete unit of work that can be planned and executed.

Actions are execution-level items and are not further decomposed into Goal nodes in the MVP.

An Action must be associated with a relevant Goal or Milestone through explicitly defined relationship rules. Exact cardinality is an open technical decision.

## 2.8 Measurement model

A Measurement describes how an aspect of a Goal's result is evaluated.

Example: an IELTS Goal may track Overall, Listening, Reading, Writing, and Speaking scores.

Measurement definitions and recorded values must be distinguishable. The exact cardinality, supported value types, target rules, and history model remain open for detailed Domain Model design.

## 2.9 Schedule and Daily Plan model

A Schedule represents planned time for an Action.

A Daily Plan is the user's plan for a particular day, assembled from scheduled Actions.

Manual Planning and AI-assisted Planning must use the same underlying Planning and Schedule model.

Exact cardinality, recurrence, time-zone handling, and conflict rules remain open for detailed design.

## 2.10 Review model

Review compares planned work with actual execution and recorded results.

The MVP supports a basic review workflow. Advanced coaching, automated diagnosis, and autonomous plan adjustment are deferred.

---

# 3. L1 — HIGH-LEVEL SYSTEM ARCHITECTURE

FLOW-UP is divided into six system areas.

```text
FLOW-UP
│
├── A. WEB CLIENT
│   └── User interface and interaction
│
├── B. APPLICATION / BACKEND
│   └── Use cases, business workflows, and trusted operations
│
├── C. DOMAIN
│   └── Business entities, rules, and invariants
│
├── D. DATA & INFRASTRUCTURE
│   └── Persistence, authentication, AI provider, and shared mechanisms
│
├── E. AI CAPABILITY
│   └── Goal understanding, proposal generation, and planning assistance
│
└── F. DELIVERY & QUALITY
    └── Build, testing, integration, deployment, and operation
```

## A. WEB CLIENT

Responsible for displaying product information and receiving user interactions.

The client presents the Goal Overview, Goal Tree, Project views, Action workflows, Planning, Calendar, Progress, Review, and AI-assisted experiences.

The client must not be the authority for security-sensitive checks or business invariants.

## B. APPLICATION / BACKEND

Responsible for application use cases and trusted business operations.

It coordinates domain operations, persistence, authorization checks, AI proposal workflows, and cross-module operations.

## C. DOMAIN

Responsible for the meaning and rules of FLOW-UP data.

It defines entities, relationships, invariants, status transitions, and calculation rules independently from UI presentation.

## D. DATA & INFRASTRUCTURE

Responsible for persistent storage, authentication integration, shared contracts, validation mechanisms, error handling, logging, and external service integration.

The selected database and providers will be confirmed in the Technology Decision section before implementation.

## E. AI CAPABILITY

Responsible for AI-assisted goal clarification, feasibility feedback, Goal Tree proposals, and basic Daily Plan proposals.

AI output is untrusted proposal data until validated and approved by the user.

AI must not bypass application/domain rules or directly write unapproved business data.

## F. DELIVERY & QUALITY

Responsible for repository workflow, automated checks, tests, deployment, environment configuration, and production verification.

---

# 4. L2 — MODULE ARCHITECTURE

This section defines the initial module map. Detailed responsibilities, contracts, data ownership, and function specifications are completed in later design work.

## A. WEB CLIENT

```text
WEB CLIENT
│
├── A01. Application Shell & Authentication UI
├── A02. Workspace & Project Interface
├── A03. Goal Overview & Goal Tree Interface
├── A04. Milestone Interface
├── A05. Action Interface
├── A06. Measurement Interface
├── A07. Planning Interface
├── A08. Calendar Interface
├── A09. Progress & Review Interface
├── A10. AI Assistant Interface
└── A11. Shared UI Components
```

### A01. Application Shell & Authentication UI

Initial responsibilities:
- Application initialization.
- Sign up, sign in, and sign out screens.
- Main layout and navigation.
- Route management.
- Session-aware UI.
- Global loading, empty, and error states.

### A02. Workspace & Project Interface

Initial responsibilities:
- Display the user's Personal Workspace.
- Display independent Goals.
- List and open Projects.
- Create, edit, archive, and open Projects.
- Display Goals belonging to a Project.

### A03. Goal Overview & Goal Tree Interface

Initial responsibilities:
- Display Goal overview and status.
- Display compact progress summary.
- Display Goal hierarchy.
- Create and edit Goals.
- Add child Goals.
- Move a Goal between independent Workspace scope and a Project.
- Expand and collapse Goal Tree branches.
- Display next relevant Milestone or Action.
- Avoid overwhelming the user with excessive hierarchy by default.

Views:
- Goal Overview.
- List / Outline.
- Goal Tree.

### A04. Milestone Interface

Initial responsibilities:
- Create and edit Milestones.
- Display Milestones under a Goal.
- Update Milestone status.
- Display associated Actions where supported by the approved relationship model.

### A05. Action Interface

Initial responsibilities:
- Display Actions.
- Create, edit, and archive/delete Actions according to approved rules.
- Associate Action with Goal or Milestone.
- Update Action status.
- Mark Action complete.
- Record actual execution information where required.

### A06. Measurement Interface

Initial responsibilities:
- Define Measurement label and unit.
- Define target value where applicable.
- Display current value.
- Record measurement updates.
- Display measurement history.

### A07. Planning Interface

Initial responsibilities:
- Display a Daily Plan.
- Add or remove Actions from a plan.
- Set planned date and duration.
- Support manual planning.
- Display AI-proposed Daily Plan.
- Allow users to edit, accept, or reject a proposal.

### A08. Calendar Interface

Initial responsibilities:
- Display scheduled Actions.
- Provide a date-oriented entry point to inspect and manage planned work.
- Allow supported calendar interactions to open or edit the underlying Action/Schedule through the normal application workflow.
- Reflect updates made from Goal, Action, or Planning views without maintaining a separate copy of business data.
- Provide a basic calendar view suitable for the MVP.
- Open a scheduled Action.
- Create, edit, or remove schedule information.

Month / Week / Day view selection is subject to MVP feasibility and must not delay the core Planning workflow.

### A09. Progress & Review Interface

Initial responsibilities:
- Display Goal progress.
- Display Action completion.
- Display Measurement values and history.
- Compare planned and actual execution.
- Record optional review notes.
- Display a concise review summary.

### A10. AI Assistant Interface

Initial responsibilities:
- Capture a user's initial Goal description.
- Display clarification questions.
- Display AI reasoning summary, assumptions, and caveats.
- Display proposed Goal Tree.
- Support accepting, rejecting, or editing proposal items.
- Display AI Daily Plan proposals.
- Clearly distinguish proposal data from saved data.

### A11. Shared UI Components

Initial responsibilities:
- Form controls.
- Dialogs and popups.
- Buttons.
- Navigation elements.
- Status indicators.
- Loading states.
- Empty states.
- Error messages.
- Reusable layout components.

## B. APPLICATION / BACKEND

```text
APPLICATION / BACKEND
│
├── B01. Authentication & User Context
├── B02. Workspace & Project Management
├── B03. Goal Management
├── B04. Milestone Management
├── B05. Action Management
├── B06. Measurement Management
├── B07. Planning & Scheduling
├── B08. Progress Engine
├── B09. Review Management
└── B10. AI Orchestration
```

### B01. Authentication & User Context

Initial responsibilities:
- Integrate the selected authentication provider.
- Resolve the authenticated user context.
- Enforce authenticated access to personal data.
- Handle session and authentication errors.

### B02. Workspace & Project Management

Initial responsibilities:
- Create or retrieve the user's Personal Workspace.
- Create and update Projects.
- Retrieve Project overview.
- Validate Project ownership and relationships.

### B03. Goal Management

Initial responsibilities:
- Create, retrieve, update, archive, and delete Goals under approved rules.
- Retrieve Goal hierarchy.
- Add child Goals.
- Validate parent-child relationships.
- Prevent cycles and invalid hierarchy operations.
- Move Goals between independent Workspace scope and Project scope.
- Preserve related data during a move.

### B04. Milestone Management

Initial responsibilities:
- Create, retrieve, update, and complete Milestones.
- Validate owning Goal.
- Maintain valid relationships with Actions.

### B05. Action Management

Initial responsibilities:
- Create, retrieve, update, complete, and archive/delete Actions under approved rules.
- Validate Goal/Milestone association.
- Update Action status.
- Record execution data required by Planning and Review.

### B06. Measurement Management

Initial responsibilities:
- Create and update Measurement definitions.
- Record Measurement values.
- Retrieve current values and history.
- Validate value type, unit, and target rules.

### B07. Planning & Scheduling

Initial responsibilities:
- Provide the shared application operations used by manual Planning, AI-approved Planning, and Calendar interactions.
- Create and update Daily Plans.
- Add and remove Actions from a plan.
- Create, update, and delete Schedule entries.
- Retrieve schedules by date range.
- Validate date and time information.
- Support manual and AI-assisted plan creation through the same application workflow.

### B08. Progress Engine

Initial responsibilities:
- Calculate Measurement progress where applicable.
- Calculate Action completion.
- Calculate Goal progress.
- Aggregate child Goal progress where applicable.
- Provide progress summaries.
- Compare actual values with targets.

Calculation rules must be explicitly approved before implementation. UI components must not independently calculate authoritative progress.

### B09. Review Management

Initial responsibilities:
- Retrieve plan and execution data.
- Compare planned and actual results.
- Retrieve progress history.
- Generate a basic review summary from recorded data.
- Record optional user review notes.

### B10. AI Orchestration

Initial responsibilities:
- Build AI requests from relevant user-approved context.
- Manage clarification and proposal workflows.
- Call the selected AI provider.
- Validate structured AI output.
- Store or return proposals separately from approved domain data.
- Apply user-approved proposal changes through normal application/domain operations.
- Handle provider errors, invalid output, timeouts, and usage limits.

## C. DOMAIN

```text
DOMAIN
│
├── C01. Identity & Ownership Rules
├── C02. Workspace & Project Rules
├── C03. Goal & Hierarchy Rules
├── C04. Milestone Rules
├── C05. Action Rules
├── C06. Measurement Rules
├── C07. Planning & Schedule Rules
├── C08. Progress Rules
└── C09. Review Rules
```

The Domain layer owns business meaning and invariants. Exact entity attributes, relationship cardinality, status transitions, and validation rules are not yet fully designed.

## D. DATA & INFRASTRUCTURE

```text
DATA & INFRASTRUCTURE
│
├── D01. Database & Persistence
├── D02. Authentication Integration
├── D03. Shared Types & Contracts
├── D04. Validation
├── D05. API / Application Communication
├── D06. Error Handling
├── D07. Logging & Observability
└── D08. Security & Configuration
```

### D01. Database & Persistence

Initial responsibilities:
- Persistent user-owned application data.
- Schema and migrations.
- Foreign keys and constraints.
- Indexes.
- Development seed data.
- Backup and recovery considerations.

### D02. Authentication Integration

Initial responsibilities:
- Integrate the selected provider.
- Validate authenticated identity for protected operations.
- Keep provider credentials and privileged secrets out of client code.

### D03. Shared Types & Contracts

Initial responsibilities:
- Shared domain types where appropriate.
- Request and response contracts.
- Shared enums and identifiers.
- AI proposal schemas.

### D04. Validation

Initial responsibilities:
- Input validation.
- Domain validation.
- Request validation.
- Structured AI output validation.
- Database constraints where applicable.

### D05. API / Application Communication

Initial responsibilities:
- Define application interfaces or API conventions.
- Define request and response structures.
- Define error response format.
- Define module interaction contracts.

### D06. Error Handling

Initial responsibilities:
- Validation errors.
- Authentication and authorization errors.
- Not found errors.
- Conflict errors.
- Persistence errors.
- AI provider errors.
- Unexpected errors.

### D07. Logging & Observability

MVP responsibilities:
- Record operational errors.
- Support debugging of failed workflows.
- Avoid logging secrets or unnecessary sensitive user content.

Advanced analytics and observability platforms are deferred unless required for deployment reliability.

### D08. Security & Configuration

Initial responsibilities:
- Environment configuration.
- Server-side authorization.
- User data isolation.
- Input and request-size limits.
- Secret management.
- Safe AI provider integration.

## E. AI CAPABILITY

```text
AI CAPABILITY
│
├── E01. Goal Understanding & Clarification
├── E02. Goal Feasibility Feedback
├── E03. Goal Tree Proposal
├── E04. Proposal Review & Approval
└── E05. Basic Daily Plan Proposal
```

### E01. Goal Understanding & Clarification

AI analyzes the user's description and identifies missing context. It may ask questions about current state, desired outcome, constraints, and optional target timeframe.

### E02. Goal Feasibility Feedback

AI may challenge the user's requested target, timeframe, or workload when the available information suggests a concern.

AI must:
- Explain important assumptions and reasons.
- Present alternatives where useful.
- Avoid claiming certainty when information is insufficient.
- Leave the final decision to the user.

### E03. Goal Tree Proposal

AI proposes a structured breakdown containing relevant:
- Child Goals.
- Milestones.
- Actions.
- Measurements.

The proposal should be sufficiently concrete to help the user understand what to do next, but should avoid unnecessary decomposition.

### E04. Proposal Review & Approval

The user can:
- Accept the complete proposal.
- Accept selected items.
- Edit proposed items.
- Reject proposed items.

Only approved changes are committed as official Goal, Milestone, Action, or Measurement data.

### E05. Basic Daily Plan Proposal

AI may propose a Daily Plan using available Goal, Action, Deadline, progress, and estimated-duration information.

The proposal must be editable and explicitly approved by the user before it becomes the active plan.

## F. DELIVERY & QUALITY

```text
DELIVERY & QUALITY
│
├── F01. Development Environment
├── F02. Code Quality
├── F03. Automated Testing
├── F04. Integration & Repository Workflow
└── F05. Deployment
```

### F01. Development Environment

- Repository setup.
- Environment configuration.
- Dependency installation.
- Local development commands.

### F02. Code Quality

- Type checking where supported.
- Linting.
- Formatting.
- Build validation.

### F03. Automated Testing

- Unit tests.
- Component tests.
- Application/API tests.
- Integration tests.
- End-to-end tests for the core user journey.

### F04. Integration & Repository Workflow

- Branch management.
- Pull requests or equivalent review.
- Contract compatibility checks.
- Integration testing.
- Main branch protection where appropriate.

### F05. Deployment

- Build production application.
- Configure environment.
- Deploy public web application.
- Configure persistent database and authentication services.
- Verify deployed MVP.
- Verify user data isolation and persistence.

---

# 5. MVP SCOPE AND PRIORITY

## 5.1 MVP Core — required

| ID | Capability | MVP expectation |
|---|---|---|
| MVP-001 | Authentication | Email / Password registration and login |
| MVP-002 | Personal Workspace | One personal workspace per user |
| MVP-003 | Project Management | Create and manage multiple Projects |
| MVP-004 | Goal Management | Independent Goals and Project Goals |
| MVP-005 | Goal Hierarchy | Flexible Goal Tree |
| MVP-006 | Milestones | Create and track Goal checkpoints |
| MVP-007 | Actions | Create, plan, update, and complete Actions |
| MVP-008 | Measurements | Define and record basic measurements |
| MVP-009 | AI Goal Assistant | Clarify Goal and propose structured breakdown |
| MVP-010 | Proposal Approval | Review, edit, accept, and reject AI proposals |
| MVP-011 | Manual Planning | User creates and manages Daily Plans |
| MVP-012 | Basic AI Planning | AI proposes a Daily Plan from available data |
| MVP-013 | Scheduling | Store planned date/time and duration |
| MVP-014 | Calendar | Basic view of scheduled Actions |
| MVP-015 | Progress | Display progress using approved rules |
| MVP-016 | Review | Basic planned-versus-actual review |
| MVP-017 | Persistence | Cloud persistence across sessions |
| MVP-018 | Deployment | Publicly accessible web application |
| MVP-019 | Initial Setup Flow | Support Goal-first and Project-first entry paths that converge on the same domain model |
| MVP-020 | Consistent Data Views | Goal, Action, Planning, and Calendar views reflect one authoritative source of truth |

## 5.2 MVP Supporting — minimum necessary

- Application Dashboard.
- Goal Overview with concise progress and next relevant work.
- Goal Tree visualization with expand/collapse.
- Action List.
- Basic Calendar View.
- Loading, Empty, and Error States.
- Basic account settings.
- Seeded demo data or a guided demo scenario if needed for evaluation.

## 5.3 Future Scope — recorded, not designed now

The following are explicitly outside the current MVP. They must not block MVP implementation.

- Team Workspace and collaboration.
- Advanced roles and permission management.
- Custom Data Table builder.
- Mathematics Lab.
- General-purpose algorithm library.
- Arbitrary user-authored formulas.
- AI-generated long-term planning and autonomous plan optimization.
- Autonomous rescheduling after missed work.
- AI changing approved Goals or Deadlines without user approval.
- Advanced notifications and reminders.
- Native mobile applications.
- Complex widget ecosystem.
- Offline-first synchronization and conflict resolution.
- External calendar integrations.
- Advanced analytics and reporting.

Figma concepts such as Mathematics, custom Tables, advanced Chunks, and Widgets remain ideas to evaluate later. Their appearance in a design file does not automatically make them MVP requirements.

---

# 6. CORE USER JOURNEYS

## 6.1 Account and workspace initialization

1. User opens the public web application.
2. User registers or signs in using Email / Password.
3. System resolves the authenticated user.
4. System creates or retrieves that user's Personal Workspace.
5. User enters the application Dashboard.

## 6.2 Initial setup — two valid entry paths

FLOW-UP supports two entry paths. Neither is mandatory for every user:

**Goal-first path**
1. User starts with an outcome they want to achieve.
2. User creates an independent Goal.
3. User may later place it inside a Project.

**Project-first path**
1. User creates a Project to represent a larger initiative.
2. User adds one or more Goals to the Project.
3. Each Goal follows the same Goal clarification and breakdown workflow.

Both paths lead to the same underlying Workspace, Project, and Goal domain model. Do not create separate Goal types or duplicate workflows for the two paths.

## 6.3 Independent Goal creation

1. User chooses to create a Goal without creating a Project.
2. User enters an initial Goal description.
3. AI analyzes the description.
4. AI asks for important missing information.
5. User answers or skips optional questions.
6. AI may provide feasibility feedback.
7. AI proposes a Goal Tree.
8. User reviews, edits, accepts, or rejects proposal items.
9. Approved items are saved as official domain data.
10. The Goal appears in the user's independent Goals area.

## 6.4 Project-based Goal creation

1. User creates a Project.
2. User creates one or more Goals inside the Project.
3. Each Goal can be decomposed and managed using the same Goal workflow.
4. Project overview displays relevant Goal status and progress.

## 6.5 Goal movement

1. User selects a Goal.
2. User chooses a destination Project or the independent Workspace area.
3. System validates ownership and destination.
4. System moves the Goal while preserving identity and valid descendants/relationships.
5. UI refreshes the relevant Workspace and Project views.

## 6.6 Manual Planning

1. User views available Actions.
2. User selects Actions for a day.
3. User sets planned date and optional time/duration.
4. User saves the Daily Plan.
5. The plan is visible in Planning and Calendar views.

## 6.7 AI-assisted Planning

1. User requests a Daily Plan.
2. System gathers relevant approved Goal, Action, Deadline, progress, and duration data.
3. AI proposes a plan.
4. System validates the proposal.
5. User reviews and edits the proposal.
6. User approves it.
7. System saves approved Schedule/Plan data through normal application operations.

## 6.8 Execution, Progress, and Review

1. User opens a planned Action.
2. User updates its status or marks it complete.
3. User records Measurement values where relevant.
4. Progress Engine calculates updated progress using approved rules.
5. Goal Overview and relevant Project views update.
6. User reviews planned versus actual execution.
7. User may revise Goals, Actions, or future plans.

---

# 7. HIGH-LEVEL DEPENDENCY MAP

The architecture tree shows containment. This section shows important conceptual dependencies.

```text
AUTHENTICATED USER
       │
       ▼
PERSONAL WORKSPACE
       │
       ├─────────────── PROJECTS (optional)
       │                    │
       └─────────────── GOALS
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
           CHILD GOALS  MILESTONES  MEASUREMENTS
                │           │
                └─────┬─────┘
                      ▼
                    ACTIONS
                      │
                      ▼
                 PLANNING
                      │
                      ▼
                  SCHEDULES
                      │
                      ▼
                EXECUTION DATA
                      │
             ┌────────┴────────┐
             ▼                 ▼
         PROGRESS            REVIEW

AI CAPABILITY
   ├── reads relevant approved context
   ├── proposes Goal / Milestone / Action / Measurement structures
   └── proposes Daily Plans
              │
              ▼
       USER REVIEW & APPROVAL
              │
              ▼
       NORMAL APPLICATION FLOWS
```

Important principles:
- Project is optional; Goal can exist directly in the Personal Workspace.
- Goal Tree is a view of Goal hierarchy data, not a separate source of truth.
- Calendar is a view over Schedule and Action data.
- Planning and Schedule are related but must have clearly defined responsibilities.
- Progress UI displays authoritative calculated results; it is not an independent source of progress truth.
- AI proposal data is separate from approved domain data.
- Initial Setup may begin from Project creation or direct Goal creation; both converge on the same domain operations.
- Calendar is a time-oriented view over Schedule entries and their linked Actions. Calendar edits must invoke the same Planning/Scheduling use cases as other interfaces.
- Changes must propagate through authoritative data and shared read models/query refresh. Do not synchronize independent copies of the same Goal, Action, or Schedule across pages.
- The friend's proposed Chunks, Docs, Widget, Mathematics, and custom Data Table concepts are not yet defined sufficiently to become domain entities or MVP modules. Preserve them as future concepts pending explicit product definition.

- Exact module contracts must be specified before dependent modules are implemented.

---

# 8. MVP ACCEPTANCE CRITERIA

The MVP is not complete merely because screens exist. The following end-to-end conditions must pass.

## 8.1 Identity and persistence

- A user can register and sign in with Email / Password.
- The user's Personal Workspace is created or retrieved reliably.
- Data remains after refresh and a later login.
- A user cannot access another user's private data.

## 8.2 Goal and Project

- A user can create an independent Goal.
- A user can create a Project and Goals inside it.
- A user can create child Goals.
- A user can view a compact overview and expand Goal details.
- A user can move a Goal between independent Workspace scope and a Project without data loss.

## 8.3 AI Goal Assistant

- A user can submit a natural-language Goal.
- AI can ask clarification questions.
- AI can return a structured proposal.
- The proposal includes relevant Goal, Milestone, Action, and Measurement suggestions where appropriate.
- Invalid AI output is rejected or safely handled.
- The user can edit, accept, partially accept, or reject proposal items.
- Unapproved AI output is not written as official business data.
- The core Goal workflow remains usable without AI availability.

## 8.4 Planning and execution

- A user can create a Daily Plan manually.
- AI can propose a basic Daily Plan using available information.
- The user can edit and approve the proposal.
- Approved planned Actions appear in the relevant Planning/Calendar view.
- A user can update and complete Actions.

## 8.5 Progress and review

- Measurement values can be recorded and retrieved.
- Progress is calculated according to approved rules.
- User can inspect current Goal progress.
- User can compare planned and actual execution at a basic level.

---

# 9. FUNCTION SPECIFICATION STANDARD

Every function selected for implementation must receive a detailed specification inside this blueprint.

## Function specification template

**Function ID:** FUNC-XXX  
**Name:**  
**System Area / Module:**  
**Architecture Status:** PROPOSED  
**Development Status:** AVAILABLE / BLOCKED  
**Assignee:** Unassigned

### 1. Purpose
What problem does this function solve?

### 2. Responsibility
What does this function do? What does it explicitly not do?

### 3. User interaction
- Entry point.
- User action.
- Expected UI behavior.
- Success state.
- Failure state.

### 4. Inputs
List required and optional inputs, types, and constraints.

### 5. Outputs
Define returned data or visible result.

### 6. Business rules
List rules and invariants that must be enforced.

### 7. Internal processing
Describe the operation step by step.

### 8. Data requirements
- Entities.
- Fields.
- Relationships.
- Read operations.
- Write operations.
- Transaction requirements.

### 9. Interfaces
- API endpoint or application interface.
- Request structure.
- Response structure.
- Error structure.
- Dependencies.

### 10. Implementation breakdown
List expected components, files, and implementation units after the technology stack and repository structure are approved.

Do not invent file paths before the repository structure and technology stack are approved.

### 11. Error handling
List expected failure cases and their handling.

### 12. Tests
Define unit, integration, and user-flow tests.

### 13. Acceptance criteria
Define observable conditions for completion.

### 14. Integration notes
Identify modules affected by this function.

### 15. Development handoff
- Developer / AI assignee.
- Required references.
- Allowed scope.
- Restricted scope.
- Deliverables.
- Review status.

---

# 10. DEVELOPMENT BOARD

All implementation work is tracked here. Add rows as functions are specified and approved. Do not mark work `AVAILABLE` while required design or dependencies are unresolved.

| ID | Function / Task | Module | Design Status | Development Status | Assignee |
|---|---|---|---|---|---|
| TBD | Repository and environment setup | Delivery | OPEN | BLOCKED | Unassigned |
| TBD | Authentication and user context | Identity | OPEN | BLOCKED | Unassigned |
| TBD | Personal Workspace initialization | Workspace | OPEN | BLOCKED | Unassigned |
| TBD | Project CRUD | Project | OPEN | BLOCKED | Unassigned |
| TBD | Independent and Project Goal model | Goal | OPEN | BLOCKED | Unassigned |
| TBD | Goal hierarchy operations | Goal | OPEN | BLOCKED | Unassigned |
| TBD | Goal movement between scopes | Goal | OPEN | BLOCKED | Unassigned |
| TBD | Milestone management | Milestone | OPEN | BLOCKED | Unassigned |
| TBD | Action management | Action | OPEN | BLOCKED | Unassigned |
| TBD | Measurement management | Measurement | OPEN | BLOCKED | Unassigned |
| TBD | Manual Daily Planning | Planning | OPEN | BLOCKED | Unassigned |
| TBD | Schedule management | Scheduling | OPEN | BLOCKED | Unassigned |
| TBD | AI Goal Assistant | AI | OPEN | BLOCKED | Unassigned |
| TBD | AI proposal approval workflow | AI / Goal | OPEN | BLOCKED | Unassigned |
| TBD | Basic AI Daily Plan proposal | AI / Planning | OPEN | BLOCKED | Unassigned |
| TBD | Progress calculation | Progress | OPEN | BLOCKED | Unassigned |
| TBD | Basic Review | Review | OPEN | BLOCKED | Unassigned |
| TBD | End-to-end MVP deployment | Delivery | OPEN | BLOCKED | Unassigned |

A task is `AVAILABLE` only when its required design and dependencies are approved.

Each task has one primary assignee. Other contributors may support or review it.

---

# 11. DEVELOPMENT SESSION MANAGEMENT

Every substantial development session is recorded here. Keep session records concise but sufficient for another developer or AI session to continue without guessing.

## Session template

**Session ID:** SES-XXX  
**Title:**  
**Assignee:**  
**Related Function(s):**  
**Status:** AVAILABLE

### Objective
What must be completed?

### Architecture references
Which sections of this blueprint must be read?

### Prerequisites
What must already exist?

### Scope
What can be modified?

### Out of scope
What must not be modified?

### Implementation plan
Ordered development steps.

### Deliverables
- Source code.
- Tests.
- Updates to this blueprint.
- Pull request / commit reference.

### Verification
- Build.
- Type check.
- Lint.
- Tests.
- Integration verification.

### Session result
- Completed work.
- Remaining work.
- Discovered issues.
- Architecture changes proposed.
- Next recommended task.

---

# 12. DECISION REGISTER

Only decisions explicitly approved by the Product Owner are `APPROVED`. Recommendations are not approvals.

| ID | Decision | Status | Impact / Notes |
|---|---|---|---|
| DEC-001 | MVP is single-person; team collaboration is future scope | APPROVED | Product, Identity, Workspace |
| DEC-002 | One Personal Workspace per User | APPROVED | Identity, Workspace, Database |
| DEC-003 | Workspace supports independent Goals and Projects | APPROVED | Workspace, Goal, Project |
| DEC-004 | Project is optional for a Goal | APPROVED | Goal, Project |
| DEC-005 | A Goal can move between independent Workspace scope and a Project | APPROVED | Goal, Project, Data integrity |
| DEC-006 | Email / Password authentication | APPROVED | Identity |
| DEC-007 | Goal hierarchy can have flexible depth | APPROVED | Goal, UI, Database |
| DEC-008 | Goal, Milestone, and Action have distinct responsibilities | APPROVED | Goal, Milestone, Action |
| DEC-009 | AI proposes structured Goal breakdown; user reviews and approves | APPROVED | AI, Goal, Milestone, Action, Measurement |
| DEC-010 | AI may challenge feasibility and suggest alternatives; user decides | APPROVED | AI, Goal |
| DEC-011 | Goal deadline / expected completion time is optional | APPROVED | Goal, Planning |
| DEC-012 | Manual Planning and AI-assisted Planning share one Planning model | APPROVED | Planning, AI, Schedule |
| DEC-013 | Basic AI Daily Plan proposal is included in MVP | APPROVED | AI, Planning |
| DEC-014 | AI proposals do not become official data before user approval | APPROVED | AI, Application, Domain |
| DEC-015 | A Goal may have multiple Measurement definitions | OPEN | Measurement, Goal, Progress; proposed by assistant, not yet explicitly confirmed |
| DEC-016 | Action association cardinality and ownership rules | OPEN | Action, Goal, Milestone |
| DEC-017 | Schedule cardinality, recurrence, and time-zone rules | OPEN | Planning, Schedule |
| DEC-018 | Progress calculation and aggregation rules | OPEN | Measurement, Progress |
| DEC-019 | Technology stack | OPEN | All implementation areas |
| DEC-020 | Database and hosting provider | OPEN | Infrastructure, Deployment |
| DEC-021 | AI provider and model selection | OPEN | AI, Infrastructure |
| DEC-022 | Goal / Milestone / Action status lifecycle | OPEN | Domain, UI, Progress |
| DEC-023 | Project completion and progress aggregation rules | OPEN | Project, Progress |

## 12.1 Decision approval rule

Before changing an `OPEN` decision to `APPROVED`:
1. Present the concrete options or recommendation.
2. Explain meaningful MVP impact.
3. Obtain explicit Product Owner approval.
4. Record the chosen rule and consequences here.
5. Update affected architecture sections.

---

# 13. MVP BUILD ORDER

This is the recommended build sequence, not permission to implement underspecified modules. Detailed dependencies may change after Domain Model and Technology Stack approval.

## Phase 1 — Technical Foundation

- Approve technology stack and providers.
- Set up repository and application structure.
- Configure environment and deployment foundations.
- Configure authentication integration.
- Configure database and migration mechanism.
- Establish protected data access.
- Build application shell and basic navigation.

## Phase 2 — Workspace, Project, and Goal Foundation

- Initialize Personal Workspace.
- Create and manage Projects.
- Create independent Goals.
- Create Project Goals.
- Implement Goal hierarchy.
- Implement Goal movement between scopes.
- Build Goal Overview and basic Goal Tree views.

## Phase 3 — Goal Structure and Execution

- Implement Milestones.
- Implement Actions.
- Define and implement Action associations.
- Update Action status and completion.
- Build basic Action List and detail views.

## Phase 4 — Measurement and Progress

- Implement Measurement definitions and records.
- Approve and implement progress calculation rules.
- Display Goal and Project progress where applicable.
- Add measurement history.

## Phase 5 — Planning and Calendar

- Implement manual Daily Planning.
- Implement Schedule operations.
- Build basic Calendar view.
- Connect Action execution with planned work.

## Phase 6 — AI Core

- Implement Goal clarification flow.
- Implement feasibility feedback.
- Implement structured Goal Tree proposals.
- Implement proposal validation and user approval.
- Implement basic AI Daily Plan proposal.
- Add graceful AI failure handling.

The AI Goal Assistant is a core MVP capability. It must not be silently dropped to make the build appear complete. If time becomes constrained, reduce non-core UI polish or advanced planning behavior before removing the core AI Goal workflow.

## Phase 7 — Review and MVP Integration

- Implement basic Review.
- Complete the end-to-end user journey.
- Validate persistence and data isolation.
- Test AI approval boundaries.
- Test core workflow without AI availability.
- Seed demo data if needed.
- Deploy and verify the public MVP.

---

# 14. FUTURE SCOPE REGISTER

These ideas are recorded for later evaluation only. They are not current implementation tasks.

| ID | Future capability | Reason deferred |
|---|---|---|
| FUT-001 | Team Workspace and collaboration | MVP is single-person |
| FUT-002 | Advanced roles and permissions | Not needed for personal MVP |
| FUT-003 | Custom Data Table builder | Separate product capability; high scope |
| FUT-004 | Mathematics Lab | Separate experimentation capability |
| FUT-005 | General-purpose algorithm library | Not needed for core goal execution |
| FUT-006 | Arbitrary formula engine | Adds complexity to data and security |
| FUT-007 | AI long-term planning optimization | Start with Goal breakdown and basic Daily Plan |
| FUT-008 | Autonomous rescheduling | User approval and basic planning first |
| FUT-009 | Advanced availability and calendar optimization | Detailed availability modeling deferred |
| FUT-010 | Advanced notifications | Not essential to validate core loop |
| FUT-011 | Complex widget ecosystem | Not essential to MVP |
| FUT-012 | Native mobile applications | Public web MVP first |
| FUT-013 | Offline-first synchronization | Adds conflict-resolution complexity |
| FUT-014 | External calendar integration | Basic internal Schedule first |
| FUT-015 | Advanced analytics | Basic Progress and Review first |

---

# 15. OPEN ARCHITECTURE QUESTIONS

The following decisions remain open and must be resolved when their relevant modules are designed.

1. Measurement cardinality, supported data types, and history model.
2. Whether Actions can associate with one or multiple Goals / Milestones.
3. Whether an Action can have multiple Schedule entries.
4. Whether Daily Plan is a persisted entity or a date-based view over Schedule entries.
5. Action and Milestone status lifecycle.
6. Goal progress calculation and child aggregation rules.
7. Project progress aggregation rules.
8. Time-zone and date-only handling.
9. Technology stack.
10. Database, hosting, and authentication provider.
11. AI provider, model, structured output strategy, and cost limits.
12. Exact API / application interface strategy.
13. Deletion, archive, and data-retention behavior.

An open question does not block unrelated architecture work. It blocks only the affected module or implementation task.

---

# 16. CHANGE LOG

| Version | Date | Changes |
|---|---|---|
| 0.3 | 2026-11-16 | High-level MVP architecture and initial module map. |
| 0.4 | 2026-11-16 | Added contents; merged Project-first/Goal-first setup, single-source-of-truth data routing, overview-first stage progress, and Calendar–Schedule–Action integration; documented deferred friend-design concepts; added UI/UX foundations, ready-to-code specification contract, and new-chat handoff protocol. |

---

# 17. CURRENT ARCHITECTURE AND DEVELOPMENT STATE

## 16.1 Current stage

**Current stage:** Product baseline, MVP scope, and high-level module map approved; detailed technical design and code-ready part specifications are next.

**Implementation started:** Not confirmed in this blueprint.

## 16.2 Layer status

| Layer | Scope | Architecture status | Development status |
|---|---|---|---|
| L0 | Product vision, core loop, MVP objective | APPROVED | NOT STARTED |
| L1 | High-level system areas and boundaries | APPROVED | NOT STARTED |
| L2 | Module map and high-level boundaries | APPROVED (HIGH LEVEL) | NOT STARTED |
| L3 | Component and function specifications | NOT_STARTED | NOT STARTED |
| L4 | Implementation specifications | NOT_STARTED | NOT STARTED |
| L5 | Tasks and development sessions | TEMPLATE_READY | NOT STARTED |
| Domain Model | Entities, attributes, relationships, invariants | NOT_STARTED | NOT STARTED |
| Database Schema | Tables, constraints, indexes, migrations, access policies | NOT_STARTED | NOT STARTED |
| API Contracts | Operations, request/response, errors | NOT_STARTED | NOT STARTED |
| AI Technical Design | Prompts, schemas, validation, approval workflow | NOT_STARTED | NOT STARTED |
| Testing Architecture | Test strategy and acceptance coverage | NOT_STARTED | NOT STARTED |

## 16.3 What is approved now

- Single-person MVP.
- One Personal Workspace per User.
- Independent Goals and optional Projects.
- Goals can be moved between independent Workspace scope and a Project.
- Flexible-depth Goal hierarchy.
- Goal, Milestone, and Action are distinct concepts.
- Email / Password authentication method.
- AI proposes a Goal Tree and asks clarification questions where needed.
- AI may challenge feasibility and suggest alternatives; the user decides.
- AI proposal must be reviewed and approved before saving as official data.
- Manual and AI-assisted Planning share a common Planning model.
- Basic AI Daily Plan proposal is included in MVP.
- Goal deadline / expected completion time is optional.
- Overview-first UX: users see the overall outcome and what matters next, then expand details.

## 16.4 What is not approved yet

- Full technology stack.
- Supabase or another specific database/auth provider.
- AI provider and model.
- Exact database schema.
- Exact API contracts.
- Measurement schema and cardinality.
- Action association rules.
- Schedule cardinality and recurrence.
- Progress formulas.
- Detailed component architecture.

## 16.5 Next work

The next architecture phase is **Domain Model Design**, followed by the technical contracts required to make each implementation part independently code-ready.

Design in this order:
1. Define entities and their responsibilities.
2. Define attributes and data types.
3. Define relationships and cardinality.
4. Define invariants, validation, and status lifecycles.
5. Review the model against all approved MVP journeys.
6. Approve the Domain Model before deriving the database schema.
7. Design database schema, constraints, indexes, migrations, and access policies.
8. Define application/use-case and API contracts.
9. Define AI proposal schemas, validation, and approval workflows.
10. Define frontend information architecture, component contracts, design tokens, and interaction states.
11. Define testing and deployment specifications.
12. Break each module into bounded READY_TO_CODE parts.

**Architecture principle:** Build only what the MVP needs, but specify every implemented part sufficiently that another developer or AI session can build it without guessing.

---



---

# 18. UI/UX FOUNDATION PRINCIPLES

This section defines the product and architecture foundations required for a polished, intelligent UI later. It does not freeze visual styling, branding, or final screen layouts.

## 17.1 UX direction

FLOW-UP should feel like a guided goal-execution workspace, not a generic task list and not a dense project-management cockpit.

The interface should make three questions easy to answer:
1. What outcome am I working toward?
2. Where am I now, and what is the next meaningful step?
3. What can I do next?

## 17.2 Overview-first information hierarchy

The default view for a Goal should prioritize:
1. Goal title and desired outcome.
2. Current progress/status, with the basis of the progress clearly understandable.
3. Next relevant Milestone or checkpoint.
4. Next executable Action.
5. Deadline or expected period, if provided.
6. Supporting Goal Tree and detailed records, collapsed or progressively disclosed.

The interface must not present the entire Goal Tree as an unavoidable wall of nodes.

## 17.3 Progressive disclosure

- Start with a compact overview.
- Expand child Goals, Milestones, Actions, and measurement details only when needed.
- Preserve context when moving between overview and detail.
- Avoid making users navigate through many pages to perform a common action.
- Do not hide important state changes behind decorative animations.

## 17.4 Shared design system foundation

Before detailed visual design, implement reusable foundations:
- Semantic design tokens for color, spacing, typography, radius, elevation, and motion.
- Consistent typography hierarchy.
- Responsive layout primitives.
- Shared buttons, inputs, selects, dialogs, menus, cards, badges, tabs, tooltips, and feedback patterns.
- Consistent loading, empty, error, success, disabled, and confirmation states.
- Keyboard accessibility and visible focus states.
- Reusable page shell, navigation, content container, and responsive breakpoints.

Exact token values, component library, and visual theme remain technical/UI design decisions and must be approved before implementation.

## 17.5 Smart UX without premature complexity

- AI suggestions must be visually distinguishable from saved/approved data.
- Every AI proposal must explain what it will change before applying it.
- Destructive or structurally significant operations require clear confirmation.
- Use sensible defaults, but expose the ability to edit them.
- Keep user actions reversible where practical.
- Do not introduce a complex widget builder or customizable dashboard into MVP merely to make the interface look powerful.

## 17.6 Responsive baseline

MVP is a web application. Design the layout to work on desktop and remain usable on tablet/mobile widths. This does not imply a native mobile application or offline support.

---

# 19. READY-TO-CODE PART SPECIFICATION CONTRACT

The purpose of detailed architecture is that a developer or a fresh ChatGPT session can implement one bounded part without guessing or needing the full history of prior conversations.

A part is not `READY_TO_CODE` until its specification contains the information below or explicitly marks an item as not applicable.

## 18.1 Required specification fields

| Field | Required content |
|---|---|
| Part ID and name | Stable identifier, e.g. `B03-UC-001` |
| Purpose | User/business problem solved |
| Scope | Included and excluded behaviour |
| Owner layer/module | The authoritative module responsible |
| Dependencies | Required modules and their approved contracts |
| User flow | Trigger, steps, outcomes, alternate paths |
| UI contract | Screens/components, states, user actions, accessibility expectations |
| Domain contract | Entities, relationships, invariants, state transitions |
| Data contract | Fields, types, nullability, constraints, ownership |
| API/use-case contract | Inputs, outputs, authorization, side effects |
| Validation | Client and authoritative server/domain validation |
| Error behaviour | Expected errors and user-visible recovery |
| Security | Ownership checks, trust boundaries, sensitive data handling |
| AI behaviour | Prompt/input/output schema and approval gate, if applicable |
| Acceptance criteria | Observable, testable pass conditions |
| Tests | Unit, integration, component, and/or end-to-end cases |
| Files to create/change | Expected repository paths and responsibilities |
| Implementation steps | Ordered small steps |
| Completion evidence | Commands run, tests passed, screenshots/logs where relevant |
| Status | PROPOSED / IN_REVIEW / APPROVED / READY_TO_CODE / IMPLEMENTED / VERIFIED |

## 18.2 Implementation readiness rule

A part may be handed to a coding session only when:
- Its parent architecture and relevant decisions are approved.
- Its dependencies have stable contracts.
- No unresolved question changes the core behaviour of that part.
- Acceptance criteria are testable.
- The target repository structure and current implementation state are known.
- The part has a bounded scope that can be implemented and verified independently.

If an unresolved decision is non-blocking, document the chosen temporary boundary and do not invent a permanent business rule.

## 18.3 Part boundaries

A part should represent one cohesive capability, not an arbitrary number of files.

Examples:
- Authentication: registration flow.
- Workspace: retrieve or initialize Personal Workspace.
- Goal Management: create a Goal.
- Goal Management: move a Goal between Project and independent scope.
- Goal Tree: retrieve and render hierarchy.
- Planning: add an Action to a Daily Plan.
- AI: validate a Goal Tree proposal.
- Calendar: retrieve Schedule entries for a date range.

Avoid a single giant task such as "build the entire frontend" or "implement all Goal features."

## 18.4 Definition of Done

A part is complete only when:
1. Implementation matches the approved specification.
2. No unapproved scope has been added.
3. Validation and authorization are enforced at the authoritative boundary.
4. Relevant automated tests pass.
5. Error, loading, empty, and success states are handled where applicable.
6. Types/contracts remain consistent with dependent modules.
7. The application builds and relevant lint/type checks pass.
8. The Master Blueprint status and session notes are updated.
9. Any deviation or follow-up is recorded.

---

# 20. NEW-CHAT HANDOFF PROTOCOL

A new chat must be able to work from a self-contained part specification, not rely on memory or assume that previous conversations are available.

## 19.1 Required handoff package

When starting a new implementation chat, provide:
1. The current `MASTER_BLUEPRINT.md`.
2. The exact Part ID and complete approved part specification.
3. Relevant existing source files or repository access.
4. Current branch and commit, if applicable.
5. Known constraints and any implementation already completed.
6. The exact requested deliverable for that session.

## 19.2 Coding-session instructions

The coding session must:
- Read the Master Blueprint and the assigned part specification first.
- Inspect the existing repository before proposing file changes.
- Preserve existing conventions unless the specification approves a change.
- Implement only the assigned part and necessary integration points.
- Never invent missing business rules or silently widen scope.
- Ask one focused clarification if a blocking ambiguity exists.
- Explain important design choices and provide a concise file/change summary.
- Run the specified tests and report exact results.
- Identify incomplete work, risks, and required follow-up.
- Return a handoff update suitable for insertion into this Master Blueprint.

## 19.3 Handoff response format

```text
PART:
SPEC VERSION:
IMPLEMENTATION STATUS:
FILES CREATED:
FILES MODIFIED:
BEHAVIOUR IMPLEMENTED:
TESTS / COMMANDS RUN:
TEST RESULTS:
KNOWN LIMITATIONS:
DEVIATIONS FROM SPEC:
FOLLOW-UP TASKS:
BLUEPRINT UPDATES REQUIRED:
```

A chat response is not proof that code was committed or deployed. Report repository changes only when actually performed and verified.

---

# 21. FRIEND DESIGN INTEGRATION NOTES

This section records how the additional concept design was evaluated. It preserves potentially useful ideas without treating undefined labels as approved architecture.

## 20.1 Concepts merged into the current product baseline

| Friend-design concept | FLOW-UP integration | Status |
|---|---|---|
| Create Project first, then add Goals | Supported as Project-first entry path | MERGED |
| Start directly from a Goal | Supported as Goal-first entry path | MERGED |
| System routes updates to relevant areas | Implement through authoritative domain/application data and refreshed views | MERGED AS PRINCIPLE |
| Goal Tree overview and progress stage | Overview-first Goal experience with current progress, next checkpoint, and next Action | MERGED |
| Calendar connected to Goals and Actions | Calendar reads/updates Schedule and linked Action through shared use cases | MERGED |
| Calendar can add planned work | Supported where it creates/updates the same Schedule/Action records | MERGED |

## 20.2 Concepts retained for later definition

| Concept | Current treatment | Reason |
|---|---|---|
| Chunks 1/2/3 | UNRESOLVED / FUTURE CONCEPT | Meaning, ownership, and lifecycle have not been defined |
| Docs | UNRESOLVED / FUTURE CONCEPT | Not yet clear whether this means notes, structured documents, or a document editor |
| Widget system | FUTURE SCOPE | Widget types, data contracts, permissions, and user value need definition |
| Custom Data Table | FUTURE SCOPE | Not equivalent to basic Goal Measurement |
| Mathematics / algorithm library | FUTURE SCOPE | General formula and algorithm execution are not required for the MVP core loop |
| Automatic notifications for days without a Goal | FUTURE SCOPE | Reminder policy and notification preferences are undefined |
| Multiple Goal Tree types | UNRESOLVED | Current model has one Goal hierarchy with different views; no second independent tree is approved |

## 20.3 Data routing rule

The phrase "information is routed to the correct places" is implemented as follows:

- Each fact is written to its owning domain record through an application use case.
- Other views query or derive the information from that authoritative record.
- Derived summaries may be cached only when invalidation/consistency behaviour is specified.
- No page, widget, Chunk, or calendar view may become an independent competing owner of Goal/Action/Schedule facts.
- Notes and future documents may own their own content, but references to Goals or Actions must use stable identifiers and defined relationships.

## 20.4 Measurement versus custom Data Table

These are distinct capabilities:

- **MVP Measurement:** a focused way to define a metric related to a Goal and record values/history.
- **Future Custom Data Table:** a user-configurable data structure with arbitrary columns, formulas, query/algorithm behaviour, and possibly relationships to widgets.

The MVP must implement Measurement without accidentally creating a general-purpose table/formula engine.


---

**END OF MASTER BLUEPRINT — v0.4**
