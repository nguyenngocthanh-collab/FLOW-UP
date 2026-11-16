# Contract Registry

A contract defines how modules exchange data or invoke behavior. Contracts are versioned and reviewed independently of UI layout.

| ID | Contract | Producer | Consumer | Version | Status |
|---|---|---|---|---|---|
| C-001 | Authenticated User Context | Identity & Access | all user-owned modules | 0.1 | PROPOSED |
| C-002 | Project Reference | Project | Goal, Action, Review | 0.1 | PROPOSED |
| C-003 | Goal Summary | Goal | List, Tree, Progress, Review | 0.1 | PROPOSED |
| C-004 | Action Summary | Action | Schedule, Calendar, Progress | 0.1 | PROPOSED |
| C-005 | Measurement Value | Measurement | Progress, Review | 0.1 | PROPOSED |
| C-006 | Schedule Entry | Scheduling | Calendar, Review | 0.1 | PROPOSED |
| C-007 | Progress Result | Progress Engine | Dashboard, Review | 0.1 | PROPOSED |

## Contract requirements
- Stable identifier and version.
- Field names, types, nullability, constraints.
- Ownership and authorization assumptions.
- Validation rules.
- Error behavior.
- Producer and consumer.
- Compatibility policy.
- Example payload.
- Tests proving the contract.

Do not assume the examples in module specs are final API schemas. Final API schemas belong here and/or in OpenAPI.
