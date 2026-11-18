import React, { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Ongoing Project – màn hình "Dự án hiện tại"                        */
/*  Cùng phong cách với ProjectDocs.jsx (thanh bên, bảng màu, ô nhập). */
/*  Các con số trong DEMO chỉ là dữ liệu minh hoạ – thay bằng dữ liệu */
/*  thật của bạn.                                                      */
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
  coral: "#f0524f",
  amber: "#e8960c",
};

const DEMO = {
  progress: 35,
  stage: 2, // chặng đang làm (1–4)
  day: { stagePct: 40, sg: 3, notDone: 1, streak: 5 },
  week: { stagePct: 55, sg: 8, g2: 3, g1: 2, notDone: 2 },
};

const STAGES = ["Làm quen", "Tiêu chuẩn hóa", "Vòng lặp nâng cấp", "Chạm đến"];

const css = `
  .np * { box-sizing: border-box; }
  .np { font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif;
        color: ${C.text}; font-size: 15px; line-height: 1.5; }
  .np button, .np input, .np textarea { font-family: inherit; font-size: inherit; color: inherit; }

  .np-nav { display:flex; align-items:center; gap:12px; width:100%; height:42px; padding:0 12px;
            border:0; border-radius:10px; background:transparent; color:${C.muted};
            font-weight:500; text-align:left; cursor:pointer; transition: background .15s, color .15s;
            white-space:nowrap; overflow:hidden; }
  .np-nav:hover { background:#fff; color:${C.ink}; }
  .np-nav[aria-current="page"] { background:${C.indigoSoft}; color:${C.indigo}; font-weight:600; }

  .np-back { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:40px;
             border:0; border-radius:11px; background:linear-gradient(135deg, ${C.indigo}, ${C.violet});
             color:#fff; font-weight:600; cursor:pointer; transition: opacity .15s, transform .15s, width .2s;
             white-space:nowrap; overflow:hidden; }
  .np-back:hover { opacity:0.92; transform:translateX(-1px); }

  .np-sidebar { flex:none; padding:20px 14px; background:#eceef9; border-right:1px solid ${C.line};
                display:flex; flex-direction:column; gap:4px; transition: width .22s ease, padding .22s ease; }

  .np-input { width:100%; height:40px; padding:0 12px; border:1px solid ${C.line}; border-radius:9px;
              background:${C.field}; transition: border-color .15s, box-shadow .15s, background .15s; }
  textarea.np-input { height:auto; min-height:76px; padding:10px 12px; resize:vertical; }
  .np-input:hover { border-color:#cfd4e8; }
  .np-input:focus { outline:none; background:#fff; border-color:${C.indigo}; box-shadow:0 0 0 3px ${C.indigoSoft}; }

  .np-btn { display:inline-flex; align-items:center; gap:8px; height:40px; padding:0 16px;
            border:1px solid ${C.line}; border-radius:10px; background:#fff; color:${C.ink};
            font-weight:600; cursor:pointer; transition: background .15s, border-color .15s; }
  .np-btn:hover { background:${C.indigoSoft}; border-color:#c9caf3; color:${C.indigo}; }
  .np-btn.primary { background:${C.indigo}; border-color:${C.indigo}; color:#fff; }
  .np-btn.primary:hover { background:#4144c4; }

  .np-icon-btn { width:32px; height:32px; border:1px solid ${C.line}; border-radius:8px; background:#fff;
                 cursor:pointer; display:inline-flex; align-items:center; justify-content:center; color:${C.muted}; }
  .np-icon-btn:hover { background:${C.indigoSoft}; color:${C.indigo}; }

  .np-link { border:0; background:none; padding:0; cursor:pointer; color:${C.indigo}; font-weight:500;
             text-decoration:underline; text-underline-offset:3px; text-decoration-color:#b9baf0; }
  .np-link:hover { text-decoration-color:${C.indigo}; }

  .np button:focus-visible, .np-link:focus-visible { outline:3px solid ${C.indigoSoft}; outline-offset:2px; box-shadow:0 0 0 2px ${C.indigo}; }

  .np-grid { display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap:16px; }
  @media (max-width: 1200px) { .np-grid { grid-template-columns: 1fr; } }
`;

/* ---------- icon ---------- */
const Icon = ({ d, size = 18, stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const NAV = [
  { name: "Current Project", d: ["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"] },
  { name: "Bảng dữ liệu", d: ["M3 5h18v14H3z", "M3 10h18M9 5v14"] },
  { name: "Trang tính toán", d: ["M5 3h14v18H5z", "M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"] },
  { name: "Docs", d: ["M7 3h8l4 4v14H7z", "M15 3v4h4M10 12h6M10 16h6"] },
];

/* ---------- thành phần dùng chung ---------- */
const Card = ({ title, color, action, children, style }) => (
  <section style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, ...style }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 10, margin: 0, fontSize: 16, fontWeight: 600, color: C.ink }}>
        <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);

const Bar = ({ value, color = C.indigo, height = 8 }) => (
  <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}
       style={{ height, borderRadius: height, background: "#e8eaf6", overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", borderRadius: height, background: color, transition: "width .3s" }} />
  </div>
);

const Stat = ({ label, value, unit, hint, color = C.ink }) => (
  <div style={{ border: `1px solid ${C.line}`, borderRadius: 11, padding: "10px 14px", background: C.field }}>
    <div style={{ fontSize: 13, color: C.muted }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.3 }}>
      {value}
      {unit && <span style={{ marginLeft: 5, fontSize: 13, fontWeight: 500, color: C.muted }}>{unit}</span>}
    </div>
    {hint && <div style={{ fontSize: 12, color: C.muted }}>{hint}</div>}
  </div>
);

const Stepper = ({ onPrev, onNext, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <button className="np-icon-btn" onClick={onPrev} aria-label="Trước"><Icon d={["M15 6l-6 6 6 6"]} size={16} /></button>
    <span style={{ minWidth: 92, textAlign: "center", fontWeight: 600, color: C.ink }}>{children}</span>
    <button className="np-icon-btn" onClick={onNext} aria-label="Sau"><Icon d={["M9 6l6 6-6 6"]} size={16} /></button>
  </div>
);

const Note = ({ id }) => (
  <div>
    <label htmlFor={id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13, fontWeight: 500 }}>
      Nhận xét riêng của bản thân
      <span style={{ fontSize: 12, fontWeight: 500, color: C.muted, background: "#eef0f8", borderRadius: 6, padding: "1px 7px" }}>
        Không bắt buộc
      </span>
    </label>
    <textarea id={id} className="np-input" rows={3} />
  </div>
);

/* ---------- màn hình ---------- */
export default function CurrentProject() {
  const [active, setActive] = useState("Current Project");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [info, setInfo] = useState({ goal: "", resource: "", status: "" });

  const set = (k) => (e) => setInfo({ ...info, [k]: e.target.value });

  const rows = [
    { k: "goal", label: "Mục tiêu cuối cùng" },
    { k: "resource", label: "Nguồn lực" },
    { k: "status", label: "Tình trạng ↔ bối cảnh hiện tại – tóm tắt", optional: true },
  ];

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", background: C.page }}>
      <style>{css}</style>

      {/* Thanh tiêu đề */}
      <header style={{ flex: "none", height: 48, background: C.ink, color: "#fff", display: "flex", alignItems: "center", padding: "0 16px", gap: 12, fontWeight: 600 }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Thu gọn thanh điều hướng" : "Mở rộng thanh điều hướng"}
          title={sidebarOpen ? "Thu gọn thanh điều hướng" : "Mở rộng thanh điều hướng"}
          style={{
            width: 32, height: 32, border: "1px solid rgba(255,255,255,0.16)", borderRadius: 8,
            background: "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Icon d={sidebarOpen ? ["M4 6h16", "M4 12h10", "M4 18h16", "M19 9l-3 3 3 3"] : ["M4 6h16", "M4 12h16", "M4 18h16"]} size={16} />
        </button>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
        Ongoing Project – Current
      </header>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Thanh bên */}
        <nav
          aria-label="Điều hướng dự án"
          className="np-sidebar"
          style={{ width: sidebarOpen ? 248 : 72 }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "2px 0 22px", gap: 8 }}>
            <button
              className="np-back"
              onClick={() => setActive("Current Project")}
              aria-label="Quay lại"
              title="Quay lại"
              style={{ width: sidebarOpen ? "100%" : 42, padding: sidebarOpen ? "0 14px" : 0 }}
            >
              <Icon d={["M19 12H5", "M11 6l-6 6 6 6"]} size={17} stroke="#fff" />
              {sidebarOpen && <span>Quay lại</span>}
            </button>
          </div>
          {NAV.map((n) => (
            <button
              key={n.name}
              className="np-nav"
              aria-current={active === n.name ? "page" : undefined}
              onClick={() => setActive(n.name)}
              title={!sidebarOpen ? n.name : undefined}
              style={{ justifyContent: sidebarOpen ? "flex-start" : "center", padding: sidebarOpen ? "0 12px" : 0 }}
            >
              <span style={{ flex: "none", display: "inline-flex" }}><Icon d={n.d} /></span>
              {sidebarOpen && <span>{n.name}</span>}
            </button>
          ))}
        </nav>

        {/* Nội dung */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px 48px 56px" }}>
          <div style={{ maxWidth: 1000 }}>
            {/* Đầu trang */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: "-0.01em" }}>
                Dự án hiện tại
              </h1>
              <button className={`np-btn ${editing ? "primary" : ""}`} onClick={() => setEditing(!editing)}>
                <Icon d={editing ? ["M5 12l5 5L20 7"] : ["M4 20h4L19 9l-4-4L4 16z", "M13.5 6.5l4 4"]} size={16} />
                {editing ? "Lưu thông tin" : "Chỉnh thông tin"}
              </button>
            </div>

            {/* Thông tin chung + tiến độ */}
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
                  <span style={{ color: C.indigo, fontWeight: 700 }}>{DEMO.progress}%</span>
                </div>
                <Bar value={DEMO.progress} height={10} />
              </div>
            </Card>

            {/* Tầm nhìn tổng quan */}
            <Card title="Tầm nhìn tổng quan" color={C.teal} style={{ marginBottom: 16 }}>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: C.muted }}>Ngưỡng từng giai đoạn</p>
              <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {STAGES.map((s, i) => {
                  const n = i + 1;
                  const done = n < DEMO.stage;
                  const now = n === DEMO.stage;
                  return (
                    <li
                      key={s}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        border: `1px solid ${now ? C.teal : done ? "#e2e5ef" : C.line}`,
                        background: now ? C.tealSoft : done ? "#f1f3f8" : C.field,
                        opacity: done ? 0.72 : 1,
                        borderRadius: 11,
                        padding: "11px 16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 700,
                            flex: "none",
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
                          className="np-link"
                          style={{
                            textAlign: "left",
                            color: done ? C.muted : now ? C.teal : C.indigo,
                            textDecorationColor: done ? "#c5cadb" : undefined,
                            fontWeight: now ? 600 : 500,
                          }}
                        >
                          {s}
                        </button>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: "2px 9px",
                          borderRadius: 999,
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

            {/* Theo ngày + theo tuần */}
            <div className="np-grid">
              <Card title="Hôm nay" color={C.violet}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                    <span>Chặng {DEMO.stage} – hoàn thành</span>
                    <b style={{ color: C.violet }}>{DEMO.day.stagePct}%</b>
                  </div>
                  <Bar value={DEMO.day.stagePct} color={C.violet} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 10, marginBottom: 16 }}>
                  <Stat label="SG" value={DEMO.day.sg} unit="cái" />
                  <Stat label="SG: not done" value={DEMO.day.notDone} unit="cái" color={C.coral} />
                  <Stat label="Streak" value={DEMO.day.streak} unit="ngày" hint="Tính theo kế hoạch" color={C.amber} />
                </div>
                <Note id="note-day" />
              </Card>

              <Card title="Tuần này" color={C.amber}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 14 }}>
                    <span>Chặng {DEMO.stage} – hoàn thành</span>
                    <b style={{ color: C.amber }}>{DEMO.week.stagePct}%</b>
                  </div>
                  <Bar value={DEMO.week.stagePct} color={C.amber} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, marginBottom: 16 }}>
                  <Stat label="SG" value={DEMO.week.sg} unit="cái" />
                  <Stat label="G2" value={DEMO.week.g2} unit="cái" />
                  <Stat label="G1" value={DEMO.week.g1} unit="cái" />
                  <Stat label="SG: not done" value={DEMO.week.notDone} unit="cái" color={C.coral} />
                </div>
                <Note id="note-week" />
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}