"use client";

import GameClient from "./game-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  // 只渲染客户端组件，避免任何 SSR 逻辑
  return <GameClient />;
}
