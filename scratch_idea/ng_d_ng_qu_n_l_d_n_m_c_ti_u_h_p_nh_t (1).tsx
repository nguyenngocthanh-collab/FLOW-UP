import React, { useState, useMemo, useRef, useEffect } from "react";

/* ============================================================================
   1. DESIGN TOKENS & DỮ LIỆU KHỞI TẠO DÙNG CHUNG
   ============================================================================ */
const C = {
  ink: "#1b2038",
  text: "#2b3150",
  muted: "#6a7192",
  page: "#f5f6fb",
  card: "#ffffff",
  panel: "#f1f3f9",
  line: "#e3e6f1",
  lineAlt: "#dfe3f0",
  field: "#f9faff",
  indigo: "#4f52d9",
  indigoSoft: "#ececfc",
  teal: "#0fa89a",
  tealSoft: "#e3f6f4",
  violet: "#7b4fe0",
  violetSoft: "#f1ecfc",
  coral: "#f0524f",
  coralSoft: "#fdecec",
  amber: "#e8960c",
  amberSoft: "#fef4e4",
  midBottom: "#eef0f8",
  rightCol: "#eceef9",
  colOdd: "#e7e9f4",
  colEven: "#f1f3fa",
};

const MAX_STAGES = 4;

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: "Project 1",
    stage: "Chặng 3 · Vòng lặp nâng cấp",
    progress: 65,
    color: C.teal,
    updated: "Hôm nay",
    goal: "Hoàn thiện hệ thống đo lường & tối ưu quy trình",
    resource: "2h mỗi tối + Tài liệu chuẩn hóa",
    status: "Đang chạy ổn định ở chặng 3",
    currentStageNum: 3,
  },
  {
    id: 2,
    name: "Project 2",
    stage: "Chặng 2 · Tiêu chuẩn hóa",
    progress: 35,
    color: C.amber,
    updated: "2 ngày trước",
    goal: "Xây dựng thói quen kỷ luật và bộ chỉ số cốt lõi",
    resource: "90 phút/ngày + Bảng theo dõi",
    status: "Đang chuẩn hóa các đầu mục tuần",
    currentStageNum: 2,
  },
];

const INITIAL_STAGES = [
  {
    id: "stage_1",
    title: "Chặng 1: Làm quen",
    note: "",
    core: false,
    isStage: true,
    children: [
      {
        id: "a",
        title: "Mục tiêu mấu chốt",
        note: "",
        core: true,
        score: "50",
        due: "",
        limitUnit: "month",
        resource: "",
        condition: "",
        children: [
          {
            id: "a1",
            title: "Mục tiêu mấu chốt",
            note: "",
            core: true,
            score: "25",
            due: "",
            limitUnit: "week",
            resource: "",
            condition: "",
            children: [
              {
                id: "a1_1",
                title: "Mục tiêu nhỏ 3",
                note: "",
                core: false,
                score: "15",
                due: "",
                limitUnit: "day",
                resource: "",
                condition: "",
                children: [],
              },
            ],
          },
          {
            id: "a2",
            title: "Mục tiêu vừa 2",
            note: "",
            core: false,
            score: "15",
            due: "",
            limitUnit: "day",
            resource: "",
            condition: "",
            children: [],
          },
        ],
      },
      {
        id: "b",
        title: "Mục tiêu 1",
        note: "",
        core: false,
        score: "30",
        due: "",
        limitUnit: "week",
        resource: "",
        condition: "",
        children: [],
      },
      {
        id: "c",
        title: "Mục tiêu 2",
        note: "",
        core: false,
        score: "20",
        due: "",
        limitUnit: "day",
        resource: "",
        condition: "",
        children: [],
      },
    ],
  },
  {
    id: "stage_2",
    title: "Chặng 2: Tiêu chuẩn hóa",
    note: "",
    core: false,
    isStage: true,
    children: [],
  },
  {
    id: "stage_3",
    title: "Chặng 3: Vòng lặp nâng cấp",
    note: "",
    core: false,
    isStage: true,
    children: [],
  },
  {
    id: "stage_4",
    title: "Chặng 4: Chạm đến",
    note: "",
    core: false,
    isStage: true,
    children: [],
  },
];

/* ---------- Dữ liệu Data Table ---------- */
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

/* ---------- Dữ liệu Mathematics ---------- */
const MATH_TABLE_TYPES = {
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
      "stage-2": [{ id: "m2-r1", date: "17/11/2026", s1: 210, s2: 240, s3: 2.1 }],
      "stage-3": [{ id: "m3-r1", date: "20/11/2026", s1: 310, s2: 320, s3: 1.2 }],
      "stage-4": [{ id: "m4-r1", date: "22/11/2026", s1: 400, s2: 400, s3: 0.9 }],
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
      "stage-2": [{ id: "p2-r1", date: "17/11/2026", s1: 8.5, s2: 9.0, s3: 410 }],
      "stage-3": [{ id: "p3-r1", date: "20/11/2026", s1: 9.0, s2: 9.5, s3: 460 }],
      "stage-4": [{ id: "p4-r1", date: "22/11/2026", s1: 9.8, s2: 10.0, s3: 510 }],
    },
  },
};

const INITIAL_MATH_VARS = [
  { id: "v-s1", name: "Status 1", sourceKey: "s1", unit: "unit", color: C.indigo, customVal: 4.5 },
  { id: "v-s2", name: "Status 2", sourceKey: "s2", unit: "unit", color: C.teal, customVal: 5.0 },
  { id: "v-s3", name: "Status 3", sourceKey: "s3", unit: "unit", color: C.violet, customVal: 90 },
];

const INITIAL_MATH_FORMULAS = [
  { id: "f-ratio", code: "CTT-01", name: "Tỷ lệ đạt (%)", op: "ratio", unit: "%" },
  { id: "f-diff", code: "CTT-02", name: "Chênh lệch", op: "diff", unit: "unit" },
  { id: "f-sum", code: "CTT-03", name: "Tổng hợp", op: "sum", unit: "unit" },
  { id: "f-avg", code: "CTT-04", name: "Trung bình cộng", op: "avg", unit: "unit" },
];

const OPS = {
  ratio: { expr: "(biến 1 ÷ biến 2) × 100", label: "Tỷ lệ % : (biến 1 ÷ biến 2) × 100", calc: (a, b) => (b !== 0 ? (a / b) * 100 : 0) },
  growth: { expr: "((biến 1 − biến 2) ÷ biến 2) × 100", label: "Tăng trưởng % : ((biến 1 − biến 2) ÷ biến 2) × 100", calc: (a, b) => (b !== 0 ? ((a - b) / b) * 100 : 0) },
  mul: { expr: "biến 1 × biến 2", label: "Tích số : biến 1 × biến 2", calc: (a, b) => a * b },
  sum: { expr: "biến 1 + biến 2", label: "Tổng : biến 1 + biến 2", calc: (a, b) => a + b },
  diff: { expr: "biến 1 − biến 2", label: "Hiệu : biến 1 − biến 2", calc: (a, b) => a - b },
  avg: { expr: "(biến 1 + biến 2) ÷ 2", label: null, calc: (a, b) => (a + b) / 2 },
};
const ADDABLE_OPS = ["ratio", "growth", "mul", "sum", "diff"];

const LAYER_OPS = {
  ratio: { short: "÷ × 100", calc: (a, b) => (b !== 0 ? (a / b) * 100 : 0) },
  growth: { short: "tăng trưởng %", calc: (a, b) => (b !== 0 ? ((a - b) / b) * 100 : 0) },
  mul: { short: "×", calc: (a, b) => a * b },
  sum: { short: "+", calc: (a, b) => a + b },
  diff: { short: "−", calc: (a, b) => a - b },
  avg: { short: "trung bình", calc: (a, b) => (a + b) / 2 },
};

/* ---------- Dữ liệu Calendar ---------- */
const INITIAL_CALENDAR_SGS = [
  { id: 0, bar: "SG 1 (P name/ Chặng/ )", btn: "SG 1 - small goal" },
  { id: 1, bar: "SG 2 (P name/ Chặng/ Goal 1/ Goal 2)", btn: "SG 2 - small goal" },
];
const EMPTY_CAL_FORM = { start: "", due: "", top: "", method: "", tool: "", place: "", other: "", repeat: "" };
const EVENT_COLORS = [
  { bg: "#ececfc", border: "#4f52d9", text: "#26288a", badge: "#d7d8fa" },
  { bg: "#e3f6f4", border: "#0fa89a", text: "#095c54", badge: "#c5ede9" },
  { bg: "#f1ebfc", border: "#7b4fe0", text: "#432291", badge: "#e0d2fa" },
  { bg: "#fef3e2", border: "#e8960c", text: "#7c4d03", badge: "#fce3b8" },
  { bg: "#fdeaea", border: "#f0524f", text: "#851e1c", badge: "#fbd0cf" },
];

/* ---------- Dữ liệu Widget Suite ---------- */
const INITIAL_WIDGET_GOALS = [
  { id: "g1", t: "Goal 1 – Name" },
  { id: "g2", t: "Goal 2" },
];
const EMPTY_WIDGET_DETAIL = { start: "", due: "", key: "", method: "", tool: "", place: "", other: "" };
const EMPTY_WIDGET_DATA = { title: "", note: "", kind: "", prop: "" };
const INITIAL_WIDGET_NOTES = [
  {
    id: "n1",
    title: "Data 1 – Bảng chỉ số & Kết quả",
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
  },
  {
    id: "n2",
    title: "Data 2",
    indicators: [{ date: "17/11/2026", s1: 8.2, s2: 60, s3: 3.4 }],
    results: [{ date: "17/11/2026", s1: 5, s3: 2 }],
  },
];

/* ============================================================================
   2. GLOBAL CSS (BAO GỒM CSS CHO NASCENT OUTLINER + TẤT CẢ MÀN HÌNH)
   ============================================================================ */
const GLOBAL_CSS = `
  body { margin: 0; padding: 0; background: ${C.page}; }
  .np, .np *, .og, .og * {
    box-sizing: border-box;
    font-family: Inter, "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, Roboto, Arial, sans-serif;
  }
  .np { color: ${C.text}; font-size: 15px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
  .np button, .np input, .np textarea, .np select { font-family: inherit; font-size: inherit; color: inherit; }

  /* Card & Common */
  .np-card { background: ${C.card}; border: 1px solid ${C.line}; border-radius: 14px; padding: 20px; }
  .np-card-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
  .np-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 16px; font-weight: 600; color: ${C.ink}; }
  .np-sq { width: 10px; height: 10px; border-radius: 3px; flex: none; display: inline-block; }
  .np-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .np-note { font-size: 13px; color: ${C.muted}; }
  .np-label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: ${C.text}; }

  /* Buttons */
  .np-btn { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; border: 1px solid ${C.line}; border-radius: 10px; background: #fff; color: ${C.ink}; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s, color .15s, transform .15s; }
  .np-btn:hover:not(:disabled), .np-btn.on { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }
  .np-btn.sm { height: 32px; padding: 0 12px; font-size: 13px; }
  .np-btn.primary { background: ${C.indigo}; border-color: ${C.indigo}; color: #fff; box-shadow: 0 8px 18px -8px ${C.indigo}; }
  .np-btn.primary:hover:not(:disabled) { background: #4144c4; color: #fff; }
  .np-btn.active-soft { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }
  .np-btn.teal { background: ${C.tealSoft}; border-color: #b4eae5; color: #0b8579; }
  .np-btn.teal:hover:not(:disabled) { background: #d1f1ee; border-color: ${C.teal}; }
  .np-btn.danger { background: ${C.coralSoft}; border-color: #f8c8c7; color: ${C.coral}; }
  .np-btn.danger:hover:not(:disabled) { background: #fbd9d8; border-color: ${C.coral}; }
  .np button:focus-visible, .np-link:focus-visible, .np-goal-text:focus-visible { outline: 3px solid ${C.indigoSoft}; outline-offset: 2px; box-shadow: 0 0 0 2px ${C.indigo}; }

  .np-icon-btn { width: 32px; height: 32px; border: 1px solid ${C.line}; border-radius: 8px; background: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: ${C.muted}; transition: background .15s, border-color .15s, color .15s; flex: none; }
  .np-icon-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }
  .np-icon-btn[aria-pressed="true"] { background: ${C.tealSoft}; border-color: ${C.teal}; color: ${C.teal}; }

  .np-link { border: 0; background: none; padding: 0; cursor: pointer; color: ${C.indigo}; font-weight: 500; text-decoration: underline; text-underline-offset: 3px; text-decoration-color: #b9baf0; }
  .np-link:hover { text-decoration-color: ${C.indigo}; }

  /* Inputs */
  .np-input { width: 100%; height: 40px; padding: 0 12px; border: 1px solid ${C.line}; border-radius: 9px; background: ${C.field}; transition: border-color .15s, box-shadow .15s, background .15s; }
  select.np-input { cursor: pointer; font-weight: 600; color: ${C.ink}; }
  textarea.np-input { height: auto; min-height: 76px; padding: 10px 12px; resize: vertical; }
  .np-input:hover { border-color: #cfd4e8; }
  .np-input:focus { outline: none; background: #fff; border-color: ${C.indigo}; box-shadow: 0 0 0 3px ${C.indigoSoft}; }

  /* Nascent Project Outliner Editor (2_nascent_project_2.tsx) */
  .np-field-head { display:flex; align-items:center; justify-content:space-between; gap:8px; min-height:24px; margin-bottom:6px; }
  .np-field-head label { margin:0; font-size:13px; font-weight:500; color:${C.text}; cursor:pointer; }
  .np-toolbar { display:inline-flex; align-items:center; gap:2px; background:#fff; border:1px solid ${C.line}; border-radius:8px; padding:2px 4px; box-shadow: 0 2px 6px rgba(27, 32, 56, 0.05); }
  .np-tool-btn { display:inline-flex; align-items:center; justify-content:center; width:24px; height:22px; border:0; border-radius:5px; background:transparent; color:${C.muted}; cursor:pointer; transition: background .12s, color .12s; }
  .np-tool-btn:hover:not(:disabled) { background:${C.indigoSoft}; color:${C.indigo}; }
  .np-tool-btn:disabled { opacity:0.35; cursor:not-allowed; }
  .np-tool-sep { width:1px; height:14px; background:${C.line}; margin:0 2px; }

  .np-editor { width:100%; min-height:42px; padding:9px 12px; border:1px solid ${C.line}; border-radius:9px; background:${C.field}; transition: border-color .15s, box-shadow .15s, background .15s; cursor:text; word-break:break-word; outline:none; line-height:1.55; }
  .np-editor.multiline { min-height:92px; }
  .np-editor:hover { border-color:#cfd4e8; }
  .np-editor:focus { background:#fff; border-color:${C.indigo}; box-shadow:0 0 0 3px ${C.indigoSoft}; }
  .np-editor:empty::before { content: attr(data-placeholder); color: #9aa2c4; pointer-events: none; font-size: 13.5px; }
  .np-editor ul { margin: 2px 0; padding-left: 20px; list-style-type: disc; }
  .np-editor ul ul { margin: 3px 0 3px 4px; padding-left: 18px; border-left: 1.5px solid #d4d9ec; list-style-type: disc; }
  .np-editor li { margin: 2px 0; }
  .np-editor li::marker { color: ${C.muted}; font-size: 0.9em; }

  @media (max-width: 768px) {
    .np-nascent-shell { flex-direction: column !important; }
    .np-nascent-sidebar { width: 100% !important; flex-direction: row !important; overflow-x: auto; padding: 12px !important; border-right: 0 !important; border-bottom: 1px solid ${C.line}; }
    .np-nascent-main { padding: 24px 16px 48px !important; }
  }

  /* Home Screen Tiles & Grids */
  .np-tile { display: flex; flex-direction: column; justify-content: space-between; width: 100%; min-height: 142px; padding: 18px 20px; text-align: left; background: ${C.card}; border: 1px solid ${C.line}; border-radius: 14px; cursor: pointer; transition: background .15s, border-color .15s, transform .15s; }
  .np-tile:hover { border-color: #c9caf3; background: ${C.field}; transform: translateY(-1px); }
  .np-tile.new { align-items: center; justify-content: center; gap: 10px; background: ${C.indigoSoft}; border: 1px dashed ${C.indigo}; color: ${C.indigo}; font-weight: 600; }
  .np-tile.new:hover { border-color: #4144c4; color: #4144c4; }
  .np-plus { width: 36px; height: 36px; border-radius: 50%; background: ${C.indigo}; color: #fff; display: inline-flex; align-items: center; justify-content: center; }
  .np-chip { font-size: 12px; font-weight: 600; color: ${C.muted}; background: ${C.field}; border: 1px solid ${C.line}; border-radius: 6px; padding: 2px 8px; }
  .np-stat { padding: 12px 14px; border: 1px solid ${C.line}; border-radius: 10px; background: ${C.field}; }
  .np-stat-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 14px; }
  .np-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .np-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  @media (max-width: 1100px) { .np-grid { grid-template-columns: 1fr; } .np-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 640px) { .np-grid-3 { grid-template-columns: 1fr; } }

  /* Workspace Sidebar */
  .np-nav { display: flex; align-items: center; gap: 12px; width: 100%; height: 42px; padding: 0 12px; border: 0; border-radius: 10px; background: transparent; color: ${C.muted}; font-weight: 500; text-align: left; cursor: pointer; transition: background .15s, color .15s; white-space: nowrap; overflow: hidden; }
  .np-nav:hover { background: #fff; color: ${C.ink}; }
  .np-nav[aria-current="page"] { background: ${C.indigoSoft}; color: ${C.indigo}; font-weight: 600; }
  .np-back { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 40px; border: 0; border-radius: 11px; background: linear-gradient(135deg, ${C.indigo}, ${C.violet}); color: #fff; font-weight: 600; cursor: pointer; transition: opacity .15s, transform .15s, width .2s; white-space: nowrap; overflow: hidden; box-shadow: 0 6px 14px -6px ${C.indigo}; }
  .np-back:hover { opacity: 0.92; transform: translateX(-1px); }
  .np-sidebar { flex: none; padding: 20px 14px; background: #eceef9; border-right: 1px solid ${C.line}; display: flex; flex-direction: column; gap: 4px; transition: width .22s ease, padding .22s ease; }

  /* Data Table Notion-style */
  .np-tab { height: 36px; padding: 0 14px; border-radius: 9px; border: 1px solid transparent; background: transparent; color: ${C.muted}; font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all .15s; white-space: nowrap; }
  .np-tab:hover { background: #fff; color: ${C.ink}; }
  .np-tab.active { background: #fff; color: ${C.indigo}; font-weight: 600; border-color: ${C.line}; box-shadow: 0 2px 6px rgba(27,32,56,0.05); }
  .np-notion-wrap { width: 100%; overflow-x: auto; border: 1px solid ${C.line}; border-radius: 11px; background: #fff; }
  .np-notion-table { width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; }
  .np-notion-table th { background: ${C.field}; color: ${C.muted}; font-weight: 600; font-size: 13px; padding: 0; border-bottom: 1px solid ${C.line}; border-right: 1px solid ${C.line}; min-width: 140px; }
  .np-notion-table th:last-child { border-right: 0; }
  .np-notion-table td { padding: 0; border-bottom: 1px solid ${C.line}; border-right: 1px solid ${C.line}; }
  .np-notion-table td:last-child { border-right: 0; }
  .np-notion-table tr:last-child td { border-bottom: 0; }
  .np-notion-table tr:hover td { background: #fbfcff; }
  .np-cell-input { width: 100%; height: 38px; padding: 0 12px; border: 0; background: transparent; font-size: 14px; color: ${C.ink}; transition: background .12s, box-shadow .12s; }
  .np-cell-input:focus { outline: none; background: #fff; box-shadow: inset 0 0 0 2px ${C.indigo}; }
  .np-th-input { width: 100%; height: 38px; padding: 0 12px; border: 0; background: transparent; font-size: 13px; font-weight: 600; color: ${C.text}; }
  .np-th-input:focus { outline: none; background: #fff; box-shadow: inset 0 0 0 2px ${C.indigo}; }
  .np-th-wrap { display: flex; align-items: center; justify-content: space-between; width: 100%; }
  .np-th-wrap .np-th-input { flex: 1; min-width: 0; padding-right: 4px; }
  .np-col-del { border: 0; background: transparent; color: ${C.muted}; cursor: pointer; width: 24px; height: 24px; margin-right: 6px; border-radius: 6px; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; font-size: 15px; line-height: 1; opacity: 0.45; transition: opacity .15s, background .15s, color .15s; }
  .np-notion-table th:hover .np-col-del, .np-notion-table th:focus-within .np-col-del { opacity: 1; }
  .np-col-del:hover { background: #fde8e8; color: ${C.coral}; opacity: 1; }
  .np-row-add { width: 100%; padding: 9px 14px; border: 0; border-top: 1px solid ${C.line}; background: ${C.field}; color: ${C.muted}; font-size: 13px; font-weight: 500; text-align: left; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background .15s, color .15s; }
  .np-row-add:hover { background: ${C.indigoSoft}; color: ${C.indigo}; }
  .np-badge-doc { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; border: 1px solid ${C.line}; background: ${C.field}; color: ${C.text}; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all .15s; }
  .np-badge-doc:hover { border-color: #c9caf3; background: ${C.indigoSoft}; color: ${C.indigo}; }
  .np-note-drawer { flex: none; background: #eceef9; overflow: hidden; display: flex; flex-direction: column; transition: width .24s cubic-bezier(0.4, 0, 0.2, 1), border-color .24s ease; }
  .np-note-card { background: #ffffff; border: 1px solid ${C.line}; border-radius: 12px; padding: 14px; transition: border-color .15s, box-shadow .15s; }
  .np-note-card:focus-within { border-color: #c9caf3; box-shadow: 0 4px 14px -6px rgba(79, 82, 217, 0.16); }
  .np-note-ghost-input { width: 100%; border: 0; background: transparent; padding: 2px 4px; border-radius: 6px; transition: background .15s; }
  .np-note-ghost-input:hover { background: ${C.field}; }
  .np-note-ghost-input:focus { outline: none; background: ${C.field}; box-shadow: inset 0 0 0 1.5px ${C.indigo}; }

  /* Mathematics Flow */
  .np-select-btn { height: 32px; padding: 0 10px; border: 1px solid ${C.line}; border-radius: 9px; background: #fff; color: ${C.ink}; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
  .np-select-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }
  .np-tag { display: inline-block; padding: 2px 8px; border: 1px solid; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; white-space: nowrap; }
  .np-table-wrap { width: 100%; overflow-x: auto; border: 1px solid ${C.line}; border-radius: 11px; background: #fff; }
  .np-table { width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; }
  .np-table th { background: ${C.field}; color: ${C.muted}; font-weight: 600; font-size: 13px; padding: 10px 12px; border-bottom: 1px solid ${C.line}; border-right: 1px solid ${C.line}; white-space: nowrap; }
  .np-table td { padding: 0; border-bottom: 1px solid ${C.line}; border-right: 1px solid ${C.line}; }
  .np-table th:last-child, .np-table td:last-child { border-right: 0; }
  .np-table tr:last-child td { border-bottom: 0; }
  .np-table tr:hover td { background: ${C.field}; }
  .np-table tr.selected td { background: ${C.indigoSoft}; }
  .np-flow { width: 100%; max-width: 520px; }
  .np-flow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 16px; width: 100%; max-width: 680px; }
  .np-node { background: #fff; border: 1px solid ${C.line}; border-radius: 12px; padding: 12px 16px; transition: border-color .15s, box-shadow .15s, background .15s; cursor: pointer; }
  .np-node:hover { border-color: ${C.indigo}; }
  .np-node.drop-ready { border-style: dashed; border-color: ${C.indigo}; background: #f4f5ff; }
  .np-node.drop-over { border-style: solid; border-color: ${C.coral}; background: #fff5f5; box-shadow: 0 0 0 3px rgba(240, 82, 79, 0.16); }
  .np-side-sec { display: flex; flex-direction: column; min-height: 0; overflow-y: auto; padding: 16px; transition: flex .2s ease; }
  .np-side-sec + .np-side-sec { border-top: 1px solid ${C.line}; }
  .np-var { padding: 10px 12px; border: 1px solid ${C.line}; border-radius: 11px; background: ${C.field}; cursor: grab; user-select: none; transition: border-color .15s, background .15s, transform .15s, box-shadow .15s; }
  .np-var:hover { border-color: #c9caf3; background: #fff; box-shadow: 0 4px 12px -6px rgba(27, 32, 56, 0.25); transform: translateY(-1px); }
  .np-var.dragging { opacity: 0.55; border-style: dashed; border-color: ${C.indigo}; }
  .np-fcard { width: 100%; padding: 11px 13px; text-align: left; border: 1px solid ${C.line}; border-radius: 11px; background: #fff; color: ${C.ink}; cursor: pointer; transition: background .15s, border-color .15s; }
  .np-fcard:hover { background: ${C.field}; border-color: #c9caf3; }
  .np-fcard[aria-pressed="true"] { background: ${C.indigoSoft}; border-color: ${C.indigo}; color: ${C.indigo}; }
  .np-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(27, 32, 56, 0.45); backdrop-filter: blur(2px); }
  .np-modal { width: 100%; padding: 22px; border: 1px solid ${C.line}; border-radius: 14px; background: #fff; box-shadow: 0 20px 44px -12px rgba(27,32,56,0.28); }
  .np-two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  /* Goal Tree Step 1 */
  .np-edit-info-btn { display: inline-flex; flex-direction: column; align-items: center; gap: 5px; padding: 6px 10px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: ${C.ink}; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
  .np-edit-info-btn:hover { background: #f4f6fc; border-color: ${C.line}; }
  .np-edit-info-badge { width: 54px; height: 18px; border-radius: 4px; background: #8c92a4; display: inline-flex; align-items: center; justify-content: center; transition: background 0.15s ease; }
  .np-edit-info-btn:hover .np-edit-info-badge { background: ${C.indigo}; }
  .np-bottom { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: stretch; gap: 32px; width: 100%; max-width: 980px; margin: 0 auto; }
  .np-bottom-card { background: ${C.panel}; border: 1px solid ${C.lineAlt}; border-radius: 12px; padding: 24px 26px; min-height: 380px; display: flex; flex-direction: column; justify-content: space-between; }
  .np-tree-viewport { width: 100%; overflow-x: auto; overflow-y: hidden; cursor: grab; user-select: none; border-radius: 10px; padding-bottom: 6px; }
  .np-tree-viewport.is-dragging { cursor: grabbing; }
  .np-tree-scroll { margin-top: 12px; max-height: 290px; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 10px; }
  .np-tree-row { display: flex; align-items: center; gap: 6px; padding: 5px 8px; border-radius: 9px; border: 1px solid ${C.lineAlt}; background: #ffffff; transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease; }
  .np-tree-row:hover { border-color: #c5cde8; }
  .np-tree-row.is-selected { border-color: ${C.indigo}; box-shadow: 0 0 0 2px rgba(79, 82, 217, 0.12); }
  .np-mini-icon { width: 22px; height: 22px; border-radius: 6px; border: none; background: transparent; color: ${C.muted}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0; }
  .np-mini-icon:hover { background: #f4f6fc; color: ${C.ink}; }
  .np-role-pill { display: inline-flex; align-items: center; justify-content: center; gap: 4px; height: 24px; padding: 0 8px; border-radius: 999px; border: 1px solid ${C.lineAlt}; background: #f7f8fc; color: ${C.muted}; font-size: 11.5px; font-weight: 600; white-space: nowrap; cursor: pointer; flex-shrink: 0; transition: all 0.15s ease; }
  .np-role-pill:hover { border-color: #c6cde6; color: ${C.ink}; }
  .np-role-pill.is-core { background: ${C.tealSoft}; border-color: #a4e4de; color: #0b8579; }
  .np-row-input { flex: 1; min-width: 60px; border: none; background: transparent; color: ${C.ink}; font-size: 13px; font-weight: 500; padding: 3px 4px; outline: none; }
  .np-add-circle-btn { width: 22px; height: 22px; border-radius: 999px; border: 1px solid #cfd5ee; background: #f7f8fc; color: ${C.indigo}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0; transition: all 0.14s ease; }
  .np-add-circle-btn:hover { background: ${C.indigo}; border-color: ${C.indigo}; color: #ffffff; }
  .np-del-btn { width: 22px; height: 22px; border-radius: 6px; border: none; background: transparent; color: ${C.muted}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; padding: 0; transition: all 0.14s ease; }
  .np-del-btn:hover { background: ${C.coralSoft}; color: ${C.coral}; }
  @media (max-width: 920px) { .np-bottom { grid-template-columns: 1fr; max-width: 560px; gap: 20px; } .np-bottom-card { min-height: auto; } }

  /* Goal Tree Step 2 & 3 (.og) */
  .og { color: ${C.text}; -webkit-font-smoothing: antialiased; height: 100vh; overflow: hidden; }
  @media (max-width: 860px) { .og { height: auto; min-height: 100vh; overflow: visible; } }
  .og-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 34px; padding: 0 12px; border-radius: 10px; border: 1px solid ${C.lineAlt}; background: ${C.card}; color: ${C.ink}; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
  .og-btn:hover { background: #f5f7fc; border-color: #cfd5ea; }
  .og-btn[aria-checked="true"] { background: ${C.indigoSoft}; border-color: ${C.indigo}; color: ${C.indigo}; }
  .og-stage-tab { display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 12px; border-radius: 999px; border: 1px solid ${C.lineAlt}; background: #fff; color: ${C.muted}; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
  .og-stage-tab:hover { border-color: #c5cde8; color: ${C.ink}; }
  .og-stage-tab.is-active { background: ${C.indigo}; border-color: ${C.indigo}; color: #ffffff; }
  .og-input { width: 100%; height: 36px; padding: 0 11px; border: 1px solid ${C.lineAlt}; border-radius: 9px; background: #ffffff; color: ${C.ink}; font-size: 13.5px; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
  textarea.og-input { height: auto; min-height: 52px; padding: 7px 11px; resize: vertical; line-height: 1.4; }
  .og-input:focus { outline: none; border-color: ${C.indigo}; box-shadow: 0 0 0 3px rgba(79, 82, 217, 0.12); }
  .og-workspace { display: flex; flex-direction: column; gap: 14px; height: 100%; min-height: 0; }
  .og-tree-section { background: ${C.card}; border: 1px solid ${C.lineAlt}; border-radius: 14px; padding: 12px 18px 14px; flex: 0 0 auto; display: flex; flex-direction: column; }
  .og-tree-scroll { width: 100%; overflow-x: auto; overflow-y: hidden; padding: 6px 4px; }
  .og-bottom-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; flex: 1 1 auto; min-height: 0; }
  @media (max-width: 860px) { .og-bottom-grid { grid-template-columns: 1fr; } }
  .og-side-panel { background: ${C.panel}; border: 1px solid ${C.lineAlt}; border-radius: 12px; padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 10px; min-height: 0; height: 100%; }
  .og-step2-scroll { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 10px; }
  .og-goal-card { background: #ffffff; border: 1px solid ${C.lineAlt}; border-radius: 11px; padding: 12px 14px; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
  .og-goal-card.is-selected { border-color: ${C.indigo}; box-shadow: 0 0 0 2px rgba(79, 82, 217, 0.12); }
  .og-svg-node { cursor: pointer; }
  .og-svg-node:hover rect { fill: ${C.indigoSoft}; }

  /* Calendar Screen */
  .np-sg-pill { width: 100%; max-width: 340px; min-height: 38px; flex: none; padding: 0 14px; border-radius: 999px; border: 1.5px solid ${C.line}; background: #f4f5fb; color: ${C.ink}; font-weight: 600; font-size: 13.5px; cursor: grab; transition: all .16s ease; display: flex; align-items: center; justify-content: space-between; user-select: none; }
  .np-sg-pill:hover { border-color: #b8baf2; background: ${C.indigoSoft}; color: ${C.indigo}; transform: translateY(-1px); }
  .np-sg-pill[aria-pressed="true"] { background: ${C.indigoSoft}; border-color: ${C.indigo}; color: ${C.indigo}; box-shadow: 0 4px 12px -4px rgba(79,82,217,0.32); }
  .np-sg-pill.dragging { opacity: 0.55; transform: scale(0.98); }
  .np-add-sg { width: 100%; max-width: 340px; height: 34px; flex: none; border-radius: 999px; border: 1.5px dashed #b9baf0; background: #fff; color: ${C.indigo}; font-weight: 600; font-size: 12.5px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; transition: all .15s ease; }
  .np-add-sg:hover { background: ${C.indigoSoft}; border-style: solid; border-color: ${C.indigo}; }
  .np-save { height: 34px; padding: 0 16px; border: 1px solid ${C.indigo}; border-radius: 9px; background: ${C.indigo}; color: #fff; font-weight: 600; font-size: 13px; cursor: pointer; box-shadow: 0 6px 14px -6px ${C.indigo}; transition: background .15s; }
  .np-save:hover { background: #4144c4; }
  .np-sg-save { height: 30px; padding: 0 12px; border: 1px solid ${C.teal}; border-radius: 8px; background: ${C.teal}; color: #fff; font-weight: 600; font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; transition: all .15s; box-shadow: 0 4px 10px -4px rgba(15,168,154,0.45); }
  .np-sg-save:disabled { background: #e3e6f1; border-color: #d5d9ee; color: ${C.muted}; cursor: default; box-shadow: none; }
  .np-opt-toggle { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; border: 1px dashed #c9caf3; border-radius: 9px; background: ${C.field}; color: ${C.ink}; font-weight: 600; font-size: 13px; cursor: pointer; transition: all .15s ease; }
  .np-opt-toggle:hover, .np-opt-toggle[aria-expanded="true"] { background: ${C.indigoSoft}; border-color: ${C.indigo}; }
  .np-cal-back-btn { width: 36px; height: 36px; border: 0; border-radius: 10px; background: linear-gradient(135deg, ${C.indigo}, ${C.violet}); color: #fff; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex: none; box-shadow: 0 6px 14px -6px ${C.indigo}; }
  .np-toggle-btn { width: 30px; height: 30px; border: 1px solid #d5d9ee; border-radius: 8px; background: #fff; color: ${C.muted}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; flex: none; }
  .np-mini-action { width: 22px; height: 22px; border: 0; border-radius: 999px; background: transparent; color: ${C.muted}; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; }
  .np-mini-action:hover { background: rgba(27,32,56,0.08); color: ${C.ink}; }
  .np-mini-action.danger:hover { background: #fdeaea; color: ${C.coral}; }

  /* Docs 4-column */
  .np-docs-sidebar { width: clamp(104px, 11vw, 152px); flex: none; padding: clamp(12px, 1.4vw, 20px) clamp(8px, 1vw, 12px); background: #ffffff; border-right: 1px solid ${C.line}; display: flex; flex-direction: column; align-items: stretch; gap: 10px; }
  .np-columns { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); flex: 1; min-width: 0; height: 100%; overflow: hidden; }
  .np-col { display: flex; flex-direction: column; min-width: 0; height: 100%; overflow-y: auto; padding: clamp(12px, 1.4vw, 20px) clamp(8px, 1.1vw, 14px) 24px; border-right: 1px solid ${C.line}; gap: 12px; }
  .np-col:last-child { border-right: none; }
  .np-banner { padding: clamp(6px, 0.7vw, 8px) clamp(8px, 0.9vw, 12px); font-size: clamp(12px, 1.05vw, 14px); }
  .np-new-note-btn { flex: none; height: 22px; padding: 0 7px; border: 1px solid rgba(255, 255, 255, 0.22); border-radius: 5px; background: rgba(255, 255, 255, 0.12); color: #ffffff; font-size: 11px; font-weight: 600; cursor: pointer; }
  .np-new-note-btn:hover { background: rgba(255, 255, 255, 0.24); }
  .np-note-bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px; background: #ffffff; border: 1px solid ${C.line}; border-left: 3.5px solid ${C.indigo}; border-radius: 8px; cursor: pointer; box-shadow: 0 1px 4px rgba(27, 32, 56, 0.05); }
  .np-note-bar:hover { border-color: #c5c9e6; transform: translateY(-1px); }
  .np-note-bar-title { font-size: 13px; font-weight: 600; color: ${C.ink}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .np-note-del { flex: none; width: 20px; height: 20px; border: 0; border-radius: 5px; background: transparent; color: ${C.muted}; font-size: 15px; cursor: pointer; }
  .np-note-del:hover { background: ${C.coralSoft}; color: ${C.coral}; }
  .np-modal-title-input { width: 100%; border: 0; outline: none; font-size: 17px; font-weight: 700; color: ${C.ink}; padding: 14px 18px 8px; background: transparent; }
  .np-modal-body-input { width: 100%; min-height: 150px; border: 0; outline: none; resize: vertical; font-size: 14.5px; line-height: 1.6; color: ${C.text}; padding: 6px 18px 16px; background: transparent; }

  /* Widget Suite */
  .np-wtab { flex: 1; height: 44px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: ${C.muted}; font-weight: 500; cursor: pointer; transition: color .15s, background .15s; }
  .np-wtab:hover { background: ${C.field}; color: ${C.ink}; }
  .np-wtab[aria-selected="true"] { color: ${C.indigo}; font-weight: 600; border-bottom-color: ${C.indigo}; }
  .np-check { display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border: 1px solid ${C.line}; border-radius: 10px; background: ${C.field}; }
  .np-check input { width: 18px; height: 18px; margin: 0; accent-color: ${C.indigo}; cursor: pointer; flex: none; }
  .np-radio-card { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 0 12px; border: 1px solid ${C.line}; border-radius: 10px; background: ${C.field}; cursor: pointer; }
  .np-radio-card input { width: 18px; height: 18px; margin: 0; accent-color: ${C.indigo}; cursor: pointer; flex: none; }
  .np-goal-text { flex: 1; text-align: left; border: 0; background: transparent; padding: 8px 0; cursor: pointer; }
  .np-goal-text:hover { color: ${C.indigo} !important; text-decoration: underline !important; }
  .np-data-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 46px; padding: 10px 14px; border: 1px solid ${C.line}; border-radius: 10px; background: ${C.field}; text-align: left; cursor: pointer; }
  .np-data-row:hover { border-color: #c9caf3; background: #fff; color: ${C.indigo}; }
  .np-wback-btn { display: inline-flex; align-items: center; gap: 6px; height: 32px; padding: 0 10px; border: 1px solid ${C.line}; border-radius: 8px; background: ${C.field}; color: ${C.text}; font-size: 13px; font-weight: 600; cursor: pointer; }
  .np-wback-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }

  /* Unified Popup Segmented Control */
  .np-seg { display: inline-flex; align-items: center; gap: 2px; padding: 3px; border-radius: 9px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); }
  .np-seg-btn { height: 28px; padding: 0 12px; border: 0; border-radius: 6px; background: transparent; color: rgba(255,255,255,0.72); font-size: 13px; font-weight: 500; cursor: pointer; }
  .np-seg-btn[aria-pressed="true"] { background: #fff; color: ${C.ink}; font-weight: 600; }
  .np-cards-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: start; width: 100%; max-width: 1080px; }
  .np-cards-grid.single { grid-template-columns: minmax(0, 1fr); max-width: 520px; }
  @media (max-width: 920px) { .np-cards-grid { grid-template-columns: minmax(0, 1fr); max-width: 520px; } }
`;

/* ============================================================================
   3. CÁC TIỆN ÍCH & COMPONENT DÙNG CHUNG
   ============================================================================ */
const Icon = ({ d, size = 18, stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const Square = ({ color = C.indigo }) => (
  <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: color, display: "inline-block", flex: "none" }} />
);

const Bar = ({ value, color = C.indigo, height = 8, label }) => (
  <div role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} style={{ height, borderRadius: height, background: C.line, overflow: "hidden" }}>
    <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: "100%", borderRadius: height, background: color, transition: "width .2s" }} />
  </div>
);

const Card = ({ title, color, action, children, style, onClick }) => (
  <section className="np-card" style={{ ...style, cursor: onClick ? "pointer" : undefined }} onClick={onClick}>
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

const WORKSPACE_NAV = [
  { key: "current", name: "Current Project", d: ["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"] },
  { key: "table", name: "Bảng dữ liệu", d: ["M3 5h18v14H3z", "M3 10h18M9 5v14"] },
  { key: "math", name: "Trang tính toán", d: ["M5 3h14v18H5z", "M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"] },
  { key: "docs", name: "Docs", d: ["M7 3h8l4 4v14H7z", "M15 3v4h4M10 12h6M10 16h6"] },
];

/* ============================================================================
   4. MÀN HÌNH 1: HOME SCREEN (1_homescreen_preview.tsx)
   ============================================================================ */
function HomeScreen({
  projects,
  isProjectsUnlocked,
  onToggleUnlock,
  onCreateNewProject,
  onSelectProject,
  onOpenCalendar,
  onOpenWidget,
}) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [projName, setProjName] = useState("");
  const [projGoal, setProjGoal] = useState("");
  const [projColor, setProjColor] = useState(C.indigo);

  const visibleProjects = isProjectsUnlocked ? projects : [];

  const handleSubmitNew = (e) => {
    e.preventDefault();
    const cleanName = projName.trim() || `Project ${projects.length + 1}`;
    onCreateNewProject({
      name: cleanName,
      goal: projGoal.trim(),
      color: projColor,
    });
    setProjName("");
    setProjGoal("");
    setShowNewModal(false);
  };

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", background: C.page }}>
      <header style={{ flex: "none", height: 48, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", fontWeight: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
          Home
        </div>

        <button
          type="button"
          onClick={onToggleUnlock}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#e3e6f1",
            borderRadius: 8,
            padding: "4px 10px",
            fontSize: 12,
            cursor: "pointer",
          }}
          title="Chuyển trạng thái điều kiện hiển thị dự án mẫu"
        >
          Điều kiện dự án: {isProjectsUnlocked ? "Đang bật" : "Đang ẩn"}
        </button>
      </header>

      <main style={{ flex: 1, overflowY: "auto", padding: "32px 24px 56px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink }}>Không gian dự án</h1>
              <p className="np-note" style={{ margin: "4px 0 0" }}>Chọn một dự án đang chạy hoặc khởi tạo dự án mới</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="np-btn" onClick={onOpenWidget}>
                <span style={{ color: C.amber, display: "inline-flex" }}>
                  <Icon d={["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"]} />
                </span>
                Widget
              </button>
              <button className="np-btn" onClick={onOpenCalendar}>
                <span style={{ color: C.violet, display: "inline-flex" }}>
                  <Icon d={["M3 5h18v16H3z", "M3 10h18M8 3v4M16 3v4"]} />
                </span>
                Calendar
              </button>
            </div>
          </div>

          <Card title="Thông tin" color={C.teal} style={{ marginBottom: 16 }}>
            <div className="np-grid">
              <div className="np-stat np-stat-row">
                <span style={{ color: C.muted }}>Dự án đang mở</span>
                <b style={{ color: C.ink }}>{visibleProjects.length} dự án</b>
              </div>
              <div className="np-stat np-stat-row">
                <span style={{ color: C.muted }}>Chuỗi kỷ luật cao nhất</span>
                <b style={{ color: C.teal }}>5 ngày</b>
              </div>
            </div>
          </Card>

          <Card title="Danh sách dự án" color={C.indigo}>
            <div className="np-grid-3">
              <button className="np-tile new" onClick={() => setShowNewModal(true)}>
                <span className="np-plus"><Icon d={["M12 6v12M6 12h12"]} /></span>
                New project
              </button>

              {visibleProjects.map((p) => (
                <button key={p.id} className="np-tile" onClick={() => onSelectProject(p)}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 600, color: C.ink }}>
                        <span style={{ width: 9, height: 9, borderRadius: "50%", background: p.color }} />
                        {p.name}
                      </span>
                      <span className="np-chip">{p.updated}</span>
                    </div>
                    <div className="np-note">{p.stage}</div>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <div className="np-note" style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span>Tiến độ</span>
                      <b style={{ color: p.color }}>{p.progress}%</b>
                    </div>
                    <Bar value={p.progress} color={p.color} height={7} label={`Tiến độ ${p.name}`} />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </main>

      {showNewModal && (
        <div className="np-overlay" role="dialog" aria-modal="true" onClick={() => setShowNewModal(false)}>
          <form className="np-modal" style={{ maxWidth: 440 }} onSubmit={handleSubmitNew} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 700, color: C.ink }}>Khởi tạo dự án mới</h2>
            <p className="np-note" style={{ margin: "0 0 16px" }}>
              Bước 1: Nhập ý tưởng khởi nguồn tại <b>Nascent Project</b>, sau đó bấm <b>Vẽ goal tree</b> để thiết lập các chặng.
            </p>
            <div style={{ marginBottom: 14 }}>
              <label className="np-label" htmlFor="new-proj-name">Tên dự án</label>
              <input
                id="new-proj-name"
                className="np-input"
                placeholder={`Project ${projects.length + 1}`}
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="np-label" htmlFor="new-proj-goal">Mục tiêu cuối cùng (tùy chọn)</label>
              <input
                id="new-proj-goal"
                className="np-input"
                placeholder="Ví dụ: Đạt chứng chỉ chuyên môn..."
                value={projGoal}
                onChange={(e) => setProjGoal(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <span className="np-label">Màu nhận diện</span>
              <div style={{ display: "flex", gap: 10 }}>
                {[C.indigo, C.teal, C.violet, C.amber, C.coral].map((clr) => (
                  <button
                    type="button"
                    key={clr}
                    onClick={() => setProjColor(clr)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      border: projColor === clr ? `3px solid ${C.ink}` : "2px solid transparent",
                      background: clr,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="np-btn" onClick={() => setShowNewModal(false)}>Hủy</button>
              <button type="submit" className="np-btn primary">Tiếp tục tới Nascent Project →</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   4B. MÀN HÌNH NASCENT PROJECT (2_nascent_project_2.tsx) - LUỒNG ĐẦU TIÊN KHI TẠO NEW PROJECT
   ============================================================================ */
const NASCENT_NAV = [
  { key: "nascent", name: "Nascent project", d: ["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"] },
  { key: "table", name: "Bảng dữ liệu", d: ["M3 5h18v14H3z", "M3 10h18M9 5v14"] },
  { key: "math", name: "Trang tính toán", d: ["M5 3h14v18H5z", "M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"] },
  { key: "docs", name: "Docs", d: ["M7 3h8l4 4v14H7z", "M15 3v4h4M10 12h6M10 16h6"] },
];

const OutlinerField = ({ label, id, multiline, value, onChange }) => {
  const editorRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const historyRef = useRef({
    stack: [value || ""],
    index: 0,
    lastPushTime: 0,
  });
  const [historyMeta, setHistoryMeta] = useState({ canUndo: false, canRedo: false });

  const syncHistoryMeta = () => {
    const h = historyRef.current;
    setHistoryMeta({
      canUndo: h.index > 0,
      canRedo: h.index < h.stack.length - 1,
    });
  };

  const recordSnapshot = (html, forceNewEntry = false) => {
    const h = historyRef.current;
    const now = Date.now();
    if (h.stack[h.index] === html) return;

    if (!forceNewEntry && h.index > 0 && now - h.lastPushTime < 450) {
      h.stack[h.index] = html;
    } else {
      h.stack = h.stack.slice(0, h.index + 1);
      h.stack.push(html);
      if (h.stack.length > 100) h.stack.shift();
      h.index = h.stack.length - 1;
    }
    h.lastPushTime = now;
    syncHistoryMeta();
  };

  const placeCaretAtEnd = (el) => {
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const applyUndo = () => {
    const h = historyRef.current;
    if (h.index <= 0) return;
    h.index -= 1;
    const prevHtml = h.stack[h.index];
    if (editorRef.current) {
      editorRef.current.innerHTML = prevHtml;
      placeCaretAtEnd(editorRef.current);
    }
    onChange(id, prevHtml);
    syncHistoryMeta();
  };

  const applyRedo = () => {
    const h = historyRef.current;
    if (h.index >= h.stack.length - 1) return;
    h.index += 1;
    const nextHtml = h.stack[h.index];
    if (editorRef.current) {
      editorRef.current.innerHTML = nextHtml;
      placeCaretAtEnd(editorRef.current);
    }
    onChange(id, nextHtml);
    syncHistoryMeta();
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = (forceHistory = false) => {
    if (!editorRef.current) return;
    if (editorRef.current.innerHTML === "<br>") {
      editorRef.current.innerHTML = "";
    }
    const html = editorRef.current.innerHTML;
    recordSnapshot(html, forceHistory);
    onChange(id, html);
  };

  const execCommandAndRecord = (cmd) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(cmd, false, null);
    emitChange(true);
  };

  const handleInput = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const node = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        const textBefore = node.textContent.slice(0, range.startOffset);
        if (/^[-*]\s$/.test(textBefore)) {
          const delRange = document.createRange();
          delRange.setStart(node, 0);
          delRange.setEnd(node, range.startOffset);
          sel.removeAllRanges();
          sel.addRange(delRange);
          document.execCommand("delete", false, null);
          document.execCommand("insertUnorderedList", false, null);
          emitChange(true);
          return;
        }
      }
    }
    emitChange(false);
  };

  const handleKeyDown = (e) => {
    const isMod = e.ctrlKey || e.metaKey;

    if (isMod && !e.shiftKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      applyUndo();
      return;
    }

    if (
      (isMod && e.key.toLowerCase() === "y") ||
      (isMod && e.shiftKey && e.key.toLowerCase() === "z")
    ) {
      e.preventDefault();
      applyRedo();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      if (!document.queryCommandState("insertUnorderedList") && !e.shiftKey) {
        document.execCommand("insertUnorderedList", false, null);
      }
      document.execCommand(e.shiftKey ? "outdent" : "indent", false, null);
      emitChange(true);
      return;
    }

    if (e.key === "Enter") {
      requestAnimationFrame(() => emitChange(true));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emitChange(true);
  };

  return (
    <div className="np-field" style={{ marginBottom: 14 }}>
      <div className="np-field-head">
        <label htmlFor={id} onClick={() => editorRef.current?.focus()}>
          {label}
        </label>

        {focused && (
          <div
            className="np-toolbar"
            onMouseDown={(e) => e.preventDefault()}
            role="toolbar"
            aria-label={`Công cụ định dạng cho ${label}`}
          >
            <button
              type="button"
              className="np-tool-btn"
              title="Gạch đầu dòng (gõ '- ' ở đầu dòng)"
              onClick={() => execCommandAndRecord("insertUnorderedList")}
            >
              <Icon size={14} d={["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"]} />
            </button>
            <button
              type="button"
              className="np-tool-btn"
              title="Thụt vào cấp con (Tab)"
              onClick={() => {
                if (!document.queryCommandState("insertUnorderedList")) {
                  document.execCommand("insertUnorderedList", false, null);
                }
                execCommandAndRecord("indent");
              }}
            >
              <Icon size={14} d={["M3 6h18", "M11 12h10", "M11 18h10", "M3 9l4 3-4 3"]} />
            </button>
            <button
              type="button"
              className="np-tool-btn"
              title="Thụt ra ngoài (Shift + Tab)"
              onClick={() => execCommandAndRecord("outdent")}
            >
              <Icon size={14} d={["M3 6h18", "M11 12h10", "M11 18h10", "M7 9l-4 3 4 3"]} />
            </button>
            <span className="np-tool-sep" />
            <button
              type="button"
              className="np-tool-btn"
              title="Hoàn tác (Ctrl + Z)"
              disabled={!historyMeta.canUndo}
              onClick={applyUndo}
            >
              <Icon size={14} d={["M9 14L4 9l5-5", "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"]} />
            </button>
            <button
              type="button"
              className="np-tool-btn"
              title="Làm lại (Ctrl + Y)"
              disabled={!historyMeta.canRedo}
              onClick={applyRedo}
            >
              <Icon size={14} d={["M15 14l5-5-5-5", "M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"]} />
            </button>
          </div>
        )}
      </div>

      <div
        id={id}
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-label={label}
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Nhập nội dung... (Enter xuống dòng, gõ '- ' tạo gạch đầu dòng, Tab thụt cấp)"
        className={`np-editor${multiline ? " multiline" : ""}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </div>
  );
};

const NascentCard = ({ title, color, children, style }) => (
  <section
    style={{
      background: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: 14,
      padding: "18px 20px 6px",
      ...style,
    }}
  >
    <h3
      style={{
        display: "flex", alignItems: "center", gap: 10,
        margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: C.ink,
      }}
    >
      <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
      {title}
    </h3>
    {children}
  </section>
);

function NascentProjectScreen({
  project,
  formValues,
  setFormValues,
  onBackHome,
  onSwitchWorkspaceTab,
  onDrawGoalTree,
}) {
  const [activeNav, setActiveNav] = useState("nascent");

  const handleFieldChange = (id, val) => {
    setFormValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleNavClick = (item) => {
    setActiveNav(item.key);
    if (item.key !== "nascent") {
      onSwitchWorkspaceTab(item.key);
    }
  };

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", background: C.page }}>
      {/* Thanh tiêu đề */}
      <header
        style={{
          flex: "none", height: 48, background: C.ink, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", gap: 10, fontWeight: 600, fontSize: 15,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: project?.color || C.amber }} />
          <span>Nascent Project — {project?.name || "Dự án mới"}</span>
        </div>
        <span style={{ fontSize: 12.5, color: "#cbd0e6", fontWeight: 500 }}>
          Bước 1/2 · Khởi tạo ý tưởng & Rủi ro
        </span>
      </header>

      <div className="np-nascent-shell" style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Thanh bên */}
        <nav
          className="np-nascent-sidebar"
          aria-label="Điều hướng dự án"
          style={{
            flex: "none", width: 248, padding: "20px 14px", background: "#eceef9",
            borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 4,
          }}
        >
          <button
            type="button"
            className="np-back"
            onClick={onBackHome}
            title="Quay lại Home"
            style={{ width: "100%", padding: "0 14px", marginBottom: 18 }}
          >
            <Icon d={["M19 12H5", "M11 6l-6 6 6 6"]} size={17} stroke="#fff" />
            <span>Quay lại Home</span>
          </button>

          {NASCENT_NAV.map((n) => (
            <button
              key={n.key}
              className="np-nav"
              aria-current={activeNav === n.key ? "page" : undefined}
              onClick={() => handleNavClick(n)}
            >
              <Icon d={n.d} />
              {n.name}
            </button>
          ))}
        </nav>

        {/* Nội dung chính */}
        <main className="np-nascent-main" style={{ flex: 1, overflowY: "auto", padding: "36px 48px 56px" }}>
          <div style={{ maxWidth: 920 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>
                  Form — Khởi tạo dự án
                </h1>
                <p className="np-note" style={{ margin: "4px 0 0" }}>
                  Trình soạn thảo hỗ trợ gạch đầu dòng phân cấp (gõ <b>- </b>, nhấn <b>Tab</b> thụt cấp, <b>Ctrl+Z / Ctrl+Y</b>).
                </p>
              </div>
            </div>

            {/* Final goal */}
            <NascentCard title="Final goal" color={C.indigo} style={{ marginBottom: 16 }}>
              <OutlinerField
                id="dat-duoc"
                label="Đạt được"
                value={formValues["dat-duoc"]}
                onChange={handleFieldChange}
              />
            </NascentCard>

            {/* Điểm cuối */}
            <p style={{ margin: "28px 0 12px", fontSize: 17, fontWeight: 600, color: C.ink }}>
              Điểm cuối – hoàn thành Goal
            </p>

            <div className="np-grid">
              <NascentCard title="Conditions" color={C.teal}>
                <OutlinerField
                  id="ban-than"
                  label="Bản thân"
                  value={formValues["ban-than"]}
                  onChange={handleFieldChange}
                />
                <OutlinerField
                  id="gia-tri"
                  label="Giá trị"
                  value={formValues["gia-tri"]}
                  onChange={handleFieldChange}
                />
                <OutlinerField
                  id="lich-trinh"
                  label="Lịch trình"
                  value={formValues["lich-trinh"]}
                  onChange={handleFieldChange}
                />
              </NascentCard>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <NascentCard title="Nền tảng hiện tại" color={C.violet}>
                  <OutlinerField
                    id="ngoai"
                    label="Ngoài"
                    value={formValues["ngoai"]}
                    onChange={handleFieldChange}
                  />
                  <OutlinerField
                    id="trong"
                    label="Trong"
                    value={formValues["trong"]}
                    onChange={handleFieldChange}
                  />
                </NascentCard>
                <NascentCard title="Đánh giá rủi ro" color={C.coral}>
                  <OutlinerField
                    id="khong-lam"
                    label="Không làm – mất"
                    value={formValues["khong-lam"]}
                    onChange={handleFieldChange}
                  />
                  <OutlinerField
                    id="that-bai"
                    label="Thất bại – mất"
                    value={formValues["that-bai"]}
                    onChange={handleFieldChange}
                  />
                </NascentCard>
              </div>

              <NascentCard title="Lý do ban đầu làm project" color={C.amber} style={{ gridColumn: "1 / -1" }}>
                <OutlinerField
                  id="ly-do"
                  label="Vì sao bạn bắt đầu project này?"
                  multiline
                  value={formValues["ly-do"]}
                  onChange={handleFieldChange}
                />
              </NascentCard>
            </div>

            {/* Hành động chuyển tiếp sang Goal Tree */}
            <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <button className="np-btn primary" style={{ height: 44, padding: "0 22px" }} onClick={() => onDrawGoalTree(formValues)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="5" r="2.5" />
                  <circle cx="5" cy="19" r="2.5" />
                  <circle cx="19" cy="19" r="2.5" />
                  <path d="M12 7.5V13M12 13H5v3.5M12 13h7v3.5" />
                </svg>
                Vẽ goal tree →
              </button>
              <span className="np-note">Dữ liệu mục tiêu sẽ tự động đồng bộ sang Cây mục tiêu</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ============================================================================
   5. MÀN HÌNH 2: CURRENT PROJECT (7_current_project.tsx) + POPUP TỔNG HỢP (10)
   ============================================================================ */
function CurrentUnifiedPopupModal({ initialView = "both", onClose }) {
  const [view, setView] = useState(initialView);
  const [date, setDate] = useState(new Date(2026, 10, 16));
  const [dailyNote, setDailyNote] = useState("");
  const dailyNoteRef = useRef(null);
  const [weeklyNote, setWeeklyNote] = useState("");
  const weeklyNoteRef = useRef(null);

  const shift = (n) => setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

  const Tile = ({ label, children }) => (
    <div style={{ flex: 1, minWidth: 0, border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 12px", background: C.field }}>
      <div style={{ fontSize: 12.5, color: C.muted }}>{label}</div>
      <div style={{ fontSize: 15, color: C.text }}>{children}</div>
    </div>
  );

  return (
    <div
      className="np-overlay"
      role="dialog"
      aria-modal="true"
      style={{ padding: 0, alignItems: "stretch", justifyContent: "stretch" }}
      onClick={onClose}
    >
      <div
        className="np"
        style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", background: C.page }}
        onClick={(e) => e.stopPropagation()}
      >
        <header style={{ height: 52, flex: "none", background: C.ink, color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 12px",
                borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)",
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              ← Quay lại Current Project
            </button>
            <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
            <span>Current – Tổng hợp</span>
          </div>

          <div className="np-seg" role="group" aria-label="Chế độ hiển thị">
            <button type="button" className="np-seg-btn" aria-pressed={view === "both"} onClick={() => setView("both")}>Cả hai</button>
            <button type="button" className="np-seg-btn" aria-pressed={view === "daily"} onClick={() => setView("daily")}>Theo ngày</button>
            <button type="button" className="np-seg-btn" aria-pressed={view === "weekly"} onClick={() => setView("weekly")}>Theo tuần</button>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "36px 24px 56px", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          <div className={`np-cards-grid ${view !== "both" ? "single" : ""}`}>
            {(view === "both" || view === "daily") && (
              <section style={{ width: "100%", background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
                  <div>
                    <h2 style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                      <Square color={C.indigo} /> Lịch hôm qua
                    </h2>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button type="button" className="np-icon-btn" aria-label="Ngày trước" onClick={() => shift(-1)}>
                        <Icon d={["M15 6l-6 6 6 6"]} size={16} />
                      </button>
                      <span style={{ minWidth: 96, textAlign: "center", fontWeight: 600, color: C.ink }}>{fmt(date)}</span>
                      <button type="button" className="np-icon-btn" aria-label="Ngày sau" onClick={() => shift(1)}>
                        <Icon d={["M9 6l6 6-6 6"]} size={16} />
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <button type="button" className="np-icon-btn" onClick={() => dailyNoteRef.current?.focus()}>
                      <Icon d={["M12 5v14M5 12h14"]} size={16} />
                    </button>
                    <span style={{ fontSize: 12, color: C.muted }}>Tùy chọn thêm data</span>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    <span>Chặng – hoàn thành</span>
                    <span style={{ color: C.ink, fontWeight: 600 }}>60%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: C.indigoSoft, overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ width: "60%", height: "100%", background: C.indigo }} />
                  </div>
                  <Tile label="SG"><strong style={{ color: C.ink }}>4</strong> cái</Tile>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                    <Square color={C.coral} /> Bảng kết quả
                  </h3>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Tile label="Số liệu"><strong style={{ color: C.ink }}>3</strong> SG: not done</Tile>
                    <Tile label="Streak (tính theo kế hoạch)"><strong style={{ color: C.ink }}>5</strong></Tile>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label htmlFor="cur-note" style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    → Nhận xét riêng của bản thân
                    <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>Không bắt buộc</span>
                  </label>
                  <textarea id="cur-note" ref={dailyNoteRef} className="np-input" style={{ minHeight: 76 }} placeholder="Chưa nhập" value={dailyNote} onChange={(e) => setDailyNote(e.target.value)} />
                </div>

                <div>
                  <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                    <Square color={C.violet} /> Lịch hôm ấy
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 20 }}><li>Không làm</li></ul>
                </div>
              </section>
            )}

            {(view === "both" || view === "weekly") && (
              <section style={{ width: "100%", background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 16 }}>
                  <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                    <Square color={C.indigo} /> Tuần trước
                  </h2>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <button type="button" className="np-icon-btn" onClick={() => weeklyNoteRef.current?.focus()}>
                      <Icon d={["M12 5v14M5 12h14"]} size={16} />
                    </button>
                    <span style={{ fontSize: 12, color: C.muted }}>Tùy chọn thêm data</span>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    <span>Chặng – hoàn thành</span>
                    <span style={{ color: C.ink, fontWeight: 600 }}>70%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: C.indigoSoft, overflow: "hidden" }}>
                    <div style={{ width: "70%", height: "100%", background: C.indigo }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <Tile label="SG"><strong style={{ color: C.ink }}>12</strong> cái</Tile>
                  <Tile label="G2"><strong style={{ color: C.ink }}>4</strong> cái</Tile>
                  <Tile label="G1"><strong style={{ color: C.ink }}>2</strong> cái</Tile>
                </div>

                <div style={{ display: "flex", marginBottom: 20 }}>
                  <Tile label="Số liệu: cả tuần"><strong style={{ color: C.ink }}>3</strong> SG: not done</Tile>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label htmlFor="wk-note" style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                    → Nhận xét riêng của bản thân
                    <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>Không bắt buộc</span>
                  </label>
                  <textarea id="wk-note" ref={weeklyNoteRef} className="np-input" style={{ minHeight: 76 }} placeholder="Chưa nhập" value={weeklyNote} onChange={(e) => setWeeklyNote(e.target.value)} />
                </div>

                <div>
                  <h3 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                    <Square color={C.teal} /> Tuần này
                  </h3>
                  <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Chưa nhập</p>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function CurrentProjectScreen({
  project,
  stages,
  onUpdateProject,
  onBackHome,
  onSwitchWorkspaceTab,
  onOpenGoalTree,
  onOpenNascent,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({
    goal: project?.goal || "",
    resource: project?.resource || "",
    status: project?.status || "",
  });
  const [unifiedPopupMode, setUnifiedPopupMode] = useState(null);

  useEffect(() => {
    setInfo({
      goal: project?.goal || "",
      resource: project?.resource || "",
      status: project?.status || "",
    });
  }, [project?.id, project?.goal, project?.resource, project?.status]);

  const set = (k) => (e) => setInfo({ ...info, [k]: e.target.value });

  const handleToggleEdit = () => {
    if (editing && project) {
      onUpdateProject(project.id, info);
    }
    setEditing(!editing);
  };

  const rows = [
    { k: "goal", label: "Mục tiêu cuối cùng" },
    { k: "resource", label: "Nguồn lực" },
    { k: "status", label: "Tình trạng ↔ bối cảnh hiện tại – tóm tắt", optional: true },
  ];

  const activeStageNum = project?.currentStageNum || 2;
  const displayStages = stages.slice(0, 4);

  const StatBox = ({ label, value, unit, hint, color = C.ink }) => (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 11, padding: "10px 14px", background: C.field }}>
      <div style={{ fontSize: 13, color: C.muted }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.3 }}>
        {value}
        {unit && <span style={{ marginLeft: 5, fontSize: 13, fontWeight: 500, color: C.muted }}>{unit}</span>}
      </div>
      {hint && <div style={{ fontSize: 12, color: C.muted }}>{hint}</div>}
    </div>
  );

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", background: C.page }}>
      <header style={{ flex: "none", height: 48, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", gap: 12, fontWeight: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Thu gọn thanh điều hướng" : "Mở rộng thanh điều hướng"}
            style={{
              width: 32, height: 32, border: "1px solid rgba(255,255,255,0.16)", borderRadius: 8,
              background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Icon d={sidebarOpen ? ["M4 6h16", "M4 12h10", "M4 18h16", "M19 9l-3 3 3 3"] : ["M4 6h16", "M4 12h16", "M4 18h16"]} size={16} />
          </button>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: project?.color || C.amber }} />
          <span>Ongoing Project – {project?.name || "Current"}</span>
        </div>

        <button
          type="button"
          onClick={() => setUnifiedPopupMode("both")}
          style={{
            height: 30, padding: "0 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
          }}
        >
          Tổng hợp Ngày / Tuần
        </button>
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <nav aria-label="Điều hướng dự án" className="np-sidebar" style={{ width: sidebarOpen ? 248 : 72 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "2px 0 22px", gap: 8 }}>
            <button
              className="np-back"
              onClick={onBackHome}
              title="Quay lại Home"
              style={{ width: sidebarOpen ? "100%" : 42, padding: sidebarOpen ? "0 14px" : 0 }}
            >
              <Icon d={["M19 12H5", "M11 6l-6 6 6 6"]} size={17} stroke="#fff" />
              {sidebarOpen && <span>Quay lại</span>}
            </button>
          </div>
          {WORKSPACE_NAV.map((n) => (
            <button
              key={n.key}
              className="np-nav"
              aria-current={n.key === "current" ? "page" : undefined}
              onClick={() => onSwitchWorkspaceTab(n.key)}
              title={!sidebarOpen ? n.name : undefined}
              style={{ justifyContent: sidebarOpen ? "flex-start" : "center", padding: sidebarOpen ? "0 12px" : 0 }}
            >
              <span style={{ flex: "none", display: "inline-flex" }}><Icon d={n.d} /></span>
              {sidebarOpen && <span>{n.name}</span>}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 48px 56px" }}>
          <div style={{ maxWidth: 1000 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>
                Dự án hiện tại — {project?.name}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <button className="np-btn" onClick={onOpenNascent}>
                  <Icon d={["M14 3v4a1 1 0 0 0 1 1h4", "M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"]} size={16} />
                  Nascent Form
                </button>
                <button className="np-btn" onClick={() => onOpenGoalTree(stages[0]?.id)}>
                  <Icon d={["M6 3v18", "M6 8h7l2 3h5", "M6 16h5l2-2h7"]} size={16} />
                  Cây mục tiêu (Goal Tree)
                </button>
                <button className={`np-btn ${editing ? "primary" : ""}`} onClick={handleToggleEdit}>
                  <Icon d={editing ? ["M5 12l5 5L20 7"] : ["M4 20h4L19 9l-4-4L4 16z", "M13.5 6.5l4 4"]} size={16} />
                  {editing ? "Lưu thông tin" : "Chỉnh thông tin"}
                </button>
              </div>
            </div>

            <Card title="Tổng quan" color={C.indigo} style={{ marginBottom: 16 }}>
              <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "minmax(180px, 280px) 1fr", rowGap: 14, columnGap: 20, alignItems: "center" }}>
                {rows.map((r) => (
                  <React.Fragment key={r.k}>
                    <dt style={{ fontSize: 14, fontWeight: 500, color: C.text }}>
                      {r.label}
                      {r.optional && <span style={{ marginLeft: 6, fontSize: 12, color: C.muted }}>(không bắt buộc)</span>}
                    </dt>
                    <dd style={{ margin: 0 }}>
                      {editing ? (
                        <input className="np-input" value={info[r.k]} onChange={set(r.k)} aria-label={r.label} />
                      ) : info[r.k] ? (
                        info[r.k]
                      ) : (
                        <span style={{ color: "#9aa0bd" }}>Chưa nhập</span>
                      )}
                    </dd>
                  </React.Fragment>
                ))}
              </dl>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
                  <span>Tiến độ</span>
                  <span style={{ color: C.indigo, fontWeight: 700 }}>{project?.progress ?? 35}%</span>
                </div>
                <Bar value={project?.progress ?? 35} height={10} />
              </div>
            </Card>

            <Card
              title="Tầm nhìn tổng quan"
              color={C.teal}
              style={{ marginBottom: 16 }}
              action={
                <button className="np-btn sm" onClick={() => onOpenGoalTree(stages[0]?.id)}>
                  Mở sơ đồ cây →
                </button>
              }
            >
              <p style={{ margin: "0 0 14px", fontSize: 14, color: C.muted }}>
                Ngưỡng từng giai đoạn (nhấp vào từng chặng để mở Cây mục tiêu)
              </p>
              <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {displayStages.map((st, i) => {
                  const n = i + 1;
                  const done = n < activeStageNum;
                  const now = n === activeStageNum;
                  const labelClean = st.title.replace(/^Chặng \d+:\s*/i, "");
                  return (
                    <li
                      key={st.id}
                      onClick={() => onOpenGoalTree(st.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        border: `1px solid ${now ? C.teal : done ? "#e2e5ef" : C.line}`,
                        background: now ? C.tealSoft : done ? "#f1f3f8" : C.field,
                        opacity: done ? 0.8 : 1,
                        borderRadius: 11,
                        padding: "11px 16px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span
                          style={{
                            width: 24, height: 24, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700, flex: "none",
                            background: done ? "#c5cadb" : now ? C.teal : "#e3e6f1",
                            color: done || now ? "#fff" : C.muted,
                          }}
                        >
                          {done ? <Icon d={["M5 12l5 5L20 7"]} size={13} stroke="#fff" /> : n}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: done ? C.muted : C.ink }}>
                          Chặng {n}:
                        </span>
                        <button
                          type="button"
                          className="np-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenGoalTree(st.id);
                          }}
                          style={{
                            textAlign: "left",
                            color: done ? C.muted : now ? C.teal : C.indigo,
                            textDecorationColor: done ? "#c5cadb" : undefined,
                            fontWeight: now ? 600 : 500,
                          }}
                        >
                          {labelClean}
                        </button>
                      </div>
                      <span
                        style={{
                          fontSize: 12, fontWeight: 600, padding: "2px 9px", borderRadius: 999,
                          background: done ? "#e4e7f0" : now ? "#fff" : "#eef0f8",
                          color: done ? "#838aa6" : now ? C.teal : C.muted,
                        }}
                      >
                        {done ? "Đã xong" : now ? "Đang thực hiện" : "Sắp tới"}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </Card>

            <div className="np-grid">
              <Card
                title="Hôm nay"
                color={C.violet}
                action={
                  <button
                    type="button"
                    className="np-btn sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUnifiedPopupMode("daily");
                    }}
                  >
                    Chi tiết ngày
                  </button>
                }
              >
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                    <span>Chặng {activeStageNum} – hoàn thành</span>
                    <b style={{ color: C.violet }}>40%</b>
                  </div>
                  <Bar value={40} color={C.violet} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginBottom: 16 }}>
                  <StatBox label="SG" value={3} unit="cái" />
                  <StatBox label="SG: not done" value={1} unit="cái" color={C.coral} />
                  <StatBox label="Streak" value={5} unit="ngày" hint="Tính theo kế hoạch" color={C.amber} />
                </div>
                <div>
                  <label htmlFor="note-day" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Nhận xét riêng của bản thân
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.muted, background: "#eef0f8", borderRadius: 6, padding: "1px 7px" }}>Không bắt buộc</span>
                  </label>
                  <textarea id="note-day" className="np-input" rows={3} />
                </div>
              </Card>

              <Card
                title="Tuần này"
                color={C.amber}
                action={
                  <button
                    type="button"
                    className="np-btn sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUnifiedPopupMode("weekly");
                    }}
                  >
                    Chi tiết tuần
                  </button>
                }
              >
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                    <span>Chặng {activeStageNum} – hoàn thành</span>
                    <b style={{ color: C.amber }}>55%</b>
                  </div>
                  <Bar value={55} color={C.amber} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginBottom: 16 }}>
                  <StatBox label="SG" value={8} unit="cái" />
                  <StatBox label="G2" value={3} unit="cái" />
                  <StatBox label="G1" value={2} unit="cái" />
                  <StatBox label="SG: not done" value={2} unit="cái" color={C.coral} />
                </div>
                <div>
                  <label htmlFor="note-week" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
                    Nhận xét riêng của bản thân
                    <span style={{ fontSize: 12, fontWeight: 500, color: C.muted, background: "#eef0f8", borderRadius: 6, padding: "1px 7px" }}>Không bắt buộc</span>
                  </label>
                  <textarea id="note-week" className="np-input" rows={3} />
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {unifiedPopupMode && (
        <CurrentUnifiedPopupModal
          initialView={unifiedPopupMode}
          onClose={() => setUnifiedPopupMode(null)}
        />
      )}
    </div>
  );
}

/* ============================================================================
   6. MÀN HÌNH 3: DATA TABLE (5_data_table.tsx)
   ============================================================================ */
function DataTableScreen({
  tables,
  setTables,
  notesByStage,
  setNotesByStage,
  onBackHome,
  onSwitchWorkspaceTab,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeStage, setActiveStage] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [chartTableId, setChartTableId] = useState("tbl-metrics");
  const [toast, setToast] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDoc, setNewDoc] = useState("Docs – Ghi chép chặng hiện tại");
  const [newColor, setNewColor] = useState(C.indigo);

  const STAGE_LIST = [
    { id: 1, name: "Chặng 1: Làm quen" },
    { id: 2, name: "Chặng 2: Tiêu chuẩn hóa" },
    { id: 3, name: "Chặng 3: Vòng lặp nâng cấp" },
    { id: 4, name: "Chặng 4: Chạm đến" },
  ];

  const notify = (msg) => {
    setToast(msg);
    clearTimeout(window.__dtToast);
    window.__dtToast = setTimeout(() => setToast(null), 2600);
  };

  const stageTables = useMemo(() => tables.filter((t) => t.stageId === activeStage), [tables, activeStage]);
  const currentStageObj = STAGE_LIST.find((s) => s.id === activeStage) || STAGE_LIST[0];
  const stageNotes = notesByStage[activeStage] || [];
  const activeChartTable = stageTables.find((t) => t.id === chartTableId) || stageTables[0] || null;

  const handleAddNoteBlock = () => {
    const newBlock = { id: `note-${Date.now()}`, goalRange: "Goal 1 → Goal n", title: "", content: "", summary: "" };
    setNotesByStage((prev) => ({ ...prev, [activeStage]: [...(prev[activeStage] || []), newBlock] }));
  };

  const handleUpdateNoteBlock = (noteId, field, value) => {
    setNotesByStage((prev) => ({
      ...prev,
      [activeStage]: (prev[activeStage] || []).map((item) => (item.id === noteId ? { ...item, [field]: value } : item)),
    }));
  };

  const handleDeleteNoteBlock = (noteId) => {
    setNotesByStage((prev) => ({
      ...prev,
      [activeStage]: (prev[activeStage] || []).filter((item) => item.id !== noteId),
    }));
  };

  const handleCellChange = (tableId, rowId, colKey, value) => {
    setTables((prev) =>
      prev.map((t) => (t.id !== tableId ? t : { ...t, rows: t.rows.map((r) => (r.id === rowId ? { ...r, [colKey]: value } : r)) }))
    );
  };

  const handleColRename = (tableId, colKey, newLabel) => {
    setTables((prev) =>
      prev.map((t) => (t.id !== tableId ? t : { ...t, columns: t.columns.map((c) => (c.key === colKey ? { ...c, label: newLabel } : c)) }))
    );
  };

  const handleAddRow = (tableId) => {
    const today = new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const newRow = { id: `row-${Date.now()}`, date: today };
        t.columns.forEach((c) => { if (c.key !== "date") newRow[c.key] = 0; });
        return { ...t, rows: [...t.rows, newRow] };
      })
    );
  };

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

  const handleDeleteColumn = (tableId, colKey) => {
    const targetTable = tables.find((t) => t.id === tableId);
    if (!targetTable || targetTable.columns.length <= 1) {
      notify("Bảng cần giữ lại ít nhất 1 cột");
      return;
    }
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
  };

  const handleDeleteRow = (tableId, rowId) => {
    setTables((prev) =>
      prev.map((t) => (t.id !== tableId ? t : { ...t, rows: t.rows.filter((r) => r.id !== rowId) }))
    );
  };

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
      rows: [{ id: `r-${Date.now()}`, date: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }), s1: 10, s2: 20, s3: 30 }],
    };
    setTables((prev) => [...prev, created]);
    setChartTableId(created.id);
    setNewTitle("");
    setShowAddModal(false);
    notify(`Đã tạo "${title}"`);
  };

  const renderChart = (table) => {
    const numericCols = table.columns.filter((c) => c.type === "number").slice(0, 3);
    const palette = [table.color, C.amber, C.violet];
    let m = 10;
    table.rows.forEach((r) => numericCols.forEach((col) => { const val = Number(r[col.key]) || 0; if (val > m) m = val; }));
    const maxVal = Math.ceil(m * 1.15);

    if (!table.rows.length || !numericCols.length) {
      return <div style={{ padding: 24, textAlign: "center", color: C.muted, fontSize: 14 }}>Chưa có dữ liệu số để hiển thị biểu đồ.</div>;
    }

    const chartW = 680, chartH = 210, padL = 42, padR = 20, padT = 18, padB = 34;
    const innerW = chartW - padL - padR, innerH = chartH - padT - padB;
    const groupW = innerW / table.rows.length;
    const barW = Math.min(22, (groupW * 0.68) / numericCols.length);

    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12, fontSize: 13 }}>
          {numericCols.map((col, idx) => (
            <div key={col.key} style={{ display: "flex", alignItems: "center", gap: 6, color: C.text }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: palette[idx % palette.length] }} />
              <span>{col.label}</span>
            </div>
          ))}
        </div>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: "100%", height: "auto", minWidth: 460, display: "block" }}>
            {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
              const y = padT + innerH * (1 - t);
              return (
                <g key={i}>
                  <line x1={padL} y1={y} x2={chartW - padR} y2={y} stroke={C.line} strokeDasharray={t === 0 ? undefined : "4 4"} />
                  <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill={C.muted}>{Math.round(maxVal * t)}</text>
                </g>
              );
            })}
            {table.rows.map((row, rIdx) => {
              const centerX = padL + groupW * rIdx + groupW / 2;
              const startX = centerX - (numericCols.length * barW + (numericCols.length - 1) * 4) / 2;
              return (
                <g key={row.id}>
                  {numericCols.map((col, cIdx) => {
                    const val = Math.max(0, Number(row[col.key]) || 0);
                    const h = (val / maxVal) * innerH;
                    return <rect key={col.key} x={startX + cIdx * (barW + 4)} y={padT + innerH - h} width={barW} height={Math.max(2, h)} rx={4} fill={palette[cIdx % palette.length]} opacity={0.9} />;
                  })}
                  <text x={centerX} y={chartH - 10} textAnchor="middle" fontSize="11.5" fill={C.muted}>{String(row.date || `#${rIdx + 1}`).slice(0, 10)}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", minWidth: 900, background: C.page }}>
      <header style={{ flex: "none", height: 48, background: C.ink, color: "#fff", display: "flex", alignItems: "center", padding: "0 20px", gap: 10, fontWeight: 600, fontSize: 15 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
        Data Table
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <nav aria-label="Điều hướng dự án" className="np-sidebar" style={{ width: sidebarCollapsed ? 68 : 248, padding: sidebarCollapsed ? "16px 10px" : "18px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: sidebarCollapsed ? "center" : "space-between", gap: 8, marginBottom: 18 }}>
            {!sidebarCollapsed && (
              <button type="button" className="np-back" style={{ padding: "0 14px", height: 38, fontSize: 13.5 }} onClick={onBackHome}>
                <Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} size={16} stroke="#fff" />
                <span>Quay lại</span>
              </button>
            )}
            <button type="button" className="np-icon-btn" onClick={() => setSidebarCollapsed((prev) => !prev)}>
              <Icon d={sidebarCollapsed ? ["M9 18l6-6-6-6"] : ["M15 18l-6-6 6-6"]} size={17} />
            </button>
          </div>
          {sidebarCollapsed && (
            <button type="button" className="np-nav" style={{ justifyContent: "center", padding: 0, marginBottom: 4 }} onClick={onBackHome} title="Quay lại">
              <Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} />
            </button>
          )}
          {WORKSPACE_NAV.map((n) => (
            <button
              key={n.key}
              className="np-nav"
              style={sidebarCollapsed ? { justifyContent: "center", padding: 0 } : undefined}
              aria-current={n.key === "table" ? "page" : undefined}
              onClick={() => onSwitchWorkspaceTab(n.key)}
            >
              <span style={{ flexShrink: 0, display: "inline-flex" }}><Icon d={n.d} /></span>
              {!sidebarCollapsed && <span>{n.name}</span>}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, overflowY: "auto", padding: "32px 48px 64px" }}>
          <div style={{ maxWidth: isExpanded ? "100%" : 1000, transition: "max-width .25s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink }}>Bảng dữ liệu</h1>
                <button className="np-btn primary" onClick={() => setShowAddModal(true)}>
                  <Icon d={["M12 5v14M5 12h14"]} size={16} stroke="#fff" />
                  Thêm bảng
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button className={`np-btn ${isExpanded ? "active-soft" : ""}`} onClick={() => setIsExpanded(!isExpanded)}>
                  <Icon d={isExpanded ? ["M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"] : ["M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"]} size={16} />
                  {isExpanded ? "Thu gọn" : "Mở rộng bảng"}
                </button>
                <button className={`np-btn ${showNotes ? "active-soft" : ""}`} onClick={() => setShowNotes(!showNotes)}>
                  <Icon d={["M14 3v4a1 1 0 0 0 1 1h4", "M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"]} size={16} />
                  Ghi chú
                </button>
              </div>
            </div>

            <div role="tablist" style={{ display: "flex", alignItems: "center", gap: 6, padding: 5, marginBottom: 20, background: "#ebedf7", borderRadius: 12, width: "fit-content", maxWidth: "100%", overflowX: "auto" }}>
              {STAGE_LIST.map((st) => {
                const count = tables.filter((t) => t.stageId === st.id).length;
                const active = activeStage === st.id;
                return (
                  <button key={st.id} role="tab" aria-selected={active} className={`np-tab ${active ? "active" : ""}`} onClick={() => setActiveStage(st.id)}>
                    {st.name}
                    <span style={{ marginLeft: 6, padding: "1px 6px", borderRadius: 6, fontSize: 11.5, background: active ? C.indigoSoft : "rgba(255,255,255,0.65)", color: active ? C.indigo : C.muted }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {stageTables.length === 0 ? (
              <Card title="Chưa có bảng nào ở chặng này" color={C.muted} style={{ marginBottom: 16 }}>
                <p style={{ margin: "0 0 14px", color: C.muted, fontSize: 14 }}>Mỗi chặng có thể tạo nhiều bảng dữ liệu và gắn với một file Docs riêng.</p>
                <button className="np-btn primary" onClick={() => setShowAddModal(true)}>+ Tạo bảng đầu tiên cho chặng này</button>
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
                      <button className="np-badge-doc" onClick={() => onSwitchWorkspaceTab("docs")} title="Mở tài liệu Docs liên kết">
                        <Icon d={["M7 3h8l4 4v14H7z", "M15 3v4h4"]} size={14} stroke={tbl.color} />
                        <span>Gắn với: {tbl.linkedDoc}</span>
                      </button>
                      <button className="np-btn sm" onClick={() => handleAddColumn(tbl.id)}>+ Thêm cột</button>
                    </div>
                  }
                >
                  <div className="np-notion-wrap">
                    <table className="np-notion-table">
                      <thead>
                        <tr>
                          {tbl.columns.map((col) => (
                            <th key={col.key}>
                              <div className="np-th-wrap">
                                <input className="np-th-input" value={col.label} onChange={(e) => handleColRename(tbl.id, col.key, e.target.value)} />
                                {tbl.columns.length > 1 && (
                                  <button type="button" className="np-col-del" onClick={() => handleDeleteColumn(tbl.id, col.key)} title="Xóa cột">×</button>
                                )}
                              </div>
                            </th>
                          ))}
                          <th style={{ width: 42, minWidth: 42 }} />
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
                                  onChange={(e) => handleCellChange(tbl.id, row.id, col.key, e.target.value)}
                                />
                              </td>
                            ))}
                            <td style={{ textAlign: "center" }}>
                              <button onClick={() => handleDeleteRow(tbl.id, row.id)} style={{ border: 0, background: "transparent", color: C.muted, cursor: "pointer", padding: 6 }}>×</button>
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

            {activeChartTable && (
              <Card
                title="Biểu đồ trực quan"
                color={C.violet}
                action={
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {stageTables.map((t) => (
                      <button key={t.id} className={`np-btn sm ${activeChartTable.id === t.id ? "active-soft" : ""}`} onClick={() => setChartTableId(t.id)}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color }} />
                        {t.title}
                      </button>
                    ))}
                  </div>
                }
              >
                {renderChart(activeChartTable)}
              </Card>
            )}
          </div>
        </main>

        {/* Ngăn kéo Ghi chú */}
        <aside className="np-note-drawer" style={{ width: showNotes ? 380 : 0, borderLeft: showNotes ? `1px solid ${C.line}` : "0px solid transparent" }}>
          <div style={{ width: 380, height: "100%", display: "flex", flexDirection: "column", padding: "18px 16px 20px", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${C.line}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
                <span style={{ fontWeight: 700, fontSize: 15.5, color: C.ink }}>Ghi chú chặng</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button type="button" className="np-btn primary sm" onClick={handleAddNoteBlock}>+ Thêm mục</button>
                <button type="button" className="np-icon-btn" onClick={() => setShowNotes(false)}>
                  <Icon d={["M18 6L6 18", "M6 6l12 12"]} size={15} />
                </button>
              </div>
            </div>

            {stageNotes.length === 0 ? (
              <div className="np-note-card" style={{ textAlign: "center", padding: "24px 16px", color: C.muted }}>
                <p style={{ margin: "0 0 12px", fontSize: 13.5 }}>Chưa có ghi chú nào cho <strong>{currentStageObj.name}</strong>.</p>
                <button type="button" className="np-btn sm" onClick={handleAddNoteBlock}>+ Tạo ghi chú đầu tiên</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stageNotes.map((note) => (
                  <div key={note.id} className="np-note-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#868b9e", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>Chặng {activeStage} -</span>
                      <input className="np-note-ghost-input" style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, flex: 1 }} value={note.goalRange} onChange={(e) => handleUpdateNoteBlock(note.id, "goalRange", e.target.value)} />
                      <button type="button" onClick={() => handleDeleteNoteBlock(note.id)} style={{ border: 0, background: "transparent", color: C.muted, cursor: "pointer" }}>×</button>
                    </div>
                    <div style={{ paddingLeft: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: C.ink, fontWeight: 700 }}>•</span>
                        <input className="np-note-ghost-input" style={{ fontWeight: 700, fontSize: 13.5, color: C.ink, textTransform: "uppercase" }} value={note.title} onChange={(e) => handleUpdateNoteBlock(note.id, "title", e.target.value)} placeholder="TIÊU ĐỀ" />
                      </div>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ color: C.text, fontWeight: 700 }}>•</span>
                        <textarea className="np-note-ghost-input" rows={3} style={{ fontSize: 13.5, color: C.text, minHeight: 62 }} value={note.content} onChange={(e) => handleUpdateNoteBlock(note.id, "content", e.target.value)} placeholder="Ghi chú chi tiết..." />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 4, borderTop: `1px dashed ${C.line}` }}>
                        <span style={{ color: C.indigo, fontWeight: 600 }}>→</span>
                        <input className="np-note-ghost-input" style={{ fontSize: 13, fontWeight: 500, color: C.indigo }} value={note.summary} onChange={(e) => handleUpdateNoteBlock(note.id, "summary", e.target.value)} placeholder="Tóm tắt..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {showAddModal && (
        <div className="np-overlay" onClick={() => setShowAddModal(false)}>
          <form className="np-modal" style={{ maxWidth: 440 }} onSubmit={handleCreateTable} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "0 0 16px", fontSize: 18, color: C.ink }}>Thêm bảng mới ({currentStageObj.name})</h3>
            <div style={{ marginBottom: 14 }}>
              <label className="np-label">Tên bảng</label>
              <input className="np-input" placeholder="Ví dụ: Bảng theo dõi thói quen..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="np-label">Gắn với tài liệu Docs riêng</label>
              <input className="np-input" value={newDoc} onChange={(e) => setNewDoc(e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="np-label">Màu nhận diện</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[C.indigo, C.teal, C.violet, C.amber, C.coral].map((clr) => (
                  <button type="button" key={clr} onClick={() => setNewColor(clr)} style={{ width: 28, height: 28, borderRadius: 8, border: newColor === clr ? `3px solid ${C.ink}` : "2px solid transparent", background: clr, cursor: "pointer" }} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button type="button" className="np-btn" onClick={() => setShowAddModal(false)}>Hủy</button>
              <button type="submit" className="np-btn primary">Tạo bảng</button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 24, zIndex: 1100, background: C.ink, color: "#fff", padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal }} />
          {toast}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   7. MÀN HÌNH 4: MATHEMATICS (6_mathematics.tsx)
   ============================================================================ */
function MathematicsScreen({ onBackHome, onSwitchWorkspaceTab }) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [varsOpen, setVarsOpen] = useState(true);
  const [formulasOpen, setFormulasOpen] = useState(true);

  const [selectedTableType, setSelectedTableType] = useState("progress");
  const [selectedStage, setSelectedStage] = useState("stage-1");
  const [tableData, setTableData] = useState(() => ({
    progress: MATH_TABLE_TYPES.progress.defaultRows,
    resource: MATH_TABLE_TYPES.resource.defaultRows,
    performance: MATH_TABLE_TYPES.performance.defaultRows,
  }));
  const [selectedRowByContext, setSelectedRowByContext] = useState({ "progress:stage-1": "r5" });

  const [variables, setVariables] = useState(INITIAL_MATH_VARS);
  const [flowLayers, setFlowLayers] = useState([{ id: "layer-1", formulaId: "f-ratio", varIds: ["v-s1", "v-s2"] }]);
  const [draggedVarId, setDraggedVarId] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [formulas, setFormulas] = useState(INITIAL_MATH_FORMULAS);

  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState("• Dùng CTT-01 để kiểm tra tỷ lệ hoàn thành thực tế so với định mức.\n• Bấm vào từng dòng trong Bảng chỉ số để xem luồng tính toán thay đổi theo ngày.");

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

  const STAGE_OPTS = [
    { id: "stage-1", label: "Chặng 1" },
    { id: "stage-2", label: "Chặng 2" },
    { id: "stage-3", label: "Chặng 3" },
    { id: "stage-4", label: "Chặng 4" },
  ];

  const currentTableMeta = MATH_TABLE_TYPES[selectedTableType] || MATH_TABLE_TYPES.progress;
  const currentStageMeta = STAGE_OPTS.find((s) => s.id === selectedStage) || STAGE_OPTS[0];
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

  const computedLayers = [];
  flowLayers.forEach((layer, layerIdx) => {
    const formula = formulas.find((f) => f.id === layer.formulaId) || formulas[0];
    const op = OPS[formula.op] || OPS.ratio;
    const lOp = LAYER_OPS[formula.op] || LAYER_OPS.ratio;
    const prevLayer = layerIdx > 0 ? computedLayers[layerIdx - 1] : null;
    const prevNode = prevLayer
      ? { id: "__prev__", name: `Kết quả Tầng ${layerIdx}`, unit: prevLayer.formula.unit, color: C.coral, value: prevLayer.resultValue }
      : null;

    const layerOptions = prevNode ? [prevNode, ...resolvedVars] : resolvedVars;
    const slotVars = layer.varIds.map((vid, slotIdx) => {
      if (vid === "__prev__" && prevNode) return prevNode;
      return resolvedVars.find((v) => v.id === vid) || layerOptions[slotIdx % layerOptions.length] || resolvedVars[0];
    });

    const inputs = prevNode ? [prevNode, ...slotVars] : slotVars;
    let raw = inputs.length > 0 ? inputs[0].value : 0;
    if (inputs.length > 1) {
      for (let i = 1; i < inputs.length; i += 1) raw = lOp.calc(raw, inputs[i].value);
    }
    const res = Number.isFinite(raw) ? Math.round(raw * 100) / 100 : 0;
    const exprText = inputs.length <= 2 && !prevNode ? op.expr : inputs.map((item) => item.name).join(` ${lOp.short} `);

    computedLayers.push({ ...layer, layerIndex: layerIdx, formula, op, prevNode, layerOptions, slotVars, inputs, resultValue: res, exprText });
  });

  const finalLayer = computedLayers[computedLayers.length - 1];
  const resultValue = finalLayer ? finalLayer.resultValue : 0;
  const activeFormula = finalLayer ? finalLayer.formula : formulas[0];
  const finalInputs = finalLayer ? finalLayer.inputs : [];
  const maxRef = Math.max(...finalInputs.map((v) => Math.abs(v?.value || 0)), Math.abs(resultValue), 1);
  const barPercent = activeFormula.unit === "%" ? Math.max(0, Math.min(100, resultValue)) : Math.max(8, Math.min(100, (Math.abs(resultValue) / maxRef) * 100));

  const handleCellEdit = (rowId, key, val) =>
    setTableData((prev) => ({
      ...prev,
      [selectedTableType]: {
        ...prev[selectedTableType],
        [selectedStage]: prev[selectedTableType][selectedStage].map((r) => (r.id === rowId ? { ...r, [key]: key === "date" ? val : Number(val) } : r)),
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
    if (newVarMode === "custom" || !targetVarId) {
      const palette = [C.amber, C.coral, C.indigo, C.teal, C.violet];
      const name = newVarName.trim() || `Biến ${variables.length + 1}`;
      const newId = `v-${Date.now()}`;
      setVariables((prev) => [...prev, { id: newId, name, sourceKey: null, unit: newVarUnit.trim() || "unit", color: palette[variables.length % palette.length], customVal: Number(newVarVal) || 0 }]);
      targetVarId = newId;
    }
    setFlowLayers((prev) => prev.map((layer, idx) => (idx === targetLayerIndex ? { ...layer, varIds: [...layer.varIds, targetVarId] } : layer)));
    setShowVarModal(false);
    notify(`Đã thêm biến vào Tầng ${targetLayerIndex + 1}`);
  };

  const handleAddFlowLayer = () => {
    const defaultVar = resolvedVars[Math.min(2, resolvedVars.length - 1)]?.id || resolvedVars[0]?.id;
    const nextFormula = formulas[Math.min(flowLayers.length, formulas.length - 1)]?.id || formulas[0].id;
    setFlowLayers((prev) => [...prev, { id: `layer-${Date.now()}`, formulaId: nextFormula, varIds: defaultVar ? [defaultVar] : [] }]);
    notify(`Đã thêm Tầng ${flowLayers.length + 1}`);
  };

  const handleCreateFormula = (e) => {
    e.preventDefault();
    const code = `CTT-0${formulas.length + 1}`;
    const name = newFName.trim() || `Công thức ${formulas.length + 1}`;
    const created = { id: `f-${Date.now()}`, code, name, op: OPS[newFOp] ? newFOp : "ratio", unit: newFUnit.trim() || "unit" };
    setFormulas((prev) => [...prev, created]);
    setFlowLayers((prev) => prev.map((layer, idx) => (idx === prev.length - 1 ? { ...layer, formulaId: created.id } : layer)));
    setNewFName("");
    setShowFormulaModal(false);
    notify(`Đã thêm công thức ${code}`);
  };

  const TagBadge = ({ color, solid, soft, children }) => (
    <span className="np-tag" style={{ color: solid ? "#fff" : color, borderColor: color, background: solid ? color : soft || "#fff" }}>{children}</span>
  );

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh", minWidth: 900, background: C.page }}>
      <header style={{ flex: "none", height: 48, background: C.ink, color: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 20px", fontWeight: 600 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
        Mathematics
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <nav aria-label="Điều hướng dự án" className="np-sidebar" style={{ width: leftOpen ? 248 : 68, padding: leftOpen ? "18px 14px" : "18px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: leftOpen ? "space-between" : "center", flexDirection: leftOpen ? "row" : "column", gap: 8, marginBottom: 18 }}>
            <button type="button" className="np-back" style={{ width: leftOpen ? "auto" : 40, padding: leftOpen ? "0 14px" : 0 }} onClick={onBackHome}>
              <Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} size={17} stroke="#fff" />
              {leftOpen && <span>Quay lại</span>}
            </button>
            <button type="button" className="np-icon-btn" onClick={() => setLeftOpen((v) => !v)}>
              <Icon d={leftOpen ? ["M15 18l-6-6 6-6"] : ["M9 18l6-6-6-6"]} size={16} />
            </button>
          </div>
          {WORKSPACE_NAV.map((n) => (
            <button
              key={n.key}
              className="np-nav"
              aria-current={n.key === "math" ? "page" : undefined}
              style={{ justifyContent: leftOpen ? "flex-start" : "center", padding: leftOpen ? "0 12px" : 0 }}
              onClick={() => onSwitchWorkspaceTab(n.key)}
            >
              <span style={{ flex: "none", display: "inline-flex" }}><Icon d={n.d} /></span>
              {leftOpen && <span>{n.name}</span>}
            </button>
          ))}
        </nav>

        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "32px 32px 56px" }}>
          <div style={{ maxWidth: 920, margin: "0 auto" }}>
            <div className="np-row" style={{ gap: 16, marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink }}>Trang tính toán</h1>
                <p className="np-note" style={{ margin: "4px 0 0" }}>Chọn dòng dữ liệu, gán biến số và quan sát luồng công thức trực quan</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button className={`np-btn ${showNotes ? "on" : ""}`} onClick={() => setShowNotes(!showNotes)}>
                  <Icon d={["M14 3v4a1 1 0 0 0 1 1h4", "M5 3h9l5 5v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"]} size={16} />
                  Ghi chú
                </button>
                {!rightOpen && (
                  <button type="button" className="np-btn" onClick={() => setRightOpen(true)}>
                    <Icon d={["M15 18l-6-6 6-6"]} size={16} />
                    Biến & Công thức
                  </button>
                )}
              </div>
            </div>

            {showNotes && (
              <Card title="Ghi chú tính toán" color={C.amber} style={{ marginBottom: 16 }} action={<button className="np-btn sm" onClick={() => setShowNotes(false)}>Đóng</button>}>
                <textarea className="np-input" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
              </Card>
            )}

            <Card
              title="Bảng chỉ số"
              color={C.indigo}
              style={{ marginBottom: 16 }}
              action={
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <select className="np-select-btn" value={selectedTableType} onChange={(e) => setSelectedTableType(e.target.value)}>
                    {Object.values(MATH_TABLE_TYPES).map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <select className="np-select-btn" value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
                    {STAGE_OPTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <TagBadge color={C.indigo} soft={C.indigoSoft}>{currentStageMeta.label} · {selectedRow?.date || "—"}</TagBadge>
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
                        <tr key={row.id} className={isSel ? "selected" : undefined} onClick={() => setSelectedRowByContext((prev) => ({ ...prev, [contextKey]: row.id }))}>
                          <td style={{ textAlign: "center", cursor: "pointer" }}>
                            <input type="radio" checked={isSel} onChange={() => setSelectedRowByContext((prev) => ({ ...prev, [contextKey]: row.id }))} style={{ accentColor: C.indigo }} />
                          </td>
                          <td><input className="np-cell-input" value={row.date} onChange={(e) => handleCellEdit(row.id, "date", e.target.value)} /></td>
                          {currentTableMeta.columns.map((c) => (
                            <td key={c.key}><input className="np-cell-input" type="number" step="any" value={row[c.key]} onChange={(e) => handleCellEdit(row.id, c.key, e.target.value)} /></td>
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
                  <button type="button" className="np-btn sm" onClick={() => openAddVarModal(flowLayers.length - 1)}>+ Thêm biến</button>
                  <button type="button" className="np-btn sm" onClick={() => setShowFormulaModal(true)}>+ Thêm CTT</button>
                  <button type="button" className="np-btn sm" onClick={handleAddFlowLayer}>+ Thêm tầng</button>
                </div>
              }
            >
              <div
                onDragOver={(e) => { e.preventDefault(); if (dropTarget !== "flow") setDropTarget("flow"); }}
                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(null); }}
                onDrop={(e) => {
                  e.preventDefault();
                  const varId = e.dataTransfer.getData("text/plain") || draggedVarId;
                  if (varId) {
                    setFlowLayers((prev) => prev.map((l, idx) => (idx === prev.length - 1 ? { ...l, varIds: [...l.varIds, varId] } : l)));
                  }
                  setDraggedVarId(null);
                  setDropTarget(null);
                }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 20px 20px",
                  background: dropTarget === "flow" ? "#f2f4ff" : C.field,
                  border: `1.5px ${draggedVarId ? "dashed" : "solid"} ${draggedVarId ? C.indigo : C.line}`,
                  borderRadius: 12,
                }}
              >
                {computedLayers.map((layer) => {
                  const layerIdx = layer.layerIndex;
                  const minSlots = layerIdx === 0 ? 2 : 1;
                  const canRemoveSlot = layer.slotVars.length > minSlots;
                  return (
                    <React.Fragment key={layer.id}>
                      <div style={{ width: "100%", maxWidth: 680, padding: "12px 14px 14px", borderRadius: 12, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.65)" }}>
                        <div className="np-row" style={{ marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <TagBadge color={C.indigo} soft={C.indigoSoft}>Tầng {layerIdx + 1}</TagBadge>
                            <span className="np-note" style={{ fontSize: 12 }}>{layerIdx === 0 ? "Đầu vào ban đầu" : `Kết hợp kết quả Tầng ${layerIdx}`}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button type="button" className="np-btn sm" style={{ height: 28, padding: "0 10px", fontSize: 12 }} onClick={() => openAddVarModal(layerIdx)}>+ Biến tầng {layerIdx + 1}</button>
                            {layerIdx > 0 && (
                              <button type="button" className="np-icon-btn" style={{ width: 28, height: 28 }} onClick={() => setFlowLayers((prev) => prev.filter((_, idx) => idx !== layerIdx))}>
                                <Icon d={["M18 6L6 18M6 6l12 12"]} size={13} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="np-flow-grid">
                          {layer.prevNode && (
                            <div className="np-node" style={{ borderTop: `3px solid ${C.coral}`, background: "#fff9f9" }}>
                              <div className="np-row" style={{ marginBottom: 8 }}>
                                <TagBadge color={C.coral} solid>từ tầng {layerIdx}</TagBadge>
                                <span className="np-note">{layer.prevNode.unit}</span>
                              </div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>{layer.prevNode.name}</div>
                              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>{layer.prevNode.value} <span className="np-note">{layer.prevNode.unit}</span></div>
                            </div>
                          )}

                          {layer.slotVars.map((slotVar, slotIdx) => {
                            const slotDropKey = `slot-${layerIdx}-${slotIdx}`;
                            return (
                              <div
                                key={`${layer.id}-slot-${slotIdx}`}
                                className={`np-node ${draggedVarId ? "drop-ready" : ""} ${dropTarget === slotDropKey ? "drop-over" : ""}`}
                                style={{ borderTop: `3px solid ${slotVar?.color || C.indigo}` }}
                                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDropTarget(slotDropKey); }}
                                onDragLeave={() => setDropTarget(null)}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const varId = e.dataTransfer.getData("text/plain") || draggedVarId;
                                  if (varId) {
                                    setFlowLayers((prev) => prev.map((l, idx) => (idx === layerIdx ? { ...l, varIds: l.varIds.map((v, s) => (s === slotIdx ? varId : v)) } : l)));
                                  }
                                  setDraggedVarId(null);
                                  setDropTarget(null);
                                }}
                              >
                                <div className="np-row" style={{ marginBottom: 8 }}>
                                  <TagBadge color={C.coral}>biến {layerIdx === 0 ? slotIdx + 1 : slotIdx + 2}</TagBadge>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span className="np-note">{slotVar?.unit}</span>
                                    {canRemoveSlot && (
                                      <button
                                        type="button"
                                        className="np-icon-btn"
                                        style={{ width: 22, height: 22, borderRadius: 6 }}
                                        onClick={() => setFlowLayers((prev) => prev.map((l, idx) => (idx === layerIdx ? { ...l, varIds: l.varIds.filter((_, s) => s !== slotIdx) } : l)))}
                                      >
                                        <Icon d={["M18 6L6 18M6 6l12 12"]} size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <select
                                  className="np-input"
                                  value={slotVar?.id}
                                  onChange={(e) => setFlowLayers((prev) => prev.map((l, idx) => (idx === layerIdx ? { ...l, varIds: l.varIds.map((v, s) => (s === slotIdx ? e.target.value : v)) } : l)))}
                                  style={{ marginBottom: 8 }}
                                >
                                  {layer.layerOptions.map((v) => <option key={v.id} value={v.id}>{v.name} ({v.value})</option>)}
                                </select>
                                <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>
                                  {slotVar?.value} <span className="np-note">{slotVar?.unit}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <svg className="np-flow" height="44" viewBox="0 0 360 44" preserveAspectRatio="none" fill="none">
                        <path d="M 110 2 C 110 22, 180 16, 180 38" stroke={C.indigo} strokeWidth="2.1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                        <path d="M 250 2 C 250 22, 180 16, 180 38" stroke={C.teal} strokeWidth="2.1" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                        <polygon points="180,43 174,34 186,34" fill={C.indigo} />
                      </svg>

                      <div className="np-node" style={{ width: "100%", maxWidth: 400, background: C.indigoSoft, borderColor: C.indigo, textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
                          <TagBadge color={C.indigo} solid>CTT · T{layerIdx + 1}</TagBadge>
                          <select
                            className="np-input"
                            value={layer.formula.id}
                            onChange={(e) => setFlowLayers((prev) => prev.map((l, idx) => (idx === layerIdx ? { ...l, formulaId: e.target.value } : l)))}
                            style={{ flex: 1, color: C.indigo }}
                          >
                            {formulas.map((f) => <option key={f.id} value={f.id}>{f.code}: {f.name}</option>)}
                          </select>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{layer.exprText}</div>
                      </div>

                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <line x1="20" y1="2" x2="20" y2="32" stroke={C.coral} strokeWidth="2.4" strokeLinecap="round" />
                        <polygon points="20,38 14,28 26,28" fill={C.coral} />
                      </svg>
                    </React.Fragment>
                  );
                })}

                <div className="np-node" style={{ width: "100%", maxWidth: 420, borderColor: C.coral, textAlign: "center" }}>
                  <div className="np-row" style={{ marginBottom: 6 }}>
                    <TagBadge color={C.coral} solid>kết quả</TagBadge>
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
        <aside style={{ flex: "none", width: rightOpen ? 292 : 46, display: "flex", flexDirection: "column", minHeight: 0, background: C.card, borderLeft: `1px solid ${C.line}`, transition: "width .22s ease", overflow: "hidden" }}>
          <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: rightOpen ? "space-between" : "center", padding: rightOpen ? "10px 16px" : "10px 0", borderBottom: `1px solid ${C.line}`, background: C.field }}>
            {rightOpen && <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: C.muted }}>Bảng điều khiển</span>}
            <button type="button" className="np-icon-btn" onClick={() => setRightOpen((v) => !v)}>
              <Icon d={rightOpen ? ["M9 18l6-6-6-6"] : ["M15 18l-6-6 6-6"]} size={16} />
            </button>
          </div>

          {rightOpen && (
            <>
              <section className="np-side-sec" style={{ flex: varsOpen ? 1 : "none" }}>
                <div className="np-card-head" style={{ marginBottom: varsOpen ? 12 : 0 }}>
                  <button type="button" onClick={() => setVarsOpen((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: 0, border: 0, background: "transparent", cursor: "pointer" }}>
                    <span className="np-sq" style={{ background: C.teal }} />
                    <span style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>Biến số</span>
                    <Icon d={varsOpen ? ["M6 9l6 6 6-6"] : ["M9 18l6-6-6-6"]} size={15} />
                  </button>
                  <button className="np-btn sm" onClick={() => openAddVarModal(flowLayers.length - 1)}>+ Thêm biến</button>
                </div>
                {varsOpen && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div className="np-note" style={{ fontSize: 12 }}>Kéo thanh biến thả vào sơ đồ luồng tính toán</div>
                    {resolvedVars.map((v, idx) => (
                      <div
                        key={v.id}
                        className={`np-var ${draggedVarId === v.id ? "dragging" : ""}`}
                        draggable
                        onDragStart={(e) => { setDraggedVarId(v.id); e.dataTransfer.setData("text/plain", v.id); }}
                        onDragEnd={() => { setDraggedVarId(null); setDropTarget(null); }}
                      >
                        <div className="np-row" style={{ fontSize: 14 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: C.ink, minWidth: 0 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.color, flex: "none" }} />
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Status {idx + 1} · {v.name}</span>
                          </span>
                          <b style={{ color: v.color, flex: "none" }}>{v.value} <span className="np-note">{v.unit}</span></b>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="np-side-sec" style={{ flex: formulasOpen ? 1 : "none" }}>
                <div className="np-card-head" style={{ marginBottom: formulasOpen ? 12 : 0 }}>
                  <button type="button" onClick={() => setFormulasOpen((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: 0, border: 0, background: "transparent", cursor: "pointer" }}>
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
                        onClick={() => setFlowLayers((prev) => prev.map((l, idx) => (idx === prev.length - 1 ? { ...l, formulaId: f.id } : l)))}
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
          )}
        </aside>
      </div>

      {showVarModal && (
        <div className="np-overlay" onClick={() => setShowVarModal(false)}>
          <form className="np-modal" style={{ maxWidth: 410 }} onSubmit={handleCreateVar} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: C.ink }}>Thêm biến vào sơ đồ luồng</h2>
            <div style={{ marginBottom: 12 }}>
              <label className="np-label">Chọn tầng đặt biến</label>
              <select className="np-input" value={targetLayerIndex} onChange={(e) => setTargetLayerIndex(Number(e.target.value))}>
                {flowLayers.map((l, idx) => <option key={l.id} value={idx}>Tầng {idx + 1}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="np-label">Nguồn biến số</label>
              <select className="np-input" value={newVarMode} onChange={(e) => setNewVarMode(e.target.value)}>
                <option value="existing">Chọn từ danh sách biến hiện có</option>
                <option value="custom">Tạo biến số mới</option>
              </select>
            </div>
            {newVarMode === "existing" ? (
              <div style={{ marginBottom: 14 }}>
                <label className="np-label">Biến số</label>
                <select className="np-input" value={selectedExistingVarId} onChange={(e) => setSelectedExistingVarId(e.target.value)}>
                  {resolvedVars.map((v, idx) => <option key={v.id} value={v.id}>Status {idx + 1} · {v.name} ({v.value} {v.unit})</option>)}
                </select>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 12 }}>
                  <label className="np-label">Tên biến</label>
                  <input className="np-input" value={newVarName} onChange={(e) => setNewVarName(e.target.value)} autoFocus />
                </div>
                <div className="np-two" style={{ marginBottom: 12 }}>
                  <div><label className="np-label">Giá trị</label><input className="np-input" type="number" step="any" value={newVarVal} onChange={(e) => setNewVarVal(e.target.value)} /></div>
                  <div><label className="np-label">Đơn vị</label><input className="np-input" value={newVarUnit} onChange={(e) => setNewVarUnit(e.target.value)} /></div>
                </div>
              </>
            )}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" className="np-btn" onClick={() => setShowVarModal(false)}>Hủy</button>
              <button type="submit" className="np-btn primary">Thêm biến</button>
            </div>
          </form>
        </div>
      )}

      {showFormulaModal && (
        <div className="np-overlay" onClick={() => setShowFormulaModal(false)}>
          <form className="np-modal" style={{ maxWidth: 400 }} onSubmit={handleCreateFormula} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: C.ink }}>Thêm công thức toán</h2>
            <div style={{ marginBottom: 12 }}>
              <label className="np-label">Tên công thức</label>
              <input className="np-input" value={newFName} onChange={(e) => setNewFName(e.target.value)} autoFocus />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="np-label">Phép tính</label>
              <select className="np-input" value={newFOp} onChange={(e) => setNewFOp(e.target.value)}>
                {ADDABLE_OPS.map((k) => <option key={k} value={k}>{OPS[k].label}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label className="np-label">Đơn vị kết quả</label>
              <input className="np-input" value={newFUnit} onChange={(e) => setNewFUnit(e.target.value)} />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" className="np-btn" onClick={() => setShowFormulaModal(false)}>Hủy</button>
              <button type="submit" className="np-btn primary">Lưu công thức</button>
            </div>
          </form>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 20, right: 310, zIndex: 1100, display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: C.ink, color: "#fff", fontSize: 13 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal }} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   8. MÀN HÌNH 5: DOCS 4 CỘT (9. docs.tsx)
   ============================================================================ */
function DocsScreen({ onBackToCurrent, onSwitchWorkspaceTab }) {
  const [chunks, setChunks] = useState([
    { stage: "Chặng 1", title: "Khởi tạo nền tảng" },
    { stage: "Chặng 2", title: "Tiêu chuẩn hóa quy trình" },
    { stage: "Chặng 3", title: "Tối ưu vòng lặp" },
  ]);
  const [tree, setTree] = useState({ note: "", important: "" });
  const [mathNote, setMathNote] = useState("");
  const [notesBySection, setNotesBySection] = useState({
    overview: [],
    tree: [],
    chunks: [],
    data: [],
    math: [],
  });
  const [modalState, setModalState] = useState({
    open: false,
    sectionKey: "",
    sectionLabel: "",
    noteId: null,
    title: "",
    content: "",
  });

  const openNewNoteModal = (sectionKey, sectionLabel) => {
    setModalState({ open: true, sectionKey, sectionLabel, noteId: null, title: "", content: "" });
  };

  const openEditNoteModal = (sectionKey, sectionLabel, note) => {
    setModalState({ open: true, sectionKey, sectionLabel, noteId: note.id, title: note.title, content: note.content });
  };

  const handleSaveAndCloseModal = () => {
    const { sectionKey, noteId, title, content } = modalState;
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (trimmedTitle || trimmedContent) {
      setNotesBySection((prev) => {
        const list = prev[sectionKey] || [];
        if (noteId) {
          return {
            ...prev,
            [sectionKey]: list.map((item) =>
              item.id === noteId ? { ...item, title: trimmedTitle || "Ghi chú không tiêu đề", content: trimmedContent } : item
            ),
          };
        }
        return {
          ...prev,
          [sectionKey]: [{ id: Date.now().toString(), title: trimmedTitle || "Ghi chú không tiêu đề", content: trimmedContent }, ...list],
        };
      });
    }
    setModalState((s) => ({ ...s, open: false }));
  };

  const handleDeleteNote = (sectionKey, noteId) => {
    setNotesBySection((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter((item) => item.id !== noteId),
    }));
  };

  const setChunk = (i, k) => (e) => setChunks((cs) => cs.map((c, j) => (j === i ? { ...c, [k]: e.target.value } : c)));

  const blockCardStyle = {
    background: C.card,
    border: `1.5px solid #e5bcbc`,
    borderLeft: `4px solid ${C.coral}`,
    borderRadius: 10,
    padding: "clamp(8px, 1.1vw, 14px)",
    boxShadow: "0 2px 8px rgba(240, 82, 79, 0.05)",
  };

  const SectionBanner = ({ title, color, onNewNote }) => (
    <div className="np-banner" style={{ background: C.ink, color: "#fff", borderRadius: 8, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
        <Square color={color} />
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</span>
      </div>
      {onNewNote && (
        <button type="button" className="np-new-note-btn" onClick={onNewNote}>+ Note</button>
      )}
    </div>
  );

  const SavedNoteList = ({ notes, onSelectNote, onDeleteNote }) => {
    if (!notes || notes.length === 0) return null;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
        {notes.map((note) => (
          <div key={note.id} className="np-note-bar" onClick={() => onSelectNote(note)}>
            <span className="np-note-bar-title">{note.title.trim() || "Ghi chú không tiêu đề"}</span>
            <button
              type="button"
              className="np-note-del"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", overflow: "hidden", background: C.page }}>
      <header style={{ height: 48, flex: "none", background: C.ink, color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
          <span>Ongoing – Docs</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {WORKSPACE_NAV.map((n) => (
            <button
              key={n.key}
              type="button"
              onClick={() => onSwitchWorkspaceTab(n.key)}
              style={{
                height: 28, padding: "0 10px", borderRadius: 7,
                border: n.key === "docs" ? "1px solid #fff" : "1px solid rgba(255,255,255,0.2)",
                background: n.key === "docs" ? "#fff" : "rgba(255,255,255,0.08)",
                color: n.key === "docs" ? C.ink : "#fff",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              {n.name}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <aside className="np-docs-sidebar">
          <button type="button" className="np-back" style={{ height: 34, fontSize: 13 }} onClick={onBackToCurrent}>
            <span aria-hidden="true">←</span>
            <span>Quay lại</span>
          </button>
        </aside>

        <main className="np-columns">
          {/* Cột 1: Overview & Tree */}
          <div className="np-col" style={{ background: C.colOdd }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <SectionBanner title="Overview" color={C.indigo} onNewNote={() => openNewNoteModal("overview", "Overview")} />
              <SavedNoteList notes={notesBySection.overview} onSelectNote={(n) => openEditNoteModal("overview", "Overview", n)} onDeleteNote={(id) => handleDeleteNote("overview", id)} />
            </div>
            <div style={{ borderTop: "1px dashed #c8cde0", margin: "4px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SectionBanner title="Tree" color={C.teal} onNewNote={() => openNewNoteModal("tree", "Tree")} />
              <SavedNoteList notes={notesBySection.tree} onSelectNote={(n) => openEditNoteModal("tree", "Tree", n)} onDeleteNote={(id) => handleDeleteNote("tree", id)} />
              <section style={blockCardStyle}>
                <label htmlFor="tree-note" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Ghi chú</label>
                <textarea id="tree-note" className="np-input" placeholder="Chưa nhập" value={tree.note} onChange={(e) => setTree((t) => ({ ...t, note: e.target.value }))} />
              </section>
              <section style={blockCardStyle}>
                <label htmlFor="tree-important" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Important Infor</label>
                <textarea id="tree-important" className="np-input" placeholder="Chưa nhập" value={tree.important} onChange={(e) => setTree((t) => ({ ...t, important: e.target.value }))} />
              </section>
            </div>
          </div>

          {/* Cột 2: Chunks */}
          <div className="np-col" style={{ background: C.colEven }}>
            <SectionBanner title="Chunks" color={C.violet} onNewNote={() => openNewNoteModal("chunks", "Chunks")} />
            <SavedNoteList notes={notesBySection.chunks} onSelectNote={(n) => openEditNoteModal("chunks", "Chunks", n)} onDeleteNote={(id) => handleDeleteNote("chunks", id)} />
            {chunks.map((c, i) => (
              <section key={i} style={blockCardStyle}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, textAlign: "center", marginBottom: 10, paddingBottom: 6, borderBottom: `1px solid ${C.line}` }}>
                  Chunk {i + 1}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Chặng</label>
                  <input className="np-input" value={c.stage} onChange={setChunk(i, "stage")} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Tiêu đề</label>
                  <input className="np-input" value={c.title} onChange={setChunk(i, "title")} />
                </div>
              </section>
            ))}
          </div>

          {/* Cột 3: Bảng dữ liệu */}
          <div className="np-col" style={{ background: C.colOdd }}>
            <SectionBanner title="Bảng dữ liệu" color={C.coral} onNewNote={() => openNewNoteModal("data", "Bảng dữ liệu")} />
            <SavedNoteList notes={notesBySection.data} onSelectNote={(n) => openEditNoteModal("data", "Bảng dữ liệu", n)} onDeleteNote={(id) => handleDeleteNote("data", id)} />
          </div>

          {/* Cột 4: Mathematics */}
          <div className="np-col" style={{ background: C.colEven }}>
            <SectionBanner title="Mathematics" color={C.amber} onNewNote={() => openNewNoteModal("math", "Mathematics")} />
            <SavedNoteList notes={notesBySection.math} onSelectNote={(n) => openEditNoteModal("math", "Mathematics", n)} onDeleteNote={(id) => handleDeleteNote("math", id)} />
            <div style={{ padding: "4px 4px 0" }}>
              <label htmlFor="math-note" style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Nội dung / Công thức</label>
              <textarea id="math-note" className="np-input" style={{ minHeight: 120 }} placeholder="Chưa nhập" value={mathNote} onChange={(e) => setMathNote(e.target.value)} />
            </div>
          </div>
        </main>
      </div>

      {modalState.open && (
        <div className="np-overlay" onClick={handleSaveAndCloseModal}>
          <div className="np-modal" style={{ maxWidth: 520, padding: 0, overflow: "hidden" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "12px 18px 0", display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: C.muted }}>
              <span>Mục: {modalState.sectionLabel}</span>
              <span>{modalState.noteId ? "Đang chỉnh sửa" : "Ghi chú mới"}</span>
            </div>
            <input type="text" className="np-modal-title-input" placeholder="Tiêu đề" autoFocus value={modalState.title} onChange={(e) => setModalState((s) => ({ ...s, title: e.target.value }))} />
            <textarea className="np-modal-body-input" placeholder="Tạo ghi chú..." value={modalState.content} onChange={(e) => setModalState((s) => ({ ...s, content: e.target.value }))} />
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${C.line}`, background: C.page, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button type="button" className="np-btn sm" onClick={() => setModalState((s) => ({ ...s, open: false }))}>Hủy</button>
              <button type="button" className="np-btn primary sm" onClick={handleSaveAndCloseModal}>Lưu & Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   9. MÀN HÌNH 6: GOAL TREE BƯỚC 1 (3_goal_tree (1).tsx)
   ============================================================================ */
function shorten(str, max = 18) {
  if (!str) return "";
  const trimmed = String(str).trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

function findNode(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

function findNodeInStages(stages, id) {
  for (const stage of stages) {
    if (stage.id === id) return stage;
    const found = findNode(stage, id);
    if (found) return found;
  }
  return null;
}

function findStageOfNode(stages, id) {
  for (const stage of stages) {
    if (stage.id === id || findNode(stage, id)) return stage;
  }
  return stages[0] || null;
}

function updateNodeInTree(node, id, patch) {
  if (node.id === id) return { ...node, ...patch };
  if (!node.children || node.children.length === 0) return node;
  return { ...node, children: node.children.map((c) => updateNodeInTree(c, id, patch)) };
}

function addChildInTree(node, parentId, newChild) {
  if (node.id === parentId) return { ...node, children: [...(node.children || []), newChild] };
  if (!node.children || node.children.length === 0) return node;
  return { ...node, children: node.children.map((c) => addChildInTree(c, parentId, newChild)) };
}

function deleteNodeInTree(node, targetId) {
  if (!node.children || node.children.length === 0) return node;
  return {
    ...node,
    children: node.children.filter((c) => c.id !== targetId).map((c) => deleteNodeInTree(c, targetId)),
  };
}

function GoalTreeStep1Screen({
  stages,
  setStages,
  initialSelectedStageId,
  onBack,
  onGoToStep2And3,
}) {
  const [selectedId, setSelectedId] = useState(initialSelectedStageId || "a");
  const [expandedMap, setExpandedMap] = useState(() => {
    const acc = {};
    stages.forEach((st) => {
      acc[st.id] = true;
      const walk = (n) => {
        if (n.children?.length) {
          acc[n.id] = true;
          n.children.forEach(walk);
        }
      };
      (st.children || []).forEach(walk);
    });
    return acc;
  });
  const [quickTitle, setQuickTitle] = useState("");
  const [quickIsCore, setQuickIsCore] = useState(false);
  const [isDraggingTree, setIsDraggingTree] = useState(false);

  const titleRef = useRef(null);
  const rowRefs = useRef({});
  const nextIdCounter = useRef(1);
  const treeScrollRef = useRef(null);
  const dragStateRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    if (initialSelectedStageId) {
      setSelectedId(initialSelectedStageId);
    }
  }, [initialSelectedStageId]);

  const treeLayout = useMemo(() => {
    const STAGE_W = 128, ROOT_TO_FIRST_LEVEL_GAP = 64, LEVEL_STEP_X = 186, NODE_W = 148, STAGE_TAIL_GAP = 72;
    const ROW_STEP = 44, AXIS_GAP = 32, TOP_PAD = 34, BOTTOM_PAD = 28;

    const stageLayouts = stages.map((stage) => {
      const topLevel = stage.children || [];
      let splitIndex = 1;
      if (topLevel.length === 0) splitIndex = 0;
      else {
        let leadingCore = 0;
        while (leadingCore < topLevel.length && topLevel[leadingCore].core) leadingCore++;
        splitIndex = leadingCore >= 1 && leadingCore < topLevel.length ? leadingCore : 1;
      }
      const aboveBranches = topLevel.slice(0, splitIndex);
      const belowBranches = topLevel.slice(splitIndex);
      const localNodes = [], localEdges = [];
      let maxDepth = 0;

      function layoutSubtree(node, depth, state) {
        if (depth > maxDepth) maxDepth = depth;
        const kids = node.children || [];
        let rowSlot;
        if (kids.length === 0) rowSlot = state.leafCount++;
        else {
          const childSlots = kids.map((k) => layoutSubtree(k, depth + 1, state));
          rowSlot = (childSlots[0] + childSlots[childSlots.length - 1]) / 2;
        }
        const relX = STAGE_W + ROOT_TO_FIRST_LEVEL_GAP + (depth - 1) * LEVEL_STEP_X;
        localNodes.push({ id: node.id, title: node.title, core: !!node.core, depth, relX, w: NODE_W, rowSlot, isRoot: false });
        kids.forEach((k) => localEdges.push({ from: node.id, to: k.id }));
        return rowSlot;
      }

      const aboveState = { leafCount: 0 };
      aboveBranches.forEach((b) => layoutSubtree(b, 1, aboveState));
      const aboveEndIdx = localNodes.length;
      const belowState = { leafCount: 0 };
      belowBranches.forEach((b) => layoutSubtree(b, 1, belowState));

      const stageWidth = maxDepth === 0 ? STAGE_W + 76 : STAGE_W + ROOT_TO_FIRST_LEVEL_GAP + (maxDepth - 1) * LEVEL_STEP_X + NODE_W + STAGE_TAIL_GAP;
      return { stage, topLevel, localNodes, localEdges, aboveEndIdx, aboveRows: Math.max(aboveState.leafCount, 1), belowRows: Math.max(belowState.leafCount, 1), stageWidth };
    });

    const maxAboveRows = Math.max(1, ...stageLayouts.map((s) => s.aboveRows));
    const maxBelowRows = Math.max(1, ...stageLayouts.map((s) => s.belowRows));
    const axisY = TOP_PAD + maxAboveRows * ROW_STEP + AXIS_GAP;
    const totalHeight = Math.max(300, axisY + AXIS_GAP + maxBelowRows * ROW_STEP + BOTTOM_PAD);

    const nodes = [], edges = [];
    let cursorX = 32;

    stageLayouts.forEach((sl) => {
      const baseX = cursorX;
      const aboveOffsetRows = maxAboveRows - sl.aboveRows;
      sl.localNodes.forEach((ln, idx) => {
        const isAbove = idx < sl.aboveEndIdx;
        const y = isAbove ? TOP_PAD + 12 + (aboveOffsetRows + ln.rowSlot) * ROW_STEP : axisY + AXIS_GAP + 12 + ln.rowSlot * ROW_STEP;
        nodes.push({ ...ln, x: baseX + ln.relX, y });
      });
      sl.localEdges.forEach((le) => edges.push(le));
      nodes.push({ id: sl.stage.id, title: sl.stage.title, core: false, depth: 0, x: baseX, y: axisY, w: STAGE_W, isRoot: true });
      const splitPointX = baseX + STAGE_W + 18;
      sl.topLevel.forEach((b) => edges.push({ sx: splitPointX, sy: axisY, to: b.id, fromRootSplit: true }));
      cursorX += sl.stageWidth;
    });

    return { nodes, edges, nodeMap: Object.fromEntries(nodes.map((n) => [n.id, n])), axisY, width: Math.max(1120, cursorX + 24), height: totalHeight };
  }, [stages]);

  const selectedNode = useMemo(() => findNodeInStages(stages, selectedId) || stages[0], [stages, selectedId]);
  const activeStage = useMemo(() => findStageOfNode(stages, selectedId) || stages[0], [stages, selectedId]);

  const handleUpdateNode = (id, patch) => setStages((prev) => prev.map((st) => updateNodeInTree(st, id, patch)));
  const handleToggleCore = (id) => {
    const target = findNodeInStages(stages, id);
    if (target && !target.isStage) handleUpdateNode(id, { core: !target.core });
  };

  const handleAddChild = (parentId, isCore = false, customTitle = "") => {
    const newId = `goal_${Date.now()}_${nextIdCounter.current++}`;
    const parentNode = findNodeInStages(stages, parentId);
    const defaultLabel = customTitle.trim() || (isCore ? "Mục tiêu mấu chốt" : parentNode?.isStage ? "Mục tiêu lớn mới" : "Mục tiêu nhỏ");
    const newNode = { id: newId, title: defaultLabel, note: "", core: isCore, score: "", due: "", limitUnit: "week", resource: "", condition: "", children: [] };
    const ownerStage = findStageOfNode(stages, parentId);
    setStages((prev) => prev.map((st) => addChildInTree(st, parentId, newNode)));
    setExpandedMap((prev) => ({ ...prev, ...(ownerStage ? { [ownerStage.id]: true } : {}), [parentId]: true }));
    setSelectedId(newId);
  };

  const handleAddStage = () => {
    if (stages.length >= MAX_STAGES) return;
    const nextIndex = stages.length + 1;
    const newStageId = `stage_${Date.now()}_${nextIdCounter.current++}`;
    setStages((prev) => [...prev, { id: newStageId, title: `Chặng ${nextIndex}`, note: "", core: false, isStage: true, children: [] }]);
    setExpandedMap((prev) => ({ ...prev, [newStageId]: true }));
    setSelectedId(newStageId);
  };

  const handleDeleteNode = (targetId) => {
    if (stages[0] && targetId === stages[0].id) return;
    const isStageTarget = stages.some((st) => st.id === targetId);
    if (isStageTarget) {
      setStages((prev) => prev.filter((st) => st.id !== targetId));
      setSelectedId(stages[0].id);
      return;
    }
    const ownerStage = findStageOfNode(stages, targetId);
    setStages((prev) => prev.map((st) => deleteNodeInTree(st, targetId)));
    if (selectedId === targetId) setSelectedId(ownerStage ? ownerStage.id : stages[0].id);
  };

  const renderBranchItem = (node, depth) => {
    const hasChildren = (node.children || []).length > 0;
    const isOpen = expandedMap[node.id] !== false;
    const isSelected = selectedId === node.id;
    return (
      <div key={node.id} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          ref={(el) => { if (el) rowRefs.current[node.id] = el; }}
          onClick={() => setSelectedId(node.id)}
          className={`np-tree-row ${isSelected ? "is-selected" : ""}`}
          style={{ marginLeft: depth * 16, background: isSelected ? C.indigoSoft : "#ffffff" }}
        >
          {hasChildren ? (
            <button type="button" className="np-mini-icon" onClick={(e) => { e.stopPropagation(); setExpandedMap((p) => ({ ...p, [node.id]: p[node.id] === false })); }}>
              <span style={{ transform: isOpen ? "rotate(90deg)" : "none", display: "inline-block" }}>›</span>
            </button>
          ) : (
            <span style={{ width: 20, textAlign: "center", color: node.core ? C.teal : "#b3bad6", fontSize: 10 }}>●</span>
          )}
          <button type="button" onClick={(e) => { e.stopPropagation(); handleToggleCore(node.id); }} className={`np-role-pill ${node.core ? "is-core" : ""}`}>
            {node.core ? "★ Mấu chốt" : "Mục tiêu"}
          </button>
          <input type="text" className="np-row-input" value={node.title} placeholder="Nhập tên mục tiêu..." onFocus={() => setSelectedId(node.id)} onChange={(e) => handleUpdateNode(node.id, { title: e.target.value })} />
          <button type="button" className="np-add-circle-btn" onClick={(e) => { e.stopPropagation(); handleAddChild(node.id, false); }}>+</button>
          <button type="button" className="np-del-btn" onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}>×</button>
        </div>
        {hasChildren && isOpen && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {node.children.map((child) => renderBranchItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="np" style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column" }}>
      <header style={{ maxWidth: 1360, width: "100%", margin: "0 auto", padding: "16px 28px 6px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <button type="button" className="np-btn" onClick={onBack}>
          <span>←</span>
          <span>Quay lại</span>
        </button>

        <button
          type="button"
          className="np-edit-info-btn"
          onClick={() => onGoToStep2And3(activeStage?.id)}
          title="Chuyển sang Bước 2 & 3 để gán nguồn lực, điều kiện và điểm số"
        >
          <span className="np-edit-info-badge" aria-hidden="true" />
          <span>Chỉnh thông tin</span>
        </button>
      </header>

      <main style={{ maxWidth: 1360, width: "100%", margin: "0 auto", padding: "4px 28px 40px", display: "flex", flexDirection: "column", gap: 28, flex: 1 }}>
        <section style={{ background: C.card, border: `1px solid ${C.lineAlt}`, borderRadius: 14, padding: "12px 20px 14px", boxShadow: "0 2px 14px -8px rgba(27,32,56,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid #eef0f7" }}>
            <span style={{ fontSize: 12.5, color: C.muted, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
              <span style={{ color: C.indigo, fontWeight: 700 }}>↔</span>
              <span>Kéo chuột trái/phải để trượt xem toàn bộ cây mục tiêu</span>
            </span>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <button type="button" className="np-btn sm" onClick={() => treeScrollRef.current?.scrollBy({ left: -280, behavior: "smooth" })}>←</button>
              <button type="button" className="np-btn sm" onClick={() => treeScrollRef.current?.scrollTo({ left: 0, behavior: "smooth" })}>Đầu cây</button>
              <button type="button" className="np-btn sm" onClick={() => treeScrollRef.current?.scrollBy({ left: 280, behavior: "smooth" })}>→</button>
            </div>
          </div>

          <div
            ref={treeScrollRef}
            className={`np-tree-viewport ${isDraggingTree ? "is-dragging" : ""}`}
            onMouseDown={(e) => {
              const el = treeScrollRef.current;
              if (!el) return;
              dragStateRef.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, moved: false };
              setIsDraggingTree(true);
            }}
            onMouseMove={(e) => {
              if (!dragStateRef.current.active) return;
              const el = treeScrollRef.current;
              const delta = e.pageX - el.offsetLeft - dragStateRef.current.startX;
              if (Math.abs(delta) > 4) dragStateRef.current.moved = true;
              if (dragStateRef.current.moved) el.scrollLeft = dragStateRef.current.scrollLeft - delta;
            }}
            onMouseUp={() => { dragStateRef.current.active = false; setIsDraggingTree(false); setTimeout(() => { dragStateRef.current.moved = false; }, 0); }}
            onMouseLeave={() => { dragStateRef.current.active = false; setIsDraggingTree(false); }}
          >
            <svg viewBox={`0 0 ${treeLayout.width} ${treeLayout.height}`} width={treeLayout.width} height={treeLayout.height} style={{ display: "block", margin: "0 auto" }}>
              <line x1={16} y1={treeLayout.axisY} x2={treeLayout.width - 16} y2={treeLayout.axisY} stroke="#7c849d" strokeWidth="1.5" />
              {treeLayout.edges.map((e, idx) => {
                const target = treeLayout.nodeMap[e.to];
                if (!target) return null;
                const source = e.from ? treeLayout.nodeMap[e.from] : null;
                const sx = source ? source.x + source.w : e.sx;
                const sy = source ? source.y : e.sy;
                const cpx = sx + (target.x - sx) * 0.55;
                const isHl = selectedId === e.to || selectedId === e.from;
                return <path key={idx} d={`M ${sx} ${sy} C ${cpx} ${sy}, ${sx + 16} ${target.y}, ${target.x} ${target.y}`} fill="none" stroke={isHl ? C.indigo : "#6a728c"} strokeWidth={isHl ? "1.9" : "1.45"} strokeLinecap="round" />;
              })}
              {treeLayout.nodes.map((n) => {
                const liveNode = findNodeInStages(stages, n.id) || n;
                const t = liveNode.title || "";
                const selected = selectedId === n.id;
                const pick = () => { if (!dragStateRef.current.moved) setSelectedId(n.id); };

                if (n.isRoot) {
                  return (
                    <g key={n.id} style={{ cursor: "pointer" }} onClick={pick}>
                      <rect x={n.x} y={n.y - 31} width={n.w} height={25} rx="7" fill={selected ? C.indigo : "transparent"} />
                      <text x={n.x + n.w / 2} y={n.y - 18} textAnchor="middle" dominantBaseline="central" fontSize="13.5" fontWeight={selected ? "700" : "600"} fill={selected ? "#ffffff" : C.ink}>
                        {shorten(t || "Chặng", 20)}
                      </text>
                    </g>
                  );
                }
                const lineColor = selected ? C.indigo : liveNode.core ? C.teal : "#6a728c";
                return (
                  <g key={n.id} style={{ cursor: "pointer" }} onClick={pick}>
                    <rect x={n.x} y={n.y - 26} width={n.w} height={24} rx="6" fill={selected ? C.indigoSoft : liveNode.core ? C.tealSoft : "transparent"} />
                    <line x1={n.x} y1={n.y} x2={n.x + n.w} y2={n.y} stroke={lineColor} strokeWidth={selected ? "2.1" : "1.45"} />
                    <text x={n.x + 6} y={n.y - 13} dominantBaseline="central" fontSize="13" fontWeight={liveNode.core || selected ? 600 : 500} fill={selected ? C.indigo : C.ink}>
                      {shorten(t)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        <div className="np-bottom">
          <section className="np-bottom-card" style={{ fontSize: 14 }}>
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <h2 style={{ margin: "0 0 3px", fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                    <Square color={C.indigo} />
                    <span>Bước 1:</span>
                  </h2>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5, color: C.text }}>
                    Lặp theo từng chặng ({stages.length}/{MAX_STAGES} chặng):
                  </p>
                </div>
                <button type="button" className="np-btn sm" disabled={stages.length >= MAX_STAGES} onClick={handleAddStage}>
                  {stages.length < MAX_STAGES ? `+ Thêm chặng (${stages.length}/${MAX_STAGES})` : "Tối đa 4 chặng"}
                </button>
              </div>

              <div className="np-tree-scroll">
                {stages.map((stage, stageIdx) => {
                  const isStageOpen = expandedMap[stage.id] !== false;
                  const isStageSel = selectedId === stage.id;
                  return (
                    <div key={stage.id} style={{ background: "#f5f6fb", border: `1px solid ${isStageSel ? C.indigo : "#d9deef"}`, borderRadius: 10, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                      <div onClick={() => setSelectedId(stage.id)} className={`np-tree-row ${isStageSel ? "is-selected" : ""}`}>
                        <button type="button" className="np-mini-icon" onClick={(e) => { e.stopPropagation(); setExpandedMap((p) => ({ ...p, [stage.id]: p[stage.id] === false })); }}>
                          <span style={{ transform: isStageOpen ? "rotate(90deg)" : "none", display: "inline-block" }}>›</span>
                        </button>
                        <span className="np-role-pill" style={{ background: C.indigoSoft, color: C.indigo }}>Chặng {stageIdx + 1}</span>
                        <input type="text" className="np-row-input" style={{ fontWeight: 700, color: C.indigo }} value={stage.title} onChange={(e) => handleUpdateNode(stage.id, { title: e.target.value })} />
                        <button type="button" className="np-add-circle-btn" onClick={(e) => { e.stopPropagation(); handleAddChild(stage.id, false); }}>+</button>
                        {stageIdx > 0 && <button type="button" className="np-del-btn" onClick={(e) => { e.stopPropagation(); handleDeleteNode(stage.id); }}>×</button>}
                      </div>
                      {isStageOpen && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 6 }}>
                          {stage.children.length === 0 ? (
                            <div style={{ padding: "8px 10px", borderRadius: 8, background: "#fff", border: "1px dashed #ccd2ea", color: C.muted, fontSize: 12.5 }}>
                              Chưa có mục tiêu. Nhấn nút <strong>(+)</strong> ở trên để thêm mục tiêu.
                            </div>
                          ) : (
                            stage.children.map((branch) => renderBranchItem(branch, 0))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!activeStage) return;
                handleAddChild(activeStage.id, quickIsCore, quickTitle);
                setQuickTitle("");
              }}
              style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="text" className="np-input" style={{ height: 36, background: "#fff", fontSize: 13.5 }} placeholder={`Thêm mục tiêu vào ${activeStage?.title || "Chặng 1"}...`} value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} />
                <button type="button" onClick={() => setQuickIsCore((v) => !v)} className={`np-role-pill ${quickIsCore ? "is-core" : ""}`} style={{ height: 36, padding: "0 11px" }}>
                  {quickIsCore ? "★ Mấu chốt" : "Mục tiêu"}
                </button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" className="np-btn primary sm" style={{ flex: 1, height: 36 }}>+ Thêm mục tiêu</button>
                <button type="button" className="np-btn teal sm" style={{ height: 36 }} onClick={() => { if (activeStage) { handleAddChild(activeStage.id, true, quickTitle); setQuickTitle(""); } }}>+ Mấu chốt</button>
              </div>
            </form>
          </section>

          <section className="np-bottom-card">
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                    <Square color={C.indigo} />
                    <span>Ghi chú</span>
                  </h2>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.indigo, background: C.indigoSoft, padding: "2px 9px", borderRadius: 999 }}>
                    {shorten(selectedNode?.title || "Chưa nhập", 22)}
                  </span>
                </div>
                {!selectedNode?.isStage && (
                  <button type="button" onClick={() => handleToggleCore(selectedNode.id)} className={`np-role-pill ${selectedNode?.core ? "is-core" : ""}`}>
                    {selectedNode?.core ? "● Mục tiêu mấu chốt" : "○ Đánh dấu mấu chốt"}
                  </button>
                )}
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 6 }}>• TIÊU ĐỀ</label>
                <input ref={titleRef} className="np-input" value={selectedNode?.title || ""} onChange={(e) => handleUpdateNode(selectedNode.id, { title: e.target.value })} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 6 }}>• Ghi chú</label>
                <textarea className="np-input" placeholder="Nhập mô tả chi tiết, tiêu chí hoàn thành..." value={selectedNode?.note || ""} onChange={(e) => handleUpdateNode(selectedNode.id, { note: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 12, borderTop: `1px solid ${C.line}` }}>
              <button type="button" className="np-btn sm" style={{ flex: 1, height: 36 }} onClick={() => handleAddChild(selectedNode.id, false)}>
                + {selectedNode?.isStage ? "Thêm mục tiêu cấp 1" : "Thêm nhánh nhỏ"}
              </button>
              {stages[0]?.id !== selectedNode?.id && (
                <button type="button" className="np-btn danger sm" style={{ height: 36 }} onClick={() => handleDeleteNode(selectedNode.id)}>
                  Xóa
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ============================================================================
   10. MÀN HÌNH 7: GOAL TREE BƯỚC 2 & 3 (4_goal_tree.tsx)
   ============================================================================ */
function getAncestorTrail(root, targetId, trail = []) {
  if (!root) return null;
  const nextTrail = [...trail, root];
  if (root.id === targetId) return nextTrail;
  for (const child of root.children || []) {
    const found = getAncestorTrail(child, targetId, nextTrail);
    if (found) return found;
  }
  return null;
}

function GoalTreeStep2And3Screen({ stages, setStages, initialStageId, onBackToStep1, onCompleteSetup }) {
  const [activeStageId, setActiveStageId] = useState(initialStageId || stages[0]?.id);
  const [branchParentId, setBranchParentId] = useState(initialStageId || stages[0]?.id);
  const [selectedGoalId, setSelectedGoalId] = useState("");

  const activeStage = useMemo(() => stages.find((s) => s.id === activeStageId) || stages[0], [stages, activeStageId]);
  const branchParent = useMemo(() => (activeStage ? findNode(activeStage, branchParentId) || activeStage : null), [activeStage, branchParentId]);
  const ancestorTrail = useMemo(() => {
    if (!activeStage || !branchParent) return [];
    const trail = getAncestorTrail(activeStage, branchParent.id) || [];
    return trail.length > 1 ? trail.slice(1) : [];
  }, [activeStage, branchParent]);

  const currentBranchLevel = ancestorTrail.length + 1;
  const stageTopGoals = useMemo(() => (branchParent?.children || []).slice(0, 3), [branchParent]);
  const selectedGoal = useMemo(() => stageTopGoals.find((g) => g.id === selectedGoalId) || stageTopGoals[0] || null, [stageTopGoals, selectedGoalId]);
  const activeTopGoalId = selectedGoal?.id || null;

  const svgLayout = useMemo(() => {
    const ROOT_X = 24, STEP_X = 185, GOAL_W = 204, ATTR_W = 220, ROW_STEP = 44, TOP_PAD = 34, BOTTOM_PAD = 28;
    const ancestorNodes = [];
    let currentX = 68;
    ancestorTrail.forEach((anc, idx) => {
      ancestorNodes.push({ id: anc.id, label: anc.title || `Cấp ${idx}`, core: !!anc.core, x: currentX, w: 150 });
      currentX += STEP_X;
    });
    const GOAL_X = ancestorTrail.length > 0 ? currentX : 76;
    const ATTR_X = GOAL_X + GOAL_W + 64;
    const totalWidth = Math.max(660, ATTR_X + ATTR_W + 32);

    if (stageTopGoals.length === 0) {
      return { width: totalWidth, height: 220, rootPoint: { x: ROOT_X, y: 110 }, ancestorNodes: [], goalNodes: [], attrNodes: [], edges: [], isEmpty: true };
    }

    let leafCursor = 0;
    const goalNodes = [], attrNodes = [], edges = [];
    stageTopGoals.forEach((goal) => {
      const isExpanded = goal.id === activeTopGoalId;
      const scoreText = String(goal.score || "").trim();
      const displayLabel = scoreText ? `${goal.title || "Mục tiêu"} - ${scoreText}` : goal.title || "Chưa nhập";
      if (isExpanded) {
        const attrs = [
          { id: `${goal.id}_need`, label: goal.condition ? `điều kiện cần: ${shorten(goal.condition, 18)}` : "điều kiện cần", hasValue: !!goal.condition, row: leafCursor++ },
          { id: `${goal.id}_suff`, label: goal.resource ? `điều kiện đủ (${shorten(goal.resource, 14)})` : "điều kiện đủ", hasValue: !!goal.resource, row: leafCursor++ },
          { id: `${goal.id}_due`, label: goal.due ? `thời hạn: ${goal.due}` : "thời hạn", hasValue: !!goal.due, row: leafCursor++ },
        ];
        const goalY = TOP_PAD + ((attrs[0].row + attrs[2].row) / 2) * ROW_STEP;
        goalNodes.push({ id: goal.id, label: displayLabel, core: !!goal.core, x: GOAL_X, y: goalY, w: GOAL_W, isSelected: true });
        attrs.forEach((a) => {
          const ay = TOP_PAD + a.row * ROW_STEP;
          attrNodes.push({ ...a, x: ATTR_X, y: ay, w: ATTR_W });
          edges.push({ sx: GOAL_X + GOAL_W + 10, sy: goalY - 8, tx: ATTR_X, ty: ay, highlighted: true });
        });
      } else {
        const goalY = TOP_PAD + (leafCursor++) * ROW_STEP;
        goalNodes.push({ id: goal.id, label: displayLabel, core: !!goal.core, x: GOAL_X, y: goalY, w: GOAL_W, isSelected: false });
      }
    });

    const rootY = (goalNodes[0].y + goalNodes[goalNodes.length - 1].y) / 2;
    const positionedAncestors = ancestorNodes.map((a) => ({ ...a, y: rootY }));

    if (positionedAncestors.length > 0) {
      edges.unshift({ sx: ROOT_X, sy: rootY, tx: positionedAncestors[0].x, ty: rootY, highlighted: false });
      for (let i = 0; i < positionedAncestors.length - 1; i++) {
        edges.unshift({ sx: positionedAncestors[i].x + positionedAncestors[i].w, sy: rootY, tx: positionedAncestors[i + 1].x, ty: rootY, highlighted: false });
      }
      const lastAnc = positionedAncestors[positionedAncestors.length - 1];
      goalNodes.forEach((gn) => edges.unshift({ sx: lastAnc.x + lastAnc.w, sy: rootY, tx: gn.x, ty: gn.y, highlighted: gn.isSelected }));
    } else {
      goalNodes.forEach((gn) => edges.unshift({ sx: ROOT_X, sy: rootY, tx: gn.x, ty: gn.y, highlighted: gn.isSelected }));
    }

    return { width: totalWidth, height: Math.max(220, TOP_PAD + (leafCursor - 1) * ROW_STEP + BOTTOM_PAD), rootPoint: { x: ROOT_X, y: rootY }, ancestorNodes: positionedAncestors, goalNodes, attrNodes, edges, isEmpty: false };
  }, [stageTopGoals, activeTopGoalId, ancestorTrail]);

  const handlePatchGoal = (goalId, patch) => {
    if (!goalId) return;
    setStages((prev) =>
      prev.map((st) => {
        if (st.id !== activeStage.id) return st;
        if (Object.prototype.hasOwnProperty.call(patch, "score")) {
          const rawStr = String(patch.score ?? "").trim();
          if (rawStr === "") return updateNodeInTree(st, goalId, { score: "" });
          const numeric = Math.max(0, parseFloat(rawStr) || 0);
          const otherScoreSum = stageTopGoals.reduce((sum, g) => (g.id === goalId ? sum : sum + (parseFloat(g.score) || 0)), 0);
          const clamped = Math.min(numeric, Math.max(0, Math.round((100 - otherScoreSum) * 100) / 100));
          return updateNodeInTree(st, goalId, { score: String(clamped) });
        }
        return updateNodeInTree(st, goalId, patch);
      })
    );
  };

  const handleDrillDownBranch = (goal) => {
    if (!goal) return;
    const existing = goal.children || [];
    if (existing.length === 0) {
      const nextLevel = currentBranchLevel + 1;
      const newChildId = `${goal.id}_sub_${Date.now().toString(36).slice(-4)}`;
      const defaultChild = { id: newChildId, title: nextLevel === 2 ? "Mục tiêu vừa 2" : `Mục tiêu nhỏ ${nextLevel}`, note: "", core: false, score: "100", due: "", limitUnit: "week", resource: "", condition: "", children: [] };
      setStages((prev) => prev.map((st) => (st.id === activeStage.id ? updateNodeInTree(st, goal.id, { children: [defaultChild] }) : st)));
      setBranchParentId(goal.id);
      setSelectedGoalId(newChildId);
    } else {
      setBranchParentId(goal.id);
      setSelectedGoalId(existing[0].id);
    }
  };

  const totalStageScore = Math.min(100, Math.round(stageTopGoals.reduce((acc, g) => acc + (parseFloat(g.score) || 0), 0) * 100) / 100);
  const remainingScore = Math.max(0, Math.round((100 - totalStageScore) * 100) / 100);

  return (
    <div className="og" style={{ background: "#fff", display: "flex", flexDirection: "column" }}>
      <header style={{ maxWidth: 1360, width: "100%", margin: "0 auto", padding: "10px 24px 4px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, flex: "none" }}>
        <button type="button" className="og-btn" onClick={onBackToStep1}>
          <span>←</span>
          <span>Quay lại Bước 1</span>
        </button>

        <div role="tablist" style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {stages.slice(0, MAX_STAGES).map((st, idx) => (
            <button
              key={st.id}
              type="button"
              className={`og-stage-tab ${st.id === activeStage?.id ? "is-active" : ""}`}
              onClick={() => { setActiveStageId(st.id); setBranchParentId(st.id); setSelectedGoalId(st.children?.[0]?.id || ""); }}
            >
              {st.title || `Chặng ${idx + 1}`}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="og-btn"
          style={{ background: C.indigo, borderColor: C.indigo, color: "#fff" }}
          onClick={onCompleteSetup}
        >
          Hoàn tất & Vào dự án →
        </button>
      </header>

      <main style={{ maxWidth: 1360, width: "100%", margin: "0 auto", padding: "6px 24px 16px", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <div className="og-workspace">
          <section className="og-tree-section">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, paddingBottom: 8, borderBottom: "1px solid #eef0f7" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Square color={C.indigo} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>
                  {activeStage?.title}
                  {ancestorTrail.map((a) => ` › ${shorten(a.title, 18)}`).join("")}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: totalStageScore === 100 ? "#0b8579" : C.indigo, background: totalStageScore === 100 ? C.tealSoft : C.indigoSoft, padding: "2px 9px", borderRadius: 999 }}>
                  Cấp {currentBranchLevel}: {stageTopGoals.length}/3 mục tiêu · {totalStageScore}%/100%
                </span>
              </div>
              {ancestorTrail.length > 0 && (
                <button type="button" className="og-btn" style={{ height: 28, fontSize: 12 }} onClick={() => {
                  const parentOfCurrent = ancestorTrail.length >= 2 ? ancestorTrail[ancestorTrail.length - 2].id : activeStage.id;
                  setBranchParentId(parentOfCurrent);
                  setSelectedGoalId(branchParent.id);
                }}>
                  ↑ Quay lại cấp {currentBranchLevel - 1}
                </button>
              )}
            </div>

            <div className="og-tree-scroll">
              {svgLayout.isEmpty ? (
                <div style={{ minHeight: 160, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 13.5 }}>
                  Chặng này chưa có mục tiêu. Hãy quay lại Bước 1 để thêm mục tiêu.
                </div>
              ) : (
                <svg viewBox={`0 0 ${svgLayout.width} ${svgLayout.height}`} width={svgLayout.width} height={svgLayout.height} style={{ display: "block", margin: "0 auto", maxHeight: 220 }}>
                  <line x1={6} y1={svgLayout.rootPoint.y} x2={svgLayout.rootPoint.x} y2={svgLayout.rootPoint.y} stroke="#7c849d" strokeWidth="1.5" />
                  <circle cx={svgLayout.rootPoint.x} cy={svgLayout.rootPoint.y} r="3.5" fill={C.indigo} />
                  {svgLayout.edges.map((e, idx) => {
                    const cpx = e.sx + (e.tx - e.sx) * 0.52;
                    return <path key={idx} d={`M ${e.sx} ${e.sy} C ${cpx} ${e.sy}, ${e.sx + 16} ${e.ty}, ${e.tx} ${e.ty}`} fill="none" stroke={e.highlighted ? C.indigo : "#6a728c"} strokeWidth={e.highlighted ? "1.8" : "1.4"} strokeLinecap="round" />;
                  })}
                  {svgLayout.ancestorNodes.map((an) => (
                    <g key={an.id} className="og-svg-node" onClick={() => setBranchParentId(an.id)}>
                      <rect x={an.x} y={an.y - 24} width={an.w} height={22} rx="6" fill={an.core ? C.tealSoft : "#f4f6fc"} />
                      <line x1={an.x} y1={an.y} x2={an.x + an.w} y2={an.y} stroke={an.core ? C.teal : "#6a728c"} strokeWidth="1.5" />
                      <text x={an.x + 8} y={an.y - 12} dominantBaseline="central" fontSize="12.5" fontWeight="600" fill={C.ink}>{shorten(an.label, 19)}</text>
                    </g>
                  ))}
                  {svgLayout.goalNodes.map((gn) => (
                    <g key={gn.id} className="og-svg-node" onClick={() => setSelectedGoalId(gn.id)}>
                      <rect x={gn.x} y={gn.y - 26} width={gn.w} height={24} rx="6" fill={gn.isSelected ? C.indigoSoft : gn.core ? C.tealSoft : "transparent"} />
                      <line x1={gn.x} y1={gn.y} x2={gn.x + gn.w} y2={gn.y} stroke={gn.isSelected ? C.indigo : gn.core ? C.teal : "#6a728c"} strokeWidth={gn.isSelected ? "2.1" : "1.5"} />
                      <text x={gn.x + 8} y={gn.y - 13} dominantBaseline="central" fontSize="13.5" fontWeight={gn.isSelected || gn.core ? "700" : "500"} fill={gn.isSelected ? C.indigo : C.ink}>
                        {shorten(gn.label, 27)}
                      </text>
                    </g>
                  ))}
                  {svgLayout.attrNodes.map((an) => (
                    <g key={an.id}>
                      <line x1={an.x} y1={an.y} x2={an.x + an.w} y2={an.y} stroke={an.hasValue ? C.teal : "#7d849d"} strokeWidth="1.4" />
                      <text x={an.x + 8} y={an.y - 11} dominantBaseline="central" fontSize="13" fontWeight={an.hasValue ? "600" : "500"} fill={an.hasValue ? C.ink : C.text}>{an.label}</text>
                    </g>
                  ))}
                </svg>
              )}
            </div>
          </section>

          <div className="og-bottom-grid">
            <section className="og-side-panel">
              <div style={{ flex: "none" }}>
                <h2 style={{ margin: "0 0 2px", fontSize: 15.5, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                  <Square color={C.indigo} />
                  <span>Bước 2:</span>
                </h2>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: C.text }}>
                  Gán điều kiện đủ (nguồn lực), điều kiện cần, thời hạn & điểm số ({stageTopGoals.length}/3 mục tiêu)
                </p>
              </div>

              <div className="og-step2-scroll">
                {stageTopGoals.map((goal, idx) => {
                  const isSel = selectedGoal?.id === goal.id;
                  const currentGoalScore = parseFloat(goal.score) || 0;
                  const maxAllowedForGoal = Math.min(100, Math.round((currentGoalScore + remainingScore) * 100) / 100);
                  return (
                    <div key={goal.id} onClick={() => setSelectedGoalId(goal.id)} className={`og-goal-card ${isSel ? "is-selected" : ""}`}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", height: 22, padding: "0 8px", borderRadius: 999, background: goal.core ? C.tealSoft : C.indigoSoft, color: goal.core ? "#0b8579" : C.indigo, fontSize: 11.5, fontWeight: 700 }}>
                            {goal.core ? `★ Mấu chốt ${idx + 1}` : `Mục tiêu ${idx + 1}`}
                          </span>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {goal.title || `Mục tiêu ${idx + 1}`}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button type="button" className="og-btn" style={{ height: 26, padding: "0 9px", fontSize: 11.5 }} onClick={(e) => { e.stopPropagation(); handleDrillDownBranch(goal); }}>
                            Nhánh con ({goal.children?.length || 0}) ›
                          </button>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <input
                              type="number"
                              min="0"
                              max={maxAllowedForGoal}
                              className="og-input"
                              style={{ width: 62, height: 28, textAlign: "center", fontWeight: 700, fontSize: 13 }}
                              value={goal.score ?? ""}
                              onChange={(e) => handlePatchGoal(goal.id, { score: e.target.value })}
                            />
                            <span style={{ fontSize: 12, fontWeight: 700, color: C.muted }}>%</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                        <div>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Điều kiện đủ (nguồn lực)</label>
                          <input className="og-input" placeholder="Tài liệu, công cụ..." value={goal.resource || ""} onChange={(e) => handlePatchGoal(goal.id, { resource: e.target.value })} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Thời hạn</label>
                          <input className="og-input" placeholder="VD: 2 tuần, 30/11..." value={goal.due || ""} onChange={(e) => handlePatchGoal(goal.id, { due: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Điều kiện cần</label>
                        <input className="og-input" placeholder="Tiêu chí tiên quyết cần đạt trước..." value={goal.condition || ""} onChange={(e) => handlePatchGoal(goal.id, { condition: e.target.value })} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="og-side-panel">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <h2 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                  <Square color={C.indigo} />
                  <span>Bước 3:</span>
                </h2>
                {selectedGoal && (
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: C.indigo, background: C.indigoSoft, padding: "2px 9px", borderRadius: 999 }}>
                    {shorten(selectedGoal.title || "Mục tiêu", 22)}
                  </span>
                )}
              </div>

              {selectedGoal && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>→ Điều kiện cần & Ghi chú thực thi</label>
                    <textarea className="og-input" style={{ minHeight: 72 }} placeholder="Mô tả chi tiết điều kiện cần và cách triển khai..." value={selectedGoal.note || ""} onChange={(e) => handlePatchGoal(selectedGoal.id, { note: e.target.value })} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>→ Giới hạn chu kỳ (Limit)</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[{ id: "day", label: "Ngày" }, { id: "week", label: "Tuần" }, { id: "month", label: "Tháng" }].map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          className="og-btn"
                          style={{ flex: 1 }}
                          aria-checked={(selectedGoal.limitUnit || "week") === u.id}
                          onClick={() => handlePatchGoal(selectedGoal.id, { limitUnit: u.id })}
                        >
                          {u.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================================
   11. MÀN HÌNH 8: CALENDAR (11_calendar.tsx)
   ============================================================================ */
const calPad = (n) => String(n).padStart(2, "0");
const calFmtDate = (d) => `${calPad(d.getDate())}/${calPad(d.getMonth() + 1)}/${d.getFullYear()}`;
const calIsoDate = (d) => `${d.getFullYear()}-${calPad(d.getMonth() + 1)}-${calPad(d.getDate())}`;
const calMonthLabel = (d) => `Tháng ${calPad(d.getMonth() + 1)}/${d.getFullYear()}`;
const calAddDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

function getWeekDates(base) {
  const day = base.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const mon = calAddDays(base, diffToMon);
  return Array.from({ length: 7 }, (_, i) => calAddDays(mon, i));
}

function parseTimeToHour(str, fallback = 9) {
  if (!str) return fallback;
  const m = String(str).match(/(\d{1,2})(?::(\d{1,2}))?/);
  if (!m) return fallback;
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
  const min = m[2] ? Math.min(59, Math.max(0, parseInt(m[2], 10))) : 0;
  return h + min / 60;
}

const WEEK_DAY_NAMES = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 7);
const HOUR_HEIGHT = 44;

function CalendarScreen({ onBackHome }) {
  const [sgs, setSgs] = useState(INITIAL_CALENDAR_SGS);
  const [selected, setSelected] = useState(0);
  const [date, setDate] = useState(new Date(2026, 10, 16));
  const [forms, setForms] = useState({});
  const [savedNotice, setSavedNotice] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [editingSgId, setEditingSgId] = useState(null);
  const [editingSgText, setEditingSgText] = useState("");
  const [draggingSgId, setDraggingSgId] = useState(null);
  const [dropSlotKey, setDropSlotKey] = useState(null);
  const [sgSavedNotice, setSgSavedNotice] = useState(false);

  const [events, setEvents] = useState(() => {
    const mon = getWeekDates(new Date(2026, 10, 16));
    return [
      { id: "ev-1", sgId: 0, title: "SG 1 - small goal", dateKey: calIsoDate(mon[0]), startHour: 9, duration: 1.5, place: "Bàn làm việc", method: "Tập trung sâu" },
      { id: "ev-2", sgId: 1, title: "SG 2 - small goal", dateKey: calIsoDate(mon[2]), startHour: 14, duration: 2, place: "Phòng họp / Online", method: "Rà soát tiến độ" },
    ];
  });

  const activeSg = sgs.find((s) => s.id === selected) || sgs[0];
  const form = forms[activeSg?.id] || EMPTY_CAL_FORM;
  const setField = (k) => (e) => {
    setForms((f) => ({ ...f, [activeSg.id]: { ...form, [k]: e.target.value } }));
    setSavedNotice(false);
  };

  const addSg = () => {
    const n = sgs.length + 1;
    const newId = sgs.length ? Math.max(...sgs.map((s) => s.id)) + 1 : 0;
    setSgs((list) => [...list, { id: newId, bar: `SG ${n} (P name/ Chặng/ )`, btn: `SG ${n} - small goal` }]);
    setSelected(newId);
    setShowOptional(false);
  };

  const saveEditSg = () => {
    if (editingSgId === null) return;
    const clean = editingSgText.trim();
    if (clean) {
      setSgs((list) => list.map((item) => (item.id === editingSgId ? { ...item, btn: clean } : item)));
      setEvents((evs) => evs.map((ev) => (ev.sgId === editingSgId ? { ...ev, title: clean } : ev)));
    }
    setEditingSgId(null);
  };

  const deleteSg = (sgId, e) => {
    e.stopPropagation();
    if (sgs.length <= 1) return;
    setSgs((list) => {
      const next = list.filter((item) => item.id !== sgId);
      if (selected === sgId && next.length) setSelected(next[0].id);
      return next;
    });
    setEvents((evs) => evs.filter((ev) => ev.sgId !== sgId));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const startH = parseTimeToHour(form.start, 9);
    const dueH = parseTimeToHour(form.due, startH + 1);
    const dur = Math.max(0.5, dueH > startH ? dueH - startH : 1);
    const targetDateKey = calIsoDate(date);
    setEvents((prev) => {
      const idx = prev.findIndex((ev) => ev.sgId === activeSg.id && ev.dateKey === targetDateKey);
      const payload = { id: idx >= 0 ? prev[idx].id : `ev-${Date.now()}`, sgId: activeSg.id, title: activeSg.btn, dateKey: targetDateKey, startHour: startH, duration: dur, place: form.place, method: form.method };
      if (idx >= 0) { const copy = [...prev]; copy[idx] = payload; return copy; }
      return [...prev, payload];
    });
    setSavedNotice(true);
  };

  const weekDays = useMemo(() => getWeekDates(date), [date]);
  const todayKey = calIsoDate(new Date(2026, 10, 16));

  const handleDropOnCell = (dayObj, hour, e) => {
    e.preventDefault();
    setDropSlotKey(null);
    const rawSgId = e.dataTransfer.getData("text/plain");
    const sgId = rawSgId !== "" ? Number(rawSgId) : draggingSgId;
    setDraggingSgId(null);
    if (sgId === null || Number.isNaN(sgId)) return;
    const sgObj = sgs.find((s) => s.id === sgId);
    if (!sgObj) return;
    setSelected(sgId);
    setDate(dayObj);
    setEvents((prev) => [...prev, { id: `ev-${Date.now()}`, sgId: sgObj.id, title: sgObj.btn, dateKey: calIsoDate(dayObj), startHour: hour, duration: 1, place: (forms[sgId] || EMPTY_CAL_FORM).place || "", method: (forms[sgId] || EMPTY_CAL_FORM).method || "" }]);
  };

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100vh", overflow: "hidden", background: C.page }}>
      <header style={{ height: 48, flex: "none", background: C.ink, color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
          <span>Calendar</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!leftOpen && <button type="button" className="np-btn sm" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }} onClick={() => setLeftOpen(true)}>+ Mở Danh sách SG</button>}
          {!rightOpen && <button type="button" className="np-btn sm" style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }} onClick={() => setRightOpen(true)}>Mở Chi tiết SG +</button>}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Cột trái: Danh sách SG */}
        {leftOpen ? (
          <aside style={{ width: 280, flex: "none", display: "flex", flexDirection: "column", background: "#f2f4fb", borderRight: `1px solid ${C.line}`, overflow: "hidden" }}>
            <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 14px 10px", borderBottom: `1px solid ${C.line}` }}>
              <button type="button" className="np-cal-back-btn" onClick={onBackHome} title="Quay lại Home">
                <Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} size={17} stroke="#fff" />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  type="button"
                  className="np-sg-save"
                  disabled={editingSgId === null}
                  onClick={() => { saveEditSg(); setSgSavedNotice(true); setTimeout(() => setSgSavedNotice(false), 1800); }}
                >
                  {sgSavedNotice ? "Đã lưu" : "Lưu SG"}
                </button>
                <button type="button" className="np-toggle-btn" onClick={() => setLeftOpen(false)}>
                  <Icon d={["M15 18l-6-6 6-6"]} size={15} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "14px 12px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
              <div style={{ width: "100%", fontSize: 11.5, color: C.muted, textAlign: "center", marginBottom: 2 }}>
                Kéo thẻ SG thả vào lịch để lên kế hoạch
              </div>
              {sgs.map((sg, idx) => {
                const clr = EVENT_COLORS[idx % EVENT_COLORS.length];
                const isEditing = editingSgId === sg.id;
                return (
                  <div
                    key={sg.id}
                    role="button"
                    tabIndex={0}
                    draggable={!isEditing}
                    onDragStart={(e) => { setDraggingSgId(sg.id); e.dataTransfer.setData("text/plain", String(sg.id)); }}
                    onDragEnd={() => { setDraggingSgId(null); setDropSlotKey(null); }}
                    className={`np-sg-pill ${draggingSgId === sg.id ? "dragging" : ""}`}
                    aria-pressed={selected === sg.id}
                    onClick={() => { if (!isEditing) { setSelected(sg.id); setSavedNotice(false); } }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: clr.border, flex: "none" }} />
                      {isEditing ? (
                        <input
                          value={editingSgText}
                          onChange={(e) => setEditingSgText(e.target.value)}
                          onBlur={saveEditSg}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEditSg(); }}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: "100%", height: 26, border: `1px solid ${C.indigo}`, borderRadius: 6, padding: "0 6px", fontSize: 13 }}
                        />
                      ) : (
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sg.btn}</span>
                      )}
                    </div>
                    {!isEditing && (
                      <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 4 }}>
                        <button type="button" className="np-mini-action" onClick={(e) => { e.stopPropagation(); setEditingSgId(sg.id); setEditingSgText(sg.btn); }}>
                          <Icon d={["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"]} size={13} />
                        </button>
                        {sgs.length > 1 && (
                          <button type="button" className="np-mini-action danger" onClick={(e) => deleteSg(sg.id, e)}>
                            <Icon d={["M18 6L6 18", "M6 6l12 12"]} size={13} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <button type="button" className="np-add-sg" onClick={addSg}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>+</span>
                <span>Thêm SG</span>
              </button>
            </div>
          </aside>
        ) : (
          <div style={{ width: 46, flex: "none", background: "#f2f4fb", borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, gap: 10 }}>
            <button type="button" className="np-cal-back-btn" style={{ width: 32, height: 32 }} onClick={onBackHome}><Icon d={["M19 12H5", "M12 19l-7-7 7-7"]} size={15} stroke="#fff" /></button>
            <button type="button" className="np-toggle-btn" onClick={() => setLeftOpen(true)}><Icon d={["M9 18l6-6-6-6"]} size={15} /></button>
          </div>
        )}

        {/* Cột giữa: Lịch tuần */}
        <section style={{ flex: 1, minWidth: 320, background: C.card, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: "none", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Square color={C.indigo} />
              <span style={{ fontSize: 16, fontWeight: 700, color: C.ink }}>{calMonthLabel(date)}</span>
              <button type="button" className="np-btn sm" style={{ height: 28, fontSize: 12 }} onClick={() => setDate(new Date(2026, 10, 16))}>Hôm nay</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button type="button" className="np-icon-btn" style={{ width: 28, height: 28 }} onClick={() => setDate((d) => calAddDays(d, -7))}>
                <Icon d={["M15 6l-6 6 6 6"]} size={14} />
              </button>
              <span style={{ minWidth: 92, textAlign: "center", fontSize: 13.5, fontWeight: 600, color: C.ink }}>{calFmtDate(date)}</span>
              <button type="button" className="np-icon-btn" style={{ width: 28, height: 28 }} onClick={() => setDate((d) => calAddDays(d, 7))}>
                <Icon d={["M9 6l6 6-6 6"]} size={14} />
              </button>
            </div>
          </div>

          <div style={{ flex: "none", display: "grid", gridTemplateColumns: "54px repeat(7, minmax(0, 1fr))", borderBottom: `1px solid ${C.line}`, background: C.field }}>
            <div style={{ padding: "8px 4px", fontSize: 11, color: C.muted, textAlign: "center", borderRight: `1px solid ${C.line}` }}>GMT+7</div>
            {weekDays.map((dObj, i) => {
              const iso = calIsoDate(dObj);
              const isSelectedDay = iso === calIsoDate(date);
              const isToday = iso === todayKey;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setDate(dObj)}
                  style={{
                    border: 0, borderRight: i < 6 ? `1px solid ${C.line}` : 0,
                    background: isSelectedDay ? C.indigoSoft : "transparent",
                    padding: "6px 4px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  }}
                >
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: isSelectedDay ? C.indigo : C.muted }}>{WEEK_DAY_NAMES[i]}</span>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: isToday ? C.indigo : "transparent", color: isToday ? "#fff" : isSelectedDay ? C.indigo : C.ink }}>
                    {dObj.getDate()}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "54px repeat(7, minmax(0, 1fr))", position: "relative" }}>
              <div>
                {HOURS.map((h) => (
                  <div key={h} style={{ height: HOUR_HEIGHT, borderBottom: `1px solid ${C.line}`, borderRight: `1px solid ${C.line}`, padding: "2px 6px 0 0", textAlign: "right", fontSize: 11, color: C.muted }}>
                    {calPad(h)}:00
                  </div>
                ))}
              </div>

              {weekDays.map((dObj, dayIdx) => {
                const iso = calIsoDate(dObj);
                const dayEvents = events.filter((ev) => ev.dateKey === iso);
                return (
                  <div key={iso} style={{ position: "relative", borderRight: dayIdx < 6 ? `1px solid ${C.line}` : 0 }}>
                    {HOURS.map((h) => {
                      const slotId = `${iso}-${h}`;
                      const isOver = dropSlotKey === slotId;
                      return (
                        <div
                          key={h}
                          onDragOver={(e) => { e.preventDefault(); if (dropSlotKey !== slotId) setDropSlotKey(slotId); }}
                          onDragLeave={() => { if (dropSlotKey === slotId) setDropSlotKey(null); }}
                          onDrop={(e) => handleDropOnCell(dObj, h, e)}
                          style={{ height: HOUR_HEIGHT, borderBottom: `1px solid ${C.line}`, background: isOver ? C.indigoSoft : "transparent" }}
                        />
                      );
                    })}

                    {dayEvents.map((ev) => {
                      const sgIdx = sgs.findIndex((s) => s.id === ev.sgId);
                      const clr = EVENT_COLORS[(sgIdx >= 0 ? sgIdx : 0) % EVENT_COLORS.length];
                      const clampedStart = Math.max(7, Math.min(22, ev.startHour));
                      const topPx = (clampedStart - 7) * HOUR_HEIGHT + 2;
                      const heightPx = Math.max(24, ev.duration * HOUR_HEIGHT - 4);
                      return (
                        <div
                          key={ev.id}
                          onClick={() => { setSelected(ev.sgId); setDate(dObj); }}
                          style={{
                            position: "absolute", left: 3, right: 3, top: topPx, height: heightPx,
                            background: clr.bg, borderLeft: `3.5px solid ${clr.border}`, borderRadius: 7,
                            padding: "3px 6px", color: clr.text, fontSize: 11.5, fontWeight: 600, overflow: "hidden", cursor: "pointer", zIndex: 2,
                          }}
                        >
                          <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.title}</div>
                          <div style={{ fontSize: 10.5, opacity: 0.8 }}>{calPad(Math.floor(clampedStart))}:00</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cột phải: Form chi tiết SG */}
        {rightOpen ? (
          <section style={{ width: 390, flex: "none", background: C.rightCol, overflowY: "auto", padding: "18px 20px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 14 }}>
              <button type="button" className="np-toggle-btn" onClick={() => setRightOpen(false)}>
                <Icon d={["M9 18l6-6-6-6"]} size={15} />
              </button>
              <div style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, padding: "8px 12px", textAlign: "center", fontWeight: 600, fontSize: 13.5, color: C.ink }}>
                {activeSg?.bar}
              </div>
            </div>

            <form onSubmit={handleSave} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                  <Square color={C.teal} /> Chi tiết kế hoạch
                </span>
                <button type="submit" className="np-save">{savedNotice ? "Đã lưu" : "Lưu"}</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div>
                  <label className="np-label">Start time</label>
                  <input className="np-input" style={{ height: 36 }} placeholder="09:00" value={form.start} onChange={setField("start")} />
                </div>
                <div>
                  <label className="np-label">Due time</label>
                  <input className="np-input" style={{ height: 36 }} placeholder="10:30" value={form.due} onChange={setField("due")} />
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="np-label">Yếu tố hàng đầu</label>
                <input className="np-input" style={{ height: 36 }} placeholder="Chưa nhập" value={form.top} onChange={setField("top")} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <button type="button" className="np-opt-toggle" aria-expanded={showOptional} onClick={() => setShowOptional((v) => !v)}>
                  <span>Phương pháp · Công cụ · Địa điểm</span>
                  <span>{showOptional ? "▲" : "▼"}</span>
                </button>
                {showOptional && (
                  <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: C.field, border: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div><label className="np-label">Phương pháp</label><input className="np-input" style={{ height: 34, background: "#fff" }} value={form.method} onChange={setField("method")} /></div>
                    <div><label className="np-label">Công cụ</label><input className="np-input" style={{ height: 34, background: "#fff" }} value={form.tool} onChange={setField("tool")} /></div>
                    <div><label className="np-label">Địa điểm</label><input className="np-input" style={{ height: 34, background: "#fff" }} value={form.place} onChange={setField("place")} /></div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label className="np-label">Ghi chú khác</label>
                <input className="np-input" style={{ height: 36 }} placeholder="Chưa nhập" value={form.other} onChange={setField("other")} />
              </div>

              <div>
                <label className="np-label">Repeat</label>
                <input className="np-input" style={{ height: 36 }} placeholder="Không lặp / Hằng ngày / Hằng tuần" value={form.repeat} onChange={setField("repeat")} />
              </div>
            </form>
          </section>
        ) : (
          <div style={{ width: 46, flex: "none", background: C.rightCol, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14 }}>
            <button type="button" className="np-toggle-btn" onClick={() => setRightOpen(true)}><Icon d={["M15 18l-6-6 6-6"]} size={15} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   12. MÀN HÌNH 9: WIDGET SUITE (8_widget_suite.tsx)
   ============================================================================ */
function WidgetSuiteScreen({ onBackHome }) {
  const [tab, setTab] = useState("today");
  const [goals, setGoals] = useState(INITIAL_WIDGET_GOALS);
  const [done, setDone] = useState({});
  const [details, setDetails] = useState({});
  const [notes, setNotes] = useState(INITIAL_WIDGET_NOTES);
  const [addingGoal, setAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [modal, setModal] = useState(null);
  const [goalDraft, setGoalDraft] = useState(EMPTY_WIDGET_DETAIL);
  const [dataDraft, setDataDraft] = useState(EMPTY_WIDGET_DATA);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [newIndRow, setNewIndRow] = useState({ date: "", s1: "", s2: "", s3: "" });
  const [newResRow, setNewResRow] = useState({ date: "", s1: "", s3: "" });

  const todayList = goals.filter((g) => !done[g.id]);
  const doneList = goals.filter((g) => done[g.id]);
  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const openGoal = (g) => {
    setGoalDraft({ ...EMPTY_WIDGET_DETAIL, ...details[g.id] });
    setModal({ type: "goal", id: g.id, title: g.t });
  };
  const saveGoalDetail = (e) => {
    e.preventDefault();
    setDetails((d) => ({ ...d, [modal.id]: goalDraft }));
    setModal(null);
  };
  const openAddData = () => {
    setDataDraft({ ...EMPTY_WIDGET_DATA, title: `Data ${notes.length + 1}` });
    setModal({ type: "data" });
  };
  const saveData = (e) => {
    e.preventDefault();
    const t = dataDraft.title.trim() || `Data ${notes.length + 1}`;
    const nextId = `n${Date.now()}`;
    setNotes((ns) => [...ns, { id: nextId, title: t, ...dataDraft, indicators: [], results: [] }]);
    setModal(null);
    setActiveNoteId(nextId);
  };
  const createGoal = (e) => {
    e.preventDefault();
    const t = newGoal.trim();
    if (t) setGoals((gs) => [...gs, { id: `g${Date.now()}`, t }]);
    setNewGoal("");
    setAddingGoal(false);
  };

  const addIndicatorRow = (e) => {
    e.preventDefault();
    if (!activeNote) return;
    const todayStr = new Date().toLocaleDateString("vi-VN");
    setNotes((ns) =>
      ns.map((n) =>
        n.id === activeNote.id
          ? { ...n, indicators: [...(n.indicators || []), { date: newIndRow.date.trim() || todayStr, s1: Number(newIndRow.s1) || 0, s2: Number(newIndRow.s2) || 0, s3: Number(newIndRow.s3) || 0 }] }
          : n
      )
    );
    setNewIndRow({ date: "", s1: "", s2: "", s3: "" });
  };

  const addResultRow = (e) => {
    e.preventDefault();
    if (!activeNote) return;
    const todayStr = new Date().toLocaleDateString("vi-VN");
    setNotes((ns) =>
      ns.map((n) =>
        n.id === activeNote.id
          ? { ...n, results: [...(n.results || []), { date: newResRow.date.trim() || todayStr, s1: Number(newResRow.s1) || 0, s3: Number(newResRow.s3) || 0 }] }
          : n
      )
    );
    setNewResRow({ date: "", s1: "", s3: "" });
  };

  const renderDataVisualizer = (note) => {
    const ind = note.indicators || [];
    const res = note.results || [];
    const maxS1 = Math.max(10, ...ind.map((r) => r.s1));
    const maxS2 = Math.max(100, ...ind.map((r) => r.s2));

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingBottom: 10, borderBottom: `1px solid ${C.line}` }}>
          <button type="button" className="np-wback-btn" onClick={() => setActiveNoteId(null)}>
            <Icon d={["M15 6l-6 6 6 6"]} size={15} />
            Danh sách Data
          </button>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note.title}</span>
        </div>

        <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", background: C.field }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: C.ink }}>Biểu đồ trực quan</span>
            <span style={{ fontSize: 12, color: C.muted }}>{ind.length} mốc</span>
          </div>
          {ind.length === 0 ? (
            <p className="np-note" style={{ margin: "12px 0", textAlign: "center" }}>Chưa có dữ liệu.</p>
          ) : (
            <svg viewBox="0 0 360 155" style={{ width: "100%", height: "auto", display: "block" }}>
              {ind.map((r, i) => {
                const slotW = 304 / ind.length;
                const cx = 36 + i * slotW + slotW / 2;
                const h1 = (r.s1 / maxS1) * 102;
                const h2 = (r.s2 / maxS2) * 102;
                return (
                  <g key={i}>
                    <rect x={cx - 11} y={124 - h1} width="10" height={Math.max(2, h1)} rx="3" fill={C.indigo} />
                    <rect x={cx + 1} y={124 - h2} width="10" height={Math.max(2, h2)} rx="3" fill={C.teal} />
                    <text x={cx} y={142} textAnchor="middle" fontSize="10" fill={C.muted}>{r.date.slice(0, 5)}</text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", background: "#fff" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 8 }}>Bảng chỉ số</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.field, color: C.muted, textAlign: "left" }}>
                <th style={{ padding: "7px 8px" }}>Date</th>
                <th style={{ padding: "7px 8px" }}>Status 1</th>
                <th style={{ padding: "7px 8px" }}>Status 2</th>
                <th style={{ padding: "7px 8px" }}>Status 3</th>
              </tr>
            </thead>
            <tbody>
              {ind.map((r, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ padding: "7px 8px", fontWeight: 500 }}>{r.date}</td>
                  <td style={{ padding: "7px 8px", color: C.indigo, fontWeight: 600 }}>{r.s1}</td>
                  <td style={{ padding: "7px 8px", color: C.teal, fontWeight: 600 }}>{r.s2}</td>
                  <td style={{ padding: "7px 8px", color: C.amber, fontWeight: 600 }}>{r.s3}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={addIndicatorRow} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr 1fr auto", gap: 6, marginTop: 10 }}>
            <input className="np-input" style={{ height: 32, padding: "0 8px", fontSize: 12.5 }} placeholder="Ngày" value={newIndRow.date} onChange={(e) => setNewIndRow({ ...newIndRow, date: e.target.value })} />
            <input className="np-input" style={{ height: 32, padding: "0 8px", fontSize: 12.5 }} type="number" step="any" placeholder="S1" value={newIndRow.s1} onChange={(e) => setNewIndRow({ ...newIndRow, s1: e.target.value })} />
            <input className="np-input" style={{ height: 32, padding: "0 8px", fontSize: 12.5 }} type="number" step="any" placeholder="S2" value={newIndRow.s2} onChange={(e) => setNewIndRow({ ...newIndRow, s2: e.target.value })} />
            <input className="np-input" style={{ height: 32, padding: "0 8px", fontSize: 12.5 }} type="number" step="any" placeholder="S3" value={newIndRow.s3} onChange={(e) => setNewIndRow({ ...newIndRow, s3: e.target.value })} />
            <button type="submit" className="np-btn primary sm" style={{ height: 32, padding: "0 10px" }}>+</button>
          </form>
        </div>

        <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: "12px 14px", background: "#fff" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: C.ink, marginBottom: 8 }}>Bảng kết quả</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.field, color: C.muted, textAlign: "left" }}>
                <th style={{ padding: "7px 8px" }}>Date</th>
                <th style={{ padding: "7px 8px" }}>Status 1</th>
                <th style={{ padding: "7px 8px" }}>Status 3</th>
              </tr>
            </thead>
            <tbody>
              {res.map((r, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td style={{ padding: "7px 8px", fontWeight: 500 }}>{r.date}</td>
                  <td style={{ padding: "7px 8px", color: C.teal, fontWeight: 600 }}>{r.s1}</td>
                  <td style={{ padding: "7px 8px", color: C.coral, fontWeight: 600 }}>{r.s3}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={addResultRow} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr auto", gap: 6, marginTop: 10 }}>
            <input className="np-input" style={{ height: 32, padding: "0 8px", fontSize: 12.5 }} placeholder="Ngày" value={newResRow.date} onChange={(e) => setNewResRow({ ...newResRow, date: e.target.value })} />
            <input className="np-input" style={{ height: 32, padding: "0 8px", fontSize: 12.5 }} type="number" step="any" placeholder="S1" value={newResRow.s1} onChange={(e) => setNewResRow({ ...newResRow, s1: e.target.value })} />
            <input className="np-input" style={{ height: 32, padding: "0 8px", fontSize: 12.5 }} type="number" step="any" placeholder="S3" value={newResRow.s3} onChange={(e) => setNewResRow({ ...newResRow, s3: e.target.value })} />
            <button type="submit" className="np-btn primary sm" style={{ height: 32, padding: "0 10px" }}>+</button>
          </form>
        </div>
      </div>
    );
  };

  const GoalItem = ({ g, checked }) => (
    <li className="np-check">
      <input type="checkbox" checked={checked} onChange={() => setDone((d) => ({ ...d, [g.id]: !d[g.id] }))} />
      <button type="button" className="np-goal-text" onClick={() => openGoal(g)} style={{ color: checked ? C.muted : C.ink, textDecoration: checked ? "line-through" : "none" }}>
        {g.t}
      </button>
    </li>
  );

  return (
    <div className="np" style={{ minHeight: "100vh", background: C.page, display: "flex", flexDirection: "column" }}>
      <header style={{ height: 48, flex: "none", background: C.ink, color: "#fff", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span aria-hidden="true" style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
          <span>Widget</span>
        </div>
        <button
          type="button"
          onClick={onBackHome}
          style={{ height: 30, padding: "0 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          ← Quay lại Home
        </button>
      </header>

      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "36px 20px 56px" }}>
        <section style={{ width: "100%", maxWidth: 460, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 30px -18px rgba(27,32,56,0.28)" }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
              <Square color={C.indigo} />
              <span>Today – 16/11/2026</span>
            </h1>
            <button type="button" className="np-icon-btn" onClick={() => (tab === "note" ? openAddData() : setAddingGoal(true))}>
              <Icon d={["M12 5v14M5 12h14"]} size={16} />
            </button>
          </div>

          <div role="tablist" style={{ display: "flex", borderBottom: `1px solid ${C.line}` }}>
            {[
              { k: "today", l: `Today (${todayList.length})` },
              { k: "done", l: `Done (${doneList.length})` },
              { k: "note", l: `Note (${notes.length})` },
            ].map((x) => (
              <button key={x.k} role="tab" type="button" className="np-wtab" aria-selected={tab === x.k} onClick={() => { setTab(x.k); setActiveNoteId(null); }}>
                {x.l}
              </button>
            ))}
          </div>

          <div style={{ padding: "18px 18px 20px" }}>
            {tab === "today" && (
              <>
                {addingGoal && (
                  <form onSubmit={createGoal} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <input className="np-input" style={{ height: 36 }} placeholder="Nhập tên mục tiêu" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} autoFocus />
                    <button type="submit" className="np-btn primary sm" style={{ height: 36 }}>Thêm</button>
                  </form>
                )}
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {todayList.map((g) => <GoalItem key={g.id} g={g} checked={false} />)}
                </ul>
              </>
            )}

            {tab === "done" && (
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {doneList.length === 0 ? <p className="np-note" style={{ textAlign: "center" }}>Chưa có mục tiêu nào hoàn thành.</p> : doneList.map((g) => <GoalItem key={g.id} g={g} checked />)}
              </ul>
            )}

            {tab === "note" && (
              activeNote ? renderDataVisualizer(activeNote) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {notes.map((n) => (
                    <li key={n.id}>
                      <button type="button" className="np-data-row" onClick={() => setActiveNoteId(n.id)}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 600 }}>
                          <Square color={C.teal} />
                          {n.title}
                        </span>
                        <Icon d={["M9 6l6 6-6 6"]} size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </section>
      </main>

      {modal && (
        <div className="np-overlay" onClick={() => setModal(null)}>
          <div className="np-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 8 }}>
                <Square color={modal.type === "goal" ? C.teal : C.amber} />
                <span>{modal.type === "goal" ? modal.title : "Thêm dữ liệu mới"}</span>
              </h2>
              <button type="button" className="np-icon-btn" onClick={() => setModal(null)}>×</button>
            </div>

            {modal.type === "goal" ? (
              <form onSubmit={saveGoalDetail} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><label className="np-label">Start time</label><input className="np-input" style={{ height: 36 }} value={goalDraft.start} onChange={(e) => setGoalDraft({ ...goalDraft, start: e.target.value })} /></div>
                  <div><label className="np-label">Due time</label><input className="np-input" style={{ height: 36 }} value={goalDraft.due} onChange={(e) => setGoalDraft({ ...goalDraft, due: e.target.value })} /></div>
                </div>
                <div><label className="np-label">Yếu tố hàng đầu</label><input className="np-input" style={{ height: 36 }} value={goalDraft.key} onChange={(e) => setGoalDraft({ ...goalDraft, key: e.target.value })} /></div>
                <div><label className="np-label">Ghi chú khác</label><textarea className="np-input" rows={2} value={goalDraft.other} onChange={(e) => setGoalDraft({ ...goalDraft, other: e.target.value })} /></div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button type="button" className="np-btn sm" onClick={() => setModal(null)}>Hủy</button>
                  <button type="submit" className="np-btn primary sm">Lưu</button>
                </div>
              </form>
            ) : (
              <form onSubmit={saveData} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><label className="np-label">Tên dữ liệu</label><input className="np-input" style={{ height: 36 }} value={dataDraft.title} onChange={(e) => setDataDraft({ ...dataDraft, title: e.target.value })} /></div>
                <div><label className="np-label">Ghi chú</label><textarea className="np-input" rows={2} value={dataDraft.note} onChange={(e) => setDataDraft({ ...dataDraft, note: e.target.value })} /></div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button type="button" className="np-btn sm" onClick={() => setModal(null)}>Hủy</button>
                  <button type="submit" className="np-btn primary sm">Lưu</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   13. MAIN APP SHELL — ĐIỀU PHỐI TOÀN BỘ LUỒNG & TRẠNG THÁI CHUNG
   ============================================================================ */
export default function App() {
  // Các view chính: "home" | "nascent" | "current" | "table" | "math" | "docs" | "goal-step1" | "goal-step23" | "calendar" | "widget"
  const [activeView, setActiveView] = useState("home");
  const [previousViewBeforeGoalTree, setPreviousViewBeforeGoalTree] = useState("current");

  // Danh sách dự án & trạng thái điều kiện bật/tắt dự án mẫu trên Home
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [isProjectsUnlocked, setIsProjectsUnlocked] = useState(true);
  const [currentProjectId, setCurrentProjectId] = useState(INITIAL_PROJECTS[0].id);

  // Dữ liệu Nascent Project theo từng dự án (2_nascent_project_2.tsx)
  const [nascentByProjectId, setNascentByProjectId] = useState({});

  // Dữ liệu Cây mục tiêu (Goal Tree) dùng chung toàn hệ thống
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [selectedStageForTree, setSelectedStageForTree] = useState(INITIAL_STAGES[0].id);

  // Dữ liệu Data Table dùng chung
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [notesByStage, setNotesByStage] = useState(INITIAL_NOTES_BY_STAGE);

  const currentProject = useMemo(
    () => projects.find((p) => p.id === currentProjectId) || projects[0],
    [projects, currentProjectId]
  );

  // Tách text thuần từ HTML của Outliner Nascent để đồng bộ sang Goal Tree & Current Project
  const stripHtmlText = (html) => {
    if (!html) return "";
    return String(html)
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Luồng 1: Tạo "+ New Project" từ Home -> Chuyển thẳng sang màn hình Nascent Project (2_nascent_project_2.tsx)
  const handleCreateNewProject = ({ name, goal, color }) => {
    const newId = Date.now();
    const newProj = {
      id: newId,
      name,
      stage: "Nascent · Khởi tạo ý tưởng",
      progress: 0,
      color: color || C.indigo,
      updated: "Vừa tạo",
      goal: goal || "Đang thiết lập mục tiêu cuối cùng",
      resource: "Chưa nhập",
      status: "Đang phác thảo tại Nascent Project",
      currentStageNum: 1,
    };
    setProjects((prev) => [newProj, ...prev]);
    setIsProjectsUnlocked(true);
    setCurrentProjectId(newId);

    // Khởi tạo sẵn dữ liệu Nascent Form cho dự án mới
    setNascentByProjectId((prev) => ({
      ...prev,
      [newId]: {
        "dat-duoc": goal || "",
        "ban-than": "",
        "gia-tri": "",
        "lich-trinh": "",
        ngoai: "",
        trong: "",
        "khong-lam": "",
        "that-bai": "",
        "ly-do": "",
      },
    }));

    setActiveView("nascent");
  };

  // Khi bấm "Vẽ goal tree →" từ Nascent Project -> Cập nhật thông tin dự án & mở Goal Tree Bước 1
  const handleDrawGoalTreeFromNascent = (formVals) => {
    const cleanFinalGoal = stripHtmlText(formVals?.["dat-duoc"]);
    const cleanResource = [stripHtmlText(formVals?.ngoai), stripHtmlText(formVals?.trong)]
      .filter(Boolean)
      .join(" · ");

    if (currentProject) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === currentProject.id
            ? {
                ...p,
                stage: "Chặng 1 · Làm quen",
                goal: cleanFinalGoal || p.goal,
                resource: cleanResource || p.resource,
                status: "Đã phác thảo Nascent, đang thiết lập Goal Tree",
                updated: "Vừa cập nhật",
              }
            : p
        )
      );
    }

    // Khởi tạo bộ chặng sạch và gắn mục tiêu cuối cùng từ Nascent vào Chặng 1 nếu có
    const freshStages = [
      {
        id: `st1_${Date.now()}`,
        title: "Chặng 1: Làm quen",
        note: stripHtmlText(formVals?.["ly-do"]) || "",
        core: false,
        isStage: true,
        children: cleanFinalGoal
          ? [
              {
                id: `g_init_${Date.now()}`,
                title: cleanFinalGoal,
                note: stripHtmlText(formVals?.["gia-tri"]) || "",
                core: true,
                score: "100",
                due: stripHtmlText(formVals?.["lich-trinh"]) || "",
                limitUnit: "month",
                resource: cleanResource || "",
                condition: stripHtmlText(formVals?.["ban-than"]) || "",
                children: [],
              },
            ]
          : [],
      },
      { id: `st2_${Date.now() + 1}`, title: "Chặng 2: Tiêu chuẩn hóa", note: "", core: false, isStage: true, children: [] },
      { id: `st3_${Date.now() + 2}`, title: "Chặng 3: Vòng lặp nâng cấp", note: "", core: false, isStage: true, children: [] },
      { id: `st4_${Date.now() + 3}`, title: "Chặng 4: Chạm đến", note: "", core: false, isStage: true, children: [] },
    ];
    setStages(freshStages);
    setSelectedStageForTree(freshStages[0].id);
    setPreviousViewBeforeGoalTree("nascent");
    setActiveView("goal-step1");
  };

  // Chọn dự án từ Home -> Mở Current Project
  const handleSelectProject = (proj) => {
    setCurrentProjectId(proj.id);
    setActiveView("current");
  };

  const handleUpdateProject = (projId, patch) => {
    setProjects((prev) => prev.map((p) => (p.id === projId ? { ...p, ...patch, updated: "Vừa cập nhật" } : p)));
  };

  const handleOpenGoalTree = (stageId) => {
    setSelectedStageForTree(stageId || stages[0]?.id);
    setPreviousViewBeforeGoalTree(activeView);
    setActiveView("goal-step1");
  };

  const handleSwitchWorkspaceTab = (tabKey) => {
    setActiveView(tabKey);
  };

  const activeNascentValues = nascentByProjectId[currentProjectId] || {
    "dat-duoc": currentProject?.goal || "",
    "ban-than": "",
    "gia-tri": "",
    "lich-trinh": "",
    ngoai: "",
    trong: "",
    "khong-lam": "",
    "that-bai": "",
    "ly-do": "",
  };

  const handleUpdateNascentValues = (updater) => {
    setNascentByProjectId((prev) => {
      const currentVal = prev[currentProjectId] || activeNascentValues;
      const nextVal = typeof updater === "function" ? updater(currentVal) : updater;
      return { ...prev, [currentProjectId]: nextVal };
    });
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {activeView === "home" && (
        <HomeScreen
          projects={projects}
          isProjectsUnlocked={isProjectsUnlocked}
          onToggleUnlock={() => setIsProjectsUnlocked((v) => !v)}
          onCreateNewProject={handleCreateNewProject}
          onSelectProject={handleSelectProject}
          onOpenCalendar={() => setActiveView("calendar")}
          onOpenWidget={() => setActiveView("widget")}
        />
      )}

      {activeView === "nascent" && (
        <NascentProjectScreen
          project={currentProject}
          formValues={activeNascentValues}
          setFormValues={handleUpdateNascentValues}
          onBackHome={() => setActiveView("home")}
          onSwitchWorkspaceTab={handleSwitchWorkspaceTab}
          onDrawGoalTree={handleDrawGoalTreeFromNascent}
        />
      )}

      {activeView === "current" && (
        <CurrentProjectScreen
          project={currentProject}
          stages={stages}
          onUpdateProject={handleUpdateProject}
          onBackHome={() => setActiveView("home")}
          onSwitchWorkspaceTab={handleSwitchWorkspaceTab}
          onOpenGoalTree={handleOpenGoalTree}
          onOpenNascent={() => setActiveView("nascent")}
        />
      )}

      {activeView === "table" && (
        <DataTableScreen
          tables={tables}
          setTables={setTables}
          notesByStage={notesByStage}
          setNotesByStage={setNotesByStage}
          onBackHome={() => setActiveView("home")}
          onSwitchWorkspaceTab={handleSwitchWorkspaceTab}
        />
      )}

      {activeView === "math" && (
        <MathematicsScreen
          onBackHome={() => setActiveView("home")}
          onSwitchWorkspaceTab={handleSwitchWorkspaceTab}
        />
      )}

      {activeView === "docs" && (
        <DocsScreen
          onBackToCurrent={() => setActiveView("current")}
          onSwitchWorkspaceTab={handleSwitchWorkspaceTab}
        />
      )}

      {activeView === "goal-step1" && (
        <GoalTreeStep1Screen
          stages={stages}
          setStages={setStages}
          initialSelectedStageId={selectedStageForTree}
          onBack={() => setActiveView(previousViewBeforeGoalTree === "nascent" ? "nascent" : "current")}
          onGoToStep2And3={(stageId) => {
            setSelectedStageForTree(stageId || stages[0]?.id);
            setActiveView("goal-step23");
          }}
        />
      )}

      {activeView === "goal-step23" && (
        <GoalTreeStep2And3Screen
          stages={stages}
          setStages={setStages}
          initialStageId={selectedStageForTree}
          onBackToStep1={() => setActiveView("goal-step1")}
          onCompleteSetup={() => setActiveView("current")}
        />
      )}

      {activeView === "calendar" && (
        <CalendarScreen onBackHome={() => setActiveView("home")} />
      )}

      {activeView === "widget" && (
        <WidgetSuiteScreen onBackHome={() => setActiveView("home")} />
      )}
    </>
  );
}