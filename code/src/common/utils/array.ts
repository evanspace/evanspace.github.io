/* *
 * @description: 
 * @file: array.ts
 * @author: Evan
 * @date: 2023.07.22 15:28:59
 * @week: 周六
 * @version: V
* */

/**
 * 数组等量分割 转换二维数组
 * @param { Array } list 被分割数组
 * @param { number } len 分割长度  默认：3
 * @return { Array } 分割后的数组
 * @example
 * arraySlice( [ 1, 2, 3, 4 ], 2 )
 */
export const arraySlice = ( list: Array<any>, len: number = 3 ): Array<any> => {
  let l = list.length
  if ( l <= len ) return [ list ]
  let n = l % len == 0 ? l / len : Math.floor ( l / len ) + 1
  let lt: any[] = []
  for ( let index = 0; index < n; index++ ) {
    const s: number = index * len, e: number = ( index + 1 ) * len 
    lt.push( list.slice( s, e ) )
  }
  return lt
}


interface RepObj {
  value: number
  count: number
}
/**
 * 获取数字数组中重复的值
 * @param { Array } list 数字列表
 * @return { Array } 重复数字集合
 * @example
 * numArrayFindRep( [ 1, 1, 2, 3 ] )
 */
export const numArrayFindRep = ( list: Array<number> ): Array<RepObj> => {
  let l: any[] = [], s: any[] = []
  list.forEach( ( val, _n ) => {
    if ( !s[ val ] ) {
      s[ val ] = val
      l.push( {
        value: val,
        count: 1
      } )
    } else {
      l.forEach( ( _val, _n ) => {
        if ( _val.val == val ) {
          _val.num++
        }
      } )
    }
  } )
  return l
}


interface Route {
  path: string
  children?: Array<Route>
}
/**
 * 无限指定查询子级路由
 * @param { Array } routes 路由列表
 * @param { string } routes.path 路径
 * @param { Array } routes.children 子集
 * @param { string } path 查找的路径
 * @return { Object }路径对应的路由信息
 * @example
 * infiniteFindRoutePath( [], '/path' )
 */
export const infiniteFindRoutePath = ( routes: Array<Route>, path: string ): Route | undefined => {
  // 查询子级方法
  const findChile = ( child: Route ) => {
    if ( child.children ) {
      let o = child.children.find( ( it ) => {
        if ( it.path == path ) {
          return true
        } else {
          let o = findChile( it )
          if ( o ) return true
        }
      } )
      if ( o ) return true
    } else {
      return false
    }
  }

  // 查找id存在的对象
  return routes.find( item => {
    if ( item.path == path ) {
      return true
    } else {
      let o = findChile( item )
      if ( o ) return true
    }
  } )
}

/**
 * 深拷贝
 * @param { any } obj 被拷贝对象
 * @return { any }拷贝数据
 * @example
 * deepCopy( { a: 1 } )
 */
export const deepCopy = ( obj: any ): any => {
  let newobj: any = obj.constructor === Array ? [] : {}
  if ( typeof obj !== 'object' ) {
    return obj
  } else if ( window.JSON) {
    // 系列化对象
    let str = JSON.stringify( obj )
    // 还原
    newobj = JSON.parse( str )
  } else {
    for ( var i in obj ) {
      newobj[ i ] = typeof obj[ i ] === 'object' ? deepCopy( obj[ i ] ) : obj[ i ]
    }
  }
  return newobj
}
