"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import type { Connector } from "wagmi";
import { useMemo } from "react";

export default function WalletConnection() {
  const { address, isConnected } = useAccount();
  // ✅ wagmi v2: 用 isPending / pendingConnector
  const { connect, connectors, isPending, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  // 选一个可用的 connector（优先 Farcaster，其次第一个 ready 的）
  const preferred = useMemo<Connector | undefined>(() => {
    const ready = connectors.filter((c) => c.ready);
    return ready.find((c) => c.id.toLowerCase().includes("farcaster")) ?? ready[0];
  }, [connectors]);

  if (!isConnected) {
    const waiting = isPending && preferred && pendingConnector?.id === preferred.id;
    return (
      <button
        type="button"
        className="btn"
        onClick={() => preferred && connect({ connector: preferred })}
        disabled={!preferred || waiting}
      >
        {waiting ? "连接中…" : "连接钱包"}
      </button>
    );
  }

  return (
    <div className="row">
      <div className="mono">
        已连接：{address?.slice(0, 6)}…{address?.slice(-4)}
      </div>
      <button
        type="button"
        className="btn"
        onClick={() => disconnect()}
        style={{ background: "#ff4444", color: "#fff" }}
      >
        断开
      </button>
    </div>
  );
}
