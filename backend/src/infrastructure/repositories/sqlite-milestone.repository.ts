import { randomUUID } from "node:crypto";
import type { DatabaseConnection } from "../database/sqlite.ts";
import type {
  Milestone,
  MilestoneStatus,
  UpdateMilestoneInput
} from "../../modules/milestone/milestone.types.ts";
import type { MilestoneRepository } from "../../modules/milestone/milestone.repository.ts";

interface MilestoneRow {
  id: string;
  goal_id: string;
  title: string;
  description: string | null;
  target_date: string | null;
  status: MilestoneStatus;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

function mapMilestone(row: MilestoneRow): Milestone {
  return {
    id: row.id,
    goalId: row.goal_id,
    title: row.title,
    description: row.description,
    targetDate: row.target_date,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at
  };
}

export class SqliteMilestoneRepository implements MilestoneRepository {
  private readonly connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  async createMilestone(input: {
    goalId: string;
    title: string;
    description: string | null;
    targetDate: string | null;
  }): Promise<Milestone> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const status: MilestoneStatus = "PENDING";
    const description = input.description?.trim() ? input.description.trim() : null;
    const targetDate = input.targetDate?.trim() ? input.targetDate.trim() : null;

    const stmt = this.connection.db.prepare(
      `INSERT INTO milestones (
        id, goal_id, title, description, target_date, status, created_at, updated_at, completed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)`
    );

    stmt.run(
      id,
      input.goalId,
      input.title.trim(),
      description,
      targetDate,
      status,
      now,
      now
    );

    return {
      id,
      goalId: input.goalId,
      title: input.title.trim(),
      description,
      targetDate,
      status,
      createdAt: now,
      updatedAt: now,
      completedAt: null
    };
  }

  async findMilestoneById(milestoneId: string): Promise<Milestone | null> {
    const stmt = this.connection.db.prepare(
      `SELECT id, goal_id, title, description, target_date, status, created_at, updated_at, completed_at
       FROM milestones WHERE id = ?`
    );
    const row = stmt.get(milestoneId) as MilestoneRow | undefined;
    return row ? mapMilestone(row) : null;
  }

  async listMilestonesByGoal(goalId: string): Promise<Milestone[]> {
    const stmt = this.connection.db.prepare(
      `SELECT id, goal_id, title, description, target_date, status, created_at, updated_at, completed_at
       FROM milestones WHERE goal_id = ? ORDER BY created_at ASC`
    );
    const rows = stmt.all(goalId) as unknown as MilestoneRow[];
    return rows.map(mapMilestone);
  }

  async updateMilestone(
    milestoneId: string,
    input: UpdateMilestoneInput
  ): Promise<Milestone> {
    const existing = await this.findMilestoneById(milestoneId);
    if (!existing) {
      throw new Error(`Milestone not found: ${milestoneId}`);
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
      `UPDATE milestones SET title = ?, description = ?, target_date = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(title, description, targetDate, now, milestoneId);

    return {
      id: existing.id,
      goalId: existing.goalId,
      title,
      description,
      targetDate,
      status: existing.status,
      createdAt: existing.createdAt,
      updatedAt: now,
      completedAt: existing.completedAt
    };
  }

  async completeMilestone(
    milestoneId: string,
    completedAt: string
  ): Promise<Milestone> {
    const existing = await this.findMilestoneById(milestoneId);
    if (!existing) {
      throw new Error(`Milestone not found: ${milestoneId}`);
    }

    const stmt = this.connection.db.prepare(
      `UPDATE milestones SET status = 'COMPLETED', completed_at = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(completedAt, completedAt, milestoneId);

    return {
      id: existing.id,
      goalId: existing.goalId,
      title: existing.title,
      description: existing.description,
      targetDate: existing.targetDate,
      status: "COMPLETED",
      createdAt: existing.createdAt,
      updatedAt: completedAt,
      completedAt
    };
  }
}
