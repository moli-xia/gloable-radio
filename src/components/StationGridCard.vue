<template>
  <div class="station-grid-card ios-card p-4 hover:shadow-ios-lg dark:hover:shadow-dark-ios-lg transition-all">
    <router-link :to="`/station/${station.stationuuid}`" class="block text-center">
      <!-- 电台名称在最顶层，支持滚动 -->
      <div class="mb-3">
        <div ref="containerRef" class="station-name-container overflow-hidden text-center">
          <h3 
            ref="stationNameRef"
            class="station-name font-medium text-ios-dark-gray dark:text-white whitespace-nowrap"
            :class="{ 'animate-scroll': shouldScroll }"
          >
            {{ station.name }}
          </h3>
        </div>
      </div>
      
      <div class="text-center">
        <!-- 电台图标 -->
        <div class="relative mx-auto mb-3 w-16 h-16">
          <img
            v-if="station.favicon"
            :src="station.favicon"
            :alt="station.name"
            class="w-full h-full rounded-ios object-cover"
            @error="showFallback = true"
            v-show="!showFallback"
          />
          <img
            v-if="!station.favicon || showFallback"
            :src="generatedIconUrl"
            :alt="station.name"
            class="w-full h-full rounded-ios object-cover"
          />
          
          <!-- 播放状态指示器 -->
          <div
            v-if="isCurrentStation && playerStore.isPlaying"
            class="absolute -bottom-1 -right-1 w-5 h-5 bg-ios-blue rounded-full flex items-center justify-center"
          >
            <div class="w-2.5 h-2.5 bg-white rounded-full playing-animation"></div>
          </div>
        </div>
        
        <!-- 电台信息 -->
        <div class="mb-4">
          <p class="text-sm text-ios-gray dark:text-dark-secondary truncate">{{ getCountryName(station.country) }}</p>
          
          <!-- 流媒体格式标签已移除 -->
        </div>
      </div>
    </router-link>
    <!-- 操作按钮 -->
    <div class="flex justify-center gap-2">
      <!-- 收藏按钮 -->
      <button
        @click="toggleFavorite"
        class="p-2 rounded-full transition-all active:scale-95"
        :class="[
          isFavorite
            ? 'text-ios-red hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'text-ios-gray dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-gray'
        ]"
      >
        <HeartIcon 
          class="w-5 h-5" 
          :class="{ 'fill-current': isFavorite }"
        />
      </button>
      
      <!-- 播放按钮 -->
      <button
        @click="handlePlay"
        :disabled="isLoading"
        class="p-3 rounded-full transition-all active:scale-95"
        :class="[
          isCurrentStation && playerStore.isPlaying
            ? 'bg-ios-blue text-white'
            : 'bg-ios-light-gray dark:bg-dark-gray text-ios-dark-gray dark:text-dark-text hover:bg-gray-200 dark:hover:bg-dark-light-gray'
        ]"
      >
        <component
          :is="playButtonIcon"
          class="w-5 h-5"
          :class="{ 'animate-spin': isLoading }"
        />
      </button>
      
      <!-- 分享按钮 -->
      <button
        @click="shareStation"
        class="p-2 rounded-full transition-all active:scale-95 text-ios-gray dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-gray"
        :title="languageStore.t('player.share')"
      >
        <ShareIcon class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useLanguageStore } from '@/stores/language'
import type { RadioStation } from '@/types/radio'
import { generateIconDataUrl } from '@/utils/iconGenerator'
import { getLocalizedCountryName } from '@/utils/countryTranslation'

import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ArrowPathIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'

interface Props {
  station: RadioStation
}

interface Emits {
  play: [station: RadioStation]
  favorite: [station: RadioStation]
  share: [station: RadioStation]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const playerStore = usePlayerStore()
const languageStore = useLanguageStore()
const showFallback = ref(false)
const shouldScroll = ref(false)
const stationNameRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

// 获取本地化的国家名称
const getCountryName = (country: string): string => {
  if (!country) return languageStore.t('common.unknown') || '未知'
  return getLocalizedCountryName(country)
}

const isCurrentStation = computed(() => {
  return playerStore.currentStation?.stationuuid === props.station.stationuuid
})

const isLoading = computed(() => {
  return isCurrentStation.value && playerStore.isLoading
})

const isFavorite = computed(() => {
  return playerStore.favorites.some(fav => fav.stationuuid === props.station.stationuuid)
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

const toggleFavorite = () => {
  emit('favorite', props.station)
}

const shareStation = () => {
  emit('share', props.station)
}

const checkTextOverflow = async () => {
  await nextTick()
  
  if (containerRef.value && stationNameRef.value) {
    const containerWidth = containerRef.value.clientWidth
    const textWidth = stationNameRef.value.scrollWidth
    shouldScroll.value = textWidth > containerWidth
  }
}

onMounted(() => {
  checkTextOverflow()
})
</script>

<style scoped>
.station-name-container {
  position: relative;
  width: 100%;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.station-name {
  display: inline-block;
  min-width: max-content;
  transition: transform 0.3s ease;
}

.station-name.animate-scroll {
  animation: scrollTextGrid 10s linear infinite;
}

.station-name-container:hover .station-name.animate-scroll {
  animation-play-state: running;
}

@keyframes scrollTextGrid {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(0);
  }
  75% {
    transform: translateX(calc(-100% + 12rem));
  }
  100% {
    transform: translateX(calc(-100% + 12rem));
  }
}

/* PC网格卡片的播放动画 */
.playing-animation {
  animation: pulse 1s ease-in-out infinite alternate;
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
