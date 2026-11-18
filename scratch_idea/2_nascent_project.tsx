import React, { useState, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Nascent Project – màn hình Docs                                    */
/*  Giữ nguyên cấu trúc wireframe (thanh bên + form + nút goal tree),  */
/*  nâng cấp các ô nhập liệu thành trình soạn thảo Outliner hỗ trợ     */
/*  gạch đầu dòng phân cấp, đường kẻ dọc nối nhánh và Ctrl+Z / Ctrl+Y. */
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
  violet: "#7b4fe0",
  coral: "#f0524f",
  amber: "#e8960c",
};

const css = `
  .np * { box-sizing: border-box; }
  .np { font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif;
        color: ${C.text}; font-size: 15px; line-height: 1.5; }
  .np button, .np input, .np textarea { font-family: inherit; font-size: inherit; color: inherit; }

  .np-nav { display:flex; align-items:center; gap:12px; width:100%; height:42px; padding:0 12px;
            border:0; border-radius:10px; background:transparent; color:${C.muted};
            font-weight:500; text-align:left; cursor:pointer; transition: background .15s, color .15s; }
  .np-nav:hover { background:#fff; color:${C.ink}; }
  .np-nav[aria-current="page"] { background:${C.indigoSoft}; color:${C.indigo}; font-weight:600; }

  .np-field-head { display:flex; align-items:center; justify-content:space-between; gap:8px; min-height:24px; margin-bottom:6px; }
  .np-field-head label { margin:0; font-size:13px; font-weight:500; color:${C.text}; cursor:pointer; }

  .np-toolbar { display:inline-flex; align-items:center; gap:2px; background:#fff; border:1px solid ${C.line};
                border-radius:8px; padding:2px 4px; box-shadow: 0 2px 6px rgba(27, 32, 56, 0.05); }
  .np-tool-btn { display:inline-flex; align-items:center; justify-content:center; width:24px; height:22px;
                 border:0; border-radius:5px; background:transparent; color:${C.muted}; cursor:pointer;
                 transition: background .12s, color .12s; }
  .np-tool-btn:hover:not(:disabled) { background:${C.indigoSoft}; color:${C.indigo}; }
  .np-tool-btn:disabled { opacity:0.35; cursor:not-allowed; }
  .np-tool-sep { width:1px; height:14px; background:${C.line}; margin:0 2px; }

  /* Trình soạn thảo Outliner hỗ trợ gạch đầu dòng phân cấp & đường kẻ dọc */
  .np-editor { width:100%; min-height:42px; padding:9px 12px; border:1px solid ${C.line}; border-radius:9px;
               background:${C.field}; transition: border-color .15s, box-shadow .15s, background .15s;
               cursor:text; word-break:break-word; outline:none; line-height:1.55; }
  .np-editor.multiline { min-height:92px; }
  .np-editor:hover { border-color:#cfd4e8; }
  .np-editor:focus { background:#fff; border-color:${C.indigo}; box-shadow:0 0 0 3px ${C.indigoSoft}; }
  .np-editor:empty::before { content: attr(data-placeholder); color: #9aa2c4; pointer-events: none; font-size: 13.5px; }

  .np-editor ul { margin: 2px 0; padding-left: 20px; list-style-type: disc; }
  .np-editor ul ul { margin: 3px 0 3px 4px; padding-left: 18px; border-left: 1.5px solid #d4d9ec; list-style-type: disc; }
  .np-editor li { margin: 2px 0; }
  .np-editor li::marker { color: ${C.muted}; font-size: 0.9em; }

  .np-btn { display:inline-flex; align-items:center; gap:10px; height:44px; padding:0 20px; border:0;
            border-radius:11px; background:${C.indigo}; color:#fff; font-weight:600; cursor:pointer;
            box-shadow:0 8px 18px -8px ${C.indigo}; transition: transform .15s, background .15s; }
  .np-btn:hover { background:#4144c4; transform:translateY(-1px); }
  .np button:focus-visible { outline:3px solid ${C.indigoSoft}; outline-offset:2px; box-shadow:0 0 0 2px ${C.indigo}; }

  .np-grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:16px; }
  @media (max-width: 1100px) { .np-grid { grid-template-columns: 1fr; } }
  @media (max-width: 768px) {
    .np-shell { flex-direction: column !important; }
    .np-sidebar { width: 100% !important; flex-direction: row !important; overflow-x: auto; padding: 12px !important; border-right: 0 !important; border-bottom: 1px solid ${C.line}; }
    .np-logo { display: none !important; }
    .np-nav { width: auto; white-space: nowrap; }
    .np-main { padding: 24px 16px 48px !important; }
  }
`;

/* ---------- icon nhỏ cho thanh bên ---------- */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const NAV = [
  { name: "Nascent project", d: ["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"] },
  { name: "Bảng dữ liệu", d: ["M3 5h18v14H3z", "M3 10h18M9 5v14"] },
  { name: "Trang tính toán", d: ["M5 3h14v18H5z", "M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"] },
  { name: "Docs", d: ["M7 3h8l4 4v14H7z", "M15 3v4h4M10 12h6M10 16h6"] },
];

/* ---------- Trình soạn thảo Outliner (hỗ trợ gạch đầu dòng phân cấp + Ctrl+Z / Ctrl+Y) ---------- */
const OutlinerField = ({ label, id, multiline, value, onChange }) => {
  const editorRef = useRef(null);
  const [focused, setFocused] = useState(false);

  // Quản lý ngăn xếp lịch sử Undo / Redo riêng cho từng trường
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

  // Lưu snapshot vào lịch sử
  const recordSnapshot = (html, forceNewEntry = false) => {
    const h = historyRef.current;
    const now = Date.now();
    if (h.stack[h.index] === html) return;

    // Gộp các lần gõ phím liên tiếp trong vòng 450ms trừ khi xuống dòng / thụt lề / tạo bullet
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

  // Đặt con trỏ về cuối nội dung sau khi Undo / Redo
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

  // Đồng bộ giá trị từ bên ngoài nếu thay đổi
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = (forceHistory = false) => {
    if (!editorRef.current) return;
    // Dọn dẹp thẻ <br> thừa khi người dùng xóa hết nội dung
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
      // Tự động chuyển "- " hoặc "* " ở đầu dòng thành gạch đầu dòng
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

    // Ctrl+Z -> Undo
    if (isMod && !e.shiftKey && e.key.toLowerCase() === "z") {
      e.preventDefault();
      applyUndo();
      return;
    }

    // Ctrl+Y hoặc Ctrl+Shift+Z -> Redo
    if (
      (isMod && e.key.toLowerCase() === "y") ||
      (isMod && e.shiftKey && e.key.toLowerCase() === "z")
    ) {
      e.preventDefault();
      applyRedo();
      return;
    }

    // Tab / Shift+Tab -> Thụt lề phân cấp (tạo nhánh con có đường kẻ dọc bên trái)
    if (e.key === "Tab") {
      e.preventDefault();
      // Nếu chưa ở trong danh sách thì chuyển thành danh sách trước khi thụt cấp
      if (!document.queryCommandState("insertUnorderedList") && !e.shiftKey) {
        document.execCommand("insertUnorderedList", false, null);
      }
      document.execCommand(e.shiftKey ? "outdent" : "indent", false, null);
      emitChange(true);
      return;
    }

    // Enter -> Ghi nhận điểm dừng lịch sử rõ ràng cho dòng mới / gạch đầu dòng mới
    if (e.key === "Enter") {
      requestAnimationFrame(() => emitChange(true));
    }
  };

  // Dán văn bản thuần túy để tránh dính định dạng lạ từ bên ngoài
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    emitChange(true);
  };

  return (
    <div className="np-field" style={{ marginBottom: 14 }}>
      <div className="np-field-head">
        <label
          htmlFor={id}
          onClick={() => editorRef.current?.focus()}
        >
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

const Card = ({ title, color, children, style }) => (
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

export function ProjectDocs({ onNavigate, onDrawGoalTree }) {
  const [active, setActive] = useState("Nascent project");
  const [formValues, setFormValues] = useState({
    "dat-duoc": "",
    "ban-than": "",
    "gia-tri": "",
    "lich-trinh": "",
    "ngoai": "",
    "trong": "",
    "khong-lam": "",
    "that-bai": "",
    "ly-do": "",
  });

  const handleFieldChange = (id, val) => {
    setFormValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleNavClick = (name) => {
    setActive(name);
    onNavigate?.(name);
  };

  const handleGoalTreeClick = () => {
    onDrawGoalTree?.(formValues);
  };

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", background: C.page }}>
      <style>{css}</style>

      {/* Thanh tiêu đề */}
      <header
        style={{
          flex: "none", height: 48, background: C.ink, color: "#fff",
          display: "flex", alignItems: "center", padding: "0 20px", gap: 10,
          fontWeight: 600, fontSize: 15,
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
        Nascent Project
      </header>

      <div className="np-shell" style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Thanh bên */}
        <nav
          className="np-sidebar"
          aria-label="Điều hướng dự án"
          style={{
            flex: "none", width: 248, padding: "20px 14px", background: "#eceef9",
            borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", gap: 4,
          }}
        >
          <div
            className="np-logo"
            style={{
              width: 40, height: 40, margin: "2px 0 22px 4px", borderRadius: 11,
              background: `linear-gradient(135deg, ${C.indigo}, ${C.violet})`,
            }}
            aria-hidden="true"
          />
          {NAV.map((n) => (
            <button
              key={n.name}
              className="np-nav"
              aria-current={active === n.name ? "page" : undefined}
              onClick={() => handleNavClick(n.name)}
            >
              <Icon d={n.d} />
              {n.name}
            </button>
          ))}
        </nav>

        {/* Nội dung */}
        <main className="np-main" style={{ flex: 1, overflowY: "auto", padding: "36px 48px 56px" }}>
          <div style={{ maxWidth: 920 }}>
            <h1 style={{ margin: "0 0 24px", fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>
              Form
            </h1>

            {/* Final goal */}
            <Card title="Final goal" color={C.indigo} style={{ marginBottom: 16 }}>
              <OutlinerField
                id="dat-duoc"
                label="Đạt được"
                value={formValues["dat-duoc"]}
                onChange={handleFieldChange}
              />
            </Card>

            {/* Điểm cuối */}
            <p style={{ margin: "28px 0 12px", fontSize: 17, fontWeight: 600, color: C.ink }}>
              Điểm cuối – hoàn thành Goal
            </p>

            <div className="np-grid">
              <Card title="Conditions" color={C.teal}>
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
              </Card>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card title="Nền tảng hiện tại" color={C.violet}>
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
                </Card>
                <Card title="Đánh giá rủi ro" color={C.coral}>
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
                </Card>
              </div>

              <Card title="Lý do ban đầu làm project" color={C.amber} style={{ gridColumn: "1 / -1" }}>
                <OutlinerField
                  id="ly-do"
                  label="Vì sao bạn bắt đầu project này?"
                  multiline
                  value={formValues["ly-do"]}
                  onChange={handleFieldChange}
                />
              </Card>
            </div>

            {/* Hành động */}
            <div style={{ marginTop: 28 }}>
              <button className="np-btn" onClick={handleGoalTreeClick}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="5" r="2.5" />
                  <circle cx="5" cy="19" r="2.5" />
                  <circle cx="19" cy="19" r="2.5" />
                  <path d="M12 7.5V13M12 13H5v3.5M12 13h7v3.5" />
                </svg>
                Vẽ goal tree
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (title, detail, accent = C.indigo) => {
    setToast({ id: Date.now(), title, detail, accent });
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      <ProjectDocs
        onNavigate={(tabName) =>
          showToast(`Chuyển mục: ${tabName}`, "Đã cập nhật trạng thái điều hướng thanh bên", C.violet)
        }
        onDrawGoalTree={(data) => {
          const stripHtml = (s) => s.replace(/<[^>]*>/g, "").trim();
          const filledCount = Object.values(data).filter((v) => stripHtml(v) !== "").length;
          showToast(
            "Vẽ goal tree",
            `Đã ghi nhận ${filledCount}/9 trường dữ liệu từ biểu mẫu`,
            C.teal
          );
        }}
      />

      {toast && (
        <div
          key={toast.id}
          role="status"
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background: C.ink,
            color: "#fff",
            borderRadius: 12,
            boxShadow: "0 12px 28px -6px rgba(27, 32, 56, 0.35)",
            fontFamily: 'Inter, "Segoe UI", system-ui, sans-serif',
            fontSize: 14,
            maxWidth: 340,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: toast.accent,
              flex: "none",
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{toast.title}</div>
            <div style={{ fontSize: 12, color: "#cbd0e6", marginTop: 2 }}>{toast.detail}</div>
          </div>
          <button
            onClick={() => setToast(null)}
            aria-label="Đóng thông báo"
            style={{
              background: "transparent",
              border: "none",
              color: "#9aa2c4",
              cursor: "pointer",
              fontSize: 16,
              padding: "2px 6px",
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}