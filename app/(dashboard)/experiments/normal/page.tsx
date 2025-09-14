'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Play,
  Pause,
  StopCircle,
  Download,
  Settings,
  Gauge,
  TrendingUp,
  Thermometer,
  Activity,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  Heatmap,
} from 'recharts'

interface OperatingConditions {
  inputPower: number
  inputVoltage: number
  inputCurrent: number
  outputVoltage: number
  outputCurrent: number
  efficiency: number
  powerFactor: number
  thd: number
  temperature: number
  loadType: 'resistive' | 'inductive' | 'capacitive'
}

interface HeatmapData {
  x: number
  y: number
  value: number
}

// Generate realistic operating data
const generateOperatingData = (time: number, power: number): OperatingConditions => {
  const inputVoltage = 800 + Math.sin(time / 10) * 50 + Math.random() * 20
  const efficiency = 0.96 - (power / 1500) * 0.02 + Math.random() * 0.01
  const inputCurrent = power / inputVoltage / efficiency
  const outputVoltage = inputVoltage * 0.95
  const outputCurrent = (power * efficiency) / outputVoltage
  const powerFactor = 0.98 - Math.random() * 0.02
  const thd = 2 + Math.random() * 1
  const temperature = 25 + (power / 1500) * 40 + Math.random() * 5
  
  return {
    inputPower: power,
    inputVoltage,
    inputCurrent,
    outputVoltage,
    outputCurrent,
    efficiency,
    powerFactor,
    thd,
    temperature,
    loadType: 'resistive',
  }
}

// Generate temperature heatmap data
const generateHeatmapData = (baseTemp: number): HeatmapData[] => {
  const data: HeatmapData[] = []
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const distance = Math.sqrt(Math.pow(x - 5, 2) + Math.pow(y - 5, 2))
      const value = baseTemp + (5 - distance) * 3 + Math.random() * 2
      data.push({ x, y, value })
    }
  }
  return data
}

export default function NormalOperationTestPage() {
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle')
  const [currentConditions, setCurrentConditions] = useState<OperatingConditions | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [efficiencyData, setEfficiencyData] = useState<any[]>([])
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [testParameters, setTestParameters] = useState({
    powerRange: { min: 0, max: 1500 },
    temperatureRange: { min: -40, max: 85 },
    voltageRange: { min: 150, max: 1500 },
    loadType: 'resistive' as const,
    testDuration: 3600,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [currentPower, setCurrentPower] = useState(750)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (testStatus === 'running') {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1
          
          // Vary power throughout test
          const power = testParameters.powerRange.min + 
            (testParameters.powerRange.max - testParameters.powerRange.min) * 
            (0.5 + 0.5 * Math.sin(newTime / 100))
          setCurrentPower(power)
          
          // Generate new operating data
          const newData = generateOperatingData(newTime, power)
          setCurrentConditions(newData)
          
          // Update time series
          const dataPoint = {
            time: newTime,
            power: newData.inputPower,
            efficiency: newData.efficiency * 100,
            temperature: newData.temperature,
            powerFactor: newData.powerFactor,
            thd: newData.thd,
          }
          setTimeSeriesData(prev => [...prev.slice(-299), dataPoint])
          
          // Update efficiency curve
          if (newTime % 10 === 0) {
            const effPoint = {
              power: newData.inputPower,
              efficiency: newData.efficiency * 100,
            }
            setEfficiencyData(prev => {
              const existing = prev.find(p => Math.abs(p.power - effPoint.power) < 50)
              if (existing) {
                return prev.map(p => 
                  Math.abs(p.power - effPoint.power) < 50 
                    ? { ...p, efficiency: (p.efficiency + effPoint.efficiency) / 2 }
                    : p
                )
              }
              return [...prev, effPoint].sort((a, b) => a.power - b.power)
            })
          }
          
          // Update heatmap
          if (newTime % 5 === 0) {
            setHeatmapData(generateHeatmapData(newData.temperature))
          }
          
          return newTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [testStatus, testParameters])

  const handleStart = () => {
    setTestStatus('running')
    setTimeSeriesData([])
    setEfficiencyData([])
    setElapsedTime(0)
  }

  const handlePause = () => {
    setTestStatus('paused')
  }

  const handleResume = () => {
    setTestStatus('running')
  }

  const handleStop = () => {
    setTestStatus('idle')
    setElapsedTime(0)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Gauge data for radial charts
  const gaugeData = [
    {
      name: 'Efficiency',
      value: currentConditions?.efficiency ? currentConditions.efficiency * 100 : 0,
      fill: '#00d4ff',
    },
  ]

  const pfData = [
    {
      name: 'Power Factor',
      value: currentConditions?.powerFactor ? currentConditions.powerFactor * 100 : 0,
      fill: '#00ff88',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-success/20 rounded-lg">
            <Activity className="h-6 w-6 text-industrial-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">正常工况试验</h1>
            <p className="text-sm text-gray-400">全功率范围性能测试与分析</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={() => {}}
            disabled={timeSeriesData.length === 0}
            className="px-4 py-2 bg-industrial-dark border border-industrial-light text-gray-400 hover:text-white hover:border-industrial-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 inline mr-2" />
            导出数据
          </button>
        </div>
      </div>

      {/* Test parameters */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">测试参数设置</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">功率范围 (W)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={testParameters.powerRange.min}
                  onChange={(e) => setTestParameters({
                    ...testParameters,
                    powerRange: { ...testParameters.powerRange, min: Number(e.target.value) }
                  })}
                  disabled={testStatus !== 'idle'}
                  className="input-industrial w-20"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={testParameters.powerRange.max}
                  onChange={(e) => setTestParameters({
                    ...testParameters,
                    powerRange: { ...testParameters.powerRange, max: Number(e.target.value) }
                  })}
                  disabled={testStatus !== 'idle'}
                  className="input-industrial w-20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">温度范围 (°C)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={testParameters.temperatureRange.min}
                  onChange={(e) => setTestParameters({
                    ...testParameters,
                    temperatureRange: { ...testParameters.temperatureRange, min: Number(e.target.value) }
                  })}
                  disabled={testStatus !== 'idle'}
                  className="input-industrial w-20"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={testParameters.temperatureRange.max}
                  onChange={(e) => setTestParameters({
                    ...testParameters,
                    temperatureRange: { ...testParameters.temperatureRange, max: Number(e.target.value) }
                  })}
                  disabled={testStatus !== 'idle'}
                  className="input-industrial w-20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">负载类型</label>
              <select
                value={testParameters.loadType}
                onChange={(e) => setTestParameters({
                  ...testParameters,
                  loadType: e.target.value as any
                })}
                disabled={testStatus !== 'idle'}
                className="input-industrial w-full"
              >
                <option value="resistive">阻性负载</option>
                <option value="inductive">感性负载</option>
                <option value="capacitive">容性负载</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">测试时长 (秒)</label>
              <input
                type="number"
                value={testParameters.testDuration}
                onChange={(e) => setTestParameters({
                  ...testParameters,
                  testDuration: Number(e.target.value)
                })}
                disabled={testStatus !== 'idle'}
                className="input-industrial w-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Control panel */}
      <div className="data-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">测试状态:</span>
              <span className={`text-sm font-medium ${
                testStatus === 'running' ? 'text-industrial-success' :
                testStatus === 'paused' ? 'text-industrial-warning' :
                testStatus === 'completed' ? 'text-industrial-cyan' :
                'text-gray-400'
              }`}>
                {testStatus === 'idle' ? '准备就绪' :
                 testStatus === 'running' ? '测试进行中' :
                 testStatus === 'paused' ? '已暂停' :
                 '测试完成'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">运行时间:</span>
              <span className="text-sm font-medium text-white">{formatTime(elapsedTime)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {testStatus === 'idle' && (
              <button
                onClick={handleStart}
                className="btn-industrial flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                开始测试
              </button>
            )}
            {testStatus === 'running' && (
              <button
                onClick={handlePause}
                className="btn-industrial flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                暂停
              </button>
            )}
            {testStatus === 'paused' && (
              <>
                <button
                  onClick={handleResume}
                  className="btn-industrial flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  继续
                </button>
                <button
                  onClick={handleStop}
                  className="px-4 py-2 bg-industrial-danger/20 border border-industrial-danger text-industrial-danger hover:bg-industrial-danger hover:text-white transition-all duration-300"
                >
                  <StopCircle className="h-4 w-4 inline mr-2" />
                  停止
                </button>
              </>
            )}
          </div>
        </div>

        {/* Power slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">当前功率</span>
            <span className="text-lg font-bold text-industrial-cyan">{currentPower.toFixed(0)} W</span>
          </div>
          <div className="relative w-full h-2 bg-industrial-darker rounded-full">
            <div
              className="absolute h-2 bg-gradient-to-r from-industrial-success via-industrial-warning to-industrial-danger rounded-full transition-all duration-300"
              style={{ width: `${(currentPower / testParameters.powerRange.max) * 100}%` }}
            />
          </div>
        </div>

        {/* Real-time parameters grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-industrial-darker rounded-lg">
            <p className="text-2xl font-bold text-industrial-cyan">
              {currentConditions?.inputVoltage.toFixed(1) || '0.0'} V
            </p>
            <p className="text-xs text-gray-400">输入电压</p>
          </div>
          <div className="text-center p-3 bg-industrial-darker rounded-lg">
            <p className="text-2xl font-bold text-industrial-success">
              {currentConditions?.inputCurrent.toFixed(2) || '0.00'} A
            </p>
            <p className="text-xs text-gray-400">输入电流</p>
          </div>
          <div className="text-center p-3 bg-industrial-darker rounded-lg">
            <p className="text-2xl font-bold text-industrial-warning">
              {currentConditions?.temperature.toFixed(1) || '0.0'} °C
            </p>
            <p className="text-xs text-gray-400">设备温度</p>
          </div>
          <div className="text-center p-3 bg-industrial-darker rounded-lg">
            <p className="text-2xl font-bold text-white">
              {currentConditions?.thd.toFixed(1) || '0.0'} %
            </p>
            <p className="text-xs text-gray-400">THD</p>
          </div>
        </div>
      </div>

      {/* Efficiency and Power Factor gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Efficiency gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">转换效率</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={gaugeData}>
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#00d4ff"
                  angleAxisId={0}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-white">
                  {gaugeData[0].value.toFixed(1)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Power Factor gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">功率因数</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={pfData}>
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill="#00ff88"
                  angleAxisId={0}
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-white">
                  {pfData[0].value.toFixed(1)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Temperature heatmap visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">温度分布</h3>
          <div className="h-48 relative">
            <div className="absolute inset-0 grid grid-cols-10 gap-0.5">
              {heatmapData.map((cell, index) => (
                <div
                  key={index}
                  className="rounded-sm"
                  style={{
                    backgroundColor: `hsl(${Math.max(0, 240 - cell.value * 2)}, 70%, 50%)`,
                    opacity: 0.8,
                  }}
                  title={`${cell.value.toFixed(1)}°C`}
                />
              ))}
            </div>
            <div className="absolute bottom-0 right-0 bg-industrial-dark/80 px-2 py-1 rounded text-xs text-gray-400">
              Max: {Math.max(...heatmapData.map(d => d.value)).toFixed(1)}°C
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time series data */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">性能参数时序图</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis 
                  dataKey="time" 
                  stroke="#8b92a1"
                  label={{ value: '时间 (s)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#8b92a1"
                  label={{ value: '功率 (W) / 温度 (°C)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#8b92a1"
                  label={{ value: '效率 (%)', angle: 90, position: 'insideRight' }}
                />
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
                  dataKey="power"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={false}
                  name="功率"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#00ff88"
                  strokeWidth={2}
                  dot={false}
                  name="效率"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff9500"
                  strokeWidth={2}
                  dot={false}
                  name="温度"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Efficiency curve */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">效率曲线</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis 
                  dataKey="power" 
                  stroke="#8b92a1"
                  label={{ value: '输出功率 (W)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#8b92a1"
                  domain={[90, 100]}
                  label={{ value: '效率 (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d29',
                    border: '1px solid #2a2d3a',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#00ff88"
                  fill="url(#efficiencyGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="efficiencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">最高效率:</span>
              <span className="ml-2 text-industrial-success font-medium">
                {efficiencyData.length > 0 ? Math.max(...efficiencyData.map(d => d.efficiency)).toFixed(2) : '0.00'}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">平均效率:</span>
              <span className="ml-2 text-white font-medium">
                {efficiencyData.length > 0 ? (efficiencyData.reduce((sum, d) => sum + d.efficiency, 0) / efficiencyData.length).toFixed(2) : '0.00'}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">最优功率:</span>
              <span className="ml-2 text-industrial-cyan font-medium">
                {efficiencyData.length > 0 ? efficiencyData.reduce((max, d) => d.efficiency > max.efficiency ? d : max, efficiencyData[0]).power.toFixed(0) : '0'} W
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}