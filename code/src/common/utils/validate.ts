/* *
 * @description: 
 * @file: validate.ts
 * @author: Evan
 * @date: 2023.07.22 02:46:30
 * @week: 周六
 * @version: V
* */

/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param { Array } a_idCard 身份证号码数组
 * @return { boolean } 验证结果
 */
 const isTrueValidateCodeBy18IdCard = ( a_idCard: Array<string> ): boolean => {
  let Wi = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 ] // 加权因子
  let ValideCode = [ 1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2 ] // 身份证验证位值.10代表X
  let sum = 0 // 声明加权求和变量
  if ( a_idCard[ 17 ].toLowerCase() == 'x' ) {
    a_idCard[17] = '10' // 将最后位为x的验证码替换为10方便后续操作
  }
  for ( let i = 0; i < 17; i++ ) {
    sum += Wi[ i ] * Number( a_idCard[ i ] ) // 加权求和
  }
  let valCodePosition = sum % 11 // 得到验证码所位置
  if ( a_idCard[ 17 ] == ValideCode[ valCodePosition ].toString() ) {
    return true
  } else {
    return false
  }
}

/**
 * 验证18位数身份证号码中的生日是否是有效生日
 * @param {  String } idCard 18位书身份证字符串
 * @return { boolean } 验证结果
 */
const isValidityBrithBy18IdCard = ( idCard18: string ): boolean => {
  let year = idCard18.substring( 6, 10 )
  let month = idCard18.substring( 10, 12 )
  let day = idCard18.substring( 12, 14 )
  let temp_date = new Date( Number( year ), parseFloat( month ) - 1, parseFloat( day ) )
  // 这里用getFullYear()获取年份，避免千年虫问题
  if ( temp_date.getFullYear() != parseFloat( year ) ||
    temp_date.getMonth() != parseFloat( month) - 1 ||
    temp_date.getDate() != parseFloat( day ) ) {
    return false
  } else {
    return true
  }
}

/**
 * 校验身份证是否 有效
 * @param { string } idCard 需校验的身份证号
 * @return { boolean } 验证结果
 * @example
 * checkIdentity( '452225197103040052' )
 */
export const checkIdentity = ( idCard: string ): boolean => {
  !idCard && ( idCard = '' )
  if ( idCard.length == 18 ) {
    let a_idCard = idCard.split( '' ) // 得到身份证数组
    if ( isValidityBrithBy18IdCard( idCard ) && isTrueValidateCodeBy18IdCard( a_idCard ) ) { // 进行18位身份证的基本验证和第18位的验证
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

/**
 * 校验大陆手机号
 * @param { string } tel 需校验的手机号
 * @return { boolean } 校验结果
 * @example
 * checkTel( '15000000000' )
 */
export const checkTel = ( tel: string ): boolean => {
  !tel && ( tel = '' )
  let regex = /^((13[0-9])|(14[5,7])|(15[0-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|192)\d{8}$/
  if ( !regex.test( tel ) ) return false
  return true
}

/**
 * 校验邮箱
 * @param { string } email 需校验的邮箱
 * @return { boolean } 校验结果
 * @example
 * checkEmail( '123@qq.com' )
 */
export const checkEmail = ( email: string ): boolean => {
  !email && ( email = '' )
  let regex = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if ( !regex.test( email ) ) return false
  return true
}

/**
 * 校验字符串是否含有汉字
 * @param { string } str 需校验的字符串
 * @return { boolean } 校验结果
 * @example
 * checkStrIncludeChinese( 'china中国' )
 */
export const checkStrIncludeChinese = ( str: string ): boolean => {
  !str && ( str = '' )
  // let regex = /.*[/u4e00-/u9fa5]+.*$/
  let regex = new RegExp( '[\\u4E00-\\u9FFF]+', 'g' )
  if ( regex.test( str ) ) return true
  return false
}

/**
 * 校验字符串是否为数字或者字母组合
 * @param { string } str 需校验的字符串
 * @return { boolean } 校验结果
 * @example
 * checkStrIsNumberAndLetter( '123' )
 */
export const checkStrIsNumberAndLetter = ( str: string ): boolean => {
  !str && ( str = '' )
  let regex = /^[0-9a-zA-Z]*$/
  if ( !regex.test( str ) ) return false
  return true
}

/**
 * 校验字符串是否包含数字和字母
 * @param { string } str 需校验的字符串
 * @return { boolean } 校验结果
 * @example
 * checkStrIncludeNumberAndLetter( 'china123' )
 */
export const checkStrIncludeNumberAndLetter = ( str: string ): boolean => {
  !str && ( str = '' )
  let regex = /[a-zA-Z]+(?=\d+)|\d+(?=[a-zA-Z]+)/g
  if ( !regex.test( str ) ) return false
  return true
}

/**
 * 校验url地址是否正确
 * @param { string } url 需要校验的 url 地址
 * @return { boolean } 校验结果
 * @example
 * checkUrl( 'https://www.baidu.com' )
 */
export const checkUrl = ( url: string ): boolean => {
  !url && ( url = '' )
  let regex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/
  if ( !regex.test( url ) ) return false
  return true
}

/**
 * 判断路径是否为外链
 * @param {String} path 路径
 * @return { boolean } 校验结果
 * @example
 * isExternal( '/path' )
 */
export const isExternal = ( path: string ): boolean => {
  return /^(https?:|tel:|mailto:)/.test( path )
}

/**
 * 判断数值是否为浮点数
 * @param { Number } n 需要判断的浮点数值
 * @return { boolean } 校验结果
 * @example
 * isFloat( 0.1 )
 */
export const isFloat = ( n: number ): boolean => {
  return n % 1 !== 0
}

/**
 * 判断数组中是否含有指定字符串
 * @param { Array } arr 需要查询的数组
 * @param { string } str 需要查找的字符串
 * @return { boolean } 校验结果
 * @example
 * arrayFindStrIndex( [ 'abc', 'b', 'c' ], 'a')
 */
export const arrayFindStrIndex = ( arr: Array<any>, str: string ): boolean => {
  return arr.findIndex( val => {
    return val.indexOf( str ) > -1
  } ) > -1
}

/**
 * 检验银行卡号
 * @param { string } bankno 银行卡号
 * @return { boolean } 校验结果
 * @example
 */
export const checkBankNo = ( bankno: string ): boolean => {
  bankno = bankno.replace(/^\s*|\s*$/g, '' )
  if ( bankno == '' ) {
    // 请填写银行卡号
    return false
  }
  if ( bankno.length < 16 || bankno.length > 19 ) {
    // 银行卡号长度必须在16到19之间
    return false
  }
  let num = /^\d*$/  // 全数字
  if ( !num.exec( bankno ) ) {
    // 银行卡号必须全为数字
    return false
  }
  // 开头6位
  let strBin = '10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99'
  if ( strBin.indexOf( bankno.substring( 0, 2 ) ) == -1) {
    // 银行卡号开头6位不符合规范
    return false
  }
  return true
}

/**
 * 校验企业信用代码
 * @param { string } code 企业信用代码
 * @return { boolean } 校验结果
 * @example
 */
export const checkCreditCode = ( code: string ): boolean => {
  !code && ( code = '' )
  let regex = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g
  if ( !regex.test( code ) ) return false
  return true
}
