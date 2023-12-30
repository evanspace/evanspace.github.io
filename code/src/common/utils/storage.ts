/*
 * @description: 存储方法
 * @fileName: storage.js
 * @author: Evan
 * @date: 2021-08-17 10:19:30
 * @version: V1.0.0
 */

import { getSearchParams } from './win'
/**
 * 获取cookie值
 * @param { string } name 获取cookie参数
 * @return { string | null } cookie 对应键值
 * @example
 * getCookie( 'token' )
*/
export const getCookie = ( cname: string ): string | null => {
  // let arr, reg = new RegExp( '(^| )' + name + '=([^]*)(|$)' )
  // if ( arr = document.cookie.match( reg ) ) {
  //   console.log( arr[ 2 ] )
  //   return unescape( arr[ 2 ] )
  // }
  // return null
  let name = cname + '='
  let ca = document.cookie.split(';')
  for ( let i = 0; i < ca.length; i++ ) {
    if ( ca[ i ].indexOf( name ) >= 0 )  {
      const str = ca[ i ].split( '=' )[ 1 ]
      // 判断是否过期 含有字符串
      if ( str.indexOf( 'expires' ) > -1 ) continue
      else return str
    }
  }
  return ''
}

/**
 * 获取 cookie 和地址栏参数
 * @return { Object } cookie和地址栏参数的组合对象
 * @example
 * getCookieAndSearch()
 */
export const getCookieAndSearch = () => {
  let o = getSearchParams()
  if ( !document.cookie ) return o
  let a = document.cookie.split( ';' )
  for ( let i = 0; i < a.length; i++ ) { //遍历cookie信息数组
    a[ i ] && ( a[ i ] = a[ i ].replace( /(^\s*)|(\s*$)/g,'' ) )
    //清除头部空格符
    let b = a[ i ].split( '=' )
    let c = b[ 1 ]
    c && ( c = c.replace( /(^\s*)|(\s*$)/g,'' ) )
    c = unescape(c)
    // 判断是否过期 含有字符串
    if ( c.indexOf( 'expires' ) > -1 ) continue

    //如果c中不包含逗号（不是子cookie），直接把c作为cookie变量的值存入对象
    if ( !/\,/gi.test( c ) ) {
        o[ b[ 0 ] ] = b[ 1 ]
    } else {
      let d = c.split( ',' )
      for ( let j = 0; j < d.length; j++ ) {
        let e = d[ j ].split( ':' )
        e[ 0 ] && ( e[ 0 ] = e[ 0 ].replace( /(^\s*)|(\s*$)/g,'' ) )
        o[ e [ 0 ] ] = e[ 1 ]
      }
    }
  }
  return o
}

/**
 * 设置cookie
 * @param { string } name cookie 名称
 * @param { string } value cookie 值
 * @param { number } expiredays 过期天数  默认：1
 * @example
 * setCookie( 'token', '123' )
 */
export const setCookie = ( name: string, value: string, expiredays: number = 1 ) => {
  const exdate: any = new Date()
  exdate.setDate( exdate.getDate() + expiredays )
  document.cookie = `${ name }=${ escape( value ) }expires=${ exdate.toGMTString() }`
}

/**
 * 获取 session
 * @param { string } name session 存储键
 * @return { string | null } 对应值
 * @example
 * getSession( 'token' )
 */
export const getSession = ( name: string ): string | null => {
  return sessionStorage.getItem( name )
}

/**
 * 设置 session
 * @param { string } name session 名称
 * @param { string } value session 值
 * @example
 * setSession( 'token', '123' )
 */
export const setSession = ( name: string, value: string ) => {
  sessionStorage.setItem( name, value )
}

/**
 * 清除 session
 * @param { string } name session 名称
 * @example
 * removeSession( 'token' )
 */
export const removeSession = ( name: string ) => {
  sessionStorage.removeItem( name )
}

/**
 * 获取 localStorage
 * @param { string } name localStorage 存储键
 * @return { string | null } 对应值
 * @example
 * getStorage( 'token' )
 */
export const getStorage = ( name: string ): string | null => {
  return localStorage.getItem( name )
}

/**
 * 设置 localStorage
 * @param { string } name localStorage 名称
 * @param { string } value localStorage 值
 * @example
 * setStorage( 'token', '123' )
 */
export const setStorage = ( name: string, value: string ) => {
  localStorage.setItem( name, value )
}

/**
 * 清除 localStorage
 * @param { string } name localStorage 名称
 * @example
 * removeStorage( 'token' )
 */
export const removeStorage = ( name: string ) => {
  localStorage.removeItem( name )
}

/**
 * 获取浏览器缓存参数(地址栏、cokkie、session、local 按顺序优先)
 * @param { string } name 找找的字段名
 * @return { string | null } 对应值
 * @example
 * getBrowserStorage( 'token' )
 */
export const getBrowserStorage = ( name: string ): string | null => {
  let cookie = getSearchParams()[ name ] || ''
  cookie = !!cookie ? cookie : getCookie( name )
  if ( cookie ) {
    sessionStorage.setItem( name, cookie )
    return cookie
  } else {
    return sessionStorage.getItem( name ) || localStorage.getItem( name )
  }
}

