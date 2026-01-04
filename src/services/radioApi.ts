import axios, { AxiosInstance } from 'axios'
import type { RadioStation, RadioSearchParams, ApiResponse, Country, Language, Tag } from '../types/radio'

// API provider interface
interface APIProvider {
  name: string
  baseURL: string
  type: 'radio-browser'
  isAvailable: boolean
  priority: number
}

class RadioAPI {
  private apiProviders: APIProvider[] = [
    // Radio Browser API (primary)
    { name: 'Radio Browser US1', baseURL: 'https://us1.api.radio-browser.info', type: 'radio-browser', isAvailable: true, priority: 1 },   
    { name: 'Radio Browser DE1', baseURL: 'https://de1.api.radio-browser.info', type: 'radio-browser', isAvailable: true, priority: 1 },
    { name: 'Radio Browser NL1', baseURL: 'https://nl1.api.radio-browser.info', type: 'radio-browser', isAvailable: true, priority: 1 },
    { name: 'Radio Browser FR1', baseURL: 'https://fr1.api.radio-browser.info', type: 'radio-browser', isAvailable: true, priority: 1 },
    { name: 'Radio Browser AT1', baseURL: 'https://at1.api.radio-browser.info', type: 'radio-browser', isAvailable: true, priority: 1 },
    { name: 'Radio Browser ALL', baseURL: 'https://all.api.radio-browser.info', type: 'radio-browser', isAvailable: true, priority: 1 }
  ]
  
  private userAgent = 'RadioApp/1.0'
  private currentAPI: AxiosInstance
  private currentProvider: APIProvider
  private initializationPromise: Promise<void> | null = null
  private isInitialized = false
  private debugEnabled = !!(import.meta as any).env?.DEV

  constructor() {
    this.currentProvider = this.apiProviders[0]
    this.currentAPI = this.createAPIInstance(this.currentProvider)
    // 开始异步初始化，但不阻塞构造函数
    this.initializationPromise = this.initializeAPI()
  }

  private createAPIInstance(provider: APIProvider): AxiosInstance {
    return axios.create({
      baseURL: provider.baseURL,
      timeout: 10000,
      headers: {
        'User-Agent': this.userAgent
      }
    })
  }

  private async initializeAPI(): Promise<void> {
    if (this.isInitialized) {
      return
    }
    
    try {
      if (this.debugEnabled) console.log('Initializing API providers...')
      const workingProvider = await this.findWorkingAPI()
      if (workingProvider) {
        this.currentProvider = workingProvider
        this.currentAPI = this.createAPIInstance(workingProvider)
        if (this.debugEnabled) console.log(`Successfully initialized API: ${workingProvider.name} (${workingProvider.baseURL})`)
      } else {
        console.warn('No working API found, using default provider')
        // 即使没有找到可用的API，也标记为已初始化，避免无限重试
      }
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize API:', error)
      this.isInitialized = true // 标记为已初始化，避免无限重试
    }
  }

  private async findWorkingAPI(): Promise<APIProvider | null> {
    // Sort providers by priority
    const sortedProviders = [...this.apiProviders].sort((a, b) => a.priority - b.priority)
    
    for (const provider of sortedProviders) {
      try {
        const instance = this.createAPIInstance(provider)
        
        // Test radio-browser endpoint
        if (provider.type === 'radio-browser') {
          await instance.get('/json/stations/topvote/1')
        }

        if (this.debugEnabled) console.log(`Successfully connected to: ${provider.name}`)
        provider.isAvailable = true

        return provider
      } catch (error: any) {
        if (this.debugEnabled) console.log(`Failed to connect to ${provider.name}:`, error.message)
        provider.isAvailable = false
      }
    }
    return null
  }

  // 确保API已初始化
  private async ensureInitialized(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise
      this.initializationPromise = null
    }
  }

  // 公共方法：等待API初始化完成
  async waitForInitialization(): Promise<void> {
    await this.ensureInitialized()
  }

  // 检查API是否已初始化
  isAPIInitialized(): boolean {
    return this.isInitialized && !this.initializationPromise
  }

  private async retryWithFallback<T>(operation: () => Promise<T>, fallbackOperation?: () => T): Promise<T> {
    // 确保API已初始化
    await this.ensureInitialized()
    
    try {
      return await operation()
    } catch (error) {
      console.warn(`API request failed on ${this.currentProvider.name}, trying fallback providers...`)
      
      // Sort available providers by priority
      const availableProviders = this.apiProviders
        .filter(p => p.isAvailable && p !== this.currentProvider)
        .sort((a, b) => a.priority - b.priority)
      
      // Try other providers
      for (const provider of availableProviders) {
        try {
          if (this.debugEnabled) console.log(`Trying fallback provider: ${provider.name}`)
          this.currentProvider = provider
          this.currentAPI = this.createAPIInstance(provider)
          
          return await operation()
        } catch (fallbackError) {
          if (this.debugEnabled) console.log(`Fallback ${provider.name} also failed`)
          provider.isAvailable = false
        }
      }
      
      // 如果所有API提供商都失败，使用回退操作（如模拟数据）
      if (fallbackOperation) {
        console.warn('All API providers failed, using fallback operation')
        return fallbackOperation()
      }
      
      throw error
    }
  }



  // Search stations - 优化的中文搜索支持
  async searchStations(params: RadioSearchParams = {}): Promise<RadioStation[]> {
    return this.retryWithFallback(async () => {
      // 构建搜索参数，确保中文字符正确处理
      const searchParams: any = {}
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          let processedValue = value.toString().trim()
          
          // 检测是否为中文字符
          const hasChinese = /[\u4e00-\u9fff]/.test(processedValue)
          
          if (hasChinese) {
            if (this.debugEnabled) console.log(`检测到中文搜索: ${processedValue}`)
            // 对中文进行标准化处理
            processedValue = processedValue.normalize('NFC')
          }
          
          searchParams[key] = processedValue
        }
      })

      if (this.debugEnabled) console.log('搜索参数:', searchParams)
      
      const response = await this.currentAPI.get('/json/stations/search', {
        params: searchParams,
        headers: {
          'Accept-Charset': 'UTF-8',
          'Content-Type': 'application/json; charset=UTF-8',
          'User-Agent': this.userAgent
        },
        // 确保axios正确处理URL编码
        paramsSerializer: {
          encode: (param: string) => {
            // 让axios自动处理编码，支持中文
            return encodeURIComponent(param)
          }
        }
      })
      
      if (this.debugEnabled) console.log(`搜索结果数量: ${response.data.length}`)
      return response.data || []
    })
  }

  // Get popular stations
  async getTopStations(limit: number = 50, userLanguage?: string): Promise<ApiResponse<RadioStation[]>> {
    return this.retryWithFallback(async () => {
      if (this.debugEnabled) console.log(`Getting top stations (limit: ${limit}, language: ${userLanguage})`)
      
      if (this.currentProvider.type === 'radio-browser') {
        // Recommend stations based on user language
        if (userLanguage === 'zh') {
          if (this.debugEnabled) console.log('User language is Chinese, getting Chinese music stations...')
          const musicStations = await this.searchStations({
            language: 'chinese',
            tag: 'music',
            order: 'random',
            limit: limit * 2,
            hidebroken: true
          })
          
          // If Chinese stations are insufficient, supplement with stations from China
          if (musicStations.length < limit) {
            const additionalStations = await this.searchStations({
              countrycode: 'CN',
              order: 'random',
              limit: (limit - musicStations.length) * 2,
              hidebroken: true
            })
            
            // Merge and deduplicate
            const existingUuids = new Set(musicStations.map(s => s.stationuuid))
            const filteredAdditional = additionalStations.filter(s => !existingUuids.has(s.stationuuid))
            musicStations.push(...filteredAdditional)
          }
          
          const shuffled = musicStations.sort(() => 0.5 - Math.random())
          return {
            success: true,
            data: shuffled.slice(0, limit),
            source: 'radio-browser'
          }
        }
        
        // Station recommendations for other languages
        const languageMap: Record<string, { language?: string, countries?: string[] }> = {
          'es': { language: 'spanish', countries: ['ES', 'MX', 'AR', 'CO'] },
          'fr': { language: 'french', countries: ['FR'] },
          'de': { language: 'german', countries: ['DE'] },
          'ja': { language: 'japanese', countries: ['JP'] },
          'ko': { language: 'korean', countries: ['KR'] },
          'ru': { language: 'russian', countries: ['RU'] },
          'ar': { language: 'arabic', countries: ['SA', 'AE', 'EG'] },
          'pt': { language: 'portuguese', countries: ['BR', 'PT'] },
          'it': { language: 'italian', countries: ['IT'] },
          'hi': { language: 'hindi', countries: ['IN'] },
          'th': { language: 'thai', countries: ['TH'] },
          'vi': { language: 'vietnamese', countries: ['VN'] }
        }
        
        const langConfig = languageMap[userLanguage || 'en']
        let musicStations: RadioStation[] = []
        
        if (langConfig) {
          if (this.debugEnabled) console.log(`Getting stations for language: ${userLanguage}`)
          
          // First try searching by language
          if (langConfig.language) {
            musicStations = await this.searchStations({
              language: langConfig.language,
              order: 'random',
              limit: limit,
              hidebroken: true
            })
          }
          
          // If language search results are insufficient, search by country
          if (musicStations.length < limit && langConfig.countries) {
            for (const country of langConfig.countries) {
              if (musicStations.length >= limit) break
              
              const countryStations = await this.searchStations({
                countrycode: country,
                order: 'random',
                limit: limit - musicStations.length,
                hidebroken: true
              })
              
              // Merge and deduplicate
              const existingUuids = new Set(musicStations.map(s => s.stationuuid))
              const filteredCountryStations = countryStations.filter(s => !existingUuids.has(s.stationuuid))
              musicStations.push(...filteredCountryStations)
            }
          }
          
          if (musicStations.length > 0) {
            const shuffled = musicStations.sort(() => 0.5 - Math.random())
            return {
              success: true,
              data: shuffled.slice(0, limit),
              source: 'radio-browser'
            }
          }
        }
        
        // Default to international music stations
        if (this.debugEnabled) console.log('Getting default international music stations...')
        const defaultStations = await this.searchStations({
          tag: 'music',
          order: 'clickcount',
          reverse: true,
          limit: limit,
          hidebroken: true
        })
        
        const shuffled = defaultStations.sort(() => 0.5 - Math.random())
        return {
          success: true,
          data: shuffled.slice(0, limit),
          source: 'radio-browser'
        }
      }
      
      return {
        success: false,
        data: [],
        source: 'unknown'
      }
    })
  }

  // Get latest stations
  async getLatestStations(limit: number = 50): Promise<RadioStation[]> {
    return this.retryWithFallback(async () => {
      if (this.debugEnabled) console.log(`Getting latest stations (limit: ${limit})`)
      
      const stations = await this.searchStations({
        order: 'lastchecktime',
        reverse: true,
        limit: limit,
        hidebroken: true
      })
      if (this.debugEnabled) console.log(`Got ${stations.length} latest stations`)
      return stations
    }, () => {
      // 回退：API不可用时返回空数组
      if (this.debugEnabled) console.log('API不可用，无备用数据')
      return []
    })
  }

  // Get random stations
  async getRandomStations(limit: number = 50): Promise<ApiResponse<RadioStation[]>> {
    return this.retryWithFallback(async () => {
      const stations = await this.searchStations({
        order: 'random',
        limit: limit,
        hidebroken: true
      })
      
      return {
        success: true,
        data: stations,
        source: 'radio-browser'
      }
    }, () => {
      // 回退：API不可用时返回空数组
      if (this.debugEnabled) console.log('API不可用，无备用数据')
      return {
        success: true,
        data: [],
        source: 'fallback'
      }
    })
  }

  // Get stations by country
  async getStationsByCountry(countryCode: string, limit: number = 50): Promise<ApiResponse<RadioStation[]>> {
    return this.retryWithFallback(async () => {
      const response = await this.currentAPI.get(`/json/stations/bycountrycodeexact/${countryCode}`, {
        params: { limit }
      })
      return {
        success: true,
        data: response.data,
        source: 'radio-browser'
      }
    })
  }

  // Get random local stations
  async getRandomLocalStations(countryCode: string, limit: number = 20): Promise<RadioStation[]> {
    return this.retryWithFallback(async () => {
      if (this.debugEnabled) console.log(`Getting random local stations (country: ${countryCode}, limit: ${limit})`)
      
      const allStations = await this.searchStations({
        countrycode: countryCode,
        order: 'random',
        limit: limit,
        hidebroken: true
      })
      
      if (this.debugEnabled) console.log(`Got ${allStations.length} ${countryCode} stations`)
      return allStations
    })
  }

  // Get stations by tag
  async getStationsByTag(tag: string, limit = 100): Promise<RadioStation[]> {
    return this.retryWithFallback(async () => {
      return this.searchStations({ tag, limit, hidebroken: true, order: 'clickcount', reverse: true })
    })
  }

  // Get countries
  async getCountries(): Promise<ApiResponse<Country[]>> {
    return this.retryWithFallback(async () => {
      const response = await this.currentAPI.get('/json/countries')
      return {
        success: true,
        data: response.data,
        source: 'radio-browser'
      }
    })
  }

  // Get languages
  async getLanguages(): Promise<Language[]> {
    return this.retryWithFallback(async () => {
      const response = await this.currentAPI.get('/json/languages')
      return response.data.sort((a: Language, b: Language) => b.stationcount - a.stationcount)
    })
  }

  // Get tags
  async getTags(): Promise<Tag[]> {
    return this.retryWithFallback(async () => {
      const response = await this.currentAPI.get('/json/tags')
      return response.data
        .filter((tag: Tag) => tag.stationcount > 10)
        .sort((a: Tag, b: Tag) => b.stationcount - a.stationcount)
        .slice(0, 100)
    })
  }

  // Record click
  async recordClick(stationUuid: string): Promise<void> {
    return this.retryWithFallback(async () => {
      if (this.currentProvider.type === 'radio-browser') {
        await this.currentAPI.get(`/json/url/${stationUuid}`)
      } else {
        // Other API providers may not support click recording, silently ignore
        if (this.debugEnabled) console.log(`Click recording not supported for ${this.currentProvider.name}`)
      }
    })
  }

  // Vote for station
  async voteForStation(stationUuid: string): Promise<boolean> {
    return this.retryWithFallback(async () => {
      if (this.currentProvider.type === 'radio-browser') {
        const response = await this.currentAPI.get(`/json/vote/${stationUuid}`)
        return response.data.ok === 'true'
      } else {
        // Other API providers may not support voting, silently ignore
        if (this.debugEnabled) console.log(`Voting not supported for ${this.currentProvider.name}`)
        return false
      }
    })
  }



  // Get station by UUID
  async getStationByUUID(uuid: string): Promise<RadioStation | null> {
    return this.retryWithFallback(async () => {
      const response = await this.currentAPI.get<RadioStation[]>(`/json/stations/byuuid/${uuid}`)
      return response.data.length > 0 ? response.data[0] : null
    })
  }

  // 获取API状态
  async getAPIStatus(): Promise<any> {
    return this.retryWithFallback(async () => {
      const response = await this.currentAPI.get('/json/stats')
      return {
        ...response.data,
        provider: this.currentProvider.name,
        type: this.currentProvider.type
      }
    })
  }

  // 刷新API连接
  async refreshAPIConnection(): Promise<void> {
    if (this.debugEnabled) console.log('Refreshing API connection...')
    this.isInitialized = false
    this.initializationPromise = this.initializeAPI()
    await this.initializationPromise
    this.initializationPromise = null
  }

  // 获取当前API提供商信息
  getCurrentProvider(): APIProvider {
    return this.currentProvider
  }

  // 获取所有API提供商状态
  getAllProvidersStatus(): APIProvider[] {
    return this.apiProviders
  }

  // 手动切换到指定的API提供商
  async switchToProvider(providerName: string): Promise<boolean> {
    const provider = this.apiProviders.find(p => p.name === providerName)
    if (!provider) {
      console.error(`Provider ${providerName} not found`)
      return false
    }

    try {
      this.currentProvider = provider
      this.currentAPI = this.createAPIInstance(provider)
      
      // 测试连接
      await this.currentAPI.get('/json/stations/topvote/1')
      
      provider.isAvailable = true
      if (this.debugEnabled) console.log(`Successfully switched to provider: ${providerName}`)
      return true
    } catch (error) {
      console.error(`Failed to switch to provider ${providerName}:`, error)
      provider.isAvailable = false
      return false
    }
  }
}

export const radioAPI = new RadioAPI()
