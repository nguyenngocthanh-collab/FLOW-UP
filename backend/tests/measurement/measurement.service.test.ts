import { describe, expect, it, vi } from "vitest";
import { MeasurementService } from "../../src/modules/measurement";
import type {
  AuthenticatedUserContext, Measurement, MeasurementRecord,
} from "../../src/modules/measurement";

const user: AuthenticatedUserContext = {
  userId: "user-1", email: null, isAuthenticated: true,
};
const definition: Measurement = {
  id: "measurement-1", goalId: "goal-1", label: "IELTS Overall",
  description: null, valueType: "NUMBER", unit: "Band Score", targetValue: 7,
  createdAt: "2026-11-01T00:00:00.000Z", updatedAt: "2026-11-01T00:00:00.000Z",
  archivedAt: null,
};
const record: MeasurementRecord = {
  id: "record-1", measurementId: definition.id, value: 6.5,
  recordedAt: "2026-11-15T00:00:00.000Z", createdAt: "2026-11-15T00:00:00.000Z",
  note: null,
};

function setup() {
  const repo = {
    createMeasurement: vi.fn(async (input: Omit<Measurement, "id">) => ({ ...input, id: "measurement-1" })),
    getMeasurement: vi.fn(async () => definition),
    listMeasurementsByGoal: vi.fn(async () => [definition]),
    updateMeasurement: vi.fn(async (_id: string, patch: Partial<Measurement>) => ({ ...definition, ...patch })),
    archiveMeasurement: vi.fn(async (_id: string, archivedAt: string) => ({ ...definition, archivedAt })),
    createRecord: vi.fn(async (input: Omit<MeasurementRecord, "id">) => ({ ...input, id: "record-1" })),
    listRecords: vi.fn(async () => [record]),
  };
  const goalAccess = { assertCanAccessGoal: vi.fn(async () => undefined) };
  const rules = {
    validateDefinition: vi.fn(),
    validateValue: vi.fn(),
    assertCanRecord: vi.fn(),
    resolveCurrent: vi.fn((records: MeasurementRecord[]) => records[0] ?? null),
    assertCanUpdate: vi.fn(),
    assertCanArchive: vi.fn(),
  };
  return { service: new MeasurementService(repo, goalAccess, rules), repo, goalAccess, rules };
}

describe("MeasurementService", () => {
  it("creates a definition after checking Goal access and domain policy", async () => {
    const { service, repo, goalAccess, rules } = setup();
    const result = await service.createMeasurement(user, {
      goalId: "goal-1", label: "IELTS Overall", valueType: "NUMBER",
    });
    expect(result.id).toBe("measurement-1");
    expect(goalAccess.assertCanAccessGoal).toHaveBeenCalledWith(user, "goal-1");
    expect(rules.validateDefinition).toHaveBeenCalled();
    expect(repo.createMeasurement).toHaveBeenCalled();
  });

  it("records a value only after definition access and domain checks", async () => {
    const { service, repo, rules } = setup();
    const result = await service.recordMeasurementValue(user, {
      measurementId: definition.id, value: 6.5,
    });
    expect(result.value).toBe(6.5);
    expect(rules.assertCanRecord).toHaveBeenCalledWith(definition);
    expect(rules.validateValue).toHaveBeenCalledWith(definition, 6.5);
    expect(repo.createRecord).toHaveBeenCalled();
  });

  it("returns the current value through the injected C06 resolver", async () => {
    const { service, rules } = setup();
    const result = await service.getCurrentMeasurementValue(user, definition.id);
    expect(rules.resolveCurrent).toHaveBeenCalled();
    expect(result).toEqual(record);
  });

  it("archives without deleting record history", async () => {
    const { service, repo } = setup();
    await service.archiveMeasurement(user, definition.id);
    expect(repo.archiveMeasurement).toHaveBeenCalled();
    expect(repo.listRecords).not.toHaveBeenCalled();
  });
});
