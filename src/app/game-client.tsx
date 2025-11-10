// src/app/game-client.tsx
"use client";

import { Providers } from "./providers";
import GameBoard from "../components/GameBoard";

export default function GameClient() {
  return (
    <Providers>
      <GameBoard onGameOver={(s) => console.log("score:", s)} />
    </Providers>
  );
}
