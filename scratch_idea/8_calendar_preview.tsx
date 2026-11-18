import { useState } from "react";

const C = {
  ink: "#1b2038", text: "#2b3150", muted: "#6a7192", page: "#f5f6fb",
  card: "#ffffff", line: "#e3e6f1", field: "#f9faff",
  indigo: "#4f52d9", indigoSoft: "#ececfc",
  teal: "#0fa89a", tealSoft: "#e3f6f4",
  violet: "#7b4fe0", coral: "#f0524f", amber: "#e8960c",
  midBottom: "#eef0f8", rightCol: "#eceef9",
};

const FORMATS = [
  { v: "month", t: "Month" },
  { v: "week", t: "Week" },
  { v: "day", t: "Day" },
];
const INITIAL_SGS = [
  { id: 0, bar: "SG 1 (P name/ Chặng/ )", btn: "SG 1 - small goal" },
  { id: 1, bar: "SG 2 (P name/ Chặng/ Goal 1/ Goal 2)", btn: "SG 2 - small goal" },
];
const HOURS = Array.from({ length: 24 }, (_, h) => `${String(h).padStart(2, "0")}:00`);
const EMPTY = { start: "", due: "", top: "", method: "", tool: "", place: "", other: "", repeat: "" };
const EVENT_COLORS = [
  { bg: "#ececfc", border: "#4f52d9", text: "#26288a", badge: "#d7d8fa" },
  { bg: "#e3f6f4", border: "#0fa89a", text: "#095c54", badge: "#c5ede9" },
  { bg: "#f1ebfc", border: "#7b4fe0", text: "#432291", badge: "#e0d2fa" },
  { bg: "#fef3e2", border: "#e8960c", text: "#7c4d03", badge: "#fce3b8" },
  { bg: "#fdeaea", border: "#f0524f", text: "#851e1c", badge: "#fbd0cf" },
];

function parseStartMinutes(str) {
  if (!str) return null;
  const match = str.trim().match(/^(\d{1,2})(?::(\d{1,2}))?/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = match[2] ? parseInt(match[2], 10) : 0;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function parseDurationMinutes(str) {
  if (!str || !str.trim()) return 60;
  const s = str.trim().toLowerCase();
  const hm = s.match(/(\d+)\s*h\s*(\d+)?/);
  if (hm) {
    const h = parseInt(hm[1], 10) || 0;
    const m = hm[2] ? parseInt(hm[2], 10) : 0;
    return Math.max(25, h * 60 + m);
  }
  const mOnly = s.match(/^(\d+)\s*['m]?$/);
  if (mOnly) {
    return Math.max(25, parseInt(mOnly[1], 10));
  }
  return 60;
}

function Square({ color }) {
  return (
    <span
      aria-hidden="true"
      style={{ width: 9, height: 9, borderRadius: 2.5, background: color, display: "inline-block", flex: "none" }}
    />
  );
}

function Field({ id, label, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3, ...style }}>
      <label htmlFor={id} style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Icon({ kind }) {
  const p = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  if (kind === "month")
    return (
      <svg {...p}>
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M3 10h18M9 4v17M15 4v17" />
      </svg>
    );
  if (kind === "week")
    return (
      <svg {...p}>
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M3 10h18M3 15.5h18" />
      </svg>
    );
  if (kind === "back")
    return (
      <svg {...p} width="18" height="18">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    );
  if (kind === "collapse")
    return (
      <svg {...p} width="16" height="16">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16M15 9l-3 3 3 3" />
      </svg>
    );
  if (kind === "expand")
    return (
      <svg {...p} width="16" height="16">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16M13 9l3 3-3 3" />
      </svg>
    );
  return (
    <svg {...p}>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 10h18M12 14v3" />
    </svg>
  );
}

export default function App() {
  const [format, setFormat] = useState("day");
  const [sgs, setSgs] = useState(INITIAL_SGS);
  const [sg, setSg] = useState(0);
  const [project, setProject] = useState("");
  const [forms, setForms] = useState([EMPTY, EMPTY]);
  const [savedForms, setSavedForms] = useState([EMPTY, EMPTY]);
  const [saved, setSaved] = useState(false);
  const [sgSavedNotice, setSgSavedNotice] = useState(false);
  const [showOptional, setShowOptional] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [backNotice, setBackNotice] = useState(false);
  const [draggedSgIdx, setDraggedSgIdx] = useState(null);
  const [dragOverHour, setDragOverHour] = useState(null);
  const [editingSgIdx, setEditingSgIdx] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const f = forms[sg] || EMPTY;
  const isSgDirty = JSON.stringify(f) !== JSON.stringify(savedForms[sg] || EMPTY);

  const set = (k) => (e) => {
    const v = e.target.value;
    setForms((fs) => fs.map((x, i) => (i === sg ? { ...x, [k]: v } : x)));
    setSaved(false);
    setSgSavedNotice(false);
  };

  const handleAddSg = () => {
    const nextIdx = sgs.length;
    const nextNum = nextIdx + 1;
    const newSgItem = {
      id: Date.now() + Math.random(),
      bar: `SG ${nextNum}`,
      btn: `SG ${nextNum} - small goal`,
    };
    setSgs((prev) => [...prev, newSgItem]);
    setForms((prev) => [...prev, { ...EMPTY }]);
    setSavedForms((prev) => [...prev, { ...EMPTY }]);
    setSg(nextIdx);
    setSaved(false);
    setSgSavedNotice(false);
  };

  const handleRenameSg = (idx, rawName) => {
    const trimmed = rawName.trim();
    if (!trimmed) {
      setEditingSgIdx(null);
      return;
    }
    setSgs((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const parenMatch = item.bar.match(/\s*(\([^)]*\))$/);
        const newBar = parenMatch ? `${trimmed} ${parenMatch[1]}` : trimmed;
        return { ...item, btn: trimmed, bar: newBar };
      })
    );
    setEditingSgIdx(null);
    setSaved(false);
  };

  const handleUnscheduleSg = (idx, e) => {
    if (e) e.stopPropagation();
    setForms((fs) => fs.map((x, i) => (i === idx ? { ...x, start: "" } : x)));
    setSaved(false);
    setSgSavedNotice(false);
  };

  const handleDeleteSg = (idx, e) => {
    if (e) e.stopPropagation();
    setSgs((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length === 0) {
        return [{ id: Date.now(), bar: "SG 1", btn: "SG 1 - small goal" }];
      }
      return next;
    });
    setForms((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length === 0 ? [{ ...EMPTY }] : next;
    });
    setSavedForms((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next.length === 0 ? [{ ...EMPTY }] : next;
    });
    setSg((prevSg) => {
      const remainingCount = Math.max(1, sgs.length - 1);
      if (prevSg === idx) return Math.min(idx, remainingCount - 1);
      if (prevSg > idx) return prevSg - 1;
      return prevSg;
    });
    if (editingSgIdx === idx) setEditingSgIdx(null);
    setSaved(false);
    setSgSavedNotice(false);
  };

  const handleDropOnHour = (hourIndex) => {
    if (draggedSgIdx === null) return;
    const formattedHour = `${String(hourIndex).padStart(2, "0")}:00`;
    setForms((fs) =>
      fs.map((x, i) => (i === draggedSgIdx ? { ...x, start: formattedHour } : x))
    );
    setSg(draggedSgIdx);
    setSaved(false);
    setSgSavedNotice(false);
    setDraggedSgIdx(null);
    setDragOverHour(null);
  };

  const handleSaveSg = () => {
    setSavedForms((sf) => sf.map((x, i) => (i === sg ? { ...forms[sg] } : x)));
    setSgSavedNotice(true);
    setTimeout(() => setSgSavedNotice(false), 2200);
  };

  const handleSaveAll = () => {
    setSavedForms(forms.map((x) => ({ ...x })));
    setSaved(true);
    setSgSavedNotice(false);
  };

  const handleBack = () => {
    setBackNotice(true);
    setTimeout(() => setBackNotice(false), 2200);
  };

  const css = `
    .np * { box-sizing: border-box; }
    .np { font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif; color: ${C.text}; font-size: 13.5px; line-height: 1.4; }
    .np button, .np input { font-family: inherit; font-size: inherit; color: inherit; }
    .np-nav { display:flex; align-items:center; gap:10px; width:100%; height:36px; padding:0 10px; border:0; border-radius:9px; background:transparent; color:${C.muted}; font-weight:500; text-align:left; cursor:pointer; transition: background .15s, color .15s; white-space: nowrap; overflow: hidden; }
    .np-nav:hover { background:#fff; color:${C.ink}; }
    .np-nav[aria-current="page"] { background:${C.indigoSoft}; color:${C.indigo}; font-weight:600; }
    .np-input { width:100%; height:32px; padding:0 10px; border:1px solid ${C.line}; border-radius:8px; background:${C.field}; font-size:13px; transition: border-color .15s, box-shadow .15s, background .15s; }
    .np-input:hover { border-color:#cfd4e8; }
    .np-input:focus { outline:none; background:#fff; border-color:${C.indigo}; box-shadow:0 0 0 2.5px ${C.indigoSoft}; }
    .np-sg-pill { width:100%; max-width:340px; min-height:38px; flex:none; padding:0 14px; border-radius:999px; border:1.5px solid ${C.line}; background:#f4f5fb; color:${C.ink}; font-weight:600; font-size:13.5px; cursor:grab; transition: all .16s ease; display:flex; align-items:center; justify-content:space-between; user-select:none; }
    .np-sg-pill:active { cursor:grabbing; }
    .np-sg-pill:hover { border-color:#b8baf2; background:${C.indigoSoft}; color:${C.indigo}; transform:translateY(-1px); }
    .np-sg-pill[aria-pressed="true"] { background:${C.indigoSoft}; border-color:${C.indigo}; color:${C.indigo}; box-shadow: 0 4px 12px -4px rgba(79,82,217,0.32); }
    .np-sg-pill.dragging { opacity:0.55; transform:scale(0.98); }
    .np-add-sg { width:100%; max-width:340px; height:34px; flex:none; border-radius:999px; border:1.5px dashed #b9baf0; background:#fff; color:${C.indigo}; font-weight:600; font-size:12.5px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px; transition: all .15s ease; }
    .np-add-sg:hover { background:${C.indigoSoft}; border-style:solid; border-color:${C.indigo}; }
    .np-save { height:34px; padding:0 16px; border:1px solid ${C.indigo}; border-radius:9px; background:${C.indigo}; color:#fff; font-weight:600; font-size:13px; cursor:pointer; box-shadow:0 6px 14px -6px ${C.indigo}; transition: background .15s; }
    .np-save:hover { background:#4144c4; }
    .np-sg-save { height:30px; padding:0 12px; border:1px solid ${C.teal}; border-radius:8px; background:${C.teal}; color:#fff; font-weight:600; font-size:12px; cursor:pointer; display:inline-flex; align-items:center; gap:5px; transition: all .15s; box-shadow:0 4px 10px -4px rgba(15,168,154,0.45); }
    .np-sg-save:hover { background:#0d9488; }
    .np-sg-save:disabled { background:#e3e6f1; border-color:#d5d9ee; color:${C.muted}; cursor:default; box-shadow:none; }
    .np-opt-toggle { width:100%; display:flex; align-items:center; justify-content:space-between; padding:8px 12px; border:1px dashed #c9caf3; border-radius:9px; background:${C.field}; color:${C.ink}; font-weight:600; font-size:13px; cursor:pointer; transition: all .15s ease; }
    .np-opt-toggle:hover { background:${C.indigoSoft}; border-color:${C.indigo}; }
    .np-opt-toggle[aria-expanded="true"] { background:${C.indigoSoft}; border-style:solid; border-color:#c9caf3; }
    .np-back-btn { width:36px; height:36px; border:0; border-radius:10px; background:linear-gradient(135deg, ${C.indigo}, ${C.violet}); color:#fff; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex:none; box-shadow:0 6px 14px -6px ${C.indigo}; transition: transform .12s, filter .15s; }
    .np-back-btn:hover { filter:brightness(1.08); transform:translateX(-1px); }
    .np-back-btn:active { transform:scale(0.96); }
    .np-toggle-btn { width:30px; height:30px; border:1px solid #d5d9ee; border-radius:8px; background:#fff; color:${C.muted}; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex:none; transition: all .15s; }
    .np-toggle-btn:hover { color:${C.indigo}; border-color:${C.indigo}; background:${C.indigoSoft}; }
    .np-mini-action { width:22px; height:22px; border:0; border-radius:999px; background:transparent; color:${C.muted}; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; padding:0; transition: all .14s; }
    .np-mini-action:hover { background:rgba(27,32,56,0.08); color:${C.ink}; }
    .np-mini-action.danger:hover { background:#fdeaea; color:${C.coral}; }
    .np-scroll::-webkit-scrollbar { width: 5px; }
    .np-scroll::-webkit-scrollbar-thumb { background: #cfd4e8; border-radius: 99px; }
  `;

  return (
    <div
      className="np"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: C.page,
      }}
    >
      <style>{css}</style>

      {/* Header trên cùng */}
      <header
        style={{
          height: 44,
          flex: "none",
          background: C.ink,
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: C.amber }} />
          Calendar
        </div>
        {backNotice && (
          <span
            role="status"
            style={{
              fontSize: 12,
              fontWeight: 500,
              background: "rgba(255,255,255,0.12)",
              padding: "3px 10px",
              borderRadius: 99,
              color: "#e3e6f1",
            }}
          >
            Đang quay lại trang trước...
          </span>
        )}
      </header>

      {/* Bố cục 3 cột chính */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* CỘT 1: Sidebar bên trái (có thể thu gọn / mở rộng) */}
        <aside
          style={{
            width: collapsed ? 60 : 248,
            flex: "none",
            background: "#eceef9",
            borderRight: `1px solid ${C.line}`,
            display: "flex",
            flexDirection: "column",
            padding: collapsed ? "14px 11px" : "14px 14px",
            transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1), padding 0.22s ease",
            overflow: "hidden",
          }}
        >
          {/* Hàng trên cùng: Nút Quay lại (ô tím-xanh) + Nút thu vào / mở ra */}
          <div
            style={{
              display: "flex",
              flexDirection: collapsed ? "column" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 14,
            }}
          >
            <button
              type="button"
              className="np-back-btn"
              title="Quay lại"
              aria-label="Quay lại"
              onClick={handleBack}
            >
              <Icon kind="back" />
            </button>

            <button
              type="button"
              className="np-toggle-btn"
              title={collapsed ? "Mở rộng thanh giao diện" : "Thu gọn thanh giao diện"}
              aria-label={collapsed ? "Mở rộng thanh giao diện" : "Thu gọn thanh giao diện"}
              onClick={() => setCollapsed((c) => !c)}
            >
              <Icon kind={collapsed ? "expand" : "collapse"} />
            </button>
          </div>

          {/* Calendar - Format */}
          <nav aria-label="Calendar – Format">
            {!collapsed && (
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, paddingLeft: 4 }}>
                Calendar – Format
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {FORMATS.map((x) => (
                <button
                  key={x.v}
                  type="button"
                  className="np-nav"
                  title={x.t}
                  style={{ justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? 0 : "0 10px" }}
                  aria-current={format === x.v ? "page" : undefined}
                  onClick={() => setFormat(x.v)}
                >
                  <Icon kind={x.v} />
                  {!collapsed && <span>{x.t}</span>}
                </button>
              ))}
            </div>
          </nav>

          {/* Đường kẻ phân cách đậm nét theo wireframe */}
          <div style={{ height: 3, background: C.ink, borderRadius: 2, margin: "14px 0", opacity: 0.85 }} />

          {/* Phần mở rộng khi sidebar mở */}
          {!collapsed && (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflowY: "auto" }} className="np-scroll">
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="project-info"
                  style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}
                >
                  Project Information
                </label>
                <input
                  id="project-info"
                  className="np-input"
                  style={{ background: "#fff" }}
                  type="text"
                  placeholder="Chưa nhập"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />
              </div>

              <nav aria-label="Project bar">
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6 }}>
                  Project bar ({sgs.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sgs.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className="np-nav"
                      style={{
                        height: "auto",
                        minHeight: 38,
                        padding: "7px 10px",
                        fontSize: 12.5,
                        lineHeight: 1.35,
                        whiteSpace: "normal",
                        alignItems: "flex-start",
                      }}
                      aria-current={sg === i ? "page" : undefined}
                      onClick={() => setSg(i)}
                    >
                      <span style={{ color: C.indigo, fontWeight: 700 }}>•</span>
                      <span>{item.bar}</span>
                    </button>
                  ))}
                </div>
              </nav>
            </div>
          )}
        </aside>

        {/* CỘT 2: Khu vực trung tâm gồm 2 tầng */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Tầng trên: Thẻ bo góc tròn chứa các nút SG có thể cuộn + kéo thả + nút thêm SG mới */}
          <section
            aria-label="Danh sách SG"
            style={{
              flex: "0 0 35%",
              minHeight: 165,
              maxHeight: 230,
              background: C.page,
              padding: "14px 24px 8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: 420,
                height: "100%",
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 24,
                padding: "12px 14px 10px",
                boxShadow: "0 4px 16px rgba(27, 32, 56, 0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                overflow: "hidden",
              }}
            >
              {/* Danh sách các nút SG có thể cuộn mượt khi nhiều mục tiêu & kéo thả vào lịch */}
              <div
                className="np-scroll"
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 9,
                  padding: "4px 6px 8px",
                }}
              >
                {sgs.map((item, i) => {
                  const itemDirty = JSON.stringify(forms[i] || EMPTY) !== JSON.stringify(savedForms[i] || EMPTY);
                  const hasScheduled = parseStartMinutes((forms[i] || EMPTY).start) !== null;
                  const isEditing = editingSgIdx === i;
                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      draggable={!isEditing}
                      onDragStart={(e) => {
                        if (isEditing) return;
                        setDraggedSgIdx(i);
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", String(i));
                      }}
                      onDragEnd={() => {
                        setDraggedSgIdx(null);
                        setDragOverHour(null);
                      }}
                      className={`np-sg-pill ${draggedSgIdx === i ? "dragging" : ""}`}
                      aria-pressed={sg === i}
                      title="Nhấn để chỉnh sửa, đúp chuột để đổi tên hoặc kéo thả vào khung giờ bên phải"
                      onClick={() => {
                        setSg(i);
                        setSgSavedNotice(false);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingSgIdx(i);
                        setEditingTitle(item.btn);
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{ display: "inline-flex", alignItems: "center", color: C.muted, opacity: 0.75, flex: "none" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="9" cy="6" r="1.7" />
                          <circle cx="15" cy="6" r="1.7" />
                          <circle cx="9" cy="12" r="1.7" />
                          <circle cx="15" cy="12" r="1.7" />
                          <circle cx="9" cy="18" r="1.7" />
                          <circle cx="15" cy="18" r="1.7" />
                        </svg>
                      </span>

                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center", minWidth: 0, padding: "0 4px" }}>
                        {isEditing ? (
                          <input
                            type="text"
                            autoFocus
                            value={editingTitle}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onBlur={() => handleRenameSg(i, editingTitle)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleRenameSg(i, editingTitle);
                              } else if (e.key === "Escape") {
                                setEditingSgIdx(null);
                              }
                            }}
                            style={{
                              width: "100%",
                              height: 24,
                              padding: "0 8px",
                              borderRadius: 999,
                              border: `1.5px solid ${C.indigo}`,
                              background: "#fff",
                              color: C.ink,
                              fontSize: 13,
                              fontWeight: 600,
                              textAlign: "center",
                              outline: "none",
                            }}
                          />
                        ) : (
                          <>
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {item.btn}
                            </span>
                            {hasScheduled && (
                              <span
                                style={{
                                  flex: "none",
                                  fontSize: 10.5,
                                  fontWeight: 600,
                                  padding: "1px 6px",
                                  borderRadius: 99,
                                  background: "#fff",
                                  color: C.indigo,
                                  border: `1px solid #c9caf3`,
                                }}
                              >
                                {(forms[i] || EMPTY).start}
                              </span>
                            )}
                          </>
                        )}
                      </span>

                      <span style={{ display: "inline-flex", alignItems: "center", gap: 2, flex: "none" }}>
                        {itemDirty && (
                          <span
                            title="Có thay đổi chưa lưu"
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: C.amber,
                              display: "inline-block",
                              marginRight: 2,
                            }}
                          />
                        )}
                        {!isEditing && (
                          <button
                            type="button"
                            className="np-mini-action"
                            title="Đổi tên SG"
                            aria-label="Đổi tên SG"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSgIdx(i);
                              setEditingTitle(item.btn);
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                          </button>
                        )}
                        <button
                          type="button"
                          className="np-mini-action danger"
                          title="Xóa SG này"
                          aria-label="Xóa SG này"
                          onClick={(e) => handleDeleteSg(i, e)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Nút Thêm SG mới cố định gọn ở đáy thẻ bo tròn */}
              <div
                style={{
                  flex: "none",
                  paddingTop: 8,
                  borderTop: `1px dashed ${C.line}`,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  type="button"
                  className="np-add-sg"
                  onClick={handleAddSg}
                  title="Tạo thêm một mục tiêu nhỏ (SG) mới"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span>Thêm SG mới</span>
                </button>
              </div>
            </div>
          </section>

          {/* Tầng dưới: Khối SG - Information + nút bật/tắt Optional + nút Save riêng cho SG */}
          <section
            aria-label="Thông tin chi tiết SG"
            style={{
              flex: 1,
              minHeight: 0,
              background: C.midBottom,
              padding: "10px 24px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              overflowY: "auto",
            }}
            className="np-scroll"
          >
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 18,
                padding: "16px 18px",
                boxShadow: "0 2px 8px rgba(27, 32, 56, 0.03)",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Khối 1: SG – Information kèm trạng thái & nút Save SG riêng */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 7 }}>
                      <Square color={C.teal} />
                      SG – Information
                    </h2>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: C.indigo, background: C.indigoSoft, padding: "2px 8px", borderRadius: 6 }}>
                      Đang sửa: {sgs[sg]?.btn || `SG ${sg + 1}`}
                    </span>
                    {isSgDirty && (
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: C.amber, background: "#fef5e7", padding: "2px 8px", borderRadius: 6 }}>
                        • Chưa lưu
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {sgSavedNotice && (
                      <span role="status" style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>
                        Đã lưu ✓
                      </span>
                    )}
                    <button
                      type="button"
                      className="np-sg-save"
                      disabled={!isSgDirty}
                      onClick={handleSaveSg}
                      title={isSgDirty ? `Lưu thay đổi cho ${sgs[sg]?.btn || `SG ${sg + 1}`}` : "Không có thay đổi mới"}
                    >
                      Save SG
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 10 }}>
                  <Field id="sg-start" label="• Bắt đầu">
                    <input
                      id="sg-start"
                      className="np-input"
                      type="text"
                      placeholder="XX:XX"
                      value={f.start}
                      onChange={set("start")}
                    />
                  </Field>
                  <Field id="sg-due" label="• Thời hạn">
                    <input
                      id="sg-due"
                      className="np-input"
                      type="text"
                      placeholder="XXh XX'"
                      value={f.due}
                      onChange={set("due")}
                    />
                  </Field>
                  <Field id="sg-top" label="• Mục tiêu tối quan trọng">
                    <input
                      id="sg-top"
                      className="np-input"
                      type="text"
                      placeholder="Chưa nhập"
                      value={f.top}
                      onChange={set("top")}
                    />
                  </Field>
                </div>
              </div>

              {/* Khối 2: Nút bật/tắt Optional – Không bắt buộc */}
              <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 12 }}>
                <button
                  type="button"
                  className="np-opt-toggle"
                  aria-expanded={showOptional}
                  onClick={() => setShowOptional((prev) => !prev)}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Square color={C.violet} />
                    <span>Optional –</span>
                    <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>
                      Không bắt buộc {showOptional ? "(Nhấn để thu gọn)" : "(Nhấn để thêm thông tin)"}
                    </span>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      color: C.muted,
                      transform: showOptional ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {showOptional && (
                  <div
                    style={{
                      marginTop: 12,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px 12px",
                    }}
                  >
                    <Field id="sg-method" label="• Phương pháp thực thi">
                      <input
                        id="sg-method"
                        className="np-input"
                        type="text"
                        placeholder="Chưa nhập"
                        value={f.method}
                        onChange={set("method")}
                      />
                    </Field>
                    <Field id="sg-tool" label="• Công cụ">
                      <input
                        id="sg-tool"
                        className="np-input"
                        type="text"
                        placeholder="Chưa nhập"
                        value={f.tool}
                        onChange={set("tool")}
                      />
                    </Field>
                    <Field id="sg-place" label="• Địa điểm">
                      <input
                        id="sg-place"
                        className="np-input"
                        type="text"
                        placeholder="Chưa nhập"
                        value={f.place}
                        onChange={set("place")}
                      />
                    </Field>
                    <Field id="sg-repeat" label="• Lặp lại">
                      <input
                        id="sg-repeat"
                        className="np-input"
                        type="text"
                        placeholder="Chưa nhập"
                        value={f.repeat}
                        onChange={set("repeat")}
                      />
                    </Field>
                    <Field id="sg-other" label="• Khác" style={{ gridColumn: "1 / -1" }}>
                      <input
                        id="sg-other"
                        className="np-input"
                        type="text"
                        placeholder="Chưa nhập"
                        value={f.other}
                        onChange={set("other")}
                      />
                    </Field>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* CỘT 3: Cột phải với nút Save + Day + danh sách Hour */}
        <aside
          aria-label="Lịch trong ngày"
          style={{
            width: 310,
            flex: "none",
            background: C.rightCol,
            borderLeft: `1px solid ${C.line}`,
            padding: "14px 18px 16px",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {/* Hàng trên cùng: Nút Save góc phải */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
            {saved && (
              <span role="status" style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>
                Đã lưu tất cả ✓
              </span>
            )}
            <button type="button" className="np-save" onClick={handleSaveAll}>
              Save
            </button>
          </div>

          {/* Tiêu đề Day căn giữa */}
          <div
            style={{
              textAlign: "center",
              fontSize: 17,
              fontWeight: 700,
              color: C.ink,
              margin: "6px 0 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Square color={C.indigo} />
            <span>Day</span>
          </div>

          {/* Nhãn Hour bên trái + gợi ý kéo thả */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.muted }}>Hour</span>
            <span style={{ fontSize: 11, color: C.muted }}>Kéo thả SG vào khung giờ</span>
          </div>

          {/* Danh sách 24 khung giờ hỗ trợ kéo thả & hiển thị khối sự kiện giống Google Calendar */}
          <div
            className="np-scroll"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 12,
              padding: "6px 10px",
            }}
          >
            <div style={{ position: "relative", height: 24 * 44 }}>
              {/* Các dòng giờ nền (mỗi giờ cao 44px) */}
              {HOURS.map((h, hourIdx) => {
                const isOver = dragOverHour === hourIdx;
                return (
                  <div
                    key={h}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      if (dragOverHour !== hourIdx) setDragOverHour(hourIdx);
                    }}
                    onDragLeave={() => {
                      if (dragOverHour === hourIdx) setDragOverHour(null);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropOnHour(hourIdx);
                    }}
                    style={{
                      height: 44,
                      display: "flex",
                      alignItems: "flex-start",
                      borderBottom: `1px solid ${C.line}`,
                      background: isOver ? C.indigoSoft : "transparent",
                      transition: "background 0.12s ease",
                      position: "relative",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        width: 44,
                        flex: "none",
                        fontSize: 11.5,
                        fontWeight: isOver ? 700 : 500,
                        color: isOver ? C.indigo : C.muted,
                        paddingTop: 4,
                        userSelect: "none",
                      }}
                    >
                      {h}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "100%",
                        borderLeft: `1px solid ${C.line}`,
                        paddingLeft: 8,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                        {isOver && draggedSgIdx !== null && (
                        <div
                          style={{
                            width: "100%",
                            height: 36,
                            borderRadius: 8,
                            border: `1.5px dashed ${C.indigo}`,
                            background: "rgba(79, 82, 217, 0.1)",
                            color: C.indigo,
                            fontSize: 12,
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            padding: "0 10px",
                            pointerEvents: "none",
                          }}
                        >
                          Thả {sgs[draggedSgIdx]?.btn || `SG ${draggedSgIdx + 1}`} vào {h}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Lớp phủ hiển thị các khối sự kiện SG đã xếp lịch */}
              {sgs.map((item, i) => {
                const formItem = forms[i] || EMPTY;
                const startMins = parseStartMinutes(formItem.start);
                if (startMins === null) return null;

                const durMins = parseDurationMinutes(formItem.due);
                const topPx = (startMins / 60) * 44 + 2;
                const maxAvailHeight = 24 * 44 - topPx - 2;
                const heightPx = Math.min(Math.max((durMins / 60) * 44 - 4, 28), maxAvailHeight);
                const palette = EVENT_COLORS[i % EVENT_COLORS.length];
                const isSelected = sg === i;

                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedSgIdx(i);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", String(i));
                    }}
                    onDragEnd={() => {
                      setDraggedSgIdx(null);
                      setDragOverHour(null);
                    }}
                    onClick={() => {
                      setSg(i);
                      setSgSavedNotice(false);
                    }}
                    title="Bấm để chỉnh sửa hoặc kéo sang giờ khác"
                    style={{
                      position: "absolute",
                      top: topPx,
                      left: 50,
                      right: 4,
                      height: heightPx,
                      background: palette.bg,
                      borderLeft: `3.5px solid ${palette.border}`,
                      borderTop: isSelected ? `1px solid ${palette.border}` : "1px solid transparent",
                      borderRight: isSelected ? `1px solid ${palette.border}` : "1px solid transparent",
                      borderBottom: isSelected ? `1px solid ${palette.border}` : "1px solid transparent",
                      borderRadius: 7,
                      padding: "3px 8px",
                      color: palette.text,
                      cursor: "grab",
                      boxShadow: isSelected
                        ? "0 4px 12px rgba(27, 32, 56, 0.14)"
                        : "0 1px 4px rgba(27, 32, 56, 0.08)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      overflow: "hidden",
                      zIndex: isSelected ? 4 : 2,
                      opacity: draggedSgIdx === i ? 0.5 : 1,
                      transition: "box-shadow 0.15s, opacity 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 4,
                        fontSize: 11.5,
                        fontWeight: 700,
                        lineHeight: 1.2,
                      }}
                    >
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>
                        {item.btn}{formItem.top ? ` • ${formItem.top}` : ""}
                      </span>
                      <span
                        style={{
                          flex: "none",
                          fontSize: 10,
                          fontWeight: 600,
                          background: palette.badge,
                          padding: "1px 5px",
                          borderRadius: 4,
                        }}
                      >
                        {formItem.start}
                        {formItem.due ? ` (${formItem.due})` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleUnscheduleSg(i, e)}
                        title="Xóa SG khỏi khung giờ Day (giữ lại trong danh sách SG)"
                        aria-label="Xóa SG khỏi khung giờ Day"
                        style={{
                          flex: "none",
                          width: 16,
                          height: 16,
                          border: 0,
                          borderRadius: 4,
                          background: "rgba(0,0,0,0.08)",
                          color: "inherit",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          padding: 0,
                          marginLeft: 2,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}