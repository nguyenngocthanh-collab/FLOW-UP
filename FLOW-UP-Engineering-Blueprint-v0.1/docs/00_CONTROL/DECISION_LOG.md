# Decision Log

Only decisions explicitly approved by the product owner are `APPROVED`.

| ID | Decision | Proposed choice | Status | Consequence |
|---|---|---|---|---|
| ADR-001 | Product core | Goal execution and progress loop | PROPOSED | MVP demonstrates outcome-to-review |
| ADR-002 | Data/view separation | Domain data is source of truth; views are replaceable | PROPOSED | Tree is not the database model |
| ADR-003 | Primary hierarchy UI | List/outline primary; Tree optional | PROPOSED | Tree can be removed without data migration |
| ADR-004 | Main language | TypeScript | PROPOSED | Shared contracts and domain packages |
| ADR-005 | Web client | React + Vite | PROPOSED | Web-first |
| ADR-006 | Backend platform | Supabase for MVP; portable domain logic | PROPOSED | Avoid premature NestJS deployment |
| ADR-007 | Database | PostgreSQL | PROPOSED | Relational integrity and SQL migrations |
| ADR-008 | Web hosting | Cloudflare Pages | PROPOSED | Avoid Vercel Hobby non-commercial restriction |
| ADR-009 | Mobile future | React Native + Expo | PROPOSED | Shared TypeScript domain/contracts where practical |
| ADR-010 | Architecture | Modular monolith / domain modules | PROPOSED | No microservices for MVP |
| ADR-011 | AI runtime | No paid AI dependency in MVP | PROPOSED | Product works without model API |
| ADR-012 | Knowledge source | Git repository + Markdown + registries | PROPOSED | Chat history is not authoritative |
| ADR-013 | Project–Goal relationship | Workspace contains Goals directly; Project is not required in MVP | IN_REVIEW | Goal-first entry; Project grouping deferred |
| ADR-014 | MVP access model | One shared Workspace without authentication or user management | APPROVED | All visitors access and modify the same shared dataset |

## ADR-013 — Project–Goal Relationship

**Status:** IN_REVIEW  
**Date opened:** 2026-11-16  
**Proposal owner:** Product owner

Detailed decision record:

`docs/02_DOMAIN/decisions/ADR-013_PROJECT_GOAL_RELATIONSHIP.md`

### Proposed Choice

- MVP has one shared Workspace.
- Goals are created directly inside the Workspace.
- Project creation is not required before creating a Goal.
- Project is not a required parent of Goal in the MVP.
- Project grouping is deferred to a future release.
- Whether Project should exist in a later release remains open.

### Implementation Boundary

This proposal remains IN_REVIEW.

Do not treat it as an approved implementation contract until the product owner explicitly approves it.

## ADR-014 — Shared Workspace Without Authentication

**Status:** APPROVED  
**Date opened:** 2026-11-16  
**Decision date:** 2026-11-16  
**Approver:** Product owner

Detailed decision record:

`docs/02_DOMAIN/decisions/ADR-014_SHARED_WORKSPACE_WITHOUT_AUTH.md`

### Decision

- MVP provides one shared Workspace accessible to all visitors.
- No registration, login, authentication, or user management is required.
- All visitors operate on the same shared dataset.
- Data is stored centrally and persists across page refreshes, browser sessions, and different visitors.
- The MVP is a shared demonstration environment, not a private personal workspace.

### Consequences

- No User entity or user ownership relationship is required for MVP data.
- Personal Workspace management is excluded.
- Visitors can see and modify the same data.
- The application must clearly communicate that data is shared.
- Private or sensitive information must not be stored in this environment.
- Public write access, validation, rate limiting, database permissions, and abuse prevention require explicit technical controls.

### Implementation Boundary

Approval of the shared access model does not automatically approve a specific backend implementation, database permission configuration, or hosting provider.

## ADR Template

For each new decision record:
- Context
- Options considered
- Decision
- Reasons
- Consequences / trade-offs
- Affected modules/contracts
- Status
- Date and approver