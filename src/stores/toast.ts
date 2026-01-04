import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])

  const showToast = (message: string, type: ToastMessage['type'] = 'info', duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    const toast: ToastMessage = {
      id,
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)
    
    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  // 便捷方法
  const showSuccess = (message: string, duration?: number) => {
    return showToast(message, 'success', duration)
  }

  const showError = (message: string, duration?: number) => {
    return showToast(message, 'error', duration)
  }

  const showWarning = (message: string, duration?: number) => {
    return showToast(message, 'warning', duration)
  }

  const showInfo = (message: string, duration?: number) => {
    return showToast(message, 'info', duration)
  }

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}) 