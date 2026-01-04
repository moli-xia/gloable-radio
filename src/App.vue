<template>
  <div class="min-h-screen bg-ios-light-gray dark:bg-dark-bg transition-colors duration-300">
    <!-- PC端顶部导航 -->
    <TopNavigation />
    
    <!-- 主要内容区域 -->
    <main :class="mainContentClasses">
      <div class="container-responsive">
        <router-view />
      </div>
    </main>
    
    <!-- 底部播放器 -->
    <PlayerBar v-if="playerStore.currentStation" />
    
    <!-- 移动端底部导航栏 -->
    <BottomNavigation />
    
    <!-- 错误提示 -->
    <ErrorToast />
    
    <!-- Toast通知 -->
    <ToastContainer />
    
    <!-- 返回顶部按钮 -->
    <BackToTopButton />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useRadioStore } from '@/stores/radio'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'
import { deviceOptimization } from '@/utils/deviceOptimization'
import PlayerBar from '@/components/PlayerBar.vue'
import BottomNavigation from '@/components/BottomNavigation.vue'
import TopNavigation from '@/components/TopNavigation.vue'
import ErrorToast from '@/components/ErrorToast.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import BackToTopButton from '@/components/BackToTopButton.vue'
// MediaControl插件已移除

const playerStore = usePlayerStore()
const radioStore = useRadioStore()
const themeStore = useThemeStore()
const languageStore = useLanguageStore()

// 动态计算主要内容区域的类名
const mainContentClasses = computed(() => {
  const isMobile = deviceOptimization.isMobile()
  return {
    'pb-24': isMobile, // 移动端有底部导航时需要底部边距
    'pb-8': !isMobile, // PC端没有底部导航时减少底部边距
    'lg:pb-28': false, // 移除原有的lg断点样式
    'lg:pt-20': !isMobile // PC端顶部导航边距
  }
})

// 用户首次交互处理
let userInteracted = false

const handleFirstUserInteraction = () => {
  if (!userInteracted) {
    userInteracted = true
    
    // 如果播放器已经初始化，尝试激活音频上下文
    if (playerStore.audio) {
      deviceOptimization.optimizeAudioElement(playerStore.audio)
    }
    
    // 移除事件监听器
    document.removeEventListener('touchstart', handleFirstUserInteraction)
    document.removeEventListener('click', handleFirstUserInteraction)
    document.removeEventListener('keydown', handleFirstUserInteraction)
  }
}

// 权限检查函数已移除

onMounted(async () => {
  // 初始化主题（同步操作，不阻塞）
  themeStore.initTheme()
  
  // 为移动设备添加用户交互监听器（同步操作，不阻塞）
  if (deviceOptimization.isMobile()) {
    document.addEventListener('touchstart', handleFirstUserInteraction, { passive: true })
    document.addEventListener('click', handleFirstUserInteraction)
    document.addEventListener('keydown', handleFirstUserInteraction)
  }
  
  // 权限检查代码已移除
  
  // 异步初始化语言系统，不阻塞页面渲染
  languageStore.initLanguage().catch(error => {
    console.error('语言系统初始化失败:', error)
  })
  
  // 异步加载基础数据，不阻塞页面渲染
  Promise.all([
    radioStore.loadTopStations(),
    radioStore.loadCountries(),
    radioStore.loadLanguages(),
    radioStore.loadTags()
  ]).catch(error => {
    console.error('初始化数据失败:', error)
  })
})
</script>

<style>
/* 全局样式已在 style.css 中定义 */
</style>
