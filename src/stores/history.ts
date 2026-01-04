import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { HistoryItem, RadioStation } from '@/types/radio'

export const useHistoryStore = defineStore('history', () => {
  // 状态
  const history = ref<HistoryItem[]>([])
  const maxHistoryItems = ref(1000) // 最多保存1000条历史记录

  // 计算属性
  const totalVisited = computed(() => history.value.length)
  const uniqueStations = computed(() => {
    const uniqueUuids = new Set(history.value.map(item => item.station.stationuuid))
    return uniqueUuids.size
  })

  // 添加到历史记录
  const addToHistory = (station: RadioStation) => {
    const timestamp = Date.now()
    
    // 检查是否已存在相同电台的记录（5分钟内）
    const recentThreshold = 5 * 60 * 1000 // 5分钟
    const existingIndex = history.value.findIndex(
      item => item.station.stationuuid === station.stationuuid && 
               (timestamp - item.timestamp) < recentThreshold
    )
    
    if (existingIndex !== -1) {
      // 如果5分钟内已有相同电台记录，更新时间戳
      history.value[existingIndex].timestamp = timestamp
      // 将记录移到最前面
      const item = history.value.splice(existingIndex, 1)[0]
      history.value.unshift(item)
    } else {
      // 添加新记录
      const newItem: HistoryItem = {
        station,
        timestamp
      }
      history.value.unshift(newItem)
    }
    
    // 限制历史记录数量
    if (history.value.length > maxHistoryItems.value) {
      history.value = history.value.slice(0, maxHistoryItems.value)
    }
    
    saveHistory()
  }

  // 从历史记录中移除
  const removeFromHistory = (timestamp: number) => {
    const index = history.value.findIndex(item => item.timestamp === timestamp)
    if (index !== -1) {
      history.value.splice(index, 1)
      saveHistory()
    }
  }

  // 清空历史记录
  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  // 获取特定电台的历史记录
  const getStationHistory = (stationuuid: string) => {
    return history.value.filter(item => item.station.stationuuid === stationuuid)
  }

  // 获取最近播放的电台
  const getRecentStations = (limit: number = 10) => {
    const uniqueStations = new Map<string, HistoryItem>()
    
    // 按时间倒序遍历，保证最新的记录优先
    for (const item of history.value) {
      if (!uniqueStations.has(item.station.stationuuid)) {
        uniqueStations.set(item.station.stationuuid, item)
      }
      if (uniqueStations.size >= limit) break
    }
    
    return Array.from(uniqueStations.values())
  }

  // 保存到本地存储
  const saveHistory = () => {
    try {
      localStorage.setItem('radio-history', JSON.stringify(history.value))
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  }

  // 从本地存储加载
  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('radio-history')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          history.value = parsed
        }
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
      history.value = []
    }
  }

  // 检查电台是否在历史记录中
  const isInHistory = (stationuuid: string) => {
    return history.value.some(item => item.station.stationuuid === stationuuid)
  }

  // 获取电台的访问次数
  const getStationVisitCount = (stationuuid: string) => {
    return history.value.filter(item => item.station.stationuuid === stationuuid).length
  }

  // 获取今日访问的电台
  const getTodayHistory = () => {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    
    return history.value.filter(item => item.timestamp >= todayStart)
  }

  // 获取本周访问的电台
  const getWeekHistory = () => {
    const now = new Date()
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime()
    
    return history.value.filter(item => item.timestamp >= weekStart)
  }

  return {
    // 状态
    history,
    maxHistoryItems,
    
    // 计算属性
    totalVisited,
    uniqueStations,
    
    // 方法
    addToHistory,
    removeFromHistory,
    clearHistory,
    getStationHistory,
    getRecentStations,
    saveHistory,
    loadHistory,
    isInHistory,
    getStationVisitCount,
    getTodayHistory,
    getWeekHistory
  }
}) 