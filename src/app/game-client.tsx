"use client";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect } from "wagmi";
import GameBoard from "../components/GameBoard";
import MintButton from "../components/MintButton";

export default function GameClient() {
  // 先默认 ready=true，确保就算 SDK 失败也能渲染页面
  const [ready, setReady] = useState(true);
  const [score, setScore] = useState(0);
  const [isOver, setIsOver] = useState(false);

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    // 在浏览器侧再尝试加载 Farcaster SDK；失败也不影响页面
    (async () => {
      try {
        // 动态导入，避免在模块导入阶段崩溃
        const MiniApp = await import("@farcaster/miniapp-sdk");
        const sdk = (MiniApp as any).sdk ?? MiniApp?.default?.sdk;
        if (sdk?.actions?.ready) {
          await sdk.actions.ready();
        }
      } catch (e) {
        // 静默兜底：不是在 Warpcast 环境中时这里常见
        // console.debug("miniapp-sdk init skipped:", e);
      } finally {
        setReady(true);
      }
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
      alert("连接 Farcaster 钱包失败，可以改用浏览器钱包测试。");
    }
  };

  // 即使 ready 为 false 也尽量渲染 UI，这里只在极早期显示 loading
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
