import React, { useState, useMemo, useRef } from "react";

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

/* ---------- Dữ liệu khởi tạo đa chặng (tối đa 4 chặng) ---------- */
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
        children: [
          {
            id: "a1",
            title: "Mục tiêu mấu chốt",
            note: "",
            core: true,
            children: [
              { id: "a1a", title: "Mục tiêu mấu chốt", note: "", core: true, children: [] },
              { id: "a1b", title: "Mục tiêu nhỏ 3", note: "", core: false, children: [] },
              { id: "a1c", title: "", note: "", core: false, children: [] },
            ],
          },
          { id: "a2", title: "Mục tiêu vừa 2", note: "", core: false, children: [] },
          { id: "a3", title: "", note: "", core: false, children: [] },
        ],
      },
      { id: "b", title: "Mục tiêu lớn 1", note: "", core: false, children: [] },
      { id: "c", title: "Mục tiêu lớn 1", note: "", core: false, children: [] },
      { id: "d", title: "Mục tiêu lớn 1", note: "", core: false, children: [] },
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

/* ---------- Các hàm tiện ích thao tác trên danh sách chặng & cây phân cấp ---------- */
function shorten(str, max = 18) {
  if (!str) return "";
  const trimmed = String(str).trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
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

function addChildInTree(node, parentId, newChild) {
  if (node.id === parentId) {
    return {
      ...node,
      children: [...(node.children || []), newChild],
    };
  }
  if (!node.children || node.children.length === 0) return node;
  return {
    ...node,
    children: node.children.map((c) => addChildInTree(c, parentId, newChild)),
  };
}

function deleteNodeInTree(node, targetId) {
  if (!node.children || node.children.length === 0) return node;
  return {
    ...node,
    children: node.children
      .filter((c) => c.id !== targetId)
      .map((c) => deleteNodeInTree(c, targetId)),
  };
}

function collectExpandableIds(stages, acc = {}) {
  stages.forEach((stage) => {
    acc[stage.id] = true;
    const walk = (n) => {
      if (n.children && n.children.length > 0) {
        acc[n.id] = true;
        n.children.forEach(walk);
      }
    };
    (stage.children || []).forEach(walk);
  });
  return acc;
}

function countGoalsInStage(stage) {
  let count = 0;
  const walk = (n) => {
    count += 1;
    (n.children || []).forEach(walk);
  };
  (stage.children || []).forEach(walk);
  return count;
}

/* ---------- Các biểu tượng SVG & Component nhánh phân cấp ---------- */
function Square({ color = C.indigo }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 12,
        height: 12,
        borderRadius: 3,
        backgroundColor: color,
        flexShrink: 0,
      }}
    />
  );
}

function PlusIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.16s ease",
      }}
    >
      <path d="M6 3.5L10.5 8L6 12.5" />
    </svg>
  );
}

function TrashOrCloseIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" />
    </svg>
  );
}

function StepOneBranchItem({
  node,
  depth,
  selectedId,
  expandedMap,
  onToggleExpand,
  onSelect,
  onChangeTitle,
  onToggleCore,
  onAddChild,
  onDelete,
  rowRefs,
}) {
  const hasChildren = (node.children || []).length > 0;
  const isOpen = expandedMap[node.id] !== false;
  const isSelected = selectedId === node.id;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div
        ref={(el) => {
          if (el) rowRefs.current[node.id] = el;
          else delete rowRefs.current[node.id];
        }}
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? isOpen : undefined}
        onClick={() => onSelect(node.id)}
        className={`np-tree-row ${isSelected ? "is-selected" : ""}`}
        style={{
          marginLeft: depth * 16,
          background: isSelected ? C.indigoSoft : "#ffffff",
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="np-mini-icon"
            title={isOpen ? "Thu gọn nhánh" : "Mở rộng nhánh"}
            aria-label={isOpen ? "Thu gọn nhánh" : "Mở rộng nhánh"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
          >
            <ChevronIcon open={isOpen} />
          </button>
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: 20,
              height: 20,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: node.core ? C.teal : "#b3bad6",
              fontSize: 10,
              flexShrink: 0,
            }}
          >
            ●
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCore(node.id);
          }}
          className={`np-role-pill ${node.core ? "is-core" : ""}`}
          title="Chuyển đổi giữa Mục tiêu mấu chốt và Mục tiêu thường"
        >
          {node.core ? "★ Mấu chốt" : "Mục tiêu"}
        </button>

        <input
          type="text"
          className="np-row-input"
          value={node.title}
          placeholder="Nhập tên mục tiêu..."
          aria-label="Tên mục tiêu"
          onFocus={() => onSelect(node.id)}
          onChange={(e) => onChangeTitle(node.id, e.target.value)}
        />

        <button
          type="button"
          className="np-add-circle-btn"
          title="Thêm mục tiêu con"
          aria-label="Thêm mục tiêu con"
          onClick={(e) => {
            e.stopPropagation();
            onAddChild(node.id, false);
          }}
        >
          <PlusIcon size={11} />
        </button>

        <button
          type="button"
          className="np-del-btn"
          title="Xóa mục tiêu"
          aria-label="Xóa mục tiêu"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
        >
          <TrashOrCloseIcon />
        </button>
      </div>

      {hasChildren && isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {node.children.map((child) => (
            <StepOneBranchItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expandedMap={expandedMap}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onChangeTitle={onChangeTitle}
              onToggleCore={onToggleCore}
              onAddChild={onAddChild}
              onDelete={onDelete}
              rowRefs={rowRefs}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Thuật toán tính tọa độ nối tiếp đa chặng trên 1 trục ngang ---------- */
function computeMultiStageLayout(stages) {
  const STAGE_W = 128;
  const ROOT_TO_FIRST_LEVEL_GAP = 64;
  const LEVEL_STEP_X = 186;
  const NODE_W = 148;
  const STAGE_TAIL_GAP = 72;
  const ROW_STEP = 44;
  const AXIS_GAP = 32;
  const TOP_PAD = 34;
  const BOTTOM_PAD = 28;

  // Trước tiên phân tích từng chặng để tìm số lượng slot lá trên/dưới trục và chiều sâu tối đa
  const stageLayouts = stages.map((stage) => {
    const topLevel = stage.children || [];
    let splitIndex = 1;
    if (topLevel.length === 0) {
      splitIndex = 0;
    } else {
      let leadingCore = 0;
      while (leadingCore < topLevel.length && topLevel[leadingCore].core) {
        leadingCore++;
      }
      if (leadingCore >= 1 && leadingCore < topLevel.length) {
        splitIndex = leadingCore;
      } else {
        splitIndex = 1;
      }
    }

    const aboveBranches = topLevel.slice(0, splitIndex);
    const belowBranches = topLevel.slice(splitIndex);

    const localNodes = [];
    const localEdges = [];
    let maxDepth = 0;

    function layoutSubtree(node, depth, state) {
      if (depth > maxDepth) maxDepth = depth;
      const kids = node.children || [];
      let rowSlot;

      if (kids.length === 0) {
        rowSlot = state.leafCount++;
      } else {
        const childSlots = kids.map((k) => layoutSubtree(k, depth + 1, state));
        rowSlot = (childSlots[0] + childSlots[childSlots.length - 1]) / 2;
      }

      const relX = STAGE_W + ROOT_TO_FIRST_LEVEL_GAP + (depth - 1) * LEVEL_STEP_X;
      localNodes.push({
        id: node.id,
        title: node.title,
        core: !!node.core,
        depth,
        relX,
        w: NODE_W,
        rowSlot,
        isRoot: false,
        childCount: kids.length,
      });

      kids.forEach((k) => {
        localEdges.push({ from: node.id, to: k.id });
      });

      return rowSlot;
    }

    const aboveState = { leafCount: 0 };
    aboveBranches.forEach((b) => layoutSubtree(b, 1, aboveState));
    const aboveEndIdx = localNodes.length;

    const belowState = { leafCount: 0 };
    belowBranches.forEach((b) => layoutSubtree(b, 1, belowState));

    const stageWidth =
      maxDepth === 0
        ? STAGE_W + 76
        : STAGE_W + ROOT_TO_FIRST_LEVEL_GAP + (maxDepth - 1) * LEVEL_STEP_X + NODE_W + STAGE_TAIL_GAP;

    return {
      stage,
      topLevel,
      localNodes,
      localEdges,
      aboveEndIdx,
      aboveRows: Math.max(aboveState.leafCount, 1),
      belowRows: Math.max(belowState.leafCount, 1),
      stageWidth,
    };
  });

  // Trục ngang thống nhất theo chiều cao lớn nhất giữa các chặng
  const maxAboveRows = Math.max(1, ...stageLayouts.map((s) => s.aboveRows));
  const maxBelowRows = Math.max(1, ...stageLayouts.map((s) => s.belowRows));
  const axisY = TOP_PAD + maxAboveRows * ROW_STEP + AXIS_GAP;
  const totalHeight = Math.max(300, axisY + AXIS_GAP + maxBelowRows * ROW_STEP + BOTTOM_PAD);

  const nodes = [];
  const edges = [];
  let cursorX = 32;

  stageLayouts.forEach((sl) => {
    const baseX = cursorX;
    // Căn nhóm trên sát phía trên trục ngang để cân đối thị giác
    const aboveOffsetRows = maxAboveRows - sl.aboveRows;

    sl.localNodes.forEach((ln, idx) => {
      const isAbove = idx < sl.aboveEndIdx;
      const y = isAbove
        ? TOP_PAD + 12 + (aboveOffsetRows + ln.rowSlot) * ROW_STEP
        : axisY + AXIS_GAP + 12 + ln.rowSlot * ROW_STEP;

      nodes.push({
        ...ln,
        x: baseX + ln.relX,
        y,
      });
    });

    sl.localEdges.forEach((le) => edges.push(le));

    // Mốc chặng trên trục ngang
    nodes.push({
      id: sl.stage.id,
      title: sl.stage.title,
      core: false,
      depth: 0,
      x: baseX,
      y: axisY,
      w: STAGE_W,
      isRoot: true,
      childCount: sl.topLevel.length,
    });

    const splitPointX = baseX + STAGE_W + 18;
    sl.topLevel.forEach((b) => {
      edges.push({
        sx: splitPointX,
        sy: axisY,
        to: b.id,
        fromRootSplit: true,
      });
    });

    cursorX += sl.stageWidth;
  });

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const totalWidth = Math.max(1120, cursorX + 24);

  return {
    nodes,
    edges,
    nodeMap,
    axisY,
    width: totalWidth,
    height: totalHeight,
  };
}

/* ---------- Hệ thống CSS cho toàn bộ giao diện ---------- */
const APP_STYLES = `
  .np, .np * {
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }

  .np {
    color: ${C.text};
    -webkit-font-smoothing: antialiased;
  }

  .np-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    padding: 0 14px;
    border-radius: 10px;
    border: 1px solid ${C.line};
    background: ${C.card};
    color: ${C.ink};
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    box-shadow: 0 1px 2px rgba(27, 32, 56, 0.04);
  }

  .np-btn:hover:not(:disabled) {
    background: #f5f7fc;
    border-color: #cfd5ea;
    transform: translateY(-0.5px);
  }

  .np-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .np-btn.primary {
    background: ${C.indigo};
    border-color: ${C.indigo};
    color: #ffffff;
    box-shadow: 0 3px 10px -3px rgba(79, 82, 217, 0.45);
  }

  .np-btn.primary:hover:not(:disabled) {
    background: #4245c7;
    border-color: #4245c7;
  }

  .np-btn.teal {
    background: ${C.tealSoft};
    border-color: #b4eae5;
    color: #0b8579;
  }

  .np-btn.teal:hover:not(:disabled) {
    background: #d1f1ee;
    border-color: ${C.teal};
  }

  .np-btn.danger {
    background: ${C.coralSoft};
    border-color: #f8c8c7;
    color: ${C.coral};
  }

  .np-btn.danger:hover:not(:disabled) {
    background: #fbd9d8;
    border-color: ${C.coral};
  }

  .np-edit-info-btn {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 6px 10px;
    border-radius: 10px;
    border: 1px solid transparent;
    background: transparent;
    color: ${C.ink};
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .np-edit-info-btn:hover {
    background: #f4f6fc;
    border-color: ${C.line};
  }

  .np-edit-info-badge {
    width: 54px;
    height: 18px;
    border-radius: 4px;
    background: #8c92a4;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;
  }

  .np-edit-info-btn:hover .np-edit-info-badge {
    background: ${C.indigo};
  }

  .np-node {
    cursor: pointer;
    outline: none;
  }

  .np-node .np-pill {
    transition: fill 0.16s ease, stroke 0.16s ease;
  }

  .np-node:hover .np-pill {
    filter: brightness(0.97);
  }

  .np-node:focus-visible .np-pill {
    stroke: ${C.indigo};
    stroke-width: 2px;
  }

  /* Bố cục 2 khối cân bằng ở chính giữa bên dưới khung hiển thị Tree */
  .np-bottom {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
    gap: 32px;
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
  }

  .np-bottom-card {
    background: ${C.panel};
    border: 1px solid ${C.line};
    border-radius: 12px;
    padding: 24px 26px;
    min-height: 380px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .np-tree-viewport {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    cursor: grab;
    user-select: none;
    border-radius: 10px;
    padding-bottom: 6px;
  }

  .np-tree-viewport.is-dragging {
    cursor: grabbing;
  }

  .np-tree-viewport::-webkit-scrollbar {
    height: 8px;
  }

  .np-tree-viewport::-webkit-scrollbar-track {
    background: #f4f6fc;
    border-radius: 99px;
  }

  .np-tree-viewport::-webkit-scrollbar-thumb {
    background: #c5cde6;
    border-radius: 99px;
  }

  .np-tree-viewport::-webkit-scrollbar-thumb:hover {
    background: #9faad0;
  }

  @media (max-width: 920px) {
    .np-bottom {
      grid-template-columns: 1fr;
      max-width: 560px;
      gap: 20px;
    }

    .np-bottom-card {
      min-height: auto;
    }
  }

  .np-tree-scroll {
    margin-top: 12px;
    max-height: 290px;
    overflow-y: auto;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .np-tree-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .np-tree-scroll::-webkit-scrollbar-thumb {
    background: #ccd2e8;
    border-radius: 99px;
  }

  .np-tree-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    border-radius: 9px;
    border: 1px solid ${C.line};
    background: #ffffff;
    transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
  }

  .np-tree-row:hover {
    border-color: #c5cde8;
  }

  .np-tree-row.is-selected {
    border-color: ${C.indigo};
    box-shadow: 0 0 0 2px rgba(79, 82, 217, 0.12);
  }

  .np-mini-icon {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: ${C.muted};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
  }

  .np-mini-icon:hover {
    background: #f4f6fc;
    color: ${C.ink};
  }

  .np-role-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 24px;
    padding: 0 8px;
    border-radius: 999px;
    border: 1px solid ${C.line};
    background: #f7f8fc;
    color: ${C.muted};
    font-size: 11.5px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  .np-role-pill:hover {
    border-color: #c6cde6;
    color: ${C.ink};
  }

  .np-role-pill.is-core {
    background: ${C.tealSoft};
    border-color: #a4e4de;
    color: #0b8579;
  }

  .np-row-input {
    flex: 1;
    min-width: 60px;
    border: none;
    background: transparent;
    color: ${C.ink};
    font-size: 13px;
    font-weight: 500;
    padding: 3px 4px;
    outline: none;
  }

  .np-row-input::placeholder {
    color: #9aa2c2;
    font-style: italic;
  }

  .np-add-circle-btn {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 1px solid #cfd5ee;
    background: #f7f8fc;
    color: ${C.indigo};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
    transition: all 0.14s ease;
  }

  .np-add-circle-btn:hover {
    background: ${C.indigo};
    border-color: ${C.indigo};
    color: #ffffff;
  }

  .np-del-btn {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: ${C.muted};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    padding: 0;
    transition: all 0.14s ease;
  }

  .np-del-btn:hover {
    background: ${C.coralSoft};
    color: ${C.coral};
  }

  .np-input {
    width: 100%;
    border: 1px solid ${C.line};
    background: #ffffff;
    color: ${C.ink};
    border-radius: 10px;
    padding: 9px 12px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }

  input.np-input {
    height: 40px;
  }

  textarea.np-input {
    min-height: 120px;
    resize: vertical;
    line-height: 1.5;
  }

  .np-input:focus {
    background: #ffffff;
    border-color: ${C.indigo};
    box-shadow: 0 0 0 3px rgba(79, 82, 217, 0.12);
  }
`;

/* ---------- Màn hình chính ---------- */
export default function App() {
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [selectedId, setSelectedId] = useState("a");
  const [expandedMap, setExpandedMap] = useState(() => collectExpandableIds(INITIAL_STAGES));
  const [quickTitle, setQuickTitle] = useState("");
  const [quickIsCore, setQuickIsCore] = useState(false);
  const [backNotice, setBackNotice] = useState(false);
  const [isDraggingTree, setIsDraggingTree] = useState(false);

  const titleRef = useRef(null);
  const rowRefs = useRef({});
  const nextIdCounter = useRef(1);
  const treeScrollRef = useRef(null);
  const dragStateRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  // Tính toán bố cục SVG nối tiếp toàn bộ các chặng
  const treeLayout = useMemo(() => computeMultiStageLayout(stages), [stages]);

  // Tìm nút đang được chọn và chặng chứa nút đó
  const selectedNode = useMemo(
    () => findNodeInStages(stages, selectedId) || stages[0],
    [stages, selectedId]
  );
  const activeStage = useMemo(
    () => findStageOfNode(stages, selectedId) || stages[0],
    [stages, selectedId]
  );

  // Cuộn mượt tới dòng đang chọn trong thẻ Bước 1 khi nhấp trực tiếp trên sơ đồ Tree
  const selectAndScrollToRow = (id) => {
    setSelectedId(id);
    const ownerStage = findStageOfNode(stages, id);
    setExpandedMap((prev) => ({
      ...prev,
      ...(ownerStage ? { [ownerStage.id]: true } : {}),
      [id]: true,
    }));
    requestAnimationFrame(() => {
      const el = rowRefs.current[id];
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  };

  const handleUpdateNode = (id, patch) => {
    setStages((prev) => prev.map((st) => updateNodeInTree(st, id, patch)));
  };

  const handleToggleCore = (id) => {
    const target = findNodeInStages(stages, id);
    if (!target || target.isStage) return;
    handleUpdateNode(id, { core: !target.core });
  };

  const handleAddChild = (parentId, isCore = false, customTitle = "") => {
    const newId = `goal_${Date.now()}_${nextIdCounter.current++}`;
    const parentNode = findNodeInStages(stages, parentId);
    const isStageParent = !!parentNode?.isStage;

    const defaultLabel =
      customTitle.trim() !== ""
        ? customTitle.trim()
        : isCore
        ? "Mục tiêu mấu chốt"
        : isStageParent
        ? "Mục tiêu lớn mới"
        : "Mục tiêu nhỏ";

    const newNode = {
      id: newId,
      title: defaultLabel,
      note: "",
      core: isCore,
      children: [],
    };

    const ownerStage = findStageOfNode(stages, parentId);
    setStages((prev) => prev.map((st) => addChildInTree(st, parentId, newNode)));
    setExpandedMap((prev) => ({
      ...prev,
      ...(ownerStage ? { [ownerStage.id]: true } : {}),
      [parentId]: true,
    }));
    setSelectedId(newId);

    requestAnimationFrame(() => {
      const el = rowRefs.current[newId];
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  };

  const handleQuickAddToActiveStage = (e) => {
    e.preventDefault();
    if (!activeStage) return;
    handleAddChild(activeStage.id, quickIsCore, quickTitle);
    setQuickTitle("");
  };

  // Thêm chặng mới (giới hạn tối đa 4 chặng: Chặng 1 -> Chặng 4)
  const handleAddStage = () => {
    if (stages.length >= MAX_STAGES) return;
    const nextIndex = stages.length + 1;
    const newStageId = `stage_${Date.now()}_${nextIdCounter.current++}`;
    const newStage = {
      id: newStageId,
      title: `Chặng ${nextIndex}`,
      note: "",
      core: false,
      isStage: true,
      children: [],
    };
    setStages((prev) => [...prev, newStage]);
    setExpandedMap((prev) => ({ ...prev, [newStageId]: true }));
    setSelectedId(newStageId);

    requestAnimationFrame(() => {
      const el = rowRefs.current[newStageId];
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  };

  const handleDeleteNode = (targetId) => {
    // Không xóa Chặng 1 gốc
    if (stages[0] && targetId === stages[0].id) return;

    const isStageTarget = stages.some((st) => st.id === targetId);
    if (isStageTarget) {
      setStages((prev) => {
        const filtered = prev.filter((st) => st.id !== targetId);
        // Cập nhật lại tên mặc định nếu còn dạng "Chặng X"
        return filtered.map((st, idx) =>
          /^Chặng \d+$/.test(st.title.trim()) ? { ...st, title: `Chặng ${idx + 1}` } : st
        );
      });
      if (selectedId === targetId || activeStage?.id === targetId) {
        setSelectedId(stages[0].id);
      }
      return;
    }

    const ownerStage = findStageOfNode(stages, targetId);
    setStages((prev) => prev.map((st) => deleteNodeInTree(st, targetId)));
    if (selectedId === targetId) {
      setSelectedId(ownerStage ? ownerStage.id : stages[0].id);
    }
  };

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  /* ---------- Kéo thả & điều hướng cuộn ngang cho khung Tree ---------- */
  const handleTreeMouseDown = (e) => {
    if (e.button !== 0) return;
    const el = treeScrollRef.current;
    if (!el) return;
    dragStateRef.current = {
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
    setIsDraggingTree(true);
  };

  const handleTreeMouseMove = (e) => {
    if (!dragStateRef.current.active) return;
    const el = treeScrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const delta = x - dragStateRef.current.startX;
    if (Math.abs(delta) > 4) {
      dragStateRef.current.moved = true;
    }
    if (dragStateRef.current.moved) {
      e.preventDefault();
      el.scrollLeft = dragStateRef.current.scrollLeft - delta;
    }
  };

  const stopTreeDrag = () => {
    if (!dragStateRef.current.active) return;
    dragStateRef.current.active = false;
    setIsDraggingTree(false);
    // Đặt lại cờ moved sau một nhịp ngắn để chặn click nhầm khi vừa kéo xong
    setTimeout(() => {
      dragStateRef.current.moved = false;
    }, 0);
  };

  const scrollTreeBy = (offset) => {
    const el = treeScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const scrollTreeToStart = () => {
    const el = treeScrollRef.current;
    if (!el) return;
    el.scrollTo({ left: 0, behavior: "smooth" });
  };

  const isStageSelected = !!selectedNode?.isStage;
  const isFirstStageSelected = stages[0] && selectedNode?.id === stages[0].id;
  const totalGoalCount = useMemo(
    () => stages.reduce((sum, st) => sum + countGoalsInStage(st), 0),
    [stages]
  );
  const canAddMoreStages = stages.length < MAX_STAGES;

  return (
    <div
      className="np"
      style={{
        minHeight: "100vh",
        background: C.page,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{APP_STYLES}</style>

      {/* Thanh điều hướng trên */}
      <header
        style={{
          maxWidth: 1360,
          width: "100%",
          margin: "0 auto",
          padding: "16px 28px 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            className="np-btn"
            onClick={() => {
              setBackNotice(true);
              setTimeout(() => setBackNotice(false), 2600);
            }}
            aria-label="Quay lại"
          >
            <span aria-hidden="true">←</span>
            <span>Quay lại</span>
          </button>
          {backNotice && (
            <span
              style={{
                fontSize: 13,
                color: C.indigo,
                background: C.indigoSoft,
                padding: "6px 12px",
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              Đang ở màn hình lập Cây mục tiêu (Bước 1)
            </span>
          )}
        </div>

        <button
          type="button"
          className="np-edit-info-btn"
          onClick={() => titleRef.current?.focus()}
          aria-label="Chỉnh thông tin"
        >
          <span className="np-edit-info-badge" aria-hidden="true" />
          <span>Chỉnh thông tin</span>
        </button>
      </header>

      {/* Nội dung chính */}
      <main
        style={{
          maxWidth: 1360,
          width: "100%",
          margin: "0 auto",
          padding: "4px 28px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          flex: 1,
        }}
      >
        {/* Khu vực trên: Sơ đồ Goal Tree toàn chiều rộng, kéo trượt trái/phải tự do */}
        <section
          aria-label="Biểu đồ Cây mục tiêu"
          style={{
            background: C.card,
            border: `1px solid ${C.line}`,
            borderRadius: 14,
            padding: "12px 20px 14px",
            boxShadow: "0 2px 14px -8px rgba(27,32,56,0.06)",
          }}
        >
          {/* Thanh điều hướng kéo/cuộn ngang cho sơ đồ Tree */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 8,
              paddingBottom: 8,
              borderBottom: `1px solid #eef0f7`,
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                color: C.muted,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 500,
              }}
            >
              <span aria-hidden="true" style={{ color: C.indigo, fontWeight: 700 }}>
                ↔
              </span>
              <span>Kéo chuột trái/phải để trượt xem toàn bộ cây mục tiêu</span>
            </span>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <button
                type="button"
                className="np-btn"
                style={{ height: 28, padding: "0 10px", fontSize: 12, borderRadius: 8 }}
                onClick={() => scrollTreeBy(-280)}
                title="Cuộn sơ đồ sang trái"
                aria-label="Cuộn sơ đồ sang trái"
              >
                ←
              </button>
              <button
                type="button"
                className="np-btn"
                style={{ height: 28, padding: "0 10px", fontSize: 12, borderRadius: 8 }}
                onClick={scrollTreeToStart}
                title="Quay về đầu cây"
              >
                Đầu cây
              </button>
              <button
                type="button"
                className="np-btn"
                style={{ height: 28, padding: "0 10px", fontSize: 12, borderRadius: 8 }}
                onClick={() => scrollTreeBy(280)}
                title="Cuộn sơ đồ sang phải"
                aria-label="Cuộn sơ đồ sang phải"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={treeScrollRef}
            className={`np-tree-viewport ${isDraggingTree ? "is-dragging" : ""}`}
            onMouseDown={handleTreeMouseDown}
            onMouseMove={handleTreeMouseMove}
            onMouseUp={stopTreeDrag}
            onMouseLeave={stopTreeDrag}
          >
            <svg
              viewBox={`0 0 ${treeLayout.width} ${treeLayout.height}`}
              width={treeLayout.width}
              height={treeLayout.height}
              style={{
                width: treeLayout.width,
                height: treeLayout.height,
                display: "block",
                margin: "0 auto",
              }}
              role="group"
              aria-label="Cây mục tiêu qua các chặng"
            >
              {/* Trục ngang liên tục nối các chặng từ trái sang phải */}
              <line
                x1={16}
                y1={treeLayout.axisY}
                x2={treeLayout.width - 16}
                y2={treeLayout.axisY}
                stroke="#7c849d"
                strokeWidth="1.5"
              />

              {/* Đường cong Bezier nối mượt mà tới gạch chân từng mục tiêu */}
              {treeLayout.edges.map((e, idx) => {
                const target = treeLayout.nodeMap[e.to];
                if (!target) return null;
                const source = e.from ? treeLayout.nodeMap[e.from] : null;
                const sx = source ? source.x + source.w : e.sx;
                const sy = source ? source.y : e.sy;
                const tx = target.x;
                const ty = target.y;
                const cpx = sx + (tx - sx) * 0.55;
                const isHighlighted = selectedId === e.to || selectedId === e.from;
                return (
                  <path
                    key={`${e.from || "stage"}-${e.to}-${idx}`}
                    d={`M ${sx} ${sy} C ${cpx} ${sy}, ${sx + 16} ${ty}, ${tx} ${ty}`}
                    fill="none"
                    stroke={isHighlighted ? C.indigo : "#6a728c"}
                    strokeWidth={isHighlighted ? "1.9" : "1.45"}
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Các mốc chặng và nút mục tiêu trên sơ đồ */}
              {treeLayout.nodes.map((n) => {
                const liveNode = findNodeInStages(stages, n.id) || n;
                const t = liveNode.title || "";
                const empty = t.trim() === "";
                const selected = selectedId === n.id;
                const pick = () => {
                  if (dragStateRef.current.moved) return;
                  selectAndScrollToRow(n.id);
                };

                if (n.isRoot) {
                  return (
                    <g
                      key={n.id}
                      className="np-node"
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected}
                      aria-label={empty ? "Chặng" : t}
                      onClick={pick}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          pick();
                        }
                      }}
                    >
                      <rect
                        className="np-pill"
                        x={n.x}
                        y={n.y - 31}
                        width={n.w}
                        height={25}
                        rx="7"
                        fill={selected ? C.indigo : "transparent"}
                        stroke={selected ? C.indigo : "transparent"}
                        strokeWidth="1.2"
                      />
                      <text
                        x={n.x + n.w / 2}
                        y={n.y - 18}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="13.5"
                        fontWeight={selected ? "700" : "600"}
                        fill={selected ? "#ffffff" : C.ink}
                      >
                        {empty ? "Chặng" : shorten(t, 20)}
                      </text>
                    </g>
                  );
                }

                const lineColor = selected ? C.indigo : liveNode.core ? C.teal : "#6a728c";
                return (
                  <g
                    key={n.id}
                    className="np-node"
                    role="button"
                    tabIndex={0}
                    aria-pressed={selected}
                    aria-label={empty ? "Mục tiêu chưa nhập" : t}
                    onClick={pick}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pick();
                      }
                    }}
                  >
                    <title>{empty ? "Chưa nhập" : t}</title>
                    <rect
                      className="np-pill"
                      x={n.x}
                      y={n.y - 26}
                      width={n.w}
                      height={24}
                      rx="6"
                      fill={selected ? C.indigoSoft : liveNode.core ? C.tealSoft : "transparent"}
                      stroke={selected ? C.indigo : "transparent"}
                      strokeWidth="1.2"
                    />
                    <line
                      x1={n.x}
                      y1={n.y}
                      x2={n.x + n.w}
                      y2={n.y}
                      stroke={lineColor}
                      strokeWidth={selected ? "2.1" : "1.45"}
                      strokeDasharray={empty ? "4 3" : undefined}
                    />
                    <text
                      x={n.x + 6}
                      y={n.y - 13}
                      dominantBaseline="central"
                      fontSize="13"
                      fontWeight={liveNode.core || selected ? 600 : 500}
                      fill={selected ? C.indigo : empty ? C.muted : C.ink}
                    >
                      {empty ? "" : shorten(t)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Khu vực phía dưới: 2 ô khối vuông/chữ nhật lớn cân bằng đặt cạnh nhau ở chính giữa */}
        <div className="np-bottom">
          {/* Ô bên trái: Bước 1 */}
          <section
            aria-labelledby="guide-title"
            className="np-bottom-card"
            style={{ fontSize: 14 }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <h2
                    id="guide-title"
                    style={{
                      margin: "0 0 3px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.ink,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Square color={C.indigo} />
                    <span>Bước 1:</span>
                  </h2>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5, color: C.text }}>
                    Lặp theo từng chặng ({stages.length}/{MAX_STAGES} chặng • {totalGoalCount} mục tiêu):
                  </p>
                </div>

                <button
                  type="button"
                  className="np-btn"
                  disabled={!canAddMoreStages}
                  onClick={handleAddStage}
                  title={
                    canAddMoreStages
                      ? `Thêm Chặng ${stages.length + 1}`
                      : "Đã đạt giới hạn tối đa 4 chặng"
                  }
                  style={{
                    height: 32,
                    padding: "0 11px",
                    fontSize: 12.5,
                    opacity: canAddMoreStages ? 1 : 0.55,
                    cursor: canAddMoreStages ? "pointer" : "not-allowed",
                    flex: "none",
                  }}
                >
                  <PlusIcon size={13} />
                  <span>{canAddMoreStages ? `Thêm chặng (${stages.length}/${MAX_STAGES})` : "Tối đa 4 chặng"}</span>
                </button>
              </div>

              {/* Danh sách các chặng & mục tiêu phân cấp lồng nhau */}
              <div className="np-tree-scroll" role="tree" aria-label="Danh sách các chặng và mục tiêu">
                {stages.map((stage, stageIdx) => {
                  const isStageOpen = expandedMap[stage.id] !== false;
                  const isStageSel = selectedId === stage.id;
                  const isActiveStage = activeStage?.id === stage.id;

                  return (
                    <div
                      key={stage.id}
                      style={{
                        background: isActiveStage ? "#fafbfe" : "#f5f6fb",
                        border: `1px solid ${isStageSel ? C.indigo : "#d9deef"}`,
                        borderRadius: 10,
                        padding: 8,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      {/* Tiêu đề chặng */}
                      <div
                        ref={(el) => {
                          if (el) rowRefs.current[stage.id] = el;
                          else delete rowRefs.current[stage.id];
                        }}
                        onClick={() => setSelectedId(stage.id)}
                        className={`np-tree-row ${isStageSel ? "is-selected" : ""}`}
                        style={{ background: isStageSel ? C.indigoSoft : "#fff" }}
                      >
                        <button
                          type="button"
                          className="np-mini-icon"
                          title={isStageOpen ? "Thu gọn chặng" : "Mở rộng chặng"}
                          aria-label={isStageOpen ? "Thu gọn chặng" : "Mở rộng chặng"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(stage.id);
                          }}
                        >
                          <ChevronIcon open={isStageOpen} />
                        </button>

                        <span
                          className="np-role-pill"
                          style={{
                            background: C.indigoSoft,
                            borderColor: "#c5c7f7",
                            color: C.indigo,
                            cursor: "default",
                          }}
                        >
                          Chặng {stageIdx + 1}
                        </span>

                        <input
                          type="text"
                          className="np-row-input"
                          style={{ fontWeight: 700, color: C.indigo }}
                          value={stage.title}
                          placeholder={`Chặng ${stageIdx + 1}...`}
                          aria-label={`Tên ${stage.title || `Chặng ${stageIdx + 1}`}`}
                          onFocus={() => setSelectedId(stage.id)}
                          onChange={(e) => handleUpdateNode(stage.id, { title: e.target.value })}
                        />

                        <button
                          type="button"
                          className="np-add-circle-btn"
                          title={`Thêm mục tiêu vào ${stage.title || `Chặng ${stageIdx + 1}`}`}
                          aria-label={`Thêm mục tiêu vào ${stage.title || `Chặng ${stageIdx + 1}`}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddChild(stage.id, false);
                          }}
                        >
                          <PlusIcon size={12} />
                        </button>

                        {stageIdx > 0 && (
                          <button
                            type="button"
                            className="np-del-btn"
                            title={`Xóa ${stage.title || `Chặng ${stageIdx + 1}`}`}
                            aria-label={`Xóa ${stage.title || `Chặng ${stageIdx + 1}`}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNode(stage.id);
                            }}
                          >
                            <TrashOrCloseIcon />
                          </button>
                        )}
                      </div>

                      {/* Các nhánh mục tiêu thuộc chặng */}
                      {isStageOpen && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 6 }}>
                          {stage.children.length === 0 ? (
                            <div
                              style={{
                                padding: "8px 10px",
                                borderRadius: 8,
                                background: "#fff",
                                border: "1px dashed #ccd2ea",
                                color: C.muted,
                                fontSize: 12.5,
                              }}
                            >
                              Chưa có mục tiêu. Nhấn nút <strong>(+)</strong> ở trên để thêm mục tiêu cho {stage.title || `Chặng ${stageIdx + 1}`}.
                            </div>
                          ) : (
                            stage.children.map((branch) => (
                              <StepOneBranchItem
                                key={branch.id}
                                node={branch}
                                depth={0}
                                selectedId={selectedId}
                                expandedMap={expandedMap}
                                onToggleExpand={toggleExpand}
                                onSelect={(id) => setSelectedId(id)}
                                onChangeTitle={(id, title) => handleUpdateNode(id, { title })}
                                onToggleCore={handleToggleCore}
                                onAddChild={handleAddChild}
                                onDelete={handleDeleteNode}
                                rowRefs={rowRefs}
                              />
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Khu vực thêm mục tiêu nhanh vào chặng đang làm việc */}
            <form
              onSubmit={handleQuickAddToActiveStage}
              style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: `1px solid ${C.line}`,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="text"
                  className="np-input"
                  style={{ height: 36, background: "#fff", fontSize: 13.5 }}
                  placeholder={`Thêm mục tiêu vào ${activeStage?.title || "Chặng 1"}...`}
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setQuickIsCore((v) => !v)}
                  className={`np-role-pill ${quickIsCore ? "is-core" : ""}`}
                  style={{ height: 36, padding: "0 11px", fontSize: 12 }}
                  title="Chọn loại mục tiêu khi thêm mới"
                >
                  {quickIsCore ? "★ Mấu chốt" : "Mục tiêu"}
                </button>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="submit"
                  className="np-btn primary"
                  style={{ flex: 1, height: 36, fontSize: 13 }}
                >
                  <PlusIcon size={14} />
                  <span>{quickIsCore ? "Thêm Mục tiêu mấu chốt" : "Thêm mục tiêu"}</span>
                </button>
                <button
                  type="button"
                  className="np-btn teal"
                  style={{ height: 36, fontSize: 13 }}
                  onClick={() => {
                    if (!activeStage) return;
                    handleAddChild(activeStage.id, true, quickTitle);
                    setQuickTitle("");
                  }}
                >
                  <PlusIcon size={14} />
                  <span>+ Mấu chốt</span>
                </button>
              </div>
            </form>
          </section>

          {/* Ô bên phải: Ghi chú */}
          <section
            aria-labelledby="note-card-title"
            className="np-bottom-card"
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <h2
                    id="note-card-title"
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.ink,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <Square color={C.indigo} />
                    <span>Ghi chú</span>
                  </h2>
                  <span
                    title={selectedNode.title || (isStageSelected ? "Chặng" : "Chưa nhập")}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: C.indigo,
                      background: C.indigoSoft,
                      padding: "2px 9px",
                      borderRadius: 999,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {shorten(selectedNode.title || (isStageSelected ? "Chặng" : "Chưa nhập"), 22)}
                  </span>
                </div>

                {!isStageSelected && (
                  <button
                    type="button"
                    onClick={() => handleToggleCore(selectedNode.id)}
                    className={`np-role-pill ${selectedNode.core ? "is-core" : ""}`}
                    style={{ padding: "3px 10px", fontSize: 12 }}
                  >
                    {selectedNode.core ? "● Mục tiêu mấu chốt" : "○ Đánh dấu mấu chốt"}
                  </button>
                )}
              </div>

              {/* • TIÊU ĐỀ */}
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="goal-title"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: C.ink,
                    marginBottom: 6,
                  }}
                >
                  <span aria-hidden="true">•</span>
                  <span>TIÊU ĐỀ</span>
                </label>
                <input
                  id="goal-title"
                  ref={titleRef}
                  className="np-input"
                  type="text"
                  value={selectedNode.title}
                  placeholder={isStageSelected ? "Tên chặng..." : "Chưa nhập"}
                  onChange={(e) => handleUpdateNode(selectedNode.id, { title: e.target.value })}
                />
              </div>

              {/* • Ghi chú */}
              <div style={{ marginBottom: 16 }}>
                <label
                  htmlFor="goal-note"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: C.ink,
                    marginBottom: 6,
                  }}
                >
                  <span aria-hidden="true">•</span>
                  <span>Ghi chú</span>
                </label>
                <textarea
                  id="goal-note"
                  className="np-input"
                  placeholder="Nhập mô tả chi tiết, tiêu chí hoàn thành hoặc ghi chú..."
                  value={selectedNode.note || ""}
                  onChange={(e) => handleUpdateNode(selectedNode.id, { note: e.target.value })}
                />
              </div>
            </div>

            {/* Thao tác phân nhánh nhỏ hoặc xóa */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 12, borderTop: `1px solid ${C.line}` }}>
              <button
                type="button"
                className="np-btn"
                style={{ flex: 1, height: 36, fontSize: 13 }}
                onClick={() => handleAddChild(selectedNode.id, false)}
              >
                <PlusIcon size={14} />
                <span>{isStageSelected ? "Thêm mục tiêu cấp 1" : "Thêm nhánh nhỏ"}</span>
              </button>

              {!isFirstStageSelected && (
                <button
                  type="button"
                  className="np-btn danger"
                  style={{ height: 36, fontSize: 13 }}
                  onClick={() => handleDeleteNode(selectedNode.id)}
                >
                  <span>{isStageSelected ? "Xóa chặng" : "Xóa"}</span>
                </button>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}