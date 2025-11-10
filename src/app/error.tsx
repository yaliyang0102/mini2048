// src/app/error.tsx
"use client";
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "monospace" }}>
        <h2>App Error</h2>
        <pre>{error.message}</pre>
        <pre>digest: {error.digest}</pre>
      </body>
    </html>
  );
}
