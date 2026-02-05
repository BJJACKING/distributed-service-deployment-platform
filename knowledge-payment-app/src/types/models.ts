// 用户相关类型
export interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  level: 'free' | 'vip' | 'svip';
  points: number;
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  email?: string;
  phone?: string;
}

// 课程相关类型
export interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  instructor: Instructor;
  category: Category;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // 分钟
  lessonCount: number;
  studentCount: number;
  rating: number;
  reviewCount: number;
  isFree: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number; // 分钟
  videoUrl: string;
  isFree: boolean;
  order: number;
  completed?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description?: string;
  courseCount: number;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  courseCount: number;
  studentCount: number;
  rating: number;
}

// 学习相关类型
export interface LearningProgress {
  courseId: string;
  completedLessons: string[];
  totalLessons: number;
  progress: number; // 0-100
  lastAccessedAt: string;
  completedAt?: string;
}

export interface Note {
  id: string;
  courseId: string;
  lessonId: string;
  content: string;
  timestamp: number; // 视频时间戳（秒）
  createdAt: string;
  updatedAt: string;
}

// 社区相关类型
export interface Discussion {
  id: string;
  courseId: string;
  title: string;
  content: string;
  author: User;
  replyCount: number;
  likeCount: number;
  viewCount: number;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  discussionId: string;
  content: string;
  author: User;
  likeCount: number;
  createdAt: string;
}

// 订单相关类型
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
  paidAt?: string;
}

export interface OrderItem {
  courseId: string;
  courseTitle: string;
  price: number;
  quantity: number;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: 'alipay' | 'wechat' | 'card';
}

// 会员相关类型
export interface Membership {
  type: 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
  price: number;
  benefits: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 导航参数类型
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  CourseList: { categoryId?: string };
  CourseDetail: { courseId: string };
  LessonPlayer: { lessonId: string; courseId: string };
  Profile: undefined;
  Settings: undefined;
  Payment: { orderId: string };
  OrderHistory: undefined;
  MyCourses: undefined;
  MyNotes: undefined;
  DiscussionList: { courseId: string };
  DiscussionDetail: { discussionId: string };
};