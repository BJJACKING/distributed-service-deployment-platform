const http = require('http');

const PORT = 3002;

// 模拟数据
const mockData = {
  servers: [
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
  ],
  deployments: [
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
    }
  ]
};

const server = http.createServer((req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // 设置JSON响应头
  res.setHeader('Content-Type', 'application/json');
  
  // 路由处理
  const url = req.url;
  const method = req.method;
  
  console.log(`${method} ${url}`);
  
  if (url === '/api/servers' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockData.servers,
      timestamp: new Date().toISOString()
    }));
  } else if (url === '/api/deployments' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      data: mockData.deployments,
      total: mockData.deployments.length
    }));
  } else if (url === '/api/health' && method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }));
  } else if (url === '/api/monitoring' && method === 'GET') {
    // 生成监控数据
    const now = new Date();
    const data = [];
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
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data }));
  } else if (url === '/api/logs' && method === 'GET') {
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
      }
    ];
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: logs, total: logs.length }));
  } else if (url === '/api/deploy' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const deployment = {
        id: Date.now().toString(),
        version: 'v1.2.1',
        status: 'running',
        servers: ['alijack', 'tenjack'],
        startedAt: new Date().toISOString(),
        commit: Math.random().toString(36).substring(7),
        author: '系统'
      };
      mockData.deployments.unshift(deployment);
      
      // 模拟异步完成
      setTimeout(() => {
        deployment.status = 'success';
        deployment.completedAt = new Date().toISOString();
        deployment.duration = '2分15秒';
      }, 5000);
      
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: deployment,
        message: '部署任务已开始'
      }));
    });
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      success: false,
      error: '接口未找到'
    }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 简易API服务器已启动在端口 ${PORT}`);
  console.log(`📡 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`🔗 服务器列表: http://localhost:${PORT}/api/servers`);
  console.log(`🚀 部署接口: http://localhost:${PORT}/api/deploy`);
});