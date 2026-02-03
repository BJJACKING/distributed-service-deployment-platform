import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Server {
  id: string;
  name: string;
  host: string;
  status: 'healthy' | 'warning' | 'error' | 'offline';
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  lastCheck: string;
  services: string[];
  tags: string[];
}

interface Deployment {
  id: string;
  version: string;
  status: 'running' | 'success' | 'failed';
  servers: string[];
  startedAt: string;
  completedAt?: string;
  duration?: string;
  commit: string;
  author: string;
  rollback?: boolean;
}

interface MonitoringData {
  time: string;
  cpu: number;
  memory: number;
  requests: number;
  errors: number;
  responseTime: number;
}

interface LogEntry {
  id: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  server?: string;
}

interface DeploymentContextType {
  servers: Server[];
  deployments: Deployment[];
  monitoringData: MonitoringData[];
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  deploy: (version: string, servers: string[]) => Promise<Deployment>;
  rollback: (deploymentId: string) => Promise<Deployment>;
  executeCommand: (command: string, args: string[]) => Promise<string>;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3002/api';

export const useDeployment = () => {
  const context = useContext(DeploymentContext);
  if (!context) {
    throw new Error('useDeployment must be used within DeploymentProvider');
  }
  return context;
};

interface DeploymentProviderProps {
  children: ReactNode;
}

export const DeploymentProvider: React.FC<DeploymentProviderProps> = ({ children }) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [serversRes, deploymentsRes, monitoringRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/servers`),
        axios.get(`${API_BASE_URL}/deployments`),
        axios.get(`${API_BASE_URL}/monitoring`),
        axios.get(`${API_BASE_URL}/logs`)
      ]);

      if (serversRes.data.success) setServers(serversRes.data.data);
      if (deploymentsRes.data.success) setDeployments(deploymentsRes.data.data);
      if (monitoringRes.data.success) setMonitoringData(monitoringRes.data.data);
      if (logsRes.data.success) setLogs(logsRes.data.data);
    } catch (err: any) {
      setError(err.message || '获取数据失败');
      console.error('获取数据失败:', err);
      
      // 使用模拟数据作为后备
      setServers([
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
      ]);
      
      setDeployments([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

  const deploy = async (version: string, servers: string[]): Promise<Deployment> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/deploy`, { version, servers });
      if (response.data.success) {
        const newDeployment = response.data.data;
        setDeployments(prev => [newDeployment, ...prev]);
        return newDeployment;
      }
      throw new Error(response.data.error || '部署失败');
    } catch (err: any) {
      throw new Error(err.message || '部署请求失败');
    }
  };

  const rollback = async (deploymentId: string): Promise<Deployment> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/rollback/${deploymentId}`);
      if (response.data.success) {
        const rollbackDeployment = response.data.data;
        setDeployments(prev => [rollbackDeployment, ...prev]);
        return rollbackDeployment;
      }
      throw new Error(response.data.error || '回滚失败');
    } catch (err: any) {
      throw new Error(err.message || '回滚请求失败');
    }
  };

  const executeCommand = async (command: string, args: string[]): Promise<string> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/command`, { command, args });
      if (response.data.success) {
        return response.data.output;
      }
      throw new Error(response.data.error || '命令执行失败');
    } catch (err: any) {
      throw new Error(err.message || '命令请求失败');
    }
  };

  useEffect(() => {
    fetchData();
    
    // 每30秒自动刷新数据
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    servers,
    deployments,
    monitoringData,
    logs,
    loading,
    error,
    refreshData: fetchData,
    deploy,
    rollback,
    executeCommand
  };

  return (
    <DeploymentContext.Provider value={value}>
      {children}
    </DeploymentContext.Provider>
  );
};