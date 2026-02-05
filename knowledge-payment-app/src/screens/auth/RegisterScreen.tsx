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
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../../types/models';
import { COLORS, FONT_SIZES, SPACING, REGEX } from '../../utils/constants';
import { register, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useDispatch();
  
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    // 用户名验证
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (!REGEX.USERNAME.test(formData.username)) {
      newErrors.username = '用户名2-20位，可包含中文、字母、数字和下划线';
    }
    
    // 邮箱验证（可选）
    if (formData.email && !REGEX.EMAIL.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    // 手机号验证（可选）
    if (formData.phone && !REGEX.PHONE.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }
    
    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (!REGEX.PASSWORD.test(formData.password)) {
      newErrors.password = '密码至少8位，包含字母和数字';
    }
    
    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    // 服务条款验证
    if (!agreedToTerms) {
      Alert.alert('提示', '请阅读并同意服务条款和隐私政策');
      return false;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // 清除之前的错误
      dispatch(clearError());
      
      const registerData = {
        username: formData.username,
        password: formData.password,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
      };
      
      const result = await dispatch(register(registerData) as any);
      
      if (register.fulfilled.match(result)) {
        // 注册成功，显示成功消息并导航到登录页
        Alert.alert(
          '注册成功',
          '您的账户已创建成功，请登录',
          [
            {
              text: '去登录',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else if (register.rejected.match(result)) {
        // 注册失败，显示错误信息
        Alert.alert('注册失败', result.payload as string || '注册失败，请重试');
      }
    } catch (error) {
      Alert.alert('错误', '注册过程中发生错误，请重试');
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const handleTermsPress = () => {
    Alert.alert('服务条款', '请访问我们的网站查看完整的服务条款和隐私政策');
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.title}>创建账户</Text>
          <View style={styles.placeholder} />
        </View>

        <Text style={styles.subtitle}>填写以下信息创建您的账户</Text>

        {/* Registration Form */}
        <Card style={styles.card}>
          <Card.Content>
            {/* Username Input */}
            <TextInput
              label="用户名 *"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              mode="outlined"
              style={styles.input}
              error={!!errors.username}
              left={<TextInput.Icon icon="account" />}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="2-20位，可包含中文、字母、数字"
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}

            {/* Email Input */}
            <TextInput
              label="邮箱"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              mode="outlined"
              style={styles.input}
              error={!!errors.email}
              left={<TextInput.Icon icon="email" />}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="可选，用于找回密码"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            {/* Phone Input */}
            <TextInput
              label="手机号"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              mode="outlined"
              style={styles.input}
              error={!!errors.phone}
              left={<TextInput.Icon icon="phone" />}
              keyboardType="phone-pad"
              placeholder="可选，用于快速登录"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            {/* Password Input */}
            <TextInput
              label="密码 *"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
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
              placeholder="至少8位，包含字母和数字"
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Confirm Password Input */}
            <TextInput
              label="确认密码 *"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              error={!!errors.confirmPassword}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            {/* Terms Agreement */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.7}
            >
              <View style={styles.checkboxContainer}>
                <MaterialCommunityIcons
                  name={agreedToTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={24}
                  color={agreedToTerms ? COLORS.PRIMARY : COLORS.GRAY_4}
                />
              </View>
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  我已阅读并同意
                  <Text style={styles.termsLink} onPress={handleTermsPress}>
                    《服务条款》
                  </Text>
                  和
                  <Text style={styles.termsLink} onPress={handleTermsPress}>
                    《隐私政策》
                  </Text>
                </Text>
              </View>
            </TouchableOpacity>

            {/* Register Button */}
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading || !agreedToTerms}
              style={[
                styles.registerButton,
                (!agreedToTerms || isLoading) && styles.registerButtonDisabled,
              ]}
              contentStyle={styles.registerButtonContent}
            >
              注册
            </Button>
          </Card.Content>
        </Card>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>已有账户？</Text>
          <TouchableOpacity onPress={handleBackToLogin}>
            <Text style={styles.loginLink}>立即登录</Text>
          </TouchableOpacity>
        </View>

        {/* Security Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Title style={styles.tipsTitle}>安全提示</Title>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.SUCCESS} />
              <Text style={styles.tipText}>请使用强密码，包含字母和数字</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.SUCCESS} />
              <Text style={styles.tipText}>不要与他人共享您的账户信息</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialCommunityIcons name="shield-check" size={16} color={COLORS.SUCCESS} />
              <Text style={styles.tipText}>定期更改密码以确保账户安全</Text>
            </View>
          </Card.Content>
        </Card>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.MD,
  },
  backButton: {
    padding: SPACING.XS,
  },
  title: {
    fontSize: FONT_SIZES.XL,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 40,
  },
  subtitle: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  card: {
    marginBottom: SPACING.LG,
    elevation: 4,
    borderRadius: 12,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.LG,
    padding: SPACING.SM,
    backgroundColor: COLORS.GRAY_1,
    borderRadius: 8,
  },
  checkboxContainer: {
    marginRight: SPACING.SM,
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  termsLink: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  registerButton: {
    marginBottom: SPACING.LG,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
  },
  registerButtonDisabled: {
    backgroundColor: COLORS.GRAY_3,
  },
  registerButtonContent: {
    paddingVertical: SPACING.SM,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  loginText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONT_SIZES.MD,
  },
  loginLink: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    marginLeft: SPACING.XS,
  },
  tipsCard: {
    marginBottom: SPACING.LG,
    backgroundColor: COLORS.GRAY_1,
    elevation: 2,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: FONT_SIZES.MD,
    fontWeight: 'bold',
    marginBottom: SPACING.MD,
    color: COLORS.TEXT_PRIMARY,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  tipText: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.SM,
    flex: 1,
  },
});

export default RegisterScreen;