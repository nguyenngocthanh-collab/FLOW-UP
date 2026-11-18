export type MeasurementId = string;
export type MeasurementRecordId = string;
export type GoalId = string;
export type MeasurementValue = number | boolean | string;
export type MeasurementValueType = string;

export interface Measurement {
  id: MeasurementId;
  goalId: GoalId;
  label: string;
  description: string | null;
  valueType: MeasurementValueType;
  unit: string | null;
  targetValue: MeasurementValue | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}

export interface MeasurementRecord {
  id: MeasurementRecordId;
  measurementId: MeasurementId;
  value: MeasurementValue;
  recordedAt: string;
  createdAt: string;
  note: string | null;
}

export interface AuthenticatedUserContext {
  userId: string;
  email: string | null;
  isAuthenticated: true;
  workspaceId?: string;
}

export interface CreateMeasurementInput {
  goalId: GoalId;
  label: string;
  description?: string | null;
  valueType: MeasurementValueType;
  unit?: string | null;
  targetValue?: MeasurementValue | null;
}

export interface UpdateMeasurementInput {
  label?: string;
  description?: string | null;
  unit?: string | null;
  targetValue?: MeasurementValue | null;
}

export interface RecordMeasurementValueInput {
  measurementId: MeasurementId;
  value: MeasurementValue;
  recordedAt?: string;
  note?: string | null;
}

export interface MeasurementHistoryQuery {
  from?: string;
  to?: string;
  offset?: number;
  limit?: number;
}
