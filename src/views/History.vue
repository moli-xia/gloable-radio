<template>
  <div class="min-h-screen bg-ios-light-gray dark:bg-dark-bg pb-20">
    <!-- 移动端标题栏 -->
    <div class="mobile:block desktop:hidden sticky top-0 z-10 glass-effect border-b border-gray-200 dark:border-dark-gray px-4 py-3">
      <div class="flex items-start justify-between min-h-[44px]">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-ios-dark-gray dark:text-dark-text leading-tight max-w-[65%] break-words hyphens-auto flex-shrink-1 whitespace-normal">{{ t('nav.history') }}</h1>
        <div class="flex items-center gap-3">
          <!-- 视图模式切换 -->
          <div v-if="historyStore.history.length > 0" class="flex items-center bg-gray-100 dark:bg-dark-gray rounded-ios p-0.5">
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-1.5 rounded-md transition-all',
                viewMode === 'list' 
                  ? 'bg-white dark:bg-dark-surface text-ios-blue shadow-sm' 
                  : 'text-ios-gray dark:text-dark-secondary hover:text-ios-dark-gray dark:hover:text-dark-text'
              ]"
            >
              <Bars3Icon class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-1.5 rounded-md transition-all',
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-dark-surface text-ios-blue shadow-sm' 
                  : 'text-ios-gray dark:text-dark-secondary hover:text-ios-dark-gray dark:hover:text-dark-text'
              ]"
            >
              <Squares2X2Icon class="w-4 h-4" />
            </button>
          </div>
          <ThemeToggle />
          <button
            v-if="historyStore.history.length > 0"
            @click="showClearConfirm = true"
            class="text-ios-red text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-ios transition-colors"
          >
            {{ t('history.clearAll') }}
          </button>
        </div>
      </div>
    </div>

    <!-- PC端标题栏 -->
    <div class="mobile:hidden desktop:block px-6 py-4 border-b border-gray-200 dark:border-dark-gray">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-ios-dark-gray dark:text-dark-text">{{ t('history.title') }}</h1>
        <div class="flex items-center gap-3">
          <!-- 视图模式切换 -->
          <div v-if="historyStore.history.length > 0" class="flex items-center bg-gray-100 dark:bg-dark-gray rounded-ios p-0.5">
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-md transition-all',
                viewMode === 'list' 
                  ? 'bg-white dark:bg-dark-surface text-ios-blue shadow-sm' 
                  : 'text-ios-gray dark:text-dark-secondary hover:text-ios-dark-gray dark:hover:text-dark-text'
              ]"
            >
              <Bars3Icon class="w-5 h-5" />
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-md transition-all',
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-dark-surface text-ios-blue shadow-sm' 
                  : 'text-ios-gray dark:text-dark-secondary hover:text-ios-dark-gray dark:hover:text-dark-text'
              ]"
            >
              <Squares2X2Icon class="w-5 h-5" />
            </button>
          </div>
          <button
            v-if="historyStore.history.length > 0"
            @click="showClearConfirm = true"
            class="text-ios-red text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-ios transition-colors"
          >
            {{ t('history.clearAll') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div v-if="historyStore.history.length > 0" class="container-responsive p-4">
      <!-- 历史记录列表 -->
      <div v-for="[date, group] in groupedHistory" :key="date" class="mb-6">
        <!-- 日期标题 -->
        <div class="px-4 py-2 sticky top-16 mobile:top-[61px] bg-ios-light-gray/80 dark:bg-dark-bg/80 backdrop-blur-sm z-5">
          <h2 class="text-sm font-semibold text-ios-gray dark:text-dark-secondary uppercase tracking-wide">
            {{ formatDate(date) }}
          </h2>
        </div>

        <!-- 电台列表容器 -->
        <div :class="[
          viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
        ]">
          <!-- 列表视图 -->
          <template v-if="viewMode === 'list'">
            <StationCard
              v-for="item in group"
              :key="`list-${item.station.stationuuid}-${item.timestamp}`"
              :station="item.station"
              :history-timestamp="item.timestamp"
              variant="history"
              @play="playStation"
              @favorite="toggleFavorite"
              @remove="removeFromHistory"
            />
          </template>

          <!-- 网格视图 -->
          <template v-else>
            <StationGridCard
              v-for="item in group"
              :key="`grid-${item.station.stationuuid}-${item.timestamp}`"
              :station="convertToRadioStation(item.station)"
              @play="playStation"
            />
          </template>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div class="text-center">
        <ClockIcon class="w-16 h-16 text-ios-light-gray dark:text-dark-secondary mx-auto mb-4" />
        <h3 class="text-lg font-medium text-ios-dark-gray dark:text-dark-text mb-2">{{ t('history.empty') }}</h3>
        <p class="text-ios-gray dark:text-dark-secondary mb-6">{{ t('history.emptyHint') }}</p>
        <div class="space-y-3">
          <router-link
            to="/"
            class="ios-button bg-ios-blue text-white px-6 py-3 rounded-ios font-medium inline-block"
          >
            {{ t('history.exploreStations') }}
          </router-link>
          <router-link
            to="/search"
            class="ios-button bg-white dark:bg-dark-surface text-ios-blue dark:text-ios-blue border border-ios-blue dark:border-ios-blue px-6 py-3 rounded-ios font-medium inline-block ml-3"
          >
            {{ t('history.searchStations') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 清空确认对话框 -->
    <div
      v-if="showClearConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="showClearConfirm = false"
    >
      <div
        class="bg-white dark:bg-dark-surface rounded-ios p-6 mx-4 max-w-sm w-full"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text mb-2">{{ t('history.clearConfirmTitle') }}</h3>
        <p class="text-ios-gray dark:text-dark-secondary mb-6">{{ t('history.clearConfirmMessage') }}</p>
        <div class="flex gap-3">
          <button
            @click="showClearConfirm = false"
            class="flex-1 ios-button bg-gray-100 dark:bg-dark-gray text-ios-dark-gray dark:text-dark-text py-3 rounded-ios font-medium"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            @click="confirmClearHistory"
            class="flex-1 ios-button bg-ios-red text-white py-3 rounded-ios font-medium"
          >
            {{ t('history.clearAll') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ClockIcon,
  Bars3Icon,
  Squares2X2Icon
} from '@heroicons/vue/24/outline'
import ThemeToggle from '@/components/ThemeToggle.vue'
import StationGridCard from '@/components/StationGridCard.vue'
import StationCard from '@/components/StationCard.vue'
import { useHistoryStore } from '@/stores/history'
import { usePlayerStore } from '@/stores/player'
import { useToastStore } from '@/stores/toast'
import { useLanguageStore } from '@/stores/language'
import type { HistoryItem, RadioStation } from '@/types/radio'

const historyStore = useHistoryStore()
const playerStore = usePlayerStore()
const toastStore = useToastStore()
const languageStore = useLanguageStore()
const { t } = languageStore

const showClearConfirm = ref(false)
const viewMode = ref<'list' | 'grid'>('list')

const groupedHistory = computed(() => {
  const groups = new Map<string, HistoryItem[]>()
  for (const item of historyStore.history) {
    const date = new Date(item.timestamp).toDateString()
    if (!groups.has(date)) {
      groups.set(date, [])
    }
    groups.get(date)!.push(item)
  }
  return Array.from(groups.entries())
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return t('history.today')
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return t('history.yesterday')
  }
  return date.toLocaleDateString(languageStore.currentLanguage, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const playStation = async (station: RadioStation) => {
  await playerStore.playStation(station)
}

const toggleFavorite = (station: RadioStation) => {
  playerStore.toggleFavorite(station)
}

const removeFromHistory = (timestamp: number) => {
  historyStore.removeFromHistory(timestamp)
}

const confirmClearHistory = () => {
  historyStore.clearHistory()
  showClearConfirm.value = false
  toastStore.showSuccess(t('favorites.clearConfirmTitle'))
}

const convertToRadioStation = (stationData: any): RadioStation => {
  // 确保所有需要的字段都存在
  return {
    stationuuid: stationData.stationuuid,
    serveruuid: stationData.serveruuid || '',
    name: stationData.name,
    url: stationData.url || '',
    url_resolved: stationData.url_resolved || '',
    homepage: stationData.homepage || '',
    favicon: stationData.favicon || '',
    tags: stationData.tags || '',
    country: stationData.country || '',
    countrycode: stationData.countrycode || '',
    iso_3166_2: stationData.iso_3166_2 || null,
    state: stationData.state || '',
    language: stationData.language || '',
    languagecodes: stationData.languagecodes || '',
    votes: stationData.votes || 0,
    lastchangetime: stationData.lastchangetime || '',
    lastchangetime_iso8601: stationData.lastchangetime_iso8601 || null,
    codec: stationData.codec || '',
    bitrate: stationData.bitrate || 0,
    hls: stationData.hls || 0,
    lastcheckok: stationData.lastcheckok || 0,
    lastchecktime: stationData.lastchecktime || '',
    lastchecktime_iso8601: stationData.lastchecktime_iso8601 || null,
    lastcheckoktime: stationData.lastcheckoktime || '',
    lastcheckoktime_iso8601: stationData.lastcheckoktime_iso8601 || null,
    lastlocalchecktime: stationData.lastlocalchecktime || '',
    lastlocalchecktime_iso8601: stationData.lastlocalchecktime_iso8601 || null,
    clicktimestamp: stationData.clicktimestamp || '',
    clicktimestamp_iso8601: stationData.clicktimestamp_iso8601 || null,
    clickcount: stationData.clickcount || 0,
    clicktrend: stationData.clicktrend || 0,
    ssl_error: stationData.ssl_error || 0,
    geo_lat: stationData.geo_lat || null,
    geo_long: stationData.geo_long || null,
    has_extended_info: stationData.has_extended_info || false,
  } as RadioStation
}

onMounted(() => {
  historyStore.loadHistory()
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ios-card {
  @apply bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-gray;
}

.glass-effect {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.dark .glass-effect {
  background-color: rgba(28, 28, 30, 0.7);
}

.playing-animation {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
}

.ios-button {
  transition: all 0.2s ease-in-out;
}
.ios-button:active {
  transform: scale(0.95);
  opacity: 0.8;
}
</style>
