// 应用常量配置

// API配置
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  VERSION: 'v1',
};

// 存储键名
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  THEME_MODE: 'theme_mode',
  LANGUAGE: 'language',
  FIRST_LAUNCH: 'first_launch',
};

// 路由名称
export const ROUTES = {
  // 认证相关
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // 主页面
  HOME: 'Home',
  COURSES: 'Courses',
  COMMUNITY: 'Community',
  PROFILE: 'Profile',
  
  // 课程相关
  COURSE_LIST: 'CourseList',
  COURSE_DETAIL: 'CourseDetail',
  LESSON_PLAYER: 'LessonPlayer',
  
  // 个人中心
  MY_COURSES: 'MyCourses',
  MY_NOTES: 'MyNotes',
  MY_COLLECTIONS: 'MyCollections',
  SETTINGS: 'Settings',
  
  // 支付相关
  PAYMENT: 'Payment',
  ORDER_HISTORY: 'OrderHistory',
  
  // 社区相关
  DISCUSSION_LIST: 'DiscussionList',
  DISCUSSION_DETAIL: 'DiscussionDetail',
  CREATE_DISCUSSION: 'CreateDiscussion',
};

// 主题颜色
export const COLORS = {
  // 主色调
  PRIMARY: '#1890ff',
  PRIMARY_LIGHT: '#69c0ff',
  PRIMARY_DARK: '#0050b3',
  
  // 辅助色
  SECONDARY: '#52c41a',
  SECONDARY_LIGHT: '#95de64',
  SECONDARY_DARK: '#237804',
  
  // 成功/警告/错误
  SUCCESS: '#52c41a',
  WARNING: '#faad14',
  ERROR: '#ff4d4f',
  INFO: '#1890ff',
  
  // 中性色
  WHITE: '#ffffff',
  BLACK: '#000000',
  GRAY_1: '#fafafa',
  GRAY_2: '#f5f5f5',
  GRAY_3: '#d9d9d9',
  GRAY_4: '#8c8c8c',
  GRAY_5: '#595959',
  GRAY_6: '#262626',
  
  // 背景色
  BACKGROUND: '#f0f2f5',
  CARD_BACKGROUND: '#ffffff',
  MODAL_BACKGROUND: 'rgba(0, 0, 0, 0.45)',
  
  // 文字色
  TEXT_PRIMARY: '#262626',
  TEXT_SECONDARY: '#595959',
  TEXT_DISABLED: '#8c8c8c',
  TEXT_INVERSE: '#ffffff',
};

// 字体大小
export const FONT_SIZES = {
  XXS: 10,
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

// 间距
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
};

// 圆角
export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  ROUND: 999,
};

// 课程分类
export const COURSE_CATEGORIES = [
  { id: '1', name: '职场技能', icon: 'briefcase' },
  { id: '2', name: '商业认知', icon: 'trending-up' },
  { id: '3', name: '技术前沿', icon: 'code' },
  { id: '4', name: '人文素养', icon: 'book' },
  { id: '5', name: '生活兴趣', icon: 'heart' },
  { id: '6', name: '语言学习', icon: 'message-circle' },
  { id: '7', name: '考试认证', icon: 'award' },
  { id: '8', name: '创业指导', icon: 'rocket' },
];

// 课程难度
export const COURSE_LEVELS = {
  BEGINNER: { label: '初级', color: '#52c41a' },
  INTERMEDIATE: { label: '中级', color: '#1890ff' },
  ADVANCED: { label: '高级', color: '#722ed1' },
};

// 会员类型
export const MEMBERSHIP_TYPES = [
  {
    type: 'monthly',
    name: '月度会员',
    price: 99,
    period: '月',
    benefits: ['所有免费课程', '专属会员课程', '学习小组', '专家答疑'],
  },
  {
    type: 'quarterly',
    name: '季度会员',
    price: 249,
    period: '季',
    benefits: ['所有免费课程', '专属会员课程', '学习小组', '专家答疑', '优先客服'],
    discount: '约83元/月',
  },
  {
    type: 'yearly',
    name: '年度会员',
    price: 799,
    period: '年',
    benefits: ['所有免费课程', '专属会员课程', '学习小组', '专家答疑', '优先客服', '证书认证'],
    discount: '约66元/月',
  },
  {
    type: 'lifetime',
    name: '终身会员',
    price: 3999,
    period: '终身',
    benefits: ['所有免费课程', '专属会员课程', '学习小组', '专家答疑', '优先客服', '证书认证', '线下活动'],
  },
];

// 支付方式
export const PAYMENT_METHODS = [
  { id: 'alipay', name: '支付宝', icon: 'alipay-circle' },
  { id: 'wechat', name: '微信支付', icon: 'wechat' },
  { id: 'card', name: '银行卡', icon: 'credit-card' },
];

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  TIMEOUT_ERROR: '请求超时，请检查网络连接',
  UNAUTHORIZED: '登录已过期，请重新登录',
  FORBIDDEN: '权限不足，无法访问',
  NOT_FOUND: '资源不存在',
  VALIDATION_ERROR: '输入信息有误，请检查后重试',
  UNKNOWN_ERROR: '未知错误，请稍后重试',
};

// 成功消息
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: '登录成功',
  REGISTER_SUCCESS: '注册成功',
  COURSE_PURCHASE_SUCCESS: '课程购买成功',
  PAYMENT_SUCCESS: '支付成功',
  UPDATE_SUCCESS: '更新成功',
  DELETE_SUCCESS: '删除成功',
};

// 正则表达式
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^1[3-9]\d{9}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,20}$/,
};

// 应用配置
export const APP_CONFIG = {
  APP_NAME: '智学平台',
  VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  SUPPORT_EMAIL: 'support@zhixue.com',
  PRIVACY_POLICY_URL: 'https://zhixue.com/privacy',
  TERMS_OF_SERVICE_URL: 'https://zhixue.com/terms',
};