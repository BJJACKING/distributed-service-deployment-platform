# Distributed Service Deployment Platform

A complete distributed service deployment platform with load balancing, automation scripts, and React management UI.

## 🚀 Features

### 1. **Demo Service**
- Node.js web service displaying server information
- Health check endpoints
- Multiple API endpoints
- Docker and Docker Compose support

### 2. **Load Balancer**
- Nginx load balancer configuration
- Round-robin load balancing strategy
- Health checks and logging
- Support for multiple backend servers

### 3. **Deployment Platform**
- Automated deployment scripts
- Multi-server deployment support
- Version management and rollback
- Health monitoring and status checks
- Configuration synchronization

### 4. **React Management UI**
- Modern React-based management interface
- Real-time server status monitoring
- Deployment management dashboard
- Interactive charts and visualizations
- Responsive design

## 📁 Project Structure

```
.
├── demo-service/              # Demo Node.js service
│   ├── server.js             # Main server code
│   ├── Dockerfile            # Docker configuration
│   ├── docker-compose.yml    # Docker Compose config
│   └── nginx-load-balancer.conf  # Nginx config
├── deployment-platform/       # Deployment automation
│   ├── deploy.sh             # Main deployment script
│   ├── deploy.config         # Configuration file
│   └── demo-service-files/   # Service files
├── deployment-ui/            # React management UI
│   ├── src/                  # React source code
│   ├── api-server.js         # Mock API server
│   └── package.json          # Dependencies
├── scripts/                  # Utility scripts
│   ├── deploy-demo-service.sh
│   ├── load-balancer-config.sh
│   ├── start-ui.sh
│   └── test-load-balancer.sh
└── docs/                     # Documentation
    └── 分布式服务部署平台-需求文档.md
```

## 🛠️ Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js (v20+)
- Nginx
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/BJJACKING/distributed-service-deployment-platform.git
cd distributed-service-deployment-platform
```

### 2. Deploy Demo Service
```bash
# Deploy to a single server
./deploy-demo-service.sh root@182.92.31.155

# Or deploy to multiple servers
./deploy-demo-service.sh root@182.92.31.155 ubuntu@152.136.16.77
```

### 3. Configure Load Balancer
```bash
# Configure Nginx load balancer
./load-balancer-config.sh root@182.92.31.155
```

### 4. Start Management UI
```bash
# Start the React management interface
./start-ui.sh
```

## 🌐 Server Configuration

### Current Server Setup
- **Aliyun Server**: `182.92.31.155` (root@alijack)
- **Tencent Cloud Server**: `152.136.16.77` (ubuntu@tenjack)

### SSH Aliases (configured in ~/.ssh/config)
```bash
# Aliyun Server
ssh alijack

# Tencent Cloud Server (ubuntu user)
ssh tenjack

# Tencent Cloud Server (root user)
ssh tenjack-root
```

## 📊 Management Interface

Access the management UI at: `http://localhost:5173`

Features:
- **Dashboard**: Overview of all servers and services
- **Server Management**: View and manage server status
- **Deployment Management**: Deploy and manage services
- **Monitoring**: Real-time metrics and logs
- **Configuration**: Manage deployment settings

## 🔧 Deployment Scripts

### `deploy.sh`
Main deployment script with features:
- Multi-server deployment
- Automatic backup and versioning
- Health checks and monitoring
- Rollback support
- Detailed logging

### `load-balancer-config.sh`
Configures Nginx load balancer with:
- Round-robin load balancing
- Health check endpoints
- Access logging
- Failover support

## 📝 Documentation

- [需求文档](分布式服务部署平台-需求文档.md) - Complete requirements document (Chinese)
- [部署指南](deployment-platform/README.md) - Deployment instructions
- [Demo服务文档](demo-service/README.md) - Demo service documentation
- [管理界面文档](deployment-ui/README.md) - Management UI documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with OpenClaw AI assistant
- Deployed on Aliyun and Tencent Cloud
- Uses modern DevOps practices