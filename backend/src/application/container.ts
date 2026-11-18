
import { randomUUID } from "node:crypto";
import type { DatabaseConnection } from "../infrastructure/database/sqlite.ts";
import { AIOrchestrationService, GeminiAIProvider, SqliteAIProposalRepository,
  GoalDiscoveryContextReader, GoalDiscoveryOutputValidator, GoalProposalDomainApplier,
  AIUsageLimiter } from "../modules/ai-orchestration/index.ts";
import type { AIProvider } from "../modules/ai-orchestration/ai-orchestration.repository";

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
  createAuthenticationApiService,
  type AuthenticationApiService
} from "../modules/auth/auth.service.ts";

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
import { MeasurementError, MeasurementService, MVPMeasurementRules } from "../modules/measurement/index.ts";
import { SqliteMeasurementRepository } from "../infrastructure/repositories/sqlite-measurement.repository.ts";

export interface ApplicationContainer {
  connection: DatabaseConnection;
  authService: AuthenticationService;
  authApiService: AuthenticationApiService;
  tokenVerifier: TokenVerifier;
  workspaceService: WorkspaceService;
  goalService: GoalService;
  milestoneService: MilestoneService;
  actionService: ActionService;
  planningService: PlanningService;
  progressService: ProgressService;
  measurementService: MeasurementService;
  aiService: AIOrchestrationService;
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
  ai?: { apiKey?: string; model?: string; timeoutMs?: number; perUserDaily?: number; globalDaily?: number; provider?: AIProvider };
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
  const measurementRepo = new SqliteMeasurementRepository(connection);

  // 2. Auth & Token Verifier
  const authConfig: AuthConfig = config.auth ?? {};
  const authProvider = createAuthProvider(authConfig);

  const authService = createAuthenticationService(authProvider);
  const authApiService = createAuthenticationApiService(authProvider);

  const tokenVerifier = createTokenVerifier({
    supabaseUrl: authConfig.supabaseUrl,
    supabaseKey: authConfig.supabaseAnonKey,
    devMode: authConfig.devMode ?? false
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

  const workspaceService = createWorkspaceService(
    workspaceRepo,
    goalSummaryReader
  );

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

      if (!project || project.workspaceId !== workspaceId) {
        return false;
      }

      const ws = await workspaceRepo.findWorkspaceById(workspaceId);
      return ws?.userId === userId;
    }
  };

  const goalService = createGoalService(
    goalRepo,
    goalWorkspaceAccess
  );

  // 5. B04 Milestone Service
  const milestoneGoalAccess: MilestoneGoalAccess = {
    async getGoalForUser(user, goalId) {
      const res = await goalService.getGoal(user, goalId);

      if (!res.success) {
        return {
          success: false,
          error: res.error
        };
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

  const milestoneService = createMilestoneService(
    milestoneRepo,
    milestoneGoalAccess
  );

  // 6. B05 Action Service
  const actionGoalAccess: ActionGoalAccess = {
    async validateGoal(user, goalId) {
      const res = await goalService.getGoal(user, goalId);

      if (!res.success) {
        return {
          success: false,
          error: res.error
        };
      }

      return {
        success: true,
        data: {
          id: res.data.id
        }
      };
    }
  };

  const actionMilestoneAccess: ActionMilestoneAccess = {
    async validateMilestone(user, milestoneId, goalId) {
      const res = await milestoneService.getMilestone(
        user,
        milestoneId
      );

      if (!res.success) {
        return {
          success: false,
          error: res.error
        };
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
        data: {
          id: res.data.id,
          goalId: res.data.goalId
        }
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
      await actionAccess.assertCanAccessAction(
        user,
        schedule.actionId
      );

      if (schedule.dailyPlanId) {
        const plan = await planningRepo.getDailyPlan(
          schedule.dailyPlanId
        );

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

      if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        end <= start
      ) {
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
      return {
        goalId,
        actions
      };
    },

    async getChildGoalIds(user, goalId) {
      const wsId = await goalWorkspaceAccess.getCurrentWorkspaceId(
        user.userId
      );

      if (!wsId) return [];

      const children = await goalRepo.listGoalsByWorkspaceId(
        wsId,
        {
          parentGoalId: goalId
        }
      );

      return children.map((c) => c.id);
    },

    async getGoalProgressInputs(user, goalId) {
      const childGoalIds = await this.getChildGoalIds(
        user,
        goalId
      );

      const actions = (await actionRepo.listByGoal(goalId)).filter((action) => !action.archivedAt);
      const completedCount = actions.filter((action) => action.status === "COMPLETED").length;
      const definitions = await measurementRepo.listMeasurementsByGoal(goalId, false);
      const measurementResults = await Promise.all(definitions.map(async (measurement) => {
        const record = (await measurementRepo.listRecords(measurement.id, { limit: 1 }))[0] ?? null;
        const comparable = record !== null && measurement.targetValue !== null;
        return {
          measurementId: measurement.id,
          currentValue: record?.value ?? null,
          targetValue: measurement.targetValue,
          progressValue: null,
          calculationStatus: comparable ? "RULE_NOT_CONFIGURED" as const : "INSUFFICIENT_DATA" as const,
          calculationContext: {
            unit: measurement.unit,
            latestRecordedAt: record?.recordedAt ?? null,
            reason: !record ? "No value has been recorded." : measurement.targetValue === null ? "No target is defined." : "Target direction is undefined; no percentage is inferred."
          }
        };
      }));

      return {
        measurementResults,

        actionResult: {
          goalId,
          totalActions: actions.length,
          completedActions: completedCount,
          incompleteActions: actions.length - completedCount,
          completionValue: actions.length ? (completedCount / actions.length) * 100 : null,
          calculationStatus: actions.length ? "CALCULATED" as const : "NOT_APPLICABLE" as const,
          calculationContext: {
            note: "Completed active Actions divided by total active Actions; this is execution completion, not Goal outcome progress."
          }
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
      const typed = (input ?? {}) as { goalId?: string; actions?: Array<{ status?: string; archived?: boolean }> };
      const actions = (typed.actions ?? []).filter((action) => !action.archived);
      const total = actions.length;
      const completed = actions.filter((action) => action.status === "COMPLETED").length;
      return {
        goalId: typed.goalId ?? "", totalActions: total, completedActions: completed,
        incompleteActions: total - completed,
        completionValue: total ? (completed / total) * 100 : null,
        calculationStatus: total ? "CALCULATED" as const : "NOT_APPLICABLE" as const,
        calculationContext: { rule: "completed active Actions / total active Actions", metric: "ACTION_COMPLETION" }
      };
    },

    calculateGoal(input: unknown) {
      const typed = (input ?? {}) as {
        goalId?: string;
      };

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

  const progressService = new ProgressService(
    progressSources,
    progressRules
  );

  const measurementService = new MeasurementService(
    measurementRepo,
    {
      async assertCanAccessGoal(user, goalId) {
        const result = await goalService.getGoal(user, goalId);
        if (!result.success) throw new MeasurementError("MEASUREMENT_ACCESS_DENIED", "Goal is not accessible.");
      }
    },
    new MVPMeasurementRules(),
  );

  const aiConfig = config.ai ?? {};
  const aiService = new AIOrchestrationService(
    new GoalDiscoveryContextReader(),
    aiConfig.provider ?? new GeminiAIProvider(aiConfig.apiKey, aiConfig.model, aiConfig.timeoutMs),
    new GoalDiscoveryOutputValidator(18),
    new SqliteAIProposalRepository(connection),
    new GoalProposalDomainApplier({ goalService, milestoneService, actionService, measurementService }),
    {
      validation: { maxInputLength: 4000, maxContextBytes: 12000, maxProposalItems: 18 },
      now: () => new Date().toISOString(),
      createProposalId: randomUUID,
      proposalPersistenceEnabled: true,
    },
    new AIUsageLimiter(connection, aiConfig.perUserDaily ?? 12, aiConfig.globalDaily ?? 90),
  );

  return {
    connection,
    authService,
    authApiService,
    tokenVerifier,
    workspaceService,
    goalService,
    milestoneService,
    actionService,
    planningService,
    progressService,
    measurementService,
    aiService,
    repositories: {
      workspace: workspaceRepo,
      goal: goalRepo,
      milestone: milestoneRepo,
      action: actionRepo,
      planning: planningRepo
    }
  };
}
