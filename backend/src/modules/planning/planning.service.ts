import { PlanningError } from "./planning.errors";
import type {
  ActionAccess, PlanningAccess, PlanningProposalApproval, PlanningRepository, PlanningRules,
} from "./planning.repository";
import type {
  ApprovedPlanningProposal, AuthenticatedUserContext, CreateDailyPlanInput, CreateScheduleInput,
  DailyPlan, PlanningDateRange, ScheduleEntry, UpdateDailyPlanInput, UpdateScheduleInput,
} from "./planning.types";
import {
  validateCreateScheduleInput, validateDailyPlanInput, validateDateRange,
  validateScheduleTimes, validateUpdateScheduleInput,
} from "./planning.validation";

export class PlanningService {
  constructor(
    private readonly repository: PlanningRepository,
    private readonly actionAccess: ActionAccess,
    private readonly access: PlanningAccess,
    private readonly rules: PlanningRules,
    private readonly proposalApproval: PlanningProposalApproval,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async createDailyPlan(user: AuthenticatedUserContext, input: CreateDailyPlanInput): Promise<DailyPlan> {
    this.assertAuthenticated(user);
    validateDailyPlanInput(input);
    const existing = await this.repository.findDailyPlanByUserAndDate(user.userId, input.date);
    if (existing) throw new PlanningError("DAILY_PLAN_ALREADY_EXISTS", "A Daily Plan already exists for this user and date.");
    const timestamp = this.now().toISOString();
    return this.repository.createDailyPlan({
      userId: user.userId, date: input.date, createdAt: timestamp, updatedAt: timestamp,
    });
  }

  async getDailyPlan(user: AuthenticatedUserContext, date: string): Promise<{
    dailyPlan: DailyPlan; schedules: ScheduleEntry[];
  } | null> {
    this.assertAuthenticated(user);
    validateDailyPlanInput({ date });
    const plan = await this.repository.findDailyPlanByUserAndDate(user.userId, date);
    if (!plan) return null;
    await this.access.assertCanAccessDailyPlan(user, plan);
    return { dailyPlan: plan, schedules: await this.repository.listSchedulesByDailyPlan(plan.id) };
  }

  async updateDailyPlan(
    user: AuthenticatedUserContext, id: string, patch: UpdateDailyPlanInput,
  ): Promise<DailyPlan> {
    const plan = await this.getOwnedPlan(user, id);
    validateDailyPlanInput(patch);
    if (patch.date !== undefined && patch.date !== plan.date) {
      const existing = await this.repository.findDailyPlanByUserAndDate(user.userId, patch.date);
      if (existing && existing.id !== id) {
        throw new PlanningError("DAILY_PLAN_ALREADY_EXISTS", "A Daily Plan already exists for the target date.");
      }
      const schedules = await this.repository.listSchedulesByDailyPlan(id);
      for (const schedule of schedules) {
        this.rules.assertScheduleMatchesPlanDate({ ...schedule, dailyPlan: { ...plan, date: patch.date } });
      }
    }
    return this.repository.updateDailyPlan(id, { ...patch, updatedAt: this.now().toISOString() });
  }

  async addActionToDailyPlan(
    user: AuthenticatedUserContext, dailyPlanId: string, input: Omit<CreateScheduleInput, "dailyPlanId">,
  ): Promise<ScheduleEntry> {
    const plan = await this.getOwnedPlan(user, dailyPlanId);
    return this.createSchedule(user, { ...input, dailyPlanId: plan.id });
  }

  async removeActionFromDailyPlan(
    user: AuthenticatedUserContext, dailyPlanId: string, scheduleId: string,
  ): Promise<ScheduleEntry> {
    const plan = await this.getOwnedPlan(user, dailyPlanId);
    const schedule = await this.getOwnedSchedule(user, scheduleId);
    if (schedule.dailyPlanId !== plan.id) {
      throw new PlanningError("SCHEDULE_INVALID_RELATIONSHIP", "Schedule does not belong to the requested Daily Plan.");
    }
    return this.repository.updateSchedule(schedule.id, {
      dailyPlanId: null, updatedAt: this.now().toISOString(),
    });
  }

  async createSchedule(user: AuthenticatedUserContext, input: CreateScheduleInput): Promise<ScheduleEntry> {
    this.assertAuthenticated(user);
    validateCreateScheduleInput(input);
    await this.actionAccess.assertCanAccessAction(user, input.actionId);
    const plan = input.dailyPlanId ? await this.getOwnedPlan(user, input.dailyPlanId) : null;
    if (plan) this.rules.assertScheduleMatchesPlanDate({ startAt: input.startAt, endAt: input.endAt, dailyPlan: plan });
    await this.rules.assertScheduleAllowed({
      userId: user.userId, actionId: input.actionId, dailyPlan: plan, startAt: input.startAt, endAt: input.endAt,
    });
    const timestamp = this.now().toISOString();
    return this.repository.createSchedule({
      actionId: input.actionId, dailyPlanId: input.dailyPlanId ?? null,
      startAt: input.startAt, endAt: input.endAt, createdAt: timestamp, updatedAt: timestamp,
    });
  }

  async getSchedule(user: AuthenticatedUserContext, id: string): Promise<ScheduleEntry> {
    return this.getOwnedSchedule(user, id);
  }

  async updateSchedule(
    user: AuthenticatedUserContext, id: string, patch: UpdateScheduleInput,
  ): Promise<ScheduleEntry> {
    const schedule = await this.getOwnedSchedule(user, id);
    validateUpdateScheduleInput(patch);
    const startAt = patch.startAt ?? schedule.startAt;
    const endAt = patch.endAt ?? schedule.endAt;
    validateScheduleTimes(startAt, endAt);
    const dailyPlanId = patch.dailyPlanId === undefined ? schedule.dailyPlanId : patch.dailyPlanId;
    const plan = dailyPlanId ? await this.getOwnedPlan(user, dailyPlanId) : null;
    if (plan) this.rules.assertScheduleMatchesPlanDate({ startAt, endAt, dailyPlan: plan });
    await this.actionAccess.assertCanAccessAction(user, schedule.actionId);
    await this.rules.assertScheduleAllowed({
      userId: user.userId, actionId: schedule.actionId, dailyPlan: plan, startAt, endAt, excludeScheduleId: schedule.id,
    });
    return this.repository.updateSchedule(id, { ...patch, updatedAt: this.now().toISOString() });
  }

  async deleteSchedule(user: AuthenticatedUserContext, id: string): Promise<void> {
    await this.getOwnedSchedule(user, id);
    await this.repository.deleteSchedule(id);
  }

  async getSchedulesByDateRange(
    user: AuthenticatedUserContext, range: PlanningDateRange,
  ): Promise<ScheduleEntry[]> {
    this.assertAuthenticated(user);
    validateDateRange(range);
    return this.repository.listSchedulesByDateRange(user.userId, range, user.workspaceId);
  }

  async applyApprovedPlanningProposal(
    user: AuthenticatedUserContext, proposal: ApprovedPlanningProposal,
  ): Promise<ScheduleEntry[]> {
    this.assertAuthenticated(user);
    if (!proposal || proposal.approved !== true || !proposal.proposalId ||
        proposal.userId !== user.userId || !Array.isArray(proposal.schedules)) {
      throw new PlanningError("PLANNING_PROPOSAL_INVALID", "Proposal is invalid or not approved for this user.");
    }
    await this.proposalApproval.assertApprovedByUser(user, proposal.proposalId);
    const created: ScheduleEntry[] = [];
    // This starter applies through the same createSchedule operation; transaction/atomic batch
    // behavior must be supplied by D01 when persistence is integrated.
    for (const schedule of proposal.schedules) created.push(await this.createSchedule(user, schedule));
    return created;
  }

  private async getOwnedPlan(user: AuthenticatedUserContext, id: string): Promise<DailyPlan> {
    this.assertAuthenticated(user);
    const plan = await this.repository.getDailyPlan(id);
    if (!plan) throw new PlanningError("DAILY_PLAN_NOT_FOUND", "Daily Plan was not found.");
    await this.access.assertCanAccessDailyPlan(user, plan);
    return plan;
  }

  private async getOwnedSchedule(user: AuthenticatedUserContext, id: string): Promise<ScheduleEntry> {
    this.assertAuthenticated(user);
    const schedule = await this.repository.getSchedule(id);
    if (!schedule) throw new PlanningError("SCHEDULE_NOT_FOUND", "Schedule was not found.");
    await this.access.assertCanAccessSchedule(user, schedule);
    await this.actionAccess.assertCanAccessAction(user, schedule.actionId);
    return schedule;
  }

  private assertAuthenticated(user: AuthenticatedUserContext): void {
    if (!user || user.isAuthenticated !== true || !user.userId) {
      throw new PlanningError("DAILY_PLAN_ACCESS_DENIED", "Authenticated user context is required.");
    }
  }
}
