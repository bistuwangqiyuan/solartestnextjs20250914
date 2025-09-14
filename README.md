# 光伏快速关断器实验数据管理系统

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.0-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**业界领先的光伏快速关断器测试数据管理平台**

[演示](#) | [文档](./docs/PRD.md) | [报告问题](#)

</div>

## 🚀 项目简介

本系统是一款专为光伏快速关断器(PVRSD)设计的高端实验数据管理系统，提供工业4.0级别的数据采集、分析和可视化解决方案。系统采用现代化的技术栈，实现了从数据采集到报告生成的全流程数字化管理。

### ✨ 核心特性

- 🖥️ **工业级数据大屏** - 实时监控、3D可视化、多维度数据展示
- 📊 **全面的测试覆盖** - 高压测试、泄漏电流、正常/非正常工况、仿真分析
- 📈 **智能数据分析** - 自动异常检测、趋势预测、对比分析
- 📁 **强大的文件管理** - 支持多格式导入导出、版本控制、批量处理
- 🔒 **企业级安全** - 数据加密、权限管理、审计日志
- 📱 **响应式设计** - 支持PC、平板、移动端、大屏展示

## 🛠️ 技术栈

- **前端框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **UI框架**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **数据可视化**: [Recharts](https://recharts.org/) + [D3.js](https://d3js.org/)
- **后端服务**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime + Storage)
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/)
- **表格处理**: [TanStack Table](https://tanstack.com/table/) + [ExcelJS](https://github.com/exceljs/exceljs)
- **部署平台**: [Netlify](https://www.netlify.com/)

## 📦 快速开始

### 前置要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- Supabase 账号

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-repo/pv-shutdown-test-system.git
cd pv-shutdown-test-system
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
```

3. **配置环境变量**

创建 `.env.local` 文件并添加以下内容：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://zzyueuweeoakopuuwfau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6eXVldXdlZW9ha29wdXV3ZmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODEzMDEsImV4cCI6MjA1OTk1NzMwMX0.y8V3EXK9QVd3txSWdE3gZrSs96Ao0nvpnd0ntZw_dQ4

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PVRSD Test System
```

4. **初始化数据库**

运行数据库迁移脚本：

```bash
npm run db:setup
```

5. **启动开发服务器**
```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证相关页面
│   ├── (dashboard)/       # 主应用页面
│   │   ├── dashboard/     # 数据大屏
│   │   ├── experiments/   # 实验管理
│   │   │   ├── high-voltage/    # 高压试验
│   │   │   ├── leakage/         # 泄漏电流
│   │   │   ├── normal/          # 正常工况
│   │   │   ├── abnormal/        # 非正常工况
│   │   │   └── simulation/      # 实验仿真
│   │   ├── data/          # 数据管理
│   │   └── settings/      # 系统设置
│   └── api/               # API 路由
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── charts/           # 图表组件
│   ├── dashboard/        # 仪表板组件
│   └── experiments/      # 实验相关组件
├── lib/                  # 工具函数和配置
│   ├── supabase/        # Supabase 客户端
│   ├── utils/           # 工具函数
│   └── constants/       # 常量定义
├── hooks/               # React Hooks
├── stores/              # Zustand 状态管理
├── types/               # TypeScript 类型定义
├── public/              # 静态资源
└── styles/              # 全局样式
```

## 🔧 主要功能模块

### 1. 数据大屏 (`/dashboard`)
- 实时设备状态监控
- 关键性能指标展示
- 3D设备模型可视化
- 实时数据流展示
- 异常告警系统

### 2. 高压试验 (`/experiments/high-voltage`)
- 电压等级设置 (600V/1000V/1500V DC)
- 实时电压和泄漏电流曲线
- 绝缘电阻动态计算
- 自动测试报告生成

### 3. 泄漏电流试验 (`/experiments/leakage`)
- 多通道同时测试
- 0.1μA高精度测量
- FFT频谱分析
- 温度补偿算法

### 4. 正常工况试验 (`/experiments/normal`)
- 全功率范围测试 (0-1500W)
- 环境适应性测试 (-40°C至+85°C)
- 效率曲线实时绘制
- 热成像分析

### 5. 非正常工况试验 (`/experiments/abnormal`)
- 过压/过流/短路测试
- 保护功能验证
- 响应时间测量
- 寿命周期测试

### 6. 实验仿真 (`/experiments/simulation`)
- SPICE电路仿真
- 3D热分布分析
- 参数优化算法
- 仿真实测对比

### 7. 数据管理 (`/data`)
- 文件上传下载 (Excel/CSV/JSON)
- 批量数据处理
- 版本控制系统
- 数据分析工具

## 📊 数据格式

系统支持以下标准数据格式：

```typescript
interface TestData {
  id: number;
  current: number;      // 电流 (A)
  voltage: number;      // 电压 (V)
  power: number;        // 功率 (W)
  timestamp: string;    // 时间戳
  deviceAddress: number; // 设备地址
  deviceType: string;   // 设备类型
  temperature?: number; // 温度 (°C)
  humidity?: number;    // 湿度 (%)
}
```

示例数据：
```json
{
  "id": 1,
  "current": 0.11,
  "voltage": 20.355,
  "power": 2.23905,
  "timestamp": "2025-05-02T14:22:56",
  "deviceAddress": 1,
  "deviceType": "PVRSD-1500"
}
```

## 🚀 部署

### Netlify 部署

1. **连接 GitHub 仓库**
   - 登录 Netlify
   - 选择 "New site from Git"
   - 连接 GitHub 仓库

2. **配置构建设置**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **设置环境变量**
   - 在 Netlify 控制台添加所有 `.env.local` 中的环境变量

4. **部署**
   - 点击 "Deploy site"

### 环境变量配置

生产环境需要配置以下环境变量：

| 变量名 | 描述 | 示例值 |
|--------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbG...` |
| `NEXT_PUBLIC_APP_URL` | 应用 URL | `https://your-app.netlify.app` |

## 🛡️ 安全性

- **数据加密**: 所有敏感数据使用 AES-256 加密
- **身份认证**: 基于 JWT 的安全认证
- **权限控制**: 细粒度的 RBAC 权限管理
- **审计日志**: 完整的操作日志记录
- **数据备份**: 自动定期备份

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详情。

### 开发流程

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 代码规范

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 编写单元测试和集成测试
- 保持代码覆盖率 > 80%

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 📞 联系方式

- 项目主页: [https://github.com/your-repo/pv-shutdown-test-system](https://github.com/your-repo/pv-shutdown-test-system)
- 问题反馈: [GitHub Issues](https://github.com/your-repo/pv-shutdown-test-system/issues)
- 邮箱: support@example.com

## 🙏 致谢

- 感谢所有贡献者的努力
- 感谢 Vercel 团队提供的 Next.js 框架
- 感谢 Supabase 团队提供的后端服务
- 感谢开源社区的支持

---

<div align="center">
  Made with ❤️ by PVRSD Test System Team
</div>