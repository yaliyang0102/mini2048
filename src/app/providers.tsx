'use client';

import { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThirdwebProvider } from 'thirdweb/react';
import { base as thirdwebBase } from 'thirdweb/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
  // v5 的写法：只创建一次，避免热更新/重新渲染时丢失实例
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThirdwebProvider
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!}
          activeChain={thirdwebBase}
        >
          {children}
        </ThirdwebProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
