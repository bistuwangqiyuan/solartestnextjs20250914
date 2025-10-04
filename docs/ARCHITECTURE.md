# 光伏快速关断器实验数据管理系统 - 技术架构设计文档

## 文档信息

- **项目名称**: PVRSD 光伏快速关断器实验数据管理系统
- **版本**: v1.0.0
- **创建日期**: 2025-01-01
- **更新日期**: 2025-10-04
- **文档状态**: 正式版
- **作者**: PVRSD 开发团队

---

## 目录

1. [概述](#1-概述)
2. [系统架构](#2-系统架构)
3. [技术栈](#3-技术栈)
4. [前端架构](#4-前端架构)
5. [后端架构](#5-后端架构)
6. [数据库设计](#6-数据库设计)
7. [API设计](#7-api设计)
8. [安全架构](#8-安全架构)
9. [部署架构](#9-部署架构)
10. [性能优化](#10-性能优化)
11. [监控与日志](#11-监控与日志)
12. [扩展性设计](#12-扩展性设计)

---

## 1. 概述

### 1.1 系统简介

PVRSD 光伏快速关断器实验数据管理系统是一款面向工业4.0的现代化测试数据管理平台，提供从数据采集、存储、分析到报告生成的全流程解决方案。

### 1.2 设计目标

- **高性能**: 支持实时数据采集和展示（≥10Hz刷新率）
- **高可用**: 系统可用性达到99.9%
- **可扩展**: 支持水平扩展，满足业务增长需求
- **安全性**: 企业级数据安全保障
- **易维护**: 模块化设计，便于维护和升级

### 1.3 核心特性

- 实时数据可视化大屏
- 多类型实验测试支持
- 智能数据分析
- 自动化报告生成
- 移动端响应式设计

---

## 2. 系统架构

### 2.1 总体架构

```
┌─────────────────────────────────────────────────────────────┐
│                         用户层                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  浏览器  │  │  平板    │  │  手机    │  │  大屏    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      CDN层 (Netlify Edge)                    │
│              静态资源缓存 / 边缘计算 / DDoS防护              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    应用层 (Next.js 14)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  SSR渲染     │  │  API Routes  │  │  Server      │     │
│  │  页面组件    │  │  端点处理    │  │  Actions     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   BaaS层 (Supabase)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │  Realtime    │  │  Storage     │     │
│  │  数据库      │  │  实时订阅    │  │  文件存储    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Auth        │  │  Edge Func   │                        │
│  │  认证授权    │  │  边缘函数    │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    外部服务层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  测试设备    │  │  分析服务    │  │  监控告警    │     │
│  │  数据接口    │  │  AI/ML       │  │  日志系统    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 架构特点

#### 2.2.1 Jamstack架构
- **解耦设计**: 前端和后端完全分离
- **预渲染**: 静态生成+服务端渲染混合模式
- **边缘计算**: CDN边缘节点处理请求
- **API优先**: RESTful API和GraphQL支持

#### 2.2.2 微前端思想
- **模块化**: 功能模块独立开发和部署
- **组件化**: 可复用的UI组件库
- **路由分离**: 基于文件系统的路由结构

#### 2.2.3 实时架构
- **WebSocket连接**: 实时数据推送
- **事件驱动**: PostgreSQL Change Data Capture
- **乐观更新**: 本地缓存+服务端同步

---

## 3. 技术栈

### 3.1 前端技术栈

#### 3.1.1 核心框架
```typescript
{
  "framework": "Next.js 14.2.32",
  "runtime": "React 18.2.0",
  "language": "TypeScript 5.3.3",
  "routing": "App Router (Next.js 14+)"
}
```

#### 3.1.2 UI框架
- **Tailwind CSS 3.4.1**: 原子化CSS框架
- **Shadcn/ui**: 高质量React组件库
- **Radix UI**: 无障碍访问的组件基础
- **Framer Motion 11.18.2**: 动画库

#### 3.1.3 数据可视化
- **Recharts 2.15.4**: React图表库
- **D3.js 7.8.5**: 底层可视化库
- **React Three Fiber**: 3D可视化
- **Three.js 0.161.0**: WebGL 3D引擎

#### 3.1.4 状态管理
- **Zustand 4.5.0**: 轻量级状态管理
- **React Hook Form 7.49.3**: 表单管理
- **TanStack Table 8.11.7**: 表格状态管理

#### 3.1.5 工具库
- **ExcelJS 4.4.0**: Excel文件处理
- **date-fns 3.3.1**: 日期处理
- **Zod 3.22.4**: 数据验证
- **clsx/tailwind-merge**: 类名合并

### 3.2 后端技术栈

#### 3.2.1 BaaS平台
- **Supabase 2.39.3**: 后端即服务
  - PostgreSQL 15+: 主数据库
  - PostgREST: 自动生成RESTful API
  - Realtime: WebSocket实时订阅
  - Storage: S3兼容对象存储
  - Auth: JWT认证系统

#### 3.2.2 API设计
- **Next.js API Routes**: 服务端API端点
- **Server Actions**: React Server Actions
- **tRPC (可选)**: 类型安全的API

### 3.3 部署与运维

#### 3.3.1 部署平台
- **Netlify**: 主要部署平台
  - 自动CI/CD
  - 边缘函数
  - 分支预览
  - A/B测试支持

#### 3.3.2 监控与日志
- **Vercel Analytics**: 性能监控
- **Sentry**: 错误追踪
- **LogRocket**: 用户会话录制
- **Google Analytics**: 用户行为分析

---

## 4. 前端架构

### 4.1 目录结构

```
app/
├── (auth)/                    # 认证路由组
│   ├── login/                 # 登录页面
│   └── register/              # 注册页面
├── (dashboard)/               # 主应用路由组
│   ├── dashboard/             # 数据大屏
│   ├── experiments/           # 实验管理
│   │   ├── high-voltage/      # 高压试验
│   │   ├── leakage/           # 泄漏电流
│   │   ├── normal/            # 正常工况
│   │   ├── abnormal/          # 非正常工况
│   │   └── simulation/        # 实验仿真
│   ├── data/                  # 数据管理
│   ├── reports/               # 报告管理
│   ├── settings/              # 系统设置
│   ├── help/                  # 帮助中心
│   └── layout.tsx             # Dashboard布局
├── api/                       # API路由
│   ├── experiments/           # 实验相关API
│   ├── data/                  # 数据处理API
│   ├── reports/               # 报告生成API
│   └── webhooks/              # Webhook处理
├── layout.tsx                 # 根布局
├── page.tsx                   # 首页
└── globals.css                # 全局样式

components/
├── ui/                        # 基础UI组件
│   ├── button.tsx
│   ├── card.tsx
│   ├── select.tsx
│   └── ...
├── dashboard/                 # 仪表板组件
│   ├── MetricCard.tsx
│   ├── RealtimeChart.tsx
│   └── DeviceStatus.tsx
├── experiments/               # 实验组件
│   ├── TestPanel.tsx
│   ├── DataViewer.tsx
│   └── ControlPanel.tsx
├── charts/                    # 图表组件
│   ├── LineChart.tsx
│   ├── BarChart.tsx
│   └── HeatMap.tsx
└── layout/                    # 布局组件
    ├── Header.tsx
    ├── Sidebar.tsx
    └── Footer.tsx

lib/
├── supabase/                  # Supabase客户端
│   ├── client.ts              # 客户端实例
│   └── server.ts              # 服务端实例
├── utils/                     # 工具函数
│   ├── cn.ts                  # 类名合并
│   ├── format.ts              # 数据格式化
│   └── validation.ts          # 数据验证
├── hooks/                     # 自定义Hooks
│   ├── useRealtime.ts         # 实时数据Hook
│   ├── useExperiment.ts       # 实验管理Hook
│   └── useAuth.ts             # 认证Hook
└── stores/                    # 状态管理
    ├── authStore.ts           # 认证状态
    ├── experimentStore.ts     # 实验状态
    └── uiStore.ts             # UI状态

types/
├── database.ts                # 数据库类型
├── experiment.ts              # 实验类型
├── chart.ts                   # 图表类型
└── api.ts                     # API类型
```

### 4.2 渲染策略

#### 4.2.1 静态生成 (SSG)
用于不经常变化的页面：
- 首页 (`/`)
- 帮助中心 (`/help`)
- 关于页面

```typescript
// app/page.tsx
export default async function HomePage() {
  // 构建时生成静态HTML
  return <LandingPage />
}
```

#### 4.2.2 服务端渲染 (SSR)
用于需要最新数据的页面：
- 数据大屏 (`/dashboard`)
- 实验列表

```typescript
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const data = await fetchDashboardData()
  return <Dashboard data={data} />
}
```

#### 4.2.3 客户端渲染 (CSR)
用于交互频繁的页面：
- 实验控制面板
- 实时数据图表

```typescript
'use client'

export default function ExperimentPanel() {
  const { data, isLoading } = useRealtime()
  return <Panel data={data} />
}
```

#### 4.2.4 增量静态再生 (ISR)
用于需要定期更新的页面：
- 报告页面
- 统计页面

```typescript
export const revalidate = 3600 // 1小时重新生成

export default async function ReportsPage() {
  const reports = await fetchReports()
  return <ReportsList reports={reports} />
}
```

### 4.3 数据流架构

```
┌──────────────────────────────────────────────────────────┐
│                      用户操作                             │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                   React组件事件                           │
│                  (onClick, onChange)                      │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                  Zustand Actions                          │
│              (更新本地状态 - 乐观更新)                    │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│               API请求 / Server Action                     │
│            (发送到Next.js API或Supabase)                  │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                    Supabase处理                           │
│         (数据验证、存储、触发Realtime事件)                │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                 Realtime订阅推送                          │
│              (通过WebSocket推送更新)                      │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│                 React组件自动更新                         │
│              (UI反映最新数据状态)                         │
└──────────────────────────────────────────────────────────┘
```

### 4.4 组件设计原则

#### 4.4.1 组件分层
- **Page组件**: 页面级组件，处理数据获取和路由
- **Feature组件**: 功能组件，包含业务逻辑
- **UI组件**: 纯展示组件，无业务逻辑

#### 4.4.2 组件通信
- **Props传递**: 父子组件通信
- **Context**: 跨层级组件通信
- **Zustand Store**: 全局状态共享
- **Custom Events**: 松耦合组件通信

#### 4.4.3 性能优化
- **React.memo**: 防止不必要的重渲染
- **useMemo/useCallback**: 缓存计算结果和函数
- **动态导入**: Code Splitting按需加载
- **虚拟滚动**: 大列表性能优化

---

## 5. 后端架构

### 5.1 Supabase架构

#### 5.1.1 核心服务

```
┌─────────────────────────────────────────────────────────┐
│                    Supabase Platform                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ PostgreSQL   │  │ PostgREST    │  │ Realtime     │ │
│  │              │  │              │  │              │ │
│  │ • 数据存储   │  │ • REST API   │  │ • WebSocket  │ │
│  │ • 触发器     │  │ • 查询构建   │  │ • 订阅机制   │ │
│  │ • RLS策略    │  │ • 权限控制   │  │ • 广播       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Storage      │  │ Auth         │  │ Edge Func    │ │
│  │              │  │              │  │              │ │
│  │ • S3存储     │  │ • JWT认证    │  │ • 边缘计算   │ │
│  │ • CDN加速    │  │ • 社交登录   │  │ • 后台任务   │ │
│  │ • 访问控制   │  │ • MFA        │  │ • Webhooks   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### 5.1.2 数据层架构

**PostgreSQL配置**:
```sql
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID生成
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- 加密功能
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- 性能监控
CREATE EXTENSION IF NOT EXISTS "timescaledb";    -- 时序数据优化

-- 配置连接池
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
```

**行级安全策略 (RLS)**:
```sql
-- 启用RLS
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的实验数据
CREATE POLICY "Users can view own experiments"
ON experiments FOR SELECT
USING (auth.uid() = user_id);

-- 管理员可以查看所有数据
CREATE POLICY "Admins can view all experiments"
ON experiments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);
```

### 5.2 API设计

#### 5.2.1 RESTful API
```typescript
// Next.js API Routes
// app/api/experiments/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('experiments')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('experiments')
    .insert(body)
    .select()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  
  return NextResponse.json({ data }, { status: 201 })
}
```

#### 5.2.2 Server Actions
```typescript
// app/actions/experiments.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createExperiment(formData: FormData) {
  const supabase = createClient()
  
  const experiment = {
    name: formData.get('name'),
    type: formData.get('type'),
    // ... 其他字段
  }
  
  const { data, error } = await supabase
    .from('experiments')
    .insert(experiment)
    .select()
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/experiments')
  return { data }
}
```

### 5.3 实时数据架构

#### 5.3.1 Realtime订阅
```typescript
// hooks/useRealtime.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useRealtimeExperiment(experimentId: string) {
  const [data, setData] = useState(null)
  const supabase = createClient()
  
  useEffect(() => {
    // 订阅数据变化
    const channel = supabase
      .channel(`experiment:${experimentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'test_data',
          filter: `experiment_id=eq.${experimentId}`
        },
        (payload) => {
          console.log('Change received!', payload)
          setData(payload.new)
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [experimentId])
  
  return data
}
```

#### 5.3.2 数据推送策略
- **高频数据**: 使用Broadcast广播（避免数据库写入）
- **持久化数据**: 通过数据库触发器推送变更
- **聚合数据**: 后台定时任务计算并推送

---

## 6. 数据库设计

### 6.1 ER图

```
┌─────────────────┐         ┌─────────────────┐
│     users       │         │  organizations  │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │────────<│ id (PK)         │
│ email           │         │ name            │
│ name            │         │ plan            │
│ avatar_url      │         │ created_at      │
│ organization_id │>───────┐│ updated_at      │
│ created_at      │        │└─────────────────┘
│ updated_at      │        │
└─────────────────┘        │
        │                  │
        │                  │
        ↓                  │
┌─────────────────┐        │
│   user_roles    │        │
├─────────────────┤        │
│ id (PK)         │        │
│ user_id (FK)    │>───────┘
│ role            │
│ created_at      │
└─────────────────┘
        
┌─────────────────┐         ┌─────────────────┐
│    devices      │         │  experiments    │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │<────────│ id (PK)         │
│ device_code     │         │ device_id (FK)  │
│ device_type     │         │ experiment_type │
│ model           │         │ operator_id (FK)│
│ status          │         │ start_time      │
│ created_at      │         │ end_time        │
└─────────────────┘         │ status          │
                            │ result          │
                            │ created_at      │
                            └─────────────────┘
                                    │
                                    │
                                    ↓
                            ┌─────────────────┐
                            │   test_data     │
                            ├─────────────────┤
                            │ id (PK)         │
                            │ experiment_id(FK)│
                            │ timestamp       │
                            │ voltage         │
                            │ current         │
                            │ power           │
                            │ temperature     │
                            │ additional_data │
                            └─────────────────┘
```

### 6.2 核心表结构

#### 6.2.1 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org ON users(organization_id);
```

#### 6.2.2 设备表 (devices)
```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_code VARCHAR(50) UNIQUE NOT NULL,
  device_type VARCHAR(50) NOT NULL,
  manufacturer VARCHAR(100),
  model VARCHAR(100),
  serial_number VARCHAR(100),
  rated_voltage DECIMAL(10,2),
  rated_current DECIMAL(10,2),
  rated_power DECIMAL(10,2),
  calibration_date DATE,
  next_calibration_date DATE,
  status VARCHAR(20) DEFAULT 'idle',
  location VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_devices_code ON devices(device_code);
CREATE INDEX idx_devices_type ON devices(device_type);
CREATE INDEX idx_devices_status ON devices(status);
```

#### 6.2.3 实验表 (experiments)
```sql
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id UUID REFERENCES devices(id) ON DELETE RESTRICT,
  experiment_type VARCHAR(50) NOT NULL,
  operator_id UUID REFERENCES users(id),
  test_standard VARCHAR(100),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  status VARCHAR(20) DEFAULT 'pending',
  result VARCHAR(20),
  test_parameters JSONB,
  environment_conditions JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_experiments_device ON experiments(device_id);
CREATE INDEX idx_experiments_type ON experiments(experiment_type);
CREATE INDEX idx_experiments_status ON experiments(status);
CREATE INDEX idx_experiments_start_time ON experiments(start_time DESC);
CREATE INDEX idx_experiments_operator ON experiments(operator_id);
```

#### 6.2.4 测试数据表 (test_data)
```sql
-- 使用TimescaleDB优化时序数据
CREATE TABLE test_data (
  id BIGSERIAL,
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  voltage DECIMAL(10,4),
  current DECIMAL(10,6),
  power DECIMAL(10,4),
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  leakage_current DECIMAL(10,8),
  insulation_resistance DECIMAL(15,2),
  additional_data JSONB,
  PRIMARY KEY (id, timestamp)
);

-- 转换为时序表（TimescaleDB）
SELECT create_hypertable('test_data', 'timestamp');

-- 创建压缩策略
ALTER TABLE test_data SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'experiment_id'
);

-- 自动压缩超过7天的数据
SELECT add_compression_policy('test_data', INTERVAL '7 days');

-- 索引
CREATE INDEX idx_test_data_experiment ON test_data(experiment_id, timestamp DESC);
```

#### 6.2.5 报告表 (reports)
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES experiments(id),
  report_type VARCHAR(50),
  title VARCHAR(200),
  generated_by UUID REFERENCES users(id),
  file_url TEXT,
  file_size BIGINT,
  format VARCHAR(20),
  status VARCHAR(20) DEFAULT 'generating',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_reports_experiment ON reports(experiment_id);
CREATE INDEX idx_reports_created ON reports(created_at DESC);
```

### 6.3 数据库优化

#### 6.3.1 分区策略
```sql
-- 按时间分区test_data表（已通过TimescaleDB实现）
-- 按实验类型分区experiments表
CREATE TABLE experiments_high_voltage 
  PARTITION OF experiments
  FOR VALUES IN ('high_voltage');

CREATE TABLE experiments_leakage 
  PARTITION OF experiments
  FOR VALUES IN ('leakage');
```

#### 6.3.2 物化视图
```sql
-- 实验统计物化视图
CREATE MATERIALIZED VIEW experiment_stats AS
SELECT 
  experiment_type,
  DATE_TRUNC('day', start_time) as date,
  COUNT(*) as total_count,
  COUNT(*) FILTER (WHERE result = 'pass') as pass_count,
  COUNT(*) FILTER (WHERE result = 'fail') as fail_count,
  AVG(duration_seconds) as avg_duration
FROM experiments
WHERE start_time >= NOW() - INTERVAL '90 days'
GROUP BY experiment_type, DATE_TRUNC('day', start_time);

-- 创建索引
CREATE INDEX idx_experiment_stats_type_date 
  ON experiment_stats(experiment_type, date DESC);

-- 定时刷新
CREATE OR REPLACE FUNCTION refresh_experiment_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY experiment_stats;
END;
$$ LANGUAGE plpgsql;

-- 每小时刷新一次
SELECT cron.schedule('refresh-stats', '0 * * * *', 'SELECT refresh_experiment_stats()');
```

#### 6.3.3 触发器
```sql
-- 自动更新updated_at字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 实验结束时计算持续时间
CREATE OR REPLACE FUNCTION calculate_experiment_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_time IS NOT NULL AND OLD.end_time IS NULL THEN
    NEW.duration_seconds = EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_duration
  BEFORE UPDATE ON experiments
  FOR EACH ROW
  EXECUTE FUNCTION calculate_experiment_duration();
```

---

## 7. API设计

### 7.1 API规范

#### 7.1.1 RESTful API规范
```
基础URL: /api/v1

资源命名:
- 使用复数名词: /experiments, /devices
- 使用小写和连字符: /test-data
- 嵌套资源: /experiments/{id}/test-data

HTTP方法:
- GET: 查询资源
- POST: 创建资源
- PUT: 完整更新资源
- PATCH: 部分更新资源
- DELETE: 删除资源

状态码:
- 200: 成功
- 201: 创建成功
- 204: 删除成功
- 400: 请求错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误
```

#### 7.1.2 API响应格式
```typescript
// 成功响应
interface SuccessResponse<T> {
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

// 错误响应
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### 7.2 核心API端点

#### 7.2.1 实验管理API
```typescript
// 获取实验列表
GET /api/v1/experiments
Query: {
  page?: number
  limit?: number
  type?: string
  status?: string
  startDate?: string
  endDate?: string
}
Response: {
  data: Experiment[]
  meta: { page, limit, total }
}

// 创建实验
POST /api/v1/experiments
Body: {
  deviceId: string
  experimentType: string
  testStandard: string
  parameters: object
}
Response: {
  data: Experiment
}

// 获取实验详情
GET /api/v1/experiments/{id}
Response: {
  data: Experiment
}

// 更新实验
PATCH /api/v1/experiments/{id}
Body: Partial<Experiment>
Response: {
  data: Experiment
}

// 删除实验
DELETE /api/v1/experiments/{id}
Response: 204 No Content
```

#### 7.2.2 测试数据API
```typescript
// 获取实验的测试数据
GET /api/v1/experiments/{id}/test-data
Query: {
  startTime?: string
  endTime?: string
  limit?: number
  interval?: string  // 聚合间隔: '1s', '10s', '1m'
}
Response: {
  data: TestData[]
}

// 批量插入测试数据
POST /api/v1/experiments/{id}/test-data/batch
Body: {
  data: TestData[]
}
Response: {
  data: { inserted: number }
}

// 导出测试数据
GET /api/v1/experiments/{id}/test-data/export
Query: {
  format: 'excel' | 'csv' | 'json'
}
Response: File Download
```

#### 7.2.3 报告API
```typescript
// 生成报告
POST /api/v1/reports
Body: {
  experimentId: string
  reportType: string
  format: 'pdf' | 'excel'
  template?: string
}
Response: {
  data: {
    reportId: string
    status: 'generating'
  }
}

// 获取报告状态
GET /api/v1/reports/{id}
Response: {
  data: {
    id: string
    status: 'generating' | 'completed' | 'failed'
    url?: string
  }
}

// 下载报告
GET /api/v1/reports/{id}/download
Response: File Download
```

### 7.3 WebSocket API

#### 7.3.1 实时数据订阅
```typescript
// 连接WebSocket
const ws = new WebSocket('wss://api.example.com/ws')

// 订阅实验数据
ws.send(JSON.stringify({
  type: 'subscribe',
  channel: `experiment:${experimentId}`,
  event: 'test_data'
}))

// 接收实时数据
ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (message.type === 'test_data') {
    console.log('New data:', message.payload)
  }
}
```

---

## 8. 安全架构

### 8.1 认证授权

#### 8.1.1 JWT认证
```typescript
// 用户登录
POST /api/auth/login
Body: {
  email: string
  password: string
}
Response: {
  access_token: string
  refresh_token: string
  expires_in: number
}

// Token刷新
POST /api/auth/refresh
Body: {
  refresh_token: string
}
Response: {
  access_token: string
  expires_in: number
}
```

#### 8.1.2 权限控制 (RBAC)
```typescript
enum Role {
  ADMIN = 'admin',
  ENGINEER = 'engineer',
  ANALYST = 'analyst',
  VIEWER = 'viewer'
}

const permissions = {
  admin: ['*'],
  engineer: [
    'experiments.create',
    'experiments.update',
    'experiments.read',
    'devices.update',
    'reports.create'
  ],
  analyst: [
    'experiments.read',
    'data.read',
    'data.export',
    'reports.read'
  ],
  viewer: [
    'experiments.read',
    'data.read'
  ]
}
```

### 8.2 数据安全

#### 8.2.1 加密策略
- **传输加密**: 强制HTTPS/TLS 1.3
- **存储加密**: 敏感字段AES-256加密
- **密码加密**: bcrypt哈希 + salt

#### 8.2.2 RLS策略示例
```sql
-- 用户只能访问自己组织的数据
CREATE POLICY "Organization isolation"
ON experiments FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.organization_id = experiments.organization_id
  )
);

-- 敏感数据字段权限
CREATE POLICY "Sensitive data access"
ON experiments FOR SELECT
USING (
  has_permission(auth.uid(), 'sensitive_data.read')
);
```

### 8.3 安全最佳实践

#### 8.3.1 输入验证
```typescript
import { z } from 'zod'

const ExperimentSchema = z.object({
  deviceId: z.string().uuid(),
  experimentType: z.enum(['high_voltage', 'leakage', 'normal']),
  voltage: z.number().min(0).max(1500),
  current: z.number().min(0).max(100)
})

export async function createExperiment(data: unknown) {
  const validated = ExperimentSchema.parse(data)
  // ... 处理验证后的数据
}
```

#### 8.3.2 SQL注入防护
```typescript
// ❌ 不安全
const { data } = await supabase
  .rpc('search_experiments', { query: userInput })

// ✅ 安全
const { data } = await supabase
  .from('experiments')
  .select()
  .textSearch('name', userInput)
```

#### 8.3.3 XSS防护
```typescript
// 使用DOMPurify清理HTML
import DOMPurify from 'dompurify'

function SafeHTML({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

---

## 9. 部署架构

### 9.1 Netlify部署

#### 9.1.1 部署配置
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 9.1.2 环境变量
```bash
# Production
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
NEXT_PUBLIC_APP_URL=https://pvrsd.netlify.app

# Preview (Branch Deploys)
CONTEXT=deploy-preview
NEXT_PUBLIC_APP_URL=$DEPLOY_PRIME_URL
```

### 9.2 CI/CD流程

```
┌─────────────────┐
│  Git Push       │
└─────────────────┘
        ↓
┌─────────────────┐
│ GitHub Actions  │
│ • Lint          │
│ • Type Check    │
│ • Unit Tests    │
└─────────────────┘
        ↓
┌─────────────────┐
│ Netlify Build   │
│ • npm install   │
│ • npm run build │
│ • Static Export │
└─────────────────┘
        ↓
┌─────────────────┐
│ Deploy to CDN   │
│ • Edge Nodes    │
│ • Cache Warm    │
└─────────────────┘
        ↓
┌─────────────────┐
│ Post-Deploy     │
│ • Run E2E Tests │
│ • Lighthouse CI │
│ • Notify Slack  │
└─────────────────┘
```

### 9.3 多环境架构

```
Development:
- Local: localhost:3000
- Database: Supabase Local
- Storage: Local Mock

Staging:
- URL: staging-pvrsd.netlify.app
- Database: Supabase Staging
- Storage: Supabase Storage (staging bucket)

Production:
- URL: pvrsd.netlify.app
- Database: Supabase Production
- Storage: Supabase Storage (production bucket)
- CDN: Netlify Edge Network
```

---

## 10. 性能优化

### 10.1 前端性能优化

#### 10.1.1 代码分割
```typescript
// 动态导入
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
})

// 路由级代码分割（Next.js自动）
// app/experiments/page.tsx 会自动分割成独立chunk
```

#### 10.1.2 图片优化
```typescript
import Image from 'next/image'

<Image
  src="/device.jpg"
  alt="Device Photo"
  width={800}
  height={600}
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/..."
  loading="lazy"
/>
```

#### 10.1.3 字体优化
```typescript
// app/layout.tsx
import { Roboto_Mono } from 'next/font/google'

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  preload: true
})
```

#### 10.1.4 缓存策略
```typescript
// API缓存
export const revalidate = 3600 // 1小时

// 客户端缓存
const { data } = useSWR('/api/experiments', fetcher, {
  revalidateOnFocus: false,
  dedupingInterval: 60000 // 1分钟内去重
})
```

### 10.2 后端性能优化

#### 10.2.1 数据库查询优化
```sql
-- 使用索引
EXPLAIN ANALYZE
SELECT * FROM experiments
WHERE device_id = 'xxx' AND start_time > NOW() - INTERVAL '7 days';

-- 使用连接池
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';

-- 查询优化
-- ❌ 慢查询
SELECT * FROM test_data WHERE experiment_id = 'xxx';

-- ✅ 优化后
SELECT voltage, current, timestamp 
FROM test_data 
WHERE experiment_id = 'xxx' 
  AND timestamp > NOW() - INTERVAL '1 hour'
LIMIT 1000;
```

#### 10.2.2 缓存策略
```typescript
// Redis缓存（如需要）
import { Redis } from '@upstash/redis'

const redis = new Redis({ /* config */ })

async function getExperiment(id: string) {
  // 先查缓存
  const cached = await redis.get(`experiment:${id}`)
  if (cached) return cached
  
  // 查数据库
  const data = await supabase.from('experiments').select().eq('id', id).single()
  
  // 写入缓存
  await redis.set(`experiment:${id}`, data, { ex: 3600 })
  
  return data
}
```

### 10.3 性能监控

#### 10.3.1 关键指标
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 600ms

#### 10.3.2 监控工具
```typescript
// Web Vitals监控
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  const body = JSON.stringify(metric)
  const url = '/api/analytics'
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

---

## 11. 监控与日志

### 11.1 日志架构

```typescript
// 结构化日志
interface LogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  service: string
  userId?: string
  action: string
  metadata?: Record<string, any>
}

class Logger {
  log(entry: LogEntry) {
    console.log(JSON.stringify(entry))
    // 发送到日志服务
  }
}

// 使用示例
logger.log({
  timestamp: new Date().toISOString(),
  level: 'info',
  service: 'experiment-service',
  userId: user.id,
  action: 'create_experiment',
  metadata: { experimentType: 'high_voltage' }
})
```

### 11.2 错误追踪

```typescript
// Sentry配置
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // 过滤敏感信息
    if (event.request) {
      delete event.request.cookies
    }
    return event
  }
})
```

### 11.3 性能监控

```typescript
// 自定义性能追踪
export async function trackPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    
    // 记录性能指标
    await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify({
        metric: name,
        duration,
        timestamp: Date.now()
      })
    })
    
    return result
  } catch (error) {
    // 记录错误
    Sentry.captureException(error)
    throw error
  }
}
```

---

## 12. 扩展性设计

### 12.1 水平扩展

#### 12.1.1 无状态设计
- 所有API端点无状态
- Session存储在数据库/Redis
- 文件存储使用对象存储

#### 12.1.2 负载均衡
```
┌──────────────┐
│   用户请求   │
└──────────────┘
        ↓
┌──────────────┐
│  CDN (Netlify)│
└──────────────┘
        ↓
┌──────────────────────────────┐
│    Netlify Edge Functions    │
│   (自动负载均衡和扩展)        │
└──────────────────────────────┘
        ↓
┌──────────────────────────────┐
│      Supabase API            │
│    (自动扩展连接池)           │
└──────────────────────────────┘
```

### 12.2 垂直扩展

#### 12.2.1 数据库扩展
- 读写分离
- 连接池配置
- 索引优化

#### 12.2.2 缓存层
```typescript
// 多级缓存
const cache = {
  l1: new Map(), // 内存缓存
  l2: redis,      // Redis缓存
  l3: supabase    // 数据库
}

async function getData(key: string) {
  // L1缓存
  if (cache.l1.has(key)) return cache.l1.get(key)
  
  // L2缓存
  const l2Data = await cache.l2.get(key)
  if (l2Data) {
    cache.l1.set(key, l2Data)
    return l2Data
  }
  
  // L3数据库
  const l3Data = await cache.l3.from('table').select().eq('id', key)
  cache.l2.set(key, l3Data, { ex: 3600 })
  cache.l1.set(key, l3Data)
  return l3Data
}
```

### 12.3 微服务架构（未来）

```
┌─────────────────────────────────────────────────────┐
│                  API Gateway                         │
└─────────────────────────────────────────────────────┘
        ↓               ↓               ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 实验服务     │ │ 数据服务     │ │ 报告服务     │
│              │ │              │ │              │
│ • 实验管理   │ │ • 数据采集   │ │ • 报告生成   │
│ • 设备控制   │ │ • 数据处理   │ │ • 模板管理   │
│ • 状态监控   │ │ • 数据查询   │ │ • 格式转换   │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 附录

### A. 技术选型决策

| 技术 | 选择理由 | 替代方案 |
|------|---------|---------|
| Next.js | SSR+SSG支持，开发体验好 | Remix, Astro |
| Supabase | 开箱即用，成本低 | Firebase, AWS Amplify |
| Tailwind CSS | 快速开发，易维护 | CSS Modules, Styled Components |
| Zustand | 轻量级，学习曲线低 | Redux, MobX |
| Recharts | React原生，文档完善 | Chart.js, ECharts |

### B. 性能基准

```
页面加载时间:
- 首页: < 1.5s
- Dashboard: < 2.0s
- 实验页面: < 2.5s

API响应时间:
- GET /experiments: < 200ms
- POST /experiments: < 500ms
- GET /test-data: < 300ms

数据库查询:
- 简单查询: < 50ms
- 复杂查询: < 200ms
- 聚合查询: < 500ms
```

### C. 技术债务追踪

- [ ] 添加单元测试覆盖率到80%+
- [ ] 实现Redis缓存层
- [ ] 优化大数据量查询性能
- [ ] 添加E2E测试
- [ ] 实现离线模式

### D. 参考资料

- [Next.js文档](https://nextjs.org/docs)
- [Supabase文档](https://supabase.com/docs)
- [PostgreSQL性能优化](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [React性能优化](https://react.dev/learn/render-and-commit)

---

**文档版本**: v1.0.0  
**最后更新**: 2025-10-04  
**维护者**: PVRSD 开发团队

