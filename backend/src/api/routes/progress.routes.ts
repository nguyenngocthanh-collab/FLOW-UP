import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";
import { ProgressError } from "../../modules/progress/progress.errors.ts";

export function registerProgressRoutes(router: Router): void {
  router.get(
    "/api/progress/goals/:goalId",
    async (ctx) => {
      try {
        const result = await ctx.container.progressService.getGoalProgressSummary(
          ctx.user!,
          ctx.params.goalId
        );
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof ProgressError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PROGRESS_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.post(
    "/api/progress/summary",
    async (ctx) => {
      try {
        const body = (ctx.body ?? {}) as { goalIds?: string[] };
        if (!body.goalIds || !Array.isArray(body.goalIds)) {
          sendError(
            ctx.res,
            400,
            "PROGRESS_INVALID_INPUT",
            "goalIds array is required.",
            ctx.corsOrigin
          );
          return;
        }

        const result = await ctx.container.progressService.getProgressSummary(
          ctx.user!,
          body.goalIds
        );
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof ProgressError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PROGRESS_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.get(
    "/api/progress/reviews/:goalId",
    async (ctx) => {
      try {
        const result = await ctx.container.progressService.getProgressDataForReview(
          ctx.user!,
          ctx.params.goalId
        );
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof ProgressError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PROGRESS_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );
}
