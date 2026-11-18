import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../src/app/App';
import { PlanningCalendar } from '../src/planning/PlanningCalendar';

afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.restoreAllMocks();
});

describe('FLOW-UP application', () => {
  it('renders the sign-in screen for a new session', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: 'Welcome back' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('switches to registration without leaving the page', () => {
    render(<App />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Create an account' }),
    );
    expect(
      screen.getByRole('heading', { name: 'Create your account' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create account' }),
    ).toBeInTheDocument();
  });

  it('shows the workspace shell after restoring an authenticated session', async () => {
    sessionStorage.setItem('flow-up.access-token', 'session-token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
        const url = String(input);
        const data = url.endsWith('/api/auth/session')
          ? {
              user: {
                userId: 'user-1',
                email: 'person@example.com',
                isAuthenticated: true,
              },
            }
          : url.endsWith('/api/workspaces/overview')
            ? {
                workspace: {
                  id: 'ws-1',
                  userId: 'user-1',
                  name: 'Personal Workspace',
                  createdAt: '',
                  updatedAt: '',
                },
                projects: [],
                goalSummary: null,
              }
            : url.endsWith('/api/goals/hierarchy')
              ? []
              : [];
        return {
          ok: true,
          status: 200,
          json: async () => ({ success: true, data }),
        };
      }),
    );
    render(<App />);
    expect(
      await screen.findByRole('heading', { name: 'Your space to grow' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Personal Workspace')).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/session',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer session-token',
        }),
      }),
    );
  });

  it('loads the home completed-action count from saved actions', async () => {
    sessionStorage.setItem('flow-up.access-token', 'session-token');
    const goal = {
      id: 'goal-1', workspaceId: 'ws-1', projectId: null, parentGoalId: null,
      title: 'Learn Spanish', description: null, targetDate: null, status: 'ACTIVE',
      createdAt: '', updatedAt: '', archivedAt: null,
    };
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      const data = url.endsWith('/api/auth/session')
        ? { user: { userId: 'user-1', email: 'person@example.com', isAuthenticated: true } }
        : url.endsWith('/api/workspaces/overview')
          ? { workspace: { id: 'ws-1', userId: 'user-1', name: 'Personal Workspace', createdAt: '', updatedAt: '' }, projects: [], goalSummary: null }
          : url.endsWith('/api/goals/hierarchy') ? [{ goal, children: [] }]
            : url.endsWith('/api/goals') ? [goal]
              : url.endsWith('/api/goals/goal-1/actions') ? [
                  { id: 'action-1', status: 'COMPLETED' },
                  { id: 'action-2', status: 'TODO' },
                ]
                : [];
      return { ok: true, status: 200, json: async () => ({ success: true, data }) };
    }));

    render(<App />);
    await screen.findByRole('heading', { name: 'Your space to grow' });
    const label = (await screen.findAllByText('COMPLETED ACTIONS'))[0];
    expect(label.parentElement).toHaveTextContent('1');
    expect(fetch).toHaveBeenCalledWith(
      '/api/goals/goal-1/actions', expect.objectContaining({ method: 'GET' }),
    );
  });

  it('creates a measurement and records a value inside its Goal', async () => {
    sessionStorage.setItem('flow-up.access-token', 'session-token');
    const goal = {
      id: 'goal-measure', workspaceId: 'ws-1', projectId: null, parentGoalId: null,
      title: 'Build a running habit', description: null, targetDate: null, status: 'ACTIVE',
      createdAt: '', updatedAt: '', archivedAt: null,
    };
    let measurement: Record<string, unknown> | null = null;
    const records: Record<string, unknown>[] = [];
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? 'GET';
      let data: unknown = [];
      if (url.endsWith('/api/auth/session')) data = { user: { userId: 'user-1', email: 'person@example.com', isAuthenticated: true } };
      else if (url.endsWith('/api/workspaces/overview')) data = { workspace: { id: 'ws-1', userId: 'user-1', name: 'Personal Workspace', createdAt: '', updatedAt: '' }, projects: [], goalSummary: null };
      else if (url.endsWith('/api/goals/hierarchy')) data = [{ goal, children: [] }];
      else if (url.endsWith('/api/goals')) data = [goal];
      else if (url.endsWith('/api/progress/goals/goal-measure')) data = { goalId: goal.id, calculationStatus: 'RULE_NOT_CONFIGURED', goalProgress: { goalId: goal.id, progressValue: null, calculationStatus: 'RULE_NOT_CONFIGURED' }, actionCompletion: null, measurementProgress: [], childGoalProgress: [] };
      else if (url.endsWith('/api/goals/goal-measure/measurements')) data = measurement ? [measurement] : [];
      else if (url.endsWith('/history')) data = [...records];
      else if (url === '/api/measurements' && method === 'POST') {
        const body = JSON.parse(String(init?.body));
        measurement = { id: 'measurement-1', goalId: goal.id, label: body.label, description: null, valueType: body.valueType, unit: body.unit, targetValue: body.targetValue, createdAt: '', updatedAt: '', archivedAt: null };
        data = measurement;
      } else if (url.endsWith('/records') && method === 'POST') {
        const body = JSON.parse(String(init?.body));
        const record = { id: 'record-1', measurementId: 'measurement-1', value: body.value, recordedAt: '2026-11-18T10:00:00.000Z', createdAt: '', note: null };
        records.unshift(record);
        data = record;
      }
      return { ok: true, status: 200, json: async () => ({ success: true, data }) };
    }));

    render(<App />);
    await screen.findByRole('heading', { name: 'Your space to grow' });
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', { name: /Goals/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Build a running habit/ }));
    fireEvent.click(await screen.findByRole('button', { name: '+ Add' }));
    fireEvent.change(screen.getByLabelText('What will you measure?'), { target: { value: 'Runs per week' } });
    fireEvent.change(screen.getByLabelText('Unit (optional)'), { target: { value: 'runs' } });
    fireEvent.change(screen.getByLabelText('Target (optional)'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save measurement' }));
    await screen.findByText('Runs per week');
    fireEvent.change(screen.getByLabelText('Record value'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Record' }));
    expect(await screen.findByText('2 runs')).toBeInTheDocument();
  });

  it('opens an evidence-based Goal review with separate outcome and action progress', async () => {
    sessionStorage.setItem('flow-up.access-token', 'session-token');
    const goal = {
      id: 'goal-review', workspaceId: 'ws-1', projectId: null, parentGoalId: null,
      title: 'Run a 5K', description: null, targetDate: null, status: 'ACTIVE',
      createdAt: '', updatedAt: '', archivedAt: null,
    };
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      const data = url.endsWith('/api/auth/session')
        ? { user: { userId: 'user-1', email: 'person@example.com', isAuthenticated: true } }
        : url.endsWith('/api/workspaces/overview')
          ? { workspace: { id: 'ws-1', userId: 'user-1', name: 'Personal Workspace', createdAt: '', updatedAt: '' }, projects: [], goalSummary: null }
          : url.endsWith('/api/goals/hierarchy') ? [{ goal, children: [] }]
            : url.endsWith('/api/goals') ? [goal]
              : url.endsWith('/api/progress/goals/goal-review') ? { goalId: goal.id, goalProgress: { goalId: goal.id, progressValue: null, calculationStatus: 'RULE_NOT_CONFIGURED' }, actionCompletion: { totalActions: 2, completedActions: 1, incompleteActions: 1, completionValue: 50, calculationStatus: 'CALCULATED' }, measurementProgress: [], childGoalProgress: [] }
                : url.endsWith('/api/goals/goal-review/actions') ? [{ id: 'action-review', goalId: goal.id, title: 'Complete first run', status: 'COMPLETED', archivedAt: null }]
                  : url.endsWith('/api/goals/goal-review/measurements') ? [{ id: 'measurement-review', goalId: goal.id, label: 'Distance', valueType: 'NUMBER', unit: 'km', targetValue: 5, archivedAt: null }]
                    : url.endsWith('/api/actions/action-review/execution') ? { actionId: 'action-review', actualCompletedAt: '2026-11-17T09:00:00Z', executionNote: 'Ran in the park' }
                      : url.endsWith('/api/measurements/measurement-review/history') ? [{ id: 'record-review', measurementId: 'measurement-review', value: 2.5, recordedAt: '2026-11-17T09:00:00Z', note: null }]
                        : [];
      return { ok: true, status: 200, json: async () => ({ success: true, data }) };
    }));

    render(<App />);
    await screen.findByRole('heading', { name: 'Your space to grow' });
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', { name: /Review/ }));
    expect(await screen.findByRole('heading', { name: 'Run a 5K' })).toBeInTheDocument();
    expect(screen.getByText('Not configured')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
    expect(await screen.findByText('Ran in the park')).toBeInTheDocument();
    expect(await screen.findByText('2.5 km')).toBeInTheDocument();
  });

  it('loads scheduled work, moves a session, and schedules an open Action from the calendar', async () => {
    const goals = [{ id: 'goal-calendar', title: 'Build a running habit' }] as never[];
    const actions = [
      { id: 'action-scheduled', goalId: 'goal-calendar', milestoneId: null, title: 'Morning run', description: null, status: 'IN_PROGRESS', archivedAt: null },
      { id: 'action-open', goalId: 'goal-calendar', milestoneId: null, title: 'Prepare running shoes', description: null, status: 'TODO', archivedAt: null },
    ] as never[];
    let records = [{ id: 'schedule-1', actionId: 'action-scheduled', dailyPlanId: 'plan-1', startAt: '2026-11-18T09:00:00.000Z', endAt: '2026-11-18T10:00:00.000Z' }];
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? 'GET';
      let data: unknown = records;
      if (url.startsWith('/api/planning/schedules?')) data = records;
      else if (url === '/api/planning/schedules/schedule-1' && method === 'PATCH') {
        const body = JSON.parse(String(init?.body));
        records = records.map((item) => item.id === 'schedule-1' ? { ...item, ...body } : item);
        data = records[0];
      } else if (url === '/api/planning/schedules' && method === 'POST') {
        const body = JSON.parse(String(init?.body));
        const created = { id: 'schedule-2', ...body };
        records = [...records, created]; data = created;
      }
      return { ok: true, status: 200, json: async () => ({ success: true, data }) };
    }));
    render(<PlanningCalendar actions={actions} goals={goals} actionsLoaded actionsLoadError={false} initialDate="2026-11-18" onRefreshActions={vi.fn()} onOpenGoal={vi.fn()} onLogExecution={vi.fn()} />);

    await waitFor(() => expect(screen.queryByText('Loading schedules…')).not.toBeInTheDocument());
    expect(await screen.findByText('Morning run')).toBeInTheDocument();
    expect(screen.getByText('Prepare running shoes')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Month' }));
    expect(await screen.findByRole('heading', { name: 'November 2026' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open Wednesday, November 18' }));
    expect(await screen.findByRole('heading', { name: 'Wednesday, November 18, 2026' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Day' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Edit time' }));
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2026-11-19' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save time' }));
    await screen.findByText('Thursday, November 19, 2026');
    expect(fetch).toHaveBeenCalledWith('/api/planning/schedules/schedule-1', expect.objectContaining({ method: 'PATCH', body: expect.stringContaining('"dailyPlanId":null') }));

    fireEvent.click(screen.getByRole('button', { name: 'Schedule' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add to calendar' }));
    await screen.findByText('2 scheduled');
    expect(fetch).toHaveBeenCalledWith('/api/planning/schedules', expect.objectContaining({ method: 'POST', body: expect.stringContaining('"actionId":"action-open"') }));
  });

  it('runs the structured goal discovery path and displays proposal items separately', async () => {
    sessionStorage.setItem('flow-up.access-token', 'session-token');
    const proposal = {
      id: 'proposal-1', status: 'PENDING_REVIEW',
      proposalData: { summary: 'A manageable first plan', provenance: 'AI_PROPOSED', items: [
        { id: 'goal-1', type: 'GOAL', title: 'Learn Spanish', description: '', targetDate: null, parentItemId: null, rationale: 'Outcome' },
      ] },
    };
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
      const url = String(input);
      const data = url.endsWith('/api/auth/session')
        ? { user: { userId: 'user-1', email: 'person@example.com', isAuthenticated: true } }
        : url.endsWith('/api/workspaces/overview')
          ? { workspace: { id: 'ws-1', userId: 'user-1', name: 'Personal Workspace', createdAt: '', updatedAt: '' }, projects: [], goalSummary: null }
          : url.endsWith('/api/goals/hierarchy') ? []
            : url.endsWith('/api/ai/goal-understanding')
              ? { outcome: 'Learn conversational Spanish', successCriteria: [], knownFacts: ['You want to learn Spanish'], assumptions: [], missingInformation: ['Available time'], questions: [], provenance: 'NEEDS_CONFIRMATION' }
              : url.endsWith('/api/ai/feasibility')
                ? { assessment: 'INSUFFICIENT_INFORMATION', summary: 'Time available is unknown.', concerns: [], alternatives: [], assumptions: [], missingInformation: ['Available time'], provenance: 'AI_PROPOSED' }
                : url.endsWith('/api/ai/goal-proposals') ? proposal : [];
      return { ok: true, status: 200, json: async () => ({ success: true, data }) };
    }));
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: /Goal discovery/ }));
    fireEvent.change(screen.getByLabelText('Your goal and any useful context'), { target: { value: 'I want to learn Spanish.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Understand my goal' }));
    expect(await screen.findByRole('heading', { name: 'Learn conversational Spanish' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Review feasibility' }));
    expect(await screen.findByText('Time available is unknown.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Build a goal structure proposal' }));
    expect(await screen.findByRole('heading', { name: 'Review the suggested structure' })).toBeInTheDocument();
    expect(screen.getByText('AI PROPOSAL · NOT SAVED')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Learn Spanish')).toBeInTheDocument();
  });
});
