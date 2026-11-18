import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { SCHEMA_SQL } from "./schema.ts";

export interface DatabaseConnection {
  readonly db: DatabaseSync;
  runInTransaction<T>(fn: () => T): T;
  close(): void;
}

export interface SqliteOptions {
  dbPath?: string;
}

/**
 * Initializes SQLite database connection with foreign keys enabled
 * and executes initial schema migrations.
 */
export function createSqliteDatabase(options: SqliteOptions = {}): DatabaseConnection {
  const dbPath = options.dbPath ?? ":memory:";

  if (dbPath !== ":memory:") {
    const dir = path.dirname(path.resolve(dbPath));
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new DatabaseSync(dbPath);

  // Enable foreign keys
  db.exec("PRAGMA foreign_keys = ON;");

  if (dbPath !== ":memory:") {
    try {
      db.exec("PRAGMA journal_mode = WAL;");
    } catch {
      // WAL may not be supported on all environments, ignore if fails
    }
  }

  // Initialize schema
  db.exec(SCHEMA_SQL);
  migrateMultipleWorkspaces(db);

  return {
    get db() {
      return db;
    },
    runInTransaction<T>(fn: () => T): T {
      db.exec("BEGIN IMMEDIATE TRANSACTION;");
      try {
        const result = fn();
        db.exec("COMMIT;");
        return result;
      } catch (error) {
        try {
          db.exec("ROLLBACK;");
        } catch {
          // ignore rollback failure if transaction already ended
        }
        throw error;
      }
    },
    close() {
      db.close();
    }
  };
}

/** Remove the legacy UNIQUE(user_id) constraint without changing existing workspace IDs or data. */
function migrateMultipleWorkspaces(db: DatabaseSync): void {
  const indexes = db.prepare("PRAGMA index_list('workspaces')").all() as Array<{ name: string; unique: number; origin: string }>;
  const hasLegacyUserUniqueness = indexes.some((index) => {
    if (index.unique !== 1 || index.origin !== "u") return false;
    const columns = db.prepare(`PRAGMA index_info('${index.name.replaceAll("'", "''")}')`).all() as Array<{ name: string }>;
    return columns.length === 1 && columns[0]?.name === "user_id";
  });
  if (!hasLegacyUserUniqueness) return;

  db.exec("PRAGMA foreign_keys = OFF;");
  try {
    db.exec(`
      BEGIN IMMEDIATE;
      CREATE TABLE workspaces_migration (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      INSERT INTO workspaces_migration (id, user_id, name, created_at, updated_at)
        SELECT id, user_id, name, created_at, updated_at FROM workspaces;
      DROP TABLE workspaces;
      ALTER TABLE workspaces_migration RENAME TO workspaces;
      CREATE INDEX idx_workspaces_user_id ON workspaces(user_id, created_at);
      COMMIT;
    `);
  } catch (error) {
    try { db.exec("ROLLBACK;"); } catch { /* transaction may already have rolled back */ }
    throw error;
  } finally {
    db.exec("PRAGMA foreign_keys = ON;");
  }
}
