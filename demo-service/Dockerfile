# 使用Node.js官方镜像
FROM node:20-alpine

# 创建应用目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用源代码
COPY . .

# 暴露端口
EXPOSE 3000

# 定义环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 运行应用
CMD [ "node", "server.js" ]