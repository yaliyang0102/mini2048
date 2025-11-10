import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  ssr: false, // 关键：仅客户端使用 wagmi
  connectors: [
    miniAppConnector(),             // Farcaster 内置钱包（Warpcast 内）
    injected({ shimDisconnect: true }) // 浏览器钱包
  ],
});
