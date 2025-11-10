// src/app/providers.tsx
"use client";

import { ReactNode, useMemo, useState } from "react";
import { WagmiProvider } from "wagmi";
import { makeWagmiConfig } from "../wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  const config = useMemo(() => makeWagmiConfig(), []); // ✅ 客户端创建
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
