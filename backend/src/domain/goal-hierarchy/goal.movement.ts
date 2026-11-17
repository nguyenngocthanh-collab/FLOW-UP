import type {
  Goal,
  GoalId,
  GoalOwnershipValidator,
  GoalReader,
  GoalScope,
  GoalScopeValidator,
  UserId,
  C03ValidationResult,
} from "./goal.types";
import { validateGoalScope } from "./goal.validation";
import { validateParentRelationship } from "./goal.hierarchy";

export interface GoalScopeMovementRequest {
  readonly callerUserId: UserId;
  readonly goalId: GoalId;
  readonly destinationScope: GoalScope;
  readonly proposedParentGoalId?: GoalId | null;
}

export type GoalScopeMovementError =
  | "GOAL_NOT_FOUND"
  | "GOAL_OWNERSHIP_INVALID"
  | "GOAL_SCOPE_INVALID"
  | "GOAL_SCOPE_ACCESS_DENIED"
  | "GOAL_HIERARCHY_INVALID"
  | "GOAL_HIERARCHY_CYCLE"
  | "GOAL_SELF_PARENTING"
  | "GOAL_PARENT_NOT_FOUND"
  | "GOAL_SCOPE_POLICY_UNRESOLVED"
  | "GOAL_SCOPE_MOVEMENT_BLOCKED"
  | "GOAL_DEPENDENCY_CONFLICT";

export interface GoalMovementDependencyReader {
  hasBlockingDependencies(goalId: GoalId): boolean;
}

/**
 * Validation contract only. This function never mutates Goal data and does not
 * claim transaction/atomicity guarantees. The Application Layer/D01 must own
 * the eventual movement transaction or recovery strategy.
 */
export function validateGoalScopeMovement(
  request: GoalScopeMovementRequest,
  goals: GoalReader,
  ownership: GoalOwnershipValidator,
  scopes: GoalScopeValidator,
  dependencies: GoalMovementDependencyReader,
): C03ValidationResult<GoalScopeMovementError> {
  const goal: Goal | null = goals.getGoal(request.goalId);
  if (!goal) return { valid: false, code: "GOAL_NOT_FOUND" };

  const ownerResult = ownership.validateGoalOwnership(request.callerUserId, request.goalId);
  if (!ownerResult.valid) return { valid: false, code: "GOAL_OWNERSHIP_INVALID" };

  const destination = validateGoalScope(request.callerUserId, request.destinationScope, scopes);
  if (!destination.valid) return destination;

  if (request.proposedParentGoalId !== undefined) {
    // Validate hierarchy against the proposed destination scope, not the current scope.
    const destinationAwareReader: GoalReader = {
      getGoal: (id) => {
        const found = goals.getGoal(id);
        if (!found || found.id !== request.goalId) return found;
        return {
          ...found,
          workspaceId: request.destinationScope.workspaceId,
          projectId: request.destinationScope.projectId,
        };
      },
      getGoals: () => goals.getGoals().map((found) => found.id === request.goalId
        ? { ...found, workspaceId: request.destinationScope.workspaceId, projectId: request.destinationScope.projectId }
        : found),
    };
    const hierarchy = validateParentRelationship(
      request.goalId,
      request.proposedParentGoalId,
      destinationAwareReader,
    );
    if (!hierarchy.valid) return hierarchy;
  }

  if (dependencies.hasBlockingDependencies(request.goalId)) {
    return { valid: false, code: "GOAL_DEPENDENCY_CONFLICT" };
  }

  return { valid: true };
}
