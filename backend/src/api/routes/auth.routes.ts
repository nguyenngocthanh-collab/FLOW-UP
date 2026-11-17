
import type { Router } from "../router.ts";
import { getStatusCodeForError, sendError, sendSuccess } from "../http.ts";

export function registerAuthRoutes(router: Router): void {
  router.post(
    "/api/auth/register",
    async (ctx) => {
      const body = (ctx.body ?? {}) as {
        email?: string;
        password?: string;
      };

      if (
        typeof body.email !== "string" ||
        typeof body.password !== "string" ||
        !body.email.trim() ||
        !body.password.trim()
      ) {
        sendError(
          ctx.res,
          400,
          "AUTH_INVALID_INPUT",
          "Email and password are required.",
          ctx.corsOrigin
        );
        return;
      }

      const result = await ctx.container.authApiService.register({
        email: body.email,
        password: body.password
      });

      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);

        sendError(
          ctx.res,
          status,
          result.error.code,
          result.error.message,
          ctx.corsOrigin
        );
        return;
      }

      sendSuccess(
        ctx.res,
        {
          ...result.data.registration,
          token: result.data.accessToken
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
      const body = (ctx.body ?? {}) as {
        email?: string;
        password?: string;
      };

      if (
        typeof body.email !== "string" ||
        typeof body.password !== "string" ||
        !body.email.trim() ||
        !body.password.trim()
      ) {
        sendError(
          ctx.res,
          400,
          "AUTH_INVALID_INPUT",
          "Email and password are required.",
          ctx.corsOrigin
        );
        return;
      }

      const result = await ctx.container.authApiService.signIn({
        email: body.email,
        password: body.password
      });

      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);

        sendError(
          ctx.res,
          status,
          result.error.code,
          result.error.message,
          ctx.corsOrigin
        );
        return;
      }

      if (!result.data.accessToken) {
        sendError(
          ctx.res,
          500,
          "AUTH_PROVIDER_ERROR",
          "Authentication provider did not return an access token.",
          ctx.corsOrigin
        );
        return;
      }

      sendSuccess(
        ctx.res,
        {
          user: result.data.user,
          token: result.data.accessToken
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
      const result = await ctx.container.authService.signOut();

      if (!result.success) {
        const status = getStatusCodeForError(result.error.code);

        sendError(
          ctx.res,
          status,
          result.error.code,
          result.error.message,
          ctx.corsOrigin
        );
        return;
      }

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
