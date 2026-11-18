import { DashboardHome } from './DashboardHome';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import {
  api,
  ApiError,
  clearToken,
  getStoredToken,
  getStoredWorkspaceId,
  saveToken,
  saveWorkspaceId,
  type Action,
  type ActionStatus,
  type AIClarification,
  type AIFeasibility,
  type AIProposal,
  type AIProposalItem,
  type Execution,
  type Goal,
  type GoalNode,
  type Milestone,
  type Measurement,
  type MeasurementRecord,
  type Project,
  type ProgressSummary,
  type Schedule,
  type UserContext,
  type Workspace,
} from '../lib/api';
import '../assistant.css';
import '../measurement.css';
import './workspace-manager.css';
import { GoalWorkspace } from '../goals/GoalWorkspace';
import { PlanningCalendar } from '../planning/PlanningCalendar';

type Page = 'workspaces' | 'home' | 'projects' | 'goals' | 'planning' | 'review' | 'assistant';
type Notice = { kind: 'success' | 'error'; text: string } | null;
function messageOf(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Something went wrong. Please try again.';
}
function dateLabel(value?: string | null): string {
  return value
    ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'No target date';
}
function today(): string {
  return new Date().toISOString().slice(0, 10);
}
function localDateTimeInput(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function initials(value?: string | null): string {
  return (value?.split('@')[0] ?? 'U').slice(0, 2).toUpperCase();
}

function Button({
  children,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'quiet' | 'danger';
}) {
  return (
    <button
      className={`button button--${variant} ${props.className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}

function TextArea({
  label,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={3} {...props} />
    </label>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal__header">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="loading">
      <span className="spinner" />
      {label}
    </div>
  );
}

function AuthScreen({
  onAuthenticated,
  notify,
}: {
  onAuthenticated: (user: UserContext) => void;
  notify: (notice: Notice) => void;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    setConfirmation('');
    if (
      !email.trim() ||
      !/^\S+@\S+\.\S+$/.test(email.trim()) ||
      !password.trim()
    ) {
      notify({ kind: 'error', text: 'Enter a valid email and password.' });
      return;
    }
    setBusy(true);
    try {
      if (mode === 'login') {
        const result = await api.login(email.trim(), password);
        saveToken(result.token);
        onAuthenticated(result.user);
      } else {
        const result = await api.register(email.trim(), password);
        if (!result.token) {
          setConfirmation(
            'Check your email to confirm your account, then sign in.',
          );
          return;
        }
        saveToken(result.token);
        const session = await api.session();
        onAuthenticated(session.user);
      }
    } catch (error) {
      notify({ kind: 'error', text: messageOf(error) });
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <div className="auth-art">
        <div className="brand brand--large">
          <span className="brand__mark">f</span>
          <span>flow-up</span>
        </div>
        <div className="auth-art__copy">
          <span className="eyebrow">MAKE ROOM FOR WHAT MATTERS</span>
          <h1>
            Small steps.
            <br />
            <em>Meaningful</em> progress.
          </h1>
          <p>Bring your goals, plans, and daily actions into one calm place.</p>
        </div>
        <div className="auth-art__orbit auth-art__orbit--one" />
        <div className="auth-art__orbit auth-art__orbit--two" />
        <span className="auth-art__spark">✳</span>
      </div>
      <section className="auth-panel">
        <div className="auth-panel__inner">
          <span className="eyebrow">YOUR PERSONAL WORKSPACE</span>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="muted">
            {mode === 'login'
              ? 'Sign in to continue your momentum.'
              : 'Start turning your intentions into progress.'}
          </p>
          <form onSubmit={submit} className="form-stack">
            <Field
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Field
              label="Password"
              type="password"
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {confirmation && <p className="inline-success">{confirmation}</p>}
            <Button disabled={busy}>
              {busy
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}
            </Button>
          </form>
          <p className="auth-switch">
            {mode === 'login' ? 'New to FLOW-UP?' : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setConfirmation('');
              }}
            >
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </p>
          <p className="auth-footnote">
            Your session stays in this browser tab and is cleared when you sign
            out.
          </p>
        </div>
      </section>
    </main>
  );
}

function Sidebar({
  page,
  setPage,
  user,
  workspace,
  onLogout,
  mobileOpen,
  closeMobile,
  onManageWorkspaces,
}: {
  page: Page;
  setPage: (page: Page) => void;
  user: UserContext;
  workspace: Workspace | null;
  onLogout: () => void;
  mobileOpen: boolean;
  closeMobile: () => void;
  onManageWorkspaces: () => void;
}) {
  const items: { id: Page; label: string; icon: string }[] = [
    { id: 'assistant', label: 'Goal discovery', icon: 'AI' },
    { id: 'home', label: 'Overview', icon: '◫' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'goals', label: 'Goals', icon: '◎' },
    { id: 'review', label: 'Review', icon: '↗' },
    { id: 'planning', label: 'Planning', icon: '▤' },
  ];
  return (
    <>
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="brand">
          <span className="brand__mark">f</span>
          <span>flow-up</span>
        </div>
        <button
          type="button"
          className="workspace-switch"
          aria-label="Manage workspaces"
          title="Back to workspace manager"
          onClick={() => {
            onManageWorkspaces();
            closeMobile();
          }}
        >
          <span className="workspace-switch__icon">⌂</span>
          <span>
            <small>WORKSPACE · MANAGE</small>
            <strong>{workspace?.name ?? 'Your workspace'}</strong>
          </span>
          <span className="workspace-switch__chevron">⌄</span>
        </button>
        <nav className="nav-list" aria-label="Main navigation">
          <span className="nav-label">MENU</span>
          {items.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'nav-item--active' : ''}`}
              onClick={() => {
                setPage(item.id);
                closeMobile();
              }}
            >
              <span className="nav-item__icon">{item.icon}</span>
              {item.label}
              {page === item.id && <span className="nav-item__active-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar__bottom">
          <div className="sidebar-tip">
            <span>✦</span>
            <strong>Keep going</strong>
            <p>Progress grows from the steps you take each day.</p>
          </div>
          <button className="profile-button" onClick={onLogout}>
            <span className="avatar">{initials(user.email)}</span>
            <span className="profile-button__info">
              <strong>{user.email ?? 'Your account'}</strong>
              <small>Personal account</small>
            </span>
            <span className="profile-button__menu">↗</span>
          </button>
        </div>
      </aside>
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="mobile-scrim"
          onClick={closeMobile}
        />
      )}
    </>
  );
}


function GoalAssistantPage({
  onApplied,
  onManual,
}: {
  onApplied: () => Promise<void>;
  onManual: () => void;
}) {
  const [input, setInput] = useState(() => sessionStorage.getItem('flow-up.goal-discovery.input') ?? '');
  const [understanding, setUnderstanding] = useState<AIClarification | null>(null);
  const [feasibility, setFeasibility] = useState<AIFeasibility | null>(null);
  const [proposal, setProposal] = useState<AIProposal | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try { return JSON.parse(sessionStorage.getItem('flow-up.goal-discovery.answers') ?? '{}') as Record<string, string>; }
    catch { return {}; }
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const requestInFlight = useRef(false);

  useEffect(() => {
    if (input) sessionStorage.setItem('flow-up.goal-discovery.input', input);
    else sessionStorage.removeItem('flow-up.goal-discovery.input');
  }, [input]);
  useEffect(() => {
    sessionStorage.setItem('flow-up.goal-discovery.answers', JSON.stringify(answers));
  }, [answers]);

  function workflowInput(): string {
    const replies = understanding?.questions
      .filter((question) => answers[question.id]?.trim())
      .map((question) => `${question.prompt}: ${answers[question.id]}`) ?? [];
    return replies.length ? `${input}\n\nClarification answers:\n${replies.join('\n')}` : input;
  }

  useEffect(() => {
    const proposalId = sessionStorage.getItem('flow-up.current-ai-proposal');
    if (!proposalId) return;
    let active = true;
    api.getAIProposal(proposalId).then((saved) => {
      if (!active || !['PENDING_REVIEW', 'EDITED', 'PARTIALLY_APPROVED', 'FAILED'].includes(saved.status)) return;
      setProposal(saved);
      setSelected(saved.proposalData.items.filter((item) => !saved.proposalData.applicationResults?.some((entry) => entry.operation === item.id && entry.success)).map((item) => item.id));
    }).catch(() => sessionStorage.removeItem('flow-up.current-ai-proposal'));
    return () => { active = false; };
  }, []);

  async function run<T>(label: string, action: () => Promise<T>, done: (value: T) => void) {
    if (requestInFlight.current) return;
    if (!input.trim()) { setError('Describe the outcome you want to work toward.'); return; }
    requestInFlight.current = true;
    setError(''); setResult(''); setBusy(label);
    try { done(await action()); }
    catch (reason) { setError(messageOf(reason)); }
    finally { requestInFlight.current = false; setBusy(''); }
  }

  function updateProposalItem(itemId: string, change: Partial<AIProposalItem>) {
    if (!proposal) return;
    setProposal({ ...proposal, proposalData: { ...proposal.proposalData,
      items: proposal.proposalData.items.map((item) => item.id === itemId ? { ...item, ...change } : item),
    } });
  }

  async function apply() {
    if (requestInFlight.current || !proposal || !selected.length) return;
    requestInFlight.current = true;
    setBusy('apply'); setError(''); setResult('');
    try {
      const response = await api.applyAIProposal(proposal.id, {
        selectedItemIds: selected,
        editedData: proposal.proposalData,
      });
      const latest = await api.getAIProposal(proposal.id);
      setProposal(latest);
      const succeeded = response.operations.filter((operation) => operation.success).map((operation) => operation.operation);
      const failed = response.operations.filter((operation) => !operation.success).map((operation) => operation.operation);
      if (response.status === 'APPLIED') {
        sessionStorage.removeItem('flow-up.current-ai-proposal');
        sessionStorage.removeItem('flow-up.goal-discovery.input');
        sessionStorage.removeItem('flow-up.goal-discovery.answers');
        setInput('');
        setAnswers({});
        await onApplied();
      }
      else {
        setSelected(latest.proposalData.items.filter((item) => !latest.proposalData.applicationResults?.some((entry) => entry.operation === item.id && entry.success)).map((item) => item.id));
        setResult(`${succeeded.length} item(s) were saved. ${failed.length} item(s) need attention. Successfully saved items are locked against duplicate application.`);
      }
    } catch (reason) { setError(messageOf(reason)); }
    finally { requestInFlight.current = false; setBusy(''); }
  }

  async function reject() {
    if (requestInFlight.current || !proposal) return;
    requestInFlight.current = true;
    setBusy('reject'); setError('');
    try { await api.rejectAIProposal(proposal.id); setProposal(null); sessionStorage.removeItem('flow-up.current-ai-proposal'); setResult('Proposal rejected. Nothing was added to your goals.'); }
    catch (reason) { setError(messageOf(reason)); }
    finally { requestInFlight.current = false; setBusy(''); }
  }

  return (
    <div className="assistant-layout">
      <section className="panel assistant-panel">
        <div className="panel__heading">
          <div><span className="eyebrow">AI-GUIDED, USER-CONTROLLED</span><h2>What would you like to achieve?</h2></div>
        </div>
        <div className="muted">
          <p>When you request AI help, your text is sent to Google Gemini. Free-tier content may be used to improve Google products.</p>
          <details>
            <summary>Privacy details</summary>
            <p>Share only information you are comfortable sending to Google. Avoid sensitive personal information.</p>
          </details>
        </div>
        <TextArea label="Your goal and any useful context" value={input} maxLength={4000}
          placeholder="For example: I want to improve my health and have more energy, but I am not sure where to start."
          onChange={(event) => setInput(event.target.value)} />
        <div className="heading-actions">
          <Button disabled={!!busy || !input.trim()} onClick={() => void run('understand', () => api.understandGoal(input), (value) => { setAnswers({}); setUnderstanding(value); })}>
            {busy === 'understand' ? 'Understanding…' : 'Understand my goal'}
          </Button>
          <Button variant="secondary" onClick={onManual}>Create a goal manually</Button>
        </div>
        {error && <p className="inline-error" role="alert">{error} You can continue manually.</p>}
        {result && <p className="inline-success" role="status">{result}</p>}
      </section>

      {understanding && (
        <section className="panel assistant-panel">
          <span className="eyebrow">AI INTERPRETATION · NEEDS YOUR CONFIRMATION</span>
          <h2>{understanding.outcome}</h2>
          {understanding.knownFacts.length > 0 && <div><h3>Details I found in your description</h3><ul>{understanding.knownFacts.map((fact, i) => <li key={i}>{fact}</li>)}</ul></div>}
          {understanding.successCriteria.length > 0 && <div><h3>Possible signs of success</h3><ul>{understanding.successCriteria.map((fact, i) => <li key={i}>{fact}</li>)}</ul></div>}
          {understanding.assumptions.length > 0 && <div><h3>Assumptions to check</h3><ul>{understanding.assumptions.map((fact, i) => <li key={i}>{fact}</li>)}</ul></div>}
          {understanding.questions.length > 0 && <div><h3>Questions that may change the plan</h3><div>{understanding.questions.map((question) => <label className="field" key={question.id}><span>{question.prompt}{question.required ? ' · required' : ' · optional'}</span>{question.answerType === 'CHOICE' ? <select aria-label={question.prompt} value={answers[question.id] ?? ''} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}><option value="">Skip for now</option>{question.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input aria-label={question.prompt} type={question.answerType === 'DATE' ? 'date' : question.answerType === 'NUMBER' ? 'number' : 'text'} value={answers[question.id] ?? ''} onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })} /> }<small>{question.why}</small></label>)}</div></div>}
          {understanding.missingInformation.length > 0 && <p className="muted">Still unknown: {understanding.missingInformation.join(' · ')}</p>}
          <Button disabled={!!busy || understanding.questions.some((question) => question.required && !answers[question.id]?.trim())} onClick={() => void run('feasibility', () => api.assessGoalFeasibility(workflowInput()), setFeasibility)}>
            {busy === 'feasibility' ? 'Checking…' : 'Review feasibility'}
          </Button>
        </section>
      )}

      {feasibility && (
        <section className="panel assistant-panel">
          <span className="eyebrow">FEASIBILITY · AI PROPOSAL</span>
          <h2>{feasibility.assessment.replaceAll('_', ' ').toLowerCase()}</h2>
          <p>{feasibility.summary}</p>
          {feasibility.concerns.length > 0 && <div><h3>Things to consider</h3><ul>{feasibility.concerns.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {feasibility.alternatives.length > 0 && <div><h3>Possible alternatives</h3><ul>{feasibility.alternatives.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
          {feasibility.assumptions.length > 0 && <p className="muted">Assumptions: {feasibility.assumptions.join(' · ')}</p>}
          <Button disabled={!!busy} onClick={() => void run('proposal', async () => {
            const next = await api.proposeGoalStructure(workflowInput());
            sessionStorage.setItem('flow-up.current-ai-proposal', next.id);
            setSelected(next.proposalData.items.map((item) => item.id));
            return next;
          }, setProposal)}>{busy === 'proposal' ? 'Preparing proposal…' : 'Build a goal structure proposal'}</Button>
        </section>
      )}

      {proposal && (
        <section className="panel assistant-panel">
          <span className="eyebrow">AI PROPOSAL · NOT SAVED</span>
          <h2>Review the suggested structure</h2>
          <p>{proposal.proposalData.summary}</p>
          <p className="muted">Edit titles, choose items, or reject the proposal. Selected items are added only after you approve.</p>
          <div className="assistant-proposal-list">
            {proposal.proposalData.items.map((item) => {
              const applied = proposal.proposalData.applicationResults?.some((entry) => entry.operation === item.id && entry.success);
              return <label className="assistant-proposal-item" key={item.id}>
                <input type="checkbox" checked={selected.includes(item.id)} disabled={!!busy || applied}
                  onChange={(event) => setSelected(event.target.checked ? [...selected, item.id] : selected.filter((id) => id !== item.id))} />
                <span className="assistant-proposal-item__body">
                  <span className="eyebrow">{item.type}{item.type === 'MEASUREMENT' ? ` · ${item.valueType ?? 'type needed'}${item.targetValue !== undefined && item.targetValue !== null ? ` · target ${item.targetValue}${item.unit ? ` ${item.unit}` : ''}` : ''}` : ''}{item.targetDate ? ` · ${item.targetDate}` : ''}{applied ? ' · SAVED' : ''}</span>
                  <input aria-label={`Edit ${item.type.toLowerCase()} title`} value={item.title} disabled={!!busy || applied}
                    onChange={(event) => updateProposalItem(item.id, { title: event.target.value })} />
                  <small>{item.parentItemId ? `Under: ${proposal.proposalData.items.find((parent) => parent.id === item.parentItemId)?.title ?? 'parent item'} · ` : 'Root outcome · '}{item.description || item.rationale}</small>
                </span>
              </label>;
            })}
          </div>
          <div className="heading-actions">
            <Button disabled={!!busy || !selected.length} onClick={() => void apply()}>{busy === 'apply' ? 'Applying…' : proposal.status === 'PARTIALLY_APPROVED' ? 'Apply selected remaining items' : 'Approve selected items'}</Button>
            <Button variant="secondary" disabled={!!busy} onClick={() => void reject()}>{busy === 'reject' ? 'Rejecting…' : 'Reject proposal'}</Button>
          </div>
        </section>
      )}
    </div>
  );
}

function GoalReviewPage({ goals, initialGoalId }: { goals: Goal[]; initialGoalId: string | null }) {
  const [goalId, setGoalId] = useState(initialGoalId ?? goals[0]?.id ?? '');
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<{
    progress: ProgressSummary;
    actions: Action[];
    executions: Record<string, Execution | null>;
    measurements: { measurement: Measurement; history: MeasurementRecord[] }[];
    schedules: Schedule[];
  } | null>(null);

  useEffect(() => {
    if (!goalId && goals.length) setGoalId(initialGoalId ?? goals[0].id);
  }, [goalId, goals, initialGoalId]);

  useEffect(() => {
    if (!goalId) { setData(null); return; }
    let active = true;
    setLoading(true);
    setError('');
    const end = new Date();
    const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dateOnly = (date: Date) => date.toISOString().slice(0, 10);
    Promise.all([
      api.progress(goalId),
      api.actions(goalId),
      api.measurements(goalId),
      api.schedules(dateOnly(start), dateOnly(end)),
    ]).then(async ([progress, actions, measurements, schedules]) => {
      const [executionEntries, measurementEntries] = await Promise.all([
        Promise.all(actions.filter((action) => !action.archivedAt).map(async (action) => [action.id, await api.execution(action.id)] as const)),
        Promise.all(measurements.filter((measurement) => !measurement.archivedAt).map(async (measurement) => [measurement, await api.measurementHistory(measurement.id)] as const)),
      ]);
      if (!active) return;
      setData({ progress, actions: actions.filter((action) => !action.archivedAt), executions: Object.fromEntries(executionEntries),
        measurements: measurementEntries.map(([measurement, history]) => ({ measurement, history })), schedules });
    }).catch((reason: unknown) => {
      if (active) { setData(null); setError(messageOf(reason)); }
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [goalId, refresh]);

  const selectedGoal = goals.find((goal) => goal.id === goalId);
  return <div className="review-page">
    <div className="review-page__toolbar">
      <label className="field"><span>Goal</span><select aria-label="Review Goal" value={goalId} onChange={(event) => setGoalId(event.target.value)}>
        {goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.title}</option>)}
      </select></label>
      <Button variant="secondary" type="button" disabled={loading || !goalId} onClick={() => setRefresh((value) => value + 1)}>{loading ? 'Updating…' : 'Refresh evidence'}</Button>
    </div>
    {!goals.length ? <section className="panel"><h2>No Goals to review</h2><p>Create a Goal to see its execution and measurement evidence here.</p></section>
      : error ? <section className="panel inline-error" role="alert">Review evidence could not be loaded: {error}</section>
      : loading && !data ? <section className="panel"><p>Loading saved evidence…</p></section>
      : data && <>
        <section className="panel review-page__intro">
          <span className="eyebrow">GOAL REVIEW · LAST 30 DAYS</span>
          <h2>{selectedGoal?.title ?? 'Goal review'}</h2>
          <p>Review recorded work and measurements. Outcome progress appears only when a calculation rule is configured.</p>
        </section>
        <div className="review-page__summary">
          <article className="panel review-stat"><span>OUTCOME PROGRESS</span><strong>{data.progress.goalProgress.progressValue == null ? 'Not configured' : `${Math.round(data.progress.goalProgress.progressValue)}%`}</strong><small>{data.progress.goalProgress.calculationStatus.replaceAll('_', ' ').toLowerCase()}</small></article>
          <article className="panel review-stat"><span>ACTIONS COMPLETE</span><strong>{data.progress.actionCompletion?.totalActions ? `${data.progress.actionCompletion.completedActions} / ${data.progress.actionCompletion.totalActions}` : 'No active Actions'}</strong><small>Completed work, separate from Goal outcome</small></article>
          <article className="panel review-stat"><span>MEASUREMENTS WITH VALUES</span><strong>{data.measurements.filter((entry) => entry.history.length > 0).length} / {data.measurements.length}</strong><small>Saved records for this Goal</small></article>
        </div>
        <section className="panel review-section">
          <div className="panel__heading"><h2>Planned and completed work</h2><span>{data.schedules.length} scheduled sessions in the period</span></div>
          {data.actions.length ? <ul className="review-list">{data.actions.map((action) => {
            const execution = data.executions[action.id];
            const scheduled = data.schedules.filter((schedule) => schedule.actionId === action.id);
            return <li key={action.id}><span className={`review-list__mark ${action.status === 'COMPLETED' ? 'review-list__mark--done' : ''}`}>{action.status === 'COMPLETED' ? '✓' : '·'}</span>
              <div><strong>{action.title}</strong><small>{action.status.replaceAll('_', ' ').toLowerCase()}{scheduled.length ? ` · ${scheduled.length} planned session${scheduled.length === 1 ? '' : 's'}` : ''}</small>
                {execution?.executionNote && <p>{execution.executionNote}</p>}
                {execution?.actualCompletedAt && <small>Completed {dateLabel(execution.actualCompletedAt)}</small>}
              </div></li>;
          })}</ul> : <p className="empty-line">No Actions recorded for this Goal yet.</p>}
        </section>
        <section className="panel review-section">
          <div className="panel__heading"><h2>Measurement history</h2><span>Recorded values, newest first</span></div>
          {data.measurements.length ? data.measurements.map(({ measurement, history }) => <article className="review-measurement" key={measurement.id}>
            <div><strong>{measurement.label}</strong><small>{measurement.targetValue === null ? 'No target' : `Target ${measurement.targetValue}${measurement.unit ? ` ${measurement.unit}` : ''}`}</small></div>
            {history.length ? <ol>{history.slice(0, 5).map((record) => <li key={record.id}><strong>{record.value}{measurement.unit ? ` ${measurement.unit}` : ''}</strong><time>{dateLabel(record.recordedAt)}</time>{record.note && <small>{record.note}</small>}</li>)}</ol> : <p className="empty-line">No values recorded.</p>}
          </article>) : <p className="empty-line">No Measurements for this Goal yet.</p>}
        </section>
      </>}
  </div>;
}

export function App() {
  const [user, setUser] = useState<UserContext | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [workspaceBusy, setWorkspaceBusy] = useState(false);
  const [baseDataLoaded, setBaseDataLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [hierarchy, setHierarchy] = useState<GoalNode[]>([]);
  const [page, setPage] = useState<Page>('workspaces');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [editingMilestone, setEditingMilestone] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<string | null>(null);
  const [availableActions, setAvailableActions] = useState<Action[]>([]);
  const [actionsLoaded, setActionsLoaded] = useState(false);
  const [actionsLoadError, setActionsLoadError] = useState(false);
  const [actionRefresh, setActionRefresh] = useState(0);
  const [upcomingSchedules, setUpcomingSchedules] = useState<Schedule[]>([]);
  const [schedulesLoaded, setSchedulesLoaded] = useState(false);
  const [schedulesLoadError, setSchedulesLoadError] = useState(false);
  const [scheduleRefresh, setScheduleRefresh] = useState(0);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [measurementLoadState, setMeasurementLoadState] = useState<'LOADING' | 'READY' | 'ERROR'>('LOADING');
  const [measurementRefresh, setMeasurementRefresh] = useState(0);
  const [measurementHistory, setMeasurementHistory] = useState<Record<string, MeasurementRecord[]>>({});
  const [measurementFormOpen, setMeasurementFormOpen] = useState(false);
  const [measurementLabel, setMeasurementLabel] = useState('');
  const [measurementType, setMeasurementType] = useState<Measurement['valueType']>('NUMBER');
  const [measurementUnit, setMeasurementUnit] = useState('');
  const [measurementTarget, setMeasurementTarget] = useState('');
  const [measurementValues, setMeasurementValues] = useState<Record<string, string>>({});
  const [editingMeasurement, setEditingMeasurement] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const [busy, setBusy] = useState(false);
  const [booting, setBooting] = useState(Boolean(getStoredToken()));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modal, setModal] = useState<
    'project' | 'goal' | 'child' | 'milestone' | 'action' | 'execution' | null
  >(null);
  const [executionAction, setExecutionAction] = useState<Action | null>(null);
  const [executionData, setExecutionData] = useState<Execution | null>(null);
  const [planningDate] = useState(today());

  const notify = useCallback((next: Notice) => {
    setNotice(next);
    if (next) window.setTimeout(() => setNotice(null), 4800);
  }, []);
  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 401) {
        clearToken();
        setUser(null);
        setWorkspace(null);
      }
      notify({ kind: 'error', text: messageOf(error) });
    },
    [notify],
  );

  const loadBase = useCallback(async () => {
    setBaseDataLoaded(false);
    let overview: Awaited<ReturnType<typeof api.workspaceOverview>>;
    try {
      overview = await api.workspaceOverview();
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setWorkspace(null);
        setProjects([]);
        setGoals([]);
        setHierarchy([]);
        return null;
      }
      throw error;
    }
    setWorkspace(overview.workspace);
    setProjects(overview.projects);
    const [nextGoals, nextHierarchy] = await Promise.all([
      api.goals(),
      api.hierarchy(),
    ]);
    setGoals(nextGoals);
    setHierarchy(nextHierarchy);
    setBaseDataLoaded(true);
    setSelectedProject((current) =>
      current
        ? (overview.projects.find((item) => item.id === current.id) ?? null)
        : null,
    );
    setSelectedGoal((current) =>
      current
        ? (nextGoals.find((item) => item.id === current.id) ?? null)
        : null,
    );
    return overview;
  }, []);

  const refreshWorkspaces = useCallback(async () => {
    const result = await api.workspaces();
    setWorkspaces(result);
    return result;
  }, []);

  const openWorkspace = useCallback(async (selected: Workspace) => {
    saveWorkspaceId(selected.id);
    setWorkspace(selected);
    setActionRefresh((value) => value + 1);
    setScheduleRefresh((value) => value + 1);
    setSelectedProject(null);
    setSelectedGoal(null);
    setWorkspaceBusy(true);
    try {
      await loadBase();
      setPage('home');
    } catch (error) {
      handleError(error);
    } finally {
      setWorkspaceBusy(false);
    }
  }, [handleError, loadBase]);

  useEffect(() => {
    if (!getStoredToken()) return;
    let active = true;
    (async () => {
      try {
        const result = await api.session();
        if (!active) return;
        setUser(result.user);
        setPage('workspaces');
        const available = await refreshWorkspaces();
        const selectedId = getStoredWorkspaceId();
        if (selectedId && !available.some((item) => item.id === selectedId)) saveWorkspaceId(null);
      } catch (error) {
        if (active) {
          clearToken();
          handleError(error);
        }
      } finally {
        if (active) setBooting(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [handleError, refreshWorkspaces]);

  useEffect(() => {
    if (!user || !selectedGoal) {
      setMilestones([]);
      setActions([]);
      setProgress(null);
      return;
    }
    let active = true;
    (async () => {
      try {
        const [nextMilestones, nextActions, nextProgress] = await Promise.all([
          api.milestones(selectedGoal.id),
          api.actions(selectedGoal.id),
          api.progress(selectedGoal.id),
        ]);
        if (active) {
          setMilestones(nextMilestones);
          setActions(nextActions);
          setProgress(nextProgress);
        }
      } catch (error) {
        if (active) handleError(error);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, selectedGoal, actionRefresh, handleError]);

  useEffect(() => {
    if (!user || !selectedGoal) {
      setMeasurements([]);
      setMeasurementHistory({});
      setMeasurementLoadState('READY');
      return;
    }
    let active = true;
    setMeasurements([]);
    setMeasurementLoadState('LOADING');
    (async () => {
      try {
        const next = await api.measurements(selectedGoal.id);
        const histories = await Promise.all(next.map(async (measurement) => [
          measurement.id, await api.measurementHistory(measurement.id),
        ] as const));
        if (active) {
          setMeasurements(next);
          setMeasurementHistory(Object.fromEntries(histories));
          setMeasurementLoadState('READY');
        }
      } catch (error) {
        if (active) { setMeasurementLoadState('ERROR'); handleError(error); }
      }
    })();
    return () => { active = false; };
  }, [user, selectedGoal, measurementRefresh, handleError]);

  useEffect(() => {
    if (page !== 'home' || !user) return;
    let active = true;
    setSchedulesLoaded(false);
    setSchedulesLoadError(false);
    const end = new Date(`${today()}T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 7);
    api.schedules(today(), end.toISOString().slice(0, 10)).then((items) => {
      if (active) { setUpcomingSchedules(items.sort((a, b) => a.startAt.localeCompare(b.startAt))); setSchedulesLoaded(true); }
    }).catch((error) => { if (active) { setSchedulesLoadError(true); handleError(error); } });
    return () => { active = false; };
  }, [page, user, scheduleRefresh, handleError]);

  useEffect(() => {
    if (!['planning', 'home', 'goals'].includes(page) || !user) {
      setAvailableActions([]);
      setActionsLoaded(false);
      setActionsLoadError(false);
      return;
    }
    if (goals.length === 0) {
      setAvailableActions([]);
      setActionsLoaded(true);
      setActionsLoadError(false);
      return;
    }
    let active = true;
    setActionsLoaded(false);
    setActionsLoadError(false);
    Promise.all(goals.map((goal) => api.actions(goal.id)))
      .then((lists) => {
        if (active) {
          setAvailableActions(lists.flat());
          setActionsLoaded(true);
        }
      })
      .catch((error) => {
        if (active) {
          setAvailableActions([]);
          setActionsLoadError(true);
          handleError(error);
        }
      });
    return () => {
      active = false;
    };
  }, [page, user, goals, actionRefresh, handleError]);

  const displayedGoals = selectedProject
    ? goals.filter((goal) => goal.projectId === selectedProject.id)
    : goals;
  const visibleHierarchy = useMemo(() => {
    if (!selectedProject) return hierarchy;
    return hierarchy
      .map((node) => node)
      .filter((node) => node.goal.projectId === selectedProject.id);
  }, [hierarchy, selectedProject]);
  const nextAction = availableActions.find((action) => action.status === 'IN_PROGRESS')
    ?? availableActions.find((action) => action.status === 'TODO');
  const nextSchedule = upcomingSchedules[0];
  const filteredWorkspaces = workspaces.filter((item) =>
    item.name.toLocaleLowerCase().includes(workspaceSearch.trim().toLocaleLowerCase()),
  );

  async function authenticated(userContext: UserContext) {
    setUser(userContext);
    try {
      saveWorkspaceId(null);
      setWorkspace(null);
      setPage('workspaces');
      await refreshWorkspaces();
      notify({
        kind: 'success',
        text: 'You’re signed in. Choose a workspace or create one to get started.',
      });
    } catch (error) {
      handleError(error);
    }
  }

  async function createWorkspace() {
    const name = workspaceName.trim();
    if (!name) return;
    setWorkspaceBusy(true);
    try {
      const created = await api.createWorkspace(name);
      setWorkspaceName('');
      setShowCreateWorkspace(false);
      const updated = await refreshWorkspaces();
      setWorkspaces(updated);
      notify({ kind: 'success', text: `${created.name} created.` });
    } catch (error) {
      handleError(error);
    } finally {
      setWorkspaceBusy(false);
    }
  }

  async function deleteWorkspace(selected: Workspace) {
    const confirmed = window.confirm(`Delete “${selected.name}” and all of its Projects, Goals, Actions, schedules, and measurements? This cannot be undone.`);
    if (!confirmed) return;
    setWorkspaceBusy(true);
    try {
      await api.deleteWorkspace(selected.id);
      if (getStoredWorkspaceId() === selected.id) {
        saveWorkspaceId(null);
        setWorkspace(null);
        setProjects([]);
        setGoals([]);
        setHierarchy([]);
        setSelectedProject(null);
        setSelectedGoal(null);
        setAvailableActions([]);
        setUpcomingSchedules([]);
        setPage('workspaces');
      }
      await refreshWorkspaces();
      notify({ kind: 'success', text: `${selected.name} deleted.` });
    } catch (error) {
      handleError(error);
    } finally {
      setWorkspaceBusy(false);
    }
  }

  async function logout() {
    try {
      await api.logout();
    } catch {
      /* Local token disposal still completes sign out. */
    }
    clearToken();
    setUser(null);
    setWorkspace(null);
    setBaseDataLoaded(false);
    setProjects([]);
    setGoals([]);
    setSelectedGoal(null);
    setSelectedProject(null);
    setPage('home');
    setWorkspaces([]);
  }

  async function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const project = await api.createProject({
        name: String(data.get('name')).trim(),
        description: String(data.get('description')).trim() || undefined,
      });
      await loadBase();
      setSelectedProject(project);
      setPage('goals');
      setModal(null);
      notify({ kind: 'success', text: 'Project created.' });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  async function moveGoal(goalId: string, parentGoalId: string | null) {
    const moving = goals.find((goal) => goal.id === goalId);
    const target = parentGoalId ? goals.find((goal) => goal.id === parentGoalId) : null;
    if (!moving) return;
    if (parentGoalId === goalId) {
      notify({ kind: 'error', text: 'A Goal cannot be moved inside itself.' });
      return;
    }
    if (target?.projectId !== moving.projectId) {
      notify({ kind: 'error', text: 'Goals can only be moved within the same Project.' });
      return;
    }
    if (!window.confirm(parentGoalId
      ? `Move "${moving.title}" under "${target?.title ?? 'the selected Goal'}"?`
      : `Move "${moving.title}" to the root level?`)) return;
    setBusy(true);
    try {
      await api.moveGoal(goalId, parentGoalId);
      await loadBase();
      notify({ kind: 'success', text: 'Goal hierarchy updated.' });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  async function submitGoal(event: FormEvent<HTMLFormElement>, child = false) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      title: String(data.get('title')).trim(),
      description: String(data.get('description')).trim() || undefined,
      targetDate: String(data.get('targetDate')) || null,
    };
    setBusy(true);
    try {
      const result =
        child && selectedGoal
          ? await api.createChildGoal(selectedGoal.id, body)
          : await api.createGoal({
              ...body,
              projectId: selectedProject?.id ?? null,
            });
      await loadBase();
      setSelectedGoal(result);
      setModal(null);
      notify({
        kind: 'success',
        text: child ? 'Child goal created.' : 'Goal created.',
      });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  async function submitMilestone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGoal) return;
    const data = new FormData(event.currentTarget);
    setBusy(true);
    try {
      const created = await api.createMilestone({
        goalId: selectedGoal.id,
        title: String(data.get('title')).trim(),
        description: String(data.get('description')).trim() || undefined,
        targetDate: String(data.get('targetDate')) || null,
      });
      setMilestones((items) => [...items, created]);
      setModal(null);
      notify({ kind: 'success', text: 'Milestone added.' });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  async function submitAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGoal) return;
    const data = new FormData(event.currentTarget);
    const milestoneId = String(data.get('milestoneId') || '');
    setBusy(true);
    try {
      const created = await api.createAction({
        goalId: selectedGoal.id,
        milestoneId: milestoneId || null,
        title: String(data.get('title')).trim(),
        description: String(data.get('description')).trim() || undefined,
      });
      setActions((items) => [...items, created]);
      setModal(null);
      notify({ kind: 'success', text: 'Action added.' });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  async function submitMeasurement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGoal) return;
    let targetValue: number | string | boolean | null = null;
    if (measurementTarget.trim()) {
      targetValue = measurementType === 'NUMBER' ? Number(measurementTarget) : measurementType === 'BOOLEAN' ? measurementTarget === 'true' : measurementTarget;
      if (typeof targetValue === 'number' && !Number.isFinite(targetValue)) {
        notify({ kind: 'error', text: 'Enter a valid numeric target.' });
        return;
      }
    }
    setBusy(true);
    try {
      const created = await api.createMeasurement({
        goalId: selectedGoal.id,
        label: measurementLabel.trim(),
        valueType: measurementType,
        unit: measurementType === 'NUMBER' ? measurementUnit.trim() || null : null,
        targetValue: measurementTarget.trim() ? targetValue : null,
      });
      setMeasurements((items) => [...items, created]);
      setMeasurementHistory((items) => ({ ...items, [created.id]: [] }));
      setMeasurementLabel('');
      setMeasurementUnit('');
      setMeasurementTarget('');
      setMeasurementFormOpen(false);
      notify({ kind: 'success', text: 'Measurement added.' });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  async function recordMeasurementValue(measurement: Measurement) {
    const raw = measurementValues[measurement.id]?.trim();
    if (raw === undefined || raw === '') return;
    const value = measurement.valueType === 'NUMBER'
      ? Number(raw)
      : measurement.valueType === 'BOOLEAN'
        ? raw === 'true'
        : raw;
    if (typeof value === 'number' && !Number.isFinite(value)) {
      notify({ kind: 'error', text: 'Enter a valid number.' });
      return;
    }
    try {
      const record = await api.recordMeasurement(measurement.id, { value });
      setMeasurementHistory((items) => ({
        ...items,
        [measurement.id]: [record, ...(items[measurement.id] ?? [])],
      }));
      setMeasurementValues((items) => ({ ...items, [measurement.id]: '' }));
      notify({ kind: 'success', text: 'Value recorded.' });
    } catch (error) {
      handleError(error);
    }
  }

  async function saveMilestoneEdit(event: FormEvent<HTMLFormElement>, milestone: Milestone) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const updated = await api.updateMilestone(milestone.id, {
        title: String(data.get('title')).trim(),
        targetDate: String(data.get('targetDate') ?? '') || null,
      });
      setMilestones((items) => items.map((item) => item.id === updated.id ? updated : item));
      setEditingMilestone(null);
    } catch (error) { handleError(error); }
  }

  async function saveActionEdit(event: FormEvent<HTMLFormElement>, action: Action) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const updated = await api.updateAction(action.id, {
        title: String(data.get('title')).trim(),
        description: String(data.get('description') ?? '').trim() || null,
      });
      setActions((items) => items.map((item) => item.id === updated.id ? updated : item));
      setEditingAction(null);
    } catch (error) { handleError(error); }
  }

  async function submitMeasurementEdit(event: FormEvent<HTMLFormElement>, measurement: Measurement) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const target = String(data.get('targetValue') ?? '').trim();
    const targetValue = target ? (measurement.valueType === 'NUMBER' ? Number(target) : measurement.valueType === 'BOOLEAN' ? target === 'true' : target) : null;
    if (typeof targetValue === 'number' && !Number.isFinite(targetValue)) {
      notify({ kind: 'error', text: 'Enter a valid numeric target.' });
      return;
    }
    try {
      const updated = await api.updateMeasurement(measurement.id, {
        label: String(data.get('label')).trim(),
        unit: measurement.valueType === 'NUMBER' ? String(data.get('unit') ?? '').trim() || null : null,
        targetValue,
      });
      setMeasurements((items) => items.map((item) => item.id === updated.id ? updated : item));
      setEditingMeasurement(null);
      notify({ kind: 'success', text: 'Measurement updated.' });
    } catch (error) {
      handleError(error);
    }
  }

  async function updateAction(action: Action, status: ActionStatus) {
    try {
      const updated = await api.updateActionStatus(action.id, status);
      setActions((items) =>
        items.map((item) => (item.id === action.id ? updated : item)),
      );
      const summary = await api.progress(action.goalId);
      setProgress(summary);
      notify({ kind: 'success', text: 'Action status updated.' });
    } catch (error) {
      handleError(error);
    }
  }

  async function openExecution(action: Action) {
    setExecutionAction(action);
    setExecutionData(null);
    setModal('execution');
    try {
      setExecutionData(await api.execution(action.id));
    } catch (error) {
      handleError(error);
    }
  }

  async function submitExecution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!executionAction) return;
    const data = new FormData(event.currentTarget);
    const startedAt = String(data.get('actualStartedAt') || '');
    const completedAt = String(data.get('actualCompletedAt') || '');
    setBusy(true);
    try {
      await api.recordExecution(executionAction.id, {
        actualStartedAt: startedAt ? new Date(startedAt).toISOString() : null,
        actualCompletedAt: completedAt
          ? new Date(completedAt).toISOString()
          : null,
        executionNote: String(data.get('executionNote')).trim() || null,
      });
      setModal(null);
      notify({ kind: 'success', text: 'Execution details saved.' });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
    }
  }

  async function completeMilestone(milestone: Milestone) {
    try {
      const updated = await api.completeMilestone(milestone.id);
      setMilestones((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      );
      notify({ kind: 'success', text: 'Milestone completed.' });
    } catch (error) {
      handleError(error);
    }
  }

  if (booting)
    return (
      <div className="boot-screen">
        <Loading label="Restoring your session" />
      </div>
    );
  if (!user)
    return (
      <>
        <AuthScreen onAuthenticated={authenticated} notify={notify} />
        {notice && (
          <div className={`toast toast--${notice.kind}`} role="status">
            {notice.text}
          </div>
        )}
      </>
    );

  const pageTitle =
    page === 'workspaces'
      ? 'Your workspaces'
      : page === 'home'
      ? 'Your space to grow'
      : page === 'projects'
        ? 'Projects'
        : page === 'goals'
          ? 'Goals & milestones'
          : page === 'assistant'
            ? 'Goal discovery'
            : page === 'review' ? 'Review your progress' : 'Plan your day';
  const pageSubtitle =
    page === 'workspaces'
      ? 'Create separate spaces for different parts of your work, then open the one you want to focus on.'
      : page === 'home'
      ? 'A little progress adds up to a lot.'
      : page === 'projects'
        ? 'Shape your ideas into focused projects.'
        : page === 'goals'
          ? 'Keep your bigger picture close.'
          : page === 'assistant'
            ? 'Turn an intention into a plan you can review and shape.'
            : page === 'review' ? 'See what happened, what you measured, and what remains unknown.' : 'Make time for the work that matters.';

  return (
    <div className={`app-layout ${page === 'workspaces' ? 'app-layout--workspace-manager' : 'app-layout--workspace-dashboard'}`}>
      {page !== 'workspaces' && (
        <Sidebar
          page={page}
          setPage={setPage}
          user={user}
          workspace={workspace}
          onLogout={logout}
          mobileOpen={mobileOpen}
          closeMobile={() => setMobileOpen(false)}
          onManageWorkspaces={() => setPage('workspaces')}
        />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="menu-toggle"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            ☰
          </button>
          <div className="breadcrumbs">
            <span>Workspace</span>
            <b>/</b>
            <strong>
              {page === 'goals' && selectedProject
                ? selectedProject.name
                : pageTitle}
            </strong>
          </div>
          <div className="topbar__right">
            {page === 'workspaces' && (
              <Button type="button" variant="quiet" onClick={() => void logout()}>
                Sign out
              </Button>
            )}
            <span className="topbar-date">
              {new Date().toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="avatar avatar--small">{initials(user.email)}</span>
          </div>
        </header>
        <section className="page-content">
          <div className="page-heading">
            <div>
              <span className="eyebrow">
                {page === 'workspaces' ? 'A CLEAN START' : page === 'home' ? 'MONDAY MOMENTUM' : 'YOUR WORKSPACE'}
              </span>
              <h1>{pageTitle}</h1>
              <p>{pageSubtitle}</p>
            </div>
            {page === 'projects' && (
              <Button onClick={() => setModal('project')}>
                <span>＋</span> New project
              </Button>
            )}
            {page === 'assistant' && (
              <Button variant="secondary" onClick={() => setPage('goals')}>
                Continue manually
              </Button>
            )}
          </div>

          {page === 'workspaces' && (
            <section className="workspace-manager" aria-label="Workspace manager">
              {showCreateWorkspace && (
                <Modal
                  title="Create a workspace"
                  onClose={() => {
                    if (workspaceBusy) return;
                    setShowCreateWorkspace(false);
                    setWorkspaceName('');
                  }}
                >
                  <form
                    className="form-stack"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void createWorkspace();
                    }}
                  >
                    <p className="muted">
                      Keep personal goals, a team initiative, or a side project in its own space.
                    </p>
                    <Field
                      label="Workspace name"
                      value={workspaceName}
                      maxLength={80}
                      placeholder="For example, Personal goals"
                      autoFocus
                      onChange={(event) => setWorkspaceName(event.target.value)}
                    />
                    <div className="heading-actions">
                      <Button
                        type="submit"
                        disabled={workspaceBusy || !workspaceName.trim()}
                      >
                        {workspaceBusy ? 'Creating…' : 'Create workspace'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={workspaceBusy}
                        onClick={() => {
                          setShowCreateWorkspace(false);
                          setWorkspaceName('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Modal>
              )}

              <div className="workspace-manager__heading">
                <div>
                  <h2>Your workspaces</h2>
                  <span>
                    {workspaces.length}{' '}
                    {workspaces.length === 1 ? 'workspace' : 'workspaces'}
                  </span>
                </div>
                {workspaces.length > 0 && (
                  <Field
                    label="Search workspaces"
                    type="search"
                    value={workspaceSearch}
                    placeholder="Find a workspace..."
                    onChange={(event) => setWorkspaceSearch(event.target.value)}
                  />
                )}
              </div>

              {filteredWorkspaces.length ? (
                <div className="workspace-manager__grid">
                  {filteredWorkspaces.map((item) => (
                    <article className="workspace-manager__item" key={item.id}>
                      <span className="workspace-manager__mark">⌂</span>
                      <div className="workspace-manager__details">
                        <h3>{item.name}</h3>
                        <p>
                          Created {dateLabel(item.createdAt.slice(0, 10))}
                          {workspace?.id === item.id ? ' · currently open' : ''}
                        </p>
                      </div>
                      <div className="workspace-manager__actions">
                        <Button
                          variant="primary"
                          disabled={workspaceBusy}
                          onClick={() => void openWorkspace(item)}
                        >
                          Open workspace
                        </Button>
                        <Button
                          variant="danger"
                          disabled={workspaceBusy}
                          onClick={() => void deleteWorkspace(item)}
                        >
                          Delete
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : workspaces.length > 0 ? (
                <div className="workspace-manager__empty workspace-manager__empty--compact">
                  <span>⌕</span>
                  <h3>No matching workspaces</h3>
                  <p>Try a different name or clear your search.</p>
                  <Button type="button" variant="secondary" onClick={() => setWorkspaceSearch('')}>
                    Clear search
                  </Button>
                </div>
              ) : (
                <div className="workspace-manager__empty">
                  <span>⌂</span>
                  <h3>A clean start</h3>
                  <p>Create a workspace when you are ready. Your goals and projects will live inside it.</p>
                  <Button type="button" onClick={() => setShowCreateWorkspace(true)}>
                    Create your first workspace
                  </Button>
                </div>
              )}
            </section>
          )}

          {page === 'assistant' && (
            <GoalAssistantPage
              onApplied={async () => {
                await loadBase();
                setPage('goals');
                notify({ kind: 'success', text: 'Approved goal structure added to your workspace.' });
              }}
              onManual={() => setPage('goals')}
            />
          )}

          {page === 'review' && <GoalReviewPage goals={goals} initialGoalId={selectedGoal?.id ?? null} />}

          {page === 'home' && (
  <DashboardHome
    email={user.email}
    goals={goals}
    projects={projects}
    actions={availableActions}
    nextAction={nextAction}
    nextSchedule={nextSchedule}
    baseDataLoaded={baseDataLoaded}
    actionsLoaded={actionsLoaded}
    actionsLoadError={actionsLoadError}
    schedulesLoaded={schedulesLoaded}
    schedulesLoadError={schedulesLoadError}
    onNewGoal={() => {
      setSelectedProject(null);
      setSelectedGoal(null);
      setPage('goals');
      setModal('goal');
    }}
    onNewProject={() => setModal('project')}
    onOpenGoal={(goal) => {
      setSelectedProject(
        projects.find((project) => project.id === goal.projectId) ?? null,
      );
      setSelectedGoal(goal);
      setPage('goals');
    }}
    onOpenProject={(project) => {
      setSelectedProject(project);
      setSelectedGoal(null);
      setPage('goals');
    }}
    onOpenExecution={(action) => {
      void openExecution(action);
    }}
    onOpenPlanning={() => setPage('planning')}
    onRetryActions={() => setActionRefresh((value) => value + 1)}
    onRetrySchedules={() => setScheduleRefresh((value) => value + 1)}
    onViewGoals={() => {
      setSelectedProject(null);
      setPage('goals');
    }}
    onViewProjects={() => setPage('projects')}
  />
)}

          {page === 'projects' && (
            <section className="project-grid">
              {projects.length ? (
                projects.map((project, index) => (
                  <button
                    className="project-card"
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project);
                      setPage('goals');
                    }}
                  >
                    <span
                      className={`project-card__art project-card__art--${index % 3}`}
                    >
                      <span>{project.name.slice(0, 1).toUpperCase()}</span>
                    </span>
                    <span className="project-card__content">
                      <strong>{project.name}</strong>
                      <small>
                        {project.description || 'No description yet'}
                      </small>
                      <span className="project-card__footer">
                        {goals.filter((goal) => goal.projectId === project.id).length} Goals <b>·</b> Open project <b>→</b>
                      </span>
                    </span>
                  </button>
                ))
              ) : (
                <div className="empty-wide">
                  <EmptyState
                    icon="▦"
                    title="Every big thing starts somewhere"
                    body="Create your first project and start building momentum."
                    action={
                      <Button onClick={() => setModal('project')}>
                        Create your first project
                      </Button>
                    }
                  />
                </div>
              )}
            </section>
          )}

          {page === 'goals' && (
            <GoalWorkspace
              goals={displayedGoals}
              hierarchy={visibleHierarchy}
              selectedGoal={selectedGoal}
              onSelectGoal={setSelectedGoal}
              onMoveGoal={moveGoal}
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={(project) => {
                setSelectedProject(project);
                setSelectedGoal(null);
              }}
              milestones={milestones}
              actions={actions}
              workspaceActions={availableActions.filter((action) =>
                displayedGoals.some((goal) => goal.id === action.goalId),
              )}
              progress={progress}
              measurements={measurements}
              measurementHistory={measurementHistory}
              measurementLoadState={measurementLoadState}
              onRefreshMeasurements={() => setMeasurementRefresh((value) => value + 1)}
              measurementFormOpen={measurementFormOpen}
              setMeasurementFormOpen={setMeasurementFormOpen}
              measurementLabel={measurementLabel}
              setMeasurementLabel={setMeasurementLabel}
              measurementType={measurementType}
              setMeasurementType={setMeasurementType}
              measurementUnit={measurementUnit}
              setMeasurementUnit={setMeasurementUnit}
              measurementTarget={measurementTarget}
              setMeasurementTarget={setMeasurementTarget}
              measurementValues={measurementValues}
              setMeasurementValues={setMeasurementValues}
              onRecordMeasurement={recordMeasurementValue}
              onSaveMeasurement={submitMeasurement}
              editingMeasurement={editingMeasurement}
              setEditingMeasurement={setEditingMeasurement}
              onSaveMeasurementEdit={submitMeasurementEdit}
              editingMilestone={editingMilestone}
              setEditingMilestone={setEditingMilestone}
              onSaveMilestone={saveMilestoneEdit}
              onCompleteMilestone={completeMilestone}
              editingAction={editingAction}
              setEditingAction={setEditingAction}
              onSaveAction={saveActionEdit}
              onUpdateAction={updateAction}
              onOpenExecution={openExecution}
              onAddGoal={() => setModal('goal')}
              onAddChildGoal={() => setModal('child')}
              onAddMilestone={() => setModal('milestone')}
              onAddAction={() => setModal('action')}
              busy={busy}
            />
          )}

          {page === 'planning' && (
            <PlanningCalendar
              actions={availableActions}
              goals={goals}
              actionsLoaded={actionsLoaded}
              actionsLoadError={actionsLoadError}
              initialDate={planningDate}
              onRefreshActions={() => setActionRefresh((value) => value + 1)}
              onOpenGoal={(goalId) => {
                const goal = goals.find((item) => item.id === goalId);
                if (goal) {
                  setSelectedGoal(goal);
                  setSelectedProject(projects.find((project) => project.id === goal.projectId) ?? null);
                }
                setPage('goals');
              }}
              onLogExecution={(action) => void openExecution(action)}
            />
          )}

          {notice && (
            <div className={`toast toast--${notice.kind}`} role="status">
              {notice.text}
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotice(null)}
              >
                ×
              </button>
            </div>
          )}
        </section>
      </main>

      {modal === 'project' && (
        <Modal title="Create a project" onClose={() => setModal(null)}>
          <form className="form-stack" onSubmit={submitProject}>
            <Field
              label="Project name"
              name="name"
              placeholder="e.g. Build a healthier routine"
              required
              maxLength={120}
              autoFocus
            />
            <TextArea
              label="Description"
              name="description"
              placeholder="What would you like to make happen?"
            />
            <div className="modal__actions">
              <Button
                type="button"
                variant="quiet"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button disabled={busy}>
                {busy ? 'Creating…' : 'Create project'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {(modal === 'goal' || modal === 'child') && (
        <Modal
          title={modal === 'child' ? 'Add a child goal' : 'Create a goal'}
          onClose={() => setModal(null)}
        >
          <form
            className="form-stack"
            onSubmit={(event) => submitGoal(event, modal === 'child')}
          >
            <Field
              label="Goal title"
              name="title"
              placeholder="What do you want to achieve?"
              required
              maxLength={200}
              autoFocus
            />
            <TextArea
              label="Description"
              name="description"
              placeholder="Why does this matter to you?"
            />
            <Field label="Target date" name="targetDate" type="date" />
            <div className="modal__actions">
              <Button
                type="button"
                variant="quiet"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button disabled={busy}>{busy ? 'Saving…' : 'Save goal'}</Button>
            </div>
          </form>
        </Modal>
      )}
      {modal === 'milestone' && (
        <Modal title="Add a milestone" onClose={() => setModal(null)}>
          <form className="form-stack" onSubmit={submitMilestone}>
            <Field
              label="Milestone name"
              name="title"
              placeholder="A meaningful checkpoint"
              required
              maxLength={200}
              autoFocus
            />
            <TextArea
              label="Description"
              name="description"
              placeholder="What will be true when you reach it?"
            />
            <Field label="Target date" name="targetDate" type="date" />
            <div className="modal__actions">
              <Button
                type="button"
                variant="quiet"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button disabled={busy}>Add milestone</Button>
            </div>
          </form>
        </Modal>
      )}
      {modal === 'action' && (
        <Modal title="Add an action" onClose={() => setModal(null)}>
          <form className="form-stack" onSubmit={submitAction}>
            <Field
              label="Action"
              name="title"
              placeholder="A small next step"
              required
              maxLength={200}
              autoFocus
            />
            <TextArea
              label="Details"
              name="description"
              placeholder="Optional details"
            />
            <label className="field">
              <span>Milestone</span>
              <select name="milestoneId" defaultValue="">
                <option value="">No milestone</option>
                {milestones
                  .filter((item) => item.status !== 'COMPLETED')
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
              </select>
            </label>
            <div className="modal__actions">
              <Button
                type="button"
                variant="quiet"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button disabled={busy}>Add action</Button>
            </div>
          </form>
        </Modal>
      )}
      {modal === 'execution' && executionAction && (
        <Modal
          title={`Log execution · ${executionAction.title}`}
          onClose={() => setModal(null)}
        >
          <form className="form-stack" onSubmit={submitExecution}>
            {executionData?.executionNote && (
              <p className="inline-success">
                Existing note: {executionData.executionNote}
              </p>
            )}
            <Field
              label="Started at"
              name="actualStartedAt"
              type="datetime-local"
              defaultValue={localDateTimeInput(executionData?.actualStartedAt)}
            />
            <Field
              label="Completed at"
              name="actualCompletedAt"
              type="datetime-local"
              defaultValue={localDateTimeInput(
                executionData?.actualCompletedAt,
              )}
            />
            <TextArea
              label="Execution note"
              name="executionNote"
              placeholder="What happened while working on this action?"
              defaultValue={executionData?.executionNote ?? ''}
            />
            <div className="modal__actions">
              <Button
                type="button"
                variant="quiet"
                onClick={() => setModal(null)}
              >
                Cancel
              </Button>
              <Button disabled={busy}>
                {busy ? 'Saving…' : 'Save execution'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      {action}
    </div>
  );
}