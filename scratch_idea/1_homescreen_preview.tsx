import React, { useState, useEffect } from "react";

/* ---------- Design tokens ---------- */
const C = {
  ink: "#1b2038", text: "#2b3150", muted: "#6a7192", page: "#f5f6fb",
  card: "#ffffff", line: "#e3e6f1", field: "#f9faff",
  indigo: "#4f52d9", indigoSoft: "#ececfc",
  teal: "#0fa89a", tealSoft: "#e3f6f4",
  violet: "#7b4fe0", coral: "#f0524f", amber: "#e8960c",
};

/* ---------- Dữ liệu minh hoạ ---------- */
const DEMO = {
  title: "Home",
  heading: "Không gian dự án",
  subtitle: "Chọn một dự án đang chạy hoặc khởi tạo dự án mới",
  projects: [
    { id: 1, name: "Project 1", stage: "Chặng 3 · Vòng lặp nâng cấp", progress: 65, color: C.teal, updated: "Hôm nay" },
    { id: 2, name: "Project 2", stage: "Chặng 2 · Tiêu chuẩn hóa", progress: 30, color: C.amber, updated: "2 ngày trước" },
  ],
  weeklyScore: 60,
  topStreak: "5 ngày",
};

const css = `
  .np * { box-sizing: border-box; }
  .np { font-family: Inter, "Segoe UI", system-ui, -apple-system, Arial, sans-serif; color: ${C.text}; font-size: 15px; line-height: 1.5; }
  .np button, .np input, .np textarea { font-family: inherit; font-size: inherit; color: inherit; }

  .np-card { background: ${C.card}; border: 1px solid ${C.line}; border-radius: 14px; padding: 20px; }
  .np-card-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
  .np-title { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 16px; font-weight: 600; color: ${C.ink}; }
  .np-sq { width: 10px; height: 10px; border-radius: 3px; flex: none; }

  .np-btn { display: inline-flex; align-items: center; gap: 8px; height: 40px; padding: 0 16px; border: 1px solid ${C.line}; border-radius: 10px; background: #fff; color: ${C.ink}; font-weight: 600; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
  .np-btn:hover { background: ${C.indigoSoft}; border-color: #c9caf3; color: ${C.indigo}; }
  .np-btn.primary { background: ${C.indigo}; border-color: ${C.indigo}; color: #fff; box-shadow: 0 8px 18px -8px ${C.indigo}; }
  .np-btn.primary:hover { background: #4144c4; }
  .np button:focus-visible { outline: 3px solid ${C.indigoSoft}; outline-offset: 2px; box-shadow: 0 0 0 2px ${C.indigo}; }

  .np-tile { display: flex; flex-direction: column; justify-content: space-between; width: 100%; min-height: 142px; padding: 18px 20px; text-align: left; background: ${C.card}; border: 1px solid ${C.line}; border-radius: 14px; cursor: pointer; transition: background .15s, border-color .15s; }
  .np-tile:hover { border-color: #c9caf3; background: ${C.field}; }
  .np-tile.new { align-items: center; justify-content: center; gap: 10px; background: ${C.indigoSoft}; border: 1px dashed ${C.indigo}; color: ${C.indigo}; font-weight: 600; }
  .np-tile.new:hover { background: ${C.indigoSoft}; border-color: #4144c4; color: #4144c4; }
  .np-plus { width: 36px; height: 36px; border-radius: 50%; background: ${C.indigo}; color: #fff; display: inline-flex; align-items: center; justify-content: center; }
  .np-chip { font-size: 12px; font-weight: 500; color: ${C.muted}; background: ${C.field}; border: 1px solid ${C.line}; border-radius: 6px; padding: 2px 8px; }
  .np-stat { padding: 12px 14px; border: 1px solid ${C.line}; border-radius: 10px; background: ${C.field}; }
  .np-stat-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 14px; }
  .np-note { font-size: 13px; color: ${C.muted}; }

  .np-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .np-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
  .np-grid-bottom { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
  @media (max-width: 1100px) {
    .np-grid { grid-template-columns: 1fr; }
    .np-grid-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .np-grid-bottom { grid-template-columns: 1fr; }
  }
  @media (max-width: 640px) {
    .np-grid-3 { grid-template-columns: 1fr; }
  }
`;

/* ---------- Thành phần dùng chung ---------- */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const Bar = ({ value, color = C.indigo, height = 8, label }) => (
  <div role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}
    style={{ height, borderRadius: height, background: C.line, overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", borderRadius: height, background: color, transition: "width .15s" }} />
  </div>
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

const Stat = ({ label, value, color = C.ink }) => (
  <div className="np-stat np-stat-row">
    <span style={{ color: C.muted }}>{label}</span>
    <b style={{ color }}>{value}</b>
  </div>
);

/* ---------- Màn hình chính HomeScreen ---------- */
export function HomeScreen({
  onNewProject,
  onSelectProject,
  onOpenCalendar,
  onOpenWidget,
  isProjectsUnlocked = false,
}) {
  const [projects] = useState(DEMO.projects);

  // TODO: Thay thế bằng điều kiện kích hoạt thực tế sau (ví dụ: người dùng hoàn thành bước khởi tạo hoặc mở khóa)
  const [showProjects, setShowProjects] = useState(isProjectsUnlocked);
  useEffect(() => {
    setShowProjects(isProjectsUnlocked);
  }, [isProjectsUnlocked]);
  const visibleProjects = showProjects ? projects : [];

  return (
    <div className="np" style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh", background: C.page }}>
      <style>{css}</style>

      <header style={{ flex: "none", height: 48, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", fontWeight: 600 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.amber }} />
          {DEMO.title}
        </div>

        {/* Nút phụ trợ trên Preview để kiểm tra nhanh điều kiện ẩn/hiện Project 1 & 2 */}
        <button
          type="button"
          onClick={() => setShowProjects((prev) => !prev)}
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
          Điều kiện dự án: {showProjects ? "Đang bật" : "Đang ẩn"}
        </button>
      </header>

      <main style={{ flex: 1, overflowY: "auto", padding: "32px 24px 56px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink }}>{DEMO.heading}</h1>
              <p className="np-note" style={{ margin: "4px 0 0" }}>{DEMO.subtitle}</p>
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
              <Stat label="Dự án đang mở" value={`${visibleProjects.length} dự án`} />
              <Stat label="Chuỗi kỷ luật cao nhất" value={DEMO.topStreak} color={C.teal} />
            </div>
          </Card>

          <Card title="Danh sách dự án" color={C.indigo}>
            <div className="np-grid-3">
              <button className="np-tile new" onClick={onNewProject}>
                <span className="np-plus"><Icon d={["M12 6v12M6 12h12"]} /></span>
                New project
              </button>

              {visibleProjects.map((p) => (
                <button key={p.id} className="np-tile" onClick={() => onSelectProject?.(p)}>
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
    </div>
  );
}

/* ---------- Wrapper Preview mặc định ---------- */
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
      <HomeScreen
        isProjectsUnlocked={false}
        onNewProject={() =>
          showToast("Khởi tạo dự án mới", "Đã kích hoạt sự kiện onNewProject()", C.indigo)
        }
        onSelectProject={(project) =>
          showToast(`Mở ${project.name}`, `${project.stage} (${project.progress}%)`, project.color)
        }
        onOpenWidget={() =>
          showToast("Widget tổng quan", `Hiệu suất tuần này: ${DEMO.weeklyScore}%`, C.amber)
        }
        onOpenCalendar={() =>
          showToast("Lịch trình & Kỷ luật", "Đã kích hoạt sự kiện onOpenCalendar()", C.violet)
        }
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