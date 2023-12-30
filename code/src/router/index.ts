
import { createRouter, /* createWebHistory, */ createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { constantRoutes } from './routes'
import { useAuthStore } from '@/stores'

// 2. 配置路由
const routes: Array<RouteRecordRaw> = constantRoutes

// 1.返回一个 router 实列，为函数，里面有配置项（对象） history
const router = createRouter( {
  // 去除vue访问页面时的#/
  history: createWebHashHistory(),
  routes,
  scrollBehavior( _to, _from, savedPosition ) {
    // savedPosition 会在你使用浏览器前进或后退按钮时候生效
   // 这个跟你使用 router.go() 或 router.back() 效果一致
   // 这也是为什么我在 tab 栏结构中放入了一个 点击回退 的按钮
   if ( savedPosition ) {
      return savedPosition
    } else {
      const dom = document.querySelector( '.app-main' )
      if ( dom ) {
        dom.scrollTop = 0
      }
      // 如果不是通过上述行为切换组件，就会让页面回到顶部
      return { left: 0, top: 0 }
    }
  }
} )


// 重置路由 移除动态添加路由
export function resetRouter() {
  const addRoutes = useAuthStore().addRoutes
  addRoutes.forEach( ( { name }: { name: string }  ) => {
    if ( router.hasRoute( name ) ) {
      router.removeRoute( name )
    }
  } )
}

// 3导出路由   然后去 main.ts 注册 router.ts
export default router