'use client'

/**
 * Ziqi Tetris - 紫琪玩方块
 * 简化版主游戏组件 - 用于调试
 */

import { useEffect, useState } from 'react'
import {
  createNewGame,
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
import type { TetrisGame as TetrisGameType } from '@/lib/types'
import { INITIAL_SPEED } from '@/lib/types'

export function TetrisGameSimple() {
  const [game, setGame] = useState<TetrisGameType | null>(null)
  const [dropSpeed, setDropSpeed] = useState<number>(INITIAL_SPEED)
  const [lineClearing, setLineClearing] = useState<number[]>([])

  // 客户端初始化
  useEffect(() => {
    console.log('=== 开始初始化游戏 ===')
    try {
      const newGame = createNewGame(0)
      console.log('游戏创建成功:', newGame)
      setGame(newGame)
    } catch (error) {
      console.error('游戏创建失败:', error)
    }
  }, [])

  // 游戏控制
  const handleStart = () => {
    if (game) {
      setGame(startGame(game))
    }
  }

  const handleRestart = () => {
    const newGame = restartGame()
    setGame(newGame)
    setLineClearing([])
  }

  // 游戏未初始化
  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-ziqi-accent text-2xl mb-4">紫琪玩方块</div>
          <div className="text-white text-lg">加载中...</div>
          <div className="text-ziqi-accent/70 text-sm mt-2">
            如果长时间停留，请刷新页面
          </div>
        </div>
      </div>
    )
  }

  const renderBoard = getRenderBoard(game)
  const ghostPosition = getGhostPiecePosition(game)

  return (
    <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center p-4">
      <div className="bg-ziqi-purple/50 backdrop-blur-sm border-2 border-ziqi-accent/50 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-ziqi-accent text-center mb-6">
          紫琪玩方块
        </h1>

        {/* 游戏板 */}
        <div className="bg-ziqi-dark/50 rounded-lg p-4 mb-6">
          <div
            className="grid gap-px"
            style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}
          >
            {renderBoard.map((row, y) =>
              row.map((cell, x) => {
                const isGhost =
                  ghostPosition && y === ghostPosition.y && x === ghostPosition.x

                return (
                  <div
                    key={`${y}-${x}`}
                    className={`aspect-square rounded-sm ${
                      cell
                        ? `${cell} shadow-lg`
                        : isGhost
                          ? 'bg-white/20'
                          : 'bg-ziqi-dark/30'
                    }`}
                  />
                )
              })
            )}
          </div>
        </div>

        {/* 游戏信息 */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-ziqi-dark/30 rounded-lg p-3">
            <div className="text-ziqi-accent text-sm mb-1">分数</div>
            <div className="text-white text-xl font-bold">
              {game.stats.score}
            </div>
          </div>
          <div className="bg-ziqi-dark/30 rounded-lg p-3">
            <div className="text-ziqi-accent text-sm mb-1">等级</div>
            <div className="text-white text-xl font-bold">
              {game.stats.level}
            </div>
          </div>
          <div className="bg-ziqi-dark/30 rounded-lg p-3">
            <div className="text-ziqi-accent text-sm mb-1">行数</div>
            <div className="text-white text-xl font-bold">
              {game.stats.lines}
            </div>
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
              onClick={() => setGame(game ? pauseGame(game) : game)}
              className="bg-ziqi-purple/70 hover:bg-ziqi-purple/90 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              暂停
            </button>
          )}

          {game.gameState === 'paused' && (
            <button
              onClick={() => setGame(game ? resumeGame(game) : game)}
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
          使用方向键控制 • 空格键硬降
        </div>
      </div>
    </div>
  )
}
