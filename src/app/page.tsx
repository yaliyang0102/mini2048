// src/app/page.tsx
import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GameClient = nextDynamic(() => import("./game-client"), {
  ssr: false, // 关键：整个客户端根都只在浏览器执行
  loading: () => (
    <main className="container">
      <div className="card mono">loading…</div>
    </main>
  ),
});

export default function Page() {
  return (
    <main className="container">
      <div className="card">
        <div className="h1">mini2048</div>
        <GameClient />
      </div>
    </main>
  );
}
