import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'PVRSD光伏快速关断器测试系统'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom, #0f1117, #1a1d29)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 30,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="45" stroke="#00d4ff" strokeWidth="5" />
            <path
              d="M50 20 L60 50 L50 50 L60 80 L30 50 L50 50 L40 20 Z"
              fill="#00d4ff"
            />
          </svg>
          <span
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #00d4ff, #00ff88)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            PVRSD
          </span>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          光伏快速关断器测试系统
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#8b92a1',
            textAlign: 'center',
          }}
        >
          工业4.0级测试数据管理平台
        </div>
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 40,
            fontSize: 20,
            color: '#00d4ff',
          }}
        >
          <span>高压测试</span>
          <span>•</span>
          <span>实时监控</span>
          <span>•</span>
          <span>智能分析</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}

