"use client";

import React, { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sdk } from "@farcaster/miniapp-sdk";

// ✅ 改成相对路径（providers.tsx 位于 src/app，wagmi.ts 位于 src）
import { wagmiConfig } from "../wagmi";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready(); // Farcaster Mini App: 告诉容器“我准备好了”
      } catch {
        // 在普通浏览器没有容器会报错，忽略即可
      }
    })();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
