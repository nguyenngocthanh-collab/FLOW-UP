# FLOW-UP product rethink and implementation record

**Status:** Product direction audited; integrated implementation delivered  
**Audit date:** 2026-11-18  
**Implementation baseline:** current checkout on `main`, HEAD `de75249a419501df43f1c97eeb3a8ddfd35da4dc`  
**Architecture authority:** [`FLOW-UP_MASTER_BLUEPRINT_v0.4.md`](../FLOW-UP_MASTER_BLUEPRINT_v0.4.md)  
**Raw concept source:** [`scratch_idea/`](../scratch_idea/)

The implementation follows the audited product direction and preserves existing module ownership. The scratch prototypes are exploratory UI and interaction evidence; the written scratch specification and v0.4 Blueprint are more authoritative than prototype-specific labels or behavior.

## Implementation delivered

- Added authenticated B06 Measurement definition, update, archive, current-value, record and history routes backed by additive SQLite tables. Manual Goal workflows remain independent of AI.
- Added typed Measurement creation, value entry, editing, history and numeric sparkline to Goal details. Values use `NUMBER`, `TEXT`, or `BOOLEAN`; history resolves latest by recorded time, then creation time and ID. Changing units after the first record is rejected.
- Added AI proposal support for Measurement items. The output is validated and explicitly approved before B06 creates the record through its service.
- Added a deterministic Action completion summary (`completed active Actions / active Actions`). This is explicitly separate from Goal outcome progress. Goal outcome percentages remain unconfigured; Measurements with a target show no inferred percentage until target direction is defined.
- Improved home with the next open Action and next scheduled item, real completed Action count, and loading/error/empty states. Goal Tree branches can be expanded independently.
- Added inline edit for unfinished Milestones and Actions, preserved goal discovery input across route/reload interruptions, guarded duplicate AI requests, and simplified the point-of-use Gemini data notice.
- No existing local database was initialized or replaced. Schema changes are additive `CREATE TABLE/INDEX IF NOT EXISTS`; integration tests exercised file-backed persistence using isolated temporary databases.
- Live Gemini verification was attempted with the configured credential without exposing it. The request could not reach Google because the environment blocked outbound networking (`EACCES`); mocked provider tests pass. Browser automation is not configured, so UI workflows were verified with the existing jsdom test suite rather than a browser E2E runner.

## 1. Repository and capability audit

The checkout is on `main` at the checkpoint above. The repository has an existing local database and a large number of tracked-file/index differences from earlier work. Git CLI is not available in this environment, so the staged state and a complete index-to-HEAD comparison could not be established. Existing work and `data/flow-up.db` were preserved. No reset, checkout, commit, or push was performed.

The canonical blueprint is the root `FLOW-UP_MASTER_BLUEPRINT_v0.4.md`. The `FLOW-UP-Engineering-Blueprint-v0.1` folder identifies itself as a draft baseline and contains older contradictory status. `README.md`, `docs/LOCAL_DEMO.md`, and `docs/FRONTEND_MVP.md` provide setup and implementation notes, but parts of the older audit and API integration notes were stale at audit time. This document records the current observed state; implementation docs should be reconciled after product decisions are accepted.

| Capability | Current implementation observed | Product consequence / gap |
|---|---|---|
| Workspace, projects, goals | React/Vite client, authenticated API, SQLite-backed services, workspace/project and hierarchical Goal flows | Both project-first and goal-first concepts exist; users should not have to create a Project just to capture an intention. |
| Milestones, actions, execution | Owning backend modules and UI workflows exist; planning/calendar reads and writes existing Action/Schedule data | Reuse these as the executable plan. Do not create parallel checklist, chunk, or task stores. |
| Measurement, progress, review | Authenticated Measurement routes and Goal detail UI now use B06 services and additive SQLite storage. The UI records typed values, edits definitions, displays history and a numeric sparkline. B08 reports Action completion; Goal outcome progress remains `RULE_NOT_CONFIGURED`; B09 has no user-authored review history UI. | Numeric progress percentages and mixed-source Goal aggregation remain disabled until target-direction and aggregation rules are approved. |
| AI goal discovery | B10 routes and orchestration, Gemini provider, structured schemas, persisted proposals and frontend review/apply flow exist. Proposal application now includes Measurement through B06. | This is a bounded workflow, not a general chat. Saved project/schedule/execution context is not yet assembled for discovery. |
| AI data context | Current discovery submits user input and clarification answers; it does not assemble the user's saved goals, schedules, measurements, or execution history as broad context | Do not imply contextual personalization or evidence-backed feasibility beyond supplied input. Add only purpose-limited context after privacy and ownership rules are specified. |
| AI operations | `@google/genai`, server-side `GEMINI_API_KEY`, `GEMINI_MODEL` default, provider timeout/429 mapping, input/output validation, and usage controls are present | Live provider behavior and current external quota/pricing must be checked at release time; normal tests should remain mocked. |
| Proposal application | Review, edit, selection, rejection, persisted result, duplicate-safe retry path cover Goal, Milestone, Action and Measurement. | Partial success is shown; applied items are locked. Daily Plan proposal application is not implemented. |
| Manual fallback | Existing manual project/goal/action/planning paths remain available; AI error copy offers a manual route | AI must remain optional at every entry point; no saved record depends on a successful model call. |
| Documentation/tests | Frontend/backend unit and API integration coverage includes Measurement persistence, access control, AI proposal application and home/Goal UI paths. | Live Gemini is blocked by outbound network policy; browser-driven E2E is unavailable. |

The repomix snapshot is a convenient file index, not the source of truth; all implementation conclusions above are based on live files. The source inventory includes the original TSX/HTML prototypes, both duplicate `7_current_project` iterations, the integrated Vietnamese prototype, and `scratch_idea_spec.md`.

## 2. Scratch concept reconciliation

The table covers every named prototype family and the main concepts in the written specification. Duplicate iterations are represented together so the same idea is not counted as multiple product requirements. The decisions are for product direction, not a claim that every approved-for-integration idea is already implemented.

| Original idea / interaction | User value and current equivalent | Limitation in rough form | Improved interpretation, owner, and behavior | Phase / decision |
|---|---|---|---|---|
| Home screen preview; linked widget suite; current project overview | Quickly see focus and resume work; current home/project screens already summarize authoritative records | Widget density and linked-card behavior risk turning the home page into a configurable dashboard and creating misleading aggregate metrics | Fixed, curated “continue your work” surface over B02–B08 data: active outcomes, next scheduled action, and recent evidence only when those records load successfully. No widget builder. | MVP evolution / **UPGRADE** |
| Nascent Project; project flow; goal discovery | Turn an incomplete intention into a clear outcome and workable starting point; current B03/B10 Discovery supports AI-assisted input | “Nascent Project” conflates an intention, a project container, and uncertain context; a long fixed intake form over-asks | Keep project optional. Start with outcome and context, ask only material clarifications, show confirmed facts separately from assumptions, then offer manual continuation. B02/B03/B10. | MVP / **MERGE** into Goal Discovery |
| Final Goal | Make the desired result explicit; B03 Goal | Could encourage premature wording or mandatory scoring | Preserve as the user's confirmed outcome, editable before and after planning. B03 owns it. | MVP / **INTEGRATE** |
| Conditions, prerequisites, constraints | Surface blockers and dependencies; currently captured in discovery text and may inform B10 suggestions | A generic condition entity has no agreed lifecycle, ownership, or relationship to Goals/Actions | Ask contextually; retain unconfirmed information as proposal/assumption. Persist only through an approved existing owner once the domain meaning is defined. B10 orchestrates; B03/B05/B07 own resulting records. | Later contract decision / **UPGRADE** |
| Internal/external foundation and resources | Identify skills, time, support, and resources that affect a plan | Prototype fields may imply a resource inventory that does not exist | Use optional, purpose-specific discovery prompts. Keep answers in the discovery/proposal context until a durable resource model is approved. | Later / **DEFER** persistent resource catalog |
| Initial reason / motivation | Keep the plan connected to why the user cares | A required motivation field can feel intrusive and does not necessarily change execution | Optional short context, asked only if it can alter the plan or user wants it recalled. No separate Motivation module. | MVP optional / **INTEGRATE** into discovery context |
| Risk assessment | Make likely obstacles and uncertainty visible | A risk score can look objective without evidence | B10 returns concise concerns, their basis, assumptions, and alternatives. Label uncertainty; never silently downgrade or replace the user's goal. | MVP / **UPGRADE** |
| Goal Tree iterations; core/critical goal | Understand how outcomes relate and focus on pivotal work; B03 hierarchy exists | A tree can over-decompose; “core/critical” lacks an agreed test and may imply a new status/rule | Preserve hierarchy as a view of Goal relationships. AI proposes only justified children; user edits. Show importance as explanation/proposal annotation until “critical” has defined behavior. B03/B10. | MVP tree; critical label later / **MERGE**, critical semantics **OPEN** |
| Stage / Chunk | Break a large effort into manageable periods | Terms overlap with Goal, Milestone, and schedule; no stable business meaning demonstrated | Use existing Milestones for outcome checkpoints and Actions for executable work. Do not add Stage/Chunk entities until a specific use case cannot be represented correctly. | **OPEN** semantics; no MVP entity |
| Calendar preview | Place work in time and see commitments; B07 planning and calendar already exist | Calendar presentation alone cannot guarantee realistic availability or resolve conflicts | Keep calendar as a view of persisted schedule records. Future AI daily plans may use known Actions/deadlines/schedule only, surface assumptions, and require approval; never invent free time. | Existing MVP plus later E06 / **MERGE** |
| Checklist | Know what to do and mark execution | A second checklist model duplicates Action/status/history | Use B05 Actions and existing execution history; improve action-focused presentation in Goal and planning contexts. | MVP / **INTEGRATE** |
| Data Table | Record outcomes or measurements | General table builder introduces arbitrary schema and competes with B06 | Build focused Measurement capture/history on B06 definitions and values after authenticated routes/UI and progress rules are ready. | Later foundational slice / **UPGRADE** |
| Mathematics / formulas | Understand quantities, targets, and relationships | A general formula/algorithm engine adds security, validation, and explainability problems | Support deterministic domain calculations only where an approved C06/C08 rule requires them. Show units, inputs, and calculation source. No arbitrary formula engine. | Advanced / **REJECT** generic engine; retain specific calculations |
| Docs / supporting information | Keep references near a goal | File/document ownership, storage, permissions, and privacy behavior are not established by the concept | Link to existing user-provided context only if a supported storage model exists; otherwise keep text context modest and avoid implying document management. | **OPEN**; defer uploads/library |
| Unified popup | Reduce navigation cost for create/edit/detail | One modal for all domain tasks can hide ownership, relationships, and complex review | Reuse compact dialogs for focused edits; use dedicated contextual screens/panels for Goal discovery, tree, proposal review, and planning. | Pattern only / **UPGRADE** |
| Integrated Vietnamese goal-management prototype | See end-to-end goal/project/execution concepts together; language and layout evidence | Combines many concepts in a single surface; prototype state is not approved domain behavior | Use as journey evidence and localize deliberately; maintain one domain owner per fact and progressive disclosure. | **MERGE** as reference, not import |

## 3. Product direction and experience proposal

### Product definition

FLOW-UP should feel like a **goal-to-next-action workspace**: it helps a person clarify an intended result, make a proportionate plan, execute it, and learn from recorded evidence. Its differentiator is a connected path from intention to action and review. AI is a contextual analyst and proposal maker inside that path; it is not the product's home screen or an unrestricted conversation surface.

### Primary journey

1. **Start** with “What do you want to make progress on?” Offer create manually, start from an existing Project, or ask for AI help. Project is optional.
2. **Clarify** only details that can materially change the proposal. Keep skip/edit available for optional questions. Show what came from the user and what is inferred.
3. **Assess** constraints and feasibility with concise concerns, uncertainty, and useful alternatives. The user decides whether to continue or revise.
4. **Shape** a proportionate Goal hierarchy, Milestones, Actions, and (when supported) Measurement suggestions. Explain why a proposed item helps; avoid arbitrary depth/counts.
5. **Review** suggestions in a clearly unsaved state. Permit editing, selection, and rejection. Explicit approval applies through owning modules; partial outcomes remain visible and retry-safe.
6. **Execute** from Goal context or Planning. Keep the next useful action prominent; schedule and calendar remain views of B05/B07 data. Manual action updates never trigger AI.
7. **Review** only from actual recorded execution and Measurement data. Show missing evidence and calculation rules; AI may suggest adjustments but the user approves changes.

### Screen roles and visual direction

| Surface | Main job | Visual treatment |
|---|---|---|
| Home | Resume meaningful work and orient quickly | One primary next step, a few verified summaries, recent goals/projects. Avoid decorative totals or an all-purpose widget wall. |
| Project | Provide optional context across related Goals | Calm overview with Goal list/tree and current focus. Project is not a required planning stage. |
| Goal overview/tree | Explain the intended outcome, its checkpoints, and executable work | A readable outline/tree with expandable detail; milestone and action states remain visually distinct. Use emphasis sparingly for user-selected focus. |
| Discovery | Help shape intent without demanding a complete brief | Focused input and staged result panels; AI output visually marked “suggested / confirm”; no chat transcript framing. |
| Proposal review | Make consequences of approval understandable | Hierarchical proposal with item selection/editing, unsaved status, partial-save state, and explicit apply/reject actions. |
| Planning/calendar | Help the user choose and schedule work | Action-first list plus calendar view of actual schedule. Avoid claiming availability the app does not know. |
| Measurement/review | Capture result evidence in Goal context | Typed values, latest recorded value and ordered history; numeric sparkline appears only after two recorded points. Goal outcome progress remains explicitly unknown when rules are missing. |

Use visual hierarchy before more prose: concise headings, contextual help, progressive disclosure, clear empty/loading/error states, and consistent status/provenance cues. Provide full privacy/cost detail in accessible secondary disclosure; keep the material external-processing notice near the AI action. Avoid charts that turn missing or unconfigured rules into fake precision.

### Data and trust rules

- User input remains user-confirmed only when the user explicitly supplied or confirmed it.
- Existing persisted records are system-recorded and must be fetched through authorized module boundaries.
- AI interpretations and proposals remain labeled as inferred/proposed until accepted.
- Missing information is displayed as missing, not filled with plausible values.
- AI never directly writes domain tables. Approved changes go through the owning services with ownership, relationship, and business-rule validation.
- The same manual Goal/Action/Planning path remains available when AI is absent, disabled, rate-limited, or rejected.

## 4. Module responsibility map

| Existing module | Responsibility in the evolved experience | Work required before expanding scope |
|---|---|---|
| B02 Workspace/Project | Optional context and project-first entry | Ensure discovery can be entered with or without project context; no “Nascent Project” subtype. |
| B03 Goal | Authoritative outcomes and flexible hierarchy | Continue using current Goal services and hierarchy rules. |
| B04 Milestone | Checkpoints/outcome stages | Use for meaningful checkpoints only; do not equate every Stage/Chunk label with a Milestone automatically. |
| B05 Action | Executable work and recorded execution | Reuse for checklists/proposals and daily planning context. |
| B06 Measurement | Definitions and recorded result values | Implemented authenticated API and Goal UI. MVP value types are NUMBER, TEXT, BOOLEAN; unit changes are blocked after records exist. |
| B07 Planning | Schedules and calendar data | Any future AI daily plan is a proposal over existing data and requires explicit approval. |
| B08 Progress | Deterministic authoritative calculation | Reports Action completion ratio as an execution metric. Goal outcome and measurement target percentages remain unconfigured because target direction and aggregation rules are open. |
| B09 Review | Evidence-based review | Progress summary and actual Measurement history are available; persistent review notes/history and full review interface remain future work. AI cannot fabricate history. |
| B10 AI Orchestration | Provider calls, structured validation, proposal lifecycle, provenance and bounded usage | Add context only with explicit data minimization/authorization and contracts; keep provider credentials server-side. |

No new module, source of truth, or entity is proposed for Stage/Chunk, resource catalog, generic documents, widget configuration, or formula execution.

## 5. AI and provider assessment

The current implementation already has a focused E01/E02/E03/E04/E05-style flow: goal understanding and clarification, feasibility feedback, structured proposal, review/edit/selection, explicit application, and persistent partial results. Output is schema-validated, server-side Gemini integration is configured through `@google/genai`, and API errors map provider rate limiting to an actionable status. Input is bounded in the UI and backend validation; the service contains usage controls. Manual workflows remain available.

Current limitations that should remain explicit:

- The UI's “feasibility” result is generated from the submitted text and clarification answers, not a comprehensive scan of saved schedules, resources, measurements, or history.
- Applying proposals covers Goal, Milestone, Action, and typed Measurement definitions. AI daily planning and evidence-based AI review are future work.
- A live Gemini request was attempted but outbound networking is blocked in this environment (EACCES). Mocked provider and end-to-end API tests pass. Browser-based E2E remains unavailable because no browser runner is configured.
- Gemini Free Tier handling can change. Verify current Google model availability, SDK behavior, quotas, prices, and product-improvement/data-use terms against official sources before enabling a public demo. Minimize sensitive user content and keep the notice accessible at the point of use.

Do not expand to a general chatbot or multi-provider framework. The next AI increment should wait for product value and data contracts: (1) purpose-limited authorized context, if needed; then (2) daily planning using existing B05/B07 records; then (3) review assistance only after B06/B08/B09 evidence is available.

## 6. Prioritized implementation plan

### Completed — Trust, accuracy and core experience

- Replaced the home “Completed actions” placeholder with a count fetched from B05 Action records and added next Action/upcoming schedule surfaces with loading/error/empty states.
- Shortened the point-of-use AI data notice and kept additional privacy guidance accessible.
- Reconciled API/setup/frontend status documents against implemented routes and services.

### Follow-up — Complete the broader core journey

- Improve discovery feedback/loading/retry and proposal navigation states in the existing React flow.
- Verify selected/edited proposal dependencies and applied-item behavior against service invariants.
- Add browser-driven acceptance coverage for manual goal creation, Measurement history and mocked AI discovery through application; retain service-level tests for failure, authorization, quota and idempotency.
- Audit keyboard/screen-reader behavior and responsive layouts with a browser runner.

### Follow-up — Evidence and execution foundation

- Approve target direction and Goal aggregation rules before displaying Goal-level percentages or charts.
- Complete B09 review reads/notes from actual Action execution and Measurement data.

### P3 — Contextual assistance

- Define a minimal, authorized context contract and purpose-specific context reader for Discovery/feasibility. Include only relevant records and identify them as SYSTEM_RECORDED.
- Consider an opt-in AI daily-plan proposal over existing Actions, deadlines, durations and schedules. Never infer free time. Apply through B07 with conflict validation and explicit approval.
- Add AI review/improvement proposals only after deterministic evidence and history are available.

### P4 — Later concepts

- Decide whether resources, supporting documents, Stage/Chunk, and critical/core semantics solve a concrete uncovered user problem before adding persistence.
- Add advanced math only as specific approved domain rules, not as a generic formula engine.
- Explore charts only where data volume and deterministic meaning support them.

## 7. Open decisions

1. What behavior (if any) should “core/critical Goal” change, and who sets it?
2. Is Stage/Chunk a time period, a deliverable, a grouping, or merely a planning label? Existing Goal/Milestone/Action should remain the default until answered.
3. What is the approved B08 progress rule for a Goal with mixed Actions and Measurements, and how should unconfigured progress appear?
4. What Measurement value types/history operations and target semantics are in scope for the web MVP?
5. Are resource inventories and attached documents necessary for the first user journey, and what ownership/privacy model would govern them?
6. What saved project/goal context may B10 retrieve for each workflow, and what must be explicitly opted into?
7. What is the intended browser E2E environment and isolated database setup, given the existing ignored local database?

## 8. Verification notes

- Frontend typecheck: PASS.
- Backend typecheck: PASS.
- Frontend tests: 6 PASS, including home summary and create/record Measurement workflow.
- Backend tests: 185 PASS, including authenticated Measurement routes, cross-user denial, validation, file-backed persistence across restart, and mocked AI Measurement proposal application.
- Focused ESLint on changed implementation files: PASS. Full-repository lint has unrelated pre-existing violations; the expanded integration test file also has existing explicit `any` findings.
- Production build: PASS after the final UI/provider changes.
- Local run smoke check: PASS. The backend health endpoint, Vite frontend, and Vite `/api` proxy returned HTTP 200 with an isolated temporary database. Live Gemini request: attempted and blocked by outbound network `EACCES`; browser E2E: unavailable because no browser runner is configured.

## 9. Data and progress decisions implemented

- Measurement records are append-only. Current value resolves by latest `recordedAt`, then latest `createdAt`, then stable ID.
- MVP Measurement value types are `NUMBER`, `TEXT`, and `BOOLEAN`. Units apply only to numeric definitions. Unit changes are rejected after values exist; target edits do not rewrite history.
- Action completion is `completed active Actions / total active Actions × 100`, shown only as “Actions complete.” No active Actions is not reported as 0%.
- Goal outcome progress remains `RULE_NOT_CONFIGURED`. Target direction and cross-source aggregation are OPEN; no inferred Measurement or Goal percentage is shown.
- Measurement storage uses additive idempotent schema creation. No destructive migration, local database reset, or existing-data rewrite was performed.
