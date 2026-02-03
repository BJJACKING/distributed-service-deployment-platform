#!/bin/bash

# 在alijack上配置Nginx负载均衡器 - 修正版

echo "=== 配置Nginx负载均衡器 ==="

# 备份原始配置
ssh alijack "sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)"

# 创建负载均衡配置
CONFIG_CONTENT='
# 负载均衡配置 - Demo服务
upstream demo_servers {
    # 负载均衡策略
    # least_conn;    # 最少连接数
    # ip_hash;      # IP哈希（会话保持）
    
    # 默认使用轮询
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;      # alijack本地服务
    server 152.136.16.77:3000 max_fails=3 fail_timeout=30s;  # tenjack远程服务
}

server {
    listen 80;
    server_name _;  # 匹配所有域名，或使用具体IP
    
    # 访问日志
    access_log /var/log/nginx/demo-service.access.log;
    error_log /var/log/nginx/demo-service.error.log;
    
    location / {
        proxy_pass http://demo_servers;
        
        # 代理头设置
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
        
        # 缓冲设置
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
        
        # 添加响应头显示后端服务器
        add_header X-Backend-Server $upstream_addr;
        add_header X-Backend-Status $upstream_status;
    }
    
    # Nginx健康检查端点
    location /nginx-health {
        access_log off;
        return 200 "nginx load balancer is healthy\n";
        add_header Content-Type text/plain;
    }
    
    # 负载均衡器状态页面
    location /nginx-status {
        stub_status on;
        access_log off;
        allow 127.0.0.1;
        deny all;
    }
}
'

# 写入配置
echo "$CONFIG_CONTENT" | ssh alijack "sudo tee /etc/nginx/sites-available/demo-load-balancer > /dev/null"

# 创建符号链接
ssh alijack "sudo ln -sf /etc/nginx/sites-available/demo-load-balancer /etc/nginx/sites-enabled/"

# 禁用默认配置
ssh alijack "sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true"

# 测试配置
ssh alijack "sudo nginx -t"

if [ $? -eq 0 ]; then
    echo "✅ Nginx配置语法检查通过"
    
    # 重载Nginx
    ssh alijack "sudo systemctl reload nginx"
    
    echo "✅ Nginx已重载"
    echo ""
    echo "=== 负载均衡器配置完成 ==="
    echo "负载均衡器地址: http://182.92.31.155"
    echo "后端服务器:"
    echo "  - alijack (本地): http://127.0.0.1:3000"
    echo "  - tenjack (远程): http://152.136.16.77:3000"
    echo ""
    echo "测试命令:"
    echo "  curl -I http://182.92.31.155/health"
    echo "  curl http://182.92.31.155/"
    echo "  curl http://182.92.31.155/nginx-health"
else
    echo "❌ Nginx配置语法检查失败"
    exit 1
fi