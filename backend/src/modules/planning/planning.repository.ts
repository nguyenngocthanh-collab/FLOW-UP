import type {
  ActionId, AuthenticatedUserContext, DailyPlan, DailyPlanId, PlanningDateRange,
  ScheduleEntry, ScheduleId,
} from "./planning.types";

export interface PlanningRepository {
  createDailyPlan(input: Omit<DailyPlan, "id">): Promise<DailyPlan>;
  getDailyPlan(id: DailyPlanId): Promise<DailyPlan | null>;
  findDailyPlanByUserAndDate(userId: string, date: string): Promise<DailyPlan | null>;
  updateDailyPlan(id: DailyPlanId, patch: Partial<Pick<DailyPlan, "date" | "updatedAt">>): Promise<DailyPlan>;
  listSchedulesByDailyPlan(dailyPlanId: DailyPlanId): Promise<ScheduleEntry[]>;
  createSchedule(input: Omit<ScheduleEntry, "id">): Promise<ScheduleEntry>;
  getSchedule(id: ScheduleId): Promise<ScheduleEntry | null>;
  updateSchedule(id: ScheduleId, patch: Partial<Pick<ScheduleEntry,
    "startAt" | "endAt" | "dailyPlanId" | "updatedAt">>): Promise<ScheduleEntry>;
  deleteSchedule(id: ScheduleId): Promise<void>;
  listSchedulesByDateRange(userId: string, range: PlanningDateRange): Promise<ScheduleEntry[]>;
  findOverlappingSchedules(userId: string, startAt: string, endAt: string, excludeScheduleId?: ScheduleId): Promise<ScheduleEntry[]>;
}

export interface ActionAccess {
  assertCanAccessAction(user: AuthenticatedUserContext, actionId: ActionId): Promise<void>;
}

export interface PlanningAccess {
  assertCanAccessDailyPlan(user: AuthenticatedUserContext, plan: DailyPlan): Promise<void>;
  assertCanAccessSchedule(user: AuthenticatedUserContext, schedule: ScheduleEntry): Promise<void>;
}

export interface PlanningRules {
  /** C07 / DEC-017 supplies approved conflict and relationship behavior. */
  assertScheduleAllowed(input: {
    userId: string; actionId: ActionId; dailyPlan: DailyPlan | null; startAt: string; endAt: string;
    excludeScheduleId?: ScheduleId;
  }): Promise<void>;
  /** C07 supplies the approved date/time-zone and date-boundary interpretation. */
  assertScheduleMatchesPlanDate(schedule: {
    startAt: string; endAt: string; dailyPlan: DailyPlan;
  }): void;
}

export interface PlanningProposalApproval {
  assertApprovedByUser(user: AuthenticatedUserContext, proposalId: string): Promise<void>;
}
