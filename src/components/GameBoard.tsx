'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAccount } from 'wagmi';
import WalletConnection from './WalletConnection';
import MintButton from './MintButton';

interface Position {
  row: number;
  col: number;
}

interface Tile {
  id: number;
  value: number;
  position: Position;
  isNew: boolean;
  isMerged: boolean;
}

export default function GameBoard() {
  const { isConnected } = useAccount();
  
  // 游戏状态
  const [board, setBoard] = useState(() => 
    Array(4).fill(null).map(() => Array(4).fill(0))
  );
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [previousState, setPreviousState] = useState<{
    board: number[][];
    score: number;
  } | null>(null);

  // 触摸事件状态
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  
  const gameContainerRef = useRef(null);
  const minSwipeDistance = 50;

  // 从localStorage加载最佳分数
  useEffect(() => {
    const saved = localStorage.getItem('2048-best-score');
    if (saved) {
      setBestScore(parseInt(saved));
    }
  }, []);

  // 保存最佳分数
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  // 初始化游戏
  const initGame = useCallback(() => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setCanUndo(false);
    setPreviousState(null);
  }, []);

  // 添加随机方块
  const addRandomTile = (currentBoard: number[][]) => {
    const emptyCells: Position[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentBoard[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  // 深拷贝棋盘
  const copyBoard = (board: number[][]): number[][] => {
    return board.map(row => [...row]);
  };

  // 检查两个棋盘是否相同
  const boardsEqual = (board1: number[][], board2: number[][]) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board1[i][j] !== board2[i][j]) return false;
      }
    }
    return true;
  };

  // 移动逻辑 - 左移
  const moveLeft = (board: number[][]): { newBoard: number[][]; scoreGained: number; moved: boolean } => {
    let scoreGained = 0;
    let moved = false;
    const newBoard = copyBoard(board);

    for (let row = 0; row < 4; row++) {
      const filteredRow = newBoard[row].filter(val => val !== 0);
      const mergedRow: number[] = [];
      let i = 0;

      while (i < filteredRow.length) {
        if (i < filteredRow.length - 1 && filteredRow[i] === filteredRow[i + 1]) {
          const mergedValue = filteredRow[i] * 2;
          mergedRow.push(mergedValue);
          scoreGained += mergedValue;
          i += 2;
        } else {
          mergedRow.push(filteredRow[i]);
          i++;
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      if (mergedRow.toString() !== newBoard[row].toString()) {
        moved = true;
      }
      newBoard[row] = mergedRow;
    }

    return { newBoard, scoreGained, moved };
  };

  // 移动逻辑 - 右移
  const moveRight = (board: number[][]): { newBoard: number[][]; scoreGained: number; moved: boolean } => {
    let scoreGained = 0;
    let moved = false;
    const newBoard = copyBoard(board);

    for (let row = 0; row < 4; row++) {
      const filteredRow = newBoard[row].filter(val => val !== 0);
      const mergedRow: number[] = [];
      let i = filteredRow.length - 1;

      while (i >= 0) {
        if (i > 0 && filteredRow[i] === filteredRow[i - 1]) {
          const mergedValue = filteredRow[i] * 2;
          mergedRow.unshift(mergedValue);
          scoreGained += mergedValue;
          i -= 2;
        } else {
          mergedRow.unshift(filteredRow[i]);
          i--;
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.unshift(0);
      }

      if (mergedRow.toString() !== newBoard[row].toString()) {
        moved = true;
      }
      newBoard[row] = mergedRow;
    }

    return { newBoard, scoreGained, moved };
  };

  // 移动逻辑 - 上移
  const moveUp = (board: number[][]): { newBoard: number[][]; scoreGained: number; moved: boolean } => {
    let scoreGained = 0;
    let moved = false;
    const newBoard = copyBoard(board);

    for (let col = 0; col < 4; col++) {
      const column = [];
      for (let row = 0; row < 4; row++) {
        if (newBoard[row][col] !== 0) {
          column.push(newBoard[row][col]);
        }
      }

      const mergedColumn: number[] = [];
      let i = 0;

      while (i < column.length) {
        if (i < column.length - 1 && column[i] === column[i + 1]) {
          const mergedValue = column[i] * 2;
          mergedColumn.push(mergedValue);
          scoreGained += mergedValue;
          i += 2;
        } else {
          mergedColumn.push(column[i]);
          i++;
        }
      }

      while (mergedColumn.length < 4) {
        mergedColumn.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (newBoard[row][col] !== mergedColumn[row]) {
          moved = true;
        }
        newBoard[row][col] = mergedColumn[row];
      }
    }

    return { newBoard, scoreGained, moved };
  };

  // 移动逻辑 - 下移
  const moveDown = (board: number[][]): { newBoard: number[][]; scoreGained: number; moved: boolean } => {
    let scoreGained = 0;
    let moved = false;
    const newBoard = copyBoard(board);

    for (let col = 0; col < 4; col++) {
      const column = [];
      for (let row = 0; row < 4; row++) {
        if (newBoard[row][col] !== 0) {
          column.push(newBoard[row][col]);
        }
      }

      const mergedColumn: number[] = [];
      let i = column.length - 1;

      while (i >= 0) {
        if (i > 0 && column[i] === column[i - 1]) {
          const mergedValue = column[i] * 2;
          mergedColumn.unshift(mergedValue);
          scoreGained += mergedValue;
          i -= 2;
        } else {
          mergedColumn.unshift(column[i]);
          i--;
        }
      }

      while (mergedColumn.length < 4) {
        mergedColumn.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        if (newBoard[row][col] !== mergedColumn[row]) {
          moved = true;
        }
        newBoard[row][col] = mergedColumn[row];
      }
    }

    return { newBoard, scoreGained, moved };
  };

  // 检查游戏是否结束
  const checkGameOver = (currentBoard: number[][]) => {
    // 检查是否有空格
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) return false;
      }
    }

    // 检查是否可以合并
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = currentBoard[row][col];
        if (
          (col < 3 && current === currentBoard[row][col + 1]) ||
          (row < 3 && current === currentBoard[row + 1][col])
        ) {
          return false;
        }
      }
    }

    return true;
  };

  // 检查是否获胜
  const checkWin = (currentBoard: number[][]) => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 2048) return true;
      }
    }
    return false;
  };

  // 执行移动
  const performMove = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    // 保存当前状态用于撤销
    setPreviousState({
      board: copyBoard(board),
      score: score
    });

    let result;
    switch (direction) {
      case 'left':
        result = moveLeft(board);
        break;
      case 'right':
        result = moveRight(board);
        break;
      case 'up':
        result = moveUp(board);
        break;
      case 'down':
        result = moveDown(board);
        break;
    }

    const { newBoard, scoreGained, moved } = result;

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(prev => prev + scoreGained);
      setCanUndo(true);

      if (checkWin(newBoard) && !gameWon) {
        setGameWon(true);
      }

      if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  // 撤销操作
  const undoMove = () => {
    if (previousState && canUndo) {
      setBoard(previousState.board);
      setScore(previousState.score);
      setCanUndo(false);
      setPreviousState(null);
      setGameOver(false);
    }
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          performMove('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          performMove('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          performMove('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          performMove('down');
          break;
        case 'u':
        case 'U':
          e.preventDefault();
          undoMove();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [board, score, gameOver, previousState, canUndo, gameWon]);

  // 触摸事件处理
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    const isUpSwipe = distanceY > minSwipeDistance;
    const isDownSwipe = distanceY < -minSwipeDistance;

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) performMove('left');
      if (isRightSwipe) performMove('right');
    } else {
      if (isUpSwipe) performMove('up');
      if (isDownSwipe) performMove('down');
    }
  };

  // 获取方块颜色
  const getTileColor = (value: number): { bg: string; color: string } => {
    const colors: { [key: number]: { bg: string; color: string } } = {
      2: { bg: '#eee4da', color: '#776e65' },
      4: { bg: '#ede0c8', color: '#776e65' },
      8: { bg: '#f2b179', color: '#f9f6f2' },
      16: { bg: '#f59563', color: '#f9f6f2' },
      32: { bg: '#f67c5f', color: '#f9f6f2' },
      64: { bg: '#f65e3b', color: '#f9f6f2' },
      128: { bg: '#edcf72', color: '#f9f6f2' },
      256: { bg: '#edcc61', color: '#f9f6f2' },
      512: { bg: '#edc850', color: '#f9f6f2' },
      1024: { bg: '#edc53f', color: '#f9f6f2' },
      2048: { bg: '#edc22e', color: '#f9f6f2' }
    };
    return colors[value] || { bg: '#3c3a32', color: '#f9f6f2' };
  };

  // 初始化游戏
  useEffect(() => {
    initGame();
  }, [initGame]);

  return (
    
      
      
      {/* 游戏标题和分数 */}
      
        
          2048
        
        
        
          
            SCORE
            
              {score.toLocaleString()}
            
          
          
          
            BEST
            
              {bestScore.toLocaleString()}
            
          
        
      

      {/* 游戏网格 */}
      
        {board.flat().map((value, index) => {
          const { bg, color } = getTileColor(value);
          return (
             100 ? '20px' : value > 10 ? '24px' : '28px',
                fontWeight: 'bold',
                color: color,
                transition: 'all 0.15s ease-in-out',
                aspectRatio: '1',
                position: 'relative'
              }}
            >
              {value || ''}
            
          );
        })}
      

      {/* 控制按钮 */}
      
        
          新游戏
        
        
        
          撤销 (U)
        
      

      {/* NFT 铸造区域 */}
      {score >= 128 && (
        
          
            🎉 恭喜达成 {score >= 2048 ? '2048' : '128'} 分！
          
          
          {!isConnected ? (
            
              请连接钱包以铸造 NFT
            
          ) : (
            
          )}
        
      )}

      {/* 游戏说明 */}
      
        🎯 目标: 合并相同数字达到 2048
        ⌨️ 操作: 方向键移动，U键撤销
        📱 手机: 滑动屏幕控制
        🎁 奖励: 达到 128 分可铸造 NFT
      

      {/* 游戏结束/获胜弹窗 */}
      {(gameOver || gameWon) && (
        
          
            
              {gameWon ? '🎉 恭喜获胜！' : '😢 游戏结束'}
            
            
            
              最终得分: {score.toLocaleString()}
              {score > bestScore && 🏆 新纪录！}
            
            
            
              再玩一次
            
          
        
      )}
    
  );
}
