# Project Foundation

This repository now has a minimal React + TypeScript + Vite frontend foundation, with test, lint, formatting, and build configuration. This foundation does not implement any FLOW-UP business module and does not change `FLOW-UP_MASTER_BLUEPRINT_v0.4.md` or its decision statuses.

## Temporary implementation assumptions (not approvals)

The Blueprint leaves the technology stack and providers open. To make a general frontend foundation buildable, this scaffold temporarily uses React 18, TypeScript, Vite, pnpm, ESLint, Prettier, and Vitest, based on the previously proposed stack. Exact versions are pinned in `package.json` as reproducible starting values; these choices remain subject to explicit approval and do not approve any database, authentication, deployment, or AI provider decision.

No provider SDK, database client, privileged credential, authentication flow, business data model, or module implementation is included. `src/app` contains only the generic startup shell; `src/shared/types` and `src/lib` contain only the environment setting needed by that shell. Feature/module/infrastructure folders will be added alongside real implementation files rather than as empty placeholders.

## Commands

- `pnpm install --frozen-lockfile`
- `pnpm dev`
- `pnpm build`
- `pnpm typecheck`
- `pnpm lint`
- `pnpm test`
- `pnpm format:check`

A lockfile must be generated with the approved pnpm version by running `pnpm install` before using `--frozen-lockfile` in CI.
