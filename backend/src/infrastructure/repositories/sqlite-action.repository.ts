import { randomUUID } from "node:crypto";
import type { DatabaseConnection } from "../database/sqlite.ts";
import type {
  Action,
  ActionExecutionData,
  ActionStatus,
  RecordExecutionInput,
  UpdateActionInput
} from "../../modules/action/action.types.ts";
import type { ActionRepository } from "../../modules/action/action.repository.ts";

interface ActionRow {
  id: string;
  goal_id: string;
  milestone_id: string | null;
  title: string;
  description: string | null;
  status: ActionStatus;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  archived_at: string | null;
}

interface ActionExecutionRow {
  action_id: string;
  actual_started_at: string | null;
  actual_completed_at: string | null;
  actual_duration_minutes: number | null;
  execution_note: string | null;
  updated_at: string;
}

function mapAction(row: ActionRow): Action {
  return {
    id: row.id,
    goalId: row.goal_id,
    milestoneId: row.milestone_id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at,
    archivedAt: row.archived_at
  };
}

function mapExecution(row: ActionExecutionRow): ActionExecutionData {
  return {
    actionId: row.action_id,
    actualStartedAt: row.actual_started_at,
    actualCompletedAt: row.actual_completed_at,
    actualDurationMinutes: row.actual_duration_minutes,
    executionNote: row.execution_note
  };
}

export class SqliteActionRepository implements ActionRepository {
  private readonly connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  async create(input: {
    goalId: string;
    milestoneId: string | null;
    title: string;
    description: string | null;
    status: "TODO";
  }): Promise<Action> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const description = input.description?.trim() ? input.description.trim() : null;
    const milestoneId = input.milestoneId ?? null;

    const stmt = this.connection.db.prepare(
      `INSERT INTO actions (
        id, goal_id, milestone_id, title, description, status,
        created_at, updated_at, completed_at, archived_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)`
    );

    stmt.run(
      id,
      input.goalId,
      milestoneId,
      input.title.trim(),
      description,
      input.status,
      now,
      now
    );

    return {
      id,
      goalId: input.goalId,
      milestoneId,
      title: input.title.trim(),
      description,
      status: input.status,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      archivedAt: null
    };
  }

  async findById(actionId: string): Promise<Action | null> {
    const stmt = this.connection.db.prepare(
      `SELECT id, goal_id, milestone_id, title, description, status,
              created_at, updated_at, completed_at, archived_at
       FROM actions WHERE id = ?`
    );
    const row = stmt.get(actionId) as ActionRow | undefined;
    return row ? mapAction(row) : null;
  }

  async listByGoal(goalId: string): Promise<Action[]> {
    const stmt = this.connection.db.prepare(
      `SELECT id, goal_id, milestone_id, title, description, status,
              created_at, updated_at, completed_at, archived_at
       FROM actions WHERE goal_id = ? ORDER BY created_at ASC`
    );
    const rows = stmt.all(goalId) as unknown as ActionRow[];
    return rows.map(mapAction);
  }

  async listByMilestone(milestoneId: string): Promise<Action[]> {
    const stmt = this.connection.db.prepare(
      `SELECT id, goal_id, milestone_id, title, description, status,
              created_at, updated_at, completed_at, archived_at
       FROM actions WHERE milestone_id = ? ORDER BY created_at ASC`
    );
    const rows = stmt.all(milestoneId) as unknown as ActionRow[];
    return rows.map(mapAction);
  }

  async update(actionId: string, input: UpdateActionInput): Promise<Action> {
    const existing = await this.findById(actionId);
    if (!existing) {
      throw new Error(`Action not found: ${actionId}`);
    }

    const now = new Date().toISOString();
    const title = input.title !== undefined ? input.title.trim() : existing.title;
    const description =
      input.description !== undefined
        ? input.description === null || input.description.trim() === ""
          ? null
          : input.description.trim()
        : existing.description;

    const stmt = this.connection.db.prepare(
      "UPDATE actions SET title = ?, description = ?, updated_at = ? WHERE id = ?"
    );
    stmt.run(title, description, now, actionId);

    return {
      id: existing.id,
      goalId: existing.goalId,
      milestoneId: existing.milestoneId,
      title,
      description,
      status: existing.status,
      createdAt: existing.createdAt,
      updatedAt: now,
      completedAt: existing.completedAt,
      archivedAt: existing.archivedAt
    };
  }

  async updateStatus(
    actionId: string,
    status: ActionStatus,
    completedAt: string | null
  ): Promise<Action> {
    const existing = await this.findById(actionId);
    if (!existing) {
      throw new Error(`Action not found: ${actionId}`);
    }

    const now = new Date().toISOString();
    const stmt = this.connection.db.prepare(
      "UPDATE actions SET status = ?, completed_at = ?, updated_at = ? WHERE id = ?"
    );
    stmt.run(status, completedAt, now, actionId);

    return {
      id: existing.id,
      goalId: existing.goalId,
      milestoneId: existing.milestoneId,
      title: existing.title,
      description: existing.description,
      status,
      createdAt: existing.createdAt,
      updatedAt: now,
      completedAt,
      archivedAt: existing.archivedAt
    };
  }

  async saveExecution(
    actionId: string,
    input: RecordExecutionInput
  ): Promise<ActionExecutionData> {
    const now = new Date().toISOString();
    const actualStartedAt = input.actualStartedAt ?? null;
    const actualCompletedAt = input.actualCompletedAt ?? null;
    const actualDurationMinutes = input.actualDurationMinutes ?? null;
    const executionNote = input.executionNote?.trim() ? input.executionNote.trim() : null;

    const stmt = this.connection.db.prepare(
      `INSERT INTO action_executions (
        action_id, actual_started_at, actual_completed_at, actual_duration_minutes, execution_note, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(action_id) DO UPDATE SET
        actual_started_at = excluded.actual_started_at,
        actual_completed_at = excluded.actual_completed_at,
        actual_duration_minutes = excluded.actual_duration_minutes,
        execution_note = excluded.execution_note,
        updated_at = excluded.updated_at`
    );

    stmt.run(
      actionId,
      actualStartedAt,
      actualCompletedAt,
      actualDurationMinutes,
      executionNote,
      now
    );

    return {
      actionId,
      actualStartedAt,
      actualCompletedAt,
      actualDurationMinutes,
      executionNote
    };
  }

  async getExecution(actionId: string): Promise<ActionExecutionData | null> {
    const stmt = this.connection.db.prepare(
      `SELECT action_id, actual_started_at, actual_completed_at, actual_duration_minutes, execution_note, updated_at
       FROM action_executions WHERE action_id = ?`
    );
    const row = stmt.get(actionId) as ActionExecutionRow | undefined;
    return row ? mapExecution(row) : null;
  }
}
