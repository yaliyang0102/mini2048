// src/app/providers.tsx
"use client";

import React, { useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sdk } from "@farcaster/miniapp-sdk";

// ✅ 相对路径，不依赖 tsconfig paths
import { wagmiConfig } from "../wagmi";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready(); // Farcaster Mini App: 通知容器已就绪
      } catch {
        // 普通浏览器环境没有容器，这里报错可以忽略
      }
    })();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
