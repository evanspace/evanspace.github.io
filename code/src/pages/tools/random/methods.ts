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
