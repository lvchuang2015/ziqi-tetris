'use client'

/**
 * Ziqi Tetris - 紫琪玩方块
 * 修复版主游戏组件
 */

import { useEffect, useState, useCallback, useRef } from 'react'

// ============================================
// 类型定义（内联，避免导入问题）
// ============================================

type Cell = string | null
type Board = Cell[][]
type Position = { x: number; y: number }
type Shape = readonly (readonly [number, number])[]

interface Tetromino {
  type: string
  shape: Shape
  color: string
}

interface ActivePiece {
  tetromino: Tetromino
  position: Position
}

interface GameStats {
  score: number
  level: number
  lines: number
  highScore: number
}

interface TetrisGame {
  board: Board
  activePiece: ActivePiece | null
  nextPiece: Tetromino | null
  gameState: 'idle' | 'playing' | 'paused' | 'gameover'
  stats: GameStats
}

// ============================================
// 方块定义
// ============================================

const TETROMINOES: Record<string, Tetromino> = {
  I: { type: 'I', shape: [[0, -1], [0, 0], [0, 1], [0, 2]] as const, color: 'bg-ziqi-cyan' },
  O: { type: 'O', shape: [[0, 0], [0, 1], [1, 0], [1, 1]] as const, color: 'bg-ziqi-yellow' },
  T: { type: 'T', shape: [[0, 0], [-1, 0], [1, 0], [0, -1]] as const, color: 'bg-ziqi-accent' },
  S: { type: 'S', shape: [[0, 0], [1, 0], [0, 1], [-1, 1]] as const, color: 'bg-ziqi-green' },
  Z: { type: 'Z', shape: [[0, 0], [-1, 0], [0, 1], [1, 1]] as const, color: 'bg-ziqi-pink' },
  J: { type: 'J', shape: [[0, 0], [-1, 0], [1, 0], [-1, -1]] as const, color: 'bg-blue-500' },
  L: { type: 'L', shape: [[0, 0], [-1, 0], [1, 0], [1, -1]] as const, color: 'bg-orange-500' },
}

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20

// ============================================
// 游戏函数（内联实现）
// ============================================

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null))
}

function getRandomTetromino(): Tetromino {
  const types = Object.keys(TETROMINOES)
  const randomType = types[Math.floor(Math.random() * types.length)]
  return TETROMINOES[randomType]
}

function createNewGame(): TetrisGame {
  const firstPiece = getRandomTetromino()
  return {
    board: createEmptyBoard(),
    activePiece: {
      tetromino: firstPiece,
      position: { x: Math.floor(BOARD_WIDTH / 2), y: 0 }
    },
    nextPiece: getRandomTetromino(),
    gameState: 'idle',
    stats: { score: 0, level: 1, lines: 0, highScore: 0 }
  }
}

function getRenderBoard(game: TetrisGame): Board {
  const renderBoard = game.board.map(row => [...row]) as Board

  if (game.activePiece) {
    const { tetromino, position } = game.activePiece
    for (const [dx, dy] of tetromino.shape) {
      const x = position.x + dx
      const y = position.y + dy
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        renderBoard[y][x] = tetromino.color
      }
    }
  }

  return renderBoard
}

// ============================================
// 游戏组件
// ============================================

export function TetrisGameFixed() {
  const [game, setGame] = useState<TetrisGame | null>(null)
  const [mounted, setMounted] = useState(false)

  // 客户端挂载检测
  useEffect(() => {
    setMounted(true)
  }, [])

  // 初始化游戏
  useEffect(() => {
    if (!mounted) return

    console.log('=== 开始初始化游戏 ===')
    try {
      const newGame = createNewGame()
      console.log('游戏创建成功:', newGame)
      setGame(newGame)
    } catch (error) {
      console.error('游戏创建失败:', error)
    }
  }, [mounted])

  // 游戏控制
  const handleStart = () => {
    if (game) {
      setGame({ ...game, gameState: 'playing' })
    }
  }

  const handleRestart = () => {
    const newGame = createNewGame()
    setGame(newGame)
  }

  // 服务端渲染时显示加载
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center">
        <div className="text-ziqi-accent text-2xl">紫琪玩方块 - 加载中...</div>
      </div>
    )
  }

  // 游戏未初始化
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-ziqi-accent text-2xl mb-4">紫琪玩方块</div>
          <div className="text-white text-lg mb-4">游戏初始化中...</div>
          <button
            onClick={() => {
              const newGame = createNewGame()
              setGame(newGame)
            }}
            className="px-6 py-3 bg-ziqi-accent hover:bg-ziqi-accent/80 text-white font-bold rounded-lg"
          >
            点击初始化
          </button>
        </div>
      </div>
    )
  }

  const renderBoard = getRenderBoard(game)

  return (
    <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center p-4">
      <div className="bg-ziqi-purple/50 backdrop-blur-sm border-2 border-ziqi-accent/50 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-ziqi-accent text-center mb-6">
          紫琪玩方块
        </h1>

        {/* 游戏板 */}
        <div className="bg-ziqi-dark/50 rounded-lg p-4 mb-6">
          <div
            className="grid gap-px bg-ziqi-accent/20"
            style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}
          >
            {renderBoard.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`aspect-square rounded-sm ${
                    cell ? `${cell} shadow-lg` : 'bg-ziqi-dark/30'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        {/* 游戏信息 */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-ziqi-dark/30 rounded-lg p-3">
            <div className="text-ziqi-accent text-sm mb-1">分数</div>
            <div className="text-white text-xl font-bold">{game.stats.score}</div>
          </div>
          <div className="bg-ziqi-dark/30 rounded-lg p-3">
            <div className="text-ziqi-accent text-sm mb-1">等级</div>
            <div className="text-white text-xl font-bold">{game.stats.level}</div>
          </div>
          <div className="bg-ziqi-dark/30 rounded-lg p-3">
            <div className="text-ziqi-accent text-sm mb-1">行数</div>
            <div className="text-white text-xl font-bold">{game.stats.lines}</div>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex flex-col gap-2">
          {game.gameState === 'idle' && (
            <button
              onClick={handleStart}
              className="bg-gradient-to-r from-ziqi-accent to-ziqi-pink hover:from-ziqi-accent/80 hover:to-ziqi-pink/80 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              开始游戏
            </button>
          )}

          {game.gameState === 'playing' && (
            <button
              onClick={() => setGame({ ...game, gameState: 'paused' })}
              className="bg-ziqi-purple/70 hover:bg-ziqi-purple/90 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              暂停
            </button>
          )}

          {game.gameState === 'paused' && (
            <button
              onClick={() => setGame({ ...game, gameState: 'playing' })}
              className="bg-gradient-to-r from-ziqi-cyan to-blue-500 hover:from-ziqi-cyan/80 hover:to-blue-500/80 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              继续
            </button>
          )}

          <button
            onClick={handleRestart}
            className="bg-ziqi-dark/50 hover:bg-ziqi-dark/70 text-ziqi-accent font-bold py-3 px-6 rounded-lg transition-all"
          >
            重新开始
          </button>
        </div>

        {/* 移动端提示 */}
        <div className="mt-4 text-center text-ziqi-accent/70 text-sm">
          点击开始游戏 → 使用方向键控制
        </div>
      </div>
    </div>
  )
}
