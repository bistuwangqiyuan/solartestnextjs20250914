'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Palette, 
  Monitor, 
  Bell, 
  Shield, 
  Database, 
  Wifi, 
  Volume2,
  Save,
  RotateCcw,
  User,
  Mail,
  Phone,
  Building,
  Globe,
  Clock,
  Thermometer,
  Zap
} from 'lucide-react'

interface SystemSettings {
  theme: {
    colorScheme: 'dark' | 'light' | 'blue' | 'green'
    fontSize: number
    compactMode: boolean
    animations: boolean
  }
  display: {
    language: string
    timezone: string
    dateFormat: string
    numberFormat: string
    refreshRate: number
  }
  notifications: {
    enabled: boolean
    sound: boolean
    email: boolean
    desktop: boolean
    criticalOnly: boolean
  }
  system: {
    autoSave: boolean
    backupEnabled: boolean
    logLevel: string
    maxLogSize: number
    sessionTimeout: number
  }
  device: {
    sampleRate: number
    bufferSize: number
    calibrationDate: string
    nextCalibration: string
    deviceId: string
  }
  network: {
    apiEndpoint: string
    timeout: number
    retryAttempts: number
    enableSSL: boolean
  }
  user: {
    name: string
    email: string
    phone: string
    organization: string
    role: string
  }
}

const defaultSettings: SystemSettings = {
  theme: {
    colorScheme: 'dark',
    fontSize: 14,
    compactMode: false,
    animations: true
  },
  display: {
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: '1,234.56',
    refreshRate: 1000
  },
  notifications: {
    enabled: true,
    sound: true,
    email: false,
    desktop: true,
    criticalOnly: false
  },
  system: {
    autoSave: true,
    backupEnabled: true,
    logLevel: 'info',
    maxLogSize: 100,
    sessionTimeout: 30
  },
  device: {
    sampleRate: 1000,
    bufferSize: 1024,
    calibrationDate: '2025-01-15',
    nextCalibration: '2025-07-15',
    deviceId: 'PVRSD-SYS-001'
  },
  network: {
    apiEndpoint: 'https://api.pvrsd.com',
    timeout: 5000,
    retryAttempts: 3,
    enableSSL: true
  },
  user: {
    name: '系统管理员',
    email: 'admin@pvrsd.com',
    phone: '+86 138-0000-0000',
    organization: '光伏快速关断器测试中心',
    role: 'administrator'
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState('theme')

  // 监听设置变化
  useEffect(() => {
    const isChanged = JSON.stringify(settings) !== JSON.stringify(defaultSettings)
    setHasChanges(isChanged)
  }, [settings])

  // 更新设置
  const updateSetting = (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  // 保存设置
  const saveSettings = () => {
    localStorage.setItem('pvrsd-settings', JSON.stringify(settings))
    setHasChanges(false)
    // 这里可以添加保存成功的提示
    alert('设置已保存！')
  }

  // 重置设置
  const resetSettings = () => {
    if (confirm('确定要重置所有设置到默认值吗？')) {
      setSettings(defaultSettings)
      localStorage.removeItem('pvrsd-settings')
    }
  }

  // 加载保存的设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('pvrsd-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [])

  // 应用主题
  useEffect(() => {
    const root = document.documentElement
    const { colorScheme } = settings.theme
    
    // 移除所有主题类
    root.classList.remove('theme-dark', 'theme-light', 'theme-blue', 'theme-green')
    
    // 应用新主题
    root.classList.add(`theme-${colorScheme}`)
    
    // 设置CSS变量
    switch (colorScheme) {
      case 'light':
        root.style.setProperty('--bg-primary', '#ffffff')
        root.style.setProperty('--bg-secondary', '#f8f9fa')
        root.style.setProperty('--text-primary', '#000000')
        root.style.setProperty('--text-secondary', '#6c757d')
        root.style.setProperty('--accent-color', '#007bff')
        break
      case 'blue':
        root.style.setProperty('--bg-primary', '#0f1419')
        root.style.setProperty('--bg-secondary', '#1a2332')
        root.style.setProperty('--text-primary', '#e1e8f0')
        root.style.setProperty('--text-secondary', '#8fa2b7')
        root.style.setProperty('--accent-color', '#00d4ff')
        break
      case 'green':
        root.style.setProperty('--bg-primary', '#0d1b0d')
        root.style.setProperty('--bg-secondary', '#1a2e1a')
        root.style.setProperty('--text-primary', '#e8f5e8')
        root.style.setProperty('--text-secondary', '#a2c4a2')
        root.style.setProperty('--accent-color', '#00ff88')
        break
      default: // dark
        root.style.setProperty('--bg-primary', '#1a1a1a')
        root.style.setProperty('--bg-secondary', '#2d2d2d')
        root.style.setProperty('--text-primary', '#ffffff')
        root.style.setProperty('--text-secondary', '#b0b0b0')
        root.style.setProperty('--accent-color', '#00ffff')
        break
    }
  }, [settings.theme.colorScheme])

  const tabs = [
    { id: 'theme', name: '主题外观', icon: <Palette className="h-4 w-4" /> },
    { id: 'display', name: '显示设置', icon: <Monitor className="h-4 w-4" /> },
    { id: 'notifications', name: '通知设置', icon: <Bell className="h-4 w-4" /> },
    { id: 'system', name: '系统设置', icon: <Settings className="h-4 w-4" /> },
    { id: 'device', name: '设备配置', icon: <Zap className="h-4 w-4" /> },
    { id: 'network', name: '网络设置', icon: <Wifi className="h-4 w-4" /> },
    { id: 'user', name: '用户信息', icon: <User className="h-4 w-4" /> }
  ]

  const getThemePreview = (theme: string) => {
    const colors = {
      dark: { bg: '#1a1a1a', accent: '#00ffff', text: '#ffffff' },
      light: { bg: '#ffffff', accent: '#007bff', text: '#000000' },
      blue: { bg: '#0f1419', accent: '#00d4ff', text: '#e1e8f0' },
      green: { bg: '#0d1b0d', accent: '#00ff88', text: '#e8f5e8' }
    }
    
    const color = colors[theme as keyof typeof colors]
    return (
      <div 
        className="w-16 h-12 rounded border-2 flex items-center justify-center text-xs font-medium"
        style={{ 
          backgroundColor: color.bg, 
          borderColor: settings.theme.colorScheme === theme ? color.accent : '#666',
          color: color.text 
        }}
      >
        Aa
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-industrial-darker text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Settings className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">系统设置</h1>
              <p className="text-gray-400 mt-1">配置系统参数和个人偏好</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {hasChanges && (
              <Badge className="bg-yellow-500/20 text-yellow-400">
                有未保存的更改
              </Badge>
            )}
            <Button
              onClick={resetSettings}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              重置
            </Button>
            <Button
              onClick={saveSettings}
              disabled={!hasChanges}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              保存设置
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 设置导航 */}
          <div className="lg:col-span-1">
            <Card className="bg-industrial-dark border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">设置分类</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500/20 text-blue-400 border-r-2 border-blue-400'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* 设置内容 */}
          <div className="lg:col-span-3">
            {/* 主题外观 */}
            {activeTab === 'theme' && (
              <Card className="bg-industrial-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>主题外观</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      颜色主题
                    </label>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { id: 'dark', name: '深色主题' },
                        { id: 'light', name: '浅色主题' },
                        { id: 'blue', name: '蓝色主题' },
                        { id: 'green', name: '绿色主题' }
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => updateSetting('theme', 'colorScheme', theme.id)}
                          className="flex flex-col items-center space-y-2 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
                        >
                          {getThemePreview(theme.id)}
                          <span className="text-sm text-gray-300">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      字体大小: {settings.theme.fontSize}px
                    </label>
                    <Slider
                      value={[settings.theme.fontSize]}
                      onValueChange={(value) => updateSetting('theme', 'fontSize', value[0])}
                      min={12}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">紧凑模式</label>
                      <p className="text-xs text-gray-500">减少界面元素间距</p>
                    </div>
                    <Switch
                      checked={settings.theme.compactMode}
                      onCheckedChange={(checked) => updateSetting('theme', 'compactMode', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">动画效果</label>
                      <p className="text-xs text-gray-500">启用界面过渡动画</p>
                    </div>
                    <Switch
                      checked={settings.theme.animations}
                      onCheckedChange={(checked) => updateSetting('theme', 'animations', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 显示设置 */}
            {activeTab === 'display' && (
              <Card className="bg-industrial-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Monitor className="h-5 w-5" />
                    <span>显示设置</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      界面语言
                    </label>
                    <Select 
                      value={settings.display.language} 
                      onValueChange={(value) => updateSetting('display', 'language', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh-CN">简体中文</SelectItem>
                        <SelectItem value="zh-TW">繁體中文</SelectItem>
                        <SelectItem value="en-US">English</SelectItem>
                        <SelectItem value="ja-JP">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      时区设置
                    </label>
                    <Select 
                      value={settings.display.timezone} 
                      onValueChange={(value) => updateSetting('display', 'timezone', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Shanghai">北京时间 (GMT+8)</SelectItem>
                        <SelectItem value="Asia/Tokyo">东京时间 (GMT+9)</SelectItem>
                        <SelectItem value="Europe/London">伦敦时间 (GMT+0)</SelectItem>
                        <SelectItem value="America/New_York">纽约时间 (GMT-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      日期格式
                    </label>
                    <Select 
                      value={settings.display.dateFormat} 
                      onValueChange={(value) => updateSetting('display', 'dateFormat', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YYYY-MM-DD">2025-09-15</SelectItem>
                        <SelectItem value="DD/MM/YYYY">15/09/2025</SelectItem>
                        <SelectItem value="MM/DD/YYYY">09/15/2025</SelectItem>
                        <SelectItem value="DD-MM-YYYY">15-09-2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      数据刷新频率: {settings.display.refreshRate}ms
                    </label>
                    <Slider
                      value={[settings.display.refreshRate]}
                      onValueChange={(value) => updateSetting('display', 'refreshRate', value[0])}
                      min={100}
                      max={5000}
                      step={100}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 通知设置 */}
            {activeTab === 'notifications' && (
              <Card className="bg-industrial-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>通知设置</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">启用通知</label>
                      <p className="text-xs text-gray-500">接收系统通知和警告</p>
                    </div>
                    <Switch
                      checked={settings.notifications.enabled}
                      onCheckedChange={(checked) => updateSetting('notifications', 'enabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">声音提醒</label>
                      <p className="text-xs text-gray-500">播放通知声音</p>
                    </div>
                    <Switch
                      checked={settings.notifications.sound}
                      onCheckedChange={(checked) => updateSetting('notifications', 'sound', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">邮件通知</label>
                      <p className="text-xs text-gray-500">发送重要通知到邮箱</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">桌面通知</label>
                      <p className="text-xs text-gray-500">显示系统桌面通知</p>
                    </div>
                    <Switch
                      checked={settings.notifications.desktop}
                      onCheckedChange={(checked) => updateSetting('notifications', 'desktop', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">仅关键通知</label>
                      <p className="text-xs text-gray-500">只显示重要和错误通知</p>
                    </div>
                    <Switch
                      checked={settings.notifications.criticalOnly}
                      onCheckedChange={(checked) => updateSetting('notifications', 'criticalOnly', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 系统设置 */}
            {activeTab === 'system' && (
              <Card className="bg-industrial-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>系统设置</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">自动保存</label>
                      <p className="text-xs text-gray-500">自动保存实验数据</p>
                    </div>
                    <Switch
                      checked={settings.system.autoSave}
                      onCheckedChange={(checked) => updateSetting('system', 'autoSave', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">数据备份</label>
                      <p className="text-xs text-gray-500">定期备份重要数据</p>
                    </div>
                    <Switch
                      checked={settings.system.backupEnabled}
                      onCheckedChange={(checked) => updateSetting('system', 'backupEnabled', checked)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      日志级别
                    </label>
                    <Select 
                      value={settings.system.logLevel} 
                      onValueChange={(value) => updateSetting('system', 'logLevel', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">调试 (Debug)</SelectItem>
                        <SelectItem value="info">信息 (Info)</SelectItem>
                        <SelectItem value="warn">警告 (Warning)</SelectItem>
                        <SelectItem value="error">错误 (Error)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      最大日志大小: {settings.system.maxLogSize}MB
                    </label>
                    <Slider
                      value={[settings.system.maxLogSize]}
                      onValueChange={(value) => updateSetting('system', 'maxLogSize', value[0])}
                      min={10}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      会话超时: {settings.system.sessionTimeout}分钟
                    </label>
                    <Slider
                      value={[settings.system.sessionTimeout]}
                      onValueChange={(value) => updateSetting('system', 'sessionTimeout', value[0])}
                      min={5}
                      max={120}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 设备配置 */}
            {activeTab === 'device' && (
              <Card className="bg-industrial-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>设备配置</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      设备ID
                    </label>
                    <input
                      type="text"
                      value={settings.device.deviceId}
                      onChange={(e) => updateSetting('device', 'deviceId', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      采样频率: {settings.device.sampleRate}Hz
                    </label>
                    <Slider
                      value={[settings.device.sampleRate]}
                      onValueChange={(value) => updateSetting('device', 'sampleRate', value[0])}
                      min={100}
                      max={10000}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      缓冲区大小: {settings.device.bufferSize}
                    </label>
                    <Slider
                      value={[settings.device.bufferSize]}
                      onValueChange={(value) => updateSetting('device', 'bufferSize', value[0])}
                      min={256}
                      max={8192}
                      step={256}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        校准日期
                      </label>
                      <input
                        type="date"
                        value={settings.device.calibrationDate}
                        onChange={(e) => updateSetting('device', 'calibrationDate', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        下次校准
                      </label>
                      <input
                        type="date"
                        value={settings.device.nextCalibration}
                        onChange={(e) => updateSetting('device', 'nextCalibration', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 网络设置 */}
            {activeTab === 'network' && (
              <Card className="bg-industrial-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Wifi className="h-5 w-5" />
                    <span>网络设置</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      API端点
                    </label>
                    <input
                      type="url"
                      value={settings.network.apiEndpoint}
                      onChange={(e) => updateSetting('network', 'apiEndpoint', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      请求超时: {settings.network.timeout}ms
                    </label>
                    <Slider
                      value={[settings.network.timeout]}
                      onValueChange={(value) => updateSetting('network', 'timeout', value[0])}
                      min={1000}
                      max={30000}
                      step={1000}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      重试次数: {settings.network.retryAttempts}
                    </label>
                    <Slider
                      value={[settings.network.retryAttempts]}
                      onValueChange={(value) => updateSetting('network', 'retryAttempts', value[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-300">启用SSL</label>
                      <p className="text-xs text-gray-500">使用HTTPS安全连接</p>
                    </div>
                    <Switch
                      checked={settings.network.enableSSL}
                      onCheckedChange={(checked) => updateSetting('network', 'enableSSL', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 用户信息 */}
            {activeTab === 'user' && (
              <Card className="bg-industrial-dark border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>用户信息</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      姓名
                    </label>
                    <input
                      type="text"
                      value={settings.user.name}
                      onChange={(e) => updateSetting('user', 'name', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={settings.user.email}
                      onChange={(e) => updateSetting('user', 'email', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      电话
                    </label>
                    <input
                      type="tel"
                      value={settings.user.phone}
                      onChange={(e) => updateSetting('user', 'phone', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      组织机构
                    </label>
                    <input
                      type="text"
                      value={settings.user.organization}
                      onChange={(e) => updateSetting('user', 'organization', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      用户角色
                    </label>
                    <Select 
                      value={settings.user.role} 
                      onValueChange={(value) => updateSetting('user', 'role', value)}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">系统管理员</SelectItem>
                        <SelectItem value="engineer">测试工程师</SelectItem>
                        <SelectItem value="operator">操作员</SelectItem>
                        <SelectItem value="viewer">观察者</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
