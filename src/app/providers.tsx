// src/app/providers.tsx
"use client";
import React, { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/wagmi"; // ← 如果你不想配别名，这里换成 ../wagmi

// Farcaster Mini App ready()
import { sdk } from "@farcaster/miniapp-sdk";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready();
      } catch {
        // 普通浏览器环境没有容器，抛错正常，忽略即可
      }
    })();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
