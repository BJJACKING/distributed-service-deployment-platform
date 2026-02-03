const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(express.json());

// 模拟数据
const mockServers = [
  {
    id: '1',
    name: 'alijack',
    host: '182.92.31.155',
    status: 'healthy',
    cpu: 45,
    memory: 68,
    disk: 32,
    uptime: '15天 8小时',
    lastCheck: new Date().toISOString(),
    services: ['demo-service', 'nginx'],
    tags: ['阿里云', '负载均衡器']
  },
  {
    id: '2',
    name: 'tenjack',
    host: '152.136.16.77',
    status: 'healthy',
    cpu: 52,
    memory: 72,
    disk: 45,
    uptime: '12天 3小时',
    lastCheck: new Date().toISOString(),
    services: ['demo-service'],
    tags: ['腾讯云', '应用服务器']
  }
];

const mockDeployments = [
  {
    id: '1',
    version: 'v1.2.0',
    status: 'success',
    servers: ['alijack', 'tenjack'],
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date().toISOString(),
    duration: '1分30秒',
    commit: 'a1b2c3d',
    author: 'Walson'
  },
  {
    id: '2',
    version: 'v1.1.0',
    status: 'success',
    servers: ['alijack'],
    startedAt: new Date(Date.now() - 86400000).toISOString(),
    completedAt: new Date(Date.now() - 86350000).toISOString(),
    duration: '50秒',
    commit: 'e4f5g6h',
    author: 'Walson'
  }
];

// API路由

// 获取所有服务器
app.get('/api/servers', async (req, res) => {
  try {
    // 尝试获取真实数据，如果失败则返回模拟数据
    res.json({
      success: true,
      data: mockServers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: true,
      data: mockServers,
      timestamp: new Date().toISOString()
    });
  }
});

// 获取服务器详情
app.get('/api/servers/:id', (req, res) => {
  const server = mockServers.find(s => s.id === req.params.id || s.name === req.params.id);
  if (server) {
    res.json({
      success: true,
      data: server
    });
  } else {
    res.status(404).json({
      success: false,
      error: '服务器未找到'
    });
  }
});

// 获取所有部署
app.get('/api/deployments', (req, res) => {
  res.json({
    success: true,
    data: mockDeployments,
    total: mockDeployments.length
  });
});

// 执行部署
app.post('/api/deploy', async (req, res) => {
  const { version, servers = ['alijack', 'tenjack'] } = req.body;
  
  try {
    // 模拟部署过程
    const deployment = {
      id: Date.now().toString(),
      version: version || 'v1.2.1',
      status: 'running',
      servers,
      startedAt: new Date().toISOString(),
      commit: Math.random().toString(36).substring(7),
      author: '系统'
    };

    // 添加到部署列表
    mockDeployments.unshift(deployment);

    // 模拟部署过程
    setTimeout(() => {
      deployment.status = 'success';
      deployment.completedAt = new Date().toISOString();
      deployment.duration = '2分15秒';
    }, 5000);

    res.json({
      success: true,
      data: deployment,
      message: '部署任务已开始'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 回滚部署
app.post('/api/rollback/:id', (req, res) => {
  const deployment = mockDeployments.find(d => d.id === req.params.id);
  
  if (!deployment) {
    return res.status(404).json({
      success: false,
      error: '部署记录未找到'
    });
  }

  // 模拟回滚过程
  const rollbackDeployment = {
    id: Date.now().toString(),
    version: deployment.version,
    status: 'running',
    servers: deployment.servers,
    startedAt: new Date().toISOString(),
    commit: deployment.commit,
    author: '系统',
    rollback: true,
    originalDeployment: deployment.id
  };

  mockDeployments.unshift(rollbackDeployment);

  setTimeout(() => {
    rollbackDeployment.status = 'success';
    rollbackDeployment.completedAt = new Date().toISOString();
    rollbackDeployment.duration = '1分45秒';
  }, 4000);

  res.json({
    success: true,
    data: rollbackDeployment,
    message: '回滚任务已开始'
  });
});

// 获取监控数据
app.get('/api/monitoring', (req, res) => {
  const now = new Date();
  const data = [];
  
  // 生成24小时的数据
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      time: time.toISOString(),
      cpu: Math.floor(Math.random() * 30) + 40,
      memory: Math.floor(Math.random() * 35) + 45,
      requests: Math.floor(Math.random() * 300) + 100,
      errors: Math.floor(Math.random() * 10),
      responseTime: Math.floor(Math.random() * 100) + 50
    });
  }

  res.json({
    success: true,
    data
  });
});

// 获取日志
app.get('/api/logs', (req, res) => {
  const logs = [
    {
      id: '1',
      level: 'info',
      message: '部署任务开始: v1.2.0',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      server: 'alijack'
    },
    {
      id: '2',
      level: 'success',
      message: '部署成功完成',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      server: 'alijack'
    },
    {
      id: '3',
      level: 'info',
      message: '健康检查通过',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      server: 'tenjack'
    },
    {
      id: '4',
      level: 'warning',
      message: 'CPU使用率超过80%',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      server: 'tenjack'
    },
    {
      id: '5',
      level: 'info',
      message: '负载均衡配置已更新',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      server: 'alijack'
    }
  ];

  res.json({
    success: true,
    data: logs,
    total: logs.length
  });
});

// 执行命令（实际调用部署脚本）
app.post('/api/command', async (req, res) => {
  const { command, args } = req.body;
  
  try {
    // 这里可以实际调用部署脚本
    // const result = await execPromise(`./deploy.sh ${command} ${args.join(' ')}`);
    
    // 模拟执行结果
    let output = '';
    let success = true;
    
    switch (command) {
      case 'status':
        output = '服务器状态检查完成\n';
        output += 'alijack: ✓ 健康\n';
        output += 'tenjack: ✓ 健康\n';
        break;
      case 'deploy':
        output = '开始部署到所有服务器...\n';
        output += '同步文件... ✓\n';
        output += '安装依赖... ✓\n';
        output += '重启服务... ✓\n';
        output += '健康检查... ✓\n';
        output += '部署完成！\n';
        break;
      default:
        output = `命令 ${command} 执行完成`;
    }
    
    res.json({
      success,
      output,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 API服务器已启动在端口 ${PORT}`);
  console.log(`📡 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`🔗 服务器列表: http://localhost:${PORT}/api/servers`);
});