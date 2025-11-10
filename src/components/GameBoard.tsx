'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Board = number[][];
type Dir = 'up' | 'down' | 'left' | 'right';

const SIZE = 4;
const WIN = 2048;

// ---- 工具函数 ----
const clone = (b: Board): Board => b.map((r) => r.slice());
const emptyBoard = (): Board => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

function randomEmptyCell(b: Board): [number, number] | null {
  const empties: [number, number][] = [];
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) if (b[i][j] === 0) empties.push([i, j]);
  }
  if (!empties.length) return null;
  return empties[Math.floor(Math.random() * empties.length)];
}

function addRandomTile(b: Board): Board {
  const cell = randomEmptyCell(b);
  if (!cell) return b;
  const [i, j] = cell;
  const val = Math.random() < 0.9 ? 2 : 4;
  const nb = clone(b);
  nb[i][j] = val;
  return nb;
}

function compressRow(row: number[]): number[] {
  const nums = row.filter((x) => x !== 0);
  while (nums.length < SIZE) nums.push(0);
  return nums;
}

function mergeRow(row: number[]): { row: number[]; gained: number } {
  const r = row.slice();
  let gained = 0;
  for (let i = 0; i < SIZE - 1; i++) {
    if (r[i] !== 0 && r[i] === r[i + 1]) {
      r[i] *= 2;
      gained += r[i];
      r[i + 1] = 0;
      i++;
    }
  }
  return { row: compressRow(r), gained };
}

function rotateRight(b: Board): Board {
  const res = emptyBoard();
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) res[j][SIZE - 1 - i] = b[i][j];
  return res;
}

function rotateLeft(b: Board): Board {
  const res = emptyBoard();
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) res[SIZE - 1 - j][i] = b[i][j];
  return res;
}

function flipRow(row: number[]): number[] {
  return row.slice().reverse();
}

function boardsEqual(a: Board, b: Board) {
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) if (a[i][j] !== b[i][j]) return false;
  return true;
}

function anyMoves(b: Board) {
  // 有空位或可合并即还有路
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) {
    if (b[i][j] === 0) return true;
    if (i < SIZE - 1 && b[i][j] === b[i + 1][j]) return true;
    if (j < SIZE - 1 && b[i][j] === b[i][j + 1]) return true;
  }
  return false;
}

// ---- 组件 ----
export default function GameBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<Board>(() => {
    // 初始放两块
    let b = emptyBoard();
    b = addRandomTile(addRandomTile(b));
    return b;
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);

  // 读取/记录最高分
  useEffect(() => {
    const saved = Number(localStorage.getItem('best-2048') || 0);
    setBest(saved);
  }, []);
  useEffect(() => {
    if (score > best) {
      setBest(score);
      localStorage.setItem('best-2048', String(score));
    }
  }, [score, best]);

  const didWin = useMemo(() => board.some(row => row.some(v => v >= WIN)), [board]);

  const restart = useCallback(() => {
    let b = emptyBoard();
    b = addRandomTile(addRandomTile(b));
    setBoard(b);
    setScore(0);
    setOver(false);
  }, []);

  // 核心移动：统一转化为“向左移动”来处理
  const moveLeftOnce = useCallback((b: Board) => {
    let gained = 0;
    const nb = b.map((row) => {
      const compressed = compressRow(row);
      const { row: merged, gained: g } = mergeRow(compressed);
      gained += g;
      return merged;
    });
    return { nb, gained };
  }, []);

  const move = useCallback((dir: Dir) => {
    if (over) return;

    let working = board;
    if (dir === 'up') working = rotateLeft(working);
    if (dir === 'down') working = rotateRight(working);
    if (dir === 'right') working = working.map((r) => flipRow(r));

    const { nb, gained } = moveLeftOnce(working);

    let restored = nb;
    if (dir === 'up') restored = rotateRight(restored);
    if (dir === 'down') restored = rotateLeft(restored);
    if (dir === 'right') restored = restored.map((r) => flipRow(r));

    if (!boardsEqual(board, restored)) {
      let withNew = addRandomTile(restored);
      setBoard(withNew);
      if (gained) setScore((s) => s + gained);
      if (!anyMoves(withNew)) setOver(true);
    }
  }, [board, moveLeftOnce, over]);

  // ---- 键盘 ----
  useEffect(() => {
    // 让容器可聚焦并自动聚焦，确保 onKeyDown 能触发
    containerRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k.startsWith('Arrow')) {
        e.preventDefault();
        if (k === 'ArrowUp') move('up');
        else if (k === 'ArrowDown') move('down');
        else if (k === 'ArrowLeft') move('left');
        else if (k === 'ArrowRight') move('right');
      } else if (k === 'w' || k === 'W') move('up');
      else if (k === 's' || k === 'S') move('down');
      else if (k === 'a' || k === 'A') move('left');
      else if (k === 'd' || k === 'D') move('right');
    };

    // 用 window 兜底 + passive: false 保证 preventDefault 生效
    window.addEventListener('keydown', onKey, { passive: false });
    return () => window.removeEventListener('keydown', onKey as any);
  }, [move]);

  // ---- 触摸（手机滑动）----
  const startXY = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const t = e.touches[0];
    startXY.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!startXY.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - startXY.current.x;
    const dy = t.clientY - startXY.current.y;
    startXY.current = null;

    const ax = Math.abs(dx), ay = Math.abs(dy);
    const TH = 24; // 最小滑动阈值
    if (Math.max(ax, ay) < TH) return;

    if (ax > ay) move(dx > 0 ? 'right' : 'left');
    else move(dy > 0 ? 'down' : 'up');
  };

  // ---- UI ----
  return (
    <div className="card" style={{ touchAction: 'none' }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="h1">2048</div>
        <div className="mono">Score: {score} &nbsp;&nbsp; Best: {best}</div>
      </div>

      <div
        ref={containerRef}
        tabIndex={0}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="grid"
        aria-label="2048 board"
        role="application"
        style={{ outline: 'none' }}
      >
        {board.map((row, i) =>
          row.map((v, j) => (
            <div key={`${i}-${j}`} className={`cell tile tile-${v || '0'}`}>
              {v !== 0 ? v : ''}
            </div>
          ))
        )}
      </div>

      <div className="row" style={{ gap: 8, marginTop: 12 }}>
        <button className="btn" onClick={restart}>重新开始</button>
        <span className="mono" aria-live="polite">
          {over ? '没有可走的路啦～' : '使用方向键或滑动操作；相同数字合并，冲击 2048！'}
          {didWin ? ' 已达成 2048！继续挑战更高分！' : ''}
        </span>
      </div>
    </div>
  );
}
