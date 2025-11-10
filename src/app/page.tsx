// src/app/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import dynamic from "next/dynamic";
const GameClient = dynamic(() => import("./game-client"), { ssr: false });

export default function Page() {
  return <GameClient />; // 这里不做任何与钱包/游戏相关的引用
}
