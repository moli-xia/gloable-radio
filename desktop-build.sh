#!/bin/bash

echo "🖥️  开始准备 GlobalRadio Windows 桌面客户端..."
echo ""

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 Node.js"
    exit 1
fi

echo "📦 安装 Electron 依赖..."
npm install electron --save-dev

echo "✅ 桌面客户端准备完成！"
echo ""
echo "开发运行："
echo "  npm run desktop:dev"
echo ""
echo "在 Windows 上打包安装包（需在 Windows 环境执行）："
echo "  npm run desktop:pack:win"
echo ""
echo "应用启动后会先显示 shell 连接页，连接远程后台后进入登录页。"
echo "菜单「应用 > 服务器设置」可随时返回 shell 更换后台地址。"
