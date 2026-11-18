import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import type {
  Action,
  ActionStatus,
  Goal,
  GoalNode,
  Measurement,
  MeasurementRecord,
  Milestone,
  ProgressSummary,
  Project,
} from '../lib/api';
import './goal-workspace.css';

type GoalView = 'tree' | 'flow' | 'horizon' | 'list';

interface GoalWorkspaceProps {
  goals: Goal[];
  hierarchy: GoalNode[];
  selectedGoal: Goal | null;
  onSelectGoal: (goal: Goal) => void;
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project | null) => void;
  milestones: Milestone[];
  actions: Action[];
  workspaceActions: Action[];
  progress: ProgressSummary | null;
  measurements: Measurement[];
  measurementHistory: Record<string, MeasurementRecord[]>;
  measurementLoadState: 'LOADING' | 'READY' | 'ERROR';
  onRefreshMeasurements: () => void;
  measurementFormOpen: boolean;
  setMeasurementFormOpen: (value: boolean | ((current: boolean) => boolean)) => void;
  measurementLabel: string;
  setMeasurementLabel: (value: string) => void;
  measurementType: Measurement['valueType'];
  setMeasurementType: (value: Measurement['valueType']) => void;
  measurementUnit: string;
  setMeasurementUnit: (value: string) => void;
  measurementTarget: string;
  setMeasurementTarget: (value: string) => void;
  measurementValues: Record<string, string>;
  setMeasurementValues: (
    value:
      | Record<string, string>
      | ((current: Record<string, string>) => Record<string, string>),
  ) => void;
  onRecordMeasurement: (measurement: Measurement) => Promise<void>;
  onSaveMeasurement: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  editingMeasurement: string | null;
  setEditingMeasurement: (value: string | null | ((current: string | null) => string | null)) => void;
  onSaveMeasurementEdit: (event: FormEvent<HTMLFormElement>, measurement: Measurement) => Promise<void>;
  editingMilestone: string | null;
  setEditingMilestone: (value: string | null | ((current: string | null) => string | null)) => void;
  onSaveMilestone: (event: FormEvent<HTMLFormElement>, milestone: Milestone) => Promise<void>;
  onCompleteMilestone: (milestone: Milestone) => Promise<void>;
  editingAction: string | null;
  setEditingAction: (value: string | null | ((current: string | null) => string | null)) => void;
  onSaveAction: (event: FormEvent<HTMLFormElement>, action: Action) => Promise<void>;
  onUpdateAction: (action: Action, status: ActionStatus) => Promise<void>;
  onOpenExecution: (action: Action) => Promise<void>;
  onAddGoal: () => void;
  onAddChildGoal: () => void;
  onAddMilestone: () => void;
  onAddAction: () => void;
  busy: boolean;
}

const todayISO = () => {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};

function dateLabel(value?: string | null): string {
  if (!value) return 'Date not set';
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function daysSince(value: string): number {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed)
    ? Math.max(0, Math.floor((Date.now() - parsed) / 86_400_000))
    : 0;
}

function flattenHierarchy(nodes: GoalNode[]): Goal[] {
  return nodes.flatMap((node) => [node.goal, ...flattenHierarchy(node.children)]);
}

function statusLabel(status: string): string {
  return status.toLowerCase().replaceAll('_', ' ');
}

function ActionStatusSelect({
  action,
  onChange,
}: {
  action: Action;
  onChange: (status: ActionStatus) => void;
}) {
  return (
    <select
      aria-label={`Update ${action.title} status`}
      value={action.status}
      onChange={(event) => onChange(event.target.value as ActionStatus)}
    >
      <option value="TODO">To do</option>
      <option value="IN_PROGRESS">In progress</option>
      <option value="COMPLETED">Completed</option>
    </select>
  );
}

export function GoalWorkspace(props: GoalWorkspaceProps) {
  const [view, setView] = useState<GoalView>('tree');
  const [showAllDone, setShowAllDone] = useState(false);

  const flattenedGoals = useMemo(
    () => flattenHierarchy(props.hierarchy),
    [props.hierarchy],
  );
  const selectedGoal =
    props.selectedGoal &&
    props.goals.some((goal) => goal.id === props.selectedGoal?.id)
      ? props.selectedGoal
      : null;

  const scopedActions = props.workspaceActions.filter(
    (action) => !action.archivedAt && props.goals.some((goal) => goal.id === action.goalId),
  );
  const focusAction =
    scopedActions.find((action) => action.status === 'IN_PROGRESS') ??
    scopedActions.find((action) => action.status === 'TODO');

  const actionGroups = useMemo(
    () => ({
      moving: scopedActions.filter((action) => action.status === 'IN_PROGRESS'),
      next: scopedActions.filter((action) => action.status === 'TODO'),
      done: scopedActions.filter((action) => action.status === 'COMPLETED'),
    }),
    [scopedActions],
  );

  const today = todayISO();
  const overdueGoals = props.goals.filter(
    (goal) => goal.status !== 'COMPLETED' && goal.targetDate && goal.targetDate < today,
  );
  const overdueMilestones = props.milestones.filter(
    (milestone) =>
      milestone.status !== 'COMPLETED' &&
      milestone.targetDate &&
      milestone.targetDate < today,
  );
  const staleActions = scopedActions.filter(
    (action) => action.status === 'IN_PROGRESS' && daysSince(action.updatedAt) >= 7,
  );
  const hasSelectedTarget = Boolean(selectedGoal?.targetDate);

  return (
    <div className="goal-workspace">
      <section className="gw-focus" aria-label="Focus">
        <div className="gw-focus__main">
          <span className="gw-kicker">NEXT MEANINGFUL STEP</span>
          <h2>{focusAction?.title ?? 'Choose one outcome to move forward'}</h2>
          <p>
            {focusAction
              ? `Under ${props.goals.find((goal) => goal.id === focusAction.goalId)?.title ?? 'your Goal'}. Keep this action small enough to start.`
              : selectedGoal
                ? 'This Goal has no open Action yet. Add one concrete next step instead of planning the entire journey.'
                : 'Pick an outcome below. FLOW-UP will keep the next step visible without asking you to plan everything today.'}
          </p>
          <div className="gw-focus__meta">
            <span className="gw-chip">{focusAction ? (focusAction.status === 'IN_PROGRESS' ? 'In progress' : 'To do') : 'Focus'}</span>
            {selectedGoal && <span className="gw-chip">{selectedGoal.title}</span>}
            {selectedGoal?.targetDate && <span className="gw-chip">Target · {dateLabel(selectedGoal.targetDate)}</span>}
          </div>
        </div>
        <div className="gw-focus__next">
          <span className="gw-overline">FOCUS QUEUE</span>
          <strong>{focusAction?.title ?? 'Nothing queued yet'}</strong>
          <button
            type="button"
            onClick={() => (focusAction ? void props.onOpenExecution(focusAction) : props.onAddAction())}
          >
            {focusAction ? 'Open execution →' : 'Add first Action →'}
          </button>
        </div>
      </section>

      <div className="gw-toolbar">
        <div className="gw-view-switch" role="group" aria-label="Goal views">
          {([
            ['tree', 'Tree'],
            ['flow', 'Flow board'],
            ['horizon', 'Horizon'],
            ['list', 'List'],
          ] as [GoalView, string][]).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="gw-toolbar__right">
          <label className="gw-project-filter">
            <span>Project</span>
            <select
              aria-label="Filter by project"
              value={props.selectedProject?.id ?? ''}
              onChange={(event) =>
                props.onSelectProject(
                  props.projects.find((project) => project.id === event.target.value) ?? null,
                )
              }
            >
              <option value="">All projects</option>
              {props.projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </label>
          <button className="gw-primary-link" type="button" onClick={props.onAddGoal}>
            + New Goal
          </button>
        </div>
      </div>

      <div className="gw-layout">
        <section
          className="gw-board"
          aria-label={
            view === 'tree'
              ? 'Goal tree'
              : view === 'flow'
                ? 'Goal flow board'
                : view === 'horizon'
                  ? 'Reverse timeline'
                  : 'Goal list'
          }
        >
          {view === 'tree' && (
            <>
              <BoardHeading
                title="Goal structure"
                subtitle="Use hierarchy only when one outcome genuinely contains another."
                count={`${flattenedGoals.length} Goals`}
              />
              {props.hierarchy.length ? (
                <div className="gw-tree">
                  {props.hierarchy.map((node) => (
                    <TreeNode
                      key={node.goal.id}
                      node={node}
                      selectedId={selectedGoal?.id ?? null}
                      onSelect={props.onSelectGoal}
                    />
                  ))}
                </div>
              ) : (
                <EmptyBoard
                  title="Start with an outcome"
                  body="Create a Goal directly. A Project is optional; smaller child Goals are only useful when the outcome truly needs them."
                  action="Create Goal"
                  onAction={props.onAddGoal}
                />
              )}
            </>
          )}

          {view === 'flow' && (
            <>
              <BoardHeading
                title="Flow & friction"
                subtitle="A working view of execution. These signals do not change your Action statuses."
                count={`${staleActions.length + overdueGoals.length + overdueMilestones.length} signals`}
              />
              {staleActions.map((action) => (
                <div className="gw-signal" key={`stale-${action.id}`}>
                  <strong>Possible friction · {action.title}</strong>
                  <p>
                    No update for {daysSince(action.updatedAt)} days. Is this still the right next step, or should it be made smaller?
                  </p>
                  <button type="button" onClick={() => props.onSelectGoal(props.goals.find((goal) => goal.id === action.goalId)!)}>
                    Review Goal →
                  </button>
                </div>
              ))}
              {overdueGoals.map((goal) => (
                <div className="gw-signal gw-signal--late" key={`goal-${goal.id}`}>
                  <strong>Target date passed · {goal.title}</strong>
                  <p>Target was {dateLabel(goal.targetDate)}. Review the date or choose a nearer checkpoint.</p>
                  <button type="button" onClick={() => props.onSelectGoal(goal)}>Review Goal →</button>
                </div>
              ))}
              {overdueMilestones.map((milestone) => (
                <div className="gw-signal gw-signal--late" key={`milestone-${milestone.id}`}>
                  <strong>Checkpoint overdue · {milestone.title}</strong>
                  <p>Target was {dateLabel(milestone.targetDate)}. Confirm whether this checkpoint is still relevant.</p>
                </div>
              ))}

              <div className="gw-lanes">
                <FlowLane
                  title="Moving"
                  subtitle="In progress"
                  actions={actionGroups.moving}
                  goals={props.goals}
                  onOpenExecution={props.onOpenExecution}
                />
                <FlowLane
                  title="Next"
                  subtitle="To do"
                  actions={actionGroups.next}
                  goals={props.goals}
                  onOpenExecution={props.onOpenExecution}
                />
                <FlowLane
                  title="Done"
                  subtitle="Completed"
                  actions={showAllDone ? actionGroups.done : actionGroups.done.slice(0, 5)}
                  goals={props.goals}
                  onOpenExecution={props.onOpenExecution}
                />
              </div>
              {actionGroups.done.length > 5 && (
                <button className="gw-text-button" type="button" onClick={() => setShowAllDone((value) => !value)}>
                  {showAllDone ? 'Show fewer completed' : `Show all ${actionGroups.done.length} completed`}
                </button>
              )}
              {!scopedActions.length && !overdueGoals.length && !overdueMilestones.length && (
                <EmptyBoard
                  title="No execution signals yet"
                  body="Add a small Action under a Goal. Flow & friction becomes useful once there is real work to observe."
                  action="Add an Action"
                  onAction={selectedGoal ? props.onAddAction : props.onAddGoal}
                />
              )}
              {!!scopedActions.length && !staleActions.length && !overdueGoals.length && !overdueMilestones.length && (
                <p className="gw-clear-signal">No configured friction signal is currently visible. This is not a rating of your effort—only a check of dates and update history.</p>
              )}
            </>
          )}

          {view === 'horizon' && (
            <>
              <BoardHeading
                title="Reverse horizon"
                subtitle="Start at the destination and work backwards toward a useful next decision."
              />
              {selectedGoal ? (
                <div className="gw-horizon">
                  <div className="gw-horizon__caption">
                    <span>NOW</span>
                    <span>DESTINATION</span>
                  </div>
                  <div className="gw-horizon__line">
                    <div className="gw-horizon__node gw-horizon__node--now">
                      <span className="gw-overline">TODAY · {dateLabel(today)}</span>
                      <strong>What can move now?</strong>
                      <small>{focusAction?.title ?? 'No next Action is defined yet.'}</small>
                    </div>
                    <div className="gw-horizon__node gw-horizon__node--fog">
                      <span className="gw-overline">UNRESOLVED HORIZON</span>
                      <strong>What must become true next?</strong>
                      <small>
                        {props.milestones.length
                          ? 'Use the confirmed checkpoints below. Avoid inventing intermediate dates.'
                          : 'This planning space is intentionally unresolved until you identify a real checkpoint.'}
                      </small>
                    </div>
                    <div className="gw-horizon__node gw-horizon__node--future">
                      <span className="gw-overline">DESTINATION</span>
                      <strong>{selectedGoal.title}</strong>
                      <small>{hasSelectedTarget ? dateLabel(selectedGoal.targetDate) : 'Target date not set'}</small>
                    </div>
                  </div>
                  {!hasSelectedTarget && (
                    <p className="gw-fog-note">The destination has no date yet. Set one on the Goal to anchor the reverse timeline.</p>
                  )}
                  <div className="gw-checkpoints">
                    <div className="gw-subheading">
                      <h4>Confirmed checkpoints</h4>
                      <span>{props.milestones.length}</span>
                    </div>
                    {props.milestones.length ? props.milestones.map((milestone) => (
                      <div className="gw-checkpoint" key={milestone.id}>
                        <span className={`gw-checkpoint__dot ${milestone.status === 'COMPLETED' ? 'is-done' : ''}`} />
                        <strong>{milestone.title}</strong>
                        <small>{dateLabel(milestone.targetDate)}</small>
                        <span>{milestone.status === 'COMPLETED' ? 'Completed' : 'Planned'}</span>
                      </div>
                    )) : (
                      <EmptyBoard
                        title="No confirmed checkpoints"
                        body="Add a Milestone when you know a meaningful intermediate result. You do not need to fill every time horizon."
                        action="Add Milestone"
                        onAction={props.onAddMilestone}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <EmptyBoard
                  title="Choose a destination"
                  body="Select a Goal in Tree or List view to inspect its reverse horizon."
                />
              )}
            </>
          )}

          {view === 'list' && (
            <>
              <BoardHeading
                title="All outcomes"
                subtitle="A compact scan of Goals without opening each detail panel."
                count={`${props.goals.length} Goals`}
              />
              {props.goals.length ? (
                <div className="gw-list">
                  {props.goals.map((goal) => (
                    <button
                      type="button"
                      key={goal.id}
                      className="gw-list-row"
                      aria-current={selectedGoal?.id === goal.id}
                      onClick={() => props.onSelectGoal(goal)}
                    >
                      <span className="gw-list-row__name">{goal.title}</span>
                      <span className="gw-list-row__status">{statusLabel(goal.status)}</span>
                      <span className="gw-list-row__date">{dateLabel(goal.targetDate)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <EmptyBoard
                  title="No Goals yet"
                  body="Create one clear outcome. You can decide later whether it needs child Goals or Milestones."
                  action="Create Goal"
                  onAction={props.onAddGoal}
                />
              )}
            </>
          )}
        </section>

        <aside className="gw-detail" aria-label="Selected Goal details">
          {selectedGoal ? (
            <GoalDetail {...props} goal={selectedGoal} />
          ) : (
            <div className="gw-empty">
              <strong>Choose an outcome</strong>
              Select any Goal to inspect its checkpoints, Actions, and evidence.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function BoardHeading({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle: string;
  count?: string;
}) {
  return (
    <div className="gw-board__head">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      {count && <span className="gw-chip">{count}</span>}
    </div>
  );
}

function EmptyBoard({
  title,
  body,
  action,
  onAction,
}: {
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="gw-empty">
      <strong>{title}</strong>
      <p>{body}</p>
      {action && onAction && (
        <button type="button" className="gw-empty__action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

function TreeNode({
  node,
  selectedId,
  onSelect,
  depth = 0,
}: {
  node: GoalNode;
  selectedId: string | null;
  onSelect: (goal: Goal) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="gw-tree__item">
      <div className="gw-tree__node-row">
        <button
          type="button"
          className="gw-tree__select"
          aria-current={selectedId === node.goal.id}
          style={{ paddingLeft: 10 + depth * 19 }}
          onClick={() => onSelect(node.goal)}
        >
          <span className="gw-tree__branch" />
          <span className="gw-tree__title">{node.goal.title}</span>
          <span className="gw-tree__status">{statusLabel(node.goal.status)}</span>
        </button>
        {!!node.children.length && (
          <button
            type="button"
            className="gw-tree__toggle"
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${node.goal.title}`}
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? '−' : '+'}
          </button>
        )}
      </div>
      {expanded && node.children.map((child) => (
        <TreeNode
          key={child.goal.id}
          node={child}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

function FlowLane({
  title,
  subtitle,
  actions,
  goals,
  onOpenExecution,
}: {
  title: string;
  subtitle: string;
  actions: Action[];
  goals: Goal[];
  onOpenExecution: (action: Action) => Promise<void>;
}) {
  return (
    <section className="gw-lane">
      <div className="gw-lane__head">
        <div><strong>{title}</strong><small>{subtitle}</small></div>
        <span>{actions.length}</span>
      </div>
      <div className="gw-lane__cards">
        {actions.length ? actions.map((action) => (
          <article className="gw-action" key={action.id}>
            <strong>{action.title}</strong>
            <small>{goals.find((goal) => goal.id === action.goalId)?.title ?? 'Goal'}</small>
            <button type="button" onClick={() => void onOpenExecution(action)}>Open execution →</button>
          </article>
        )) : <p className="gw-lane__empty">Nothing here yet</p>}
      </div>
    </section>
  );
}

function GoalDetail(props: GoalWorkspaceProps & { goal: Goal }) {
  const { goal } = props;
  const progressValue = props.progress?.goalProgress.progressValue;
  const openActions = props.actions.filter((action) => !action.archivedAt);

  return (
    <div className="gw-detail__content">
      <div className="gw-detail__top">
        <span className="gw-overline">SELECTED OUTCOME</span>
        <span className="gw-chip">{statusLabel(goal.status)}</span>
      </div>
      <h3>{goal.title}</h3>
      <p className="gw-detail__description">
        {goal.description || 'No description yet. Keep the reason behind this outcome visible.'}
      </p>
      <div className="gw-detail__meta">
        <span>Target · {dateLabel(goal.targetDate)}</span>
        <span>Project · {props.projects.find((project) => project.id === goal.projectId)?.name ?? 'Workspace goal'}</span>
        <span>
          Outcome progress ·{' '}
          {progressValue == null
            ? props.progress?.goalProgress.calculationStatus === 'RULE_NOT_CONFIGURED'
              ? 'Not configured'
              : 'Not enough evidence'
            : `${Math.round(progressValue)}%`}
        </span>
      </div>
      {progressValue != null && (
        <div className="gw-progress"><span style={{ width: `${Math.max(0, Math.min(100, progressValue))}%` }} /></div>
      )}
      {props.progress?.actionCompletion?.totalActions ? (
        <div className="gw-detail__execution">
          <span>Actions complete</span>
          <strong>
            {props.progress.actionCompletion.completedActions} / {props.progress.actionCompletion.totalActions}
          </strong>
          <div className="gw-progress">
            <span style={{ width: `${props.progress.actionCompletion.completionValue ?? 0}%` }} />
          </div>
        </div>
      ) : (
        <p className="gw-detail__hint">Action completion is separate from Goal outcome progress.</p>
      )}

      <div className="gw-buttons">
        <button type="button" onClick={props.onAddChildGoal}>＋ Child Goal</button>
        <button type="button" onClick={props.onAddMilestone}>＋ Milestone</button>
        <button type="button" onClick={props.onAddAction}>＋ Action</button>
      </div>

      <DetailSection title={`Milestones · ${props.milestones.length}`}>
        {props.milestones.length ? props.milestones.map((milestone) => (
          <div className="gw-entity" key={milestone.id}>
            <div className="gw-entity__row">
              <span className={`gw-entity__mark ${milestone.status === 'COMPLETED' ? 'is-done' : ''}`}>
                {milestone.status === 'COMPLETED' ? '✓' : '·'}
              </span>
              <div className="gw-entity__body">
                <strong>{milestone.title}</strong>
                <small>{dateLabel(milestone.targetDate)} · {statusLabel(milestone.status)}</small>
              </div>
              {milestone.status === 'PENDING' && (
                <>
                  <button className="gw-small-link" type="button" onClick={() => props.setEditingMilestone(props.editingMilestone === milestone.id ? null : milestone.id)}>
                    {props.editingMilestone === milestone.id ? 'Close' : 'Edit'}
                  </button>
                  <button className="gw-small-link" type="button" onClick={() => void props.onCompleteMilestone(milestone)}>Complete</button>
                </>
              )}
            </div>
            {props.editingMilestone === milestone.id && (
              <form className="gw-inline-form" onSubmit={(event) => void props.onSaveMilestone(event, milestone)}>
                <label>Milestone<input name="title" defaultValue={milestone.title} required /></label>
                <label>Target date<input name="targetDate" type="date" defaultValue={milestone.targetDate ?? ''} /></label>
                <button type="submit">Save milestone</button>
              </form>
            )}
          </div>
        )) : <p className="gw-entity__empty">No checkpoints yet. Add one when an intermediate result becomes clear.</p>}
      </DetailSection>

      <DetailSection title={`Actions · ${openActions.length}`}>
        {openActions.length ? openActions.map((action) => (
          <div className="gw-entity" key={action.id}>
            <div className="gw-entity__row">
              <span className={`gw-entity__mark ${action.status === 'COMPLETED' ? 'is-done' : ''}`}>
                {action.status === 'COMPLETED' ? '✓' : '↗'}
              </span>
              <div className="gw-entity__body">
                <strong>{action.title}</strong>
                <small>{statusLabel(action.status)}{action.milestoneId ? ` · ${props.milestones.find((item) => item.id === action.milestoneId)?.title ?? 'Milestone'}` : ''}</small>
              </div>
              <button className="gw-small-link" type="button" onClick={() => void props.onOpenExecution(action)}>Log</button>
              {action.status !== 'COMPLETED' && (
                <ActionStatusSelect action={action} onChange={(status) => void props.onUpdateAction(action, status)} />
              )}
            </div>
            {props.editingAction === action.id && (
              <form className="gw-inline-form" onSubmit={(event) => void props.onSaveAction(event, action)}>
                <label>Action<input name="title" defaultValue={action.title} required /></label>
                <label>Details<textarea name="description" defaultValue={action.description ?? ''} rows={2} /></label>
                <button type="submit">Save action</button>
              </form>
            )}
            {action.status !== 'COMPLETED' && (
              <button className="gw-small-link gw-edit-action" type="button" onClick={() => props.setEditingAction(props.editingAction === action.id ? null : action.id)}>
                {props.editingAction === action.id ? 'Close edit' : 'Edit'}
              </button>
            )}
          </div>
        )) : <p className="gw-entity__empty">No Actions yet. Add one small next step.</p>}
      </DetailSection>

      <DetailSection title={`Measurements · ${props.measurements.length}`}>
        <div className="gw-measurement-add">
          <button className="gw-small-link" type="button" onClick={() => props.setMeasurementFormOpen((value) => !value)}>
            {props.measurementFormOpen ? 'Cancel' : '+ Add measurement'}
          </button>
        </div>
        {props.measurementFormOpen && (
          <form className="gw-inline-form" onSubmit={(event) => void props.onSaveMeasurement(event)}>
            <label>Name<input value={props.measurementLabel} onChange={(event) => props.setMeasurementLabel(event.target.value)} maxLength={120} required /></label>
            <label>Value type
              <select value={props.measurementType} onChange={(event) => props.setMeasurementType(event.target.value as Measurement['valueType'])}>
                <option value="NUMBER">Number</option><option value="TEXT">Text</option><option value="BOOLEAN">Yes / No</option>
              </select>
            </label>
            {props.measurementType === 'NUMBER' && (
              <label>Unit<input value={props.measurementUnit} onChange={(event) => props.setMeasurementUnit(event.target.value)} placeholder="e.g. hours, kg" /></label>
            )}
            <label>Target (optional)
              {props.measurementType === 'BOOLEAN'
                ? <select value={props.measurementTarget} onChange={(event) => props.setMeasurementTarget(event.target.value)}><option value="">No target</option><option value="true">Yes</option><option value="false">No</option></select>
                : <input type={props.measurementType === 'NUMBER' ? 'number' : 'text'} value={props.measurementTarget} onChange={(event) => props.setMeasurementTarget(event.target.value)} />}
            </label>
            <button type="submit" disabled={props.busy || !props.measurementLabel.trim()}>Save measurement</button>
          </form>
        )}
        {props.measurementLoadState === 'LOADING' ? <p className="gw-entity__empty">Loading evidence…</p>
          : props.measurementLoadState === 'ERROR' ? <p className="gw-entity__empty">Measurements unavailable. <button className="gw-small-link" type="button" onClick={props.onRefreshMeasurements}>Retry</button></p>
            : props.measurements.length ? props.measurements.map((measurement) => (
              <MeasurementItem key={measurement.id} measurement={measurement} {...props} />
            )) : <p className="gw-entity__empty">No measurements. Add a measure only when it helps you judge the outcome.</p>}
      </DetailSection>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="gw-detail__section">
      <h4>{title}</h4>
      {children}
    </section>
  );
}

function MeasurementItem(props: GoalWorkspaceProps & { measurement: Measurement }) {
  const { measurement } = props;
  const history = props.measurementHistory[measurement.id] ?? [];
  const latest = history[0];
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <article className="gw-measurement" key={measurement.id}>
      <div className="gw-measurement__head">
        <div>
          <strong>{measurement.label}</strong>
          <small>
            {measurement.unit ?? measurement.valueType.toLowerCase()}
            {measurement.targetValue !== null
              ? ` · Target ${measurement.targetValue}${measurement.unit ? ` ${measurement.unit}` : ''}`
              : ' · No target'}
          </small>
        </div>
        <button className="gw-small-link" type="button" onClick={() => props.setEditingMeasurement(props.editingMeasurement === measurement.id ? null : measurement.id)}>
          {props.editingMeasurement === measurement.id ? 'Close' : 'Edit'}
        </button>
      </div>

      {props.editingMeasurement === measurement.id && (
        <form className="gw-inline-form" onSubmit={(event) => void props.onSaveMeasurementEdit(event, measurement)}>
          <label>Name<input name="label" defaultValue={measurement.label} maxLength={120} required /></label>
          {measurement.valueType === 'NUMBER' && <label>Unit<input name="unit" defaultValue={measurement.unit ?? ''} /></label>}
          <label>Target
            {measurement.valueType === 'BOOLEAN'
              ? <select name="targetValue" defaultValue={measurement.targetValue === null ? '' : String(measurement.targetValue)}><option value="">No target</option><option value="true">Yes</option><option value="false">No</option></select>
              : <input name="targetValue" type={measurement.valueType === 'NUMBER' ? 'number' : 'text'} defaultValue={measurement.targetValue === null ? '' : String(measurement.targetValue)} />}
          </label>
          <button type="submit">Save changes</button>
        </form>
      )}

      <div className="gw-measurement__current">
        <span>Latest recorded</span><strong>{latest ? `${latest.value}${measurement.unit ? ` ${measurement.unit}` : ''}` : 'No values yet'}</strong>
        {latest && <small>{dateLabel(latest.recordedAt)}</small>}
      </div>

      {measurement.valueType === 'BOOLEAN' ? (
        <label className="gw-input-label">Record value
          <select value={props.measurementValues[measurement.id] ?? ''} onChange={(event) => props.setMeasurementValues((items) => ({ ...items, [measurement.id]: event.target.value }))}>
            <option value="">Choose…</option><option value="true">Yes</option><option value="false">No</option>
          </select>
        </label>
      ) : (
        <label className="gw-input-label">Record value
          <input type={measurement.valueType === 'NUMBER' ? 'number' : 'text'} value={props.measurementValues[measurement.id] ?? ''} onChange={(event) => props.setMeasurementValues((items) => ({ ...items, [measurement.id]: event.target.value }))} />
        </label>
      )}
      <button className="gw-secondary-button" type="button" disabled={!props.measurementValues[measurement.id]} onClick={() => void props.onRecordMeasurement(measurement)}>Record value</button>

      {history.length > 1 && (
        <div className="gw-history">
          <button type="button" className="gw-small-link" onClick={() => setHistoryOpen((value) => !value)}>
            {historyOpen ? 'Hide history' : `History · ${history.length}`}
          </button>
          {historyOpen && <ol>{history.map((record) => <li key={record.id}><strong>{record.value}{measurement.unit ? ` ${measurement.unit}` : ''}</strong><small>{dateLabel(record.recordedAt)}</small>{record.note && <span>{record.note}</span>}</li>)}</ol>}
        </div>
      )}
    </article>
  );
}
