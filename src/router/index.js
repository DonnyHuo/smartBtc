import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView/index.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/swap',
    name: 'swap',
    component: () => import(/* webpackChunkName: "about" */ '../views/SwapView/index.vue')
  },
  {
    path: '/options',
    name: 'options',
    redirect:'/options/trade',
    component: () => import(/* webpackChunkName: "about" */ '../views/OptionsView/index.vue'),
    children: [
      {
        path: 'trade',
        name: 'trade',
        component: () => import(/* webpackChunkName: "about" */ '../views/OptionsView/Trade/index.vue'),
      },
      {
        path: 'pool',
        name: 'pool',
        component: () => import(/* webpackChunkName: "about" */ '../views/OptionsView/Pool/index.vue'),
      }
    ]
  },
  {
    path: '/public',
    name: 'public',
    component: () => import(/* webpackChunkName: "about" */ '../views/OptionsView/Pool/public.vue'),
  },
  {
    path: '/private',
    name: 'private',
    component: () => import(/* webpackChunkName: "about" */ '../views/OptionsView/Pool/private.vue'),
  },
  
  {
    path: '/lp',
    name: 'lp',
    component: () => import(/* webpackChunkName: "about" */ '../views/LpView/index.vue')
  },
  {
    path: '/lpDetail',
    name: 'lpDetail',
    component: () => import(/* webpackChunkName: "about" */ '../views/LpView/LpDetail.vue')
  },
  {
    path: '/share',
    name: 'share',
    component: () => import(/* webpackChunkName: "about" */ '../views/ShareView/index.vue')
  },
  {
    path: '/partner',
    name: 'partnerList',
    component: () => import(/* webpackChunkName: "about" */ '../views/ShareView/partnerList.vue')
  },
  {
    path: '/withdraw',
    name: 'withdraw',
    component: () => import(/* webpackChunkName: "about" */ '../views/Withdraw/index.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
