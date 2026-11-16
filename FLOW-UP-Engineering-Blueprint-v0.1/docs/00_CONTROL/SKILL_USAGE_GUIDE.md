# Skill Usage Guide

## 1. What a Skill is

A Skill is a reusable work instruction for an AI role. It does not automatically load into every ChatGPT web chat merely because it exists in GitHub or on the user's computer.

For ChatGPT web:
1. open the Skill's `SKILL.md`;
2. attach or paste it into the new chat;
3. attach the task's Session Packet and required project documents;
4. explicitly ask the AI to follow that skill.

For OpenCode or another compatible agent, place the skill in its supported skills directory and verify discovery using that tool's current documentation.

## 2. Skill selection

| Work requested | Primary skill |
|---|---|
| Decide what product should do | product-strategist |
| Research users/competitors | product-researcher |
| Write testable requirements | requirements-engineer |
| Define entities and relationships | domain-modeler |
| Design screens and interactions | ux-architect |
| Design system/module boundaries | system-architect |
| Design SQL schema/RLS | database-architect |
| Define API/data interfaces | api-contract-designer |
| Implement web UI | frontend-engineer |
| Implement trusted server logic | backend-engineer |
| Verify behavior/security | qa-engineer |
| Update docs and registries | documentation-steward |
| Route tasks and enforce workflow | engineering-orchestrator |

## 3. Required input for every skill invocation

Never send only “use the Goal skill”. Supply:
- skill file;
- Master Blueprint;
- Current Status;
- parent module spec;
- assigned child spec or a request to create it;
- relevant contracts;
- relevant dependency entries;
- task brief and allowed scope.

## 4. Example: start a Goal module design chat

Attach:
- `engineering-orchestrator/SKILL.md`
- `domain-modeler/SKILL.md`
- `requirements-engineer/SKILL.md`
- `system-architect/SKILL.md`
- `MASTER_BLUEPRINT.md`
- `CURRENT_STATUS.md`
- `DECISION_LOG.md`
- `MOD-03_GOAL/MODULE.md` (if already created)
- relevant open questions and dependency registry

Prompt:
“Act as the FLOW-UP Engineering Orchestrator. This is a SPECIFICATION session for MOD-03 Goal Management. First inspect the supplied source files, identify missing/contradictory decisions, and propose a bounded decomposition. Do not write implementation code. Create child specification files using the provided templates. Do not change shared contracts without a Change Impact Review and explicit approval.”

## 5. Example: start an implementation chat

Attach:
- frontend-engineer or backend-engineer skill;
- Master Blueprint and Current Status;
- approved parent module specification;
- approved child specification;
- approved API/data contract;
- relevant design system and testing rules;
- implementation task packet.

Prompt:
“Act as FLOW-UP [Frontend/Backend] Engineer. Implement only task [TASK-ID] against specification [SPEC-ID, VERSION]. Do not reinterpret requirements or change shared contracts. First list the acceptance criteria and files you expect to touch. Wait for approval before implementation. Return full changed files, tests, and a completed handoff.”

## 6. Use the smallest useful skill set

Do not attach all 13 skills to every chat. Use one primary skill and only the supporting skills required for that task. Too many role instructions can conflict and waste context.
