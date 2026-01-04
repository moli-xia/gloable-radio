import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { createSimpleTranslations } from '@/config/simple-translations'

export type SupportedLanguage = 'zh' | 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'ru' | 'ar' | 'pt' | 'it' | 'hi' | 'th' | 'vi'

export interface LanguageOption {
  code: SupportedLanguage
  name: string
  nativeName: string
  flag: string
}

export const supportedLanguages: LanguageOption[] = [
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: 'CN'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: 'US'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: 'ES'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: 'FR'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: 'DE'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: 'JP'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: 'KR'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: 'RU'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: 'SA'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: 'BR'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: 'IT'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: 'IN'
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: 'TH'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: 'VN'
  }
]

// 创建所有语言的翻译
export const translations = createSimpleTranslations()

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = ref<SupportedLanguage>('zh')
  const isAutoDetected = ref(false)
  
  // 获取当前语言的翻译
  const t = computed(() => {
    return (key: string) => {
      const keys = key.split('.')
      let value: any = translations[currentLanguage.value]
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          console.warn(`Translation key not found: ${key}`)
          return key
        }
      }
      
      return typeof value === 'string' ? value : key
    }
  })
  
  // 获取当前语言信息
  const currentLanguageInfo = computed(() => {
    return supportedLanguages.find(lang => lang.code === currentLanguage.value) || supportedLanguages[0]
  })
  
  // 设置语言
  const setLanguage = (language: SupportedLanguage) => {
    currentLanguage.value = language
    isAutoDetected.value = false
    localStorage.setItem('radio-language', language)
  }
  
  // 自动检测语言（基于系统语言）
  const autoDetectLanguage = async () => {
    try {
      console.log('开始语言自动检测...')
      
      // 首先检查本地存储
      const savedLanguage = localStorage.getItem('radio-language') as SupportedLanguage
      if (savedLanguage && supportedLanguages.some(lang => lang.code === savedLanguage)) {
        console.log('使用本地存储的语言设置:', savedLanguage)
        currentLanguage.value = savedLanguage
        return
      }
      
      console.log('本地存储无语言设置，使用系统语言检测...')
      
      // 直接使用浏览器/系统语言
      const browserLanguage = navigator.language.toLowerCase()
      console.log('系统语言:', browserLanguage)
      
      // 检测浏览器语言并映射到支持的语言
      let detectedLang: SupportedLanguage = 'en'
      if (browserLanguage.startsWith('zh')) {
        detectedLang = 'zh'
      } else if (browserLanguage.startsWith('es')) {
        detectedLang = 'es'
      } else if (browserLanguage.startsWith('fr')) {
        detectedLang = 'fr'
      } else if (browserLanguage.startsWith('de')) {
        detectedLang = 'de'
      } else if (browserLanguage.startsWith('ja')) {
        detectedLang = 'ja'
      } else if (browserLanguage.startsWith('ko')) {
        detectedLang = 'ko'
      } else if (browserLanguage.startsWith('ru')) {
        detectedLang = 'ru'
      } else if (browserLanguage.startsWith('ar')) {
        detectedLang = 'ar'
      } else if (browserLanguage.startsWith('pt')) {
        detectedLang = 'pt'
      } else if (browserLanguage.startsWith('it')) {
        detectedLang = 'it'
      } else if (browserLanguage.startsWith('hi')) {
        detectedLang = 'hi'
      } else if (browserLanguage.startsWith('th')) {
        detectedLang = 'th'
      } else if (browserLanguage.startsWith('vi')) {
        detectedLang = 'vi'
      }
      
      console.log(`系统语言检测结果：${browserLanguage} -> ${detectedLang}`)
      currentLanguage.value = detectedLang
      isAutoDetected.value = true
      
      // 保存到本地存储
      localStorage.setItem('radio-language', currentLanguage.value)
      console.log('语言设置已保存到本地存储:', currentLanguage.value)
    } catch (error) {
      console.warn('语言自动检测失败:', error)
      // 默认使用英语
      currentLanguage.value = 'en'
      isAutoDetected.value = true
      localStorage.setItem('radio-language', currentLanguage.value)
      console.log('使用默认语言设置:', currentLanguage.value)
    }
  }
  
  // 初始化语言
  const initLanguage = async () => {
    await autoDetectLanguage()
  }
  
  return {
    currentLanguage,
    isAutoDetected,
    currentLanguageInfo,
    supportedLanguages,
    t,
    setLanguage,
    autoDetectLanguage,
    initLanguage
  }
})
