// src/app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>页面出错了</h1>
      <div style={{ whiteSpace: "pre-wrap", color: "#b91c1c", marginBottom: 12 }}>
        {error?.message || "Unknown error"}
        {error?.digest ? `\nDigest: ${error.digest}` : ""}
      </div>
      <button
        onClick={() => reset()}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          cursor: "pointer",
        }}
      >
        重试
      </button>
    </div>
  );
}
