export type ProgressScopeType = string;
export type ProgressMetricType = string;
export type ProgressAvailability =
  | "AVAILABLE"
  | "INSUFFICIENT_DATA"
  | "NOT_APPLICABLE"
  | "INVALID_SOURCE"
  | (string & {});

export interface ProgressSourceReference {
  module: string;
  resourceType: string;
  resourceId: string;
  sourceTimestamp?: string | null;
  sourceVersion?: string | null;
}

export interface ProgressCalculationResult {
  scopeType: ProgressScopeType;
  scopeId: string;
  metricType: ProgressMetricType;
  /** Missing when no numeric result is valid; never substitute zero. */
  value?: number | null;
  unit?: string | null;
  availability: ProgressAvailability;
  calculatedAt: string;
  sourceReferences: readonly ProgressSourceReference[];
  ruleVersion?: string | null; // OPEN: versioning policy.
  explanation?: string | null;
  status?: string | null; // OPEN: result lifecycle/state.
}

export interface ProgressSourceFacts {
  available: boolean;
  valid: boolean;
  applicable: boolean;
  references: readonly ProgressSourceReference[];
}

export interface ProgressCalculationMetadata {
  calculatedAt: string;
  sourceReferences: readonly ProgressSourceReference[];
  ruleVersion?: string | null;
}
