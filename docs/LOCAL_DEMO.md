# Run FLOW-UP locally

## Requirements

- Node.js 20.19 or newer.
- pnpm 10.12.1 (the version recorded in `package.json`).
- Gemini API key only for AI workflows; manual goal and execution workflows work without it.

## Install and configure

From the repository root in PowerShell:

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env
```

Keep `AUTH_DEV_MODE=true` for local-only development. `.env.example` uses SQLite at `./data/flow-up.db`; startup creates tables if absent and preserves existing rows. Do not delete that file to reset the app.

Set these environment variables in `.env`:

| Variable | Required | Purpose |
|---|---|---|
| `PORT` | No | Backend port; default `3001` |
| `DATABASE_PATH` | No | SQLite file; default `./data/flow-up.db` |
| `CORS_ORIGIN` | No | Allowed browser origin; default example is Vite at `http://localhost:5173` |
| `AUTH_DEV_MODE` | Local only | `true` enables local development sign-in without Supabase; never enable in production |
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Only for Supabase auth | Supabase Auth configuration; server also needs these in production |
| `VITE_API_BASE_URL` | No | Leave blank for the local Vite `/api` proxy |
| `GEMINI_API_KEY` | No | Server-side key for AI goal understanding, feasibility and goal proposals |
| `GEMINI_MODEL` | No | Defaults to `gemini-3.8-flash` |
| `AI_TIMEOUT_MS` | No | Provider request timeout; default `20000` |
| `AI_DAILY_USER_LIMIT` | No | Daily AI operations per user; default `12` |
| `AI_DAILY_GLOBAL_LIMIT` | No | Daily AI operations across the local app; default `90` |

Gemini Developer API Free tier limits vary by model and account and can change. Google states Free tier content may be used to improve its products. Avoid sending sensitive information. The key must remain in the backend `.env`; never add it to a `VITE_` variable.

## Initialize and start

Database initialization is safe to repeat; it creates missing tables without clearing existing data.

```powershell
pnpm backend:db:init
```

In terminal 1, start the API:

```powershell
pnpm backend:dev
```

In terminal 2, start the web app:

```powershell
pnpm dev
```

Open `http://localhost:5173`. The frontend proxies `/api` requests to `http://localhost:3001`. Backend health is at `http://localhost:3001/health`.

Register a local demo account in the app, then create its Personal Workspace when prompted. SQLite records survive page reloads and backend restarts.

## Suggested demo

1. Open **Goal discovery** and describe an outcome.
2. Request **Understand my goal**, review the interpretation, and add answers to useful clarification questions in the description.
3. Request feasibility feedback, then generate a structure proposal.
4. Edit titles and select the items to keep. Approve them explicitly.
5. Open Goals and verify the Goal, Milestone and Action hierarchy. Add a Measurement, record values, and inspect its history/trend.
6. Reload the browser and confirm the records remain available.
7. Without a Gemini key, use **Create a goal manually**; AI shows an unavailable state and manual workflows remain usable.

## Current MVP limits

- A real Gemini request requires a valid key and network access. Mocked tests do not replace live-provider verification; in this environment the live request was blocked by outbound network restrictions.
- AI proposals can create Goal, Milestone, Action and typed Measurement records after user approval. Daily Plan proposals are not applied by the current workflow.
- Measurement targets are stored and displayed, but no target-direction or numeric Goal progress percentage is inferred.
- Review note history and advanced Goal progress behavior remain constrained by the open rules recorded in the Master Blueprint.
- The UI supports the initial goal discovery journey, but a browser-driven E2E suite is not configured. Backend tests exercise the mocked discovery, approval, persistence and restart journey.
