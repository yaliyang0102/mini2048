"use client";

import { useState } from "react";
import { ClaimButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 你的 DropERC721 合约地址
const CONTRACT = "0x5679356AF6B4c93D4626AEAaccbACb411aa6577D";

// 需要在环境变量配置 NEXT_PUBLIC_THIRDWEB_CLIENT_ID
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = { quantity?: number };

export default function MintButton({ quantity = 1 }: Props) {
  // thirdweb v5: ERC721 的 quantity 必须是 bigint
  const qty = BigInt(Math.max(1, Math.floor(quantity)));

  // 本地提供一个稳定的 QueryClient，避免外层版本/装载顺序引起的 “No QueryClient set”
  const [qc] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={qc}>
      <ClaimButton
        client={client}
        chain={base}
        contractAddress={CONTRACT}
        claimParams={{ type: "ERC721", quantity: qty }}
        onError={(e) => alert(e?.message ?? "铸造失败")}
        onTransactionConfirmed={() => alert("铸造成功")}
        style={{ width: "100%" }}
      >
        Mint
      </ClaimButton>
    </QueryClientProvider>
  );
}
