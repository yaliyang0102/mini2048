'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';

export default function WalletConnection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect(); // ✅ 移除pendingConnector
  const { disconnect } = useDisconnect();
  const [isAutoConnecting, setIsAutoConnecting] = useState(true);

  // 自动连接Farcaster钱包
  useEffect(() => {
    if (!isConnected && isAutoConnecting) {
      const farcasterConnector = connectors.find(
        connector => connector.name.toLowerCase().includes('farcaster')
      );
      
      if (farcasterConnector) {
        connect({ connector: farcasterConnector });
      }
      setIsAutoConnecting(false);
    }
  }, [connectors, isConnected, connect, isAutoConnecting]);

  if (isConnected) {
    return (
      
        已连接: {address?.slice(0,6)}...{address?.slice(-4)}
         disconnect()}
          style={{
            background: '#ff4444',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          断开
        
      
    );
  }

  return (
    
      {isPending ? '连接中...' : '未连接钱包'}
    
  );
}
