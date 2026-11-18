
import { useMemo, useState } from 'react';
import type { Action, Goal, Project, Schedule } from '../lib/api';
import './dashboard-home.css';

interface DashboardHomeProps {
  email: string | null;
  goals: Goal[];
  projects: Project[];
  actions: Action[];
  nextAction?: Action;
  nextSchedule: Schedule | null;
  baseDataLoaded: boolean;
  actionsLoaded: boolean;
  actionsLoadError: boolean;
  schedulesLoaded: boolean;
  schedulesLoadError: boolean;
  onNewGoal: () => void;
  onNewProject: () => void;
  onOpenGoal: (goal: Goal) => void;
  onOpenProject: (project: Project) => void;
  onOpenExecution: (action: Action) => void;
  onOpenPlanning: () => void;
  onRetryActions: () => void;
  onRetrySchedules: () => void;
  onViewGoals: () => void;
  onViewProjects: () => void;
}

function formatDate(value?: string | null): string {
  if (!value) return 'No target date';

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatSchedule(value: string): string {
  const date = new Date(value);

  return date.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getGoalStatus(status: string): string {
  return status.toLowerCase().replaceAll('_', ' ');
}

export function DashboardHome({
  email,
  goals,
  projects,
  actions,
  nextAction,
  nextSchedule,
  baseDataLoaded,
  actionsLoaded,
  actionsLoadError,
  schedulesLoaded,
  schedulesLoadError,
  onNewGoal,
  onNewProject,
  onOpenGoal,
  onOpenProject,
  onOpenExecution,
  onOpenPlanning,
  onRetryActions,
  onRetrySchedules,
  onViewGoals,
  onViewProjects,
}: DashboardHomeProps) {
  const [search, setSearch] = useState('');

  const filteredGoals = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return goals;

    return goals.filter((goal) => {
      const projectName =
        projects.find((project) => project.id === goal.projectId)?.name ?? '';

      return (
        goal.title.toLowerCase().includes(keyword) ||
        (goal.description ?? '').toLowerCase().includes(keyword) ||
        projectName.toLowerCase().includes(keyword)
      );
    });
  }, [goals, projects, search]);

  const filteredProjects = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return projects;

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(keyword) ||
        (project.description ?? '').toLowerCase().includes(keyword),
    );
  }, [projects, search]);

  const completedActions = actions.filter(
    (action) => action.status === 'COMPLETED',
  ).length;

  const openActions = actions.filter(
    (action) => action.status !== 'COMPLETED',
  ).length;

  const independentGoals = goals.filter(
    (goal) => goal.projectId === null,
  ).length;

  const nextActionGoal = nextAction
    ? goals.find((goal) => goal.id === nextAction.goalId)
    : null;

  const scheduledAction = nextSchedule
    ? actions.find((action) => action.id === nextSchedule.actionId)
    : null;

  return (
    <div className="dashboard-home">
      <section className="dh-welcome">
        <div className="dh-welcome__content">
          <span className="dh-eyebrow">YOUR PERSONAL OVERVIEW</span>

          <h2>{getGreeting()}{email ? `, ${email.split('@')[0]}` : ''}.</h2>

          <p>
            Keep your intentions visible and move one meaningful step forward.
          </p>

          <div className="dh-welcome__actions">
            <button
              type="button"
              className="dh-button dh-button--primary"
              onClick={onNewGoal}
            >
              <span>＋</span> Create a goal
            </button>

            <button
              type="button"
              className="dh-button dh-button--secondary"
              onClick={onNewProject}
            >
              <span>＋</span> New project
            </button>
          </div>
        </div>

        <div className="dh-welcome__decoration" aria-hidden="true">
          <div className="dh-orbit dh-orbit--one" />
          <div className="dh-orbit dh-orbit--two" />
          <div className="dh-orbit__center">f</div>
        </div>
      </section>

      <section className="dh-stats">
        <article className="dh-stat">
          <span className="dh-stat__label">GOALS</span>
          <strong>{baseDataLoaded ? goals.length : '—'}</strong>
          <small>
            {baseDataLoaded
              ? `${independentGoals} independent`
              : 'Loading goals'}
          </small>
        </article>

        <article className="dh-stat">
          <span className="dh-stat__label">PROJECTS</span>
          <strong>{baseDataLoaded ? projects.length : '—'}</strong>
          <small>Organized areas of work</small>
        </article>

        <article className="dh-stat">
          <span className="dh-stat__label">OPEN ACTIONS</span>
          <strong>{actionsLoaded ? openActions : '—'}</strong>
          <small>Steps still to complete</small>
        </article>

        <article className="dh-stat">
          <span className="dh-stat__label">COMPLETED ACTIONS</span>
          <strong>{actionsLoaded ? completedActions : '—'}</strong>
          <small>Completed steps</small>
        </article>
      </section>

      <section className="dh-focus-grid">
        <article className="dh-focus-card dh-focus-card--action">
          <div className="dh-section-label">
            <span className="dh-section-label__icon">↗</span>
            <span>NEXT ACTION</span>
          </div>

          {actionsLoadError ? (
            <div className="dh-state">
              <strong>Actions could not be loaded</strong>
              <button type="button" onClick={onRetryActions}>
                Try again
              </button>
            </div>
          ) : !actionsLoaded ? (
            <p className="dh-muted">Loading your actions…</p>
          ) : nextAction ? (
            <div className="dh-focus-content">
              <h3>{nextAction.title}</h3>

              <p>
                {nextActionGoal?.title ?? 'Goal'} ·{' '}
                {nextAction.status === 'IN_PROGRESS'
                  ? 'In progress'
                  : 'To do'}
              </p>

              <button
                type="button"
                className="dh-inline-link"
                onClick={() => onOpenExecution(nextAction)}
              >
                Open execution <span>→</span>
              </button>
            </div>
          ) : (
            <div className="dh-state">
              <strong>No open actions</strong>
              <p>Create a small action under one of your goals.</p>
              <button type="button" onClick={onViewGoals}>
                Explore goals
              </button>
            </div>
          )}
        </article>

        <article className="dh-focus-card dh-focus-card--schedule">
          <div className="dh-section-label">
            <span className="dh-section-label__icon">▤</span>
            <span>UPCOMING SCHEDULE</span>
          </div>

          {schedulesLoadError ? (
            <div className="dh-state">
              <strong>Schedule could not be loaded</strong>
              <button type="button" onClick={onRetrySchedules}>
                Try again
              </button>
            </div>
          ) : !schedulesLoaded ? (
            <p className="dh-muted">Loading your schedule…</p>
          ) : nextSchedule ? (
            <div className="dh-focus-content">
              <h3>{scheduledAction?.title ?? 'Scheduled action'}</h3>

              <p>{formatSchedule(nextSchedule.startAt)}</p>

              <button
                type="button"
                className="dh-inline-link"
                onClick={onOpenPlanning}
              >
                Open planning <span>→</span>
              </button>
            </div>
          ) : (
            <div className="dh-state">
              <strong>Nothing scheduled this week</strong>
              <p>Choose a time for one of your open actions.</p>
              <button type="button" onClick={onOpenPlanning}>
                Open planning
              </button>
            </div>
          )}
        </article>
      </section>

      <section className="dh-workspace-section">
        <div className="dh-section-heading">
          <div>
            <span className="dh-eyebrow">YOUR WORKSPACE</span>
            <h2>Everything in motion</h2>
            <p>Find the goal or project you want to move forward.</p>
          </div>

          <label className="dh-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search goals and projects…"
              aria-label="Search goals and projects"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}
          </label>
        </div>

        <div className="dh-content-grid">
          <section className="dh-list-panel">
            <div className="dh-panel-heading">
              <div>
                <h3>Goals</h3>
                <span>{baseDataLoaded ? goals.length : '—'} total</span>
              </div>

              <button
                type="button"
                className="dh-text-button"
                onClick={onViewGoals}
              >
                View all <span>→</span>
              </button>
            </div>

            {!baseDataLoaded ? (
              <p className="dh-empty-line">Loading goals…</p>
            ) : filteredGoals.length === 0 ? (
              <div className="dh-empty">
                <span className="dh-empty__icon">◎</span>
                <strong>
                  {search ? 'No matching goals' : 'No goals yet'}
                </strong>
                <p>
                  {search
                    ? 'Try another search term.'
                    : 'Start with an outcome that matters to you.'}
                </p>
                {!search && (
                  <button
                    type="button"
                    className="dh-button dh-button--secondary"
                    onClick={onNewGoal}
                  >
                    Create a goal
                  </button>
                )}
              </div>
            ) : (
              <div className="dh-goal-list">
                {filteredGoals.slice(0, 6).map((goal) => {
                  const project = projects.find(
                    (item) => item.id === goal.projectId,
                  );

                  return (
                    <button
                      type="button"
                      className="dh-goal-row"
                      key={goal.id}
                      onClick={() => onOpenGoal(goal)}
                    >
                      <span className="dh-goal-row__mark">◎</span>

                      <span className="dh-row-main">
                        <strong>{goal.title}</strong>
                        <small>
                          {project?.name ?? 'Independent goal'}
                        </small>
                      </span>

                      <span className="dh-row-meta">
                        <span className="dh-status">
                          {getGoalStatus(goal.status)}
                        </span>
                        <small>{formatDate(goal.targetDate)}</small>
                      </span>

                      <span className="dh-row-arrow">→</span>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredGoals.length > 6 && (
              <button
                type="button"
                className="dh-list-footer"
                onClick={onViewGoals}
              >
                View all {filteredGoals.length} goals →
              </button>
            )}
          </section>

          <section className="dh-list-panel">
            <div className="dh-panel-heading">
              <div>
                <h3>Projects</h3>
                <span>{baseDataLoaded ? projects.length : '—'} total</span>
              </div>

              <button
                type="button"
                className="dh-text-button"
                onClick={onViewProjects}
              >
                View all <span>→</span>
              </button>
            </div>

            {!baseDataLoaded ? (
              <p className="dh-empty-line">Loading projects…</p>
            ) : filteredProjects.length === 0 ? (
              <div className="dh-empty">
                <span className="dh-empty__icon">▦</span>
                <strong>
                  {search ? 'No matching projects' : 'No projects yet'}
                </strong>
                <p>
                  {search
                    ? 'Try another search term.'
                    : 'Create a project when you need to group related goals.'}
                </p>
                {!search && (
                  <button
                    type="button"
                    className="dh-button dh-button--secondary"
                    onClick={onNewProject}
                  >
                    Create a project
                  </button>
                )}
              </div>
            ) : (
              <div className="dh-project-list">
                {filteredProjects.slice(0, 6).map((project, index) => {
                  const projectGoals = goals.filter(
                    (goal) => goal.projectId === project.id,
                  );

                  return (
                    <button
                      type="button"
                      className="dh-project-row"
                      key={project.id}
                      onClick={() => onOpenProject(project)}
                    >
                      <span
                        className={`dh-project-mark dh-project-mark--${index % 3}`}
                      >
                        {project.name.slice(0, 1).toUpperCase()}
                      </span>

                      <span className="dh-row-main">
                        <strong>{project.name}</strong>
                        <small>
                          {project.description || 'No description'}
                        </small>
                      </span>

                      <span className="dh-project-count">
                        {projectGoals.length} goals
                      </span>

                      <span className="dh-row-arrow">→</span>
                    </button>
                  );
                })}
              </div>
            )}

            {filteredProjects.length > 6 && (
              <button
                type="button"
                className="dh-list-footer"
                onClick={onViewProjects}
              >
                View all {filteredProjects.length} projects →
              </button>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
