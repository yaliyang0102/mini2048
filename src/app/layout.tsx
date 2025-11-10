import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "2048 NFT Game",
  description: "Play 2048 and mint NFTs on Base!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="container">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
