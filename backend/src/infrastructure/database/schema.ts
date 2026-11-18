/**
 * FLOW-UP — SQLite Database Schema & Migrations
 * MVP temporary database configuration.
 *
 * Enforces:
 * - Foreign keys enabled
 * - Multiple owner-scoped workspaces per user
 * - Project workspace foreign keys
 * - Goal hierarchy relational integrity
 * - Milestone/Action/Schedule constraints
 */

export const SCHEMA_SQL = `
-- Workspaces are user-owned containers; a user may have multiple.
CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id, created_at);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  parent_goal_id TEXT REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_goals_workspace_id ON goals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_goals_project_id ON goals(project_id);
CREATE INDEX IF NOT EXISTS idx_goals_parent_goal_id ON goals(parent_goal_id);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_milestones_goal_id ON milestones(goal_id);

-- Actions table
CREATE TABLE IF NOT EXISTS actions (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  milestone_id TEXT REFERENCES milestones(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'TODO',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  completed_at TEXT,
  archived_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_actions_goal_id ON actions(goal_id);
CREATE INDEX IF NOT EXISTS idx_actions_milestone_id ON actions(milestone_id);

-- Action executions table
CREATE TABLE IF NOT EXISTS action_executions (
  action_id TEXT PRIMARY KEY REFERENCES actions(id) ON DELETE CASCADE,
  actual_started_at TEXT,
  actual_completed_at TEXT,
  actual_duration_minutes INTEGER,
  execution_note TEXT,
  updated_at TEXT NOT NULL
);

-- Daily Plans table
CREATE TABLE IF NOT EXISTS daily_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON daily_plans(user_id, date);

-- Schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id TEXT PRIMARY KEY,
  action_id TEXT NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  daily_plan_id TEXT REFERENCES daily_plans(id) ON DELETE SET NULL,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_schedules_action_id ON schedules(action_id);
CREATE INDEX IF NOT EXISTS idx_schedules_daily_plan_id ON schedules(daily_plan_id);

-- B06 Measurement definitions and immutable value history.
CREATE TABLE IF NOT EXISTS measurements (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  description TEXT,
  value_type TEXT NOT NULL,
  unit TEXT,
  target_value TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_measurements_goal_id ON measurements(goal_id);

CREATE TABLE IF NOT EXISTS measurement_records (
  id TEXT PRIMARY KEY,
  measurement_id TEXT NOT NULL REFERENCES measurements(id) ON DELETE CASCADE,
  value_json TEXT NOT NULL,
  recorded_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  note TEXT
);

CREATE INDEX IF NOT EXISTS idx_measurement_records_measurement_recorded
  ON measurement_records(measurement_id, recorded_at, created_at);

-- B10 owns these AI workflow records; domain tables remain owned by their modules.
CREATE TABLE IF NOT EXISTS ai_proposals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  proposal_type TEXT NOT NULL,
  status TEXT NOT NULL,
  proposal_data TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_proposals_user_created
  ON ai_proposals(user_id, created_at);

CREATE TABLE IF NOT EXISTS ai_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_created
  ON ai_usage(user_id, created_at);
`;
