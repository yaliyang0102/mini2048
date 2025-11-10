"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="container">
          <div className="card">
            <div className="h1">App Error</div>
            <div className="mono" style={{ whiteSpace: "pre-wrap" }}>
              {error.message}
              {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
            </div>
            <button className="btn" onClick={() => reset()} style={{ marginTop: 12 }}>
              重试
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
