// src/app/not-found.tsx
export default function NotFound() {
  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>页面不存在</h1>
        <p style={{ color: "#6b7280", margin: "0 0 16px" }}>
          你打开的链接不存在或已被移除。
        </p>
        <a href="/" className="btn">返回首页</a>
      </div>
    </div>
  );
}
