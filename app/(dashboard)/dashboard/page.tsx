'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users,
  Clock,
  BarChart3,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere } from '@react-three/drei'

// Mock data generation
const generateRealtimeData = () => {
  const now = new Date()
  return {
    timestamp: now.toLocaleTimeString(),
    voltage: 1000 + Math.random() * 100,
    current: 10 + Math.random() * 2,
    power: 10000 + Math.random() * 1000,
    temperature: 25 + Math.random() * 10,
  }
}

const deviceStatus = [
  { name: '运行中', value: 12, color: '#00ff88' },
  { name: '空闲', value: 5, color: '#00d4ff' },
  { name: '维护中', value: 2, color: '#ff9500' },
  { name: '故障', value: 1, color: '#ff3b30' },
]

const testTrends = [
  { month: '1月', tests: 245, passRate: 98.5 },
  { month: '2月', tests: 312, passRate: 97.8 },
  { month: '3月', tests: 289, passRate: 99.1 },
  { month: '4月', tests: 356, passRate: 98.9 },
  { month: '5月', tests: 421, passRate: 99.2 },
  { month: '6月', tests: 398, passRate: 98.7 },
]

const performanceRadar = [
  { metric: '测试效率', value: 95 },
  { metric: '数据准确性', value: 99 },
  { metric: '系统稳定性', value: 98 },
  { metric: '响应速度', value: 92 },
  { metric: '用户满意度', value: 96 },
  { metric: '自动化程度', value: 88 },
]

// 3D Device Model Component
function DeviceModel3D() {
  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
      
      <group rotation={[0, Date.now() * 0.0001, 0]}>
        {/* Main body */}
        <Box args={[3, 2, 1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#2a2d3a" metalness={0.8} roughness={0.2} />
        </Box>
        
        {/* Connectors */}
        <Sphere args={[0.2]} position={[-1.5, 0, 0.7]}>
          <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.2]} position={[1.5, 0, 0.7]}>
          <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
        </Sphere>
        
        {/* Status indicator */}
        <Box args={[0.5, 0.5, 0.1]} position={[0, 0, 0.55]}>
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1} />
        </Box>
      </group>
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  )
}

export default function DashboardPage() {
  const [realtimeData, setRealtimeData] = useState<any[]>([])
  const [currentStats, setCurrentStats] = useState(generateRealtimeData())

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRealtimeData()
      setCurrentStats(newData)
      setRealtimeData(prev => [...prev.slice(-19), newData].slice(-20))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    {
      title: '今日测试',
      value: '156',
      change: '+12%',
      icon: <Activity className="h-6 w-6" />,
      color: 'text-industrial-cyan',
    },
    {
      title: '合格率',
      value: '98.7%',
      change: '+0.5%',
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'text-industrial-success',
    },
    {
      title: '活跃设备',
      value: '12/20',
      change: '60%',
      icon: <Zap className="h-6 w-6" />,
      color: 'text-industrial-warning',
    },
    {
      title: '待处理告警',
      value: '3',
      change: '-2',
      icon: <AlertTriangle className="h-6 w-6" />,
      color: 'text-industrial-danger',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">数据监控大屏</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>最后更新: {currentStats.timestamp}</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="data-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={stat.color}>{stat.icon}</div>
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
          </motion.div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time monitoring */}
        <div className="lg:col-span-2 space-y-6">
          {/* Voltage and Current Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="data-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">实时电压电流监测</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={realtimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                  <XAxis dataKey="timestamp" stroke="#8b92a1" />
                  <YAxis yAxisId="left" stroke="#8b92a1" />
                  <YAxis yAxisId="right" orientation="right" stroke="#8b92a1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1d29',
                      border: '1px solid #2a2d3a',
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="voltage"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    name="电压 (V)"
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="current"
                    stroke="#00ff88"
                    strokeWidth={2}
                    name="电流 (A)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-3 bg-industrial-darker rounded-lg">
                <p className="text-2xl font-bold text-industrial-cyan">
                  {currentStats.voltage.toFixed(1)}V
                </p>
                <p className="text-sm text-gray-400">当前电压</p>
              </div>
              <div className="text-center p-3 bg-industrial-darker rounded-lg">
                <p className="text-2xl font-bold text-industrial-success">
                  {currentStats.current.toFixed(2)}A
                </p>
                <p className="text-sm text-gray-400">当前电流</p>
              </div>
            </div>
          </motion.div>

          {/* Test trends */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="data-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">测试趋势分析</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={testTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                  <XAxis dataKey="month" stroke="#8b92a1" />
                  <YAxis stroke="#8b92a1" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1d29',
                      border: '1px solid #2a2d3a',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="tests"
                    stroke="#00d4ff"
                    fill="url(#testGradient)"
                    strokeWidth={2}
                    name="测试数量"
                  />
                  <defs>
                    <linearGradient id="testGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* 3D Device Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="data-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">设备3D模型</h3>
            <div className="h-64 bg-industrial-darker rounded-lg overflow-hidden">
              <DeviceModel3D />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">型号</span>
                <span className="text-white">PVRSD-1500V</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">温度</span>
                <span className="text-industrial-success">{currentStats.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">功率</span>
                <span className="text-industrial-warning">{currentStats.power.toFixed(0)}W</span>
              </div>
            </div>
          </motion.div>

          {/* Device status pie chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="data-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">设备状态分布</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1d29',
                      border: '1px solid #2a2d3a',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {deviceStatus.map((status) => (
                <div key={status.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-gray-400">{status.name}</span>
                  </div>
                  <span className="text-white font-medium">{status.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance radar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="data-card"
          >
            <h3 className="text-lg font-semibold text-white mb-4">系统性能指标</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={performanceRadar}>
                  <PolarGrid stroke="#2a2d3a" />
                  <PolarAngleAxis dataKey="metric" stroke="#8b92a1" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#8b92a1" />
                  <Radar
                    name="性能值"
                    dataKey="value"
                    stroke="#00d4ff"
                    fill="#00d4ff"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent alarms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="data-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">最近告警</h3>
          <button className="text-sm text-industrial-cyan hover:text-industrial-success transition-colors">
            查看全部
          </button>
        </div>
        <div className="space-y-3">
          {[
            { type: 'warning', message: '设备PVRSD-003温度偏高', time: '2分钟前' },
            { type: 'critical', message: '设备PVRSD-007通信中断', time: '15分钟前' },
            { type: 'info', message: '系统备份完成', time: '1小时前' },
          ].map((alarm, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${
                alarm.type === 'critical' ? 'border-industrial-danger bg-industrial-danger/10' :
                alarm.type === 'warning' ? 'border-industrial-warning bg-industrial-warning/10' :
                'border-industrial-cyan bg-industrial-cyan/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-white">{alarm.message}</p>
                <span className="text-xs text-gray-400">{alarm.time}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}