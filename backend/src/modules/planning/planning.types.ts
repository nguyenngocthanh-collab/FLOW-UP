export type DailyPlanId = string;
export type ScheduleId = string;
export type ActionId = string;

export interface AuthenticatedUserContext {
  userId: string;
  email: string | null;
  isAuthenticated: true;
  workspaceId?: string;
}

export interface DailyPlan {
  id: DailyPlanId;
  userId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleEntry {
  id: ScheduleId;
  actionId: ActionId;
  dailyPlanId: DailyPlanId | null;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDailyPlanInput { date: string; }
export interface UpdateDailyPlanInput { date?: string; }

export interface CreateScheduleInput {
  actionId: ActionId;
  startAt: string;
  endAt: string;
  dailyPlanId?: DailyPlanId | null;
}

export interface UpdateScheduleInput {
  startAt?: string;
  endAt?: string;
  dailyPlanId?: DailyPlanId | null;
}

export interface PlanningDateRange {
  startDate: string;
  endDate: string;
}

export interface ApprovedPlanningProposal {
  /** Must be supplied by a trusted B10 approval workflow, not inferred from client input. */
  proposalId: string;
  userId: string;
  approved: true;
  schedules: CreateScheduleInput[];
}
