// src/app/providers.tsx
"use client";

import { ReactNode, useMemo, useState } from "react";
import { WagmiProvider } from "wagmi";
import { makeWagmiConfig } from "../wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  // 在客户端创建 wagmi config，避免服务端 import 时的副作用
  const config = useMemo(() => makeWagmiConfig(), []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
