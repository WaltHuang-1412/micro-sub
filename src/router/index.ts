import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/Home/index.vue'
import PlansView from '../views/Plans/index.vue'

// ✅ 根據實際網址來判斷 base path
const isProd = location.pathname.startsWith('/micro-root')
const basePath = isProd ? '/micro-root/sub' : '/sub'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/plans',
    name: 'plans',
    component: PlansView,
  },
]

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
})

export default router
