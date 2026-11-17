import http from "node:http";
import { createSqliteDatabase, type DatabaseConnection } from "../infrastructure/database/sqlite.ts";
import {
  createApplicationContainer,
  type ApplicationContainer,
  type ContainerConfig
} from "../application/container.ts";
import { createApiHandler } from "../api/index.ts";

export interface AppOptions {
  dbPath?: string;
  connection?: DatabaseConnection;
  config?: ContainerConfig;
  corsOrigin?: string;
}

export interface AppInstance {
  server: http.Server;
  container: ApplicationContainer;
  close: () => Promise<void>;
}

export function createApp(options: AppOptions = {}): AppInstance {
  const connection = options.connection ?? createSqliteDatabase({ dbPath: options.dbPath });
  const container = createApplicationContainer(connection, options.config);
  const corsOrigin = options.corsOrigin ?? "*";

  const apiHandler = createApiHandler(container, corsOrigin);
  const server = http.createServer(apiHandler);

  return {
    server,
    container,
    async close() {
      return new Promise<void>((resolve, reject) => {
        if (!server.listening) {
          try {
            connection.close();
          } catch {
            // ignore if already closed
          }
          resolve();
          return;
        }

        server.close((err) => {
          try {
            connection.close();
          } catch {
            // ignore if already closed
          }
          if (err) reject(err);
          else resolve();
        });
      });
    }
  };
}
