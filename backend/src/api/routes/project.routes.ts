import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";
import type { CreateProjectInput, UpdateProjectInput } from "../../modules/workspace/workspace.types.ts";

export function registerProjectRoutes(router: Router): void {
  router.post(
    "/api/projects",
    async (ctx) => {
      const body = (ctx.body ?? {}) as CreateProjectInput;
      const result = await ctx.container.workspaceService.createProject(ctx.user!, body);
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
    "/api/projects",
    async (ctx) => {
      const result = await ctx.container.workspaceService.listProjects(ctx.user!);
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
    "/api/projects/:id",
    async (ctx) => {
      const result = await ctx.container.workspaceService.getProject(ctx.user!, ctx.params.id);
      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }
      sendSuccess(ctx.res, result.data, 200, ctx.corsOrigin);
    },
    { requiresAuth: true }
  );

  router.patch(
    "/api/projects/:id",
    async (ctx) => {
      const body = (ctx.body ?? {}) as UpdateProjectInput;
      const result = await ctx.container.workspaceService.updateProject(
        ctx.user!,
        ctx.params.id,
        body
      );
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
    "/api/projects/:id/overview",
    async (ctx) => {
      const result = await ctx.container.workspaceService.getProjectOverview(
        ctx.user!,
        ctx.params.id
      );
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
