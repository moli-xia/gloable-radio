<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8 bg-ios-light-gray dark:bg-dark-bg">
    <div class="w-full max-w-md ios-card p-6 sm:p-8 shadow-ios">
      <div class="text-center mb-8">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-ios-blue text-white text-2xl font-bold">
          GR
        </div>
        <h1 class="text-2xl font-bold text-ios-dark-gray dark:text-dark-text">{{ t('routes.appTitle') }}</h1>
        <p class="mt-2 text-sm text-ios-gray dark:text-dark-secondary">{{ t('auth.loginPrompt') }}</p>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-ios-gray dark:text-dark-secondary mb-2">{{ t('auth.username') }}</label>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            class="ios-input"
            :placeholder="t('auth.usernamePlaceholder')"
            :disabled="authStore.loading"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-ios-gray dark:text-dark-secondary mb-2">{{ t('auth.password') }}</label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="ios-input"
            :placeholder="t('auth.passwordPlaceholder')"
            :disabled="authStore.loading"
          />
        </div>

        <p v-if="authStore.error" class="text-sm text-red-500">{{ authStore.error }}</p>

        <button
          type="submit"
          class="ios-button-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="authStore.loading || !username || !password"
        >
          {{ authStore.loading ? t('auth.loggingIn') : t('auth.login') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUserSyncStore } from '@/stores/userSync'
import { useLanguageStore } from '@/stores/language'

const authStore = useAuthStore()
const userSyncStore = useUserSyncStore()
const router = useRouter()
const route = useRoute()
const { t } = useLanguageStore()

const username = ref('')
const password = ref('')

async function handleSubmit() {
  const ok = await authStore.login(username.value, password.value)
  if (!ok) return

  await userSyncStore.pullFromServer(true)

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
  await router.replace(redirect || '/')
}
</script>
