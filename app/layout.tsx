/**
 * Ziqi Tetris - 紫琪玩方块
 * 根布局
 */

import './globals.css'
import { Orbitron, Exo_2 } from 'next/font/google'

// ============================================
// 字体配置
// ============================================

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

// ============================================
// 元数据
// ============================================

export const metadata = {
  title: '紫琪玩方块 | Ziqi Tetris',
  description: '现代复古风格的俄罗斯方块游戏 - 独特的紫粉色系霓虹设计',
  keywords: ['Tetris', '俄罗斯方块', '紫琪玩方块', 'Ziqi', '方块游戏', '网页游戏'],
  authors: [{ name: '勇哥' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a0a2e',
}

// ============================================
// 布局
// ============================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${orbitron.variable} ${exo2.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
