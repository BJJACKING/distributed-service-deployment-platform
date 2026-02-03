import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag, Button, Space, Alert, Timeline } from 'antd';
import {
  CloudServerOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDeployment } from '../contexts/DeploymentContext';
import dayjs from 'dayjs';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { servers, deployments, refreshData, loading } = useDeployment();
  const [timeRange, setTimeRange] = useState('24h');

  // 统计数据
  const totalServers = servers.length;
  const healthyServers = servers.filter(s => s.status === 'healthy').length;
  const activeDeployments = deployments.filter(d => d.status === 'running').length;
  const successRate = deployments.length > 0 
    ? Math.round((deployments.filter(d => d.status === 'success').length / deployments.length) * 100)
    : 100;

  // 性能数据
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 60, requests: 120 },
    { time: '04:00', cpu: 38, memory: 58, requests: 85 },
    { time: '08:00', cpu: 65, memory: 72, requests: 210 },
    { time: '12:00', cpu: 78, memory: 80, requests: 350 },
    { time: '16:00', cpu: 72, memory: 75, requests: 280 },
    { time: '20:00', cpu: 55, memory: 65, requests: 180 },
    { time: '24:00', cpu: 42, memory: 58, requests: 95 },
  ];

  // 服务器分布数据
  const serverDistribution = [
    { name: '运行中', value: healthyServers, color: '#52c41a' },
    { name: '警告', value: servers.filter(s => s.status === 'warning').length, color: '#faad14' },
    { name: '异常', value: servers.filter(s => s.status === 'error').length, color: '#ff4d4f' },
    { name: '离线', value: servers.filter(s => s.status === 'offline').length, color: '#8c8c8c' },
  ];

  // 最近活动时间线
  const recentActivities = [
    {
      time: '刚刚',
      action: '部署完成',
      server: 'alijack',
      status: 'success',
      description: '版本 v1.2.0 部署成功',
    },
    {
      time: '10分钟前',
      action: '健康检查',
      server: 'tenjack',
      status: 'warning',
      description: 'CPU使用率超过80%',
    },
    {
      time: '30分钟前',
      action: '配置更新',
      server: '所有服务器',
      status: 'success',
      description: '负载均衡配置已更新',
    },
    {
      time: '2小时前',
      action: '服务重启',
      server: 'alijack',
      status: 'success',
      description: '计划维护重启完成',
    },
    {
      time: '5小时前',
      action: '监控告警',
      server: 'tenjack',
      status: 'error',
      description: '内存使用率超过90%',
    },
  ];

  // 服务器状态表格列
  const serverColumns = [
    {
      title: '服务器',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <CloudServerOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          healthy: { color: 'success', text: '健康' },
          warning: { color: 'warning', text: '警告' },
          error: { color: 'error', text: '异常' },
          offline: { color: 'default', text: '离线' },
        };
        const config = statusConfig[status] || { color: 'default', text: '未知' };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'CPU使用率',
      dataIndex: 'cpu',
      key: 'cpu',
      render: (value: number) => (
        <Progress percent={value} size="small" status={value > 80 ? 'exception' : value > 60 ? 'normal' : 'success'} />
      ),
    },
    {
      title: '内存使用率',
      dataIndex: 'memory',
      key: 'memory',
      render: (value: number) => (
        <Progress percent={value} size="small" status={value > 85 ? 'exception' : value > 70 ? 'normal' : 'success'} />
      ),
    },
    {
      title: '最后检查',
      dataIndex: 'lastCheck',
      key: 'lastCheck',
      render: (time: string) => dayjs(time).fromNow(),
    },
  ];

  // 模拟服务器数据
  const serverData = servers.map(server => ({
    key: server.id,
    name: server.name,
    status: server.status,
    cpu: Math.floor(Math.random() * 30) + 40, // 40-70%
    memory: Math.floor(Math.random() * 35) + 45, // 45-80%
    lastCheck: new Date().toISOString(),
  }));

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>仪表盘</h1>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={refreshData} loading={loading}>
            刷新数据
          </Button>
          <Button type="primary" icon={<RocketOutlined />}>
            快速部署
          </Button>
        </Space>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总服务器数"
              value={totalServers}
              prefix={<CloudServerOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ marginRight: 8 }}>健康: {healthyServers}</span>
              <Progress percent={Math.round((healthyServers / totalServers) * 100)} size="small" />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="活跃部署"
              value={activeDeployments}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              今日部署: {deployments.filter(d => dayjs(d.createdAt).isSame(dayjs(), 'day')).length} 次
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="部署成功率"
              value={successRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: successRate > 95 ? '#52c41a' : successRate > 80 ? '#faad14' : '#ff4d4f' }}
            />
            <div style={{ marginTop: 8 }}>
              最近24小时: {deployments.filter(d => 
                dayjs(d.createdAt).isAfter(dayjs().subtract(1, 'day'))
              ).length} 次部署
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均响应时间"
              value={156}
              suffix="ms"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ marginRight: 8 }}>
                <ArrowDownOutlined style={{ color: '#52c41a' }} /> 12ms
              </span>
              较昨日下降
            </div>
          </Card>
        </Col>
      </Row>

      {/* 警告区域 */}
      {servers.some(s => s.status !== 'healthy') && (
        <Alert
          message="系统警告"
          description={`有 ${servers.filter(s => s.status !== 'healthy').length} 台服务器状态异常，请及时处理。`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="系统性能趋势" extra={
            <Space>
              <Button size="small" type={timeRange === '24h' ? 'primary' : 'default'} onClick={() => setTimeRange('24h')}>24小时</Button>
              <Button size="small" type={timeRange === '7d' ? 'primary' : 'default'} onClick={() => setTimeRange('7d')}>7天</Button>
              <Button size="small" type={timeRange === '30d' ? 'primary' : 'default'} onClick={() => setTimeRange('30d')}>30天</Button>
            </Space>
          }>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cpu" name="CPU使用率 (%)" stroke="#1890ff" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="memory" name="内存使用率 (%)" stroke="#52c41a" strokeWidth={2} />
                  <Line type="monotone" dataKey="requests" name="请求数 (/分钟)" stroke="#722ed1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="服务器状态分布">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serverDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {serverDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 服务器状态表格 */}
      <Card title="服务器状态概览" style={{ marginBottom: 24 }}>
        <Table
          columns={serverColumns}
          dataSource={serverData}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* 最近活动和时间线 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="最近部署活动">
            <Timeline>
              {recentActivities.map((activity, index) => (
                <Timeline.Item
                  key={index}
                  color={
                    activity.status === 'success' ? 'green' :
                    activity.status === 'warning' ? 'orange' : 'red'
                  }
                  dot={
                    activity.status === 'success' ? <CheckCircleOutlined /> :
                    activity.status === 'warning' ? <WarningOutlined /> : <WarningOutlined />
                  }
                >
                  <div>
                    <strong>{activity.action}</strong> - {activity.server}
                    <div style={{ color: '#666', fontSize: '12px' }}>{activity.time}</div>
                    <div>{activity.description}</div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="资源使用排行">
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serverData.slice(0, 5)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cpu" name="CPU使用率 (%)" fill="#1890ff" />
                  <Bar dataKey="memory" name="内存使用率 (%)" fill="#52c41a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;