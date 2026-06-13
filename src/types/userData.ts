import type { FavoriteStation, HistoryItem } from '@/types/radio'

export interface UserSettings {
  volume: number
  muted: boolean
  themeMode: 'light' | 'dark'
  language: string
}

export interface UserData {
  version: number
  updatedAt: string
  favorites: FavoriteStation[]
  history: HistoryItem[]
  searchHistory: string[]
  settings: UserSettings
}

export const EMPTY_USER_DATA: UserData = {
  version: 1,
  updatedAt: new Date(0).toISOString(),
  favorites: [],
  history: [],
  searchHistory: [],
  settings: {
    volume: 0.8,
    muted: false,
    themeMode: 'light',
    language: 'zh'
  }
}
