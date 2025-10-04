'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Square, Download, Settings, Zap, Volume2, RotateCcw, Save, FileText } from 'lucide-react'

interface WaveformData {
  time: number
  voltage: number
}

export default function SimulationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [timeScale, setTimeScale] = useState([1])
  const [voltageScale, setVoltageScale] = useState([1])
  const [triggerLevel, setTriggerLevel] = useState([0])
  const [selectedChannel, setSelectedChannel] = useState('CH1')
  const [waveformType, setWaveformType] = useState('noise')
  const [frequency, setFrequency] = useState(1000)
  const [amplitude, setAmplitude] = useState(5)
  const [offset, setOffset] = useState(0)
  const [data, setData] = useState<WaveformData[]>([])
  const [measurements, setMeasurements] = useState({
    vpp: 0,
    vrms: 0,
    frequency: 0,
    period: 0
  })
  const [showDataTable, setShowDataTable] = useState(false)
  const [cursorMode, setCursorMode] = useState(false)
  const [cursor1, setCursor1] = useState(0.25)
  const [cursor2, setCursor2] = useState(0.75)
  const [autoScale, setAutoScale] = useState(false)
  const [sampleRate, setSampleRate] = useState(1000)
  const [recordLength, setRecordLength] = useState(1000)

  // 生成波形数据
  const generateWaveform = (type: string, freq: number, amp: number, offset: number): WaveformData[] => {
    const points: WaveformData[] = []
    const timeRange = 0.01 // 10ms
    const sampleRate = 1000
    const dt = timeRange / sampleRate

    for (let i = 0; i < sampleRate; i++) {
      const t = i * dt
      let voltage = 0

      switch (type) {
        case 'sine':
          voltage = amp * Math.sin(2 * Math.PI * freq * t) + offset
          break
        case 'square':
          voltage = amp * Math.sign(Math.sin(2 * Math.PI * freq * t)) + offset
          break
        case 'triangle':
          voltage = (2 * amp / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t)) + offset
          break
        case 'sawtooth':
          voltage = 2 * amp * (freq * t - Math.floor(freq * t + 0.5)) + offset
          break
        case 'noise':
          voltage = amp * (Math.random() - 0.5) * 2 + offset
          break
      }

      points.push({ time: t, voltage })
    }

    return points
  }

  // 计算测量值
  const calculateMeasurements = (data: WaveformData[]) => {
    if (data.length === 0) return { vpp: 0, vrms: 0, frequency: 0, period: 0 }

    const voltages = data.map(d => d.voltage)
    const vpp = Math.max(...voltages) - Math.min(...voltages)
    const vrms = Math.sqrt(voltages.reduce((sum, v) => sum + v * v, 0) / voltages.length)
    
    // 简单的频率检测（找过零点）
    let zeroCrossings = 0
    for (let i = 1; i < voltages.length; i++) {
      if ((voltages[i-1] >= 0 && voltages[i] < 0) || (voltages[i-1] < 0 && voltages[i] >= 0)) {
        zeroCrossings++
      }
    }
    const period = data.length > 0 ? (data[data.length - 1].time - data[0].time) / (zeroCrossings / 2) : 0
    const frequency = period > 0 ? 1 / period : 0

    return { vpp, vrms, frequency, period }
  }

  // 绘制示波器屏幕
  const drawOscilloscope = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 清空画布
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // 绘制网格
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1
    const gridSize = 40

    // 垂直网格线
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // 水平网格线
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 绘制中心线
    ctx.strokeStyle = '#666666'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    // 绘制波形
    if (data.length > 1) {
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 2
      ctx.beginPath()

      const timeScaleFactor = width / (0.01 * timeScale[0])
      const voltageScaleFactor = height / (20 * voltageScale[0])
      const centerY = height / 2

      data.forEach((point, index) => {
        const x = point.time * timeScaleFactor
        const y = centerY - (point.voltage * voltageScaleFactor)

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()
    }

    // 绘制触发线
    ctx.strokeStyle = '#ff0000'
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    const triggerY = height / 2 - (triggerLevel[0] * height / (20 * voltageScale[0]))
    ctx.beginPath()
    ctx.moveTo(0, triggerY)
    ctx.lineTo(width, triggerY)
    ctx.stroke()
    ctx.setLineDash([])

    // 绘制游标
    if (cursorMode) {
      ctx.strokeStyle = '#ffff00'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])
      
      // 游标1
      const cursor1X = cursor1 * width
      ctx.beginPath()
      ctx.moveTo(cursor1X, 0)
      ctx.lineTo(cursor1X, height)
      ctx.stroke()
      
      // 游标2
      const cursor2X = cursor2 * width
      ctx.beginPath()
      ctx.moveTo(cursor2X, 0)
      ctx.lineTo(cursor2X, height)
      ctx.stroke()
      
      ctx.setLineDash([])
      
      // 游标标签
      ctx.fillStyle = '#ffff00'
      ctx.font = '12px monospace'
      ctx.fillText('C1', cursor1X + 5, 15)
      ctx.fillText('C2', cursor2X + 5, 15)
    }

    // 绘制刻度标签
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px monospace'
    ctx.textAlign = 'left'
    
    // 电压刻度
    for (let i = -10; i <= 10; i += 2) {
      const y = height / 2 - (i * height / (20 * voltageScale[0]))
      if (y >= 0 && y <= height) {
        ctx.fillText(`${i * voltageScale[0]}V`, 5, y + 4)
      }
    }

    // 时间刻度
    const timeStep = 0.01 * timeScale[0] / 10
    for (let i = 0; i <= 10; i++) {
      const x = (i * width / 10)
      const time = i * timeStep
      ctx.fillText(`${time.toFixed(3)}s`, x, height - 5)
    }
  }

  // 更新数据
  useEffect(() => {
    const newData = generateWaveform(waveformType, frequency, amplitude, offset)
    setData(newData)
    setMeasurements(calculateMeasurements(newData))
  }, [waveformType, frequency, amplitude, offset])

  // 绘制示波器
  useEffect(() => {
    drawOscilloscope()
  }, [data, timeScale, voltageScale, triggerLevel])

  // 自动更新
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const newData = generateWaveform(waveformType, frequency, amplitude, offset)
      setData(newData)
      setMeasurements(calculateMeasurements(newData))
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, waveformType, frequency, amplitude, offset])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleExport = () => {
    const csvContent = "Time,Voltage\n" + data.map(d => `${d.time},${d.voltage}`).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'oscilloscope_data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleAutoScale = () => {
    if (data.length === 0) return
    
    const voltages = data.map(d => d.voltage)
    const maxV = Math.max(...voltages)
    const minV = Math.min(...voltages)
    const range = maxV - minV
    
    // 自动调整电压轴
    const newVoltageScale = Math.ceil(range / 8) // 8个格子
    setVoltageScale([newVoltageScale])
    
    // 自动调整偏移
    const center = (maxV + minV) / 2
    setOffset(center)
  }

  const handleReset = () => {
    setTimeScale([1])
    setVoltageScale([1])
    setTriggerLevel([0])
    setFrequency(1000)
    setAmplitude(5)
    setOffset(0)
    setCursorMode(false)
    setCursor1(0.25)
    setCursor2(0.75)
  }

  const getCursorMeasurements = () => {
    if (!cursorMode || data.length === 0) return null
    
    const timeRange = 0.01 * timeScale[0]
    const time1 = cursor1 * timeRange
    const time2 = cursor2 * timeRange
    const deltaTime = Math.abs(time2 - time1)
    const deltaFreq = deltaTime > 0 ? 1 / deltaTime : 0
    
    return {
      deltaTime: deltaTime * 1000, // ms
      deltaFreq: deltaFreq,
      time1: time1 * 1000,
      time2: time2 * 1000
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">示波器仿真</h1>
          <p className="text-sm text-gray-400">实时波形显示与测量</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isRunning ? "default" : "secondary"}>
            {isRunning ? "运行中" : "已停止"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 示波器屏幕 */}
        <div className="lg:col-span-3">
          <Card className="bg-black border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-500" />
                <span>示波器显示</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black border border-gray-700 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full h-full border border-gray-600 rounded"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 控制面板 */}
        <div className="space-y-4">
          {/* 运行控制 */}
          <Card className="bg-industrial-darker border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">运行控制</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleStart}
                  disabled={isRunning}
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-1" />
                  开始
                </Button>
                <Button
                  onClick={handleStop}
                  disabled={!isRunning}
                  size="sm"
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-1" />
                  停止
                </Button>
                <Button
                  onClick={handleAutoScale}
                  size="sm"
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  自动
                </Button>
                <Button
                  onClick={handleReset}
                  size="sm"
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  复位
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleExport}
                  size="sm"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-1" />
                  导出
                </Button>
                <Button
                  onClick={() => setShowDataTable(!showDataTable)}
                  size="sm"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  数据
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 波形设置 */}
          <Card className="bg-industrial-darker border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">波形设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-gray-300">波形类型</label>
                <Select value={waveformType} onValueChange={setWaveformType}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sine">正弦波</SelectItem>
                    <SelectItem value="square">方波</SelectItem>
                    <SelectItem value="triangle">三角波</SelectItem>
                    <SelectItem value="sawtooth">锯齿波</SelectItem>
                    <SelectItem value="noise">噪声</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300">频率: {frequency} Hz</label>
                <Slider
                  value={[frequency]}
                  onValueChange={(value) => setFrequency(value[0])}
                  min={1}
                  max={10000}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">幅度: {amplitude} V</label>
                <Slider
                  value={[amplitude]}
                  onValueChange={(value) => setAmplitude(value[0])}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">偏移: {offset} V</label>
                <Slider
                  value={[offset]}
                  onValueChange={(value) => setOffset(value[0])}
                  min={-5}
                  max={5}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* 示波器设置 */}
          <Card className="bg-industrial-darker border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">示波器设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-gray-300">时间轴: {timeScale[0]} ms/div</label>
                <Slider
                  value={timeScale}
                  onValueChange={setTimeScale}
                  min={0.1}
                  max={10}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">电压轴: {voltageScale[0]} V/div</label>
                <Slider
                  value={voltageScale}
                  onValueChange={setVoltageScale}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300">触发电平: {triggerLevel[0]} V</label>
                <Slider
                  value={triggerLevel}
                  onValueChange={setTriggerLevel}
                  min={-10}
                  max={10}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* 游标控制 */}
          <Card className="bg-industrial-darker border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm flex items-center justify-between">
                游标控制
                <Switch
                  checked={cursorMode}
                  onCheckedChange={setCursorMode}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cursorMode && (
                <>
                  <div>
                    <label className="text-sm text-gray-300">游标1: {(cursor1 * 100).toFixed(1)}%</label>
                    <Slider
                      value={[cursor1]}
                      onValueChange={(value) => setCursor1(value[0])}
                      min={0}
                      max={1}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">游标2: {(cursor2 * 100).toFixed(1)}%</label>
                    <Slider
                      value={[cursor2]}
                      onValueChange={(value) => setCursor2(value[0])}
                      min={0}
                      max={1}
                      step={0.01}
                      className="mt-2"
                    />
                  </div>
                  {(() => {
                    const cursorMeas = getCursorMeasurements()
                    return cursorMeas ? (
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-300">ΔT:</span>
                          <span className="text-yellow-400">{cursorMeas.deltaTime.toFixed(2)} ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">ΔF:</span>
                          <span className="text-yellow-400">{cursorMeas.deltaFreq.toFixed(1)} Hz</span>
                        </div>
                      </div>
                    ) : null
                  })()}
                </>
              )}
            </CardContent>
          </Card>

          {/* 测量结果 */}
          <Card className="bg-industrial-darker border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm">测量结果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Vpp:</span>
                <span className="text-white">{measurements.vpp.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Vrms:</span>
                <span className="text-white">{measurements.vrms.toFixed(2)} V</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">频率:</span>
                <span className="text-white">{measurements.frequency.toFixed(1)} Hz</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">周期:</span>
                <span className="text-white">{(measurements.period * 1000).toFixed(2)} ms</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 数据表格 */}
      {showDataTable && (
        <Card className="bg-industrial-darker border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>波形数据表</span>
              <Badge variant="secondary">
                {data.length} 个数据点
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-800">
                  <tr>
                    <th className="text-left py-2 px-3 text-gray-300">序号</th>
                    <th className="text-left py-2 px-3 text-gray-300">时间 (ms)</th>
                    <th className="text-left py-2 px-3 text-gray-300">电压 (V)</th>
                    <th className="text-left py-2 px-3 text-gray-300">相位 (°)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 100).map((point, index) => {
                    const phase = ((point.time * frequency * 360) % 360).toFixed(1)
                    return (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-1 px-3 text-gray-400">{index + 1}</td>
                        <td className="py-1 px-3 text-blue-400">{(point.time * 1000).toFixed(3)}</td>
                        <td className="py-1 px-3 text-green-400">{point.voltage.toFixed(4)}</td>
                        <td className="py-1 px-3 text-yellow-400">{phase}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {data.length > 100 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                  显示前100个数据点，共{data.length}个数据点
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}