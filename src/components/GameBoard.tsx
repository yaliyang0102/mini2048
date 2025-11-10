"use client";
import { useEffect, useRef, useState } from "react";

type Board = number[][];
const SIZE = 4;

export default function GameBoard({ onGameOver }: { onGameOver: (score: number) => void; }) {
  const [board, setBoard] = useState<Board>(() => makeEmpty());
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => { init(); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (over) return;
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft") step("L");
      if (e.key === "ArrowRight") step("R");
      if (e.key === "ArrowUp") step("U");
      if (e.key === "ArrowDown") step("D");
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [board, score, over]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || over) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    if (Math.max(ax, ay) < 24) return;
    if (ax > ay) step(dx > 0 ? "R" : "L");
    else step(dy > 0 ? "D" : "U");
    touchStart.current = null;
  };

  function init() {
    const b = makeEmpty();
    addRandom(b); addRandom(b);
    setBoard(b);
    setScore(0);
    setOver(false);
  }

  function step(dir: "L"|"R"|"U"|"D") {
    let b = clone(board);
    let moved = false;
    let gained = 0;

    const slideRow = (row: number[]) => {
      const nonZero = row.filter(v => v !== 0);
      const merged: number[] = [];
      for (let i=0; i<nonZero.length; i++) {
        if (i < nonZero.length - 1 && nonZero[i] === nonZero[i+1]) {
          const v = nonZero[i]*2;
          merged.push(v);
          gained += v;
          i++; // skip next
        } else merged.push(nonZero[i]);
      }
      while (merged.length < SIZE) merged.push(0);
      return merged;
    };

    if (dir === "L") {
      const nb = b.map(slideRow);
      moved = !eq(b, nb); b = nb;
    } else if (dir === "R") {
      const nb = b.map(r => reverse(slideRow(reverse(r))));
      moved = !eq(b, nb); b = nb;
    } else if (dir === "U") {
      const t = transpose(b);
      const slid = t.map(slideRow);
      const nb = transpose(slid);
      moved = !eq(b, nb); b = nb;
    } else if (dir === "D") {
      const t = transpose(b);
      const slid = t.map(r => reverse(slideRow(reverse(r))));
      const nb = transpose(slid);
      moved = !eq(b, nb); b = nb;
    }

    if (!moved) return;
    addRandom(b);
    setBoard(b);
    setScore(s => s + gained);

    const { isWin, noMove } = status(b);
    if (isWin || noMove) {
      setOver(true);
      onGameOver(score + gained);
    }
  }

  return (
    <div className="card" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{
        display: "grid",
        gap: 8,
        gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
        width: "100%", aspectRatio: "1 / 1", padding: 8,
        background:"#0b1424", borderRadius: 16, border: "1px solid #1a2742"
      }}>
        {board.flat().map((v, i) => (
          <div key={i} className="center mono" style={{
            borderRadius: 12, fontWeight: 700, fontSize: 18,
            background: getTileColor(v), color: v <= 4 ? "#172033" : "#fff",
            transition: "all .15s ease", userSelect: "none"
          }}>
            {v || ""}
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap: 8, marginTop: 12 }}>
        <div className="btn" onClick={init}>重新开始</div>
        <div className="btn" style={{ opacity:.8, cursor: "default" }}>分数：{score}</div>
      </div>
    </div>
  );
}

function makeEmpty(): Board { return Array.from({ length: SIZE }, () => Array(SIZE).fill(0)); }
function clone(b: Board): Board { return b.map(r => r.slice()); }
function reverse<T>(arr: T[]): T[] { return arr.slice().reverse(); }
function transpose(b: Board): Board {
  const t = makeEmpty();
  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++) t[c][r]=b[r][c];
  return t;
}
function eq(a: Board, b: Board) { return a.flat().toString() === b.flat().toString(); }
function addRandom(b: Board) {
  const empty: {r:number;c:number}[] = [];
  for (let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if (b[r][c]===0) empty.push({r,c});
  if (!empty.length) return;
  const { r, c } = empty[Math.floor(Math.random()*empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
}
function status(b: Board) {
  const flat = b.flat();
  const isWin = flat.includes(2048);
  const hasZero = flat.includes(0);
  let canMerge = false;
  for (let r=0;r<SIZE;r++) for (let c=0;c<SIZE;c++){
    if (c+1<SIZE && b[r][c]===b[r][c+1]) canMerge = true;
    if (r+1<SIZE && b[r][c]===b[r+1][c]) canMerge = true;
  }
  const noMove = !hasZero && !canMerge;
  return { isWin, noMove };
}

function getTileColor(v: number): string {
  const map: Record<number, string> = {
    0:"#0f1a2e", 2:"#1a2742", 4:"#223152", 8:"#2b3b62", 16:"#355274",
    32:"#406a87", 64:"#4a829a", 128:"#559aaf", 256:"#61b3c4",
    512:"#6bcbda", 1024:"#75e3ef", 2048:"#7bffff"
  };
  return map[v] ?? "#1a2742";
}
