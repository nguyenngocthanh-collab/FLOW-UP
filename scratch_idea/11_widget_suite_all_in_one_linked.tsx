import { useState } from "react";

const C = {
  ink: "#1b2038", text: "#2b3150", muted: "#6a7192", page: "#f5f6fb",
  card: "#ffffff", line: "#e3e6f1", field: "#f9faff",
  indigo: "#4f52d9", indigoSoft: "#ececfc",
  teal: "#0fa89a", tealSoft: "#e3f6f4",
  violet: "#7b4fe0", coral: "#f0524f", amber: "#e8960c",
};

const DEMO = { streak: 5 };

const TABS = [
  { id: "checklist", t: "Checklist" },
  { id: "note", t: "Data" },
  { id: "data", t: "Note" },
];

const INITIAL_GOALS = [
  { id: "g1", t: "Goal 1 – Name" },
  { id: "g2", t: "Goal 2" },
];

const DATA_OPTIONS = ["Nas", "Chunks", "Table", "Math"];

const EMPTY_DETAIL = {
  start: "",
  due: "",
  key: "",
  method: "",
  tool: "",
  place: "",
  other: "",
};

const EMPTY_DATA_ITEM = {
  title: "",
  note: "",
  kind: "",
  prop: "",
};

/* ---------- DEMO dữ liệu bảng chỉ số & kết quả (Widget 4) ---------- */
const DEMO_NOTE_TABLES = {
  indicators: [
    { date: "14/11/2026", s1: 7.5, s2: 62, s3: 3.2 },
    { date: "15/11/2026", s1: 8, s2: 58, s3: 3.5 },
    { date: "16/11/2026", s1: 6.5, s2: 65, s3: 2.8 },
  ],
  results: [
    { date: "14/11/2026", s1: 4, s3: 2 },
    { date: "15/11/2026", s1: 5, s3: 3 },
    { date: "16/11/2026", s1: 3, s3: 1 },
  ],
};

const COLS_INDICATORS = [
  { key: "date", t: "Date" },
  { key: "s1", t: "Status 1 (unit)" },
  { key: "s2", t: "Status 2 (unit)" },
  { key: "s3", t: "Status 3 (unit)" },
];

const COLS_RESULTS = [
  { key: "date", t: "Date" },
  { key: "s1", t: "Status 1 (unit)" },
  { key: "s3", t: "Status 3 (unit)" },
];

function Square({ color }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 10,
        height: 10,
        borderRadius: 3,
        background: color,
        display: "inline-block",
        flex: "none",
      }}
    />
  );
}

function Field({ id, label, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 14 }}>
      <label
        htmlFor={id}
        style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function DataTable({ id, title, color, cols, rows, onAddRow }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ date: "", s1: "", s2: "", s3: "" });

  const handleSaveRow = (e) => {
    e.preventDefault();
    if (!draft.date.trim()) return;
    const newRow = { date: draft.date.trim() };
    cols.forEach((c) => {
      if (c.key !== "date") {
        const raw = draft[c.key];
        const num = Number(raw);
        newRow[c.key] = raw !== "" && !Number.isNaN(num) ? num : raw || "-";
      }
    });
    onAddRow(newRow);
    setDraft({ date: "", s1: "", s2: "", s3: "" });
    setAdding(false);
  };

  return (
    <section
      aria-labelledby={id}
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <h2
          id={id}
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: C.ink,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Square color={color} />
          {title}
        </h2>

        {onAddRow && (
          <button
            type="button"
            className="np-back-btn"
            onClick={() => setAdding((v) => !v)}
          >
            {adding ? "Huỷ" : "+ Thêm dòng"}
          </button>
        )}
      </div>

      {adding && (
        <form
          onSubmit={handleSaveRow}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr)) auto`,
            gap: 8,
            marginBottom: 12,
            padding: 10,
            borderRadius: 10,
            background: C.field,
            border: `1px solid ${C.line}`,
          }}
        >
          {cols.map((c) => (
            <input
              key={c.key}
              className="np-input"
              style={{ height: 34, padding: "0 8px", fontSize: 13 }}
              placeholder={c.key === "date" ? "DD/MM/YYYY" : c.t}
              value={draft[c.key] || ""}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, [c.key]: e.target.value }))
              }
            />
          ))}
          <button
            type="submit"
            className="np-btn primary"
            style={{ height: 34, padding: "0 12px", fontSize: 13 }}
          >
            Lưu
          </button>
        </form>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <thead>
            <tr>
              {cols.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: C.muted,
                    borderBottom: `1px solid ${C.line}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={cols.length}
                  style={{
                    padding: "12px 10px",
                    fontSize: 13,
                    color: C.muted,
                    textAlign: "center",
                  }}
                >
                  Chưa có dữ liệu
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={`${r.date}-${idx}`}>
                  {cols.map((c) => (
                    <td
                      key={c.key}
                      style={{
                        padding: "9px 10px",
                        fontSize: 14,
                        color: c.key === "date" ? C.muted : C.ink,
                        borderBottom: `1px solid ${C.line}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const cardStyle = {
  background: C.card,
  border: `1px solid ${C.line}`,
  borderRadius: 14,
  padding: 20,
};

export default function App() {
  const [tab, setTab] = useState("checklist");
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [activeDataContext, setActiveDataContext] = useState(null);
  // activeDataContext: { itemId: string, returnToGoalId: string | null }
  const [activeNoteContext, setActiveNoteContext] = useState(null);
  // activeNoteContext: { noteId: string, returnToGoalId: string | null }

  // Goals state (Checklist <-> Widget 2)
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [addingGoal, setAddingGoal] = useState(false);
  const [done, setDone] = useState({ g1: false, g2: false });
  const [details, setDetails] = useState({
    g1: { ...EMPTY_DETAIL },
    g2: { ...EMPTY_DETAIL },
  });

  // Data state (Tab Note <-> Widget 3)
  const [dataItems, setDataItems] = useState([
    { id: "d1", defaultLabel: "Note 1", ...EMPTY_DATA_ITEM },
    { id: "d2", defaultLabel: "Note 2", ...EMPTY_DATA_ITEM },
  ]);

  // Note state (Tab Data <-> Widget 4)
  const [noteItems, setNoteItems] = useState([
    {
      id: "n1",
      title: "Data 1 – Bảng chỉ số & Kết quả",
      indicators: DEMO_NOTE_TABLES.indicators.map((r) => ({ ...r })),
      results: DEMO_NOTE_TABLES.results.map((r) => ({ ...r })),
    },
    {
      id: "n2",
      title: "Data 2",
      indicators: [
        { date: "17/11/2026", s1: 8.2, s2: 60, s3: 3.4 },
      ],
      results: [
        { date: "17/11/2026", s1: 5, s3: 2 },
      ],
    },
  ]);

  const toggleDone = (id) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    const label =
      newGoalTitle.trim() || `Goal ${goals.length + 1}`;
    const newId = `g${Date.now()}`;
    setGoals((prev) => [...prev, { id: newId, t: label }]);
    setDone((prev) => ({ ...prev, [newId]: false }));
    setDetails((prev) => ({ ...prev, [newId]: { ...EMPTY_DETAIL } }));
    setNewGoalTitle("");
    setAddingGoal(false);
  };

  const updateDetailField = (goalId, field) => (e) => {
    const value = e.target.value;
    setDetails((prev) => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        [field]: value,
      },
    }));
  };

  const updateDataField = (itemId, field) => (e) => {
    const value = e.target.value;
    setDataItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddNewData = (returnToGoalId = null) => {
    const nextNum = dataItems.length + 1;
    const newId = `d${Date.now()}`;
    setDataItems((prev) => [
      ...prev,
      { id: newId, defaultLabel: `Note ${nextNum}`, ...EMPTY_DATA_ITEM },
    ]);
    setActiveDataContext({ itemId: newId, returnToGoalId });
  };

  const handleOpenGoalData = (goalId) => {
    const goalDataId = `goal-data-${goalId}`;
    const goalObj = goals.find((g) => g.id === goalId);
    setDataItems((prev) => {
      if (prev.some((item) => item.id === goalDataId)) return prev;
      return [
        ...prev,
        {
          id: goalDataId,
          defaultLabel: `Note – ${goalObj ? goalObj.t : goalId}`,
          ...EMPTY_DATA_ITEM,
        },
      ];
    });
    setActiveDataContext({ itemId: goalDataId, returnToGoalId: goalId });
  };

  const handleAddNewNote = (returnToGoalId = null) => {
    const nextNum = noteItems.length + 1;
    const newId = `n${Date.now()}`;
    setNoteItems((prev) => [
      ...prev,
      {
        id: newId,
        title: `Data ${nextNum}`,
        indicators: DEMO_NOTE_TABLES.indicators.map((r) => ({ ...r })),
        results: DEMO_NOTE_TABLES.results.map((r) => ({ ...r })),
      },
    ]);
    setActiveNoteContext({ noteId: newId, returnToGoalId });
  };

  const handleOpenGoalNote = (goalId) => {
    const goalNoteId = `goal-note-${goalId}`;
    const goalObj = goals.find((g) => g.id === goalId);
    setNoteItems((prev) => {
      if (prev.some((item) => item.id === goalNoteId)) return prev;
      return [
        ...prev,
        {
          id: goalNoteId,
          title: `Data – ${goalObj ? goalObj.t : goalId}`,
          indicators: DEMO_NOTE_TABLES.indicators.map((r) => ({ ...r })),
          results: DEMO_NOTE_TABLES.results.map((r) => ({ ...r })),
        },
      ];
    });
    setActiveNoteContext({ noteId: goalNoteId, returnToGoalId: goalId });
  };

  const updateNoteTitle = (noteId, newTitle) => {
    setNoteItems((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, title: newTitle } : n))
    );
  };

  const appendNoteTableRow = (noteId, tableKey, newRow) => {
    setNoteItems((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, [tableKey]: [...n[tableKey], newRow] }
          : n
      )
    );
  };

  const selectedGoal = goals.find((g) => g.id === selectedGoalId) || null;
  const currentDetail = selectedGoalId
    ? details[selectedGoalId] || EMPTY_DETAIL
    : EMPTY_DETAIL;

  const activeDataItem = activeDataContext
    ? dataItems.find((d) => d.id === activeDataContext.itemId) || null
    : null;

  const activeNoteItem = activeNoteContext
    ? noteItems.find((n) => n.id === activeNoteContext.noteId) || null
    : null;

  const css = `
    .np * { box-sizing: border-box; }
    .np { font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif; color: ${C.text}; font-size: 15px; line-height: 1.5; }
    .np button, .np input, .np textarea { font-family: inherit; font-size: inherit; color: inherit; }
    .np-nav { display:flex; align-items:center; gap:12px; width:100%; height:42px; padding:0 12px; border:0; border-radius:10px; background:transparent; color:${C.muted}; font-weight:500; text-align:left; cursor:pointer; transition: background .15s, color .15s; }
    .np-nav:hover { background:#fff; color:${C.ink}; }
    .np-nav[aria-current="page"] { background:${C.indigoSoft}; color:${C.indigo}; font-weight:600; }
    .np-input { width:100%; height:40px; padding:0 12px; border:1px solid ${C.line}; border-radius:9px; background:${C.field}; transition: border-color .15s, box-shadow .15s, background .15s; }
    textarea.np-input { height:auto; min-height:76px; padding:10px 12px; resize:vertical; }
    .np-input:hover { border-color:#cfd4e8; }
    .np-input:focus { outline:none; background:#fff; border-color:${C.indigo}; box-shadow:0 0 0 3px ${C.indigoSoft}; }
    .np-btn { display:inline-flex; align-items:center; gap:8px; height:40px; padding:0 16px; border:1px solid ${C.line}; border-radius:10px; background:#fff; color:${C.ink}; font-weight:600; cursor:pointer; transition: background .15s, border-color .15s, color .15s; }
    .np-btn:hover { background:${C.indigoSoft}; border-color:#c9caf3; color:${C.indigo}; }
    .np-btn.primary { background:${C.indigo}; border-color:${C.indigo}; color:#fff; box-shadow:0 8px 18px -8px ${C.indigo}; }
    .np-btn.primary:hover { background:#4144c4; color:#fff; }
    .np-icon-btn { width:32px; height:32px; border:1px solid ${C.line}; border-radius:8px; background:#fff; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; color:${C.muted}; transition: background .15s, border-color .15s, color .15s; }
    .np-icon-btn:hover { background:${C.indigoSoft}; border-color:#c9caf3; color:${C.indigo}; }
    .np-icon-btn[aria-pressed="true"] { background:${C.tealSoft}; border-color:${C.teal}; color:${C.teal}; }
    .np-link { border:0; background:none; padding:0; cursor:pointer; color:${C.indigo}; font-weight:500; text-decoration:underline; text-underline-offset:3px; text-decoration-color:#b9baf0; }
    .np button:focus-visible, .np-link:focus-visible, .np-goal-text:focus-visible { outline:3px solid ${C.indigoSoft}; outline-offset:2px; box-shadow:0 0 0 2px ${C.indigo}; }
    .np-grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:16px; }
    @media (max-width: 1100px) { .np-grid { grid-template-columns: 1fr; } }
    .np-tab { flex:1; height:44px; border:0; border-bottom:2px solid transparent; background:transparent; color:${C.muted}; font-weight:500; cursor:pointer; transition: color .15s, background .15s; }
    .np-tab:hover { background:${C.field}; color:${C.ink}; }
    .np-tab[aria-selected="true"] { color:${C.indigo}; font-weight:600; border-bottom-color:${C.indigo}; }
    .np-check { display:flex; align-items:center; gap:12px; min-height:44px; padding:0 12px; border:1px solid ${C.line}; border-radius:10px; background:${C.field}; transition: border-color .15s, background .15s; }
    .np-check:hover { border-color:#cfd4e8; background:#fff; }
    .np-check:focus-within { border-color:${C.indigo}; box-shadow:0 0 0 3px ${C.indigoSoft}; }
    .np-check input { width:18px; height:18px; margin:0; accent-color:${C.indigo}; cursor:pointer; flex:none; }
    .np-radio-card { display:flex; align-items:center; gap:10px; min-height:40px; padding:0 12px; border:1px solid ${C.line}; border-radius:10px; background:${C.field}; cursor:pointer; transition: border-color .15s, background .15s; }
    .np-radio-card:hover { border-color:#cfd4e8; background:#fff; }
    .np-radio-card:focus-within { border-color:${C.indigo}; box-shadow:0 0 0 3px ${C.indigoSoft}; }
    .np-radio-card input { width:18px; height:18px; margin:0; accent-color:${C.indigo}; cursor:pointer; flex:none; }
    .np-goal-text { flex:1; text-align:left; border:0; background:transparent; padding:8px 0; cursor:pointer; transition: color .15s; }
    .np-goal-text:hover { color:${C.indigo} !important; text-decoration: underline !important; text-underline-offset: 3px; text-decoration-color: #b9baf0; }
    .np-data-row { display:flex; align-items:center; justify-content:space-between; gap:12px; width:100%; min-height:46px; padding:10px 14px; border:1px solid ${C.line}; border-radius:10px; background:${C.field}; text-align:left; cursor:pointer; transition: border-color .15s, background .15s, color .15s; }
    .np-data-row:hover { border-color:#c9caf3; background:#fff; color:${C.indigo}; }
    .np-back-btn { display:inline-flex; align-items:center; gap:6px; height:32px; padding:0 10px; border:1px solid ${C.line}; border-radius:8px; background:${C.field}; color:${C.text}; font-size:13px; font-weight:600; cursor:pointer; transition: background .15s, border-color .15s, color .15s; }
    .np-back-btn:hover { background:${C.indigoSoft}; border-color:#c9caf3; color:${C.indigo}; }
  `;

  const headerTitle = activeNoteItem
    ? "Widget 4"
    : activeDataItem
    ? "Widget 3"
    : selectedGoal
    ? "Widget 2"
    : "Widget";

  return (
    <div
      className="np"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        minWidth: 320,
        background: C.page,
      }}
    >
      <style>{css}</style>

      {/* Header */}
      <header
        style={{
          height: 48,
          flex: "none",
          background: C.ink,
          color: "#fff",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 20px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: C.amber,
          }}
        />
        <span>{headerTitle}</span>
      </header>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 24px 56px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {activeNoteItem ? (
          /* ================= WIDGET 4: NOTE (TABLES VIEW) ================= */
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Top Navigation Bar */}
            <div
              style={{
                ...cardStyle,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="np-back-btn"
                onClick={() => {
                  const returnGoal = activeNoteContext?.returnToGoalId || null;
                  setActiveNoteContext(null);
                  if (returnGoal) {
                    setSelectedGoalId(returnGoal);
                  } else {
                    setSelectedGoalId(null);
                    setTab("note");
                  }
                }}
              >
                <BackIcon />
                {activeNoteContext?.returnToGoalId
                  ? "Quay lại Widget 2"
                  : "Quay lại Data"}
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flex: 1,
                  minWidth: 180,
                  justifyContent: "flex-end",
                }}
              >
                <Square color={C.teal} />
                <input
                  type="text"
                  aria-label="Tên Data"
                  className="np-input"
                  style={{
                    height: 32,
                    maxWidth: 260,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: C.ink,
                  }}
                  value={activeNoteItem.title}
                  onChange={(e) =>
                    updateNoteTitle(activeNoteItem.id, e.target.value)
                  }
                />
              </div>
            </div>

            <DataTable
              id="tbl-indicators"
              title="Bảng chỉ số"
              color={C.teal}
              cols={COLS_INDICATORS}
              rows={activeNoteItem.indicators}
              onAddRow={(newRow) =>
                appendNoteTableRow(activeNoteItem.id, "indicators", newRow)
              }
            />
            <DataTable
              id="tbl-results"
              title="Bảng kết quả"
              color={C.coral}
              cols={COLS_RESULTS}
              rows={activeNoteItem.results}
              onAddRow={(newRow) =>
                appendNoteTableRow(activeNoteItem.id, "results", newRow)
              }
            />
          </div>
        ) : activeDataItem ? (
          /* ================= WIDGET 3: DATA VIEW ================= */
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {/* Navigation Top Bar */}
            <div
              style={{
                ...cardStyle,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <button
                type="button"
                className="np-back-btn"
                onClick={() => {
                  const returnGoal = activeDataContext?.returnToGoalId || null;
                  setActiveDataContext(null);
                  if (returnGoal) {
                    setSelectedGoalId(returnGoal);
                  } else {
                    setSelectedGoalId(null);
                    setTab("data");
                  }
                }}
              >
                <BackIcon />
                {activeDataContext?.returnToGoalId
                  ? "Quay lại Widget 2"
                  : "Quay lại Note"}
              </button>

              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: C.violet,
                  background: C.indigoSoft,
                  padding: "4px 10px",
                  borderRadius: 999,
                  maxWidth: 210,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={
                  activeDataItem.title.trim() || activeDataItem.defaultLabel
                }
              >
                {activeDataItem.title.trim() || activeDataItem.defaultLabel}
              </span>
            </div>

            <section aria-label="Tiêu đề và ghi chú" style={cardStyle}>
              <Field id="w3-title" label="Tiêu đề">
                <input
                  id="w3-title"
                  className="np-input"
                  type="text"
                  placeholder="Chưa nhập"
                  value={activeDataItem.title}
                  onChange={updateDataField(activeDataItem.id, "title")}
                />
              </Field>
              <Field id="w3-note" label="Ghi chú" last>
                <textarea
                  id="w3-note"
                  className="np-input"
                  style={{ minHeight: 84 }}
                  placeholder="Chưa nhập"
                  value={activeDataItem.note}
                  onChange={updateDataField(activeDataItem.id, "note")}
                />
              </Field>
            </section>

            <section style={cardStyle}>
              <fieldset
                style={{
                  border: 0,
                  margin: 0,
                  padding: 0,
                  minWidth: 0,
                  marginBottom: 14,
                }}
              >
                <legend style={{ padding: 0, marginBottom: 10, width: "100%" }}>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: C.violet,
                        flex: "none",
                        marginTop: 5,
                      }}
                    />
                    Chọn – loại/ vị trí trong Docs + vị trí trong tiến trình cây
                  </span>
                </legend>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {DATA_OPTIONS.map((o) => (
                    <label key={o} className="np-radio-card">
                      <input
                        type="radio"
                        name={`w3-kind-${activeDataItem.id}`}
                        value={o}
                        checked={activeDataItem.kind === o}
                        onChange={updateDataField(activeDataItem.id, "kind")}
                      />
                      {o}
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field id="w3-prop" label="Tính chất" last>
                <input
                  id="w3-prop"
                  className="np-input"
                  type="text"
                  placeholder="Chưa nhập"
                  value={activeDataItem.prop}
                  onChange={updateDataField(activeDataItem.id, "prop")}
                />
              </Field>
            </section>
          </div>
        ) : !selectedGoal ? (
          /* ================= WIDGET 1: MAIN VIEW ================= */
          <section
            aria-label="Widget"
            style={{
              width: "100%",
              maxWidth: 420,
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              role="tablist"
              aria-label="Widget"
              style={{ display: "flex", borderBottom: `1px solid ${C.line}` }}
            >
              {TABS.map((x) => (
                <button
                  key={x.id}
                  id={`tab-${x.id}`}
                  type="button"
                  role="tab"
                  className="np-tab"
                  aria-selected={tab === x.id}
                  aria-controls={`panel-${x.id}`}
                  onClick={() => setTab(x.id)}
                >
                  {x.t}
                </button>
              ))}
            </div>

            <div
              id={`panel-${tab}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab}`}
              style={{ padding: 20 }}
            >
              <h2
                style={{
                  margin: "0 0 14px",
                  fontSize: 16,
                  fontWeight: 700,
                  color: C.ink,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Square
                  color={
                    tab === "checklist"
                      ? C.indigo
                      : tab === "note"
                      ? C.teal
                      : C.violet
                  }
                />
                {TABS.find((x) => x.id === tab).t}
              </h2>

              {tab === "checklist" ? (
                <>
                  <div
                    style={{
                      border: `1px solid ${C.line}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                      background: C.field,
                      marginBottom: 14,
                    }}
                  >
                    <div style={{ fontSize: 12.5, color: C.muted }}>Streak</div>
                    <div
                      style={{ fontSize: 20, fontWeight: 700, color: C.ink }}
                    >
                      {DEMO.streak}
                    </div>
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {goals.map((g) => (
                      <li key={g.id}>
                        <div className="np-check">
                          <input
                            type="checkbox"
                            aria-label={`Hoàn thành ${g.t}`}
                            checked={!!done[g.id]}
                            onChange={() => toggleDone(g.id)}
                          />
                          <button
                            type="button"
                            className="np-goal-text"
                            onClick={() => setSelectedGoalId(g.id)}
                            style={{
                              color: done[g.id] ? C.muted : C.ink,
                              textDecoration: done[g.id]
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {g.t}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {addingGoal ? (
                    <form
                      onSubmit={handleAddGoal}
                      style={{
                        marginTop: 12,
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <input
                        type="text"
                        className="np-input"
                        placeholder="Tên mục tiêu mới..."
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="np-btn primary"
                        style={{ padding: "0 14px", flex: "none" }}
                      >
                        Lưu
                      </button>
                      <button
                        type="button"
                        className="np-btn"
                        style={{ padding: "0 12px", flex: "none" }}
                        onClick={() => {
                          setAddingGoal(false);
                          setNewGoalTitle("");
                        }}
                      >
                        Huỷ
                      </button>
                    </form>
                  ) : (
                    <div style={{ marginTop: 12 }}>
                      <button
                        type="button"
                        className="np-btn"
                        style={{ width: "100%", justifyContent: "center" }}
                        onClick={() => setAddingGoal(true)}
                      >
                        + Thêm Goal
                      </button>
                    </div>
                  )}
                </>
              ) : tab === "note" ? (
                /* ================= TAB DATA (MỞ WIDGET 4) ================= */
                <>
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {noteItems.map((note) => (
                      <li key={note.id}>
                        <button
                          type="button"
                          className="np-data-row"
                          onClick={() =>
                            setActiveNoteContext({
                              noteId: note.id,
                              returnToGoalId: null,
                            })
                          }
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              minWidth: 0,
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 600,
                                color: C.ink,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {note.title.trim() || "Data chưa đặt tên"}
                            </span>
                            <span
                              style={{
                                fontSize: 12.5,
                                color: C.muted,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Chỉ số ({note.indicators.length}) • Kết quả (
                              {note.results.length})
                            </span>
                          </div>
                          <span
                            style={{
                              color: C.teal,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              fontSize: 13,
                              fontWeight: 600,
                              flex: "none",
                            }}
                          >
                            Mở bảng
                            <ArrowRightIcon />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      className="np-btn"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => handleAddNewNote(null)}
                    >
                      + Thêm Data
                    </button>
                  </div>
                </>
              ) : (
                /* ================= TAB NOTE (MỞ WIDGET 3) ================= */
                <>
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {dataItems.map((item) => {
                      const displayTitle =
                        item.title.trim() || item.defaultLabel;
                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            className="np-data-row"
                            onClick={() =>
                              setActiveDataContext({
                                itemId: item.id,
                                returnToGoalId: null,
                              })
                            }
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                minWidth: 0,
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 600,
                                  color: C.ink,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {displayTitle}
                              </span>
                              <span
                                style={{
                                  fontSize: 12.5,
                                  color: C.muted,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.kind
                                  ? `${item.kind}${
                                      item.prop ? ` • ${item.prop}` : ""
                                    }`
                                  : item.note.trim() || "Nhấp để mở Note"}
                              </span>
                            </div>
                            <span
                              style={{
                                color: C.muted,
                                display: "inline-flex",
                                flex: "none",
                              }}
                            >
                              <ArrowRightIcon />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div style={{ marginTop: 12 }}>
                    <button
                      type="button"
                      className="np-btn"
                      style={{ width: "100%", justifyContent: "center" }}
                      onClick={() => handleAddNewData(null)}
                    >
                      + Thêm Note
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        ) : (
          /* ================= WIDGET 2: DETAIL VIEW ================= */
          <section
            aria-labelledby="w2-title"
            style={{
              width: "100%",
              maxWidth: 420,
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: 20,
            }}
          >
            {/* Top Bar: Back Button & Selected Goal Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                paddingBottom: 14,
                marginBottom: 16,
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <button
                type="button"
                className="np-back-btn"
                onClick={() => {
                  setSelectedGoalId(null);
                  setTab("checklist");
                }}
              >
                <BackIcon />
                Quay lại
              </button>

              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: C.indigo,
                  background: C.indigoSoft,
                  padding: "4px 10px",
                  borderRadius: 999,
                  maxWidth: 230,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={selectedGoal.t}
              >
                {selectedGoal.t}
              </span>
            </div>

            <h2
              id="w2-title"
              style={{
                margin: "0 0 14px",
                fontSize: 16,
                fontWeight: 700,
                color: C.ink,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Square color={C.teal} />
              Action – Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field id="w2-start" label="Bắt đầu">
                <input
                  id="w2-start"
                  className="np-input"
                  type="text"
                  placeholder="XX:XX"
                  value={currentDetail.start}
                  onChange={updateDetailField(selectedGoal.id, "start")}
                />
              </Field>
              <Field id="w2-due" label="Thời hạn">
                <input
                  id="w2-due"
                  className="np-input"
                  type="text"
                  placeholder="XXh XX'"
                  value={currentDetail.due}
                  onChange={updateDetailField(selectedGoal.id, "due")}
                />
              </Field>
            </div>
            <Field id="w2-key" label="Mấu chốt" last>
              <input
                id="w2-key"
                className="np-input"
                type="text"
                placeholder="Chưa nhập"
                value={currentDetail.key}
                onChange={updateDetailField(selectedGoal.id, "key")}
              />
            </Field>

            <div
              style={{ height: 1, background: C.line, margin: "20px 0" }}
            />

            <h3
              style={{
                margin: "0 0 14px",
                fontSize: 16,
                fontWeight: 700,
                color: C.ink,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Square color={C.violet} />
              Optional
              <span
                style={{ fontSize: 12, fontWeight: 400, color: C.muted }}
              >
                Không bắt buộc
              </span>
            </h3>

            <Field id="w2-method" label="Phương pháp thực thi">
              <input
                id="w2-method"
                className="np-input"
                type="text"
                placeholder="Chưa nhập"
                value={currentDetail.method}
                onChange={updateDetailField(selectedGoal.id, "method")}
              />
            </Field>
            <Field id="w2-tool" label="Công cụ">
              <input
                id="w2-tool"
                className="np-input"
                type="text"
                placeholder="Chưa nhập"
                value={currentDetail.tool}
                onChange={updateDetailField(selectedGoal.id, "tool")}
              />
            </Field>
            <Field id="w2-place" label="Địa điểm">
              <input
                id="w2-place"
                className="np-input"
                type="text"
                placeholder="Chưa nhập"
                value={currentDetail.place}
                onChange={updateDetailField(selectedGoal.id, "place")}
              />
            </Field>
            <Field id="w2-other" label="Khác" last>
              <textarea
                id="w2-other"
                className="np-input"
                style={{ minHeight: 76 }}
                placeholder="Chưa nhập"
                value={currentDetail.other}
                onChange={updateDetailField(selectedGoal.id, "other")}
              />
            </Field>

            <div
              style={{ height: 1, background: C.line, margin: "20px 0" }}
            />

            {/* Quick Links to Widget 4 (Data) and Widget 3 (Note) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginBottom: 18,
              }}
            >
              <button
                type="button"
                className="np-data-row"
                onClick={() => handleOpenGoalNote(selectedGoal.id)}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 600,
                    color: C.ink,
                    minWidth: 0,
                  }}
                >
                  <Square color={C.teal} />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Data ({selectedGoal.t})
                  </span>
                </span>
                <span
                  style={{
                    color: C.teal,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 13,
                    fontWeight: 600,
                    flex: "none",
                  }}
                >
                  Mở Data
                  <ArrowRightIcon />
                </span>
              </button>

              <button
                type="button"
                className="np-data-row"
                onClick={() => handleOpenGoalData(selectedGoal.id)}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight: 600,
                    color: C.ink,
                    minWidth: 0,
                  }}
                >
                  <Square color={C.violet} />
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Note ({selectedGoal.t})
                  </span>
                </span>
                <span
                  style={{
                    color: C.indigo,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 13,
                    fontWeight: 600,
                    flex: "none",
                  }}
                >
                  Mở Note
                  <ArrowRightIcon />
                </span>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <button
                type="button"
                className="np-icon-btn"
                aria-label="Đánh dấu hoàn thành"
                aria-pressed={!!done[selectedGoal.id]}
                onClick={() => toggleDone(selectedGoal.id)}
              >
                <CheckIcon />
              </button>
              <span
                style={{
                  fontSize: 13,
                  color: done[selectedGoal.id] ? C.teal : C.muted,
                  fontWeight: done[selectedGoal.id] ? 600 : 400,
                }}
              >
                {done[selectedGoal.id] ? "Đã hoàn thành" : "Chưa hoàn thành"}
              </span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}