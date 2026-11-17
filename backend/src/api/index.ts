import type { IncomingMessage, ServerResponse } from "node:http";
import type { ApplicationContainer } from "../application/container.ts";
import { Router } from "./router.ts";
import { extractBearerToken, parseJsonBody, sendError } from "./http.ts";
import type { RequestContext } from "./types.ts";
import { registerHealthRoutes } from "./routes/health.routes.ts";
import { registerAuthRoutes } from "./routes/auth.routes.ts";
import { registerWorkspaceRoutes } from "./routes/workspace.routes.ts";
import { registerProjectRoutes } from "./routes/project.routes.ts";
import { registerGoalRoutes } from "./routes/goal.routes.ts";
import { registerMilestoneRoutes } from "./routes/milestone.routes.ts";
import { registerActionRoutes } from "./routes/action.routes.ts";
import { registerPlanningRoutes } from "./routes/planning.routes.ts";
import { registerProgressRoutes } from "./routes/progress.routes.ts";

export * from "./types.ts";
export * from "./http.ts";
export * from "./router.ts";

export function createRouter(): Router {
  const router = new Router();

  registerHealthRoutes(router);
  registerAuthRoutes(router);
  registerWorkspaceRoutes(router);
  registerProjectRoutes(router);
  registerGoalRoutes(router);
  registerMilestoneRoutes(router);
  registerActionRoutes(router);
  registerPlanningRoutes(router);
  registerProgressRoutes(router);

  return router;
}

export function createApiHandler(
  container: ApplicationContainer,
  corsOrigin = "*"
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  const router = createRouter();

  return async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    // 1. Handle CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      });
      res.end();
      return;
    }

    try {
      const parsedUrl = new URL(req.url ?? "/", "http://localhost");
      const pathname = parsedUrl.pathname;
      const query = parsedUrl.searchParams;
      const method = req.method ?? "GET";

      const match = router.match(method, pathname);
      if (!match) {
        sendError(
          res,
          404,
          "ROUTE_NOT_FOUND",
          `Route not found: ${method} ${pathname}`,
          corsOrigin
        );
        return;
      }

      // 2. Authentication check
      let user: import("../modules/auth/auth.types.ts").AuthenticatedUserContext | null = null;
      const token = extractBearerToken(req);
      if (token) {
        user = await container.tokenVerifier.verifyToken(token);
      }

      if (match.requiresAuth && !user) {
        sendError(
          res,
          401,
          "UNAUTHORIZED",
          "Authentication required. Please provide a valid Bearer token.",
          corsOrigin
        );
        return;
      }

      // 3. Body parsing for POST / PATCH / PUT
      let body: unknown = null;
      if (["POST", "PATCH", "PUT"].includes(method)) {
        try {
          body = await parseJsonBody(req);
        } catch (err: unknown) {
          sendError(
            res,
            400,
            "INVALID_JSON_BODY",
            (err as Error)?.message || "Malformed JSON body.",
            corsOrigin
          );
          return;
        }
      }

      // 4. Request context
      const ctx: RequestContext = {
        req,
        res,
        container,
        user,
        params: match.params,
        query,
        body,
        corsOrigin
      };

      // 5. Execute handler
      await match.handler(ctx);
    } catch (err: unknown) {
      console.error("[API Error]", err);
      if (!res.writableEnded) {
        sendError(
          res,
          500,
          "INTERNAL_SERVER_ERROR",
          "An unexpected server error occurred.",
          corsOrigin
        );
      }
    }
  };
}
