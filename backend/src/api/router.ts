import type { HttpMethod, RouteHandler, RouteMatch } from "./types.ts";

interface RouteRegistration {
  method: HttpMethod;
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
  requiresAuth: boolean;
}

export class Router {
  private readonly routes: RouteRegistration[] = [];

  register(
    method: HttpMethod,
    pathPattern: string,
    handler: RouteHandler,
    options: { requiresAuth?: boolean } = {}
  ): void {
    const paramNames: string[] = [];
    const regexPattern = pathPattern
      .replace(/\/+$/, "") // remove trailing slash
      .replace(/:([a-zA-Z0-9_]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return "([^/]+)";
      });

    const pattern = new RegExp(`^${regexPattern || "/"}$`);
    this.routes.push({
      method,
      pattern,
      paramNames,
      handler,
      requiresAuth: options.requiresAuth ?? true
    });
  }

  get(path: string, handler: RouteHandler, options?: { requiresAuth?: boolean }): void {
    this.register("GET", path, handler, options);
  }

  post(path: string, handler: RouteHandler, options?: { requiresAuth?: boolean }): void {
    this.register("POST", path, handler, options);
  }

  patch(path: string, handler: RouteHandler, options?: { requiresAuth?: boolean }): void {
    this.register("PATCH", path, handler, options);
  }

  delete(path: string, handler: RouteHandler, options?: { requiresAuth?: boolean }): void {
    this.register("DELETE", path, handler, options);
  }

  match(method: string, pathname: string): RouteMatch | null {
    const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = route.pattern.exec(cleanPath);
      if (match) {
        const params: Record<string, string> = {};
        for (let i = 0; i < route.paramNames.length; i++) {
          params[route.paramNames[i]] = decodeURIComponent(match[i + 1]);
        }
        return {
          handler: route.handler,
          params,
          requiresAuth: route.requiresAuth
        };
      }
    }

    return null;
  }
}
