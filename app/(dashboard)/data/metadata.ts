import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '数据管理',
  description: '光伏快速关断器实验数据文件管理系统，支持Excel、CSV、JSON、PDF格式文件的上传、下载、查看和分析。提供批量处理、版本控制和数据校验功能。',
  keywords: [
    '数据管理',
    '文件管理',
    'Excel数据处理',
    'CSV导入导出',
    '数据文件',
    '批量处理',
    '数据校验',
    '版本控制',
  ],
  openGraph: {
    title: '数据管理 | PVRSD测试系统',
    description: '实验数据文件管理与分析，支持多格式文件处理和批量操作',
    url: '/data',
  },
}

