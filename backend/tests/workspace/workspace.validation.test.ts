import { describe, expect, it } from "vitest";
import {
  validateCreateProjectInput,
  validateUpdateProjectInput
} from "../../src/modules/workspace/workspace.validation";

describe("B02 project validation", () => {
  it("accepts a valid project name", () => {
    expect(validateCreateProjectInput({ name: "FLOW-UP" }).valid).toBe(true);
  });

  it("rejects an empty project name", () => {
    expect(validateCreateProjectInput({ name: "   " })).toMatchObject({
      valid: false,
      code: "PROJECT_INVALID_NAME"
    });
  });

  it("rejects an empty update", () => {
    expect(validateUpdateProjectInput({})).toMatchObject({
      valid: false,
      code: "PROJECT_INVALID_INPUT"
    });
  });

  it("allows a nullable description", () => {
    expect(
      validateCreateProjectInput({ name: "FLOW-UP", description: null }).valid
    ).toBe(true);
  });
});
