const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(morgan('combined'));
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
    networkInterfaces: Object.keys(os.networkInterfaces()).map(iface => ({
      name: iface,
      addresses: os.networkInterfaces()[iface].map(addr => addr.address)
    })),
    timestamp: new Date().toISOString(),
    pid: process.pid,
    nodeVersion: process.version
  };
}

// 首页 - 显示服务器信息
app.get('/', (req, res) => {
  const info = getServerInfo();
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Demo Service - ${info.hostname}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
        .info { margin: 20px 0; }
        .info-item { margin: 10px 0; padding: 10px; background: #f9f9f9; border-left: 4px solid #4CAF50; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .endpoints { margin-top: 30px; }
        .endpoint { margin: 5px 0; }
        a { color: #4CAF50; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .server-id { background: #4CAF50; color: white; padding: 5px 10px; border-radius: 5px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Demo Service - <span class="server-id">${info.hostname}</span></h1>
        
        <div class="info">
          <div class="info-item">
            <span class="label">服务器ID:</span> 
            <span class="value">${info.hostname}</span>
          </div>
          <div class="info-item">
            <span class="label">时间:</span> 
            <span class="value">${info.timestamp}</span>
          </div>
          <div class="info-item">
            <span class="label">平台:</span> 
            <span class="value">${info.platform} (${info.arch})</span>
          </div>
          <div class="info-item">
            <span class="label">CPU核心:</span> 
            <span class="value">${info.cpus}</span>
          </div>
          <div class="info-item">
            <span class="label">内存:</span> 
            <span class="value">${info.freeMemory} / ${info.totalMemory}</span>
          </div>
          <div class="info-item">
            <span class="label">运行时间:</span> 
            <span class="value">${info.uptime}</span>
          </div>
          <div class="info-item">
            <span class="label">Node.js版本:</span> 
            <span class="value">${info.nodeVersion}</span>
          </div>
          <div class="info-item">
            <span class="label">进程ID:</span> 
            <span class="value">${info.pid}</span>
          </div>
        </div>
        
        <div class="endpoints">
          <h3>📡 可用接口:</h3>
          <div class="endpoint"><a href="/health">/health</a> - 健康检查</div>
          <div class="endpoint"><a href="/api/info">/api/info</a> - JSON格式服务器信息</div>
          <div class="endpoint"><a href="/api/load">/api/load</a> - 模拟负载测试</div>
          <div class="endpoint"><a href="/api/network">/api/network</a> - 网络接口信息</div>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
          <p>这是一个分布式服务部署平台的演示服务。当前运行在服务器: <strong>${info.hostname}</strong></p>
          <p>刷新页面可以看到负载均衡效果（如果配置了多台服务器）</p>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    server: os.hostname(),
    uptime: os.uptime()
  });
});

// JSON格式服务器信息
app.get('/api/info', (req, res) => {
  res.json(getServerInfo());
});

// 模拟负载测试
app.get('/api/load', (req, res) => {
  const start = Date.now();
  // 模拟一些计算
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

// 网络接口信息
app.get('/api/network', (req, res) => {
  const interfaces = os.networkInterfaces();
  res.json({
    server: os.hostname(),
    interfaces: interfaces,
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