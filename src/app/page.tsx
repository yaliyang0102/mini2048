// src/app/page.tsx
import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const GameBoard = nextDynamic(() => import("../components/GameBoard"), {
  ssr: false, // 只在客户端渲染
  loading: () => <div className="mono">loading game…</div>,
});

export default function Page() {
  return (
    <main className="container">
      <div className="card">
        <div className="h1">mini2048</div>
        <GameBoard onGameOver={(s) => console.log("score:", s)} />
      </div>
    </main>
  );
}
