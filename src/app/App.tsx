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
  saveToken,
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
import { PlanningCalendar } from '../planning/PlanningCalendar';

type Page = 'home' | 'projects' | 'goals' | 'planning' | 'review' | 'assistant';
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
}: {
  page: Page;
  setPage: (page: Page) => void;
  user: UserContext;
  workspace: Workspace | null;
  onLogout: () => void;
  mobileOpen: boolean;
  closeMobile: () => void;
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
        <div className="workspace-switch">
          <span className="workspace-switch__icon">⌂</span>
          <span>
            <small>WORKSPACE</small>
            <strong>{workspace?.name ?? 'Your workspace'}</strong>
          </span>
          <span className="workspace-switch__chevron">⌄</span>
        </div>
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

function GoalTree({
  nodes,
  selectedId,
  onSelect,
  depth = 0,
}: {
  nodes: GoalNode[];
  selectedId: string | null;
  onSelect: (goal: Goal) => void;
  depth?: number;
}) {
  return (
    <>{nodes.map((node) => <GoalTreeNode key={node.goal.id} node={node} selectedId={selectedId} onSelect={onSelect} depth={depth} />)}</>
  );
}

function GoalTreeNode({ node, selectedId, onSelect, depth }: {
  node: GoalNode; selectedId: string | null; onSelect: (goal: Goal) => void; depth: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const { goal, children } = node;
  return <div className="goal-tree__node">
    <div className="goal-tree__node-head">
      <button className={`tree-row ${selectedId === goal.id ? 'tree-row--active' : ''}`} style={{ paddingLeft: `${14 + depth * 18}px` }} onClick={() => onSelect(goal)}>
        <span className="tree-row__branch">{depth ? '↳' : '○'}</span><span>{goal.title}</span>
        <span className="tree-row__status">{goal.status.toLowerCase().replaceAll('_', ' ')}</span>
      </button>
      {children.length > 0 && <button type="button" className="tree-toggle" aria-label={`${expanded ? 'Collapse' : 'Expand'} ${goal.title}`} aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? '−' : '+'}</button>}
    </div>
    {expanded && children.map((child) => <GoalTreeNode key={child.goal.id} node={child} selectedId={selectedId} onSelect={onSelect} depth={depth + 1} />)}
  </div>;
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
  const [baseDataLoaded, setBaseDataLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [hierarchy, setHierarchy] = useState<GoalNode[]>([]);
  const [page, setPage] = useState<Page>('home');
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
  const [planningDate, setPlanningDate] = useState(today());

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

  useEffect(() => {
    if (!getStoredToken()) return;
    let active = true;
    (async () => {
      try {
        const result = await api.session();
        if (!active) return;
        setUser(result.user);
        await loadBase();
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
  }, [handleError, loadBase]);

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
    if (!['planning', 'home'].includes(page) || !user) {
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

  async function authenticated(userContext: UserContext) {
    setUser(userContext);
    try {
      await loadBase();
      notify({
        kind: 'success',
        text: 'You’re signed in. Your workspace is ready.',
      });
    } catch (error) {
      handleError(error);
    }
  }

  async function initializeWorkspace() {
    setBusy(true);
    try {
      const result = await api.initializeWorkspace();
      setWorkspace(result);
      await loadBase();
      notify({ kind: 'success', text: 'Workspace is ready.' });
    } catch (error) {
      handleError(error);
    } finally {
      setBusy(false);
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
    page === 'home'
      ? 'Your space to grow'
      : page === 'projects'
        ? 'Projects'
        : page === 'goals'
          ? 'Goals & milestones'
          : page === 'assistant'
            ? 'Goal discovery'
            : page === 'review' ? 'Review your progress' : 'Plan your day';
  const pageSubtitle =
    page === 'home'
      ? 'A little progress adds up to a lot.'
      : page === 'projects'
        ? 'Shape your ideas into focused projects.'
        : page === 'goals'
          ? 'Keep your bigger picture close.'
          : page === 'assistant'
            ? 'Turn an intention into a plan you can review and shape.'
            : page === 'review' ? 'See what happened, what you measured, and what remains unknown.' : 'Make time for the work that matters.';

  return (
    <div className="app-layout">
      <Sidebar
        page={page}
        setPage={setPage}
        user={user}
        workspace={workspace}
        onLogout={logout}
        mobileOpen={mobileOpen}
        closeMobile={() => setMobileOpen(false)}
      />
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
                {page === 'home' ? 'MONDAY MOMENTUM' : 'YOUR WORKSPACE'}
              </span>
              <h1>{pageTitle}</h1>
              <p>{pageSubtitle}</p>
            </div>
            {page === 'projects' && (
              <Button onClick={() => setModal('project')}>
                <span>＋</span> New project
              </Button>
            )}
            {page === 'goals' && (
              <div className="heading-actions">
                <select
                  aria-label="Filter by project"
                  value={selectedProject?.id ?? ''}
                  onChange={(event) => {
                    const project =
                      projects.find((item) => item.id === event.target.value) ??
                      null;
                    setSelectedProject(project);
                    setSelectedGoal(null);
                  }}
                >
                  <option value="">All projects</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <Button onClick={() => setModal('goal')}>
                  <span>＋</span> New goal
                </Button>
              </div>
            )}
            {page === 'assistant' && (
              <Button variant="secondary" onClick={() => setPage('goals')}>
                Continue manually
              </Button>
            )}
          </div>

          {!workspace && (
            <section className="welcome-card">
              <div className="welcome-card__icon">⌂</div>
              <div>
                <h2>Your personal workspace is ready to begin</h2>
                <p>Set up a private place for your projects and goals.</p>
              </div>
              <Button onClick={initializeWorkspace} disabled={busy}>
                {busy ? 'Setting up…' : 'Create workspace'}
              </Button>
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
            <>
              <section className="hero-card">
                <div className="hero-card__content">
                  <span className="hero-card__tag">
                    A FRESH START, EVERY DAY
                  </span>
                  <h2>
                    Turn your intention
                    <br />
                    into <em>something real.</em>
                  </h2>
                  <p>Choose one meaningful thing to move forward today.</p>
                  <Button variant="secondary" onClick={() => setPage('goals')}>
                    Explore your goals <span>→</span>
                  </Button>
                </div>
                <div className="hero-illustration" aria-hidden="true">
                  <div className="hero-illustration__sun" />
                  <div className="hero-illustration__hill hero-illustration__hill--back" />
                  <div className="hero-illustration__hill hero-illustration__hill--front" />
                  <span>✳</span>
                </div>
              </section>
              <div className="home-next-grid">
                <section className="panel home-next-card">
                  <span className="eyebrow">CONTINUE AN ACTION</span>
                  {actionsLoadError ? <div><strong>Actions unavailable</strong><button type="button" className="text-link" onClick={() => setActionRefresh((value) => value + 1)}>Try again</button></div> : !actionsLoaded ? <p className="empty-line">Loading actions…</p> : nextAction ? <button type="button" className="home-next-card__link" onClick={() => void openExecution(nextAction)}><strong>{nextAction.title}</strong><small>{goals.find((goal) => goal.id === nextAction.goalId)?.title ?? 'Goal'} · {nextAction.status === 'IN_PROGRESS' ? 'In progress' : 'To do'}</small></button> : <div><strong>No open Actions</strong><button type="button" className="text-link" onClick={() => setPage('goals')}>View Goals</button></div>}
                </section>
                <section className="panel home-next-card">
                  <span className="eyebrow">UPCOMING WORK</span>
                  {schedulesLoadError ? <div><strong>Schedule unavailable</strong><button type="button" className="text-link" onClick={() => setScheduleRefresh((value) => value + 1)}>Try again</button></div> : !schedulesLoaded ? <p className="empty-line">Loading schedule…</p> : nextSchedule ? <button type="button" className="home-next-card__link" onClick={() => { setPlanningDate(nextSchedule.startAt.slice(0, 10)); setPage('planning'); }}><strong>{availableActions.find((action) => action.id === nextSchedule.actionId)?.title ?? 'Scheduled Action'}</strong><small>{new Date(nextSchedule.startAt).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small></button> : <div><strong>Nothing scheduled this week</strong><button type="button" className="text-link" onClick={() => setPage('planning')}>Open Planning</button></div>}
                </section>
              </div>
              <div className="section-title">
                <div>
                  <h2>Your overview</h2>
                  <p>Here’s where your energy is going.</p>
                </div>
                <button
                  className="text-link"
                  onClick={() => setPage('projects')}
                >
                  View projects <span>→</span>
                </button>
              </div>
              <div className="stat-grid">
                <article className="stat-card">
                  <span className="stat-card__icon stat-card__icon--peach">
                    ▦
                  </span>
                  <span className="stat-card__label">PROJECTS</span>
                  <strong>{baseDataLoaded ? projects.length : '—'}</strong>
                  <small>in your workspace</small>
                </article>
                <article className="stat-card">
                  <span className="stat-card__icon stat-card__icon--sage">
                    ◎
                  </span>
                  <span className="stat-card__label">YOUR GOALS</span>
                  <strong>{baseDataLoaded ? goals.length : '—'}</strong>
                  <small>ideas in motion</small>
                </article>
                <article className="stat-card">
                  <span className="stat-card__icon stat-card__icon--blue">
                    ↗
                  </span>
                  <span className="stat-card__label">COMPLETED ACTIONS</span>
                  <strong>{actionsLoaded ? availableActions.filter((action) => action.status === 'COMPLETED').length : '—'}</strong>
                  <small>keep showing up</small>
                </article>
              </div>
              <div className="home-columns">
                <section className="panel">
                  <div className="panel__heading">
                    <div>
                      <h2>Projects</h2>
                    </div>
                    <button
                      className="icon-button"
                      aria-label="View projects"
                      onClick={() => setPage('projects')}
                    >
                      ↗
                    </button>
                  </div>
                  {projects.length ? (
                    <div className="project-list">
                      {projects.slice(0, 4).map((project, index) => (
                        <button
                          key={project.id}
                          className="project-row"
                          onClick={() => {
                            setSelectedProject(project);
                            setPage('goals');
                          }}
                        >
                          <span
                            className={`project-avatar project-avatar--${index % 3}`}
                          >
                            {project.name.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="project-row__body">
                            <strong>{project.name}</strong>
                            <small>{project.description || 'Project'}</small>
                          </span>
                          <span className="project-row__arrow">→</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon="▦"
                      title="No projects yet"
                      body="Create a project to give your goals a home."
                      action={
                        <Button
                          variant="secondary"
                          onClick={() => setModal('project')}
                        >
                          Create a project
                        </Button>
                      }
                    />
                  )}
                </section>
                <section className="panel focus-panel">
                  <div className="panel__heading">
                    <div>
                      <h2>Your Goals</h2>
                    </div>
                    <button
                      className="icon-button"
                      aria-label="View goals"
                      onClick={() => setPage('goals')}
                    >
                      ↗
                    </button>
                  </div>
                  {goals.length ? (
                    goals.slice(0, 4).map((goal) => (
                      <button
                        key={goal.id}
                        className="focus-row"
                        onClick={() => {
                          setSelectedGoal(goal);
                          setPage('goals');
                        }}
                      >
                        <span className="focus-row__dot" />
                        <span>
                          <strong>{goal.title}</strong>
                          <small>
                            {goal.targetDate
                              ? `Target ${dateLabel(goal.targetDate)}`
                              : 'No target date'}
                          </small>
                        </span>
                        <span>→</span>
                      </button>
                    ))
                  ) : (
                    <EmptyState
                      icon="◎"
                      title="Make space for a goal"
                      body="A clear goal gives your daily actions direction."
                      action={
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setPage('goals');
                            setModal('goal');
                          }}
                        >
                          Create a goal
                        </Button>
                      }
                    />
                  )}
                </section>
              </div>
            </>
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
            <div className="goals-layout">
              <section className="panel hierarchy-panel">
                <div className="panel__heading">
                  <div>
                    <h2>Goal map</h2>
                    <p>
                      {selectedProject
                        ? selectedProject.name
                        : 'All goals across your workspace'}
                    </p>
                  </div>
                  <span className="count-pill">
                    {displayedGoals.length} goals
                  </span>
                </div>
                {visibleHierarchy.length ? (
                  <div className="goal-tree">
                    <GoalTree
                      nodes={visibleHierarchy}
                      selectedId={selectedGoal?.id ?? null}
                      onSelect={setSelectedGoal}
                    />
                  </div>
                ) : (
                  <EmptyState
                    icon="◎"
                    title="Your goal map is waiting"
                    body={
                      selectedProject
                        ? 'Add a goal to this project to get started.'
                        : 'Create a project, then add a goal to bring your plans to life.'
                    }
                    action={
                      <Button
                        onClick={() =>
                          selectedProject
                            ? setModal('goal')
                            : setPage('projects')
                        }
                      >
                        {selectedProject ? 'Add a goal' : 'Explore projects'}
                      </Button>
                    }
                  />
                )}
              </section>
              <section className="goal-detail">
                {selectedGoal ? (
                  <>
                    <div className="goal-detail__header">
                      <div>
                        <span className="eyebrow">GOAL DETAILS</span>
                        <h2>{selectedGoal.title}</h2>
                      </div>
                      <span
                        className={`status-badge status-badge--${selectedGoal.status.toLowerCase()}`}
                      >
                        {selectedGoal.status.replaceAll('_', ' ').toLowerCase()}
                      </span>
                    </div>
                    <p className="goal-description">
                      {selectedGoal.description ||
                        'Add detail to keep the reason behind this goal close.'}
                    </p>
                    <div className="goal-meta">
                      <span>◷ {dateLabel(selectedGoal.targetDate)}</span>
                      <span>
                        ▦{' '}
                        {projects.find(
                          (item) => item.id === selectedGoal.projectId,
                        )?.name ?? 'Workspace goal'}
                      </span>
                    </div>
                    <div className="progress-block">
                      <div className="progress-block__heading">
                        <strong>Outcome progress</strong>
                        <span>
                          {!progress
                            ? 'Loading'
                            : progress.goalProgress.progressValue == null
                            ? progress.goalProgress.calculationStatus === 'RULE_NOT_CONFIGURED'
                              ? 'Not configured'
                              : 'Not enough data'
                            : `${Math.round(progress.goalProgress.progressValue)}%`}
                        </span>
                      </div>
                      {progress?.goalProgress.progressValue != null && <div className="progress-track"><span style={{ width: `${Math.max(0, Math.min(100, progress.goalProgress.progressValue))}%` }} /></div>}
                      {progress?.actionCompletion?.totalActions ? <div className="progress-block__execution">
                        <div className="progress-block__heading"><span>Actions complete</span><strong>{progress.actionCompletion.completedActions} / {progress.actionCompletion.totalActions}</strong></div>
                        <div className="progress-track"><span style={{ width: `${progress.actionCompletion.completionValue ?? 0}%` }} /></div>
                      </div> : <small>{progress ? 'No actions to count yet.' : 'Loading progress…'}</small>}
                    </div>
                    <div className="detail-actions">
                      <Button
                        variant="secondary"
                        onClick={() => setModal('child')}
                      >
                        ＋ Add child goal
                      </Button>
                      <Button
                        variant="quiet"
                        onClick={() => setModal('milestone')}
                      >
                        ＋ Milestone
                      </Button>
                      <Button
                        variant="quiet"
                        onClick={() => setModal('action')}
                      >
                        ＋ Action
                      </Button>
                    </div>
                    <div className="detail-section">
                      <div className="section-heading">
                        <h3>Milestones</h3>
                        <span>{milestones.length}</span>
                      </div>
                      {milestones.length ? (
                        milestones.map((milestone) => (
                          <div className="milestone-item" key={milestone.id}><div className="item-row">
                            <span
                              className={`check-circle ${milestone.status === 'COMPLETED' ? 'check-circle--done' : ''}`}
                            >
                              {milestone.status === 'COMPLETED' ? '✓' : ''}
                            </span>
                            <span className="item-row__body">
                              <strong>{milestone.title}</strong>
                              <small>
                                {milestone.targetDate
                                  ? dateLabel(milestone.targetDate)
                                  : milestone.status.toLowerCase()}
                              </small>
                            </span>
                            {milestone.status !== 'COMPLETED' && <button type="button" className="text-link" onClick={() => setEditingMilestone(editingMilestone === milestone.id ? null : milestone.id)}>{editingMilestone === milestone.id ? 'Close' : 'Edit'}</button>}
                            {milestone.status !== 'COMPLETED' && <button type="button" className="text-link" onClick={() => completeMilestone(milestone)}>Complete</button>}
                          </div>
                          {editingMilestone === milestone.id && <form className="measurement-form" onSubmit={(event) => void saveMilestoneEdit(event, milestone)}><Field label="Milestone" name="title" defaultValue={milestone.title} required /><Field label="Target date" name="targetDate" type="date" defaultValue={milestone.targetDate ?? ''} /><Button>Save milestone</Button></form>}
                          </div>
                        ))
                      ) : (
                        <p className="empty-line">No milestones yet.</p>
                      )}
                    </div>
                    <div className="detail-section">
                      <div className="section-heading">
                        <h3>Actions</h3>
                        <span>{actions.length}</span>
                      </div>
                      {actions.length ? (
                        actions.map((action) => (
                          <div className="action-item" key={action.id}><div className="action-row">
                            <span className="action-row__mark">
                              {action.status === 'COMPLETED' ? '✓' : '↗'}
                            </span>
                            <span className="item-row__body">
                              <strong>{action.title}</strong>
                              <small>
                                {action.status
                                  .replaceAll('_', ' ')
                                  .toLowerCase()}
                                {action.milestoneId
                                  ? ` · ${milestones.find((item) => item.id === action.milestoneId)?.title ?? 'Milestone'}`
                                  : ''}
                              </small>
                            </span>
                            {action.status !== 'COMPLETED' && <button
                              type="button"
                              className="text-link"
                              onClick={() => setEditingAction(editingAction === action.id ? null : action.id)}
                            >
                              {editingAction === action.id ? 'Close' : 'Edit'}
                            </button>}
                            <button
                              type="button"
                              className="text-link execution-link"
                              onClick={() => openExecution(action)}
                            >
                              Log
                            </button>
                            {action.status !== 'COMPLETED' && (
                              <select
                                aria-label={`Update ${action.title} status`}
                                value={action.status}
                                onChange={(event) =>
                                  updateAction(
                                    action,
                                    event.target.value as ActionStatus,
                                  )
                                }
                              >
                                <option value="TODO">To do</option>
                                <option value="IN_PROGRESS">In progress</option>
                                <option value="COMPLETED">Completed</option>
                              </select>
                            )}
                          </div>
                          {editingAction === action.id && action.status !== 'COMPLETED' && <form className="measurement-form" onSubmit={(event) => void saveActionEdit(event, action)}><Field label="Action" name="title" defaultValue={action.title} required /><label className="field"><span>Details</span><textarea name="description" defaultValue={action.description ?? ''} rows={2} /></label><Button>Save action</Button></form>}
                          </div>
                        ))
                      ) : (
                        <p className="empty-line">
                          No actions yet. Add a small next step.
                        </p>
                      )}
                    </div>
                    <div className="detail-section">
                      <div className="section-heading">
                        <h3>Measurements</h3>
                        <Button type="button" variant="quiet" onClick={() => setMeasurementFormOpen((open) => !open)}>
                          {measurementFormOpen ? 'Cancel' : '+ Add'}
                        </Button>
                      </div>
                      {measurementFormOpen && (
                        <form className="measurement-form" onSubmit={(event) => void submitMeasurement(event)}>
                          <Field label="What will you measure?" value={measurementLabel} onChange={(event) => setMeasurementLabel(event.target.value)} maxLength={120} required />
                          <label className="field"><span>Value type</span><select value={measurementType} onChange={(event) => setMeasurementType(event.target.value as Measurement['valueType'])}><option value="NUMBER">Number</option><option value="TEXT">Text</option><option value="BOOLEAN">Yes / No</option></select></label>
                          {measurementType === 'NUMBER' && <Field label="Unit (optional)" value={measurementUnit} onChange={(event) => setMeasurementUnit(event.target.value)} placeholder="e.g. hours, kg" />}
                          {measurementType === 'BOOLEAN' ? <label className="field"><span>Target (optional)</span><select value={measurementTarget} onChange={(event) => setMeasurementTarget(event.target.value)}><option value="">No target</option><option value="true">Yes</option><option value="false">No</option></select></label> : <Field label="Target (optional)" type={measurementType === 'NUMBER' ? 'number' : 'text'} value={measurementTarget} onChange={(event) => setMeasurementTarget(event.target.value)} />}
                          <Button disabled={busy || !measurementLabel.trim()}>Save measurement</Button>
                        </form>
                      )}
                      {measurementLoadState === 'LOADING' ? <p className="empty-line">Loading measurements…</p> : measurementLoadState === 'ERROR' ? <div className="inline-error" role="alert">Measurements could not be loaded. <button type="button" className="text-link" onClick={() => setMeasurementRefresh((value) => value + 1)}>Try again</button></div> : measurements.length === 0 ? <p className="empty-line">No measurements yet.</p> : measurements.map((measurement) => {
                        const history = measurementHistory[measurement.id] ?? [];
                        const current = history[0];
                        return (
                          <article className="measurement-card" key={measurement.id}>
                            <div className="measurement-card__heading">
                              <div><strong>{measurement.label}</strong><small>{measurement.unit ?? measurement.valueType.toLowerCase()}{measurement.targetValue !== null ? ` · Target ${measurement.targetValue}${measurement.unit ? ` ${measurement.unit}` : ''}` : ' · No target'}</small></div>
                              <button type="button" className="text-link" onClick={() => setEditingMeasurement(editingMeasurement === measurement.id ? null : measurement.id)}>{editingMeasurement === measurement.id ? 'Close' : 'Edit'}</button>
                            </div>
                            {editingMeasurement === measurement.id && (
                              <form className="measurement-form" onSubmit={(event) => void submitMeasurementEdit(event, measurement)}>
                                <Field label="Name" name="label" defaultValue={measurement.label} maxLength={120} required />
                                {measurement.valueType === 'NUMBER' && <Field label="Unit" name="unit" defaultValue={measurement.unit ?? ''} />}
                                {measurement.valueType === 'BOOLEAN' ? <label className="field"><span>Target</span><select name="targetValue" defaultValue={measurement.targetValue === null ? '' : String(measurement.targetValue)}><option value="">No target</option><option value="true">Yes</option><option value="false">No</option></select></label> : <Field label="Target" name="targetValue" type={measurement.valueType === 'NUMBER' ? 'number' : 'text'} defaultValue={measurement.targetValue === null ? '' : String(measurement.targetValue)} />}
                                <Button>Save changes</Button>
                              </form>
                            )}
                            <div className="measurement-card__current"><span>Latest recorded</span><strong>{current ? `${current.value}${measurement.unit ? ` ${measurement.unit}` : ''}` : 'No values yet'}</strong>{current && <small>{dateLabel(current.recordedAt)}</small>}</div>
                            {history.length >= 2 && measurement.valueType === 'NUMBER' && (() => {
                              const series = [...history].reverse().filter((record) => typeof record.value === 'number');
                              if (series.length < 2) return null;
                              const values = series.map((record) => record.value as number);
                              const min = Math.min(...values); const max = Math.max(...values);
                              const points = values.map((value, index) => `${(index / (values.length - 1)) * 100},${28 - (max === min ? 0.5 : (value - min) / (max - min)) * 22}`).join(' ');
                              return <svg className="measurement-sparkline" viewBox="0 0 100 32" role="img" aria-label={`${measurement.label} history, ${series.length} recorded values`} preserveAspectRatio="none"><polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>;
                            })()}
                            {measurement.valueType === 'BOOLEAN' ? (
                              <label className="field"><span>Record value</span><select value={measurementValues[measurement.id] ?? ''} onChange={(event) => setMeasurementValues((items) => ({ ...items, [measurement.id]: event.target.value }))}><option value="">Choose…</option><option value="true">Yes</option><option value="false">No</option></select></label>
                            ) : (
                              <Field label="Record value" type={measurement.valueType === 'NUMBER' ? 'number' : 'text'} value={measurementValues[measurement.id] ?? ''} onChange={(event) => setMeasurementValues((items) => ({ ...items, [measurement.id]: event.target.value }))} />
                            )}
                            <Button type="button" variant="secondary" disabled={!measurementValues[measurement.id]} onClick={() => void recordMeasurementValue(measurement)}>Record</Button>
                            {history.length > 1 && <details className="measurement-history"><summary>History · {history.length}</summary><ol>{history.map((record) => <li key={record.id}><strong>{record.value}{measurement.unit ? ` ${measurement.unit}` : ''}</strong><time>{dateLabel(record.recordedAt)}</time></li>)}</ol></details>}
                          </article>
                        );
                      })}
                    </div>
                    <div className="detail-section">
                      <div className="section-heading"><h3>Review</h3><span>Saved evidence</span></div>
                      <div className="review-evidence">
                        <div><span>Actions complete</span><strong>{progress?.actionCompletion?.totalActions ? `${progress.actionCompletion.completedActions} of ${progress.actionCompletion.totalActions}` : progress ? 'No active Actions' : 'Loading'}</strong></div>
                        <div><span>Measurements with values</span><strong>{measurements.filter((measurement) => (measurementHistory[measurement.id]?.length ?? 0) > 0).length} of {measurementLoadState === 'READY' ? measurements.length : '—'}</strong></div>
                      </div>
                      <small className="review-evidence__note">Goal outcome progress is not calculated until its rule is configured.</small>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon="◎"
                    title="Choose a goal"
                    body="Select a goal from the map to see its milestones, actions, and progress."
                  />
                )}
              </section>
            </div>
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
