import fs from "node:fs";
import path from "node:path";
import { createSqliteDatabase } from "../infrastructure/database/sqlite.ts";

function loadEnv(): void {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!(key in process.env)) {
            process.env[key] = val;
          }
        }
      }
    } catch {
      // ignore
    }
  }
}

loadEnv();

const dbPath = process.env.DATABASE_PATH || "./data/flow-up.db";
console.log(`Initializing SQLite database at: ${dbPath}...`);

const db = createSqliteDatabase({ dbPath });
console.log("Database schema initialized and foreign keys enabled successfully!");
db.close();
console.log("Database connection closed.");
