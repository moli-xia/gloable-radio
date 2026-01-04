<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-dark-card rounded-xl max-w-sm w-full p-6 shadow-xl">
      <div class="text-center mb-6">
        <h3 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text">
          {{ t('share.title') }}
        </h3>
        <p class="text-sm text-ios-gray dark:text-dark-secondary mt-2">
          {{ station?.name }}
        </p>
      </div>

      <div class="space-y-4">
        <!-- 复制链接按钮 -->
        <button
          @click="copyLink"
          class="w-full flex items-center justify-center gap-3 p-4 bg-ios-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <DocumentDuplicateIcon class="w-5 h-5" />
          <span>{{ t('share.copyLink') }}</span>
        </button>
      </div>

      <!-- 关闭按钮 -->
      <button
        @click="$emit('close')"
        class="w-full mt-6 p-3 border border-ios-light-gray dark:border-dark-border rounded-lg text-ios-gray dark:text-dark-secondary hover:bg-gray-50 dark:hover:bg-dark-gray transition-colors"
      >
        {{ t('common.cancel') }}
      </button>

      <!-- 成功提示 -->
      <div v-if="copySuccess" class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-60">
        {{ t('share.linkCopied') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'
import type { RadioStation } from '@/types/radio'
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'

interface Props {
  visible: boolean
  station: RadioStation | null
}

interface Emits {
  close: []
}

const props = defineProps<Props>()
defineEmits<Emits>()

const languageStore = useLanguageStore()
const { t } = languageStore
const copySuccess = ref(false)

const copyLink = async () => {
  if (!props.station) return

  const shareUrl = `https://radio.aabb.live/station/${props.station.stationuuid}`
  
  try {
    await navigator.clipboard.writeText(shareUrl)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error(t('share.copyFailed'), error)
    // 降级方案：创建临时文本框
    const textArea = document.createElement('textarea')
    textArea.value = shareUrl
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
}
</script>