import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark'

export const useThemeStore = defineStore('theme', () => {
  // 主题模式状态
  const mode = ref<ThemeMode>('light')

  // 计算当前是否应该使用暗色主题
  const shouldUseDark = computed(() => {
    return mode.value === 'dark'
  })

  // 应用主题到DOM
  const applyTheme = (dark: boolean) => {
    if (typeof document !== 'undefined') {
      const appElement = document.getElementById('app')
      if (dark) {
        document.documentElement.classList.add('dark')
        if (appElement) {
          appElement.style.backgroundColor = '#000000'
          appElement.style.color = '#FFFFFF'
        }
      } else {
        document.documentElement.classList.remove('dark')
        if (appElement) {
          appElement.style.backgroundColor = '#F2F2F7'
          appElement.style.color = '#1C1C1E'
        }
      }
    }
  }

  // 初始化主题
  const initTheme = () => {
    // 从localStorage读取保存的主题设置
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode
    if (savedMode && ['light', 'dark'].includes(savedMode)) {
      mode.value = savedMode
    }

    // 应用初始主题
    applyTheme(shouldUseDark.value)
  }

  // 设置主题模式
  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    localStorage.setItem('theme-mode', newMode)
  }

  // 切换主题模式
  const toggleMode = () => {
    const newMode = mode.value === 'light' ? 'dark' : 'light'
    setMode(newMode)
  }

  // 监听主题变化并应用
  watch(shouldUseDark, (dark) => {
    applyTheme(dark)
  }, { immediate: true })

  return {
    mode,
    shouldUseDark,
    initTheme,
    setMode,
    toggleMode
  }
})