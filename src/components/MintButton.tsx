"use client";

import { ClaimButton } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";

type Props = { quantity?: number | string };

const CONTRACT = process.env.NEXT_PUBLIC_ERC721_DROP_ADDRESS as `0x${string}` | undefined;
const CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const client = CLIENT_ID ? createThirdwebClient({ clientId: CLIENT_ID }) : undefined;

export default function MintButton({ quantity = 1 }: Props) {
  if (!CLIENT_ID || !CONTRACT || !client) {
    return (
      <button
        className="btn"
        disabled
        title="请配置 NEXT_PUBLIC_THIRDWEB_CLIENT_ID 与 NEXT_PUBLIC_ERC721_DROP_ADDRESS"
        style={{ width: "100%" }}
      >
        缺少 thirdweb 配置
      </button>
    );
  }

  return (
    <ClaimButton
      client={client}
      chain={base}
      contractAddress={CONTRACT}
      // 关键：把数量转成字符串以通过类型检查
      claimParams={{ quantity: String(quantity) }}
      onError={(e) => alert(e?.message ?? "铸造失败")}
      onTransactionConfirmed={() => alert("铸造成功")}
      style={{ width: "100%" }}
    >
      Mint NFT
    </ClaimButton>
  );
}
