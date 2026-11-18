import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import type { AIProvider } from "./ai-orchestration.repository";
import type { AIProviderRequest, AIProviderResponse } from "./ai-orchestration.types";
import { AIOrchestrationError } from "./ai-orchestration.errors";

const CLARIFICATION_SCHEMA = {
  type: "object",
  properties: {
    outcome: { type: "string" },
    successCriteria: { type: "array", items: { type: "string" } },
    knownFacts: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    missingInformation: { type: "array", items: { type: "string" } },
    questions: { type: "array", items: { type: "object", properties: {
      id: { type: "string" }, prompt: { type: "string" }, why: { type: "string" },
      answerType: { type: "string", enum: ["TEXT", "NUMBER", "DATE", "CHOICE"] },
      required: { type: "boolean" }, options: { type: "array", items: { type: "string" } },
    }, required: ["id", "prompt", "why", "answerType", "required", "options"] } },
  }, required: ["outcome", "successCriteria", "knownFacts", "assumptions", "missingInformation", "questions"],
} as const;

const FEASIBILITY_SCHEMA = {
  type: "object",
  properties: {
    assessment: { type: "string", enum: ["FEASIBLE", "CONCERN", "INSUFFICIENT_INFORMATION"] },
    summary: { type: "string" },
    concerns: { type: "array", items: { type: "string" } },
    alternatives: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    missingInformation: { type: "array", items: { type: "string" } },
  }, required: ["assessment", "summary", "concerns", "alternatives", "assumptions", "missingInformation"],
} as const;

const PROPOSAL_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string" },
    items: { type: "array", items: { type: "object", properties: {
      id: { type: "string" }, type: { type: "string", enum: ["GOAL", "MILESTONE", "ACTION", "MEASUREMENT"] },
      title: { type: "string" }, description: { type: "string" }, targetDate: { type: ["string", "null"] },
      parentItemId: { type: ["string", "null"] }, rationale: { type: "string" },
      valueType: { type: ["string", "null"], enum: ["NUMBER", "TEXT", "BOOLEAN", null] },
      unit: { type: ["string", "null"] }, targetValue: { type: ["number", "string", "boolean", "null"] },
    }, required: ["id", "type", "title", "description", "targetDate", "parentItemId", "rationale"] } },
  }, required: ["summary", "items"],
} as const;

const SCHEMAS = {
  GOAL_CLARIFICATION: CLARIFICATION_SCHEMA,
  GOAL_FEASIBILITY: FEASIBILITY_SCHEMA,
  GOAL_TREE_PROPOSAL: PROPOSAL_SCHEMA,
  DAILY_PLAN_PROPOSAL: PROPOSAL_SCHEMA,
} as const;

const INSTRUCTIONS: Record<AIProviderRequest["operationType"], string> = {
  GOAL_CLARIFICATION: "Understand the user's goal. Separate explicit facts from assumptions. Ask only questions whose answers may change the plan. Do not invent facts. Return concise JSON matching the schema.",
  GOAL_FEASIBILITY: "Assess feasibility using only the supplied information. State uncertainty and missing prerequisites. Do not replace the user's intended outcome or invent resources, dates, or commitments.",
  GOAL_TREE_PROPOSAL: "Propose a small useful structure using Goals, Milestones, Actions, and only when a measurable outcome is useful, a Measurement. Use flexible depth and no arbitrary minimum item count. Include a single root GOAL. IDs must be unique strings; parentItemId must reference another proposed item or be null. A Measurement must be a child of a Goal, use NUMBER, TEXT, or BOOLEAN, and include a target only when explicitly supported by the input; otherwise set targetValue to null. Do not invent dates, resources, or facts. All content is proposed, not confirmed.",
  DAILY_PLAN_PROPOSAL: "Propose a bounded daily plan using only supplied actions, times, and commitments. Do not invent availability. Return only supported plan items.",
};

export class GeminiAIProvider implements AIProvider {
  private readonly client: GoogleGenAI | null;
  private readonly model: string;

  constructor(apiKey = process.env.GEMINI_API_KEY, model = process.env.GEMINI_MODEL || "gemini-3.8-flash", timeoutMs = 20_000) {
    this.client = apiKey ? new GoogleGenAI({ apiKey, httpOptions: { timeout: timeoutMs } }) : null;
    this.model = model;
  }

  async generate(request: AIProviderRequest): Promise<AIProviderResponse> {
    if (!this.client) {
      throw new AIOrchestrationError("AI_PROVIDER_UNAVAILABLE", "AI assistance is unavailable. Add GEMINI_API_KEY to the backend environment or continue manually.");
    }
    const prompt = [
      INSTRUCTIONS[request.operationType],
      "Return only the requested structured result. Keep output concise.",
      `User input:\n${request.input}`,
      `Authorized context:\n${JSON.stringify(request.context)}`,
    ].join("\n\n");
    let response: GenerateContentResponse;
    try {
      response = await this.client.models.generateContent({
        model: this.model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: SCHEMAS[request.operationType],
          maxOutputTokens: 1800,
        },
      });
    } catch (error) {
      const candidate = error as { status?: number; code?: number; name?: string };
      if (candidate?.name === "TimeoutError" || candidate?.name === "AbortError") {
        throw new AIOrchestrationError("AI_REQUEST_TIMEOUT", "The AI request timed out. You can retry or continue manually.", error);
      }
      if (candidate?.status === 429 || candidate?.code === 429) {
        throw new AIOrchestrationError("AI_PROVIDER_RATE_LIMITED", "The AI service is at its current quota. Try again later or continue manually.", error);
      }
      if (candidate?.status === 401 || candidate?.status === 403 || candidate?.code === 401 || candidate?.code === 403) {
        throw new AIOrchestrationError("AI_PROVIDER_AUTH_FAILED", "The configured AI key was rejected.", error);
      }
      throw error;
    }
    const text = response.text;
    let content: unknown;
    try {
      content = text ? JSON.parse(text) as unknown : null;
    } catch (error) {
      throw new AIOrchestrationError("AI_OUTPUT_INVALID", "The AI service returned invalid structured data.", error);
    }
    return {
      content,
      finishReason: response.candidates?.[0]?.finishReason,
      truncated: response.candidates?.[0]?.finishReason === "MAX_TOKENS",
    };
  }
}

export const geminiSchemas = SCHEMAS;
