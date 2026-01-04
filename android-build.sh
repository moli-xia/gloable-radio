#!/bin/bash

echo "🚀 开始构建 Radio AABB Live Android APK..."

# 检查是否安装了必要依赖
echo "📦 检查依赖..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 Node.js"
    exit 1
fi

# 安装Capacitor依赖（如果尚未安装）
echo "📦 安装 Capacitor 依赖..."
npm install @capacitor/core @capacitor/cli @capacitor/android

# 构建Vue项目
echo "🔨 构建Vue项目..."
npm run build

# 初始化Capacitor（如果尚未初始化）
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️ 初始化 Capacitor..."
    npx cap init "Radio AABB Live" "live.aabb.radio" --web-dir=dist
fi

# 添加Android平台（如果尚未添加）
if [ ! -d "android" ]; then
    echo "📱 添加 Android 平台..."
    npx cap add android
fi

# 同步项目到Android
echo "🔄 同步项目到 Android..."
npx cap sync android

# 复制Web资源到Android
echo "📋 复制资源文件..."
npx cap copy android

echo "✅ 构建准备完成！"
echo ""
echo "接下来请执行以下步骤："
echo "1. 打开 Android Studio: npx cap open android"
echo "2. 在 Android Studio 中构建 APK"
echo "   - 点击 Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "   - 等待构建完成"
echo "   - APK 文件将在 android/app/build/outputs/apk/debug/ 目录中"
echo ""
echo "或者使用命令行构建："
echo "cd android && ./gradlew assembleDebug" 