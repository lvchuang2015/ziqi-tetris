'use client'

/**
 * 简单测试页面 - 诊断问题
 */

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [gameState, setGameState] = useState<string>('初始化中...')
  const [localStorageTest, setLocalStorageTest] = useState<string>('未测试')
  const [tetrisImport, setTetrisImport] = useState<string>('未测试')

  useEffect(() => {
    setGameState('React 正常工作 ✓')

    try {
      localStorage.setItem('test-key', 'test-value')
      const value = localStorage.getItem('test-key')
      setLocalStorageTest(`localStorage 正常工作 ✓ (读取值: ${value})`)
    } catch (error) {
      setLocalStorageTest(`localStorage 失败 ✗ (${error})`)
    }

    import('@/lib/tetris').then((module) => {
      const funcs = Object.keys(module).filter(k => typeof (module as any)[k] === 'function')
      setTetrisImport(`tetris.ts 导入成功 ✓ (${funcs.length} 个函数)`)
    }).catch((error) => {
      setTetrisImport(`tetris.ts 导入失败 ✗ (${error})`)
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center p-4">
      <div className="bg-ziqi-purple/50 backdrop-blur-sm border border-ziqi-accent/50 rounded-xl p-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-ziqi-accent mb-6 text-center">
          紫琪玩方块 - 诊断测试
        </h1>

        <div className="space-y-4">
          <div className="bg-ziqi-dark/30 rounded-lg p-4">
            <div className="text-ziqi-accent text-sm mb-2">React 状态测试</div>
            <div className="text-white text-lg">{gameState}</div>
          </div>

          <div className="bg-ziqi-dark/30 rounded-lg p-4">
            <div className="text-ziqi-accent text-sm mb-2">localStorage 测试</div>
            <div className="text-white text-lg">{localStorageTest}</div>
          </div>

          <div className="bg-ziqi-dark/30 rounded-lg p-4">
            <div className="text-ziqi-accent text-sm mb-2">tetris.ts 导入测试</div>
            <div className="text-white text-lg">{tetrisImport}</div>
          </div>

          <div className="bg-ziqi-dark/30 rounded-lg p-4">
            <div className="text-ziqi-accent text-sm mb-2">游戏颜色主题测试</div>
            <div className="flex gap-2 mt-2">
              <div className="w-12 h-12 rounded bg-ziqi-dark" />
              <div className="w-12 h-12 rounded bg-ziqi-purple" />
              <div className="w-12 h-12 rounded bg-ziqi-accent" />
              <div className="w-12 h-12 rounded bg-ziqi-pink" />
              <div className="w-12 h-12 rounded bg-ziqi-cyan" />
              <div className="w-12 h-12 rounded bg-ziqi-yellow" />
              <div className="w-12 h-12 rounded bg-ziqi-green" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-ziqi-accent hover:text-white transition-colors">
            ← 返回主页
          </a>
        </div>
      </div>
    </div>
  )
}
