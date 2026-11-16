# Dependency Registry

This registry is the authoritative cross-module relationship map. Update it whenever a contract, entity, or module boundary changes.

## Initial logical dependencies (PROPOSED)

| Source module | Depends on | Relationship | Contract / data | Change impact |
|---|---|---|---|---|
| Workspace | Identity/Access | ownership | user_id, workspace_id | all user-owned modules |
| Project | Workspace | containment | workspace_id | Goal, Action, Schedule, Review |
| Goal | Project | containment | project_id | Measurement, Action, Progress, views |
| Goal | Goal | parent-child hierarchy | parent_goal_id | List/Tree views, validation |
| Measurement | Goal | measures | goal_id | Progress, Review |
| Measurement Entry | Measurement | history | measurement_id, value, recorded_at | Progress, Review |
| Action | Project | containment | project_id | Schedule, Progress, Review |
| Action | Goal/Milestone | contributes to | goal_id (or link table if many-to-many) | Progress, Goal views |
| Schedule Entry | Action | schedules | action_id, start_at, end_at | Calendar, Review |
| Progress | Goal, Measurement, Action | derives | calculation policy | Dashboard, Review |
| Review | Goal, Progress, Schedule, Action | reads | review snapshot / derived values | Dashboard |

## Dependency direction rules
- UI depends on application/domain interfaces, not directly on another UI module.
- Domain modules must not import UI modules.
- Calendar reads scheduled actions; it must not own Goal hierarchy.
- Tree/List are presentation modules and must not become domain owners.
- Progress calculations must have one authoritative implementation and explicit tests.
- Avoid circular module dependencies. If A requires B and B requires A, redesign ownership or introduce a shared contract.

## Change impact procedure
1. Identify changed entity/field/rule/contract.
2. Search this registry for direct dependents.
3. Follow transitive dependents.
4. List affected module specifications, migrations, API schemas, UI, and tests.
5. Propose compatibility and migration.
6. Obtain approval for shared contract changes.
7. Implement and run affected tests.
8. Update this registry and `CURRENT_STATUS.md`.
