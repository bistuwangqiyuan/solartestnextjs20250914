'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Play,
  Pause,
  StopCircle,
  Download,
  Settings,
  FileText,
  Thermometer,
  Droplets,
  Wind,
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
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'

interface TestChannel {
  id: number
  name: string
  enabled: boolean
  current: number
  status: 'normal' | 'warning' | 'danger'
}

interface EnvironmentalConditions {
  temperature: number
  humidity: number
  pressure: number
}

interface FFTData {
  frequency: number
  amplitude: number
}

// Generate mock leakage current data
const generateLeakageData = (channel: number, time: number) => {
  const baseLeakage = 0.1 + Math.random() * 0.05
  const variation = Math.sin(time / 10) * 0.02 + Math.random() * 0.01
  const temperature = 25 + Math.sin(time / 30) * 5
  const temperatureEffect = (temperature - 25) * 0.001
  
  return baseLeakage + variation + temperatureEffect + channel * 0.01
}

// Generate FFT spectrum data
const generateFFTData = (): FFTData[] => {
  const data: FFTData[] = []
  const frequencies = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500]
  
  frequencies.forEach(freq => {
    const amplitude = freq === 50 ? 0.8 + Math.random() * 0.2 :
                     freq === 100 ? 0.3 + Math.random() * 0.1 :
                     Math.random() * 0.1
    data.push({ frequency: freq, amplitude })
  })
  
  return data
}

export default function LeakageCurrentTestPage() {
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle')
  const [channels, setChannels] = useState<TestChannel[]>([
    { id: 1, name: '通道1 - L1', enabled: true, current: 0, status: 'normal' },
    { id: 2, name: '通道2 - L2', enabled: true, current: 0, status: 'normal' },
    { id: 3, name: '通道3 - L3', enabled: true, current: 0, status: 'normal' },
    { id: 4, name: '通道4 - N', enabled: true, current: 0, status: 'normal' },
  ])
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([])
  const [fftData, setFftData] = useState<FFTData[]>([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [environmental, setEnvironmental] = useState<EnvironmentalConditions>({
    temperature: 25,
    humidity: 65,
    pressure: 101.3,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [testVoltage, setTestVoltage] = useState(1100) // 110% of rated voltage
  const [accuracy, setAccuracy] = useState(0.1) // μA
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (testStatus === 'running') {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 1
          
          // Update channel currents
          const updatedChannels = channels.map(channel => {
            if (channel.enabled) {
              const current = generateLeakageData(channel.id, newTime)
              const status: 'normal' | 'warning' | 'danger' = current > 5 ? 'danger' : current > 3 ? 'warning' : 'normal'
              return { ...channel, current, status }
            }
            return channel
          })
          setChannels(updatedChannels)
          
          // Update time series data
          const newDataPoint: any = {
            time: newTime,
            timestamp: new Date().toLocaleTimeString(),
          }
          updatedChannels.forEach(channel => {
            if (channel.enabled) {
              newDataPoint[`channel${channel.id}`] = channel.current
            }
          })
          setTimeSeriesData(prev => [...prev.slice(-59), newDataPoint])
          
          // Update environmental conditions
          setEnvironmental({
            temperature: 25 + Math.sin(newTime / 30) * 5 + Math.random() * 0.5,
            humidity: 65 + Math.sin(newTime / 40) * 10 + Math.random() * 2,
            pressure: 101.3 + Math.sin(newTime / 50) * 0.5 + Math.random() * 0.1,
          })
          
          // Update FFT data every 5 seconds
          if (newTime % 5 === 0) {
            setFftData(generateFFTData())
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
  }, [testStatus, channels])

  const handleStart = () => {
    setTestStatus('running')
    setTimeSeriesData([])
    setElapsedTime(0)
    setFftData(generateFFTData())
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

  const toggleChannel = (id: number) => {
    setChannels(prev => prev.map(ch => 
      ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
    ))
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate statistics
  const calculateStats = () => {
    if (timeSeriesData.length === 0) return null
    
    const stats: any = {}
    channels.forEach(channel => {
      if (channel.enabled) {
        const values = timeSeriesData.map(d => d[`channel${channel.id}`]).filter(v => v !== undefined)
        if (values.length > 0) {
          stats[`channel${channel.id}`] = {
            max: Math.max(...values),
            min: Math.min(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            std: Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - (values.reduce((a, b) => a + b, 0) / values.length), 2), 0) / values.length),
          }
        }
      }
    })
    return stats
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-cyan/20 rounded-lg">
            <Activity className="h-6 w-6 text-industrial-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">泄漏电流试验</h1>
            <p className="text-sm text-gray-400">多通道高精度泄漏电流测量</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">测试电压 (V)</label>
              <input
                type="number"
                value={testVoltage}
                onChange={(e) => setTestVoltage(Number(e.target.value))}
                disabled={testStatus !== 'idle'}
                className="input-industrial w-full"
              />
              <p className="text-xs text-gray-500 mt-1">工作电压的110%</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">测量精度 (μA)</label>
              <select
                value={accuracy}
                onChange={(e) => setAccuracy(Number(e.target.value))}
                disabled={testStatus !== 'idle'}
                className="input-industrial w-full"
              >
                <option value={0.1}>0.1 μA</option>
                <option value={0.01}>0.01 μA</option>
                <option value={0.001}>0.001 μA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">测试标准</label>
              <select
                disabled={testStatus !== 'idle'}
                className="input-industrial w-full"
              >
                <option>IEC 62109-1</option>
                <option>UL 1741 SA</option>
                <option>GB/T 37408</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Environmental conditions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="data-card flex items-center gap-4"
        >
          <div className="p-3 bg-industrial-warning/20 rounded-lg">
            <Thermometer className="h-6 w-6 text-industrial-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{environmental.temperature.toFixed(1)}°C</p>
            <p className="text-sm text-gray-400">环境温度</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="data-card flex items-center gap-4"
        >
          <div className="p-3 bg-industrial-cyan/20 rounded-lg">
            <Droplets className="h-6 w-6 text-industrial-cyan" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{environmental.humidity.toFixed(1)}%</p>
            <p className="text-sm text-gray-400">相对湿度</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="data-card flex items-center gap-4"
        >
          <div className="p-3 bg-industrial-success/20 rounded-lg">
            <Wind className="h-6 w-6 text-industrial-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{environmental.pressure.toFixed(1)} kPa</p>
            <p className="text-sm text-gray-400">大气压力</p>
          </div>
        </motion.div>
      </div>

      {/* Control panel & Channel status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control panel */}
        <div className="data-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">测试控制</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">运行时间:</span>
              <span className="text-sm font-medium text-white">{formatTime(elapsedTime)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-6">
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
          
          {/* Channel toggles */}
          <div className="space-y-3">
            {channels.map(channel => (
              <div key={channel.id} className="flex items-center justify-between p-3 bg-industrial-darker rounded-lg">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleChannel(channel.id)}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      channel.enabled ? 'bg-industrial-cyan' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      channel.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="text-sm text-white">{channel.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${
                    channel.status === 'danger' ? 'text-industrial-danger' :
                    channel.status === 'warning' ? 'text-industrial-warning' :
                    'text-industrial-success'
                  }`}>
                    {channel.current.toFixed(3)} mA
                  </span>
                  <div className={`status-indicator ${
                    channel.status === 'danger' ? 'status-danger' :
                    channel.status === 'warning' ? 'status-warning' :
                    'status-active'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="data-card">
          <h3 className="text-lg font-semibold text-white mb-6">统计分析</h3>
          {stats ? (
            <div className="space-y-4">
              {channels.filter(ch => ch.enabled).map(channel => {
                const channelStats = stats[`channel${channel.id}`]
                if (!channelStats) return null
                
                return (
                  <div key={channel.id} className="p-4 bg-industrial-darker rounded-lg">
                    <h4 className="text-sm font-medium text-white mb-3">{channel.name}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">最大值:</span>
                        <span className="ml-2 text-white">{channelStats.max.toFixed(3)} mA</span>
                      </div>
                      <div>
                        <span className="text-gray-400">最小值:</span>
                        <span className="ml-2 text-white">{channelStats.min.toFixed(3)} mA</span>
                      </div>
                      <div>
                        <span className="text-gray-400">平均值:</span>
                        <span className="ml-2 text-white">{channelStats.avg.toFixed(3)} mA</span>
                      </div>
                      <div>
                        <span className="text-gray-400">标准差:</span>
                        <span className="ml-2 text-white">{channelStats.std.toFixed(3)} mA</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              开始测试后将显示统计数据
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time series */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">泄漏电流趋势</h3>
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
                  stroke="#8b92a1"
                  label={{ value: '电流 (mA)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d29',
                    border: '1px solid #2a2d3a',
                  }}
                />
                <Legend />
                {channels.filter(ch => ch.enabled).map((channel, index) => (
                  <Line
                    key={channel.id}
                    type="monotone"
                    dataKey={`channel${channel.id}`}
                    name={channel.name}
                    stroke={['#00d4ff', '#00ff88', '#ff9500', '#ff3b30'][index]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* FFT Analysis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">FFT频谱分析</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fftData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis 
                  dataKey="frequency" 
                  stroke="#8b92a1"
                  label={{ value: '频率 (Hz)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#8b92a1"
                  label={{ value: '幅值', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d29',
                    border: '1px solid #2a2d3a',
                  }}
                />
                <Bar dataKey="amplitude" fill="#00d4ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>主要频率成分: 50Hz (工频) 及其谐波</p>
          </div>
        </motion.div>
      </div>

      {/* Temperature compensation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="data-card"
      >
        <h3 className="text-lg font-semibold text-white mb-4">温度补偿分析</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
              <XAxis 
                dataKey="temperature"
                type="number"
                domain={[20, 30]}
                stroke="#8b92a1"
                label={{ value: '温度 (°C)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                dataKey="current"
                type="number"
                stroke="#8b92a1"
                label={{ value: '泄漏电流 (mA)', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis dataKey="time" range={[50, 200]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1d29',
                  border: '1px solid #2a2d3a',
                }}
              />
              <Scatter
                name="测量值"
                data={timeSeriesData.map((d, i) => ({
                  temperature: 25 + Math.sin(i / 30) * 5,
                  current: d.channel1 || 0,
                  time: i
                }))}
                fill="#00d4ff"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-industrial-darker rounded-lg">
          <p className="text-sm text-gray-400 mb-2">温度系数: 0.2%/°C</p>
          <p className="text-sm text-gray-400">标准化温度: 25°C</p>
        </div>
      </motion.div>
    </div>
  )
}