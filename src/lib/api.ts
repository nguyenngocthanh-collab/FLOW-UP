const API_BASE_URL = (
  import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL ?? '')
)
  .replace(/\/api\/?$/, '')
  .replace(/\/$/, '');
const TOKEN_KEY = 'flow-up.access-token';
const WORKSPACE_KEY = 'flow-up.active-workspace';

export interface UserContext {
  userId: string;
  email: string | null;
  isAuthenticated: true;
}
export interface Workspace {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface Goal {
  id: string;
  workspaceId: string;
  projectId: string | null;
  parentGoalId: string | null;
  title: string;
  description: string | null;
  targetDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
}
export interface GoalNode {
  goal: Goal;
  children: GoalNode[];
}
export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
export type ActionStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export interface Action {
  id: string;
  goalId: string;
  milestoneId: string | null;
  title: string;
  description: string | null;
  status: ActionStatus;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  archivedAt: string | null;
}
export interface Execution {
  actionId: string;
  actualStartedAt: string | null;
  actualCompletedAt: string | null;
  actualDurationMinutes: number | null;
  executionNote: string | null;
}
export interface Measurement {
  id: string; goalId: string; label: string; description: string | null;
  valueType: 'NUMBER' | 'TEXT' | 'BOOLEAN'; unit: string | null;
  targetValue: number | string | boolean | null; createdAt: string; updatedAt: string; archivedAt: string | null;
}
export interface MeasurementRecord {
  id: string; measurementId: string; value: number | string | boolean;
  recordedAt: string; createdAt: string; note: string | null;
}
export interface DailyPlan {
  id: string;
  userId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
export interface Schedule {
  id: string;
  actionId: string;
  dailyPlanId: string | null;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
}
export interface ProgressSummary {
  goalId: string;
  goalProgress: {
    goalId: string;
    progressValue: number | null;
    calculationStatus: string;
    contributingSources: string[];
    calculationContext: Record<string, unknown>;
  };
  measurementProgress: Array<{
    measurementId: string;
    currentValue: unknown;
    targetValue: unknown;
    progressValue: number | null;
    calculationStatus: string;
  }>;
  actionCompletion: {
    totalActions: number | null;
    completedActions: number | null;
    incompleteActions?: number | null;
    completionValue: number | null;
    calculationStatus: string;
    calculationContext?: Record<string, unknown>;
  } | null;
  childGoalProgress: unknown[];
  calculationStatus: string;
}
export interface AIClarification {
  outcome: string;
  successCriteria: string[];
  knownFacts: string[];
  assumptions: string[];
  missingInformation: string[];
  questions: { id: string; prompt: string; why: string; answerType: string; required: boolean; options: string[] }[];
  provenance: 'NEEDS_CONFIRMATION';
}
export interface AIFeasibility {
  assessment: 'FEASIBLE' | 'CONCERN' | 'INSUFFICIENT_INFORMATION';
  summary: string;
  concerns: string[];
  alternatives: string[];
  assumptions: string[];
  missingInformation: string[];
  provenance: 'AI_PROPOSED';
}
export interface AIProposalItem {
  id: string;
  type: 'GOAL' | 'MILESTONE' | 'ACTION' | 'MEASUREMENT';
  title: string;
  description: string;
  targetDate: string | null;
  parentItemId: string | null;
  rationale: string;
  valueType?: 'NUMBER' | 'TEXT' | 'BOOLEAN' | null;
  unit?: string | null;
  targetValue?: number | string | boolean | null;
}
export interface AIProposal {
  id: string;
  status: string;
  proposalData: { summary: string; items: AIProposalItem[]; provenance: 'AI_PROPOSED'; applicationResults?: { operation: string; success: boolean; entityId?: string; errorCode?: string }[] };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function getStoredToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}
export function saveToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(WORKSPACE_KEY);
}
export function getStoredWorkspaceId(): string | null {
  return sessionStorage.getItem(WORKSPACE_KEY);
}
export function saveWorkspaceId(workspaceId: string | null): void {
  if (workspaceId) sessionStorage.setItem(WORKSPACE_KEY, workspaceId);
  else sessionStorage.removeItem(WORKSPACE_KEY);
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getStoredToken();
  if (options.auth !== false && token)
    headers.Authorization = `Bearer ${token}`;
  const workspaceId = getStoredWorkspaceId();
  if (options.auth !== false && workspaceId) headers['X-Workspace-Id'] = workspaceId;
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers,
      ...(options.body !== undefined
        ? { body: JSON.stringify(options.body) }
        : {}),
    });
  } catch {
    throw new ApiError(
      'Could not reach FLOW-UP. Check that the backend is running.',
      'NETWORK_ERROR',
      0,
    );
  }
  const result = (await response.json()) as {
    success: boolean;
    data?: T;
    error?: { code?: string; message?: string };
  };
  if (!response.ok || !result.success) {
    const code = result.error?.code ?? 'REQUEST_FAILED';
    if (response.status === 401 && options.auth !== false) clearToken();
    throw new ApiError(
      result.error?.message ?? `Request failed (${response.status}).`,
      code,
      response.status,
    );
  }
  return result.data as T;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body ?? {} });
const patch = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PATCH', body });
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' });

export const api = {
  register: (email: string, password: string) =>
    request<{
      status: string;
      token: string | null;
      user?: UserContext;
      email?: string;
    }>('/api/auth/register', {
      method: 'POST',
      auth: false,
      body: { email, password },
    }),
  login: (email: string, password: string) =>
    request<{ user: UserContext; token: string }>('/api/auth/login', {
      method: 'POST',
      auth: false,
      body: { email, password },
    }),
  session: () => get<{ user: UserContext }>('/api/auth/session'),
  logout: () => post<{ message: string }>('/api/auth/logout'),
  initializeWorkspace: () => post<Workspace>('/api/workspaces/initialize'),
  workspaces: () => get<Workspace[]>('/api/workspaces'),
  createWorkspace: (name: string) => post<Workspace>('/api/workspaces', { name }),
  deleteWorkspace: (id: string) => del<{ deleted: boolean }>(`/api/workspaces/${encodeURIComponent(id)}`),
  currentWorkspace: () => get<Workspace>('/api/workspaces/current'),
  workspaceOverview: () =>
    get<{
      workspace: Workspace;
      projects: Project[];
      goalSummary: { independentGoalCount: number } | null;
    }>('/api/workspaces/overview'),
  projects: () => get<Project[]>('/api/projects'),
  createProject: (body: { name: string; description?: string }) =>
    post<Project>('/api/projects', body),
  project: (id: string) =>
    get<Project>(`/api/projects/${encodeURIComponent(id)}`),
  goals: (projectId?: string) =>
    get<Goal[]>(
      `/api/goals${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''}`,
    ),
  goal: (id: string) => get<Goal>(`/api/goals/${encodeURIComponent(id)}`),
  hierarchy: (projectId?: string) =>
    get<GoalNode[]>(
      `/api/goals/hierarchy${projectId ? `?projectId=${encodeURIComponent(projectId)}` : ''}`,
    ),
  createGoal: (body: {
    title: string;
    description?: string;
    targetDate?: string | null;
    projectId?: string | null;
    parentGoalId?: string | null;
  }) => post<Goal>('/api/goals', body),
  createChildGoal: (
    parentId: string,
    body: { title: string; description?: string; targetDate?: string | null },
  ) => post<Goal>(`/api/goals/${encodeURIComponent(parentId)}/children`, body),
  milestones: (goalId: string) =>
    get<Milestone[]>(`/api/goals/${encodeURIComponent(goalId)}/milestones`),
  createMilestone: (body: {
    goalId: string;
    title: string;
    description?: string;
    targetDate?: string | null;
  }) => post<Milestone>('/api/milestones', body),
  completeMilestone: (id: string) =>
    post<Milestone>(`/api/milestones/${encodeURIComponent(id)}/complete`),
  updateMilestone: (id: string, body: { title?: string; description?: string | null; targetDate?: string | null }) =>
    patch<Milestone>(`/api/milestones/${encodeURIComponent(id)}`, body),
  actions: (goalId: string) =>
    get<Action[]>(`/api/goals/${encodeURIComponent(goalId)}/actions`),
  createAction: (body: {
    goalId: string;
    milestoneId?: string | null;
    title: string;
    description?: string;
  }) => post<Action>('/api/actions', body),
  updateActionStatus: (id: string, status: ActionStatus) =>
    patch<Action>(`/api/actions/${encodeURIComponent(id)}/status`, { status }),
  updateAction: (id: string, body: { title?: string; description?: string | null }) =>
    patch<Action>(`/api/actions/${encodeURIComponent(id)}`, body),
  recordExecution: (
    id: string,
    body: {
      actualStartedAt?: string | null;
      actualCompletedAt?: string | null;
      executionNote?: string | null;
    },
  ) =>
    post<Execution>(`/api/actions/${encodeURIComponent(id)}/execution`, body),
  execution: (id: string) =>
    get<Execution | null>(`/api/actions/${encodeURIComponent(id)}/execution`),
  progress: (goalId: string) =>
    get<ProgressSummary>(`/api/progress/goals/${encodeURIComponent(goalId)}`),
  measurements: (goalId: string) =>
    get<Measurement[]>(`/api/goals/${encodeURIComponent(goalId)}/measurements`),
  createMeasurement: (body: { goalId: string; label: string; valueType: Measurement['valueType']; unit?: string | null; targetValue?: number | string | boolean | null }) =>
    post<Measurement>('/api/measurements', body),
  updateMeasurement: (id: string, body: { label?: string; unit?: string | null; targetValue?: number | string | boolean | null }) =>
    patch<Measurement>(`/api/measurements/${encodeURIComponent(id)}`, body),
  archiveMeasurement: (id: string) => del<Measurement>(`/api/measurements/${encodeURIComponent(id)}`),
  measurementHistory: (id: string) => get<MeasurementRecord[]>(`/api/measurements/${encodeURIComponent(id)}/history`),
  recordMeasurement: (id: string, body: { value: number | string | boolean; note?: string }) =>
    post<MeasurementRecord>(`/api/measurements/${encodeURIComponent(id)}/records`, body),
  understandGoal: (input: string) => post<AIClarification>('/api/ai/goal-understanding', { input }),
  assessGoalFeasibility: (input: string) => post<AIFeasibility>('/api/ai/feasibility', { input }),
  proposeGoalStructure: (input: string) => post<AIProposal>('/api/ai/goal-proposals', { input }),
  getAIProposal: (id: string) => get<AIProposal>(`/api/ai/proposals/${encodeURIComponent(id)}`),
  applyAIProposal: (id: string, selection: { selectedItemIds: string[]; editedData: unknown }) =>
    post<{ proposalId: string; status: string; operations: { operation: string; success: boolean; entityId?: string; errorCode?: string }[] }>(`/api/ai/proposals/${encodeURIComponent(id)}/apply`, { selection }),
  rejectAIProposal: (id: string) => post<AIProposal>(`/api/ai/proposals/${encodeURIComponent(id)}/reject`),
  createDailyPlan: (date: string) =>
    post<DailyPlan>('/api/planning/daily-plans', { date }),
  dailyPlan: (date: string) =>
    get<{ dailyPlan: DailyPlan; schedules: Schedule[] }>(
      `/api/planning/daily-plans/${encodeURIComponent(date)}`,
    ),
  schedules: (startDate: string, endDate: string) =>
    get<Schedule[]>(
      `/api/planning/schedules?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
    ),
  createSchedule: (body: {
    actionId: string;
    startAt: string;
    endAt: string;
    dailyPlanId?: string | null;
  }) => post<Schedule>('/api/planning/schedules', body),
  updateSchedule: (id: string, body: { startAt?: string; endAt?: string; dailyPlanId?: string | null }) =>
    patch<Schedule>(`/api/planning/schedules/${encodeURIComponent(id)}`, body),
  deleteSchedule: (id: string) =>
    del<{ deleted: boolean }>(
      `/api/planning/schedules/${encodeURIComponent(id)}`,
    ),
};
