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
  metadataBase: new URL('https://pvrsd-test-system.netlify.app'),
  title: {
    default: 'PVRSD光伏快速关断器实验数据管理系统 - 工业4.0测试平台',
    template: '%s | PVRSD测试系统',
  },
  description: '业界领先的光伏快速关断器(PVRSD)测试数据管理平台，提供高压测试、泄漏电流检测、实时数据监控、智能分析和自动报告生成。符合IEC 62109、UL 1741国际标准，支持600V/1000V/1500V DC多电压等级测试。',
  keywords: [
    '光伏快速关断器',
    'PVRSD',
    'PV Rapid Shutdown Device',
    '光伏测试系统',
    '高压测试',
    '泄漏电流测试',
    '实验数据管理',
    'IEC 62109',
    'UL 1741',
    '工业4.0',
    '数据可视化',
    '智能分析',
    '测试报告',
    '实时监控',
    '光伏安全',
    '太阳能测试',
    '电力电子测试',
  ],
  authors: [{ name: 'PVRSD团队' }],
  creator: 'PVRSD测试系统',
  publisher: 'PVRSD测试系统',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://pvrsd-test-system.netlify.app',
    siteName: 'PVRSD光伏快速关断器测试系统',
    title: 'PVRSD光伏快速关断器实验数据管理系统 - 工业4.0测试平台',
    description: '业界领先的光伏快速关断器测试数据管理平台，提供高压测试、泄漏电流检测、实时监控和智能分析。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PVRSD光伏快速关断器测试系统',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PVRSD光伏快速关断器测试系统',
    description: '业界领先的光伏快速关断器测试数据管理平台',
    images: ['/twitter-image.png'],
    creator: '@pvrsd_system',
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    bing: 'bing-verification-code',
  },
  alternates: {
    canonical: 'https://pvrsd-test-system.netlify.app',
    languages: {
      'zh-CN': 'https://pvrsd-test-system.netlify.app',
      'en-US': 'https://pvrsd-test-system.netlify.app/en',
    },
  },
  category: '工业测试软件',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 结构化数据 - Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PVRSD光伏快速关断器测试系统',
    description: '业界领先的光伏快速关断器测试数据管理平台',
    url: 'https://pvrsd-test-system.netlify.app',
    logo: 'https://pvrsd-test-system.netlify.app/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: '技术支持',
      email: 'support@pvrsd-system.com',
    },
  }

  // 结构化数据 - WebSite Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PVRSD光伏快速关断器测试系统',
    url: 'https://pvrsd-test-system.netlify.app',
    description: '业界领先的光伏快速关断器测试数据管理平台',
    inLanguage: 'zh-CN',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://pvrsd-test-system.netlify.app/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // 结构化数据 - SoftwareApplication Schema
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PVRSD光伏快速关断器测试系统',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    description: '业界领先的光伏快速关断器测试数据管理平台，提供高压测试、泄漏电流检测、实时监控和智能分析',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '156',
    },
  }

  return (
    <html lang="zh-CN" className="dark">
      <head>
        {/* 结构化数据 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        {/* 预连接到重要的第三方域 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://zzyueuweeoakopuuwfau.supabase.co" />
        {/* 主题颜色 */}
        <meta name="theme-color" content="#1a1d29" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
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