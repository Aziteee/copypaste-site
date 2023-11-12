import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    name: 'index',
    path: '/',
    component: () => import('@pages/index.vue')
  },
  {
    name: 'search',
    path: '/search',
    component: () => import('@pages/search.vue')
  },
  {
    name: 'article',
    path: '/article/:id',
    component: () => import('@pages/article.vue')
  },
  {
    name: 'callback',
    path: '/callback',
    component: () => import('@pages/callback.vue')
  },
  {
    name: 'user',
    path: '/user/:id',
    component: () => import('@pages/user.vue')
  },
  {
    name: 'disclaimer',
    path: '/disclaimer',
    component: () => import('@pages/disclaimer.vue')
  },
  {
    name: 'random',
    path: '/random',
    component: () => import('@pages/random.vue')
  },
  {
    name: '404',
    path: '/:pathMatch(.*)*',
    component: () => import('@pages/404.vue')
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router
