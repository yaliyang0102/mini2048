// src/components/MintButton.tsx
"use client";

import { useState } from "react";
import { ClaimButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";

// ⚠️ 替换为你的 DropERC721 合约地址
const CONTRACT = "0x5679356AF6B4c93D4626AEAaccbACb411aa6577D";

// ⚠️ 需要在 Vercel/本地 .env 里配置 NEXT_PUBLIC_THIRDWEB_CLIENT_ID
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export default function MintButton() {
  const [qty, setQty] = useState<number>(1);

  // thirdweb v5 的 ClaimButton 对 ERC721 要求 quantity: bigint
  const quantityBigInt = BigInt(Math.max(1, Math.floor(qty)));

  return (
    <div className="card" style={{ gap: 12 }}>
      <div className="row" style={{ alignItems: "center", gap: 8 }}>
        <span className="mono">数量</span>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value) || 1)}
          className="input"
          style={{ width: 100 }}
        />
      </div>

      <ClaimButton
        client={client}
        chain={base}
        contractAddress={CONTRACT}
        // ✅ 关键：声明 ERC721，并把数量传 bigint
        claimParams={{ type: "ERC721", quantity: quantityBigInt }}
        onError={(e) => alert(e?.message ?? "铸造失败")}
        onTransactionConfirmed={() => alert("铸造成功")}
        style={{ width: "100%" }}
      >
        Mint
      </ClaimButton>
    </div>
  );
}
