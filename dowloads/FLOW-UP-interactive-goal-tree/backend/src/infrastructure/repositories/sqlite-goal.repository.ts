import { randomUUID } from "node:crypto";
import type { DatabaseConnection } from "../database/sqlite.ts";
import type {
  CreateGoalInput,
  Goal,
  ListGoalsFilter,
  UpdateGoalInput
} from "../../modules/goal/goal.types.ts";
import type { GoalRepository } from "../../modules/goal/goal.repository.ts";

interface GoalRow {
  id: string;
  workspace_id: string;
  project_id: string | null;
  parent_goal_id: string | null;
  title: string;
  description: string | null;
  target_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
}

function mapGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    projectId: row.project_id,
    parentGoalId: row.parent_goal_id,
    title: row.title,
    description: row.description,
    targetDate: row.target_date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at
  };
}

export class SqliteGoalRepository implements GoalRepository {
  private readonly connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  async createGoal(workspaceId: string, input: CreateGoalInput): Promise<Goal> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const projectId = input.projectId ?? null;
    const parentGoalId = input.parentGoalId ?? null;
    const description = input.description?.trim() ? input.description.trim() : null;
    const targetDate = input.targetDate?.trim() ? input.targetDate.trim() : null;
    const status = "ACTIVE";

    const stmt = this.connection.db.prepare(
      `INSERT INTO goals (
        id, workspace_id, project_id, parent_goal_id, title, description,
        target_date, status, created_at, updated_at, archived_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`
    );

    stmt.run(
      id,
      workspaceId,
      projectId,
      parentGoalId,
      input.title.trim(),
      description,
      targetDate,
      status,
      now,
      now
    );

    return {
      id,
      workspaceId,
      projectId,
      parentGoalId,
      title: input.title.trim(),
      description,
      targetDate,
      status,
      createdAt: now,
      updatedAt: now,
      archivedAt: null
    };
  }

  async findGoalById(goalId: string): Promise<Goal | null> {
    const stmt = this.connection.db.prepare(
      `SELECT id, workspace_id, project_id, parent_goal_id, title, description,
              target_date, status, created_at, updated_at, archived_at
       FROM goals WHERE id = ?`
    );
    const row = stmt.get(goalId) as GoalRow | undefined;
    return row ? mapGoal(row) : null;
  }

  async listGoalsByWorkspaceId(
    workspaceId: string,
    filter?: ListGoalsFilter
  ): Promise<Goal[]> {
    let sql = `SELECT id, workspace_id, project_id, parent_goal_id, title, description,
                      target_date, status, created_at, updated_at, archived_at
               FROM goals WHERE workspace_id = ?`;
    const params: (string | null)[] = [workspaceId];

    if (filter) {
      if (filter.projectId !== undefined) {
        if (filter.projectId === null) {
          sql += " AND project_id IS NULL";
        } else {
          sql += " AND project_id = ?";
          params.push(filter.projectId);
        }
      }

      if (filter.parentGoalId !== undefined) {
        if (filter.parentGoalId === null) {
          sql += " AND parent_goal_id IS NULL";
        } else {
          sql += " AND parent_goal_id = ?";
          params.push(filter.parentGoalId);
        }
      }

      if (filter.status !== undefined) {
        sql += " AND status = ?";
        params.push(filter.status);
      }

      if (!filter.includeArchived) {
        sql += " AND archived_at IS NULL";
      }
    } else {
      sql += " AND archived_at IS NULL";
    }

    sql += " ORDER BY created_at ASC";

    const stmt = this.connection.db.prepare(sql);
    const rows = stmt.all(...params) as unknown as GoalRow[];
    return rows.map(mapGoal);
  }

  async updateGoal(goalId: string, input: UpdateGoalInput): Promise<Goal> {
    const existing = await this.findGoalById(goalId);
    if (!existing) {
      throw new Error(`Goal not found: ${goalId}`);
    }

    const now = new Date().toISOString();
    const title = input.title !== undefined ? input.title.trim() : existing.title;
    const description =
      input.description !== undefined
        ? input.description === null || input.description.trim() === ""
          ? null
          : input.description.trim()
        : existing.description;
    const targetDate =
      input.targetDate !== undefined
        ? input.targetDate === null || input.targetDate.trim() === ""
          ? null
          : input.targetDate.trim()
        : existing.targetDate;

    const stmt = this.connection.db.prepare(
      `UPDATE goals SET title = ?, description = ?, target_date = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(title, description, targetDate, now, goalId);

    return {
      id: existing.id,
      workspaceId: existing.workspaceId,
      projectId: existing.projectId,
      parentGoalId: existing.parentGoalId,
      title,
      description,
      targetDate,
      status: existing.status,
      createdAt: existing.createdAt,
      updatedAt: now,
      archivedAt: existing.archivedAt
    };
  }

  async moveGoal(goalId: string, parentGoalId: string | null): Promise<Goal> {
    const existing = await this.findGoalById(goalId);
    if (!existing) throw new Error(`Goal not found: ${goalId}`);
    const now = new Date().toISOString();
    const stmt = this.connection.db.prepare(
      `UPDATE goals SET parent_goal_id = ?, updated_at = ? WHERE id = ?`
    );
    stmt.run(parentGoalId, now, goalId);
    return { ...existing, parentGoalId, updatedAt: now };
  }

  async findDescendantIds(goalId: string): Promise<string[]> {
    const sql = `
      WITH RECURSIVE descendants(id) AS (
        SELECT id FROM goals WHERE parent_goal_id = ?
        UNION ALL
        SELECT g.id FROM goals g JOIN descendants d ON g.parent_goal_id = d.id
      )
      SELECT id FROM descendants;
    `;
    const stmt = this.connection.db.prepare(sql);
    const rows = stmt.all(goalId) as unknown as { id: string }[];
    return rows.map((r) => r.id);
  }

  async countIndependentGoals(workspaceId: string): Promise<number> {
    const stmt = this.connection.db.prepare(
      "SELECT COUNT(*) as count FROM goals WHERE workspace_id = ? AND project_id IS NULL AND archived_at IS NULL"
    );
    const row = stmt.get(workspaceId) as { count: number } | undefined;
    return row ? Number(row.count) : 0;
  }

  async countProjectGoals(projectId: string): Promise<number> {
    const stmt = this.connection.db.prepare(
      "SELECT COUNT(*) as count FROM goals WHERE project_id = ? AND archived_at IS NULL"
    );
    const row = stmt.get(projectId) as { count: number } | undefined;
    return row ? Number(row.count) : 0;
  }
}
