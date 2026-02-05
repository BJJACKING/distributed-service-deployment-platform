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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput, Button, Card, Title } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { RootStackParamList } from '../../types/models';
import { COLORS, FONT_SIZES, SPACING, REGEX } from '../../utils/constants';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const [errors, setErrors] = useState<{
    email?: string;
    code?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validateEmail = () => {
    if (!email.trim()) {
      setErrors({ email: '请输入邮箱地址' });
      return false;
    }
    
    if (!REGEX.EMAIL.test(email)) {
      setErrors({ email: '请输入有效的邮箱地址' });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const validateCode = () => {
    if (!code.trim()) {
      setErrors({ code: '请输入验证码' });
      return false;
    }
    
    if (code.length !== 6) {
      setErrors({ code: '验证码为6位数字' });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const validatePassword = () => {
    const newErrors: typeof errors = {};
    
    if (!newPassword) {
      newErrors.newPassword = '请输入新密码';
    } else if (!REGEX.PASSWORD.test(newPassword)) {
      newErrors.newPassword = '密码至少8位，包含字母和数字';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = '请确认新密码';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    if (!validateEmail()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // 模拟发送验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      Alert.alert('验证码已发送', `验证码已发送到 ${email}，请查收`);
      setStep('code');
    } catch (error) {
      Alert.alert('发送失败', '验证码发送失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateCode()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // 模拟验证验证码
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里应该调用API验证验证码
      // 假设验证码正确
      setStep('password');
      setErrors({});
    } catch (error) {
      Alert.alert('验证失败', '验证码错误或已过期，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // 模拟重置密码
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '密码重置成功',
        '您的密码已重置成功，请使用新密码登录',
        [
          {
            text: '去登录',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('重置失败', '密码重置失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'code') {
      setStep('email');
      setCode('');
      setErrors({});
    } else if (step === 'password') {
      setStep('code');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } else {
      navigation.goBack();
    }
  };

  const renderStepIndicator = () => {
    const steps = ['输入邮箱', '验证身份', '重置密码'];
    
    return (
      <View style={styles.stepIndicator}>
        {steps.map((stepText, index) => {
          const stepIndex = ['email', 'code', 'password'].indexOf(step);
          const isActive = index === stepIndex;
          const isCompleted = index < stepIndex;
          
          return (
            <View key={index} style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}>
                {isCompleted ? (
                  <MaterialCommunityIcons name="check" size={16} color={COLORS.WHITE} />
                ) : (
                  <Text style={[
                    styles.stepNumber,
                    isActive && styles.stepNumberActive,
                    isCompleted && styles.stepNumberCompleted,
                  ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text style={[
                styles.stepText,
                isActive && styles.stepTextActive,
                isCompleted && styles.stepTextCompleted,
              ]}>
                {stepText}
              </Text>
              {index < steps.length - 1 && (
                <View style={[
                  styles.stepLine,
                  isCompleted && styles.stepLineCompleted,
                ]} />
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderEmailStep = () => (
    <>
      <Text style={styles.instruction}>
        请输入您注册时使用的邮箱地址，我们将发送验证码到该邮箱
      </Text>
      
      <TextInput
        label="邮箱地址"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
        error={!!errors.email}
        left={<TextInput.Icon icon="email" />}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="请输入注册邮箱"
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email}</Text>
      )}
      
      <Button
        mode="contained"
        onPress={handleSendCode}
        loading={isLoading}
        disabled={isLoading}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        发送验证码
      </Button>
    </>
  );

  const renderCodeStep = () => (
    <>
      <Text style={styles.instruction}>
        验证码已发送到 {email}，请输入6位验证码
      </Text>
      
      <TextInput
        label="验证码"
        value={code}
        onChangeText={setCode}
        mode="outlined"
        style={styles.input}
        error={!!errors.code}
        left={<TextInput.Icon icon="numeric" />}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="请输入6位验证码"
      />
      {errors.code && (
        <Text style={styles.errorText}>{errors.code}</Text>
      )}
      
      <View style={styles.codeActions}>
        <TouchableOpacity
          onPress={handleSendCode}
          disabled={countdown > 0}
          style={[
            styles.resendButton,
            countdown > 0 && styles.resendButtonDisabled,
          ]}
        >
          <Text style={[
            styles.resendText,
            countdown > 0 && styles.resendTextDisabled,
          ]}>
            {countdown > 0 ? `重新发送(${countdown}s)` : '重新发送'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Button
        mode="contained"
        onPress={handleVerifyCode}
        loading={isLoading}
        disabled={isLoading}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        验证
      </Button>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Text style={styles.instruction}>
        请设置您的新密码
      </Text>
      
      <TextInput
        label="新密码"
        value={newPassword}
        onChangeText={setNewPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry={!showNewPassword}
        error={!!errors.newPassword}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={showNewPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowNewPassword(!showNewPassword)}
          />
        }
        placeholder="至少8位，包含字母和数字"
      />
      {errors.newPassword && (
        <Text style={styles.errorText}>{errors.newPassword}</Text>
      )}
      
      <TextInput
        label="确认新密码"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
      
      <Button
        mode="contained"
        onPress={handleResetPassword}
        loading={isLoading}
        disabled={isLoading}
        style={styles.actionButton}
        contentStyle={styles.actionButtonContent}
      >
        重置密码
      </Button>
    </>
  );

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
            onPress={handleBack}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.title}>忘记密码</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Form Card */}
        <Card style={styles.card}>
          <Card.Content>
            {step === 'email' && renderEmailStep()}
            {step === 'code' && renderCodeStep()}
            {step === 'password' && renderPasswordStep()}
          </Card.Content>
        </Card>

        {/* Help Text */}
        <Text style={styles.helpText}>
          如果遇到问题，请联系客服：support@zhixue.com
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.XL,
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XL,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.GRAY_3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  stepCircleActive: {
    backgroundColor: COLORS.PRIMARY,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.SUCCESS,
  },
  stepNumber: {
    fontSize: FONT_SIZES.SM,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: COLORS.WHITE,
  },
  stepNumberCompleted: {
    color: COLORS.WHITE,
  },
  stepText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  stepTextActive: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  stepTextCompleted: {
    color: COLORS.SUCCESS,
    fontWeight: 'bold',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '60%',
    right: '-60%',
    height: 2,
    backgroundColor: COLORS.GRAY_3,
    zIndex: -1,
  },
  stepLineCompleted: {
    backgroundColor: COLORS.SUCCESS,
  },
  card: {
    marginBottom: SPACING.LG,
    elevation: 4,
    borderRadius: 12,
  },
  instruction: {
    fontSize: FONT_SIZES.MD,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
    lineHeight: 22,
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
  codeActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.LG,
  },
  resendButton: {
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: COLORS.PRIMARY,
    fontSize: FONT_SIZES.SM,
  },
  resendTextDisabled: {
    color: COLORS.TEXT_DISABLED,
  },
  actionButton: {
    marginBottom: SPACING.LG,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
  },
  actionButtonContent: {
    paddingVertical: SPACING.SM,
  },
  helpText: {
    fontSize: FONT_SIZES.XS,
    color: COLORS.TEXT_DISABLED,
    textAlign: 'center',
    marginTop: SPACING.LG,
  },
});

export default ForgotPasswordScreen;