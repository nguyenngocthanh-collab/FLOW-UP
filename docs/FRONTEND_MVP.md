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

Open the Vite URL, normally `http://localhost:5173`. The frontend calls relative `/api/...` paths. Vite's development server proxies `/api` to `http://localhost:3001`, so local browsing and Cloudflare Tunnel access use the same API configuration. No `/health` proxy is needed by the frontend. Production builds do not include the Vite proxy; set `VITE_API_BASE_URL` to an absolute production API origin only when the API is hosted separately. An empty value uses same-origin `/api` in production as well.

For persistent local data, use a file path for `DATABASE_PATH` instead of `:memory:`. For Supabase authentication, configure the real `SUPABASE_URL` and `SUPABASE_ANON_KEY`, leave `AUTH_DEV_MODE` disabled, and keep `CORS_ORIGIN` restricted to the local frontend origin. Browser API calls through the Vite proxy are same-origin, so no wildcard CORS setting is needed for Tunnel access.

## Session handling

The access token is stored in `sessionStorage`, so it survives refreshes in the same tab and clears when the tab closes or the user signs out. On app load, the token is checked through `GET /api/auth/session`. A 401 clears the stored token and returns the app to sign-in. Backend logout does not revoke issued access tokens; the frontend always discards its local token after requesting logout.

## Supported screens

- Sign in and register, including confirmation-required registration.
- Personal workspace initialization and current workspace overview.
- Project list, project creation, and navigation into project goals.
- Goal list and hierarchy, goal creation, child goals, milestones, and actions.
- Expandable Goal Tree with milestone/action editing and Goal Measurement capture, editing, history, and numeric trend sparkline.
- Milestone completion, action status changes, and execution notes/timestamps.
- Daily plan creation, action scheduling, and schedule removal.
- Goal progress summary using the backend response.

The screen shows deterministic Action completion separately from Goal outcome progress. Goal outcome progress remains `RULE_NOT_CONFIGURED`; target direction and mixed-source aggregation have not been approved, so the UI does not invent a percentage. Measurement definitions and values are persisted through authenticated B06 routes; Review note history, historical progress snapshots, and Goal move/archive/delete routes are not available. The API supports one personal workspace per user, so there is no multi-workspace picker.
