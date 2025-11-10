"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MintButton from "./MintButton";

type Grid = number[][];
const SIZE = 4;

// ---------- 逻辑工具 ----------
const clone = (g: Grid) => g.map((r) => [...r]);
const emptyCells = (g: Grid) => {
  const cells: Array<[number, number]> = [];
  g.forEach((row, i) =>
    row.forEach((v, j) => {
      if (v === 0) cells.push([i, j]);
    }),
  );
  return cells;
};
const randChoice = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const addRandomTile = (g: Grid) => {
  const cells = emptyCells(g);
  if (!cells.length) return g;
  const [i, j] = randChoice(cells);
  g[i][j] = Math.random() < 0.9 ? 2 : 4;
  return g;
};
const newGrid = (): Grid =>
  addRandomTile(addRandomTile(Array.from({ length: SIZE }, () => Array(SIZE).fill(0))));

const compress = (row: number[]) => row.filter((x) => x !== 0);
const padRight = (row: number[]) => [...row, ...Array(SIZE - row.length).fill(0)];
function moveLeft(grid: Grid) {
  let scoreAdd = 0;
  const next = grid.map((row) => {
    const line = compress(row);
    const merged: number[] = [];
    for (let i = 0; i < line.length; i++) {
      if (line[i] === line[i + 1]) {
        const v = line[i] * 2;
        merged.push(v);
        scoreAdd += v;
        i++;
      } else {
        merged.push(line[i]);
      }
    }
    return padRight(merged);
  });
  return { next, scoreAdd };
}
const reverseRows = (g: Grid) => g.map((r) => [...r].reverse());
const transpose = (g: Grid) => {
  const t: Grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) t[i][j] = g[j][i];
  return t;
};
const equalGrid = (a: Grid, b: Grid) => a.every((row, i) => row.every((v, j) => v === b[i][j]));
const hasMove = (g: Grid) => {
  if (emptyCells(g).length) return true;
  for (let i = 0; i < SIZE; i++)
    for (let j = 0; j < SIZE - 1; j++) if (g[i][j] === g[i][j + 1]) return true;
  for (let j = 0; j < SIZE; j++)
    for (let i = 0; i < SIZE - 1; i++) if (g[i][j] === g[i + 1][j]) return true;
  return false;
};

// ---------- 组件 ----------
export default function GameBoard() {
  const [grid, setGrid] = useState<Grid>(() => newGrid());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [movedFlag, setMovedFlag] = useState(false);

  const threshold = 128;
  const containerRef = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  // 读取历史最高分
  useEffect(() => {
    try {
      const b = localStorage.getItem("best-score");
      if (b) setBest(parseInt(b));
    } catch {}
  }, []);

  // 写入历史最高分
  useEffect(() => {
    if (score > best) {
      setBest(score);
      try {
        localStorage.setItem("best-score", String(score));
      } catch {}
    }
  }, [score, best]);

  // 键盘操作
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      let dir: "left" | "right" | "up" | "down" | null = null;
      if (e.key === "ArrowLeft" || e.key === "a") dir = "left";
      if (e.key === "ArrowRight" || e.key === "d") dir = "right";
      if (e.key === "ArrowUp" || e.key === "w") dir = "up";
      if (e.key === "ArrowDown" || e.key === "s") dir = "down";
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
    // 依赖仅需 grid/score 的最新值，不必把 move 放进依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, score]);

  // 触控操作
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const start = (e: TouchEvent) => {
      const t = e.touches[0];
      touch.current = { x: t.clientX, y: t.clientY };
    };
    const end = (e: TouchEvent) => {
      if (!touch.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touch.current.x;
      const dy = t.clientY - touch.current.y;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      if (Math.max(ax, ay) < 20) return;
      if (ax > ay) move(dx > 0 ? "right" : "left");
      else move(dy > 0 ? "down" : "up");
      touch.current = null;
    };

    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, score]);

  const move = (dir: "left" | "right" | "up" | "down") => {
    let base = clone(grid);
    let rotated = base;

    if (dir === "right") rotated = reverseRows(base);
    if (dir === "up") rotated = transpose(base);
    if (dir === "down") rotated = reverseRows(transpose(base));

    const { next, scoreAdd } = moveLeft(rotated);

    let restored = next;
    if (dir === "right") restored = reverseRows(next);
    if (dir === "up") restored = transpose(next);
    if (dir === "down") restored = transpose(reverseRows(next));

    if (!equalGrid(restored, grid)) {
      const withNew = addRandomTile(restored);
      setGrid(withNew);
      setScore((s) => s + scoreAdd);
      setMovedFlag(true);

      if (!hasMove(withNew)) {
        setTimeout(() => alert(`Game Over! 得分 ${score + scoreAdd}`), 10);
      }
    } else {
      setMovedFlag(false);
    }
  };

  const reset = () => {
    setGrid(newGrid());
    setScore(0);
  };

  const tiles = useMemo(
    () =>
      grid.flatMap((row, i) =>
        row.map((v, j) => (
          <div
            key={`${i}-${j}-${v}-${movedFlag ? "m" : "s"}`}
            className={`cell tile-${v}`}
          >
            {v || ""}
          </div>
        )),
      ),
    [grid, movedFlag],
  );

  return (
    <div ref={containerRef} className="app">
      <div className="card">
        {/* 标题 + 分数 */}
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="h1">2048</div>
          <div className="mono">Score: {score}&nbsp;&nbsp;Best: {best}</div>
        </div>

        {/* 4×4 棋盘 */}
        <div className="grid">{tiles}</div>

        <div className="mono" style={{ marginTop: 8 }}>
          使用方向键或滑动操作；相同数字合并，冲击 2048！
        </div>

        {/* Mint / 重开 */}
        <div className="row" style={{ marginTop: 12 }}>
          {score >= 128 ? (
            <div style={{ flex: 1 }}>
              <MintButton quantity={1} />
            </div>
          ) : (
            <button className="btn" disabled style={{ flex: 1 }} title="达到 128 分解锁 Mint">
              Mint（需 128 分）
            </button>
          )}
          <button className="btn" style={{ flex: 1 }} onClick={reset}>
            重新开始
          </button>
        </div>
      </div>
    </div>
  );
}
