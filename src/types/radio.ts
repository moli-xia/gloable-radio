export interface RadioStation {
  stationuuid: string
  name: string
  url: string
  url_resolved: string
  homepage: string
  favicon: string
  tags: string
  country: string
  countrycode: string
  state: string
  language: string
  languagecodes: string
  votes: number
  lastchangetime: string
  lastchangetime_iso8601: string
  codec: string
  bitrate: number
  hls: number
  lastcheckok: number
  lastchecktime: string
  lastchecktime_iso8601: string
  lastcheckoktime: string
  lastcheckoktime_iso8601: string
  lastlocalchecktime: string
  lastlocalchecktime_iso8601: string
  clicktimestamp: string
  clicktimestamp_iso8601: string
  clickcount: number
  clicktrend: number
  ssl_error: number
  geo_lat: number | null
  geo_long: number | null
  has_extended_info: boolean
}

export interface RadioSearchParams {
  name?: string
  country?: string
  countrycode?: string
  state?: string
  language?: string
  tag?: string
  codec?: string
  bitrateMin?: number
  bitrateMax?: number
  order?: 'name' | 'url' | 'homepage' | 'favicon' | 'tags' | 'country' | 'state' | 'language' | 'votes' | 'codec' | 'bitrate' | 'lastcheckok' | 'lastchecktime' | 'clicktimestamp' | 'clickcount' | 'clicktrend' | 'random'
  reverse?: boolean
  offset?: number
  limit?: number
  hidebroken?: boolean
}

export interface Country {
  name: string
  iso_3166_1: string
  stationcount: number
}

export interface Language {
  name: string
  iso_639: string
  stationcount: number
}

export interface Tag {
  name: string
  stationcount: number
}

export interface PlayerState {
  isPlaying: boolean
  currentStation: RadioStation | null
  volume: number
  isMuted: boolean
  isLoading: boolean
  error: string | null
}

export interface FavoriteStation {
  stationuuid: string
  name: string
  url: string
  favicon: string
  country: string
  addedAt: string
}

export interface HistoryItem {
  station: RadioStation
  timestamp: number
  playDuration?: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  source: string
}