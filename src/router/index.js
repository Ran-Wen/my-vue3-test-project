import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layout/index.vue'), 
      redirect: '/fixedData',
      children: [
        {
          path: '/fixedData',
          name: 'fixedData',
          component: () => import('@/views/fixedData/index.vue'),
          meta: { title: '定时提前数据管理' },
        },
        {
          path: '/map',
          name: 'map',
          component: () => import('@/views/map/index.vue'),
          meta: { title: '地图展示' },
        },
      ],
    },
  ],
})

export default router
