

/**
 * 路由参数说明
 * router.d.ts
**/

import { base, exportPagesRoutesConfig } from './utils'
import layout from '@/layout/index.vue'

// 示例
export const examples = [

]

export const demo = [

]

// 固定显示路由 不受权限控制
export const constantRoutes = [
  ...( base.length ? [ {
    path: '/',
    redirect: `${ base }/`,
  } ] : [] ),
  {
    path: `${ base }/login`,
    name: 'login',
    meta: { title: 'login', hidden: true },
    component: () => import( '@/views/login/index.vue' )
  }, {
    path: `${ base }/error`,
    name: 'error',
    component: () => import( '@/views/404/index.vue' ),
  }, {
    path: `${ base }/redirect`,
    component: layout,
    children: [
      {
        path: `${ base }/redirect/:path*`,
        name: 'redirect',
        component: () => import( '@/views/redirect/index.vue' )
      }
    ]
  }, {
    path: `${ base }/`,
    component: layout,
    redirect: `${ base }/home`,
    children: [
      {
        path: 'home',
        component: () => import( '@/views/home.vue' ),
        name: 'home',
        meta: { title: 'home', hidden: true, icon: 'home', affix: true }
      }, {
        path: 'changepwd',
        component: () => import( '@/views/change-password/index.vue' ),
        name: 'ChangePwd',
        meta: { title: 'changePwd' }
      }
    ]
  }, {
    // 解决路由爆[Vue Router warn]: No match found for location with path
    path: '/:pathMatch(.*)*',
    meta: { title: 'notfound', hidden: true },
    // redirect: '/403', // 错误方式，刷新立马会导致进入守卫的页面
    // 切记不要使用 redirect: '/403',
    component: () => import( '@/views/404/index.vue' ),
  },

  ...examples,
  ...demo,
]



// 动态导出路由配置
const exportAsyncRoutes = exportPagesRoutesConfig()

export const asyncRoutes = [
  ...exportAsyncRoutes,
]
