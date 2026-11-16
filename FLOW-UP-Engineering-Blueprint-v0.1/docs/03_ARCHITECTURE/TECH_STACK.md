# Technology Stack Baseline

**Status:** PROPOSED — owner approval required.

## Language
TypeScript for web, mobile client, shared packages, and application/domain logic.

## Web
- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui (components copied into repository and owned by project)
- React Router
- TanStack Query for server state
- Zustand only for cross-view client UI state where needed
- React Hook Form + Zod for forms/validation

## Backend / platform for MVP
- Supabase hosted platform
- PostgreSQL
- Supabase Auth
- Supabase Storage only if MVP requires file uploads
- Supabase Edge Functions (TypeScript/Deno runtime) only for trusted server-side operations
- Row Level Security (RLS) on all user-owned exposed tables

## Portability rule
Do not put core domain rules exclusively in React components, SQL triggers, or provider-specific Edge Function code.
Place portable business rules in shared TypeScript domain/application packages where practical. Keep Supabase adapters at the infrastructure boundary.

## Future backend
If server-side complexity requires a dedicated API, introduce Node.js + NestJS + TypeScript as a modular monolith. This is a future option, not an MVP prerequisite. Preserve PostgreSQL schema and API contracts.

## Database
PostgreSQL. Schema changes must be SQL migrations committed to Git. Generate typed database definitions from the schema; never hand-edit generated types as the source of truth.

## Hosting
Cloudflare Pages for the static React/Vite web app.
Supabase for hosted database/auth/functions.
Use provider subdomains for MVP; custom domain is optional and not assumed free.

## Mobile / desktop future
- React Native + Expo for Android/iOS.
- Reuse domain, validation, API contracts, and API client packages.
- Do not promise that web UI components are directly reusable in React Native.
- PWA/responsive web first; evaluate Tauri only if native desktop capabilities become necessary.

## Testing
- Vitest for unit/component tests.
- Playwright for browser end-to-end tests.
- Database/RLS integration tests must include cross-user access denial.

## Tooling
- pnpm workspaces (monorepo only if shared packages are actually needed)
- Git + GitHub
- Supabase CLI
- ESLint + Prettier
- TypeScript strict mode

## Hosting alternative
Cloudflare Workers can host TypeScript APIs within free limits, but its 10 ms CPU/request and runtime constraints must be evaluated before choosing it for complex server workloads. Do not assume a Node.js framework can run unchanged in Workers.
