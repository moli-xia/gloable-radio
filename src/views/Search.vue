<template>
  <div class="search-page min-h-screen bg-ios-light-gray dark:bg-dark-bg">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-10 glass-effect border-b border-gray-200 dark:border-dark-gray px-4 py-3 bg-white dark:!bg-black">
      <div class="flex items-start gap-3 min-h-[44px]">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-ios-dark-gray dark:text-dark-text leading-tight max-w-[65%] break-words hyphens-auto flex-shrink-1 whitespace-normal">{{ t('search.title') }}</h1>
        <div class="ml-auto flex items-center gap-2">
          <!-- 视图切换按钮 -->
          <div v-if="displayStations.length > 0" class="flex items-center bg-gray-100 dark:bg-dark-gray rounded-lg p-1">
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-ios-blue text-white'
                  : 'bg-ios-gray-light dark:bg-dark-card text-ios-gray dark:text-dark-secondary'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-ios-blue text-white'
                  : 'bg-ios-gray-light dark:bg-dark-card text-ios-gray dark:text-dark-secondary'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- 搜索区域 -->
    <div class="px-4 py-4">
      <!-- 搜索输入框 -->
      <div class="relative mb-4">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg class="w-5 h-5 text-ios-gray dark:text-dark-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          @input="handleSearchInput"
          @compositionstart="handleCompositionStart"
          @compositionend="handleCompositionEnd"
          @keyup.enter="performSearch"
          @blur="handleBlur"
          type="text"
          :placeholder="t('search.placeholder')"
          class="w-full pl-10 pr-20 py-3 rounded-xl border border-gray-200 dark:border-dark-gray bg-white dark:bg-dark-card text-ios-dark-gray dark:text-white focus:border-ios-blue focus:ring-2 focus:ring-ios-blue focus:ring-opacity-20 outline-none transition-all placeholder-ios-gray dark:placeholder-dark-secondary"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <button
            v-if="searchQuery && searchQuery.trim()"
            @click="performSearch"
            class="p-1 rounded-full bg-ios-blue text-white hover:bg-blue-600 transition-colors"
            :title="t('search.search')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-gray transition-colors"
            :title="t('search.clear')"
          >
            <svg class="w-4 h-4 text-ios-gray dark:text-dark-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 快速筛选 -->
      <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          v-for="filter in quickFilters"
          :key="filter.key"
          @click="applyQuickFilter(filter)"
          :class="[
            'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all',
            activeFilter === filter.key
              ? 'bg-ios-blue text-white'
              : 'bg-white dark:bg-dark-card text-ios-dark-gray dark:text-white border border-gray-200 dark:border-dark-gray hover:border-ios-blue'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- 搜索建议 -->
      <div v-if="!searchQuery && searchHistory.length > 0" class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-medium text-ios-gray dark:text-dark-secondary">{{ t('search.history') }}</h3>
          <button
            @click="clearHistory"
            class="text-xs text-ios-blue font-medium"
          >
            {{ t('search.clear') }}
          </button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(item, index) in searchHistory.slice(0, 6)"
            :key="index"
            @click="searchQuery = item; performSearch()"
            class="px-3 py-1 bg-gray-100 dark:bg-dark-gray rounded-full text-sm text-ios-dark-gray dark:text-white hover:bg-ios-blue hover:text-white transition-colors"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div v-if="!searchQuery && !hasSearched && popularSearches.length > 0" class="mb-4">
        <h3 class="text-sm font-medium text-ios-gray dark:text-dark-secondary mb-2">{{ t('search.popularSearches') }}</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="suggestion in popularSearches"
            :key="suggestion"
            @click="searchQuery = suggestion; performSearch()"
            class="px-3 py-1 bg-gray-100 dark:bg-dark-gray rounded-full text-sm text-ios-dark-gray dark:text-white hover:bg-ios-blue hover:text-white transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="px-4 pb-20">
      <!-- 结果统计 -->
      <div v-if="hasSearched" class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-ios-dark-gray dark:text-dark-text">
          {{ t('search.results') }}
          <span v-if="displayStations.length > 0" class="text-sm font-normal text-ios-gray dark:text-dark-secondary">
            ({{ displayStations.length }})
          </span>
        </h2>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading && displayStations.length === 0" class="space-y-3">
        <StationSkeleton v-for="i in 8" :key="i" />
      </div>

      <!-- 电台列表 -->
      <div v-else-if="displayStations.length > 0">
        <!-- 列表模式 -->
        <div v-if="viewMode === 'list'" class="space-y-3">
          <StationCard
            v-for="station in displayStations"
            :key="station.stationuuid"
            :station="station"
            @play="playStation"
            @favorite="toggleFavorite"
            @share="showShareModal"
          />
        </div>

        <!-- 网格模式 -->
        <div v-else class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          <StationGridCard
            v-for="station in displayStations"
            :key="station.stationuuid"
            :station="station"
            @play="playStation"
            @favorite="toggleFavorite"
            @share="showShareModal"
          />
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="text-center mt-6">
          <button
            @click="loadMore"
            :disabled="isLoading"
            class="px-6 py-3 bg-ios-blue text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <svg v-if="isLoading" class="w-5 h-5 animate-spin inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ isLoading ? t('search.loading') : t('search.loadMore') }}
          </button>
        </div>
      </div>

      <!-- 无结果 -->
      <div v-else-if="hasSearched && !isLoading" class="text-center py-12 px-4">
        <div class="mx-auto w-24 h-24 flex items-center justify-center bg-gray-100 dark:bg-dark-card rounded-full mb-4">
          <svg class="w-12 h-12 text-ios-gray dark:text-dark-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-ios-dark-gray dark:text-dark-text mb-2">{{ t('search.noResults') }}</h3>
        <p class="text-ios-gray dark:text-dark-secondary">{{ t('search.noResultsHint') }}</p>
      </div>
    </div>

    <!-- 分享模态框 -->
    <ShareModal
      :visible="showShareModalVisible"
      :station="shareStation"
      @close="closeShareModal"
    />

    <!-- 回到顶部按钮 -->
    <BackToTopButton />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useLanguageStore } from '@/stores/language'
import { useToastStore } from '@/stores/toast'
import type { RadioStation } from '@/types/radio'
import { radioAPI } from '@/services/radioApi'

import StationCard from '@/components/StationCard.vue'
import StationGridCard from '@/components/StationGridCard.vue'
import StationSkeleton from '@/components/StationSkeleton.vue'
import ShareModal from '@/components/ShareModal.vue'
import BackToTopButton from '@/components/BackToTopButton.vue'

const playerStore = usePlayerStore()
const languageStore = useLanguageStore()
const toastStore = useToastStore()
const { t } = languageStore

// 响应式数据
const searchQuery = ref('')
const isComposing = ref(false)
const hasSearched = ref(false)
const isLoading = ref(false)
const hasMore = ref(false)
const searchHistory = ref<string[]>([])
const showShareModalVisible = ref(false)
const shareStation = ref<RadioStation | null>(null)
const viewMode = ref<'list' | 'grid'>('list')
const activeFilter = ref('')
const currentPage = ref(0)
const allStations = ref<RadioStation[]>([])

// 热门搜索词
const popularSearches = [
  'Jazz', 'Rock', 'Pop', 'Classical', 'News', 'Talk', 
  'Electronic', 'Hip Hop', 'Country', 'Blues'
]

// 快速筛选选项
const quickFilters = [
  { key: '', label: t('search.all') },
  { key: 'music', label: t('search.music') },
  { key: 'news', label: t('search.news') },
  { key: 'talk', label: t('search.talk') },
  { key: 'sport', label: t('search.sport') }
]

// 计算属性
const displayStations = computed(() => {
  return allStations.value
})

// 移动端输入法状态追踪
const isMobile = ref(false)

// 检测移动端环境
const detectMobile = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
}

// 搜索输入处理 - 重新设计的简化版本
const searchInputRef = ref<HTMLInputElement>()
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

// 统一的搜索处理函数
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // 清除之前的定时器
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = null
  }
  
  // 更新搜索值
  searchQuery.value = value
  
  // 如果输入为空，立即清空结果
  if (!value.trim()) {
    allStations.value = []
    hasSearched.value = false
    return
  }
  
  // 设置新的搜索定时器
  searchTimeout.value = setTimeout(() => {
    if (searchQuery.value.trim()) {
      console.log('执行搜索:', searchQuery.value)
      performSearch()
    }
  }, 300) // 统一使用300ms延迟
}

// 中文输入法处理
const handleCompositionStart = () => {
  isComposing.value = true
  console.log('中文输入开始')
}

const handleCompositionEnd = (event: Event) => {
  isComposing.value = false
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // 确保搜索值同步更新，这样搜索图标就能立即显示
  searchQuery.value = value
  console.log('中文输入结束:', value)
  
  // 强制触发响应式更新，确保搜索图标显示
  nextTick(() => {
    // 中文输入结束后立即触发搜索
    if (searchQuery.value.trim()) {
      // 清除可能存在的定时器
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
        searchTimeout.value = null
      }
      // 立即执行搜索
      setTimeout(() => {
        console.log('中文输入完成后执行搜索:', searchQuery.value)
        performSearch()
      }, 100)
    }
  })
}

// 失焦处理
const handleBlur = () => {
  // 移动端失焦时也触发搜索，确保搜索执行
  if (isMobile.value && searchQuery.value.trim() && !isComposing.value) {
    setTimeout(() => {
      console.log('失焦触发搜索:', searchQuery.value)
      performSearch()
    }, 150)
  }
}

const performSearch = async () => {
  const query = searchQuery.value.trim()
  
  if (!query && !activeFilter.value) {
    allStations.value = []
    hasSearched.value = false
    return
  }

  try {
    isLoading.value = true
    hasSearched.value = true
    currentPage.value = 0
    
    // 添加到搜索历史
    if (query) {
      addToHistory(query)
    }

    // 构建搜索参数
    const searchParams: any = {
      limit: 50,
      offset: 0
    }

    if (query) {
      searchParams.name = query
    }

    if (activeFilter.value) {
      searchParams.tag = activeFilter.value
    }

    // 使用radioAPI服务执行搜索，正确处理中文编码
    const stations = await radioAPI.searchStations(searchParams)
    
    allStations.value = stations || []
    hasMore.value = stations.length >= 50
    
  } catch (error) {
    console.error('搜索失败:', error)
    toastStore.showError(t('search.searchFailed'))
    allStations.value = []
  } finally {
    isLoading.value = false
  }
}

const loadMore = async () => {
  if (isLoading.value || !hasMore.value) return

  try {
    isLoading.value = true
    currentPage.value++
    
    const searchParams: any = {
      limit: 50,
      offset: currentPage.value * 50
    }

    if (searchQuery.value.trim()) {
      searchParams.name = searchQuery.value.trim()
    }

    if (activeFilter.value) {
      searchParams.tag = activeFilter.value
    }

    // 使用radioAPI服务加载更多，正确处理中文编码
    const stations = await radioAPI.searchStations(searchParams)
    
    if (stations && stations.length > 0) {
      allStations.value.push(...stations)
      hasMore.value = stations.length >= 50
    } else {
      hasMore.value = false
    }
    
  } catch (error) {
    console.error('加载更多失败:', error)
    toastStore.showError(t('search.loadMoreFailed'))
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  allStations.value = []
  hasSearched.value = false
  activeFilter.value = ''
}

const applyQuickFilter = (filter: any) => {
  activeFilter.value = filter.key
  performSearch()
}

const playStation = async (station: RadioStation) => {
  try {
    await playerStore.playStation(station)
  } catch (error) {
    console.error('播放失败:', error)
    toastStore.showError(t('player.playFailed'))
  }
}

const toggleFavorite = async (station: RadioStation) => {
  try {
    await playerStore.toggleFavorite(station)
  } catch (error) {
    console.error('收藏操作失败:', error)
    toastStore.showError(t('player.favoriteFailed') || '收藏操作失败')
  }
}

const showShareModal = (station: RadioStation) => {
  shareStation.value = station
  showShareModalVisible.value = true
}

const closeShareModal = () => {
  showShareModalVisible.value = false
  shareStation.value = null
}

// 搜索历史管理
const addToHistory = (query: string) => {
  const index = searchHistory.value.indexOf(query)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  searchHistory.value.unshift(query)
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
  saveHistory()
}

const clearHistory = () => {
  searchHistory.value = []
  saveHistory()
}

const saveHistory = () => {
  localStorage.setItem('radio-search-history', JSON.stringify(searchHistory.value))
}

const loadHistory = () => {
  const saved = localStorage.getItem('radio-search-history')
  if (saved) {
    try {
      searchHistory.value = JSON.parse(saved)
    } catch (error) {
      console.error('加载搜索历史失败:', error)
    }
  }
}

// 组件挂载
onMounted(() => {
  loadHistory()
  // 初始化移动端检测
  isMobile.value = detectMobile()
  if (!isMobile.value) {
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
})
</script>

<style scoped>
.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.dark .glass-effect {
  background: rgba(31, 41, 55, 0.95);
}

.container-responsive {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .container-responsive {
    max-width: 100%;
  }
}
</style>
