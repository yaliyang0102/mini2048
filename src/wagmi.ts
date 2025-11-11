// src/wagmi.ts
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "@wagmi/connectors";

const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.base.org";

/**
 * 说明：
 * - Farcaster Mini App 容器会注入 EIP-1193 provider；
 *   用 injected() 在容器里也能直接连，不需要额外的 miniapp 专用 connector。
 */
export const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http(RPC) },
  connectors: [
    injected({ shimDisconnect: true }), // 浏览器 / Farcaster 容器通吃
  ],
});
