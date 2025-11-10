// src/app/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <main style={{padding:24,fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontSize:20,marginBottom:12}}>mini2048 • health check</h1>
      <p>If you can see this, SSR is OK. We will add wagmi/game after this step.</p>
    </main>
  );
}
