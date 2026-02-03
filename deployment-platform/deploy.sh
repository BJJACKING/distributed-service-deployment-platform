#!/bin/bash

# 分布式服务部署平台 - 主部署脚本
# 版本: 1.0.0
# 作者: Walson

set -e  # 遇到错误时退出

# 配置
CONFIG_FILE="deploy.config"
LOG_FILE="deploy.log"
BACKUP_DIR="backups"
VERSIONS_DIR="versions"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
}

info() {
    log "INFO" "$1"
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
    log "SUCCESS" "$1"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    log "WARNING" "$1"
}

error() {
    echo -e "${RED}✗ $1${NC}"
    log "ERROR" "$1"
    exit 1
}

# 检查依赖
check_dependencies() {
    info "检查依赖..."
    
    local deps=("ssh" "scp" "curl" "git")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            error "依赖 $dep 未安装"
        fi
    done
    
    success "所有依赖已安装"
}

# 加载配置
load_config() {
    if [ ! -f "$CONFIG_FILE" ]; then
        warning "配置文件 $CONFIG_FILE 不存在，使用默认配置"
        create_default_config
    fi
    
    source "$CONFIG_FILE"
    
    # 验证必要配置
    if [ -z "$SERVERS" ]; then
        error "配置文件中 SERVERS 未定义"
    fi
    
    info "加载配置完成"
}

# 创建默认配置
create_default_config() {
    cat > "$CONFIG_FILE" << 'EOF'
# 分布式服务部署平台配置

# 服务器列表 (格式: 别名:用户@主机:端口:服务目录)
SERVERS=(
    "alijack:root@182.92.31.155:22:/opt/demo-service"
    "tenjack:ubuntu@152.136.16.77:22:/opt/demo-service"
)

# 服务配置
SERVICE_NAME="demo-service"
SERVICE_PORT="3000"
HEALTH_CHECK_PATH="/health"

# 部署配置
GIT_REPO=""  # 可选: Git仓库地址
BACKUP_ENABLED="true"
MAX_BACKUPS="5"

# 通知配置 (可选)
NOTIFY_ENABLED="false"
NOTIFY_WEBHOOK=""
EOF
    
    info "已创建默认配置文件: $CONFIG_FILE"
    info "请编辑 $CONFIG_FILE 以配置您的服务器"
}

# 解析服务器配置
parse_server_config() {
    local config=$1
    IFS=':' read -r alias user_host port service_dir <<< "$config"
    IFS='@' read -r user host <<< "$user_host"
    
    echo "$alias $user $host $port $service_dir"
}

# 测试服务器连接
test_server_connection() {
    local alias=$1
    local user=$2
    local host=$3
    local port=$4
    
    info "测试服务器连接: $alias ($user@$host:$port)"
    
    if ssh -p "$port" -o ConnectTimeout=5 -o BatchMode=yes "$user@$host" "echo '连接成功'" &> /dev/null; then
        success "服务器 $alias 连接成功"
        return 0
    else
        warning "服务器 $alias 连接失败"
        return 1
    fi
}

# 部署服务到单个服务器
deploy_to_server() {
    local alias=$1
    local user=$2
    local host=$3
    local port=$4
    local service_dir=$5
    
    info "开始部署到服务器: $alias"
    
    # 1. 创建备份
    if [ "$BACKUP_ENABLED" = "true" ]; then
        create_backup "$alias" "$user" "$host" "$port" "$service_dir"
    fi
    
    # 2. 同步文件
    sync_files "$alias" "$user" "$host" "$port" "$service_dir"
    
    # 3. 安装依赖
    install_dependencies "$alias" "$user" "$host" "$port" "$service_dir"
    
    # 4. 重启服务
    restart_service "$alias" "$user" "$host" "$port" "$service_dir"
    
    # 5. 健康检查
    health_check "$alias" "$user" "$host" "$port" "$service_dir"
    
    success "服务器 $alias 部署完成"
}

# 创建备份
create_backup() {
    local alias=$1 user=$2 host=$3 port=$4 service_dir=$5
    local timestamp=$(date '+%Y%m%d_%H%M%S')
    local backup_name="${alias}_${timestamp}"
    local backup_path="$BACKUP_DIR/$backup_name"
    
    info "创建备份: $backup_name"
    
    mkdir -p "$BACKUP_DIR"
    
    # 从服务器下载当前版本
    if ssh -p "$port" "$user@$host" "[ -d '$service_dir' ]" &> /dev/null; then
        rsync -avz -e "ssh -p $port" "$user@$host:$service_dir/" "$backup_path/" &>> "$LOG_FILE"
        success "备份创建成功: $backup_path"
        
        # 清理旧备份
        cleanup_old_backups
    else
        warning "服务目录不存在，跳过备份"
    fi
}

# 清理旧备份
cleanup_old_backups() {
    if [ "$MAX_BACKUPS" -gt 0 ]; then
        local backups=($(ls -1t "$BACKUP_DIR" 2>/dev/null || true))
        local count=${#backups[@]}
        
        if [ "$count" -gt "$MAX_BACKUPS" ]; then
            for ((i=MAX_BACKUPS; i<count; i++)); do
                rm -rf "$BACKUP_DIR/${backups[$i]}"
                info "删除旧备份: ${backups[$i]}"
            done
        fi
    fi
}

# 同步文件
sync_files() {
    local alias=$1 user=$2 host=$3 port=$4 service_dir=$5
    
    info "同步文件到服务器: $alias"
    
    # 创建远程目录
    ssh -p "$port" "$user@$host" "mkdir -p '$service_dir'"
    
    # 同步本地文件到服务器
    rsync -avz -e "ssh -p $port" \
        --exclude='node_modules' \
        --exclude='*.log' \
        --exclude='.git' \
        ./ "$user@$host:$service_dir/" \
        &>> "$LOG_FILE"
    
    success "文件同步完成"
}

# 安装依赖
install_dependencies() {
    local alias=$1 user=$2 host=$3 port=$4 service_dir=$5
    
    info "在服务器 $alias 上安装依赖"
    
    ssh -p "$port" "$user@$host" "
        cd '$service_dir'
        if [ -f 'package.json' ]; then
            npm install --production
            echo '依赖安装完成'
        else
            echo '没有package.json，跳过依赖安装'
        fi
    " &>> "$LOG_FILE"
    
    success "依赖安装完成"
}

# 重启服务
restart_service() {
    local alias=$1 user=$2 host=$3 port=$4 service_dir=$5
    
    info "重启服务: $alias"
    
    # 停止现有服务
    ssh -p "$port" "$user@$host" "
        cd '$service_dir'
        pkill -f 'node server.js' 2>/dev/null || true
        sleep 1
    " &>> "$LOG_FILE"
    
    # 启动新服务
    ssh -p "$port" "$user@$host" "
        cd '$service_dir'
        nohup node server.js > server.log 2>&1 &
        echo '服务启动命令已执行'
    " &>> "$LOG_FILE"
    
    sleep 2  # 等待服务启动
    
    success "服务重启完成"
}

# 健康检查
health_check() {
    local alias=$1 user=$2 host=$3 port=$4 service_dir=$5
    local max_retries=10
    local retry_interval=3
    
    info "执行健康检查: $alias"
    
    for ((i=1; i<=max_retries; i++)); do
        info "健康检查尝试 $i/$max_retries"
        
        local health_status=$(ssh -p "$port" "$user@$host" "
            curl -s -o /dev/null -w '%{http_code}' http://localhost:$SERVICE_PORT$HEALTH_CHECK_PATH || echo 'FAIL'
        " 2>/dev/null)
        
        if [ "$health_status" = "200" ]; then
            success "服务器 $alias 健康检查通过"
            return 0
        fi
        
        if [ "$i" -lt "$max_retries" ]; then
            sleep "$retry_interval"
        fi
    done
    
    error "服务器 $alias 健康检查失败"
}

# 回滚到上一个版本
rollback() {
    local backups=($(ls -1t "$BACKUP_DIR" 2>/dev/null || true))
    
    if [ ${#backups[@]} -eq 0 ]; then
        error "没有可用的备份"
    fi
    
    local latest_backup="${backups[0]}"
    info "开始回滚到: $latest_backup"
    
    # 部署到所有服务器
    for server_config in "${SERVERS[@]}"; do
        IFS=' ' read -r alias user host port service_dir <<< "$(parse_server_config "$server_config")"
        
        info "回滚服务器: $alias"
        
        # 停止服务
        ssh -p "$port" "$user@$host" "
            cd '$service_dir'
            pkill -f 'node server.js' 2>/dev/null || true
        " &>> "$LOG_FILE"
        
        # 恢复备份
        rsync -avz -e "ssh -p $port" \
            "$BACKUP_DIR/$latest_backup/" "$user@$host:$service_dir/" \
            &>> "$LOG_FILE"
        
        # 重启服务
        ssh -p "$port" "$user@$host" "
            cd '$service_dir'
            nohup node server.js > server.log 2>&1 &
        " &>> "$LOG_FILE"
        
        # 健康检查
        health_check "$alias" "$user" "$host" "$port" "$service_dir"
        
        success "服务器 $alias 回滚完成"
    done
    
    success "所有服务器回滚完成"
}

# 显示服务状态
status() {
    info "检查所有服务器状态"
    
    echo -e "\n${BLUE}=== 服务器状态 ===${NC}"
    printf "%-10s %-15s %-10s %-10s\n" "服务器" "状态" "版本" "运行时间"
    printf "%-10s %-15s %-10s %-10s\n" "--------" "---------------" "----------" "----------"
    
    for server_config in "${SERVERS[@]}"; do
        IFS=' ' read -r alias user host port service_dir <<< "$(parse_server_config "$server_config")"
        
        local server_status=$(ssh -p "$port" "$user@$host" "
            if curl -s http://localhost:$SERVICE_PORT$HEALTH_CHECK_PATH > /dev/null 2>&1; then
                echo 'RUNNING'
            else
                echo 'STOPPED'
            fi
        " 2>/dev/null || echo "UNREACHABLE")
        
        local version=$(ssh -p "$port" "$user@$host" "
            cd '$service_dir' 2>/dev/null && cat package.json 2>/dev/null | grep '\"version\"' | cut -d'\"' -f4 || echo 'UNKNOWN'
        " 2>/dev/null || echo "UNKNOWN")
        
        local uptime=$(ssh -p "$port" "$user@$host" "
            if ps aux | grep 'node server.js' | grep -v grep > /dev/null; then
                ps -eo pid,etime,cmd | grep 'node server.js' | grep -v grep | awk '{print \$2}' | head -1
            else
                echo 'N/A'
            fi
        " 2>/dev/null || echo "N/A")
        
        local status_color=$GREEN
        if [ "$server_status" = "STOPPED" ]; then
            status_color=$RED
        elif [ "$server_status" = "UNREACHABLE" ]; then
            status_color=$YELLOW
        fi
        
        printf "%-10s ${status_color}%-15s${NC} %-10s %-10s\n" "$alias" "$server_status" "$version" "$uptime"
    done
}

# 显示使用说明
usage() {
    echo -e "${BLUE}分布式服务部署平台${NC}"
    echo ""
    echo "用法: $0 <命令>"
    echo ""
    echo "命令:"
    echo "  deploy     部署服务到所有服务器"
    echo "  rollback   回滚到上一个版本"
    echo "  status     显示所有服务器状态"
    echo "  test       测试服务器连接"
    echo "  config     创建默认配置文件"
    echo "  help       显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 deploy     # 部署服务"
    echo "  $0 status     # 查看状态"
    echo "  $0 rollback   # 回滚到上一个版本"
}

# 主函数
main() {
    # 初始化
    mkdir -p "$BACKUP_DIR" "$VERSIONS_DIR"
    
    case "${1:-help}" in
        deploy)
            check_dependencies
            load_config
            info "开始部署服务"
            
            # 测试所有服务器连接
            local failed_servers=0
            for server_config in "${SERVERS[@]}"; do
                IFS=' ' read -r alias user host port service_dir <<< "$(parse_server_config "$server_config")"
                if ! test_server_connection "$alias" "$user" "$host" "$port"; then
                    ((failed_servers++))
                fi
            done
            
            if [ "$failed_servers" -eq "${#SERVERS[@]}" ]; then
                error "所有服务器连接失败，停止部署"
            fi
            
            # 部署到所有服务器
            for server_config in "${SERVERS[@]}"; do
                IFS=' ' read -r alias user host port service_dir <<< "$(parse_server_config "$server_config")"
                if test_server_connection "$alias" "$user" "$host" "$port"; then
                    deploy_to_server "$alias" "$user" "$host" "$port" "$service_dir"
                else
                    warning "跳过服务器 $alias (连接失败)"
                fi
            done
            
            success "部署完成！"
            ;;
            
        rollback)
            check_dependencies
            load_config
            rollback
            ;;
            
        status)
            check_dependencies
            load_config
            status
            ;;
            
        test)
            check_dependencies
            load_config
            info "测试服务器连接"
            
            for server_config in "${SERVERS[@]}"; do
                IFS=' ' read -r alias user host port service_dir <<< "$(parse_server_config "$server_config")"
                test_server_connection "$alias" "$user" "$host" "$port"
            done
            
            success "连接测试完成"
            ;;
            
        config)
            create_default_config
            ;;
            
        help|*)
            usage
            ;;
    esac
}

# 运行主函数
main "$@"