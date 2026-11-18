import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createSqliteDatabase } from "../../src/infrastructure/database/sqlite";

describe("multiple workspace migration", () => {
  let directory = "";

  afterEach(() => {
    if (directory) fs.rmSync(directory, { recursive: true, force: true });
    directory = "";
  });

  it("preserves existing workspace relationships and allows another workspace per user", () => {
    directory = fs.mkdtempSync(path.join(os.tmpdir(), "flow-up-workspaces-"));
    const dbPath = path.join(directory, "legacy.db");
    const legacy = new DatabaseSync(dbPath);
    legacy.exec(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE workspaces (id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, name TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
      CREATE TABLE projects (id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE, name TEXT NOT NULL, description TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
      INSERT INTO workspaces VALUES ('workspace-old', 'user-1', 'Existing space', '2026-01-01', '2026-01-01');
      INSERT INTO projects VALUES ('project-old', 'workspace-old', 'Existing project', NULL, '2026-01-01', '2026-01-01');
    `);
    legacy.close();

    const connection = createSqliteDatabase({ dbPath });
    try {
      connection.db.prepare("INSERT INTO workspaces VALUES (?, ?, ?, ?, ?)").run("workspace-new", "user-1", "Another space", "2026-02-01", "2026-02-01");
      expect(connection.db.prepare("SELECT name FROM workspaces WHERE id = ?").get("workspace-old")).toEqual({ name: "Existing space" });
      expect(connection.db.prepare("SELECT name FROM projects WHERE id = ?").get("project-old")).toEqual({ name: "Existing project" });
      expect(connection.db.prepare("PRAGMA foreign_key_check").all()).toEqual([]);
    } finally {
      connection.close();
    }
  });
});
