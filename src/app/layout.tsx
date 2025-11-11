// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "mini 2048",
  description: "Play 2048 and mint NFTs",
  openGraph: { title: "mini 2048", images: ["https://mini2048.vercel.app/og.png"] },
  // Farcaster Mini App 的 embed 元标签（如需）
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: "https://mini2048.vercel.app/og.png",
      button: {
        title: "开始",
        action: {
          type: "launch_miniapp",
          name: "mini 2048",
          url: "https://mini2048.vercel.app/",
          splashImageUrl: "https://mini2048.vercel.app/splash.png",
          splashBackgroundColor: "#0B0B0F",
        },
      },
    }),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
