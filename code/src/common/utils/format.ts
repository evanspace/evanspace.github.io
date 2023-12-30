/* *
 * @description: 
 * @file: format.ts
 * @author: Evan
 * @date: 2023.07.22 14:51:23
 * @week: 周六
 * @version: V
* */

/**
 * 质补数字字符串 长度不够前置位补 ‘0’
 * @param { number | string } num 需质补目标
 * @param { number } len 总长度
 * @param { string } sn 质补字符
 * @return { string } 质补后字符串
 * @example 
 * addStrNums( 111, 4, '*' )
 */
export const addStrNums = ( num: number | string, len: number = 2, sn: string = '0' ): string => {
  let l = num.toString().length
  let _num: string = ''
  while ( l < len ) {
    _num = sn + num
    l++
  }
  return _num
}

/**
 * 字符转换小写
 * @param { string } str 需转换的字符
 * @return { string } 转换后的字符串
 * @example
 * toLower( 'UITITT' )
 */
export const toLower = ( str: string ): string => {
  if ( !str ) return ''
  return str.toLowerCase()
}

/**
 * 过滤对象列表中所有属性含有指定的字符
 * @param { Array } items 需过滤对象列表
 * @param { string } term 过滤字符串（用于匹配单列所有字段中是否包含过滤字符）
 * @return { Array } 过滤后的列表
 * @example
 * filterItemsAllField( [ { a: 'abce', b: 'wer' }, { a: 'poi' } ], 'po' )
 */
export const filterItemsAllField = ( items: Array<Object>, term: string = '' ): Array<Object>  => {
  if ( term ) {
    let list = items.filter( item => {
      let keyList = Object.keys( item ).map( _it => {
        return toLower( item[ _it ] ).includes( toLower( term ))
      } )
      return keyList.includes( true )
    } )
    return list
  }
  return items
}

/**
 * 截取指定字符串起始位置 *号代替
 * @param { string } str 目标字符串
 * @param { number } end 截取结束下标  默认：字符串长度
 * @param { number } beigin 截取开始下标  默认：0
 * @param { string } sign 替换字符 默认: *
 * @return { string } 替换字符后的字符串
 * @example
 * replacementChar( '15555555555', 7, 3 )
 */
export const replacementChar = ( str: string, end?: number, beigin: number = 0, sign: string = '*' ): string => {
  !end && ( end = str.length )
  const before = str.substring( 0, beigin )
  const after = str.substring( end )
  let len = end - beigin,
    text = ''
  while ( len > 0 ) {
    text += sign
    len--
  }
  return before + text + after
}

/**
 * 字符串去除左右空格
 * @param { string } str 需去除左右空格字符串
 * @return { string } 去除空格后的字符串
 * @example
 * trim( ' test ' )
 */
export const trim = ( str: string ): string => {
  return String( str ).replace( /^\s*|\s*$/g, '' )
}

/**
 * 字符串去除所有空格
 * @param { string } str 需去除空格字符串
 * @return { string } 去除空格后的字符串
 * @example
 * trims( ' t e s t ' )
 */
export const trims = ( str: string ): string => {
  return String( str ).replace( /\s*/g, '' )
}

/**
 * 去除汉字
 * @param { String } str 需要去除汉字的字符串
 * @return { string } 去除汉字后的字符串
 * @example
 * reChinese( 'china中国' )
 */
export const reChinese = ( str: string ): string => {
  let reg = new RegExp( '[\\u4E00-\\u9FFF]+', 'g' )
  return String( str ).replace( reg, '' )
}
