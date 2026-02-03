#!/bin/bash

# 部署Demo服务到服务器
# 用法: ./deploy-demo-service.sh <服务器别名>

SERVER=$1
SERVICE_DIR="/opt/demo-service"

if [ -z "$SERVER" ]; then
    echo "错误: 请指定服务器别名"
    echo "用法: $0 <服务器别名>"
    echo "可用别名: alijack, tenjack"
    exit 1
fi

echo "=== 部署Demo服务到 $SERVER ==="

# 1. 创建目录
echo "1. 创建服务目录..."
ssh $SERVER "sudo mkdir -p $SERVICE_DIR && sudo chown -R \$USER:\$USER $SERVICE_DIR"

# 2. 复制文件
echo "2. 复制项目文件..."
scp demo-service/package.json $SERVER:$SERVICE_DIR/
scp demo-service/server.js $SERVER:$SERVICE_DIR/
scp demo-service/Dockerfile $SERVER:$SERVICE_DIR/
scp demo-service/docker-compose.yml $SERVER:$SERVICE_DIR/
scp demo-service/README.md $SERVER:$SERVICE_DIR/

# 3. 安装依赖
echo "3. 安装Node.js依赖..."
ssh $SERVER "cd $SERVICE_DIR && npm install --production"

# 4. 构建Docker镜像
echo "4. 构建Docker镜像..."
ssh $SERVER "cd $SERVICE_DIR && docker build -t demo-service ."

# 5. 启动服务
echo "5. 启动Demo服务..."
ssh $SERVER "cd $SERVICE_DIR && docker-compose down 2>/dev/null || true"
ssh $SERVER "cd $SERVICE_DIR && docker-compose up -d"

# 6. 检查服务状态
echo "6. 检查服务状态..."
sleep 3
ssh $SERVER "docker ps | grep demo-service"
ssh $SERVER "curl -s http://localhost:3000/health | grep -o '\"status\":\"[^\"]*\"'"

echo ""
echo "✅ Demo服务已部署到 $SERVER"
echo "🔗 访问地址: http://$SERVER:3000"
echo "📊 健康检查: http://$SERVER:3000/health"