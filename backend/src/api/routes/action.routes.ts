import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";
import type {
  ActionStatus,
  CreateActionInput,
  RecordExecutionInput,
  UpdateActionInput
} from "../../modules/action/action.types.ts";

export function registerActionRoutes(router: Router): void {
  router.post(
    "/api/actions",
    async (ctx) => {
      const body = (ctx.body ?? {}) as CreateActionInput;
      const result = await ctx.container.actionService.createAction(ctx.user!, body);
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
    "/api/goals/:goalId/actions",
    async (ctx) => {
      const result = await ctx.container.actionService.listActionsByGoal(
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
    "/api/actions",
    async (ctx) => {
      const milestoneId = ctx.query.get("milestoneId");
      const goalId = ctx.query.get("goalId");

      if (milestoneId) {
        const result = await ctx.container.actionService.listActionsByMilestone(
          ctx.user!,
          milestoneId
        );
        if (!result.success) {
          const status = getStatusCodeForError(result.error.code);
          sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
          return;
        }
        sendSuccess(ctx.res, result.data, 200, ctx.corsOrigin);
        return;
      }

      if (goalId) {
        const result = await ctx.container.actionService.listActionsByGoal(
          ctx.user!,
          goalId
        );
        if (!result.success) {
          const status = getStatusCodeForError(result.error.code);
          sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
          return;
        }
        sendSuccess(ctx.res, result.data, 200, ctx.corsOrigin);
        return;
      }

      sendError(
        ctx.res,
        400,
        "ACTION_INVALID_INPUT",
        "Either goalId or milestoneId query parameter is required.",
        ctx.corsOrigin
      );
    },
    { requiresAuth: true }
  );

  router.get(
    "/api/actions/:id",
    async (ctx) => {
      const result = await ctx.container.actionService.getAction(ctx.user!, ctx.params.id);
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
    "/api/actions/:id",
    async (ctx) => {
      const body = (ctx.body ?? {}) as UpdateActionInput;
      const result = await ctx.container.actionService.updateAction(
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

  router.patch(
    "/api/actions/:id/status",
    async (ctx) => {
      const body = (ctx.body ?? {}) as { status?: ActionStatus };
      if (!body.status) {
        sendError(
          ctx.res,
          400,
          "ACTION_INVALID_STATUS",
          "status field is required.",
          ctx.corsOrigin
        );
        return;
      }
      const result = await ctx.container.actionService.updateActionStatus(
        ctx.user!,
        ctx.params.id,
        body.status
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
    "/api/actions/:id/complete",
    async (ctx) => {
      const result = await ctx.container.actionService.completeAction(
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

  router.post(
    "/api/actions/:id/execution",
    async (ctx) => {
      const body = (ctx.body ?? {}) as RecordExecutionInput;
      const result = await ctx.container.actionService.recordExecution(
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
    "/api/actions/:id/execution",
    async (ctx) => {
      const result = await ctx.container.actionService.getExecutionData(
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
