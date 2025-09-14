'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Play,
  Pause,
  StopCircle,
  Download,
  Settings,
  Zap,
  Shield,
  Timer,
  RefreshCw,
  AlertCircle,
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
  Cell,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts'

interface FaultTest {
  id: string
  name: string
  type: 'overvoltage' | 'overcurrent' | 'shortcircuit' | 'reverse'
  status: 'pending' | 'running' | 'passed' | 'failed'
  parameters: {
    testValue: number
    duration: number
    limit: number
  }
  result?: {
    responseTime: number
    recoveryTime: number
    maxValue: number
    protection: boolean
  }
}

interface TestSequence {
  currentTest: number
  tests: FaultTest[]
}

// Generate fault response data
const generateFaultData = (time: number, faultType: string, triggered: boolean) => {
  if (!triggered) {
    return {
      time,
      voltage: 1000 + Math.random() * 10,
      current: 10 + Math.random() * 0.5,
      status: 'normal',
    }
  }
  
  const faultTime = 2 // Fault occurs at 2 seconds
  const responseTime = 0.025 // 25ms response time
  
  if (time < faultTime) {
    return {
      time,
      voltage: 1000 + Math.random() * 10,
      current: 10 + Math.random() * 0.5,
      status: 'normal',
    }
  } else if (time < faultTime + responseTime) {
    // Fault condition
    switch (faultType) {
      case 'overvoltage':
        return {
          time,
          voltage: 1500 + Math.random() * 50,
          current: 12 + Math.random() * 2,
          status: 'fault',
        }
      case 'overcurrent':
        return {
          time,
          voltage: 950 + Math.random() * 20,
          current: 30 + Math.random() * 5,
          status: 'fault',
        }
      case 'shortcircuit':
        return {
          time,
          voltage: 50 + Math.random() * 10,
          current: 100 + Math.random() * 20,
          status: 'fault',
        }
      default:
        return {
          time,
          voltage: -1000 + Math.random() * 50,
          current: -10 + Math.random() * 2,
          status: 'fault',
        }
    }
  } else {
    // Protection activated
    return {
      time,
      voltage: 0,
      current: 0,
      status: 'protected',
    }
  }
}

export default function AbnormalOperationTestPage() {
  const [testSequence, setTestSequence] = useState<TestSequence>({
    currentTest: -1,
    tests: [
      {
        id: '1',
        name: '过压保护测试',
        type: 'overvoltage',
        status: 'pending',
        parameters: { testValue: 1500, duration: 10, limit: 30 },
      },
      {
        id: '2',
        name: '过流保护测试',
        type: 'overcurrent',
        status: 'pending',
        parameters: { testValue: 30, duration: 10, limit: 30 },
      },
      {
        id: '3',
        name: '短路保护测试',
        type: 'shortcircuit',
        status: 'pending',
        parameters: { testValue: 0, duration: 5, limit: 30 },
      },
      {
        id: '4',
        name: '反接保护测试',
        type: 'reverse',
        status: 'pending',
        parameters: { testValue: -1000, duration: 10, limit: 30 },
      },
    ],
  })
  
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle')
  const [currentTestData, setCurrentTestData] = useState<any[]>([])
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [lifetimeTestCount, setLifetimeTestCount] = useState(0)
  const [lifetimeTestTarget, setLifetimeTestTarget] = useState(10000)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (testStatus === 'running' && testSequence.currentTest >= 0) {
      const currentTest = testSequence.tests[testSequence.currentTest]
      
      intervalRef.current = setInterval(() => {
        setElapsedTime(prev => {
          const newTime = prev + 0.1 // 100ms intervals for better resolution
          
          // Generate test data
          const data = generateFaultData(newTime, currentTest.type, true)
          setCurrentTestData(prevData => [...prevData.slice(-99), data])
          
          // Check if test is complete
          if (newTime >= currentTest.parameters.duration) {
            // Calculate test results
            const faultData = currentTestData.filter(d => d.status === 'fault')
            const protectedData = currentTestData.filter(d => d.status === 'protected')
            
            const result = {
              responseTime: protectedData.length > 0 ? 25 : 0,
              recoveryTime: 100,
              maxValue: Math.max(...faultData.map(d => 
                currentTest.type === 'overcurrent' ? d.current : d.voltage
              )),
              protection: protectedData.length > 0,
            }
            
            // Update test status
            setTestSequence(prev => ({
              ...prev,
              tests: prev.tests.map(t => 
                t.id === currentTest.id 
                  ? { ...t, status: result.protection ? 'passed' : 'failed', result }
                  : t
              ),
            }))
            
            // Move to next test
            if (testSequence.currentTest < testSequence.tests.length - 1) {
              setTestSequence(prev => ({ ...prev, currentTest: prev.currentTest + 1 }))
              setCurrentTestData([])
              return 0 // Reset timer for next test
            } else {
              setTestStatus('completed')
            }
          }
          
          return newTime
        })
      }, 100)
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
  }, [testStatus, testSequence.currentTest, currentTestData])

  const handleStart = () => {
    setTestStatus('running')
    setTestSequence(prev => ({
      ...prev,
      currentTest: 0,
      tests: prev.tests.map(t => ({ ...t, status: 'pending', result: undefined })),
    }))
    setCurrentTestData([])
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
    setTestSequence(prev => ({ ...prev, currentTest: -1 }))
    setElapsedTime(0)
  }

  const handleLifetimeTest = () => {
    // Simulate lifetime test
    const interval = setInterval(() => {
      setLifetimeTestCount(prev => {
        if (prev >= lifetimeTestTarget - 1) {
          clearInterval(interval)
          return lifetimeTestTarget
        }
        return prev + 1
      })
    }, 10)
  }

  // Calculate overall test progress
  const overallProgress = testSequence.currentTest >= 0 
    ? ((testSequence.currentTest + (elapsedTime / (testSequence.tests[testSequence.currentTest]?.parameters.duration || 1))) / testSequence.tests.length) * 100
    : 0

  // Lifetime test progress
  const lifetimeProgress = (lifetimeTestCount / lifetimeTestTarget) * 100

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-danger/20 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-industrial-danger" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">非正常工况试验</h1>
            <p className="text-sm text-gray-400">故障模拟与保护功能验证</p>
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
            disabled={testSequence.tests.every(t => t.status === 'pending')}
            className="px-4 py-2 bg-industrial-dark border border-industrial-light text-gray-400 hover:text-white hover:border-industrial-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 inline mr-2" />
            导出报告
          </button>
        </div>
      </div>

      {/* Test sequence overview */}
      <div className="data-card">
        <h3 className="text-lg font-semibold text-white mb-4">测试序列</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testSequence.tests.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                test.status === 'running' ? 'border-industrial-cyan bg-industrial-cyan/10' :
                test.status === 'passed' ? 'border-industrial-success bg-industrial-success/10' :
                test.status === 'failed' ? 'border-industrial-danger bg-industrial-danger/10' :
                'border-industrial-light bg-industrial-darker'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded ${
                  test.type === 'overvoltage' ? 'bg-industrial-warning/20' :
                  test.type === 'overcurrent' ? 'bg-industrial-danger/20' :
                  test.type === 'shortcircuit' ? 'bg-industrial-danger/30' :
                  'bg-industrial-cyan/20'
                }`}>
                  {test.type === 'overvoltage' ? <Zap className="h-4 w-4 text-industrial-warning" /> :
                   test.type === 'overcurrent' ? <AlertCircle className="h-4 w-4 text-industrial-danger" /> :
                   test.type === 'shortcircuit' ? <AlertTriangle className="h-4 w-4 text-industrial-danger" /> :
                   <Shield className="h-4 w-4 text-industrial-cyan" />}
                </div>
                <div className={`status-indicator ${
                  test.status === 'running' ? 'status-active' :
                  test.status === 'passed' ? 'bg-industrial-success' :
                  test.status === 'failed' ? 'bg-industrial-danger' :
                  'bg-gray-600'
                }`} />
              </div>
              <h4 className="text-sm font-medium text-white mb-1">{test.name}</h4>
              <p className="text-xs text-gray-400">
                {test.type === 'overvoltage' ? `${test.parameters.testValue}V` :
                 test.type === 'overcurrent' ? `${test.parameters.testValue}A` :
                 test.type === 'shortcircuit' ? '输出短路' :
                 '极性反接'}
              </p>
              {test.result && (
                <div className="mt-2 pt-2 border-t border-industrial-light">
                  <p className="text-xs text-gray-400">
                    响应: <span className="text-white">{test.result.responseTime}ms</span>
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Overall progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">总体进度</span>
            <span className="text-sm font-medium text-white">{overallProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-industrial-darker rounded-full h-2">
            <div
              className="bg-gradient-to-r from-industrial-cyan to-industrial-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test control */}
        <div className="data-card">
          <h3 className="text-lg font-semibold text-white mb-4">测试控制</h3>
          <div className="flex items-center gap-3 mb-6">
            {testStatus === 'idle' && (
              <button
                onClick={handleStart}
                className="btn-industrial flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                开始测试序列
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
                <RefreshCw className="h-4 w-4" />
                重新测试
              </button>
            )}
          </div>
          
          {testSequence.currentTest >= 0 && (
            <div className="space-y-3">
              <div className="p-3 bg-industrial-darker rounded-lg">
                <p className="text-sm text-gray-400">当前测试</p>
                <p className="text-lg font-medium text-white">
                  {testSequence.tests[testSequence.currentTest]?.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-industrial-darker rounded-lg">
                  <p className="text-sm text-gray-400">测试时间</p>
                  <p className="text-lg font-medium text-industrial-cyan">
                    {elapsedTime.toFixed(1)}s / {testSequence.tests[testSequence.currentTest]?.parameters.duration}s
                  </p>
                </div>
                <div className="p-3 bg-industrial-darker rounded-lg">
                  <p className="text-sm text-gray-400">限值要求</p>
                  <p className="text-lg font-medium text-industrial-warning">
                    {testSequence.tests[testSequence.currentTest]?.parameters.limit}ms
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lifetime test */}
        <div className="data-card">
          <h3 className="text-lg font-semibold text-white mb-4">寿命测试</h3>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">测试次数</span>
              <span className="text-sm font-medium text-white">
                {lifetimeTestCount} / {lifetimeTestTarget}
              </span>
            </div>
            <div className="w-full bg-industrial-darker rounded-full h-2">
              <div
                className="bg-gradient-to-r from-industrial-cyan to-industrial-success h-2 rounded-full transition-all duration-300"
                style={{ width: `${lifetimeProgress}%` }}
              />
            </div>
          </div>
          
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{ value: lifetimeProgress, fill: '#00d4ff' }]}>
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
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-white">
                  {lifetimeProgress.toFixed(0)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          
          <button
            onClick={handleLifetimeTest}
            disabled={lifetimeTestCount > 0 && lifetimeTestCount < lifetimeTestTarget}
            className="w-full btn-industrial flex items-center justify-center gap-2 mt-4"
          >
            <Timer className="h-4 w-4" />
            {lifetimeTestCount === 0 ? '开始寿命测试' : 
             lifetimeTestCount >= lifetimeTestTarget ? '测试完成' : '测试进行中...'}
          </button>
        </div>
      </div>

      {/* Real-time chart */}
      {testSequence.currentTest >= 0 && currentTestData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">实时响应曲线</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentTestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis 
                  dataKey="time" 
                  stroke="#8b92a1"
                  label={{ value: '时间 (s)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#8b92a1"
                  label={{ value: '电压 (V)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#8b92a1"
                  label={{ value: '电流 (A)', angle: 90, position: 'insideRight' }}
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
                  dataKey="voltage"
                  stroke="#00d4ff"
                  strokeWidth={2}
                  dot={false}
                  name="电压"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="current"
                  stroke="#ff9500"
                  strokeWidth={2}
                  dot={false}
                  name="电流"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Fault indicators */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-industrial-success rounded-full" />
              <span className="text-gray-400">正常运行</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-industrial-danger rounded-full" />
              <span className="text-gray-400">故障发生</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-industrial-cyan rounded-full" />
              <span className="text-gray-400">保护动作</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Test results summary */}
      {testStatus === 'completed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">测试结果汇总</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-industrial-light">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">测试项目</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">测试值</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">响应时间</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">恢复时间</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">保护状态</th>
                  <th className="text-center py-3 px-4 text-gray-400 font-medium">判定</th>
                </tr>
              </thead>
              <tbody>
                {testSequence.tests.map(test => (
                  <tr key={test.id} className="border-b border-industrial-light/50">
                    <td className="py-3 px-4 text-white">{test.name}</td>
                    <td className="py-3 px-4 text-center text-gray-300">
                      {test.type === 'overvoltage' ? `${test.parameters.testValue}V` :
                       test.type === 'overcurrent' ? `${test.parameters.testValue}A` :
                       test.type === 'shortcircuit' ? '短路' : '反接'}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-300">
                      {test.result?.responseTime || '-'} ms
                    </td>
                    <td className="py-3 px-4 text-center text-gray-300">
                      {test.result?.recoveryTime || '-'} ms
                    </td>
                    <td className="py-3 px-4 text-center">
                      {test.result?.protection ? (
                        <span className="text-industrial-success">已触发</span>
                      ) : (
                        <span className="text-industrial-danger">未触发</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {test.status === 'passed' ? (
                        <span className="px-2 py-1 bg-industrial-success/20 text-industrial-success rounded">合格</span>
                      ) : test.status === 'failed' ? (
                        <span className="px-2 py-1 bg-industrial-danger/20 text-industrial-danger rounded">不合格</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-400">总体判定:</span>
              <span className={`ml-2 font-medium ${
                testSequence.tests.every(t => t.status === 'passed') ? 'text-industrial-success' : 'text-industrial-danger'
              }`}>
                {testSequence.tests.every(t => t.status === 'passed') ? '全部合格' : '存在不合格项'}
              </span>
            </div>
            <button className="btn-industrial">
              生成测试报告
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}