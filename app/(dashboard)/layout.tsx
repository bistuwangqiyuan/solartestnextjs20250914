'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Zap,
  Activity,
  Settings,
  Database,
  FileBarChart,
  Menu,
  X,
  ChevronDown,
  FlaskConical,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: ReactNode
  children?: { name: string; href: string }[]
}

const navigation: NavItem[] = [
  { name: '数据大屏', href: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  {
    name: '实验管理',
    href: '/experiments',
    icon: <FlaskConical className="h-5 w-5" />,
    children: [
      { name: '高压试验', href: '/experiments/high-voltage' },
      { name: '泄漏电流', href: '/experiments/leakage' },
      { name: '正常工况', href: '/experiments/normal' },
      { name: '非正常工况', href: '/experiments/abnormal' },
      { name: '实验仿真', href: '/experiments/simulation' },
    ],
  },
  { name: '数据管理', href: '/data', icon: <Database className="h-5 w-5" /> },
  { name: '报告中心', href: '/reports', icon: <FileBarChart className="h-5 w-5" /> },
  { name: '系统设置', href: '/settings', icon: <Settings className="h-5 w-5" /> },
  { name: '帮助中心', href: '/help', icon: <HelpCircle className="h-5 w-5" /> },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['实验管理'])

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name) ? prev.filter(item => item !== name) : [...prev, name]
    )
  }

  return (
    <div className="flex h-screen bg-industrial-darker">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-industrial-dark border-r border-industrial-light transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-industrial-light">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-industrial-cyan to-industrial-success flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">PVRSD系统</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.children && item.children.some(child => pathname === child.href))
              const isExpanded = expandedItems.includes(item.name)

              return (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-industrial-light text-industrial-cyan'
                            : 'text-gray-400 hover:bg-industrial-light hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-1 ml-8 space-y-1 overflow-hidden"
                          >
                            {item.children.map((child) => {
                              const isChildActive = pathname === child.href
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`block px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                    isChildActive
                                      ? 'bg-industrial-cyan/20 text-industrial-cyan'
                                      : 'text-gray-400 hover:bg-industrial-light hover:text-white'
                                  }`}
                                >
                                  {child.name}
                                </Link>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-industrial-light text-industrial-cyan'
                          : 'text-gray-400 hover:bg-industrial-light hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-industrial-light p-4">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-industrial-cyan to-industrial-success" />
              <div>
                <p className="text-sm font-medium text-white">测试工程师</p>
                <p className="text-xs text-gray-400">admin@pvrsd.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-industrial-dark border-b border-industrial-light flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            {/* System status */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">系统状态:</span>
              <span className="flex items-center gap-1 text-industrial-success">
                <span className="status-indicator status-active" />
                正常运行
              </span>
            </div>
            
            {/* Alerts */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <AlertTriangle className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-industrial-warning rounded-full" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-industrial-darker p-6">
          {children}
        </main>
      </div>
    </div>
  )
}