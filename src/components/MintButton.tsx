// src/components/MintButton.tsx
"use client";

import { ClaimButton } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";

const CONTRACT = "0x你的DropERC721合约地址";

// 请确保在 Vercel 环境变量里设置 NEXT_PUBLIC_THIRDWEB_CLIENT_ID
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export default function MintButton({ quantity = 1 }: { quantity?: number }) {
  return (
    <ClaimButton
      client={client}
      chain={base}
      contractAddress={CONTRACT}
      // ✅ 关键：明确声明这是 ERC721，并把数量转成字符串
      claimParams={{ type: "ERC721", quantity: String(quantity) }}
      onError={(e) => alert(e?.message ?? "铸造失败")}
      onTransactionConfirmed={() => alert("铸造成功")}
      style={{ width: "100%" }}
    >
      Mint {quantity}
    </ClaimButton>
  );
}
