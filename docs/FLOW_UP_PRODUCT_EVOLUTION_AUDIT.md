# FLOW-UP Product Evolution Audit

> **Current audit and product direction:** this document contains an earlier audit whose initial capability table is stale. Use [`FLOW_UP_PRODUCT_RETHINK.md`](FLOW_UP_PRODUCT_RETHINK.md) for the current checkout audit, complete scratch reconciliation, experience proposal, and roadmap. Historical sections below are retained as prior implementation context and must not be read as the current source status.

**Status:** Audit and implementation proposal  
**Baseline branch:** `main`  
**Baseline HEAD:** `de75249a419501df43f1c97eeb3a8ddfd35da4dc` (`chore: checkpoint before product evolution`)  
**Canonical blueprint:** [`FLOW-UP_MASTER_BLUEPRINT_v0.4.md`](../FLOW-UP_MASTER_BLUEPRINT_v0.4.md)  
**Scratch source:** `scratch_idea/` (including `scratch_idea_spec.md` and all prototype files)  
**Verification date:** 2026-11-18

## 1. Repository audit

### Repository state and source precedence

- The checked-out branch is `main`; `.git/HEAD` points to `refs/heads/main`, whose current ref is the HEAD above.
- The scratch specification's audited commit (`6cff17a`) predates the current checkpoint and is not a reliable statement of the current source state.
- The root Master Blueprint v0.4 is the most current, explicit project blueprint. The Engineering Blueprint v0.1 package and its `CURRENT_STATUS.md` contain earlier, contradictory states (including an unimplemented shared workspace without authentication). Treat them as historical reference until reconciled; they do not supersede v0.4.
- Git CLI is unavailable in this environment. Direct comparison of tracked working files with `.git/index` found extensive pre-existing differences, including the current blueprint, scratch specification, application container, server entry point, AI orchestration service, and main frontend. The index's relationship to packed HEAD objects could not be fully checked, so staged state is unknown. No existing file was reset or replaced during this audit.
- `data/flow-up.db` and its SQLite sidecars are present and ignored by Git. They may contain development data and must not be removed or reinitialized as part of verification.

### Existing implementation (verified by source inspection)

| Area | Current state | Gap relevant to this work |
|---|---|---|
| Web | React 18, TypeScript, Vite app with workspace/project, goal, milestone, action, planning/calendar, progress/review and authentication flows. | No structured AI goal discovery/review interface was found. Measurement HTTP routes and a complete Measurement UI are documented as unavailable. |
| API/backend | TypeScript application modules, HTTP router, authenticated routes, service/repository boundaries, SQLite persistence, and Supabase/local development authentication. | Measurement services exist but are not registered as HTTP routes. Review support is incomplete. No Gemini provider adapter or AI routes are registered. |
| Domain | C01–C09 contracts and validators are present. Goal hierarchy and action/planning/progress/review rules are represented in existing domain modules. | Several business decisions remain open in the blueprint; do not infer rules for stage/chunk semantics, arbitrary progress aggregation, recurrence, or review history. |
| B10 AI | AI orchestration service/types/ports support operation dispatch, context reading, validation, proposal lifecycle, approval and domain-applier interfaces. | It is not wired to a real provider, persistent proposal repository, authenticated API route, context adapter, owning-module applier, or frontend. Proposal persistence is explicitly disabled in current service configuration/tests. |
| Persistence/runtime | SQLite schema and initializer, API base URL configuration, Vite proxy, and `.env.example` exist. | A local DB already exists; fresh DB verification must use a separate temporary path. Runtime and primary UI/API journey have not yet been manually verified. |
| Tests | Frontend and backend unit/integration suites use Vitest. | No browser-driven end-to-end suite or live-provider verification is established. |

### Baseline commands

Local binaries were used directly because PowerShell blocked `pnpm.ps1`, and `pnpm.cmd` could not open its global store lock. No dependency installation was completed.

| Check | Result |
|---|---|
| Dependency install (`pnpm install --frozen-lockfile --offline --ignore-scripts`) | NOT VERIFIED — shared pnpm store lock access denied |
| Frontend typecheck (`tsc -b --pretty`) | PASS |
| Backend typecheck (`tsc -p tsconfig.backend.json --noEmit`) | PASS |
| Lint (`eslint .`) | FAIL — 19 existing lint errors across backend, scratch prototypes, and environment types |
| Frontend tests | PASS — 3 tests |
| Backend tests | PASS — 178 tests across 38 files |
| Production frontend build | PASS — emitted to a temporary directory outside the repository |
| Database initialization / server startup / health / browser workflow | NOT RUN — reserved for isolated runnable-MVP verification after integration |
| Live Gemini request | NOT VERIFIED — no API key or provider adapter is configured |

## 2. Scratch source inventory

The folder contains 15 prototype/artifact files plus the written specification. Several files are alternate or linked iterations of the same concept; they are treated as evidence for concept extraction, not as independent approved feature requirements.

| Source artifact(s) | Identifiable concept represented |
|---|---|
| `1_homescreen_preview.tsx` | Home/workspace entry and overview dashboard |
| `2_nascent_project.tsx` | Early goal/project discovery; context, desired outcome, resources, conditions, constraints and motivation |
| `3_goal_tree (1).tsx`, `4_goal_tree.tsx` | Goal hierarchy/tree, decomposition, core/critical goal, stage/chunk labels |
| `5_data_table.tsx` | General data tables and recording structured values |
| `6_mathematics.tsx` | Calculations, relationships, formulas or algorithm experiments |
| `7_current_project.tsx`, `7_current_project (1).tsx` | Current project overview and execution context (duplicate iteration) |
| `8_calendar_preview.tsx` | Calendar and time-based action planning |
| `9. docs.tsx` | Supporting documents/reference information |
| `10_current_unified_popup.tsx` | Unified create/edit/detail popup interaction pattern |
| `11_widget_suite_all_in_one_linked.tsx` | Linked widget suite and execution dashboard |
| `ng_d_ng_qu_n_l_d_n_m_c_ti_u_h_p_nh_t (1).tsx` | Integrated Vietnamese goal-management prototype, consolidating goal/project/tree/execution concepts |
| `project_flow (1).html` | End-to-end project/goal flow prototype |
| `scratch_idea_spec.md` | Product direction, workflows, concept matrix, module expectations and unresolved choices |

## 3. Concept reconciliation matrix

| Original idea | User value | Existing equivalent / issue in rough form | Improved interpretation and owner | AI / non-AI behavior; phase | Decision and rationale |
|---|---|---|---|---|---|
| Nascent Project / start from an emerging intention | Start before the user has a fully specified plan | Existing Goal and Project entry paths exist; a special project subtype would duplicate B02/B03 | Goal Discovery draft/workflow using B02 context and B03 Goal creation; keep discovery separate from official records | AI structures intent and finds gaps; deterministic validation and normal B02/B03 writes. First AI slice. | **UPGRADE** — preserve incomplete-input entry, without a new entity subtype or premature Goal Tree writes |
| Final Goal / intended outcome | Make the desired result explicit | B03 Goal supports a title, description and optional date; a rough form may imply more required fields than approved | Root Goal remains the authoritative outcome; success criteria remain proposal/context until existing contracts support them | AI extracts outcome and flags uncertainty; user confirms official Goal content. First AI slice. | **MERGE** — preserve in B03, avoid a second “final goal” record |
| Conditions, constraints and prerequisites | Reveal what affects feasibility | No generic condition module is approved; rough concepts mix facts, preferences and assumptions | Keep typed discovery context and proposal observations; persist only in an existing owner when a user confirms a supported fact | AI can identify candidate constraints; deterministic validation; confirmation required. First AI slice. | **UPGRADE** — structured context now, no duplicate generic entity |
| Internal/external foundation, resources and support | Show what capabilities or resources are available | Existing modules do not define a universal resource inventory; conflating skills, people, time and tools is ambiguous | Use concise, optional discovery fields and explain what is unknown; introduce no standalone resource store | AI may ask materially relevant questions; user supplies/confirms values. First AI slice. | **UPGRADE** — retain meaning as optional context pending a defined resource model |
| Risk assessment and consequences | Surface risks early enough to adjust | No risk module or approved risk lifecycle exists; a prototype score could look authoritative | Return evidence-linked risk observations and uncertainty in B10 feasibility output; user decides response | AI proposes observations; no automatic score or official risk facts. First AI slice. | **INTEGRATE** — belongs in feasibility feedback, not a new module |
| Initial reason / motivation | Connect the goal to the user's reason for pursuing it | Motivation is not an existing domain record and may be sensitive | Optional user-confirmed discovery context; omit from provider payload unless needed and authorized | AI can use only explicitly supplied context; deterministic persistence policy is open. First AI slice. | **DEFER** for durable storage; **INTEGRATE** as optional discovery input only when useful |
| Goal Tree / hierarchical breakdown | Turn a broad goal into an understandable structure | B03 already owns a flexible-depth hierarchy; scratch variants risk fixed depth/child counts | Propose Goal/Milestone/Action items as a reviewable B10 proposal; apply through owning services | AI proposes; schema and semantic checks are deterministic; explicit approval required. First vertical slice. | **UPGRADE** — retain tree view, make proposal non-authoritative until approval |
| Core/critical Goal | Highlight the nodes most important to success | “Core” could mean importance, dependency, risk or critical path; no approved semantics | Show concise proposal rationale/dependency notes without a persistent core flag until definition is approved | AI may explain why an item appears important; no deterministic business effect yet. Later. | **OPEN** — meaning is not safe to infer |
| Stage/Chunk | Group work into phases or manageable pieces | Existing Goal, Milestone and Planning concepts overlap; prototype does not define lifecycle or ownership | Use Goal for outcome decomposition, Milestone for checkpoints, Action for executable work; revisit only with concrete unmet need | Deterministic existing structures; AI proposes them in the goal proposal. First slice uses only these existing concepts. | **MERGE** — express supported meaning through existing concepts; retain “Stage/Chunk” as an unresolved label, not an entity |
| Calendar | See and organize work over time | B07 Schedule and frontend Planning/Calendar already exist; disconnected views would duplicate schedule data | Continue as a view over authoritative B07 schedule/action data | Deterministic; AI Daily Plan is later and must propose schedule changes for approval. | **INTEGRATE** — reuse existing data and screens |
| Widget Suite / all-in-one linked dashboard | See the next relevant work and state at a glance | A general builder adds configuration/state without a product need | Fixed execution overview assembled from B02–B09 owners (today's plan, next action, checkpoint, measurement prompt) | Deterministic read model; AI entry point is explicit and event-triggered. Later polish. | **UPGRADE** — fixed dashboard, no widget engine |
| Checklist | Break work into executable tasks | B05 Action already represents execution; a separate checklist store duplicates actions | Use Action list/checklist presentation and existing status/execution operations | Deterministic; AI may propose Actions for approval. First slice includes proposed Actions only if useful. | **MERGE** — B05 owns the records |
| Data Table | Record outcomes or metrics | B06 Measurement and history exist in services/domain; generic table builder is a different product | Surface Measurement definition/current value/history through B06 routes and UI | Deterministic capture and validation. Measurement integration follows the AI slice or is pulled forward only if required to verify proposal-generated data. | **UPGRADE** — focused Measurement UI, no arbitrary columns/table engine |
| Mathematics / formulas / algorithms | Understand quantitative relationships and progress | B08 owns approved progress rules; arbitrary formulas introduce security and semantic questions | Continue only approved deterministic B06/B08 calculations with visible basis; no user code/formula execution | Deterministic only; AI can explain supplied results, never invent calculations. Later. | **DEFER** — general formula/algorithm system is outside MVP and has no approved rules |
| Docs / supporting reference material | Keep context near a goal | No clear attachment, note, versioning or retention owner is approved | Keep current supported descriptions; define Notes/Docs ownership and relationships before adding a store | Manual first; AI context use requires explicit source/authorization. Later. | **OPEN** — product meaning and owner are undefined |
| Current Project overview | Understand active work in its project context | B02 and existing project screens already provide project context; duplicated prototype files suggest iteration, not separate features | Improve the existing Project overview with links/read models from owning modules | Deterministic. Later UX refinement. | **MERGE** — one B02 Project record and existing overview |
| Home screen / execution overview | Orient the user and point to a next action | Existing app shell/workspace screens exist; a prototype dashboard could become duplicate navigation | Use a fixed overview in the existing shell and preserve current entry paths | Deterministic; no AI call merely to open the screen. Later UX refinement. | **UPGRADE** — reuse A01/A02 and module reads |
| Unified popup / shared create-edit interaction | Reduce navigation for common operations | Prototype interaction is not itself an approved domain workflow | Reuse design-system dialog/form components only where they fit existing operations | Non-AI. Later UI refinement; not a separate module. | **MERGE** — reusable interaction pattern, not a new data capability |
| Integrated goal-management prototype / project-flow HTML | Demonstrate an end-to-end mental model | Prototype state and transitions are not authoritative rules; may combine concepts whose owners differ | Use as UX reference, validate every action against current API and owning service | AI only for explicit workflows; persisted records remain API-backed. First slice takes the goal-discovery path only. | **UPGRADE** — retain useful journey cues, do not copy prototype behavior/data wholesale |

## 4. Upgraded product flow and ownership

1. **Enter and choose context (A01/A02, B02):** open an existing Workspace/Project or begin an independent Goal path under current rules. Keep manual creation available.
2. **Describe the intended outcome (A03/A10, B10):** user enters natural language and optional context. Input remains a draft; no official Goal is written by AI analysis.
3. **Understand and clarify (B10):** return structured known facts, inferences, missing information and only useful clarification questions. User answers, skips optional questions, edits or continues manually.
4. **Assess feasibility (B10):** explain constraints, risks, dependencies and uncertainty; do not replace the user's goal.
5. **Propose a small structure (B10):** return a schema-validated proposal of root/child Goals, Milestones, Actions and measurement suggestions only where supported. Mark proposal items and provenance clearly.
6. **Review and apply (A10, B10, B03–B06):** user edits/selects/rejects; explicit approval precedes writes through the owning services. Application is idempotent and reports item-level outcomes. A partial result must never be shown as wholly applied.
7. **Execute and measure manually (B05–B07, B06):** existing Action, Planning and Schedule operations remain available. Measurement API/UI gaps must be closed before claiming measurement workflows are end-to-end.
8. **Review actual evidence (B08/B09, later B10):** use only recorded data and approved progress rules; AI recommendations remain separate from authoritative records.

AI calls are explicit user-triggered operations. Opening screens and ordinary status updates do not call the provider. If AI is unavailable, users can still create Goals/Actions and plan manually.

## 5. Proposed first implementation slice

### Scope

Implement **Goal Input → Understanding/Clarification → Feasibility → Structured Proposal → User Review/Edit → Explicit Approval → Existing domain records**. Keep it bounded to B10 and existing B02–B06 services, with the smallest required routes/UI integration. Include only supported fields and existing contracts. Add no Stage, Chunk, resource, risk, notes, or provenance persistence entity.

### Existing files and seams to reuse

- B10: `backend/src/modules/ai-orchestration/*` (existing orchestration contracts/service) and `backend/src/application/container.ts`.
- HTTP/server: `backend/src/api/*`, existing auth context, `backend/src/server/app.ts` and `index.ts`.
- Provider configuration: `.env.example`; add server-only Google integration behind B10, after SDK/runtime compatibility is validated.
- Existing domain services: `backend/src/modules/{goal,milestone,action,measurement}/*` and their repository ports.
- UI/API: `src/app/App.tsx`, `src/lib/api.ts`, existing styles and app shell.
- Verification: existing Vitest suites and API integration test conventions.

### Required contracts and reliability

- Define typed schemas for understanding, clarification, feasibility, and proposal outputs, including provenance/confirmation labels.
- Validate provider JSON structurally and semantically; validate all references, scope and ownership using existing services before apply.
- Persist proposal/application state durably before enabling approval. Use idempotency and per-item results; never write owning tables directly from B10.
- Authenticate and authorize every proposal read/edit/apply operation. Rate limits and bounded input/output/regeneration need an explicit configurable policy.
- Do not send secrets or unnecessary personal context to the provider. Do not log full sensitive prompts by default.
- Handle missing key, timeout, invalid output, HTTP 429/quota, provider failure and partial application with clear recovery states.

### Provider check

As of 2026-11-18, Google's official Gemini API model list identifies `gemini-3.8-flash` as a stable model. Official documentation lists the `@google/genai` JavaScript/TypeScript SDK and Structured Outputs with a supported subset of JSON Schema. The Free tier has model-dependent rate limits and says content may be used to improve Google products; paid tier content is not used for that purpose. Free availability is not unlimited or guaranteed, so minimize sensitive context and make caps/configuration explicit. References: [models](https://ai.google.dev/gemini-api/docs/models), [structured outputs](https://ai.google.dev/gemini-api/docs/structured-output), [billing and tiers](https://ai.google.dev/gemini-api/docs/billing), [pricing](https://ai.google.dev/gemini-api/docs/pricing).

### Known blockers and open decisions

- The scratch proposal/application reliability requirements need a durable proposal store and safe multi-module retry semantics. Existing proposal persistence is disabled; do not enable it with an in-memory or non-idempotent implementation.
- The blueprint's remaining auth, measurement, planning, progress, review and deletion decisions must remain open where they affect behavior.
- Core/Critical Goal, Stage/Chunk, Docs/Notes ownership, resource persistence, and risk persistence remain OPEN as stated in the matrix.
- The current environment cannot produce a normal Git status/diff because Git is unavailable and HEAD objects are packed. Before finalizing source edits, preserve the existing working tree and ensure the new changes can be distinguished by review.

## 6. Follow-up sequence

1. Complete architecture/code-ready decisions for B10 provider contracts, proposal durability, idempotency and partial failure.
2. Implement and verify the bounded goal-discovery/proposal vertical slice with mocked provider responses.
3. Add the Gemini server adapter and test the real provider only when a valid key is supplied; never claim live verification otherwise.
4. Close B06 HTTP/UI integration needed for Measurements and verify real SQLite persistence.
5. Run fresh-database initialization, backend health, frontend startup/API connectivity, and a browser-driven primary journey using a temporary DB path.
6. Update the canonical blueprint with only verified implementation state, limitations and open decisions.
7. Reconcile or archive older blueprint files in a separate explicitly scoped documentation task; do not silently rewrite their approved history.

## 7. Implementation and final verification update (2026-11-18)

The first vertical slice has been implemented in the current working tree:

- B10 uses `@google/genai` 3.5.0 with default model `gemini-3.8-flash`, structured JSON schemas, bounded output, timeout normalization, per-user/global UTC-day limits, and server-side key configuration.
- Authenticated routes provide goal understanding, feasibility, proposal create/read/edit/reject/apply. Proposal and usage data persist in additive B10-owned SQLite tables.
- Proposal output is validated before storage/application. User edits are validated again before application. Goal/Milestone/Action changes go through existing owning services.
- Approval uses a persisted compare-and-set state to reject concurrent/duplicate application. Successful item results are retained across retries; unsuccessful items can be retried without reapplying successful ones.
- The React app includes typed clarification inputs, feasibility feedback, editable/selectable proposal items, explicit approval/rejection, pending proposal restoration in the browser session, and a manual path.
- `docs/LOCAL_DEMO.md` and the canonical blueprint addendum document setup, AI data handling, verification and limitations.

### Final verification

| Verification | Result |
|---|---|
| SDK dependency resolution | PASS — `@google/genai@3.5.0` installed and present in package manifest, pnpm lock and npm lock |
| Frontend typecheck | PASS |
| Backend typecheck | PASS |
| Frontend tests | PASS — 4 tests |
| Backend tests | PASS — 185 tests, including mocked provider journey, ownership, persistence across restart and duplicate-approval rejection |
| Focused lint on new AI/API/UI code | PASS |
| Full lint | FAIL — 19 existing lint violations elsewhere in the repository, including scratch prototypes |
| Production build | PASS |
| Fresh database initialization | PASS using a temporary database path |
| Backend startup / health | PASS |
| Frontend startup | PASS — HTTP 200 |
| Frontend-to-backend integration | PASS — Vite proxy, registration, workspace creation, manual Goal write/read and no-key AI fallback |
| Mocked AI primary journey and persistence | PASS — Goal, Milestone and Action restored after server restart |
| Real Gemini API call | NOT VERIFIED — no API key supplied |
| Browser-driven end-to-end suite | NOT RUN — no browser E2E runner is configured |

### Verified limitations

- Goal Discovery applies only Goal, Milestone and Action items; Measurement integration is still missing its HTTP routes/UI.
- AI Daily Plan, AI Review and adjustment suggestions are not implemented.
- A process crash while a proposal is `APPLYING` can leave it requiring manual recovery; no recovery flow is implemented.
- Progress/Review behavior and the unresolved concept decisions in the matrix remain open.
- The current working tree contained extensive differences from the Git index before implementation. Git CLI is unavailable here, so normal staged/unstaged status could not be reported. No existing data database was changed, and no commit or push was made.
