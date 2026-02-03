# 知识付费平台 - 前后端分离项目

## 项目概述

### 项目名称
智听平台 (AI Listening Platform)

### 项目定位
基于AI技术的知识付费平台，专注于音频内容，提供类似得到APP的学习体验，但更加注重AI增强的个性化学习。

### 核心特色
1. **AI增强音频处理** - 语音识别、语音合成、内容摘要
2. **个性化学习路径** - AI推荐系统，个性化课程推荐
3. **智能笔记系统** - 语音转文字，AI辅助笔记整理
4. **社区化学习** - AI匹配学习伙伴，智能讨论组

### 技术架构
- **前端**：React + TypeScript + Vite
- **后端**：Node.js + Express + TypeScript
- **数据库**：PostgreSQL + Redis
- **AI服务**：语音识别、自然语言处理
- **部署**：Docker + Kubernetes

## 项目结构

```
knowledge-platform/
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── models/         # 数据模型
│   │   ├── middleware/     # 中间件
│   │   ├── routes/         # 路由
│   │   └── utils/          # 工具函数
│   ├── tests/              # 测试
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── pages/          # 页面
│   │   ├── hooks/          # 自定义Hook
│   │   ├── store/          # 状态管理
│   │   ├── services/       # API服务
│   │   ├── utils/          # 工具函数
│   │   └── styles/         # 样式
│   ├── public/             # 静态资源
│   ├── package.json
│   └── vite.config.ts
├── docs/                   # 文档
│   ├── api/               # API文档
│   ├── database/          # 数据库设计
│   ├── deployment/        # 部署文档
│   └── architecture/      # 架构设计
└── deployment/            # 部署配置
    ├── docker/           # Docker配置
    ├── kubernetes/       # K8s配置
    ├── nginx/           # Nginx配置
    └── scripts/         # 部署脚本
```

## 功能模块

### 1. 用户模块
- 用户注册/登录（手机号、微信、邮箱）
- 个人资料管理
- 学习进度同步
- 会员等级系统

### 2. 课程模块
- 课程分类浏览
- 课程详情展示
- 音频播放器（支持倍速、书签）
- 学习进度跟踪
- 课程评价系统

### 3. AI功能模块
- 语音转文字（课程字幕生成）
- 内容摘要（AI生成课程摘要）
- 智能笔记（语音笔记转文字）
- 个性化推荐（基于学习行为）

### 4. 社区模块
- 学习小组
- 课程讨论区
- 专家问答
- 学习打卡
- 成果分享

### 5. 支付模块
- 课程购买
- 会员订阅
- 优惠券系统
- 订单管理

### 6. 管理后台
- 内容管理（课程上架/下架）
- 用户管理
- 订单管理
- 数据分析

## 技术栈

### 前端技术栈
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **状态管理**：Redux Toolkit
- **UI组件库**：Ant Design + Tailwind CSS
- **路由**：React Router v6
- **HTTP客户端**：Axios
- **音频播放**：Howler.js
- **图表**：Recharts

### 后端技术栈
- **运行时**：Node.js + Express
- **语言**：TypeScript
- **数据库ORM**：Prisma
- **认证**：JWT + Passport.js
- **文件存储**：Multer + 云存储
- **消息队列**：Bull (Redis)
- **缓存**：Redis
- **日志**：Winston
- **测试**：Jest + Supertest

### 数据库设计
- **PostgreSQL**：主数据库
- **Redis**：缓存、会话、消息队列
- **表设计**：
  - users (用户表)
  - courses (课程表)
  - lessons (课时表)
  - orders (订单表)
  - subscriptions (订阅表)
  - notes (笔记表)
  - comments (评论表)

### AI服务集成
- **语音识别**：Whisper API / 阿里云语音识别
- **语音合成**：ElevenLabs / 百度语音合成
- **内容摘要**：GPT API / Claude API
- **推荐系统**：协同过滤 + 内容推荐

## 开发环境搭建

### 前置要求
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker (可选)

### 快速开始
```bash
# 1. 克隆项目
git clone <repository-url>
cd knowledge-platform

# 2. 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 3. 配置环境变量
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. 启动数据库
docker-compose up -d postgres redis

# 5. 初始化数据库
cd backend && npx prisma migrate dev

# 6. 启动服务
# 后端
cd backend && npm run dev

# 前端 (新终端)
cd frontend && npm run dev
```

## API设计

### RESTful API规范
- 使用JSON作为数据交换格式
- 版本控制：/api/v1/
- 统一响应格式
- 错误处理标准化

### 主要API端点
```
GET    /api/v1/courses           # 获取课程列表
GET    /api/v1/courses/:id       # 获取课程详情
POST   /api/v1/courses           # 创建课程（管理员）
GET    /api/v1/lessons/:id/audio # 获取音频URL
POST   /api/v1/orders            # 创建订单
GET    /api/v1/users/me          # 获取当前用户信息
POST   /api/v1/auth/login        # 登录
POST   /api/v1/auth/register     # 注册
```

## 部署方案

### 开发环境
- 本地开发，热重载
- 使用Docker Compose管理服务

### 测试环境
- CI/CD流水线
- 自动化测试
- 代码质量检查

### 生产环境
- Docker容器化
- Kubernetes集群部署
- 负载均衡
- 监控告警

## 项目路线图

### 第一阶段：MVP (1-2个月)
- 基础用户系统
- 课程浏览和播放
- 支付功能
- 基础管理后台

### 第二阶段：功能完善 (2-3个月)
- AI功能集成
- 社区功能
- 移动端适配
- 性能优化

### 第三阶段：规模化 (3-6个月)
- 微服务架构改造
- 大数据分析
- 多语言支持
- 生态建设

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交代码变更
4. 编写测试用例
5. 提交Pull Request

## 许可证

MIT License

---

*项目创建于：2026年2月3日*
*最后更新：2026年2月3日*