/* *
 * @description: 
 * @file: encrypt.ts
 * @author: Evan
 * @date: 2023.07.22 14:58:04
 * @week: 周六
 * @version: V
* */


/**
 * Uint8Array 转字符串
 * @param { Array } codeData 需转换的 Unicode 编码的字符数组
 * @return { string } 转换结果
 * @example
 * uint8ArrayToString( [ 49, 50, 51 ] )
 */
export const uint8ArrayToString = ( codeData: Array<number> ): string => {
  let dataString = ''
  for ( let i = 0; i < codeData.length; i++ ) {
    dataString += String.fromCharCode( codeData[ i ] )
  }
  return dataString
}

/**
 * 字符串转 Uint8Array
 * @param { string } str 需转换的字符串
 * @return { Uint8Array } Unicode 转换结果 
 * @example
 * stringToUint8Array( '123' )
 */
export const stringToUint8Array = ( str: string ): Uint8Array => {
  let arr: any[] = []
  for ( let i = 0, j = str.length; i < j; ++i ) {
    arr.push( str.charCodeAt( i ) )
  }
  return new Uint8Array( arr )
}


/**
 * 图片 base64 url 转 blob
 * @param { base64 } baseStr base64 数据流
 * @return { Blob } 二进制数据
 * @example
 * base64ToBlob( 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAA' )
 */
export const base64ToBlob = ( baseStr: string ): Blob => {
  let arr: any[] = baseStr.split( ',' ), mime = arr[ 0 ].match( /:(.*?)/ )[ 1 ],
  bstr = atob( arr[ 1 ] ), n = bstr.length, u8arr = new Uint8Array( n )
  while ( n--) {
    u8arr[ n ] = bstr.charCodeAt( n )
  }
  return new Blob( [ u8arr ], { type: mime } )
}
