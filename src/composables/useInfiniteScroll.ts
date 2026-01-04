import { onMounted, onUnmounted, ref } from 'vue'

export function useInfiniteScroll(
  loadMore: () => Promise<void>,
  options: {
    threshold?: number
    isLoading?: () => boolean
    hasMore?: () => boolean
  } = {}
) {
  const {
    threshold = 200, // 距离底部多少像素时触发加载
    isLoading = () => false,
    hasMore = () => true
  } = options

  const isNearBottom = ref(false)

  const handleScroll = async () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight

    const distanceToBottom = documentHeight - (scrollTop + windowHeight)
    isNearBottom.value = distanceToBottom <= threshold

    // 如果接近底部且不在加载中且还有更多数据，则加载更多
    if (isNearBottom.value && !isLoading() && hasMore()) {
      try {
        await loadMore()
      } catch (error) {
        console.error('加载更多数据失败:', error)
      }
    }
  }

  // 节流函数
  let throttleTimer: number | null = null
  const throttledScroll = () => {
    if (throttleTimer) return
    
    throttleTimer = window.setTimeout(() => {
      handleScroll()
      throttleTimer = null
    }, 100)
  }

  onMounted(() => {
    window.addEventListener('scroll', throttledScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', throttledScroll)
    if (throttleTimer) {
      clearTimeout(throttleTimer)
    }
  })

  return {
    isNearBottom
  }
} 