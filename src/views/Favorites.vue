<template>
  <div class="favorites-page min-h-screen bg-ios-light-gray dark:bg-dark-bg pb-20">
    <!-- 移动端标题栏 -->
    <div class="mobile:block desktop:hidden sticky top-0 z-10 glass-effect border-b border-gray-200 dark:border-dark-gray px-4 py-3">
      <div class="flex items-start justify-between min-h-[44px]">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-ios-dark-gray dark:text-dark-text leading-tight max-w-[65%] break-words hyphens-auto flex-shrink-1 whitespace-normal">{{ t('nav.favorites') }}</h1>
        <div class="flex items-center gap-2 flex-shrink-0">
          <!-- 视图模式切换 -->
          <div v-if="playerStore.favorites.length > 0" class="flex items-center bg-gray-100 dark:bg-dark-gray rounded-ios p-0.5">
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-1.5 rounded-md transition-all flex items-center justify-center',
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
                'p-1.5 rounded-md transition-all flex items-center justify-center',
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
            v-if="playerStore.favorites.length > 0"
            @click="showClearDialog = true"
            :class="[
              'text-ios-red font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-ios transition-colors',
              // 针对长文本语言使用较小字体和允许换行
              ['es', 'fr', 'de', 'ja', 'ko', 'ru', 'pt', 'it', 'th', 'vi'].includes(currentLanguage) 
                ? 'text-xs leading-tight text-center min-w-0 max-w-[80px]' 
                : 'text-sm whitespace-nowrap'
            ]"
            :style="[
              ['es', 'fr', 'de', 'ja', 'ko', 'ru', 'pt', 'it', 'th', 'vi'].includes(currentLanguage) 
                ? { wordBreak: 'break-word', whiteSpace: 'normal', lineHeight: '1.2' } 
                : {}
            ]"
          >
            {{ t('favorites.clearAll') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- PC端标题栏 -->
    <div class="mobile:hidden desktop:block px-6 py-4 border-b border-gray-200 dark:border-dark-gray">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-ios-dark-gray dark:text-dark-text">{{ t('favorites.title') }}</h1>
        <div class="flex items-center gap-3">
          <!-- 视图模式切换 -->
          <div v-if="playerStore.favorites.length > 0" class="flex items-center bg-gray-100 dark:bg-dark-gray rounded-ios p-0.5">
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
            v-if="playerStore.favorites.length > 0"
            @click="showClearDialog = true"
            class="text-ios-red text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-ios transition-colors"
          >
            {{ t('favorites.clearAll') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 收藏列表 -->
    <div v-if="playerStore.favorites.length > 0" class="container-responsive p-4">
      <div :class="[
        viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
      ]">
        <!-- 列表视图 -->
        <template v-if="viewMode === 'list'">
          <StationCard
            v-for="station in playerStore.favorites"
            :key="'list-' + station.stationuuid"
            :station="convertToRadioStation(station)"
            @play="playStation"
            @favorite="removeFavorite"
            @share="showShareModal"
          />
        </template>
        
        <!-- 网格视图 -->
        <template v-else>
          <StationGridCard
            v-for="station in playerStore.favorites"
            :key="'grid-' + station.stationuuid"
            :station="convertToRadioStation(station)"
            @play="playStation"
            @favorite="removeFavorite"
            @share="showShareModal"
          />
        </template>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div class="text-center">
        <HeartIcon class="w-16 h-16 text-ios-light-gray dark:text-dark-secondary mx-auto mb-4" />
        <h3 class="text-lg font-medium text-ios-dark-gray dark:text-dark-text mb-2">{{ t('favorites.empty') }}</h3>
        <p class="text-ios-gray dark:text-dark-secondary mb-6">{{ t('favorites.emptyHint') }}</p>
        <div class="space-y-3">
          <router-link
            to="/"
            class="ios-button bg-ios-blue text-white px-6 py-3 rounded-ios font-medium inline-block"
          >
            {{ t('favorites.browseStations') }}
          </router-link>
          <router-link
            to="/search"
            class="ios-button bg-white dark:bg-dark-surface text-ios-blue dark:text-ios-blue border border-ios-blue dark:border-ios-blue px-6 py-3 rounded-ios font-medium inline-block ml-3"
          >
            {{ t('favorites.searchStations') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 清空确认对话框 -->
    <div
      v-if="showClearDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="showClearDialog = false"
    >
      <div
        class="bg-white dark:bg-dark-surface rounded-ios p-6 mx-4 max-w-sm w-full"
        @click.stop
      >
        <h3 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text mb-2">{{ t('favorites.clearConfirmTitle') }}</h3>
        <p class="text-ios-gray dark:text-dark-secondary mb-6">{{ t('favorites.clearConfirmMessage') }}</p>
        <div class="flex gap-3">
          <button
            @click="showClearDialog = false"
            class="flex-1 ios-button bg-gray-100 dark:bg-dark-gray text-ios-dark-gray dark:text-dark-text py-3 rounded-ios font-medium"
          >
            {{ t('favorites.cancel') }}
          </button>
          <button
            @click="clearAllFavorites"
            class="flex-1 ios-button bg-ios-red text-white py-3 rounded-ios font-medium"
          >
            {{ t('favorites.clear') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 分享模态框 -->
    <ShareModal
      :visible="showShareModalVisible"
      :station="shareStation"
      @close="closeShareModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useLanguageStore } from '@/stores/language'
import type { RadioStation, FavoriteStation } from '@/types/radio'

import StationCard from '@/components/StationCard.vue'
import StationGridCard from '@/components/StationGridCard.vue'
import ShareModal from '@/components/ShareModal.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { HeartIcon, Bars3Icon, Squares2X2Icon } from '@heroicons/vue/24/outline'

const playerStore = usePlayerStore()
const languageStore = useLanguageStore()
const { t } = languageStore
const currentLanguage = languageStore.currentLanguage
const showClearDialog = ref(false)
const viewMode = ref<'list' | 'grid'>('list')
const showShareModalVisible = ref(false)
const shareStation = ref<RadioStation | null>(null)

const playStation = (station: RadioStation) => {
  playerStore.playStation(station)
}

const removeFavorite = (station: RadioStation) => {
  playerStore.removeFavorite(station.stationuuid)
}

const clearAllFavorites = () => {
  playerStore.clearFavorites()
  showClearDialog.value = false
}

const showShareModal = (station: RadioStation) => {
  shareStation.value = station
  showShareModalVisible.value = true
}

const closeShareModal = () => {
  showShareModalVisible.value = false
  shareStation.value = null
}

// 将FavoriteStation转换为RadioStation
const convertToRadioStation = (favorite: FavoriteStation): RadioStation => {
  return {
    stationuuid: favorite.stationuuid,
    name: favorite.name,
    url: favorite.url,
    url_resolved: favorite.url,
    homepage: '',
    favicon: favorite.favicon,
    tags: '',
    country: favorite.country,
    countrycode: '',
    state: '',
    language: '',
    languagecodes: '',
    votes: 0,
    lastchangetime: '',
    lastchangetime_iso8601: '',
    codec: '',
    bitrate: 0,
    hls: 0,
    lastcheckok: 1,
    lastchecktime: '',
    lastchecktime_iso8601: '',
    lastcheckoktime: '',
    lastcheckoktime_iso8601: '',
    lastlocalchecktime: '',
    lastlocalchecktime_iso8601: '',
    clicktimestamp: '',
    clicktimestamp_iso8601: '',
    clickcount: 0,
    clicktrend: 0,
    ssl_error: 0,
    geo_lat: 0,
    geo_long: 0,
    has_extended_info: false
  }
}
</script>