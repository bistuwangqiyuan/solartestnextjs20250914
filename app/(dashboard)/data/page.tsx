'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
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
  Clock,
  HardDrive,
  Eye,
  Edit,
  Share2,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface DataFile {
  id: string
  name: string
  type: 'excel' | 'csv' | 'json' | 'pdf'
  size: number
  uploadTime: Date
  modifiedTime: Date
  experimentId?: string
  experimentType?: string
  status: 'valid' | 'processing' | 'error'
  tags: string[]
  uploadedBy: string
}

// Mock data files
const mockFiles: DataFile[] = [
  {
    id: '1',
    name: '高压试验_20250502_001.xlsx',
    type: 'excel',
    size: 1024 * 256,
    uploadTime: new Date('2025-05-02T10:30:00'),
    modifiedTime: new Date('2025-05-02T10:30:00'),
    experimentId: 'EXP-001',
    experimentType: 'high_voltage',
    status: 'valid',
    tags: ['高压试验', '1000V', '合格'],
    uploadedBy: '测试工程师A',
  },
  {
    id: '2',
    name: '泄漏电流测试数据.csv',
    type: 'csv',
    size: 1024 * 128,
    uploadTime: new Date('2025-05-02T14:15:00'),
    modifiedTime: new Date('2025-05-02T14:20:00'),
    experimentId: 'EXP-002',
    experimentType: 'leakage_current',
    status: 'valid',
    tags: ['泄漏电流', '多通道', '温度补偿'],
    uploadedBy: '测试工程师B',
  },
  {
    id: '3',
    name: '正常工况性能曲线.json',
    type: 'json',
    size: 1024 * 512,
    uploadTime: new Date('2025-05-03T09:00:00'),
    modifiedTime: new Date('2025-05-03T09:00:00'),
    experimentId: 'EXP-003',
    experimentType: 'normal_operation',
    status: 'processing',
    tags: ['性能测试', '效率曲线'],
    uploadedBy: '数据分析师',
  },
  {
    id: '4',
    name: '故障保护测试报告.pdf',
    type: 'pdf',
    size: 1024 * 1024 * 2,
    uploadTime: new Date('2025-05-01T16:45:00'),
    modifiedTime: new Date('2025-05-01T16:45:00'),
    experimentId: 'EXP-004',
    experimentType: 'abnormal_operation',
    status: 'valid',
    tags: ['测试报告', '保护功能', '认证'],
    uploadedBy: '质量工程师',
  },
]

// Format file size
const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB'
}

// Get file icon
const getFileIcon = (type: string) => {
  switch (type) {
    case 'excel':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    case 'csv':
      return <FileText className="h-5 w-5 text-blue-500" />
    case 'json':
      return <FileJson className="h-5 w-5 text-yellow-500" />
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />
    default:
      return <FileText className="h-5 w-5 text-gray-500" />
  }
}

// Get experiment type name
const getExperimentTypeName = (type?: string) => {
  switch (type) {
    case 'high_voltage':
      return '高压试验'
    case 'leakage_current':
      return '泄漏电流'
    case 'normal_operation':
      return '正常工况'
    case 'abnormal_operation':
      return '非正常工况'
    case 'simulation':
      return '仿真分析'
    default:
      return '未分类'
  }
}

export default function DataManagementPage() {
  const [files, setFiles] = useState<DataFile[]>(mockFiles)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'time' | 'size'>('time')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)

  // Filter and sort files
  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesType = filterType === 'all' || file.experimentType === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'time':
          return b.uploadTime.getTime() - a.uploadTime.getTime()
        case 'size':
          return b.size - a.size
        default:
          return 0
      }
    })

  // Handle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const selectAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map(f => f.id))
    }
  }

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleFileUpload = (files: FileList) => {
    setShowUploadModal(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setShowUploadModal(false)
            // Add new files to the list
            const newFiles: DataFile[] = Array.from(files).map((file, index) => ({
              id: `new-${Date.now()}-${index}`,
              name: file.name,
              type: file.name.endsWith('.xlsx') ? 'excel' :
                    file.name.endsWith('.csv') ? 'csv' :
                    file.name.endsWith('.json') ? 'json' : 'pdf',
              size: file.size,
              uploadTime: new Date(),
              modifiedTime: new Date(),
              status: 'valid',
              tags: ['新上传'],
              uploadedBy: '当前用户',
            }))
            setFiles(prev => [...newFiles, ...prev])
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Calculate storage statistics
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)
  const validFiles = files.filter(f => f.status === 'valid').length
  const processingFiles = files.filter(f => f.status === 'processing').length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-cyan/20 rounded-lg">
            <HardDrive className="h-6 w-6 text-industrial-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">数据管理</h1>
            <p className="text-sm text-gray-400">实验数据文件管理与分析</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => document.getElementById('file-upload')?.click()}
            className="btn-industrial flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            上传文件
          </button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            accept=".xlsx,.xls,.csv,.json,.pdf"
          />
        </div>
      </div>

      {/* Storage statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="data-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">总文件数</span>
            <FileText className="h-4 w-4 text-industrial-cyan" />
          </div>
          <p className="text-2xl font-bold text-white">{files.length}</p>
          <p className="text-xs text-gray-400 mt-1">{validFiles} 有效 / {processingFiles} 处理中</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="data-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">存储空间</span>
            <HardDrive className="h-4 w-4 text-industrial-warning" />
          </div>
          <p className="text-2xl font-bold text-white">{formatFileSize(totalSize)}</p>
          <p className="text-xs text-gray-400 mt-1">已用 / 100 GB 总容量</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="data-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">今日上传</span>
            <Upload className="h-4 w-4 text-industrial-success" />
          </div>
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-xs text-gray-400 mt-1">+20% 相比昨日</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="data-card"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">数据完整性</span>
            <CheckCircle className="h-4 w-4 text-industrial-success" />
          </div>
          <p className="text-2xl font-bold text-white">99.8%</p>
          <p className="text-xs text-gray-400 mt-1">1 个文件需要修复</p>
        </motion.div>
      </div>

      {/* Search and filter bar */}
      <div className="data-card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索文件名或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-industrial w-full pl-10"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-industrial"
            >
              <option value="all">所有类型</option>
              <option value="high_voltage">高压试验</option>
              <option value="leakage_current">泄漏电流</option>
              <option value="normal_operation">正常工况</option>
              <option value="abnormal_operation">非正常工况</option>
              <option value="simulation">仿真分析</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="input-industrial"
            >
              <option value="time">上传时间</option>
              <option value="name">文件名</option>
              <option value="size">文件大小</option>
            </select>
            
            <div className="flex items-center gap-1 border border-industrial-light rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-industrial-cyan text-industrial-dark' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-industrial-cyan text-industrial-dark' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File list/grid */}
      <div className="data-card">
        {selectedFiles.length > 0 && (
          <div className="mb-4 p-3 bg-industrial-cyan/10 rounded-lg flex items-center justify-between">
            <span className="text-sm text-industrial-cyan">
              已选择 {selectedFiles.length} 个文件
            </span>
            <div className="flex items-center gap-2">
              <button className="text-sm text-industrial-cyan hover:text-white transition-colors">
                <Download className="h-4 w-4 inline mr-1" />
                批量下载
              </button>
              <button className="text-sm text-industrial-danger hover:text-white transition-colors">
                <Trash2 className="h-4 w-4 inline mr-1" />
                批量删除
              </button>
            </div>
          </div>
        )}
        
        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-industrial-light">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={selectAllFiles}
                      className="rounded border-gray-600 text-industrial-cyan focus:ring-industrial-cyan"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">文件名</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">类型</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">大小</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">上传时间</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">状态</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-400 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-industrial-light/50 hover:bg-industrial-dark/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="rounded border-gray-600 text-industrial-cyan focus:ring-industrial-cyan"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-gray-400">{getExperimentTypeName(file.experimentType)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-300">{file.type.toUpperCase()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-300">{formatFileSize(file.size)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <p className="text-gray-300">
                          {format(file.uploadTime, 'yyyy-MM-dd', { locale: zhCN })}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(file.uploadTime, 'HH:mm:ss')}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        file.status === 'valid' ? 'bg-industrial-success/20 text-industrial-success' :
                        file.status === 'processing' ? 'bg-industrial-warning/20 text-industrial-warning' :
                        'bg-industrial-danger/20 text-industrial-danger'
                      }`}>
                        {file.status === 'valid' ? <CheckCircle className="h-3 w-3" /> :
                         file.status === 'processing' ? <Clock className="h-3 w-3" /> :
                         <XCircle className="h-3 w-3" />}
                        {file.status === 'valid' ? '有效' :
                         file.status === 'processing' ? '处理中' : '错误'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-industrial-danger transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-industrial-darker rounded-lg border border-industrial-light hover:border-industrial-cyan transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  {getFileIcon(file.type)}
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => toggleFileSelection(file.id)}
                    className="rounded border-gray-600 text-industrial-cyan focus:ring-industrial-cyan"
                  />
                </div>
                <h4 className="text-sm font-medium text-white mb-1 truncate">{file.name}</h4>
                <p className="text-xs text-gray-400 mb-3">{getExperimentTypeName(file.experimentType)}</p>
                <div className="space-y-1 text-xs text-gray-400">
                  <p>{formatFileSize(file.size)}</p>
                  <p>{format(file.uploadTime, 'yyyy-MM-dd HH:mm')}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-industrial-light flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 text-xs ${
                    file.status === 'valid' ? 'text-industrial-success' :
                    file.status === 'processing' ? 'text-industrial-warning' :
                    'text-industrial-danger'
                  }`}>
                    {file.status === 'valid' ? <CheckCircle className="h-3 w-3" /> :
                     file.status === 'processing' ? <Clock className="h-3 w-3" /> :
                     <XCircle className="h-3 w-3" />}
                    {file.status === 'valid' ? '有效' :
                     file.status === 'processing' ? '处理中' : '错误'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Eye className="h-3 w-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Drag and drop overlay */}
      <AnimatePresence>
        {dragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-industrial-dark/90 z-50 flex items-center justify-center"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <Upload className="h-16 w-16 text-industrial-cyan mx-auto mb-4" />
              <p className="text-2xl font-bold text-white mb-2">拖放文件到此处</p>
              <p className="text-gray-400">支持 Excel, CSV, JSON, PDF 格式</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload progress modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-industrial-dark/90 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-industrial-dark border border-industrial-light rounded-lg p-6 w-96"
            >
              <h3 className="text-lg font-semibold text-white mb-4">正在上传文件</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">上传进度</span>
                  <span className="text-sm font-medium text-white">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-industrial-darker rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-industrial-cyan to-industrial-success h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
              {uploadProgress === 100 && (
                <div className="flex items-center gap-2 text-industrial-success">
                  <CheckCircle className="h-5 w-5" />
                  <span>上传完成！</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}