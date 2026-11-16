# Update and Versioning Procedure

## 1. Artifact status

`DRAFT → IN_REVIEW → APPROVED → IMPLEMENTED → VERIFIED → RELEASED`

Not every artifact uses every status. A design spec can be APPROVED before code exists. An implementation is VERIFIED only with test evidence.

## 2. Versioning
- Patch (0.1.0 → 0.1.1): clarification, typo, non-behavioral correction.
- Minor (0.1.0 → 0.2.0): additive requirement or compatible detail.
- Major (0.1.0 → 1.0.0): breaking contract, entity lifecycle, behavior, or compatibility change.

This is a project convention, not an external standard.

## 3. When a module detail changes
1. Copy/modify the relevant child spec.
2. Record what changed and why.
3. Check parent module and dependencies.
4. Run Change Impact Review.
5. Obtain approval for shared contract changes.
6. Update affected tests and traceability.
7. Update parent index and Current Status.
8. Commit with a meaningful message.

## 4. When implementation discovers a design defect
Do not silently patch code and leave docs unchanged.
- Open a design issue.
- Describe observed mismatch and evidence.
- Propose spec change.
- Identify affected modules/contracts.
- Obtain approval.
- Update spec first or in the same reviewed change.
- Implement and test.
- Record the final decision.

## 5. Git commit conventions
Examples:
- `docs: add MOD-03 goal domain specification`
- `docs: approve C-003 goal summary contract v1`
- `feat(goal): implement create and update use cases`
- `test(goal): add hierarchy invariant coverage`
- `fix(schedule): reject invalid time range`

## 6. Release snapshot
At each milestone, tag the repository and record:
- blueprint version;
- module spec versions;
- contract versions;
- database migration range;
- test results;
- known limitations.
