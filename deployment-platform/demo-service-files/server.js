const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(express.json());

// 获取服务器信息
function getServerInfo() {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / (1024 * 1024)) + ' MB',
    freeMemory: Math.round(os.freemem() / (1024 * 1024)) + ' MB',
    uptime: Math.round(os.uptime() / 60) + ' minutes',
    timestamp: new Date().toISOString(),
    pid: process.pid,
    nodeVersion: process.version,
    service: 'demo-service',
    version: '1.0.0'
  };
}

// 首页
app.get('/', (req, res) => {
  const info = getServerInfo();
  res.json({
    message: '欢迎使用分布式部署平台演示服务',
    server: info.hostname,
    endpoints: {
      health: '/health',
      info: '/api/info',
      load: '/api/load'
    }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: os.hostname(),
    uptime: os.uptime(),
    service: 'demo-service'
  });
});

// 服务器信息
app.get('/api/info', (req, res) => {
  res.json(getServerInfo());
});

// 模拟负载测试
app.get('/api/load', (req, res) => {
  const start = Date.now();
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i);
  }
  const duration = Date.now() - start;
  
  res.json({
    server: os.hostname(),
    operation: 'load_test',
    iterations: 1000000,
    duration: duration + 'ms',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Demo服务已启动在端口 ${PORT}`);
  console.log(`📡 服务器: ${os.hostname()}`);
  console.log(`🔗 访问地址: http://localhost:${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/health`);
});