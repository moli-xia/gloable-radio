import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Favorites from '@/views/Favorites.vue'
import History from '@/views/History.vue'
import Login from '@/views/Login.vue'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        titleKey: 'routes.login',
        public: true
      }
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        titleKey: 'routes.home'
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {
        titleKey: 'routes.search'
      }
    },
    {
      path: '/history',
      name: 'History',
      component: History,
      meta: {
        titleKey: 'routes.history'
      }
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: Favorites,
      meta: {
        titleKey: 'routes.favorites'
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: {
        titleKey: 'routes.settings'
      }
    },
    {
      path: '/station/:uuid',
      name: 'StationDetail',
      component: () => import('@/views/StationDetail.vue'),
      meta: {
        titleKey: 'routes.stationDetail'
      }
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const languageStore = useLanguageStore()

  if (!authStore.initialized) {
    await authStore.restoreSession()
  }

  if (typeof to.meta.titleKey === 'string') {
    document.title = `${languageStore.t(to.meta.titleKey)} - ${languageStore.t('routes.appTitle')}`
  }

  if (to.meta.public) {
    if (to.name === 'Login' && authStore.isAuthenticated) {
      next(typeof to.query.redirect === 'string' ? to.query.redirect : '/')
      return
    }
    next()
    return
  }

  if (!authStore.isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
})

export default router
