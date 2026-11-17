import type {
  Action,
  ActionExecutionData,
  ActionStatus,
  CreateActionInput,
  RecordExecutionInput,
  UpdateActionInput
} from "./action.types";

export interface ActionRepository {
  create(input: {
    goalId: string;
    milestoneId: string | null;
    title: string;
    description: string | null;
    status: "TODO";
  }): Promise<Action>;
  findById(actionId: string): Promise<Action | null>;
  listByGoal(goalId: string): Promise<Action[]>;
  listByMilestone(milestoneId: string): Promise<Action[]>;
  update(actionId: string, input: UpdateActionInput): Promise<Action>;
  updateStatus(
    actionId: string,
    status: ActionStatus,
    completedAt: string | null
  ): Promise<Action>;
  saveExecution(
    actionId: string,
    input: RecordExecutionInput
  ): Promise<ActionExecutionData>;
  getExecution(actionId: string): Promise<ActionExecutionData | null>;
}

/** Adapter boundary to B03. Implement using B03's public application service. */
export interface ActionGoalAccess {
  validateGoal(user: { userId: string; email: string | null; isAuthenticated: true },
    goalId: string): Promise<
      | { success: true; data: { id: string } }
      | { success: false; error: { code: string; message: string } }
    >;
}

/** Adapter boundary to B04. No direct access to B04 storage is allowed. */
export interface ActionMilestoneAccess {
  validateMilestone(user: { userId: string; email: string | null; isAuthenticated: true },
    milestoneId: string, goalId: string): Promise<
      | { success: true; data: { id: string; goalId: string } }
      | { success: false; error: { code: string; message: string } }
    >;
}
