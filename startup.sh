#!/bin/bash

echo "🚀 光伏快速关断器实验数据管理系统 - 启动脚本"
echo "================================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
else
    echo "✅ 依赖包已安装"
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  警告: .env.local 文件不存在"
    echo "请确保已配置 Supabase 环境变量"
fi

# Build the application
echo "🔨 构建应用..."
npm run build

# Start the application
echo "🌟 启动应用..."
npm run start