"use client";

import { useEffect, useRef, useState } from "react";
import MintButton from "./MintButton";

type Board = number[][];
const SIZE = 4;
const SWIPE_THRESHOLD = 24; // px

interface Props {
  /** 游戏结束时回调（传入最终分数） */
  onGameOver?: (finalScore: number) => void;
  /** 分数变化时回调 */
  onScoreChange?: (score: number) => void;
  /** 解锁 Mint 的阈值（默认 2048） */
  threshold?: number;
}

export default function GameBoard({
  onGameOver,
  onScoreChange,
  threshold = 2048,
}: Props) {
  const [board, setBoard] = useState<Board>(() => makeEmptyBoard());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // touch state
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // 初始化
  useEffect(() => {
    const saved = safeGetLocal("mini2048-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.board) && typeof parsed.score === "number") {
          setBoard(parsed.board);
          setScore(parsed.score);
          setGameOver(parsed.gameOver ?? false);
        } else {
          initGame();
        }
      } catch {
        initGame();
      }
    } else {
      initGame();
    }

    const b = Number(safeGetLocal("mini2048-best") ?? "0") || 0;
    setBest(b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 持久化 + 分数变化回调
  useEffect(() => {
    safeSetLocal(
      "mini2048-state",
      JSON.stringify({ board, score, gameOver })
    );
    if (score > best) {
      setBest(score);
      safeSetLocal("mini2048-best", String(score));
    }
    onScoreChange?.(score);
  }, [board, score, gameOver, best, onScoreChange]);

  // 游戏结束回调
  useEffect(() => {
    if (gameOver) onGameOver?.(score);
  }, [gameOver, score, onGameOver]);

  // 键盘
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameOver) return;
      let handled = true;
      if (e.key === "ArrowLeft") move("L");
      else if (e.key === "ArrowRight") move("R");
      else if (e.key === "ArrowUp") move("U");
      else if (e.key === "ArrowDown") move("D");
      else handled = false;
      if (handled) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameOver]);

  // 触控
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (gameOver) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) move("R");
      else move("L");
    } else {
      if (dy > 0) move("D");
      else move("U");
    }
  };

  function initGame() {
    const b = makeEmptyBoard();
    addRandomTile(b);
    addRandomTile(b);
    setBoard(b);
    setScore(0);
    setGameOver(false);
  }

  // 一次移动
  function move(dir: "L" | "R" | "U" | "D") {
    const before = clone(board);
    let after: Board = before;
    let gained = 0;

    if (dir === "L") {
      ({ board: after, gained } = moveLeft(before));
    } else if (dir === "R") {
      ({ board: after, gained } = moveRight(before));
    } else if (dir === "U") {
      ({ board: after, gained } = moveUp(before));
    } else {
      ({ board: after, gained } = moveDown(before));
    }

    if (!boardsEqual(before, after)) {
      addRandomTile(after);
      setBoard(after);
      setScore((s) => s + gained);
      if (isGameOver(after)) setGameOver(true);
    }
  }

  // 渲染
  return (
    <div className="card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div
        className="row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="h1">2048</div>
        <div className="mono">
          Score: {score}
          <span style={{ marginLeft: 12, opacity: 0.7 }}>Best: {best}</span>
        </div>
      </div>

      <div className="board">
        {/* 背景网格 */}
        {Array.from({ length: SIZE * SIZE }).map((_, i) => (
          <div key={`bg-${i}`} className="cell" />
        ))}

        {/* 实际方块 */}
        {board.flat().map((v, i) => {
          const r = Math.floor(i / SIZE);
          const c = i % SIZE;
          const tileStyle: React.CSSProperties = {
            gridRowStart: r + 1,
            gridColumnStart: c + 1,
            background: tileColor(v),
            color: v <= 4 ? "#776e65" : "#f9f6f2",
            transform: "scale(1)",
          };
          return (
            <div key={`tile-${i}-${v}`} className="tile" style={tileStyle}>
              {v !== 0 ? v : ""}
            </div>
          );
        })}
      </div>

      <div className="row" style={{ marginTop: 12, gap: 8 }}>
        <button className="btn" onClick={initGame}>
          重新开始
        </button>
        {score >= threshold ? (
          <div style={{ flex: 1 }}>
            <MintButton quantity={1} />
          </div>
        ) : (
          <button className="btn" disabled title={`达到 ${threshold} 分解锁 Mint`} style={{ flex: 1 }}>
            分数达到 {threshold} 解锁 Mint
          </button>
        )}
      </div>

      {gameOver && (
        <div
          className="mono"
          style={{
            marginTop: 10,
            textAlign: "center",
            padding: 8,
            border: "1px dashed #333",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          游戏结束！最终得分：{score}
        </div>
      )}

      <p className="muted" style={{ marginTop: 12 }}>
        使用方向键或滑动操作；相同数字合并，冲击 {threshold}！
      </p>
    </div>
  );
}

/* ---------------------------- 2048 核心逻辑 ---------------------------- */

function makeEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}
function clone(b: Board): Board {
  return b.map((row) => row.slice());
}
function boardsEqual(a: Board, b: Board) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
}
function addRandomTile(b: Board) {
  const empties: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] === 0) empties.push({ r, c });
    }
  }
  if (empties.length === 0) return;
  const { r, c } = empties[Math.floor(Math.random() * empties.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
}
function compressAndMergeRow(row: number[]) {
  const filtered = row.filter((x) => x !== 0);
  const merged: number[] = [];
  let gained = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
      const v = filtered[i] * 2;
      merged.push(v);
      gained += v;
      i++;
    } else {
      merged.push(filtered[i]);
    }
  }
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, gained };
}
function transpose(b: Board): Board {
  const t = makeEmptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      t[c][r] = b[r][c];
    }
  }
  return t;
}
function moveLeft(b: Board) {
  const out = makeEmptyBoard();
  let gained = 0;
  for (let r = 0; r < SIZE; r++) {
    const { row, gained: g } = compressAndMergeRow(b[r]);
    out[r] = row;
    gained += g;
  }
  return { board: out, gained };
}
function moveRight(b: Board) {
  const out = makeEmptyBoard();
  let gained = 0;
  for (let r = 0; r < SIZE; r++) {
    const reversed = b[r].slice().reverse();
    const { row, gained: g } = compressAndMergeRow(reversed);
    out[r] = row.reverse();
    gained += g;
  }
  return { board: out, gained };
}
function moveUp(b: Board) {
  const t = transpose(b);
  const { board: moved, gained } = moveLeft(t);
  return { board: transpose(moved), gained };
}
function moveDown(b: Board) {
  const t = transpose(b);
  const { board: moved, gained } = moveRight(t);
  return { board: transpose(moved), gained };
}
function isGameOver(b: Board) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] === 0) return false;
    }
  }
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = b[r][c];
      if (c + 1 < SIZE && b[r][c + 1] === v) return false;
      if (r + 1 < SIZE && b[r + 1][c] === v) return false;
    }
  }
  return true;
}
function tileColor(v: number) {
  const map: Record<number, string> = {
    0: "rgba(255,255,255,0.06)",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
    4096: "#3c3a32",
    8192: "#3c3a32",
  };
  return map[v] ?? "#3c3a32";
}

/* ---------------------------- 小工具 ---------------------------- */
function safeGetLocal(key: string) {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSetLocal(key: string, value: string) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}
