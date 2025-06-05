import React, { useState } from 'react';
import Board, { CellData, CellType } from './Board';
import './App.css';

const LEVELS = [
  { rows: 1, cols: 2 },
  { rows: 2, cols: 2 },
  { rows: 3, cols: 3 },
  { rows: 4, cols: 4 },
  { rows: 5, cols: 5 },
];

function generateBoard(level: number): CellData[][] {
  const { rows, cols } = LEVELS[level];
  const total = rows * cols;
  const safeIdx = Math.floor(Math.random() * total);
  const board: CellData[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const type: CellType = idx === safeIdx ? 'safe' : 'bomb';
      row.push({ state: 'closed', type, adjacentBombs: 0 });
    }
    board.push(row);
  }
  // Set adjacentBombs for safe cell
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].type === 'safe') {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].type === 'bomb') count++;
          }
        }
        board[r][c].adjacentBombs = count;
      }
    }
  }
  return board;
}

function App() {
  const [level, setLevel] = useState(0);
  const [board, setBoard] = useState(() => generateBoard(level));
  const [gameOver, setGameOver] = useState(false);
  const [cleared, setCleared] = useState(false);

  const reset = () => {
    setBoard(generateBoard(level));
    setGameOver(false);
    setCleared(false);
  };

  const nextLevel = () => {
    if (level < LEVELS.length - 1) {
      setLevel(l => l + 1);
      setBoard(generateBoard(level + 1));
      setGameOver(false);
      setCleared(false);
    }
  };

  const handleCellClick = (r: number, c: number) => {
    if (gameOver || cleared) return;
    const cell = board[r][c];
    if (cell.state !== 'closed') return;
    if (cell.type === 'bomb') {
      const newBoard = board.map(row => row.map(cell => cell));
      newBoard[r][c] = { ...cell, state: 'open' };
      setBoard(newBoard);
      setGameOver(true);
    } else {
      const newBoard = board.map(row => row.map(cell => cell));
      newBoard[r][c] = { ...cell, state: 'open' };
      setBoard(newBoard);
      setCleared(true);
    }
  };

  const handleCellRightClick = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || cleared) return;
    const cell = board[r][c];
    if (cell.state === 'open') return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].state = cell.state === 'flagged' ? 'closed' : 'flagged';
    setBoard(newBoard);
  };

  return (
    <div className="App">
      <h1>運試しマインスイーパー</h1>
      <div>レベル: {level + 1}</div>
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <button onClick={reset}>RESET</button>
        {cleared && level < LEVELS.length - 1 && (
          <button onClick={nextLevel} style={{ marginLeft: 8 }}>NEXT LEVEL</button>
        )}
        {cleared && level === LEVELS.length - 1 && <span>全クリア！</span>}
        {gameOver && <span style={{ color: 'red', marginLeft: 8 }}>ゲームオーバー</span>}
      </div>
      <Board
        board={board}
        onCellClick={handleCellClick}
        onCellRightClick={handleCellRightClick}
        gameOver={gameOver || cleared}
      />
    </div>
  );
}

export default App;
