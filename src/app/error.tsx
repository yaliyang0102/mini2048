// src/app/error.tsx
"use client";
export default function Error({
  error,
  reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{padding:24,fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontSize:20,marginBottom:12}}>页面出错了（Server Components）</h1>
      <pre style={{whiteSpace:"pre-wrap",color:"#b91c1c"}}>{String(error?.message)}</pre>
      {error?.digest ? <div>Digest: {error.digest}</div> : null}
      <button onClick={() => reset()} style={{marginTop:12,padding:"8px 12px",border:"1px solid #ddd",borderRadius:8}}>
        重试
      </button>
    </div>
  );
}
