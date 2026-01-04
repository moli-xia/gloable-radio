<template>
  <!-- 移动端播放栏 -->
  <div class="player-bar block md:hidden fixed left-0 right-0 z-20 glass-effect border-t border-gray-200 dark:border-dark-gray px-4 py-3" style="bottom: 88px;">
    <div class="flex items-center gap-3">
      <!-- 电台信息 -->
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="flex-shrink-0">
          <img
            v-if="playerStore.currentStation?.favicon"
            :src="playerStore.currentStation.favicon"
            :alt="playerStore.currentStation.name"
            class="w-12 h-12 rounded-ios object-cover cursor-pointer"
            @error="showFallback = true"
            @click="showStationInfo"
            v-show="!showFallback"
          />
          <img
            v-if="!playerStore.currentStation?.favicon || showFallback"
            :src="generatedIconUrl"
            :alt="playerStore.currentStation?.name"
            class="w-12 h-12 rounded-ios object-cover cursor-pointer"
            @click="showStationInfo"
          />
        </div>
        
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-ios-dark-gray dark:text-dark-text truncate text-sm">
            {{ playerStore.currentStation?.name }}
          </h4>
          <p class="text-sm text-ios-gray dark:text-dark-secondary truncate">
            {{ getCountryName(playerStore.currentStation?.countrycode) }}
          </p>
        </div>
      </div>
      
      <!-- 播放控制 -->
      <div class="flex items-center gap-2">
        <!-- 收藏按钮 -->
        <button
          v-if="playerStore.currentStation"
          @click="toggleFavorite"
          class="p-2 rounded-full transition-all active:scale-95"
          :class="[
            playerStore.isFavorite
              ? 'text-ios-red hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-ios-gray dark:text-dark-secondary hover:bg-gray-100 dark:hover:bg-dark-gray'
          ]"
        >
          <HeartIcon 
            class="w-5 h-5" 
            :class="{ 'fill-current': playerStore.isFavorite }"
          />
        </button>
        
        <!-- 播放/暂停按钮 -->
        <button
          @click="togglePlayback"
          :disabled="playerStore.isLoading"
          class="p-3 bg-ios-blue text-white rounded-full hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
        >
          <component
            :is="playButtonIcon"
            class="w-5 h-5"
            :class="{ 'animate-spin': playerStore.isLoading }"
          />
        </button>
        
        <!-- 音量控制 (仅在较大屏幕显示) -->
        <div class="hidden sm:flex items-center gap-2">
          <button
            @click="toggleMute"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-all active:scale-95"
          >
            <component
              :is="volumeIcon"
              class="w-5 h-5 text-ios-gray dark:text-dark-secondary"
            />
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="playerStore.volume"
            @input="setVolume"
            class="w-16 h-1.5 bg-gray-200 dark:bg-dark-gray rounded-full appearance-none cursor-pointer accent-ios-blue"
          />
        </div>
        
        <!-- 关闭按钮 -->
        <button
          @click="closePlayer"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-all active:scale-95"
        >
          <XMarkIcon class="w-5 h-5 text-ios-gray dark:text-dark-secondary" />
        </button>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="playerStore.error" class="mt-2 text-sm text-ios-red">
      {{ playerStore.error }}
    </div>
  </div>
  
  <!-- PC端播放栏 -->
  <div class="player-bar-desktop hidden md:block glass-effect border-t border-gray-200 dark:border-dark-gray" style="position: fixed !important; bottom: 0 !important; left: 0 !important; right: 0 !important; width: 100% !important; z-index: 9999 !important;">
    <div class="max-w-6xl mx-auto px-6 py-4">
      <div class="flex items-center gap-4 w-full">
        <!-- 电台信息 (左侧，固定宽度) -->
        <div class="flex items-center gap-3 min-w-0 w-80 flex-shrink-0">
          <div class="flex-shrink-0">
            <img
              v-if="playerStore.currentStation?.favicon"
              :src="playerStore.currentStation.favicon"
              :alt="playerStore.currentStation.name"
              class="w-12 h-12 rounded-ios object-cover cursor-pointer hover:opacity-80 transition-opacity"
              @error="showFallback = true"
              @click="showStationInfo"
              v-show="!showFallback"
            />
            <img
              v-if="!playerStore.currentStation?.favicon || showFallback"
              :src="generatedIconUrl"
              :alt="playerStore.currentStation?.name"
              class="w-12 h-12 rounded-ios object-cover cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-light-gray transition-colors"
              @click="showStationInfo"
            />
          </div>
          
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-base text-ios-dark-gray dark:text-dark-text truncate">
              {{ playerStore.currentStation?.name }}
            </h4>
            <p class="text-sm text-ios-gray dark:text-dark-secondary truncate">
              {{ getCountryName(playerStore.currentStation?.countrycode) }}
            </p>
          </div>
        </div>
        
        <!-- 播放控制中心 (中间，紧凑布局) -->
        <div class="flex items-center justify-center gap-2 flex-1">
          <!-- 收藏按钮 -->
          <button
            v-if="playerStore.currentStation"
            @click="toggleFavorite"
            class="p-2.5 rounded-full transition-all active:scale-95 hover:bg-gray-100 dark:hover:bg-dark-gray"
            :class="[
              playerStore.isFavorite
                ? 'text-ios-red'
                : 'text-ios-gray dark:text-dark-secondary'
            ]"
          >
            <HeartIcon 
              class="w-5 h-5" 
              :class="{ 'fill-current': playerStore.isFavorite }"
            />
          </button>
          
          <!-- 播放/暂停按钮 -->
          <button
            @click="togglePlayback"
            :disabled="playerStore.isLoading"
            class="p-3 bg-ios-blue text-white rounded-full hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
          >
            <component
              :is="playButtonIcon"
              class="w-6 h-6"
              :class="{ 'animate-spin': playerStore.isLoading }"
            />
          </button>
          
          <!-- 信息按钮 -->
          <button
            v-if="playerStore.currentStation"
            @click="showStationInfo"
            class="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-all active:scale-95"
          >
            <InformationCircleIcon class="w-5 h-5 text-ios-gray dark:text-dark-secondary" />
          </button>
        </div>
        
        <!-- 音量控制和关闭 (右侧，固定宽度) -->
        <div class="flex items-center gap-2 w-80 justify-end flex-shrink-0">
          <!-- 音量控制 -->
          <div class="flex items-center gap-2">
            <button
              @click="toggleMute"
              class="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-all active:scale-95"
            >
              <component
                :is="volumeIcon"
                class="w-5 h-5 text-ios-gray dark:text-dark-secondary"
              />
            </button>
            
            <div class="flex items-center gap-2">
              <span class="text-xs text-ios-gray dark:text-dark-secondary w-8 text-center">{{ Math.round(playerStore.volume * 100) }}%</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                :value="playerStore.volume"
                @input="setVolume"
                class="w-20 h-1.5 bg-gray-200 dark:bg-dark-gray rounded-full appearance-none cursor-pointer accent-ios-blue"
              />
            </div>
          </div>
          
          <!-- 关闭按钮 -->
          <button
            @click="closePlayer"
            class="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-all active:scale-95 ml-2"
          >
            <XMarkIcon class="w-5 h-5 text-ios-gray dark:text-dark-secondary" />
          </button>
        </div>
      </div>
      
      <!-- 错误提示 -->
      <div v-if="playerStore.error" class="mt-3 text-sm text-ios-red">
        {{ playerStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePlayerStore } from '@/stores/player'
import { generateIconDataUrl } from '@/utils/iconGenerator'
import { getLocalizedCountryName } from '@/utils/countryTranslation'

import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ArrowPathIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const playerStore = usePlayerStore()
const showFallback = ref(false)

watch(() => playerStore.currentStation?.stationuuid, () => {
  showFallback.value = false
})

// 获取本地化的国家名称
const getCountryName = (countryCode?: string): string => {
  if (!countryCode) return ''
  return getLocalizedCountryName(countryCode)
}

const playButtonIcon = computed(() => {
  if (playerStore.isLoading) {
    return ArrowPathIcon
  }
  return playerStore.isPlaying ? PauseIcon : PlayIcon
})

const volumeIcon = computed(() => {
  return playerStore.isMuted || playerStore.volume === 0 ? SpeakerXMarkIcon : SpeakerWaveIcon
})

const generatedIconUrl = computed(() => {
  return playerStore.currentStation ? generateIconDataUrl(playerStore.currentStation.name) : ''
})

const togglePlayback = () => {
  if (playerStore.isPlaying) {
    playerStore.pauseStation()
  } else {
    playerStore.resumeStation()
  }
}

const toggleFavorite = () => {
  if (playerStore.currentStation) {
    playerStore.toggleFavorite(playerStore.currentStation)
  }
}

const toggleMute = () => {
  playerStore.toggleMute()
}

const setVolume = (event: Event) => {
  const target = event.target as HTMLInputElement
  playerStore.setVolume(parseFloat(target.value))
}

const showStationInfo = () => {
  if (playerStore.currentStation) {
    router.push(`/station/${playerStore.currentStation.stationuuid}`)
  }
}

const closePlayer = () => {
  playerStore.stopStation()
}
</script>

<style scoped>
/* 自定义滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #007AFF;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #0056b3;
}

input[type="range"]::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #007AFF;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb:hover {
  background: #0056b3;
}

/* PC端播放栏样式优化 */
.player-bar-desktop .container-responsive {
  max-width: 1280px;
}
</style>
