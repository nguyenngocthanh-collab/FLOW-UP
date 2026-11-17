import { randomUUID } from "node:crypto";
import type { DatabaseConnection } from "../database/sqlite.ts";
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
  Workspace
} from "../../modules/workspace/workspace.types.ts";
import type { WorkspaceRepository } from "../../modules/workspace/workspace.repository.ts";

interface WorkspaceRow {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface ProjectRow {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

function mapWorkspace(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export class SqliteWorkspaceRepository implements WorkspaceRepository {
  private readonly connection: DatabaseConnection;

  constructor(connection: DatabaseConnection) {
    this.connection = connection;
  }

  async getOrCreatePersonalWorkspace(userId: string): Promise<Workspace> {
    return this.connection.runInTransaction(() => {
      const selectStmt = this.connection.db.prepare(
        "SELECT id, user_id, name, created_at, updated_at FROM workspaces WHERE user_id = ?"
      );
      const existing = selectStmt.get(userId) as WorkspaceRow | undefined;
      if (existing) {
        return mapWorkspace(existing);
      }

      const id = randomUUID();
      const now = new Date().toISOString();
      const insertStmt = this.connection.db.prepare(
        "INSERT INTO workspaces (id, user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
      );

      try {
        insertStmt.run(id, userId, "Personal Workspace", now, now);
        return {
          id,
          userId,
          name: "Personal Workspace",
          createdAt: now,
          updatedAt: now
        };
      } catch (err: unknown) {
        // Handle race condition where another request created it
        const retry = selectStmt.get(userId) as WorkspaceRow | undefined;
        if (retry) {
          return mapWorkspace(retry);
        }
        throw err;
      }
    });
  }

  async findWorkspaceByUserId(userId: string): Promise<Workspace | null> {
    const stmt = this.connection.db.prepare(
      "SELECT id, user_id, name, created_at, updated_at FROM workspaces WHERE user_id = ?"
    );
    const row = stmt.get(userId) as WorkspaceRow | undefined;
    return row ? mapWorkspace(row) : null;
  }

  async findWorkspaceById(workspaceId: string): Promise<Workspace | null> {
    const stmt = this.connection.db.prepare(
      "SELECT id, user_id, name, created_at, updated_at FROM workspaces WHERE id = ?"
    );
    const row = stmt.get(workspaceId) as WorkspaceRow | undefined;
    return row ? mapWorkspace(row) : null;
  }

  async createProject(workspaceId: string, input: CreateProjectInput): Promise<Project> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const description = input.description?.trim() ? input.description.trim() : null;

    const stmt = this.connection.db.prepare(
      "INSERT INTO projects (id, workspace_id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    );
    stmt.run(id, workspaceId, input.name.trim(), description, now, now);

    return {
      id,
      workspaceId,
      name: input.name.trim(),
      description,
      createdAt: now,
      updatedAt: now
    };
  }

  async findProjectById(projectId: string): Promise<Project | null> {
    const stmt = this.connection.db.prepare(
      "SELECT id, workspace_id, name, description, created_at, updated_at FROM projects WHERE id = ?"
    );
    const row = stmt.get(projectId) as ProjectRow | undefined;
    return row ? mapProject(row) : null;
  }

  async listProjectsByWorkspaceId(workspaceId: string): Promise<Project[]> {
    const stmt = this.connection.db.prepare(
      "SELECT id, workspace_id, name, description, created_at, updated_at FROM projects WHERE workspace_id = ? ORDER BY created_at ASC"
    );
    const rows = stmt.all(workspaceId) as unknown as ProjectRow[];
    return rows.map(mapProject);
  }

  async updateProject(projectId: string, input: UpdateProjectInput): Promise<Project> {
    const existing = await this.findProjectById(projectId);
    if (!existing) {
      throw new Error(`Project not found: ${projectId}`);
    }

    const now = new Date().toISOString();
    const name = input.name !== undefined ? input.name.trim() : existing.name;
    const description =
      input.description !== undefined
        ? input.description === null || input.description.trim() === ""
          ? null
          : input.description.trim()
        : existing.description;

    const stmt = this.connection.db.prepare(
      "UPDATE projects SET name = ?, description = ?, updated_at = ? WHERE id = ?"
    );
    stmt.run(name, description, now, projectId);

    return {
      id: existing.id,
      workspaceId: existing.workspaceId,
      name,
      description,
      createdAt: existing.createdAt,
      updatedAt: now
    };
  }
}
