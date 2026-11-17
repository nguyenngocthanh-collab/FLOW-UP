export type MeasurementId = string & { readonly __brand: "MeasurementId" };
export type MeasurementRecordId = string & { readonly __brand: "MeasurementRecordId" };
export type GoalId = string & { readonly __brand: "GoalId" };

/** Logical domain model only; this is not a persistence schema. */
export interface Measurement {
  id: MeasurementId;
  goalId: GoalId;
  name: string;
  description?: string | null;
  purpose?: string | null;
  valueType?: string | null; // OPEN: no official value-type enum has been approved.
  unit?: string | null;
  baselineValue?: unknown;
  targetValue?: unknown;
  targetDirection?: string | null; // OPEN: no official direction enum.
  status?: string | null; // OPEN: lifecycle states/transitions are not approved.
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

/** A record is distinct from its Measurement definition. */
export interface MeasurementRecord {
  id: MeasurementRecordId;
  measurementId: MeasurementId;
  value: unknown;
  recordedAt: string;
  source?: string | null; // OPEN: source enum/provenance policy.
  note?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface MeasurementGoalFacts {
  exists: boolean;
  accessible: boolean;
  validForMeasurement: boolean;
}

export interface MeasurementRecordFacts {
  measurementExists: boolean;
  measurementAccessible: boolean;
  measurementId: string;
}
