// src/wagmi.ts
'use client';

import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { base } from 'wagmi/chains';

// 只引入需要的连接器，避免把整包 connectors 携带进来
import { injected } from '@wagmi/connectors/injected';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

export const wagmiConfig = createConfig({
  ssr: false,
  chains: [base],
  transports: {
    [base.id]: http(), // 如需自有 RPC 可改成 http('https://...your rpc...')
  },
  storage: createStorage({ storage: cookieStorage }),
  connectors: [
    // Farcaster 内置钱包（仅在 Farcaster Mini App WebView 内生效）
    farcasterMiniApp(),
    // 浏览器注入钱包（Rabby / Coinbase Wallet 扩展等）
    injected({ shimDisconnect: true }),
  ],
});
