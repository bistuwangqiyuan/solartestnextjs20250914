import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PVRSD光伏快速关断器实验数据管理系统',
    short_name: 'PVRSD测试系统',
    description: '业界领先的光伏快速关断器测试数据管理平台，提供高压测试、泄漏电流检测、实时监控和智能分析',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f1117',
    theme_color: '#1a1d29',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'productivity', 'utilities'],
    lang: 'zh-CN',
    dir: 'ltr',
    scope: '/',
  }
}

