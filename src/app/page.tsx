// src/app/page.tsx
export const dynamic = "force-dynamic"; // 强制动态渲染（避免静态预渲染）
export const revalidate = 0;            // ✅ 正确：数字 0，而不是对象

import GameBoard from "../components/GameBoard";

export default function Page() {
  return (
    <main className="container">
      <div className="card">
        <div className="h1">mini2048 • game</div>
        <GameBoard onGameOver={(s) => console.log("score:", s)} />
      </div>
    </main>
  );
}
