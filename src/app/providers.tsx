// src/app/providers.tsx
"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ✅ 你的 wagmi 配置（如果路径不同，请对应调整）
import { wagmiConfig } from "../wagmi";

// （可选）如果你还在用 Thirdweb 的 <ClaimButton> 等组件，再启用下面两行：
// import { ThirdwebProvider } from "thirdweb/react";
// import { base as thirdwebBase } from "thirdweb/chains";

export default function Providers({ children }: { children: ReactNode }) {
  // 保证 QueryClient 单例
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* 如果需要 Thirdweb，就把 children 套进来（两选一，按你依赖决定） */}
        {/* 
        <ThirdwebProvider
          // 如果你用 thirdweb v5：用 clientId；如果你是旧版：改成 client={createThirdwebClient({ clientId })}
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
          activeChain={thirdwebBase}
        >
          {children}
        </ThirdwebProvider>
        */}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
