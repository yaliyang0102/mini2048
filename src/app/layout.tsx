import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://your-domain.vercel.app";

const miniapp = {
  version: "1",
  imageUrl: `${baseUrl}/og.png`,
  button: {
    title: "Play 2048 & Mint NFT",
    action: {
      type: "launch_miniapp",
      url: `${baseUrl}/`,
      name: "2048 NFT Game",
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#0a0f1b",
    },
  },
} as const;

export const metadata: Metadata = {
  title: "2048 NFT Game",
  description: "Play 2048 and mint NFTs on Base!",
  other: {
    "fc:miniapp": JSON.stringify(miniapp),
    "fc:frame": JSON.stringify({
      ...miniapp,
      button: {
        ...miniapp.button,
        action: { ...miniapp.button.action, type: "launch_frame" },
      },
    }),
  },
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
