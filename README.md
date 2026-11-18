# FLOW-UP Engineering Blueprint (FEB) v0.1

**Status:** Draft baseline — not yet approved  
**Date:** 2026-11-16  
**Purpose:** A durable, version-controlled source of truth for product decisions, architecture, module specifications, dependencies, contracts, tests, and AI-assisted work.

## How to use this package

1. Put this folder in the root of the FLOW-UP Git repository.
2. Read `docs/00_CONTROL/MASTER_BLUEPRINT.md` first.
3. Treat `docs/00_CONTROL/DECISION_LOG.md` as the record of approved decisions.
4. Do not implement a module until its specification is approved and its dependencies/contracts are known.
5. Each AI session must use `templates/SESSION_HANDOFF.md` and report changes to the registries.
6. A checked-in document is not automatically approved. Use the status field and decision log.

## Important boundaries

- This is a starter baseline, not a completed product architecture.
- Product and technical assumptions are explicitly marked as `PROPOSED` or `OPEN`.
- No module may invent or silently change shared contracts.
- No AI may mark work as complete without test evidence.
- MVP runtime must not require a paid AI API.
"# FLOW-UP" 

## FLOW-UP application quick start

The current product architecture and decisions are documented in [`FLOW-UP_MASTER_BLUEPRINT_v0.4.md`](FLOW-UP_MASTER_BLUEPRINT_v0.4.md). The current product audit and redesign proposal are in [`docs/FLOW_UP_PRODUCT_RETHINK.md`](docs/FLOW_UP_PRODUCT_RETHINK.md); [`docs/FLOW_UP_PRODUCT_EVOLUTION_AUDIT.md`](docs/FLOW_UP_PRODUCT_EVOLUTION_AUDIT.md) retains earlier implementation context.

For local setup, environment variables, startup commands, AI privacy notes and known MVP limits, see [`docs/LOCAL_DEMO.md`](docs/LOCAL_DEMO.md).
