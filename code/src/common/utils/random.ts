/* *
 * @description: 
 * @file: random.ts
 * @author: Evan
 * @date: 2023.07.22 15:42:02
 * @week: 周六
 * @version: V
* */

/**
 * 获取随机数(保留 2 为小数)
 * @param { number } ranVal 随机数值
 * @param { number } minVal 最小数值
 * @return { number } 随机数
 * @example
 * getRandomNum( 1000, 10 )
 */
export const getRandomNum = ( ranVal: number = 100, minVal: number = 0 ) => {
  let sum = minVal + Number( ( Math.random() * ranVal ).toFixed( 2 ) )
  return Number( sum.toFixed( 2 ) )
}

/**
 * 生成随机字符串
 * @param { number } n 随机个数 默认： 10
 * @returns { string } 随机字符串
 * @example
 * getRandomLetter()
 */
export const getRandomLetter = ( n: number = 10 ): string => {
  let char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'.split( '' )
  let res = ''
  for ( let i = 0; i < n; i++ ) {
    let id = Math.ceil( Math.random() * char.length - 1 )
    res += char[ id ]
  }
  return res
}

/**
 * 随机整数(包含 0)
 * @param { number } num 随机的整数最大值  默认：1
 * @return { number } 随机整数
 * @example
 * randomInteger()
 */
export const randomInteger = ( num: number = 1 ): number => {
  return Number( ( Math.random() * num ).toFixed() )
}

/**
 * 获取指定位数数值的随机数
 * @param { number } n 随机的数值位数  默认：5
 * @return { string } 随机数
 * @example
 * randomNumStr()
 */
export const randomNumStr = ( n: number = 5 ): string => {
  let str = ''
  while ( n > 0) {
    str += Math.ceil( Math.random() * 10 ) - 1
    n--
  }
  return str
}

/**
 * 获取随机颜色
 * @return 16 进制颜色
 * @example
 * getRandomColor()
 */
export const getRandomColor = (): string => {
  // 将随机数转换成16进制字符串
  let str = Math.random().toString( 16 )
  str = str + '000000'
  return '#' + str.substring( 2, 8 )
}