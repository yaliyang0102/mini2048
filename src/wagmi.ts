// src/wagmi.ts
import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
// ✅ 正确用法：从 "wagmi/connectors" 或 "@wagmi/connectors" 拿命名导出，不要用子路径
import { injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC || "https://mainnet.base.org"
    ),
  },
  connectors: [
    // 只用浏览器注入式钱包（Rabby/MetaMask/OKX/Phantom 等）
    injected({ shimDisconnect: true }),
  ],
  ssr: true, // 在 Next App Router 下建议开启
});
