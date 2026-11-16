# Architecture Rules

1. Use TypeScript strict mode for application code.
2. Domain rules must not live only inside React components.
3. UI modules call application interfaces; they do not own business data.
4. Database access is isolated behind repositories/adapters where this adds clarity.
5. Supabase is an infrastructure provider, not the domain model.
6. All user-owned data must have an explicit ownership path and RLS policy.
7. Never expose service-role keys to browser/mobile clients.
8. SQL migrations are the source of truth for schema changes.
9. Generated database types are generated artifacts, not manually maintained schema.
10. Tree/List/Calendar are projections over shared domain data.
11. Avoid circular dependencies.
12. Avoid microservices for MVP.
13. Do not add a dependency without documenting its purpose and license.
14. No paid AI API may be required for core product behavior.
15. Every calculation must have documented inputs, formula, rounding, edge cases, and tests.
16. Time values must define timezone handling; store instants consistently and render in the user's chosen/local timezone.
17. Destructive operations require explicit rules for children, linked actions, and schedule entries.
