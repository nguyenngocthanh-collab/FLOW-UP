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
