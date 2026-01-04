<template>
  <div class="station-card ios-card p-3 hover:shadow-ios-lg dark:hover:shadow-dark-ios-lg transition-all cursor-pointer"
       @click="goToDetail">
    <!-- 主要内容 -->
    <div class="flex items-center gap-3">
      <!-- 电台图标 -->
      <div class="flex-shrink-0 relative">
        <img
          v-if="station.favicon"
          :src="station.favicon"
          :alt="station.name"
          class="w-12 h-12 rounded-lg object-cover shadow-sm"
          @error="showFallback = true"
          v-show="!showFallback"
        />
        <img
          v-if="!station.favicon || showFallback"
          :src="generatedIconUrl"
          :alt="station.name"
          class="w-12 h-12 rounded-lg object-cover shadow-sm"
        />
        
        <!-- 播放状态指示器 -->
        <div
          v-if="isCurrentStation && playerStore.isPlaying"
          class="absolute -bottom-1 -right-1 w-4 h-4 bg-ios-blue rounded-full flex items-center justify-center shadow-lg"
        >
          <div class="w-2 h-2 bg-white rounded-full playing-animation"></div>
        </div>
      </div>
      
      <!-- 电台信息 -->
      <div class="flex-1 min-w-0">
        <!-- 电台名称 -->
        <div ref="containerRef" class="station-name-container mb-1 max-w-full">
          <h3 
            ref="stationNameRef"
            class="station-name font-semibold text-base leading-tight text-ios-dark-gray dark:text-white"
          >
            {{ station.name }}
          </h3>
        </div>
        
        <!-- 国家和技术信息 -->
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-ios-gray dark:text-dark-secondary truncate">
            {{ getCountryName(station.countrycode) }}
          </span>
          
          <!-- 技术信息标签已移除 -->
        </div>
      </div>
      
      <!-- 操作按钮区域 -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <!-- 分享按钮 (仅在非历史记录变体中显示) -->
        <button
          v-if="variant !== 'history'"
          @click.stop="handleShare"
          class="p-2 rounded-lg transition-all active:scale-95 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-ios-blue dark:hover:text-ios-blue"
        >
          <ShareIcon class="w-5 h-5" />
        </button>

        <!-- 收藏按钮 -->
        <button
          @click.stop="handleFavorite"
          class="p-2 rounded-lg transition-all active:scale-95 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{ 'text-ios-red dark:text-ios-red': isFavorited }"
          :title="languageStore.t('player.favoriteToggle') || '收藏/取消收藏'"
        >
          <component :is="isFavorited ? SolidHeartIcon : HeartIcon" class="w-5 h-5" />
        </button>

        <!-- 移除按钮 (历史记录变体) -->
        <button
          v-if="variant === 'history'"
          @click.stop="handleRemove"
          class="p-2 rounded-lg transition-all active:scale-95 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
          :title="languageStore.t('player.removeRecord') || '移除记录'"
        >
          <XMarkIcon class="w-4 h-4" />
        </button>
        
        <!-- 播放按钮 -->
        <button
          @click.stop="handlePlay"
          :disabled="isLoading"
          class="p-2 rounded-lg transition-all active:scale-95"
          :class="[
            isCurrentStation && playerStore.isPlaying
              ? 'bg-ios-blue text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ]"
        >
          <component
            :is="playButtonIcon"
            class="w-5 h-5"
            :class="{ 'animate-spin': isLoading }"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { useLanguageStore } from '@/stores/language'
import type { RadioStation } from '@/types/radio'
import { generateIconDataUrl } from '@/utils/iconGenerator'
import { getLocalizedCountryName } from '@/utils/countryTranslation'

import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  HeartIcon,
  XMarkIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'
import { HeartIcon as SolidHeartIcon } from '@heroicons/vue/24/solid'

interface Props {
  station: RadioStation
  variant?: 'favorite' | 'history'
  historyTimestamp?: number
}

interface Emits {
  (e: 'play', station: RadioStation): void
  (e: 'favorite', station: RadioStation): void
  (e: 'share', station: RadioStation): void
  (e: 'remove', timestamp: number): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'favorite'
})
const emit = defineEmits<Emits>()

const router = useRouter()
const playerStore = usePlayerStore()
const languageStore = useLanguageStore()
const showFallback = ref(false)
const stationNameRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
let animationCycleId: number = 0 // Used to invalidate old animation cycles

const isFavorited = computed(() => {
  return playerStore.isStationFavorite(props.station.stationuuid)
})

const getCountryName = (countryCode?: string) => {
  if (!countryCode) return languageStore.t('common.unknown') || '未知'
  return getLocalizedCountryName(countryCode)
}

const isCurrentStation = computed(() => {
  return playerStore.currentStation?.stationuuid === props.station.stationuuid
})

const isLoading = computed(() => {
  return isCurrentStation.value && playerStore.isLoading
})

const playButtonIcon = computed(() => {
  if (isLoading.value) {
    return ArrowPathIcon
  }
  if (isCurrentStation.value && playerStore.isPlaying) {
    return PauseIcon
  }
  return PlayIcon
})

const generatedIconUrl = computed(() => {
  return generateIconDataUrl(props.station.name)
})

const handlePlay = () => {
  if (isCurrentStation.value && playerStore.isPlaying) {
    playerStore.pauseStation()
  } else {
    emit('play', props.station)
  }
}

const handleFavorite = () => {
  emit('favorite', props.station)
}

const handleShare = () => {
  emit('share', props.station)
}

const handleRemove = () => {
  if (props.historyTimestamp) {
    emit('remove', props.historyTimestamp)
  }
}

const cleanupAnimation = () => {
  animationCycleId++ // Invalidate any running timers
  const text = stationNameRef.value
  if (text) {
    text.classList.remove('is-scrolling')
    text.removeEventListener('animationend', handleAnimationEnd)
  }
}

const handleAnimationEnd = () => {
  // This function is now part of the cycle managed by startAnimationCycle
}

const startAnimationCycle = (id: number) => {
  const text = stationNameRef.value
  if (!text) return

  const onEnd = () => {
    if (animationCycleId !== id) return // Cycle has been cancelled
    
    // Pause at the end for 3 seconds
    setTimeout(() => {
      if (animationCycleId !== id) return
      
      text.classList.remove('is-scrolling')
      // Restart the cycle after removing the class to reset position
      setTimeout(() => startAnimationCycle(id), 50)
    }, 3000)
  }

  // Initial 2-second pause before starting to scroll
  setTimeout(() => {
    if (animationCycleId !== id) return
    
    text.addEventListener('animationend', onEnd, { once: true })
    text.classList.add('is-scrolling')
  }, 2000)
}

const checkTextOverflow = async () => {
  cleanupAnimation()
  
  await nextTick()
  // A short delay to ensure DOM is ready on all devices
  setTimeout(() => {
    const container = containerRef.value
    const text = stationNameRef.value

    if (container && text) {
      const overflow = text.scrollWidth - container.clientWidth
      if (overflow > 1) {
        text.style.setProperty('--scroll-amount', `-${overflow}px`)
        
        const scrollSpeed = 50 // pixels per second
        const duration = overflow / scrollSpeed
        text.style.setProperty('--animation-duration', `${duration}s`)
        
        startAnimationCycle(animationCycleId)
      }
    }
  }, 100)
}

const goToDetail = () => {
  router.push(`/station/${props.station.stationuuid}`)
}

onMounted(() => {
  checkTextOverflow()
})

watch(() => props.station, () => {
  checkTextOverflow()
}, { deep: true, immediate: true })

onUnmounted(() => {
  cleanupAnimation()
})
</script>

<style scoped>
.station-name-container {
  overflow: hidden;
  width: 100%;
}

.station-name {
  display: inline-block;
  white-space: nowrap;
  transform: translateX(0);
  /* Use transition for smooth scrolling */
  /* transition: transform var(--animation-duration, 1s) linear; */
  /* Using animation for event listening */
  animation: none;
}

.station-name.is-scrolling {
  /* Use animation to be able to listen for animationend event */
  animation: scroll-to-end var(--animation-duration, 1s) linear forwards;
}

@keyframes scroll-to-end {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(var(--scroll-amount, 0px));
  }
}

/* Playing animation */
.playing-animation {
  animation: pulse 1.5s ease-in-out infinite alternate;
}

@keyframes pulse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
}
</style>
