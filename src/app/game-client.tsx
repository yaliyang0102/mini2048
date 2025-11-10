// src/app/game-client.tsx（示例）
import dynamic from "next/dynamic";
import { Providers } from "./providers";

const GameBoard = dynamic(() => import("../components/GameBoard"), { ssr: false });

export default function GameClient() {
  return (
    <Providers>
      <GameBoard onGameOver={(s) => console.log("score:", s)} />
    </Providers>
  );
}
