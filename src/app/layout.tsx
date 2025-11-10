// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'mini2048',
  description: 'A tiny 2048 with mint hook',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="app">{children}</main>
      </body>
    </html>
  );
}
