"use client";
import { useMemo } from "react";
import { ClaimButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";

// 换成你的 DropERC721 合约
const CONTRACT = "0x5679356AF6B4c93D4626AEAaccbACb411aa6577D";

type Props = { quantity?: number };

export default function MintButton({ quantity = 1 }: Props) {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

  const client = useMemo(() => {
    try {
      if (!clientId || clientId.trim().length === 0) return null;
      return createThirdwebClient({ clientId });
    } catch (e) {
      console.error("thirdweb client init failed", e);
      return null;
    }
  }, [clientId]);

  const qty = useMemo(() => BigInt(Math.max(1, Math.floor(quantity))), [quantity]);

  if (!client) {
    return (
      <button
        disabled
        title="尚未配置 NEXT_PUBLIC_THIRDWEB_CLIENT_ID 或初始化失败"
        style={{
          width: "100%", padding: "10px 12px",
          borderRadius: 8, background: "#aaa", color: "#fff", border: 0,
          cursor: "not-allowed"
        }}
      >
        Mint（配置中…）
      </button>
    );
  }

  return (
    <ClaimButton
      client={client}
      chain={base}
      contractAddress={CONTRACT}
      claimParams={{ type: "ERC721", quantity: qty }}
      onError={(e) => { console.error(e); alert(e?.message ?? "铸造失败"); }}
      onTransactionConfirmed={() => alert("铸造成功")}
      style={{ width: "100%" }}
    >
      Mint
    </ClaimButton>
  );
}
