'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Activity, Database, FileBarChart, Zap, Shield, BarChart3 } from 'lucide-react'

// 首页SEO元数据通过layout.tsx的metadata导出

export default function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: '高压测试',
      description: '支持600V/1000V/1500V DC多电压等级测试',
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: '实时监控',
      description: '毫秒级数据采集，实时曲线展示',
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: '数据管理',
      description: '完整的数据存储、查询和导出功能',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: '安全保护',
      description: '多重安全机制，确保测试过程安全可靠',
    },
    {
      icon: <FileBarChart className="h-8 w-8" />,
      title: '智能分析',
      description: 'AI驱动的数据分析和故障预测',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: '报告生成',
      description: '自动生成符合标准的测试报告',
    },
  ]

  return (
    <div className="min-h-screen bg-industrial-darker grid-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-industrial-dark via-industrial-darker to-black opacity-90" />
        
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-industrial-cyan to-industrial-success"
          >
            光伏快速关断器
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-5xl font-bold mb-8 text-white"
          >
            实验数据管理系统
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
          >
            业界领先的工业4.0级测试数据管理平台
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex gap-6 justify-center"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-industrial text-lg"
            >
              进入系统
            </button>
            <button
              onClick={() => router.push('/docs')}
              className="px-8 py-4 border border-gray-600 text-gray-400 font-semibold uppercase tracking-wider hover:border-gray-400 hover:text-white transition-all duration-300"
            >
              查看文档
            </button>
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-industrial-cyan opacity-10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-industrial-success opacity-10 rounded-full blur-3xl animate-pulse" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-16 text-white"
          >
            核心功能
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="data-card group"
              >
                <div className="text-industrial-cyan mb-4 group-hover:text-industrial-success transition-colors duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-industrial-dark">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { value: '99.9%', label: '系统可用性' },
              { value: '<2s', label: '响应时间' },
              { value: '10Hz', label: '数据刷新率' },
              { value: '100+', label: '并发用户' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-industrial-cyan mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-industrial-light">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 光伏快速关断器实验数据管理系统. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}