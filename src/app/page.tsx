// src/app/page.tsx
"use client";
import GameClient from "./game-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return <GameClient />;
}
