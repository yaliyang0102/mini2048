// src/app/game-client.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import GameBoard from "../components/GameBoard";
import MintButton from "../components/MintButton";

export default function GameClient() {
  const [ready, setReady] = useState(true);
  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // 仅在浏览器里尝试加载 Farcaster SDK（失败也不影响页面）
  useEffect(() => {
    (async () => {
      try {
        const mod: any = await import("@farcaster/miniapp-sdk");
        const fcSdk = mod?.sdk ?? mod?.default?.sdk ?? mod?.default ?? mod;
        if (fcSdk?.actions?.ready) await fcSdk.actions.ready();
      } catch {}
      setReady(true);
    })();
  }, []);

  // 先找浏览器钱包（MetaMask/OKX 等）
  const injectedConnector = useMemo(
    () => connectors.find((c) => c.id.toLowerCase().includes("injected")),
    [connectors]
  );

  const connectInjected = async () => {
    if (!injectedConnector) return alert("未检测到浏览器钱包扩展");
    try {
      await connect({ connector: injectedConnector });
    } catch (e) {
      console.error(e);
      alert("连接浏览器钱包失败");
    }
  };

  if (!ready) return <div className="card">加载中…</div>;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card">
        <div className="h1">2048 NFT Game</div>
        <div className="mono">Base • Farcaster Mini App</div>
      </div>

      <GameBoard
        onGameOver={(s) => {
          setScore(s);
          setIsOver(true);
        }}
      />

      <div className="card grid">
        <div>
          当前得分：<b>{score}</b> {isOver ? "（已结束）" : ""}
        </div>
        {!isOver && <div className="mono">方向键/触控滑动合并到 2048。</div>}

        {isOver && (
          <>
            <div className="mono">
              {score >= 2048 ? "已达 2048，解锁铸造资格！" : "未达到 2048 分，无法铸造。"}
            </div>

            {!isConnected ? (
              <button className="btn" onClick={connectInjected}>
                连接浏览器钱包
              </button>
            ) : (
              <MintButton enabled={score >= 2048} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
