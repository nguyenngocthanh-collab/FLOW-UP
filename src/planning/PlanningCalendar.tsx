import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { api, type Action, type ActionStatus, type Goal, type Milestone, type Schedule } from '../lib/api';
import './planning.css';

type CalendarView = 'month' | 'week' | 'day';
type ScheduleDraft = { actionId: string; schedule?: Schedule; date: string; start: string; end: string };

function localDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function dateAtNoon(value: string): Date { return new Date(`${value}T12:00:00`); }
function addDays(value: string, count: number): string {
  const result = dateAtNoon(value);
  result.setDate(result.getDate() + count);
  return localDate(result);
}
function weekStart(value: string): string {
  const date = dateAtNoon(value);
  return addDays(value, -((date.getDay() + 6) % 7));
}
function dateRange(date: string, view: CalendarView): { start: string; end: string } {
  if (view === 'day') return { start: date, end: date };
  if (view === 'week') { const start = weekStart(date); return { start, end: addDays(start, 6) }; }
  const first = dateAtNoon(date); first.setDate(1);
  const gridStart = addDays(localDate(first), -((first.getDay() + 6) % 7));
  return { start: gridStart, end: addDays(gridStart, 41) };
}
function timeAt(value: string): string {
  const date = new Date(value);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
function actionDate(value: string): string { return localDate(new Date(value)); }
function displayDate(value: string, options: Intl.DateTimeFormatOptions): string {
  return dateAtNoon(value).toLocaleDateString(undefined, options);
}
function statusLabel(action: Action): string {
  return action.status === 'COMPLETED' ? 'Completed' : action.status === 'IN_PROGRESS' ? 'In progress' : 'To do';
}

function Button({ children, onClick, disabled, variant = 'secondary', ariaLabel }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean; variant?: 'primary' | 'secondary' | 'quiet'; ariaLabel?: string;
}) {
  return <button type="button" aria-label={ariaLabel} className={`button button--${variant}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function PlanningCalendar({
  actions, goals, actionsLoaded, actionsLoadError, initialDate, onRefreshActions,
  onOpenGoal, onLogExecution,
}: {
  actions: Action[]; goals: Goal[]; actionsLoaded: boolean; actionsLoadError: boolean;
  initialDate: string; onRefreshActions: () => void; onOpenGoal: (goalId: string) => void;
  onLogExecution: (action: Action) => void;
}) {
  const [view, setView] = useState<CalendarView>('week');
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const range = useMemo(() => dateRange(selectedDate, view), [selectedDate, view]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [milestonesByGoal, setMilestonesByGoal] = useState<Record<string, Milestone[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [operationError, setOperationError] = useState('');
  const [draft, setDraft] = useState<ScheduleDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [savingAction, setSavingAction] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setLoadError('');
    try {
      // Include UTC boundary spillover, then render only the selected local-date range.
      const items = await api.schedules(addDays(range.start, -1), addDays(range.end, 1));
      setSchedules(items.sort((a, b) => a.startAt.localeCompare(b.startAt)));
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Could not load schedules.');
    } finally { setLoading(false); }
  }, [range.start, range.end]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    let active = true;
    Promise.all(goals.map(async (goal) => [goal.id, await api.milestones(goal.id)] as const))
      .then((entries) => { if (active) setMilestonesByGoal(Object.fromEntries(entries)); })
      .catch(() => { if (active) setMilestonesByGoal({}); });
    return () => { active = false; };
  }, [goals]);

  const days = useMemo(() => {
    const count = view === 'month' ? 42 : view === 'week' ? 7 : 1;
    const start = view === 'month' || view === 'week' ? range.start : selectedDate;
    return Array.from({ length: count }, (_, index) => addDays(start, index));
  }, [range.start, selectedDate, view]);
  const visibleSchedules = schedules.filter((schedule) => actionDate(schedule.startAt) >= range.start && actionDate(schedule.startAt) <= range.end);
  const openActions = actions.filter((action) => action.status !== 'COMPLETED' && !action.archivedAt);
  const scheduledActionIds = new Set(visibleSchedules.map((schedule) => schedule.actionId));
  const unscheduled = openActions.filter((action) => !scheduledActionIds.has(action.id));

  function sessionsFor(date: string): Schedule[] {
    return visibleSchedules.filter((schedule) => actionDate(schedule.startAt) === date);
  }
  function movePeriod(offset: number) {
    const amount = view === 'month' ? 0 : view === 'week' ? 7 : 1;
    if (view === 'month') {
      const date = dateAtNoon(selectedDate); date.setDate(1); date.setMonth(date.getMonth() + offset);
      setSelectedDate(localDate(date));
    } else setSelectedDate(addDays(selectedDate, amount * offset));
  }
  function beginCreate(action: Action) {
    const entries = sessionsFor(selectedDate);
    const latestEnd = entries.reduce((latest, item) => Math.max(latest, Date.parse(item.endAt)), 0);
    const suggested = latestEnd > Date.parse(`${selectedDate}T08:00:00`) ? timeAt(new Date(latestEnd).toISOString()) : '09:00';
    const [hour, minute] = suggested.split(':').map(Number);
    const end = `${String((hour + 1) % 24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    setOperationError(''); setDraft({ actionId: action.id, date: selectedDate, start: suggested, end });
  }
  function beginEdit(schedule: Schedule) {
    setOperationError(''); setDraft({ actionId: schedule.actionId, schedule, date: actionDate(schedule.startAt), start: timeAt(schedule.startAt), end: timeAt(schedule.endAt) });
  }
  async function saveSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!draft) return;
    setSaving(true); setOperationError('');
    try {
      const startAt = new Date(`${draft.date}T${draft.start}:00`).toISOString();
      const endAt = new Date(`${draft.date}T${draft.end}:00`).toISOString();
      if (Date.parse(endAt) <= Date.parse(startAt)) throw new Error('End time must be after start time.');
      if (draft.schedule) {
        const dateChanged = actionDate(draft.schedule.startAt) !== draft.date;
        const storedDateChanged = new Date(draft.schedule.startAt).toISOString().slice(0, 10) !== startAt.slice(0, 10);
        await api.updateSchedule(draft.schedule.id, { startAt, endAt, ...(dateChanged || storedDateChanged ? { dailyPlanId: null } : {}) });
      } else {
        await api.createSchedule({ actionId: draft.actionId, startAt, endAt, dailyPlanId: null });
      }
      const selectedRangeIncludesDate = draft.date >= range.start && draft.date <= range.end;
      setSelectedDate(draft.date);
      setDraft(null);
      if (selectedRangeIncludesDate) await refresh();
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Could not save this schedule.');
    } finally { setSaving(false); }
  }
  async function removeSchedule(schedule: Schedule) {
    setOperationError('');
    try { await api.deleteSchedule(schedule.id); await refresh(); }
    catch (error) { setOperationError(error instanceof Error ? error.message : 'Could not remove this schedule.'); }
  }
  async function updateStatus(action: Action, status: ActionStatus) {
    setSavingAction(action.id); setOperationError('');
    try {
      await api.updateActionStatus(action.id, status);
      onRefreshActions();
    } catch (error) { setOperationError(error instanceof Error ? error.message : 'Could not update this Action.'); }
    finally { setSavingAction(null); }
  }
  function scheduleCard(schedule: Schedule, compact = false) {
    const action = actions.find((item) => item.id === schedule.actionId);
    if (!action) return <div className="calendar-event calendar-event--orphan" key={schedule.id}>Scheduled Action unavailable</div>;
    const goal = goals.find((item) => item.id === action.goalId);
    const milestone = action.milestoneId ? milestonesByGoal[action.goalId]?.find((item) => item.id === action.milestoneId) : null;
    const isPast = Date.parse(schedule.endAt) < Date.now() && action.status !== 'COMPLETED';
    return <article className={`calendar-event ${action.status === 'COMPLETED' ? 'calendar-event--complete' : ''}`} key={schedule.id}>
      <button type="button" className="calendar-event__main" onClick={() => onOpenGoal(action.goalId)} title="Open Goal">
        <time>{timeAt(schedule.startAt)}–{timeAt(schedule.endAt)}</time><strong>{action.title}</strong>
        {!compact && <small>{goal?.title ?? 'Goal'}{action.milestoneId ? ` · ${milestone?.title ?? 'Milestone'}` : ''}</small>}
        <span className="calendar-event__state">{action.status === 'COMPLETED' ? 'Completed' : isPast ? 'Past scheduled time' : 'Planned'}</span>
      </button>
      {!compact && <div className="calendar-event__actions">
        {action.status !== 'COMPLETED' && <select aria-label={`Update ${action.title} status`} value={action.status} disabled={savingAction === action.id} onChange={(event) => void updateStatus(action, event.target.value as ActionStatus)}>
          <option value="TODO">To do</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option>
        </select>}
        <button type="button" className="text-link" onClick={() => onLogExecution(action)}>Log execution</button>
        <button type="button" className="text-link" onClick={() => beginEdit(schedule)}>Edit time</button>
        <button type="button" className="text-link" onClick={() => void removeSchedule(schedule)}>Remove</button>
      </div>}
    </article>;
  }
  const periodLabel = view === 'month' ? displayDate(selectedDate, { month: 'long', year: 'numeric' })
    : view === 'week' ? `${displayDate(range.start, { month: 'short', day: 'numeric' })} – ${displayDate(range.end, { month: 'short', day: 'numeric', year: 'numeric' })}`
      : displayDate(selectedDate, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return <div className="calendar-workspace">
    <section className="panel calendar-panel">
      <div className="calendar-toolbar">
        <div className="calendar-toolbar__period"><h2>{periodLabel}</h2><div className="calendar-toolbar__nav">
          <Button onClick={() => movePeriod(-1)} ariaLabel="Previous period">‹</Button><Button onClick={() => setSelectedDate(initialDate)}>Today</Button><Button onClick={() => movePeriod(1)} ariaLabel="Next period">›</Button>
        </div></div>
        <div className="calendar-views" aria-label="Calendar view">{(['month', 'week', 'day'] as const).map((item) => <button type="button" className={view === item ? 'calendar-view--active' : ''} key={item} onClick={() => setView(item)}>{item[0].toUpperCase() + item.slice(1)}</button>)}</div>
      </div>
      {loadError && <div className="inline-error" role="alert">Calendar could not load: {loadError} <button type="button" className="text-link" onClick={() => void refresh()}>Try again</button></div>}
      {operationError && <div className="inline-error" role="alert">{operationError}</div>}
      {loading && <p className="calendar-feedback">Loading schedules…</p>}
      {!loading && !loadError && <>
        {view !== 'day' ? <div className={`calendar-grid calendar-grid--${view}`}>
          {view === 'month' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => <span className="calendar-grid__weekday" key={label}>{label}</span>)}
          {days.map((day) => {
            const items = sessionsFor(day);
            return <div key={day} className={`calendar-date ${day === selectedDate ? 'calendar-date--selected' : ''} ${dayAtMonth(day) !== dayAtMonth(selectedDate) && view === 'month' ? 'calendar-date--outside' : ''}`}>
              {view === 'week' && <span className="calendar-date__weekday">{displayDate(day, { weekday: 'short' })}</span>}
              <button type="button" className="calendar-date__number" aria-label={`Open ${displayDate(day, { weekday: 'long', month: 'long', day: 'numeric' })}`} onClick={() => { setSelectedDate(day); setView('day'); }}>{dateAtNoon(day).getDate()}</button>
              {view === 'week' ? <div className="calendar-date__events">{items.map((item) => scheduleCard(item, true))}{!items.length && <small>Open</small>}</div>
                : <div className="calendar-date__events">{items.slice(0, 2).map((item) => scheduleCard(item, true))}{items.length > 2 && <small>+{items.length - 2} more</small>}</div>}
            </div>;
          })}
        </div> : <div className="calendar-day-list">
          <header><span>{displayDate(selectedDate, { weekday: 'long' })}</span><strong>{sessionsFor(selectedDate).length} scheduled</strong></header>
          {sessionsFor(selectedDate).length ? sessionsFor(selectedDate).map((schedule) => scheduleCard(schedule)) : <p className="empty-line">No sessions planned. Choose an Action from the list to schedule it here.</p>}
        </div>}
      </>}
    </section>
    <aside className="panel calendar-unscheduled">
      <div className="panel__heading"><div><span className="eyebrow">NEXT ACTIONS</span><h2>Without a session</h2></div><span>{unscheduled.length}</span></div>
      {!actionsLoaded && !actionsLoadError && <p className="empty-line">Loading Actions…</p>}
      {actionsLoadError && <div className="inline-error" role="alert">Actions unavailable. <button type="button" className="text-link" onClick={onRefreshActions}>Retry</button></div>}
      {actionsLoaded && !actionsLoadError && (unscheduled.length ? <ul>{unscheduled.map((action) => <li key={action.id}>
        <div><strong>{action.title}</strong><button type="button" className="calendar-goal-link" onClick={() => onOpenGoal(action.goalId)}>{goals.find((goal) => goal.id === action.goalId)?.title ?? 'Open Goal'}{action.milestoneId ? ` · ${milestonesByGoal[action.goalId]?.find((milestone) => milestone.id === action.milestoneId)?.title ?? 'Milestone'}` : ''} · {statusLabel(action)}</button></div>
        <Button variant="quiet" onClick={() => beginCreate(action)}>Schedule</Button>
      </li>)}</ul> : <p className="empty-line">Every open Action has a session in this date range.</p>)}
      {draft && <form className="calendar-schedule-form" onSubmit={(event) => void saveSchedule(event)}>
        <strong>{draft.schedule ? 'Move scheduled work' : 'Schedule an Action'}</strong>
        <small>{actions.find((action) => action.id === draft.actionId)?.title}</small>
        <label className="field"><span>Date</span><input type="date" value={draft.date} required onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label>
        <div className="calendar-schedule-form__times"><label className="field"><span>Start</span><input type="time" value={draft.start} required onChange={(event) => setDraft({ ...draft, start: event.target.value })} /></label><label className="field"><span>End</span><input type="time" value={draft.end} required onChange={(event) => setDraft({ ...draft, end: event.target.value })} /></label></div>
        <div className="calendar-schedule-form__actions"><Button variant="quiet" onClick={() => setDraft(null)}>Cancel</Button><button className="button button--primary" disabled={saving}>{saving ? 'Saving…' : draft.schedule ? 'Save time' : 'Add to calendar'}</button></div>
      </form>}
    </aside>
  </div>;
}

function dayAtMonth(value: string): string { return value.slice(0, 7); }
