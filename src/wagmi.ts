import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "@wagmi/connectors";

export function makeWagmiConfig() {
  return createConfig({
    chains: [base],
    transports: { [base.id]: http() },
    ssr: false, // 只在客户端
    connectors: [injected({ shimDisconnect: true })], // 不引 walletConnect / metamask SDK
  });
}
