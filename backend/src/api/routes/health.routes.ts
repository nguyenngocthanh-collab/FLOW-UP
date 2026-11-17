import type { Router } from "../router.ts";
import { sendSuccess } from "../http.ts";

export function registerHealthRoutes(router: Router): void {
  router.get(
    "/health",
    (ctx) => {
      sendSuccess(
        ctx.res,
        {
          status: "ok",
          timestamp: new Date().toISOString()
        },
        200,
        ctx.corsOrigin
      );
    },
    { requiresAuth: false }
  );

  router.get(
    "/api/health",
    (ctx) => {
      sendSuccess(
        ctx.res,
        {
          status: "ok",
          timestamp: new Date().toISOString()
        },
        200,
        ctx.corsOrigin
      );
    },
    { requiresAuth: false }
  );
}
