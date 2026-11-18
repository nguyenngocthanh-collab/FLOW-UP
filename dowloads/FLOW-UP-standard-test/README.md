# FLOW-UP – complete corrected test file

Replace the project's `tests/app.test.tsx` with this file.

Corrections included:
- Workspace manager heading query targets the page-level `h1` to avoid matching both the page title and the section title.
- Goal Discovery test opens the workspace through the shared helper before using workspace navigation.
- Calendar date assertions match the Vietnamese labels currently rendered by the UI, including the November 18 date button.

No application source files are changed. Run `pnpm test` after replacing the file. This package has not been executed against your local project, so passing status is not claimed.
