/* *
 * @description: 
 * @file: utils.ts
 * @author: Evan
 * @date: 2023.07.26 15:00:43
 * @week: 周三
 * @version: V
* */
import layout from '@/layout/index.vue'

// 路由基本路径/多处使用
export const base = import.meta.env.VITE_ROUTE_BASE

// 生产路由
const createRoutes = ( pages, components ) => {
  const newPageComps: any[] = []
  // 对象装数组
  Object.entries( pages ).forEach( ( [ path, meta ]: any ) => {
    let pageJs = path
    // 截取有效路由
    path = path.replace( '../pages', '' ).replace( '/page.js', '' )
    path = path || '/'
    // 获取路由层级
    const names = path.split( '/' ).filter( Boolean )
    const name = names.join( '_' ) || 'index'
    // 对应组件路径
    const compPath = pageJs.replace( 'page.js', 'index.vue' )
    const cop = {
      path: base + path,
      component: components[ compPath ] || layout,
      name,
      meta,
      redirect: null
    }
    if ( meta.redirect ) {
      cop.redirect = meta.redirect
      delete meta.redirect
    }
    let parent, pi
    names.forEach( ( name, index ) => {
      // 第一个为一级
      if ( index == 0 ) {
        pi = newPageComps.findIndex( it => it.name == name )
        // 未找到则 push
        if ( pi === -1 ) {
          // 深拷贝防污染
          const copy = { ...cop }
          // 非一级目录
          if ( names.length > 1 ) {
            copy.path = `/${ name }`
            copy.name = name
          }
          newPageComps.push( copy )
          pi = newPageComps.length - 1
        } else {
          // 一级目录
          if ( names.length == 1 ) {
            Object.keys( cop ).forEach( key => {
              newPageComps[ pi ][ key ] = cop[ key ]
            } )
          }
        }
        parent = newPageComps[ pi ]
      } else {
        // 没有子级 添加空数组
        if ( !newPageComps[ pi ].children ) {
          newPageComps[ pi ].children = []
        }
        // 子级中查找层级未找到则添加
        const i = parent.children.findIndex( it => it.name == name )
        if ( i < 0 ) {
          newPageComps[ pi ].children.push( cop )
        } else {
          // 找到则接续添加到子级
          parent = parent.children[ i ]
        }
      }
    } )
  } )
  return newPageComps
}


// 动态导出 pages文件下路由配置
export const exportPagesRoutesConfig = () => {
  const pages = import.meta.glob( '../pages/**/page.js', {
    eager: true,  // 非异步
    import: 'default',
  } )
  const pageComps = import.meta.glob( '../pages/**/index.vue' )
  return createRoutes( pages, pageComps )
}