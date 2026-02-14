'use client'

export default function BasicTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center">
      <div className="bg-ziqi-purple/50 rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-ziqi-accent mb-4">
          基础测试
        </h1>
        <p className="text-white mb-4">如果你能看到这个，说明 React 正常工作</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="w-20 h-20 bg-ziqi-cyan rounded-lg"></div>
          <div className="w-20 h-20 bg-ziqi-pink rounded-lg"></div>
          <div className="w-20 h-20 bg-ziqi-yellow rounded-lg"></div>
          <div className="w-20 h-20 bg-ziqi-green rounded-lg"></div>
        </div>
        <a href="/" className="text-ziqi-accent hover:text-white">
          ← 返回主页
        </a>
      </div>
    </div>
  )
}
