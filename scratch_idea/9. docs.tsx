import React, { useState } from "react";

// Bảng màu thiết kế chuẩn cho giao diện
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
  coral: "#f0524f",
  coralSoft: "#fdecec",
  amber: "#e8960c",
  colOdd: "#e7e9f4",
  colEven: "#f1f3fa",
};

/* ---------- Thành phần nhỏ (Sub-components) ---------- */

/**
 * Ô vuông màu nhỏ trang trí đầu tiêu đề
 */
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

/**
 * Thanh tiêu đề ngang đặt ở đầu mỗi phần/cột dọc kèm nút New Note
 */
function SectionBanner({ title, color, onNewNote }) {
  return (
    <div
      className="np-banner"
      style={{
        background: C.ink,
        color: "#ffffff",
        borderRadius: 8,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        width: "100%",
        boxShadow: "0 2px 6px rgba(27, 32, 56, 0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
        <Square color={color} />
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {title}
        </span>
      </div>
      {onNewNote && (
        <button
          type="button"
          className="np-new-note-btn"
          onClick={onNewNote}
          title={`Thêm ghi chú mới vào ${title}`}
        >
          + Note
        </button>
      )}
    </div>
  );
}

/**
 * Hiển thị danh sách các ghi chú đã lưu dưới dạng các thanh tiêu đề
 */
function SavedNoteList({ notes, onSelectNote, onDeleteNote }) {
  if (!notes || notes.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
      {notes.map((note) => (
        <div
          key={note.id}
          className="np-note-bar"
          onClick={() => onSelectNote(note)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectNote(note);
            }
          }}
        >
          <span className="np-note-bar-title">
            {note.title.trim() || "Ghi chú không tiêu đề"}
          </span>
          <button
            type="button"
            className="np-note-del"
            aria-label="Xóa ghi chú"
            title="Xóa ghi chú"
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
}

/**
 * Thành phần bọc trường nhập liệu kèm nhãn (Label)
 */
function Field({ id, label, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 12 }}>
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 4,
          color: C.text,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// Style cho các khối nhập liệu nổi bật (tương ứng các ô màu hồng nhạt trong phác thảo)
const blockCardStyle = {
  background: C.card,
  border: `1.5px solid #e5bcbc`,
  borderLeft: `4px solid ${C.coral}`,
  borderRadius: 10,
  padding: "clamp(8px, 1.1vw, 14px)",
  boxShadow: "0 2px 8px rgba(240, 82, 79, 0.05)",
};

/* ---------- Màn hình chính ---------- */
export default function App() {
  // Trạng thái lưu trữ danh sách các chặng (Chunks)
  const [chunks, setChunks] = useState([
    { stage: "", title: "" },
    { stage: "", title: "" },
    { stage: "", title: "" },
  ]);

  // Trạng thái lưu trữ ghi chú và thông tin quan trọng của mục Tree
  const [tree, setTree] = useState({ note: "", important: "" });

  // Trạng thái lưu trữ ghi chú cho cột Mathematics
  const [mathNote, setMathNote] = useState("");

  // Thông báo phản hồi khi bấm nút Quay lại
  const [backNotice, setBackNotice] = useState(false);

  // Danh sách ghi chú lưu theo từng khu vực (section)
  const [notesBySection, setNotesBySection] = useState({
    overview: [],
    tree: [],
    chunks: [],
    data: [],
    math: [],
  });

  // Trạng thái điều khiển Pop-up tạo / chỉnh sửa ghi chú kiểu Google Note
  const [modalState, setModalState] = useState({
    open: false,
    sectionKey: "",
    sectionLabel: "",
    noteId: null,
    title: "",
    content: "",
  });

  // Mở pop-up tạo ghi chú mới cho thanh dọc tương ứng
  const openNewNoteModal = (sectionKey, sectionLabel) => {
    setModalState({
      open: true,
      sectionKey,
      sectionLabel,
      noteId: null,
      title: "",
      content: "",
    });
  };

  // Mở pop-up xem / chỉnh sửa ghi chú đã lưu
  const openEditNoteModal = (sectionKey, sectionLabel, note) => {
    setModalState({
      open: true,
      sectionKey,
      sectionLabel,
      noteId: note.id,
      title: note.title,
      content: note.content,
    });
  };

  // Đóng pop-up và tự động lưu nếu có nội dung (giống Google Note)
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
              item.id === noteId
                ? { ...item, title: trimmedTitle || "Ghi chú không tiêu đề", content: trimmedContent }
                : item
            ),
          };
        }
        const newItem = {
          id: Date.now().toString(),
          title: trimmedTitle || "Ghi chú không tiêu đề",
          content: trimmedContent,
        };
        return {
          ...prev,
          [sectionKey]: [newItem, ...list],
        };
      });
    }

    setModalState((s) => ({ ...s, open: false }));
  };

  // Xóa một thanh ghi chú đã lưu
  const handleDeleteNote = (sectionKey, noteId) => {
    setNotesBySection((prev) => ({
      ...prev,
      [sectionKey]: (prev[sectionKey] || []).filter((item) => item.id !== noteId),
    }));
  };

  // Hàm cập nhật dữ liệu cho từng chặng cụ thể
  const setChunk = (i, k) => (e) =>
    setChunks((cs) => cs.map((c, j) => (j === i ? { ...c, [k]: e.target.value } : c)));

  // Định nghĩa CSS tùy chỉnh hỗ trợ trạng thái tương tác và bố cục 4 cột dọc luôn vừa khít khung hình
  const css = `
    .np * { box-sizing: border-box; }
    .np { 
      font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif; 
      color: ${C.text}; 
      font-size: clamp(12px, 1.05vw, 14px); 
      line-height: 1.45;
      height: 100vh;
      overflow: hidden;
    }
    .np button, .np input, .np textarea { 
      font-family: inherit; 
      font-size: inherit; 
      color: inherit; 
    }
    .np-back-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      height: 32px;
      padding: 0 clamp(8px, 0.9vw, 12px);
      border: 0;
      border-radius: 7px;
      background: linear-gradient(135deg, ${C.indigo}, ${C.violet});
      color: #ffffff;
      font-weight: 600;
      font-size: clamp(11.5px, 0.95vw, 13px);
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(79, 82, 217, 0.25);
      transition: transform .12s, filter .15s;
      white-space: nowrap;
      width: 100%;
    }
    .np-back-btn:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }
    .np-back-btn:active {
      transform: translateY(0);
    }
    .np-banner {
      padding: clamp(6px, 0.7vw, 8px) clamp(8px, 0.9vw, 12px);
      font-size: clamp(12px, 1.05vw, 14px);
    }
    .np-new-note-btn {
      flex: none;
      height: 22px;
      padding: 0 7px;
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      font-size: clamp(10.5px, 0.85vw, 11.5px);
      font-weight: 600;
      cursor: pointer;
      transition: background .15s, border-color .15s;
      white-space: nowrap;
    }
    .np-new-note-btn:hover {
      background: rgba(255, 255, 255, 0.24);
      border-color: rgba(255, 255, 255, 0.45);
    }
    .np-note-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 8px 12px;
      background: #ffffff;
      border: 1px solid ${C.line};
      border-left: 3.5px solid ${C.indigo};
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(27, 32, 56, 0.05);
      transition: border-color .15s, box-shadow .15s, transform .1s;
    }
    .np-note-bar:hover {
      border-color: #c5c9e6;
      box-shadow: 0 3px 10px rgba(27, 32, 56, 0.09);
      transform: translateY(-1px);
    }
    .np-note-bar-title {
      font-size: 13px;
      font-weight: 600;
      color: ${C.ink};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .np-note-del {
      flex: none;
      width: 20px;
      height: 20px;
      border: 0;
      border-radius: 5px;
      background: transparent;
      color: ${C.muted};
      font-size: 15px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .np-note-del:hover {
      background: ${C.coralSoft};
      color: ${C.coral};
    }
    .np-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(27, 32, 56, 0.45);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      z-index: 1000;
      animation: npFadeIn .15s ease-out;
    }
    .np-modal-card {
      width: 100%;
      max-width: 520px;
      background: #ffffff;
      border-radius: 14px;
      border: 1px solid ${C.line};
      box-shadow: 0 18px 48px rgba(27, 32, 56, 0.22);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: npPopIn .16s ease-out;
    }
    .np-modal-title-input {
      width: 100%;
      border: 0;
      outline: none;
      font-size: 17px;
      font-weight: 700;
      color: ${C.ink};
      padding: 14px 18px 8px;
      background: transparent;
    }
    .np-modal-title-input::placeholder {
      color: #8c93b2;
      font-weight: 600;
    }
    .np-modal-body-input {
      width: 100%;
      min-height: 150px;
      border: 0;
      outline: none;
      resize: vertical;
      font-size: 14.5px;
      line-height: 1.6;
      color: ${C.text};
      padding: 6px 18px 16px;
      background: transparent;
    }
    .np-modal-body-input::placeholder {
      color: #9aa1be;
    }
    @keyframes npFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes npPopIn {
      from { opacity: 0; transform: scale(0.96) translateY(6px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .np-input { 
      width: 100%; 
      height: 32px; 
      padding: 0 9px; 
      border: 1px solid ${C.line}; 
      border-radius: 7px; 
      background: ${C.field}; 
      transition: border-color .15s, box-shadow .15s, background .15s; 
    }
    textarea.np-input { 
      height: auto; 
      min-height: 58px; 
      padding: 7px 9px; 
      resize: vertical; 
    }
    .np-input:hover { border-color: #cfd4e8; }
    .np-input:focus { 
      outline: none; 
      background: #fff; 
      border-color: ${C.indigo}; 
      box-shadow: 0 0 0 3px ${C.indigoSoft}; 
    }
    .np-sidebar {
      width: clamp(92px, 11vw, 144px);
      flex: none;
      padding: clamp(12px, 1.4vw, 20px) clamp(8px, 1vw, 12px);
      background: #ffffff;
      border-right: 1px solid ${C.line};
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
    .np-columns {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      flex: 1;
      min-width: 0;
      height: 100%;
      overflow: hidden;
    }
    .np-col {
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100%;
      overflow-y: auto;
      padding: clamp(12px, 1.4vw, 20px) clamp(8px, 1.1vw, 14px) 24px;
      border-right: 1px solid ${C.line};
      gap: 12px;
    }
    .np-col:last-child {
      border-right: none;
    }
    @media (max-width: 560px) {
      .np-body { flex-direction: column; }
      .np-sidebar { 
        width: 100%; 
        flex-direction: row; 
        align-items: center; 
        padding: 8px 12px;
        border-right: none;
        border-bottom: 1px solid ${C.line};
      }
      .np-back-btn {
        width: auto;
      }
    }
  `;

  return (
    <div
      className="np"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        background: C.page,
      }}
    >
      <style>{css}</style>

      {/* Thanh tiêu đề trên cùng (Header) */}
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
        Ongoing – Docs
      </header>

      {/* Khu vực nội dung chính gồm Sidebar trắng bên trái + 4 thanh dọc */}
      <div className="np-body" style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
        {/* Thanh điều hướng bên trái (Sidebar nền trắng) */}
        <aside className="np-sidebar">
          <button
            type="button"
            className="np-back-btn"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              }
              setBackNotice(true);
              setTimeout(() => setBackNotice(false), 2500);
            }}
          >
            <span aria-hidden="true">←</span>
            <span>Quay lại</span>
          </button>

          {backNotice && (
            <div
              style={{
                fontSize: 12,
                color: C.indigo,
                background: C.indigoSoft,
                padding: "6px 10px",
                borderRadius: 7,
                lineHeight: 1.4,
              }}
            >
              Đã kích hoạt quay lại trang trước.
            </div>
          )}
        </aside>

        {/* Bố cục 4 thanh dọc liền kề nhau */}
        <main className="np-columns">
          {/* Thanh dọc 1: Overview (trên) & Tree (dưới) */}
          <div className="np-col" style={{ background: C.colOdd }}>
            {/* Phần trên: Overview */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              <SectionBanner
                title="Overview"
                color={C.indigo}
                onNewNote={() => openNewNoteModal("overview", "Overview")}
              />
              <SavedNoteList
                notes={notesBySection.overview}
                onSelectNote={(n) => openEditNoteModal("overview", "Overview", n)}
                onDeleteNote={(id) => handleDeleteNote("overview", id)}
              />
            </div>

            {/* Đường phân cách nhẹ giữa Overview và Tree */}
            <div style={{ borderTop: `1px dashed #c8cde0`, margin: "4px 0" }} />

            {/* Phần dưới: Tree */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SectionBanner
                title="Tree"
                color={C.teal}
                onNewNote={() => openNewNoteModal("tree", "Tree")}
              />

              <SavedNoteList
                notes={notesBySection.tree}
                onSelectNote={(n) => openEditNoteModal("tree", "Tree", n)}
                onDeleteNote={(id) => handleDeleteNote("tree", id)}
              />

              <section style={blockCardStyle}>
                <Field id="tree-note" label="Ghi chú" last>
                  <textarea
                    id="tree-note"
                    className="np-input"
                    placeholder="Chưa nhập"
                    value={tree.note}
                    onChange={(e) =>
                      setTree((t) => ({ ...t, note: e.target.value }))
                    }
                  />
                </Field>
              </section>

              <section style={blockCardStyle}>
                <Field id="tree-important" label="Important Infor" last>
                  <textarea
                    id="tree-important"
                    className="np-input"
                    placeholder="Chưa nhập"
                    value={tree.important}
                    onChange={(e) =>
                      setTree((t) => ({ ...t, important: e.target.value }))
                    }
                  />
                </Field>
              </section>
            </div>
          </div>

          {/* Thanh dọc 2: Chunks */}
          <div className="np-col" style={{ background: C.colEven }}>
            <SectionBanner
              title="Chunks"
              color={C.violet}
              onNewNote={() => openNewNoteModal("chunks", "Chunks")}
            />

            <SavedNoteList
              notes={notesBySection.chunks}
              onSelectNote={(n) => openEditNoteModal("chunks", "Chunks", n)}
              onDeleteNote={(id) => handleDeleteNote("chunks", id)}
            />

            {chunks.map((c, i) => (
              <section key={i} aria-label={`Chunk ${i + 1}`} style={blockCardStyle}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: C.ink,
                    textAlign: "center",
                    marginBottom: 10,
                    paddingBottom: 6,
                    borderBottom: `1px solid ${C.line}`,
                  }}
                >
                  Chunk {i + 1}
                </div>

                <Field id={`chunk-${i}-stage`} label="Chặng">
                  <input
                    id={`chunk-${i}-stage`}
                    className="np-input"
                    type="text"
                    placeholder="Chưa nhập"
                    value={c.stage}
                    onChange={setChunk(i, "stage")}
                  />
                </Field>
                <Field id={`chunk-${i}-title`} label="Tiêu đề" last>
                  <input
                    id={`chunk-${i}-title`}
                    className="np-input"
                    type="text"
                    placeholder="Chưa nhập"
                    value={c.title}
                    onChange={setChunk(i, "title")}
                  />
                </Field>
              </section>
            ))}
          </div>

          {/* Thanh dọc 3: Bảng dữ liệu */}
          <div className="np-col" style={{ background: C.colOdd }}>
            <SectionBanner
              title="Bảng dữ liệu"
              color={C.coral}
              onNewNote={() => openNewNoteModal("data", "Bảng dữ liệu")}
            />

            <SavedNoteList
              notes={notesBySection.data}
              onSelectNote={(n) => openEditNoteModal("data", "Bảng dữ liệu", n)}
              onDeleteNote={(id) => handleDeleteNote("data", id)}
            />
          </div>

          {/* Thanh dọc 4: Mathematics */}
          <div className="np-col" style={{ background: C.colEven }}>
            <SectionBanner
              title="Mathematics"
              color={C.amber}
              onNewNote={() => openNewNoteModal("math", "Mathematics")}
            />

            <SavedNoteList
              notes={notesBySection.math}
              onSelectNote={(n) => openEditNoteModal("math", "Mathematics", n)}
              onDeleteNote={(id) => handleDeleteNote("math", id)}
            />

            <div style={{ padding: "4px 4px 0" }}>
              <Field id="math-note" label="Nội dung / Công thức" last>
                <textarea
                  id="math-note"
                  className="np-input"
                  style={{ minHeight: 120 }}
                  placeholder="Chưa nhập"
                  value={mathNote}
                  onChange={(e) => setMathNote(e.target.value)}
                />
              </Field>
            </div>
          </div>
        </main>
      </div>

      {/* Pop-up tạo / chỉnh sửa ghi chú kiểu Google Note */}
      {modalState.open && (
        <div
          className="np-modal-backdrop"
          onClick={handleSaveAndCloseModal}
          role="dialog"
          aria-modal="true"
          aria-label={`Ghi chú trong ${modalState.sectionLabel}`}
        >
          <div
            className="np-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dải nhãn khu vực phía trên */}
            <div
              style={{
                padding: "10px 18px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
                fontWeight: 600,
                color: C.muted,
              }}
            >
              <span>Mục: {modalState.sectionLabel}</span>
              <span>{modalState.noteId ? "Đang chỉnh sửa" : "Ghi chú mới"}</span>
            </div>

            {/* Ô nhập tiêu đề giống Google Keep/Note */}
            <input
              type="text"
              className="np-modal-title-input"
              placeholder="Tiêu đề"
              autoFocus
              value={modalState.title}
              onChange={(e) =>
                setModalState((s) => ({ ...s, title: e.target.value }))
              }
            />

            {/* Ô nhập nội dung ghi chú */}
            <textarea
              className="np-modal-body-input"
              placeholder="Tạo ghi chú..."
              value={modalState.content}
              onChange={(e) =>
                setModalState((s) => ({ ...s, content: e.target.value }))
              }
            />

            {/* Thanh công cụ dưới cùng của pop-up */}
            <div
              style={{
                padding: "10px 16px",
                borderTop: `1px solid ${C.line}`,
                background: C.page,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setModalState((s) => ({ ...s, open: false }))}
                style={{
                  height: 34,
                  padding: "0 14px",
                  border: `1px solid ${C.line}`,
                  borderRadius: 8,
                  background: "#ffffff",
                  color: C.muted,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveAndCloseModal}
                style={{
                  height: 34,
                  padding: "0 16px",
                  border: 0,
                  borderRadius: 8,
                  background: C.indigo,
                  color: "#ffffff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Lưu & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}