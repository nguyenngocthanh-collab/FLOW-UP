import { DailyPlan, Schedule, DailyPlanId, ScheduleId, UserId, ActionId } from "./planning.types";

export interface PlanningActionReader {
  getActionFacts(actionId: ActionId): Promise<{ actionExists: boolean; accessible: boolean }>;
}

export interface PlanningReader {
  getDailyPlan(id: DailyPlanId): Promise<DailyPlan | null>;
  getSchedule(id: ScheduleId): Promise<Schedule | null>;
  getSchedulesByAction(actionId: ActionId): Promise<Schedule[]>;
  getSchedulesByDateRange(startAt: string, endAt: string): Promise<Schedule[]>;
}

/** Application layer supplies explicit approval; C07 does not obtain/fabricate it. */
export interface ApprovedPlanningProposal {
  approved: true;
  schedules: readonly {
    actionId: ActionId;
    startAt: string;
    endAt: string;
    dailyPlanId?: DailyPlanId | null;
  }[];
}

/** Read-only planned-time facts for C08/C09. Never contains C05 actual execution data. */
export interface PlanningReadFacts {
  schedules: readonly Pick<Schedule, "id" | "actionId" | "dailyPlanId" | "startAt" | "endAt">[];
}
