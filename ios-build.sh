#!/bin/bash

echo "🍎 开始准备 GlobalRadio iOS 工程..."
echo ""

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 Node.js"
    exit 1
fi

echo "📦 安装 Capacitor iOS 依赖..."
npm install @capacitor/core @capacitor/cli @capacitor/ios

if [ ! -d "ios" ]; then
    echo "📱 添加 iOS 平台..."
    npx cap add ios
fi

echo "🔄 同步 shell 到 iOS..."
npx cap sync ios

echo "✅ iOS 工程准备完成！"
echo ""
echo "接下来请在 macOS 上执行："
echo "1. cd ios/App && pod install"
echo "2. npx cap open ios"
echo "3. 在 Xcode 中选择真机或模拟器并运行"
echo ""
echo "应用启动后会先显示 shell 连接页，连接远程后台后进入登录页。"
echo "右上角「服务器设置」可随时返回 shell 更换后台地址。"
