import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList } from '../types/models';
import { STORAGE_KEYS } from '../utils/constants';
import { selectIsAuthenticated, setUser, setTokens } from '../store/slices/authSlice';

// 导入屏幕组件
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  // 检查本地存储的认证状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 从本地存储获取token和用户信息
        const [token, userInfo] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER_INFO),
        ]);

        if (token && userInfo) {
          // 如果有token和用户信息，设置到Redux store
          const user = JSON.parse(userInfo);
          dispatch(setUser(user));
          
          // 这里可以添加token验证逻辑
          // 如果token有效，设置isAuthenticated为true
        }
      } catch (error) {
        console.error('检查认证状态失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {isAuthenticated ? (
          // 已认证用户进入主界面
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          // 未认证用户进入认证界面
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;