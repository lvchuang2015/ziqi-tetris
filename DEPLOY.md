# 🚀 紫琪方块游戏 - 部署指南

## 📦 GitHub 仓库

**https://github.com/lvchuang2015/ziqi-tetris**

---

## 🎯 快速部署（推荐方法）

### 方法一：通过 Vercel 网页部署（最简单）

1. **访问 Vercel**: https://vercel.com
2. **登录** 你的 GitHub 账号
3. **点击** "Add New Project"
4. **导入仓库**: 选择 `lvchuang2015/ziqi-tetris`
5. **点击** "Deploy" 按钮

⏱️ 大约 1-2 分钟后，你的游戏就可以通过以下链接访问：
```
https://ziqi-tetris.vercel.app
```

---

### 方法二：使用 GitHub Actions（自动部署）

配置 Vercel Secrets 并启用 GitHub Actions：

1. **获取 Vercel 凭据**:
   ```bash
   npx vercel login
   npx vercel link
   cat .vercel/project.json
   ```

2. **在 GitHub 添加 Secrets**:
   - 访问: https://github.com/lvchuang2015/ziqi-tetris/settings/secrets/actions
   - 添加以下 secrets:
     - `VERCEL_TOKEN`: 你的 Vercel Token
     - `VERCEL_ORG_ID`: 组织 ID
     - `VERCEL_PROJECT_ID`: 项目 ID

3. **推送代码自动触发部署**:
   ```bash
   git push origin main
   ```

---

### 方法三：本地部署到 Vercel

```bash
cd E:\Claude\ziqi-tetris
npx vercel --prod
```

---

## 📱 微信分享配置

部署完成后，你的游戏链接可以直接在微信中分享！

**分享链接格式**:
```
https://ziqi-tetris.vercel.app
```

### 自定义域名（可选）

1. 在 Vercel 项目设置中添加自定义域名
2. 配置 DNS 记录
3. 使用自定义域名分享

---

## 🎮 游戏操作

### 桌面端
- **← →** : 左右移动
- **↓** : 软降
- **↑** : 旋转
- **空格** : 硬降

### 移动端
- **滑动** : 左右移动
- **点击** : 旋转
- **下滑** : 硬降

---

## 🔧 本地开发

```bash
cd E:\Claude\ziqi-tetris
npm install
npm run dev
```

访问: http://localhost:3001

---

## 📂 项目结构

```
ziqi-tetris/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页面
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   └── TetrisGame.tsx    # 游戏组件
├── lib/                   # 游戏逻辑
│   ├── tetris.ts         # 核心逻辑
│   └── types.ts          # 类型定义
└── public/               # 静态资源
```

---

## 🎨 技术栈

- **框架**: Next.js v16
- **UI**: React v19
- **样式**: Tailwind CSS v4
- **语言**: TypeScript
- **部署**: Vercel

---

## 📄 许可证

MIT License - Made with ❤️ by 勇哥
