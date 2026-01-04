<template>
  <nav v-if="shouldShowNavigation" class="bottom-navigation fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-gray">
    <div class="flex items-center justify-around py-3 px-2 h-[88px]">
      <router-link
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.path"
        class="nav-item flex flex-col items-center justify-center py-2 px-1 rounded-ios transition-all active:scale-95 flex-1 min-w-0"
        :class="{
          'text-ios-blue': $route.name === item.name,
          'text-ios-gray hover:text-ios-dark-gray dark:text-dark-secondary dark:hover:text-dark-text': $route.name !== item.name
        }"
      >
        <component
          :is="item.icon"
          class="w-7 h-7 mb-1 flex-shrink-0"
          :class="{
            'fill-current': $route.name === item.name && item.fillWhenActive
          }"
        />
        <span 
          class="nav-text text-center leading-tight max-w-full font-medium"
          :title="item.label"
        >
          {{ item.label }}
        </span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  HomeIcon,
  ClockIcon,
  HeartIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'
import { useLanguageStore } from '@/stores/language'
import { deviceOptimization } from '@/utils/deviceOptimization'

const languageStore = useLanguageStore()

// 只在移动设备上显示底部导航
const shouldShowNavigation = computed(() => {
  return deviceOptimization.isMobile()
})

const navigationItems = computed(() => [
  {
    name: 'Home',
    path: '/',
    label: languageStore.t('nav.home'),
    icon: HomeIcon,
    fillWhenActive: false
  },
  {
    name: 'History',
    path: '/history',
    label: languageStore.t('nav.history'),
    icon: ClockIcon,
    fillWhenActive: false
  },
  {
    name: 'Favorites',
    path: '/favorites',
    label: languageStore.t('nav.favorites'),
    icon: HeartIcon,
    fillWhenActive: true
  },
  {
    name: 'Settings',
    path: '/settings',
    label: languageStore.t('nav.settings'),
    icon: Cog6ToothIcon,
    fillWhenActive: false
  }
])
</script>

<style scoped>
.nav-text {
  /* 基础字体大小，更保守的尺寸以适应长文字 */
  font-size: clamp(0.6rem, 2.5vw, 0.75rem); /* 9.6px - 12px */
  line-height: 1.1;
  min-height: 2.2em; /* 确保有足够的高度显示两行文字 */
  max-height: 2.2em; /* 限制最大高度防止溢出 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: center;
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  
  /* 确保文字垂直居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

/* 针对不同屏幕尺寸的优化 */
@media (max-width: 320px) {
  .nav-text {
    font-size: clamp(0.5rem, 2vw, 0.625rem); /* 8px - 10px 超小屏幕 */
    line-height: 1.0;
  }
}

@media (min-width: 321px) and (max-width: 360px) {
  .nav-text {
    font-size: clamp(0.55rem, 2.2vw, 0.6875rem); /* 8.8px - 11px */
  }
}

@media (min-width: 361px) and (max-width: 414px) {
  .nav-text {
    font-size: clamp(0.625rem, 2.5vw, 0.75rem); /* 10px - 12px */
  }
}

@media (min-width: 415px) {
  .nav-text {
    font-size: 0.75rem; /* 12px */
  }
}

/* 导航项布局优化 */
.nav-item {
  min-height: 4.75rem; /* 增加最小高度确保文字不溢出 */
  max-height: 5.5rem; /* 限制最大高度防止过度拉伸 */
  padding: 0.25rem 0.125rem; /* 减少水平内边距 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 图标优化 */
.nav-item .w-7.h-7.mb-1 {
  margin-bottom: 0.125rem; /* 减少图标和文字间距 */
  flex-shrink: 0;
}

/* 超小屏幕图标尺寸调整 */
@media (max-width: 360px) {
  .nav-item .w-7.h-7.mb-1 {
    width: 1.5rem; /* 24px */
    height: 1.5rem; /* 24px */
    margin-bottom: 0.0625rem; /* 进一步减少间距 */
  }
}

/* 底部导航容器高度优化 */
.bottom-navigation .flex.items-center.justify-around {
  height: 5.5rem; /* 88px，确保有足够空间 */
  padding: 0.5rem 0.25rem; /* 调整内边距 */
}
</style>
