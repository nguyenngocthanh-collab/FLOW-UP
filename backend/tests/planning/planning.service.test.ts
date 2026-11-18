import { describe, expect, it, vi } from "vitest";
import { PlanningService } from "../../src/modules/planning";
import type {
  AuthenticatedUserContext, DailyPlan, ScheduleEntry,
} from "../../src/modules/planning";

const user: AuthenticatedUserContext = { userId: "user-1", email: null, isAuthenticated: true };
const plan: DailyPlan = {
  id: "plan-1", userId: "user-1", date: "2026-11-18",
  createdAt: "2026-11-17T00:00:00.000Z", updatedAt: "2026-11-17T00:00:00.000Z",
};
const schedule: ScheduleEntry = {
  id: "schedule-1", actionId: "action-1", dailyPlanId: "plan-1",
  startAt: "2026-11-18T08:00:00Z", endAt: "2026-11-18T09:00:00Z",
  createdAt: "2026-11-17T00:00:00.000Z", updatedAt: "2026-11-17T00:00:00.000Z",
};

function setup() {
  const repo = {
    createDailyPlan: vi.fn(async (input: Omit<DailyPlan, "id">) => ({ ...input, id: "plan-1" })),
    getDailyPlan: vi.fn(async () => plan),
    findDailyPlanByUserAndDate: vi.fn(async () => null),
    updateDailyPlan: vi.fn(async (_id: string, patch: Partial<DailyPlan>) => ({ ...plan, ...patch })),
    listSchedulesByDailyPlan: vi.fn(async () => [schedule]),
    createSchedule: vi.fn(async (input: Omit<ScheduleEntry, "id">) => ({ ...input, id: "schedule-1" })),
    getSchedule: vi.fn(async () => schedule),
    updateSchedule: vi.fn(async (_id: string, patch: Partial<ScheduleEntry>) => ({ ...schedule, ...patch })),
    deleteSchedule: vi.fn(async () => undefined),
    listSchedulesByDateRange: vi.fn(async () => [schedule]),
    findOverlappingSchedules: vi.fn(async () => []),
  };
  const actionAccess = { assertCanAccessAction: vi.fn(async () => undefined) };
  const access = {
    assertCanAccessDailyPlan: vi.fn(async () => undefined),
    assertCanAccessSchedule: vi.fn(async () => undefined),
  };
  const rules = {
    assertScheduleAllowed: vi.fn(async () => undefined),
    assertScheduleMatchesPlanDate: vi.fn(),
  };
  const proposalApproval = { assertApprovedByUser: vi.fn(async () => undefined) };
  return { service: new PlanningService(repo, actionAccess, access, rules, proposalApproval), repo, actionAccess, access, rules, proposalApproval };
}

describe("PlanningService", () => {
  it("creates a Daily Plan for the authenticated user", async () => {
    const { service, repo } = setup();
    const result = await service.createDailyPlan(user, { date: "2026-11-18" });
    expect(result.userId).toBe(user.userId);
    expect(repo.createDailyPlan).toHaveBeenCalled();
  });

  it("creates a Schedule after validating Action access", async () => {
    const { service, actionAccess, repo, rules } = setup();
    const result = await service.createSchedule(user, {
      actionId: "action-1", startAt: schedule.startAt, endAt: schedule.endAt, dailyPlanId: plan.id,
    });
    expect(result.actionId).toBe("action-1");
    expect(actionAccess.assertCanAccessAction).toHaveBeenCalledWith(user, "action-1");
    expect(rules.assertScheduleAllowed).toHaveBeenCalled();
    expect(repo.createSchedule).toHaveBeenCalled();
  });

  it("deletes a Schedule without deleting its Action", async () => {
    const { service, repo } = setup();
    await service.deleteSchedule(user, schedule.id);
    expect(repo.deleteSchedule).toHaveBeenCalledWith(schedule.id);
  });

  it("requires approval before applying a proposal", async () => {
    const { service, proposalApproval } = setup();
    await service.applyApprovedPlanningProposal(user, {
      proposalId: "proposal-1", userId: user.userId, approved: true, schedules: [],
    });
    expect(proposalApproval.assertApprovedByUser).toHaveBeenCalledWith(user, "proposal-1");
  });
});
