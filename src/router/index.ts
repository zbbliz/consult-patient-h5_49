import { createRouter, createWebHistory } from 'vue-router'

// 回顾： Vue2 的路由
//  1. import VueRouter from 'vue-router
//  2. const router = new VueRouter({ routes: [ 路由规则 ] })
//  3. 选择路由模式 hash /#/user   history /user

// 现在 Vue3
// 1. 创建路由实例 createRouter({ 配置对象 })
// 2. 配置选项中 routes: [ 路由规则 ]
// 3. createWebHistory 使用路由 history 模式
// 4. createWebHashHistory 使用路由 hash 模式 /#/
// 5. import.meta.env.BASE_URL 路由的基准路由 create-vue脚手架提供的数据（环境变量）

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/index.vue')
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/Home/index.vue')
        },
        {
          path: '/article',
          name: 'article',
          component: () => import('@/views/Article/index.vue')
        },
        {
          path: '/notify',
          name: 'notify',
          component: () => import('@/views/Notify/index.vue')
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/User/index.vue')
        }
      ]
    }
  ]
})

export default router
