/**
 * 测试页面 - 验证 Tailwind CSS
 */

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ziqi-dark via-ziqi-purple to-black flex items-center justify-center">
      <div className="bg-ziqi-purple/50 backdrop-blur-sm border border-ziqi-accent/30 rounded-lg px-6 py-4">
        <h1 className="text-4xl font-display font-bold text-ziqi-accent mb-4">
          测试页面
        </h1>
        <p className="text-white mb-4">
          如果你能看到紫色背景和粉色文字，说明 Tailwind CSS 正常工作！
        </p>
        <button className="bg-gradient-to-r from-ziqi-accent to-ziqi-pink hover:from-ziqi-accent/80 hover:to-ziqi-pink/80 text-white font-display font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105">
          测试按钮
        </button>
      </div>
    </div>
  )
}
