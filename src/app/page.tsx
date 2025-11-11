// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

type Status = 'idle' | 'ready' | 'authorizing' | 'authorized' | 'error';

export default function Page() {
  const [status, setStatus] = useState<Status>('idle');
  const [msg, setMsg] = useState<string>('');

  // ❶ 首屏一挂载就 ready()，解决 Dev Mode 的 “Ready not called”
  useEffect(() => {
    try {
      sdk.actions.ready();
      setStatus('ready');
    } catch (e: any) {
      setStatus('error');
      setMsg(e?.message ?? String(e));
    }
    // 注意：开发模式下 React 严格模式会让 useEffect 执行两次，生产环境不会影响
  }, []);

  // ❷ 需要权限（钱包/签名）时再显式授权，避免 “has not been authorized yet”
  const handleAuthorize = async () => {
    setStatus('authorizing');
    setMsg('');
    try {
      await sdk.actions.authorize({
        permissions: ['wallet', 'sign'],
      });
      setStatus('authorized');
    } catch (e: any) {
      setStatus('error');
      setMsg(e?.message ?? String(e));
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">mini 2048</h1>
      <p className="opacity-80">
        Farcaster Mini App 初始化状态：<b>{status}</b>
      </p>

      <div className="flex items-center gap-3">
        <button
          onClick={handleAuthorize}
          className="px-4 py-2 rounded-xl shadow border"
        >
          请求授权（钱包 + 签名）
        </button>
      </div>

      {msg && (
        <pre className="mt-2 text-sm opacity-80 whitespace-pre-wrap break-words max-w-[90vw]">
          {msg}
        </pre>
      )}

      {/* 你原来的游戏组件可以直接渲染在下面（已位于 Providers 的子树） */}
      {/* <GameBoard /> 或 <MintOn128 reached={reached128} /> */}
    </main>
  );
}
