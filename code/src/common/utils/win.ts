/* *
 * @description: 
 * @file: window.ts
 * @author: Evan
 * @date: 2023.07.22 03:03:38
 * @week: 周六
 * @version: V
* */

/**
 * [isFullscreenEnabled 判断H5 API全屏模式是否是可用]
 * @return { boolean } [支持则返回true,不支持返回false]
 */
export const isFullscreenEnabled = (): boolean => {
  const dom: any = window.document
  return dom.fullscreenEnabled ||
    dom.mozFullScreenEnabled ||
    dom.webkitFullscreenEnabled ||
    dom.msFullscreenEnabled || false
}

/**
 * 浏览器h5 api方式进入全屏
 * @param { Document | HTMLElement } element 需要全屏的dom元素
 * @example
 * setFullscreen( document )
 */
export const setFullscreen = ( element: Document | HTMLElement ) => {
  const el: any = element instanceof HTMLElement ? element : document.documentElement
  const win: any = window
  const rfs = el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen
  if ( rfs ) {
    rfs.call( el )
  } else if ( win.ActiveXObject ) {
    let ws = new win.ActiveXObject( 'WScript.Shell' )
    ws && ws.SendKeys( '{F11}' )
  } else {
    console.error( '浏览器不支持全屏' )
  }
}

/**
 * 判断浏览器是否在全屏状态(设置全屏后可获取正确)
 * @return { boolean } [是全屏状态返回fullscreenElement,不是全屏状态返回false]
 */
export const isFullscreen = (): boolean => {
  const dom: any = window.document
  return !!dom.fullscreenElement ||
    !!dom.msFullscreenElement ||
    !!dom.mozFullScreenElement ||
    !!dom.webkitFullscreenElement || false
}

/**
 * 浏览器h5 API退出全屏
 */
export const exitFullscreen = () => {
  const dom: any = document
  const win: any = window
  const efs = dom.exitFullscreen ||
    dom.webkitExitFullscreen ||
    dom.mozCancelFullScreen ||
    dom.msExitFullscreen;
  if ( efs ) {
    efs.call( document )
  } else if ( win.ActiveXObject ) {
    var ws = new win.ActiveXObject( 'WScript.Shell' )
    ws && ws.SendKeys( '{F11}' )
  } else {
    console.error( '浏览器不支持全屏' )
  }
}

/**
 * 获取地址栏参数
 * @return { Object } 参数对象
 */
export const getSearchParams = (): any => {
  let url = decodeURI( location.search ) // 取访问地址url?后的部分
  let obj: any = {} // 返回对象
  let str // 截取后的字符串
  if ( url.charAt( 0 ) == '?' ) {
    url = url.substring( 1, url.length )

    // 两个参数以上的情况
    if ( url.indexOf( '&' ) != -1 ) {
      str = url.split( '&' )
      for ( let i = 0; i < str.length; i++ ) {
        let str1 = str[ i ].split( '=' )
        if ( str1.length == 2 && str1[ 0 ] != '' ) {
          obj[ str1[ 0 ] ] = str1[ 1 ]
        }
      }
    }
    // 一个参数的情况
    else {
      str = url.split( '=' )
      if ( str.length == 2 && str[ 0 ] != '' ) {
        obj[ str[ 0 ] ] = str[ 1 ]
      }
    }
  }
  return obj
}


/**
 * IsPC 判断是否为 PC
 * @return { boolean } 判断结果
 */
export const IsPC = (): boolean => {
  let userAgentInfo = navigator.userAgent
  let Agents = [
    'Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod'
  ]
  let flag = true
  for ( let v = 0; v < Agents.length; v++ ) {
    if ( userAgentInfo.indexOf( Agents[ v ] ) > 0 ) {
      flag = false
      break
    }
  }
  return flag
}

/**
 * 检测浏览器名称
 * @return { string } 检测结果
 */
export const getBrowser = (): string => {
  let UserAgent = navigator.userAgent.toLowerCase()
  let browser = '', win: any = window
  let browserArray: any = {
    IE: win.ActiveXObject || 'ActiveXObject' in win, // IE
    Chrome: UserAgent.indexOf( 'chrome' ) > -1 && UserAgent.indexOf( 'safari' ) > -1, // Chrome浏览器
    Firefox: UserAgent.indexOf( 'firefox' ) > -1, // 火狐浏览器
    Opera: UserAgent.indexOf( 'opera' ) > -1, // Opera浏览器
    Safari: UserAgent.indexOf( 'safari' ) > -1 && UserAgent.indexOf( 'chrome' ) == -1, // safari浏览器
    Edge: UserAgent.indexOf( 'edge' ) > -1, // Edge浏览器
    QQBrowser: /qqbrowser/.test(UserAgent ), // qq浏览器
    WeixinBrowser: /MicroMessenger/i.test(UserAgent ) // 微信浏览器
  }
  for ( let i in browserArray ) {
    if ( browserArray[ i ] ) {
      browser = i
    }
  }
  return browser
}

/**
 * 检测是否为微信浏览器
 * @return { boolean } 判断结果
 */
export const isWeiXinBrowser = (): boolean => {
  let ua: any = window.navigator.userAgent.toLowerCase()
  // console.log( ua)//mozilla/5.0 ( iphone cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
  if ( ua.match( /MicroMessenger/i ) == 'micromessenger' ) {
    return true
  } else {
    return false
  }
}

/**
 * 检测当前网络状态
 * @return { string } 检测结果
 */
export const getNetworkType = (): string => {
  const navigator = <any>window.navigator
  // 检查是否支持navigator对象
  if ( navigator && navigator.connection ) {
    // 获取connection对象
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    // 检查connection对象是否有属性effectiveType
    if ( connection && connection.effectiveType ) {
      return connection.effectiveType;
    }
  } // 如果无法获取网络类型，则返回未知
  return 'unknown'
}

/**
 * 动态设置页面标题
 * @param { string } title 需设置的标题
 * @example
 * setDocumentTitle( '这是一个标题' )
 */
export const setDocumentTitle = ( title: string ) => {
  document.title = title || document.title
  let ua: any = navigator.userAgent.toLowerCase()
  if( ua.match( /MicroMessenger/i)== 'micromessenger' && !!ua.match( /\( i[^]+( U)? CPU.+Mac OS X/i ) ){
    let ifr = document.createElement( 'iframe' )
    ifr.src = './favicon.ico'
    ifr.onload = () => {
      setTimeout(() => {
        ifr.remove()
      }, 0 )
    }
    document.body.appendChild( ifr )
  }
}


/**
 * 查询Url参数值
 * @param { string } name 需要查询的参数
 * @return { string } 查询的键值
 */
export const getUrlParam = ( name: string ): string => {
	let reg: any = new RegExp( '(^|&)' + name + '=([^&]*)(&|$)', 'i' )
	let r = window.location.search.substr( 1 ).match( reg )
	let context = ''
	if ( r != null )
		context = r[ 2 ]
	reg = null
	r = null
	return ( context == null || context == '' || context == 'undefined' ) ? '' : context
}


/**
 * 判断变量类型
 * @param { any } obj 要判断的变量
 * @return { string } 返回类型字符串
 * @example
 * getObjectType( {} )
 */
export const getObjectType = ( obj: any ): string => {
  const toString = Object.prototype.toString
  const map: Object = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  if ( obj instanceof Element ) {
    return 'element'
  }
  return map[ toString.call( obj ) ]
}

/**
 * 对比两个对象是否相同
 * @param { Object } obj1 对象 1
 * @param { Object } obj2 对象 2
 * @return { boolean } 对比结果
 * @example
 * ifCompare( { a: 1 , b: 2 }, { a: 1 } )
 */
export const ifCompare = ( obj1, obj2 ): boolean => {
  const o1keys = Object.keys( obj1 )
  const o2keys = Object.keys( obj2 )
  if ( o1keys.length !== o2keys.length ) return false
  for ( let i = 0; i < o1keys.length; i++ ) {
    const key = o1keys[ i ]
    if ( !o2keys.includes( key ) ) return false
    if ( obj1[ key ] !== obj2[ key ] ) return false
  }
  return true
}