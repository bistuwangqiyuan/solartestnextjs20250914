'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  PlayCircle,
  Pause,
  RefreshCw,
  Download,
  Settings,
  Cpu,
  Layers,
  Sliders,
  GitBranch,
  BarChart3,
  Maximize2,
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
  ScatterChart,
  Scatter,
  ZAxis,
  Surface,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Cylinder, Text, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Circuit component for 3D visualization
function CircuitComponent({ temperature }: { temperature: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })
  
  // Color based on temperature
  const color = temperature > 80 ? '#ff3b30' : temperature > 60 ? '#ff9500' : '#00ff88'
  
  return (
    <group ref={meshRef}>
      {/* Main body */}
      <Box args={[4, 2, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2a2d3a" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Heat sink */}
      {[...Array(5)].map((_, i) => (
        <Box key={i} args={[0.2, 1.5, 0.8]} position={[i * 0.8 - 1.6, 1.5, 0]}>
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </Box>
      ))}
      
      {/* Capacitors */}
      <Cylinder args={[0.3, 0.3, 0.8]} position={[-1, 0, 0.8]}>
        <meshStandardMaterial color="#1a1d29" />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.8]} position={[1, 0, 0.8]}>
        <meshStandardMaterial color="#1a1d29" />
      </Cylinder>
      
      {/* MOSFETs */}
      <Box args={[0.5, 0.5, 0.1]} position={[-0.5, 0, 0.6]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
      </Box>
      <Box args={[0.5, 0.5, 0.1]} position={[0.5, 0, 0.6]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
      </Box>
      
      {/* Temperature indicator */}
      <Sphere args={[0.2]} position={[0, -1.5, 0]}>
        <MeshWobbleMaterial color={color} emissive={color} emissiveIntensity={0.8} speed={2} factor={0.1} />
      </Sphere>
      
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {temperature.toFixed(1)}°C
      </Text>
    </group>
  )
}

// Generate simulation data
const generateSimulationData = (params: any) => {
  const data = []
  for (let i = 0; i <= 100; i++) {
    const load = i
    const efficiency = 96 - (load / 100) * 2 - Math.pow((load - 50) / 50, 2) * params.lossFactor
    const temperature = 25 + (load / 100) * 40 * params.thermalResistance
    const stress = load * params.voltageStress / 100
    
    data.push({
      load,
      efficiency,
      temperature,
      stress,
      power: load * 15, // 1500W max
    })
  }
  return data
}

// Monte Carlo simulation data
const generateMonteCarloData = (iterations: number) => {
  const data = []
  for (let i = 0; i < iterations; i++) {
    const efficiency = 94 + Math.random() * 4
    const lifetime = 20000 + Math.random() * 10000
    const failureRate = 0.001 + Math.random() * 0.003
    
    data.push({
      efficiency,
      lifetime,
      failureRate,
      reliability: Math.exp(-failureRate * 10),
    })
  }
  return data
}

// Optimization parameters
const parameters = [
  { name: '开关频率', value: 85, unit: 'kHz', min: 20, max: 200 },
  { name: '死区时间', value: 75, unit: 'ns', min: 50, max: 200 },
  { name: '栅极电阻', value: 90, unit: 'Ω', min: 10, max: 100 },
  { name: '输出电容', value: 80, unit: 'μF', min: 100, max: 1000 },
  { name: '电感值', value: 95, unit: 'μH', min: 10, max: 100 },
  { name: '散热系数', value: 70, unit: 'K/W', min: 0.5, max: 2 },
]

export default function SimulationPage() {
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle')
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [simulationParams, setSimulationParams] = useState({
    lossFactor: 1,
    thermalResistance: 1,
    voltageStress: 1,
    iterations: 1000,
  })
  const [showSettings, setShowSettings] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'circuit' | 'thermal' | 'mechanical' | 'emc'>('circuit')
  const [temperature, setTemperature] = useState(25)
  const [simulationData, setSimulationData] = useState<any[]>([])
  const [monteCarloData, setMonteCarloData] = useState<any[]>([])
  const [optimizationResults, setOptimizationResults] = useState(parameters)
  
  useEffect(() => {
    if (simulationStatus === 'running') {
      const interval = setInterval(() => {
        setSimulationProgress(prev => {
          if (prev >= 100) {
            setSimulationStatus('completed')
            return 100
          }
          return prev + 1
        })
        
        // Update temperature based on progress
        setTemperature(25 + (simulationProgress / 100) * 60 + Math.random() * 5)
        
        // Generate simulation data at certain intervals
        if (simulationProgress % 20 === 0) {
          setSimulationData(generateSimulationData(simulationParams))
          setMonteCarloData(generateMonteCarloData(simulationParams.iterations))
        }
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [simulationStatus, simulationProgress, simulationParams])
  
  const handleStart = () => {
    setSimulationStatus('running')
    setSimulationProgress(0)
    setSimulationData(generateSimulationData(simulationParams))
    setMonteCarloData(generateMonteCarloData(simulationParams.iterations))
  }
  
  const handlePause = () => {
    setSimulationStatus('paused')
  }
  
  const handleResume = () => {
    setSimulationStatus('running')
  }
  
  const handleReset = () => {
    setSimulationStatus('idle')
    setSimulationProgress(0)
    setTemperature(25)
  }
  
  const handleOptimize = () => {
    // Simulate parameter optimization
    setOptimizationResults(parameters.map(param => ({
      ...param,
      value: Math.min(param.max, Math.max(param.min, param.value + (Math.random() - 0.5) * 20))
    })))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-cyan/20 rounded-lg">
            <Cpu className="h-6 w-6 text-industrial-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">实验仿真</h1>
            <p className="text-sm text-gray-400">电路仿真、热仿真与参数优化</p>
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
            disabled={simulationData.length === 0}
            className="px-4 py-2 bg-industrial-dark border border-industrial-light text-gray-400 hover:text-white hover:border-industrial-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 inline mr-2" />
            导出结果
          </button>
        </div>
      </div>

      {/* Simulation settings */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">仿真参数设置</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">损耗因子</label>
              <input
                type="number"
                value={simulationParams.lossFactor}
                onChange={(e) => setSimulationParams({ ...simulationParams, lossFactor: Number(e.target.value) })}
                disabled={simulationStatus !== 'idle'}
                min={0.5}
                max={2}
                step={0.1}
                className="input-industrial w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">热阻系数</label>
              <input
                type="number"
                value={simulationParams.thermalResistance}
                onChange={(e) => setSimulationParams({ ...simulationParams, thermalResistance: Number(e.target.value) })}
                disabled={simulationStatus !== 'idle'}
                min={0.5}
                max={2}
                step={0.1}
                className="input-industrial w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">电压应力</label>
              <input
                type="number"
                value={simulationParams.voltageStress}
                onChange={(e) => setSimulationParams({ ...simulationParams, voltageStress: Number(e.target.value) })}
                disabled={simulationStatus !== 'idle'}
                min={0.8}
                max={1.2}
                step={0.05}
                className="input-industrial w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">蒙特卡洛迭代次数</label>
              <select
                value={simulationParams.iterations}
                onChange={(e) => setSimulationParams({ ...simulationParams, iterations: Number(e.target.value) })}
                disabled={simulationStatus !== 'idle'}
                className="input-industrial w-full"
              >
                <option value={100}>100</option>
                <option value={1000}>1,000</option>
                <option value={10000}>10,000</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Model selection and control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Model viewer */}
        <div className="lg:col-span-2 data-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">3D仿真模型</h3>
            <div className="flex items-center gap-2">
              {[
                { id: 'circuit', name: '电路', icon: <Cpu className="h-4 w-4" /> },
                { id: 'thermal', name: '热仿真', icon: <Layers className="h-4 w-4" /> },
                { id: 'mechanical', name: '机械', icon: <Sliders className="h-4 w-4" /> },
                { id: 'emc', name: 'EMC', icon: <GitBranch className="h-4 w-4" /> },
              ].map(model => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id as any)}
                  className={`px-3 py-1 rounded flex items-center gap-1 text-sm transition-all duration-300 ${
                    selectedModel === model.id
                      ? 'bg-industrial-cyan text-industrial-dark'
                      : 'bg-industrial-dark text-gray-400 hover:text-white'
                  }`}
                >
                  {model.icon}
                  {model.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-96 bg-industrial-darker rounded-lg overflow-hidden">
            <Canvas camera={{ position: [8, 6, 8], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4ff" />
              
              <Suspense fallback={null}>
                <CircuitComponent temperature={temperature} />
              </Suspense>
              
              <OrbitControls enableZoom={true} enablePan={true} />
              
              {/* Grid */}
              <gridHelper args={[20, 20, '#2a2d3a', '#1a1d29']} />
            </Canvas>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => {}}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <div className="text-sm text-gray-400">
              使用鼠标拖动旋转，滚轮缩放
            </div>
          </div>
        </div>
        
        {/* Control panel */}
        <div className="data-card">
          <h3 className="text-lg font-semibold text-white mb-4">仿真控制</h3>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">仿真进度</span>
              <span className="text-sm font-medium text-white">{simulationProgress}%</span>
            </div>
            <div className="w-full bg-industrial-darker rounded-full h-2">
              <div
                className="bg-gradient-to-r from-industrial-cyan to-industrial-success h-2 rounded-full transition-all duration-300"
                style={{ width: `${simulationProgress}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {simulationStatus === 'idle' && (
              <button
                onClick={handleStart}
                className="w-full btn-industrial flex items-center justify-center gap-2"
              >
                <PlayCircle className="h-4 w-4" />
                开始仿真
              </button>
            )}
            {simulationStatus === 'running' && (
              <button
                onClick={handlePause}
                className="w-full btn-industrial flex items-center justify-center gap-2"
              >
                <Pause className="h-4 w-4" />
                暂停
              </button>
            )}
            {simulationStatus === 'paused' && (
              <>
                <button
                  onClick={handleResume}
                  className="w-full btn-industrial flex items-center justify-center gap-2"
                >
                  <PlayCircle className="h-4 w-4" />
                  继续
                </button>
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 bg-industrial-dark border border-industrial-light text-gray-400 hover:text-white hover:border-industrial-cyan transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4 inline mr-2" />
                  重置
                </button>
              </>
            )}
            {simulationStatus === 'completed' && (
              <button
                onClick={handleReset}
                className="w-full btn-industrial flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                新仿真
              </button>
            )}
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="p-3 bg-industrial-darker rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">CPU使用率</span>
                <span className="text-sm font-medium text-industrial-cyan">
                  {simulationStatus === 'running' ? '78%' : '12%'}
                </span>
              </div>
            </div>
            <div className="p-3 bg-industrial-darker rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">内存占用</span>
                <span className="text-sm font-medium text-industrial-warning">2.3 GB</span>
              </div>
            </div>
            <div className="p-3 bg-industrial-darker rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">仿真时间</span>
                <span className="text-sm font-medium text-white">
                  {Math.floor(simulationProgress * 1.2)}s
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance curves */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">性能曲线</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis 
                  dataKey="load" 
                  stroke="#8b92a1"
                  label={{ value: '负载 (%)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#8b92a1"
                  label={{ value: '效率 (%) / 温度 (°C)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#8b92a1"
                  label={{ value: '应力系数', angle: 90, position: 'insideRight' }}
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
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="stress"
                  stroke="#ff3b30"
                  strokeWidth={2}
                  dot={false}
                  name="应力"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monte Carlo results */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">蒙特卡洛分析</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
                <XAxis 
                  dataKey="efficiency"
                  type="number"
                  stroke="#8b92a1"
                  label={{ value: '效率 (%)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  dataKey="lifetime"
                  type="number"
                  stroke="#8b92a1"
                  label={{ value: '寿命 (小时)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis dataKey="reliability" range={[50, 400]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1d29',
                    border: '1px solid #2a2d3a',
                  }}
                />
                <Scatter
                  name="样本点"
                  data={monteCarloData}
                  fill="#00d4ff"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">平均效率:</span>
              <span className="ml-2 text-white font-medium">
                {monteCarloData.length > 0 
                  ? (monteCarloData.reduce((sum, d) => sum + d.efficiency, 0) / monteCarloData.length).toFixed(2)
                  : '0.00'}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">可靠性:</span>
              <span className="ml-2 text-industrial-success font-medium">
                {monteCarloData.length > 0
                  ? (monteCarloData.reduce((sum, d) => sum + d.reliability, 0) / monteCarloData.length * 100).toFixed(1)
                  : '0.0'}%
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Parameter optimization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="data-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">参数优化</h3>
          <button
            onClick={handleOptimize}
            className="px-4 py-2 bg-industrial-cyan/20 text-industrial-cyan hover:bg-industrial-cyan hover:text-industrial-dark transition-all duration-300"
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            优化参数
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {optimizationResults.map((param, index) => (
            <motion.div
              key={param.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-industrial-darker rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{param.name}</span>
                <span className="text-sm font-medium text-white">
                  {param.value.toFixed(0)} {param.unit}
                </span>
              </div>
              <div className="relative w-full h-2 bg-industrial-dark rounded-full">
                <div
                  className="absolute h-2 bg-gradient-to-r from-industrial-cyan to-industrial-success rounded-full"
                  style={{ width: `${((param.value - param.min) / (param.max - param.min)) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                <span>{param.min}</span>
                <span>{param.max}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-industrial-darker rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">优化目标:</span>
              <span className="ml-2 text-white">最大效率 & 最小温升</span>
            </div>
            <div>
              <span className="text-gray-400">约束条件:</span>
              <span className="ml-2 text-white">THD < 3%, 温度 < 85°C</span>
            </div>
            <div>
              <span className="text-gray-400">优化算法:</span>
              <span className="ml-2 text-white">遗传算法 + 梯度下降</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Radar chart for multi-dimensional analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">多维度性能分析</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={[
                { metric: '效率', A: 95, B: 92, fullMark: 100 },
                { metric: '可靠性', A: 98, B: 95, fullMark: 100 },
                { metric: '成本', A: 70, B: 85, fullMark: 100 },
                { metric: '体积', A: 80, B: 75, fullMark: 100 },
                { metric: '温升', A: 85, B: 80, fullMark: 100 },
                { metric: 'EMC', A: 90, B: 88, fullMark: 100 },
              ]}>
                <PolarGrid stroke="#2a2d3a" />
                <PolarAngleAxis dataKey="metric" stroke="#8b92a1" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#8b92a1" />
                <Radar name="优化前" dataKey="B" stroke="#ff9500" fill="#ff9500" fillOpacity={0.3} />
                <Radar name="优化后" dataKey="A" stroke="#00ff88" fill="#00ff88" fillOpacity={0.3} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* Simulation summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="data-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">仿真结果汇总</h3>
          <div className="space-y-4">
            <div className="p-4 bg-industrial-darker rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">关键指标</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">峰值效率</span>
                  <span className="text-industrial-success font-medium">96.8%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">最高温度</span>
                  <span className="text-industrial-warning font-medium">78.5°C</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">预期寿命</span>
                  <span className="text-white font-medium">25,000 小时</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">故障率</span>
                  <span className="text-industrial-cyan font-medium">0.18%/年</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-industrial-darker rounded-lg">
              <h4 className="text-sm text-gray-400 mb-3">优化建议</h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• 增加散热片面积可降低温度5°C</li>
                <li>• 优化开关频率至100kHz可提升效率0.5%</li>
                <li>• 使用低ESR电容可减少损耗</li>
                <li>• 调整死区时间至85ns获得最佳性能</li>
              </ul>
            </div>
            
            <button className="w-full btn-industrial">
              生成仿真报告
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}