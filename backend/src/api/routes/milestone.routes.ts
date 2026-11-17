import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";
import type {
  CreateMilestoneInput,
  UpdateMilestoneInput
} from "../../modules/milestone/milestone.types.ts";

export function registerMilestoneRoutes(router: Router): void {
  router.post(
    "/api/milestones",
    async (ctx) => {
      const body = (ctx.body ?? {}) as CreateMilestoneInput;
      const result = await ctx.container.milestoneService.createMilestone(ctx.user!, body);
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
    "/api/goals/:goalId/milestones",
    async (ctx) => {
      const result = await ctx.container.milestoneService.listMilestonesByGoal(
        ctx.user!,
        ctx.params.goalId
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
    "/api/milestones",
    async (ctx) => {
      const goalId = ctx.query.get("goalId");
      if (!goalId) {
        sendError(
          ctx.res,
          400,
          "MILESTONE_INVALID_INPUT",
          "goalId query parameter is required.",
          ctx.corsOrigin
        );
        return;
      }
      const result = await ctx.container.milestoneService.listMilestonesByGoal(
        ctx.user!,
        goalId
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
    "/api/milestones/:id",
    async (ctx) => {
      const result = await ctx.container.milestoneService.getMilestone(
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

  router.patch(
    "/api/milestones/:id",
    async (ctx) => {
      const body = (ctx.body ?? {}) as UpdateMilestoneInput;
      const result = await ctx.container.milestoneService.updateMilestone(
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

  router.post(
    "/api/milestones/:id/complete",
    async (ctx) => {
      const result = await ctx.container.milestoneService.completeMilestone(
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
