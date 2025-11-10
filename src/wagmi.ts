'use client';

import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { base } from "wagmi/chains";
import { miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    miniAppConnector(), // Farcaster内置钱包
    injected({ shimDisconnect: true }), // 浏览器钱包备用
  ],
  transports: {
    [base.id]: http()
  },
  ssr: false, // 避免SSR问题
  storage: createStorage({
    storage: cookieStorage
  }),
});
