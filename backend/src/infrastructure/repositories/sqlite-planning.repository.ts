import { randomUUID } from "node:crypto";
import type { DatabaseConnection } from "../database/sqlite.ts";
import type {
  DailyPlan,
  DailyPlanId,
  PlanningDateRange,
  ScheduleEntry,
  ScheduleId
} from "../../modules/planning/planning.types.ts";
import type { PlanningRepository } from "../../modules/planning/planning.repository.ts";

interface DailyPlanRow {
  id: string;
  user_id: string;
  date: string;
  created_at: string;
  updated_at: string;
}

interface ScheduleRow {
  id: string;
  action_id: string;
  daily_plan_id: string | null;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
}

function mapDailyPlan(row: DailyPlanRow): DailyPlan {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapSchedule(row: ScheduleRow): ScheduleEntry {
  return {
    id: row.id,
    actionId: row.action_id,
    dailyPlanId: row.daily_plan_id,
    startAt: row.start_at,
    endAt: row.end_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class SqlitePlanningRepository implements PlanningRepository {
  private readonly connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  async createDailyPlan(input: Omit<DailyPlan, "id">): Promise<DailyPlan> {
    const id = randomUUID();
    const stmt = this.connection.db.prepare(
      "INSERT INTO daily_plans (id, user_id, date, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(id, input.userId, input.date, input.createdAt, input.updatedAt);

    return {
      id,
      userId: input.userId,
      date: input.date,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    };
  }

  async getDailyPlan(id: DailyPlanId): Promise<DailyPlan | null> {
    const stmt = this.connection.db.prepare(
      "SELECT id, user_id, date, created_at, updated_at FROM daily_plans WHERE id = ?"
    );
    const row = stmt.get(id) as DailyPlanRow | undefined;
    return row ? mapDailyPlan(row) : null;
  }

  async findDailyPlanByUserAndDate(userId: string, date: string): Promise<DailyPlan | null> {
    const stmt = this.connection.db.prepare(
      "SELECT id, user_id, date, created_at, updated_at FROM daily_plans WHERE user_id = ? AND date = ?"
    );
    const row = stmt.get(userId, date) as DailyPlanRow | undefined;
    return row ? mapDailyPlan(row) : null;
  }

  async updateDailyPlan(
    id: DailyPlanId,
    patch: Partial<Pick<DailyPlan, "date" | "updatedAt">>
  ): Promise<DailyPlan> {
    const existing = await this.getDailyPlan(id);
    if (!existing) {
      throw new Error(`Daily Plan not found: ${id}`);
    }

    const date = patch.date ?? existing.date;
    const updatedAt = patch.updatedAt ?? new Date().toISOString();

    const stmt = this.connection.db.prepare(
      "UPDATE daily_plans SET date = ?, updated_at = ? WHERE id = ?"
    );
    stmt.run(date, updatedAt, id);

    return {
      id: existing.id,
      userId: existing.userId,
      date,
      createdAt: existing.createdAt,
      updatedAt
    };
  }

  async listSchedulesByDailyPlan(dailyPlanId: DailyPlanId): Promise<ScheduleEntry[]> {
    const stmt = this.connection.db.prepare(
      `SELECT id, action_id, daily_plan_id, start_at, end_at, created_at, updated_at
       FROM schedules WHERE daily_plan_id = ? ORDER BY start_at ASC`
    );
    const rows = stmt.all(dailyPlanId) as unknown as ScheduleRow[];
    return rows.map(mapSchedule);
  }

  async createSchedule(input: Omit<ScheduleEntry, "id">): Promise<ScheduleEntry> {
    const id = randomUUID();
    const stmt = this.connection.db.prepare(
      `INSERT INTO schedules (id, action_id, daily_plan_id, start_at, end_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run(
      id,
      input.actionId,
      input.dailyPlanId,
      input.startAt,
      input.endAt,
      input.createdAt,
      input.updatedAt
    );

    return {
      id,
      actionId: input.actionId,
      dailyPlanId: input.dailyPlanId,
      startAt: input.startAt,
      endAt: input.endAt,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    };
  }

  async getSchedule(id: ScheduleId): Promise<ScheduleEntry | null> {
    const stmt = this.connection.db.prepare(
      `SELECT id, action_id, daily_plan_id, start_at, end_at, created_at, updated_at
       FROM schedules WHERE id = ?`
    );
    const row = stmt.get(id) as ScheduleRow | undefined;
    return row ? mapSchedule(row) : null;
  }

  async updateSchedule(
    id: ScheduleId,
    patch: Partial<Pick<ScheduleEntry, "startAt" | "endAt" | "dailyPlanId" | "updatedAt">>
  ): Promise<ScheduleEntry> {
    const existing = await this.getSchedule(id);
    if (!existing) {
      throw new Error(`Schedule not found: ${id}`);
    }

    const startAt = patch.startAt ?? existing.startAt;
    const endAt = patch.endAt ?? existing.endAt;
    const dailyPlanId = patch.dailyPlanId === undefined ? existing.dailyPlanId : patch.dailyPlanId;
    const updatedAt = patch.updatedAt ?? new Date().toISOString();

    const stmt = this.connection.db.prepare(
      `UPDATE schedules SET start_at = ?, end_at = ?, daily_plan_id = ?, updated_at = ?
       WHERE id = ?`
    );
    stmt.run(startAt, endAt, dailyPlanId, updatedAt, id);

    return {
      id: existing.id,
      actionId: existing.actionId,
      dailyPlanId,
      startAt,
      endAt,
      createdAt: existing.createdAt,
      updatedAt
    };
  }

  async deleteSchedule(id: ScheduleId): Promise<void> {
    const stmt = this.connection.db.prepare("DELETE FROM schedules WHERE id = ?");
    stmt.run(id);
  }

  async listSchedulesByDateRange(
    userId: string,
    range: PlanningDateRange
  ): Promise<ScheduleEntry[]> {
    const startRange = range.startDate.includes("T") ? range.startDate : `${range.startDate}T00:00:00.000Z`;
    const endRange = range.endDate.includes("T") ? range.endDate : `${range.endDate}T23:59:59.999Z`;

    const stmt = this.connection.db.prepare(
      `SELECT DISTINCT s.id, s.action_id, s.daily_plan_id, s.start_at, s.end_at, s.created_at, s.updated_at
       FROM schedules s
       JOIN actions a ON s.action_id = a.id
       JOIN goals g ON a.goal_id = g.id
       JOIN workspaces w ON g.workspace_id = w.id
       WHERE w.user_id = ?
         AND s.start_at >= ?
         AND s.start_at <= ?
       ORDER BY s.start_at ASC`
    );
    const rows = stmt.all(userId, startRange, endRange) as unknown as ScheduleRow[];
    return rows.map(mapSchedule);
  }
}
