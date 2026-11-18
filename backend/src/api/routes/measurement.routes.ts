import type { Router } from "../router.ts";
import type { RequestContext } from "../types.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";
import { MeasurementError } from "../../modules/measurement/index.ts";
import type { CreateMeasurementInput, MeasurementHistoryQuery, RecordMeasurementValueInput, UpdateMeasurementInput } from "../../modules/measurement/measurement.types.ts";

function query(ctx: RequestContext): MeasurementHistoryQuery {
  const offset = ctx.query.get("offset");
  const limit = ctx.query.get("limit");
  return {
    ...(ctx.query.has("from") ? { from: ctx.query.get("from")! } : {}),
    ...(ctx.query.has("to") ? { to: ctx.query.get("to")! } : {}),
    ...(offset !== null ? { offset: Number(offset) } : {}),
    ...(limit !== null ? { limit: Number(limit) } : {}),
  };
}

export function registerMeasurementRoutes(router: Router): void {
  router.get("/api/goals/:goalId/measurements", async (ctx) => {
    try {
      const result = await ctx.container.measurementService.listMeasurementsByGoal(ctx.user!, ctx.params.goalId);
      sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
    } catch (error) { sendFailure(ctx, error); }
  }, { requiresAuth: true });

  router.post("/api/measurements", async (ctx) => {
    try {
      const result = await ctx.container.measurementService.createMeasurement(ctx.user!, (ctx.body ?? {}) as CreateMeasurementInput);
      sendSuccess(ctx.res, result, 201, ctx.corsOrigin);
    } catch (error) { sendFailure(ctx, error); }
  }, { requiresAuth: true });

  router.get("/api/measurements/:id", async (ctx) => {
    try {
      sendSuccess(ctx.res, await ctx.container.measurementService.getMeasurement(ctx.user!, ctx.params.id), 200, ctx.corsOrigin);
    } catch (error) { sendFailure(ctx, error); }
  }, { requiresAuth: true });

  router.patch("/api/measurements/:id", async (ctx) => {
    try {
      sendSuccess(ctx.res, await ctx.container.measurementService.updateMeasurement(ctx.user!, ctx.params.id, (ctx.body ?? {}) as UpdateMeasurementInput), 200, ctx.corsOrigin);
    } catch (error) { sendFailure(ctx, error); }
  }, { requiresAuth: true });

  router.delete("/api/measurements/:id", async (ctx) => {
    try {
      sendSuccess(ctx.res, await ctx.container.measurementService.archiveMeasurement(ctx.user!, ctx.params.id), 200, ctx.corsOrigin);
    } catch (error) { sendFailure(ctx, error); }
  }, { requiresAuth: true });

  router.post("/api/measurements/:id/records", async (ctx) => {
    try {
      const body = (ctx.body ?? {}) as Omit<RecordMeasurementValueInput, "measurementId">;
      sendSuccess(ctx.res, await ctx.container.measurementService.recordMeasurementValue(ctx.user!, { ...body, measurementId: ctx.params.id }), 201, ctx.corsOrigin);
    } catch (error) { sendFailure(ctx, error); }
  }, { requiresAuth: true });

  router.get("/api/measurements/:id/current", async (ctx) => {
    try {
      sendSuccess(ctx.res, await ctx.container.measurementService.getCurrentMeasurementValue(ctx.user!, ctx.params.id), 200, ctx.corsOrigin);
    } catch (error) { sendFailure(ctx, error); }
  }, { requiresAuth: true });

  router.get("/api/measurements/:id/history", async (ctx) => {
    try {
      sendSuccess(ctx.res, await ctx.container.measurementService.getMeasurementHistory(ctx.user!, ctx.params.id, query(ctx)), 200, ctx.corsOrigin);
    } catch (error) { sendFailure(ctx, error); }
  }, { requiresAuth: true });
}

function sendFailure(ctx: RequestContext, error: unknown): void {
  if (error instanceof MeasurementError) {
    sendError(ctx.res, getStatusCodeForError(error.code), error.code, error.message, ctx.corsOrigin);
    return;
  }
  sendError(ctx.res, 400, "MEASUREMENT_ERROR", "Measurement request could not be completed.", ctx.corsOrigin);
}
