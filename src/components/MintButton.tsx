// src/components/MintButton.tsx
"use client";

import { ClaimButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { useMemo } from "react";

// ⚠️ 替换为你的 DropERC721 合约地址
const CONTRACT = "0x5679356AF6B4c93D4626AEAaccbACb411aa6577D";

// ⚠️ 需要在环境变量配置 NEXT_PUBLIC_THIRDWEB_CLIENT_ID
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

type Props = {
  /** ERC721 铸造数量，默认 1 */
  quantity?: number;
};

export default function MintButton({ quantity = 1 }: Props) {
  // thirdweb v5: ERC721 的 quantity 必须是 bigint
  const quantityBigInt = useMemo(
    () => BigInt(Math.max(1, Math.floor(quantity))),
    [quantity],
  );

  return (
    <ClaimButton
      client={client}
      chain={base}
      contractAddress={CONTRACT}
      // ✅ 明确声明 ERC721，并传 bigint
      claimParams={{ type: "ERC721", quantity: quantityBigInt }}
      onError={(e) => alert(e?.message ?? "铸造失败")}
      onTransactionConfirmed={() => alert("铸造成功")}
      style={{ width: "100%" }}
    >
      Mint
    </ClaimButton>
  );
}
