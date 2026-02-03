#!/bin/bash

echo "🚀 启动分布式服务部署平台管理界面"
echo "=================================="

cd deployment-ui

echo "1. 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "  依赖未安装，正在安装..."
    npm install --legacy-peer-deps --silent
    echo "  ✅ 依赖安装完成"
else
    echo "  ✅ 依赖已安装"
fi

echo ""
echo "2. 启动API服务器..."
# 在后台启动API服务器
node api-server.js &
API_PID=$!
echo "  ✅ API服务器已启动 (PID: $API_PID)"

# 等待API服务器启动
sleep 2

echo ""
echo "3. 启动React开发服务器..."
echo "  前端将在 http://localhost:3001 启动"
echo "  API服务器在 http://localhost:3002"
echo ""
echo "  按 Ctrl+C 停止所有服务"
echo "=================================="

# 在前台启动React开发服务器
npm run dev

# 清理：停止API服务器
echo ""
echo "🛑 停止API服务器..."
kill $API_PID 2>/dev/null
echo "✅ 所有服务已停止"