# 分布式服务部署平台

一个用于管理分布式服务部署的自动化平台，支持一键部署、回滚、状态监控等功能。

## 功能特性

- 🚀 **一键部署**：同时部署到多台服务器
- 🔄 **自动回滚**：支持快速回滚到上一个版本
- 📊 **状态监控**：实时查看所有服务器状态
- 🔧 **健康检查**：自动验证服务健康状态
- 💾 **备份管理**：自动创建和清理备份
- 🔗 **配置管理**：集中式配置文件管理

## 快速开始

### 1. 安装依赖
```bash
# 确保已安装必要的工具
sudo apt-get install -y ssh rsync curl git
```

### 2. 配置SSH免密登录
确保可以通过SSH免密登录到所有目标服务器。

### 3. 初始化部署平台
```bash
cd deployment-platform

# 创建默认配置文件
./deploy.sh config

# 编辑配置文件
vim deploy.config
```

### 4. 配置服务器
编辑 `deploy.config` 文件，配置您的服务器：

```bash
# 服务器列表 (格式: 别名:用户@主机:端口:服务目录)
SERVERS=(
    "server1:root@192.168.1.100:22:/opt/demo-service"
    "server2:ubuntu@192.168.1.101:22:/opt/demo-service"
)

# 服务配置
SERVICE_NAME="demo-service"
SERVICE_PORT="3000"
HEALTH_CHECK_PATH="/health"
```

### 5. 测试连接
```bash
# 测试所有服务器连接
./deploy.sh test
```

## 使用指南

### 部署服务
```bash
# 部署到所有服务器
./deploy.sh deploy
```

### 查看状态
```bash
# 查看所有服务器状态
./deploy.sh status
```

### 回滚服务
```bash
# 回滚到上一个版本
./deploy.sh rollback
```

### 获取帮助
```bash
# 查看所有命令
./deploy.sh help
```

## 配置文件说明

### deploy.config
```bash
# 服务器配置
SERVERS=(
    "别名:用户@主机:端口:服务目录"
)

# 服务配置
SERVICE_NAME="服务名称"
SERVICE_PORT="服务端口"
HEALTH_CHECK_PATH="健康检查路径"

# 部署配置
BACKUP_ENABLED="true"      # 是否启用备份
MAX_BACKUPS="5"           # 最大备份数量

# Git配置 (可选)
GIT_REPO="git@github.com:user/repo.git"
GIT_BRANCH="main"
```

## 目录结构
```
deployment-platform/
├── deploy.sh              # 主部署脚本
├── deploy.config          # 配置文件 (自动生成)
├── README.md              # 说明文档
├── backups/               # 备份目录 (自动创建)
├── versions/              # 版本目录 (自动创建)
└── deploy.log             # 部署日志 (自动创建)
```

## 部署流程

1. **连接测试**：验证所有服务器连接
2. **创建备份**：备份当前版本（如果启用）
3. **文件同步**：同步文件到所有服务器
4. **安装依赖**：在服务器上安装依赖
5. **重启服务**：停止并重启服务
6. **健康检查**：验证服务是否正常运行

## 高级功能

### 自定义部署步骤
您可以修改 `deploy.sh` 脚本中的以下函数来自定义部署流程：

- `deploy_to_server()` - 主部署逻辑
- `sync_files()` - 文件同步逻辑
- `install_dependencies()` - 依赖安装逻辑
- `restart_service()` - 服务重启逻辑

### 集成Git
如果您使用Git管理代码，可以修改配置启用Git集成：

```bash
GIT_REPO="git@github.com:your-username/your-repo.git"
GIT_BRANCH="main"
```

### 通知集成
可以扩展脚本以支持部署通知（Slack、钉钉、飞书等）。

## 错误处理

- 脚本使用 `set -e`，遇到错误会自动退出
- 详细的日志记录在 `deploy.log` 中
- 健康检查失败会自动重试
- 支持服务器连接失败时的优雅降级

## 最佳实践

1. **测试环境**：先在测试环境验证部署
2. **备份策略**：始终启用备份功能
3. **监控告警**：集成监控系统
4. **版本控制**：使用Git管理部署脚本
5. **权限管理**：使用最小权限原则

## 故障排除

### 常见问题

1. **SSH连接失败**
   - 检查SSH密钥配置
   - 验证防火墙设置
   - 确认服务器网络可达

2. **健康检查失败**
   - 检查服务端口是否开放
   - 验证健康检查路径
   - 查看服务日志

3. **文件同步失败**
   - 检查磁盘空间
   - 验证目录权限
   - 确认rsync可用

### 查看日志
```bash
# 查看部署日志
tail -f deploy.log

# 查看服务器日志
ssh user@server "tail -f /opt/demo-service/server.log"
```

## 扩展开发

### 添加新功能
1. 在 `deploy.sh` 中添加新的命令处理
2. 在 `usage()` 函数中添加命令说明
3. 在 `main()` 函数中添加命令路由

### 集成CI/CD
可以将此部署平台集成到CI/CD流水线中：

```yaml
# GitHub Actions 示例
deploy:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    - name: Deploy to servers
      run: |
        cd deployment-platform
        ./deploy.sh deploy
```

## 许可证

MIT License

## 支持

如有问题或建议，请提交Issue或联系维护者。