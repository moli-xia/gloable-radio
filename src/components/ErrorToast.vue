<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showError"
        class="fixed top-4 left-4 right-4 z-50 mx-auto max-w-sm"
      >
        <div class="bg-ios-red text-white px-4 py-3 rounded-ios shadow-ios-lg flex items-center gap-3">
          <ExclamationTriangleIcon class="w-5 h-5 flex-shrink-0" />
          <div class="flex-1">
            <p class="text-sm font-medium">{{ currentError }}</p>
          </div>
          <button
            @click="dismissError"
            class="p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useRadioStore } from '@/stores/radio'

import {
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const playerStore = usePlayerStore()
const radioStore = useRadioStore()

const showError = ref(false)
const currentError = ref('')
const errorTimeout = ref<NodeJS.Timeout | null>(null)

const anyError = computed(() => {
  return playerStore.error || radioStore.error
})

const displayError = (error: string) => {
  currentError.value = error
  showError.value = true
  
  // 清除之前的定时器
  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value)
  }
  
  // 5秒后自动隐藏
  errorTimeout.value = setTimeout(() => {
    dismissError()
  }, 5000)
}

const dismissError = () => {
  showError.value = false
  
  // 清除对应的错误状态
  if (currentError.value === playerStore.error) {
    playerStore.clearError()
  }
  if (currentError.value === radioStore.error) {
    radioStore.clearError()
  }
  
  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value)
    errorTimeout.value = null
  }
}

// 监听错误变化
watch(anyError, (newError) => {
  if (newError && !showError.value) {
    displayError(newError)
  }
})
</script>