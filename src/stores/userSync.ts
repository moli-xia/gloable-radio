import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FavoriteStation, HistoryItem } from '@/types/radio'
import { EMPTY_USER_DATA, type UserData, type UserSettings } from '@/types/userData'
import { fetchUserData, saveUserData } from '@/services/userDataApi'
import { debounce } from '@/utils/debounce'
import { registerUserDataPushHandler } from '@/services/userDataSyncTrigger'
import { useAuthStore } from '@/stores/auth'
import { usePlayerStore } from '@/stores/player'
import { useHistoryStore } from '@/stores/history'
import { useThemeStore } from '@/stores/theme'
import { useLanguageStore } from '@/stores/language'

const LOCAL_USER_KEY = 'global-radio-local-user'

function getLocalUserMarker(): string | null {
  return localStorage.getItem(LOCAL_USER_KEY)
}

function setLocalUserMarker(username: string | null) {
  if (username) {
    localStorage.setItem(LOCAL_USER_KEY, username)
  } else {
    localStorage.removeItem(LOCAL_USER_KEY)
  }
}

function mergeFavorites(server: FavoriteStation[], local: FavoriteStation[]): FavoriteStation[] {
  const map = new Map<string, FavoriteStation>()

  for (const item of [...server, ...local]) {
    const existing = map.get(item.stationuuid)
    if (!existing || new Date(item.addedAt).getTime() > new Date(existing.addedAt).getTime()) {
      map.set(item.stationuuid, item)
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  )
}

function mergeHistory(server: HistoryItem[], local: HistoryItem[]): HistoryItem[] {
  return [...server, ...local]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 1000)
}

function mergeSearchHistory(server: string[], local: string[]): string[] {
  const seen = new Set<string>()
  const merged: string[] = []

  for (const item of [...local, ...server]) {
    const normalized = item.trim()
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    merged.push(normalized)
    if (merged.length >= 10) break
  }

  return merged
}

function readSearchHistoryFromStorage(): string[] {
  try {
    const saved = localStorage.getItem('radio-search-history')
    if (!saved) return []
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

function writeSearchHistoryToStorage(items: string[]) {
  localStorage.setItem('radio-search-history', JSON.stringify(items))
}

export const useUserSyncStore = defineStore('userSync', () => {
  const syncedForUser = ref<string | null>(null)
  const syncing = ref(false)

  function collectLocalUserData(): UserData {
    const playerStore = usePlayerStore()
    const historyStore = useHistoryStore()
    const themeStore = useThemeStore()
    const languageStore = useLanguageStore()

    return {
      ...EMPTY_USER_DATA,
      updatedAt: new Date().toISOString(),
      favorites: [...playerStore.favorites],
      history: [...historyStore.history],
      searchHistory: readSearchHistoryFromStorage(),
      settings: {
        volume: playerStore.volume,
        muted: playerStore.isMuted,
        themeMode: themeStore.mode,
        language: languageStore.currentLanguage
      }
    }
  }

  function applySettings(settings: UserSettings) {
    const playerStore = usePlayerStore()
    const themeStore = useThemeStore()
    const languageStore = useLanguageStore()

    if (typeof settings.volume === 'number') {
      playerStore.setVolume(settings.volume)
    }

    if (typeof settings.muted === 'boolean' && settings.muted !== playerStore.isMuted) {
      playerStore.toggleMute()
    }

    if (settings.themeMode === 'light' || settings.themeMode === 'dark') {
      themeStore.setMode(settings.themeMode)
    }

    if (typeof settings.language === 'string' && settings.language) {
      languageStore.setLanguage(settings.language as typeof languageStore.currentLanguage)
    }
  }

  function applyUserData(data: UserData) {
    const playerStore = usePlayerStore()
    const historyStore = useHistoryStore()

    playerStore.favorites = [...data.favorites]
    localStorage.setItem('radio-favorites', JSON.stringify(playerStore.favorites))

    historyStore.history = [...data.history]
    localStorage.setItem('radio-history', JSON.stringify(historyStore.history))

    writeSearchHistoryToStorage(data.searchHistory)
    applySettings(data.settings)
  }

  function mergeUserData(serverData: UserData, localData: UserData): UserData {
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      favorites: mergeFavorites(serverData.favorites, localData.favorites),
      history: mergeHistory(serverData.history, localData.history),
      searchHistory: mergeSearchHistory(serverData.searchHistory, localData.searchHistory),
      settings: {
        ...localData.settings,
        ...serverData.settings
      }
    }
  }

  async function pushToServer(): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const payload = collectLocalUserData()
    await saveUserData(payload)
  }

  const schedulePushToServer = debounce(() => {
    pushToServer().catch((error) => {
      console.error('同步用户数据到服务器失败:', error)
    })
  }, 1000)

  async function pullFromServer(force = false): Promise<void> {
    const authStore = useAuthStore()
    if (!authStore.user) return

    if (!force && syncedForUser.value === authStore.user.username) {
      return
    }

    syncing.value = true

    try {
      const serverData = await fetchUserData()
      const currentUser = authStore.user.username
      const localUser = getLocalUserMarker()
      const localData = localUser === currentUser
        ? collectLocalUserData()
        : { ...EMPTY_USER_DATA }
      const merged = mergeUserData(serverData, localData)

      applyUserData(merged)
      await saveUserData(merged)
      syncedForUser.value = currentUser
      setLocalUserMarker(currentUser)
    } catch (error) {
      console.error('从服务器加载用户数据失败:', error)
    } finally {
      syncing.value = false
    }
  }

  function clearLocalUserData() {
    const playerStore = usePlayerStore()
    const historyStore = useHistoryStore()

    playerStore.favorites = []
    historyStore.history = []
    localStorage.removeItem('radio-favorites')
    localStorage.removeItem('radio-history')
    localStorage.removeItem('radio-search-history')
    setLocalUserMarker(null)
  }

  function resetSyncState() {
    syncedForUser.value = null
  }

  function onLogout() {
    clearLocalUserData()
    resetSyncState()
  }

  registerUserDataPushHandler(schedulePushToServer)

  return {
    syncedForUser,
    syncing,
    collectLocalUserData,
    pullFromServer,
    pushToServer,
    schedulePushToServer,
    resetSyncState,
    onLogout
  }
})
