#!/bin/bash

# Radio.aabb.live 自动部署脚本
# 使用方法: chmod +x deploy.sh && ./deploy.sh

set -e

echo "🚀 开始部署 Radio.aabb.live 项目..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查是否为 root 用户
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ 请不要使用 root 用户运行此脚本${NC}"
   echo "建议使用普通用户，脚本会在需要时提示输入 sudo 密码"
   exit 1
fi

# 检查操作系统
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    echo -e "${RED}❌ 此脚本仅支持 Linux 系统${NC}"
    exit 1
fi

# 检查 Node.js
echo -e "${BLUE}🔍 检查 Node.js 环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js 未安装，正在安装...${NC}"
    
    # 检测发行版
    if command -v apt &> /dev/null; then
        # Ubuntu/Debian
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command -v yum &> /dev/null; then
        # CentOS/RHEL
        curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
        sudo yum install -y nodejs
    else
        echo -e "${RED}❌ 不支持的包管理器，请手动安装 Node.js 18+${NC}"
        exit 1
    fi
else
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        echo -e "${RED}❌ Node.js 版本过低 (当前: $(node --version))，需要 16.0+${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js 版本: $(node --version)${NC}"
fi

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm 版本: $(npm --version)${NC}"

# 检查项目文件
echo -e "${BLUE}🔍 检查项目文件...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ 未找到 package.json 文件，请确保在项目根目录运行此脚本${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 项目文件检查通过${NC}"

# 安装依赖
echo -e "${BLUE}📦 安装项目依赖...${NC}"
npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"

# 环境配置
echo -e "${BLUE}⚙️  配置环境变量...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ 已创建 .env 文件${NC}"
        echo -e "${YELLOW}⚠️  请根据需要修改 .env 文件中的配置${NC}"
    else
        echo -e "${YELLOW}⚠️  未找到 .env.example 文件，跳过环境配置${NC}"
    fi
else
    echo -e "${GREEN}✓ .env 文件已存在${NC}"
fi

# 构建项目
echo -e "${BLUE}🔨 构建生产版本...${NC}"
npm run build
echo -e "${GREEN}✓ 项目构建完成${NC}"

# 询问部署方式
echo -e "${BLUE}选择部署方式:${NC}"
echo "1) 静态文件部署 (推荐)"
echo "2) Node.js 服务部署"
echo "3) 仅构建，不部署"
read -p "请选择 [1-3]: " deploy_choice

case $deploy_choice in
    1)
        echo -e "${BLUE}准备静态文件部署...${NC}"
        
        # 询问部署目录
        read -p "请输入网站根目录 [/www/wwwroot/radio.aabb.live]: " web_dir
        WEB_DIR=${web_dir:-/www/wwwroot/radio.aabb.live}
        
        # 创建目录
        sudo mkdir -p "$WEB_DIR"
        sudo chown -R $USER:$USER "$WEB_DIR"
        
        # 复制文件
        echo -e "${BLUE}复制构建文件到 $WEB_DIR...${NC}"
        cp -r dist/* "$WEB_DIR/"
        
        # 复制 Nginx 配置模板
        if [ -f "nginx-static.conf" ]; then
            sudo cp nginx-static.conf /etc/nginx/sites-available/radio.aabb.live 2>/dev/null || {
                echo -e "${YELLOW}⚠️  无法复制 Nginx 配置文件，请手动配置${NC}"
            }
        fi
        
        # 设置权限
        sudo chown -R www-data:www-data "$WEB_DIR" 2>/dev/null || {
            echo -e "${YELLOW}⚠️  无法设置 www-data 权限，请手动设置${NC}"
        }
        
        echo -e "${GREEN}✓ 静态文件部署完成${NC}"
        echo -e "${GREEN}✓ 项目已部署到: $WEB_DIR${NC}"
        echo -e "${YELLOW}📝 请配置 Nginx 并重启服务${NC}"
        ;;
        
    2)
        echo -e "${BLUE}准备Node.js服务部署...${NC}"
        
        # 检查 PM2
        if ! command -v pm2 &> /dev/null; then
            echo -e "${BLUE}安装 PM2...${NC}"
            sudo npm install -g pm2
        fi
        
        # 启动服务
        echo -e "${BLUE}启动 Node.js 服务...${NC}"
        pm2 start npm --name "radio-app" -- run preview
        pm2 startup
        pm2 save
        
        echo -e "${GREEN}✓ Node.js服务部署完成${NC}"
        echo -e "${GREEN}✓ 服务已启动，端口: 4173${NC}"
        ;;
        
    3)
        echo -e "${GREEN}✓ 构建完成，跳过部署${NC}"
        echo -e "${BLUE}构建文件位于: ./dist/${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ 无效选择${NC}"
        exit 1
        ;;
esac

# 显示部署信息
echo -e "${GREEN}🎉 部署完成!${NC}"
echo ""
echo -e "${BLUE}📋 部署信息:${NC}"
echo -e "${GREEN}✓ 项目构建: 完成${NC}"
echo -e "${GREEN}✓ 文件部署: 完成${NC}"
echo ""
echo -e "${BLUE}📝 后续步骤:${NC}"
echo "1. 配置域名 DNS 解析"
echo "2. 配置 SSL 证书"
echo "3. 配置并重启 Nginx"
echo "4. 测试网站功能"
echo ""
echo -e "${BLUE}📚 相关文档:${NC}"
echo -e "${YELLOW}完整指南: README.md${NC}"
echo -e "${YELLOW}Nginx配置: nginx-static.conf${NC}"
echo -e "${YELLOW}环境配置: .env${NC}"
echo ""
echo -e "${BLUE}🔧 常用命令:${NC}"
echo "查看 PM2 状态: pm2 status"
echo "查看 Nginx 状态: sudo systemctl status nginx"
echo "重启 Nginx: sudo systemctl restart nginx"
echo "查看日志: sudo tail -f /var/log/nginx/error.log"
echo ""
echo -e "${GREEN}部署脚本执行完成!${NC}"
