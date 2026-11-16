# MVP 0.1 Scope

**Product:** FLOW-UP  
**MVP Type:** Shared Web Demo  
**Status:** PROPOSED

## Goal

Demonstrate one complete, persistent, user-understandable goal execution loop using a shared workspace.

The MVP must help visitors turn an outcome into structured goals, milestones, scheduled actions, measurable progress, and review.

## Must Have

1. Provide one shared workspace accessible to all visitors.
2. No authentication, registration, or user management.
3. Create an outcome/goal directly inside the shared workspace.
4. Add child milestones to a goal in a hierarchy.
5. Browse the hierarchy in List/Outline view.
6. Optional Tree view for demonstration/testing.
7. Add a basic measurement to a goal: label, unit, current value, target value.
8. Record measurement updates and retain measurement history.
9. Create an action associated with a goal or milestone.
10. Give an action a status and optional start/end date and time.
11. Display scheduled actions in a simple calendar.
12. Mark an action complete.
13. Calculate and display transparent progress.
14. Show a basic review: target/plan vs actual.
15. Persist shared data across page refreshes, browser sessions, and different visitors.
16. Include seeded demo data and a reliable demo path.

## Should Have If Time Permits

- Simple dashboard with active goals and upcoming actions.
- Empty, loading, error, and success states.
- Basic responsive mobile web layout.
- Export or reset demo data.
- Clear indication that the workspace and its data are shared.

## Must Not Be Required for MVP

- Authentication, registration, or user management.
- Multiple workspaces or personal workspaces.
- Project management as a prerequisite for creating goals.
- Paid AI APIs or AI-generated plans.
- Team collaboration and role-based permissions.
- Custom table builder.
- User-authored arbitrary formulas.
- General algorithm marketplace.
- Advanced notifications.
- Native mobile app.
- Offline multi-device conflict resolution.
- Complex widget builder.

## MVP Acceptance Scenario

Given an accessible shared workspace:

1. A visitor opens the workspace without signing in.
2. The visitor creates a goal directly in the workspace.
3. The visitor creates at least one milestone under that goal.
4. The visitor creates an action associated with the goal or milestone.
5. The visitor schedules the action.
6. The visitor records a measurement update and/or completes the action.
7. The system persists the changes in the shared database.
8. The relevant progress view reflects the updated data.
9. Another browser or visitor can see the same updated data.
10. The visitor can understand what is next and whether the goal is on track.

## Demo Strategy

Prepare both:

- A live, short, end-to-end workflow using the shared workspace.
- A seeded workspace with realistic goal hierarchy, actions, schedule, measurement history, and progress.

The demo must not depend on live AI generation.

## Important Constraints

- This is a shared demonstration environment, not a private personal workspace.
- All visitors can potentially see and modify the same data.
- Do not store private or sensitive information.
- Public write access must be controlled through appropriate backend validation and database permissions.
- Technical implementation details remain subject to architecture and security decisions.