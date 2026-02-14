'use client'

/**
 * Ziqi Tetris - 紫琪玩方块
 * 主游戏组件
 */

import { useEffect, useCallback, useRef, useState } from 'react'
import type { TetrisGame } from '@/lib/types'
import { INITIAL_SPEED } from '@/lib/types'
import {
  createNewGame,
  createInitialStats,
  getHighScore,
  startGame,
  pauseGame,
  resumeGame,
  restartGame,
  movePiece,
  rotatePiece,
  hardDrop,
  autoDrop,
  getRenderBoard,
  getGhostPiecePosition,
  getDropSpeed,
} from '@/lib/tetris'

// ============================================
// 组件
// ============================================

export function TetrisGame() {
  // 游戏状态 - 初始为 null，在客户端初始化
  const [game, setGame] = useState<TetrisGame | null>(null)
  const [lineClearing, setLineClearing] = useState<number[]>([])

  // 自动下落定时器
  const dropTimerRef = useRef<NodeJS.Timeout | null>(null)
  const dropSpeedRef = useRef<number>(INITIAL_SPEED)

  // ========================================
  // 客户端初始化
  // ========================================

  useEffect(() => {
    // 在客户端初始化游戏，从 localStorage 读取最高分
    const highScore = getHighScore()
    setGame(createNewGame(highScore))
  }, [])

  // ========================================
  // 自动下落逻辑
  // ========================================

  const startAutoDrop = useCallback(() => {
    if (dropTimerRef.current) {
      clearInterval(dropTimerRef.current)
    }

    dropTimerRef.current = setInterval(() => {
      setGame((prevGame) => {
        if (!prevGame || prevGame.gameState !== 'playing') {
          return prevGame
        }
        return autoDrop(prevGame)
      })
    }, dropSpeedRef.current)
  }, [])

  const stopAutoDrop = useCallback(() => {
    if (dropTimerRef.current) {
      clearInterval(dropTimerRef.current)
      dropTimerRef.current = null
    }
  }, [])

  // 更新下落速度
  useEffect(() => {
    if (game) {
      dropSpeedRef.current = getDropSpeed(game.stats.level)
    }
  }, [game?.stats.level])

  // 启动/停止自动下落
  useEffect(() => {
    if (!game || game.gameState !== 'playing') {
      stopAutoDrop()
      return
    }
    startAutoDrop()
    return () => stopAutoDrop()
  }, [game?.gameState, startAutoDrop, stopAutoDrop])

  // ========================================
  // 键盘控制
  // ========================================

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!game || game.gameState !== 'playing') {
        return
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setGame((g) => g ? movePiece(g, 'left') : g)
          break
        case 'ArrowRight':
          e.preventDefault()
          setGame((g) => g ? movePiece(g, 'right') : g)
          break
        case 'ArrowDown':
          e.preventDefault()
          setGame((g) => g ? movePiece(g, 'down') : g)
          break
        case 'ArrowUp':
          e.preventDefault()
          setGame((g) => g ? rotatePiece(g) : g)
          break
        case ' ':
          e.preventDefault()
          setGame((g) => g ? hardDrop(g) : g)
          break
      }
    },
    [game]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [game?.gameState, handleKeyPress])

  // ========================================
  // 游戏控制
  // ========================================

  const handleStart = () => {
    setGame((g) => (g.gameState === 'idle' ? startGame(g) : g))
  }

  const handlePause = () => {
    setGame(pauseGame)
  }

  const handleResume = () => {
    setGame(resumeGame)
  }

  const handleRestart = () => {
    setGame(restartGame())
    setLineClearing([])
  }

  // ========================================
  // 触摸控制（移动端）
  // ========================================

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || game.gameState !== 'playing') {
      return
    }

    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStart.x
    const dy = touch.clientY - touchStart.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    // 最小滑动距离
    const minSwipe = 30

    if (absDx < minSwipe && absDy < minSwipe) {
      // 点击：旋转
      setGame((g) => rotatePiece(g))
    } else if (absDx > absDy) {
      // 水平滑动
      if (dx > 0) {
        setGame((g) => movePiece(g, 'right'))
      } else {
        setGame((g) => movePiece(g, 'left'))
      }
    } else {
      // 垂直滑动
      if (dy > 0) {
        setGame((g) => hardDrop(g))
      }
    }

    setTouchStart(null)
  }

  // ========================================
  // 渲染
  // ========================================

  // 游戏未初始化时显示加载中
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center">
        <div className="text-ziqi-accent text-2xl font-display animate-pulse">加载中...</div>
      </div>
    )
  }

  const renderBoard = getRenderBoard(game)
  const ghostPosition = getGhostPiecePosition(game)

  return (
    <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center p-4 select-none">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-ziqi-accent/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-ziqi-pink/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </div>

      {/* 游戏主容器 */}
      <div
        className="relative z-10 flex flex-col lg:flex-row gap-6 items-center lg:items-start"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 左侧信息栏 */}
        <div className="flex flex-row lg:flex-col gap-4 order-2 lg:order-1">
          <InfoCard title="分数" value={game.stats.score.toLocaleString()} />
          <InfoCard title="等级" value={game.stats.level.toString()} />
          <InfoCard title="行数" value={game.stats.lines.toString()} />
          <InfoCard title="最高分" value={game.stats.highScore.toLocaleString()} />
        </div>

        {/* 游戏板 */}
        <div className="order-1 lg:order-2">
          <GameBoard
            board={renderBoard}
            ghostPosition={ghostPosition}
            lineClearing={lineClearing}
          />
        </div>

        {/* 右侧控制栏 */}
        <div className="flex flex-row lg:flex-col gap-4 order-3">
          {/* 下一个方块预览 */}
          <NextPiece piece={game.nextPiece} />

          {/* 游戏控制按钮 */}
          <GameControls
            gameState={game.gameState}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onRestart={handleRestart}
          />
        </div>
      </div>

      {/* 游戏结束覆盖层 */}
      {game.gameState === 'gameover' && (
        <GameOverOverlay stats={game.stats} onRestart={handleRestart} />
      )}
    </div>
  )
}

// ============================================
// 子组件
// ============================================

interface InfoCardProps {
  title: string
  value: string
}

function InfoCard({ title, value }: InfoCardProps) {
  return (
    <div className="bg-ziqi-purple/50 backdrop-blur-sm border border-ziqi-accent/30 rounded-lg px-6 py-4 text-center min-w-[120px]">
      <div className="text-ziqi-accent text-sm font-display tracking-wider mb-1">
        {title}
      </div>
      <div className="text-white text-2xl font-display font-bold">{value}</div>
    </div>
  )
}

interface GameBoardProps {
  board: typeof import('@/lib/types').Board extends Array<infer T> ? T[][] : never
  ghostPosition: { x: number; y: number } | null
  lineClearing: number[]
}

function GameBoard({ board, ghostPosition, lineClearing }: GameBoardProps) {
  return (
    <div className="relative bg-ziqi-purple/30 backdrop-blur-sm border-2 border-ziqi-accent/50 rounded-xl p-2 shadow-2xl">
      {/* 标题 */}
      <div className="text-center mb-2">
        <h1 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-ziqi-accent via-ziqi-pink to-ziqi-cyan">
          紫琪玩方块
        </h1>
      </div>

      {/* 游戏网格 */}
      <div className="relative">
        <div className="grid gap-px bg-ziqi-accent/20" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
          {board.map((row, y) =>
            row.map((cell, x) => {
              const isGhost = ghostPosition && y === ghostPosition.y && x === ghostPosition.x
              const isClearing = lineClearing.includes(y)

              return (
                <div
                  key={`${y}-${x}`}
                  className={`aspect-square rounded-sm transition-all duration-75 ${
                    cell
                      ? `${cell} ${cell === 'bg-ziqi-cyan' ? 'shadow-cyan-400/50' : cell === 'bg-ziqi-yellow' ? 'shadow-yellow-400/50' : cell === 'bg-ziqi-accent' ? 'shadow-purple-400/50' : cell === 'bg-ziqi-green' ? 'shadow-green-400/50' : cell === 'bg-ziqi-pink' ? 'shadow-pink-400/50' : cell === 'bg-blue-500' ? 'shadow-blue-400/50' : 'shadow-orange-400/50'} shadow-lg`
                      : isGhost
                        ? 'bg-white/10'
                        : 'bg-ziqi-dark/30'
                  } ${isClearing ? 'animate-line-clear' : ''}`}
                />
              )
            })
          )}
        </div>
      </div>

      {/* 移动端提示 */}
      <div className="lg:hidden mt-4 text-center text-ziqi-accent/70 text-sm">
        滑动移动 • 点击旋转 • 下滑硬降
      </div>

      {/* 桌面端提示 */}
      <div className="hidden lg:block mt-4 text-center text-ziqi-accent/70 text-sm">
        方向键移动 • 上键旋转 • 空格硬降
      </div>
    </div>
  )
}

interface NextPieceProps {
  piece: typeof import('@/lib/types').Tetromino | null
}

function NextPiece({ piece }: NextPieceProps) {
  return (
    <div className="bg-ziqi-purple/50 backdrop-blur-sm border border-ziqi-accent/30 rounded-lg p-4 min-w-[120px]">
      <div className="text-ziqi-accent text-sm font-display tracking-wider mb-3 text-center">
        下一个
      </div>
      <div className="bg-ziqi-dark/30 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
        {piece && (
          <div className="grid gap-px" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {Array.from({ length: 16 }).map((_, i) => {
              const x = i % 4
              const y = Math.floor(i / 4)
              const isPartOfPiece = piece.shape.some(([dx, dy]) => dx + 1 === x && dy + 1 === y)

              return (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-sm ${
                    isPartOfPiece
                      ? `${piece.color} shadow-lg`
                      : 'bg-transparent'
                  }`}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

interface GameControlsProps {
  gameState: 'idle' | 'playing' | 'paused' | 'gameover'
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onRestart: () => void
}

function GameControls({ gameState, onStart, onPause, onResume, onRestart }: GameControlsProps) {
  return (
    <div className="flex flex-col gap-2 min-w-[120px]">
      {gameState === 'idle' && (
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-ziqi-accent to-ziqi-pink hover:from-ziqi-accent/80 hover:to-ziqi-pink/80 text-white font-display font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
        >
          开始游戏
        </button>
      )}

      {gameState === 'playing' && (
        <button
          onClick={onPause}
          className="bg-ziqi-purple/70 hover:bg-ziqi-purple/90 text-white font-display font-bold py-3 px-6 rounded-lg transition-all border border-ziqi-accent/50"
        >
          暂停
        </button>
      )}

      {gameState === 'paused' && (
        <>
          <button
            onClick={onResume}
            className="bg-gradient-to-r from-ziqi-cyan to-blue-500 hover:from-ziqi-cyan/80 hover:to-blue-500/80 text-white font-display font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            继续
          </button>
        </>
      )}

      <button
        onClick={onRestart}
        className="bg-ziqi-dark/50 hover:bg-ziqi-dark/70 text-ziqi-accent font-display font-bold py-3 px-6 rounded-lg transition-all border border-ziqi-accent/30"
      >
        重新开始
      </button>
    </div>
  )
}

interface GameOverOverlayProps {
  stats: typeof import('@/lib/types').GameStats
  onRestart: () => void
}

function GameOverOverlay({ stats, onRestart }: GameOverOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-ziqi-purple to-ziqi-dark border-2 border-ziqi-accent/50 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl shadow-purple-500/30">
        <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-ziqi-pink to-ziqi-accent mb-6">
          游戏结束
        </h2>

        <div className="space-y-4 mb-8">
          <div className="bg-ziqi-dark/30 rounded-lg p-4">
            <div className="text-ziqi-accent text-sm font-display tracking-wider mb-1">
              最终分数
            </div>
            <div className="text-white text-3xl font-display font-bold">
              {stats.score.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-ziqi-dark/30 rounded-lg p-3">
              <div className="text-ziqi-accent/70 text-xs mb-1">等级</div>
              <div className="text-white text-xl font-display">{stats.level}</div>
            </div>
            <div className="bg-ziqi-dark/30 rounded-lg p-3">
              <div className="text-ziqi-accent/70 text-xs mb-1">行数</div>
              <div className="text-white text-xl font-display">{stats.lines}</div>
            </div>
          </div>

          {stats.score === stats.highScore && (
            <div className="bg-gradient-to-r from-ziqi-pink/20 to-ziqi-accent/20 border border-ziqi-pink/30 rounded-lg p-3">
              <div className="text-ziqi-pink font-display">🎉 新纪录！</div>
            </div>
          )}
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-gradient-to-r from-ziqi-accent to-ziqi-pink hover:from-ziqi-accent/80 hover:to-ziqi-pink/80 text-white font-display font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
        >
          再来一局
        </button>
      </div>
    </div>
  )
}
