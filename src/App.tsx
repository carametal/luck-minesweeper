import { useEffect, useState } from 'react'
import './App.css'

interface CellState {
  opened: boolean
  flagged: boolean
}

const LEVELS = [
  { width: 2, height: 1 },
  { width: 2, height: 2 },
  { width: 3, height: 3 },
  { width: 4, height: 4 },
  { width: 5, height: 5 },
]

function App() {
  const isTest = new URLSearchParams(window.location.search).get('test') === 'true'
  const [started, setStarted] = useState(false)
  const [level, setLevel] = useState(0)
  const [board, setBoard] = useState<CellState[][]>([])
  const [safePos, setSafePos] = useState<[number, number]>([0, 0])
  const [state, setState] = useState<'playing' | 'won' | 'lost'>('playing')

  const { width, height } = LEVELS[level]

  const initBoard = (lvl: number) => {
    const { width: w, height: h } = LEVELS[lvl]
    const newBoard = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => ({ opened: false, flagged: false })),
    )
    setBoard(newBoard)
    setState('playing')
    setSafePos([
      Math.floor(Math.random() * w),
      Math.floor(Math.random() * h),
    ])
  }

  useEffect(() => {
    if (started) {
      initBoard(level)
    }
  }, [level, started])

  const reset = () => initBoard(level)

  const nextLevel = () => setLevel((prev) => (prev + 1) % LEVELS.length)

  const countAdjacent = (x: number, y: number) => {
    let count = 0
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) count++
      }
    }
    return count
  }

  const open = (x: number, y: number) => {
    if (state !== 'playing') return
    const newBoard = board.map((row) => row.map((c) => ({ ...c })))
    const cell = newBoard[y][x]
    if (cell.opened || cell.flagged) return
    cell.opened = true
    const targetSafe: [number, number] = isTest ? [x, y] : safePos

    if (x === targetSafe[0] && y === targetSafe[1]) {
      if (isTest) setSafePos(targetSafe)
      setState('won')
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          if (!(i === targetSafe[0] && j === targetSafe[1])) {
            newBoard[j][i].opened = true
          }
        }
      }
    } else {
      setState('lost')
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          if (!(i === targetSafe[0] && j === targetSafe[1])) {
            newBoard[j][i].opened = true
          }
        }
      }
    }
    setBoard(newBoard)
  }

  const toggleFlag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    x: number,
    y: number,
  ) => {
    e.preventDefault()
    if (state !== 'playing') return
    const newBoard = board.map((row) => row.map((c) => ({ ...c })))
    const cell = newBoard[y][x]
    if (cell.opened) return
    cell.flagged = !cell.flagged
    setBoard(newBoard)
  }

  if (!started) {
    return (
      <div className="game intro">
        <p className="intro-text">各レベルで安全なマスが1つだけあります。</p>
        <p className="intro-text">爆弾を避けてそのマスを見つけましょう。</p>
        <button onClick={() => setStarted(true)}>スタート</button>
      </div>
    )
  }

  return (
    <div className="game">
      <p className="level-info">
        レベル {level + 1}
        {level === LEVELS.length - 1 && '（最終ステージ）'}
      </p>
      <div className="board-wrapper">
        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${width}, 40px)` }}
        >
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`cell${cell.opened ? ' opened' : ''}`}
                onClick={() => open(x, y)}
                onContextMenu={(e) => toggleFlag(e, x, y)}
              >
                {cell.opened
                  ? x === safePos[0] && y === safePos[1]
                    ? countAdjacent(x, y) || ''
                    : '💣'
                  : cell.flagged
                  ? '⚑'
                  : ''}
              </div>
            )),
          )}
        </div>
        {state === 'won' && level === LEVELS.length - 1 && (
          <p className="clear-message overlay">
            全レベル
            <br />
            クリア
          </p>
        )}
      </div>
      <div className="buttons">
        {state === 'lost' && <button onClick={reset}>リセット</button>}
        {state === 'won' &&
          (level === LEVELS.length - 1 ? (
            <button className="play-again" onClick={nextLevel}>
              もう一度遊ぶ!!
            </button>
          ) : (
            <button onClick={nextLevel}>次のレベル</button>
          ))}
      </div>
      {state === 'won' && level !== LEVELS.length - 1 && (
        <p className="clear-message">レベル {level + 1} クリア！</p>
      )}
      {state === 'lost' && <p className="game-over">ゲームオーバー</p>}
    </div>
  )
}

export default App
