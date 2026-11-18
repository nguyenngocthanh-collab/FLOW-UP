# FLOW-UP API integration guide

This guide reflects the current implementation in `backend/src/api/routes`. The API is JSON over HTTP; successful responses use `{ "success": true, "data": ... }` and failures use `{ "success": false, "error": { "code": "...", "message": "..." } }`. Send `Content-Type: application/json` for requests with bodies. Every endpoint below requires `Authorization: Bearer <access-token>` except register, login, logout, and health.

## Authentication flow

1. `POST /api/auth/register` with `{ "email": "person@example.com", "password": "..." }`. Returns 201 with `data: { status, user?, email?, token }`. If the provider requires email confirmation, status is `confirmation_required` and token is `null`.
2. `POST /api/auth/login` with the same credentials. Returns 200 with `data: { user: { userId, email, isAuthenticated }, token }`.
3. Send the returned token as a Bearer token. `GET /api/auth/session` returns `data: { user: { userId, email, isAuthenticated } }`.
4. `POST /api/auth/logout` returns a success message. The current provider adapters do not revoke already issued access tokens. The client must discard its locally stored token; a token can remain valid until provider expiry/revocation.

Register and login require a non-empty email and password; service validation requires a syntactically valid email. The API error codes include `AUTH_INVALID_INPUT`, `AUTH_EMAIL_ALREADY_EXISTS`, `AUTH_INVALID_CREDENTIALS`, `AUTH_EMAIL_NOT_CONFIRMED`, `AUTH_RATE_LIMITED`, `AUTH_NETWORK_ERROR`, and `AUTH_PROVIDER_ERROR`. Invalid credentials and unauthenticated requests map to 401, duplicate registration to 409, rate limits to 429, and provider/network failures to 502.

## Endpoint reference

| Module | Method and path | Request | Success data | Notes |
|---|---|---|---|---|
| Health | `GET /health` | none | health result | Public |
| Health | `GET /api/health` | none | health result | Public |
| Auth | `POST /api/auth/register` | `{ email, password }` | registration result plus token | Public |
| Auth | `POST /api/auth/login` | `{ email, password }` | `{ user, token }` | Public |
| Auth | `POST /api/auth/logout` | none | `{ message }` | Public; client clears token |
| Auth | `GET /api/auth/session` | Bearer token | `{ user }` | Authenticated |
| Workspace | `POST /api/workspaces/initialize` | none | workspace | Idempotent personal workspace initialization |
| Workspace | `GET /api/workspaces/current` | none | workspace | Current user's workspace |
| Workspace | `GET /api/workspaces/overview` | none | overview | Current user's workspace summary |
| Project | `POST /api/projects` | `CreateProjectInput` | project | Workspace is derived from authenticated user |
| Project | `GET /api/projects` | none | project array | Current user's projects |
| Project | `GET /api/projects/:id` | none | project | Ownership checked |
| Project | `PATCH /api/projects/:id` | `UpdateProjectInput` | project | Ownership checked |
| Project | `GET /api/projects/:id/overview` | none | overview | Ownership checked |
| Goal | `POST /api/goals` | `CreateGoalInput` | goal | Project/workspace scope checked |
| Goal | `GET /api/goals` | optional `projectId`, `parentGoalId` (`null` means root), `status`, `includeArchived=true` | goal array | Authenticated |
| Goal | `GET /api/goals/hierarchy` | optional `projectId`, `rootGoalId`, `includeArchived=true` | hierarchy | Authenticated |
| Goal | `GET /api/goals/:id` | none | goal | Ownership checked |
| Goal | `PATCH /api/goals/:id` | `UpdateGoalInput` | goal | Ownership checked |
| Goal | `POST /api/goals/:id/children` | goal create fields except `projectId` and `parentGoalId` | child goal | Inherits parent scope |
| Milestone | `POST /api/milestones` | `CreateMilestoneInput` | milestone | Parent goal ownership checked |
| Milestone | `GET /api/milestones?goalId=:id` | required `goalId` | milestone array | Ownership checked |
| Milestone | `GET /api/goals/:goalId/milestones` | none | milestone array | Ownership checked |
| Milestone | `GET /api/milestones/:id` | none | milestone | Ownership checked |
| Milestone | `PATCH /api/milestones/:id` | `UpdateMilestoneInput` | milestone | Ownership checked |
| Milestone | `POST /api/milestones/:id/complete` | none | milestone | Ownership checked |
| Action | `POST /api/actions` | `CreateActionInput` | action | Goal and optional milestone ownership checked |
| Action | `GET /api/actions?goalId=:id` | one of `goalId` or `milestoneId` required | action array | Ownership checked |
| Action | `GET /api/actions?milestoneId=:id` | one of `goalId` or `milestoneId` required | action array | Ownership checked |
| Action | `GET /api/goals/:goalId/actions` | none | action array | Ownership checked |
| Action | `GET /api/actions/:id` | none | action | Ownership checked |
| Action | `PATCH /api/actions/:id` | `UpdateActionInput` | action | Ownership checked |
| Action | `PATCH /api/actions/:id/status` | `{ status }` | action | Ownership checked |
| Action | `POST /api/actions/:id/complete` | none | action | Ownership checked |
| Action | `POST /api/actions/:id/execution` | `RecordExecutionInput` | execution data | Ownership checked |
| Action | `GET /api/actions/:id/execution` | none | execution data | Ownership checked |
| Planning | `POST /api/planning/daily-plans` | `CreateDailyPlanInput` | daily plan | User ID is derived from token |
| Planning | `GET /api/planning/daily-plans/:date` | date path parameter | daily plan | User scoped |
| Planning | `PATCH /api/planning/daily-plans/:id` | `UpdateDailyPlanInput` | daily plan | Owner checked |
| Planning | `POST /api/planning/daily-plans/:id/actions` | schedule fields except `dailyPlanId` | schedule | Owner and action access checked |
| Planning | `DELETE /api/planning/daily-plans/:id/actions/:scheduleId` | none | deletion result | Owner checked |
| Planning | `POST /api/planning/schedules` | `CreateScheduleInput` | schedule | User ID is derived from token |
| Planning | `GET /api/planning/schedules?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | required date range | schedule array | User scoped |
| Planning | `GET /api/planning/schedules/:id` | none | schedule | Owner checked |
| Planning | `PATCH /api/planning/schedules/:id` | `UpdateScheduleInput` | schedule | Owner checked |
| Planning | `DELETE /api/planning/schedules/:id` | none | `{ deleted: true }` | Owner checked |
| Planning | `POST /api/planning/proposals/apply` | `ApprovedPlanningProposal` | apply result | Proposal user must match authenticated user |
| Progress | `GET /api/progress/goals/:goalId` | none | goal progress summary | Goal ownership checked |
| Progress | `POST /api/progress/summary` | `{ goalIds: string[] }` | progress summaries | Goal ownership checked for each goal |
| Progress | `GET /api/progress/reviews/:goalId` | none | review progress data | Goal ownership checked |
| Measurement | `GET /api/goals/:goalId/measurements` | none | active Measurement definitions | Goal ownership checked |
| Measurement | `POST /api/measurements` | goal ID, label, value type, optional unit/target | Measurement definition | Goal ownership checked |
| Measurement | `GET /api/measurements/:id` | none | Measurement definition | Goal ownership checked through Goal |
| Measurement | `PATCH /api/measurements/:id` | label, description, unit and/or target | updated Measurement | Goal ownership checked; unit cannot change after records exist |
| Measurement | `DELETE /api/measurements/:id` | none | archived Measurement | Goal ownership checked |
| Measurement | `POST /api/measurements/:id/records` | typed value, optional recordedAt/note | immutable value record | Goal ownership checked |
| Measurement | `GET /api/measurements/:id/current` | none | latest record or null | Ordered by recordedAt, createdAt, then ID |
| Measurement | `GET /api/measurements/:id/history` | optional from/to/offset/limit | records newest first | limit is capped at 200; Goal ownership checked |

The request types are defined in `backend/src/modules/*/*.types.ts`; route validation and status transitions are implemented in the corresponding service and validation files. The endpoint list deliberately excludes module operations without registered HTTP routes.

## Typical MVP workflow

1. Register/login, then call `GET /api/auth/session` with the returned token.
2. Initialize/select the personal workspace with `POST /api/workspaces/initialize` and `GET /api/workspaces/current`.
3. Create a project with `POST /api/projects` (or create workspace-level goals without a project when allowed by the goal input contract).
4. Create a goal with `POST /api/goals`; list and view it with `GET /api/goals` and `GET /api/goals/:id`.
5. Create nested goals with `POST /api/goals/:id/children`; retrieve the tree with `GET /api/goals/hierarchy`.
6. Create milestones with `POST /api/milestones`, then actions with `POST /api/actions` using the goal and optional milestone IDs.
7. Create a daily plan with `POST /api/planning/daily-plans`, attach actions, or create dated schedules directly.
8. Record execution with `POST /api/actions/:id/execution` and update action status via `PATCH /api/actions/:id/status`.
9. Retrieve progress with `GET /api/progress/goals/:goalId` or `POST /api/progress/summary`.
10. Create a Measurement for a Goal, record values, and read current/history through the Measurement endpoints.

## Validation, errors, and environment

All API errors use the same envelope. Common HTTP mappings are 400 for invalid input, 401 for missing/invalid authentication, 403 for access/ownership denial, 404 for missing resources/routes, 409 for duplicate/conflicting state, 429 for provider rate limits, 502 for auth-provider/network failures, and 500 for unexpected server errors. Error codes remain the stable client discriminator; clients should not parse message text.

Protected data calls must use the authenticated identity; workspace, goal, milestone, action, planning, and progress services perform resource ownership checks. A client-supplied `userId` must not be used to choose the acting identity. CORS origin is configured by the server and defaults to `*` in `createApp`; production deployment should set an explicit trusted origin. Supabase requires `SUPABASE_URL` and `SUPABASE_ANON_KEY`. Local dev auth requires explicit `AUTH_DEV_MODE=true`; it is off by default, and dev token verification is disabled unless explicitly enabled.

## Not implemented through the HTTP API

- Review creation/update endpoints are not registered.
- Goal movement, archival/deletion, and hierarchy reordering operations are not exposed as HTTP routes.
- Review note creation/update endpoints are not registered; the review read endpoint returns evidence/progress data only.
- There is no token revocation endpoint/session blacklist; logout is client-side token disposal.

Do not build frontend calls for operations that do not have registered routes and contracts.

### Measurement and progress semantics

- The web MVP accepts Measurement types `NUMBER`, `TEXT`, and `BOOLEAN`; units are numeric-only. Values are append-only history records.
- Action completion reports completed active Actions divided by total active Actions. This is an execution metric, not Goal outcome progress.
- Goal outcome percentages remain unconfigured because target direction and mixed-source aggregation rules are still open. No percentage is inferred from a Measurement target.
