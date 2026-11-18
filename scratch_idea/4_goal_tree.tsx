import React, { useState, useMemo } from "react";

const C = {
  ink: "#1b2038",
  text: "#2b3150",
  muted: "#6a7192",
  page: "#ffffff",
  card: "#ffffff",
  panel: "#f1f3f9",
  line: "#dfe3f0",
  field: "#ffffff",
  indigo: "#4f52d9",
  indigoSoft: "#ececfc",
  teal: "#0fa89a",
  tealSoft: "#e3f6f4",
  violet: "#7b4fe0",
  coral: "#f0524f",
  coralSoft: "#fdecec",
  amber: "#e8960c",
};

const MAX_STAGES = 4;

/* ---------- Cấu trúc dữ liệu đồng bộ 100% với trang 1 + mở rộng thuộc tính Bước 2 & 3 ---------- */
const INITIAL_STAGES = [
  {
    id: "stage_1",
    title: "Chặng 1",
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
    title: "Chặng 2 - tương tự",
    note: "",
    core: false,
    isStage: true,
    children: [],
  },
];

/* ---------- Bộ hàm tiện ích cây đồng bộ ---------- */
function shorten(str, max = 22) {
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

function updateNodeInTree(node, id, patch) {
  if (node.id === id) {
    return { ...node, ...patch };
  }
  if (!node.children || node.children.length === 0) return node;
  return {
    ...node,
    children: node.children.map((c) => updateNodeInTree(c, id, patch)),
  };
}

function formatDueShort(due) {
  if (!due) return "";
  const parts = due.split("-");
  if (parts.length !== 3) return due;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

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

/* ---------- Thuật toán dựng sơ đồ SVG hiển thị tối đa 3 mục tiêu ở cấp đang xem & cho phép mở rộng nhánh ---------- */
function computeStageDetailLayout(parentContainer, selectedGoalId, trail = []) {
  const ROOT_X = 24;
  const STEP_X = 185;
  const GOAL_W = 204;
  const ATTR_W = 220;
  const ROW_STEP = 44;
  const TOP_PAD = 34;
  const BOTTOM_PAD = 28;

  // Các nút tổ tiên nằm bên trái để thể hiện rõ độ sâu nhánh (Chặng -> Mục tiêu lớn 1 -> Mục tiêu vừa 2 -> Mục tiêu nhỏ 3)
  const ancestorNodes = [];
  let currentX = 68;
  trail.forEach((anc, idx) => {
    ancestorNodes.push({
      id: anc.id,
      label: anc.title || `Cấp ${idx}`,
      core: !!anc.core,
      isStage: !!anc.isStage,
      x: currentX,
      w: 150,
    });
    currentX += STEP_X;
  });

  const GOAL_X = trail.length > 0 ? currentX : 76;
  const ATTR_X = GOAL_X + GOAL_W + 64;
  const totalWidth = Math.max(660, ATTR_X + ATTR_W + 32);

  // Luôn lấy tối đa 3 mục tiêu thuộc cấp đang xét
  const topGoals = (parentContainer?.children || []).slice(0, 3);

  if (topGoals.length === 0) {
    const midY = 120;
    return {
      width: totalWidth,
      height: 240,
      rootPoint: { x: ROOT_X, y: midY },
      ancestorNodes: ancestorNodes.map((a) => ({ ...a, y: midY })),
      goalNodes: [],
      attrNodes: [],
      edges: [],
      isEmpty: true,
    };
  }

  let leafCursor = 0;
  const goalNodes = [];
  const attrNodes = [];
  const edges = [];

  topGoals.forEach((goal) => {
    const isExpandedTarget = goal.id === selectedGoalId;
    const scoreText = String(goal.score || "").trim();
    const displayLabel = scoreText
      ? `${goal.title || "Mục tiêu"} - ${scoreText}`
      : goal.title || "Chưa nhập mục tiêu";

    if (isExpandedTarget) {
      const condText = String(goal.condition || "").trim();
      const resText = String(goal.resource || "").trim();
      const dueText = formatDueShort(goal.due);

      const attrs = [
        {
          id: `${goal.id}_need`,
          label: condText ? `điều kiện cần: ${shorten(condText, 18)}` : "điều kiện cần",
          hasValue: !!condText,
          row: leafCursor++,
        },
        {
          id: `${goal.id}_suff`,
          label: resText ? `điều kiện đủ (${shorten(resText, 14)})` : "điều kiện đủ",
          hasValue: !!resText,
          row: leafCursor++,
        },
        {
          id: `${goal.id}_due`,
          label: dueText ? `thời hạn: ${dueText}` : "thời hạn",
          hasValue: !!dueText,
          row: leafCursor++,
        },
      ];

      const goalRow = (attrs[0].row + attrs[attrs.length - 1].row) / 2;
      const goalY = TOP_PAD + goalRow * ROW_STEP;

      goalNodes.push({
        id: goal.id,
        label: displayLabel,
        core: !!goal.core,
        x: GOAL_X,
        y: goalY,
        w: GOAL_W,
        isSelected: true,
      });

      attrs.forEach((a) => {
        const ay = TOP_PAD + a.row * ROW_STEP;
        attrNodes.push({
          ...a,
          x: ATTR_X,
          y: ay,
          w: ATTR_W,
        });
        edges.push({
          sx: GOAL_X + GOAL_W + 10,
          sy: goalY - 8,
          tx: ATTR_X,
          ty: ay,
          highlighted: true,
        });
      });
    } else {
      const row = leafCursor++;
      const goalY = TOP_PAD + row * ROW_STEP;
      goalNodes.push({
        id: goal.id,
        label: displayLabel,
        core: !!goal.core,
        x: GOAL_X,
        y: goalY,
        w: GOAL_W,
        isSelected: false,
      });
    }
  });

  const firstY = goalNodes[0].y;
  const lastY = goalNodes[goalNodes.length - 1].y;
  const rootY = (firstY + lastY) / 2;

  const positionedAncestors = ancestorNodes.map((a) => ({ ...a, y: rootY }));

  // Nối từ điểm gốc qua các nhánh cha tới nhóm mục tiêu cấp hiện tại
  if (positionedAncestors.length > 0) {
    edges.unshift({
      sx: ROOT_X,
      sy: rootY,
      tx: positionedAncestors[0].x,
      ty: rootY,
      highlighted: false,
    });
    for (let i = 0; i < positionedAncestors.length - 1; i++) {
      edges.unshift({
        sx: positionedAncestors[i].x + positionedAncestors[i].w,
        sy: rootY,
        tx: positionedAncestors[i + 1].x,
        ty: rootY,
        highlighted: false,
      });
    }
    const lastAnc = positionedAncestors[positionedAncestors.length - 1];
    goalNodes.forEach((gn) => {
      edges.unshift({
        sx: lastAnc.x + lastAnc.w,
        sy: rootY,
        tx: gn.x,
        ty: gn.y,
        highlighted: gn.isSelected,
      });
    });
  } else {
    goalNodes.forEach((gn) => {
      edges.unshift({
        sx: ROOT_X,
        sy: rootY,
        tx: gn.x,
        ty: gn.y,
        highlighted: gn.isSelected,
      });
    });
  }

  const totalHeight = Math.max(230, TOP_PAD + (leafCursor - 1) * ROW_STEP + BOTTOM_PAD);

  return {
    width: totalWidth,
    height: totalHeight,
    rootPoint: { x: ROOT_X, y: rootY },
    ancestorNodes: positionedAncestors,
    goalNodes,
    attrNodes,
    edges,
    isEmpty: false,
  };
}

/* ---------- Thành phần giao diện nhỏ ---------- */
function Square({ color }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 11,
        height: 11,
        borderRadius: 3,
        background: color,
        display: "inline-block",
        flex: "none",
      }}
    />
  );
}

function Field({ id, label, hint, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label
        htmlFor={id}
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: C.ink,
          marginBottom: 4,
        }}
      >
        <span aria-hidden="true">•</span>
        <span>{label}</span>
        {hint && (
          <span style={{ fontSize: 11.5, fontWeight: 400, color: C.muted }}>
            ({hint})
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

/* ---------- Màn hình chính: Ongoing – Goal Tree (Chỉnh thông tin Bước 2 & 3) ---------- */
export default function App() {
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [activeStageId, setActiveStageId] = useState(INITIAL_STAGES[0].id);
  // ID của nút cha chứa danh sách mục tiêu đang thiết lập ở Bước 2 (mặc định là Chặng -> Cấp 1)
  const [branchParentId, setBranchParentId] = useState(INITIAL_STAGES[0].id);
  const [selectedGoalId, setSelectedGoalId] = useState("a");
  const [backNotice, setBackNotice] = useState(false);

  const activeStage = useMemo(
    () => stages.find((s) => s.id === activeStageId) || stages[0],
    [stages, activeStageId]
  );

  // Nút cha hiện tại của nhánh đang mở (có thể là Chặng 1, Mục tiêu cấp 1 hoặc Mục tiêu cấp 2)
  const branchParent = useMemo(() => {
    if (!activeStage) return null;
    return findNode(activeStage, branchParentId) || activeStage;
  }, [activeStage, branchParentId]);

  // Đường dẫn các cấp từ Chặng đến nhánh đang mở (dùng để hiển thị cây mở rộng sang phải & quay lại cấp trên)
  const ancestorTrail = useMemo(() => {
    if (!activeStage || !branchParent) return [];
    const trail = getAncestorTrail(activeStage, branchParent.id) || [];
    // Bỏ qua phần tử đầu là chính Chặng nếu đang ở gốc để giữ sơ đồ gọn
    return trail.length > 1 ? trail.slice(1) : [];
  }, [activeStage, branchParent]);

  const currentBranchLevel = ancestorTrail.length + 1;

  // Tối đa 3 mục tiêu thuộc nhánh đang xem (tổng điểm của nhóm này quy về 100%)
  const stageTopGoals = useMemo(
    () => (branchParent?.children || []).slice(0, 3),
    [branchParent]
  );

  // Mục tiêu đang được chọn để chỉnh sửa chi tiết ở Bước 2 & Bước 3
  const selectedGoal = useMemo(() => {
    if (!branchParent) return null;
    const found = stageTopGoals.find((g) => g.id === selectedGoalId);
    if (found) return found;
    return stageTopGoals[0] || null;
  }, [branchParent, stageTopGoals, selectedGoalId]);

  const activeTopGoalId = selectedGoal?.id || null;

  const svgLayout = useMemo(
    () => computeStageDetailLayout(branchParent, activeTopGoalId, ancestorTrail),
    [branchParent, activeTopGoalId, ancestorTrail]
  );

  const handleSelectStage = (stageId) => {
    setActiveStageId(stageId);
    setBranchParentId(stageId);
    const targetStage = stages.find((s) => s.id === stageId);
    const firstGoal = targetStage?.children?.[0];
    setSelectedGoalId(firstGoal ? firstGoal.id : "");
  };

  // Mở nhánh con của một mục tiêu để xác định nguồn lực & điều kiện cho Mục tiêu cấp 2, cấp 3
  const handleDrillDownBranch = (goal) => {
    if (!goal) return;
    const existingChildren = goal.children || [];
    if (existingChildren.length === 0) {
      const nextLevel = currentBranchLevel + 1;
      const newChildId = `${goal.id}_sub_${Date.now().toString(36).slice(-4)}`;
      const defaultChild = {
        id: newChildId,
        title: nextLevel === 2 ? "Mục tiêu vừa 2" : `Mục tiêu nhỏ ${nextLevel}`,
        note: "",
        core: false,
        score: "100",
        due: "",
        limitUnit: "week",
        resource: "",
        condition: "",
        children: [],
      };
      setStages((prev) =>
        prev.map((st) =>
          st.id === activeStage.id
            ? updateNodeInTree(st, goal.id, { children: [defaultChild] })
            : st
        )
      );
      setBranchParentId(goal.id);
      setSelectedGoalId(newChildId);
    } else {
      setBranchParentId(goal.id);
      setSelectedGoalId(existingChildren[0].id);
    }
  };

  // Thêm mục tiêu mới (tối đa 3 mục tiêu) trong nhánh con hiện tại
  const handleAddSubGoalInBranch = () => {
    if (!branchParent || (branchParent.children || []).length >= 3) return;
    const idx = (branchParent.children || []).length + 1;
    const newId = `${branchParent.id}_g_${Date.now().toString(36).slice(-4)}`;
    const levelLabel =
      currentBranchLevel === 1
        ? `Mục tiêu ${idx}`
        : currentBranchLevel === 2
        ? `Mục tiêu vừa ${idx}`
        : `Mục tiêu nhỏ ${idx}`;
    const newGoal = {
      id: newId,
      title: levelLabel,
      note: "",
      core: false,
      score: "",
      due: "",
      limitUnit: "week",
      resource: "",
      condition: "",
      children: [],
    };
    setStages((prev) =>
      prev.map((st) =>
        st.id === activeStage.id
          ? updateNodeInTree(st, branchParent.id, {
              children: [...(branchParent.children || []), newGoal],
            })
          : st
      )
    );
    setSelectedGoalId(newId);
  };

  // Quay lại cấp nhánh cha trước đó
  const handleStepUpBranch = () => {
    if (!activeStage || !branchParent || branchParent.id === activeStage.id) return;
    const trail = getAncestorTrail(activeStage, branchParent.id) || [];
    const parentNode = trail.length >= 2 ? trail[trail.length - 2] : activeStage;
    setBranchParentId(parentNode.id);
    setSelectedGoalId(branchParent.id);
  };

  const handlePatchGoal = (goalId, patch) => {
    if (!goalId) return;
    setStages((prev) =>
      prev.map((st) => {
        if (st.id !== activeStage.id) return st;

        // Ràng buộc tổng điểm của các mục tiêu trong nhánh đang xem không bao giờ vượt quá 100 (100%)
        if (Object.prototype.hasOwnProperty.call(patch, "score")) {
          const rawStr = String(patch.score ?? "").trim();
          if (rawStr === "") {
            return updateNodeInTree(st, goalId, { score: "" });
          }
          const numeric = Math.max(0, parseFloat(rawStr) || 0);
          const siblings = (branchParent?.children || []).slice(0, 3);
          const otherScoreSum = siblings.reduce((sum, g) => {
            if (g.id === goalId) return sum;
            const v = parseFloat(g.score);
            return sum + (Number.isFinite(v) ? v : 0);
          }, 0);
          const maxAllowed = Math.max(0, Math.round((100 - otherScoreSum) * 100) / 100);
          const clamped = Math.min(numeric, maxAllowed);
          return updateNodeInTree(st, goalId, { score: String(clamped) });
        }

        return updateNodeInTree(st, goalId, patch);
      })
    );
  };

  const units = [
    { v: "month", t: "Tháng" },
    { v: "week", t: "Tuần" },
    { v: "day", t: "Ngày" },
  ];

  const totalStageScore = useMemo(() => {
    const sum = stageTopGoals.reduce((acc, g) => {
      const val = parseFloat(g.score);
      return acc + (Number.isFinite(val) ? val : 0);
    }, 0);
    return Math.min(100, Math.round(sum * 100) / 100);
  }, [stageTopGoals]);

  const remainingScore = Math.max(0, Math.round((100 - totalStageScore) * 100) / 100);

  const css = `
    .og, .og * {
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    .og {
      color: ${C.text};
      -webkit-font-smoothing: antialiased;
      height: 100vh;
      overflow: hidden;
    }
    @media (max-width: 860px) {
      .og {
        height: auto;
        min-height: 100vh;
        overflow: visible;
      }
    }
    .og-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 34px;
      padding: 0 12px;
      border-radius: 10px;
      border: 1px solid ${C.line};
      background: ${C.card};
      color: ${C.ink};
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .og-btn:hover {
      background: #f5f7fc;
      border-color: #cfd5ea;
    }
    .og-btn[aria-checked="true"] {
      background: ${C.indigoSoft};
      border-color: ${C.indigo};
      color: ${C.indigo};
    }
    .og-stage-tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 30px;
      padding: 0 12px;
      border-radius: 999px;
      border: 1px solid ${C.line};
      background: #fff;
      color: ${C.muted};
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .og-stage-tab:hover {
      border-color: #c5cde8;
      color: ${C.ink};
    }
    .og-stage-tab.is-active {
      background: ${C.indigo};
      border-color: ${C.indigo};
      color: #ffffff;
    }
    .og-input {
      width: 100%;
      height: 36px;
      padding: 0 11px;
      border: 1px solid ${C.line};
      border-radius: 9px;
      background: #ffffff;
      color: ${C.ink};
      font-size: 13.5px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    textarea.og-input {
      height: auto;
      min-height: 52px;
      padding: 7px 11px;
      resize: vertical;
      line-height: 1.4;
    }
    .og-input:focus {
      outline: none;
      border-color: ${C.indigo};
      box-shadow: 0 0 0 3px rgba(79, 82, 217, 0.12);
    }
    .og-workspace {
      display: flex;
      flex-direction: column;
      gap: 14px;
      height: 100%;
      min-height: 0;
    }
    .og-tree-section {
      background: ${C.card};
      border: 1px solid ${C.line};
      border-radius: 14px;
      padding: 12px 18px 14px;
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
    }
    .og-tree-scroll {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 6px 4px;
      scrollbar-width: thin;
      scrollbar-color: #cbd2e8 transparent;
    }
    .og-tree-scroll::-webkit-scrollbar {
      height: 6px;
    }
    .og-tree-scroll::-webkit-scrollbar-thumb {
      background: #cbd2e8;
      border-radius: 999px;
    }
    .og-bottom-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      flex: 1 1 auto;
      min-height: 0;
    }
    @media (max-width: 860px) {
      .og-bottom-grid {
        grid-template-columns: 1fr;
      }
    }
    .og-side-panel {
      background: ${C.panel};
      border: 1px solid ${C.line};
      border-radius: 12px;
      padding: 14px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 0;
      height: 100%;
    }
    .og-step2-scroll {
      flex: 1 1 auto;
      min-height: 0;
      overflow-y: auto;
      padding-right: 4px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scrollbar-width: thin;
      scrollbar-color: #cbd2e8 transparent;
    }
    .og-step2-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .og-step2-scroll::-webkit-scrollbar-thumb {
      background: #cbd2e8;
      border-radius: 999px;
    }
    .og-goal-card {
      background: #ffffff;
      border: 1px solid ${C.line};
      border-radius: 11px;
      padding: 12px 14px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .og-goal-card.is-selected {
      border-color: ${C.indigo};
      box-shadow: 0 0 0 2px rgba(79, 82, 217, 0.12);
    }
    .og-svg-node {
      cursor: pointer;
    }
    .og-svg-node:hover rect {
      fill: ${C.indigoSoft};
    }
  `;

  return (
    <div
      className="og"
      style={{
        background: C.page,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{css}</style>

      {/* Thanh điều hướng trên gọn gàng để dành không gian cho Cây mục tiêu */}
      <header
        style={{
          maxWidth: 1360,
          width: "100%",
          margin: "0 auto",
          padding: "10px 24px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          flex: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            className="og-btn"
            onClick={() => {
              setBackNotice(true);
              setTimeout(() => setBackNotice(false), 2600);
            }}
            aria-label="Quay lại Cây mục tiêu"
          >
            <span aria-hidden="true">←</span>
            <span>Quay lại</span>
          </button>

          {backNotice && (
            <span
              style={{
                fontSize: 12.5,
                color: C.indigo,
                background: C.indigoSoft,
                padding: "5px 11px",
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              Đang ở màn hình Chỉnh thông tin chi tiết (Bước 2 & Bước 3)
            </span>
          )}
        </div>

        {/* Bộ chuyển đổi Chặng */}
        <div
          role="tablist"
          aria-label="Chọn chặng làm việc"
          style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}
        >
          {stages.slice(0, MAX_STAGES).map((st, idx) => {
            const active = st.id === activeStage?.id;
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`og-stage-tab ${active ? "is-active" : ""}`}
                onClick={() => handleSelectStage(st.id)}
              >
                <span>{st.title || `Chặng ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Khu vực làm việc chính gói gọn trong 1 màn hình: Trên luôn thấy Cây mục tiêu, Dưới là Bước 2 (cuộn nội bộ) & Bước 3 */}
      <main
        style={{
          maxWidth: 1360,
          width: "100%",
          margin: "0 auto",
          padding: "6px 24px 16px",
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="og-workspace">
          {/* Hàng trên: Sơ đồ cây mục tiêu SVG (luôn hiển thị, hỗ trợ cuộn sang phải khi cây mở rộng) */}
          <section
            className="og-tree-section"
            aria-label="Sơ đồ chi tiết mục tiêu theo chặng"
          >
            {/* Thanh tóm tắt chặng đang xem + 3 mục tiêu & tổng điểm 100% */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
                paddingBottom: 8,
                borderBottom: "1px solid #eef0f7",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Square color={C.indigo} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>
                  {activeStage?.title || "Chặng 1"}
                  {ancestorTrail.map((a) => ` › ${shorten(a.title, 18)}`).join("")}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: totalStageScore === 100 ? "#0b8579" : C.indigo,
                    background: totalStageScore === 100 ? C.tealSoft : C.indigoSoft,
                    padding: "2px 9px",
                    borderRadius: 999,
                  }}
                >
                  Cấp {currentBranchLevel} • {stageTopGoals.length} mục tiêu • Tổng điểm: {totalStageScore}/100 ({totalStageScore}%)
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                {stageTopGoals.map((g) => {
                  const isSel = activeTopGoalId === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoalId(g.id)}
                      style={{
                        height: 25,
                        padding: "0 9px",
                        borderRadius: 999,
                        border: `1px solid ${isSel ? C.indigo : g.core ? "#a4e4de" : C.line}`,
                        background: isSel ? C.indigoSoft : g.core ? C.tealSoft : "#fff",
                        color: isSel ? C.indigo : g.core ? "#0b8579" : C.text,
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {g.core ? "★ " : ""}
                      {shorten(g.title || "Chưa nhập", 18)}
                      {g.score ? ` (${g.score}%)` : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Khung SVG có thanh cuộn ngang (overflow-x: auto) để kéo sang phải khi cây mở rộng */}
            <div className="og-tree-scroll">
              {svgLayout.isEmpty ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "28px 20px",
                    borderRadius: 12,
                    border: "1px dashed #cfd5ea",
                    color: C.muted,
                    maxWidth: 420,
                    margin: "0 auto",
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontWeight: 600, color: C.ink, fontSize: 13.5 }}>
                    {activeStage?.title || "Chặng này"} chưa có mục tiêu nào
                  </p>
                  <p style={{ margin: 0, fontSize: 12.5 }}>
                    Vui lòng thêm mục tiêu ở màn hình Cây mục tiêu (Bước 1) hoặc chọn chặng khác ở thanh phía trên.
                  </p>
                </div>
              ) : (
                <div style={{ minWidth: svgLayout.width + 20, width: "max-content" }}>
                  <svg
                    viewBox={`0 0 ${svgLayout.width} ${svgLayout.height}`}
                    width={svgLayout.width}
                    height={Math.min(235, Math.round((svgLayout.height / svgLayout.width) * svgLayout.width))}
                    style={{
                      display: "block",
                      overflow: "visible",
                    }}
                    role="group"
                    aria-label="Sơ đồ phân rã điều kiện và thời hạn của mục tiêu"
                  >
                    {/* Các đường cong Bezier nối mượt tới gạch chân */}
                    {svgLayout.edges.map((e, i) => {
                      const cpx = e.sx + (e.tx - e.sx) * 0.55;
                      return (
                        <path
                          key={i}
                          d={`M ${e.sx} ${e.sy} C ${cpx} ${e.sy}, ${e.sx + 16} ${e.ty}, ${e.tx} ${e.ty}`}
                          fill="none"
                          stroke={e.highlighted ? C.indigo : "#6a728c"}
                          strokeWidth={e.highlighted ? "1.85" : "1.45"}
                          strokeLinecap="round"
                        />
                      );
                    })}

                    {/* Điểm gốc bên trái của nhánh chặng */}
                    <circle
                      cx={svgLayout.rootPoint.x}
                      cy={svgLayout.rootPoint.y}
                      r="4.5"
                      fill={C.indigo}
                    />

                    {/* Các nút nhánh cha khi đi sâu vào Mục tiêu 2, Mục tiêu 3 (bấm để quay lại cấp đó) */}
                    {(svgLayout.ancestorNodes || []).map((anc) => (
                      <g
                        key={anc.id}
                        className="og-svg-node"
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          const trail = getAncestorTrail(activeStage, anc.id) || [];
                          const parentOfAnc =
                            trail.length >= 2 ? trail[trail.length - 2] : activeStage;
                          setBranchParentId(parentOfAnc.id);
                          setSelectedGoalId(anc.id);
                        }}
                      >
                        <line
                          x1={anc.x}
                          y1={anc.y}
                          x2={anc.x + anc.w}
                          y2={anc.y}
                          stroke={anc.core ? C.teal : "#5e6682"}
                          strokeWidth="1.7"
                        />
                        <text
                          x={anc.x + 6}
                          y={anc.y - 12}
                          dominantBaseline="central"
                          fontSize="13"
                          fontWeight="700"
                          fill={C.ink}
                        >
                          {shorten(anc.label, 18)}
                        </text>
                      </g>
                    ))}

                    {/* Các nút mục tiêu chính (gạch chân theo đúng wireframe) */}
                    {svgLayout.goalNodes.map((g) => {
                      const lineColor = g.isSelected
                        ? C.indigo
                        : g.core
                        ? C.teal
                        : "#5e6682";
                      return (
                        <g
                          key={g.id}
                          className="og-svg-node"
                          role="button"
                          tabIndex={0}
                          aria-pressed={g.isSelected}
                          onClick={() => setSelectedGoalId(g.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedGoalId(g.id);
                            }
                          }}
                        >
                          <rect
                            x={g.x}
                            y={g.y - 26}
                            width={g.w}
                            height={24}
                            rx="6"
                            fill={
                              g.isSelected
                                ? C.indigoSoft
                                : g.core
                                ? C.tealSoft
                                : "transparent"
                            }
                          />
                          <line
                            x1={g.x}
                            y1={g.y}
                            x2={g.x + g.w}
                            y2={g.y}
                            stroke={lineColor}
                            strokeWidth={g.isSelected ? "2.2" : "1.6"}
                          />
                          <text
                            x={g.x + 8}
                            y={g.y - 13}
                            dominantBaseline="central"
                            fontSize="13.5"
                            fontWeight={g.core || g.isSelected ? "700" : "600"}
                            fill={g.isSelected ? C.indigo : C.ink}
                          >
                            {shorten(g.label, 25)}
                          </text>
                        </g>
                      );
                    })}

                    {/* 3 nhánh thuộc tính (điều kiện cần, điều kiện đủ, thời hạn) */}
                    {svgLayout.attrNodes.map((a) => (
                      <g key={a.id}>
                        <line
                          x1={a.x}
                          y1={a.y}
                          x2={a.x + a.w}
                          y2={a.y}
                          stroke={a.hasValue ? C.teal : "#6a728c"}
                          strokeWidth={a.hasValue ? "1.8" : "1.4"}
                        />
                        <text
                          x={a.x + 8}
                          y={a.y - 12}
                          dominantBaseline="central"
                          fontSize="13"
                          fontWeight={a.hasValue ? "600" : "500"}
                          fill={a.hasValue ? "#0b8579" : C.ink}
                        >
                          {a.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              )}
            </div>
          </section>

          {/* Hàng dưới: 2 khung xám đặt cạnh nhau (Trái: Bước 2 cuộn nội bộ cho cả 3 mục tiêu, Phải: Bước 3 giới hạn điểm <= 100) */}
          <div className="og-bottom-grid">
            {/* Ô BÊN TRÁI: BƯỚC 2 (có thanh cuộn nội bộ & nút đi sâu vào nhánh con cho Mục tiêu 2, 3) */}
            <section className="og-side-panel" aria-label="Bảng thiết lập Bước 2">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flex: "none",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Square color={C.indigo} />
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 700,
                      color: C.ink,
                    }}
                  >
                    Bước 2 —{" "}
                    {branchParent?.id === activeStage?.id
                      ? activeStage?.title || "Chặng"
                      : shorten(branchParent?.title || "Nhánh con", 20)}
                  </h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {branchParent?.id !== activeStage?.id && (
                    <button
                      type="button"
                      onClick={handleStepUpBranch}
                      style={{
                        height: 24,
                        padding: "0 9px",
                        borderRadius: 7,
                        border: `1px solid ${C.line}`,
                        background: "#ffffff",
                        color: C.indigo,
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      ← Cấp trên
                    </button>
                  )}

                  {branchParent?.id !== activeStage?.id && stageTopGoals.length < 3 && (
                    <button
                      type="button"
                      onClick={handleAddSubGoalInBranch}
                      style={{
                        height: 24,
                        padding: "0 9px",
                        borderRadius: 7,
                        border: `1px solid ${C.indigo}`,
                        background: C.indigoSoft,
                        color: C.indigo,
                        fontSize: 11.5,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      + Mục tiêu {currentBranchLevel}
                    </button>
                  )}

                  {branchParent?.id === activeStage?.id && (
                    <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>
                      Cuộn để xem {stageTopGoals.length} mục tiêu
                    </span>
                  )}
                </div>
              </div>

              {stageTopGoals.length === 0 ? (
                <div
                  style={{
                    background: "#fff",
                    border: `1px solid ${C.line}`,
                    borderRadius: 10,
                    padding: 14,
                    fontSize: 13,
                    color: C.muted,
                  }}
                >
                  Chưa có mục tiêu để thiết lập nguồn lực và điều kiện.
                </div>
              ) : (
                <div className="og-step2-scroll">
                  {stageTopGoals.map((goal, idx) => {
                    const isCardSelected = activeTopGoalId === goal.id;
                    const isOptionalResource = idx > 0;
                    const subGoalsCount = (goal.children || []).length;
                    const nextLevelNum = currentBranchLevel + 1;
                    return (
                      <div
                        key={goal.id}
                        onClick={() => setSelectedGoalId(goal.id)}
                        className={`og-goal-card ${isCardSelected ? "is-selected" : ""}`}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 8,
                            marginBottom: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 7,
                              fontWeight: 700,
                              fontSize: 13.5,
                              color: C.ink,
                            }}
                          >
                            <Square color={goal.core ? C.teal : C.indigo} />
                            <span>
                              {shorten(goal.title || `Mục tiêu ${idx + 1}`, 22)}
                            </span>
                            {goal.score && (
                              <span
                                style={{
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  color: C.indigo,
                                }}
                              >
                                ({goal.score}%)
                              </span>
                            )}
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            {/* Nút mở nhánh con để xác định nguồn lực & điều kiện cho Mục tiêu cấp 2 và cấp 3 */}
                            {nextLevelNum <= 3 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDrillDownBranch(goal);
                                }}
                                title={`Thiết lập nguồn lực & điều kiện cần/đủ cho nhánh Mục tiêu cấp ${nextLevelNum}`}
                                style={{
                                  height: 24,
                                  padding: "0 9px",
                                  borderRadius: 999,
                                  border: `1px solid ${C.indigo}`,
                                  background: C.indigoSoft,
                                  color: C.indigo,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 4,
                                }}
                              >
                                <span>
                                  {subGoalsCount > 0
                                    ? `Nhánh MT ${nextLevelNum} (${subGoalsCount})`
                                    : `+ Nhánh MT ${nextLevelNum}`}
                                </span>
                                <span aria-hidden="true">→</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePatchGoal(goal.id, { core: !goal.core });
                              }}
                              style={{
                                height: 24,
                                padding: "0 8px",
                                borderRadius: 999,
                                border: `1px solid ${goal.core ? "#a4e4de" : C.line}`,
                                background: goal.core ? C.tealSoft : "#f7f8fc",
                                color: goal.core ? "#0b8579" : C.muted,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              {goal.core ? "★ Mấu chốt" : "Mục tiêu"}
                            </button>
                          </div>
                        </div>

                        <Field
                          id={`res-${goal.id}`}
                          label="Nguồn lực"
                          hint={isOptionalResource ? "Optional" : undefined}
                        >
                          <input
                            id={`res-${goal.id}`}
                            className="og-input"
                            style={{ height: 34 }}
                            type="text"
                            placeholder="Chưa nhập"
                            value={goal.resource || ""}
                            onFocus={() => setSelectedGoalId(goal.id)}
                            onChange={(e) =>
                              handlePatchGoal(goal.id, { resource: e.target.value })
                            }
                          />
                        </Field>

                        <div style={{ marginBottom: 0 }}>
                          <label
                            htmlFor={`cond-${goal.id}`}
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              gap: 6,
                              fontSize: 13,
                              fontWeight: 600,
                              color: C.ink,
                              marginBottom: 4,
                            }}
                          >
                            <span aria-hidden="true">•</span>
                            <span>Điều kiện cần/đủ</span>
                          </label>
                          <textarea
                            id={`cond-${goal.id}`}
                            className="og-input"
                            style={{ minHeight: 50 }}
                            placeholder="Chưa nhập"
                            value={goal.condition || ""}
                            onFocus={() => setSelectedGoalId(goal.id)}
                            onChange={(e) =>
                              handlePatchGoal(goal.id, { condition: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Ô BÊN PHẢI: BƯỚC 3 (Điểm giới hạn tổng tối đa 100 = 100%) */}
            <section className="og-side-panel" aria-label="Bảng thiết lập Bước 3">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  flex: "none",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 15,
                    fontWeight: 700,
                    color: C.ink,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Square color={C.violet} />
                  <span>Bước 3: Gán</span>
                </h2>

                {selectedGoal && (
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: C.indigo,
                      background: C.indigoSoft,
                      padding: "2px 8px",
                      borderRadius: 999,
                    }}
                  >
                    {shorten(selectedGoal.title || "Mục tiêu", 22)}
                  </span>
                )}
              </div>

              <div className="og-goal-card" style={{ flex: 1, overflowY: "auto" }}>
                <Field
                  id="g-score"
                  label="Điểm (%)"
                  hint={`Tổng chặng: ${totalStageScore}/100% • Còn lại: ${remainingScore}%`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      id="g-score"
                      className="og-input"
                      style={{ height: 36 }}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      placeholder="0 - 100"
                      disabled={!selectedGoal}
                      value={selectedGoal?.score ?? ""}
                      onChange={(e) =>
                        handlePatchGoal(selectedGoal?.id, { score: e.target.value })
                      }
                    />
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: totalStageScore === 100 ? "#0b8579" : C.muted,
                        whiteSpace: "nowrap",
                      }}
                    >
                      / 100%
                    </span>
                  </div>
                  {/* Thanh tỷ trọng điểm 100% của cả chặng */}
                  <div
                    aria-hidden="true"
                    style={{
                      marginTop: 6,
                      height: 6,
                      borderRadius: 999,
                      background: "#eaedf6",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(100, totalStageScore)}%`,
                        height: "100%",
                        background: totalStageScore === 100 ? C.teal : C.indigo,
                        transition: "width 0.2s ease",
                      }}
                    />
                  </div>
                </Field>

                <Field id="g-due" label="Thời hạn">
                  <input
                    id="g-due"
                    className="og-input"
                    style={{ height: 36 }}
                    type="date"
                    disabled={!selectedGoal}
                    value={selectedGoal?.due || ""}
                    onChange={(e) =>
                      handlePatchGoal(selectedGoal?.id, { due: e.target.value })
                    }
                  />
                </Field>

                <div style={{ marginBottom: 0 }}>
                  <span
                    id="g-unit-label"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.ink,
                      marginBottom: 6,
                    }}
                  >
                    <span aria-hidden="true">•</span>
                    <span>Giới hạn việc:</span>
                  </span>
                  <div
                    role="radiogroup"
                    aria-labelledby="g-unit-label"
                    style={{ display: "flex", gap: 8 }}
                  >
                    {units.map((u) => {
                      const checked = (selectedGoal?.limitUnit || "") === u.v;
                      return (
                        <button
                          key={u.v}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          disabled={!selectedGoal}
                          className="og-btn"
                          style={{
                            flex: 1,
                            height: 34,
                            padding: 0,
                            fontSize: 13,
                          }}
                          onClick={() =>
                            handlePatchGoal(selectedGoal?.id, { limitUnit: u.v })
                          }
                        >
                          {u.t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}