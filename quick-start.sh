#!/bin/bash

echo "🎵 Radio AABB Live - Android APK 快速构建工具"
echo "============================================="
echo ""

# 函数：检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 未安装，请先安装 $2"
        exit 1
    else
        echo "✅ $1 已安装"
    fi
}

# 检查必要工具
echo "🔍 检查系统环境..."
check_command "node" "Node.js"
check_command "npm" "Node.js"
echo ""

# 显示版本信息
echo "📦 当前环境版本："
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo ""

# 提示用户选择
echo "请选择要执行的操作："
echo "1. 安装 Capacitor 依赖"
echo "2. 构建 Vue 项目"
echo "3. 初始化 Capacitor"
echo "4. 添加 Android 平台"
echo "5. 同步项目"
echo "6. 打开 Android Studio"
echo "7. 一键执行所有步骤"
echo "0. 退出"
echo ""

read -p "请输入选项 (0-7): " choice

case $choice in
    1)
        echo "📦 正在安装 Capacitor 依赖..."
        npm install @capacitor/core @capacitor/cli @capacitor/android --no-optional
        echo "✅ 依赖安装完成"
        ;;
    2)
        echo "🔨 正在构建 Vue 项目..."
        npm run build
        echo "✅ Vue 项目构建完成"
        ;;
    3)
        echo "⚙️ 正在初始化 Capacitor..."
        if [ ! -f "capacitor.config.ts" ]; then
            npx cap init "Radio AABB Live" "live.aabb.radio" --web-dir=dist
            echo "✅ Capacitor 初始化完成"
        else
            echo "ℹ️ Capacitor 已经初始化"
        fi
        ;;
    4)
        echo "📱 正在添加 Android 平台..."
        if [ ! -d "android" ]; then
            npx cap add android
            echo "✅ Android 平台添加完成"
        else
            echo "ℹ️ Android 平台已存在"
        fi
        ;;
    5)
        echo "🔄 正在同步项目..."
        npx cap sync android
        echo "✅ 项目同步完成"
        ;;
    6)
        echo "🚀 正在打开 Android Studio..."
        npx cap open android
        ;;
    7)
        echo "🚀 开始一键构建流程..."
        echo ""
        
        echo "步骤 1/6: 安装依赖..."
        npm install @capacitor/core @capacitor/cli @capacitor/android --no-optional
        
        echo "步骤 2/6: 构建项目..."
        npm run build
        
        echo "步骤 3/6: 初始化 Capacitor..."
        if [ ! -f "capacitor.config.ts" ]; then
            npx cap init "Radio AABB Live" "live.aabb.radio" --web-dir=dist
        fi
        
        echo "步骤 4/6: 添加 Android 平台..."
        if [ ! -d "android" ]; then
            npx cap add android
        fi
        
        echo "步骤 5/6: 同步项目..."
        npx cap sync android
        
        echo "步骤 6/6: 准备打开 Android Studio..."
        echo ""
        echo "🎉 所有步骤完成！"
        echo ""
        echo "接下来请："
        echo "1. 运行命令打开 Android Studio: npx cap open android"
        echo "2. 在 Android Studio 中点击 Build > Build Bundle(s) / APK(s) > Build APK(s)"
        echo "3. 等待构建完成，APK 文件将在 android/app/build/outputs/apk/debug/ 目录"
        echo ""
        
        read -p "是否现在打开 Android Studio? (y/n): " open_studio
        if [ "$open_studio" = "y" ] || [ "$open_studio" = "Y" ]; then
            npx cap open android
        fi
        ;;
    0)
        echo "👋 再见！"
        exit 0
        ;;
    *)
        echo "❌ 无效选项，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "✨ 操作完成！"
echo ""
echo "📚 更多信息请查看 ANDROID_BUILD_GUIDE.md" 