/**
 * Ziqi Tetris - 紫琪玩方块
 * 核心类型定义
 */

// ============ 方块类型 ============
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'

// 单元格状态：null 表示空，字符串表示颜色类名
export type Cell = string | null

// 游戏板：10列 x 20行
export type Board = Cell[][]

// 方块形状定义
export type Shape = readonly (readonly [number, number])[]

// 方块完整定义
export interface Tetromino {
  type: TetrominoType
  shape: Shape
  color: string
  shadowColor: string
}

// 方块位置
export interface Position {
  x: number
  y: number
}

// 活动方块状态
export interface ActivePiece {
  tetromino: Tetromino
  position: Position
}

// ============ 游戏状态 ============
export type GameState = 'idle' | 'playing' | 'paused' | 'gameover'

export interface GameStats {
  score: number
  level: number
  lines: number
  highScore: number
}

// ============ 游戏数据 ============
export interface TetrisGame {
  board: Board
  activePiece: ActivePiece | null
  nextPiece: Tetromino | null
  gameState: GameState
  stats: GameStats
}

// ============ 常量定义 ============
export const BOARD_WIDTH = 10
export const BOARD_HEIGHT = 20
export const POINTS_PER_LINE = [0, 100, 300, 500, 800] // 0-4行的分数
export const LEVEL_LINES = 10 // 每消除10行升一级
export const INITIAL_SPEED = 1000 // 初始下落速度(ms)
export const MIN_SPEED = 100 // 最快速度
export const SPEED_DECREASE = 50 // 每级减少速度

// ============ 方块定义数据 ============
// 使用 readonly 确保不可变
export const TETROMINOES: Readonly<Record<TetrominoType, Tetromino>> = {
  I: {
    type: 'I',
    shape: [[0, -1], [0, 0], [0, 1], [0, 2]] as const,
    color: 'bg-ziqi-cyan',
    shadowColor: 'shadow-cyan-400/50',
  },
  O: {
    type: 'O',
    shape: [[0, 0], [0, 1], [1, 0], [1, 1]] as const,
    color: 'bg-ziqi-yellow',
    shadowColor: 'shadow-yellow-400/50',
  },
  T: {
    type: 'T',
    shape: [[0, 0], [-1, 0], [1, 0], [0, -1]] as const,
    color: 'bg-ziqi-accent',
    shadowColor: 'shadow-purple-400/50',
  },
  S: {
    type: 'S',
    shape: [[0, 0], [1, 0], [0, 1], [-1, 1]] as const,
    color: 'bg-ziqi-green',
    shadowColor: 'shadow-green-400/50',
  },
  Z: {
    type: 'Z',
    shape: [[0, 0], [-1, 0], [0, 1], [1, 1]] as const,
    color: 'bg-ziqi-pink',
    shadowColor: 'shadow-pink-400/50',
  },
  J: {
    type: 'J',
    shape: [[0, 0], [-1, 0], [1, 0], [-1, -1]] as const,
    color: 'bg-blue-500',
    shadowColor: 'shadow-blue-400/50',
  },
  L: {
    type: 'L',
    shape: [[0, 0], [-1, 0], [1, 0], [1, -1]] as const,
    color: 'bg-orange-500',
    shadowColor: 'shadow-orange-400/50',
  },
}

// 获取随机方块
export function getRandomTetromino(): Tetromino {
  const types = Object.keys(TETROMINOES) as TetrominoType[]
  return TETROMINOES[types[Math.floor(Math.random() * types.length)]]
}

// 获取方块类型列表
export function getTetrominoTypes(): TetrominoType[] {
  return Object.keys(TETROMINOES) as TetrominoType[]
}
