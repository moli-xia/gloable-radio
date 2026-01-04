<template>
  <button
    @click="themeStore.toggleMode()"
    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-colors"
    :title="`当前: ${currentModeText}, 点击切换到${nextModeText}`"
  >
    <component :is="themeIcon" class="w-5 h-5 text-ios-gray dark:text-dark-secondary" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import {
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'

const themeStore = useThemeStore()

const themeIcon = computed(() => {
  return themeStore.mode === 'light' ? SunIcon : MoonIcon
})

const currentModeText = computed(() => {
  return themeStore.mode === 'light' ? '明亮模式' : '暗色模式'
})

const nextModeText = computed(() => {
  return themeStore.mode === 'light' ? '暗色模式' : '明亮模式'
})
</script>