// src/app/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import NextDynamic from 'next/dynamic';
const GameClient = NextDynamic(() => import('./game-client'), { ssr: false });

export default function Page() {
  return <GameClient />;
}
