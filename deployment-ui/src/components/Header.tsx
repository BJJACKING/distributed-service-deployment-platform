import React from 'react';
import { Layout, Button, Dropdown, Space, Badge, Avatar, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  GlobalOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed }) => {
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const helpMenuItems = [
    {
      key: 'docs',
      icon: <QuestionCircleOutlined />,
      label: '使用文档',
    },
    {
      key: 'support',
      icon: <GlobalOutlined />,
      label: '技术支持',
    },
    {
      key: 'feedback',
      icon: <BellOutlined />,
      label: '反馈建议',
    },
  ];

  return (
    <AntHeader style={{ 
      padding: '0 16px', 
      background: '#fff', 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)'
    }}>
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: '16px', width: 64, height: 64 }}
        />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            background: '#1890ff', 
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8
          }}>
            <RocketOutlined style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <Text strong style={{ fontSize: 18 }}>部署管理平台</Text>
        </div>
      </Space>

      <Space size="large">
        {/* 通知 */}
        <Dropdown
          menu={{
            items: [
              {
                key: 'notifications',
                label: (
                  <div style={{ minWidth: 300 }}>
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
                      <Text strong>通知中心</Text>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text type="success">✓ 部署 v1.2.0 完成</Text>
                        <div style={{ fontSize: 12, color: '#999' }}>2分钟前</div>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <Text type="warning">⚠ CPU使用率过高</Text>
                        <div style={{ fontSize: 12, color: '#999' }}>10分钟前</div>
                      </div>
                      <div>
                        <Text type="secondary">📊 系统运行正常</Text>
                        <div style={{ fontSize: 12, color: '#999' }}>1小时前</div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ],
          }}
          placement="bottomRight"
        >
          <Badge count={3} size="small">
            <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} />
          </Badge>
        </Dropdown>

        {/* 帮助 */}
        <Dropdown menu={{ items: helpMenuItems }} placement="bottomRight">
          <Button type="text" icon={<QuestionCircleOutlined style={{ fontSize: 18 }} />} />
        </Dropdown>

        {/* 用户菜单 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer', padding: '8px' }}>
            <Avatar icon={<UserOutlined />} style={{ background: '#1890ff' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text strong>管理员</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>系统管理员</Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

// 自定义图标组件
const RocketOutlined: React.FC = () => (
  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
    <path d="M944 255.2H80c-8.8 0-16 7.2-16 16v288c0 8.8 7.2 16 16 16h864c8.8 0 16-7.2 16-16v-288c0-8.8-7.2-16-16-16zM864 351.2H160v-32h704v32zM832 511.2H192v-64h640v64z" />
    <path d="M416 767.2c0 8.8 7.2 16 16 16h160c8.8 0 16-7.2 16-16v-96c0-8.8-7.2-16-16-16H432c-8.8 0-16 7.2-16 16v96z m32-80h96v32h-96v-32z" />
  </svg>
);

export default Header;