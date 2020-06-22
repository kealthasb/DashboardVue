import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const gameRoutes: RouteConfig = {
  path: '/config',
  component: Layout,
  redirect: '/config/game-config',
  name: 'Config',
  meta: {
    title: 'config',
    icon: 'table'
  },
  children: [
    {
      path: 'game-config',
      component: () => import(/* webpackChunkName: "dynamic-table" */ '@/views/config/game-config.vue'),
      name: 'GameConfig',
      meta: { title: 'gameConfig' }
    },
    {
      path: 'platform-config',
      component: () => import(/* webpackChunkName: "draggable-table" */ '@/views/config/platform-config.vue'),
      name: 'PlatformConfig',
      meta: { title: 'platformConfig' }
    }
  ]
}

export default gameRoutes
