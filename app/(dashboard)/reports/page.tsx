'use client'

import { useState } from 'react'

interface TestReport {
  id: string
  title: string
  testType: string
  date: string
  duration: string
  status: 'passed' | 'failed' | 'warning'
  deviceModel: string
  voltage: number
  current: number
  power: number
  efficiency: number
  temperature: number
  humidity: number
  summary: string
  details: {
    testItems: Array<{
      name: string
      result: string
      status: 'passed' | 'failed' | 'warning'
      value: number
      unit: string
      standard: string
    }>
    measurements: Array<{
      parameter: string
      measured: number
      standard: string
      unit: string
      deviation: number
    }>
  }
}

const mockReports: TestReport[] = [
  {
    id: 'RPT-2025-001',
    title: '光伏快速关断器高压绝缘测试报告',
    testType: 'high-voltage',
    date: '2025-09-14',
    duration: '2小时15分钟',
    status: 'passed',
    deviceModel: 'PVRSD-1500-A',
    voltage: 1000,
    current: 1.2,
    power: 1200,
    efficiency: 98.5,
    temperature: 25.3,
    humidity: 45.2,
    summary: '设备在1000V DC电压下通过了所有绝缘测试项目，绝缘电阻值均超过标准要求，无异常放电现象。测试过程中设备运行稳定，各项指标均符合GB/T 37408-2019标准要求。',
    details: {
      testItems: [
        { name: '绝缘电阻测试', result: '通过', status: 'passed', value: 1250, unit: 'MΩ', standard: '≥100MΩ' },
        { name: '耐压测试', result: '通过', status: 'passed', value: 1500, unit: 'V', standard: '1500V/1min' },
        { name: '泄漏电流测试', result: '通过', status: 'passed', value: 0.05, unit: 'mA', standard: '≤0.1mA' },
        { name: '局部放电测试', result: '通过', status: 'passed', value: 2.1, unit: 'pC', standard: '≤10pC' }
      ],
      measurements: [
        { parameter: '输入电压', measured: 1000.2, standard: '1000±1%', unit: 'V', deviation: 0.02 },
        { parameter: '输出电流', measured: 1.198, standard: '1.2±2%', unit: 'A', deviation: -0.17 },
        { parameter: '功率因数', measured: 0.995, standard: '≥0.95', unit: '', deviation: 4.74 },
        { parameter: '效率', measured: 98.52, standard: '≥95%', unit: '%', deviation: 3.71 }
      ]
    }
  },
  {
    id: 'RPT-2025-002',
    title: '泄漏电流精密测量报告',
    testType: 'leakage',
    date: '2025-09-13',
    duration: '1小时45分钟',
    status: 'warning',
    deviceModel: 'PVRSD-1500-B',
    voltage: 600,
    current: 0.8,
    power: 480,
    efficiency: 97.8,
    temperature: 28.7,
    humidity: 52.1,
    summary: '设备泄漏电流测试基本通过，但在高温条件下泄漏电流略有增加，建议进一步优化散热设计。所有测试项目均在安全范围内，符合IEC 62109-1标准要求。',
    details: {
      testItems: [
        { name: '常温泄漏电流', result: '通过', status: 'passed', value: 0.03, unit: 'mA', standard: '≤0.1mA' },
        { name: '高温泄漏电流', result: '警告', status: 'warning', value: 0.08, unit: 'mA', standard: '≤0.1mA' },
        { name: '湿度泄漏电流', result: '通过', status: 'passed', value: 0.04, unit: 'mA', standard: '≤0.1mA' },
        { name: '频率响应测试', result: '通过', status: 'passed', value: 50.2, unit: 'Hz', standard: '50±0.5Hz' }
      ],
      measurements: [
        { parameter: '25°C泄漏电流', measured: 0.032, standard: '≤0.1mA', unit: 'mA', deviation: -68.0 },
        { parameter: '85°C泄漏电流', measured: 0.078, standard: '≤0.1mA', unit: 'mA', deviation: -22.0 },
        { parameter: '95%湿度泄漏电流', measured: 0.041, standard: '≤0.1mA', unit: 'mA', deviation: -59.0 },
        { parameter: '响应时间', measured: 12.5, standard: '≤20ms', unit: 'ms', deviation: -37.5 }
      ]
    }
  },
  {
    id: 'RPT-2025-003',
    title: '正常工况性能测试报告',
    testType: 'normal',
    date: '2025-09-12',
    duration: '3小时30分钟',
    status: 'passed',
    deviceModel: 'PVRSD-1500-C',
    voltage: 800,
    current: 1.5,
    power: 1200,
    efficiency: 99.1,
    temperature: 22.8,
    humidity: 38.5,
    summary: '设备在正常工况下表现优异，所有性能指标均超过设计要求，效率达到99.1%，温升控制良好。测试涵盖了从10%到110%负载范围，设备运行稳定可靠。',
    details: {
      testItems: [
        { name: '满载效率测试', result: '通过', status: 'passed', value: 99.1, unit: '%', standard: '≥95%' },
        { name: '轻载效率测试', result: '通过', status: 'passed', value: 96.8, unit: '%', standard: '≥90%' },
        { name: '温升测试', result: '通过', status: 'passed', value: 35.2, unit: '°C', standard: '≤40°C' },
        { name: '纹波测试', result: '通过', status: 'passed', value: 1.2, unit: '%', standard: '≤5%' }
      ],
      measurements: [
        { parameter: '满载效率', measured: 99.12, standard: '≥95%', unit: '%', deviation: 4.33 },
        { parameter: '50%负载效率', measured: 98.45, standard: '≥92%', unit: '%', deviation: 7.01 },
        { parameter: '10%负载效率', measured: 96.78, standard: '≥90%', unit: '%', deviation: 7.53 },
        { parameter: '最大温升', measured: 35.2, standard: '≤40°C', unit: '°C', deviation: -12.0 }
      ]
    }
  },
  {
    id: 'RPT-2025-004',
    title: '非正常工况保护功能测试报告',
    testType: 'abnormal',
    date: '2025-09-11',
    duration: '4小时20分钟',
    status: 'failed',
    deviceModel: 'PVRSD-1500-D',
    voltage: 1200,
    current: 2.0,
    power: 1800,
    efficiency: 85.2,
    temperature: 45.6,
    humidity: 60.3,
    summary: '设备在过流保护测试中响应时间超出标准要求，需要调整保护电路参数。其他保护功能正常，建议优化过流检测算法以提高响应速度。',
    details: {
      testItems: [
        { name: '过压保护测试', result: '通过', status: 'passed', value: 1.2, unit: 'ms', standard: '≤5ms' },
        { name: '过流保护测试', result: '失败', status: 'failed', value: 8.5, unit: 'ms', standard: '≤5ms' },
        { name: '短路保护测试', result: '通过', status: 'passed', value: 0.8, unit: 'ms', standard: '≤2ms' },
        { name: '过温保护测试', result: '通过', status: 'passed', value: 85.2, unit: '°C', standard: '85±2°C' }
      ],
      measurements: [
        { parameter: '过压保护阈值', measured: 1320, standard: '1300±20V', unit: 'V', deviation: 1.54 },
        { parameter: '过流保护响应时间', measured: 8.5, standard: '≤5ms', unit: 'ms', deviation: 70.0 },
        { parameter: '短路保护响应时间', measured: 0.8, standard: '≤2ms', unit: 'ms', deviation: -60.0 },
        { parameter: '过温保护阈值', measured: 85.2, standard: '85±2°C', unit: '°C', deviation: 0.24 }
      ]
    }
  },
  {
    id: 'RPT-2025-005',
    title: '环境适应性测试报告',
    testType: 'environmental',
    date: '2025-09-10',
    duration: '8小时15分钟',
    status: 'passed',
    deviceModel: 'PVRSD-1500-E',
    voltage: 900,
    current: 1.3,
    power: 1170,
    efficiency: 98.2,
    temperature: 35.8,
    humidity: 75.2,
    summary: '设备在各种环境条件下均能正常工作，包括高温、高湿、低温等极端条件。所有测试项目均通过，证明设备具有良好的环境适应性。',
    details: {
      testItems: [
        { name: '高温工作测试', result: '通过', status: 'passed', value: 85, unit: '°C', standard: '85°C/4h' },
        { name: '低温工作测试', result: '通过', status: 'passed', value: -40, unit: '°C', standard: '-40°C/4h' },
        { name: '高湿工作测试', result: '通过', status: 'passed', value: 95, unit: '%RH', standard: '95%RH/4h' },
        { name: '振动测试', result: '通过', status: 'passed', value: 10, unit: 'g', standard: '10g/2h' }
      ],
      measurements: [
        { parameter: '高温效率', measured: 97.8, standard: '≥95%', unit: '%', deviation: 2.95 },
        { parameter: '低温效率', measured: 98.1, standard: '≥95%', unit: '%', deviation: 3.26 },
        { parameter: '高湿绝缘电阻', measured: 850, standard: '≥100MΩ', unit: 'MΩ', deviation: 750.0 },
        { parameter: '振动后精度', measured: 99.2, standard: '≥98%', unit: '%', deviation: 1.22 }
      ]
    }
  }
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredReports = mockReports.filter(report => {
    const typeMatch = filterType === 'all' || report.testType === filterType
    const statusMatch = filterStatus === 'all' || report.status === filterStatus
    return typeMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-400 bg-green-400/10'
      case 'warning':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'failed':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'passed':
        return '通过'
      case 'warning':
        return '警告'
      case 'failed':
        return '失败'
      default:
        return '未知'
    }
  }

  const getTestTypeName = (type: string) => {
    switch (type) {
      case 'high-voltage':
        return '高压测试'
      case 'leakage':
        return '泄漏电流'
      case 'normal':
        return '正常工况'
      case 'abnormal':
        return '非正常工况'
      case 'environmental':
        return '环境适应性'
      default:
        return '其他测试'
    }
  }

  const exportReport = (report: TestReport) => {
    const reportData = {
      基本信息: {
        报告编号: report.id,
        报告标题: report.title,
        测试类型: getTestTypeName(report.testType),
        测试日期: report.date,
        测试时长: report.duration,
        测试状态: getStatusText(report.status),
        设备型号: report.deviceModel
      },
      测试条件: {
        电压: `${report.voltage}V`,
        电流: `${report.current}A`,
        功率: `${report.power}W`,
        效率: `${report.efficiency}%`,
        温度: `${report.temperature}°C`,
        湿度: `${report.humidity}%`
      },
      测试结果: report.details.testItems.reduce((acc, item) => {
        acc[item.name] = {
          结果: item.result,
          测量值: `${item.value}${item.unit}`,
          标准要求: item.standard
        }
        return acc
      }, {} as any),
      详细测量: report.details.measurements.reduce((acc, measurement) => {
        acc[measurement.parameter] = {
          测量值: `${measurement.measured}${measurement.unit}`,
          标准要求: measurement.standard,
          偏差: `${measurement.deviation > 0 ? '+' : ''}${measurement.deviation.toFixed(2)}%`
        }
        return acc
      }, {} as any),
      总结: report.summary
    }

    const jsonString = JSON.stringify(reportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${report.id}_测试报告.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-industrial-darker text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">实验报告中心</h1>
            <p className="text-gray-400 mt-2">查看和管理所有实验测试报告</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
              共 {filteredReports.length} 份报告
            </span>
          </div>
        </div>

        {/* 筛选器 */}
        <div className="bg-industrial-dark rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">测试类型</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">全部类型</option>
                <option value="high-voltage">高压测试</option>
                <option value="leakage">泄漏电流</option>
                <option value="normal">正常工况</option>
                <option value="abnormal">非正常工况</option>
                <option value="environmental">环境适应性</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">测试状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">全部状态</option>
                <option value="passed">通过</option>
                <option value="warning">警告</option>
                <option value="failed">失败</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 报告列表 */}
          <div className="lg:col-span-1">
            <div className="bg-industrial-dark rounded-lg p-4">
              <h2 className="text-lg font-semibold text-white mb-4">报告列表</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedReport?.id === report.id
                        ? 'bg-blue-900/30 border border-blue-500'
                        : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-white">{report.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-white mb-2 line-clamp-2">
                      {report.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{getTestTypeName(report.testType)}</span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 报告详情 */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="space-y-6">
                <div className="bg-industrial-dark rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">{selectedReport.title}</h2>
                    <button
                      onClick={() => exportReport(selectedReport)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      导出报告
                    </button>
                  </div>

                  {/* 基本信息 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">报告编号</div>
                      <div className="text-sm font-medium text-white">{selectedReport.id}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">测试类型</div>
                      <div className="text-sm font-medium text-white">
                        {getTestTypeName(selectedReport.testType)}
                      </div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">测试日期</div>
                      <div className="text-sm font-medium text-white">{selectedReport.date}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs text-gray-400">测试时长</div>
                      <div className="text-sm font-medium text-white">{selectedReport.duration}</div>
                    </div>
                  </div>

                  {/* 测试条件 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">测试条件</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs text-gray-400">电压</div>
                        <div className="text-lg font-bold text-blue-400">{selectedReport.voltage}V</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs text-gray-400">电流</div>
                        <div className="text-lg font-bold text-green-400">{selectedReport.current}A</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs text-gray-400">功率</div>
                        <div className="text-lg font-bold text-yellow-400">{selectedReport.power}W</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs text-gray-400">效率</div>
                        <div className="text-lg font-bold text-purple-400">{selectedReport.efficiency}%</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs text-gray-400">温度</div>
                        <div className="text-lg font-bold text-red-400">{selectedReport.temperature}°C</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs text-gray-400">湿度</div>
                        <div className="text-lg font-bold text-cyan-400">{selectedReport.humidity}%</div>
                      </div>
                    </div>
                  </div>

                  {/* 测试项目结果 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">测试项目结果</h3>
                    <div className="space-y-3">
                      {selectedReport.details.testItems.map((item, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{item.name}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                              {item.result}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-400">
                            <span>测量值: {item.value}{item.unit}</span>
                            <span>标准: {item.standard}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 详细测量数据 */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">详细测量数据</h3>
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
                          {selectedReport.details.measurements.map((measurement, index) => (
                            <tr key={index} className="border-b border-gray-800">
                              <td className="py-2 text-white">{measurement.parameter}</td>
                              <td className="py-2 text-blue-400">
                                {measurement.measured}{measurement.unit}
                              </td>
                              <td className="py-2 text-gray-300">{measurement.standard}</td>
                              <td className={`py-2 ${
                                Math.abs(measurement.deviation) < 5 
                                  ? 'text-green-400' 
                                  : Math.abs(measurement.deviation) < 10 
                                    ? 'text-yellow-400' 
                                    : 'text-red-400'
                              }`}>
                                {measurement.deviation > 0 ? '+' : ''}{measurement.deviation.toFixed(2)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 总结 */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">测试总结</h3>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <p className="text-gray-300 leading-relaxed">{selectedReport.summary}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-industrial-dark rounded-lg p-8 text-center">
                <div className="text-6xl text-gray-600 mb-4">📊</div>
                <h3 className="text-lg font-medium text-white mb-2">选择报告查看详情</h3>
                <p className="text-gray-400">从左侧列表中选择一份报告来查看详细内容</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}