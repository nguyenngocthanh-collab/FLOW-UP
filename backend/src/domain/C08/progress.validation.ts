import {
  ProgressCalculationResult, ProgressSourceFacts, ProgressSourceReference,
} from "./progress.types";
import { ProgressError, ProgressErrorCode, progressError } from "./progress.errors";

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: ProgressError };

const ok: ValidationResult = { valid: true };

function fail(code: ProgressErrorCode, message: string, source?: string): ValidationResult {
  return { valid: false, error: progressError(code, message, source) };
}

function validTimestamp(value: unknown): boolean {
  return typeof value === "string" && value.trim() !== "" && Number.isFinite(Date.parse(value));
}

/** Preserve all four availability meanings; missing is never coerced to zero. */
export function resolveProgressAvailability(facts: ProgressSourceFacts): ProgressCalculationResult["availability"] {
  if (!facts.applicable) return "NOT_APPLICABLE";
  if (!facts.available) return "INSUFFICIENT_DATA";
  if (!facts.valid) return "INVALID_SOURCE";
  return "AVAILABLE";
}

export function validateSourceReferences(
  references: readonly ProgressSourceReference[],
): ValidationResult {
  for (const ref of references) {
    if (!ref.module?.trim() || !ref.resourceType?.trim() || !ref.resourceId?.trim()) {
      return fail("PROGRESS_SOURCE_INVALID", "Every source reference requires module, resource type and resource ID.");
    }
    if (ref.sourceTimestamp != null && !validTimestamp(ref.sourceTimestamp)) {
      return fail("PROGRESS_SOURCE_INVALID", "Source timestamp is invalid.", ref.resourceId);
    }
  }
  return ok;
}

export function validateProgressResult(result: ProgressCalculationResult): ValidationResult {
  if (!result.scopeType?.trim() || !result.scopeId?.trim() || !result.metricType?.trim()) {
    return fail("PROGRESS_SCOPE_INVALID", "Scope type, scope ID and metric type are required.");
  }
  if (!validTimestamp(result.calculatedAt)) {
    return fail("PROGRESS_VALIDATION_FAILED", "Calculation timestamp is invalid.");
  }
  if (result.availability === "AVAILABLE") {
    if (typeof result.value !== "number" || !Number.isFinite(result.value)) {
      return fail("PROGRESS_RESULT_UNAVAILABLE", "An AVAILABLE result requires a finite numeric value.");
    }
  } else if (result.value !== undefined && result.value !== null) {
    return fail("PROGRESS_VALIDATION_FAILED", "Unavailable results must not contain a fabricated numeric value.");
  }
  return validateSourceReferences(result.sourceReferences);
}

/**
 * No Progress formula is implemented here. Formula, weighting, eligibility,
 * normalization, precision, boundaries and aggregation remain Product Owner decisions.
 */
export function requireApprovedCalculationRule(
  approved: boolean,
): ValidationResult {
  return approved
    ? ok
    : fail("PROGRESS_RULE_UNAVAILABLE", "No approved calculation rule is available.");
}

/** Guard against non-finite source numbers without deciding formula semantics. */
export function validateFiniteSourceNumber(value: unknown, source?: string): ValidationResult {
  return typeof value === "number" && Number.isFinite(value)
    ? ok
    : fail("PROGRESS_SOURCE_INVALID", "Numeric source value must be finite.", source);
}
