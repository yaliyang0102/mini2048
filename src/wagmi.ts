'use client';

import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { base } from "wagmi/chains";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector"; // ✅ 正确导入名称
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    farcasterMiniApp(), // ✅ 使用正确的连接器名称
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [base.id]: http()
  },
  ssr: true, // 启用SSR支持
  storage: createStorage({
    storage: cookieStorage
  }),
});
