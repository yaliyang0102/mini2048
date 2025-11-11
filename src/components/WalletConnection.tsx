// src/components/WalletConnection.tsx
"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, status, error } = useConnect(); // wagmi v2
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <span>已连接：{address?.slice(0, 6)}...{address?.slice(-4)}</span>
        <button
          className="btn"
          onClick={() => disconnect()}
          style={{ background: "#ff4444", color: "#fff", borderColor: "#ff4444" }}
        >
          断开连接
        </button>
      </div>
    );
  }

  // 选择一个可用的钱包连接器（优先 ready 的）
  const firstReady = connectors.find((c) => c.ready) ?? connectors[0];

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <button
        className="btn"
        onClick={() => firstReady && connect({ connector: firstReady })}
        disabled={status === "pending" || !firstReady}
        title={!firstReady ? "没有可用的钱包连接器" : undefined}
      >
        {status === "pending" ? "连接中…" : "连接钱包"}
      </button>
      {error ? (
        <span style={{ color: "#b91c1c", fontSize: 12 }}>
          {error.message}
        </span>
      ) : null}
    </div>
  );
}
