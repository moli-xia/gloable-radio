import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  fetchCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  type AuthUser
} from '@/services/authApi'
import { useUserSyncStore } from '@/stores/userSync'
import { useLanguageStore } from '@/stores/language'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const initialized = ref(false)
  const loading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => !!user.value)

  async function restoreSession(): Promise<boolean> {
    loading.value = true
    error.value = ''

    try {
      user.value = await fetchCurrentUser()
      return true
    } catch {
      user.value = null
      return false
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function login(username: string, password: string): Promise<boolean> {
    loading.value = true
    error.value = ''

    try {
      const result = await loginRequest(username.trim(), password)
      user.value = result.user
      return true
    } catch {
      user.value = null
      error.value = useLanguageStore().t('auth.invalidCredentials')
      return false
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function logout(): Promise<void> {
    await logoutRequest()
    user.value = null
    error.value = ''
    useUserSyncStore().onLogout()
  }

  return {
    user,
    initialized,
    loading,
    error,
    isAuthenticated,
    restoreSession,
    login,
    logout
  }
})
