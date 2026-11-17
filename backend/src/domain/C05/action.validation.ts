import type { Action, ExecutionData } from "./action.types";
import type { DomainError } from "./action.errors";

export function validateActionTitle(title: unknown): DomainError | null {
  return typeof title === "string" && title.trim().length > 0
    ? null
    : { code: "ACTION_INVALID_TITLE", message: "Action title must not be blank." };
}

export function validateActionDescription(description: unknown): DomainError | null {
  return description === null || description === undefined || typeof description === "string"
    ? null
    : { code: "ACTION_INVALID_DESCRIPTION", message: "Description must be a string or null." };
}

export interface AssociationFacts {
  readonly directGoalId: string | null;
  readonly milestoneGoalId: string | null;
  readonly goalAccessible: boolean;
  readonly goalValid: boolean;
  readonly milestoneAccessible: boolean;
  readonly milestoneValid: boolean;
}

/**
 * Validates only unambiguous facts. Whether a direct Goal is mandatory, and
 * whether both associations may coexist, remains a product decision.
 */
export function validateActionAssociations(facts: AssociationFacts): DomainError | null {
  if (!facts.goalAccessible || !facts.milestoneAccessible) {
    return { code: "ACTION_ACCESS_DENIED", message: "An associated resource is not accessible." };
  }
  if (!facts.goalValid || !facts.milestoneValid) {
    return { code: "ACTION_ASSOCIATION_INVALID", message: "An associated resource is not valid." };
  }
  if (facts.directGoalId && facts.milestoneGoalId && facts.directGoalId !== facts.milestoneGoalId) {
    return { code: "ACTION_ASSOCIATION_CONFLICT", message: "Direct Goal and Milestone-derived Goal do not match." };
  }
  return null;
}

function parseInstant(value: string): number | null {
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

/** Checks chronology only; does not infer actual duration from Schedule. */
export function validateExecutionData(data: ExecutionData): DomainError | null {
  const start = data.actualStartedAt === null ? null : parseInstant(data.actualStartedAt);
  const end = data.actualCompletedAt === null ? null : parseInstant(data.actualCompletedAt);

  if (data.actualStartedAt !== null && start === null) {
    return { code: "ACTION_EXECUTION_START_INVALID", message: "Actual start must be a valid timestamp." };
  }
  if (data.actualCompletedAt !== null && end === null) {
    return { code: "ACTION_EXECUTION_COMPLETION_INVALID", message: "Actual completion must be a valid timestamp." };
  }
  if (start !== null && end !== null && end < start) {
    return { code: "ACTION_EXECUTION_TIME_CONFLICT", message: "Actual completion cannot precede actual start." };
  }
  // Duration semantics are OPEN; only reject negative values when supplied.
  if (data.actualDurationMinutes !== null &&
      (!Number.isFinite(data.actualDurationMinutes) || data.actualDurationMinutes < 0)) {
    return { code: "ACTION_EXECUTION_DURATION_INVALID", message: "Actual duration cannot be negative or non-finite." };
  }
  if (data.executionNote !== null && typeof data.executionNote !== "string") {
    return { code: "ACTION_EXECUTION_INVALID", message: "Execution note must be a string or null." };
  }
  return null;
}

export function validateActionUpdate(original: Action, update: Partial<Pick<Action, "title" | "description">>): DomainError | null {
  if (update.title !== undefined) {
    const error = validateActionTitle(update.title);
    if (error) return error;
  }
  if (update.description !== undefined) {
    const error = validateActionDescription(update.description);
    if (error) return error;
  }
  // Identity and associations are intentionally not mutable through this basic update validator.
  void original;
  return null;
}
