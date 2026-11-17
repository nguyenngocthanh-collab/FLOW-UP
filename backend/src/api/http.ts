import type { IncomingMessage, ServerResponse } from "node:http";

export function sendJson(
  res: ServerResponse,
  statusCode: number,
  data: unknown,
  corsOrigin = "*"
): void {
  if (res.writableEnded) return;

  const jsonString = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(jsonString),
    "Access-Control-Allow-Origin": corsOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  });
  res.end(jsonString);
}

export function sendSuccess<T>(
  res: ServerResponse,
  data: T,
  statusCode = 200,
  corsOrigin = "*"
): void {
  sendJson(res, statusCode, { success: true, data }, corsOrigin);
}

export function sendError(
  res: ServerResponse,
  statusCode: number,
  code: string,
  message: string,
  corsOrigin = "*"
): void {
  sendJson(res, statusCode, { success: false, error: { code, message } }, corsOrigin);
}

export function getStatusCodeForError(code: string): number {
  if (code.includes("RATE_LIMITED")) return 429;
  if (
    code.includes("INVALID_CREDENTIALS") ||
    code.includes("EMAIL_NOT_CONFIRMED") ||
    code.includes("UNAUTHENTICATED")
  ) return 401;
  if (code.includes("PROVIDER_ERROR") || code.includes("NETWORK_ERROR")) return 502;
  if (code.includes("NOT_FOUND")) return 404;
  if (code.includes("ACCESS_DENIED") || code.includes("OWNERSHIP")) return 403;
  if (code.includes("ALREADY_EXISTS") || code.includes("CIRCULAR") || code.includes("CONFLICT")) return 409;
  if (code.includes("INVALID") || code.includes("INPUT") || code.includes("REQUIRED")) return 400;
  return 400;
}

export async function parseJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.setEncoding("utf-8");

    req.on("data", (chunk: string) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        // 1MB limit
        reject(new Error("Request payload too large"));
      }
    });

    req.on("end", () => {
      if (!raw.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(raw);
        resolve(parsed);
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

export function extractBearerToken(req: IncomingMessage): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer") {
    return parts[1];
  }
  return null;
}
