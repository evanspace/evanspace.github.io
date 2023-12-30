/* *
 * @description: 权限状态
 * @file: auth.ts
 * @author: Evan
 * @date: 2023.07.24 17:25:16
 * @week: 周一
 * @version: V
* */
import { defineStore } from 'pinia'
import { constantRoutes, asyncRoutes } from '@/router/routes'

/**
 * 根据权限过滤路由
 * @param { Array } routes 需要过滤的路由
 * @param { Array } powers 权限sn列表
 * @returns { Array }
 */
function filterAsyncRoutes( routes: any[], powers: any ) {
  const res: any[] = []
  routes.forEach( ( route: any) => {
    const temp = { ...route }
    if ( hasPermission( powers, temp ) ) {
      if ( temp.children ) {
        temp.children = filterAsyncRoutes( temp.children, powers )
        if ( temp.children.length ) {
          res.push( temp )
        }
      } else {
        res.push( temp )
      }
    }
  } )
  return res
}

// 排序
function sortRoutes( routes: any[] ) {
  routes.forEach( ( route: any ) => {
    if ( route.children ) {
      route.children = sortRoutes( route.children )
    }
  } )
  return routes.sort( ( a: any, b: any ) => {
    return a.meta.order - b.meta.order
  } )
}

// 判断是否包括指定权限
function hasPermission( powers: string | any[], route: { meta: { sn: any } } ) {
  if ( route.meta && route.meta.sn ) {
    return powers.includes( route.meta.sn )
  }
  return true
}

const routes: any[] = []
const addRoutes: any[] = []
export const useAuthStore = defineStore( {
  id: 'auth',
  state: () => ( {
    routes,
    addRoutes,
  } ),

  actions: {

    // 生成路由
    generateRoutes( powers: string[] ) {
      let accessRoutes: any[] = []
      if ( powers.includes( 'ALL_SN' ) ) {
        accessRoutes = asyncRoutes || []
      } else {
        accessRoutes = filterAsyncRoutes( asyncRoutes, powers )
      }
      this.$patch( {
        addRoutes: sortRoutes( accessRoutes ),
        routes: [ ...constantRoutes, ...accessRoutes ]
      } )
      return accessRoutes
    }
  }
} )