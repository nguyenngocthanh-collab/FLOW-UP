# FLOW-UP test fixes

Replace `tests/app.test.tsx` and `src/app/App.tsx`.

The App.tsx file is included unchanged from the supplied source. Test changes:
- Select the page-level h1 to avoid duplicate `Your workspaces` heading matches.
- Reuse the workspace-opening helper in Goal Discovery.
- Align calendar assertions with the Vietnamese date labels visible in the current UI.

Run `pnpm typecheck`, `pnpm build`, and `pnpm test`. These changes have not been executed against the local project.
