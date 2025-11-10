"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import GameClient from "./game-client";

export default function Page() {
  return <GameClient />;
}
