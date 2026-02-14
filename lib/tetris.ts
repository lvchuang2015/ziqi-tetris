/**
 * Ziqi Tetris - 紫琪玩方块
 * 游戏核心逻辑
 */

import type {
  Board,
  Cell,
  Position,
  ActivePiece,
  Tetromino,
  TetrisGame,
  GameState,
  GameStats,
  TetrominoType,
} from './types'
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  getRandomTetromino,
  POINTS_PER_LINE,
  LEVEL_LINES,
  INITIAL_SPEED,
  MIN_SPEED,
  SPEED_DECREASE,
} from './types'

// ============ 初始化 ============

/**
 * 创建空游戏板
 */
export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(null)
  )
}

/**
 * 创建初始游戏统计
 * @param highScore 可选的最高分参数（用于避免服务端渲染时访问 localStorage）
 */
export function createInitialStats(highScore: number = 0): GameStats {
  return {
    score: 0,
    level: 1,
    lines: 0,
    highScore,
  }
}

/**
 * 从 localStorage 获取最高分
 */
export function getHighScore(): number {
  if (typeof window === 'undefined') {
    return 0
  }
  try {
    return parseInt(localStorage.getItem('ziqi-highscore') || '0', 10)
  } catch {
    return 0
  }
}

/**
 * 保存最高分到 localStorage
 */
export function saveHighScore(score: number): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    localStorage.setItem('ziqi-highscore', score.toString())
  } catch {
    // 忽略存储错误
  }
}

/**
 * 创建新游戏
 */
export function createNewGame(highScore?: number): TetrisGame {
  const firstPiece = getRandomTetromino()
  return {
    board: createEmptyBoard(),
    activePiece: createActivePiece(firstPiece),
    nextPiece: getRandomTetromino(),
    gameState: 'idle',
    stats: createInitialStats(highScore),
  }
}

/**
 * 创建活动方块
 */
function createActivePiece(tetromino: Tetromino): ActivePiece {
  // 将方块放置在顶部中央
  const position: Position = {
    x: Math.floor(BOARD_WIDTH / 2),
    y: 0,
  }
  return { tetromino, position }
}

// ============ 碰撞检测 ============

/**
 * 检查位置是否有效
 */
function isValidPosition(
  board: Board,
  piece: ActivePiece,
  offset: Position = { x: 0, y: 0 }
): boolean {
  const { tetromino, position } = piece
  const { shape } = tetromino

  for (const [dx, dy] of shape) {
    const newX = position.x + dx + offset.x
    const newY = position.y + dy + offset.y

    // 边界检查
    if (newX < 0 || newX >= BOARD_WIDTH) {
      return false
    }
    if (newY >= BOARD_HEIGHT) {
      return false
    }
    // 顶部以上允许（方块刚生成时）
    if (newY < 0) {
      continue
    }

    // 碰撞检查
    if (board[newY][newX] !== null) {
      return false
    }
  }

  return true
}

/**
 * 检查游戏是否结束
 */
export function isGameOver(board: Board): boolean {
  // 顶部两行有方块则游戏结束
  for (let y = 0; y < 2; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      if (board[y][x] !== null) {
        return true
      }
    }
  }
  return false
}

// ============ 方块操作 ============

/**
 * 移动方块
 */
export function movePiece(
  game: TetrisGame,
  direction: 'left' | 'right' | 'down'
): TetrisGame {
  if (!game.activePiece || game.gameState !== 'playing') {
    return game
  }

  const offset =
    direction === 'left' ? { x: -1, y: 0 } :
    direction === 'right' ? { x: 1, y: 0 } :
    { x: 0, y: 1 }

  if (isValidPosition(game.board, game.activePiece, offset)) {
    return {
      ...game,
      activePiece: {
        ...game.activePiece,
        position: {
          x: game.activePiece.position.x + offset.x,
          y: game.activePiece.position.y + offset.y,
        },
      },
    }
  }

  // 向下移动失败则锁定方块
  if (direction === 'down') {
    return lockPiece(game)
  }

  return game
}

/**
 * 旋转方块
 */
export function rotatePiece(game: TetrisGame): TetrisGame {
  if (!game.activePiece || game.gameState !== 'playing') {
    return game
  }

  const { tetromino } = game.activePiece

  // 旋转：顺时针90度
  const rotatedShape = tetromino.shape.map(([x, y]) => [-y, x]) as readonly (
    readonly [number, number]
  )[]

  const rotatedPiece: ActivePiece = {
    ...game.activePiece,
    tetromino: {
      ...tetromino,
      shape: rotatedShape,
    },
  }

  // 检查旋转是否有效，包括墙踢
  const kicks: Position[] = [
    { x: 0, y: 0 }, // 原位置
    { x: -1, y: 0 }, // 左移
    { x: 1, y: 0 }, // 右移
    { x: 0, y: -1 }, // 上移
    { x: -2, y: 0 }, // 左移2格
    { x: 2, y: 0 }, // 右移2格
  ]

  for (const kick of kicks) {
    if (isValidPosition(game.board, rotatedPiece, kick)) {
      return {
        ...game,
        activePiece: {
          ...rotatedPiece,
          position: {
            x: rotatedPiece.position.x + kick.x,
            y: rotatedPiece.position.y + kick.y,
          },
        },
      }
    }
  }

  return game
}

/**
 * 硬降落（直接落地）
 */
export function hardDrop(game: TetrisGame): TetrisGame {
  if (!game.activePiece || game.gameState !== 'playing') {
    return game
  }

  let newY = game.activePiece.position.y
  while (
    isValidPosition(game.board, {
      ...game.activePiece,
      position: { x: game.activePiece.position.x, y: newY + 1 },
    })
  ) {
    newY++
  }

  // 计算奖励分数：每格2分
  const dropDistance = newY - game.activePiece.position.y
  const bonusScore = dropDistance * 2

  return {
    ...lockPiece({
      ...game,
      activePiece: {
        ...game.activePiece,
        position: { x: game.activePiece.position.x, y: newY },
      },
    }),
    stats: {
      ...game.stats,
      score: game.stats.score + bonusScore,
    },
  }
}

// ============ 锁定和消行 ============

/**
 * 锁定方块到游戏板
 */
function lockPiece(game: TetrisGame): TetrisGame {
  if (!game.activePiece) {
    return game
  }

  const { tetromino, position } = game.activePiece
  const newBoard = game.board.map((row, y) =>
    row.map((cell, x) => {
      // 检查当前位置是否是方块的一部分
      const isPartOfPiece = tetromino.shape.some(
        ([dx, dy]) => position.x + dx === x && position.y + dy === y
      )
      if (isPartOfPiece) {
        return tetromino.color
      }
      return cell
    })
  ) as Board

  // 消除完整行
  const { clearedBoard, clearedLines } = clearLines(newBoard)

  // 计算新分数和等级
  const lineScore = POINTS_PER_LINE[clearedLines] * game.stats.level
  const newStats = updateStats(game.stats, clearedLines, lineScore)

  // 生成新方块
  const newPiece = game.nextPiece || getRandomTetromino()
  const newActivePiece = createActivePiece(newPiece)

  const newGame: TetrisGame = {
    board: clearedBoard,
    activePiece: newActivePiece,
    nextPiece: getRandomTetromino(),
    gameState: 'playing',
    stats: newStats,
  }

  // 检查游戏是否结束
  if (isGameOver(clearedBoard)) {
    return { ...newGame, gameState: 'gameover' }
  }

  return newGame
}

/**
 * 消除完整行
 */
function clearLines(board: Board): { clearedBoard: Board; clearedLines: number } {
  const nonEmptyRows: Cell[][] = []
  let clearedCount = 0

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    const row = board[y]
    const isComplete = row.every((cell) => cell !== null)

    if (isComplete) {
      clearedCount++
    } else {
      nonEmptyRows.push(row)
    }
  }

  // 在顶部添加空行
  const newBoard = createEmptyBoard()
  const emptyRowsCount = BOARD_HEIGHT - nonEmptyRows.length
  for (let i = 0; i < nonEmptyRows.length; i++) {
    newBoard[emptyRowsCount + i] = nonEmptyRows[i]
  }

  return { clearedBoard: newBoard, clearedLines: clearedCount }
}

/**
 * 更新游戏统计
 */
function updateStats(
  stats: GameStats,
  clearedLines: number,
  lineScore: number
): GameStats {
  const totalLines = stats.lines + clearedLines
  const newLevel = Math.floor(totalLines / LEVEL_LINES) + 1

  const newStats: GameStats = {
    score: stats.score + lineScore,
    level: newLevel,
    lines: totalLines,
    highScore: stats.highScore,
  }

  // 更新最高分
  if (newStats.score > newStats.highScore) {
    newStats.highScore = newStats.score
    saveHighScore(newStats.highScore)
  }

  return newStats
}

// ============ 游戏控制 ============

/**
 * 开始游戏
 */
export function startGame(game: TetrisGame): TetrisGame {
  return {
    ...game,
    gameState: 'playing',
  }
}

/**
 * 暂停游戏
 */
export function pauseGame(game: TetrisGame): TetrisGame {
  if (game.gameState === 'playing') {
    return { ...game, gameState: 'paused' }
  }
  return game
}

/**
 * 继续游戏
 */
export function resumeGame(game: TetrisGame): TetrisGame {
  if (game.gameState === 'paused') {
    return { ...game, gameState: 'playing' }
  }
  return game
}

/**
 * 重新开始
 */
export function restartGame(): TetrisGame {
  return createNewGame()
}

// ============ 自动下落 ============

/**
 * 计算当前等级的下落速度
 */
export function getDropSpeed(level: number): number {
  const speed = INITIAL_SPEED - (level - 1) * SPEED_DECREASE
  return Math.max(speed, MIN_SPEED)
}

/**
 * 执行自动下落
 */
export function autoDrop(game: TetrisGame): TetrisGame {
  if (game.gameState !== 'playing') {
    return game
  }

  return movePiece(game, 'down')
}

// ============ 渲染辅助 ============

/**
 * 获取渲染用的游戏板（包含活动方块）
 */
export function getRenderBoard(game: TetrisGame): Cell[][] {
  const renderBoard = game.board.map((row) => [...row]) as Board

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

/**
 * 获取幽灵方块位置（预览落点）
 */
export function getGhostPiecePosition(game: TetrisGame): Position | null {
  if (!game.activePiece) {
    return null
  }

  let ghostY = game.activePiece.position.y
  while (
    isValidPosition(game.board, {
      ...game.activePiece,
      position: { x: game.activePiece.position.x, y: ghostY + 1 },
    })
  ) {
    ghostY++
  }

  return { x: game.activePiece.position.x, y: ghostY }
}
