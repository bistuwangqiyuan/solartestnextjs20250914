'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  Play,
  Pause,
  StopCircle,
  Download,
  AlertTriangle,
  Settings,
  FileText,
  TrendingUp,
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
  Area,
  AreaChart,
  ReferenceLine,
} from 'recharts'

interface TestParameter {
  voltageLevel: number
  testDuration: number
  rampRate: number
  standard: string
}

interface TestData {
  time: number
  voltage: number
  current: number
  resistance: number
  temperature: number
}

// Generate mock test data
const generateTestData = (seconds: number): TestData => {
  const voltage = Math.min(1500, seconds * 50 + Math.random() * 10)
  const current = (0.001 + Math.random() * 0.0001) * (voltage / 1000)
  const resistance = voltage / current / 1000000 // MΩ
  const temperature = 25 + Math.random() * 2 + seconds * 0.01

  return {
    time: seconds,
    voltage,
    current: current * 1000, // Convert to mA
    resistance,
    temperature,
  }
}

export default function HighVoltageTestPage() {
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle')
  const [testData, setTestData] = useState<TestData[]>([])
  const [currentData, setCurrentData] = useState<TestData | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [parameters, setParameters] = useState<TestParameter>({
    voltageLevel: 1000,
    testDuration: 60,
    rampRate: 100,
    standard: 'IEC-62109-1',
  })
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (testStatus === 'running') {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1
          const newData = generateTestData(newTime)
          setCurrentData(newData)
          setTestData(prevData => [...prevData, newData])
          
          // Auto stop when reaching test duration
          if (newTime >= parameters.testDuration) {
            setTestStatus('completed')
            return prev
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
  }, [testStatus, parameters.testDuration])

  const handleStart = () => {
    setTestStatus('running')
    setTestData([])
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

  const handleExport = () => {
    // Mock export functionality
    const dataStr = JSON.stringify(testData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `high_voltage_test_${new Date().toISOString()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-cyan/20 rounded-lg">
            <Zap className="h-6 w-6 text-industrial-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">高压试验</h1>
            <p className="text-sm text-gray-400">绝缘强度和耐压测试</p>
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
            onClick={handleExport}
            disabled={testData.length === 0}
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
              <label className="block text-sm text-gray-400 mb-2">电压等级 (V)</label>
              <select
                value={parameters.voltageLevel}
                onChange={(e) => setParameters({ ...parameters, voltageLevel: Number(e.target.value) })}
                disabled={testStatus !== 'idle'}
                className="input-industrial w-full"
              >
                <option value={600}>600V DC</option>
                <option value={1000}>1000V DC</option>
                <option value={1500}>1500V DC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">测试时长 (秒)</label>
              <select
                value={parameters.testDuration}
                onChange={(e) => setParameters({ ...parameters, testDuration: Number(e.target.value) })}
                disabled={testStatus !== 'idle'}
                className="input-industrial w-full"
              >
                <option value={60}>1分钟</option>
                <option value={300}>5分钟</option>
                <option value={3600}>60分钟</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">升压速率 (V/s)</label>
              <input
                type="number"
                value={parameters.rampRate}
                onChange={(e) => setParameters({ ...parameters, rampRate: Number(e.target.value) })}
                disabled={testStatus !== 'idle'}
                min={100}
                max={500}
                step={50}
                className="input-industrial w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">测试标准</label>
              <select
                value={parameters.standard}
                onChange={(e) => setParameters({ ...parameters, standard: e.target.value })}
                disabled={testStatus !== 'idle'}
                className="input-industrial w-full"
              >
                <option value="IEC-62109-1">IEC 62109-1</option>
                <option value="UL-1741-SA">UL 1741 SA</option>
              </select>
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
              <span className="text-sm text-gray-400">进度:</span>
              <span className="text-sm font-medium text-white">
                {formatTime(elapsedTime)} / {formatTime(parameters.testDuration)}
              </span>
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
            {testStatus === 'completed' && (
              <button
                onClick={handleStop}
                className="btn-industrial flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                新测试
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-industrial-darker rounded-full h-2 mb-6">
          <div
            className="bg-gradient-to-r from-industrial-cyan to-industrial-success h-2 rounded-full transition-all duration-300"
            style={{ width: `${(elapsedTime / parameters.testDuration) * 100}%` }}
          />
        </div>

        {/* Real-time values */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-industrial-darker rounded-lg">
            <p className="text-3xl font-bold text-industrial-cyan">
              {currentData?.voltage.toFixed(1) || '0.0'}
            </p>
            <p className="text-sm text-gray-400">电压 (V)</p>
          </div>
          <div className="text-center p-4 bg-industrial-darker rounded-lg">
            <p className="text-3xl font-bold text-industrial-success">
              {currentData?.current.toFixed(3) || '0.000'}
            </p>
            <p className="text-sm text-gray-400">泄漏电流 (mA)</p>
          </div>
          <div className="text-center p-4 bg-industrial-darker rounded-lg">
            <p className="text-3xl font-bold text-industrial-warning">
              {currentData?.resistance.toFixed(1) || '0.0'}
            </p>
            <p className="text-sm text-gray-400">绝缘电阻 (MΩ)</p>
          </div>
          <div className="text-center p-4 bg-industrial-darker rounded-lg">
            <p className="text-3xl font-bold text-white">
              {currentData?.temperature.toFixed(1) || '0.0'}
            </p>
            <p className="text-sm text-gray-400">温度 (°C)</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Voltage vs Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">电压-时间曲线</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={testData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis 
                  dataKey="time" 
                  stroke="#8b92a1"
                  label={{ value: '时间 (s)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#8b92a1"
                  label={{ value: '电压 (V)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d29',
                    border: '1px solid #2a2d3a',
                  }}
                />
                <ReferenceLine y={parameters.voltageLevel} stroke="#ff9500" strokeDasharray="5 5" />
                <Area
                  type="monotone"
                  dataKey="voltage"
                  stroke="#00d4ff"
                  fill="url(#voltageGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Leakage Current vs Time */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">泄漏电流曲线</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={testData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis 
                  dataKey="time" 
                  stroke="#8b92a1"
                  label={{ value: '时间 (s)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#8b92a1"
                  label={{ value: '电流 (mA)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d29',
                    border: '1px solid #2a2d3a',
                  }}
                />
                <ReferenceLine y={5} stroke="#ff3b30" strokeDasharray="5 5" label="限值" />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#00ff88"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Test summary */}
      {testStatus === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">测试结果摘要</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm text-gray-400 mb-3">测试信息</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">测试标准</span>
                  <span className="text-white">{parameters.standard}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">测试电压</span>
                  <span className="text-white">{parameters.voltageLevel}V DC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">测试时长</span>
                  <span className="text-white">{formatTime(elapsedTime)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-400 mb-3">测试结果</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">最大泄漏电流</span>
                  <span className="text-industrial-success">
                    {Math.max(...testData.map(d => d.current)).toFixed(3)} mA
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">最小绝缘电阻</span>
                  <span className="text-industrial-warning">
                    {Math.min(...testData.map(d => d.resistance)).toFixed(1)} MΩ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">测试判定</span>
                  <span className="text-industrial-success font-medium">合格</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-400 mb-3">操作</h4>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-industrial-cyan/20 text-industrial-cyan hover:bg-industrial-cyan hover:text-industrial-dark transition-all duration-300">
                  生成报告
                </button>
                <button className="w-full px-4 py-2 bg-industrial-dark border border-industrial-light text-gray-400 hover:text-white hover:border-industrial-cyan transition-all duration-300">
                  保存数据
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}