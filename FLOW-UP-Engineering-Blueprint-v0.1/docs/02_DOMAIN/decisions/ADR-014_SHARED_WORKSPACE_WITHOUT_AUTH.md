# ADR-014 — Shared Workspace Without Authentication

**Status:** APPROVED  
**Date opened:** 2026-11-16  
**Decision date:** 2026-11-16  
**Approver:** Product owner

## Context

The initial architecture considered user accounts, authentication, and personal workspaces.

For the MVP, the product owner decided to prioritize product functionality and the core goal execution experience over account infrastructure.

The MVP is intended to be a shared web demonstration where visitors can access the same workspace and work with the same persistent dataset.

## Options Considered

### Option A — Personal Workspace with Authentication

- Each user registers and signs in.
- Each user owns a personal Workspace.
- Data is isolated by user.

Advantages:
- Supports private user data.
- Provides a foundation for multi-user product functionality.

Disadvantages:
- Requires authentication, user management, ownership relationships, and access control.
- Adds implementation and testing work before the core product is validated.

### Option B — One Shared Workspace Without Authentication

- Visitors access the application without signing in.
- All visitors use the same Workspace.
- All visitors work with the same dataset.

Advantages:
- Removes registration and login friction.
- Reduces MVP implementation scope.
- Allows the team to focus on the core product experience.
- Makes the demo straightforward.

Disadvantages:
- Data is not private.
- Visitors can affect each other's work.
- Public write access introduces abuse and data-integrity risks.
- Does not represent the eventual personal-workspace experience.

## Decision

Option B is approved for MVP.

- Provide exactly one shared Workspace.
- Do not implement authentication or registration.
- Do not implement user management.
- All visitors access the same shared dataset.
- Data is stored centrally and persists across page refreshes, browser sessions, and different visitors.
- Goals are created directly inside the shared Workspace.
- The MVP is a shared demonstration environment, not a private personal workspace.

## Reasons

The immediate priority is to validate whether FLOW-UP can help visitors move from outcomes to structured goals, actions, schedules, measurable progress, and review.

Authentication and personal data ownership are not necessary to demonstrate this core loop.

## Consequences / Trade-offs

### Product consequences

- No login or registration screens.
- No personal Workspace management.
- No user-specific data separation.
- All visitors can see the same data.
- All visitors can potentially modify the same data.
- The UI must clearly communicate that the Workspace is shared.

### Technical consequences

- MVP data does not require a User entity or user ownership relationship.
- A central database is required for persistent shared data.
- Backend validation is required for data integrity.
- Public write operations must be deliberately limited.
- Database credentials with elevated privileges must never be exposed in frontend code.
- Rate limiting, input validation, request-size limits, and abuse prevention must be considered.
- Seeded demo data and reset procedures must be designed carefully to avoid accidental data loss.

### Security and privacy constraints

- Do not store private or sensitive information.
- Do not assume that hiding a UI control provides access security.
- Do not expose database service-role or administrative credentials to visitors.
- Restrict database operations to the minimum permissions required by the application.
- The shared environment must be treated as publicly accessible.

## Affected Modules / Contracts

- Workspace module
- Goal module
- Action module
- Schedule module
- Measurement and Progress modules
- Database schema and access policies
- Backend API and validation
- Demo data and reset functionality
- Deployment configuration

## Implementation Boundary

This decision approves the product access model only.

It does not approve a specific backend framework, API architecture, database permission configuration, hosting provider, or security implementation.

Those technical decisions must be specified and reviewed separately.

## Future Reconsideration

Authentication and personal Workspaces may be introduced after the MVP validates the core product experience.

Such a change will require a separate decision and impact review.

## Approval

**Status:** APPROVED  
**Approver:** Product owner  
**Date:** 2026-11-16