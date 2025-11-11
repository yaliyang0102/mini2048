// src/wagmi.ts
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "@wagmi/connectors";

const RPC = process.env.NEXT_PUBLIC_RPC_URL || "https://mainnet.base.org";

/**
 * 说明：
 * - Farcaster 容器会注入 EIP-1193 provider
 * - 用 injected() 即可在容器与普通浏览器两端通用
 */
export const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http(RPC) },
  connectors: [injected({ shimDisconnect: true })],
});
