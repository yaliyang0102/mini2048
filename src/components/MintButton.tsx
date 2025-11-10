"use client";

import { ClaimButton } from "thirdweb/react";
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";
import { thirdwebClient } from "../app/thirdweb";

const address = process.env.NEXT_PUBLIC_NFT_CONTRACT as `0x${string}` | undefined;

export default function MintButton({ quantity = 1 }: { quantity?: number }) {
  if (!address) {
    return (
      <button disabled className="btn" title="缺少 NEXT_PUBLIC_NFT_CONTRACT">
        合约未配置
      </button>
    );
  }

  const contract = getContract({
    client: thirdwebClient,
    address,
    chain: base,
  });

  return (
    <ClaimButton
      contract={contract}
      quantity={quantity}
      // 你已经在 thirdweb Dashboard 设置好价格 0.0001 / 总量 9999，无需在前端再写死
      onError={(e) => alert(e?.message ?? "铸造失败")}
      onTransactionConfirmed={() => alert("Mint 成功！")}
      style={{ width: "100%" }}
    >
      Mint 2048 NFT
    </ClaimButton>
  );
}
