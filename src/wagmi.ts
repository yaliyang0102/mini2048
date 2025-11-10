// src/wagmi.ts
"use client";

import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  ssr: false, // 这里也关掉 SSR 感知
  storage: createStorage({ storage: cookieStorage }),
  connectors: [
    miniAppConnector(),               // Farcaster 内置钱包
    injected({ shimDisconnect: true })// 浏览器已有钱包（不会引入 metamask-sdk）
  ],
});
