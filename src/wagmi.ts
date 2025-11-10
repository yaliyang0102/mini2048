import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "@wagmi/connectors";

export function makeWagmiConfig() {
  return createConfig({
    chains: [base],
    transports: { [base.id]: http() },
    ssr: false, // 关键：仅客户端
    connectors: [injected({ shimDisconnect: true })], // 不引入 walletConnect/metaMask SDK
  });
}
