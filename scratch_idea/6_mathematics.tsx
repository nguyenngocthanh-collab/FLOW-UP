import React, { useState } from "react";

/* ---------- Design tokens ---------- */
const C = {
  ink: "#1b2038", text: "#2b3150", muted: "#6a7192", page: "#f5f6fb",
  card: "#ffffff", line: "#e3e6f1", field: "#f9faff",
  indigo: "#4f52d9", indigoSoft: "#ececfc",
  teal: "#0fa89a", tealSoft: "#e3f6f4",
  violet: "#7b4fe0", coral: "#f0524f", amber: "#e8960c",
};

/* ---------- Dữ liệu minh hoạ ---------- */
const STAGES = [
  { id: "stage-1", label: "Chặng 1" },
  { id: "stage-2", label: "Chặng 2" },
  { id: "stage-3", label: "Chặng 3" },
  { id: "stage-4", label: "Chặng 4" },
];

const TABLE_TYPES = {
  progress: {
    id: "progress",
    label: "Bảng chỉ số tiến độ",
    columns: [
      { key: "s1", label: "Status 1 (unit)" },
      { key: "s2", label: "Status 2 (unit)" },
      { key: "s3", label: "Status 3 (unit)" },
    ],
    defaultRows: {
      "stage-1": [
        { id: "r1", date: "12/11/2026", s1: 3.0, s2: 4.0, s3: 75 },
        { id: "r2", date: "13/11/2026", s1: 3.5, s2: 4.0, s3: 88 },
        { id: "r3", date: "14/11/2026", s1: 2.5, s2: 5.0, s3: 50 },
        { id: "r4", date: "15/11/2026", s1: 4.2, s2: 5.0, s3: 84 },
        { id: "r5", date: "16/11/2026", s1: 4.5, s2: 5.0, s3: 90 },
      ],
      "stage-2": [
        { id: "s2-r1", date: "17/11/2026", s1: 5.0, s2: 6.0, s3: 83 },
        { id: "s2-r2", date: "18/11/2026", s1: 5.4, s2: 6.0, s3: 90 },
        { id: "s2-r3", date: "19/11/2026", s1: 5.8, s2: 6.0, s3: 97 },
      ],
      "stage-3": [
        { id: "s3-r1", date: "20/11/2026", s1: 6.2, s2: 8.0, s3: 78 },
        { id: "s3-r2", date: "21/11/2026", s1: 7.0, s2: 8.0, s3: 88 },
      ],
      "stage-4": [
        { id: "s4-r1", date: "22/11/2026", s1: 8.5, s2: 10.0, s3: 85 },
        { id: "s4-r2", date: "23/11/2026", s1: 9.5, s2: 10.0, s3: 95 },
      ],
    },
  },
  resource: {
    id: "resource",
    label: "Bảng định mức vật tư",
    columns: [
      { key: "s1", label: "Thực xuất (kg)" },
      { key: "s2", label: "Định mức (kg)" },
      { key: "s3", label: "Hao hụt (%)" },
    ],
    defaultRows: {
      "stage-1": [
        { id: "m1-r1", date: "12/11/2026", s1: 120, s2: 150, s3: 2.5 },
        { id: "m1-r2", date: "13/11/2026", s1: 142, s2: 150, s3: 1.8 },
      ],
      "stage-2": [
        { id: "m2-r1", date: "17/11/2026", s1: 210, s2: 240, s3: 2.1 },
      ],
      "stage-3": [
        { id: "m3-r1", date: "20/11/2026", s1: 310, s2: 320, s3: 1.2 },
      ],
      "stage-4": [
        { id: "m4-r1", date: "22/11/2026", s1: 400, s2: 400, s3: 0.9 },
      ],
    },
  },
  performance: {
    id: "performance",
    label: "Bảng hiệu suất năng lực",
    columns: [
      { key: "s1", label: "Giờ chạy máy (h)" },
      { key: "s2", label: "Kế hoạch (h)" },
      { key: "s3", label: "Sản lượng (sp)" },
    ],
    defaultRows: {
      "stage-1": [
        { id: "p1-r1", date: "12/11/2026", s1: 7.5, s2: 8.0, s3: 320 },
        { id: "p1-r2", date: "13/11/2026", s1: 8.0, s2: 8.0, s3: 350 },
      ],
      "stage-2": [
        { id: "p2-r1", date: "17/11/2026", s1: 8.5, s2: 9.0, s3: 410 },
      ],
      "stage-3": [
        { id: "p3-r1", date: "20/11/2026", s1: 9.0, s2: 9.5, s3: 460 },
      ],
      "stage-4": [
        { id: "p4-r1", date: "22/11/2026", s1: 9.8, s2: 10.0, s3: 510 },
      ],
    },
  },
};

const DEMO = {
  title: "Mathematics",
  heading: "Trang tính toán",
  subtitle: "Chọn dòng dữ liệu, gán biến số và quan sát luồng công thức trực quan",
  note:
    "• Dùng CTT-01 để kiểm tra tỷ lệ hoàn thành thực tế so với định mức.\n• Bấm vào từng dòng trong Bảng chỉ số để xem luồng tính toán thay đổi theo ngày.",
  vars: [
    { id: "v-s1", name: "Status 1", sourceKey: "s1", unit: "unit", color: C.indigo, customVal: 4.5 },
    { id: "v-s2", name: "Status 2", sourceKey: "s2", unit: "unit", color: C.teal, customVal: 5.0 },
    { id: "v-s3", name: "Status 3", sourceKey: "s3", unit: "unit", color: C.violet, customVal: 90 },
  ],
  formulas: [
    { id: "f-ratio", code: "CTT-01", name: "Tỷ lệ đạt (%)", op: "ratio", unit: "%" },
    { id: "f-diff", code: "CTT-02", name: "Chênh lệch", op: "diff", unit: "unit" },
    { id: "f-sum", code: "CTT-03", name: "Tổng hợp", op: "sum", unit: "unit" },
    { id: "f-avg", code: "CTT-04", name: "Trung bình cộng", op: "avg", unit: "unit" },
  ],
  nav: [
    { name: "Current Project", d: ["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"] },
    { name: "Bảng dữ liệu", d: ["M3 5h18v14H3z", "M3 10h18M9 5v14"] },
    { name: "Trang tính toán", d: ["M5 3h14v18H5z", "M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"] },
    { name: "Docs", d: ["M7 3h8l4 4v14H7z", "M15 3v4h4M10 12h6M10 16h6"] },
  ],
};

/* Phép tính: expr hiển thị, calc xử lý, label dùng trong form thêm công thức */
const OPS = {
  ratio: { expr: "(biến 1 ÷ biến 2) × 100", label: "Tỷ lệ % : (biến 1 ÷ biến 2) × 100", calc: (a, b) => (b !== 0 ? (a / b) * 100 : 0) },
  growth: { expr: "((biến 1 − biến 2) ÷ biến 2) × 100", label: "Tăng trưởng % : ((biến 1 − biến 2) ÷ biến 2) × 100", calc: (a, b) => (b !== 0 ? ((a - b) / b) * 100 : 0) },
  mul: { expr: "biến 1 × biến 2", label: "Tích số : biến 1 × biến 2", calc: (a, b) => a * b },
  sum: { expr: "biến 1 + biến 2", label: "Tổng : biến 1 + biến 2", calc: (a, b) => a + b },
  diff: { expr: "biến 1 − biến 2", label: "Hiệu : biến 1 − biến 2", calc: (a, b) => a - b },
  avg: { expr: "(biến 1 + biến 2) ÷ 2", label: null, calc: (a, b) => (a + b) / 2 },
};
const ADDABLE_OPS = ["ratio", "growth", "mul", "sum", "diff"];

/* Biểu thức và phép tính theo tầng trong sơ đồ luồng */
const LAYER_OPS = {
  ratio: { short: "÷ × 100", calc: (a, b) => (b !== 0 ? (a / b) * 100 : 0) },
  growth: { short: "tăng trưởng %", calc: (a, b) => (b !== 0 ? ((a - b) / b) * 100 : 0) },
  mul: { short: "×", calc: (a, b) => a * b },
  sum: { short: "+", calc: (a, b) => a + b },
  diff: { short: "−", calc: (a, b) => a - b },
  avg: { short: "trung bình", calc: (a, b) => (a + b) / 2 },
};

const css = `
  body { margin: 0; padding: 0; background: ${C.page}; }
  .np * { box-sizing: border-box; }
  .np { font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif; color: ${C.text}; font-size: 15px; line-height: 1.5; }
  .np button, .np input, .np textarea, .np select { font-family: inherit; font-size: inherit; color: inherit; }

  .np-nav { display: flex; align-items: center; gap: 12px; width: 100%; height: 42px; padding: 0 12px; border: 0; border-radius: 10px; background: transparent; color: ${C.muted}; font-weight: 500; text-align: left; cursor: pointer; transition: background .15s, color .15s; white-space: nowrap; overflow: hidden; }
  .np-nav:hover { background: #fff; color: ${C.ink}; }
  .np-nav[aria-current="page"] { background: ${C.indigoSoft}; color: ${C.indigo}; font-weight: 600; }

  .np-back-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 40px; padding: 0 12px; border: 0; border-radius: 11px; background: linear-gradient(135deg, ${C.indigo}, ${C.violet}); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 18px -8px ${C.indigo}; transition: transform .15s, filter .15s, width .2s; white-space: nowrap; overflow: hidden; }
  .np-back-btn:hover { filter: brightness(1.07); transform: translateY(-1px); }
  .np-back-btn:active { transform: translateY(0); }

  .np-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; border: 1px solid ${C.line}; border-radius: 8px; background: #fff; color: ${C.muted}; cursor: pointer; transition: background .15s, color .15s, border-color .15s; flex: none; }
  .np-icon-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }

  .np-card { background: ${C.card}; border: 1px solid ${C.line}; border-radius: 14px; padding: 20px; }
  .np-card-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
  .np-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 16px; font-weight: 600; color: ${C.ink}; }
  .np-sq { width: 10px; height: 10px; border-radius: 3px; flex: none; }
  .np-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .np-note { font-size: 13px; color: ${C.muted}; }
  .np-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: ${C.text}; }

  .np-btn { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; border: 1px solid ${C.line}; border-radius: 10px; background: #fff; color: ${C.ink}; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
  .np-btn:hover, .np-btn.on { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }
  .np-btn.sm { height: 32px; padding: 0 12px; font-size: 13px; }
  .np-btn.primary { background: ${C.indigo}; border-color: ${C.indigo}; color: #fff; box-shadow: 0 8px 18px -8px ${C.indigo}; }
  .np-btn.primary:hover { background: #4144c4; color: #fff; }
  .np-select-btn { height: 32px; padding: 0 10px; border: 1px solid ${C.line}; border-radius: 9px; background: #fff; color: ${C.ink}; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
  .np-select-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }
  .np-select-btn:focus { outline: none; border-color: ${C.indigo}; box-shadow: 0 0 0 3px ${C.indigoSoft}; }

  .np-input { width: 100%; height: 40px; padding: 0 12px; border: 1px solid ${C.line}; border-radius: 9px; background: ${C.field}; transition: border-color .15s, box-shadow .15s, background .15s; }
  select.np-input { cursor: pointer; font-weight: 600; color: ${C.ink}; }
  textarea.np-input { height: auto; min-height: 84px; padding: 10px 12px; resize: vertical; }
  .np-input:hover { border-color: #cfd4e8; }
  .np-input:focus { outline: none; background: #fff; border-color: ${C.indigo}; box-shadow: 0 0 0 3px ${C.indigoSoft}; }
  .np button:focus-visible { outline: 3px solid ${C.indigoSoft}; outline-offset: 2px; box-shadow: 0 0 0 2px ${C.indigo}; }

  .np-tag { display: inline-block; padding: 2px 8px; border: 1px solid; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; }
  .np-chip { display: inline-block; padding: 2px 8px; border: 1px solid ${C.line}; border-radius: 6px; background: ${C.field}; font-size: 12px; font-weight: 600; color: ${C.muted}; }

  .np-table-wrap { width: 100%; overflow-x: auto; border: 1px solid ${C.line}; border-radius: 11px; background: #fff; }
  .np-table { width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; }
  .np-table th { background: ${C.field}; color: ${C.muted}; font-weight: 600; font-size: 13px; padding: 10px 12px; border-bottom: 1px solid ${C.line}; border-right: 1px solid ${C.line}; white-space: nowrap; }
  .np-table td { padding: 0; border-bottom: 1px solid ${C.line}; border-right: 1px solid ${C.line}; }
  .np-table th:last-child, .np-table td:last-child { border-right: 0; }
  .np-table tr:last-child td { border-bottom: 0; }
  .np-table tr:hover td { background: ${C.field}; }
  .np-table tr.selected td { background: ${C.indigoSoft}; }
  .np-cell-input { width: 100%; height: 40px; padding: 0 12px; border: 0; background: transparent; font-size: 14px; color: ${C.ink}; }
  .np-cell-input:focus { outline: none; background: #fff; box-shadow: inset 0 0 0 2px ${C.indigo}; }

  .np-flow { width: 100%; max-width: 520px; }
  .np-flow-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
  .np-flow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; width: 100%; max-width: 680px; }
  .np-node { background: #fff; border: 1px solid ${C.line}; border-radius: 12px; padding: 12px 16px; transition: border-color .15s, box-shadow .15s, background .15s; }
  .np-node:hover { border-color: ${C.indigo}; }
  .np-node.drop-ready { border-style: dashed; border-color: ${C.indigo}; background: #f4f5ff; }
  .np-node.drop-over { border-style: solid; border-color: ${C.coral}; background: #fff5f5; box-shadow: 0 0 0 3px rgba(240, 82, 79, 0.16); }

  .np-side-sec { display: flex; flex-direction: column; min-height: 0; overflow-y: auto; padding: 16px; transition: flex .2s ease; }
  .np-side-sec + .np-side-sec { border-top: 1px solid ${C.line}; }
  .np-var { padding: 10px 12px; border: 1px solid ${C.line}; border-radius: 11px; background: ${C.field}; cursor: grab; user-select: none; transition: border-color .15s, background .15s, transform .15s, box-shadow .15s; }
  .np-var:hover { border-color: #c9caf3; background: #fff; box-shadow: 0 4px 12px -6px rgba(27, 32, 56, 0.25); transform: translateY(-1px); }
  .np-var:active { cursor: grabbing; transform: scale(0.99); }
  .np-var.dragging { opacity: 0.55; border-style: dashed; border-color: ${C.indigo}; }
  .np-fcard { width: 100%; padding: 11px 13px; text-align: left; border: 1px solid ${C.line}; border-radius: 11px; background: #fff; color: ${C.ink}; cursor: pointer; transition: background .15s, border-color .15s; }
  .np-fcard:hover { background: ${C.field}; border-color: #c9caf3; }
  .np-fcard[aria-pressed="true"] { background: ${C.indigoSoft}; border-color: ${C.indigo}; color: ${C.indigo}; }

  .np-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(27, 32, 56, 0.45); }
  .np-modal { width: 100%; padding: 22px; border: 1px solid ${C.line}; border-radius: 14px; background: #fff; }
  .np-two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .np-toast { position: fixed; bottom: 20px; right: 300px; z-index: 1100; display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 10px; background: ${C.ink}; color: #fff; font-size: 13px; font-weight: 500; }
`;

/* ---------- Thành phần dùng chung ---------- */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const Card = ({ title, color, action, children, style }) => (
  <section className="np-card" style={style}>
    <div className="np-card-head">
      <h2 className="np-title">
        <span className="np-sq" style={{ background: color }} />
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

const Field = ({ id, label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <label className="np-label" htmlFor={id}>{label}</label>
    {children}
  </div>
);

const Tag = ({ color, solid, soft, children }) => (
  <span className="np-tag" style={{ color: solid ? "#fff" : color, borderColor: color, background: solid ? color : soft || "#fff" }}>
    {children}
  </span>
);

const Bar = ({ value, color, label }) => (
  <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}
    style={{ height: 8, borderRadius: 8, background: C.line, overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", borderRadius: 8, background: color, transition: "width .15s" }} />
  </div>
);

const Modal = ({ id, title, onClose, onSubmit, submitLabel, maxWidth, children }) => (
  <div className="np-overlay" role="dialog" aria-modal="true" aria-labelledby={id} onClick={onClose}>
    <form
      className="np-modal"
      style={{ maxWidth }}
      onSubmit={onSubmit}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <h2 id={id} style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: C.ink }}>{title}</h2>
      {children}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
        <button type="button" className="np-btn" onClick={onClose}>Hủy</button>
        <button type="submit" className="np-btn primary">{submitLabel}</button>
      </div>
    </form>
  </div>
);

const VarNode = ({ tag, variable, options, onChange, onRemove, fallback, isDragging, isOver, onDragOver, onDragLeave, onDrop }) => (
  <div
    className={`np-node ${isDragging ? "drop-ready" : ""} ${isOver ? "drop-over" : ""}`}
    style={{ borderTop: `3px solid ${variable?.color || fallback}` }}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
  >
    <div className="np-row" style={{ marginBottom: 8 }}>
      <Tag color={C.coral}>{tag}</Tag>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span className="np-note">{isDragging ? "Thả biến vào đây" : variable?.unit}</span>
        {onRemove && (
          <button
            type="button"
            className="np-icon-btn"
            style={{ width: 22, height: 22, borderRadius: 6 }}
            title={`Xóa ${tag}`}
            aria-label={`Xóa ${tag}`}
            onClick={onRemove}
          >
            <Icon d={["M18 6L6 18M6 6l12 12"]} size={12} />
          </button>
        )}
      </div>
    </div>
    <select className="np-input" aria-label={`Chọn ${tag}`} value={variable?.id} onChange={(e) => onChange(e.target.value)} style={{ marginBottom: 8 }}>
      {options.map((v) => (
        <option key={v.id} value={v.id}>{v.name} ({v.value})</option>
      ))}
    </select>
    <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>
      {variable?.value} <span className="np-note" style={{ fontWeight: 500 }}>{variable?.unit}</span>
    </div>
  </div>
);

/* ---------- Màn hình ---------- */
export default function Mathematics() {
  const [activeNav, setActiveNav] = useState(DEMO.heading);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [varsOpen, setVarsOpen] = useState(true);
  const [formulasOpen, setFormulasOpen] = useState(true);

  const [selectedTableType, setSelectedTableType] = useState("progress");
  const [selectedStage, setSelectedStage] = useState("stage-1");
  const [tableData, setTableData] = useState(() => ({
    progress: TABLE_TYPES.progress.defaultRows,
    resource: TABLE_TYPES.resource.defaultRows,
    performance: TABLE_TYPES.performance.defaultRows,
  }));
  const [selectedRowByContext, setSelectedRowByContext] = useState({
    "progress:stage-1": "r5",
  });

  const [variables, setVariables] = useState(DEMO.vars);
  const [flowLayers, setFlowLayers] = useState([
    { id: "layer-1", formulaId: "f-ratio", varIds: ["v-s1", "v-s2"] },
  ]);
  const [draggedVarId, setDraggedVarId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const [formulas, setFormulas] = useState(DEMO.formulas);

  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(DEMO.note);

  const [showVarModal, setShowVarModal] = useState(false);
  const [targetLayerIndex, setTargetLayerIndex] = useState(0);
  const [newVarMode, setNewVarMode] = useState("existing");
  const [selectedExistingVarId, setSelectedExistingVarId] = useState("v-s3");
  const [newVarName, setNewVarName] = useState("");
  const [newVarVal, setNewVarVal] = useState("10");
  const [newVarUnit, setNewVarUnit] = useState("unit");

  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [newFName, setNewFName] = useState("");
  const [newFOp, setNewFOp] = useState("ratio");
  const [newFUnit, setNewFUnit] = useState("%");

  const [toast, setToast] = useState(null);
  const notify = (msg) => {
    const key = `${Date.now()}-${Math.random()}`;
    setToast({ msg, key });
    setTimeout(() => setToast((t) => (t && t.key === key ? null : t)), 2500);
  };

  /* Dữ liệu suy ra */
  const currentTableMeta = TABLE_TYPES[selectedTableType] || TABLE_TYPES.progress;
  const currentStageMeta = STAGES.find((s) => s.id === selectedStage) || STAGES[0];
  const rows = tableData[selectedTableType]?.[selectedStage] || [];
  const contextKey = `${selectedTableType}:${selectedStage}`;
  const selectedRowId = selectedRowByContext[contextKey];
  const selectedRow = rows.find((r) => r.id === selectedRowId) || rows[rows.length - 1];

  const resolvedVars = variables.map((v) => {
    const colMeta = currentTableMeta.columns.find((c) => c.key === v.sourceKey);
    const displayName = colMeta ? colMeta.label.replace(/\s*\([^)]*\)/, "") : v.name;
    const unitMatch = colMeta?.label.match(/\(([^)]+)\)/);
    const displayUnit = unitMatch ? unitMatch[1] : v.unit;
    return {
      ...v,
      name: displayName,
      unit: displayUnit,
      value: v.sourceKey && selectedRow ? Number(selectedRow[v.sourceKey]) || 0 : Number(v.customVal) || 0,
    };
  });

  /* Tính toán kết quả dây chuyền qua từng tầng */
  const computedLayers = [];
  flowLayers.forEach((layer, layerIdx) => {
    const formula = formulas.find((f) => f.id === layer.formulaId) || formulas[0];
    const op = OPS[formula.op] || OPS.ratio;
    const lOp = LAYER_OPS[formula.op] || LAYER_OPS.ratio;
    const prevLayer = layerIdx > 0 ? computedLayers[layerIdx - 1] : null;
    const prevNode = prevLayer
      ? {
          id: "__prev__",
          name: `Kết quả Tầng ${layerIdx}`,
          unit: prevLayer.formula.unit,
          color: C.coral,
          value: prevLayer.resultValue,
        }
      : null;

    const layerOptions = prevNode ? [prevNode, ...resolvedVars] : resolvedVars;
    const slotVars = layer.varIds.map((vid, slotIdx) => {
      if (vid === "__prev__" && prevNode) return prevNode;
      return resolvedVars.find((v) => v.id === vid) || layerOptions[slotIdx % layerOptions.length] || resolvedVars[0];
    });

    const inputs = prevNode ? [prevNode, ...slotVars] : slotVars;
    let raw = inputs.length > 0 ? inputs[0].value : 0;
    if (inputs.length === 1) {
      raw = inputs[0].value;
    } else {
      for (let i = 1; i < inputs.length; i += 1) {
        raw = lOp.calc(raw, inputs[i].value);
      }
    }
    const res = Number.isFinite(raw) ? Math.round(raw * 100) / 100 : 0;
    const exprText =
      inputs.length <= 2 && !prevNode
        ? op.expr
        : inputs.map((item) => item.name).join(` ${lOp.short} `);

    computedLayers.push({
      ...layer,
      layerIndex: layerIdx,
      formula,
      op,
      prevNode,
      layerOptions,
      slotVars,
      inputs,
      resultValue: res,
      exprText,
    });
  });

  const finalLayer = computedLayers[computedLayers.length - 1];
  const resultValue = finalLayer ? finalLayer.resultValue : 0;
  const activeFormula = finalLayer ? finalLayer.formula : formulas[0];
  const finalInputs = finalLayer ? finalLayer.inputs : [];
  const maxRef = Math.max(...finalInputs.map((v) => Math.abs(v?.value || 0)), Math.abs(resultValue), 1);
  const barPercent =
    activeFormula.unit === "%"
      ? Math.max(0, Math.min(100, resultValue))
      : Math.max(8, Math.min(100, (Math.abs(resultValue) / maxRef) * 100));

  /* Hành động */
  const handleCellEdit = (rowId, key, val) =>
    setTableData((prev) => ({
      ...prev,
      [selectedTableType]: {
        ...prev[selectedTableType],
        [selectedStage]: prev[selectedTableType][selectedStage].map((r) =>
          r.id === rowId ? { ...r, [key]: key === "date" ? val : Number(val) } : r
        ),
      },
    }));

  const handleAddRow = () => {
    const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    const id = `r-${Date.now()}`;
    setTableData((prev) => ({
      ...prev,
      [selectedTableType]: {
        ...prev[selectedTableType],
        [selectedStage]: [...(prev[selectedTableType]?.[selectedStage] || []), { id, date: today, s1: 4.0, s2: 5.0, s3: 80 }],
      },
    }));
    setSelectedRowByContext((prev) => ({ ...prev, [contextKey]: id }));
  };

  const openAddVarModal = (layerIdx = 0) => {
    setTargetLayerIndex(layerIdx);
    setNewVarMode("existing");
    setSelectedExistingVarId(resolvedVars[resolvedVars.length - 1]?.id || resolvedVars[0]?.id || "");
    setNewVarName("");
    setShowVarModal(true);
  };

  const handleCreateVar = (e) => {
    e.preventDefault();
    let targetVarId = selectedExistingVarId;
    let addedLabel = resolvedVars.find((v) => v.id === selectedExistingVarId)?.name || "Biến";

    if (newVarMode === "custom" || !targetVarId) {
      const palette = [C.amber, C.coral, C.indigo, C.teal, C.violet];
      const name = newVarName.trim() || `Biến ${variables.length + 1}`;
      const newId = `v-${Date.now()}`;
      setVariables((prev) => [
        ...prev,
        {
          id: newId,
          name,
          sourceKey: null,
          unit: newVarUnit.trim() || "unit",
          color: palette[variables.length % palette.length],
          customVal: Number(newVarVal) || 0,
        },
      ]);
      targetVarId = newId;
      addedLabel = name;
    }

    setFlowLayers((prev) =>
      prev.map((layer, idx) =>
        idx === targetLayerIndex
          ? { ...layer, varIds: [...layer.varIds, targetVarId] }
          : layer
      )
    );

    setNewVarName("");
    setShowVarModal(false);
    notify(`Đã thêm "${addedLabel}" vào Tầng ${targetLayerIndex + 1}`);
  };

  const handleAddFlowLayer = () => {
    const defaultVar = resolvedVars[Math.min(2, resolvedVars.length - 1)]?.id || resolvedVars[0]?.id;
    const nextFormula = formulas[Math.min(flowLayers.length, formulas.length - 1)]?.id || formulas[0].id;
    const newLayerIdx = flowLayers.length + 1;
    setFlowLayers((prev) => [
      ...prev,
      { id: `layer-${Date.now()}`, formulaId: nextFormula, varIds: defaultVar ? [defaultVar] : [] },
    ]);
    notify(`Đã thêm Tầng ${newLayerIdx} vào sơ đồ luồng`);
  };

  const handleRemoveFlowLayer = (layerIdx) => {
    if (flowLayers.length <= 1) return;
    setFlowLayers((prev) => prev.filter((_, idx) => idx !== layerIdx));
    notify(`Đã xóa Tầng ${layerIdx + 1}`);
  };

  const handleUpdateSlotVar = (layerIdx, slotIdx, varId) => {
    setFlowLayers((prev) =>
      prev.map((layer, idx) =>
        idx === layerIdx
          ? { ...layer, varIds: layer.varIds.map((v, s) => (s === slotIdx ? varId : v)) }
          : layer
      )
    );
  };

  const handleRemoveSlotVar = (layerIdx, slotIdx) => {
    setFlowLayers((prev) =>
      prev.map((layer, idx) => {
        if (idx !== layerIdx) return layer;
        const minSlots = idx === 0 ? 2 : 1;
        if (layer.varIds.length <= minSlots) return layer;
        return { ...layer, varIds: layer.varIds.filter((_, s) => s !== slotIdx) };
      })
    );
  };

  const handleUpdateLayerFormula = (layerIdx, formulaId) => {
    setFlowLayers((prev) =>
      prev.map((layer, idx) => (idx === layerIdx ? { ...layer, formulaId } : layer))
    );
  };

  const handleCreateFormula = (e) => {
    e.preventDefault();
    const code = `CTT-0${formulas.length + 1}`;
    const name = newFName.trim() || `Công thức ${formulas.length + 1}`;
    const created = {
      id: `f-${Date.now()}`,
      code,
      name,
      op: OPS[newFOp] ? newFOp : "ratio",
      unit: newFUnit.trim() || "unit",
    };
    setFormulas((prev) => [...prev, created]);
    setFlowLayers((prev) =>
      prev.map((layer, idx) => (idx === prev.length - 1 ? { ...layer, formulaId: created.id } : layer))
    );
    setNewFName("");
    setShowFormulaModal(false);
    notify(`Đã thêm công thức ${code}: ${name}`);
  };

  const handleDropToSlot = (e, layerIdx, slotIdx) => {
    e.preventDefault();
    e.stopPropagation();
    const varId = e.dataTransfer.getData("text/plain") || draggedVarId;
    const picked = resolvedVars.find((v) => v.id === varId);
    if (varId && picked) {
      handleUpdateSlotVar(layerIdx, slotIdx, varId);
      notify(`Đã kéo "${picked.name}" vào Tầng ${layerIdx + 1}`);
    }
    setDraggedVarId(null);
    setDropTarget(null);
  };

  const handleDropToLayer = (e, layerIdx) => {
    e.preventDefault();
    e.stopPropagation();
    const varId = e.dataTransfer.getData("text/plain") || draggedVarId;
    const picked = resolvedVars.find((v) => v.id === varId);
    if (varId && picked) {
      setFlowLayers((prev) =>
        prev.map((layer, idx) =>
          idx === layerIdx ? { ...layer, varIds: [...layer.varIds, varId] } : layer
        )
      );
      notify(`Đã thêm "${picked.name}" vào Tầng ${layerIdx + 1}`);
    }
    setDraggedVarId(null);
    setDropTarget(null);
  };

  const handleDropToFlowArea = (e) => {
    e.preventDefault();
    handleDropToLayer(e, flowLayers.length - 1);
  };

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", minWidth: 900, background: C.page }}>
      <style>{css}</style>

      <header style={{ flex: "none", height: 48, background: C.ink, color: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", fontWeight: 600 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
        {DEMO.title}
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Sidebar trái */}
        <nav
          aria-label="Điều hướng dự án"
          style={{
            flex: "none",
            width: leftOpen ? 248 : 68,
            padding: leftOpen ? "18px 14px" : "18px 12px",
            background: "#eceef9",
            borderRight: `1px solid ${C.line}`,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            transition: "width .22s ease, padding .22s ease",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: leftOpen ? "space-between" : "center",
              flexDirection: leftOpen ? "row" : "column",
              gap: 8,
              marginBottom: 18,
            }}
          >
            <button
              type="button"
              className="np-back-btn"
              title="Quay lại dự án trước"
              aria-label="Quay lại"
              style={{ width: leftOpen ? "auto" : 40, padding: leftOpen ? "0 14px" : 0 }}
              onClick={() => notify("Đã quay lại danh sách dự án")}
            >
              <Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} size={17} />
              {leftOpen && <span>Quay lại</span>}
            </button>

            <button
              type="button"
              className="np-icon-btn"
              title={leftOpen ? "Thu gọn thanh điều hướng" : "Mở rộng thanh điều hướng"}
              aria-label={leftOpen ? "Thu gọn thanh điều hướng" : "Mở rộng thanh điều hướng"}
              aria-expanded={leftOpen}
              onClick={() => setLeftOpen((v) => !v)}
            >
              <Icon d={leftOpen ? ["M15 18l-6-6 6-6"] : ["M9 18l6-6-6-6"]} size={16} />
            </button>
          </div>

          {DEMO.nav.map((n) => (
            <button
              key={n.name}
              className="np-nav"
              title={!leftOpen ? n.name : undefined}
              aria-current={activeNav === n.name ? "page" : undefined}
              style={{ justifyContent: leftOpen ? "flex-start" : "center", padding: leftOpen ? "0 12px" : 0 }}
              onClick={() => {
                setActiveNav(n.name);
                if (n.name !== DEMO.heading) notify(`Đang ở màn hình Trang tính toán (đã chọn: ${n.name})`);
              }}
            >
              <span style={{ flex: "none", display: "inline-flex" }}><Icon d={n.d} /></span>
              {leftOpen && <span>{n.name}</span>}
            </button>
          ))}
        </nav>

        {/* Nội dung chính */}
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "32px 32px 56px" }}>
          <div style={{ maxWidth: 920, margin: "0 auto" }}>
            <div className="np-row" style={{ gap: 16, marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink }}>{DEMO.heading}</h1>
                <p className="np-note" style={{ margin: "4px 0 0" }}>{DEMO.subtitle}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className={`np-btn ${showNotes ? "on" : ""}`} aria-pressed={showNotes} onClick={() => setShowNotes(!showNotes)}>
                  <Icon d={["M14 3v4a1 1 0 0 0 1 1h4", "M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"]} size={16} />
                  Ghi chú
                </button>
                {!rightOpen && (
                  <button
                    type="button"
                    className="np-btn"
                    title="Mở bảng Biến số & Công thức"
                    onClick={() => setRightOpen(true)}
                  >
                    <Icon d={["M15 18l-6-6 6-6"]} size={16} />
                    Biến & Công thức
                  </button>
                )}
              </div>
            </div>

            {showNotes && (
              <Card
                title="Ghi chú tính toán"
                color={C.amber}
                style={{ marginBottom: 16 }}
                action={<button className="np-btn sm" onClick={() => setShowNotes(false)}>Đóng</button>}
              >
                <textarea
                  className="np-input"
                  aria-label="Ghi chú tính toán"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ghi chú ý nghĩa công thức hoặc ngưỡng đánh giá..."
                />
              </Card>
            )}

            <Card
              title="Bảng chỉ số"
              color={C.indigo}
              style={{ marginBottom: 16 }}
              action={
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <select
                    className="np-select-btn"
                    aria-label="Chọn loại bảng cần tính"
                    value={selectedTableType}
                    onChange={(e) => {
                      const nextType = e.target.value;
                      setSelectedTableType(nextType);
                      notify(`Đã chuyển sang ${TABLE_TYPES[nextType].label}`);
                    }}
                  >
                    {Object.values(TABLE_TYPES).map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>

                  <select
                    className="np-select-btn"
                    aria-label="Chọn chặng"
                    value={selectedStage}
                    onChange={(e) => {
                      const nextStage = e.target.value;
                      const st = STAGES.find((s) => s.id === nextStage);
                      setSelectedStage(nextStage);
                      notify(`Đã chuyển sang ${st?.label}`);
                    }}
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>

                  <Tag color={C.indigo} soft={C.indigoSoft}>
                    {currentStageMeta.label} · {selectedRow?.date || "—"}
                  </Tag>
                  <button className="np-btn sm" onClick={handleAddRow}>+ Thêm dòng</button>
                </div>
              }
            >
              <div className="np-table-wrap">
                <table className="np-table">
                  <thead>
                    <tr>
                      <th style={{ width: 56, textAlign: "center" }}>Chọn</th>
                      <th>Date</th>
                      {currentTableMeta.columns.map((c) => <th key={c.key}>{c.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const isSel = row.id === selectedRow?.id;
                      return (
                        <tr
                          key={row.id}
                          className={isSel ? "selected" : undefined}
                          onClick={() => setSelectedRowByContext((prev) => ({ ...prev, [contextKey]: row.id }))}
                        >
                          <td style={{ textAlign: "center", cursor: "pointer" }}>
                            <input
                              type="radio"
                              name="selected-metric-row"
                              checked={isSel}
                              onChange={() => setSelectedRowByContext((prev) => ({ ...prev, [contextKey]: row.id }))}
                              aria-label={`Chọn dòng ngày ${row.date}`}
                              style={{ accentColor: C.indigo, cursor: "pointer" }}
                            />
                          </td>
                          <td>
                            <input
                              className="np-cell-input"
                              value={row.date}
                              aria-label="Ngày"
                              onChange={(e) => handleCellEdit(row.id, "date", e.target.value)}
                            />
                          </td>
                          {currentTableMeta.columns.map((c, i) => (
                            <td key={c.key}>
                              <input
                                className="np-cell-input"
                                type="number"
                                step="any"
                                value={row[c.key]}
                                aria-label={`Status ${i + 1}`}
                                onChange={(e) => handleCellEdit(row.id, c.key, e.target.value)}
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card
              title="Sơ đồ luồng tính toán"
              color={C.coral}
              action={
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <button
                    type="button"
                    className="np-btn sm"
                    onClick={() => openAddVarModal(flowLayers.length - 1)}
                    title="Thêm biến vào tầng hiện tại của sơ đồ"
                  >
                    + Thêm biến
                  </button>
                  <button
                    type="button"
                    className="np-btn sm"
                    onClick={() => setShowFormulaModal(true)}
                    title="Tạo công thức toán mới"
                  >
                    + Thêm CTT
                  </button>
                  <button
                    type="button"
                    className="np-btn sm"
                    onClick={handleAddFlowLayer}
                    title="Thêm tầng tính toán nối tiếp"
                  >
                    + Thêm tầng
                  </button>
                </div>
              }
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dropTarget !== "flow") setDropTarget("flow");
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null);
                }}
                onDrop={handleDropToFlowArea}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "24px 20px 20px",
                  background: dropTarget === "flow" ? "#f2f4ff" : C.field,
                  border: `1.5px ${draggedVarId ? "dashed" : "solid"} ${draggedVarId ? C.indigo : C.line}`,
                  borderRadius: 12,
                  transition: "background .15s, border-color .15s",
                }}
              >
                {computedLayers.map((layer) => {
                  const layerIdx = layer.layerIndex;
                  const minSlots = layerIdx === 0 ? 2 : 1;
                  const canRemoveSlot = layer.slotVars.length > minSlots;
                  const layerDropKey = `layer-${layerIdx}`;

                  return (
                    <React.Fragment key={layer.id}>
                      {/* Khung từng tầng biến số */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.dataTransfer.dropEffect = "move";
                          if (dropTarget !== layerDropKey) setDropTarget(layerDropKey);
                        }}
                        onDragLeave={(e) => {
                          if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null);
                        }}
                        onDrop={(e) => handleDropToLayer(e, layerIdx)}
                        style={{
                          width: "100%",
                          maxWidth: 680,
                          padding: "12px 14px 14px",
                          borderRadius: 12,
                          border: `1px ${dropTarget === layerDropKey ? "dashed" : "solid"} ${dropTarget === layerDropKey ? C.indigo : C.line}`,
                          background: dropTarget === layerDropKey ? "#eef0ff" : "rgba(255,255,255,0.65)",
                        }}
                      >
                        <div className="np-row" style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Tag color={C.indigo} soft={C.indigoSoft}>Tầng {layerIdx + 1}</Tag>
                            <span className="np-note" style={{ fontSize: 12 }}>
                              {layerIdx === 0 ? "Đầu vào ban đầu" : `Kết hợp kết quả Tầng ${layerIdx} với biến bổ sung`}
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button
                              type="button"
                              className="np-btn sm"
                              style={{ height: 28, padding: "0 10px", fontSize: 12 }}
                              onClick={() => openAddVarModal(layerIdx)}
                            >
                              + Biến tầng {layerIdx + 1}
                            </button>
                            {layerIdx > 0 && (
                              <button
                                type="button"
                                className="np-icon-btn"
                                style={{ width: 28, height: 28 }}
                                title={`Xóa Tầng ${layerIdx + 1}`}
                                aria-label={`Xóa Tầng ${layerIdx + 1}`}
                                onClick={() => handleRemoveFlowLayer(layerIdx)}
                              >
                                <Icon d={["M18 6L6 18M6 6l12 12"]} size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="np-flow-grid">
                          {layer.prevNode && (
                            <div className="np-node" style={{ borderTop: `3px solid ${C.coral}`, background: "#fff9f9" }}>
                              <div className="np-row" style={{ marginBottom: 8 }}>
                                <Tag color={C.coral} solid>từ tầng {layerIdx}</Tag>
                                <span className="np-note">{layer.prevNode.unit}</span>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
                                {layer.prevNode.name}
                              </div>
                              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>
                                {layer.prevNode.value} <span className="np-note" style={{ fontWeight: 500 }}>{layer.prevNode.unit}</span>
                              </div>
                            </div>
                          )}

                          {layer.slotVars.map((slotVar, slotIdx) => {
                            const slotDropKey = `slot-${layerIdx}-${slotIdx}`;
                            const varNumber = layerIdx === 0 ? slotIdx + 1 : slotIdx + 2;
                            return (
                              <VarNode
                                key={`${layer.id}-slot-${slotIdx}`}
                                tag={`biến ${varNumber}`}
                                variable={slotVar}
                                options={layer.layerOptions}
                                onChange={(val) => handleUpdateSlotVar(layerIdx, slotIdx, val)}
                                onRemove={canRemoveSlot ? () => handleRemoveSlotVar(layerIdx, slotIdx) : undefined}
                                fallback={slotIdx % 2 === 0 ? C.indigo : C.teal}
                                isDragging={Boolean(draggedVarId)}
                                isOver={dropTarget === slotDropKey}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  e.dataTransfer.dropEffect = "move";
                                  if (dropTarget !== slotDropKey) setDropTarget(slotDropKey);
                                }}
                                onDragLeave={() => setDropTarget(null)}
                                onDrop={(e) => handleDropToSlot(e, layerIdx, slotIdx)}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Mũi tên nối xuống công thức của tầng */}
                      <svg className="np-flow" height="44" viewBox="0 0 360 44" preserveAspectRatio="none" fill="none" aria-hidden="true">
                        <path d="M 110 2 C 110 22, 180 16, 180 38" stroke={C.indigo} strokeWidth="2.1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                        <path d="M 250 2 C 250 22, 180 16, 180 38" stroke={C.teal} strokeWidth="2.1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                        <polygon points="180,43 174,34 186,34" fill={C.indigo} />
                      </svg>

                      {/* Khối công thức của tầng */}
                      <div className="np-node" style={{ width: "100%", maxWidth: 400, background: C.indigoSoft, borderColor: C.indigo, textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                          <Tag color={C.indigo} solid>CTT · T{layerIdx + 1}</Tag>
                          <select
                            className="np-input"
                            aria-label={`Chọn công thức toán tầng ${layerIdx + 1}`}
                            value={layer.formula.id}
                            onChange={(e) => handleUpdateLayerFormula(layerIdx, e.target.value)}
                            style={{ flex: 1, color: C.indigo }}
                          >
                            {formulas.map((f) => (
                              <option key={f.id} value={f.id}>{f.code}: {f.name}</option>
                            ))}
                          </select>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{layer.exprText}</div>
                      </div>

                      {/* Mũi tên nối xuống tầng tiếp theo hoặc kết quả cuối */}
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                        <line x1="20" y1="2" x2="20" y2="32" stroke={C.coral} strokeWidth="2.4" strokeLinecap="round" />
                        <polygon points="20,38 14,28 26,28" fill={C.coral} />
                      </svg>
                    </React.Fragment>
                  );
                })}

                <div className="np-node" style={{ width: "100%", maxWidth: 420, borderColor: C.coral, textAlign: "center" }}>
                  <div className="np-row" style={{ marginBottom: 6 }}>
                    <Tag color={C.coral} solid>kết quả</Tag>
                    <span className="np-note">{finalInputs.map((v) => v?.name).filter(Boolean).join(" & ")}</span>
                  </div>
                  <div style={{ margin: "4px 0 10px", fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: C.ink }}>
                    {resultValue}
                    <span style={{ marginLeft: 6, fontSize: 15, fontWeight: 600, color: C.coral }}>{activeFormula.unit}</span>
                  </div>
                  <Bar value={barPercent} color={C.coral} label="Mức độ kết quả" />
                </div>
              </div>
            </Card>
          </div>
        </main>

        {/* Cột phải: Biến số + Công thức */}
        <aside
          aria-label="Biến số và Công thức toán"
          style={{
            flex: "none",
            width: rightOpen ? 292 : 46,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            background: C.card,
            borderLeft: `1px solid ${C.line}`,
            transition: "width .22s ease",
            overflow: "hidden",
          }}
        >
          {/* Thanh điều khiển thu/mở toàn bộ cột phải */}
          <div
            style={{
              flex: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: rightOpen ? "space-between" : "center",
              padding: rightOpen ? "10px 16px" : "10px 0",
              borderBottom: `1px solid ${C.line}`,
              background: C.field,
            }}
          >
            {rightOpen && (
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: C.muted }}>
                Bảng điều khiển
              </span>
            )}
            <button
              type="button"
              className="np-icon-btn"
              title={rightOpen ? "Thu gọn cột Biến số & Công thức" : "Mở rộng cột Biến số & Công thức"}
              aria-label={rightOpen ? "Thu gọn cột Biến số & Công thức" : "Mở rộng cột Biến số & Công thức"}
              aria-expanded={rightOpen}
              onClick={() => setRightOpen((v) => !v)}
            >
              <Icon d={rightOpen ? ["M9 18l6-6-6-6"] : ["M15 18l-6-6 6-6"]} size={16} />
            </button>
          </div>

          {rightOpen ? (
            <>
              <section className="np-side-sec" style={{ flex: varsOpen ? 1 : "none" }}>
                <div className="np-card-head" style={{ marginBottom: varsOpen ? 12 : 0 }}>
                  <button
                    type="button"
                    onClick={() => setVarsOpen((v) => !v)}
                    aria-expanded={varsOpen}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
                  >
                    <span className="np-sq" style={{ background: C.teal }} />
                    <span style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>Biến số</span>
                    <Icon d={varsOpen ? ["M6 9l6 6 6-6"] : ["M9 18l6-6-6-6"]} size={15} />
                  </button>
                  <button className="np-btn sm" onClick={() => openAddVarModal(flowLayers.length - 1)}>+ Thêm biến</button>
                </div>

                {varsOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="np-note" style={{ fontSize: 12 }}>
                      Kéo thanh biến thả vào sơ đồ luồng tính toán
                    </div>
                    {resolvedVars.map((v, idx) => (
                      <div
                        key={v.id}
                        className={`np-var ${draggedVarId === v.id ? "dragging" : ""}`}
                        draggable
                        title="Nhấp và kéo thả vào Sơ đồ luồng tính toán"
                        onDragStart={(e) => {
                          setDraggedVarId(v.id);
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", v.id);
                        }}
                        onDragEnd={() => {
                          setDraggedVarId(null);
                          setDropTarget(null);
                        }}
                      >
                        <div className="np-row" style={{ fontSize: 14 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: C.ink, minWidth: 0 }}>
                            <span style={{ color: C.muted, display: "inline-flex", flex: "none" }} aria-hidden="true">
                              <Icon d={["M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01"]} size={15} />
                            </span>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.color, flex: "none" }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              Status {idx + 1} · {v.name}
                            </span>
                          </span>
                          <b style={{ color: v.color, flex: "none" }}>
                            {v.value} <span className="np-note" style={{ fontWeight: 500 }}>{v.unit}</span>
                          </b>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="np-side-sec" style={{ flex: formulasOpen ? 1 : "none" }}>
                <div className="np-card-head" style={{ marginBottom: formulasOpen ? 12 : 0 }}>
                  <button
                    type="button"
                    onClick={() => setFormulasOpen((v) => !v)}
                    aria-expanded={formulasOpen}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
                  >
                    <span className="np-sq" style={{ background: C.violet }} />
                    <span style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>Các công thức toán</span>
                    <Icon d={formulasOpen ? ["M6 9l6 6 6-6"] : ["M9 18l6-6-6-6"]} size={15} />
                  </button>
                  <button className="np-btn sm" onClick={() => setShowFormulaModal(true)}>+ Thêm CTT</button>
                </div>

                {formulasOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {formulas.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        className="np-fcard"
                        aria-pressed={f.id === activeFormula.id}
                        onClick={() => handleUpdateLayerFormula(flowLayers.length - 1, f.id)}
                      >
                        <div className="np-row" style={{ marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</span>
                          <span className="np-chip">{f.code}</span>
                        </div>
                        <div className="np-note" style={{ color: "inherit", opacity: 0.8 }}>{OPS[f.op].expr}</div>
                      </button>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, paddingTop: 16 }}>
              <button
                type="button"
                className="np-icon-btn"
                title="Mở phần Biến số"
                onClick={() => { setRightOpen(true); setVarsOpen(true); }}
              >
                <span className="np-sq" style={{ background: C.teal }} />
              </button>
              <button
                type="button"
                className="np-icon-btn"
                title="Mở phần Các công thức toán"
                onClick={() => { setRightOpen(true); setFormulasOpen(true); }}
              >
                <span className="np-sq" style={{ background: C.violet }} />
              </button>
            </div>
          )}
        </aside>
      </div>

      {showVarModal && (
        <Modal id="var-modal-title" title="Thêm biến vào sơ đồ luồng" maxWidth={410} submitLabel="Thêm biến" onClose={() => setShowVarModal(false)} onSubmit={handleCreateVar}>
          <Field id="target-layer-select" label="Chọn tầng đặt biến">
            <select
              id="target-layer-select"
              className="np-input"
              value={targetLayerIndex}
              onChange={(e) => setTargetLayerIndex(Number(e.target.value))}
            >
              {flowLayers.map((l, idx) => (
                <option key={l.id} value={idx}>Tầng {idx + 1}</option>
              ))}
            </select>
          </Field>

          <Field id="var-source-mode" label="Nguồn biến số">
            <select
              id="var-source-mode"
              className="np-input"
              value={newVarMode}
              onChange={(e) => setNewVarMode(e.target.value)}
            >
              <option value="existing">Chọn từ danh sách biến hiện có</option>
              <option value="custom">Tạo biến số mới</option>
            </select>
          </Field>

          {newVarMode === "existing" ? (
            <Field id="existing-var-select" label="Biến số">
              <select
                id="existing-var-select"
                className="np-input"
                value={selectedExistingVarId}
                onChange={(e) => setSelectedExistingVarId(e.target.value)}
              >
                {resolvedVars.map((v, idx) => (
                  <option key={v.id} value={v.id}>Status {idx + 1} · {v.name} ({v.value} {v.unit})</option>
                ))}
              </select>
            </Field>
          ) : (
            <>
              <Field id="new-var-name" label="Tên biến">
                <input id="new-var-name" className="np-input" placeholder="Ví dụ: Mục tiêu ngày" value={newVarName} onChange={(e) => setNewVarName(e.target.value)} autoFocus />
              </Field>
              <div className="np-two" style={{ marginBottom: 6 }}>
                <Field id="new-var-val" label="Giá trị">
                  <input id="new-var-val" className="np-input" type="number" step="any" value={newVarVal} onChange={(e) => setNewVarVal(e.target.value)} />
                </Field>
                <Field id="new-var-unit" label="Đơn vị">
                  <input id="new-var-unit" className="np-input" value={newVarUnit} onChange={(e) => setNewVarUnit(e.target.value)} />
                </Field>
              </div>
            </>
          )}
        </Modal>
      )}

      {showFormulaModal && (
        <Modal id="formula-modal-title" title="Thêm công thức toán" maxWidth={400} submitLabel="Lưu công thức" onClose={() => setShowFormulaModal(false)} onSubmit={handleCreateFormula}>
          <Field id="new-f-name" label="Tên công thức">
            <input id="new-f-name" className="np-input" placeholder="Ví dụ: Tốc độ tăng trưởng" value={newFName} onChange={(e) => setNewFName(e.target.value)} autoFocus />
          </Field>
          <Field id="new-f-op" label="Phép tính giữa Biến 1 và Biến 2">
            <select id="new-f-op" className="np-input" value={newFOp} onChange={(e) => setNewFOp(e.target.value)}>
              {ADDABLE_OPS.map((k) => (
                <option key={k} value={k}>{OPS[k].label}</option>
              ))}
            </select>
          </Field>
          <Field id="new-f-unit" label="Đơn vị kết quả">
            <input id="new-f-unit" className="np-input" value={newFUnit} onChange={(e) => setNewFUnit(e.target.value)} />
          </Field>
        </Modal>
      )}

      {toast && (
        <div className="np-toast" role="status">
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal }} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}