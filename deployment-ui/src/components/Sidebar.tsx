import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  CloudServerOutlined,
  DeploymentUnitOutlined,
  MonitorOutlined,
  FileTextOutlined,
  SettingOutlined,
  RocketOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/servers',
      icon: <CloudServerOutlined />,
      label: '服务器管理',
    },
    {
      key: '/deployments',
      icon: <DeploymentUnitOutlined />,
      label: '部署管理',
      children: [
        {
          key: '/deployments/list',
          icon: <RocketOutlined />,
          label: '部署任务',
        },
        {
          key: '/deployments/history',
          icon: <HistoryOutlined />,
          label: '部署历史',
        },
      ],
    },
    {
      key: '/monitoring',
      icon: <MonitorOutlined />,
      label: '系统监控',
    },
    {
      key: '/logs',
      icon: <FileTextOutlined />,
      label: '日志查看',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      style={{
        background: colorBgContainer,
        boxShadow: '2px 0 8px rgba(0, 21, 41, 0.08)',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ 
        padding: '16px', 
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <div style={{ 
          width: collapsed ? 32 : 48, 
          height: collapsed ? 32 : 48, 
          background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
          borderRadius: 8,
          margin: '0 auto 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <RocketOutlined style={{ 
            color: '#fff', 
            fontSize: collapsed ? 16 : 24 
          }} />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontWeight: 'bold', fontSize: 16 }}>部署平台</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>v1.0.0</div>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['/deployments']}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ 
          borderRight: 0,
          padding: '8px 0'
        }}
      />

      {!collapsed && (
        <div style={{ 
          padding: '16px', 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
          borderTop: '1px solid #f0f0f0',
          background: colorBgContainer
        }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>系统状态</div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              background: '#52c41a',
              marginRight: 8
            }} />
            <span style={{ fontSize: 12 }}>运行正常</span>
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>
            最后更新: 刚刚
          </div>
        </div>
      )}
    </Sider>
  );
};

// 自定义图标组件
const RocketOutlined: React.FC = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M944 255.2H80c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h864c8.8 0 16-7.2 16-16v-288c0-8.8-7.2-16-16-16zM864 351.2H160v-32h704v32zM832 511.2H192v-64h640v64z" />
    <path d="M416 767.2c0 8.8 7.2 16 16 16h160c8.8 0 16-7.2 16-16v-96c0-8.8-7.2-16-16-16H432c-8.8 0-16 7.2-16 16v96z m32-80h96v32h-96v-32z" />
  </svg>
);

export default Sidebar;