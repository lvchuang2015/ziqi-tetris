# 紫琪玩方块 | Ziqi Tetris

> 现代复古风格的俄罗斯方块游戏
> 独特的紫粉色系霓虹设计

## 游戏特性

- 🎮 **经典玩法** - 传承经典俄罗斯方块玩法
- 🎨 **独特视觉** - 现代复古霓虹风格，紫粉色系设计
- ⚡ **流畅动画** - 精致的方块下落和消行动画
- 📱 **响应式设计** - 支持桌面键盘和移动端触摸操作
- 🏆 **成就系统** - 分数、等级、行数统计，本地最高分记录
- 👻 **幽灵方块** - 预览方块落点
- 🔄 **硬降功能** - 空格键/下滑快速落地

## 技术栈

- **框架**: Next.js v16
- **UI**: React v19
- **样式**: Tailwind CSS v4
- **语言**: TypeScript
- **字体**: Orbitron (Display) + Exo 2 (Body)

## 快速开始

### 安装依赖

```bash
cd ziqi-tetris
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
npm start
```

## 游戏操作

### 桌面端

| 按键 | 功能 |
|------|------|
| ← → | 左右移动 |
| ↓ | 软降 |
| ↑ | 旋转 |
| 空格 | 硬降 |

### 移动端

- **滑动**: 左右移动
- **点击**: 旋转
- **下滑**: 硬降

## 计分规则

| 消除行数 | 分数 |
|---------|------|
| 1 行 | 100 × 等级 |
| 2 行 | 300 × 等级 |
| 3 行 | 500 × 等级 |
| 4 行 | 800 × 等级 |

- 硬降奖励：每格 2 分
- 每消除 10 行升一级，速度加快

## 项目结构

```
ziqi-tetris/
├── app/
│   ├── layout.tsx       # 根布局
│   ├── page.tsx         # 主页面
│   └── globals.css      # 全局样式
├── components/
│   └── TetrisGame.tsx   # 游戏组件
├── lib/
│   ├── types.ts         # 类型定义
│   └── tetris.ts        # 游戏逻辑
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 设计理念

**配色方案** - 深紫色背景 + 霓虹方块 + 精致光效

每个方块类型都有独特的颜色和阴影效果：
- I型：青色
- O型：黄色
- T型：紫色
- S型：绿色
- Z型：粉色
- J型：蓝色
- L型：橙色

**字体选择** - Orbitron (Display) + Exo 2 (Body)
- Orbitron: 科幻风格的显示字体，用于标题和数字
- Exo 2: 现代几何字体，适合正文

## 本地存储

游戏最高分保存在浏览器 localStorage 中，键名：`ziqi-highscore`

---

Made with ❤️ by 勇哥
