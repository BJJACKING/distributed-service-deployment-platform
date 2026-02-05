import axios from 'axios';
import { API_CONFIG } from '../utils/constants';
import { LoginRequest, RegisterRequest, ApiResponse } from '../types/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// 创建axios实例
const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/${API_CONFIG.VERSION}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理token刷新
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 如果是401错误且不是刷新token的请求，尝试刷新token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          throw new Error('没有刷新令牌');
        }
        
        const response = await refreshTokenApi(refreshToken);
        if (response.success && response.data) {
          const { token, refreshToken: newRefreshToken } = response.data;
          
          // 保存新的token
          await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          
          // 更新请求头
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // 重试原始请求
          return api(originalRequest);
        }
      } catch (refreshError) {
        // 刷新token失败，清除本地存储
        await AsyncStorage.multiRemove([
          STORAGE_KEYS.ACCESS_TOKEN,
          STORAGE_KEYS.REFRESH_TOKEN,
          STORAGE_KEYS.USER_INFO,
        ]);
        
        // 可以在这里触发重新登录的逻辑
        throw refreshError;
      }
    }
    
    return Promise.reject(error);
  }
);

// API函数
export const login = async (credentials: LoginRequest): Promise<ApiResponse<{
  user: any;
  token: string;
  refreshToken: string;
}>> => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.success) {
      const { user, token, refreshToken } = response.data.data;
      
      // 保存到本地存储
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_INFO, JSON.stringify(user)],
      ]);
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '登录失败',
      error: error.message,
    };
  }
};

export const register = async (userData: RegisterRequest): Promise<ApiResponse<{
  user: any;
  token: string;
  refreshToken: string;
}>> => {
  try {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.success) {
      const { user, token, refreshToken } = response.data.data;
      
      // 保存到本地存储
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_INFO, JSON.stringify(user)],
      ]);
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '注册失败',
      error: error.message,
    };
  }
};

export const logout = async (): Promise<ApiResponse<void>> => {
  try {
    // 调用登出API
    await api.post('/auth/logout');
    
    // 清除本地存储
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_INFO,
    ]);
    
    return { success: true };
  } catch (error: any) {
    // 即使API调用失败，也清除本地存储
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_INFO,
    ]);
    
    return {
      success: false,
      message: error.response?.data?.message || '登出失败',
      error: error.message,
    };
  }
};

export const refreshTokenApi = async (refreshToken: string): Promise<ApiResponse<{
  token: string;
  refreshToken: string;
}>> => {
  try {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '令牌刷新失败',
      error: error.message,
    };
  }
};

export const getCurrentUser = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取用户信息失败',
      error: error.message,
    };
  }
};

export const updateProfile = async (userData: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put('/auth/profile', userData);
    
    if (response.data.success) {
      // 更新本地存储的用户信息
      const userInfo = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
      if (userInfo) {
        const user = JSON.parse(userInfo);
        const updatedUser = { ...user, ...response.data.data };
        await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(updatedUser));
      }
    }
    
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '更新资料失败',
      error: error.message,
    };
  }
};

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post('/auth/change-password', passwordData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '修改密码失败',
      error: error.message,
    };
  }
};

export const forgotPassword = async (email: string): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '发送重置邮件失败',
      error: error.message,
    };
  }
};

export const resetPassword = async (resetData: {
  token: string;
  password: string;
}): Promise<ApiResponse<void>> => {
  try {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '重置密码失败',
      error: error.message,
    };
  }
};

// 导出api实例，供其他服务使用
export default api;