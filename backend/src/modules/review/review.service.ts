import { ReviewError } from "./review.errors";
import type { CreateReviewInput, ReviewRecord, ReviewScope, ReviewSummary, ReviewUserContext, UpdateReviewNoteInput } from "./review.types";
import type { ReviewAccess, ReviewRepository, ReviewRules, ReviewSourceReader } from "./review.repository";
import { validateReviewNote, validateReviewScope } from "./review.validation";
export class ReviewService {
  constructor(private readonly repository: ReviewRepository, private readonly access: ReviewAccess,
    private readonly sources: ReviewSourceReader, private readonly rules: ReviewRules) {}
  async getReviewData(user: ReviewUserContext, scope: ReviewScope): Promise<ReviewSummary> {
    this.assertAuthenticated(user); validateReviewScope(scope, this.rules.validation);
    await this.access.assertScopeAccess(user.userId, scope);
    let results: Awaited<ReturnType<ReviewSourceReader["getPlannedWork"]>> extends never ? never : any;
    try {
      results = await Promise.all([
        this.sources.getPlannedWork(user.userId, scope), this.sources.getActualExecution(user.userId, scope),
        this.sources.getProgress(user.userId, scope), this.sources.getMeasurement(user.userId, scope),
      ]);
    } catch (error) { throw new ReviewError("REVIEW_DEPENDENCY_UNAVAILABLE", "A Review source dependency is unavailable.", error); }
    const [p, a, g, m] = results;
    const plannedWork = { status: p.data.length ? "AVAILABLE" as const : "EMPTY" as const, data: p.data, limitations: p.limitations ?? [] };
    const actualExecution = { status: a.data.length ? "AVAILABLE" as const : "EMPTY" as const, data: a.data, limitations: a.limitations ?? [] };
    const progress = { status: g.status, data: g.data, limitations: g.limitations ?? [] };
    const measurement = { status: m.status, data: m.data, limitations: m.limitations ?? [] };
    let comparison;
    try {
      const compared = this.rules.matchPlannedToActual(p.data, a.data);
      comparison = { status: compared.items.length ? "AVAILABLE" as const : "EMPTY" as const, data: compared, limitations: compared.limitations };
    } catch (error) { throw new ReviewError("REVIEW_COMPARISON_FAILED", "Planned and actual comparison failed.", error); }
    try {
      return this.rules.generateSummary({ scope, plannedWork, actualExecution, comparison, progress, measurement, generatedAt: this.rules.now() });
    } catch (error) { throw new ReviewError("REVIEW_SUMMARY_GENERATION_FAILED", "Review summary generation failed.", error); }
  }
  async createReview(user: ReviewUserContext, input: CreateReviewInput): Promise<ReviewRecord> {
    this.assertAuthenticated(user); validateReviewScope(input.scope, this.rules.validation);
    await this.access.assertScopeAccess(user.userId, input.scope);
    if (!this.rules.createReviewRecord) throw new ReviewError("REVIEW_INVALID_STATE", "Review persistence is not enabled until its model is approved.");
    const note = input.note?.trim() || null;
    if (note && note.length > this.rules.validation.maxNoteLength) throw new ReviewError("REVIEW_NOTE_INVALID", "Review note exceeds configured length.");
    const now = this.rules.now();
    const record: ReviewRecord = { id: crypto.randomUUID(), userId: user.userId, scope: input.scope, summary: null, note, createdAt: now, updatedAt: now };
    try { return await this.repository.create(record); }
    catch (error) { throw new ReviewError("REVIEW_PERSISTENCE_ERROR", "Unable to create Review.", error); }
  }
  async getReview(user: ReviewUserContext, reviewId: string): Promise<ReviewRecord> {
    this.assertAuthenticated(user);
    const record = await this.repository.getById(reviewId);
    if (!record) throw new ReviewError("REVIEW_NOT_FOUND", "Review was not found.");
    if (record.userId !== user.userId) throw new ReviewError("REVIEW_ACCESS_DENIED", "Review access denied.");
    await this.access.assertScopeAccess(user.userId, record.scope);
    return record;
  }
  async updateReviewNote(user: ReviewUserContext, reviewId: string, input: UpdateReviewNoteInput): Promise<ReviewRecord> {
    await this.getReview(user, reviewId);
    const note = validateReviewNote(input, this.rules.validation);
    try {
      const updated = await this.repository.updateNote(reviewId, user.userId, note, this.rules.now());
      if (!updated) throw new ReviewError("REVIEW_NOT_FOUND", "Review was not found.");
      return updated;
    } catch (error) { if (error instanceof ReviewError) throw error; throw new ReviewError("REVIEW_PERSISTENCE_ERROR", "Unable to update Review note.", error); }
  }
  async refreshReviewSummary(user: ReviewUserContext, reviewId: string): Promise<ReviewRecord> {
    const record = await this.getReview(user, reviewId);
    const summary = await this.getReviewData(user, record.scope);
    if (!this.rules.persistSummary) return { ...record, summary };
    try {
      const updated = await this.repository.updateSummary(reviewId, user.userId, summary, this.rules.now());
      if (!updated) throw new ReviewError("REVIEW_NOT_FOUND", "Review was not found.");
      return updated;
    } catch (error) { if (error instanceof ReviewError) throw error; throw new ReviewError("REVIEW_PERSISTENCE_ERROR", "Unable to refresh Review summary.", error); }
  }
  private assertAuthenticated(user: ReviewUserContext): void {
    if (!user?.isAuthenticated || !user.userId) throw new ReviewError("REVIEW_ACCESS_DENIED", "Authentication is required.");
  }
}
