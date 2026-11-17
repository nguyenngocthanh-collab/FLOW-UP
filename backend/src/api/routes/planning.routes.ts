import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";
import { PlanningError } from "../../modules/planning/planning.errors.ts";
import type {
  ApprovedPlanningProposal,
  CreateDailyPlanInput,
  CreateScheduleInput,
  UpdateDailyPlanInput,
  UpdateScheduleInput
} from "../../modules/planning/planning.types.ts";

export function registerPlanningRoutes(router: Router): void {
  router.post(
    "/api/planning/daily-plans",
    async (ctx) => {
      try {
        const body = (ctx.body ?? {}) as CreateDailyPlanInput;
        const result = await ctx.container.planningService.createDailyPlan(ctx.user!, body);
        sendSuccess(ctx.res, result, 201, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.get(
    "/api/planning/daily-plans/:date",
    async (ctx) => {
      try {
        const result = await ctx.container.planningService.getDailyPlan(ctx.user!, ctx.params.date);
        if (!result) {
          sendError(
            ctx.res,
            404,
            "DAILY_PLAN_NOT_FOUND",
            `Daily Plan not found for date ${ctx.params.date}`,
            ctx.corsOrigin
          );
          return;
        }
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.patch(
    "/api/planning/daily-plans/:id",
    async (ctx) => {
      try {
        const body = (ctx.body ?? {}) as UpdateDailyPlanInput;
        const result = await ctx.container.planningService.updateDailyPlan(
          ctx.user!,
          ctx.params.id,
          body
        );
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.post(
    "/api/planning/daily-plans/:id/actions",
    async (ctx) => {
      try {
        const body = (ctx.body ?? {}) as Omit<CreateScheduleInput, "dailyPlanId">;
        const result = await ctx.container.planningService.addActionToDailyPlan(
          ctx.user!,
          ctx.params.id,
          body
        );
        sendSuccess(ctx.res, result, 201, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.delete(
    "/api/planning/daily-plans/:id/actions/:scheduleId",
    async (ctx) => {
      try {
        const result = await ctx.container.planningService.removeActionFromDailyPlan(
          ctx.user!,
          ctx.params.id,
          ctx.params.scheduleId
        );
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.post(
    "/api/planning/schedules",
    async (ctx) => {
      try {
        const body = (ctx.body ?? {}) as CreateScheduleInput;
        const result = await ctx.container.planningService.createSchedule(ctx.user!, body);
        sendSuccess(ctx.res, result, 201, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.get(
    "/api/planning/schedules",
    async (ctx) => {
      try {
        const startDate = ctx.query.get("startDate");
        const endDate = ctx.query.get("endDate");
        if (!startDate || !endDate) {
          sendError(
            ctx.res,
            400,
            "PLANNING_INVALID_INPUT",
            "startDate and endDate query parameters are required.",
            ctx.corsOrigin
          );
          return;
        }

        const result = await ctx.container.planningService.getSchedulesByDateRange(
          ctx.user!,
          { startDate, endDate }
        );
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.get(
    "/api/planning/schedules/:id",
    async (ctx) => {
      try {
        const result = await ctx.container.planningService.getSchedule(ctx.user!, ctx.params.id);
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.patch(
    "/api/planning/schedules/:id",
    async (ctx) => {
      try {
        const body = (ctx.body ?? {}) as UpdateScheduleInput;
        const result = await ctx.container.planningService.updateSchedule(
          ctx.user!,
          ctx.params.id,
          body
        );
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.delete(
    "/api/planning/schedules/:id",
    async (ctx) => {
      try {
        await ctx.container.planningService.deleteSchedule(ctx.user!, ctx.params.id);
        sendSuccess(ctx.res, { deleted: true }, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );

  router.post(
    "/api/planning/proposals/apply",
    async (ctx) => {
      try {
        const body = (ctx.body ?? {}) as ApprovedPlanningProposal;
        const result = await ctx.container.planningService.applyApprovedPlanningProposal(
          ctx.user!,
          body
        );
        sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
      } catch (err: unknown) {
        if (err instanceof PlanningError) {
          const status = getStatusCodeForError(err.code);
          sendError(ctx.res, status, err.code, err.message, ctx.corsOrigin);
          return;
        }
        sendError(ctx.res, 400, "PLANNING_ERROR", String((err as Error)?.message), ctx.corsOrigin);
      }
    },
    { requiresAuth: true }
  );
}
