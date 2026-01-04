#!/bin/bash

# Radio.aabb.live 一键部署到FTP服务器脚本
# 功能：构建前端 -> 打包dist -> 上传到FTP服务器

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# FTP配置
FTP_HOST="45.150.165.50"
FTP_PORT="21"
FTP_USER="aabb"
FTP_PASS="251024"
FTP_REMOTE_DIR="/"

# 项目配置
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$PROJECT_DIR/dist"
ZIP_FILE="radio-frontend.zip"
ZIP_PATH="$PROJECT_DIR/$ZIP_FILE"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Radio.aabb.live FTP部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "项目目录: $PROJECT_DIR"
echo -e "FTP服务器: $FTP_HOST:$FTP_PORT"
echo -e "打包文件: $ZIP_FILE"
echo ""

# 检查依赖
echo -e "${YELLOW}[1/5] 检查依赖...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: npm 未安装${NC}"
    exit 1
fi

if ! command -v zip &> /dev/null; then
    echo -e "${RED}错误: zip 未安装，正在安装...${NC}"
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y zip
    elif command -v yum &> /dev/null; then
        sudo yum install -y zip
    else
        echo -e "${RED}无法自动安装zip，请手动安装${NC}"
        exit 1
    fi
fi

if ! command -v ftp &> /dev/null; then
    echo -e "${RED}错误: ftp 客户端未安装，正在安装...${NC}"
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y ftp
    elif command -v yum &> /dev/null; then
        sudo yum install -y ftp
    else
        echo -e "${RED}无法自动安装ftp客户端，请手动安装${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ 依赖检查完成${NC}"

# 清理旧文件
echo -e "${YELLOW}[2/5] 清理旧文件...${NC}"
if [ -d "$DIST_DIR" ]; then
    rm -rf "$DIST_DIR"
    echo -e "${GREEN}✓ 已清理旧的dist目录${NC}"
fi

# 删除旧的zip文件
if [ -f "$ZIP_PATH" ]; then
    rm -f "$ZIP_PATH"
    echo -e "${GREEN}✓ 已清理旧的zip文件${NC}"
fi

# 构建前端
echo -e "${YELLOW}[3/5] 构建前端项目...${NC}"
cd "$PROJECT_DIR"
npm run build

if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}错误: 构建失败，dist目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 前端构建完成${NC}"

# 打包dist目录
echo -e "${YELLOW}[4/5] 打包dist目录...${NC}"
cd "$PROJECT_DIR"
zip -r "$ZIP_FILE" dist/

if [ ! -f "$ZIP_PATH" ]; then
    echo -e "${RED}错误: 打包失败${NC}"
    exit 1
fi

ZIP_SIZE=$(du -h "$ZIP_PATH" | cut -f1)
echo -e "${GREEN}✓ 打包完成，文件大小: $ZIP_SIZE${NC}"

# 上传到FTP服务器
echo -e "${YELLOW}[5/5] 上传到FTP服务器...${NC}"
echo -e "正在连接 $FTP_HOST:$FTP_PORT..."

# 创建FTP命令文件
FTP_SCRIPT="/tmp/ftp_upload_$$.txt"
cat > "$FTP_SCRIPT" << EOF
open $FTP_HOST $FTP_PORT
user $FTP_USER $FTP_PASS
binary
cd $FTP_REMOTE_DIR
put $ZIP_PATH $ZIP_FILE
ls $ZIP_FILE
quit
EOF

# 执行FTP上传
if ftp -n < "$FTP_SCRIPT"; then
    echo -e "${GREEN}✓ 文件上传成功${NC}"
    echo -e "${GREEN}✓ 远程文件: $FTP_REMOTE_DIR$ZIP_FILE${NC}"
else
    echo -e "${RED}错误: FTP上传失败${NC}"
    rm -f "$FTP_SCRIPT"
    exit 1
fi

# 清理临时文件
rm -f "$FTP_SCRIPT"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "本地文件: $ZIP_PATH"
echo -e "远程文件: ftp://$FTP_HOST$FTP_REMOTE_DIR$ZIP_FILE"
echo -e "文件大小: $ZIP_SIZE"
echo -e "部署时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo -e "${BLUE}提示: 本地zip文件已保留，如需清理请手动删除${NC}"
echo ""

# 可选：显示FTP服务器上的文件列表
read -p "是否查看FTP服务器上的文件列表？(y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}正在获取FTP服务器文件列表...${NC}"
    cat > "$FTP_SCRIPT" << EOF
open $FTP_HOST $FTP_PORT
user $FTP_USER $FTP_PASS
cd $FTP_REMOTE_DIR
ls
quit
EOF
    ftp -n < "$FTP_SCRIPT"
    rm -f "$FTP_SCRIPT"
fi

echo -e "${GREEN}脚本执行完成！${NC}"