import type { Metadata } from 'next'
import { Roboto_Mono, Orbitron } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
})

export const metadata: Metadata = {
  title: '光伏快速关断器实验数据管理系统',
  description: '业界领先的光伏快速关断器测试数据管理平台',
  keywords: ['光伏', '快速关断器', 'PVRSD', '测试系统', '数据管理'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${robotoMono.variable} ${orbitron.variable} min-h-screen bg-industrial-darker text-foreground antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            style: {
              background: '#1a1d29',
              color: '#00d4ff',
              border: '1px solid #2a2d3a',
            },
          }}
        />
      </body>
    </html>
  )
}