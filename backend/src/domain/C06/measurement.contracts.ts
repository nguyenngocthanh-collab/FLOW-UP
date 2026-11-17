import { Measurement, MeasurementRecord, MeasurementId, GoalId } from "./measurement.types";

export interface MeasurementGoalReader {
  getGoalFacts(goalId: GoalId): Promise<{
    exists: boolean;
    accessible: boolean;
    validForMeasurement: boolean;
  }>;
}

export interface MeasurementReader {
  getMeasurement(id: MeasurementId): Promise<Measurement | null>;
  getMeasurementsByGoal(goalId: GoalId): Promise<Measurement[]>;
  getMeasurementRecords(id: MeasurementId): Promise<MeasurementRecord[]>;
}

/** Read-only facts exposed to C08/C09; neither consumer owns C06 mutations. */
export interface MeasurementReadFacts {
  measurement: Measurement;
  records?: readonly MeasurementRecord[];
  currentValue?: MeasurementRecord | null; // Only populate after latest-value policy is approved.
}
