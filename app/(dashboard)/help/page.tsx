'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HelpCircle,
  BookOpen,
  Play,
  Settings,
  Database,
  FileBarChart,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
  Upload,
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Trash2,
  Search,
  Filter,
  FolderOpen,
  Grid,
  List,
  Calendar,
  HardDrive,
  Eye,
  Edit,
  Share2,
  XCircle,
  Pause,
  StopCircle,
  Gauge,
  Thermometer,
  FlaskConical,
  Monitor,
  Bell,
  Shield,
  Wifi,
  Volume2,
  Save,
  RotateCcw,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Info,
  Lightbulb,
  AlertCircle,
  CheckSquare,
  Square,
  ArrowRight,
  ArrowLeft,
  Home,
  Menu,
  X
} from 'lucide-react'

interface HelpSection {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: '系统概览',
      icon: <Home className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-industrial-cyan/10 border border-industrial-cyan/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-industrial-cyan mb-4 flex items-center gap-2">
              <Info className="h-6 w-6" />
              PVRSD系统简介
            </h3>
            <p className="text-gray-300 leading-relaxed">
              PVRSD（光伏快速关断器）测试系统是一个专业的工业级测试平台，用于对光伏快速关断器进行全面的性能测试和质量评估。
              系统集成了高压试验、泄漏电流测试、正常工况测试、非正常工况测试等多种测试功能，并提供实时数据监控、报告生成等完整解决方案。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-industrial-success" />
                主要功能
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-industrial-cyan" />
                  实时数据监控大屏
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-industrial-cyan" />
                  多种实验测试功能
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-industrial-cyan" />
                  数据管理与分析
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-industrial-cyan" />
                  自动报告生成
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-industrial-cyan" />
                  系统设置与配置
                </li>
              </ul>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-industrial-warning" />
                使用建议
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-industrial-success" />
                  首次使用请先阅读本帮助文档
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-industrial-success" />
                  测试前确保设备连接正常
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-industrial-success" />
                  定期备份重要测试数据
                </li>
                <li className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-industrial-success" />
                  关注系统状态和告警信息
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'navigation',
      title: '界面导航',
      icon: <Menu className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-industrial-warning/10 border border-industrial-warning/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-industrial-warning mb-4 flex items-center gap-2">
              <AlertCircle className="h-6 w-6" />
              重要提示
            </h3>
            <p className="text-gray-300">
              本系统采用响应式设计，在不同屏幕尺寸下界面布局会自动调整。在移动设备上，侧边栏会变为可折叠的抽屉式菜单。
            </p>
          </div>

          <div className="space-y-4">
            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">侧边栏导航</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-industrial-darker rounded-lg">
                  <div className="p-2 bg-industrial-cyan/20 rounded">
                    <Zap className="h-5 w-5 text-industrial-cyan" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white">PVRSD系统</h5>
                    <p className="text-sm text-gray-400">系统Logo和名称，点击可返回首页</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { icon: <BarChart3 className="h-5 w-5" />, name: '数据大屏', desc: '实时监控系统状态和测试数据' },
                    { icon: <FlaskConical className="h-5 w-5" />, name: '实验管理', desc: '包含5个子模块的测试功能' },
                    { icon: <Database className="h-5 w-5" />, name: '数据管理', desc: '文件上传、下载和管理' },
                    { icon: <FileBarChart className="h-5 w-5" />, name: '报告中心', desc: '查看和导出测试报告' },
                    { icon: <Settings className="h-5 w-5" />, name: '系统设置', desc: '配置系统参数和用户偏好' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-industrial-darker rounded-lg">
                      <div className="p-2 bg-gray-700 rounded">
                        {item.icon}
                      </div>
                      <div>
                        <h5 className="font-medium text-white">{item.name}</h5>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">顶部状态栏</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-industrial-darker rounded-lg">
                  <Menu className="h-5 w-5 text-gray-400" />
                  <div>
                    <h5 className="font-medium text-white">菜单按钮</h5>
                    <p className="text-sm text-gray-400">移动端显示/隐藏侧边栏</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-industrial-darker rounded-lg">
                  <div className="w-3 h-3 bg-industrial-success rounded-full"></div>
                  <div>
                    <h5 className="font-medium text-white">系统状态</h5>
                    <p className="text-sm text-gray-400">显示"正常运行"或异常状态</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-industrial-darker rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-industrial-warning" />
                  <div>
                    <h5 className="font-medium text-white">告警图标</h5>
                    <p className="text-sm text-gray-400">显示系统告警数量，红点表示有待处理告警</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: '数据大屏',
      icon: <BarChart3 className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-industrial-success/10 border border-industrial-success/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-industrial-success mb-4 flex items-center gap-2">
              <Monitor className="h-6 w-6" />
              数据大屏功能
            </h3>
            <p className="text-gray-300">
              数据大屏是系统的核心监控界面，提供实时数据展示、设备状态监控、性能分析等功能。所有数据每秒钟自动刷新一次。
            </p>
          </div>

          <div className="space-y-4">
            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">统计卡片区域</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '今日测试', value: '156', change: '+12%', icon: <Activity className="h-6 w-6" />, color: 'text-industrial-cyan' },
                  { title: '合格率', value: '98.7%', change: '+0.5%', icon: <CheckCircle className="h-6 w-6" />, color: 'text-industrial-success' },
                  { title: '活跃设备', value: '12/20', change: '60%', icon: <Zap className="h-6 w-6" />, color: 'text-industrial-warning' },
                  { title: '待处理告警', value: '3', change: '-2', icon: <AlertTriangle className="h-6 w-6" />, color: 'text-industrial-danger' }
                ].map((stat, index) => (
                  <div key={index} className="p-4 bg-industrial-darker rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded ${stat.color.replace('text-', 'bg-').replace('-cyan', '-cyan/20').replace('-success', '-success/20').replace('-warning', '-warning/20').replace('-danger', '-danger/20')}`}>
                        <div className={stat.color}>{stat.icon}</div>
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-industrial-success' : 
                        stat.change.startsWith('-') ? 'text-industrial-danger' : 
                        'text-gray-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">实时监控图表</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">实时电压电流监测</h5>
                  <p className="text-sm text-gray-400 mb-3">
                    显示电压（蓝色线）和电流（绿色线）的实时变化曲线。图表每秒钟更新一次数据点。
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-industrial-darker rounded">
                      <p className="text-2xl font-bold text-industrial-cyan">1050.2V</p>
                      <p className="text-sm text-gray-400">当前电压</p>
                    </div>
                    <div className="text-center p-3 bg-industrial-darker rounded">
                      <p className="text-2xl font-bold text-industrial-success">11.25A</p>
                      <p className="text-sm text-gray-400">当前电流</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">测试趋势分析</h5>
                  <p className="text-sm text-gray-400">
                    显示过去6个月的测试数量趋势，蓝色区域图表示测试数量变化。
                  </p>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">右侧信息面板</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">设备3D模型</h5>
                  <p className="text-sm text-gray-400 mb-3">
                    3D旋转展示的PVRSD设备模型，可以直观查看设备外观和状态指示灯。
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">型号</span>
                      <span className="text-white">PVRSD-1500V</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">温度</span>
                      <span className="text-industrial-success">28.5°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">功率</span>
                      <span className="text-industrial-warning">1180W</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">设备状态分布</h5>
                  <p className="text-sm text-gray-400 mb-3">
                    饼图显示所有设备的运行状态分布情况。
                  </p>
                  <div className="space-y-2 text-sm">
                    {[
                      { name: '运行中', value: 12, color: '#00ff88' },
                      { name: '空闲', value: 5, color: '#00d4ff' },
                      { name: '维护中', value: 2, color: '#ff9500' },
                      { name: '故障', value: 1, color: '#ff3b30' }
                    ].map((status, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                          <span className="text-gray-400">{status.name}</span>
                        </div>
                        <span className="text-white font-medium">{status.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">系统性能指标</h5>
                  <p className="text-sm text-gray-400">
                    雷达图显示系统各项性能指标的评分情况，包括测试效率、数据准确性、系统稳定性等。
                  </p>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">最近告警</h4>
              <div className="space-y-3">
                {[
                  { type: 'warning', message: '设备PVRSD-003温度偏高', time: '2分钟前' },
                  { type: 'critical', message: '设备PVRSD-007通信中断', time: '15分钟前' },
                  { type: 'info', message: '系统备份完成', time: '1小时前' }
                ].map((alarm, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    alarm.type === 'critical' ? 'border-industrial-danger bg-industrial-danger/10' :
                    alarm.type === 'warning' ? 'border-industrial-warning bg-industrial-warning/10' :
                    'border-industrial-cyan bg-industrial-cyan/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white">{alarm.message}</p>
                      <span className="text-xs text-gray-400">{alarm.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button className="text-sm text-industrial-cyan hover:text-industrial-success transition-colors">
                  查看全部告警 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'experiments',
      title: '实验管理',
      icon: <FlaskConical className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-industrial-warning/10 border border-industrial-warning/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-industrial-warning mb-4 flex items-center gap-2">
              <FlaskConical className="h-6 w-6" />
              实验管理功能
            </h3>
            <p className="text-gray-300">
              实验管理模块包含5种不同类型的测试功能，每种测试都有特定的参数设置和操作流程。测试前请确保设备连接正常，测试过程中请勿中断电源。
            </p>
          </div>

          <div className="space-y-4">
            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">高压试验</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-industrial-cyan" />
                    功能说明
                  </h5>
                  <p className="text-sm text-gray-400 mb-3">
                    用于测试设备的绝缘强度和耐压能力，是安全认证的重要测试项目。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">测试参数设置</h6>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 电压等级：600V/1000V/1500V DC</li>
                        <li>• 测试时长：1分钟/5分钟/60分钟</li>
                        <li>• 升压速率：100-500V/s</li>
                        <li>• 测试标准：IEC 62109-1/UL 1741 SA</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">操作步骤</h6>
                      <ol className="text-sm text-gray-400 space-y-1">
                        <li>1. 点击设置按钮配置测试参数</li>
                        <li>2. 确认设备连接和接地</li>
                        <li>3. 点击"开始测试"按钮</li>
                        <li>4. 监控实时数据和曲线</li>
                        <li>5. 测试完成后导出数据</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">控制按钮说明</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: <Play className="h-4 w-4" />, name: '开始测试', desc: '启动高压测试流程', color: 'text-industrial-success' },
                      { icon: <Pause className="h-4 w-4" />, name: '暂停', desc: '暂停当前测试', color: 'text-industrial-warning' },
                      { icon: <StopCircle className="h-4 w-4" />, name: '停止', desc: '终止测试并复位', color: 'text-industrial-danger' },
                      { icon: <Download className="h-4 w-4" />, name: '导出数据', desc: '下载测试结果', color: 'text-industrial-cyan' }
                    ].map((btn, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <div className={`${btn.color} mb-1`}>{btn.icon}</div>
                        <h6 className="text-sm font-medium text-white">{btn.name}</h6>
                        <p className="text-xs text-gray-400">{btn.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">实时数据显示</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: '电压', value: '1050.2V', color: 'text-industrial-cyan' },
                      { label: '泄漏电流', value: '0.003mA', color: 'text-industrial-success' },
                      { label: '绝缘电阻', value: '350.1MΩ', color: 'text-industrial-warning' },
                      { label: '温度', value: '25.3°C', color: 'text-white' }
                    ].map((data, index) => (
                      <div key={index} className="text-center p-3 bg-gray-800 rounded-lg">
                        <p className={`text-2xl font-bold ${data.color}`}>{data.value}</p>
                        <p className="text-sm text-gray-400">{data.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">正常工况试验</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-industrial-success" />
                    功能说明
                  </h5>
                  <p className="text-sm text-gray-400 mb-3">
                    测试设备在正常工作条件下的性能表现，包括效率、功率因数、温升等关键指标。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">测试参数</h6>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 功率范围：0-1500W</li>
                        <li>• 温度范围：-40°C到85°C</li>
                        <li>• 负载类型：阻性/感性/容性</li>
                        <li>• 测试时长：可自定义</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">监控指标</h6>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 转换效率：实时显示百分比</li>
                        <li>• 功率因数：显示功率质量</li>
                        <li>• 温度分布：热力图显示</li>
                        <li>• 效率曲线：功率-效率关系</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">功率调节滑块</h5>
                  <p className="text-sm text-gray-400 mb-3">
                    通过拖动滑块可以实时调节测试功率，滑块颜色会根据功率大小变化：
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-industrial-success rounded"></div>
                      <span className="text-sm text-gray-300">绿色：低功率（0-500W）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-industrial-warning rounded"></div>
                      <span className="text-sm text-gray-300">黄色：中功率（500-1000W）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-industrial-danger rounded"></div>
                      <span className="text-sm text-gray-300">红色：高功率（1000-1500W）</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">其他测试类型</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    name: '泄漏电流', 
                    icon: <TrendingUp className="h-5 w-5 text-blue-400" />,
                    desc: '测试设备在不同条件下的泄漏电流特性',
                    features: ['多通道测量', '温度补偿', '频率响应']
                  },
                  { 
                    name: '非正常工况', 
                    icon: <AlertTriangle className="h-5 w-5 text-red-400" />,
                    desc: '测试保护功能和异常情况处理能力',
                    features: ['过压保护', '过流保护', '短路保护']
                  },
                  { 
                    name: '实验仿真', 
                    icon: <Monitor className="h-5 w-5 text-purple-400" />,
                    desc: '基于数学模型的理论仿真分析',
                    features: ['参数优化', '性能预测', '设计验证']
                  }
                ].map((test, index) => (
                  <div key={index} className="p-4 bg-industrial-darker rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {test.icon}
                      <h5 className="font-medium text-white">{test.name}</h5>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{test.desc}</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {test.features.map((feature, idx) => (
                        <li key={idx}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'data-management',
      title: '数据管理',
      icon: <Database className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-industrial-cyan/10 border border-industrial-cyan/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-industrial-cyan mb-4 flex items-center gap-2">
              <Database className="h-6 w-6" />
              数据管理功能
            </h3>
            <p className="text-gray-300">
              数据管理模块提供完整的文件管理功能，支持多种格式的数据文件上传、下载、查看和管理。所有文件都会自动分类和标记。
            </p>
          </div>

          <div className="space-y-4">
            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">存储统计</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: '总文件数', value: '156', icon: <FileText className="h-4 w-4" />, color: 'text-industrial-cyan', desc: '156 有效 / 3 处理中' },
                  { title: '存储空间', value: '2.4GB', icon: <HardDrive className="h-4 w-4" />, color: 'text-industrial-warning', desc: '已用 / 100 GB 总容量' },
                  { title: '今日上传', value: '12', icon: <Upload className="h-4 w-4" />, color: 'text-industrial-success', desc: '+20% 相比昨日' },
                  { title: '数据完整性', value: '99.8%', icon: <CheckCircle className="h-4 w-4" />, color: 'text-industrial-success', desc: '1 个文件需要修复' }
                ].map((stat, index) => (
                  <div key={index} className="p-4 bg-industrial-darker rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">{stat.title}</span>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">文件上传</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-industrial-success" />
                    上传方式
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">点击上传</h6>
                      <ol className="text-sm text-gray-400 space-y-1">
                        <li>1. 点击右上角"上传文件"按钮</li>
                        <li>2. 选择要上传的文件（支持多选）</li>
                        <li>3. 等待上传进度完成</li>
                        <li>4. 文件自动添加到列表中</li>
                      </ol>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">拖拽上传</h6>
                      <ol className="text-sm text-gray-400 space-y-1">
                        <li>1. 直接将文件拖拽到页面区域</li>
                        <li>2. 页面会显示拖拽提示</li>
                        <li>3. 松开鼠标完成上传</li>
                        <li>4. 支持批量拖拽多个文件</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">支持的文件格式</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { format: 'Excel', icon: <FileSpreadsheet className="h-5 w-5 text-green-500" />, ext: '.xlsx, .xls' },
                      { format: 'CSV', icon: <FileText className="h-5 w-5 text-blue-500" />, ext: '.csv' },
                      { format: 'JSON', icon: <FileJson className="h-5 w-5 text-yellow-500" />, ext: '.json' },
                      { format: 'PDF', icon: <FileText className="h-5 w-5 text-red-500" />, ext: '.pdf' }
                    ].map((file, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg text-center">
                        <div className="mb-2">{file.icon}</div>
                        <h6 className="text-sm font-medium text-white">{file.format}</h6>
                        <p className="text-xs text-gray-400">{file.ext}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">搜索和筛选</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Search className="h-5 w-5 text-industrial-cyan" />
                    搜索功能
                  </h5>
                  <p className="text-sm text-gray-400 mb-3">
                    在搜索框中输入文件名或标签关键词，系统会实时显示匹配结果。支持模糊搜索和标签搜索。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">搜索框位置：页面顶部左侧</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-300">支持按实验类型筛选</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">排序选项</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { name: '上传时间', desc: '按文件上传时间排序' },
                      { name: '文件名', desc: '按文件名字母顺序排序' },
                      { name: '文件大小', desc: '按文件大小排序' }
                    ].map((sort, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <h6 className="text-sm font-medium text-white">{sort.name}</h6>
                        <p className="text-xs text-gray-400">{sort.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">文件操作</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">批量操作</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">选择文件</h6>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 点击文件前的复选框选择单个文件</li>
                        <li>• 点击表头复选框全选当前页面文件</li>
                        <li>• 选择后显示批量操作工具栏</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">批量操作</h6>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 批量下载：下载所有选中文件</li>
                        <li>• 批量删除：删除所有选中文件</li>
                        <li>• 批量标记：为文件添加标签</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="text-lg font-semibold text-white mb-4">单个文件操作</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: <Eye className="h-4 w-4" />, name: '预览', desc: '在线查看文件内容', color: 'text-blue-400' },
                      { icon: <Download className="h-4 w-4" />, name: '下载', desc: '下载文件到本地', color: 'text-green-400' },
                      { icon: <Share2 className="h-4 w-4" />, name: '分享', desc: '生成分享链接', color: 'text-purple-400' },
                      { icon: <Trash2 className="h-4 w-4" />, name: '删除', desc: '删除文件', color: 'text-red-400' }
                    ].map((action, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg text-center">
                        <div className={`${action.color} mb-2`}>{action.icon}</div>
                        <h6 className="text-sm font-medium text-white">{action.name}</h6>
                        <p className="text-xs text-gray-400">{action.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">视图模式</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <List className="h-5 w-5 text-industrial-cyan" />
                    列表视图
                  </h5>
                  <p className="text-sm text-gray-400 mb-3">
                    以表格形式显示文件信息，包含文件名、类型、大小、上传时间、状态等详细信息。
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 显示完整的文件信息</li>
                    <li>• 支持排序和筛选</li>
                    <li>• 便于批量操作</li>
                  </ul>
                </div>
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Grid className="h-5 w-5 text-industrial-success" />
                    网格视图
                  </h5>
                  <p className="text-sm text-gray-400 mb-3">
                    以卡片形式显示文件，更加直观美观，适合快速浏览和识别文件。
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 直观的文件图标显示</li>
                    <li>• 紧凑的布局设计</li>
                    <li>• 快速文件识别</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      title: '报告中心',
      icon: <FileBarChart className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-industrial-success/10 border border-industrial-success/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-industrial-success mb-4 flex items-center gap-2">
              <FileBarChart className="h-6 w-6" />
              报告中心功能
            </h3>
            <p className="text-gray-300">
              报告中心提供完整的测试报告管理功能，包括报告查看、筛选、导出等。所有测试完成后都会自动生成详细的测试报告。
            </p>
          </div>

          <div className="space-y-4">
            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">报告列表</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <List className="h-5 w-5 text-industrial-cyan" />
                    报告信息显示
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">基本信息</h6>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 报告编号：唯一标识符</li>
                        <li>• 报告标题：测试项目名称</li>
                        <li>• 测试类型：高压/泄漏/正常/异常</li>
                        <li>• 测试日期：测试执行时间</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">状态标识</h6>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">通过：所有测试项目合格</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">警告：部分项目需要关注</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="text-sm text-gray-300">失败：存在不合格项目</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">筛选功能</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">测试类型筛选</h6>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 高压测试：绝缘强度测试报告</li>
                        <li>• 泄漏电流：泄漏电流测试报告</li>
                        <li>• 正常工况：性能测试报告</li>
                        <li>• 非正常工况：保护功能测试报告</li>
                        <li>• 环境适应性：环境测试报告</li>
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-sm font-medium text-white mb-2">状态筛选</h6>
                      <ul className="text-sm text-gray-400 space-y-1">
                        <li>• 全部状态：显示所有报告</li>
                        <li>• 通过：只显示合格报告</li>
                        <li>• 警告：显示需要关注的报告</li>
                        <li>• 失败：显示不合格报告</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">报告详情</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">基本信息卡片</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: '报告编号', value: 'RPT-2025-001', color: 'text-white' },
                      { label: '测试类型', value: '高压测试', color: 'text-blue-400' },
                      { label: '测试日期', value: '2025-09-14', color: 'text-green-400' },
                      { label: '测试时长', value: '2小时15分钟', color: 'text-yellow-400' }
                    ].map((info, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <div className="text-xs text-gray-400 mb-1">{info.label}</div>
                        <div className={`text-sm font-medium ${info.color}`}>{info.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">测试条件</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: '电压', value: '1000V', color: 'text-blue-400' },
                      { label: '电流', value: '1.2A', color: 'text-green-400' },
                      { label: '功率', value: '1200W', color: 'text-yellow-400' },
                      { label: '效率', value: '98.5%', color: 'text-purple-400' },
                      { label: '温度', value: '25.3°C', color: 'text-red-400' },
                      { label: '湿度', value: '45.2%', color: 'text-cyan-400' }
                    ].map((condition, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg text-center">
                        <div className={`text-lg font-bold ${condition.color}`}>{condition.value}</div>
                        <div className="text-xs text-gray-400">{condition.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">测试项目结果</h5>
                  <div className="space-y-3">
                    {[
                      { name: '绝缘电阻测试', result: '通过', value: '1250MΩ', standard: '≥100MΩ', status: 'passed' },
                      { name: '耐压测试', result: '通过', value: '1500V', standard: '1500V/1min', status: 'passed' },
                      { name: '泄漏电流测试', result: '通过', value: '0.05mA', standard: '≤0.1mA', status: 'passed' },
                      { name: '局部放电测试', result: '通过', value: '2.1pC', standard: '≤10pC', status: 'passed' }
                    ].map((item, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{item.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.status === 'passed' ? 'bg-green-400/20 text-green-400' :
                            item.status === 'warning' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-red-400/20 text-red-400'
                          }`}>
                            {item.result}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>测量值: {item.value}</span>
                          <span>标准: {item.standard}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">详细测量数据</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-300">参数</th>
                          <th className="text-left py-2 text-gray-300">测量值</th>
                          <th className="text-left py-2 text-gray-300">标准要求</th>
                          <th className="text-left py-2 text-gray-300">偏差</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { param: '输入电压', measured: '1000.2V', standard: '1000±1%', deviation: '0.02%' },
                          { param: '输出电流', measured: '1.198A', standard: '1.2±2%', deviation: '-0.17%' },
                          { param: '功率因数', measured: '0.995', standard: '≥0.95', deviation: '4.74%' },
                          { param: '效率', measured: '98.52%', standard: '≥95%', deviation: '3.71%' }
                        ].map((measurement, index) => (
                          <tr key={index} className="border-b border-gray-800">
                            <td className="py-2 text-white">{measurement.param}</td>
                            <td className="py-2 text-blue-400">{measurement.measured}</td>
                            <td className="py-2 text-gray-300">{measurement.standard}</td>
                            <td className={`py-2 ${
                              Math.abs(parseFloat(measurement.deviation)) < 5 ? 'text-green-400' : 
                              Math.abs(parseFloat(measurement.deviation)) < 10 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {measurement.deviation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">测试总结</h5>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300 leading-relaxed">
                      设备在1000V DC电压下通过了所有绝缘测试项目，绝缘电阻值均超过标准要求，无异常放电现象。
                      测试过程中设备运行稳定，各项指标均符合GB/T 37408-2019标准要求。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">报告操作</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Download className="h-5 w-5 text-industrial-success" />
                    导出报告
                  </h5>
                  <p className="text-sm text-gray-400 mb-3">
                    点击"导出报告"按钮可以将报告下载为JSON格式文件，包含完整的测试数据和结果。
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 导出格式：JSON文件</li>
                    <li>• 文件命名：报告编号_测试报告.json</li>
                    <li>• 包含内容：所有测试数据和结果</li>
                    <li>• 文件大小：通常几KB到几MB</li>
                  </ul>
                </div>
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-industrial-cyan" />
                    报告分享
                  </h5>
                  <p className="text-sm text-gray-400 mb-3">
                    可以生成报告分享链接，方便与同事或客户分享测试结果。
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 生成唯一分享链接</li>
                    <li>• 设置访问权限和有效期</li>
                    <li>• 支持密码保护</li>
                    <li>• 可追踪访问记录</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: '系统设置',
      icon: <Settings className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-industrial-warning/10 border border-industrial-warning/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-industrial-warning mb-4 flex items-center gap-2">
              <Settings className="h-6 w-6" />
              系统设置功能
            </h3>
            <p className="text-gray-300">
              系统设置模块提供全面的配置选项，包括主题外观、显示设置、通知配置、系统参数、设备配置、网络设置和用户信息等。
            </p>
          </div>

          <div className="space-y-4">
            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">设置分类导航</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: '主题外观', icon: <Monitor className="h-5 w-5" />, desc: '界面主题和样式设置' },
                  { name: '显示设置', icon: <Monitor className="h-5 w-5" />, desc: '语言、时区、格式等' },
                  { name: '通知设置', icon: <Bell className="h-5 w-5" />, desc: '系统通知和提醒配置' },
                  { name: '系统设置', icon: <Settings className="h-5 w-5" />, desc: '系统参数和日志配置' },
                  { name: '设备配置', icon: <Zap className="h-5 w-5" />, desc: '测试设备参数设置' },
                  { name: '网络设置', icon: <Wifi className="h-5 w-5" />, desc: '网络连接和API配置' },
                  { name: '用户信息', icon: <User className="h-5 w-5" />, desc: '个人信息和权限设置' }
                ].map((setting, index) => (
                  <div key={index} className="p-3 bg-industrial-darker rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-industrial-cyan">{setting.icon}</div>
                      <h5 className="font-medium text-white">{setting.name}</h5>
                    </div>
                    <p className="text-xs text-gray-400">{setting.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">主题外观设置</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">颜色主题</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: '深色主题', color: '#1a1a1a', accent: '#00ffff' },
                      { name: '浅色主题', color: '#ffffff', accent: '#007bff' },
                      { name: '蓝色主题', color: '#0f1419', accent: '#00d4ff' },
                      { name: '绿色主题', color: '#0d1b0d', accent: '#00ff88' }
                    ].map((theme, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg text-center">
                        <div 
                          className="w-12 h-8 rounded border-2 mx-auto mb-2"
                          style={{ 
                            backgroundColor: theme.color, 
                            borderColor: theme.accent 
                          }}
                        ></div>
                        <span className="text-sm text-gray-300">{theme.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">其他外观选项</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-300">字体大小</span>
                        <p className="text-xs text-gray-500">调整界面文字大小</p>
                      </div>
                      <span className="text-sm text-white">14px</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-300">紧凑模式</span>
                        <p className="text-xs text-gray-500">减少界面元素间距</p>
                      </div>
                      <div className="w-10 h-6 bg-gray-600 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-300">动画效果</span>
                        <p className="text-xs text-gray-500">启用界面过渡动画</p>
                      </div>
                      <div className="w-10 h-6 bg-industrial-cyan rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">显示设置</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">语言和地区</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">界面语言</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white">
                        <option>简体中文</option>
                        <option>繁體中文</option>
                        <option>English</option>
                        <option>日本語</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">时区设置</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white">
                        <option>北京时间 (GMT+8)</option>
                        <option>东京时间 (GMT+9)</option>
                        <option>伦敦时间 (GMT+0)</option>
                        <option>纽约时间 (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">数据格式</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">日期格式</label>
                      <select className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white">
                        <option>2025-09-15</option>
                        <option>15/09/2025</option>
                        <option>09/15/2025</option>
                        <option>15-09-2025</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">数据刷新频率</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="100" max="5000" step="100" className="flex-1" />
                        <span className="text-sm text-white">1000ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">通知设置</h4>
              <div className="space-y-3">
                {[
                  { name: '启用通知', desc: '接收系统通知和警告', enabled: true },
                  { name: '声音提醒', desc: '播放通知声音', enabled: true },
                  { name: '邮件通知', desc: '发送重要通知到邮箱', enabled: false },
                  { name: '桌面通知', desc: '显示系统桌面通知', enabled: true },
                  { name: '仅关键通知', desc: '只显示重要和错误通知', enabled: false }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-industrial-darker rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-300">{notification.name}</span>
                      <p className="text-xs text-gray-500">{notification.desc}</p>
                    </div>
                    <div className={`w-10 h-6 rounded-full relative ${
                      notification.enabled ? 'bg-industrial-cyan' : 'bg-gray-600'
                    }`}>
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">设备配置</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">设备参数</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">设备ID</label>
                      <input 
                        type="text" 
                        value="PVRSD-SYS-001" 
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">采样频率</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="100" max="10000" step="100" className="flex-1" />
                        <span className="text-sm text-white">1000Hz</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">校准信息</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">校准日期</label>
                      <input 
                        type="date" 
                        value="2025-01-15" 
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">下次校准</label>
                      <input 
                        type="date" 
                        value="2025-07-15" 
                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">设置操作</h4>
              <div className="flex items-center justify-between p-4 bg-industrial-darker rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">有未保存的更改</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">
                    <RotateCcw className="h-4 w-4 inline mr-2" />
                    重置
                  </button>
                  <button className="px-4 py-2 bg-industrial-cyan text-white rounded hover:bg-industrial-cyan/80 transition-colors">
                    <Save className="h-4 w-4 inline mr-2" />
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: '故障排除',
      icon: <AlertTriangle className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="bg-industrial-danger/10 border border-industrial-danger/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-industrial-danger mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              故障排除指南
            </h3>
            <p className="text-gray-300">
              当系统出现问题时，请按照以下步骤进行故障排除。如果问题仍然存在，请联系技术支持团队。
            </p>
          </div>

          <div className="space-y-4">
            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">常见问题</h4>
              <div className="space-y-4">
                {[
                  {
                    problem: '设备连接失败',
                    symptoms: ['设备状态显示离线', '无法开始测试', '通信错误'],
                    solutions: [
                      '检查设备电源连接',
                      '确认USB/网络连接正常',
                      '重启设备和软件',
                      '检查设备驱动程序'
                    ]
                  },
                  {
                    problem: '测试数据异常',
                    symptoms: ['数据值超出正常范围', '图表显示异常', '测试结果不准确'],
                    solutions: [
                      '检查传感器连接',
                      '校准测试设备',
                      '检查测试环境条件',
                      '重新进行测试'
                    ]
                  },
                  {
                    problem: '文件上传失败',
                    symptoms: ['上传进度卡住', '文件格式错误', '网络超时'],
                    solutions: [
                      '检查文件格式是否支持',
                      '确认文件大小不超过限制',
                      '检查网络连接',
                      '尝试重新上传'
                    ]
                  },
                  {
                    problem: '系统运行缓慢',
                    symptoms: ['界面响应慢', '数据刷新延迟', '操作卡顿'],
                    solutions: [
                      '关闭不必要的程序',
                      '清理系统缓存',
                      '检查网络连接',
                      '重启系统'
                    ]
                  }
                ].map((issue, index) => (
                  <div key={index} className="p-4 bg-industrial-darker rounded-lg">
                    <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-industrial-warning" />
                      {issue.problem}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-sm font-medium text-white mb-2">症状表现</h6>
                        <ul className="text-sm text-gray-400 space-y-1">
                          {issue.symptoms.map((symptom, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="text-sm font-medium text-white mb-2">解决方案</h6>
                        <ol className="text-sm text-gray-400 space-y-1">
                          {issue.solutions.map((solution, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="text-industrial-cyan">{idx + 1}.</span>
                              {solution}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">系统状态检查</h4>
              <div className="space-y-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">状态指示器说明</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2"></div>
                      <h6 className="text-sm font-medium text-white">正常运行</h6>
                      <p className="text-xs text-gray-400">系统工作正常</p>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                      <h6 className="text-sm font-medium text-white">警告状态</h6>
                      <p className="text-xs text-gray-400">需要关注</p>
                    </div>
                    <div className="text-center p-3 bg-gray-800 rounded-lg">
                      <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-2"></div>
                      <h6 className="text-sm font-medium text-white">错误状态</h6>
                      <p className="text-xs text-gray-400">需要处理</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2">日志查看</h5>
                  <p className="text-sm text-gray-400 mb-3">
                    系统日志记录了所有操作和错误信息，可以通过以下方式查看：
                  </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• 在系统设置中查看日志级别</li>
                    <li>• 导出日志文件进行分析</li>
                    <li>• 联系技术支持时提供日志信息</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="data-card">
              <h4 className="text-lg font-semibold text-white mb-4">联系支持</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-industrial-cyan" />
                    技术支持
                  </h5>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>邮箱：support@pvrsd.com</p>
                    <p>电话：+86 400-123-4567</p>
                    <p>工作时间：周一至周五 9:00-18:00</p>
                  </div>
                </div>
                <div className="p-4 bg-industrial-darker rounded-lg">
                  <h5 className="font-medium text-white mb-2 flex items-center gap-2">
                    <User className="h-5 w-5 text-industrial-success" />
                    在线帮助
                  </h5>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>在线文档：docs.pvrsd.com</p>
                    <p>视频教程：tutorial.pvrsd.com</p>
                    <p>社区论坛：forum.pvrsd.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-cyan/20 rounded-lg">
            <HelpCircle className="h-6 w-6 text-industrial-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">帮助中心</h1>
            <p className="text-sm text-gray-400">详细的使用说明和操作指南</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Help navigation */}
        <div className="lg:col-span-1">
          <div className="data-card">
            <h3 className="text-lg font-semibold text-white mb-4">帮助目录</h3>
            <nav className="space-y-1">
              {helpSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-industrial-light text-industrial-cyan'
                      : 'text-gray-400 hover:bg-industrial-light hover:text-white'
                  }`}
                >
                  {section.icon}
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Help content */}
        <div className="lg:col-span-3">
          <div className="data-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {helpSections.find(section => section.id === activeSection)?.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
