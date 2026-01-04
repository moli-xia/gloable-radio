<template>
  <div class="settings-page">
    <!-- 移动端标题栏 -->
    <header class="mobile:block desktop:hidden sticky top-0 z-10 glass-effect border-b border-gray-200 dark:border-dark-gray px-4 py-3">
      <div class="flex items-start justify-between min-h-[44px]">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-ios-dark-gray dark:text-dark-text leading-tight max-w-[65%] break-words hyphens-auto flex-shrink-1 whitespace-normal">{{ t('nav.settings') }}</h1>
      </div>
    </header>
    
    <!-- PC端标题栏 -->
    <div class="mobile:hidden desktop:block px-6 py-4 border-b border-gray-200 dark:border-dark-gray">
      <h1 class="text-3xl font-bold text-ios-dark-gray dark:text-dark-text">{{ t('settings.appSettings') }}</h1>
    </div>

    <div class="container-responsive py-6 space-y-6">
      <!-- 主题设置 -->
      <section class="ios-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text">{{ t('settings.themeMode') }}</h2>
            <p class="text-sm text-ios-gray dark:text-dark-secondary mt-1">{{ t('settings.switchTheme') }}</p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      <section class="ios-card p-4">
        <h2 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text mb-4">{{ t('settings.audioSettings') }}</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-ios-gray dark:text-dark-secondary mb-2">{{ t('settings.volume') }}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              :value="playerStore.volume"
              @input="setVolume"
              class="w-full accent-ios-blue"
            />
            <div class="flex justify-between text-xs text-ios-gray dark:text-dark-secondary mt-1">
              <span>{{ t('settings.mute') }}</span>
              <span>{{ Math.round(playerStore.volume * 100) }}%</span>
              <span>{{ t('settings.max') }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 睡眠定时器 -->
      <section class="ios-card p-4">
        <h2 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text mb-4">{{ t('settings.sleepTimer') }}</h2>
        
        <div class="space-y-4">
          <!-- 当前状态 -->
          <div v-if="playerStore.hasSleepTimer" class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-blue-700 dark:text-blue-300">{{ t('settings.timerActive') }}</p>
                <p class="text-xs text-blue-600 dark:text-blue-400">{{ t('settings.remaining') }} {{ playerStore.sleepTimerRemaining }} {{ t('settings.minutes') }}{{ t('settings.afterAutoStop') }}</p>
              </div>
              <button
                @click="clearSleepTimer"
                class="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
              >
                {{ t('settings.cancel') }}
              </button>
            </div>
          </div>
          
          <!-- 设置选项 -->
          <div v-else>
    
            
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="time in sleepTimerOptions"
                :key="time.value"
                @click="setSleepTimer(time.value)"
                class="p-3 rounded-lg border border-gray-200 dark:border-dark-gray text-center hover:bg-ios-light-gray dark:hover:bg-dark-gray transition-colors"
              >
                <div class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text">{{ time.value }}</div>
                <div class="text-xs text-ios-gray dark:text-dark-secondary">{{ time.label }}</div>
              </button>
            </div>
            
            <!-- 自定义时间 -->
            <div class="mt-4">
              <label class="block text-sm font-medium text-ios-gray dark:text-dark-secondary mb-2">{{ t('settings.customTime') }}（{{ t('settings.minutes') }}）</label>
              <div class="flex gap-2">
                <input
                  v-model.number="customMinutes"
                  type="number"
                  min="1"
                  max="480"
                  :placeholder="t('settings.enterMinutes')"
                  class="flex-1 px-3 py-2 border border-gray-200 dark:border-dark-gray rounded-lg bg-white dark:bg-dark-card text-ios-dark-gray dark:text-dark-text"
                />
                                  <button
                    @click="setSleepTimer(customMinutes)"
                    :disabled="!customMinutes || customMinutes < 1"
                    class="px-4 py-2 bg-ios-blue text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ t('settings.setTimer') }}
                  </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 权限管理说明 -->
      <section class="ios-card p-4">
        <h2 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text mb-4">{{ t('settings.permissionManagement') }}</h2>
        
        <div class="space-y-3">
          <div class="p-3 bg-gray-50 dark:bg-dark-gray rounded-lg">
            <div class="flex items-start gap-3">
              <InformationCircleIcon class="w-5 h-5 text-ios-blue flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm text-ios-dark-gray dark:text-dark-text">{{ t('settings.permissionInfo') }}</p>
                <p class="text-xs text-ios-gray dark:text-dark-secondary mt-1">{{ t('settings.permissionHint') }}</p>
              </div>
            </div>
          </div>
          
          <!-- 电量优化提示 -->
          <div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p class="text-sm font-medium text-orange-700 dark:text-orange-300">{{ t('settings.batteryOptimization') }}</p>
                <p class="text-xs text-orange-600 dark:text-orange-400 mt-1">{{ t('settings.batteryOptimizationHint') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="ios-card p-4">
        <h2 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text mb-4">{{ t('settings.aboutApp') }}</h2>
        
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-ios-gray dark:text-dark-secondary">{{ t('settings.version') }}</span>
            <span class="text-ios-dark-gray dark:text-dark-text">1.0.0</span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-ios-gray dark:text-dark-secondary">{{ t('settings.deviceType') }}</span>
            <span class="text-ios-dark-gray dark:text-dark-text">{{ deviceType }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useLanguageStore } from '@/stores/language'
import { useToastStore } from '@/stores/toast'
// MediaControl插件已移除
import ThemeToggle from '@/components/ThemeToggle.vue'
import { 
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'

const playerStore = usePlayerStore()
const { t } = useLanguageStore()
const toastStore = useToastStore()

const customMinutes = ref<number>(30)

// 权限相关变量已移除

const sleepTimerOptions = computed(() => [
  { value: 15, label: t('settings.minutes') },
  { value: 30, label: t('settings.minutes') },
  { value: 45, label: t('settings.minutes') },
  { value: 60, label: t('settings.hours') },
  { value: 90, label: t('settings.minutes') },
  { value: 120, label: t('settings.hours') }
])

const setVolume = (event: Event) => {
  const target = event.target as HTMLInputElement
  playerStore.setVolume(parseFloat(target.value))
}

const setSleepTimer = (minutes: number) => {
  if (minutes > 0) {
    playerStore.setSleepTimer(minutes)
    const timeText = formatTimeText(minutes)
    const message = t('settings.timerSetSuccess').replace('{time}', timeText)
    toastStore.showSuccess(message)
  }
}

const formatTimeText = (minutes: number): string => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes > 0) {
      return `${hours}${t('settings.hour')}${remainingMinutes}${t('settings.minute')}`
    } else {
      return `${hours}${t('settings.hour')}`
    }
  } else {
    return `${minutes}${t('settings.minute')}`
  }
}

const clearSleepTimer = () => {
  playerStore.clearSleepTimer()
  toastStore.showInfo(t('settings.timerCancelled'))
}

const deviceType = computed(() => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth
    if (width >= 1280) return t('settings.desktop')
    if (width >= 768) return t('settings.tablet')
    return t('settings.mobile')
  }
  return t('settings.unknown')
})



// 权限检查相关函数已移除

onMounted(() => {
  // 设置页面初始化完成
})
</script>
