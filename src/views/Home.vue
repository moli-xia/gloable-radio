<template>
  <div class="home-page">
    <!-- 移动端标题栏 -->
    <header class="mobile:block desktop:hidden sticky top-0 z-30 glass-effect border-b border-gray-200 dark:border-dark-gray px-4 py-3">
      <div class="flex items-start justify-between min-h-[44px]">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-ios-dark-gray dark:text-dark-text leading-tight max-w-[65%] break-words hyphens-auto flex-shrink-1 whitespace-normal">{{ languageStore.t('home.title') }}</h1>
        <div class="flex items-center gap-2">
          <!-- 视图模式切换 -->
          <div class="flex items-center bg-gray-100 dark:bg-dark-gray rounded-ios p-0.5">
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
          <LanguageToggle />
          <ThemeToggle />

        </div>
      </div>
    </header>
    
    <!-- PC端简化标题 -->
    <div class="mobile:hidden desktop:block px-6 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold text-ios-dark-gray dark:text-dark-text">{{ languageStore.t('home.subtitle') }}</h1>
        <div class="flex items-center gap-3">
          <!-- 视图模式切换 -->
          <div class="flex items-center bg-gray-100 dark:bg-dark-gray rounded-ios p-0.5">
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

        </div>
      </div>
    </div>

    <div class="py-6 space-y-8 pb-24 md:pb-28">
      <!-- 快速操作 -->
      <section>
        <div class="grid grid-cols-2 gap-4 mobile:grid-cols-2 tablet:grid-cols-2 desktop:grid-cols-4">
          <button 
            @click="loadRandomStations"
            class="relative overflow-hidden ios-card p-6 text-center hover:shadow-ios-lg dark:hover:shadow-dark-ios-lg transition-all active:scale-95 bg-gradient-to-br from-ios-blue to-purple-600 dark:from-ios-blue dark:to-purple-700 text-white border-0 z-0"
          >
            <!-- 背景装饰 -->
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <!-- 图标容器 -->
            <div class="relative z-10 mb-3">
              <div class="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ArrowsRightLeftIcon class="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            
            <!-- 文字内容 -->
            <div class="relative z-10">
              <p class="font-semibold text-white text-lg mb-1">{{ languageStore.t('home.randomDiscover') || '随机发现' }}</p>
              <p class="text-sm text-white/80">{{ languageStore.t('home.exploreNew') || '探索新电台' }}</p>
            </div>
            
            <!-- 装饰性元素 -->
            <div class="absolute top-2 right-2 w-8 h-8 bg-white/10 rounded-full animate-bounce delay-300"></div>
            <div class="absolute bottom-2 left-2 w-6 h-6 bg-white/10 rounded-full animate-bounce delay-500"></div>
          </button>
          
          <button 
            @click="$router.push('/search')"
            class="ios-card p-6 text-center hover:shadow-ios-lg dark:hover:shadow-dark-ios-lg transition-all active:scale-95"
          >
            <MagnifyingGlassIcon class="w-8 h-8 text-ios-green mx-auto mb-2" />
            <p class="font-medium text-ios-dark-gray dark:text-dark-text">{{ languageStore.t('nav.search') }}</p>
            <p class="text-sm text-ios-gray dark:text-dark-secondary mt-1">{{ languageStore.t('home.findFavorites') || '找到喜欢的' }}</p>
          </button>
          
          <!-- PC端额外的快速操作 -->
          <button 
            @click="$router.push('/history')"
            class="ios-card p-6 text-center hover:shadow-ios-lg dark:hover:shadow-dark-ios-lg transition-all active:scale-95 hidden desktop:block"
          >
            <ClockIcon class="w-8 h-8 text-ios-purple mx-auto mb-2" />
            <p class="font-medium text-ios-dark-gray dark:text-dark-text">{{ languageStore.t('nav.history') }}</p>
            <p class="text-sm text-ios-gray dark:text-dark-secondary mt-1">{{ languageStore.t('history.viewRecords') || '查看访问记录' }}</p>
          </button>
          
          <button 
            @click="$router.push('/favorites')"
            class="ios-card p-6 text-center hover:shadow-ios-lg dark:hover:shadow-dark-ios-lg transition-all active:scale-95 hidden desktop:block"
          >
            <HeartIcon class="w-8 h-8 text-ios-red mx-auto mb-2" />
            <p class="font-medium text-ios-dark-gray dark:text-dark-text">{{ languageStore.t('nav.favorites') }}</p>
            <p class="text-sm text-ios-gray dark:text-dark-secondary mt-1">{{ languageStore.t('home.savedStations') || '收藏的电台' }}</p>
          </button>
        </div>
      </section>

      <!-- 音乐电台 -->
      <section class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-ios-dark-gray dark:text-dark-text">{{ languageStore.t('home.musicStations') || '音乐电台' }}</h2>
          <button
            @click="refreshTopStations"
            :disabled="radioStore.isLoading"
            class="relative p-2 rounded-full bg-gradient-to-r from-ios-blue to-purple-500 hover:from-purple-500 hover:to-ios-blue transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:scale-100 disabled:shadow-lg"
            :title="languageStore.t('home.refresh')"
          >
            <ArrowPathIcon 
              :class="['w-5 h-5 text-white drop-shadow-sm', { 'animate-spin': radioStore.isLoading }]" 
            />
          </button>
        </div>
        
        <div v-if="radioStore.isLoading && radioStore.topStations.length === 0" 
             class="mobile:space-y-3 desktop:grid desktop:grid-cols-4 desktop:gap-4">
          <StationSkeleton v-for="i in displayCount" :key="i" />
        </div>
        
        <div v-else :class="[
          viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
        ]">
          <!-- 列表视图 -->
          <template v-if="viewMode === 'list'">
            <StationCard 
              v-for="station in radioStore.topStations.slice(0, displayCount)" 
              :key="station.stationuuid"
              :station="station"
              @play="playStation"
              @favorite="toggleFavorite"
              @share="openShareModal"
            />
          </template>
          
          <!-- 网格视图 -->
          <template v-else>
            <StationGridCard 
              v-for="station in radioStore.topStations.slice(0, displayCount)" 
              :key="'grid-' + station.stationuuid"
              :station="station"
              @play="playStation"
              @favorite="toggleFavorite"
              @share="openShareModal"
            />
          </template>
        </div>
      </section>

      <!-- 推荐电台 -->
      <section v-if="recommendedStations.length > 0" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold text-ios-dark-gray dark:text-dark-text">{{ languageStore.t('home.localRecommendations') || '为您推荐' }}</h2>
            <span class="text-sm text-ios-gray dark:text-dark-secondary px-2 py-1 bg-ios-light-gray dark:bg-dark-gray rounded-full">
              {{ getLanguageDisplayName() }}
            </span>
          </div>
          <button
            @click="loadRecommendedStations"
            :disabled="isLoadingRecommended"
            class="relative p-2 rounded-full bg-gradient-to-r from-ios-blue to-purple-500 hover:from-purple-500 hover:to-ios-blue transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:scale-100 disabled:shadow-lg"
            :title="languageStore.t('home.refresh')"
          >
            <ArrowPathIcon 
              :class="['w-5 h-5 text-white drop-shadow-sm', { 'animate-spin': isLoadingRecommended }]" 
            />
          </button>
        </div>
        
        <div v-if="isLoadingRecommended" 
             class="mobile:space-y-3 desktop:grid desktop:grid-cols-4 desktop:gap-4">
          <StationSkeleton v-for="i in 3" :key="i" />
        </div>
        
        <div v-else :class="[
          viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
        ]">
          <!-- 列表视图 -->
          <template v-if="viewMode === 'list'">
            <StationCard 
              v-for="station in recommendedStations.slice(0, displayCount)" 
              :key="station.stationuuid"
              :station="station"
              @play="playStation"
              @favorite="toggleFavorite"
              @share="openShareModal"
            />
          </template>
          
          <!-- 网格视图 -->
          <template v-else>
            <StationGridCard 
              v-for="station in recommendedStations.slice(0, displayCount)" 
              :key="'grid-' + station.stationuuid"
              :station="station"
              @play="playStation"
              @favorite="toggleFavorite"
              @share="openShareModal"
            />
          </template>
        </div>
      </section>

      <!-- 最新电台 -->
      <section class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-ios-dark-gray dark:text-dark-text">{{ languageStore.t('home.latestStations') || '最新电台' }}</h2>
        </div>
        
        <div v-if="radioStore.isLoading && radioStore.latestStations.length === 0" 
             class="mobile:space-y-3 desktop:grid desktop:grid-cols-4 desktop:gap-4">
          <StationSkeleton v-for="i in displayCount" :key="i" />
        </div>
        
        <div v-else :class="[
          viewMode === 'list' ? 'space-y-3' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
        ]">
          <!-- 列表视图 -->
          <template v-if="viewMode === 'list'">
            <StationCard 
              v-for="station in radioStore.latestStations.slice(0, displayCount)" 
              :key="station.stationuuid"
              :station="station"
              @play="playStation"
              @favorite="toggleFavorite"
              @share="openShareModal"
            />
          </template>
          
          <!-- 网格视图 -->
          <template v-else>
            <StationGridCard 
              v-for="station in radioStore.latestStations.slice(0, displayCount)" 
              :key="'grid-' + station.stationuuid"
              :station="station"
              @play="playStation"
              @favorite="toggleFavorite"
              @share="openShareModal"
            />
          </template>
        </div>
      </section>

    </div>

    <ShareModal :visible="isShareModalVisible" :station="stationToShare" @close="closeShareModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useRadioStore } from '@/stores/radio'
import { useLanguageStore } from '@/stores/language'
import type { RadioStation } from '@/types/radio'

import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  ClockIcon,
  Bars3Icon,
  Squares2X2Icon
} from '@heroicons/vue/24/outline'

import StationCard from '@/components/StationCard.vue'
import StationGridCard from '@/components/StationGridCard.vue'
import StationSkeleton from '@/components/StationSkeleton.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageToggle from '@/components/LanguageToggle.vue'
import { useToastStore } from '@/stores/toast'
import ShareModal from '@/components/ShareModal.vue'

const playerStore = usePlayerStore()
const radioStore = useRadioStore()
const languageStore = useLanguageStore()
const toastStore = useToastStore()

// 推荐电台状态
const recommendedStations = ref<RadioStation[]>([])
const isLoadingRecommended = ref(false)

// 响应式显示数量
const displayCount = computed(() => {
  if (typeof window !== 'undefined') {
    const width = window.innerWidth
    if (width >= 1280) return 15 // desktop: 5列 x 3行
    if (width >= 768) return 9   // tablet: 3列 x 3行
    return 8                     // mobile: 2列 x 4行
  }
  return 8
})

const isDiscovering = ref(false)
const isShareModalVisible = ref(false)
const stationToShare = ref<RadioStation | null>(null)
// PC端默认网格模式，移动端默认列表模式
const viewMode = ref<'list' | 'grid'>(window.innerWidth >= 1280 ? 'grid' : 'list')

const playStation = async (station: RadioStation) => {
  isDiscovering.value = false // 用户手动选择电台，则停止随机发现模式
  await playerStore.playStation(station)
}

const toggleFavorite = (station: RadioStation) => {
  playerStore.toggleFavorite(station)
}

const loadRandomStations = async () => {
  isDiscovering.value = true
  const maxAttempts = 10 // 最多尝试10个电台
  let attemptCount = 0
  
  try {
    // 获取随机电台
    await radioStore.loadRandomStations()
    
    if (radioStore.stations.length === 0) {
      isDiscovering.value = false
      return
    }
    
    // 随机播放电台，失败时自动切换到下一个
    const tryPlayRandomStation = async (): Promise<void> => {
      if (attemptCount >= maxAttempts || !isDiscovering.value) {
        isDiscovering.value = false
        return
      }
      
      attemptCount++
      const randomIndex = Math.floor(Math.random() * radioStore.stations.length)
      const randomStation = radioStore.stations[randomIndex]
      
      try {
        await playerStore.playStation(randomStation)
        isDiscovering.value = false // 播放成功，停止发现模式
      } catch (error) {
        // 无提示，直接尝试下一个电台
        await tryPlayRandomStation()
      }
    }
    
    await tryPlayRandomStation()
    
  } catch (error) {
    console.error('加载随机电台失败:', error)
    isDiscovering.value = false
    // 只有在加载电台列表失败时才显示错误提示
    toastStore.showError('加载随机电台失败，请稍后重试')
  }
}

const refreshTopStations = async () => {
  await radioStore.loadTopStations({ force: true })
}

// 加载推荐电台
const loadRecommendedStations = async () => {
  isLoadingRecommended.value = true
  try {
    const stations = await radioStore.getRecommendedStations()
    recommendedStations.value = stations
  } catch (error) {
    console.error('加载推荐电台失败:', error)
  } finally {
    isLoadingRecommended.value = false
  }
}

// 获取当前语言显示名称
const getLanguageDisplayName = () => {
  const currentLang = languageStore.currentLanguageInfo
  return currentLang.nativeName || currentLang.name || '未知'
}

const openShareModal = (station: RadioStation) => {
  stationToShare.value = station
  isShareModalVisible.value = true
}

const closeShareModal = () => {
  isShareModalVisible.value = false
}

onMounted(() => {
  // 立即显示页面，异步加载数据
  const initializeData = async () => {
    try {
      // 立即开始加载基础数据
      const loadBasicData = async () => {
        const promises = []
        
        if (radioStore.topStations.length === 0) {
          promises.push(radioStore.loadTopStations())
        }
        
        if (radioStore.latestStations.length === 0) {
          promises.push(radioStore.loadLatestStations())
        }
        
        // 加载推荐电台
        promises.push(loadRecommendedStations())
        
        if (promises.length > 0) {
          await Promise.all(promises)
        }
      }
      
      // 执行基础数据加载
      await loadBasicData()
      
    } catch (error: any) {
      console.error('数据初始化失败:', error)
    }
  }
  
  // 异步执行初始化，不阻塞页面渲染
  initializeData()
})

onUnmounted(() => {
  // 清理状态
  isDiscovering.value = false
})
</script>
