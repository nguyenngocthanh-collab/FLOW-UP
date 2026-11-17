export type DailyPlanId = string & { readonly __brand: "DailyPlanId" };
export type ScheduleId = string & { readonly __brand: "ScheduleId" };
export type UserId = string & { readonly __brand: "UserId" };
export type ActionId = string & { readonly __brand: "ActionId" };

/** Logical domain models; not persistence schemas. */
export interface DailyPlan {
  id: DailyPlanId;
  userId: UserId;
  date: string; // Local calendar date, not a UTC instant.
  status?: string | null; // OPEN: lifecycle states/transitions.
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface Schedule {
  id: ScheduleId;
  actionId: ActionId;
  dailyPlanId?: DailyPlanId | null; // Association cardinality remains OPEN.
  startAt: string;
  endAt: string;
  status?: string | null; // OPEN: lifecycle states/transitions.
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface DailyPlanUserFacts {
  userExists: boolean;
  accessible: boolean;
}

export interface ScheduleActionFacts {
  actionExists: boolean;
  accessible: boolean;
}

export interface ScheduleDailyPlanFacts {
  exists: boolean;
  belongsToUser: boolean;
}

export interface ScheduleConflict {
  scheduleId: string;
  overlaps: boolean;
  blocking?: boolean; // Policy-owned; detection alone must not infer blocking.
}
