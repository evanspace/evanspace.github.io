/**
 * 质补长存 数字字符串 长度不够前置位补 ‘0’
 * @param _num 数值
 * @param n  指定长度
 */
export const addstrnums = (_num, n) => {
  let len = _num.toString().length
  while (len < n) {
    _num = '0' + _num
    len++
  }
  return _num
}

/**
 * 获取指定月分天数
 * @param _year 年份
 * @param _month 月份
 */
export const getAssignMonthDays = (_year, _month) => {
  let days
  if (_month == 2) {
    days = _year % 4 == 0 ? 29 : 28
  } else if (
    _month == 1 ||
    _month == 3 ||
    _month == 5 ||
    _month == 7 ||
    _month == 8 ||
    _month == 10 ||
    _month == 12
  ) {
    days = 31
  } else {
    days = 30
  }
  return days
}

/**
 * 获取随机身份证号
 * @param _addres 地址
 * @param _birt 生日
 * @param _sex 性别
 */
export const getIdentityNum = (_addres, _birt, _sex) => {
  // 加权因子
  const coefficientArray = '7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2'.split(',')
  // 校验码
  const lastNumberArray = '1,0,X,9,8,7,6,5,4,3,2'.split(',')
  const s =
    Math.floor(Math.random() * 10).toString() + Math.floor(Math.random() * 10).toString() + _sex
  const array = (_addres + _birt + s).split('')
  let total = 0
  for (let i in array) {
    total = total + parseInt(array[i]) * parseInt(coefficientArray[i])
  }
  const lastNumber = lastNumberArray[total % 11]
  const id_no_String = _addres + _birt + s + lastNumber
  return id_no_String
}

/**
 * 验证18位数身份证号码中的生日是否是有效生日
 * @param idCard 18位书身份证字符串
 * @return
 */
const isValidityBrithBy18IdCard = idCard18 => {
  const year = idCard18.substring(6, 10)
  const month = idCard18.substring(10, 12)
  const day = idCard18.substring(12, 14)
  const temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day))
  // 这里用getFullYear()获取年份，避免千年虫问题
  if (
    temp_date.getFullYear() != parseFloat(year) ||
    temp_date.getMonth() != parseFloat(month) - 1 ||
    temp_date.getDate() != parseFloat(day)
  ) {
    return false
  } else {
    return true
  }
}

/**
 * 判断身份证号码为18位时最后的验证位是否正确
 * @param a_idCard 身份证号码数组
 * @return
 */
const isTrueValidateCodeBy18IdCard = a_idCard => {
  const Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1] // 加权因子
  const ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] // 身份证验证位值.10代表X
  let sum = 0 // 声明加权求和变量
  if (a_idCard[17].toLowerCase() == 'x') {
    a_idCard[17] = 10 // 将最后位为x的验证码替换为10方便后续操作
  }
  for (var i = 0; i < 17; i++) {
    sum += Wi[i] * a_idCard[i] // 加权求和
  }
  const valCodePosition = sum % 11 // 得到验证码所位置
  if (a_idCard[17] == ValideCode[valCodePosition]) {
    return true
  } else {
    return false
  }
}

/**
 * 去掉字符串的头空格（左空格）
 * @param _str 字符串
 */
const triml = _str => {
  let i
  for (i = 0; i < _str.length; i++) {
    if (_str.charAt(i) != ' ') break
  }
  const str = _str.substring(i, _str.length)
  return str
}
/**
 * 去掉字符串的尾空格（右空格）
 * @param _str 字符串
 */
const trimr = _str => {
  let i
  for (i = _str.length - 1; i >= 0; i--) {
    if (_str.charAt(i) != ' ') break
  }
  const str = _str.substring(0, i + 1)
  return str
}
/**
 * 去掉字符串的头尾空格
 * @param _str 字符串
 */
const trims = _str => {
  return triml(trimr(_str))
}

/**
 * 验证身份证号
 * @param idCard 身份证号
 */
export const checkIdentity = idCard => {
  idCard = trims(idCard.replace(/ /g, '')) //去掉字符串头尾空格
  if (idCard.length == 18) {
    var a_idCard = idCard.split('') // 得到身份证数组
    if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {
      //进行18位身份证的基本验证和第18位的验证
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

// 身份证号码地址码
export const identityAreaCode = [
  { name: '北京市东城区', value: '110101' },
  { name: '北京市西城区', value: '110102' },
  { name: '北京市崇文区', value: '110103' },
  { name: '北京市宣武区', value: '110104' },
  { name: '北京市朝阳区', value: '110105' },
  { name: '北京市丰台区', value: '110106' },
  { name: '北京市石景山区', value: '110107' },
  { name: '北京市海淀区', value: '110108' },
  { name: '北京市门头沟区', value: '110109' },
  { name: '河北省石家庄市市辖区', value: '130101' },
  { name: '河北省石家庄市长安区', value: '130102' },
  { name: '河北省石家庄市桥东区', value: '130103' },
  { name: '山西省太原市市辖区', value: '140101' },
  { name: '山西省阳泉市城区', value: '140302' },
  { name: '内蒙古呼和浩特市市辖区', value: '150101' },
  { name: '内蒙古喀喇沁旗', value: '150428' },
  { name: '辽宁省沈阳市市辖区', value: '210101' },
  { name: '辽宁省大连市沙河口区', value: '210204' },
  { name: '吉林省长春市市辖区', value: '220101' },
  { name: '吉林省长春市二道河子区', value: '220105' },
  { name: '黑龙江哈尔滨市道里区', value: '230102' },
  { name: '上海市虹口区', value: '310109' },
  { name: '江苏省南京市玄武区', value: '320102' },
  { name: '浙江省东阳市', value: '330783' },
  { name: '安徽省合肥市东市区', value: '340102' },
  { name: '福建省福州市仓山区', value: '350104' },
  { name: '江西省南昌市西湖区', value: '360103' },
  { name: '山东省济南市市中区', value: '370103' },
  { name: '山东省青岛市市北区', value: '370203' },
  { name: '河南省郑州市中原区', value: '410102' },
  { name: '湖北省武汉市汉阳区', value: '420105' },
  { name: '湖南省长沙市东区', value: '430102' },
  { name: '广东省广州市越秀区', value: '440104' },
  { name: '广西南宁市城北区', value: '450104' },
  { name: '海南省临高县', value: '460028' },
  { name: '四川省成都市金牛区', value: '510106' },
  { name: '贵州省贵阳市乌当区', value: '520112' },
  { name: '云南省昆明市盘龙区', value: '530103' },
  { name: '西藏拉萨市城关区', value: '540102' },
  { name: '陕西省西安市新城区', value: '610102' },
  { name: '甘肃省兰州市七里河区', value: '620103' },
  { name: '青海省西宁市城北区', value: '630105' },
  { name: '新疆乌鲁木齐市天山区', value: '650102' },
  { name: '台湾省', value: '710000' },
  { name: '香港特别行政区', value: '720000' }
]
