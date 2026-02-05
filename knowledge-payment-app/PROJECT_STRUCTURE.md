# 知识付费平台 - Expo App 项目结构

## 项目概述
基于知识付费平台需求文档开发的移动端应用，使用Expo + React Native + TypeScript技术栈。

## 技术栈
- **框架**: Expo 54.0.33 + React Native 0.81.5
- **语言**: TypeScript
- **导航**: React Navigation 6.x
- **UI组件**: React Native Paper
- **状态管理**: Redux Toolkit + React Redux
- **网络请求**: Axios
- **图标**: React Native Vector Icons

## 目录结构
```
knowledge-payment-app/
├── src/
│   ├── screens/          # 页面组件
│   │   ├── auth/         # 认证相关页面
│   │   ├── home/         # 首页相关页面
│   │   ├── course/       # 课程相关页面
│   │   ├── community/    # 社区相关页面
│   │   ├── profile/      # 个人中心页面
│   │   └── payment/      # 支付相关页面
│   ├── components/       # 可复用组件
│   │   ├── common/       # 通用组件
│   │   ├── course/       # 课程相关组件
│   │   ├── ui/          # UI组件
│   │   └── layout/      # 布局组件
│   ├── navigation/       # 导航配置
│   │   ├── AppNavigator.tsx
│   │   ├── BottomTabNavigator.tsx
│   │   ├── DrawerNavigator.tsx
│   │   └── StackNavigator.tsx
│   ├── services/         # 服务层
│   │   ├── api/         # API服务
│   │   ├── auth/        # 认证服务
│   │   ├── course/      # 课程服务
│   │   └── payment/     # 支付服务
│   ├── store/           # Redux状态管理
│   │   ├── slices/      # Redux切片
│   │   ├── store.ts     # Store配置
│   │   └── hooks.ts     # Redux hooks
│   ├── utils/           # 工具函数
│   │   ├── constants.ts # 常量定义
│   │   ├── helpers.ts   # 辅助函数
│   │   └── validation.ts # 验证函数
│   ├── assets/          # 静态资源
│   │   ├── images/      # 图片资源
│   │   ├── fonts/       # 字体文件
│   │   └── icons/       # 图标资源
│   └── types/           # TypeScript类型定义
│       ├── api.ts       # API类型
│       ├── navigation.ts # 导航类型
│       └── models.ts    # 数据模型类型
├── App.tsx              # 应用入口
├── app.json             # Expo配置
└── package.json         # 依赖配置
```

## 核心功能模块

### 1. 用户认证模块
- 登录/注册
- 第三方登录（微信、手机号）
- 忘记密码
- 用户信息管理

### 2. 首页模块
- 课程推荐
- 分类浏览
- 搜索功能
- 轮播图/Banner

### 3. 课程模块
- 课程列表
- 课程详情
- 课程播放器
- 学习进度跟踪
- 课程收藏/分享

### 4. 学习功能模块
- 视频播放器
- 播放控制（速度、字幕）
- 学习笔记
- 书签功能
- 离线下载

### 5. 社区模块
- 学习小组
- 课程讨论区
- 专家问答
- 学习打卡
- 成果分享

### 6. 支付模块
- 课程购买
- 会员订阅
- 优惠券系统
- 订单管理

### 7. 个人中心模块
- 个人资料
- 学习记录
- 我的收藏
- 设置页面

## 开发计划

### 第一阶段：基础框架搭建（1-2天）
- [ ] 项目初始化与依赖安装
- [ ] 导航结构搭建
- [ ] 基础UI组件库集成
- [ ] Redux状态管理配置
- [ ] API服务层搭建

### 第二阶段：核心页面开发（3-5天）
- [ ] 登录/注册页面
- [ ] 首页与课程列表
- [ ] 课程详情页
- [ ] 视频播放器
- [ ] 个人中心页面

### 第三阶段：功能完善（3-4天）
- [ ] 社区功能
- [ ] 支付功能
- [ ] 搜索功能
- [ ] 离线功能
- [ ] 通知系统

### 第四阶段：优化与测试（2-3天）
- [ ] 性能优化
- [ ] 用户体验优化
- [ ] 测试与调试
- [ ] 打包发布准备

## API接口规划
（基于需求文档中的微服务架构）
- 用户服务：/api/auth, /api/users
- 课程服务：/api/courses, /api/categories
- 订单服务：/api/orders, /api/payments
- 社区服务：/api/community, /api/comments
- 学习服务：/api/learning, /api/progress

## 设计规范
- **颜色主题**: 主色#1890ff（科技蓝），辅色#52c41a（成长绿）
- **字体**: 系统默认字体，支持中英文
- **间距**: 使用8px为基准单位
- **图标**: Material Design图标体系
- **动画**: 使用React Native Animated API

## 开发注意事项
1. 遵循TypeScript严格模式
2. 组件尽量使用函数式组件+Hooks
3. 状态管理优先使用Redux Toolkit
4. 网络请求使用Axios + 拦截器
5. 错误处理要完善，提供用户友好提示
6. 性能优化：图片懒加载、列表虚拟化
7. 代码分割：按需加载路由组件

## 环境配置
- 开发环境：Expo Go + 模拟器/真机
- 测试环境：独立API服务
- 生产环境：云服务部署

## 相关文档
- [知识付费平台需求文档](../知识付费平台-项目需求文档.md)
- [Expo官方文档](https://docs.expo.dev/)
- [React Native文档](https://reactnative.dev/)
- [React Navigation文档](https://reactnavigation.org/)
- [React Native Paper文档](https://callstack.github.io/react-native-paper/)