<template>
  <Teleport to="body">
    <div class="fixed top-4 left-4 right-4 z-50 space-y-2 pointer-events-none">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          class="pointer-events-auto mx-auto max-w-sm"
        >
          <div 
            class="px-4 py-3 rounded-ios shadow-ios-lg flex items-center gap-3"
            :class="getToastClasses(toast.type)"
          >
            <component :is="getIconComponent(toast.type)" class="w-5 h-5 flex-shrink-0" />
            <div class="flex-1">
              <p class="text-sm font-medium">{{ toast.message }}</p>
            </div>
            <button
              @click="toastStore.removeToast(toast.id)"
              class="p-1 rounded-full transition-colors"
              :class="getButtonClasses(toast.type)"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const toastStore = useToastStore()

const getIconComponent = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
      return XCircleIcon
    case 'warning':
      return ExclamationTriangleIcon
    case 'info':
      return InformationCircleIcon
    default:
      return InformationCircleIcon
  }
}

const getToastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-ios-green text-white'
    case 'error':
      return 'bg-ios-red text-white'
    case 'warning':
      return 'bg-orange-500 text-white'
    case 'info':
      return 'bg-ios-blue text-white'
    default:
      return 'bg-ios-blue text-white'
  }
}

const getButtonClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'hover:bg-green-600'
    case 'error':
      return 'hover:bg-red-600'
    case 'warning':
      return 'hover:bg-orange-600'
    case 'info':
      return 'hover:bg-blue-600'
    default:
      return 'hover:bg-blue-600'
  }
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style> 