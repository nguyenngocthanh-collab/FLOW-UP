import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";

export function registerWorkspaceRoutes(router: Router): void {
  router.get(
    "/api/workspaces",
    async (ctx) => {
      const result = await ctx.container.workspaceService.listWorkspaces(ctx.user!);
      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }
      sendSuccess(ctx.res, result.data, 200, ctx.corsOrigin);
    },
    { requiresAuth: true }
  );

  router.post(
    "/api/workspaces",
    async (ctx) => {
      const name = (ctx.body as { name?: unknown } | null)?.name;
      const result = await ctx.container.workspaceService.createWorkspace(ctx.user!, typeof name === "string" ? name : "");
      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }
      sendSuccess(ctx.res, result.data, 201, ctx.corsOrigin);
    },
    { requiresAuth: true }
  );

  router.delete(
    "/api/workspaces/:id",
    async (ctx) => {
      const result = await ctx.container.workspaceService.deleteWorkspace(ctx.user!, ctx.params.id);
      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }
      sendSuccess(ctx.res, { deleted: result.data }, 200, ctx.corsOrigin);
    },
    { requiresAuth: true }
  );

  router.post(
    "/api/workspaces/initialize",
    async (ctx) => {
      const result = await ctx.container.workspaceService.initializePersonalWorkspace(ctx.user!);
      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }
      sendSuccess(ctx.res, result.data, 201, ctx.corsOrigin);
    },
    { requiresAuth: true }
  );

  router.get(
    "/api/workspaces/current",
    async (ctx) => {
      const result = await ctx.container.workspaceService.getCurrentWorkspace(ctx.user!);
      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }
      sendSuccess(ctx.res, result.data, 200, ctx.corsOrigin);
    },
    { requiresAuth: true }
  );

  router.get(
    "/api/workspaces/overview",
    async (ctx) => {
      const result = await ctx.container.workspaceService.getWorkspaceOverview(ctx.user!);
      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }
      sendSuccess(ctx.res, result.data, 200, ctx.corsOrigin);
    },
    { requiresAuth: true }
  );
}
