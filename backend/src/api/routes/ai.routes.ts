import type { Router } from "../router.ts";
import { sendError, sendSuccess } from "../http.ts";
import type { RouteHandler } from "../types.ts";
import type { AIOperationType, AIProposalSelection } from "../../modules/ai-orchestration/index.ts";
import { AIOrchestrationError } from "../../modules/ai-orchestration/index.ts";

function aiStatus(code: string): number {
  if (code === "AI_UNAUTHENTICATED") return 401;
  if (code === "AI_ACCESS_DENIED" || code === "AI_PROPOSAL_ACCESS_DENIED") return 403;
  if (code === "AI_PROPOSAL_NOT_FOUND") return 404;
  if (code === "AI_USAGE_LIMIT_EXCEEDED" || code === "AI_PROVIDER_RATE_LIMITED") return 429;
  if (code === "AI_PROVIDER_UNAVAILABLE") return 503;
  if (code.startsWith("AI_INVALID") || code === "AI_APPROVAL_REQUIRED" || code === "AI_OUTPUT_INVALID") return 400;
  if (code.startsWith("AI_PROVIDER") || code === "AI_REQUEST_TIMEOUT") return 502;
  return 409;
}

function bodyObject(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

export function registerAIRoutes(router: Router): void {
  const run = (operation: AIOperationType): RouteHandler => async (ctx) => {
    const body = bodyObject(ctx.body);
    if (typeof body?.input !== "string" || !body.input.trim()) {
      sendError(ctx.res, 400, "AI_INVALID_REQUEST", "A goal description is required.", ctx.corsOrigin);
      return;
    }
    try {
      const result = await ctx.container.aiService.execute(ctx.user!, operation, body.input);
      sendSuccess(ctx.res, result, 200, ctx.corsOrigin);
    } catch (error) {
      const failure = error instanceof AIOrchestrationError
        ? error : new AIOrchestrationError("AI_PROVIDER_ERROR", "AI assistance is temporarily unavailable.", error);
      sendError(ctx.res, aiStatus(failure.code), failure.code, failure.message, ctx.corsOrigin);
    }
  };

  router.post("/api/ai/goal-understanding", run("GOAL_CLARIFICATION"));
  router.post("/api/ai/feasibility", run("GOAL_FEASIBILITY"));
  router.post("/api/ai/goal-proposals", run("GOAL_TREE_PROPOSAL"));

  router.get("/api/ai/proposals/:id", async (ctx) => {
    try {
      sendSuccess(ctx.res, await ctx.container.aiService.getProposal(ctx.user!, ctx.params.id), 200, ctx.corsOrigin);
    } catch (error) {
      const failure = error instanceof AIOrchestrationError ? error : new AIOrchestrationError("AI_PERSISTENCE_ERROR", "Unable to load proposal.");
      sendError(ctx.res, aiStatus(failure.code), failure.code, failure.message, ctx.corsOrigin);
    }
  });

  router.patch("/api/ai/proposals/:id", async (ctx) => {
    const body = bodyObject(ctx.body);
    if (!body || !("proposalData" in body)) {
      sendError(ctx.res, 400, "AI_INVALID_REQUEST", "proposalData is required.", ctx.corsOrigin);
      return;
    }
    try {
      sendSuccess(ctx.res, await ctx.container.aiService.updateProposal(ctx.user!, ctx.params.id, body.proposalData), 200, ctx.corsOrigin);
    } catch (error) {
      const failure = error instanceof AIOrchestrationError ? error : new AIOrchestrationError("AI_PERSISTENCE_ERROR", "Unable to update proposal.");
      sendError(ctx.res, aiStatus(failure.code), failure.code, failure.message, ctx.corsOrigin);
    }
  });

  router.post("/api/ai/proposals/:id/reject", async (ctx) => {
    try {
      sendSuccess(ctx.res, await ctx.container.aiService.rejectProposal(ctx.user!, ctx.params.id), 200, ctx.corsOrigin);
    } catch (error) {
      const failure = error instanceof AIOrchestrationError ? error : new AIOrchestrationError("AI_PERSISTENCE_ERROR", "Unable to reject proposal.");
      sendError(ctx.res, aiStatus(failure.code), failure.code, failure.message, ctx.corsOrigin);
    }
  });

  router.post("/api/ai/proposals/:id/apply", async (ctx) => {
    const body = bodyObject(ctx.body) as { selection?: AIProposalSelection } | null;
    if (!body?.selection || !Array.isArray(body.selection.selectedItemIds)) {
      sendError(ctx.res, 400, "AI_APPROVAL_REQUIRED", "Select proposal items before approving.", ctx.corsOrigin);
      return;
    }
    try {
      sendSuccess(ctx.res, await ctx.container.aiService.approveAndApplyProposal(ctx.user!, ctx.params.id, body.selection), 200, ctx.corsOrigin);
    } catch (error) {
      const failure = error instanceof AIOrchestrationError ? error : new AIOrchestrationError("AI_PROPOSAL_APPLICATION_FAILED", "Unable to apply proposal.");
      sendError(ctx.res, aiStatus(failure.code), failure.code, failure.message, ctx.corsOrigin);
    }
  });
}
