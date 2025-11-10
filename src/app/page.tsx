"use client";
import { useState } from "react";
import GameBoard from "../components/GameBoard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  return (
    <main className="container">
      <div className="card">
        <div className="h1">mini2048</div>
        <div className="mono">纯前端运行（未接钱包）</div>
      </div>
      <GameBoard onGameOver={setFinalScore} />
      {finalScore !== null && (
        <div className="card mono">最终得分：{finalScore}</div>
      )}
    </main>
  );
}
