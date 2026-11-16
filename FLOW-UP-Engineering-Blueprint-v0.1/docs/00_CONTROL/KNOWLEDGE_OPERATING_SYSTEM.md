# FLOW-UP Knowledge & Session Operating System (KSOS)

**Version:** 0.1  
**Status:** PROPOSED  
**Purpose:** Make every ChatGPT/Claude/OpenCode session operate from the same versioned source of truth.

## 1. Core rule

Git repository = permanent source of truth. Chat sessions = temporary workers.

A new chat does not automatically know local folders or prior chat decisions. The user must provide the relevant context by:
- attaching a prepared Session Packet; or
- connecting a supported repository connector and explicitly retrieving the required files; or
- pasting the required files/content.

Never assume a new session can see the previous session's files or conversation.

## 2. Three layers of knowledge

### Layer A — Global project context
Always include:
- `docs/00_CONTROL/MASTER_BLUEPRINT.md`
- `docs/00_CONTROL/CURRENT_STATUS.md`
- `docs/00_CONTROL/DECISION_LOG.md`
- `docs/00_CONTROL/OPEN_QUESTIONS.md`

### Layer B — Task context
Include only:
- assigned Skill `SKILL.md`
- parent module `MODULE.md`
- assigned child specification
- directly relevant contracts
- directly relevant dependencies
- relevant ADRs and test conventions

### Layer C — Work context
Include:
- exact task brief
- allowed files
- forbidden changes
- acceptance criteria
- expected output and handoff template

Do not upload the entire repository to every chat unless the task truly requires broad review.

## 3. Session types

1. `DISCOVERY`: investigate a question; no authoritative design changes.
2. `SPECIFICATION`: create or deepen requirements/design specifications.
3. `REVIEW`: review an existing artifact against standards and dependencies.
4. `IMPLEMENTATION`: write code only from approved specifications.
5. `TESTING`: verify implementation against acceptance criteria.
6. `INTEGRATION`: validate cross-module behavior and contracts.
7. `DOCUMENTATION`: reconcile documents and registries.

A session must declare exactly one primary type. It may have secondary responsibilities only if explicitly stated.

## 4. Standard session lifecycle

1. Create a Session Packet.
2. Attach the packet and required source documents to a new chat.
3. Ask the AI to confirm the assigned role, module, spec version, and boundaries.
4. AI lists missing context and contradictions before doing work.
5. AI proposes a plan.
6. User approves the plan for shared-contract or architecture changes.
7. AI performs only the bounded task.
8. AI returns changed artifacts as complete files, not vague summaries.
9. AI returns a change-impact report and test/evidence report.
10. User commits accepted files to Git.
11. Documentation Steward updates registries and status.
12. Create the next Session Packet from the newly committed state.

## 5. What an AI may and may not decide

May:
- propose details inside an approved module boundary;
- identify missing requirements;
- create tests and implementation within approved contracts;
- suggest alternatives with trade-offs.

May not without owner approval:
- change product vision or MVP scope;
- change a shared entity or contract;
- add cross-module dependencies;
- change database ownership/security policy;
- add a paid dependency or provider;
- mark a module approved/verified/released;
- silently reconcile conflicting documents.

## 6. Source priority when documents conflict

1. Latest explicitly approved ADR / decision record.
2. Latest approved contract or module specification.
3. Approved product requirements.
4. Master Blueprint.
5. Proposed documents.
6. Session notes and chat history.

If two approved sources conflict, stop and create a conflict report. Do not choose silently.

## 7. Session naming

Use:
`FLOWUP-[TYPE]-[MODULE-ID]-[SUBSPEC-ID]-[SHORT-TASK]-v[DOC-VERSION]`

Examples:
- `FLOWUP-SPEC-MOD-03-GOAL-DOMAIN-v0.2`
- `FLOWUP-IMPL-MOD-03-GOAL-CRUD-v1.0`
- `FLOWUP-REVIEW-MOD-06-SCHEDULE-RLS-v0.3`

## 8. Completion conditions

A session is complete only when:
- output files are supplied in full;
- changed files and IDs are listed;
- assumptions and open questions are listed;
- dependency and contract impacts are listed;
- tests/evidence are reported;
- next status is recommended, not falsely asserted;
- a handoff packet is provided.
