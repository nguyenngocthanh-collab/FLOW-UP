FLOW-UP — AI-Assisted Product Integration Specification
Baseline: GitHub main
Current commit audited: 6cff17a40506149c6fd8b22512bddd31bdbc3b42
Reference architecture: FLOW-UP Master Blueprint v0.4
Change type: Controlled product capability integration
Status: PROPOSED — Product Owner review required
Scope: Upgrade the existing working MVP toward the intended AI-assisted goal execution product. Preserve the current architecture and existing implementation.
________________________________________
1. Product objective
FLOW-UP is an AI-assisted personal goal execution system.
Its purpose is not merely to store Goals, Actions, schedules, and progress. It must actively help users understand what they want to achieve, organize the work required, make realistic plans, execute them, measure results, and improve their approach.
The product combines:
•	AI-assisted reasoning and structured proposals.
•	Deterministic application/domain rules.
•	Manual user control and editing.
•	Persistent, authoritative domain data.
•	Evidence-based progress and review.
The system must reduce the amount of planning and organizational work users must perform themselves without removing their control over decisions.
Product principle
The user provides intent, context, and decisions. FLOW-UP provides structure, analysis, organization, and execution support.
AI is a core MVP capability, not a later optional enhancement.
2. Scope and constraints
2.1 Baseline to preserve
•	GitHub main is the source of truth for implementation.
•	Preserve approved L0, L1, and L2 architecture unless the Product Owner explicitly approves a change.
•	Preserve the B01–B10 module boundaries and C01–C09 domain responsibilities.
•	Keep one authoritative owner for each business fact.
•	Preserve Goal-first and Project-first entry paths.
•	Keep Goal, Milestone, and Action as distinct concepts.
•	Keep manual workflows usable when AI is unavailable.
•	AI proposals must be reviewed and approved before becoming official data.
•	Web is the MVP client; domain logic and APIs must not become browser-specific.
2.2 Explicitly excluded from this integration
•	Replacing the existing frontend or backend.
•	Rewriting the domain architecture.
•	Building a second AI orchestration module.
•	Building a general-purpose widget builder.
•	Building a custom Data Table engine.
•	Building a general-purpose formula or algorithm execution engine.
•	Building autonomous goal changes or autonomous rescheduling.
•	Building team collaboration or native mobile applications.
•	Importing prototype state or demo records as production data.
•	Treating prototype UI behavior as an approved business rule.
2.3 Implementation discipline
•	Inspect current source before editing.
•	Modify only files required by an approved bounded part.
•	Do not rename, move, or delete existing folders/configuration without approval.
•	Do not invent unresolved domain rules.
•	Do not update main directly as an unreviewed experiment.
•	Each coding part must have explicit acceptance criteria and tests.
•	Update the Master Blueprint as the only project architecture/development source of truth.
________________________________________
3. Target end-to-end user journey
Stage 1 — Discover the goal
User input: A natural-language description of a desired outcome.
The user may optionally provide:
•	Project or independent Goal context.
•	Expected timeframe.
•	Current situation.
•	Known constraints.
•	Available resources.
•	Existing work or progress.
The user must be allowed to begin with incomplete information.
System behavior:
1.	Validate the basic input.
2.	Determine whether the user is creating a Project or an independent Goal.
3.	Create a clarification session or equivalent draft workflow.
4.	Send the minimum authorized context to B10.
5.	Return structured understanding and clarification questions.
Important: Creating a draft/discovery session must not create an official Goal Tree from unapproved AI content.
Stage 2 — Clarify and understand
B10 E01 analyzes the user's description and identifies missing information.
The system may ask about:
•	Desired outcome and how success will be recognized.
•	Current state and existing progress.
•	Available time and important deadlines.
•	Skills and experience.
•	External resources and support.
•	Constraints and dependencies.
•	Motivation or reason for pursuing the goal.
•	Risks and consequences of delay or failure.
Questions must be adaptive. Do not show a fixed long form containing every possible field.
Each question must have:
•	A clear user-facing explanation.
•	A reason it matters, when not obvious.
•	Required or optional status.
•	A way to skip optional information.
•	A way to revise a previous answer.
The system should ask only questions whose answers may materially change the proposed structure or plan.
Stage 3 — Feasibility analysis
B10 E02 evaluates the goal using available and authorized context.
Output:
•	Feasibility assessment.
•	Main constraints.
•	Important risks.
•	Resource gaps.
•	Timeframe concerns.
•	Alternative approaches where useful.
•	Explicit assumptions.
•	Unresolved questions.
The system must distinguish a reasoned concern from a factual conclusion.
The user may accept the original goal, edit it, choose an alternative, or continue with a warning.
AI must not silently replace the user's intended outcome.
Stage 4 — Structured plan proposal
B10 E03 produces a structured proposal.
A proposal may contain:
•	Root Goal.
•	Child Goals.
•	Milestones.
•	Actions.
•	Measurement definitions.
•	Suggested target values where justified.
•	Dependencies and conditions.
•	Resource suggestions.
•	Risk observations.
•	Suggested deadlines or time estimates when sufficient information exists.
The proposal must not contain arbitrary fixed hierarchy depth or fixed numbers of children.
The system must avoid unnecessary decomposition. A proposed node must have a clear purpose and contribute to the intended outcome.
Stage 5 — Review and approval
A10 displays the proposal separately from saved domain data.
The user must be able to:
•	Review the complete proposal.
•	Expand and inspect individual items.
•	Edit proposed content.
•	Accept selected items.
•	Reject selected items.
•	Reject the complete proposal.
•	Request a revised proposal.
Approval must be explicit.
Before applying a proposal:
1.	Validate its schema.
2.	Validate references and relationships.
3.	Validate domain invariants.
4.	Verify authenticated ownership.
5.	Verify the selected items and dependencies.
6.	Apply through normal owning-module operations.
7.	Record application results.
8.	Refresh all affected views.
The system must not show a proposal as applied if only part of its application succeeded.
Partial application and recovery behavior must be explicitly designed before production enablement.
Stage 6 — Execute and plan
The user can work manually or request AI assistance.
Manual workflow:
•	Create or edit Actions.
•	Add Actions to a Daily Plan.
•	Schedule Actions.
•	Record execution.
•	Update status.
AI-assisted workflow:
1.	Gather relevant approved Goals, Actions, deadlines, duration estimates, existing schedules, and other authorized context.
2.	Generate a Daily Plan proposal.
3.	Validate conflicts and references.
4.	Display reasons and assumptions.
5.	Let the user edit, approve, or reject.
6.	Apply approved schedule operations through B07.
AI planning must not create duplicate Actions simply because it is scheduling existing work.
Stage 7 — Measure and review
B06 owns Measurement definitions and records.
B08 owns authoritative progress calculation.
B09 owns Review data aggregation and review notes under approved rules.
The user should be able to understand:
•	What was planned.
•	What was recorded as executed.
•	Which results were measured.
•	What information is missing.
•	How progress was calculated.
•	What changed from the previous review.
AI may explain the data and propose adjustments, but must not invent missing execution records or progress history.
Stage 8 — Adjust
The user can request an adjustment proposal.
AI may propose:
•	Reprioritizing Actions.
•	Revising a future plan.
•	Breaking down an unclear Goal.
•	Revising a target after the user confirms the change.
•	Addressing a newly identified risk.
Changes to official Goals, deadlines, Actions, Measurements, or Schedules must use the normal approval and application process.
Autonomous modification is outside this MVP.
________________________________________
4. AI trust and information provenance
This is a required cross-cutting behavior.
Every relevant AI-generated fact or proposal item must preserve its information origin.
Recommended provenance categories:
Category	Meaning
USER_CONFIRMED	Explicitly supplied or confirmed by the user
SYSTEM_RECORDED	Retrieved from authoritative FLOW-UP records
AI_INFERRED	Reasoned interpretation, not confirmed fact
AI_PROPOSED	Suggested change or new information
NEEDS_CONFIRMATION	Information required before a decision can be trusted
These categories are conceptual labels. Their exact persisted schema remains subject to D03 and the AI proposal contract.
The UI must visually distinguish:
•	Confirmed information.
•	Existing saved data.
•	AI suggestions.
•	Assumptions.
•	Missing information.
AI must never present inferred information as user-confirmed information.
AI explanations must be concise and relevant. Do not expose hidden chain-of-thought. Provide conclusions, assumptions, evidence references, and practical reasons instead.
________________________________________
5. Prototype concept integration matrix
Original concept	Product value retained	Integration target	Decision
Nascent Project	Understand goal, context, resources, constraints, risks, motivation	A02/A03/A10, B02/B03/B10	Redesign as Goal Discovery
Final Goal	Define intended outcome	B03	Preserve
Conditions	Identify prerequisites and constraints	B10 context/proposal; relevant domain records	Redesign; no generic condition module yet
Internal/External foundation	Identify capabilities and available resources	Discovery context and proposal	Preserve meaning; redesign fields
Risk assessment	Identify risks and consequences	E02 feasibility feedback	Preserve and structure
Initial reason	Capture user motivation	Discovery context	Optional context
Goal Tree	Explain and organize decomposition	A03, B03, B10	Preserve and make AI-assisted
Core/critical Goal	Identify important or dependency-heavy nodes	B10 proposal annotations	Define meaning before implementing
Stage/Chunk	Organize progress into phases	Existing Goal/Milestone/Planning concepts	OPEN; do not create entity prematurely
Calendar	Time-oriented Action view	A08, B05, B07	Integrate existing Schedule data
Widget Suite	Execution-oriented overview	A02/A09 and existing module data	Build a fixed MVP dashboard, not a widget engine
Checklist	Perform work	B05	Preserve as Action UI
Data Table	Record meaningful metrics	B06	Preserve as Measurement UI
Mathematics	Understand relationships/calculations	B06/B08	Advanced scope; no arbitrary formula engine
Docs	Store contextual notes/reference content	Existing application model	OPEN; define separately before implementation
________________________________________
6. Functional specification by module
6.1 B02 — Workspace and Project
Required:
•	Support Project-first and Goal-first entry.
•	Preserve existing Project ownership and Workspace rules.
•	Provide the appropriate context to Goal Discovery.
•	Do not create a new Project subtype for Nascent Project.
•	Do not persist unapproved AI assumptions as Project facts.
Likely frontend integration:
•	A02 project creation and workspace entry.
•	Goal creation entry points.
Backend:
•	Reuse existing B02 operations.
•	Add only the minimum operation required for the discovery lifecycle if approved.
6.2 B03 — Goal Management
Required:
•	Preserve flexible-depth Goal hierarchy.
•	Provide a reliable Goal Tree read model.
•	Accept approved Goal proposal items through normal Goal operations.
•	Validate parent-child relationships and scope.
•	Preserve existing Goals and relationships.
•	Support manual Goal creation/editing even when AI is unavailable.
Do not:
•	Treat Goal Tree as a separate persisted entity.
•	Restrict every branch to three children.
•	Force every Goal to have a score.
•	Convert Stage into Goal without explicit domain approval.
6.3 B04 — Milestone Management
Required:
•	Accept approved Milestone proposal items.
•	Validate owning Goal.
•	Preserve existing completion behavior.
•	Provide the data required by Goal Overview and Review.
6.4 B05 — Action Management
Required:
•	Accept approved Action proposal items.
•	Preserve Goal/Milestone association rules.
•	Preserve execution records and history.
•	Supply authorized Action context for AI planning.
•	Support manual execution independently of AI.
6.5 B06 — Measurement Management
Required:
•	Expose existing service operations through authenticated HTTP routes.
•	Integrate definition, recording, current value, and history into frontend.
•	Keep Measurement distinct from custom Data Tables.
•	Validate value types, units, and targets.
•	Ensure Measurement records remain associated with the owning Goal.
OPEN:
•	Measurement cardinality.
•	Supported value types.
•	Target direction and target comparison semantics.
•	History ordering and filtering.
Do not implement progress aggregation until the relevant C08 rules are approved.
6.6 B07 — Planning and Scheduling
Required:
•	Preserve manual Daily Planning.
•	Support AI proposal application through the same schedule operations.
•	Provide date-range schedules to Calendar.
•	Keep schedule data authoritative in B07.
•	Validate schedule ownership and conflicts.
•	Prevent duplicate scheduling when applying proposals.
OPEN:
•	Schedule cardinality.
•	Recurrence.
•	Time-zone rules.
•	Daily Plan persistence and uniqueness behavior.
•	Batch atomicity for proposal application.
6.7 B08 — Progress Engine
Required:
•	Use only approved calculation rules.
•	Explain unavailable or incomplete progress states.
•	Provide source data or calculation metadata sufficient for UI explanation.
•	Never let frontend independently invent authoritative percentages.
•	Keep progress snapshots disabled until persistence rules are approved.
OPEN:
•	Measurement progress formulas.
•	Action completion contribution.
•	Child Goal aggregation.
•	Goal and Project aggregation.
6.8 B09 — Review Management
Required:
•	Implement approved source readers for B05–B08.
•	Expose Review data through authenticated routes.
•	Compare planned and actual data only when matching rules are known.
•	Preserve missing-data limitations.
•	Support a basic user review note if the relevant policy is approved.
Do not:
•	Treat a Schedule as proof of execution.
•	Treat missing execution as proof of skipped work.
•	Fabricate historical values from current progress.
OPEN:
•	Review scope.
•	Persisted Review versus on-demand Review.
•	Review lifecycle.
•	Note ownership and persistence.
•	Snapshot versus live summary.
•	Partial source failure policy.
6.9 B10 — AI Orchestration
Required implementation areas:
Provider adapter
•	Server-side credentials.
•	Provider abstraction.
•	Structured output support.
•	Timeout and normalized error behavior.
•	Usage limits and retry policy.
Context reader
•	Retrieve only authorized information.
•	Read through owning-module contracts.
•	Use the authenticated user context from B01.
•	Include only relevant context for each AI capability.
Capability implementations
•	E01 Goal Understanding and Clarification.
•	E02 Feasibility Feedback.
•	E03 Goal Tree Proposal.
•	E04 Proposal Review and Approval.
•	E05 Daily Plan Proposal.
Output validation
•	Structural schema validation.
•	Semantic validation.
•	Reference validation.
•	Domain invariant validation.
•	Rejection of malformed or unsupported output.
Proposal lifecycle
•	Durable proposal persistence.
•	Item-level selection and editing.
•	Explicit approval.
•	Rejection and expiration behavior.
•	Application result tracking.
•	Idempotency and recovery.
Domain application
•	Apply through B02–B07 normal operations.
•	Never write directly to their database tables.
•	Define transaction and partial-failure behavior before production use.
________________________________________
7. Frontend integration specification
The frontend must communicate the product's intelligent assistance without forcing users into a chatbot-only experience.
A10 — AI Assistant Interface
Required screens/states:
1.	Goal input.
2.	Clarification conversation.
3.	Feasibility feedback.
4.	Proposal overview.
5.	Proposal detail and item editing.
6.	Approval/rejection.
7.	Application result.
8.	AI unavailable/error/retry state.
Required behavior:
•	Preserve context between clarification steps.
•	Allow the user to skip optional questions.
•	Show confirmed facts and assumptions separately.
•	Display proposal items separately from saved records.
•	Allow partial approval only where the approved proposal contract supports it.
•	Prevent duplicate submission and duplicate application.
•	Provide a manual continuation path when AI is unavailable.
A03 — Goal Overview and Goal Tree
Required:
•	Overview-first default.
•	Show outcome, progress status, next checkpoint, next Action, and optional deadline.
•	Keep hierarchy expandable.
•	Provide a clear manual editing path.
•	Show AI-generated proposal content only in the review state until approved.
•	Avoid excessive node details by default.
A02 — Workspace and Project
Required:
•	Provide a clear entry point for creating a Project or independent Goal.
•	Offer AI-assisted Goal Discovery as a primary creation path.
•	Keep a direct/manual path available.
•	Do not force every Goal into a Project.
A07/A08 — Planning and Calendar
Required:
•	Display the same underlying Schedule data.
•	Support manual schedule editing.
•	Display AI proposals distinctly from saved schedules.
•	Refresh affected views after approved application.
A09 — Progress and Review
Required:
•	Show calculation status.
•	Explain unavailable data.
•	Display actual recorded values.
•	Show planned-versus-actual information only when source data supports the comparison.
•	Display AI recommendations separately from authoritative progress.
Execution Workspace
The original Widget Suite concept should be represented initially as a fixed execution-oriented overview.
Possible sections:
•	Today's planned Actions.
•	Next meaningful Action.
•	Active Goal.
•	Upcoming Milestone.
•	Measurements needing updates.
•	Recent execution records.
•	Review or AI suggestion entry point.
No user-configurable widget engine is required.
________________________________________
8. API and data integration requirements
No new API route should be added until its request/response contract and ownership checks are specified.
Required API capability groups:
Group	Required operations
Goal Discovery	Start discovery, submit answer, retrieve current discovery state
AI Clarification	Request next clarification or structured understanding
Feasibility	Generate and retrieve feasibility result
Proposal	Create, retrieve, edit, reject, approve, apply, retrieve application status
Measurement	Create/update definition, record value, retrieve current value/history
Review	Retrieve review data, save/update note where approved
AI Planning	Generate Daily Plan proposal and apply approved schedule items
The exact route paths and payload schemas must be derived from the existing API conventions.
All protected operations must:
•	Derive acting user identity from trusted authentication context.
•	Validate resource ownership.
•	Validate input at the server boundary.
•	Return the established API response envelope.
•	Use stable error codes.
•	Avoid leaking provider secrets or sensitive internal data.
Proposal application reliability
Before enabling multi-module proposal application:
•	Define idempotency keys.
•	Define duplicate-application protection.
•	Define transaction boundaries.
•	Define partial application behavior.
•	Define retry and recovery behavior.
•	Record which items were successfully applied.
•	Ensure repeated requests cannot create duplicates.
________________________________________
9. Implementation order
Implementation should proceed in bounded, independently testable parts. Each coding session should be limited to its assigned scope.
Phase 0 — Baseline audit and specification alignment
•	Confirm current main commit.
•	Read the complete current Master Blueprint in the repository.
•	Verify existing B01–B10 and C01–C09 implementation.
•	Verify frontend screens and API client.
•	Run current build, typecheck, lint, and tests.
•	Record existing failures before changes.
•	Update the Master Blueprint with the approved integration plan.
Exit condition: Current behavior and known failures are documented.
Phase 1 — AI foundation
•	Approve provider/model and cost/privacy constraints.
•	Define AI request/response schemas.
•	Define discovery and proposal persistence.
•	Define provenance and assumption representation.
•	Define context reader contracts.
•	Define proposal lifecycle and application reliability.
Exit condition: B10 has a code-ready specification.
Phase 2 — Goal Discovery and Clarification
•	Build the initial goal input flow.
•	Implement clarification session state.
•	Implement adaptive question handling.
•	Display confirmed facts, assumptions, and missing information.
•	Support manual continuation.
Exit condition: User can describe a Goal, answer clarification questions, and receive a validated structured understanding.
Phase 3 — Feasibility and Goal Tree Proposal
•	Implement feasibility feedback.
•	Implement structured Goal Tree proposal.
•	Include relevant Milestone, Action, and Measurement suggestions.
•	Build proposal review/edit UI.
•	Implement approval boundary.
•	Apply approved items through B03–B06.
Exit condition: A user can complete the Goal Discovery → Proposal → Approval → Saved Goal journey.
Phase 4 — Measurement and execution integration
•	Implement B06 HTTP routes.
•	Integrate Measurement UI.
•	Connect records and history.
•	Improve execution workspace.
•	Preserve B05 execution ownership.
Exit condition: User can record and inspect meaningful measurement data.
Phase 5 — AI Daily Plan
•	Complete context gathering from B05/B07/B08.
•	Implement E05.
•	Display editable Daily Plan proposal.
•	Validate schedule conflicts.
•	Apply approved schedules through B07.
•	Refresh Calendar and Planning views.
Exit condition: AI can propose a useful daily plan using real saved data, and the user can approve it safely.
Phase 6 — Progress and Review
•	Approve C08 calculation rules.
•	Complete B08 integration.
•	Implement B09 source adapters and HTTP routes.
•	Define comparison semantics.
•	Build basic Review UI.
•	Add AI explanation/recommendation from validated Review data.
Exit condition: User can inspect evidence-based progress and a basic planned-versus-actual review.
Phase 7 — End-to-end MVP verification
Test the complete workflow:
1.	Register/sign in.
2.	Create a Project or independent Goal.
3.	Use AI clarification.
4.	Review feasibility.
5.	Generate Goal Tree proposal.
6.	Approve selected proposal items.
7.	Inspect saved Goal/Milestone/Action data.
8.	Define and record Measurement.
9.	Request AI Daily Plan.
10.	Approve schedules.
11.	Execute Actions.
12.	Review actual results.
13.	Request an adjustment proposal.
14.	Continue manually if AI is unavailable.
Exit condition: Persistent, user-specific, tested end-to-end workflow without mock data or direct database edits.
________________________________________
10. Decisions requiring Product Owner approval
The following are not silently approved by this specification.
Decision	Proposed direction	Status
AI provider/model	Select one provider through an adapter; keep provider replaceable	OPEN
AI cost constraint	Define whether MVP must work without paid AI API or whether limited paid usage is acceptable	OPEN
Discovery persistence	Persist a draft/discovery session separately from official Goal data	PROPOSED
Provenance schema	Store origin/confirmation state for AI-relevant facts	PROPOSED
Proposal lifecycle	Persist proposals and application results	PROPOSED
Partial approval	Item-level approval for Goal Tree; define dependency handling	OPEN
Atomic application	Define transaction or safe recovery for multi-module apply	OPEN
Stage/Chunk	Do not create a separate domain entity until semantics are defined	OPEN
Resource entity	Keep as structured context initially; no standalone module	PROPOSED
Risk entity	Keep as structured risk observations initially; no standalone module	PROPOSED
Core Goal semantics	Define whether this means importance, dependency, critical path, or another property	OPEN
Measurement rules	Approve supported types, cardinality, and target semantics	OPEN
Progress rules	Approve formulas and aggregation	OPEN
Review policy	Approve scope, persistence, matching, and missing-data handling	OPEN
Notes/Docs	Define whether notes are attached to Project, Goal, Action, or Review	OPEN
Only the Product Owner may move an OPEN decision to APPROVED.
________________________________________
11. Acceptance criteria for the intended MVP
The product must demonstrate all of the following:
AI assistance
•	User can start with an incomplete natural-language goal.
•	AI asks relevant clarification questions.
•	AI distinguishes confirmed information from assumptions.
•	AI provides useful feasibility feedback.
•	AI generates a structured proposal.
•	User can edit, partially approve where supported, or reject.
•	AI output does not become official data without approval.
Organization
•	Goal Tree is flexible-depth.
•	Milestones and Actions remain distinct.
•	Users can organize manually.
•	The system can propose useful structure without requiring users to design it themselves.
Execution
•	Actions can be planned and executed manually.
•	AI can propose a Daily Plan from authorized saved data.
•	Calendar and Planning reflect the same Schedule data.
•	Measurement data can be recorded and retrieved.
Feedback
•	Progress uses approved rules.
•	Review uses actual records.
•	Missing information is clearly disclosed.
•	AI recommendations are distinguishable from authoritative facts.
Reliability
•	User data persists.
•	User ownership is enforced.
•	Proposal application is safe against duplicate application.
•	The workflow remains usable without AI.
•	Build, typecheck, lint, automated tests, and end-to-end tests pass.
________________________________________
12. Definition of Done
A capability is not complete merely because a UI screen or backend service exists.
It is complete only when:
1.	Its approved specification is implemented.
2.	Its authoritative data owner is clear.
3.	API and UI use the same source of truth.
4.	Authorization and validation are enforced.
5.	AI trust boundaries are preserved.
6.	Loading, empty, success, and error states are handled.
7.	Relevant tests pass.
8.	The full application builds.
9.	Integration behavior is verified.
10.	The Master Blueprint is updated with implementation status and evidence.
Final product target: FLOW-UP should help a user go from an unclear intention to an understandable, feasible, structured, executable, measurable, and improvable goal journey — with AI doing meaningful work at each appropriate stage while the user retains control.
