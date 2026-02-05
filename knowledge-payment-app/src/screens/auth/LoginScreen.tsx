import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../../types/models';
import { COLORS, FONT_SIZES, SPACING, ROUTES, REGEX } from '../../utils/constants';
import { login, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = '请输入用户名或手机号';
    } else if (!REGEX.USERNAME.test(username) && !REGEX.PHONE.test(username)) {
      newErrors.username = '请输入有效的用户名或手机号';
    }
    
    if (!password) {
      newErrors.password = '请输入密码';
    } else if (password.length < 6) {
      newErrors.password = '密码长度至少6位';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // 清除之前的错误
      dispatch(clearError());
      
      const result = await dispatch(login({ username, password }) as any);
      
      if (login.fulfilled.match(result)) {
        // 登录成功，导航到主页面
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' as never }],
        });
      } else if (login.rejected.match(result)) {
        // 登录失败，显示错误信息
        Alert.alert('登录失败', result.payload as string || '登录失败，请重试');
      }
    } catch (error) {
      Alert.alert('错误', '登录过程中发生错误，请重试');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleWechatLogin = () => {
    Alert.alert('提示', '微信登录功能正在开发中');
  };

  const handlePhoneLogin = () => {
    Alert.alert('提示', '手机号登录功能正在开发中');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>智</Text>
            </View>
            <Text style={styles.appName}>智学平台</Text>
          </View>
          <Text style={styles.welcomeText}>欢迎回来</Text>
          <Text style={styles.subtitle}>登录您的账户继续学习</Text>
        </View>

        {/* Login Form */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>账户登录</Title>
            
            {/* Username Input */}
            <TextInput
              label="用户名/手机号"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              error={!!errors.username}
              left={<TextInput.Icon icon="account" />}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            {/* Password Input */}
            <TextInput
              label="密码"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              error={!!errors.password}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>忘记密码？</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.loginButtonContent}
            >
              登录
            </Button>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>或</Text>
              <View style={styles.divider} />
            </View>

            {/* Social Login */}
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity
                style={[styles.socialButton, styles.wechatButton]}
                onPress={handleWechatLogin}
              >
                <MaterialCommunityIcons name="wechat" size={24} color="#ffffff" />
                <Text style={styles.socialButtonText}>微信登录</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.socialButton, styles.phoneButton]}
                onPress={handlePhoneLogin}
              >
                <MaterialCommunityIcons name="phone" size={24} color="#ffffff" />
                <Text style={styles.socialButtonText}>手机登录</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>还没有账户？</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerLink}>立即注册</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          登录即表示您同意我们的
          <Text style={styles.termsLink}> 服务条款 </Text>
          和
          <Text style={styles.termsLink}> 隐私政策</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.XL,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SM,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.WHITE,
  },
  appName: {
    fontSize: FONT_SIZES.XXL,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  welcomeText: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
  },
  card: {
    marginBottom: SPACING.LG,
    elevation: 4,
    borderRadius: BORDER_RADIUS.LG,
  },
  cardTitle: {
    fontSize: FONT_SIZES.LG,
    fontWeight: 'bold',
    marginBottom: SPACING.MD,
    color: COLORS.TEXT_PRIMARY,
  },
  input: {
    marginBottom: SPACING.SM,
    backgroundColor: COLORS.WHITE,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONT_SIZES.XS,
    marginBottom: SPACING.SM,
    marginLeft: SPACING.XS,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.LG,
  },
  forgotPasswordText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.SM,
  },
  loginButton: {
    marginBottom: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.PRIMARY,
  },
  loginButtonContent: {
    paddingVertical: SPACING.SM,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.GRAY_3,
  },
  dividerText: {
    marginHorizontal: SPACING.MD,
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.SM,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.LG,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginHorizontal: SPACING.XS,
  },
  wechatButton: {
    backgroundColor: '#07C160',
  },
  phoneButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  socialButtonText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.SM,
    fontWeight: 'bold',
    marginLeft: SPACING.XS,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  registerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.MD,
  },
  registerLink: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    marginLeft: SPACING.XS,
  },
  termsText: {
    textAlign: 'center',
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.XS,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.PRIMARY,
  },
});

// 导出圆角常量
const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 999,
};

export default LoginScreen;