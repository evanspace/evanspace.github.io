/* *
 * @description: 权限控制
 * @file: permission.ts
 * @author: Evan
 * @date: 2023.07.15 15:20:26
 * @week: 周六
 * @version: V
 * */
import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { base } from '@/router/utils'

NProgress.configure({ showSpinner: false })

import { useAuthStore, useAppStore, useUserStore } from '@/stores'
import i18n from '@/locales'
const { t } = i18n.global

/* axios service */
import { Server } from '@axios'

/* 添加请求拦截器 */
Server.interceptors.request.use(
  (config: any) => {
    // 挂载 pinia 之后执行 否则报错
    let token = useUserStore().token
    if (token) {
      // token放请求头中传递给后台
      config.headers['Authorization'] = token
    }
    return config
  },
  (er: any) => {
    return Promise.reject(er)
  }
)

/* 添加响应拦截器 */
Server.interceptors.response.use(
  (response: any) => {
    //登录态失效，统一退出跳转到登录页面 （20010020：获取登录用户信息失败）
    if (response.data?.code === 20010090) {
      useUserStore()
        .resetToken()
        .then(() => {
          window.location.reload()
        })
    }
    return response
  },
  (er: any) => {
    return Promise.reject(er)
  }
)

/* 路由拦截器 */
router.beforeEach(async (to, _from, next) => {
  // 开始加载进度条
  NProgress.start()

  // 设置页面标题
  const dom: any = document
  const title = to.meta.title
  const appStore = useAppStore()
  if (appStore.i18n) {
    dom.title = title ? t(`route.${title}`).toUpperCase() : 'loading...'
  } else {
    dom.title = title
  }
  if (!appStore.historyRoutes.includes(_from.path)) {
    appStore.historyRoutes.push(_from.path)
  }

  const userStore = useUserStore()
  // 判断用户是否登录
  const token = userStore.token
  const loginPath = `${base}/login`
  if (token) {
    if (to.path == loginPath) {
      // 已登录直接重定向到首页
      next({ path: `${base}/` })
      NProgress.done()
    } else {
      // 判断路由是否指向 系统
      if (to.path == `${base}/index`) {
        // 重定向到首页
        next({ path: `${base}/` })
        NProgress.done()
        return
      }

      // 判断权限
      const hasPowers = userStore.powers && userStore.powers.length > 0

      if (hasPowers) {
        next()
      } else {
        try {
          // 获取权限
          const { permissions } = await userStore.getUserInfo()

          const authStore = useAuthStore()
          // 获取可访问路由
          const accessRoutes = await authStore.generateRoutes(permissions)
          // 动态添加路由
          accessRoutes.forEach((route: any) => {
            const hasRoute = router.hasRoute(route.name)
            if (!hasRoute) {
              router.addRoute(route)
            }
          })

          next({ ...to, replace: true })
        } catch (error) {
          console.log('路由守卫：', error)
          await userStore.resetToken()
          next(`${loginPath}?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (to.path == loginPath) {
      next()
    } else {
      // 跳转登录页面
      next(`${loginPath}?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
