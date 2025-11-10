"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container">
      <div className="card">
        <div className="h1">页面出错</div>
        <div className="mono" style={{ whiteSpace: "pre-wrap" }}>
          {error.message}
          {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
        </div>
        <button className="btn" onClick={() => reset()} style={{ marginTop: 12 }}>
          重试
        </button>
      </div>
    </div>
  );
}
