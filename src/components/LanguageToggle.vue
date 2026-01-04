<template>
  <div class="language-toggle relative" ref="toggleRef">
    <!-- 当前语言按钮 -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-gray transition-all group mobile:px-1 sm:px-3 sm:gap-2"
      :title="languageStore.t('nav.language')"
    >
      <span class="text-lg mobile:text-base">{{ currentLanguageInfo.flag }}</span>
      <span class="text-sm font-medium text-ios-dark-gray dark:text-dark-text hidden sm:block mobile:text-xs">
        {{ currentLanguageInfo.nativeName }}
      </span>
      <ChevronDownIcon 
        class="w-4 h-4 text-ios-gray dark:text-dark-secondary transition-transform group-hover:text-ios-blue mobile:w-3 mobile:h-3"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>
    
    <!-- 紧凑型下拉菜单 -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="absolute top-full mt-2 max-h-80 overflow-y-auto bg-white dark:bg-dark-card rounded-lg shadow-lg dark:shadow-dark-ios border border-gray-200 dark:border-dark-gray z-50 w-56 sm:w-64 mobile:right-2 sm:right-0"
        style="min-width: 220px;"
      >
        <!-- 搜索框 -->
        <div class="p-3 border-b border-gray-100 dark:border-dark-gray">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="languageStore.t('nav.language') + '...'"
            class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-gray rounded-md focus:outline-none focus:ring-2 focus:ring-ios-blue focus:border-transparent"
          />
        </div>
        
        <!-- 语言列表 -->
        <div class="py-1 max-h-60 overflow-y-auto">
          <button
            v-for="language in filteredLanguages"
            :key="language.code"
            @click="selectLanguage(language.code)"
            class="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-dark-gray transition-colors text-left"
            :class="{
              'bg-ios-blue bg-opacity-10 text-ios-blue': currentLanguage === language.code,
              'text-ios-dark-gray dark:text-dark-text': currentLanguage !== language.code
            }"
          >
            <div class="flex items-center gap-3">
              <span class="text-base">{{ language.flag }}</span>
              <div>
                <div class="font-medium text-sm">{{ language.nativeName }}</div>
              <div class="text-xs text-ios-gray dark:text-dark-secondary">{{ language.name }}</div>
              </div>
            </div>
            <CheckIcon 
              v-if="currentLanguage === language.code"
              class="w-4 h-4 text-ios-blue flex-shrink-0"
            />
          </button>
        </div>
        
        <!-- 当前检测信息 -->
        <div v-if="isAutoDetected" class="px-3 py-2 border-t border-gray-100 dark:border-dark-gray bg-gray-50 dark:bg-dark-bg">
          <div class="flex items-center gap-2 text-xs text-ios-gray dark:text-dark-secondary">
            <LocationMarkerIcon class="w-3 h-3" />
            <span>自动检测</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useLanguageStore, type SupportedLanguage } from '@/stores/language'
import {
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import { MapPinIcon as LocationMarkerIcon } from '@heroicons/vue/24/solid'

const languageStore = useLanguageStore()
const { supportedLanguages, setLanguage } = languageStore
const currentLanguage = computed(() => languageStore.currentLanguage)
const currentLanguageInfo = computed(() => languageStore.currentLanguageInfo)
const isAutoDetected = computed(() => languageStore.isAutoDetected)

const isOpen = ref(false)
const toggleRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const searchQuery = ref('')

// 过滤语言列表
const filteredLanguages = computed(() => {
  if (!searchQuery.value) {
    return supportedLanguages
  }
  
  const query = searchQuery.value.toLowerCase()
  return supportedLanguages.filter(lang => 
    lang.nativeName.toLowerCase().includes(query) ||
    lang.name.toLowerCase().includes(query) ||
    lang.code.toLowerCase().includes(query)
  )
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const selectLanguage = (language: SupportedLanguage) => {
  setLanguage(language)
  isOpen.value = false
  searchQuery.value = ''
}

const closeDropdown = (event: Event) => {
  const target = event.target as Node
  const clickedToggle = !!toggleRef.value?.contains(target)
  const clickedDropdown = !!dropdownRef.value?.contains(target)

  if (!clickedToggle && !clickedDropdown) {
    isOpen.value = false
    searchQuery.value = ''
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.language-toggle {
  user-select: none;
}

/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
