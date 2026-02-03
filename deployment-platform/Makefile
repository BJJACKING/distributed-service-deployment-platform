# 分布式服务部署平台 - Makefile

.PHONY: help deploy status rollback test clean

# 默认目标
help:
	@echo "分布式服务部署平台 - 构建工具"
	@echo ""
	@echo "可用命令:"
	@echo "  make deploy    部署服务到所有服务器"
	@echo "  make status    查看所有服务器状态"
	@echo "  make rollback  回滚到上一个版本"
	@echo "  make test      测试服务器连接"
	@echo "  make config    创建默认配置文件"
	@echo "  make clean     清理备份和日志"
	@echo "  make help      显示此帮助信息"
	@echo ""
	@echo "环境变量:"
	@echo "  CONFIG_FILE=自定义配置文件路径"
	@echo "  LOG_LEVEL=DEBUG|INFO|WARN|ERROR"

# 部署服务
deploy:
	@echo "🚀 开始部署服务..."
	./deploy.sh deploy

# 查看状态
status:
	@echo "📊 查看服务器状态..."
	./deploy.sh status

# 回滚服务
rollback:
	@echo "🔙 回滚到上一个版本..."
	./deploy.sh rollback

# 测试连接
test:
	@echo "🔗 测试服务器连接..."
	./deploy.sh test

# 创建配置文件
config:
	@echo "⚙️ 创建默认配置文件..."
	./deploy.sh config

# 清理
clean:
	@echo "🧹 清理临时文件..."
	@if [ -f "deploy.log" ]; then \
		echo "备份日志文件..."; \
		mv deploy.log "deploy.log.$(date +%Y%m%d_%H%M%S)"; \
	fi
	@if [ -d "backups" ]; then \
		echo "清理旧备份..."; \
		find backups -type f -name "*.tar.gz" -mtime +7 -delete; \
	fi
	@echo "✅ 清理完成"

# 安装依赖
install-deps:
	@echo "📦 安装系统依赖..."
	@command -v apt-get >/dev/null 2>&1 && sudo apt-get install -y ssh rsync curl git || \
	command -v yum >/dev/null 2>&1 && sudo yum install -y ssh rsync curl git || \
	command -v brew >/dev/null 2>&1 && brew install ssh rsync curl git || \
	echo "⚠️  请手动安装: ssh, rsync, curl, git"

# 验证环境
check-env:
	@echo "🔍 验证部署环境..."
	@command -v ssh >/dev/null 2>&1 || echo "❌ ssh 未安装"
	@command -v rsync >/dev/null 2>&1 || echo "❌ rsync 未安装"
	@command -v curl >/dev/null 2>&1 || echo "❌ curl 未安装"
	@command -v git >/dev/null 2>&1 || echo "❌ git 未安装"
	@[ -f "deploy.config" ] || echo "⚠️  配置文件 deploy.config 不存在，运行: make config"
	@echo "✅ 环境检查完成"

# 查看日志
logs:
	@echo "📝 查看部署日志..."
	@if [ -f "deploy.log" ]; then \
		tail -50 deploy.log; \
	else \
		echo "暂无日志文件"; \
	fi

# 备份管理
list-backups:
	@echo "💾 可用备份列表:"
	@if [ -d "backups" ]; then \
		ls -lh backups/; \
	else \
		echo "暂无备份"; \
	fi

# 版本信息
version:
	@echo "分布式服务部署平台"
	@echo "版本: 1.0.0"
	@echo "作者: Walson"
	@echo "创建时间: 2026-02-02"

# 安全检查
security-check:
	@echo "🔒 安全检查..."
	@# 检查配置文件权限
	@if [ -f "deploy.config" ]; then \
		perms=$$(stat -c "%a" deploy.config); \
		if [ "$$perms" != "600" ]; then \
			echo "⚠️  配置文件权限建议设置为 600"; \
			chmod 600 deploy.config; \
		fi; \
	fi
	@# 检查SSH密钥权限
	@if [ -f "$$HOME/.ssh/id_rsa" ]; then \
		perms=$$(stat -c "%a" $$HOME/.ssh/id_rsa); \
		if [ "$$perms" != "600" ]; then \
			echo "⚠️  SSH私钥权限建议设置为 600"; \
		fi; \
	fi
	@echo "✅ 安全检查完成"

# 初始化项目
init: install-deps config security-check
	@echo "✅ 项目初始化完成"
	@echo ""
	@echo "下一步:"
	@echo "  1. 编辑 deploy.config 配置文件"
	@echo "  2. 运行 make test 测试连接"
	@echo "  3. 运行 make deploy 开始部署"

# 完整部署流程
full-deploy: check-env test deploy status
	@echo "🎉 完整部署流程完成!"