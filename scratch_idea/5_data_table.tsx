import React, { useState, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  Data Table – màn hình "Bảng dữ liệu"                              */
/*  Đồng bộ tuyệt đối với CurrentProject.jsx & ProjectDocs.jsx         */
/*  (bảng màu C, header 48px, sidebar 248px, card 14px, font Inter).  */
/* ------------------------------------------------------------------ */

const C = {
  ink: "#1b2038",
  text: "#2b3150",
  muted: "#6a7192",
  page: "#f5f6fb",
  card: "#ffffff",
  line: "#e3e6f1",
  field: "#f9faff",
  indigo: "#4f52d9",
  indigoSoft: "#ececfc",
  teal: "#0fa89a",
  tealSoft: "#e3f6f4",
  violet: "#7b4fe0",
  violetSoft: "#f1ecfc",
  coral: "#f0524f",
  amber: "#e8960c",
  amberSoft: "#fef4e4",
};

const STAGES = [
  { id: 1, name: "Chặng 1: Làm quen" },
  { id: 2, name: "Chặng 2: Tiêu chuẩn hóa" },
  { id: 3, name: "Chặng 3: Vòng lặp nâng cấp" },
  { id: 4, name: "Chặng 4: Chạm đến" },
];

const INITIAL_NOTES_BY_STAGE = {
  1: [
    {
      id: "n-101",
      goalRange: "Goal 1 → Goal 2",
      title: "THIẾT LẬP NHỊP ĐỘ KHỞI ĐỘNG",
      content: "Duy trì thời lượng làm quen tối thiểu 45–60 phút/ngày để hình thành thói quen đo lường đều đặn.",
      summary: "Ổn định thói quen ghi nhận số liệu trước khi tăng cường độ.",
    },
  ],
  2: [
    {
      id: "n-201",
      goalRange: "Goal 1 → Goal 3",
      title: "CHUẨN HÓA CHỈ SỐ ĐỊNH LƯỢNG",
      content: "• Theo dõi sát Status 1 và Status 2 mỗi tối trước 22h.\n• Đối chiếu trực tiếp các điểm chạm tăng trưởng với tài liệu Docs.",
      summary: "Đạt ngưỡng ổn định > 75% ở tất cả các phiên tiêu chuẩn.",
    },
  ],
  3: [],
  4: [],
};

const INITIAL_TABLES = [
  {
    id: "tbl-metrics",
    stageId: 2,
    title: "Bảng chỉ số",
    color: C.indigo,
    linkedDoc: "Docs – Chỉ số định lượng & Nền tảng",
    columns: [
      { key: "date", label: "Date", type: "date" },
      { key: "s1", label: "Status 1 (giờ)", type: "number" },
      { key: "s2", label: "Status 2 (bài)", type: "number" },
      { key: "s3", label: "Status 3 (%)", type: "number" },
    ],
    rows: [
      { id: "r1", date: "12/11/2026", s1: 2.5, s2: 3, s3: 45 },
      { id: "r2", date: "13/11/2026", s1: 3.0, s2: 4, s3: 55 },
      { id: "r3", date: "14/11/2026", s1: 2.0, s2: 2, s3: 50 },
      { id: "r4", date: "15/11/2026", s1: 3.5, s2: 5, s3: 70 },
      { id: "r5", date: "16/11/2026", s1: 4.0, s2: 6, s3: 82 },
    ],
  },
  {
    id: "tbl-results",
    stageId: 2,
    title: "Bảng kết quả",
    color: C.teal,
    linkedDoc: "Docs – Đánh giá kết quả & Rủi ro",
    columns: [
      { key: "date", label: "Date", type: "date" },
      { key: "s1", label: "Status 1 (SG)", type: "number" },
      { key: "s2", label: "Status 2 (điểm)", type: "number" },
      { key: "s3", label: "Status 3 (mức)", type: "number" },
    ],
    rows: [
      { id: "k1", date: "12/11/2026", s1: 3, s2: 72, s3: 60 },
      { id: "k2", date: "13/11/2026", s1: 4, s2: 78, s3: 68 },
      { id: "k3", date: "14/11/2026", s1: 2, s2: 74, s3: 64 },
      { id: "k4", date: "15/11/2026", s1: 5, s2: 86, s3: 80 },
      { id: "k5", date: "16/11/2026", s1: 5, s2: 91, s3: 88 },
    ],
  },
  {
    id: "tbl-stage1",
    stageId: 1,
    title: "Bảng chỉ số khởi động",
    color: C.violet,
    linkedDoc: "Docs – Khảo sát ban đầu",
    columns: [
      { key: "date", label: "Date", type: "date" },
      { key: "s1", label: "Status 1 (phút)", type: "number" },
      { key: "s2", label: "Status 2 (lần)", type: "number" },
      { key: "s3", label: "Status 3 (%)", type: "number" },
    ],
    rows: [
      { id: "s1-1", date: "05/11/2026", s1: 45, s2: 1, s3: 20 },
      { id: "s1-2", date: "06/11/2026", s1: 60, s2: 2, s3: 35 },
      { id: "s1-3", date: "07/11/2026", s1: 90, s2: 2, s3: 50 },
    ],
  },
];

const css = `
  body { margin: 0; padding: 0; background: ${C.page}; }
  .np * { box-sizing: border-box; }
  .np {
    font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif;
    color: ${C.text};
    font-size: 15px;
    line-height: 1.5;
  }
  .np button, .np input, .np textarea, .np select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
  }

  /* Thanh bên */
  .np-nav {
    display: flex; align-items: center; gap: 12px; width: 100%; height: 42px; padding: 0 12px;
    border: 0; border-radius: 10px; background: transparent; color: ${C.muted};
    font-weight: 500; text-align: left; cursor: pointer; transition: background .15s, color .15s;
    overflow: hidden; white-space: nowrap;
  }
  .np-nav:hover { background: #fff; color: ${C.ink}; }
  .np-nav[aria-current="page"] { background: ${C.indigoSoft}; color: ${C.indigo}; font-weight: 600; }

  .np-back-btn {
    display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 12px;
    border: 1px solid ${C.line}; border-radius: 10px; background: #fff; color: ${C.ink};
    font-weight: 600; font-size: 13.5px; cursor: pointer; white-space: nowrap;
    transition: background .15s, border-color .15s, color .15s;
  }
  .np-back-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }

  .np-collapse-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; flex-shrink: 0;
    border: 1px solid ${C.line}; border-radius: 10px; background: #fff; color: ${C.muted};
    cursor: pointer; transition: background .15s, border-color .15s, color .15s;
  }
  .np-collapse-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }

  /* Nút bấm */
  .np-btn {
    display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px;
    border: 1px solid ${C.line}; border-radius: 10px; background: #fff; color: ${C.ink};
    font-weight: 600; font-size: 14px; cursor: pointer;
    transition: background .15s, border-color .15s, color .15s, transform .15s;
  }
  .np-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }
  .np-btn.primary {
    background: ${C.indigo}; border-color: ${C.indigo}; color: #fff;
    box-shadow: 0 6px 14px -6px ${C.indigo};
  }
  .np-btn.primary:hover { background: #4144c4; color: #fff; }
  .np-btn.active-soft {
    background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo};
  }

  /* Tab chọn chặng */
  .np-tab {
    height: 36px; padding: 0 14px; border-radius: 9px; border: 1px solid transparent;
    background: transparent; color: ${C.muted}; font-size: 13.5px; font-weight: 500;
    cursor: pointer; transition: all .15s; white-space: nowrap;
  }
  .np-tab:hover { background: #fff; color: ${C.ink}; }
  .np-tab.active {
    background: #fff; color: ${C.indigo}; font-weight: 600;
    border-color: ${C.line}; box-shadow: 0 2px 6px rgba(27,32,56,0.05);
  }

  /* Ô nhập & Bảng kiểu Notion */
  .np-input {
    width: 100%; height: 38px; padding: 0 12px; border: 1px solid ${C.line}; border-radius: 9px;
    background: ${C.field}; transition: border-color .15s, box-shadow .15s, background .15s;
  }
  textarea.np-input { height: auto; min-height: 96px; padding: 10px 12px; resize: vertical; }
  .np-input:focus { outline: none; background: #fff; border-color: ${C.indigo}; box-shadow: 0 0 0 3px ${C.indigoSoft}; }

  .np-notion-wrap {
    width: 100%; overflow-x: auto; border: 1px solid ${C.line}; border-radius: 11px; background: #fff;
  }
  .np-notion-table {
    width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;
  }
  .np-notion-table th {
    background: ${C.field}; color: ${C.muted}; font-weight: 600; font-size: 13px;
    padding: 0; border-bottom: 1px solid ${C.line}; border-right: 1px solid ${C.line};
    min-width: 140px;
  }
  .np-notion-table th:last-child { border-right: 0; }
  .np-notion-table td {
    padding: 0; border-bottom: 1px solid ${C.line}; border-right: 1px solid ${C.line};
  }
  .np-notion-table td:last-child { border-right: 0; }
  .np-notion-table tr:last-child td { border-bottom: 0; }
  .np-notion-table tr:hover td { background: #fbfcff; }

  .np-cell-input {
    width: 100%; height: 38px; padding: 0 12px; border: 0; background: transparent;
    font-size: 14px; color: ${C.ink}; transition: background .12s, box-shadow .12s;
  }
  .np-cell-input:focus {
    outline: none; background: #fff; box-shadow: inset 0 0 0 2px ${C.indigo};
  }
  .np-th-input {
    width: 100%; height: 38px; padding: 0 12px; border: 0; background: transparent;
    font-size: 13px; font-weight: 600; color: ${C.text};
  }
  .np-th-input:focus {
    outline: none; background: #fff; box-shadow: inset 0 0 0 2px ${C.indigo};
  }
  .np-th-wrap {
    display: flex; align-items: center; justify-content: space-between; width: 100%;
  }
  .np-th-wrap .np-th-input {
    flex: 1; min-width: 0; padding-right: 4px;
  }
  .np-col-del {
    border: 0; background: transparent; color: ${C.muted}; cursor: pointer;
    width: 24px; height: 24px; margin-right: 6px; border-radius: 6px; flex-shrink: 0;
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 15px; line-height: 1; opacity: 0.45;
    transition: opacity .15s, background .15s, color .15s;
  }
  .np-notion-table th:hover .np-col-del,
  .np-notion-table th:focus-within .np-col-del {
    opacity: 1;
  }
  .np-col-del:hover {
    background: #fde8e8; color: ${C.coral}; opacity: 1;
  }

  .np-row-add {
    width: 100%; padding: 9px 14px; border: 0; border-top: 1px solid ${C.line};
    background: ${C.field}; color: ${C.muted}; font-size: 13px; font-weight: 500;
    text-align: left; cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: background .15s, color .15s;
  }
  .np-row-add:hover { background: ${C.indigoSoft}; color: ${C.indigo}; }

  .np-badge-doc {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px;
    border-radius: 8px; border: 1px solid ${C.line}; background: ${C.field};
    color: ${C.text}; font-size: 12.5px; font-weight: 500; cursor: pointer;
    transition: all .15s;
  }
  .np-badge-doc:hover {
    border-color: #c9caf3; background: ${C.indigoSoft}; color: ${C.indigo};
  }

  .np button:focus-visible {
    outline: 3px solid ${C.indigoSoft}; outline-offset: 2px; box-shadow: 0 0 0 2px ${C.indigo};
  }

  /* Ngăn kéo Ghi chú bên phải */
  .np-note-drawer {
    flex: none;
    background: #eceef9;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: width .24s cubic-bezier(0.4, 0, 0.2, 1), border-color .24s ease;
  }
  .np-note-card {
    background: #ffffff;
    border: 1px solid ${C.line};
    border-radius: 12px;
    padding: 14px;
    transition: border-color .15s, box-shadow .15s;
  }
  .np-note-card:focus-within {
    border-color: #c9caf3;
    box-shadow: 0 4px 14px -6px rgba(79, 82, 217, 0.16);
  }
  .np-note-ghost-input {
    width: 100%;
    border: 0;
    background: transparent;
    padding: 2px 4px;
    border-radius: 6px;
    transition: background .15s;
  }
  .np-note-ghost-input:hover {
    background: ${C.field};
  }
  .np-note-ghost-input:focus {
    outline: none;
    background: ${C.field};
    box-shadow: inset 0 0 0 1.5px ${C.indigo};
  }
`;

/* ---------- Icon SVG gọn nhẹ ---------- */
const Icon = ({ d, size = 18, stroke = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d.map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);

const NAV = [
  { name: "Current Project", d: ["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"] },
  { name: "Bảng dữ liệu", d: ["M3 5h18v14H3z", "M3 10h18M9 5v14"] },
  { name: "Trang tính toán", d: ["M5 3h14v18H5z", "M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"] },
  { name: "Docs", d: ["M7 3h8l4 4v14H7z", "M15 3v4h4M10 12h6M10 16h6"] },
];

const Card = ({ title, color, action, children, style }) => (
  <section
    style={{
      background: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: 14,
      padding: 20,
      ...style,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: C.ink,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

/* ---------- Biểu đồ SVG trực quan động từ dữ liệu bảng ---------- */
const TableChart = ({ table }) => {
  const numericCols = table.columns.filter((c) => c.type === "number").slice(0, 3);
  const palette = [table.color, C.amber, C.violet];

  const maxVal = useMemo(() => {
    let m = 10;
    table.rows.forEach((r) => {
      numericCols.forEach((col) => {
        const val = Number(r[col.key]) || 0;
        if (val > m) m = val;
      });
    });
    return Math.ceil(m * 1.15);
  }, [table, numericCols]);

  if (!table.rows.length || !numericCols.length) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>
        Chưa có dữ liệu số để hiển thị biểu đồ.
      </div>
    );
  }

  const chartW = 680;
  const chartH = 210;
  const padL = 42;
  const padR = 20;
  const padT = 18;
  const padB = 34;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const groupW = innerW / table.rows.length;
  const barW = Math.min(22, (groupW * 0.68) / numericCols.length);

  return (
    <div>
      {/* Chú thích chuỗi dữ liệu */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12, fontSize: 13 }}>
        {numericCols.map((col, idx) => (
          <div key={col.key} style={{ display: "flex", alignItems: "center", gap: 6, color: C.text }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: palette[idx % palette.length],
              }}
            />
            <span>{col.label}</span>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${chartW} ${chartH}`}
          style={{ width: "100%", height: "auto", minWidth: 460, display: "block" }}
          role="img"
          aria-label={`Biểu đồ trực quan cho ${table.title}`}
        >
          {/* Đường lưới ngang */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const y = padT + innerH * (1 - t);
            const labelVal = Math.round(maxVal * t);
            return (
              <g key={i}>
                <line
                  x1={padL}
                  y1={y}
                  x2={chartW - padR}
                  y2={y}
                  stroke={C.line}
                  strokeDasharray={t === 0 ? undefined : "4 4"}
                />
                <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill={C.muted}>
                  {labelVal}
                </text>
              </g>
            );
          })}

          {/* Các nhóm cột theo Date */}
          {table.rows.map((row, rIdx) => {
            const centerX = padL + groupW * rIdx + groupW / 2;
            const totalBarsW = numericCols.length * barW + (numericCols.length - 1) * 4;
            const startX = centerX - totalBarsW / 2;

            return (
              <g key={row.id}>
                {numericCols.map((col, cIdx) => {
                  const val = Math.max(0, Number(row[col.key]) || 0);
                  const h = (val / maxVal) * innerH;
                  const x = startX + cIdx * (barW + 4);
                  const y = padT + innerH - h;
                  return (
                    <g key={col.key}>
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={Math.max(2, h)}
                        rx={4}
                        fill={palette[cIdx % palette.length]}
                        opacity={0.9}
                      />
                    </g>
                  );
                })}
                <text x={centerX} y={chartH - 10} textAnchor="middle" fontSize="11.5" fill={C.muted}>
                  {String(row.date || `#${rIdx + 1}`).slice(0, 10)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Component chính: App (DataTable)                                  */
/* ------------------------------------------------------------------ */
export default function App() {
  const [activeNav, setActiveNav] = useState("Bảng dữ liệu");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeStage, setActiveStage] = useState(2);
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [isExpanded, setIsExpanded] = useState(false); // Notion-style: thích cho to thì to
  const [showNotes, setShowNotes] = useState(false);
  const [notesByStage, setNotesByStage] = useState(INITIAL_NOTES_BY_STAGE);
  const [chartTableId, setChartTableId] = useState("tbl-metrics");
  const [toast, setToast] = useState(null);

  // Modal tạo bảng mới
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDoc, setNewDoc] = useState("Docs – Ghi chép chặng hiện tại");
  const [newColor, setNewColor] = useState(C.indigo);

  const notify = (msg) => {
    setToast(msg);
    clearTimeout(window.__dtToast);
    window.__dtToast = setTimeout(() => setToast(null), 2600);
  };

  const stageTables = useMemo(
    () => tables.filter((t) => t.stageId === activeStage),
    [tables, activeStage]
  );

  const currentStageObj = useMemo(
    () => STAGES.find((s) => s.id === activeStage) || STAGES[0],
    [activeStage]
  );

  const stageNotes = notesByStage[activeStage] || [];

  const handleAddNoteBlock = () => {
    const newBlock = {
      id: `note-${Date.now()}`,
      goalRange: "Goal 1 → Goal n",
      title: "",
      content: "",
      summary: "",
    };
    setNotesByStage((prev) => ({
      ...prev,
      [activeStage]: [...(prev[activeStage] || []), newBlock],
    }));
  };

  const handleUpdateNoteBlock = (noteId, field, value) => {
    setNotesByStage((prev) => ({
      ...prev,
      [activeStage]: (prev[activeStage] || []).map((item) =>
        item.id === noteId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleDeleteNoteBlock = (noteId) => {
    setNotesByStage((prev) => ({
      ...prev,
      [activeStage]: (prev[activeStage] || []).filter((item) => item.id !== noteId),
    }));
  };

  // Đồng bộ chartTableId nếu đổi chặng
  const activeChartTable =
    stageTables.find((t) => t.id === chartTableId) || stageTables[0] || null;

  // Chỉnh sửa ô dữ liệu
  const handleCellChange = (tableId, rowId, colKey, value) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          rows: t.rows.map((r) => (r.id === rowId ? { ...r, [colKey]: value } : r)),
        };
      })
    );
  };

  // Đổi tên cột
  const handleColRename = (tableId, colKey, newLabel) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          columns: t.columns.map((c) => (c.key === colKey ? { ...c, label: newLabel } : c)),
        };
      })
    );
  };

  // Thêm dòng mới kiểu Notion
  const handleAddRow = (tableId) => {
    const today = new Date().toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const newRow = { id: `row-${Date.now()}`, date: today };
        t.columns.forEach((c) => {
          if (c.key !== "date") newRow[c.key] = 0;
        });
        return { ...t, rows: [...t.rows, newRow] };
      })
    );
  };

  // Thêm cột mới kiểu Notion
  const handleAddColumn = (tableId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const nextIdx = t.columns.length;
        const key = `s${nextIdx}_${Date.now().toString().slice(-3)}`;
        return {
          ...t,
          columns: [...t.columns, { key, label: `Status ${nextIdx} (unit)`, type: "number" }],
          rows: t.rows.map((r) => ({ ...r, [key]: 0 })),
        };
      })
    );
    notify("Đã thêm cột mới vào bảng");
  };

  // Xóa cột (giữ lại ít nhất 1 cột trong bảng)
  const handleDeleteColumn = (tableId, colKey) => {
    const targetTable = tables.find((t) => t.id === tableId);
    if (!targetTable) return;

    if (targetTable.columns.length <= 1) {
      notify("Bảng cần giữ lại ít nhất 1 cột");
      return;
    }

    const removedCol = targetTable.columns.find((c) => c.key === colKey);
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          columns: t.columns.filter((c) => c.key !== colKey),
          rows: t.rows.map((r) => {
            const { [colKey]: _omitted, ...rest } = r;
            return rest;
          }),
        };
      })
    );
    notify(`Đã xóa cột "${removedCol?.label || colKey}"`);
  };

  // Xóa 1 dòng
  const handleDeleteRow = (tableId, rowId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return { ...t, rows: t.rows.filter((r) => r.id !== rowId) };
      })
    );
  };

  // Tạo bảng mới theo chặng đang chọn
  const handleCreateTable = (e) => {
    e.preventDefault();
    const title = newTitle.trim() || `Bảng dữ liệu #${stageTables.length + 1}`;
    const created = {
      id: `tbl-${Date.now()}`,
      stageId: activeStage,
      title,
      color: newColor,
      linkedDoc: newDoc.trim() || "Docs – Chưa gắn tài liệu",
      columns: [
        { key: "date", label: "Date", type: "date" },
        { key: "s1", label: "Status 1 (unit)", type: "number" },
        { key: "s2", label: "Status 2 (unit)", type: "number" },
        { key: "s3", label: "Status 3 (unit)", type: "number" },
      ],
      rows: [
        {
          id: `r-${Date.now()}`,
          date: new Date().toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          s1: 10,
          s2: 20,
          s3: 30,
        },
      ],
    };
    setTables((prev) => [...prev, created]);
    setChartTableId(created.id);
    setNewTitle("");
    setShowAddModal(false);
    notify(`Đã tạo "${title}" cho ${STAGES.find((s) => s.id === activeStage)?.name}`);
  };

  return (
    <div
      className="np"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        minWidth: 900,
        background: C.page,
      }}
    >
      <style>{css}</style>

      {/* Thanh tiêu đề 48px đồng bộ */}
      <header
        style={{
          flex: "none",
          height: 48,
          background: C.ink,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 10,
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
        Data Table
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Thanh bên có thể thu gọn / mở rộng linh hoạt */}
        <nav
          aria-label="Điều hướng dự án"
          style={{
            flex: "none",
            width: sidebarCollapsed ? 68 : 248,
            padding: sidebarCollapsed ? "16px 10px" : "18px 14px",
            background: "#eceef9",
            borderRight: `1px solid ${C.line}`,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            transition: "width .22s cubic-bezier(0.4, 0, 0.2, 1), padding .22s ease",
            overflow: "hidden",
          }}
        >
          {/* Hàng trên cùng: Nút Quay lại + Nút thu gọn/mở rộng sidebar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: sidebarCollapsed ? "center" : "space-between",
              gap: 8,
              marginBottom: 18,
            }}
          >
            {!sidebarCollapsed && (
              <button
                type="button"
                className="np-back-btn"
                onClick={() => {
                  setActiveNav("Current Project");
                  notify("Quay lại danh sách dự án");
                }}
                title="Quay lại"
              >
                <Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} size={16} />
                <span>Quay lại</span>
              </button>
            )}

            <button
              type="button"
              className="np-collapse-btn"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              title={sidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
              aria-label={sidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
              aria-expanded={!sidebarCollapsed}
            >
              <Icon
                d={
                  sidebarCollapsed
                    ? ["M9 18l6-6-6-6"]
                    : ["M15 18l-6-6 6-6"]
                }
                size={17}
              />
            </button>
          </div>

          {/* Khi thu gọn vẫn giữ nút Quay lại dạng icon gọn gàng */}
          {sidebarCollapsed && (
            <button
              type="button"
              className="np-nav"
              style={{ justifyContent: "center", padding: 0, marginBottom: 4 }}
              onClick={() => {
                setActiveNav("Current Project");
                notify("Quay lại danh sách dự án");
              }}
              title="Quay lại"
              aria-label="Quay lại"
            >
              <Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} />
            </button>
          )}

          {NAV.map((n) => (
            <button
              key={n.name}
              className="np-nav"
              style={sidebarCollapsed ? { justifyContent: "center", padding: 0 } : undefined}
              title={sidebarCollapsed ? n.name : undefined}
              aria-current={activeNav === n.name ? "page" : undefined}
              onClick={() => {
                setActiveNav(n.name);
                if (n.name !== "Bảng dữ liệu") {
                  notify(`Đang ở màn hình Bảng dữ liệu (đã chọn: ${n.name})`);
                }
              }}
            >
              <span style={{ flexShrink: 0, display: "inline-flex" }}>
                <Icon d={n.d} />
              </span>
              {!sidebarCollapsed && <span>{n.name}</span>}
            </button>
          ))}
        </nav>

        {/* Nội dung chính */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 48px 64px" }}>
          <div
            style={{
              maxWidth: isExpanded ? "100%" : 1000,
              transition: "max-width .25s ease",
            }}
          >
            {/* Hàng trên cùng: Tiêu đề + 2 nút theo wireframe ("Thêm bảng" & "Ghi chú") + Mở rộng kiểu Notion */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: 26,
                    fontWeight: 700,
                    color: C.ink,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Bảng dữ liệu
                </h1>

                <button className="np-btn primary" onClick={() => setShowAddModal(true)}>
                  <Icon d={["M12 5v14M5 12h14"]} size={16} stroke="#fff" />
                  Thêm bảng
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  className={`np-btn ${isExpanded ? "active-soft" : ""}`}
                  onClick={() => setIsExpanded(!isExpanded)}
                  title="Phóng to hoặc thu gọn độ rộng bảng như Notion"
                >
                  <Icon
                    d={
                      isExpanded
                        ? ["M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"]
                        : ["M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"]
                    }
                    size={16}
                  />
                  {isExpanded ? "Thu gọn" : "Mở rộng bảng"}
                </button>

                <button
                  className={`np-btn ${showNotes ? "active-soft" : ""}`}
                  onClick={() => setShowNotes(!showNotes)}
                >
                  <Icon d={["M14 3v4a1 1 0 0 0 1 1h4", "M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"]} size={16} />
                  Ghi chú
                </button>
              </div>
            </div>

            {/* Thanh chọn chặng: "Có thể tạo nhiều bảng theo từng chặng khác nhau" */}
            <div
              role="tablist"
              aria-label="Chọn chặng dự án"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: 5,
                marginBottom: 20,
                background: "#ebedf7",
                borderRadius: 12,
                width: "fit-content",
                maxWidth: "100%",
                overflowX: "auto",
              }}
            >
              {STAGES.map((st) => {
                const count = tables.filter((t) => t.stageId === st.id).length;
                const active = activeStage === st.id;
                return (
                  <button
                    key={st.id}
                    role="tab"
                    aria-selected={active}
                    className={`np-tab ${active ? "active" : ""}`}
                    onClick={() => setActiveStage(st.id)}
                  >
                    {st.name}
                    <span
                      style={{
                        marginLeft: 6,
                        padding: "1px 6px",
                        borderRadius: 6,
                        fontSize: 11.5,
                        background: active ? C.indigoSoft : "rgba(255,255,255,0.65)",
                        color: active ? C.indigo : C.muted,
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Danh sách các bảng trong chặng (Bảng chỉ số, Bảng kết quả, v.v.) */}
            {stageTables.length === 0 ? (
              <Card title="Chưa có bảng nào ở chặng này" color={C.muted} style={{ marginBottom: 16 }}>
                <p style={{ margin: "0 0 14px", color: C.muted, fontSize: 14 }}>
                  Mỗi chặng có thể tạo nhiều bảng dữ liệu và gắn với một file Docs riêng.
                </p>
                <button className="np-btn primary" onClick={() => setShowAddModal(true)}>
                  + Tạo bảng đầu tiên cho chặng này
                </button>
              </Card>
            ) : (
              stageTables.map((tbl) => (
                <Card
                  key={tbl.id}
                  title={tbl.title}
                  color={tbl.color}
                  style={{ marginBottom: 16 }}
                  action={
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      {/* Badge gắn với 1 docs riêng */}
                      <button
                        className="np-badge-doc"
                        onClick={() => notify(`Mở tài liệu liên kết: ${tbl.linkedDoc}`)}
                        title="Mỗi bảng gắn với 1 Docs riêng"
                      >
                        <Icon d={["M7 3h8l4 4v14H7z", "M15 3v4h4"]} size={14} stroke={tbl.color} />
                        <span>Gắn với: {tbl.linkedDoc}</span>
                      </button>

                      <button
                        className="np-btn"
                        style={{ height: 32, padding: "0 10px", fontSize: 13 }}
                        onClick={() => handleAddColumn(tbl.id)}
                      >
                        + Thêm cột
                      </button>
                    </div>
                  }
                >
                  {/* Bảng kiểu Notion: chỉnh sửa trực tiếp từng ô và tiêu đề cột */}
                  <div className="np-notion-wrap">
                    <table className="np-notion-table">
                      <thead>
                        <tr>
                          {tbl.columns.map((col) => (
                            <th key={col.key}>
                              <div className="np-th-wrap">
                                <input
                                  className="np-th-input"
                                  value={col.label}
                                  onChange={(e) => handleColRename(tbl.id, col.key, e.target.value)}
                                  aria-label={`Tên cột ${col.label}`}
                                />
                                {tbl.columns.length > 1 && (
                                  <button
                                    type="button"
                                    className="np-col-del"
                                    onClick={() => handleDeleteColumn(tbl.id, col.key)}
                                    title="Xóa cột"
                                    aria-label={`Xóa cột ${col.label}`}
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </th>
                          ))}
                          <th style={{ width: 42, minWidth: 42, textAlign: "center" }} aria-label="Thao tác" />
                        </tr>
                      </thead>
                      <tbody>
                        {tbl.rows.map((row) => (
                          <tr key={row.id}>
                            {tbl.columns.map((col) => (
                              <td key={col.key}>
                                <input
                                  className="np-cell-input"
                                  type={col.type === "number" ? "number" : "text"}
                                  step="any"
                                  value={row[col.key] ?? ""}
                                  onChange={(e) =>
                                    handleCellChange(tbl.id, row.id, col.key, e.target.value)
                                  }
                                  aria-label={`${col.label} dòng ${row.date}`}
                                />
                              </td>
                            ))}
                            <td style={{ textAlign: "center" }}>
                              <button
                                onClick={() => handleDeleteRow(tbl.id, row.id)}
                                title="Xóa dòng"
                                aria-label="Xóa dòng"
                                style={{
                                  border: 0,
                                  background: "transparent",
                                  color: C.muted,
                                  cursor: "pointer",
                                  padding: 6,
                                  borderRadius: 6,
                                }}
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <button className="np-row-add" onClick={() => handleAddRow(tbl.id)}>
                      <Icon d={["M12 5v14M5 12h14"]} size={14} />
                      Thêm dòng mới
                    </button>
                  </div>
                </Card>
              ))
            )}

            {/* Card Biểu đồ trực quan: "Thêm mấy cái biểu đồ vào" */}
            {activeChartTable && (
              <Card
                title="Biểu đồ trực quan"
                color={C.violet}
                action={
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {stageTables.map((t) => (
                      <button
                        key={t.id}
                        className={`np-btn ${activeChartTable.id === t.id ? "active-soft" : ""}`}
                        style={{ height: 32, padding: "0 12px", fontSize: 13 }}
                        onClick={() => setChartTableId(t.id)}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: t.color,
                          }}
                        />
                        {t.title}
                      </button>
                    ))}
                  </div>
                }
              >
                <TableChart table={activeChartTable} />
              </Card>
            )}
          </div>
        </main>

        {/* Thanh ngăn kéo Ghi chú trượt từ bên phải (0px khi đóng, 380px khi mở) */}
        <aside
          aria-label="Ngăn kéo ghi chú"
          aria-hidden={!showNotes}
          className="np-note-drawer"
          style={{
            width: showNotes ? 380 : 0,
            borderLeft: showNotes ? `1px solid ${C.line}` : "0px solid transparent",
          }}
        >
          <div
            style={{
              width: 380,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "18px 16px 20px",
              overflowY: "auto",
            }}
          >
            {/* Header ngăn kéo Ghi chú */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                paddingBottom: 14,
                marginBottom: 14,
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: C.amber,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontWeight: 700, fontSize: 15.5, color: C.ink }}>
                  Ghi chú chặng
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  type="button"
                  className="np-btn primary"
                  style={{ height: 32, padding: "0 11px", fontSize: 12.5 }}
                  onClick={handleAddNoteBlock}
                >
                  + Thêm mục
                </button>
                <button
                  type="button"
                  className="np-collapse-btn"
                  style={{ width: 32, height: 32 }}
                  onClick={() => setShowNotes(false)}
                  title="Đóng ghi chú"
                  aria-label="Đóng ghi chú"
                >
                  <Icon d={["M18 6L6 18", "M6 6l12 12"]} size={15} />
                </button>
              </div>
            </div>

            {/* Danh sách các khối ghi chú theo đúng format ảnh mẫu */}
            {stageNotes.length === 0 ? (
              <div
                className="np-note-card"
                style={{ textAlign: "center", padding: "24px 16px", color: C.muted }}
              >
                <p style={{ margin: "0 0 12px", fontSize: 13.5 }}>
                  Chưa có ghi chú nào cho <strong>{currentStageObj.name}</strong>.
                </p>
                <button
                  type="button"
                  className="np-btn"
                  style={{ height: 34, fontSize: 13 }}
                  onClick={handleAddNoteBlock}
                >
                  + Tạo ghi chú đầu tiên
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stageNotes.map((note) => (
                  <div key={note.id} className="np-note-card">
                    {/* Dòng 1: Chấm tròn + Chặng - (optional) Goal 1 → Goal n */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 11,
                          height: 11,
                          borderRadius: "50%",
                          background: "#868b9e",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: C.ink,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Chặng {activeStage} -
                      </span>
                      <input
                        className="np-note-ghost-input"
                        style={{
                          fontSize: 12.5,
                          color: C.muted,
                          fontWeight: 500,
                          flex: 1,
                          minWidth: 0,
                        }}
                        value={note.goalRange}
                        onChange={(e) =>
                          handleUpdateNoteBlock(note.id, "goalRange", e.target.value)
                        }
                        placeholder="(optional) Goal 1 → Goal n"
                        aria-label="Phạm vi Goal"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteNoteBlock(note.id)}
                        title="Xóa ghi chú này"
                        aria-label="Xóa ghi chú"
                        style={{
                          border: 0,
                          background: "transparent",
                          color: C.muted,
                          cursor: "pointer",
                          padding: "2px 5px",
                          borderRadius: 5,
                          fontSize: 15,
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </div>

                    {/* Nội dung thụt lề bên trong theo đúng bố cục mẫu */}
                    <div
                      style={{
                        paddingLeft: 14,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {/* Bullet 1: • TIÊU ĐỀ */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          aria-hidden="true"
                          style={{ color: C.ink, fontWeight: 700, fontSize: 15 }}
                        >
                          •
                        </span>
                        <input
                          className="np-note-ghost-input"
                          style={{
                            fontWeight: 700,
                            fontSize: 13.5,
                            color: C.ink,
                            textTransform: "uppercase",
                            letterSpacing: "0.02em",
                          }}
                          value={note.title}
                          onChange={(e) =>
                            handleUpdateNoteBlock(note.id, "title", e.target.value)
                          }
                          placeholder="TIÊU ĐỀ"
                          aria-label="Tiêu đề ghi chú"
                        />
                      </div>

                      {/* Bullet 2: • Ghi chú */}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span
                          aria-hidden="true"
                          style={{
                            color: C.text,
                            fontWeight: 700,
                            fontSize: 15,
                            lineHeight: "24px",
                          }}
                        >
                          •
                        </span>
                        <textarea
                          className="np-note-ghost-input"
                          rows={3}
                          style={{
                            fontSize: 13.5,
                            color: C.text,
                            lineHeight: 1.5,
                            resize: "vertical",
                            minHeight: 62,
                          }}
                          value={note.content}
                          onChange={(e) =>
                            handleUpdateNoteBlock(note.id, "content", e.target.value)
                          }
                          placeholder="Ghi chú chi tiết..."
                          aria-label="Nội dung ghi chú"
                        />
                      </div>

                      {/* Dòng kết: → Tóm tắt */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          paddingTop: 4,
                          borderTop: `1px dashed ${C.line}`,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            color: C.indigo,
                            fontWeight: 600,
                            fontSize: 14,
                            flexShrink: 0,
                          }}
                        >
                          →
                        </span>
                        <input
                          className="np-note-ghost-input"
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: C.indigo,
                          }}
                          value={note.summary}
                          onChange={(e) =>
                            handleUpdateNoteBlock(note.id, "summary", e.target.value)
                          }
                          placeholder="Tóm tắt..."
                          aria-label="Tóm tắt ghi chú"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Modal thêm bảng mới */}
      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-add-table-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(27, 32, 56, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleCreateTable}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 440,
              background: "#fff",
              borderRadius: 14,
              border: `1px solid ${C.line}`,
              padding: 22,
              boxShadow: "0 20px 40px -12px rgba(27,32,56,0.25)",
            }}
          >
            <h3 id="modal-add-table-title" style={{ margin: "0 0 16px", fontSize: 18, color: C.ink }}>
              Thêm bảng mới ({STAGES.find((s) => s.id === activeStage)?.name})
            </h3>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                Tên bảng
              </label>
              <input
                className="np-input"
                placeholder="Ví dụ: Bảng theo dõi thói quen..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                Gắn với tài liệu Docs riêng
              </label>
              <input
                className="np-input"
                placeholder="Ví dụ: Docs – Tiêu chuẩn chặng 2"
                value={newDoc}
                onChange={(e) => setNewDoc(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                Màu nhận diện
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {[C.indigo, C.teal, C.violet, C.amber, C.coral].map((clr) => (
                  <button
                    type="button"
                    key={clr}
                    onClick={() => setNewColor(clr)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: newColor === clr ? `3px solid ${C.ink}` : "2px solid transparent",
                      background: clr,
                      cursor: "pointer",
                    }}
                    aria-label={`Chọn màu ${clr}`}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="np-btn" onClick={() => setShowAddModal(false)}>
                Hủy
              </button>
              <button type="submit" className="np-btn primary">
                Tạo bảng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast phản hồi nhẹ */}
      {toast && (
        <div
          role="status"
          style={{
            position: "fixed",
            bottom: 20,
            right: 24,
            zIndex: 1100,
            background: C.ink,
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 10px 25px -8px rgba(27, 32, 56, 0.35)",
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal }} />
          {toast}
        </div>
      )}
    </div>
  );
}