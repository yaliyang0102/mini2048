"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { base } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { base as thirdwebBase } from "thirdweb/chains";

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: { [base.id]: http() },
});

const thirdwebClient = createThirdwebClient({
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
