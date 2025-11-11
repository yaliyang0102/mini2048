// src/app/layout.tsx
import "./globals.css";
import { Providers } from "./providers";
import ErrorBoundary from "../components/ErrorBoundary";

export const metadata = {
  title: "mini2048",
  description: "health check",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
