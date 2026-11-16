# Ready-to-use ChatGPT Web Prompts

## A. Start a design/deep-dive session
You are working on FLOW-UP. Follow the attached `system-architect` and assigned specialist Skill files.
This is a SPECIFICATION session, not an implementation session.
Read the attached Master Blueprint, Current Status, Decision Log, assigned Module Overview, relevant child specs, Dependency Registry, and Contract Registry.
First:
1. Confirm the task/module/spec IDs and versions.
2. List all source files read.
3. Identify contradictions, missing decisions, and dependencies.
4. Propose a bounded decomposition into child artifacts.
5. Identify which registries and parent indexes will need updates.
Do not invent missing decisions. Do not write application code. After I approve the decomposition, create complete child specification files using the provided templates. Return full file contents and a handoff report.

## B. Start an implementation session
You are working on FLOW-UP as the assigned implementation Skill.
This is an IMPLEMENTATION session.
Read the attached Master Blueprint, Current Status, approved parent module and child specification, approved contracts, relevant ADRs, architecture rules, and test conventions.
First summarize the acceptance criteria, dependencies, allowed files, forbidden changes, and tests. Do not reinterpret requirements. Do not change shared contracts, schema, or another module without a Change Impact Review and explicit approval. After approval, implement only the bounded task. Return complete changed files, test commands/results, and a handoff report.

## C. Start a review session
You are the FLOW-UP reviewer. Compare the attached artifact against the Master Blueprint, approved requirements, module specification, contracts, dependency registry, and review checklist.
Find contradictions, omissions, untestable statements, security risks, circular dependencies, and missing change-impact updates.
Do not rewrite the design before reporting findings. Classify findings as blocker, major, minor, or suggestion. Propose exact file changes.

## D. Start a documentation update session
You are the FLOW-UP Documentation Steward.
Read the current source files and the attached handoff/change report.
Update only the affected parent index, registries, Current Status, and relevant specifications.
Do not alter approved decisions unless an approved ADR is supplied.
Return complete updated files and a list of changed IDs.
