#!/bin/bash

echo "🚀 光伏快速关断器实验数据管理系统 - 开发模式"
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

# Run database setup if requested
if [ "$1" = "--setup-db" ]; then
    echo "🗄️  设置数据库..."
    npm run db:setup
fi

# Start development server
echo "🌟 启动开发服务器..."
echo "访问: http://localhost:3000"
npm run dev