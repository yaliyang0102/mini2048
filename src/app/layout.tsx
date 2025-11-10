import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

// 关键：禁用 SSR 加载 Providers（里面用到 wagmi）
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
        {/* wagmi 相关只在客户端加载，避免服务端 500 */}
        <NoSSRProviders>{children}</NoSSRProviders>
      </body>
    </html>
  );
}
