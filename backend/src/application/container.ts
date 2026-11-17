import type { DatabaseConnection } from "../infrastructure/database/sqlite.ts";
import {
  SqliteWorkspaceRepository,
  SqliteGoalRepository,
  SqliteMilestoneRepository,
  SqliteActionRepository,
  SqlitePlanningRepository
} from "../infrastructure/repositories/index.ts";
import {
  createAuthProvider,
  createTokenVerifier,
  type AuthConfig,
  type TokenVerifier
} from "../infrastructure/auth/index.ts";
import {
  createAuthenticationService,
  type AuthenticationService
} from "../modules/auth/index.ts";
import {
  createWorkspaceService,
  type WorkspaceService,
  type GoalSummaryReader
} from "../modules/workspace/index.ts";
import {
  createGoalService,
  type GoalService,
  type GoalWorkspaceAccess
} from "../modules/goal/index.ts";
import {
  createMilestoneService,
  type MilestoneService,
  type MilestoneGoalAccess
} from "../modules/milestone/index.ts";
import {
  createActionService,
  type ActionService,
  type ActionGoalAccess,
  type ActionMilestoneAccess
} from "../modules/action/index.ts";
import {
  PlanningService,
  PlanningError,
  type ActionAccess,
  type PlanningAccess,
  type PlanningProposalApproval,
  type PlanningRules
} from "../modules/planning/index.ts";
import {
  ProgressService,
  ProgressError,
  type ProgressRules,
  type ProgressSourceAccess
} from "../modules/progress/index.ts";

export interface ApplicationContainer {
  connection: DatabaseConnection;
  authService: AuthenticationService;
  tokenVerifier: TokenVerifier;
  workspaceService: WorkspaceService;
  goalService: GoalService;
  milestoneService: MilestoneService;
  actionService: ActionService;
  planningService: PlanningService;
  progressService: ProgressService;
  repositories: {
    workspace: SqliteWorkspaceRepository;
    goal: SqliteGoalRepository;
    milestone: SqliteMilestoneRepository;
    action: SqliteActionRepository;
    planning: SqlitePlanningRepository;
  };
}

export interface ContainerConfig {
  auth?: AuthConfig;
}

export function createApplicationContainer(
  connection: DatabaseConnection,
  config: ContainerConfig = {}
): ApplicationContainer {
  // 1. Repositories
  const workspaceRepo = new SqliteWorkspaceRepository(connection);
  const goalRepo = new SqliteGoalRepository(connection);
  const milestoneRepo = new SqliteMilestoneRepository(connection);
  const actionRepo = new SqliteActionRepository(connection);
  const planningRepo = new SqlitePlanningRepository(connection);

  // 2. Auth & Token Verifier
  const authConfig: AuthConfig = config.auth ?? {};
  const authProvider = createAuthProvider(authConfig);
  const authService = createAuthenticationService(authProvider);
  const tokenVerifier = createTokenVerifier({
    supabaseUrl: authConfig.supabaseUrl,
    supabaseKey: authConfig.supabaseAnonKey,
    devMode: authConfig.devMode ?? true
  });

  // 3. B02 Workspace Service
  const goalSummaryReader: GoalSummaryReader = {
    async getIndependentGoalCount(workspaceId: string): Promise<number> {
      return goalRepo.countIndependentGoals(workspaceId);
    },
    async getProjectGoalCount(projectId: string): Promise<number> {
      return goalRepo.countProjectGoals(projectId);
    }
  };

  const workspaceService = createWorkspaceService(workspaceRepo, goalSummaryReader);

  // 4. B03 Goal Service
  const goalWorkspaceAccess: GoalWorkspaceAccess = {
    async getCurrentWorkspaceId(userId: string): Promise<string | null> {
      const ws = await workspaceRepo.findWorkspaceByUserId(userId);
      return ws?.id ?? null;
    },
    async validateProjectInWorkspace(
      userId: string,
      workspaceId: string,
      projectId: string
    ): Promise<boolean> {
      const project = await workspaceRepo.findProjectById(projectId);
      if (!project || project.workspaceId !== workspaceId) return false;
      const ws = await workspaceRepo.findWorkspaceById(workspaceId);
      return ws?.userId === userId;
    }
  };

  const goalService = createGoalService(goalRepo, goalWorkspaceAccess);

  // 5. B04 Milestone Service
  const milestoneGoalAccess: MilestoneGoalAccess = {
    async getGoalForUser(user, goalId) {
      const res = await goalService.getGoal(user, goalId);
      if (!res.success) {
        return { success: false, error: res.error };
      }
      return {
        success: true,
        data: {
          id: res.data.id,
          status: res.data.status,
          archivedAt: res.data.archivedAt
        }
      };
    }
  };

  const milestoneService = createMilestoneService(milestoneRepo, milestoneGoalAccess);

  // 6. B05 Action Service
  const actionGoalAccess: ActionGoalAccess = {
    async validateGoal(user, goalId) {
      const res = await goalService.getGoal(user, goalId);
      if (!res.success) {
        return { success: false, error: res.error };
      }
      return { success: true, data: { id: res.data.id } };
    }
  };

  const actionMilestoneAccess: ActionMilestoneAccess = {
    async validateMilestone(user, milestoneId, goalId) {
      const res = await milestoneService.getMilestone(user, milestoneId);
      if (!res.success) {
        return { success: false, error: res.error };
      }
      if (res.data.goalId !== goalId) {
        return {
          success: false,
          error: {
            code: "ACTION_INVALID_ASSOCIATION",
            message: "Milestone does not belong to specified Goal"
          }
        };
      }
      return {
        success: true,
        data: { id: res.data.id, goalId: res.data.goalId }
      };
    }
  };

  const actionService = createActionService(
    actionRepo,
    actionGoalAccess,
    actionMilestoneAccess
  );

  // 7. B07 Planning Service
  const actionAccess: ActionAccess = {
    async assertCanAccessAction(user, actionId) {
      const res = await actionService.getAction(user, actionId);
      if (!res.success) {
        throw new PlanningError(
          "SCHEDULE_ACCESS_DENIED",
          "Cannot access the referenced Action."
        );
      }
    }
  };

  const planningAccess: PlanningAccess = {
    async assertCanAccessDailyPlan(user, plan) {
      if (plan.userId !== user.userId) {
        throw new PlanningError(
          "DAILY_PLAN_ACCESS_DENIED",
          "Access denied to the specified Daily Plan."
        );
      }
    },
    async assertCanAccessSchedule(user, schedule) {
      await actionAccess.assertCanAccessAction(user, schedule.actionId);
      if (schedule.dailyPlanId) {
        const plan = await planningRepo.getDailyPlan(schedule.dailyPlanId);
        if (plan && plan.userId !== user.userId) {
          throw new PlanningError(
            "SCHEDULE_ACCESS_DENIED",
            "Schedule belongs to another user's Daily Plan."
          );
        }
      }
    }
  };

  const planningRules: PlanningRules = {
    async assertScheduleAllowed({ startAt, endAt }) {
      const start = Date.parse(startAt);
      const end = Date.parse(endAt);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        throw new PlanningError(
          "SCHEDULE_INVALID_TIME_RANGE",
          "Schedule end time must be after start time."
        );
      }
    },
    assertScheduleMatchesPlanDate({ startAt, dailyPlan }) {
      if (!startAt.startsWith(dailyPlan.date)) {
        throw new PlanningError(
          "SCHEDULE_INVALID_RELATIONSHIP",
          "Schedule start time must match the Daily Plan date."
        );
      }
    }
  };

  const proposalApproval: PlanningProposalApproval = {
    async assertApprovedByUser(user, proposalId) {
      if (!user || !user.userId || !proposalId) {
        throw new PlanningError(
          "PLANNING_APPROVAL_REQUIRED",
          "Proposal approval verification failed."
        );
      }
    }
  };

  const planningService = new PlanningService(
    planningRepo,
    actionAccess,
    planningAccess,
    planningRules,
    proposalApproval
  );

  // 8. B08 Progress Service
  const progressSources: ProgressSourceAccess = {
    async assertCanAccessGoal(user, goalId) {
      const res = await goalService.getGoal(user, goalId);
      if (!res.success) {
        throw new ProgressError(
          "PROGRESS_ACCESS_DENIED",
          "Access denied to the specified Goal."
        );
      }
    },
    async getMeasurementProgressInputs() {
      // B06 is intentionally not integrated
      return [];
    },
    async getActionProgressInput(_user, goalId) {
      const actions = await actionRepo.listByGoal(goalId);
      return { goalId, actions };
    },
    async getChildGoalIds(user, goalId) {
      const wsId = await goalWorkspaceAccess.getCurrentWorkspaceId(user.userId);
      if (!wsId) return [];
      const children = await goalRepo.listGoalsByWorkspaceId(wsId, {
        parentGoalId: goalId
      });
      return children.map((c) => c.id);
    },
    async getGoalProgressInputs(user, goalId) {
      const childGoalIds = await this.getChildGoalIds(user, goalId);
      const actions = await actionRepo.listByGoal(goalId);
      const completedCount = actions.filter((a) => a.status === "COMPLETED").length;

      return {
        measurementResults: [],
        actionResult: {
          goalId,
          totalActions: actions.length,
          completedActions: completedCount,
          incompleteActions: actions.length - completedCount,
          completionValue: null,
          calculationStatus: "RULE_NOT_CONFIGURED" as const,
          calculationContext: { note: "B08 rules open / not configured" }
        },
        childGoalResults: childGoalIds.map((id) => ({
          goalId: id,
          progressValue: null,
          calculationStatus: "RULE_NOT_CONFIGURED" as const,
          contributingSources: [],
          calculationContext: {}
        }))
      };
    }
  };

  const progressRules: ProgressRules = {
    calculateMeasurement() {
      return {
        measurementId: "",
        currentValue: 0,
        targetValue: 0,
        progressValue: null,
        calculationStatus: "RULE_NOT_CONFIGURED",
        calculationContext: {}
      };
    },
    calculateActionCompletion(input: unknown) {
      const typed = (input ?? {}) as { goalId?: string; actions?: unknown[] };
      const total = Array.isArray(typed.actions) ? typed.actions.length : 0;
      return {
        goalId: typed.goalId ?? "",
        totalActions: total,
        completedActions: 0,
        incompleteActions: total,
        completionValue: null,
        calculationStatus: "RULE_NOT_CONFIGURED",
        calculationContext: {}
      };
    },
    calculateGoal(input: unknown) {
      const typed = (input ?? {}) as { goalId?: string };
      return {
        goalId: typed.goalId ?? "",
        progressValue: null,
        calculationStatus: "RULE_NOT_CONFIGURED",
        contributingSources: [],
        calculationContext: {}
      };
    },
    aggregateChildGoals() {
      return {
        goalId: "",
        progressValue: null,
        calculationStatus: "RULE_NOT_CONFIGURED",
        contributingSources: [],
        calculationContext: {}
      };
    },
    compareMeasurement() {
      return {
        difference: null,
        comparisonStatus: "RULE_NOT_CONFIGURED",
        progressValue: null
      };
    },
    combineStatuses() {
      return "RULE_NOT_CONFIGURED";
    }
  };

  const progressService = new ProgressService(progressSources, progressRules);

  return {
    connection,
    authService,
    tokenVerifier,
    workspaceService,
    goalService,
    milestoneService,
    actionService,
    planningService,
    progressService,
    repositories: {
      workspace: workspaceRepo,
      goal: goalRepo,
      milestone: milestoneRepo,
      action: actionRepo,
      planning: planningRepo
    }
  };
}
