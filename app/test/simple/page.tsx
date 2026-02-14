/**
 * 测试页面 - 排查问题
 */
'use client'

export default function TestPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a0a2e',
      color: 'white',
      fontSize: '24px',
    }}>
      <div>
        <h1>紫琪玩方块 - 测试页面</h1>
        <p>如果你能看到这段文字，说明基本功能正常</p>
        <p style={{ color: '#9d4edd' }}>紫色文字测试</p>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff006e',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={() => alert('按钮点击测试成功！')}
        >
          点击测试
        </button>
      </div>
    </div>
  )
}
