"use client";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import { sdk } from "@farcaster/miniapp-sdk";
import GameBoard from "../components/GameBoard";
import MintButton from "../components/MintButton";

export default function GameClient() {
  const [ready, setReady] = useState(false);
  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready(); // 通知 Warpcast：Mini App 已就绪
      } catch {
        // 即使不在 Warpcast 环境，也允许继续玩
      }
      setReady(true);
    })();
  }, []);

  const fcConnector = useMemo(
    () => connectors.find((c) => c.name.toLowerCase().includes("farcaster")),
    [connectors]
  );

  const connectFarcaster = async () => {
    if (!fcConnector) return;
    try {
      await connect({ connector: fcConnector });
    } catch (e) {
      console.error(e);
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
          if (s >= 2048) {
            // 可选：达成成就后分享到 Warpcast
            // sdk.actions.share({ text: `我刚在 2048 得了 ${s} 分，解锁了 NFT！` });
          }
        }}
      />

      <div className="card grid">
        <div>
          当前得分：<b>{score}</b> {isOver ? "（已结束）" : ""}
        </div>
        {!isOver && (
          <div className="mono">使用方向键或触控滑动操作，合并相同数字至 2048。</div>
        )}

        {isOver && (
          <>
            <div className="mono">
              {score >= 2048
                ? "已达 2048，解锁铸造资格！"
                : "未达到 2048 分，无法铸造。再试一次！"}
            </div>

            {!isConnected ? (
              <button className="btn" onClick={connectFarcaster}>
                连接 Farcaster 钱包
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
