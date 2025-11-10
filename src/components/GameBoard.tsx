"use client";
import { useEffect, useRef, useState } from "react";

type Board = number[][];

const N = 4;

function fresh(): Board {
  const b = Array.from({ length: N }, () => Array(N).fill(0));
  placeRandom(b); placeRandom(b);
  return b;
}

function placeRandom(b: Board) {
  const empty: Array<[number, number]> = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++)
    if (b[r][c] === 0) empty.push([r, c]);
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function rotate(b: Board): Board {
  // 旋转 90°（辅助实现上下移动）
  const out = Array.from({ length: N }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++)
    out[c][N - 1 - r] = b[r][c];
  return out;
}

function moveLeft(b: Board) {
  let moved = false, gain = 0;
  const nb: Board = b.map(row => {
    const vals = row.filter(v => v !== 0);
    const merged: number[] = [];
    for (let i = 0; i < vals.length; i++) {
      if (i < vals.length - 1 && vals[i] === vals[i + 1]) {
        const v = vals[i] * 2;
        merged.push(v);
        gain += v;
        i++;
      } else merged.push(vals[i]);
    }
    while (merged.length < N) merged.push(0);
    if (merged.some((v, i) => v !== row[i])) moved = true;
    return merged;
  });
  return { nb, moved, gain };
}

export default function GameBoard({
  onGameOver,
}: {
  onGameOver: (score: number) => void;
}) {
  const [board, setBoard] = useState<Board>(() => fresh());
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const swipe = useRef<{ x?: number; y?: number }>({});

  const doMove = (dir: "left" | "right" | "up" | "down") => {
    if (over) return;

    let working = board;
    if (dir === "up") working = rotate(rotate(rotate(working)));
    if (dir === "right") working = working.map(r => [...r].reverse());
    if (dir === "down") working = rotate(working);

    const { nb, moved, gain } = moveLeft(working);

    let newBoard = nb;
    if (dir === "up") newBoard = rotate(newBoard);
    if (dir === "right") newBoard = newBoard.map(r => [...r].reverse());
    if (dir === "down") newBoard = rotate(rotate(rotate(newBoard)));

    if (moved) {
      placeRandom(newBoard);
      const sc = score + gain;
      setBoard(newBoard);
      setScore(sc);
      checkEnd(newBoard, sc);
    }
  };

  const checkEnd = (b: Board, sc: number) => {
    const flat = b.flat();
    if (flat.includes(2048)) { setOver(true); onGameOver(sc); return; }
    if (flat.includes(0)) return;
    // 无空格，检查是否还能合并
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (c < N - 1 && b[r][c] === b[r][c + 1]) return;
      if (r < N - 1 && b[r][c] === b[r + 1][c]) return;
    }
    setOver(true);
    onGameOver(sc);
  };

  // 键盘
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (over) return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") doMove("left");
      if (e.key === "ArrowRight") doMove("right");
      if (e.key === "ArrowUp") doMove("up");
      if (e.key === "ArrowDown") doMove("down");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, over, score]);

  // 触控
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]; swipe.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    const dx = (t.clientX - (swipe.current.x ?? t.clientX));
    const dy = (t.clientY - (swipe.current.y ?? t.clientY));
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "right" : "left");
    else doMove(dy > 0 ? "down" : "up");
  };

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between",alignItems:"center"}}>
        <div className="h1">2048</div>
        <div className="mono">Score: {score}</div>
      </div>
      <div
        className="board"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="grid"
        aria-label="2048 board"
      >
        {board.map((row, r) => (
          <div key={r} className="row">
            {row.map((v, c) => (
              <div key={r + "-" + c} className={`tile v${v || "0"}`}>
                {v || ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      {over && <div className="mono" style={{marginTop:8}}>游戏结束。再按任意方向开始新盘。</div>}
      {over && (
        <button
          className="btn"
          onClick={() => { setBoard(fresh()); setScore(0); setOver(false); }}
          style={{marginTop:8}}
        >
          再来一局
        </button>
      )}
