import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { Readable } from "node:stream";
import { EventEmitter } from "node:events";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp, type AppInstance } from "../../src/server/app.ts";
import { createApiHandler } from "../../src/api/index.ts";

interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  json: <T = unknown>() => Promise<T>;
  text: () => Promise<string>;
}

// In-process dispatcher supporting sandboxed test execution without requiring TCP sockets
async function dispatchInProcess(
  app: AppInstance,
  method: string,
  urlPath: string,
  options: { headers?: Record<string, string>; body?: string } = {}
): Promise<HttpResponse> {
  const handler = createApiHandler(app.container, "*");
  return new Promise<HttpResponse>((resolve, reject) => {
    try {
      const bodyContent = options.body ?? null;
      let pushed = false;

      const req = new Readable({
        read() {
          if (!pushed) {
            pushed = true;
            if (bodyContent) {
              this.push(bodyContent);
            }
            this.push(null);
          }
        }
      }) as unknown as IncomingMessage & { method: string; url: string; headers: Record<string, string> };

      const lowerHeaders: Record<string, string> = {};
      if (options.headers) {
        for (const [k, v] of Object.entries(options.headers)) {
          lowerHeaders[k.toLowerCase()] = v;
        }
      }

      req.method = method;
      req.url = urlPath;
      req.headers = lowerHeaders;

      let statusCode = 200;
      const resHeaders: Record<string, string> = {};
      let resBody = "";

      const res = Object.assign(new EventEmitter(), {
        writableEnded: false,
        writeHead(status: number, headers?: Record<string, string>) {
          statusCode = status;
          if (headers) Object.assign(resHeaders, headers);
        },
        end(chunk?: unknown) {
          if (typeof chunk === "string") resBody += chunk;
          else if (Buffer.isBuffer(chunk)) resBody += chunk.toString();
          this.writableEnded = true;
          resolve({
            status: statusCode,
            headers: resHeaders,
            async json<T = unknown>() {
              return JSON.parse(resBody) as T;
            },
            async text() {
              return resBody;
            }
          });
        }
      }) as unknown as ServerResponse;

      handler(req, res).catch(reject);
    } catch (err) {
      reject(err);
    }
  });
}

describe("FLOW-UP Backend API Integration Tests", () => {
  let app: AppInstance;
  let baseUrl: string;
  let useInProcess = false;

  const userA = {
    email: "user_a@example.com",
    password: "Password123!",
    token: "dev-token:user-a:user_a@example.com"
  };

  const userB = {
    email: "user_b@example.com",
    password: "Password123!",
    token: "dev-token:user-b:user_b@example.com"
  };

  beforeAll(async () => {
    app = createApp({
      dbPath: ":memory:",
      corsOrigin: "*",
      config: {
        auth: {
          devMode: true
        }
      }
    });

    try {
      await new Promise<void>((resolve, reject) => {
        app.server.once("error", reject);
        app.server.listen(0, () => resolve());
      });

      const addr = app.server.address();
      const port = typeof addr === "object" && addr ? addr.port : 3001;
      baseUrl = `http://localhost:${port}`;

      // Probe if TCP socket connect works in this environment
      await fetch(`${baseUrl}/health`);
    } catch {
      // In sandboxed environments on Windows, TCP sockets are blocked
      useInProcess = true;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  async function request(
    method: string,
    urlPath: string,
    options: { headers?: Record<string, string>; body?: string } = {},
    targetApp = app
  ): Promise<HttpResponse> {
    if (useInProcess) {
      return dispatchInProcess(targetApp, method, urlPath, options);
    }

    try {
      const res = await fetch(`${baseUrl}${urlPath}`, {
        method,
        headers: options.headers,
        body: options.body
      });
      return {
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        json: () => res.json(),
        text: () => res.text()
      };
    } catch (err: unknown) {
      const details = err && typeof err === "object" ? err as { code?: unknown; message?: unknown; cause?: unknown } : {};
      const cause = details.cause && typeof details.cause === "object" ? details.cause as { code?: unknown } : {};
      if (details.code === "EACCES" || (typeof details.message === "string" && details.message.includes("EACCES")) || cause.code === "EACCES") {
        useInProcess = true;
        return dispatchInProcess(targetApp, method, urlPath, options);
      }
      throw err;
    }
  }

  // FLOW 1: Server boots and health check works
  it("Flow 1: Server boots and health check responds with 200 OK", async () => {
    const res = await request("GET", "/health");
    expect(res.status).toBe(200);

    const data = await res.json<{ success: boolean; data: { status: string; timestamp: string } }>();
    expect(data.success).toBe(true);
    expect(data.data.status).toBe("ok");
    expect(typeof data.data.timestamp).toBe("string");

    const apiRes = await request("GET", "/api/health");
    expect(apiRes.status).toBe(200);
  });

  // FLOW 2: Requests without token are rejected
  it("Flow 2: Requests without token to protected endpoints are rejected with 401", async () => {
    const endpoints = [
      { method: "GET", path: "/api/workspaces/current" },
      { method: "POST", path: "/api/workspaces/initialize" },
      { method: "GET", path: "/api/goals" },
      { method: "POST", path: "/api/goals" },
      { method: "GET", path: "/api/projects" },
      { method: "POST", path: "/api/milestones" },
      { method: "POST", path: "/api/actions" },
      { method: "GET", path: "/api/planning/daily-plans/2026-11-18" },
      { method: "GET", path: "/api/progress/goals/goal-123" },
      { method: "GET", path: "/api/goals/goal-123/measurements" },
      { method: "POST", path: "/api/measurements" },
    ];

    for (const ep of endpoints) {
      const res = await request(ep.method, ep.path, {
        headers: { "Content-Type": "application/json" }
      });
      expect(res.status).toBe(401);

      const json = await res.json<{ success: boolean; error: { code: string; message: string } }>();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("UNAUTHORIZED");
    }
  });

  // FLOW 3: Valid authentication & Personal Workspace initialization
  it("Flow 3: Valid login initializes and retrieves Personal Workspace and Project", async () => {
    // 1. Initialize personal workspace
    const initRes = await request("POST", "/api/workspaces/initialize", {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      }
    });
    expect(initRes.status).toBe(201);
    const initData = await initRes.json<{ success: boolean; data: { id: string; userId: string; name: string } }>();
    expect(initData.success).toBe(true);
    expect(initData.data.userId).toBe("user-a");
    expect(initData.data.name).toBe("Personal Workspace");

    const workspaceId = initData.data.id;

    // 2. Calling initialize again is idempotent and returns existing workspace
    const reInitRes = await request("POST", "/api/workspaces/initialize", {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      }
    });
    expect(reInitRes.status).toBe(201);
    const reInitData = await reInitRes.json<{ success: boolean; data: { id: string } }>();
    expect(reInitData.data.id).toBe(workspaceId);

    // 3. Get current workspace
    const currentRes = await request("GET", "/api/workspaces/current", {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(currentRes.status).toBe(200);
    const currentData = await currentRes.json<{ success: boolean; data: { id: string; userId: string } }>();
    expect(currentData.data.id).toBe(workspaceId);

    // 4. Create Project
    const createProjRes = await request("POST", "/api/projects", {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "IELTS Preparation",
        description: "Study project for target 8.0"
      })
    });
    expect(createProjRes.status).toBe(201);
    const projData = await createProjRes.json<{
      success: boolean;
      data: { id: string; name: string; workspaceId: string; description: string };
    }>();
    expect(projData.success).toBe(true);
    expect(projData.data.name).toBe("IELTS Preparation");
    expect(projData.data.workspaceId).toBe(workspaceId);

    const projectId = projData.data.id;

    // 5. List projects
    const listProjRes = await request("GET", "/api/projects", {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(listProjRes.status).toBe(200);
    const listProjData = await listProjRes.json<{ success: boolean; data: Array<{ id: string }> }>();
    expect(listProjData.data.some((p) => p.id === projectId)).toBe(true);

    // 6. Update project
    const updateProjRes = await request("PATCH", `/api/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "IELTS 8.0 Mastery"
      })
    });
    expect(updateProjRes.status).toBe(200);
    const updateProjData = await updateProjRes.json<{ success: boolean; data: { name: string } }>();
    expect(updateProjData.data.name).toBe("IELTS 8.0 Mastery");
  });

  it("creates, scopes, lists, and deletes multiple owned Workspaces", async () => {
    const headers = {
      Authorization: `Bearer ${userA.token}`,
      "Content-Type": "application/json"
    };
    const create = await request("POST", "/api/workspaces", {
      headers,
      body: JSON.stringify({ name: "Side project" })
    });
    expect(create.status).toBe(201);
    const created = await create.json<{ data: { id: string; name: string; userId: string } }>();
    expect(created.data).toMatchObject({ name: "Side project", userId: "user-a" });

    const list = await request("GET", "/api/workspaces", { headers });
    const workspaces = await list.json<{ data: Array<{ id: string }> }>();
    expect(workspaces.data.map((workspace) => workspace.id)).toContain(created.data.id);

    const project = await request("POST", "/api/projects", {
      headers: { ...headers, "X-Workspace-Id": created.data.id },
      body: JSON.stringify({ name: "Scoped project" })
    });
    expect(project.status).toBe(201);
    const projectData = await project.json<{ data: { id: string; workspaceId: string } }>();
    expect(projectData.data.workspaceId).toBe(created.data.id);

    const goal = await request("POST", "/api/goals", {
      headers: { ...headers, "X-Workspace-Id": created.data.id },
      body: JSON.stringify({ title: "Goal in side project" })
    });
    expect(goal.status).toBe(201);
    const goalData = await goal.json<{ data: { id: string; workspaceId: string } }>();
    expect(goalData.data.workspaceId).toBe(created.data.id);

    const forbidden = await request("GET", "/api/workspaces/overview", {
      headers: { Authorization: `Bearer ${userB.token}`, "X-Workspace-Id": created.data.id }
    });
    expect(forbidden.status).toBe(403);

    const deleted = await request("DELETE", `/api/workspaces/${created.data.id}`, { headers });
    expect(deleted.status).toBe(200);
    expect(await app.container.repositories.workspace.findProjectById(projectData.data.id)).toBeNull();
    expect(await app.container.repositories.goal.findGoalById(goalData.data.id)).toBeNull();
    const projects = await request("GET", "/api/projects", {
      headers: { ...headers, "X-Workspace-Id": created.data.id }
    });
    expect(projects.status).toBe(404);
  });

  // FLOW 4: Create and retrieve Goal & hierarchy
  let createdGoalId: string;
  let childGoalId: string;
  let testProjectId: string;
  let measurementId: string;

  it("Flow 4: Create and retrieve Goal and Goal hierarchy", async () => {
    const projListRes = await request("GET", "/api/projects", {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    const projList = await projListRes.json<{ success: boolean; data: Array<{ id: string }> }>();
    testProjectId = projList.data[0].id;

    // 1. Create Parent Goal
    const createGoalRes = await request("POST", "/api/goals", {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Achieve IELTS Band 8.0",
        description: "Focus on Writing & Speaking",
        targetDate: "2026-12-31",
        projectId: testProjectId
      })
    });
    expect(createGoalRes.status).toBe(201);
    const goalData = await createGoalRes.json<{
      success: boolean;
      data: { id: string; title: string; parentGoalId: string | null; projectId: string };
    }>();
    expect(goalData.success).toBe(true);
    expect(goalData.data.title).toBe("Achieve IELTS Band 8.0");
    expect(goalData.data.parentGoalId).toBeNull();
    createdGoalId = goalData.data.id;

    // 2. Retrieve Goal by ID
    const getGoalRes = await request("GET", `/api/goals/${createdGoalId}`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(getGoalRes.status).toBe(200);
    const getGoalData = await getGoalRes.json<{ success: boolean; data: { id: string } }>();
    expect(getGoalData.data.id).toBe(createdGoalId);

    // 3. Add Child Goal
    const addChildRes = await request("POST", `/api/goals/${createdGoalId}/children`, {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Writing Sub-score 7.5",
        targetDate: "2026-11-30"
      })
    });
    expect(addChildRes.status).toBe(201);
    const childData = await addChildRes.json<{
      success: boolean;
      data: { id: string; parentGoalId: string; projectId: string };
    }>();
    expect(childData.success).toBe(true);
    expect(childData.data.parentGoalId).toBe(createdGoalId);
    childGoalId = childData.data.id;

    // 4. Retrieve Goal hierarchy tree
    const hierarchyRes = await request("GET", "/api/goals/hierarchy", {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(hierarchyRes.status).toBe(200);
    const hierarchyData = await hierarchyRes.json<{
      success: boolean;
      data: Array<{ goal: { id: string; title: string }; children: Array<{ goal: { id: string } }> }>;
    }>();
    expect(hierarchyData.success).toBe(true);
    const parentNode = hierarchyData.data.find((node) => node.goal.id === createdGoalId);
    expect(parentNode).toBeDefined();
    expect(parentNode!.children.some((c) => c.goal.id === childGoalId)).toBe(true);
  });

  // FLOW 5: Create Milestone and Action under correct Goal
  it("Flow 5: Create Milestone and Action belonging to the Goal, execute Action, and check Progress", async () => {
    // 1. Create Milestone under Goal
    const createMsRes = await request("POST", "/api/milestones", {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        goalId: createdGoalId,
        title: "Complete 20 Essay Practice Tasks",
        targetDate: "2026-11-25"
      })
    });
    expect(createMsRes.status).toBe(201);
    const msData = await createMsRes.json<{
      success: boolean;
      data: { id: string; goalId: string; status: string; completedAt: string | null };
    }>();
    expect(msData.success).toBe(true);
    expect(msData.data.goalId).toBe(createdGoalId);
    expect(msData.data.status).toBe("PENDING");

    const milestoneId = msData.data.id;

    // List milestones by goal
    const listMsRes = await request("GET", `/api/goals/${createdGoalId}/milestones`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(listMsRes.status).toBe(200);
    const listMsData = await listMsRes.json<{ success: boolean; data: Array<{ id: string }> }>();
    expect(listMsData.data.some((m) => m.id === milestoneId)).toBe(true);

    // 2. Create Action under Goal and Milestone
    const createActRes = await request("POST", "/api/actions", {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        goalId: createdGoalId,
        milestoneId,
        title: "Write Task 2 Essay: Climate Change",
        description: "Draft 250 words and self-evaluate"
      })
    });
    expect(createActRes.status).toBe(201);
    const actData = await createActRes.json<{
      success: boolean;
      data: { id: string; goalId: string; milestoneId: string; status: string };
    }>();
    expect(actData.success).toBe(true);
    expect(actData.data.goalId).toBe(createdGoalId);
    expect(actData.data.milestoneId).toBe(milestoneId);
    expect(actData.data.status).toBe("TODO");

    const actionId = actData.data.id;

    // 3. Update Action Status to IN_PROGRESS
    const updateStatusRes = await request("PATCH", `/api/actions/${actionId}/status`, {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "IN_PROGRESS" })
    });
    expect(updateStatusRes.status).toBe(200);
    const updatedStatusData = await updateStatusRes.json<{ success: boolean; data: { status: string } }>();
    expect(updatedStatusData.data.status).toBe("IN_PROGRESS");

    // 4. Complete Action
    const completeActRes = await request("POST", `/api/actions/${actionId}/complete`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(completeActRes.status).toBe(200);
    const completedActData = await completeActRes.json<{
      success: boolean;
      data: { status: string; completedAt: string };
    }>();
    expect(completedActData.data.status).toBe("COMPLETED");
    expect(typeof completedActData.data.completedAt).toBe("string");

    // 5. Record Action Execution data
    const recordExecRes = await request("POST", `/api/actions/${actionId}/execution`, {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        actualStartedAt: "2026-11-17T10:00:00.000Z",
        actualCompletedAt: "2026-11-17T10:45:00.000Z",
        actualDurationMinutes: 45,
        executionNote: "Finished 280 words essay on time."
      })
    });
    expect(recordExecRes.status).toBe(200);
    const execData = await recordExecRes.json<{
      success: boolean;
      data: { actionId: string; actualDurationMinutes: number; executionNote: string };
    }>();
    expect(execData.success).toBe(true);
    expect(execData.data.actualDurationMinutes).toBe(45);

    const measurementRes = await request("POST", "/api/measurements", {
      headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ goalId: createdGoalId, label: "Practice hours", valueType: "NUMBER", unit: "hours", targetValue: 10 })
    });
    expect(measurementRes.status).toBe(201);
    const measurementData = await measurementRes.json<{ data: { id: string; label: string; unit: string } }>();
    measurementId = measurementData.data.id;
    expect(measurementData.data.unit).toBe("hours");
    const invalidMeasurement = await request("POST", "/api/measurements", {
      headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ goalId: createdGoalId, label: "Invalid unit", valueType: "TEXT", unit: "kg" })
    });
    expect(invalidMeasurement.status).toBe(400);
    const recordRes = await request("POST", `/api/measurements/${measurementId}/records`, {
      headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ value: 4, note: "This week" })
    });
    expect(recordRes.status).toBe(201);
    const recordData = await recordRes.json<{ data: { value: number } }>();
    expect(recordData.data.value).toBe(4);
    const updateMeasurement = await request("PATCH", `/api/measurements/${measurementId}`, {
      headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Practice hours logged" })
    });
    expect((await updateMeasurement.json<{ data: { label: string } }>()).data.label).toBe("Practice hours logged");
    const currentRes = await request("GET", `/api/measurements/${measurementId}/current`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect((await currentRes.json<{ data: { value: number } }>()).data.value).toBe(4);
    const historyRes = await request("GET", `/api/measurements/${measurementId}/history`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect((await historyRes.json<{ data: Array<{ note: string }> }>()).data[0].note).toBe("This week");

    // Retrieve Action Execution data
    const getExecRes = await request("GET", `/api/actions/${actionId}/execution`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(getExecRes.status).toBe(200);
    const fetchedExecData = await getExecRes.json<{ success: boolean; data: { actualDurationMinutes: number } }>();
    expect(fetchedExecData.data.actualDurationMinutes).toBe(45);

    // 6. Complete Milestone
    const completeMsRes = await request("POST", `/api/milestones/${milestoneId}/complete`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(completeMsRes.status).toBe(200);
    const completedMsData = await completeMsRes.json<{ success: boolean; data: { status: string } }>();
    expect(completedMsData.data.status).toBe("COMPLETED");

    // 7. Planning: Create Daily Plan and Schedule
    const planRes = await request("POST", "/api/planning/daily-plans", {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ date: "2026-11-18" })
    });
    expect(planRes.status).toBe(201);
    const planData = await planRes.json<{ success: boolean; data: { id: string; date: string } }>();
    expect(planData.data.date).toBe("2026-11-18");

    const dailyPlanId = planData.data.id;

    // Add schedule
    const schedRes = await request("POST", "/api/planning/schedules", {
      headers: {
        Authorization: `Bearer ${userA.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        actionId,
        dailyPlanId,
        startAt: "2026-11-18T09:00:00.000Z",
        endAt: "2026-11-18T10:00:00.000Z"
      })
    });
    expect(schedRes.status).toBe(201);
    const schedData = await schedRes.json<{ success: boolean; data: { id: string; actionId: string } }>();
    expect(schedData.data.actionId).toBe(actionId);

    const overlappingRes = await request("POST", "/api/planning/schedules", {
      headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, startAt: "2026-11-18T09:30:00.000Z", endAt: "2026-11-18T10:30:00.000Z" })
    });
    expect(overlappingRes.status).toBe(409);
    expect((await overlappingRes.json<{ error: { code: string } }>()).error.code).toBe("SCHEDULE_CONFLICT");

    const movedRes = await request("PATCH", `/api/planning/schedules/${schedData.data.id}`, {
      headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startAt: "2026-11-18T10:00:00.000Z", endAt: "2026-11-18T11:00:00.000Z" })
    });
    expect(movedRes.status).toBe(200);

    const adjacentRes = await request("POST", "/api/planning/schedules", {
      headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ actionId, startAt: "2026-11-18T11:00:00.000Z", endAt: "2026-11-18T12:00:00.000Z" })
    });
    expect(adjacentRes.status).toBe(201);

    // 8. Progress endpoint: verify unconfigured rules return RULE_NOT_CONFIGURED & null progress
    const progRes = await request("GET", `/api/progress/goals/${createdGoalId}`, {
      headers: { Authorization: `Bearer ${userA.token}` }
    });
    expect(progRes.status).toBe(200);
    const progData = await progRes.json<{
      success: boolean;
      data: { goalId: string; calculationStatus: string; goalProgress: { progressValue: number | null; calculationStatus: string }; actionCompletion: { completedActions: number; completionValue: number | null } | null; measurementProgress: Array<{ currentValue: number; calculationStatus: string }> };
    }>();
    expect(progData.success).toBe(true);
    expect(progData.data.goalId).toBe(createdGoalId);
    expect(progData.data.calculationStatus).toBe("RULE_NOT_CONFIGURED");
    expect(progData.data.goalProgress.progressValue).toBeNull();
    expect(progData.data.actionCompletion?.completedActions).toBe(1);
    expect(progData.data.actionCompletion?.completionValue).toBe(100);
    expect(progData.data.measurementProgress[0]).toMatchObject({ currentValue: 4, calculationStatus: "RULE_NOT_CONFIGURED" });
  });

  // FLOW 6: Cross-user data isolation
  it("Flow 6: Another user cannot access or mutate the current user's data", async () => {
    // 1. User B initializes their own workspace
    const initB = await request("POST", "/api/workspaces/initialize", {
      headers: {
        Authorization: `Bearer ${userB.token}`,
        "Content-Type": "application/json"
      }
    });
    expect(initB.status).toBe(201);
    const dataB = await initB.json<{ data: { id: string; userId: string } }>();
    expect(dataB.data.userId).toBe("user-b");

    // 2. User B attempts to access User A's Goal
    const crossGoalRes = await request("GET", `/api/goals/${createdGoalId}`, {
      headers: { Authorization: `Bearer ${userB.token}` }
    });
    expect(crossGoalRes.status).toBe(403);
    const crossGoalData = await crossGoalRes.json<{ success: boolean; error: { code: string } }>();
    expect(crossGoalData.success).toBe(false);
    expect(crossGoalData.error.code).toBe("GOAL_ACCESS_DENIED");
    const crossMeasurementRes = await request("GET", `/api/measurements/${measurementId}`, {
      headers: { Authorization: `Bearer ${userB.token}` }
    });
    expect(crossMeasurementRes.status).toBe(403);

    // 3. User B attempts to update User A's Goal
    const crossUpdateGoalRes = await request("PATCH", `/api/goals/${createdGoalId}`, {
      headers: {
        Authorization: `Bearer ${userB.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: "Hacked Goal Title" })
    });
    expect(crossUpdateGoalRes.status).toBe(403);

    // 4. User B attempts to access User A's Project
    const crossProjRes = await request("GET", `/api/projects/${testProjectId}`, {
      headers: { Authorization: `Bearer ${userB.token}` }
    });
    expect(crossProjRes.status).toBe(403);
    const crossProjData = await crossProjRes.json<{ success: boolean; error: { code: string } }>();
    expect(crossProjData.error.code).toBe("PROJECT_ACCESS_DENIED");

    // 5. User B lists goals: User B sees ONLY their own goals (empty list), not User A's
    const userBGoalsRes = await request("GET", "/api/goals", {
      headers: { Authorization: `Bearer ${userB.token}` }
    });
    expect(userBGoalsRes.status).toBe(200);
    const userBGoals = await userBGoalsRes.json<{ success: boolean; data: Array<{ id: string }> }>();
    expect(userBGoals.data.length).toBe(0);
  });

  // FLOW 7: Database persistence across server restart
  it("Flow 7: Data persists safely across server restart with SQLite file", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "flowup-test-"));
    const tempDbPath = path.join(tempDir, "flowup-restart-test.db");

    let server1: AppInstance | null = null;
    let server2: AppInstance | null = null;
    let savedGoalId: string;

    try {
      // Phase 1: Boot Server 1 on file-based DB
      server1 = createApp({
        dbPath: tempDbPath,
        config: { auth: { devMode: true } }
      });

      // Initialize workspace on Server 1
      await request(
        "POST",
        "/api/workspaces/initialize",
        {
          headers: {
            Authorization: `Bearer ${userA.token}`,
            "Content-Type": "application/json"
          }
        },
        server1
      );

      // Create Goal on Server 1
      const createGoal = await request(
        "POST",
        "/api/goals",
        {
          headers: {
            Authorization: `Bearer ${userA.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: "Persistent Goal across Reboots",
            targetDate: "2027-01-01"
          })
        },
        server1
      );
      expect(createGoal.status).toBe(201);
      const goalJson = await createGoal.json<{ data: { id: string } }>();
      savedGoalId = goalJson.data.id;

      const createdMeasurement = await request("POST", "/api/measurements", {
        headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ goalId: savedGoalId, label: "Weekly focus", valueType: "NUMBER", unit: "hours", targetValue: 5 })
      }, server1);
      expect(createdMeasurement.status).toBe(201);
      const savedMeasurement = (await createdMeasurement.json<{ data: { id: string } }>()).data;
      const recordedValue = await request("POST", `/api/measurements/${savedMeasurement.id}/records`, {
        headers: { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ value: 3 })
      }, server1);
      expect(recordedValue.status).toBe(201);

      // Create Milestone on Server 1
      const createMs = await request(
        "POST",
        "/api/milestones",
        {
          headers: {
            Authorization: `Bearer ${userA.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            goalId: savedGoalId,
            title: "Persistent Milestone Checkpoint"
          })
        },
        server1
      );
      expect(createMs.status).toBe(201);

      // Stop Server 1 (simulating shutdown)
      await server1.close();
      server1 = null;

      // Phase 2: Boot Server 2 on the SAME file-based DB
      server2 = createApp({
        dbPath: tempDbPath,
        config: { auth: { devMode: true } }
      });

      // Query Server 2 for the previously created Goal
      const retrieveGoal = await request(
        "GET",
        `/api/goals/${savedGoalId}`,
        {
          headers: { Authorization: `Bearer ${userA.token}` }
        },
        server2
      );
      expect(retrieveGoal.status).toBe(200);
      const retrievedGoalJson = await retrieveGoal.json<{ success: boolean; data: { id: string; title: string } }>();
      expect(retrievedGoalJson.success).toBe(true);
      expect(retrievedGoalJson.data.id).toBe(savedGoalId);
      expect(retrievedGoalJson.data.title).toBe("Persistent Goal across Reboots");

      // Query Server 2 for the previously created Milestone
      const retrieveMilestones = await request(
        "GET",
        `/api/goals/${savedGoalId}/milestones`,
        {
          headers: { Authorization: `Bearer ${userA.token}` }
        },
        server2
      );
      expect(retrieveMilestones.status).toBe(200);
      const retrievedMsJson = await retrieveMilestones.json<{
        success: boolean;
        data: Array<{ title: string; goalId: string }>;
      }>();
      expect(retrievedMsJson.success).toBe(true);
      expect(retrievedMsJson.data.length).toBe(1);
      expect(retrievedMsJson.data[0].title).toBe("Persistent Milestone Checkpoint");
      expect(retrievedMsJson.data[0].goalId).toBe(savedGoalId);

      const retrievedMeasurements = await request("GET", `/api/goals/${savedGoalId}/measurements`, {
        headers: { Authorization: `Bearer ${userA.token}` }
      }, server2);
      const measurementList = await retrievedMeasurements.json<{ data: Array<{ id: string }> }>();
      expect(measurementList.data).toHaveLength(1);
      const retrievedHistory = await request("GET", `/api/measurements/${savedMeasurement.id}/history`, {
        headers: { Authorization: `Bearer ${userA.token}` }
      }, server2);
      expect((await retrievedHistory.json<{ data: Array<{ value: number }> }>()).data[0].value).toBe(3);
    } finally {
      if (server1) await (server1 as AppInstance).close();
      if (server2) await (server2 as AppInstance).close();
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup error
      }
    }
  });

  it("keeps AI routes authenticated and degrades cleanly without a provider key", async () => {
    const unauthorized = await request("POST", "/api/ai/goal-understanding", {
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ input: "Learn Spanish" }),
    });
    expect(unauthorized.status).toBe(401);
    const unavailable = await request("POST", "/api/ai/goal-understanding", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${userA.token}` },
      body: JSON.stringify({ input: "Learn Spanish" }),
    });
    expect(unavailable.status).toBe(503);
    expect(await unavailable.json()).toMatchObject({ success: false, error: { code: "AI_PROVIDER_UNAVAILABLE" } });
  });

  it("runs a mocked discovery-to-approved-domain-record journey across a database restart", async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-up-ai-e2e-"));
    const dbPath = path.join(tempDir, "flow-up.db");
    const provider = {
      async generate(request: { operationType: string }) {
        if (request.operationType === "GOAL_CLARIFICATION") return { content: {
          outcome: "Learn conversational Spanish", successCriteria: ["Hold a 10-minute conversation"],
          knownFacts: ["The user wants to learn Spanish"], assumptions: [], missingInformation: ["Target date"], questions: [],
        } };
        if (request.operationType === "GOAL_FEASIBILITY") return { content: {
          assessment: "INSUFFICIENT_INFORMATION", summary: "A target date and available time are unknown.",
          concerns: [], alternatives: [], assumptions: [], missingInformation: ["Target date", "Available weekly time"],
        } };
        return { content: { summary: "A small starter plan", items: [
          { id: "root", type: "GOAL", title: "Learn conversational Spanish", description: "", targetDate: null, parentItemId: null, rationale: "Desired outcome" },
          { id: "checkpoint", type: "MILESTONE", title: "Complete beginner lessons", description: "", targetDate: null, parentItemId: "root", rationale: "First checkpoint" },
          { id: "practice", type: "ACTION", title: "Practice vocabulary for 15 minutes", description: "", targetDate: null, parentItemId: "checkpoint", rationale: "A manageable first step" },
          { id: "minutes", type: "MEASUREMENT", title: "Weekly practice time", description: "Record practice time each week.", targetDate: null, parentItemId: "root", rationale: "A measurable signal", valueType: "NUMBER", unit: "minutes", targetValue: null },
        ] } };
      },
    };
    let first = createApp({ dbPath, config: { auth: { devMode: true }, ai: { provider } } });
    const auth = { Authorization: `Bearer ${userA.token}`, "Content-Type": "application/json" };
    const invoke = (target: AppInstance, method: string, url: string, body?: unknown) =>
      dispatchInProcess(target, method, url, { headers: auth, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    try {
      expect((await invoke(first, "POST", "/api/workspaces/initialize")).status).toBe(201);
      expect((await invoke(first, "POST", "/api/ai/goal-understanding", { input: "I want to learn Spanish but do not know where to begin." })).status).toBe(200);
      expect((await invoke(first, "POST", "/api/ai/feasibility", { input: "I want to learn Spanish but do not know where to begin." })).status).toBe(200);
      const proposed = await invoke(first, "POST", "/api/ai/goal-proposals", { input: "I want to learn Spanish but do not know where to begin." });
      expect(proposed.status).toBe(200);
      const proposal = (await proposed.json<{ data: { id: string; proposalData: { items: { id: string }[] } } }>()).data;
      expect(proposal.proposalData.items).toHaveLength(4);
      const applied = await invoke(first, "POST", `/api/ai/proposals/${proposal.id}/apply`, {
        selection: { selectedItemIds: proposal.proposalData.items.map((item) => item.id), editedData: proposal.proposalData },
      });
      expect(applied.status).toBe(200);
      expect(await applied.json()).toMatchObject({ data: { status: "APPLIED" } });
      await first.close();
      first = null as unknown as AppInstance;

      const second = createApp({ dbPath, config: { auth: { devMode: true } } });
      try {
        const goals = await invoke(second, "GET", "/api/goals");
        const goal = (await goals.json<{ data: { id: string; title: string }[] }>()).data[0];
        expect(goal.title).toBe("Learn conversational Spanish");
        const milestones = await invoke(second, "GET", `/api/goals/${goal.id}/milestones`);
        const milestone = (await milestones.json<{ data: { id: string; title: string }[] }>()).data[0];
        expect(milestone.title).toBe("Complete beginner lessons");
        const actions = await invoke(second, "GET", `/api/goals/${goal.id}/actions`);
        expect((await actions.json<{ data: { title: string; milestoneId: string }[] }>()).data[0]).toMatchObject({
          title: "Practice vocabulary for 15 minutes", milestoneId: milestone.id,
        });
        const measurements = await invoke(second, "GET", `/api/goals/${goal.id}/measurements`);
        expect((await measurements.json<{ data: { label: string; unit: string }[] }>()).data[0]).toMatchObject({ label: "Weekly practice time", unit: "minutes" });
        const duplicate = await invoke(second, "POST", `/api/ai/proposals/${proposal.id}/apply`, {
          selection: { selectedItemIds: proposal.proposalData.items.map((item) => item.id), editedData: proposal.proposalData },
        });
        expect(duplicate.status).toBe(409);
      } finally { await second.close(); }
    } finally {
      if (first) await first.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
