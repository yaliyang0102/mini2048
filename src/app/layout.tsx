import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

const NoSSRProviders = dynamic(() => import("./providers").then(m => m.Providers), {
  ssr: false, // 关键：wagmi 只在客户端加载
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
