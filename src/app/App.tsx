import {
  useCallback,
  useEffect,
  useMemo,
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
  type Execution,
  type Goal,
  type GoalNode,
  type Milestone,
  type Project,
  type ProgressSummary,
  type UserContext,
  type Workspace,
} from '../lib/api';

type Page = 'home' | 'projects' | 'goals' | 'planning';
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
    { id: 'home', label: 'Overview', icon: '◫' },
    { id: 'projects', label: 'Projects', icon: '▦' },
    { id: 'goals', label: 'Goals', icon: '◎' },
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
    <>
      {nodes.map(({ goal, children }) => (
        <div key={goal.id}>
          <button
            className={`tree-row ${selectedId === goal.id ? 'tree-row--active' : ''}`}
            style={{ paddingLeft: `${14 + depth * 18}px` }}
            onClick={() => onSelect(goal)}
          >
            <span className="tree-row__branch">{depth ? '↳' : '○'}</span>
            <span>{goal.title}</span>
            <span className="tree-row__status">
              {goal.status.toLowerCase().replaceAll('_', ' ')}
            </span>
          </button>
          {children.length > 0 && (
            <GoalTree
              nodes={children}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
}

export function App() {
  const [user, setUser] = useState<UserContext | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [hierarchy, setHierarchy] = useState<GoalNode[]>([]);
  const [page, setPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [availableActions, setAvailableActions] = useState<Action[]>([]);
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
  const [plan, setPlan] = useState<{
    dailyPlan: { id: string; date: string };
    schedules: {
      id: string;
      actionId: string;
      startAt: string;
      endAt: string;
    }[];
  } | null>(null);
  const [scheduleActionId, setScheduleActionId] = useState('');
  const [scheduleStart, setScheduleStart] = useState('09:00');
  const [scheduleEnd, setScheduleEnd] = useState('10:00');

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
  }, [user, selectedGoal, handleError]);

  useEffect(() => {
    if (page !== 'planning' || !user) return;
    let active = true;
    (async () => {
      try {
        try {
          const result = await api.dailyPlan(planningDate);
          if (active) setPlan(result);
        } catch (error) {
          if (error instanceof ApiError && error.status === 404) {
            if (active) setPlan(null);
          } else throw error;
        }
      } catch (error) {
        if (active) handleError(error);
      }
    })();
    return () => {
      active = false;
    };
  }, [page, planningDate, user, handleError]);

  useEffect(() => {
    if (page !== 'planning' || !user || goals.length === 0) {
      setAvailableActions([]);
      return;
    }
    let active = true;
    Promise.all(goals.map((goal) => api.actions(goal.id)))
      .then((lists) => {
        if (active) setAvailableActions(lists.flat());
      })
      .catch((error) => {
        if (active) handleError(error);
      });
    return () => {
      active = false;
    };
  }, [page, user, goals, handleError]);

  const displayedGoals = selectedProject
    ? goals.filter((goal) => goal.projectId === selectedProject.id)
    : goals;
  const visibleHierarchy = useMemo(() => {
    if (!selectedProject) return hierarchy;
    return hierarchy
      .map((node) => node)
      .filter((node) => node.goal.projectId === selectedProject.id);
  }, [hierarchy, selectedProject]);

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

  async function createPlan() {
    try {
      const dailyPlan = await api.createDailyPlan(planningDate);
      setPlan({ dailyPlan, schedules: [] });
      notify({ kind: 'success', text: 'Daily plan created.' });
    } catch (error) {
      handleError(error);
    }
  }

  async function addSchedule(event: FormEvent) {
    event.preventDefault();
    if (!scheduleActionId) return;
    try {
      const action = availableActions.find(
        (item) => item.id === scheduleActionId,
      );
      if (!action) throw new Error('Choose a valid action.');
      const startAt = new Date(
        `${planningDate}T${scheduleStart}:00`,
      ).toISOString();
      const endAt = new Date(`${planningDate}T${scheduleEnd}:00`).toISOString();
      const created = await api.createSchedule({
        actionId: action.id,
        startAt,
        endAt,
        dailyPlanId: plan?.dailyPlan.id ?? null,
      });
      if (plan) setPlan({ ...plan, schedules: [...plan.schedules, created] });
      notify({ kind: 'success', text: 'Action scheduled.' });
    } catch (error) {
      handleError(error);
    }
  }

  async function removeSchedule(id: string) {
    try {
      await api.deleteSchedule(id);
      if (plan)
        setPlan({
          ...plan,
          schedules: plan.schedules.filter((schedule) => schedule.id !== id),
        });
      notify({ kind: 'success', text: 'Schedule removed.' });
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
          : 'Plan your day';
  const pageSubtitle =
    page === 'home'
      ? 'A little progress adds up to a lot.'
      : page === 'projects'
        ? 'Shape your ideas into focused projects.'
        : page === 'goals'
          ? 'Keep your bigger picture close.'
          : 'Make time for the work that matters.';

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
            {page === 'planning' && (
              <Button
                variant="secondary"
                onClick={createPlan}
                disabled={!!plan}
              >
                ＋ Create daily plan
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
                  <span className="stat-card__label">ACTIVE PROJECTS</span>
                  <strong>{projects.length}</strong>
                  <small>in your workspace</small>
                </article>
                <article className="stat-card">
                  <span className="stat-card__icon stat-card__icon--sage">
                    ◎
                  </span>
                  <span className="stat-card__label">YOUR GOALS</span>
                  <strong>{goals.length}</strong>
                  <small>ideas in motion</small>
                </article>
                <article className="stat-card">
                  <span className="stat-card__icon stat-card__icon--blue">
                    ↗
                  </span>
                  <span className="stat-card__label">COMPLETED ACTIONS</span>
                  <strong>{goals.length ? '—' : '0'}</strong>
                  <small>keep showing up</small>
                </article>
              </div>
              <div className="home-columns">
                <section className="panel">
                  <div className="panel__heading">
                    <div>
                      <h2>Recent projects</h2>
                      <p>Your active areas of focus</p>
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
                      <h2>Goals in focus</h2>
                      <p>Your next meaningful steps</p>
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
                        Open project <b>→</b>
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
                        <strong>Progress</strong>
                        <span>
                          {progress?.goalProgress.progressValue == null
                            ? 'Not enough data'
                            : `${Math.round(progress.goalProgress.progressValue)}%`}
                        </span>
                      </div>
                      <div className="progress-track">
                        <span
                          style={{
                            width: `${Math.max(0, Math.min(100, progress?.goalProgress.progressValue ?? 0))}%`,
                          }}
                        />
                      </div>
                      <small>
                        {progress?.calculationStatus
                          .replaceAll('_', ' ')
                          .toLowerCase() ??
                          'Progress updates as actions are completed'}
                      </small>
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
                          <div className="item-row" key={milestone.id}>
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
                            {milestone.status !== 'COMPLETED' && (
                              <button
                                className="text-link"
                                onClick={() => completeMilestone(milestone)}
                              >
                                Complete
                              </button>
                            )}
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
                          <div className="action-row" key={action.id}>
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
                            <button
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
                        ))
                      ) : (
                        <p className="empty-line">
                          No actions yet. Add a small next step.
                        </p>
                      )}
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
            <div className="planning-layout">
              <section className="panel planning-panel">
                <div className="panel__heading">
                  <div>
                    <h2>Your day, with intention</h2>
                    <p>Schedule actions into focused blocks of time.</p>
                  </div>
                  <Field
                    label="Choose date"
                    type="date"
                    value={planningDate}
                    onChange={(event) => setPlanningDate(event.target.value)}
                  />
                </div>
                {!plan ? (
                  <EmptyState
                    icon="▤"
                    title="A little structure goes a long way"
                    body="Create a daily plan for this date, then add actions you want to focus on."
                    action={
                      <Button onClick={createPlan}>Create daily plan</Button>
                    }
                  />
                ) : (
                  <>
                    <div className="plan-date-strip">
                      <span className="plan-date-strip__day">
                        {new Date(
                          `${planningDate}T12:00:00`,
                        ).toLocaleDateString(undefined, { weekday: 'long' })}
                      </span>
                      <strong>{dateLabel(planningDate)}</strong>
                      <span className="count-pill">
                        {plan.schedules.length} scheduled
                      </span>
                    </div>
                    <div className="schedule-list">
                      {plan.schedules.length ? (
                        plan.schedules
                          .sort((a, b) => a.startAt.localeCompare(b.startAt))
                          .map((schedule) => (
                            <div className="schedule-row" key={schedule.id}>
                              <span className="schedule-row__time">
                                {new Date(schedule.startAt).toLocaleTimeString(
                                  [],
                                  { hour: '2-digit', minute: '2-digit' },
                                )}
                                <small>
                                  {new Date(schedule.endAt).toLocaleTimeString(
                                    [],
                                    { hour: '2-digit', minute: '2-digit' },
                                  )}
                                </small>
                              </span>
                              <span className="schedule-row__line" />
                              <span className="schedule-row__body">
                                <strong>
                                  {availableActions.find(
                                    (action) => action.id === schedule.actionId,
                                  )?.title ?? 'Scheduled action'}
                                </strong>
                                <small>Focused work</small>
                              </span>
                              <button
                                className="icon-button"
                                aria-label="Remove schedule"
                                onClick={() => removeSchedule(schedule.id)}
                              >
                                ×
                              </button>
                            </div>
                          ))
                      ) : (
                        <div className="empty-line empty-line--center">
                          Your day is open. Add an action below.
                        </div>
                      )}
                    </div>
                    <form className="schedule-form" onSubmit={addSchedule}>
                      <label className="field">
                        <span>Action</span>
                        <select
                          value={scheduleActionId}
                          onChange={(event) =>
                            setScheduleActionId(event.target.value)
                          }
                          required
                        >
                          <option value="">Choose an action</option>
                          {availableActions
                            .filter((action) => action.status !== 'COMPLETED')
                            .map((action) => (
                              <option value={action.id} key={action.id}>
                                {action.title} ·{' '}
                                {goals.find((goal) => goal.id === action.goalId)
                                  ?.title ?? 'Goal'}
                              </option>
                            ))}
                        </select>
                      </label>
                      <Field
                        label="Start"
                        type="time"
                        value={scheduleStart}
                        onChange={(event) =>
                          setScheduleStart(event.target.value)
                        }
                        required
                      />
                      <Field
                        label="End"
                        type="time"
                        value={scheduleEnd}
                        onChange={(event) => setScheduleEnd(event.target.value)}
                        required
                      />
                      <Button
                        disabled={
                          !availableActions.some(
                            (action) => action.status !== 'COMPLETED',
                          )
                        }
                      >
                        Schedule action
                      </Button>
                    </form>
                  </>
                )}
              </section>
              <aside className="panel planning-aside">
                <span className="planning-aside__icon">✦</span>
                <h2>Make it manageable</h2>
                <p>
                  A realistic plan leaves room to think, pause, and adjust.
                  Start with one action that would make today feel meaningful.
                </p>
                <div className="planning-aside__note">
                  <strong>Planning tip</strong>
                  <span>Keep each focus block small enough to begin.</span>
                </div>
              </aside>
            </div>
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
