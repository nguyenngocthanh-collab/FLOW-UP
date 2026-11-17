import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";
import type {
  CreateGoalInput,
  GoalScope,
  ListGoalsFilter,
  UpdateGoalInput
} from "../../modules/goal/goal.types.ts";

export function registerGoalRoutes(router: Router): void {
  router.post(
    "/api/goals",
    async (ctx) => {
      const body = (ctx.body ?? {}) as CreateGoalInput;
      const result = await ctx.container.goalService.createGoal(ctx.user!, body);
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
    "/api/goals/hierarchy",
    async (ctx) => {
      const scope: GoalScope = {};
      const projectId = ctx.query.get("projectId");
      const rootGoalId = ctx.query.get("rootGoalId");
      const includeArchived = ctx.query.get("includeArchived");

      if (projectId) scope.projectId = projectId;
      if (rootGoalId) scope.rootGoalId = rootGoalId;
      if (includeArchived === "true") scope.includeArchived = true;

      const result = await ctx.container.goalService.getGoalHierarchy(ctx.user!, scope);
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
    "/api/goals",
    async (ctx) => {
      const filter: ListGoalsFilter = {};
      const projectId = ctx.query.get("projectId");
      const parentGoalId = ctx.query.get("parentGoalId");
      const statusParam = ctx.query.get("status");
      const includeArchived = ctx.query.get("includeArchived");

      if (projectId !== null) filter.projectId = projectId;
      if (parentGoalId !== null) filter.parentGoalId = parentGoalId === "null" ? null : parentGoalId;
      if (statusParam) filter.status = statusParam;
      if (includeArchived === "true") filter.includeArchived = true;

      const result = await ctx.container.goalService.listGoals(ctx.user!, filter);
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
    "/api/goals/:id",
    async (ctx) => {
      const result = await ctx.container.goalService.getGoal(ctx.user!, ctx.params.id);
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
    "/api/goals/:id",
    async (ctx) => {
      const body = (ctx.body ?? {}) as UpdateGoalInput;
      const result = await ctx.container.goalService.updateGoal(
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
    "/api/goals/:id/children",
    async (ctx) => {
      const body = (ctx.body ?? {}) as Omit<CreateGoalInput, "projectId" | "parentGoalId">;
      const result = await ctx.container.goalService.addChildGoal(
        ctx.user!,
        ctx.params.id,
        body
      );
      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }
      sendSuccess(ctx.res, result.data, 201, ctx.corsOrigin);
    },
    { requiresAuth: true }
  );
}
