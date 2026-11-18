import React, { useRef, useState } from "react";

const C = {
  ink: "#1b2038", text: "#2b3150", muted: "#6a7192", page: "#f5f6fb",
  card: "#ffffff", line: "#e3e6f1", field: "#f9faff",
  indigo: "#4f52d9", indigoSoft: "#ececfc",
  teal: "#0fa89a", tealSoft: "#e3f6f4",
  violet: "#7b4fe0", coral: "#f0524f", amber: "#e8960c",
};

/* ---------- DEMO: số liệu minh hoạ (thay bằng dữ liệu thật) ---------- */
const DEMO_DAILY = {
  startDate: new Date(2026, 10, 16), // hôm qua
  chapterPct: 60,                    // Chặng – hoàn thành (%)
  sgCount: 4,                        // SG: ? cái
  sgNotDone: 3,                      // ? SG: not done
  streak: 5,                         // Streak (tính theo kế hoạch)
};

const DEMO_WEEKLY = {
  chapterPct: 70, // Chặng – hoàn thành (%)
  sg: 12,         // SG: ? cái
  g2: 4,          // G2: ? cái
  g1: 2,          // G1: ? cái
  notDone: 3,     // ? SG: not done (cả tuần)
};

/* ---------- Thành phần nhỏ ---------- */
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

function Heading({ color, children, id, as: Tag = "h2" }) {
  return (
    <Tag
      id={id}
      style={{
        margin: "0 0 12px",
        fontSize: 16,
        fontWeight: 700,
        color: C.ink,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Square color={color} />
      {children}
    </Tag>
  );
}

function Tile({ label, children }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        border: `1px solid ${C.line}`,
        borderRadius: 10,
        padding: "10px 12px",
        background: C.field,
      }}
    >
      <div style={{ fontSize: 12.5, color: C.muted }}>{label}</div>
      <div style={{ fontSize: 15, color: C.text }}>{children}</div>
    </div>
  );
}

const pad = (n) => String(n).padStart(2, "0");
const fmt = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

function Chevron({ dir }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ---------- Pop-up Tổng hợp ---------- */
export function CurrentUnifiedPopup() {
  const [view, setView] = useState("both"); // "both" | "daily" | "weekly"

  // State của thẻ Lịch hôm qua (Daily)
  const [date, setDate] = useState(DEMO_DAILY.startDate);
  const [dailyNote, setDailyNote] = useState("");
  const dailyNoteRef = useRef(null);

  // State của thẻ Tuần trước & Tuần này (Weekly)
  const [weeklyNote, setWeeklyNote] = useState("");
  const weeklyNoteRef = useRef(null);

  const shift = (n) =>
    setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));

  const css = `
    .np * { box-sizing: border-box; }
    .np { font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif; color: ${C.text}; font-size: 15px; line-height: 1.5; }
    .np button, .np input, .np textarea { font-family: inherit; font-size: inherit; color: inherit; }
    .np-input { width:100%; height:40px; padding:0 12px; border:1px solid ${C.line}; border-radius:9px; background:${C.field}; transition: border-color .15s, box-shadow .15s, background .15s; }
    textarea.np-input { height:auto; min-height:76px; padding:10px 12px; resize:vertical; }
    .np-input:hover { border-color:#cfd4e8; }
    .np-input:focus { outline:none; background:#fff; border-color:${C.indigo}; box-shadow:0 0 0 3px ${C.indigoSoft}; }
    .np-icon-btn { width:32px; height:32px; border:1px solid ${C.line}; border-radius:8px; background:#fff; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; color:${C.muted}; transition: background .15s, border-color .15s, color .15s; }
    .np-icon-btn:hover { background:${C.indigoSoft}; border-color:#c9caf3; color:${C.indigo}; }
    .np button:focus-visible { outline:3px solid ${C.indigoSoft}; outline-offset:2px; box-shadow:0 0 0 2px ${C.indigo}; }
    .np-seg { display:inline-flex; align-items:center; gap:2px; padding:3px; border-radius:9px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); }
    .np-seg-btn { height:28px; padding:0 12px; border:0; border-radius:6px; background:transparent; color:rgba(255,255,255,0.72); font-size:13px; font-weight:500; cursor:pointer; transition: background .15s, color .15s; }
    .np-seg-btn:hover { color:#fff; background:rgba(255,255,255,0.08); }
    .np-seg-btn[aria-pressed="true"] { background:#fff; color:${C.ink}; font-weight:600; }
    .np-cards-grid { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:20px; align-items:start; width:100%; max-width:1080px; }
    .np-cards-grid.single { grid-template-columns: minmax(0, 1fr); max-width:520px; }
    @media (max-width: 920px) {
      .np-cards-grid { grid-template-columns: minmax(0, 1fr); max-width:520px; }
    }
    @media (max-width: 560px) {
      .np-header { flex-wrap:wrap; height:auto !important; padding:10px 16px !important; gap:10px !important; }
      .np-main { padding:24px 16px 40px !important; }
    }
  `;

  return (
    <div
      className="np"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        overflowX: "hidden",
        background: C.page,
      }}
    >
      <style>{css}</style>

      {/* Header */}
      <header
        className="np-header"
        style={{
          height: 52,
          flex: "none",
          background: C.ink,
          color: "#fff",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            aria-hidden="true"
            style={{
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: C.amber,
            }}
          />
          <span>Current – Tổng hợp</span>
        </div>

        {/* Bộ lọc chế độ hiển thị */}
        <div className="np-seg" role="group" aria-label="Chế độ hiển thị">
          <button
            type="button"
            className="np-seg-btn"
            aria-pressed={view === "both"}
            onClick={() => setView("both")}
          >
            Cả hai
          </button>
          <button
            type="button"
            className="np-seg-btn"
            aria-pressed={view === "daily"}
            onClick={() => setView("daily")}
          >
            Theo ngày
          </button>
          <button
            type="button"
            className="np-seg-btn"
            aria-pressed={view === "weekly"}
            onClick={() => setView("weekly")}
          >
            Theo tuần
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        className="np-main"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "36px 24px 56px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <div className={`np-cards-grid ${view !== "both" ? "single" : ""}`}>
          {/* ==================== THẺ TRÁI: LỊCH HÔM QUA (DAILY) ==================== */}
          {(view === "both" || view === "daily") && (
            <section
              role="region"
              aria-labelledby="cur-title"
              style={{
                width: "100%",
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 14,
                padding: 20,
              }}
            >
              {/* Đầu pop-up: Lịch hôm qua + tùy chọn thêm data */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <h2
                    id="cur-title"
                    style={{
                      margin: "0 0 10px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: C.ink,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Square color={C.indigo} />
                    Lịch hôm qua
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      type="button"
                      className="np-icon-btn"
                      aria-label="Ngày trước"
                      onClick={() => shift(-1)}
                    >
                      <Chevron dir="left" />
                    </button>
                    <span
                      style={{
                        minWidth: 96,
                        textAlign: "center",
                        fontWeight: 600,
                        color: C.ink,
                      }}
                      aria-live="polite"
                    >
                      {fmt(date)}
                    </span>
                    <button
                      type="button"
                      className="np-icon-btn"
                      aria-label="Ngày sau"
                      onClick={() => shift(1)}
                    >
                      <Chevron dir="right" />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <button
                    type="button"
                    className="np-icon-btn"
                    aria-label="Tùy chọn thêm data ngày"
                    onClick={() => dailyNoteRef.current && dailyNoteRef.current.focus()}
                  >
                    <PlusIcon />
                  </button>
                  <span style={{ fontSize: 12, color: C.muted }}>
                    Tùy chọn thêm data
                  </span>
                </div>
              </div>

              {/* Chặng + SG */}
              <div style={{ marginBottom: 20 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  <span id="cur-chap">Chặng – hoàn thành</span>
                  <span style={{ color: C.ink, fontWeight: 600 }}>
                    {DEMO_DAILY.chapterPct}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-labelledby="cur-chap"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={DEMO_DAILY.chapterPct}
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: C.indigoSoft,
                    overflow: "hidden",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: `${DEMO_DAILY.chapterPct}%`,
                      height: "100%",
                      background: C.indigo,
                    }}
                  />
                </div>
                <Tile label="SG">
                  <strong style={{ color: C.ink }}>{DEMO_DAILY.sgCount}</strong> cái
                </Tile>
              </div>

              {/* Bảng kết quả */}
              <div style={{ marginBottom: 20 }}>
                <Heading as="h3" color={C.coral}>
                  Bảng kết quả
                </Heading>
                <div style={{ display: "flex", gap: 12 }}>
                  <Tile label="Số liệu">
                    <strong style={{ color: C.ink }}>{DEMO_DAILY.sgNotDone}</strong> SG: not done
                  </Tile>
                  <Tile label="Streak (tính theo kế hoạch)">
                    <strong style={{ color: C.ink }}>{DEMO_DAILY.streak}</strong>
                  </Tile>
                </div>
              </div>

              {/* Nhận xét */}
              <div style={{ marginBottom: 20 }}>
                <label
                  htmlFor="cur-note"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  → Nhận xét riêng của bản thân
                  <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>
                    Không bắt buộc
                  </span>
                </label>
                <textarea
                  id="cur-note"
                  ref={dailyNoteRef}
                  className="np-input"
                  style={{ minHeight: 76 }}
                  placeholder="Chưa nhập"
                  value={dailyNote}
                  onChange={(e) => setDailyNote(e.target.value)}
                />
              </div>

              {/* Lịch hôm ấy */}
              <div>
                <Heading as="h3" color={C.violet}>
                  Lịch hôm ấy
                </Heading>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  <li>Không làm</li>
                </ul>
              </div>
            </section>
          )}

          {/* ==================== THẺ PHẢI: TUẦN TRƯỚC & TUẦN NÀY (WEEKLY) ==================== */}
          {(view === "both" || view === "weekly") && (
            <section
              role="region"
              aria-labelledby="wk-title"
              style={{
                width: "100%",
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 14,
                padding: 20,
              }}
            >
              {/* Tuần trước */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  marginBottom: 16,
                }}
              >
                <Heading color={C.indigo} id="wk-title">
                  Tuần trước
                </Heading>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <button
                    type="button"
                    className="np-icon-btn"
                    aria-label="Tùy chọn thêm data tuần"
                    onClick={() => weeklyNoteRef.current && weeklyNoteRef.current.focus()}
                  >
                    <PlusIcon />
                  </button>
                  <span style={{ fontSize: 12, color: C.muted }}>
                    Tùy chọn thêm data
                  </span>
                </div>
              </div>

              {/* Chặng – hoàn thành */}
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  <span id="wk-chap">Chặng – hoàn thành</span>
                  <span style={{ color: C.ink, fontWeight: 600 }}>
                    {DEMO_WEEKLY.chapterPct}%
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-labelledby="wk-chap"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={DEMO_WEEKLY.chapterPct}
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: C.indigoSoft,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${DEMO_WEEKLY.chapterPct}%`,
                      height: "100%",
                      background: C.indigo,
                    }}
                  />
                </div>
              </div>

              {/* 3 ô SG / G2 / G1 */}
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <Tile label="SG">
                  <strong style={{ color: C.ink }}>{DEMO_WEEKLY.sg}</strong> cái
                </Tile>
                <Tile label="G2">
                  <strong style={{ color: C.ink }}>{DEMO_WEEKLY.g2}</strong> cái
                </Tile>
                <Tile label="G1">
                  <strong style={{ color: C.ink }}>{DEMO_WEEKLY.g1}</strong> cái
                </Tile>
              </div>

              {/* Số liệu: cả tuần */}
              <div style={{ display: "flex", marginBottom: 20 }}>
                <Tile label="Số liệu: cả tuần">
                  <strong style={{ color: C.ink }}>{DEMO_WEEKLY.notDone}</strong> SG: not done
                </Tile>
              </div>

              {/* Nhận xét */}
              <div style={{ marginBottom: 24 }}>
                <label
                  htmlFor="wk-note"
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 500,
                    marginBottom: 6,
                  }}
                >
                  → Nhận xét riêng của bản thân
                  <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>
                    Không bắt buộc
                  </span>
                </label>
                <textarea
                  id="wk-note"
                  ref={weeklyNoteRef}
                  className="np-input"
                  style={{ minHeight: 76 }}
                  placeholder="Chưa nhập"
                  value={weeklyNote}
                  onChange={(e) => setWeeklyNote(e.target.value)}
                />
              </div>

              {/* Tuần này */}
              <div>
                <Heading as="h3" color={C.teal}>
                  Tuần này
                </Heading>
                <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>
                  Chưa nhập
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return <CurrentUnifiedPopup />;
}