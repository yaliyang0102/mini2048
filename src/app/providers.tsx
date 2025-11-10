"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 只用 injected，避免引入 MetaMask SDK / WalletConnect 造成构建警告
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "@wagmi/connectors";
import { base } from "wagmi/chains";

// thirdweb（给 ClaimButton 用）
import { ThirdwebProvider, createThirdwebClient } from "thirdweb";
import { base as thirdwebBase } from "thirdweb/chains";

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: { [base.id]: http() },
});

const thirdwebClient = createThirdwebClient({
  // 确保在 Vercel 上配置 NEXT_PUBLIC_THIRDWEB_CLIENT_ID
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ?? "demo",
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider client={thirdwebClient} activeChain={thirdwebBase}>
          {children}
        </ThirdwebProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
