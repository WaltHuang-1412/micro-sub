import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/Home/index.vue'
import TodoView from '../views/Todo/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/todo',
    name: 'todo',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: TodoView,
  },
]

const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? '/micro-root/sub' : '/sub'

const router = createRouter({
  history: createWebHistory(basePath),
  routes,
})

export default router
