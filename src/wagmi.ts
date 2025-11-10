// src/wagmi.ts
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// 先只用浏览器钱包，确保页面能跑；Farcaster 之后用动态导入再加
export function makeWagmiConfig() {
  return createConfig({
    chains: [base],
    transports: { [base.id]: http() },
    ssr: false, // 关键：禁止在服务端使用 wagmi
    connectors: [
      injected({ shimDisconnect: true }),
    ],
  });
}
