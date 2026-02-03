import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, ConfigProvider, message, Spin } from 'antd';
import {
  DashboardOutlined,
  ServerOutlined,
  DeploymentUnitOutlined,
  MonitorOutlined,
  FileTextOutlined,
  SettingOutlined,
  CloudServerOutlined,
  RocketOutlined,
  HistoryOutlined,
  BellOutlined,
  UserOutlined
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Servers from './pages/Servers';
import Deployments from './pages/Deployments';
import Monitoring from './pages/Monitoring';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { DeploymentProvider } from './contexts/DeploymentContext';
import './App.css';

const { Content, Footer } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // 模拟初始化加载
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" tip="加载部署平台..." />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <DeploymentProvider>
        <Router>
          <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} />
            <Layout>
              <Header collapsed={collapsed} setCollapsed={setCollapsed} />
              <Content style={{ margin: '16px' }}>
                <div
                  style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/servers" element={<Servers />} />
                    <Route path="/deployments" element={<Deployments />} />
                    <Route path="/monitoring" element={<Monitoring />} />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </Content>
              <Footer style={{ textAlign: 'center', padding: '16px' }}>
                分布式服务部署平台 ©{new Date().getFullYear()} - 版本 1.0.0
              </Footer>
            </Layout>
          </Layout>
        </Router>
      </DeploymentProvider>
    </ConfigProvider>
  );
};

export default App;