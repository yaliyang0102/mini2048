import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  connectors: [
    miniAppConnector(),                // Farcaster 内置钱包
    injected({ shimDisconnect: true }),// 外置钱包（MetaMask 等）
  ],
});
