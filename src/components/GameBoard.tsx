"use client";

import { useEffect, useRef, useState } from "react";

type Board = number[][];
const N = 4;

function freshBoard(): Board {
  const b = Array.from({ length: N }, () => Array(N).fill(0));
  placeRandom(b);
  placeRandom(b);
  return b;
}

function placeRandom(b: Board): void {
  const empty: Array<[number, number]> = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (b[r][c] === 0) empty.push([r, c]);
    }
  }
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function rotate90(b: Board): Board {
  const out = Array.from({ length: N }, () => Array(N).fill(0));
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      out[c][N - 1 - r] = b[r][c];
    }
  }
  return out;
}

function moveLeft(b: Board): { next: Board; moved: boolean; gain: number } {
  let moved = false;
  let gain = 0;
  const next: Board = b.map((row) => {
    const vals = row.filter((v) => v !== 0);
    const merged: number[] = [];
    for (let i = 0; i < vals.length; i++) {
      if (i < vals.length - 1 && vals[i] === vals[i + 1]) {
        const v = vals[i] * 2;
        merged.push(v);
        gain += v;
        i++;
      } else {
        merged.push(vals[i]);
      }
    }
    while (merged.length < N) merged.push(0);
    if (!moved && merged.some((v, i) => v !== row[i])) moved = true;
    return merged;
  });
  return { next, moved, gain };
}

export default function GameBoard(props: { onGameOver: (score: number) => void }) {
  const { onGameOver } = props;
  const [board, setBoard] = useState<Board>(() => freshBoard());
  const [score, setScore] = useState<number>(0);
  const [over, setOver] = useState<boolean>(false);
  const swipe = useRef<{ x?: number; y?: number }>({});

  function applyMove(dir: "left" | "right" | "up" | "down") {
    if (over) return;

    let working = board;
    if (dir === "up") working = rotate90(rotate90(rotate90(working)));
    if (dir === "right") working = working.map((r) => [...r].reverse());
    if (dir === "down") working = rotate90(working);

    const { next, moved, gain } = moveLeft(working);

    let restored = next;
    if (dir === "up") restored = rotate90(restored);
    if (dir === "right") restored = restored.map((r) => [...r].reverse());
    if (dir === "down") restored = rotate90(rotate90(rotate90(restored)));

    if (moved) {
      placeRandom(restored);
      const newScore = score + gain;
      setBoard(restored);
      setScore(newScore);
      checkEnd(restored, newScore);
    }
  }

  function checkEnd(b: Board, sc: number) {
    const flat = b.flat();
    if (flat.includes(2048)) {
      setOver(true);
      onGameOver(sc);
      return;
    }
    if (flat.includes(0)) return;
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (c < N - 1 && b[r][c] === b[r][c + 1]) return;
        if (r < N - 1 && b[r][c] === b[r + 1][c]) return;
      }
    }
    setOver(true);
    onGameOver(sc);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (over) return;
      const key = e.key;
      if (key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown") {
        e.preventDefault();
      }
      if (key === "ArrowLeft") applyMove("left");
      if (key === "ArrowRight") applyMove("right");
      if (key === "ArrowUp") applyMove("up");
      if (key === "ArrowDown") applyMove("down");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [board, over, score]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - (swipe.current.x ?? t.clientX);
    const dy = t.clientY - (swipe.current.y ?? t.clientY);
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) applyMove(dx > 0 ? "right" : "left");
    else applyMove(dy > 0 ? "down" : "up");
  };

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <div className="h1">2048</div>
        <div className="mono">Score: {score}</div>
      </div>

      <div className="board" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} role="grid" aria-label="2048 board">
        {board.map((row, r) => (
          <div key={`row-${r}`} className="row">
            {row.map((v, c) => (
              <div key={`cell-${r}-${c}`} className={`tile v${v || "0"}`}>
                {v || ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      {over ? (
        <>
          <div className="mono" style={{ marginTop: 8 }}>
            游戏结束。再按任意方向开始新盘。
          </div>
          <button
            className="btn"
            style={{ marginTop: 8 }}
            onClick={() => {
              setBoard(freshBoard());
              setScore(0);
              setOver(false);
            }}
          >
            再来一局
          </button>
        </>
      ) : null}
    </div>
  );
}
