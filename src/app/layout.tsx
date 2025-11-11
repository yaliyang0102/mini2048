import './globals.css';
import Providers from './providers';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: 'mini 2048',
  description: 'Play 2048 and mint NFTs',
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
