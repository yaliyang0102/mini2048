import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  ssr: false, // 关键：仅在客户端使用 wagmi，避免服务器端因 storage/cookies 崩溃
  connectors: [
    miniAppConnector(),
    injected({ shimDisconnect: true }),
  ],
});
