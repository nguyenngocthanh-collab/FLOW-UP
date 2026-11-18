import type { DatabaseConnection } from "../../infrastructure/database/sqlite.ts";
import type { ApplicationContainer } from "../../application/container.ts";
import type {
  AIContextReader, AIOutputValidator, AIProposalDomainApplier,
} from "./ai-orchestration.repository";
import type {
  AIOutputValidationResult, AIProposal, AIProposalApplicationResult,
  AIProposalSelection, AIOperationType, AIRequestContext,
} from "./ai-orchestration.types";
import { AIOrchestrationError } from "./ai-orchestration.errors";

type ProposalItem = {
  id: string; type: "GOAL" | "MILESTONE" | "ACTION" | "MEASUREMENT"; title: string;
  description: string; targetDate: string | null; parentItemId: string | null; rationale: string;
  valueType?: "NUMBER" | "TEXT" | "BOOLEAN" | null; unit?: string | null; targetValue?: number | string | boolean | null;
};
function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}
function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export class GoalDiscoveryContextReader implements AIContextReader {
  async buildContext(userId: string, operationType: AIOperationType, input: string): Promise<AIRequestContext> {
    return { userId, operationType, userInput: input, constraints: { contextProvided: false } };
  }
}

export class GoalDiscoveryOutputValidator implements AIOutputValidator {
  constructor(private readonly maxItems: number) {}

  async validate(operation: AIOperationType, output: unknown): Promise<AIOutputValidationResult> {
    const value = record(output);
    if (!value) return { valid: false, issues: [{ path: "$", code: "OBJECT_REQUIRED", message: "Expected an object." }] };
    if (operation === "GOAL_CLARIFICATION") {
      const questions = value.questions;
      const valid = typeof value.outcome === "string" && value.outcome.length <= 500
        && [value.successCriteria, value.knownFacts, value.assumptions, value.missingInformation].every(stringArray)
        && Array.isArray(questions) && questions.length <= 8 && questions.every((raw) => {
          const question = record(raw);
          return !!question && typeof question.id === "string" && typeof question.prompt === "string"
            && question.prompt.length <= 500 && typeof question.why === "string"
            && ["TEXT", "NUMBER", "DATE", "CHOICE"].includes(String(question.answerType))
            && typeof question.required === "boolean" && stringArray(question.options);
        });
      return { valid, value: valid ? { ...value, provenance: "NEEDS_CONFIRMATION" } : undefined, issues: valid ? [] : [{ path: "$", code: "CLARIFICATION_SHAPE", message: "Clarification output is incomplete." }] };
    }
    if (operation === "GOAL_FEASIBILITY") {
      const valid = ["FEASIBLE", "CONCERN", "INSUFFICIENT_INFORMATION"].includes(String(value.assessment))
        && typeof value.summary === "string"
        && [value.concerns, value.alternatives, value.assumptions, value.missingInformation].every(stringArray);
      return { valid, value: valid ? { ...value, provenance: "AI_PROPOSED" } : undefined, issues: valid ? [] : [{ path: "$", code: "FEASIBILITY_SHAPE", message: "Feasibility output is incomplete." }] };
    }
    if (operation !== "GOAL_TREE_PROPOSAL") {
      return { valid: false, issues: [{ path: "$", code: "UNSUPPORTED_OPERATION", message: "This workflow is not enabled." }] };
    }
    const items = value.items;
    if (typeof value.summary !== "string" || !Array.isArray(items) || items.length === 0 || items.length > this.maxItems) {
      return { valid: false, issues: [{ path: "items", code: "ITEM_COUNT", message: "Proposal item count or summary is invalid." }] };
    }
    const byId = new Map<string, ProposalItem>();
    for (const raw of items) {
      const item = record(raw);
      if (!item || typeof item.id !== "string" || !item.id.trim() || byId.has(item.id)
        || !["GOAL", "MILESTONE", "ACTION", "MEASUREMENT"].includes(String(item.type))
        || typeof item.title !== "string" || !item.title.trim() || item.title.length > 160
        || typeof item.description !== "string" || item.description.length > 1200
        || typeof item.rationale !== "string" || item.rationale.length > 500
        || !(item.targetDate === null || (typeof item.targetDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.targetDate)))
        || !(item.parentItemId === null || typeof item.parentItemId === "string")) {
        return { valid: false, issues: [{ path: "items", code: "ITEM_INVALID", message: "Proposal contains an invalid or duplicate item." }] };
      }
      if (item.type === "MEASUREMENT") {
        if (!["NUMBER", "TEXT", "BOOLEAN"].includes(String(item.valueType))
          || !(item.unit === null || (typeof item.unit === "string" && item.unit.length <= 40))
          || !(item.targetValue === null || ["number", "string", "boolean"].includes(typeof item.targetValue))
          || (typeof item.targetValue === "number" && !Number.isFinite(item.targetValue))
          || (item.targetValue !== null && typeof item.targetValue !== "undefined" && typeof item.valueType !== typeof item.targetValue)
          || (item.valueType !== "NUMBER" && item.unit !== null)) {
          return { valid: false, issues: [{ path: `items.${item.id}`, code: "MEASUREMENT_SHAPE", message: "Measurement proposal fields are invalid." }] };
        }
      }
      byId.set(item.id, item as unknown as ProposalItem);
    }
    const roots = [...byId.values()].filter((item) => item.type === "GOAL" && item.parentItemId === null);
    if (roots.length !== 1) return { valid: false, issues: [{ path: "items", code: "ROOT_GOAL", message: "A proposal must contain one root Goal." }] };
    for (const item of byId.values()) {
      if (item.parentItemId === null) {
        if (item.type !== "GOAL") return { valid: false, issues: [{ path: `items.${item.id}`, code: "PARENT_REQUIRED", message: "Milestones and Actions need a parent." }] };
        continue;
      }
      const parent = byId.get(item.parentItemId);
      if (!parent || (item.type === "GOAL" && parent.type !== "GOAL")
        || (item.type === "MILESTONE" && parent.type !== "GOAL")
        || (item.type === "MEASUREMENT" && parent.type !== "GOAL")
        || (item.type === "ACTION" && !["GOAL", "MILESTONE"].includes(parent.type))) {
        return { valid: false, issues: [{ path: `items.${item.id}.parentItemId`, code: "PARENT_INVALID", message: "Proposal references an invalid parent." }] };
      }
    }
    for (const item of byId.values()) {
      const seen = new Set<string>([item.id]);
      let parentId = item.parentItemId;
      while (parentId) {
        if (seen.has(parentId)) return { valid: false, issues: [{ path: `items.${item.id}.parentItemId`, code: "DEPENDENCY_CYCLE", message: "Proposal contains a hierarchy cycle." }] };
        seen.add(parentId);
        parentId = byId.get(parentId)?.parentItemId ?? null;
      }
    }
    return { valid: true, value: { ...value, items: [...byId.values()], provenance: "AI_PROPOSED" }, issues: [] };
  }
}

export class GoalProposalDomainApplier implements AIProposalDomainApplier {
  constructor(private readonly app: Pick<ApplicationContainer, "goalService" | "milestoneService" | "actionService" | "measurementService">) {}

  async validateProposal(_userId: string, proposal: AIProposal, selection: AIProposalSelection): Promise<void> {
    const rawData = selection.editedData ?? proposal.proposalData;
    const validation = await new GoalDiscoveryOutputValidator(18).validate("GOAL_TREE_PROPOSAL", rawData);
    if (!validation.valid) throw new AIOrchestrationError("AI_PROPOSAL_VALIDATION_FAILED", "Edited proposal does not pass validation.");
    const data = record(rawData);
    const all = data?.items;
    if (!Array.isArray(all) || !selection.selectedItemIds.length) throw new AIOrchestrationError("AI_APPROVAL_REQUIRED", "Select at least one proposal item.");
    const items = all.map((item) => record(item) as unknown as ProposalItem);
    const chosen = new Set(selection.selectedItemIds);
    const previouslyApplied = new Set(((proposal.proposalData as { applicationResults?: { operation: string; success: boolean }[] }).applicationResults ?? []).filter((item) => item.success).map((item) => item.operation));
    const itemIds = new Set(items.map((item) => item.id));
    const byId = new Map(items.map((item) => [item.id, item]));
    const missingDependency = selection.selectedItemIds.some((id) => {
      let parentId = byId.get(id)?.parentItemId ?? null;
      while (parentId) {
        if (!chosen.has(parentId) && !previouslyApplied.has(parentId)) return true;
        parentId = byId.get(parentId)?.parentItemId ?? null;
      }
      return false;
    });
    if (chosen.size !== selection.selectedItemIds.length || selection.selectedItemIds.some((id) => !itemIds.has(id)) || missingDependency) {
      throw new AIOrchestrationError("AI_PROPOSAL_VALIDATION_FAILED", "Selected items must be unique and include their required parents.");
    }
    if (items.some((item) => chosen.has(item.id) && !["GOAL", "MILESTONE", "ACTION", "MEASUREMENT"].includes(item.type))) {
      throw new AIOrchestrationError("AI_PROPOSAL_VALIDATION_FAILED", "Proposal contains an unsupported item.");
    }
  }

  async applyApprovedProposal(userId: string, proposal: AIProposal, selection: AIProposalSelection): Promise<AIProposalApplicationResult> {
    const data = record(selection.editedData ?? proposal.proposalData)!;
    const items = (data.items as ProposalItem[]).filter((item) => selection.selectedItemIds.includes(item.id));
    const user = { userId, email: null, isAuthenticated: true as const };
    const ids = new Map<string, { type: ProposalItem["type"]; id: string }>();
    const processed = new Set<string>();
    for (const result of ((proposal.proposalData as { applicationResults?: { operation: string; success: boolean; entityId?: string }[] }).applicationResults ?? [])) {
      const original = (data.items as ProposalItem[]).find((item) => item.id === result.operation);
      if (result.success && original && result.entityId) ids.set(result.operation, { type: original.type, id: result.entityId });
    }
    const operations: AIProposalApplicationResult["operations"] = [];
    const remaining = [...items];
    while (remaining.length) {
      const index = remaining.findIndex((item) => item.parentItemId === null || ids.has(item.parentItemId) || processed.has(item.parentItemId));
      if (index < 0) throw new AIOrchestrationError("AI_PROPOSAL_VALIDATION_FAILED", "Selected proposal items contain a dependency cycle.");
      const [item] = remaining.splice(index, 1);
      processed.add(item.id);
      const parent = item.parentItemId ? ids.get(item.parentItemId) : undefined;
      try {
        if (item.type === "GOAL") {
          if (item.parentItemId && parent?.type !== "GOAL") throw new Error("GOAL_PARENT_NOT_APPLIED");
          const result = parent
            ? await this.app.goalService.addChildGoal(user, parent.id, { title: item.title, description: item.description, targetDate: item.targetDate })
            : await this.app.goalService.createGoal(user, { title: item.title, description: item.description, targetDate: item.targetDate });
          if (!result.success) throw new Error(result.error.code);
          ids.set(item.id, { type: "GOAL", id: result.data.id });
          operations.push({ operation: item.id, success: true, entityId: result.data.id });
        } else if (item.type === "MILESTONE") {
          if (parent?.type !== "GOAL") throw new Error("MILESTONE_GOAL_NOT_APPLIED");
          const result = await this.app.milestoneService.createMilestone(user, { goalId: parent.id, title: item.title, description: item.description, targetDate: item.targetDate });
          if (!result.success) throw new Error(result.error.code);
          ids.set(item.id, { type: "MILESTONE", id: result.data.id });
          operations.push({ operation: item.id, success: true, entityId: result.data.id });
        } else if (item.type === "ACTION") {
          const goalParent = parent?.type === "GOAL" ? parent : item.parentItemId ? ids.get(items.find((candidate) => candidate.id === item.parentItemId)?.parentItemId ?? "") : undefined;
          if (goalParent?.type !== "GOAL") throw new Error("ACTION_GOAL_PARENT_REQUIRED");
          const milestoneId = parent?.type === "MILESTONE" ? parent.id : null;
          const result = await this.app.actionService.createAction(user, { goalId: goalParent.id, milestoneId, title: item.title, description: item.description });
          if (!result.success) throw new Error(result.error.code);
          ids.set(item.id, { type: "ACTION", id: result.data.id });
          operations.push({ operation: item.id, success: true, entityId: result.data.id });
        } else if (item.type === "MEASUREMENT") {
          if (parent?.type !== "GOAL") throw new Error("MEASUREMENT_GOAL_PARENT_REQUIRED");
          const result = await this.app.measurementService.createMeasurement(user, {
            goalId: parent.id, label: item.title, description: item.description,
            valueType: item.valueType!, unit: item.unit ?? null, targetValue: item.targetValue ?? null,
          });
          ids.set(item.id, { type: "MEASUREMENT", id: result.id });
          operations.push({ operation: item.id, success: true, entityId: result.id });
        }
      } catch (error) {
        operations.push({ operation: item.id, success: false, errorCode: error instanceof Error ? error.message : "APPLICATION_FAILED" });
      }
    }
    const successCount = operations.filter((operation) => operation.success).length;
    return { proposalId: proposal.id, status: successCount === operations.length ? "APPLIED" : successCount ? "PARTIALLY_APPLIED" : "FAILED", operations };
  }
}

export class AIUsageLimiter {
  constructor(private readonly connection: DatabaseConnection, private readonly perUserDaily = 12, private readonly globalDaily = 90) {}

  reserve(userId: string): boolean {
    const since = new Date(); since.setUTCHours(0, 0, 0, 0);
    const cutoff = since.toISOString();
    return this.connection.runInTransaction(() => {
      const retentionCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      this.connection.db.prepare("DELETE FROM ai_usage WHERE created_at < ?").run(retentionCutoff);
      const counts = this.connection.db.prepare(`SELECT COUNT(*) AS total,
        SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) AS user_total
        FROM ai_usage WHERE created_at >= ?`).get(userId, cutoff) as { total: number; user_total: number | null };
      if (counts.total >= this.globalDaily || (counts.user_total ?? 0) >= this.perUserDaily) return false;
      this.connection.db.prepare("INSERT INTO ai_usage(user_id, created_at) VALUES (?, ?)").run(userId, new Date().toISOString());
      return true;
    });
  }
}
