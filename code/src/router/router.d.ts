

import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    // 侧边栏和面包屑导航显示名称
    title: string
    // 设置为true时，不显示在侧边栏（默认false，显示）
    hidden?: boolean
    // 设置为true时，总是显示在侧边栏根目录，如果不设置，当子目录只有一个时，直接作为根menu
    alwayShow?: boolean
    //  设置为true，在面包屑导航中不会有重定向功能
    noRedirect?: boolean
    // 侧边栏svg-icon名称
    icon?: string
    // 权限sn
    sn?: string
    // 是否显示在面包屑导航中
    breadcrumb?: boolean
    // 设置后，对应路径的侧边栏会高亮 如： 'example/list'
    activeMenu?: string
    // 是否固定导航标签，默认不设置  
    affix?: boolean
    // 是否缓存页面，默认否
    cache?: boolean
    // 展开 -二级菜单展开到一级
    expand?: boolean
    // 排序
    order?: number
    // 重定向
    redirect?: string
  }
}