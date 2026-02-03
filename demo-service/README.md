# Demo Service - 分布式部署平台演示服务

这是一个用于演示分布式服务部署平台的简单Web服务。

## 功能特性

- 🚀 显示服务器详细信息（主机名、IP、资源使用情况等）
- 📡 提供健康检查接口
- 🔄 支持负载均衡测试
- 🐳 容器化部署（Docker）
- 📊 JSON API接口

## 接口说明

### Web界面
- `GET /` - 显示服务器信息的HTML页面

### API接口
- `GET /health` - 健康检查
- `GET /api/info` - JSON格式的服务器信息
- `GET /api/load` - 模拟负载测试
- `GET /api/network` - 网络接口信息

## 快速开始

### 使用Docker运行
```bash
# 构建镜像
docker build -t demo-service .

# 运行容器
docker run -d -p 3000:3000 --name demo-service demo-service

# 或者使用docker-compose
docker-compose up -d
```

### 直接运行（Node.js环境）
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产模式
npm start
```

## 部署到多台服务器

### 1. 复制文件到服务器
```bash
scp -r demo-service/ user@server:/path/to/demo-service
```

### 2. 在每台服务器上构建和运行
```bash
cd /path/to/demo-service
docker-compose up -d
```

### 3. 配置负载均衡器（Nginx）
参考 `nginx-load-balancer.conf` 配置文件

## 配置文件

### 环境变量
- `PORT` - 服务端口（默认：3000）
- `NODE_ENV` - 运行环境（development/production）

### Docker配置
- 使用多阶段构建优化镜像大小
- 包含健康检查
- 自动重启策略

## 监控和日志

### 查看日志
```bash
# Docker容器日志
docker logs demo-service

# 实时日志
docker logs -f demo-service
```

### 健康检查
```bash
curl http://localhost:3000/health
```

## 项目结构
```
demo-service/
├── server.js          # 主服务文件
├── package.json       # Node.js依赖配置
├── Dockerfile         # Docker镜像配置
├── docker-compose.yml # Docker Compose配置
├── README.md          # 说明文档
└── nginx-load-balancer.conf  # Nginx负载均衡配置示例
```

## 负载均衡测试

当部署到多台服务器并配置负载均衡后：
1. 访问负载均衡器IP地址
2. 刷新页面可以看到不同服务器的响应
3. 每个响应会显示当前服务的服务器主机名

## 许可证

MIT