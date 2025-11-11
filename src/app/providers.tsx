// src/app/providers.tsx
"use client";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/wagmi";
import { sdk } from "@farcaster/miniapp-sdk";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      try {
        await sdk.actions.ready();      // ✅ 向 Farcaster 报到
        // 可选：await sdk.actions.setTitle("mini 2048");
        // 可选：await sdk.actions.setSplashScreen({ hidden: true });
      } catch (err) {
        // 在非 Farcaster 环境（普通浏览器）这里会抛错，安全忽略
        if (process.env.NODE_ENV === "development") {
          console.debug("sdk.ready skipped:", err);
        }
      }
    })();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
