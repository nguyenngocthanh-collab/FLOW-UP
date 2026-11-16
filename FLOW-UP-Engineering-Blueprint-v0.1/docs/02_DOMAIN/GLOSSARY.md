# Domain Glossary

Terms are provisional until domain modeling is approved.

| Term | Definition | Notes |
|---|---|---|
| Workspace | Personal container for projects and user-owned data | MVP may use one default workspace |
| Project | A bounded context for organizing a desired result | Exact distinction from Goal must be validated |
| Outcome / Goal | Desired end state that can be described and optionally measured | Avoid mixing with a task |
| Milestone | Meaningful intermediate result toward an outcome | May have parent goal |
| Action | Executable unit of work a user can perform | Can be scheduled |
| Measurement | Definition of a metric, unit, current value, target value | Metric type and aggregation require specification |
| Measurement Entry | Timestamped record of an observed value | Enables history |
| Schedule Entry | Time allocation for an action | Calendar is a view over schedule entries |
| Progress | Derived state based on explicit rules | Must be explainable and testable |
| Review | User-facing comparison of plan and actual | Does not autonomously alter plan |
| Hierarchy | Parent-child relationship among goals/milestones/actions | Not the same as cross-module dependency |
| Dependency | A relation indicating one item relies on another | Separate from parent-child |

Open domain questions:
- Is Project a container or itself a Goal?
- Can one Action contribute to multiple Goals?
- Can a Goal have multiple measurements?
- Can an Action have multiple schedule blocks?
- Are milestones and actions distinct entity types or one work-item type with a type field?
- What progress calculation applies to unmeasured goals?
