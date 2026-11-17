import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";

export function registerAuthRoutes(router: Router): void {
  router.post(
    "/api/auth/register",
    async (ctx) => {
      const body = (ctx.body ?? {}) as { email?: string; password?: string };
      if (!body.email || !body.password) {
        sendError(
          ctx.res,
          400,
          "AUTH_INVALID_INPUT",
          "Email and password are required.",
          ctx.corsOrigin
        );
        return;
      }

      const result = await ctx.container.authService.register({
        email: body.email,
        password: body.password
      });

      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }

      let token: string | undefined;
      if (result.data.status === "authenticated") {
        token = `dev-token:${result.data.user.userId}:${result.data.user.email ?? ""}`;
      }

      sendSuccess(
        ctx.res,
        {
          ...result.data,
          token
        },
        201,
        ctx.corsOrigin
      );
    },
    { requiresAuth: false }
  );

  router.post(
    "/api/auth/login",
    async (ctx) => {
      const body = (ctx.body ?? {}) as { email?: string; password?: string };
      if (!body.email || !body.password) {
        sendError(
          ctx.res,
          400,
          "AUTH_INVALID_INPUT",
          "Email and password are required.",
          ctx.corsOrigin
        );
        return;
      }

      const result = await ctx.container.authService.signIn({
        email: body.email,
        password: body.password
      });

      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);
        sendError(ctx.res, status, result.error.code, result.error.message, ctx.corsOrigin);
        return;
      }

      const token = `dev-token:${result.data.userId}:${result.data.email ?? ""}`;

      sendSuccess(
        ctx.res,
        {
          user: result.data,
          token
        },
        200,
        ctx.corsOrigin
      );
    },
    { requiresAuth: false }
  );

  router.post(
    "/api/auth/logout",
    async (ctx) => {
      await ctx.container.authService.signOut();
      sendSuccess(
        ctx.res,
        {
          message: "Signed out successfully."
        },
        200,
        ctx.corsOrigin
      );
    },
    { requiresAuth: false }
  );

  router.get(
    "/api/auth/session",
    async (ctx) => {
      if (!ctx.user) {
        sendError(
          ctx.res,
          401,
          "AUTH_UNAUTHENTICATED",
          "Authentication required.",
          ctx.corsOrigin
        );
        return;
      }

      sendSuccess(
        ctx.res,
        {
          user: ctx.user
        },
        200,
        ctx.corsOrigin
      );
    },
    { requiresAuth: true }
  );
}
