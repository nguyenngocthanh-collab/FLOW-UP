# FLOW-UP web MVP

## Run locally

Start the backend in a PowerShell terminal using local development auth and an in-memory database:

```powershell
$env:SUPABASE_URL = ''
$env:SUPABASE_ANON_KEY = ''
$env:AUTH_DEV_MODE = 'true'
$env:DATABASE_PATH = ':memory:'
$env:CORS_ORIGIN = 'http://localhost:5173'
pnpm backend:dev
```

In a second terminal, start the web app:

```powershell
pnpm dev
```

Open the Vite URL, normally `http://localhost:5173`. The frontend reads `VITE_API_BASE_URL`; it defaults to `http://localhost:3001` and accepts the repository example value `http://localhost:3001/api` as well. It uses the existing API routes and does not fall back to sample data.

For persistent local data, use a file path for `DATABASE_PATH` instead of `:memory:`. For Supabase authentication, configure the real `SUPABASE_URL` and `SUPABASE_ANON_KEY`, leave `AUTH_DEV_MODE` disabled, and set `CORS_ORIGIN` to the frontend origin.

## Session handling

The access token is stored in `sessionStorage`, so it survives refreshes in the same tab and clears when the tab closes or the user signs out. On app load, the token is checked through `GET /api/auth/session`. A 401 clears the stored token and returns the app to sign-in. Backend logout does not revoke issued access tokens; the frontend always discards its local token after requesting logout.

## Supported screens

- Sign in and register, including confirmation-required registration.
- Personal workspace initialization and current workspace overview.
- Project list, project creation, and navigation into project goals.
- Goal list and hierarchy, goal creation, child goals, milestones, and actions.
- Milestone completion, action status changes, and execution notes/timestamps.
- Daily plan creation, action scheduling, and schedule removal.
- Goal progress summary using the backend response.

The backend currently returns `RULE_NOT_CONFIGURED` for goal progress calculation. The screen shows that state without inventing a percentage. The API currently supports one personal workspace per user, so there is no multi-workspace picker. Measurement and review HTTP routes, historical progress snapshots, and goal move/archive/delete routes are not available and are not simulated in the UI.
