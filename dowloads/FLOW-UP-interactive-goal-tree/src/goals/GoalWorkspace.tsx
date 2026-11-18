import { useMemo, useState, type FormEvent, type ReactNode, type CSSProperties } from 'react';
import type {
  Action, ActionStatus, Goal, GoalNode, Measurement, MeasurementRecord,
  Milestone, ProgressSummary, Project,
} from '../lib/api';
import './goal-workspace.css';

type GoalView = 'tree' | 'flow' | 'horizon' | 'list';

interface GoalWorkspaceProps {
  goals: Goal[];
  hierarchy: GoalNode[];
  selectedGoal: Goal | null;
  onSelectGoal: (goal: Goal) => void;
  onMoveGoal: (goalId: string, parentGoalId: string | null) => Promise<void>;
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
  setMeasurementValues: (value: Record<string, string> | ((current: Record<string, string>) => Record<string, string>)) => void;
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
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const dateLabel = (value?: string | null) => value
  ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  : 'Date not set';
const dayDistance = (value?: string | null) => {
  if (!value) return null;
  const d = new Date(`${value.slice(0, 10)}T12:00:00`).getTime();
  return Math.round((d - new Date(`${todayISO()}T12:00:00`).getTime()) / 86400000);
};
const statusLabel = (status: string) => status.toLowerCase().replaceAll('_', ' ');
const flatten = (nodes: GoalNode[]): Goal[] => nodes.flatMap(n => [n.goal, ...flatten(n.children)]);
const countActions = (goalId: string, actions: Action[]) => actions.filter(a => a.goalId === goalId && !a.archivedAt);

function ActionStatusSelect({ action, onChange }: { action: Action; onChange: (status: ActionStatus) => void }) {
  return <select aria-label={`Update ${action.title} status`} value={action.status}
    onChange={e => onChange(e.target.value as ActionStatus)}>
    <option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option>
  </select>;
}

export function GoalWorkspace(props: GoalWorkspaceProps) {
  const [view, setView] = useState<GoalView>('tree');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(flatten(props.hierarchy).map(g => g.id)));
  const [treeScale, setTreeScale] = useState(1);
  const [detailPlacement, setDetailPlacement] = useState<'right' | 'bottom' | 'floating'>('right');
  const goals = props.goals.filter(g => !g.archivedAt);
  const selected = props.selectedGoal && goals.some(g => g.id === props.selectedGoal?.id) ? props.selectedGoal : null;
  const actions = props.workspaceActions.filter(a => !a.archivedAt && goals.some(g => g.id === a.goalId));
  const moving = actions.filter(a => a.status === 'IN_PROGRESS');
  const next = actions.filter(a => a.status === 'TODO');
  const focus = (selected && countActions(selected.id, actions).find(a => a.status === 'IN_PROGRESS'))
    ?? (selected && countActions(selected.id, actions).find(a => a.status === 'TODO'))
    ?? moving[0] ?? next[0];
  const today = todayISO();
  const overdueGoals = goals.filter(g => g.status !== 'COMPLETED' && g.targetDate && g.targetDate < today);
  const overdueMilestones = props.milestones.filter(m => m.status !== 'COMPLETED' && m.targetDate && m.targetDate < today);
  const stale = actions.filter(a => a.status === 'IN_PROGRESS' && a.updatedAt && (Date.now() - new Date(a.updatedAt).getTime()) >= 7 * 86400000);
  const flat = useMemo(() => flatten(props.hierarchy), [props.hierarchy]);
  const toggle = (id: string) => setExpanded(prev => {
    const nextSet = new Set(prev);
    if (nextSet.has(id)) nextSet.delete(id); else nextSet.add(id);
    return nextSet;
  });

  return <div className="goal-workspace">
    <section className="gw-focus" aria-label="Focus">
      <div>
        <span className="gw-kicker">NEXT MEANINGFUL STEP</span>
        <h2>{focus?.title ?? (selected ? 'This Goal needs a next step' : 'Choose an outcome to move forward')}</h2>
        <p>{focus ? `Belongs to ${goals.find(g => g.id === focus.goalId)?.title ?? 'a Goal'}. Select it to record execution or update its status.` : 'Choose a Goal, then add a small Action or a meaningful checkpoint.'}</p>
        <div className="gw-focus__meta">
          <span className="gw-chip">{focus?.status === 'IN_PROGRESS' ? 'In progress' : focus ? 'To do' : 'No active Action'}</span>
          {selected && <span className="gw-chip">{selected.title}</span>}
          {selected?.targetDate && <span className="gw-chip">Target · {dateLabel(selected.targetDate)}</span>}
        </div>
      </div>
      <div className="gw-focus__next">
        <span className="gw-overline">YOUR NEXT MOVE</span>
        <strong>{focus?.title ?? 'Nothing queued yet'}</strong>
        <button type="button" onClick={() => focus ? void props.onOpenExecution(focus) : props.onAddAction()}>
          {focus ? 'Open execution →' : 'Add an Action →'}
        </button>
      </div>
    </section>

    <div className="gw-toolbar">
      <div className="gw-view-switch" role="group" aria-label="Goal views">
        {([['tree','Tree'],['flow','Flow'],['horizon','Horizon'],['list','List']] as [GoalView,string][]).map(([id,label]) =>
          <button key={id} type="button" aria-pressed={view === id} onClick={() => setView(id)}>{label}</button>)}
      </div>
      <div className="gw-toolbar__right">
        <label className="gw-project-filter"><span>Project</span>
          <select aria-label="Filter by project" value={props.selectedProject?.id ?? ''}
            onChange={e => props.onSelectProject(props.projects.find(p => p.id === e.target.value) ?? null)}>
            <option value="">All projects</option>{props.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <button className="gw-primary-link" type="button" onClick={props.onAddGoal}>+ New Goal</button>
      </div>
    </div>

    <div className={`gw-layout gw-layout--detail-${detailPlacement}`}>
      <section className="gw-board" aria-label={view === 'tree' ? 'Goal tree' : view === 'flow' ? 'Goal flow board' : view === 'horizon' ? 'Reverse timeline' : 'Goal list'}>
        {view === 'tree' && <>
          <BoardHeading title="Goal map" subtitle="Select a node to inspect it. Use the chevron to open or close its branch." count={`${flat.length} outcomes`} />
          <div className="gw-tree-toolbar">
            <button type="button" onClick={() => setExpanded(new Set(flat.map(g => g.id)))}>Expand all</button>
            <button type="button" onClick={() => setExpanded(new Set())}>Collapse all</button>
            <span className="gw-tree-zoom">
              <button type="button" aria-label="Zoom out" onClick={() => setTreeScale(v => Math.max(.55, +(v - .1).toFixed(2)))}>−</button>
              <span>{Math.round(treeScale * 100)}%</span>
              <button type="button" aria-label="Zoom in" onClick={() => setTreeScale(v => Math.min(1.5, +(v + .1).toFixed(2)))}>+</button>
              <button type="button" onClick={() => setTreeScale(1)}>Fit</button>
            </span>
          </div>
          {props.hierarchy.length
            ? <div className="gw-tree-canvas"><div className="gw-tree-map" style={{'--tree-scale':treeScale} as CSSProperties}>{props.hierarchy.map(n => <TreeNode key={n.goal.id} node={n} depth={0} expanded={expanded} toggle={toggle} selectedId={selected?.id ?? null} onSelect={props.onSelectGoal} onMoveGoal={props.onMoveGoal} actions={actions} />)}</div><div className="gw-tree-root-drop" onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); const id = event.dataTransfer.getData('text/flow-up-goal'); if (id) void props.onMoveGoal(id, null); }}>Drop here to move a Goal to root level</div></div>
            : <EmptyBoard title="Start with one outcome" body="Create a Goal. Add Child Goals only when they represent smaller outcomes that belong under it." action="Create Goal" onAction={props.onAddGoal} />}
        </>}

        {view === 'flow' && <>
          <BoardHeading title="Goal execution flow" subtitle="Each Goal keeps its own Actions visible, so you can see which outcome is moving and what is blocked by missing next steps." count={`${actions.length} actions`} />
          {goals.length ? <div className="gw-flow-goals">{goals.map(goal => {
            const own = countActions(goal.id, actions);
            const ownDone = own.filter(a => a.status === 'COMPLETED').length;
            const ownOpen = own.filter(a => a.status !== 'COMPLETED');
            const children = flat.filter(g => g.parentGoalId === goal.id);
            const goalMilestones = selected?.id === goal.id ? props.milestones : [];
            return <article className={`gw-flow-goal ${selected?.id === goal.id ? 'is-selected' : ''}`} key={goal.id}>
              <button className="gw-flow-goal__title" type="button" onClick={() => props.onSelectGoal(goal)}>
                <span><small>{goal.parentGoalId ? 'CHILD GOAL' : 'ROOT GOAL'}</small><strong>{goal.title}</strong></span>
                <span className="gw-chip">{ownDone}/{own.length} actions</span>
              </button>
              <div className="gw-flow-goal__progress"><span style={{width: `${own.length ? ownDone / own.length * 100 : 0}%`}} /></div>
              {children.length > 0 && <div className="gw-flow-children"><span>CHILD OUTCOMES</span>{children.map(child =>
                <button key={child.id} type="button" onClick={() => props.onSelectGoal(child)}>{child.title} <small>↗</small></button>)}</div>}
              {goal.id === selected?.id && goalMilestones.length > 0 && <div className="gw-flow-checkpoints">{goalMilestones.map(m =>
                <span key={m.id} className={m.status === 'COMPLETED' ? 'is-done' : ''}>◆ {m.title}</span>)}</div>}
              <div className="gw-flow-actions">
                {ownOpen.length ? ownOpen.map(action => <div className="gw-flow-action" key={action.id}>
                  <span className={`gw-state-dot gw-state-dot--${action.status.toLowerCase()}`} />
                  <div><strong>{action.title}</strong><small>{statusLabel(action.status)}</small></div>
                  <button type="button" onClick={() => void props.onOpenExecution(action)}>Log</button>
                </div>) : <p>{own.length ? 'All Actions completed' : 'No Actions yet — select this Goal and add its first next step.'}</p>}
              </div>
              <div className="gw-flow-footer"><span>{own.length - ownDone} remaining</span><button type="button" onClick={() => { props.onSelectGoal(goal); if (selected?.id === goal.id) props.onAddAction(); }}>+ Add action</button></div>
            </article>;
          })}</div> : <EmptyBoard title="No Goals to flow through" body="Create an outcome first." action="Create Goal" onAction={props.onAddGoal} />}
          <div className="gw-friction">
            <div><strong>Signals to review</strong><span>{stale.length + overdueGoals.length + overdueMilestones.length}</span></div>
            {stale.map(a => <button key={a.id} type="button" onClick={() => { const g = goals.find(x => x.id === a.goalId); if (g) props.onSelectGoal(g); }}>
              <b>Stale Action</b><span>{a.title} · no update for 7+ days</span></button>)}
            {overdueGoals.map(g => <button key={g.id} type="button" onClick={() => props.onSelectGoal(g)}><b>Goal overdue</b><span>{g.title} · {dateLabel(g.targetDate)}</span></button>)}
            {overdueMilestones.map(m => <button key={m.id} type="button" onClick={() => { const g = goals.find(x => x.id === m.goalId); if (g) props.onSelectGoal(g); }}><b>Milestone overdue</b><span>{m.title} · {dateLabel(m.targetDate)}</span></button>)}
            {!stale.length && !overdueGoals.length && !overdueMilestones.length && <p>No overdue or stale items detected. Signals are advisory and never change your data automatically.</p>}
          </div>
        </>}

        {view === 'horizon' && <>
          <BoardHeading title="Reverse horizon" subtitle="Use actual dates and checkpoints to see the path between today and the destination. No dates or steps are invented." />
          {selected ? <Horizon goal={selected} milestones={props.milestones} actions={countActions(selected.id, actions)} onAddMilestone={props.onAddMilestone} onSelectAction={props.onOpenExecution} />
            : <EmptyBoard title="Choose a destination" body="Select a Goal in Tree, Flow or List to see its path." />}
        </>}

        {view === 'list' && <>
          <BoardHeading title="Outcome register" subtitle="Searchable hierarchy at a glance. Select an outcome to manage its parts." count={`${flat.length} Goals`} />
          <div className="gw-list">{flat.map(goal => {
            const depth = depthOf(goal, flat);
            return <button type="button" key={goal.id} className={`gw-list-row ${selected?.id === goal.id ? 'is-selected' : ''}`} onClick={() => props.onSelectGoal(goal)}>
              <span className="gw-list-depth" style={{paddingLeft: depth * 18}}>↳</span>
              <span className="gw-list-row__name">{goal.title}</span>
              <span className="gw-list-row__status">{statusLabel(goal.status)}</span>
              <span className="gw-list-row__date">{dateLabel(goal.targetDate)}</span>
            </button>;
          })}</div>
        </>}
      </section>

      <aside className="gw-detail" aria-label="Selected Goal details">
        <div className="gw-detail-layout-tools" role="group" aria-label="Goal settings panel position">
          <span>Goal settings</span>
          <button type="button" aria-pressed={detailPlacement === 'right'} onClick={() => setDetailPlacement('right')}>Right</button>
          <button type="button" aria-pressed={detailPlacement === 'bottom'} onClick={() => setDetailPlacement('bottom')}>Bottom</button>
          <button type="button" aria-pressed={detailPlacement === 'floating'} onClick={() => setDetailPlacement('floating')}>Float</button>
        </div>
        {selected ? <GoalDetail {...props} goal={selected} hierarchy={props.hierarchy} actions={countActions(selected.id, actions)} />
          : <div className="gw-empty"><strong>Choose an outcome</strong><p>Its child outcomes, checkpoints, Actions and measurements will appear here.</p></div>}
      </aside>
    </div>
  </div>;
}

function depthOf(goal: Goal, goals: Goal[]) {
  let depth = 0; let parentId = goal.parentGoalId; let guard = 0;
  while (parentId && guard++ < 20) { depth += 1; parentId = goals.find(g => g.id === parentId)?.parentGoalId ?? null; }
  return depth;
}

function BoardHeading({title,subtitle,count}:{title:string;subtitle:string;count?:string}) {
  return <div className="gw-board__head"><div><h3>{title}</h3><p>{subtitle}</p></div>{count && <span className="gw-chip">{count}</span>}</div>;
}
function EmptyBoard({title,body,action,onAction}:{title:string;body:string;action?:string;onAction?:()=>void}) {
  return <div className="gw-empty"><strong>{title}</strong><p>{body}</p>{action && onAction && <button type="button" className="gw-empty__action" onClick={onAction}>{action}</button>}</div>;
}

function TreeNode({node,depth,expanded,toggle,selectedId,onSelect,actions}:{node:GoalNode;depth:number;expanded:Set<string>;toggle:(id:string)=>void;selectedId:string|null;onSelect:(goal:Goal)=>void;onMoveGoal:(goalId:string,parentGoalId:string|null)=>Promise<void>;actions:Action[]}) {
  const open = expanded.has(node.goal.id);
  const children = node.children.length;
  const ownActions = countActions(node.goal.id, actions);
  const completed = ownActions.filter(a => a.status === 'COMPLETED').length;
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  return <div className={`gw-tree-node ${depth ? 'is-child' : 'is-root'}`} style={{'--tree-depth':depth} as CSSProperties}>
    <div className="gw-tree-card-wrap">
      {children > 0
        ? <button className="gw-tree-toggle" type="button" aria-label={`${open ? 'Collapse' : 'Expand'} ${node.goal.title}`} aria-expanded={open} onClick={() => toggle(node.goal.id)}>{open ? '−' : '+'}</button>
        : <span className="gw-tree-leaf" />}
      <button type="button" draggable className={`gw-tree-card ${selectedId === node.goal.id ? 'is-selected' : ''} ${dragOver ? 'is-drop-target' : ''}`} aria-current={selectedId === node.goal.id}
        onClick={() => onSelect(node.goal)}
        onDragStart={event => { event.dataTransfer.setData('text/flow-up-goal', node.goal.id); event.dataTransfer.effectAllowed = 'move'; setDragging(true); }}
        onDragEnd={() => { setDragging(false); setDragOver(false); }}
        onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={event => { event.preventDefault(); setDragOver(false); const draggedId = event.dataTransfer.getData('text/flow-up-goal'); if (draggedId && draggedId !== node.goal.id) void onMoveGoal(draggedId, node.goal.id); }}
        style={{opacity: dragging ? .45 : 1}}>
        <span className="gw-tree-card__top"><span className="gw-tree-kind">{depth ? 'CHILD OUTCOME' : 'PRIMARY GOAL'}</span><span className={`gw-tree-status gw-tree-status--${node.goal.status.toLowerCase()}`}>{statusLabel(node.goal.status)}</span></span>
        <strong>{node.goal.title}</strong>
        <span className="gw-tree-card__bottom"><span>{children} child {children === 1 ? 'goal' : 'goals'}</span><span>{completed}/{ownActions.length} actions</span>{node.goal.targetDate && <span>{dateLabel(node.goal.targetDate)}</span>}</span>
        <span className="gw-tree-progress"><i style={{width:`${ownActions.length ? completed / ownActions.length * 100 : 0}%`}} /></span>
      </button>
    </div>
    {children > 0 && open && <div className="gw-tree-children">{node.children.map(child => <TreeNode key={child.goal.id} node={child} depth={depth+1} expanded={expanded} toggle={toggle} selectedId={selectedId} onSelect={onSelect} onMoveGoal={onMoveGoal} actions={actions} />)}</div>}
  </div>;
}

function Horizon({goal,milestones,actions,onAddMilestone,onSelectAction}:{goal:Goal;milestones:Milestone[];actions:Action[];onAddMilestone:()=>void;onSelectAction:(action:Action)=>void}) {
  const items = milestones.slice().sort((a,b) => (a.targetDate ?? '9999').localeCompare(b.targetDate ?? '9999'));
  const firstAction = actions.find(a => a.status === 'IN_PROGRESS') ?? actions.find(a => a.status === 'TODO');
  return <div className="gw-horizon">
    <div className="gw-horizon-rail">
      <div className="gw-horizon-end"><span>NOW</span><strong>{dateLabel(todayISO())}</strong><small>{firstAction?.title ?? 'Define a next Action'}</small>{firstAction && <button type="button" onClick={() => void onSelectAction(firstAction)}>Open action</button>}</div>
      <div className="gw-horizon-track">
        {items.length ? items.map((m,i) => <article className={`gw-horizon-stop ${m.status === 'COMPLETED' ? 'is-done' : ''}`} key={m.id}>
          <span className="gw-horizon-stop__index">{String(i+1).padStart(2,'0')}</span><span className="gw-horizon-stop__dot" />
          <div><small>{m.targetDate ? dateLabel(m.targetDate) : 'DATE NOT SET'}</small><strong>{m.title}</strong><span>{m.status === 'COMPLETED' ? 'Completed checkpoint' : 'Planned checkpoint'}</span></div>
        </article>) : <p className="gw-horizon-empty">No checkpoints defined yet. Add a Milestone when you know an intermediate result.</p>}
      </div>
      <div className="gw-horizon-end gw-horizon-end--future"><span>DESTINATION</span><strong>{goal.title}</strong><small>{goal.targetDate ? dateLabel(goal.targetDate) : 'Target date not set'}</small><em>{dayDistance(goal.targetDate) === null ? 'No countdown' : dayDistance(goal.targetDate)! >= 0 ? `${dayDistance(goal.targetDate)} days remaining` : `${Math.abs(dayDistance(goal.targetDate)!)} days overdue`}</em></div>
    </div>
    <div className="gw-horizon-actions"><p>Checkpoints are displayed by their actual target dates. Missing dates remain visible as undated items rather than guessed milestones.</p><button type="button" onClick={onAddMilestone}>+ Add checkpoint</button></div>
  </div>;
}

function GoalDetail(props: GoalWorkspaceProps & {goal:Goal;hierarchy:GoalNode[];actions:Action[]}) {
  const {goal}=props;
  const progressValue=props.progress?.goalProgress.progressValue;
  const findChildren=(nodes:GoalNode[]):GoalNode[] => nodes.flatMap(n => n.goal.id === goal.id ? n.children : findChildren(n.children));
  const directChildren=findChildren(props.hierarchy).map(n=>n.goal);
  const actions=props.actions.filter(a=>!a.archivedAt);
  return <div className="gw-detail__content">
    <div className="gw-detail__top"><span className="gw-overline">SELECTED OUTCOME</span><span className="gw-chip">{statusLabel(goal.status)}</span></div>
    <h3>{goal.title}</h3><p className="gw-detail__description">{goal.description || 'No description yet. Add why this outcome matters.'}</p>
    <div className="gw-detail__meta"><span>Target · {dateLabel(goal.targetDate)}</span><span>Project · {props.projects.find(p=>p.id===goal.projectId)?.name ?? 'Workspace Goal'}</span>
      <span>Outcome progress · {progressValue == null ? (props.progress?.goalProgress.calculationStatus==='RULE_NOT_CONFIGURED'?'Not configured':'Not enough evidence') : `${Math.round(progressValue)}%`}</span></div>
    {progressValue != null && <Progress value={progressValue}/>}
    <div className="gw-detail__execution"><span>Actions complete</span><strong>{props.progress?.actionCompletion?.completedActions ?? actions.filter(a=>a.status==='COMPLETED').length} / {props.progress?.actionCompletion?.totalActions ?? actions.length}</strong><Progress value={actions.length ? actions.filter(a=>a.status==='COMPLETED').length/actions.length*100 : 0}/></div>
    <div className="gw-buttons"><button type="button" onClick={props.onAddChildGoal}>＋ Child Goal</button><button type="button" onClick={props.onAddMilestone}>＋ Milestone</button><button type="button" onClick={props.onAddAction}>＋ Action</button></div>

    <DetailSection title={`Child Goals · ${directChildren.length}`}>
      {directChildren.length ? directChildren.map(child => <div className="gw-child-row" key={child.id}>
        <button type="button" onClick={()=>props.onSelectGoal(child)}><span>↳</span><strong>{child.title}</strong><small>{statusLabel(child.status)}</small></button>
      </div>) : <p className="gw-entity__empty">No child outcomes yet. Add one when a smaller outcome needs its own checkpoints and Actions.</p>}
    </DetailSection>

    <DetailSection title={`Milestones · ${props.milestones.length}`}>
      {props.milestones.length ? props.milestones.map(m => <div className="gw-entity" key={m.id}>
        <div className="gw-entity__row"><span className={`gw-entity__mark ${m.status==='COMPLETED'?'is-done':''}`}>{m.status==='COMPLETED'?'✓':'◆'}</span>
          <div className="gw-entity__body"><strong>{m.title}</strong><small>{dateLabel(m.targetDate)} · {statusLabel(m.status)}</small></div>
          {m.status==='PENDING' && <><button className="gw-small-link" type="button" onClick={()=>props.setEditingMilestone(props.editingMilestone===m.id?null:m.id)}>{props.editingMilestone===m.id?'Close':'Edit'}</button><button className="gw-small-link" type="button" onClick={()=>void props.onCompleteMilestone(m)}>Complete</button></>}
        </div>
        {props.editingMilestone===m.id && <form className="gw-inline-form" onSubmit={e=>void props.onSaveMilestone(e,m)}>
          <label>Milestone<input name="title" defaultValue={m.title} required /></label><label>Target date<input name="targetDate" type="date" defaultValue={m.targetDate??''}/></label><button type="submit">Save milestone</button>
        </form>}
      </div>) : <p className="gw-entity__empty">No checkpoints yet. Add one when an intermediate result becomes clear.</p>}
    </DetailSection>

    <DetailSection title={`Actions · ${actions.length}`}>
      {actions.length ? actions.map(a=><div className="gw-entity" key={a.id}>
        <div className="gw-entity__row"><span className={`gw-entity__mark ${a.status==='COMPLETED'?'is-done':''}`}>{a.status==='COMPLETED'?'✓':'↗'}</span>
          <div className="gw-entity__body"><strong>{a.title}</strong><small>{statusLabel(a.status)}{a.milestoneId?` · ${props.milestones.find(m=>m.id===a.milestoneId)?.title??'Milestone'}`:''}</small></div>
          <button className="gw-small-link" type="button" onClick={()=>void props.onOpenExecution(a)}>Log</button>
          {a.status!=='COMPLETED' && <ActionStatusSelect action={a} onChange={s=>void props.onUpdateAction(a,s)}/>}
        </div>
        {props.editingAction===a.id && <form className="gw-inline-form" onSubmit={e=>void props.onSaveAction(e,a)}><label>Action<input name="title" defaultValue={a.title} required/></label><label>Details<textarea name="description" defaultValue={a.description??''}/></label><button type="submit">Save action</button></form>}
        {a.status!=='COMPLETED' && <button className="gw-small-link gw-edit-action" type="button" onClick={()=>props.setEditingAction(props.editingAction===a.id?null:a.id)}>{props.editingAction===a.id?'Close edit':'Edit'}</button>}
      </div>) : <p className="gw-entity__empty">No Actions yet. Add one concrete next step.</p>}
    </DetailSection>

    <DetailSection title={`Measurements · ${props.measurements.length}`}>
      <div className="gw-measurement-add"><button className="gw-small-link" type="button" onClick={()=>props.setMeasurementFormOpen(v=>!v)}>{props.measurementFormOpen?'Cancel':'+ Add measurement'}</button></div>
      {props.measurementFormOpen && <form className="gw-inline-form" onSubmit={e=>void props.onSaveMeasurement(e)}>
        <label>Name<input value={props.measurementLabel} onChange={e=>props.setMeasurementLabel(e.target.value)} maxLength={120} required/></label>
        <label>Value type<select value={props.measurementType} onChange={e=>props.setMeasurementType(e.target.value as Measurement['valueType'])}><option value="NUMBER">Number</option><option value="TEXT">Text</option><option value="BOOLEAN">Yes / No</option></select></label>
        {props.measurementType==='NUMBER' && <label>Unit<input value={props.measurementUnit} onChange={e=>props.setMeasurementUnit(e.target.value)} placeholder="e.g. hours, kg"/></label>}
        <label>Target (optional)<input type={props.measurementType==='NUMBER'?'number':'text'} value={props.measurementTarget} onChange={e=>props.setMeasurementTarget(e.target.value)}/></label>
        <button type="submit" disabled={props.busy||!props.measurementLabel.trim()}>Save measurement</button>
      </form>}
      {props.measurementLoadState==='LOADING'?<p className="gw-entity__empty">Loading evidence…</p>:props.measurementLoadState==='ERROR'?<p className="gw-entity__empty">Measurements unavailable. <button type="button" className="gw-small-link" onClick={props.onRefreshMeasurements}>Retry</button></p>:props.measurements.map(m=><MeasurementItem key={m.id} measurement={m} {...props}/>)}
    </DetailSection>
  </div>;
}
function Progress({value}:{value:number}) { return <div className="gw-progress"><span style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>; }
function DetailSection({title,children}:{title:string;children:ReactNode}) { return <section className="gw-detail__section"><h4>{title}</h4>{children}</section>; }
function MeasurementItem(props:GoalWorkspaceProps & {measurement:Measurement}) {
  const {measurement:m}=props; const history=props.measurementHistory[m.id]??[]; const latest=history[0]; const [open,setOpen]=useState(false);
  return <article className="gw-measurement">
    <div className="gw-measurement__head"><div><strong>{m.label}</strong><small>{m.unit??m.valueType.toLowerCase()} · {m.targetValue===null?'No target':`Target ${m.targetValue}`}</small></div>
      <button className="gw-small-link" type="button" onClick={()=>props.setEditingMeasurement(props.editingMeasurement===m.id?null:m.id)}>{props.editingMeasurement===m.id?'Close':'Edit'}</button></div>
    {props.editingMeasurement===m.id && <form className="gw-inline-form" onSubmit={e=>void props.onSaveMeasurementEdit(e,m)}><label>Name<input name="label" defaultValue={m.label} required/></label>{m.valueType==='NUMBER'&&<label>Unit<input name="unit" defaultValue={m.unit??''}/></label>}<label>Target<input name="targetValue" defaultValue={m.targetValue===null?'':String(m.targetValue)}/></label><button type="submit">Save changes</button></form>}
    <div className="gw-measurement__current"><span>Latest recorded</span><strong>{latest?`${latest.value}${m.unit?` ${m.unit}`:''}`:'No values yet'}</strong>{latest&&<small>{dateLabel(latest.recordedAt)}</small>}</div>
    <label className="gw-input-label">Record value{m.valueType==='BOOLEAN'?<select value={props.measurementValues[m.id]??''} onChange={e=>props.setMeasurementValues(v=>({...v,[m.id]:e.target.value}))}><option value="">Choose…</option><option value="true">Yes</option><option value="false">No</option></select>:<input type={m.valueType==='NUMBER'?'number':'text'} value={props.measurementValues[m.id]??''} onChange={e=>props.setMeasurementValues(v=>({...v,[m.id]:e.target.value}))}/>}</label>
    <button className="gw-secondary-button" type="button" disabled={!props.measurementValues[m.id]} onClick={()=>void props.onRecordMeasurement(m)}>Record value</button>
    {history.length>1&&<div className="gw-history"><button className="gw-small-link" type="button" onClick={()=>setOpen(v=>!v)}>{open?'Hide history':`History · ${history.length}`}</button>{open&&<ol>{history.map(r=><li key={r.id}><strong>{r.value}{m.unit?` ${m.unit}`:''}</strong><small>{dateLabel(r.recordedAt)}</small>{r.note&&<span>{r.note}</span>}</li>)}</ol>}</div>}
  </article>;
}
