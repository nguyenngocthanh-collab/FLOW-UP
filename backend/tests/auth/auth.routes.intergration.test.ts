
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EventEmitter } from "node:events";
import { Readable } from "node:stream";

import { createApiHandler } from "../../src/api/index.ts";
import { createApp, type AppInstance } from "../../src/server/app.ts";

interface HttpResponse {
  status: number;
  json<T = unknown>(): Promise<T>;
  text(): Promise<string>;
}

async function dispatchInProcess(
  app: AppInstance,
  method: string,
  urlPath: string,
  options: {
    headers?: Record<string, string>;
    body?: string;
  } = {}
): Promise<HttpResponse> {
  const handler = createApiHandler(app.container, "*");

  return new Promise<HttpResponse>((resolve, reject) => {
    try {
      const bodyContent = options.body ?? null;
      let pushed = false;

      const req = new Readable({
        read() {
          if (pushed) return;

          pushed = true;

          if (bodyContent) {
            this.push(bodyContent);
          }

          this.push(null);
        }
      }) as any;

      const headers: Record<string, string> = {};

      for (const [key, value] of Object.entries(options.headers ?? {})) {
        headers[key.toLowerCase()] = value;
      }

      req.method = method;
      req.url = urlPath;
      req.headers = headers;

      let statusCode = 200;
      const responseHeaders: Record<string, string> = {};
      let responseBody = "";

      const res = Object.assign(new EventEmitter(), {
        writableEnded: false,

        writeHead(
          status: number,
          responseHeaderValues?: Record<string, string>
        ) {
          statusCode = status;

          if (responseHeaderValues) {
            Object.assign(responseHeaders, responseHeaderValues);
          }
        },

        end(chunk?: unknown) {
          if (chunk) {
            responseBody += String(chunk);
          }

          this.writableEnded = true;

          resolve({
            status: statusCode,
            headers: responseHeaders,

            async json<T = unknown>() {
              return JSON.parse(responseBody) as T;
            },

            async text() {
              return responseBody;
            }
          });
        }
      }) as any;

      handler(req, res).catch(reject);
    } catch (error) {
      reject(error);
    }
  });
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

describe("Auth API Integration Tests", () => {
  let app: AppInstance;

  beforeAll(() => {
    app = createApp({
      dbPath: ":memory:",
      corsOrigin: "*",
      config: {
        auth: {
          devMode: true
        }
      }
    });
  });

  afterAll(async () => {
    await app.close();
  });

  async function request(
    method: string,
    urlPath: string,
    options: {
      headers?: Record<string, string>;
      body?: string;
    } = {}
  ) {
    return dispatchInProcess(app, method, urlPath, options);
  }

  const credentials = {
    email: "auth.integration@example.com",
    password: "Password123!"
  };

  let accessToken = "";

  it("registers a user and returns an access token", async () => {
    const response = await request("POST", "/api/auth/register", {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    expect(response.status).toBe(201);

    const result = await response.json<
      ApiSuccess<{
        status: string;
        email?: string;
        token: string;
      }>
    >();

    expect(result.success).toBe(true);
    expect(result.data.status).toBe("authenticated");
    expect(result.data.token).toMatch(/^dev-token:/);

    accessToken = result.data.token;
  });

  it("rejects registration with missing input", async () => {
    const response = await request("POST", "/api/auth/register", {
      body: JSON.stringify({ email: credentials.email })
    });

    expect(response.status).toBe(400);
    const result = await response.json<ApiFailure>();
    expect(result.error.code).toBe("AUTH_INVALID_INPUT");
  });

  it("rejects registration with incorrectly typed input", async () => {
    const response = await request("POST", "/api/auth/register", {
      body: JSON.stringify({ email: 42, password: true })
    });
    expect(response.status).toBe(400);
    const result = await response.json<ApiFailure>();
    expect(result.error.code).toBe("AUTH_INVALID_INPUT");
  });

  it("rejects registration with an existing email", async () => {
    const response = await request("POST", "/api/auth/register", {
      body: JSON.stringify(credentials)
    });

    expect(response.status).toBe(409);
    const result = await response.json<ApiFailure>();
    expect(result.error.code).toBe("AUTH_EMAIL_ALREADY_EXISTS");
  });

  it("uses the returned token to retrieve the authenticated session", async () => {
    expect(accessToken).not.toBe("");

    const response = await request("GET", "/api/auth/session", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    expect(response.status).toBe(200);

    const result = await response.json<ApiSuccess<{ user: {
      userId: string;
      email: string | null;
      isAuthenticated: true;
    } }>>();

    expect(result.success).toBe(true);
    expect(result.data.user.userId).toBeTruthy();
    expect(result.data.user.email).toBe(credentials.email);
    expect(result.data.user.isAuthenticated).toBe(true);
  });

  it("rejects session access without a token", async () => {
    const response = await request("GET", "/api/auth/session");
    expect(response.status).toBe(401);
    const result = await response.json<ApiFailure>();
    expect(result.error.code).toBe("UNAUTHORIZED");
  });

  it("rejects session access with an invalid token", async () => {
    const response = await request("GET", "/api/auth/session", {
      headers: { Authorization: "Bearer forged-token" }
    });
    expect(response.status).toBe(401);
    const result = await response.json<ApiFailure>();
    expect(result.error.code).toBe("UNAUTHORIZED");
  });

  it("logs in with the registered credentials and returns a usable token", async () => {
    const response = await request("POST", "/api/auth/login", {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    expect(response.status).toBe(200);

    const result = await response.json<
      ApiSuccess<{
        user: {
          userId: string;
          email: string | null;
          isAuthenticated: true;
        };
        token: string;
      }>
    >();

    expect(result.success).toBe(true);
    expect(result.data.user.email).toBe(credentials.email);
    expect(result.data.token).toMatch(/^dev-token:/);

    const sessionResponse = await request("GET", "/api/auth/session", {
      headers: {
        Authorization: `Bearer ${result.data.token}`
      }
    });

    expect(sessionResponse.status).toBe(200);
  });

  it("rejects login with an incorrect password", async () => {
    const response = await request("POST", "/api/auth/login", {
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: credentials.email,
        password: "WrongPassword123!"
      })
    });

    expect(response.status).toBe(401);

    const result = await response.json<ApiFailure>();

    expect(result.success).toBe(false);
    expect(result.error.code).toBe("AUTH_INVALID_CREDENTIALS");
  });

  it("rejects login with missing input", async () => {
    const response = await request("POST", "/api/auth/login", {
      body: JSON.stringify({ email: credentials.email })
    });
    expect(response.status).toBe(400);
    const result = await response.json<ApiFailure>();
    expect(result.error.code).toBe("AUTH_INVALID_INPUT");
  });

  it("logs out and tells the client to discard its local token", async () => {
    const response = await request("POST", "/api/auth/logout", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    expect(response.status).toBe(200);
    const result = await response.json<ApiSuccess<{ message: string }>>();
    expect(result.data.message).toBe("Signed out successfully.");

    // Local and Supabase adapters do not revoke a previously issued bearer token.
    // The logout contract asks the client to remove that token locally.
    const session = await request("GET", "/api/auth/session", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    expect(session.status).toBe(200);
  });
});
