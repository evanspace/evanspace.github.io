/* *
 * @description: 
 * @file: date.ts
 * @author: Evan
 * @date: 2023.07.22 14:35:14
 * @week: 周六
 * @version: V
* */

/**
 * 字符串日期转换 Date对象
 * @param { string } dateStr 日期字符串
 * @param { string } dateSign 日期分割符  默认：‘-’
 * @param { string } timeSign 时间分割符  默认：‘:‘
 * @return { Date } 格式化后的日期对象
 * @example
 * stringToDate( '2021-08-12 12:12:12' )
 */
export const stringToDate = ( dateStr: string, dateSign = '-', timeSign = ':' ): Date => {
  // 分割字符串
  let list: any[] = dateStr.split( ' ' ).map( ( it, _index ) => {
    // 判断日期 / 时间 分割符存在 进行二次分割
    if ( it.indexOf( dateSign ) > -1 ) {
      return it.split( dateSign )
    } else if ( it.indexOf( timeSign ) > -1 ) {
      return it.split( timeSign )
    } else return [ it ]
  } )
  
  // 判断字符串是否存在日期分割符切数组长度小于2 且值长度小于 4 尾数
  if ( dateStr.indexOf( dateSign ) == -1 && list.length < 2 && list[ 0 ].tostring().length < 4 ) {
    let d = new Date()
    let l: any[] = [
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate()
    ]
    console.log( l )
    list.unshift( l )
  }
  
  // 年月日
  let y = Number( list[ 0 ][ 0 ] )
  let m = ( list[ 0 ][ 1 ] ? Number( list[ 0 ][ 1 ] ) : 1 ) - 1
  let d = list[ 0 ][ 2 ] ?  Number( list[ 0 ][ 2 ] ) : 1

  // 判断长度 - 追加时分秒
  if ( list.length == 1 )  list.push( [ 0, 0, 0 ] )

  // 时分秒
  let h = Number( list[ 1 ][ 0 ] )
  let ms = Number( list[ 1 ][ 1 ] )
  let s = Number( list[ 1 ][ 2 ] )
  let newDate = new Date( y, m, d, h, ms, s, s == 0 ? 0 : 999 )
  return newDate
}

/**
 * 格式日期对象 
 * @param { number | string | Date | undefined } date 需格式化的日期
 * @param { string } dateSign 日期分割符  默认：‘-’
 * @param { string } timeSign 时间分割符  默认：‘:‘
 * @return { Date } 格式化后的日期对象
 * @example
 * formatToDate( 1700123842378 )
 * formatToDate( new Date() )
 * formatToDate( '2021-08-12 12:12:12' )
 */
export const formatToDate = ( date: number | string | Date | undefined, dateSign = '-', timeSign = ':' ): Date => {
  if ( date instanceof Date ) return date
  else if ( typeof date == 'number' ) return new Date( date )
  else if ( typeof date == 'string' ) return stringToDate( date, dateSign, timeSign )
  else return new Date()
}

type WeekStr = '日' | '一' | '二' | '三' | '四' | '五' | '六' 
interface DateInfo {
  year: number
  month: number
  day: number
  hour: number
  week: number
  weekStr: WeekStr
  minute: number
  second: number
  s: number
  tsp: number
  str: string
}
/**
 * 获取日期信息
 * @param { number | string | Date | undefined } sdn 需格式化的日期
 * @param { string } dateSign 日期分割符  默认：‘-’
 * @param { string } timeSign 时间分割符  默认：‘:‘
 * @return { DateInfo } 日期 DateInfo 对象
 * @example
 * getDateInfo()
 * getDateInfo( 1700123842378 )
 * getDateInfo( new Date() )
 * getDateInfo( '2021-08-12 12:12:12' )
 */
export const getDateInfo = ( sdn?: number | string | Date, dateSign = '-', timeSign = ':' ): DateInfo => {
  const date = formatToDate( sdn, dateSign, timeSign )
  const week = date.getDay()
  const tsp = date.getTime()
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    week,
    weekStr: <WeekStr>[ '日', '一', '二', '三', '四', '五', '六' ][ week ],
    minute: date.getMinutes(),
    second: date.getSeconds(),
    s: date.getMilliseconds(),
    tsp,
    str: formatDate( tsp )
  }
}

/**
 * 获取指定日期时间戳
 * @param { string | Date } dateStr 日期字符串
 * @param { string } dateSign 日期分割符  默认：‘-’
 * @param { string } timeSign 时间分割符  默认：‘:‘
 * @return { number } 日期时间戳
 * @example
 * getTimestamp( new Date() )
 * getTimestamp( '2021-08-12 12:12:12' )
 */
export const getTimestamp = ( dateStr: string | Date, dateSign = '-', timeSign = ':' ): number => {
  // 判断日期字符串
  if ( typeof dateStr != 'string' ) {
    // 是否为日期对象
    if ( dateStr instanceof Date ) return dateStr.getTime()
    return 0
  }

  // 强制转换类型为 string
  typeof dateStr != 'string' && ( dateStr = String( dateStr ) )

  // 判断长度为0
  if ( dateStr.length == 0 ) return 0

  const newDate = stringToDate( dateStr, dateSign, timeSign )
  return newDate.getTime()
}

/**
 * get timestamp second 获取时间戳秒数
 * @param { number } tsp 时间戳  默认：0
 * @return { number } 转换秒数
 * @example
 * getTimestampSecond()
 * getTimestampSecond( 1700123842378 )
 */
 export const getTimestampSecond = ( tsp: number = 0 ): number => {
  if ( tsp ) {
    const t: any = new Date( tsp ).getTime() / 1000
    return parseInt( t )
  }
  const t: any = new Date().getTime() / 1000
  return parseInt( t )
}


/**
 * format date 日期转换
 * @param { number | Date } tsp 时间戳
 * @param { string } fmt 日期格式  默认：'yyyy-MM-dd hh:mm:ss'
 * @return { string } 格式化日期
 * @example
 * formatDate()
 * formatDate( 1700123842378 )
 * formatDate( new Date() )
 */
export const formatDate = ( tsp?: number | Date, fmt: string = 'yyyy-MM-dd hh:mm:ss' ): string => {
  let date: Date
  if ( typeof tsp == 'number' ) {
    if ( tsp == 0 ) return ''
    date = new Date( tsp )
  }
  else if ( tsp instanceof Date ) date = tsp
  else date = new Date()
  let o: any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor( ( date.getMonth() + 3 ) / 3 ), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if ( /(y+)/.test( fmt ) ) { fmt = fmt.replace( RegExp.$1, ( date.getFullYear() + '' ).substring( 4 - RegExp.$1.length ) ) }
  for ( let k in o ) {
    if ( new RegExp( '(' + k + ')' ).test( fmt ) ) { fmt = fmt.replace( RegExp.$1, ( RegExp.$1.length == 1 ) ? ( o[ k ] ) : ( ( '00' + o[ k ] ).substring( ( '' + o[ k ] ).length ) ) ) }
  }
  return fmt
}

/**
 * 获取格式化日期
 * @param { number } day 天数 可负值 默认：0
 * @param { string } fmt 日期格式  默认：'yyyy-MM-dd hh:mm:ss'
 * @return { string } 格式化日期
 * @example
 * getFormatDate()
 * getFormatDate( 1 )
 */
export const getFormatDate = ( day: number = 0, fmt: string = 'yyyy-MM-dd hh:mm:ss' ): string => {
  let date = new Date()
  date.setDate( date.getDate() + day )
  let o: any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor( ( date.getMonth() + 3 ) / 3 ), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if ( /(y+)/.test( fmt ) ) { fmt = fmt.replace( RegExp.$1, ( date.getFullYear() + '' ).substring( 4 - RegExp.$1.length ) ) }
  for ( let k in o ) {
    if ( new RegExp( '(' + k + ')' ).test( fmt ) ) { fmt = fmt.replace( RegExp.$1, ( RegExp.$1.length == 1 ) ? ( o[ k ] ) : ( ( '00' + o[ k ] ).substring( ( '' + o[ k ] ).length ) ) ) }
  }
  return fmt
}

/**
 * 获取第几周 格式化日期
 * @param { number } week 第几周 可负值 ( 0-当前周 1-下周 -1-上周)  默认：0
 * @param { 0 | 1 } type 类型  0-周一 1-周日  默认：0
 * @param { string } fmt 日期格式  默认：'yyyy-MM-dd hh:mm:ss'
 * @return { string } 格式化日期
 * @example
 * getFormatWeek()
 * getFormatWeek( 1, 1 )
 */
export const getFormatWeek = ( week: number = 0, type: 0 | 1 = 0, fmt: string = 'yyyy-MM-dd hh:mm:ss' ): string => {
  let start = week * 7
  let now = new Date()
  let day = now.getDay()
  // 判断是否为周日
  day = day == 0 ? 7 : day
  start = start - ( day - 1 )
  if ( type == 0 ) { 
    return getFormatDate( start, fmt ) 
  } else if ( type == 1 ) { 
    return getFormatDate( start + 7, fmt ) 
  }
  return ''
}

/**
 * 将时间戳转换成累计时间
 * @param { number } tsp 时间戳 默认：0
 * @return { string } 换算后的时间字符串
 * @example
 * tspToCountTime( 350000 )
 */
export const tspToCountTime = ( tsp: number = 0 ): string => {
  let days = Math.floor( ( tsp / ( 1000 * 60 * 60 * 24 ) ) )
  let hours = Math.floor( ( tsp % (1000 * 60 * 60 * 24) / (1000 * 60 * 60 ) ) )
  let minutes = Math.floor( ( ( tsp % (1000 * 60 * 60 ) ) / (1000 * 60 ) ) )
  let seconds = Math.floor( ( ( tsp % (1000 * 60 ) ) / 1000 ) )
  function pad( s: number ) {
    return s > 9 ? s : '0' + s
  }
  let str = `${ days ? days + '天' : '' } ${ pad( hours ) }:${ pad( minutes ) }:${ pad( seconds ) }`
  return str
}

/**
 * 获取月份天数
 * @param { number } month 月份  默认：当前月份
 * @param { number } year 年份  默认：当前年份
 * @return { number } 月份天数
 * @example
 * getMonthLen( 2, 2022 )
 */
export const getMonthLen = ( month?: number, year?: number ): number => {
  const now = new Date()
  let len = 0
  !month && ( month = now.getMonth() + 1 )
  !year && ( year = now.getFullYear() )
  if ( month == 2) {
    len = year % 4 == 0 ? 29 : 28
  } else if ( month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
    len = 31
  } else {
    len = 30
  }
  return len
}

/**
 * 获取第几月 格式化日期
 * @param { 0 | 1 } type 类型  0-月初 1-月底 默认：null
 * @param { number } month 月数 可负值 ( 0-当前月 1-下月 -1-上月) 默认：0
 * @param { string } fmt 日期格式  默认：'yyyy-MM-dd hh:mm:ss'
 * @return { string } 格式化日期
 * @example
 * getFormatMonth()
 */
 export const getFormatMonth = ( type: 0 | 1 = 0, month: number = 0, fmt: string = 'yyyy-MM-dd hh:mm:ss' ): string => {
  let now = new Date()
  now.setMonth( now.getMonth() + month )

  if ( type == 0 ) { 
    now.setDate( 1 ) 
    now.setHours( 0 )
    now.setMinutes( 0 )
    now.setSeconds( 0 )
    now.setMilliseconds( 0 )
  } else if ( type == 1 ) {
    let len = getMonthLen( now.getMonth() + 1, now.getFullYear() )
    now.setDate( len ) 
    now.setHours( 23 )
    now.setMinutes( 59 )
    now.setSeconds( 59 )
    now.setMilliseconds( 999 )
  }
  
  return formatDate( now, fmt )
  // 计算出相差天数
  // 时间差的毫秒数
  // let dateDiff = now.getTime() - new Date().getTime()
  // let dayDiff = Math.floor( dateDiff / ( 24 * 3600 * 1000 ) )
  // console.log( dayDiff )
  // now.setDate( now.getDate() + dayDiff )
  // console.log( now )
  // if ( type == 1 ) dayDiff++
  // return getFormatDate( dayDiff, fmt )
}

/**
 * 获取指定时间时间戳
 * @param { string } time 时间字符串 hh:mm:ss
 * @param { number } n 天数，可负数 默认当天 0
 * @return { number } 时间戳
 * @example
 * someDaySomeTime( '05:05:05' )
 */
export const someDaySomeTime = ( time: string, n: number = 0 ): number => {
  !n && ( n = 0 )
  // 将传入时间字符串转为数组
  let timeArr = time.split( ':' )
  // 获取当前时间戳
  let today = new Date()
  // 将当天时间戳设为0点0分0秒
  today.setHours( 0 )
  today.setMinutes( 0 )
  today.setSeconds( 0 )
  today.setMilliseconds( 0 )

  // 计算一天的毫秒数
  let oneDay = 1000 * 60 * 60 * 24
  // 获取指定天的时间戳   前面传负数
  let someDay = new Date( today.getTime() + oneDay * n )
  // 将指定天的时分秒设为我们指定的值
  someDay.setHours( Number( timeArr[ 0 ] ) )
  someDay.setMinutes( Number( timeArr[ 1 ] ) )
  today.setSeconds( Number( timeArr[ 2 ] ) )
  someDay.setMilliseconds( 0 )
  return someDay.getTime()
}


interface StartAndEndTsp {
  start: number
  end: number
}
/**
 * 获取日期(一天/月)的开始和结束时间戳
 * @param { number } tsp 获取日期的时间戳
 * @param { number } type 获取类型 1-日 2-月
 * @param { number } day 天数 可负值 默认：0
 * @return { StartAndEndTsp } 起点终点时间戳
 * @example
 * getDateOriginAndEnd( 0, 2 )
 */
export const getDateOriginAndEnd = ( tsp?: number, type: number = 1, day: number = 0 ): StartAndEndTsp => {
  let date = tsp ? new Date( tsp ) : new Date()
  date.setDate( date.getDate() + day )

  if ( type == 2) {
    date.setDate(1 )
  }
  // 开始时间
  date.setHours( 0 )
  date.setMinutes( 0 )
  date.setSeconds( 0 )
  date.setMilliseconds( 0 )
  let start = date.getTime()

  if ( type == 2) {
    let len = getMonthLen( date.getTime() )
    // 判断是否为当月
    if ( date.getMonth()  == new Date().getMonth() ) len = new Date().getDate()
    date.setDate( len )
  }

  // 结束时间
  date.setHours(23 )
  date.setMinutes(59 )
  date.setSeconds(59 )
  date.setMilliseconds(999 )
  let end = date.getTime()
  return {
    start,
    end,
  }
}
