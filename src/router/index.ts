import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Search from '@/views/Search.vue'
import Favorites from '@/views/Favorites.vue'
import History from '@/views/History.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      meta: {
        title: '搜索'
      }
    },
    {
      path: '/history',
      name: 'History',
      component: History,
      meta: {
        title: '足迹'
      }
    },
    {
      path: '/favorites',
      name: 'Favorites',
      component: Favorites,
      meta: {
        title: '收藏'
      }
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/views/Settings.vue'),
      meta: {
        title: '设置'
      }
    },
    {
      path: '/station/:uuid',
      name: 'StationDetail',
      component: () => import('@/views/StationDetail.vue'),
      meta: {
        title: '电台详情'
      }
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    // 如果有保存的滚动位置（如按了后退按钮），恢复到该位置
    if (savedPosition) {
      return savedPosition
    }
    // 否则滚动到页面顶部
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
          document.title = `${to.meta.title} - 全球电台`
  }
  next()
})

export default router
