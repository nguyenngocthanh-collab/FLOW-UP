import { MeasurementError } from "./measurement.errors";
import type { GoalAccess, MeasurementRepository, MeasurementRules } from "./measurement.repository";
import type {
  AuthenticatedUserContext, CreateMeasurementInput, Measurement, MeasurementHistoryQuery,
  MeasurementRecord, RecordMeasurementValueInput, UpdateMeasurementInput,
} from "./measurement.types";
import {
  validateCreateMeasurementInput, validateHistoryQuery, validateRecordInput,
  validateUpdateMeasurementInput,
} from "./measurement.validation";

export class MeasurementService {
  constructor(
    private readonly repository: MeasurementRepository,
    private readonly goalAccess: GoalAccess,
    private readonly rules: MeasurementRules,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async createMeasurement(user: AuthenticatedUserContext, input: CreateMeasurementInput): Promise<Measurement> {
    this.assertAuthenticated(user);
    validateCreateMeasurementInput(input);
    await this.goalAccess.assertCanAccessGoal(user, input.goalId);
    this.rules.validateDefinition({
      valueType: input.valueType,
      unit: input.unit ?? null,
      targetValue: input.targetValue ?? null,
    });
    const timestamp = this.now().toISOString();
    return this.repository.createMeasurement({
      goalId: input.goalId,
      label: input.label.trim(),
      description: input.description ?? null,
      valueType: input.valueType,
      unit: input.unit ?? null,
      targetValue: input.targetValue ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
      archivedAt: null,
    });
  }

  async getMeasurement(user: AuthenticatedUserContext, id: string): Promise<Measurement> {
    const measurement = await this.getOwnedMeasurement(user, id);
    return measurement;
  }

  async listMeasurementsByGoal(
    user: AuthenticatedUserContext, goalId: string, includeArchived = false,
  ): Promise<Measurement[]> {
    this.assertAuthenticated(user);
    await this.goalAccess.assertCanAccessGoal(user, goalId);
    return this.repository.listMeasurementsByGoal(goalId, includeArchived);
  }

  async updateMeasurement(
    user: AuthenticatedUserContext, id: string, patch: UpdateMeasurementInput,
  ): Promise<Measurement> {
    const definition = await this.getOwnedMeasurement(user, id);
    validateUpdateMeasurementInput(patch);
    const history = await this.repository.listRecords(id, {});
    this.rules.assertCanUpdate(definition, patch, history.length > 0);
    const candidate = {
      valueType: definition.valueType,
      unit: patch.unit === undefined ? definition.unit : patch.unit,
      targetValue: patch.targetValue === undefined ? definition.targetValue : patch.targetValue,
    };
    this.rules.validateDefinition(candidate);
    return this.repository.updateMeasurement(id, {
      ...patch,
      ...(patch.label !== undefined ? { label: patch.label.trim() } : {}),
      updatedAt: this.now().toISOString(),
    });
  }

  async recordMeasurementValue(
    user: AuthenticatedUserContext, input: RecordMeasurementValueInput,
  ): Promise<MeasurementRecord> {
    const definition = await this.getOwnedMeasurement(user, input.measurementId);
    validateRecordInput(input);
    this.rules.assertCanRecord(definition);
    this.rules.validateValue(definition, input.value);
    const createdAt = this.now().toISOString();
    return this.repository.createRecord({
      measurementId: definition.id,
      value: input.value,
      recordedAt: input.recordedAt ?? createdAt,
      createdAt,
      note: input.note ?? null,
    });
  }

  async getCurrentMeasurementValue(
    user: AuthenticatedUserContext, id: string,
  ): Promise<MeasurementRecord | null> {
    await this.getOwnedMeasurement(user, id);
    const records = await this.repository.listRecords(id, {});
    return this.rules.resolveCurrent(records);
  }

  async getMeasurementHistory(
    user: AuthenticatedUserContext, id: string, query: MeasurementHistoryQuery = {},
  ): Promise<MeasurementRecord[]> {
    await this.getOwnedMeasurement(user, id);
    validateHistoryQuery(query);
    return this.repository.listRecords(id, query);
  }

  async archiveMeasurement(user: AuthenticatedUserContext, id: string): Promise<Measurement> {
    const definition = await this.getOwnedMeasurement(user, id);
    this.rules.assertCanArchive(definition);
    return this.repository.archiveMeasurement(id, this.now().toISOString());
  }

  private async getOwnedMeasurement(user: AuthenticatedUserContext, id: string): Promise<Measurement> {
    this.assertAuthenticated(user);
    if (!id?.trim()) throw new MeasurementError("MEASUREMENT_NOT_FOUND", "Measurement ID is required.");
    const measurement = await this.repository.getMeasurement(id);
    if (!measurement) throw new MeasurementError("MEASUREMENT_NOT_FOUND", "Measurement was not found.");
    await this.goalAccess.assertCanAccessGoal(user, measurement.goalId);
    return measurement;
  }

  private assertAuthenticated(user: AuthenticatedUserContext): void {
    if (!user || user.isAuthenticated !== true || !user.userId) {
      throw new MeasurementError("MEASUREMENT_ACCESS_DENIED", "Authenticated user context is required.");
    }
  }
}
