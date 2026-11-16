# FLOW-UP MASTER BLUEPRINT

**ID:** FEB-000  
**Version:** 0.2  
**Status:** PROPOSED  
**Owner:** Product Owner / Technical Lead  
**Last reviewed:** 2026-11-16  
**Purpose:** Single source of truth for MVP architecture, functionality, development assignments, and implementation sessions.

---

# 0. HOW TO USE THIS BLUEPRINT

This document is the central architecture and development reference for FLOW-UP.

It is organized as a hierarchical tree:

- L0 — Product
- L1 — System Areas
- L2 — Modules
- L3 — Functions and Components
- L4 — Implementation Specifications
- L5 — Development Tasks and Sessions

The architecture tree defines what must be built and how parts are organized.

Detailed code design is performed only when a function is selected for development.

## Development rules

1. Do not implement a function before its specification is approved.
2. Do not invent missing business rules or shared interfaces.
3. Every function must have an identifiable owner and responsibility.
4. Every cross-module interaction must follow an agreed contract.
5. A change affecting other modules must be recorded before implementation.
6. Every completed function must pass its acceptance criteria and relevant tests.
7. Keep the MVP small. Deferred features must not become hidden implementation requirements.

---

# 1. L0 — PRODUCT

## FLOW-UP

A goal execution and progress management platform.

Core product loop:

`Outcome → Breakdown → Measure → Action → Schedule → Execute → Review → Adjust`

### MVP objective

Deliver one complete, persistent user journey:

1. Enter the application.
2. Access a workspace or project.
3. Create an outcome/goal.
4. Break it down into smaller goals or milestones.
5. Define a measurable target.
6. Create actions associated with goals.
7. Schedule actions.
8. Execute actions and record actual progress.
9. View updated progress.
10. Review planned versus actual results.

### MVP completion condition

A user can complete the journey without manually editing the database or relying on mock data.

Data must persist after refresh and be available to the intended users under the approved access model.

---

# 2. L1 — SYSTEM ARCHITECTURE

FLOW-UP is divided into five system areas.

```text
FLOW-UP
│
├── A. WEB CLIENT
│   └── User interface and interaction
│
├── B. BACKEND PLATFORM
│   └── Application logic and business operations
│
├── C. DATABASE
│   └── Persistent application data
│
├── D. SHARED INFRASTRUCTURE
│   └── Shared types, validation and communication
│
└── E. DELIVERY & QUALITY
    └── Build, testing, integration and deployment
```

## A. WEB CLIENT

Responsible for displaying information and receiving user interactions.

## B. BACKEND PLATFORM

Responsible for business rules, application workflows and trusted data operations.

## C. DATABASE

Responsible for persistent data, relationships, constraints and migrations.

## D. SHARED INFRASTRUCTURE

Responsible for common interfaces and mechanisms used by multiple modules.

## E. DELIVERY & QUALITY

Responsible for ensuring that individual modules can be integrated into a functioning application.

---

# 3. L2 — MODULE ARCHITECTURE

## A. WEB CLIENT

```text
WEB CLIENT
│
├── A01. Application Shell
├── A02. Workspace & Project Interface
├── A03. Goal Management Interface
├── A04. Action Management Interface
├── A05. Measurement Interface
├── A06. Calendar Interface
├── A07. Progress & Review Interface
└── A08. Shared UI Components
```

### A01. Application Shell

Functions:

- Application initialization
- Main layout
- Navigation
- Route management
- Global loading and error states
- Shared application state

### A02. Workspace & Project Interface

Functions:

- Display available workspace/project
- Create project
- View project information
- Edit project information
- Open a project

### A03. Goal Management Interface

Functions:

- Display goal list
- Display goal hierarchy
- Create goal
- Edit goal
- Delete or archive goal
- Add child goal
- View goal details
- Select goal
- Change goal hierarchy where permitted

Views:

- List / Outline
- Goal Tree

### A04. Action Management Interface

Functions:

- Display actions
- Create action
- Edit action
- Delete action
- Associate action with goal
- Update action status
- Mark action complete

### A05. Measurement Interface

Functions:

- Display measurement
- Define measurement label
- Define unit
- Define target value
- Display current value
- Record measurement update
- Display measurement history

### A06. Calendar Interface

Functions:

- Display calendar
- Switch Month / Week / Day
- Display scheduled actions
- Create schedule
- Edit schedule
- Remove schedule
- Open scheduled action
- Update schedule information

### A07. Progress & Review Interface

Functions:

- Display goal progress
- Display action completion
- Compare planned and actual results
- Display measurement history
- Display basic review information

### A08. Shared UI Components

Functions:

- Form controls
- Dialogs and popups
- Buttons
- Navigation elements
- Status indicators
- Loading states
- Empty states
- Error messages
- Reusable layout components

---

## B. BACKEND PLATFORM

```text
BACKEND PLATFORM
│
├── B01. Workspace & Project
├── B02. Goal Management
├── B03. Action Management
├── B04. Measurement
├── B05. Scheduling
├── B06. Progress Engine
└── B07. Review
```

### B01. Workspace & Project

Functions:

- Retrieve workspace/project
- Create project
- Update project
- Retrieve project overview
- Validate project data
- Enforce approved access model

### B02. Goal Management

Functions:

- Create goal
- Retrieve goal
- Update goal
- Delete/archive goal
- Retrieve goal hierarchy
- Add child goal
- Validate parent-child relationships
- Prevent invalid hierarchy operations

### B03. Action Management

Functions:

- Create action
- Retrieve action
- Update action
- Delete action
- Associate action with goal
- Update action status
- Complete action

### B04. Measurement

Functions:

- Create measurement definition
- Update measurement definition
- Retrieve measurement
- Record measurement value
- Retrieve measurement history
- Validate measurement values

### B05. Scheduling

Functions:

- Create schedule
- Update schedule
- Delete schedule
- Retrieve schedules
- Retrieve schedules by date range
- Associate schedule with action
- Validate time information

### B06. Progress Engine

Functions:

- Calculate measurement progress
- Calculate action completion
- Calculate goal progress
- Aggregate child-goal progress where applicable
- Provide progress summary
- Compare actual and target values

Calculation rules must be explicitly approved before implementation.

### B07. Review

Functions:

- Retrieve project review data
- Compare plan and actual
- Retrieve progress history
- Generate basic review summary
- Record optional user review notes

---

## C. DATABASE

```text
DATABASE
│
├── C01. Workspace / Project Storage
├── C02. Goal Storage
├── C03. Action Storage
├── C04. Measurement Storage
├── C05. Schedule Storage
├── C06. Progress Data
└── C07. Database Infrastructure
```

### C01. Workspace / Project Storage

Required responsibilities:

- Store workspace/project information
- Retrieve project information
- Maintain project relationships

### C02. Goal Storage

Required responsibilities:

- Store goal information
- Store parent-child relationships
- Retrieve hierarchical data
- Maintain valid references

### C03. Action Storage

Required responsibilities:

- Store action information
- Store action status
- Maintain goal references

### C04. Measurement Storage

Required responsibilities:

- Store measurement definitions
- Store measurement records
- Retrieve historical records

### C05. Schedule Storage

Required responsibilities:

- Store scheduled time information
- Maintain action references
- Retrieve schedules by date range

### C06. Progress Data

Initial principle:

Progress should be calculated from authoritative source data wherever practical.

Do not introduce persisted progress snapshots unless a demonstrated MVP requirement needs them.

### C07. Database Infrastructure

Functions:

- Database connection/configuration
- Schema creation
- Migrations
- Constraints
- Indexes
- Backup and recovery considerations
- Development seed data

---

## D. SHARED INFRASTRUCTURE

```text
SHARED INFRASTRUCTURE
│
├── D01. Shared Types
├── D02. Validation
├── D03. API Communication
├── D04. Error Handling
└── D05. Access & Security
```

### D01. Shared Types

- Common domain types
- API request/response types
- Shared enums
- Common identifiers

### D02. Validation

- Input validation
- Domain validation
- Request validation
- Data constraints

### D03. API Communication

- API conventions
- Request handling
- Response format
- Error response format

### D04. Error Handling

- Validation errors
- Not found errors
- Conflict errors
- Persistence errors
- Unexpected errors

### D05. Access & Security

- Approved workspace access model
- Server-side validation
- Public-write protection if shared access is selected
- No privileged credentials in client code
- Input and request-size limits

---

## E. DELIVERY & QUALITY

```text
DELIVERY & QUALITY
│
├── E01. Development Environment
├── E02. Code Quality
├── E03. Automated Testing
├── E04. Integration
└── E05. Deployment
```

### E01. Development Environment

- Repository setup
- Environment configuration
- Dependency installation
- Local development commands

### E02. Code Quality

- Type checking
- Linting
- Formatting
- Build validation

### E03. Automated Testing

- Unit tests
- Component tests
- API tests
- Integration tests
- End-to-end tests

### E04. Integration

- Branch management
- Pull requests
- Contract compatibility checks
- Integration testing
- Main branch protection

### E05. Deployment

- Build production application
- Configure environment
- Deploy frontend
- Deploy backend/database services
- Verify deployed MVP

---

# 4. MODULE DEPENDENCY MAP

The architecture tree shows containment. This section shows cross-module dependencies.

```text
WORKSPACE / PROJECT
        │
        ▼
      GOAL
        │
        ├───────────────┐
        ▼               ▼
    ACTION          MEASUREMENT
        │               │
        ▼               │
    SCHEDULING           │
        │               │
        └───────┬───────┘
                ▼
          PROGRESS ENGINE
                │
                ▼
              REVIEW
```

Presentation modules consume data from the relevant backend modules.

The Calendar is a view over Schedule and Action data.

The Goal Tree is a view over Goal hierarchy data.

The Progress interface displays calculated progress; it must not become an independent source of progress truth.

Exact API and data contracts must be specified before dependent modules are implemented.

---

# 5. END-TO-END MVP FLOW

```text
USER
 │
 ▼
OPEN APPLICATION
 │
 ▼
ACCESS WORKSPACE / PROJECT
 │
 ▼
CREATE PROJECT (if required)
 │
 ▼
CREATE GOAL
 │
 ▼
CREATE CHILD GOAL
 │
 ▼
DEFINE MEASUREMENT
 │
 ▼
CREATE ACTION
 │
 ▼
SCHEDULE ACTION
 │
 ▼
EXECUTE ACTION
 │
 ├── Update action status
 │
 └── Record measurement
 │
 ▼
CALCULATE PROGRESS
 │
 ▼
DISPLAY UPDATED GOAL
 │
 ▼
REVIEW PLAN VS ACTUAL
```

The flow must be validated against the approved MVP scope and access decision before implementation.

---

# 6. FUNCTION SPECIFICATION STANDARD

Every function selected for development must receive a detailed specification inside this blueprint.

Use the following structure.

## Function specification template

**Function ID:** FUNC-XXX  
**Name:**  
**Module:**  
**Status:** PROPOSED  
**Assignee:** Unassigned

### 1. Purpose

What problem does this function solve?

### 2. Responsibility

What does this function do?

What does it explicitly not do?

### 3. User interaction

- Entry point
- User action
- Expected UI behavior
- Success state
- Failure state

### 4. Inputs

List all required and optional inputs, types and constraints.

### 5. Outputs

Define returned data or visible result.

### 6. Business rules

List the rules that must be enforced.

### 7. Internal processing

Describe the operation step by step.

### 8. Data requirements

- Entities
- Fields
- Relationships
- Read operations
- Write operations

### 9. Interfaces

- API endpoint or application interface
- Request structure
- Response structure
- Error structure
- Dependencies

### 10. Implementation breakdown

List the expected components, files and implementation units after technical design.

Do not invent file paths before the repository structure and technology stack are approved.

### 11. Error handling

List expected failure cases and their handling.

### 12. Tests

Define unit, integration and user-flow tests.

### 13. Acceptance criteria

Define observable conditions for completion.

### 14. Integration notes

Identify modules affected by this function.

### 15. Development handoff

- Developer/AI assignee
- Required references
- Allowed scope
- Restricted scope
- Deliverables
- Review status

---

# 7. DEVELOPMENT BOARD

All implementation work is tracked here.

| ID | Function / Task | Module | Design | Status | Assignee |
|---|---|---|---|---|---|
| TBD | Workspace initialization | Project | PROPOSED | AVAILABLE | Unassigned |
| TBD | Create Goal | Goal | PROPOSED | BLOCKED | Unassigned |
| TBD | Goal hierarchy | Goal | PROPOSED | BLOCKED | Unassigned |
| TBD | Create Action | Action | PROPOSED | BLOCKED | Unassigned |
| TBD | Record Measurement | Measurement | PROPOSED | BLOCKED | Unassigned |
| TBD | Create Schedule | Scheduling | PROPOSED | BLOCKED | Unassigned |
| TBD | Calculate Progress | Progress | PROPOSED | BLOCKED | Unassigned |
| TBD | Project Review | Review | PROPOSED | BLOCKED | Unassigned |

A task is AVAILABLE only when its required design and dependencies are ready.

## Status definitions

- PROPOSED: identified but not yet designed.
- IN_REVIEW: design is being reviewed.
- APPROVED: design is approved for implementation.
- AVAILABLE: ready to be claimed.
- CLAIMED: assigned to a developer.
- IN_PROGRESS: implementation has started.
- BLOCKED: waiting for a dependency or decision.
- REVIEW: awaiting code review.
- IN_TEST: undergoing verification.
- VERIFIED: acceptance criteria passed.
- RELEASED: integrated into the MVP.

Each task has one primary assignee. Other contributors may support or review it.

---

# 8. DEVELOPMENT SESSION MANAGEMENT

Every development session is recorded here.

## Session template

**Session ID:** SES-XXX  
**Title:**  
**Assignee:**  
**Related Function:**  
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

- Source code
- Tests
- Documentation changes within this blueprint
- Pull request / commit reference

### Verification

- Build
- Type check
- Lint
- Tests
- Integration verification

### Session result

- Completed work
- Remaining work
- Discovered issues
- Architecture changes proposed
- Next recommended task

---

# 9. DECISION REGISTER

Decisions affecting shared architecture must be recorded here.

| ID | Decision | Status | Impact |
|---|---|---|---|
| DEC-001 | MVP workspace access model | IN_REVIEW | Workspace, Access |
| DEC-002 | Goal/Milestone representation | PROPOSED | Goal, Database |
| DEC-003 | Technology stack | PROPOSED | All implementation areas |
| DEC-004 | Progress calculation rules | PROPOSED | Measurement, Progress |
| DEC-005 | Action scheduling cardinality | PROPOSED | Action, Scheduling |

Do not silently resolve conflicting existing decisions.

---

# 10. MVP BUILD ORDER

Recommended implementation sequence:

## Phase 1 — Foundation

- Repository and application setup
- Database connection and migration mechanism
- Application shell
- Workspace/project access
- Basic error handling

## Phase 2 — Goal Management

- Create and retrieve goals
- Update and delete goals
- Parent-child relationships
- Goal List / Outline view
- Basic Goal Tree view if feasible

## Phase 3 — Execution

- Create actions
- Associate actions with goals
- Update action status
- Complete actions

## Phase 4 — Measurement

- Define measurement
- Record current values
- Set target and unit
- Retrieve measurement history

## Phase 5 — Scheduling

- Schedule actions
- Retrieve schedules
- Calendar interface
- Update and remove schedules

## Phase 6 — Progress & Review

- Calculate goal progress
- Aggregate action and measurement information
- Compare planned and actual
- Display review summary

## Phase 7 — MVP Integration

- Complete end-to-end user flow
- Validate persistent data
- Test cross-module integration
- Seed demo data
- Deploy and verify

---

# 11. DEFERRED FEATURES

Do not include these in the initial MVP unless scope is explicitly revised:

- Custom data-table builder
- General-purpose calculation/algorithm library
- Arbitrary user-authored formulas
- Autonomous AI planning
- Autonomous rescheduling
- Advanced notification engine
- Complex widget ecosystem
- Team collaboration and RBAC
- Native mobile applications
- Offline-first conflict resolution

The Figma concepts for Mathematics, custom Tables, advanced Chunks and Widgets remain product ideas to evaluate later. Their presence in Figma does not automatically make them MVP requirements.

---

# 12. OPEN ARCHITECTURE QUESTIONS

The following decisions must be resolved before affected modules are approved:

1. Workspace model: personal workspace or one shared workspace?
2. Project requirement: can Goals exist directly in a Workspace, or must they belong to a Project?
3. Goal hierarchy: are Goals and Milestones different entities or types of one hierarchical entity?
4. Measurement: can a Goal have multiple measurements?
5. Action: can an Action belong to one Goal only, or multiple Goals?
6. Scheduling: can an Action have multiple schedule entries?
7. Progress: how is progress calculated and aggregated?
8. Technology stack: which frontend, backend and database choices are approved?

Until resolved, affected functions remain PROPOSED or BLOCKED.

---

# 13. CURRENT DEVELOPMENT STATE

**Current stage:** Architecture definition  
**Implementation started:** No  
**Current priority:** Establish a coherent MVP architecture and approve its core decisions.

Next work:

1. Review the system tree.
2. Confirm the MVP modules.
3. Resolve decisions that affect module boundaries.
4. Select the first vertical slice.
5. Design its functions in detail.
6. Assign the implementation session.
7. Build, test and integrate.

**Architecture principle:** Build only what the MVP needs, but specify every implemented part sufficiently that another developer or AI session can build it without guessing.
