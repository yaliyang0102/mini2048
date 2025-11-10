"use client";

import { ClaimButton } from "thirdweb/react";
import { base } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";

type Props = { quantity?: number };

// 从环境变量读取，避免把地址写死在代码里
const CONTRACT = process.env.NEXT_PUBLIC_ERC721_DROP_ADDRESS as `0x${string}` | undefined;
const CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

// 仅在有 clientId 时创建 client（否则不渲染按钮，避免类型&运行时报错）
const client = CLIENT_ID ? createThirdwebClient({ clientId: CLIENT_ID }) : undefined;

export default function MintButton({ quantity = 1 }: Props) {
  if (!CLIENT_ID || !CONTRACT) {
    return (
      <button
        className="btn"
        disabled
        title="请配置 NEXT_PUBLIC_THIRDWEB_CLIENT_ID 与 NEXT_PUBLIC_ERC721_DROP_ADDRESS"
        style={{ width: "100%" }}
      >
        缺少 thirdweb 配置（点此查看控制台提示）
      </button>
    );
  }

  return (
    <ClaimButton
      client={client!}
      chain={base}
      contractAddress={CONTRACT}
      claimParams={{ quantity }}
      onError={(e) => alert(e?.message ?? "铸造失败")}
      onTransactionConfirmed={() => alert("铸造成功")}
      style={{ width: "100%" }}
    >
      Mint NFT
    </ClaimButton>
  );
}
