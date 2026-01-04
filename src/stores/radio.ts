import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { RadioStation, RadioSearchParams, Country, Language, Tag } from '@/types/radio'
import { radioAPI } from '@/services/radioApi'

export const useRadioStore = defineStore('radio', () => {
  // 状态
  const stations = ref<RadioStation[]>([])
  const topStations = ref<RadioStation[]>([])
  const latestStations = ref<RadioStation[]>([])
  const countries = ref<Country[]>([])
  const languages = ref<Language[]>([])
  const tags = ref<Tag[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedCountry = ref('')
  const selectedLanguage = ref('')
  const selectedTag = ref('')
  const currentPage = ref(1)
  const pageSize = ref(500)

  // 计算属性
  const hasMore = computed(() => stations.value.length >= pageSize.value)
  const totalStations = computed(() => stations.value.length)
  
  const filteredStations = computed(() => {
    let filtered = stations.value
    
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(station => {
        // 搜索电台名称（支持中文）
        const nameMatch = station.name.toLowerCase().includes(query)
        // 搜索国家（支持中文）
        const countryMatch = station.country.toLowerCase().includes(query)
        // 搜索标签（支持中文）
        const tagsMatch = station.tags.toLowerCase().includes(query)
        // 搜索语言（支持中文）
        const languageMatch = station.language && station.language.toLowerCase().includes(query)
        // 搜索状态（支持中文）
        const stateMatch = station.state && station.state.toLowerCase().includes(query)
        // 搜索编解码器
        const codecMatch = station.codec && station.codec.toLowerCase().includes(query)
        
        return nameMatch || countryMatch || tagsMatch || languageMatch || stateMatch || codecMatch
      })
    }
    
    // 如果有筛选条件，进一步过滤
    if (selectedCountry.value) {
      filtered = filtered.filter(station => 
        station.countrycode === selectedCountry.value
      )
    }
    
    if (selectedLanguage.value) {
      filtered = filtered.filter(station => 
        station.language && station.language.toLowerCase().includes(selectedLanguage.value.toLowerCase())
      )
    }
    
    if (selectedTag.value) {
      filtered = filtered.filter(station => 
        station.tags.toLowerCase().includes(selectedTag.value.toLowerCase())
      )
    }
    
    return filtered
  })

  // 搜索电台
  const searchStations = async (params: RadioSearchParams = {}) => {
    try {
      isLoading.value = true
      error.value = null
      
      const searchParams: RadioSearchParams = {
        ...params,
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value,
        hidebroken: true
      }
      
      if (selectedCountry.value) {
        searchParams.countrycode = selectedCountry.value
      }
      
      if (selectedLanguage.value) {
        searchParams.language = selectedLanguage.value
      }
      
      if (selectedTag.value) {
        searchParams.tag = selectedTag.value
      }
      
      if (searchQuery.value) {
        // 优化中文搜索：使用name参数进行主要搜索
        searchParams.name = searchQuery.value
      }
      
      // 如果是用户主动搜索或浏览，使用随机排序
      const isUserSearch = searchQuery.value || selectedCountry.value || selectedLanguage.value || selectedTag.value
      if (isUserSearch && !searchParams.order) {
        searchParams.order = 'random'
      }
      
      const result = await radioAPI.searchStations(searchParams)
      
      // 对搜索结果再次随机化处理
      let finalResult = result
      if (isUserSearch && result.length > 1) {
        finalResult = result.sort(() => 0.5 - Math.random())
      }
      
      if (currentPage.value === 1) {
        stations.value = finalResult
      } else {
        stations.value.push(...finalResult)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '搜索失败'
      console.error('搜索电台错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 加载热门电台
  const loadTopStations = async ({ force = false } = {}) => {
    if (topStations.value.length > 0 && !force) {
      return
    }
    try {
      isLoading.value = true
      error.value = null
      
      // 获取当前用户语言设置
      const { useLanguageStore } = await import('@/stores/language')
      const languageStore = useLanguageStore()
      const userLanguage = languageStore.currentLanguage
      
      const response = await radioAPI.getTopStations(50, userLanguage)
      topStations.value = response.data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载热门电台失败'
      console.error('加载热门电台错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 加载最新电台
  const loadLatestStations = async ({ force = false } = {}) => {
    if (latestStations.value.length > 0 && !force) {
      return
    }
    try {
      isLoading.value = true
      error.value = null
      latestStations.value = await radioAPI.getLatestStations(50)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载最新电台失败'
      console.error('加载最新电台错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 加载随机电台
  const loadRandomStations = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await radioAPI.getRandomStations(50)
      stations.value = response.data || []
      currentPage.value = 1
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载随机电台失败'
      console.error('加载随机电台错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 获取单个随机电台
  const getRandomStation = async (): Promise<RadioStation | null> => {
    try {
      const response = await radioAPI.getRandomStations(1)
      const stations = response.data || []
      return stations.length > 0 ? stations[0] : null
    } catch (err) {
      console.error('获取随机电台失败:', err)
      return null
    }
  }

  // 根据国家加载电台
  const loadStationsByCountry = async (countryCode: string) => {
    try {
      isLoading.value = true
      error.value = null
      selectedCountry.value = countryCode
      const response = await radioAPI.getStationsByCountry(countryCode, 50)
      stations.value = response.data || []
      currentPage.value = 1
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载国家电台失败'
      console.error('加载国家电台错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 根据标签加载电台
  const loadStationsByTag = async (tag: string) => {
    try {
      isLoading.value = true
      error.value = null
      selectedTag.value = tag
      stations.value = await radioAPI.getStationsByTag(tag, 50)
      currentPage.value = 1
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载标签电台失败'
      console.error('加载标签电台错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 加载更多电台
  const loadMoreStations = async () => {
    if (isLoading.value || !hasMore.value) return
    
    currentPage.value++
    await searchStations()
  }

  // 加载国家列表
  const loadCountries = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await radioAPI.getCountries()
      countries.value = response.data || []
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载国家列表失败'
      console.error('加载国家列表错误:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 加载语言列表
  const loadLanguages = async () => {
    try {
      languages.value = await radioAPI.getLanguages()
    } catch (err) {
      console.error('加载语言列表错误:', err)
    }
  }

  // 加载标签列表
  const loadTags = async () => {
    try {
      tags.value = await radioAPI.getTags()
    } catch (err) {
      console.error('加载标签列表错误:', err)
    }
  }

  // 重置搜索
  const resetSearch = () => {
    searchQuery.value = ''
    selectedCountry.value = ''
    selectedLanguage.value = ''
    selectedTag.value = ''
    currentPage.value = 1
    stations.value = []
    error.value = null
  }

  // 设置搜索查询
  const setSearchQuery = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  // 设置选中的国家
  const setSelectedCountry = (countryCode: string) => {
    selectedCountry.value = countryCode
    currentPage.value = 1
  }

  // 设置选中的语言
  const setSelectedLanguage = (language: string) => {
    selectedLanguage.value = language
    currentPage.value = 1
  }

  // 设置选中的标签
  const setSelectedTag = (tag: string) => {
    selectedTag.value = tag
    currentPage.value = 1
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  // 获取推荐电台（基于语言）
  const getRecommendedStations = async () => {
    try {
      isLoading.value = true
      
      // 获取当前用户语言设置
      const { useLanguageStore } = await import('@/stores/language')
      const languageStore = useLanguageStore()
      const userLanguage = languageStore.currentLanguage
      
      // 基于语言获取推荐电台
      const response = await radioAPI.getTopStations(20, userLanguage)
      return response.data || []
    } catch (error) {
      console.error('获取推荐电台失败:', error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  // 根据UUID获取单个电台
  const getStationByUuid = async (uuid: string): Promise<RadioStation | null> => {
    try {
      isLoading.value = true
      const result = await radioAPI.getStationByUUID(uuid)
      return result
    } catch (err) {
      error.value = err instanceof Error ? err.message : `无法加载电台 ${uuid}`
      console.error('根据UUID加载电台错误:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    // 状态
    stations,
    topStations,
    latestStations,
    countries,
    languages,
    tags,
    isLoading,
    error,
    searchQuery,
    selectedCountry,
    selectedLanguage,
    selectedTag,
    currentPage,
    pageSize,
    
    // 计算属性
    hasMore,
    totalStations,
    filteredStations,
    
    // 方法
    searchStations,
    loadTopStations,
    loadLatestStations,
    loadRandomStations,
    loadStationsByCountry,
    loadStationsByTag,
    loadMoreStations,
    loadCountries,
    loadLanguages,
    loadTags,
    resetSearch,
    setSearchQuery,
    setSelectedCountry,
    setSelectedLanguage,
    setSelectedTag,
    clearError,
    
    // 推荐方法
    getRecommendedStations,
    getRandomStation,
    getStationByUuid
  }
})