'use client';

import { ClaimButton } from "thirdweb/react";
import { getThirdwebClient } from "../app/thirdweb";
import { getContract } from "thirdweb";
import { base } from "thirdweb/chains";

export default function MintButton({ quantity }: { quantity: number }) {
  const client = getThirdwebClient();
  
  // 使用环境变量而非硬编码
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x5679356AF6B4c93D4626AEAaccbACb411aa6577D";

  if (!client) {
    return (
      
        Thirdweb客户端初始化失败
      
    );
  }

  const contract = getContract({
    client,
    chain: base,
    address: contractAddress,
  });

  return (
     {
        alert(`NFT铸造成功！交易哈希: ${result.transactionHash}`);
      }}
      onError={(error) => {
        console.error('铸造错误:', error);
        alert('铸造失败，请重试');
      }}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        background: '#6a5cff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      铸造NFT
    
  );
}
