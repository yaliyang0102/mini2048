// src/wagmi.ts
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "@wagmi/connectors";

// 你可以把自定义 RPC 写在环境变量里
const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.base.org";

/**
 * 说明：
 * - Farcaster Mini App 容器里会注入 EIP-1193 provider，
 *   用 injected() 在容器里同样能连上（无需额外 miniapp connector）。
 * - 等后面你要加 WalletConnect 或 Farcaster 专用 connector，再按版本匹配补上即可。
 */
export const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http(RPC) },
  connectors: [
    injected({ shimDisconnect: true }), // 浏览器 / Farcaster 容器都可用
  ],
});
