import type { IncomingMessage, ServerResponse } from "node:http";
import type { AuthenticatedUserContext } from "../modules/auth/auth.types.ts";
import type { ApplicationContainer } from "../application/container.ts";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";

export interface RequestContext {
  req: IncomingMessage;
  res: ServerResponse;
  container: ApplicationContainer;
  user: AuthenticatedUserContext | null;
  params: Record<string, string>;
  query: URLSearchParams;
  body: unknown;
  corsOrigin: string;
}

export type RouteHandler = (ctx: RequestContext) => Promise<void> | void;

export interface RouteMatch {
  handler: RouteHandler;
  params: Record<string, string>;
  requiresAuth: boolean;
}
