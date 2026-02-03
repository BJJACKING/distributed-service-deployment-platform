#!/bin/bash

echo "=========================================="
echo "🚀 分布式服务部署平台 - 管理界面启动脚本"
echo "=========================================="
echo ""

# 检查并启动API服务器
echo "1. 检查API服务器..."
if curl -s http://localhost:3002/api/health > /dev/null 2>&1; then
    echo "   ✅ API服务器已在运行 (端口: 3002)"
else
    echo "   ⚡ 启动API服务器..."
    cd deployment-ui
    node simple-api.js &
    API_PID=$!
    echo "   ✅ API服务器已启动 (PID: $API_PID)"
    sleep 2
fi

echo ""
echo "2. 检查React开发服务器..."
if curl -s http://localhost:3004 > /dev/null 2>&1; then
    echo "   ✅ React界面已在运行 (端口: 3004)"
else
    echo "   ⚡ 启动React开发服务器..."
    cd deployment-ui
    npx vite &
    REACT_PID=$!
    echo "   ✅ React开发服务器已启动 (PID: $REACT_PID)"
    sleep 3
fi

echo ""
echo "=========================================="
echo "🎉 部署平台管理界面已准备就绪！"
echo ""
echo "📡 访问地址:"
echo "   前端界面: http://localhost:3004"
echo "   API服务器: http://localhost:3002"
echo ""
echo "🔗 测试链接:"
echo "   API健康检查: http://localhost:3002/api/health"
echo "   服务器列表: http://localhost:3002/api/servers"
echo ""
echo "🖥️ 真实服务:"
echo "   负载均衡器: http://182.92.31.155"
echo "   阿里云服务: http://182.92.31.155:3000"
echo "   腾讯云服务: http://152.136.16.77:3000"
echo ""
echo "📁 项目文件:"
echo "   • demo-service/          - Demo服务代码"
echo "   • deployment-platform/   - 命令行部署平台"
echo "   • deployment-ui/         - React管理界面"
echo "   • 分布式服务部署平台-需求文档.md"
echo ""
echo "🛠️ 快速命令:"
echo "   查看状态: curl http://localhost:3002/api/health"
echo "   查看服务器: curl http://localhost:3002/api/servers"
echo "   部署服务: curl -X POST http://localhost:3002/api/deploy"
echo ""
echo "=========================================="
echo "按 Ctrl+C 停止所有服务"
echo "=========================================="

# 保持脚本运行
wait