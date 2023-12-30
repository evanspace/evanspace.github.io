/* *
 * @description: 
 * @file: reckon.ts
 * @author: Evan
 * @date: 2023.07.22 15:04:34
 * @week: 周六
 * @version: V
* */

/**
 * 四舍五入指定精度数值
 * @param { number } num 需四舍五入的数值
 * @param { number } precision 精度
 * @return { number } 处理后的数值
 * @example
 * toFixed( 2.555555 )
 */
export const toFixed = ( num: number, precision: number = 2 ) => {
  if ( !num ) return 0
  if ( typeof num != 'number' ) return num
  return Number( num.toFixed( precision ) )
}


/**
 * addition 加法
 * @param { number } arr 需要相加的数值
 * @return { number } 算法结果
 * @example
 * addition( 1, 2 )
 */
export const addition = ( ...arr: Array<number> ): number => {
  if ( !arr.length ) return 0
  let ps = 100000000000
  let sum = arr.reduce( ( prv, curr, _idx, _arr ) => {
    return Math.trunc( Number( prv) * ps + Number( curr ) * ps ) / ps
  } )
  return sum
}

/**
 * subtraction 减法
 * @param { number } num 被减的数
 * @param { number } arr 被减的值可无限传
 * @return { number } 算法结果
 * @example
 * subtraction( 10, 2, 3 )
 */
export const subtraction = ( num: number, ...arr: Array<number> ): number => {
  if ( !arr.length ) return num
  let ps = 100000000000
  let sum = arr.reduce( ( prv, curr, _idx, _arr ) => {
    return Math.trunc( prv * ps + Number( curr ) * ps ) / ps
  } )
  return Math.trunc( num * ps - sum * ps ) / ps
}

/**
 * multiplication 乘法
 * @param { number } num 被乘的数
 * @param { number } args 被乘的值 可无限传
 * @return { number } 算法结果
 * @example
 * multiplication( 10, 2, 3 )
 */
export const multiplication = ( num: number, ...arr: number[] ) => {
  if ( !num ) return 0
  if ( !arr.length ) return num
  let ps = 100000000000
  let sum = arr.reduce( ( prv, curr, _idx, _arr ) => {
    return Math.trunc( prv *  Number( curr ) * ps ) / ps
  } )
  return Math.trunc( num * ps * sum ) / ps
}

/**
 * 增长比例
 * @param { number } num1 增长数值
 * @param { number } num2 比例数值
 * @return { number } 比例结果
 * @example
 * proportionOfGrowth( 10, 5 )
 */
export const proportionOfGrowth = ( num1: number, num2: number ) => {
  if ( num1 == num2 ) return 0
  let growth = subtraction( num1, num2 )
  let proportion = ( growth / num2 ) * 100
  return Number( proportion.toFixed( 2 ) )
}


/**
 * 换算单位(汉字单位-四舍五入)
 * @param { number } num 需转换汉字的数值
 * @param { number } precision 数值精度  默认：2
 * @return { number | string } 换算后的值
 * @example
 * numConverter( 1111555 )
 */
 export const numConverter = ( num: number = 0, precision: number = 2 ) => {
  if ( Math.abs( num ) >= 100000000 ) {
    const n: any = ( num / 100000000 )
    return n.toFixed( precision ) * 1 + '亿'
  } else if ( Math.abs( num ) >= 10000 ) {
    const n: any = ( num / 10000 )
    return n.toFixed( precision ) * 1 + '万'
  } else {
    const n: any = num
    return n.toFixed( precision ) * 1
  }
}

/**
 * 换算单位(汉字单位-只舍不入)
 * @param { number } num 需转换汉字的数值
 * @param { number } precision 数值精度
 * @param { boolean } isString 数字是否为字符串（精度尾数可为 0）
 * @return { number | string } 换算后的值
 * @example
 * _numConverter( 1115000, 2, true )
 */
export const _numConverter = ( num: number = 0, precision: number = 2, isString: boolean = false ): string => {
  let rgx = new RegExp( `^\\d+(?:\\.\\d{0,${ precision }})?` )
  let rNum: any = 0, unit = ''

  // 此处为防止字符串形式的数值进来，因为toFixed方法只能用于数值型数
  num = Number( num )
  if ( Math.abs( num ) >= 100000000 ) {
    console.log(  num / 100000000  )
    rNum = ( num / 100000000 ).toString().match( rgx ), unit = '亿'
  } else if ( Math.abs( num ) >= 10000 ) {
    rNum = ( num / 10000 ).toString().match( rgx ), unit = '万'
  } else {
    rNum = num.toString().match( rgx )
  }
  if ( isString ) {
    unit && ( rNum = Number( rNum ).toFixed( precision ) )
  } else {
    rNum = Number( rNum )
  }
  return rNum + unit
}

/**
 * 数字千位符格式化
 * @param { number } num 需转换汉字的数值
 * @param { number } precision 数值精度  默认：5
 * @return { string } 格式化后的字符串
 * @example
 * toThousands( 2589 )
 */
export const toThousands = ( num: number = 0, precision: number = 5  ): string => {
  num = Number( num.toFixed( precision ) )
  // 判断绝对值否小于1000
  if ( Math.abs( num ) < 1000 ) return num.toString()
  let strNum = String( num )
  if ( !/^(\+|-)?(\d+)(\.\d+)?$/.test( strNum ) ) {
    return strNum
  }
  let a = RegExp.$1,
    b = RegExp.$2,
    c = RegExp.$3
  let re: any = new RegExp( '(\\d)(\\d{3})(,|$)' )
  // re.compile( '(\\d)(\\d{3} )(,|$)' )
  while( re.test( b ) ) {
    b = b.replace( re, '$1,$2$3' )
  }
  return a + '' + b + '' + c
}

// 如果数字含有小数部分，那么可以将小数部分单独取出
// 将小数部分的数字转换为字符串的方法：
const chnNumChar = [ '零', '一', '二', '三', '四', '五', '六', '七', '八', '九' ]
const chnUnitSection = [ '', '万', '亿', '万亿', '亿亿' ]
const chnUnitChar = [ '', '十', '百', '千' ]
const numToChn = ( num: number ) => {
  let index = num.toString().indexOf( '.' )
  if ( index != -1 ) {
    let str = num.toString().slice( index )
    let a = '点'
    for ( let i = 1; i < str.length; i++ ) {
      a += chnNumChar[ parseInt( str[ i ] ) ]
    }
    return a
  } else {
    return ''
  }
}

// 定义在每个小节的内部进行转化的方法，其他部分则与小节内部转化方法相同
const sectionToChinese = ( section: number ) => {
  // zero为是否进行补零， 第一次进行取余由于为个位数，默认不补零
  let str = '', chnstr = '', zero = false, count = 0 
  while ( section > 0 ) {
    // 对数字取余10，得到的数即为个位数
    let v = section % 10
    // 如果数字为零，则对字符串进行补零
    if ( v == 0 ) {
      // 如果遇到连续多次取余都是0，那么只需补一个零即可
      if ( zero ) {
        zero = false
        chnstr = chnNumChar[ v ] + chnstr
      }
    } else {
      // 第一次取余之后，如果再次取余为零，则需要补零
      zero = true
      str = chnNumChar[ v ]
      str += chnUnitChar[ count ]
      chnstr = str + chnstr
    }
    count++
    section = Math.floor( section / 10 )
  }
  return chnstr
}

/**
 * 数字转换汉字
 * @param { number } num 需转换汉字的数值
 * @return { string } 汉化后的字符串
 * @example
 * numberToChinese( 123456789 )
 */
export const numberToChinese = ( num: number ): string => {
  let a = numToChn( num )
  num = Math.floor( num )
  let unitPos = 0
  let strIns = '', chnStr = ''
  let needZero = false
  if ( num === 0 ) {
    return chnNumChar[ 0 ]
  }
  while ( num > 0 ) {
    let section = num % 10000
    if ( needZero ) {
      chnStr = chnNumChar[ 0 ] + chnStr
    }
    strIns = sectionToChinese( section )
    strIns += ( section !== 0 ) ? chnUnitSection[ unitPos ] : chnUnitSection[ 0 ]
    chnStr = strIns + chnStr
    needZero = ( section < 1000 ) && ( section > 0 )
    num = Math.floor( num / 10000 )
    unitPos++
  }
  return chnStr + a
}


/**
 * 人民币转换大写
 * @param { number } money 需转换汉字的数值
 * @return { string } 数值对应的汉字
 * @example
 * convertCurrency( 123456789.98 )
 */
export const convertCurrency = ( money: number ): string => {
  //汉字的数字
  let cnNums = new Array( '零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖' )
  //基本单位
  let cnIntRadice = new Array( '', '拾', '佰', '仟' )
  //对应整数部分扩展单位
  let cnIntUnits = new Array( '', '万', '亿', '兆' )
  //对应小数部分单位
  let cnDecUnits = new Array( '角', '分', '毫', '厘' )
  //整数金额时后面跟的字符
  let cnInteger = '整'
  //整型完以后的单位
  let cnIntLast = '元'
  //最大处理的数字
  let maxNum = 999999999999999.9999
  //金额整数部分
  let integerNum
  //金额小数部分
  let decimalNum
  //输出的中文金额字符串
  let chineseStr = ''
  //分离金额后用的数组，预定义
  let parts
  if ( money >= maxNum ) {
    return ''
  }
  // 传入的参数为0情况
  if ( money == 0 ) {
    chineseStr = cnNums[ 0 ] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转为字符串
  let _money = money.toString()
  // indexOf 检测某字符在字符串中首次出现的位置 返回索引值（从0 开始） -1 代表无
  if ( _money.indexOf( '.' ) == -1 ) {
    integerNum = _money
    decimalNum = ''
  } else {
    parts = _money.split( '.' )
    integerNum = parts[ 0 ]
    decimalNum = parts[ 1 ].substring( 0, 4 )
  }
  //转换整数部分
  if ( parseInt( integerNum, 10 ) > 0 ) {
    let zeroCount  = 0
    let IntLen = integerNum.length
    for ( let i = 0; i < IntLen; i++ ) {
      let n = integerNum.substring( i, i+1 )
      let p = IntLen - i - 1
      let q = p / 4
      let m = p % 4
      if (  n == '0' ) {
        zeroCount ++
      } else {
        if ( zeroCount > 0 ) {
          chineseStr += cnNums[ 0 ]
        }
        zeroCount = 0
        chineseStr += cnNums[ parseInt( n ) ] + cnIntRadice[ m ]
      }
      if ( m == 0 && zeroCount < 4 ) {
        chineseStr += cnIntUnits[ q ]
      }
    }
    // 最后+ 元
    chineseStr += cnIntLast
  }
  // 转换小数部分
  if ( decimalNum != '' ) {
    let decLen = decimalNum.length
    for ( let i = 0; i < decLen; i++ ) {
      let n = decimalNum.substring( i, i + 1 )
      if ( n != '0' ) {
        chineseStr += cnNums[ Number( n ) ] + cnDecUnits[ i ]
      }
    }
  }
  if ( chineseStr == '' ) {
    chineseStr += cnNums[ 0 ] + cnIntLast + cnInteger
  } else if ( decimalNum == '' ) {
    chineseStr += cnInteger
  }
  return chineseStr
}
