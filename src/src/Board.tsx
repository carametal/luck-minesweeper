import React from 'react';

export type CellState = 'closed' | 'flagged' | 'open';
export type CellType = 'safe' | 'bomb';

export interface CellData {
  state: CellState;
  type: CellType;
  adjacentBombs: number;
}

interface BoardProps {
  board: CellData[][];
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number, e: React.MouseEvent) => void;
  gameOver: boolean;
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, onCellRightClick, gameOver }) => {
  const size = board.length;
  return (
    <div
      className="board"
      style={{
        display: 'grid',
        gridTemplateRows: `repeat(${size}, 1fr)`,
        gridTemplateColumns: `repeat(${board[0]?.length || 0}, 1fr)`,
        gap: 4,
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      {board.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          let display = '□';
          if (cell.state === 'flagged') display = '⚑';
          else if (cell.state === 'open') {
            if (cell.type === 'bomb') display = '💣';
            else display = cell.adjacentBombs === 0 ? '' : String(cell.adjacentBombs);
          }
          return (
            <button
              key={`${rIdx}-${cIdx}`}
              className="cell"
              style={{
                aspectRatio: '1',
                fontSize: 24,
                width: '100%',
                background: cell.state === 'open' ? '#eee' : '#fff',
                border: '1px solid #888',
                cursor: gameOver || cell.state === 'open' ? 'default' : 'pointer',
              }}
              onClick={() => !gameOver && cell.state === 'closed' && onCellClick(rIdx, cIdx)}
              onContextMenu={e => {
                e.preventDefault();
                if (!gameOver && cell.state !== 'open') onCellRightClick(rIdx, cIdx, e);
              }}
              disabled={gameOver || cell.state === 'open'}
            >
              {display}
            </button>
          );
        })
      )}
    </div>
  );
};

export default Board;
