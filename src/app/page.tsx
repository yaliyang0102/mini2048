// src/app/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import NextDynamic from "next/dynamic";
import ErrorBoundary from "../components/ErrorBoundary";

const GameClient = NextDynamic(() => import("./game-client"), { ssr: false });

export default function Page() {
  return (
    <ErrorBoundary>
      <GameClient />
    </ErrorBoundary>
  );
}
