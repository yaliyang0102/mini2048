// src/wagmi.ts
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "@wagmi/connectors"; // ✅ deep import，避免加载其它连接器

export function makeWagmiConfig() {
  return createConfig({
    chains: [base],
    transports: { [base.id]: http() },
    ssr: false, // ✅ 仅在客户端用 wagmi，杜绝 SSR 阶段触发存储/钱包代码
    connectors: [
      injected({ shimDisconnect: true }), // ✅ 先用浏览器钱包，Farcaster 之后再“动态导入”加回
    ],
  });
}
