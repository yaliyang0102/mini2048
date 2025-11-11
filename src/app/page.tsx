// src/app/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount, useConnect } from 'wagmi';

export default function Page() {
  const [booted, setBooted] = useState(false);
  const [hint, setHint] = useState<string>('');

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  // 1) 首屏就 ready()，隐藏 Mini App 的 splash
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await sdk.actions.ready();            // 关键：只在客户端调用
        if (mounted) setBooted(true);
      } catch (err) {
        console.error('sdk.ready failed', err);
        if (mounted) setHint('Mini App SDK 初始化失败');
      }
    })();
    return () => { mounted = false; };
  }, []);

  // 2) 真正需要权限（wallet/sign）时，再触发连接（系统会弹授权）
  const handleConnect = async () => {
    try {
      setHint('');
      // 优先使用 Farcaster 连接器；找不到就用第一个
      const farcaster = connectors.find((c) => c.id === 'farcaster') ?? connectors[0];
      if (!farcaster) {
        setHint('未找到可用的钱包连接器');
        return;
      }
      await connect({ connector: farcaster });
    } catch (e: any) {
      console.error(e);
      setHint(e?.message || '连接失败');
    }
  };

  const shortAddr = useMemo(
    () => (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : ''),
    [address]
  );

  return (
    <main style={{ padding: 16, maxWidth: 560, margin: '0 auto', fontFamily: 'system-ui, -apple-system' }}>
      <h1 style={{ marginBottom: 8 }}>mini 2048</h1>
      <p style={{ marginTop: 0, color: '#666' }}>
        SDK 状态：{booted ? 'ready ✅' : 'booting…'}
      </p>

      {hint && <div style={{ color: '#d33', margin: '12px 0' }}>{hint}</div>}

      {isConnected ? (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 12 }}>已连接：{shortAddr}</div>
          {/* 这里放你的 2048 游戏组件 */}
          <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
            （在此渲染 2048 游戏）
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          style={{
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #ddd',
            cursor: 'pointer'
          }}
        >
          连接钱包（触发授权）
        </button>
      )}
    </main>
  );
}
