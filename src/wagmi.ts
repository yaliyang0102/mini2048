import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected } from "@wagmi/connectors"; // 只引入 injected

export function makeWagmiConfig() {
  return createConfig({
    chains: [base],
    transports: { [base.id]: http() },
    ssr: false, // 仅客户端
    connectors: [injected({ shimDisconnect: true })],
  });
}
