import { randomUUID } from "node:crypto";
import type { DatabaseConnection } from "../database/sqlite.ts";
import type { MeasurementRepository } from "../../modules/measurement/measurement.repository.ts";
import type { Measurement, MeasurementHistoryQuery, MeasurementRecord } from "../../modules/measurement/measurement.types.ts";

interface MeasurementRow {
  id: string; goal_id: string; label: string; description: string | null; value_type: string;
  unit: string | null; target_value: string | null; created_at: string; updated_at: string; archived_at: string | null;
}
interface RecordRow {
  id: string; measurement_id: string; value_json: string; recorded_at: string;
  created_at: string; note: string | null;
}

function mapMeasurement(row: MeasurementRow): Measurement {
  return {
    id: row.id, goalId: row.goal_id, label: row.label, description: row.description,
    valueType: row.value_type, unit: row.unit,
    targetValue: row.target_value === null ? null : JSON.parse(row.target_value) as Measurement["targetValue"],
    createdAt: row.created_at, updatedAt: row.updated_at, archivedAt: row.archived_at,
  };
}
function mapRecord(row: RecordRow): MeasurementRecord {
  return {
    id: row.id, measurementId: row.measurement_id,
    value: JSON.parse(row.value_json) as MeasurementRecord["value"],
    recordedAt: row.recorded_at, createdAt: row.created_at, note: row.note,
  };
}

export class SqliteMeasurementRepository implements MeasurementRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async createMeasurement(input: Omit<Measurement, "id">): Promise<Measurement> {
    const id = randomUUID();
    this.connection.db.prepare(`INSERT INTO measurements
      (id, goal_id, label, description, value_type, unit, target_value, created_at, updated_at, archived_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(id, input.goalId, input.label, input.description, input.valueType, input.unit,
        input.targetValue === null ? null : JSON.stringify(input.targetValue),
        input.createdAt, input.updatedAt, input.archivedAt);
    return { ...input, id };
  }

  async getMeasurement(id: string): Promise<Measurement | null> {
    const row = this.connection.db.prepare("SELECT * FROM measurements WHERE id = ?").get(id) as MeasurementRow | undefined;
    return row ? mapMeasurement(row) : null;
  }

  async listMeasurementsByGoal(goalId: string, includeArchived: boolean): Promise<Measurement[]> {
    const rows = this.connection.db.prepare(`SELECT * FROM measurements WHERE goal_id = ? ${includeArchived ? "" : "AND archived_at IS NULL"} ORDER BY created_at, id`)
      .all(goalId) as unknown as MeasurementRow[];
    return rows.map(mapMeasurement);
  }

  async updateMeasurement(id: string, patch: Partial<Pick<Measurement, "label" | "description" | "unit" | "targetValue" | "updatedAt">>): Promise<Measurement> {
    const current = await this.getMeasurement(id);
    if (!current) throw new Error("Measurement not found during update.");
    const next = { ...current, ...patch };
    this.connection.db.prepare(`UPDATE measurements SET label = ?, description = ?, unit = ?, target_value = ?, updated_at = ? WHERE id = ?`)
      .run(next.label, next.description, next.unit, next.targetValue === null ? null : JSON.stringify(next.targetValue), next.updatedAt, id);
    return next;
  }

  async archiveMeasurement(id: string, archivedAt: string): Promise<Measurement> {
    this.connection.db.prepare("UPDATE measurements SET archived_at = ?, updated_at = ? WHERE id = ?")
      .run(archivedAt, archivedAt, id);
    const result = await this.getMeasurement(id);
    if (!result) throw new Error("Measurement not found during archive.");
    return result;
  }

  async createRecord(input: Omit<MeasurementRecord, "id">): Promise<MeasurementRecord> {
    const id = randomUUID();
    this.connection.db.prepare(`INSERT INTO measurement_records
      (id, measurement_id, value_json, recorded_at, created_at, note) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(id, input.measurementId, JSON.stringify(input.value), input.recordedAt, input.createdAt, input.note);
    return { ...input, id };
  }

  async listRecords(measurementId: string, query: MeasurementHistoryQuery): Promise<MeasurementRecord[]> {
    const where = ["measurement_id = ?"];
    const params: (string | number)[] = [measurementId];
    if (query.from) { where.push("recorded_at >= ?"); params.push(query.from); }
    if (query.to) { where.push("recorded_at <= ?"); params.push(/^\d{4}-\d{2}-\d{2}$/.test(query.to) ? `${query.to}T23:59:59.999Z` : query.to); }
    let sql = `SELECT * FROM measurement_records WHERE ${where.join(" AND ")} ORDER BY recorded_at DESC, created_at DESC, id DESC`;
    if (query.limit !== undefined) { sql += " LIMIT ?"; params.push(query.limit); }
    if (query.offset !== undefined) { if (query.limit === undefined) sql += " LIMIT -1"; sql += " OFFSET ?"; params.push(query.offset); }
    return (this.connection.db.prepare(sql).all(...params) as unknown as RecordRow[]).map(mapRecord);
  }
}
