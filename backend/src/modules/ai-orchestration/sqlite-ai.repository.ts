import type { DatabaseConnection } from "../../infrastructure/database/sqlite.ts";
import type { AIProposalRepository } from "./ai-orchestration.repository";
import type { AIProposal, AIProposal as Proposal, AIProposalStatus } from "./ai-orchestration.types";
import { AIOrchestrationError } from "./ai-orchestration.errors";

interface ProposalRow {
  id: string; user_id: string; operation_type: Proposal["operationType"];
  proposal_type: Proposal["proposalType"]; status: Proposal["status"];
  proposal_data: string; created_at: string; updated_at: string;
}
function mapRow(row: ProposalRow): Proposal {
  return {
    id: row.id, userId: row.user_id, operationType: row.operation_type,
    proposalType: row.proposal_type, status: row.status,
    proposalData: JSON.parse(row.proposal_data), createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export class SqliteAIProposalRepository implements AIProposalRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async create(proposal: AIProposal): Promise<AIProposal> {
    this.connection.db.prepare(`INSERT INTO ai_proposals
      (id,user_id,operation_type,proposal_type,status,proposal_data,created_at,updated_at)
      VALUES (?,?,?,?,?,?,?,?)`).run(proposal.id, proposal.userId, proposal.operationType,
      proposal.proposalType, proposal.status, JSON.stringify(proposal.proposalData), proposal.createdAt, proposal.updatedAt);
    return proposal;
  }

  async getById(proposalId: string): Promise<AIProposal | null> {
    const row = this.connection.db.prepare("SELECT * FROM ai_proposals WHERE id = ?")
      .get(proposalId) as ProposalRow | undefined;
    return row ? mapRow(row) : null;
  }

  async update(proposal: AIProposal, expectedStatus?: AIProposalStatus): Promise<AIProposal> {
    const statusClause = expectedStatus ? " AND status = ?" : "";
    const result = this.connection.db.prepare(`UPDATE ai_proposals SET status=?, proposal_data=?, updated_at=?
      WHERE id=? AND user_id=?${statusClause}`).run(proposal.status, JSON.stringify(proposal.proposalData),
      proposal.updatedAt, proposal.id, proposal.userId, ...(expectedStatus ? [expectedStatus] : []));
    if (Number(result.changes) !== 1) {
      throw new AIOrchestrationError("AI_PROPOSAL_NOT_FOUND", "Proposal was not found.");
    }
    return proposal;
  }

  async claimForApplication(proposalId: string, userId: string, updatedAt: string): Promise<boolean> {
    const result = this.connection.db.prepare(`UPDATE ai_proposals SET status='APPLYING', updated_at=?
      WHERE id=? AND user_id=? AND status IN ('PENDING_REVIEW','EDITED','PARTIALLY_APPROVED','FAILED')`)
      .run(updatedAt, proposalId, userId);
    return Number(result.changes) === 1;
  }
}
