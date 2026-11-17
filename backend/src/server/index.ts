
import fs from "node:fs";
import path from "node:path";
import { createApp } from "./app.ts";

// Simple .env reader if .env file exists
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
          const val = trimmed
            .slice(eqIdx + 1)
            .trim()
            .replace(/^["']|["']$/g, "");

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

const port = Number(process.env.PORT || 3001);
const dbPath = process.env.DATABASE_PATH || "./data/flow-up.db";
const corsOrigin = process.env.CORS_ORIGIN || "*";

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const authDevMode = process.env.AUTH_DEV_MODE;

if (
  authDevMode !== undefined &&
  authDevMode !== "true" &&
  authDevMode !== "false"
) {
  throw new Error(
    "AUTH_DEV_MODE must be either 'true' or 'false'."
  );
}

const devMode = !isProduction && authDevMode === "true";

if (isProduction && authDevMode === "true") {
  throw new Error(
    "AUTH_DEV_MODE cannot be enabled in production."
  );
}

if (isProduction && (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY)) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY are required in production."
  );
}

const app = createApp({
  dbPath,
  corsOrigin,
  config: {
    auth: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      devMode
    }
  }
});

app.server.listen(port, () => {
  console.log("====================================================");
  console.log(`  FLOW-UP Backend Server running on port ${port}`);
  console.log(`  Health Check: http://localhost:${port}/health`);
  console.log(`  API Base:     http://localhost:${port}/api`);
  console.log(`  Database:     ${dbPath}`);
  console.log(`  Environment:  ${nodeEnv}`);
  console.log(`  Dev Mode:     ${devMode ? "ENABLED" : "DISABLED"}`);
  console.log("====================================================");
});

const shutdown = async () => {
  console.log("\nStopping FLOW-UP server...");

  try {
    await app.close();
    console.log("FLOW-UP server gracefully stopped.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
