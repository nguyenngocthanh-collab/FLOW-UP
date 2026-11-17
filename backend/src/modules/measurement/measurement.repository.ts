import type {
  GoalId, Measurement, MeasurementId, MeasurementRecord, MeasurementRecordId,
  MeasurementHistoryQuery, AuthenticatedUserContext,
} from "./measurement.types";

export interface MeasurementRepository {
  createMeasurement(input: Omit<Measurement, "id">): Promise<Measurement>;
  getMeasurement(id: MeasurementId): Promise<Measurement | null>;
  listMeasurementsByGoal(goalId: GoalId, includeArchived: boolean): Promise<Measurement[]>;
  updateMeasurement(id: MeasurementId, patch: Partial<Pick<Measurement,
    "label" | "description" | "unit" | "targetValue" | "updatedAt">>): Promise<Measurement>;
  archiveMeasurement(id: MeasurementId, archivedAt: string): Promise<Measurement>;
  createRecord(input: Omit<MeasurementRecord, "id">): Promise<MeasurementRecord>;
  listRecords(measurementId: MeasurementId, query: MeasurementHistoryQuery): Promise<MeasurementRecord[]>;
}

export interface GoalAccess {
  assertCanAccessGoal(user: AuthenticatedUserContext, goalId: GoalId): Promise<void>;
}

export interface MeasurementRules {
  /** Domain policy supplied by C06: approved value types, unit and target compatibility. */
  validateDefinition(input: {
    valueType: string; unit: string | null; targetValue: unknown;
  }): void;
  /** Domain policy supplied by C06; must reject values incompatible with the definition. */
  validateValue(definition: Measurement, value: unknown): void;
  /** C06 decides whether archived definitions accept new records. */
  assertCanRecord(definition: Measurement): void;
  /** C06 decides whether/how current record is resolved; no ordering is assumed here. */
  resolveCurrent(records: MeasurementRecord[]): MeasurementRecord | null;
  /** C06 decides whether an existing definition may be updated, especially unit changes. */
  assertCanUpdate(definition: Measurement, patch: {
    label?: string; description?: string | null; unit?: string | null; targetValue?: unknown;
  }, hasRecords: boolean): void;
  /** C06 decides whether repeated archive requests are permitted. */
  assertCanArchive(definition: Measurement): void;
}
