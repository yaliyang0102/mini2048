// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

const NoSSRProviders = dynamic(() => import("./providers").then(m => m.Providers), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "mini2048",
  description: "Play 2048",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <NoSSRProviders>{children}</NoSSRProviders>
      </body>
    </html>
  );
}
