import { builder } from '../util'
import { mock } from 'mockjs'

const JsonList = [
  {
    name: '场地',
    type: 'MAIN_SCENE'
  },
  {
    name: '窗帘',
    type: 'curtain',
    position: { x: 0, y: 0, z: 0 }
  },
  {
    name: '1-24',
    type: 'floor_low',
    position: { x: 0, y: 0, z: 0 }
  },
  {
    name: '26-42',
    type: 'floor_heigh',
    position: { x: 0, y: 0, z: 0 }
  },

  {
    name: '公司楼层',
    type: 'campany_floor',
    position: { x: 0, y: 0, z: 0 }
  }
]

// 监测点
const dotList = [
  // {
  //   name: '监测点',
  //   type: 'DOT',
  //   position: { x: -26.98, y: 186.85, z: 36.69 }
  // }
]
JsonList.push(...dotList)

// 3D数据点高度
const dot3Height = 187.6
const dot3List = [
  {
    name: '前台',
    type: 'DOT3',
    code: 'area_1',
    id: 86,
    position: { x: 14, y: dot3Height + 0.5, z: 48.6 },
    rotation: { x: 0, y: 90, z: 0 }
  },
  {
    name: '综合办公区',
    type: 'DOT3',
    code: 'area_2',
    id: 82,
    position: { x: -10.45, y: dot3Height, z: 44.6 }
  },
  {
    name: '大会议室',
    type: 'DOT3',
    code: 'area_3',
    id: 75,
    position: { x: -33.55, y: dot3Height, z: 44.6 }
  },
  {
    name: '副总办公室1',
    type: 'DOT3',
    code: 'area_4',
    id: 71,
    position: { x: -40.3, y: dot3Height, z: 31.4 },
    rotation: { x: 0, y: -90, z: 0 }
  },
  {
    name: '副总办公室2',
    type: 'DOT3',
    code: 'area_5',
    id: 72,
    position: { x: -40.3, y: dot3Height, z: 11.2 },
    rotation: { x: 0, y: -90, z: 0 }
  },
  {
    name: '财务部',
    type: 'DOT3',
    code: 'area_6',
    id: 74,
    position: { x: -40.3, y: dot3Height, z: -9.2 },
    rotation: { x: 0, y: -90, z: 0 }
  },
  {
    name: 'CFO办公室',
    type: 'DOT3',
    code: 'area_7',
    id: 73,
    position: { x: -40.3, y: dot3Height, z: -18.2 },
    rotation: { x: 0, y: -90, z: 0 }
  },
  {
    name: '洽谈室一',
    type: 'DOT3',
    code: 'area_8',
    id: 79,
    position: { x: -32.2, y: dot3Height, z: -17.5 },
    rotation: { x: 0, y: 90, z: 0 }
  },
  {
    name: '人事办公区',
    type: 'DOT3',
    code: 'area_9',
    id: 181,
    position: { x: -22.5, y: dot3Height, z: 5.2 },
    rotation: { x: 0, y: 90, z: 0 }
  },
  {
    name: '小会议室',
    type: 'DOT3',
    code: 'area_10',
    id: 76,
    position: { x: -10.9, y: dot3Height, z: 34.4 },
    rotation: { x: 0, y: 180, z: 0 }
  },
  {
    name: '洽谈室二',
    type: 'DOT3',
    code: 'area_11',
    id: 78,
    position: { x: 46.7, y: dot3Height, z: 23.3 },
    rotation: { x: 0, y: 270, z: 0 }
  },
  {
    name: '茶室',
    type: 'DOT3',
    code: 'area_12',
    id: 80,
    position: { x: 46.7, y: dot3Height, z: 16.7 },
    rotation: { x: 0, y: 270, z: 0 }
  },
  {
    name: '总裁办公室',
    type: 'DOT3',
    code: 'area_13',
    id: 85,
    position: { x: 49.1, y: dot3Height, z: 5.3 },
    rotation: { x: 0, y: 270, z: 0 }
  },
  {
    name: '副总办公室4',
    type: 'DOT3',
    code: 'area_14',
    id: 81,
    position: { x: 55.3, y: dot3Height, z: 19.6 },
    rotation: { x: 0, y: 90, z: 0 }
  },
  {
    name: '大洽谈室',
    type: 'DOT3',
    code: 'area_15',
    id: 77,
    position: { x: 55.3, y: dot3Height, z: 28.2 },
    rotation: { x: 0, y: 90, z: 0 }
  },
  {
    name: '研发及商务办公区',
    type: 'DOT3',
    code: 'area_16',
    id: 84,
    position: { x: 55.2, y: dot3Height, z: 45.9 },
    rotation: { x: 0, y: 90, z: 0 }
  }
]
JsonList.push(...dot3List)

// 定位点
const posList = [
  {
    name: '一楼大门',
    type: 'ANCHOR_POS',
    to: { x: -1.3, y: 6.2, z: 102.3 },
    target: { x: -1.4, y: 5.8, z: 97.4 }
  },
  {
    name: '公司前台',
    type: 'ANCHOR_POS',
    to: { x: 15.3, y: 188, z: 33.2 },
    target: { x: 15.3, y: 188, z: 36.3 }
  },
  {
    name: '办公区域',
    type: 'ANCHOR_POS',
    to: { x: -38, y: 188, z: 35.3 },
    target: { x: -35.4, y: 188, z: 36.4 }
  },
  {
    name: '大会议室',
    type: 'ANCHOR_POS',
    to: { x: -28.8, y: 188, z: 52.7 },
    target: { x: -33.7, y: 188, z: 53.4 }
  },
  {
    name: '领导办公',
    type: 'ANCHOR_POS',
    to: { x: 69.4, y: 188, z: -0.4 },
    target: { x: 65, y: 188, z: -2.7 }
  }
]
JsonList.push(...posList)

// 电梯
const lifts = [
  // 下-右
  {
    name: '-楼等电梯',
    type: 'WAIT_LIFT',
    position: { x: 4.3, y: 3, z: 19.1 },
    // 电梯到当前位置
    to: { x: 0, y: 0.1, z: 8.9 },
    // 目标
    target: '电梯-2',
    // 门
    bind: '_一楼电梯门-2_grp',
    left: '左006',
    right: '右006'
  },
  {
    name: '公司楼层等电梯',
    type: 'WAIT_LIFT',
    position: { x: 2, y: 3, z: 23 },
    // 电梯到当前位置
    to: { x: 0, y: 0.1, z: 8.9 },
    // 目标
    target: '电梯-2',
    // 门
    bind: '_一楼电梯门-2_grp',
    left: '左006',
    right: '右006'
  },

  // 上-右
  {
    name: '公司楼层等电梯',
    type: 'WAIT_LIFT',
    position: { x: 4.3, y: 187, z: 19.1 },
    // 电梯到当前位置
    to: { x: 0, y: 184.7, z: 8.9 },
    // 目标
    target: '电梯-2',
    bind: '_电梯外门_2_grp',
    left: '左005',
    right: '右005'
  },
  {
    name: '公司楼层等电梯',
    type: 'WAIT_LIFT',
    position: { x: 2, y: 187, z: 23 },
    // 电梯到当前位置
    to: { x: 0, y: 184.7, z: 8.9 },
    // 目标
    target: '电梯-2',
    bind: '_电梯外门_2_grp',
    left: '左005',
    right: '右005'
  },

  // 下-左
  {
    name: '-楼等电梯',
    type: 'WAIT_LIFT',
    position: { x: 4.3, y: 3, z: 9.5 },
    // 电梯到当前位置
    to: { x: 0, y: 0.1, z: 8.9 },
    // 目标
    target: '电梯-1',
    // 门
    bind: '_一楼电梯门-1_grp',
    left: '左001',
    right: '右001'
  },
  {
    name: '-楼等电梯',
    type: 'WAIT_LIFT',
    position: { x: 2, y: 3, z: 14.4 },
    // 电梯到当前位置
    to: { x: 0, y: 0.1, z: 8.9 },
    // 目标
    target: '电梯-1',
    // 门
    bind: '_一楼电梯门-1_grp',
    left: '左001',
    right: '右001'
  },

  // 上-左
  {
    name: '公司楼层等电梯',
    type: 'WAIT_LIFT',
    position: { x: 4.3, y: 187, z: 9.5 },
    // 电梯到当前位置
    to: { x: 0, y: 184.7, z: 8.9 },
    // 目标
    target: '电梯-1',
    bind: '_电梯外门_1_grp',
    left: '左004',
    right: '右004'
  },
  {
    name: '公司楼层等电梯',
    type: 'WAIT_LIFT',
    position: { x: 2, y: 187, z: 14.4 },
    // 电梯到当前位置
    to: { x: 0, y: 184.7, z: 8.9 },
    // 目标
    target: '电梯-1',
    bind: '_电梯外门_1_grp',
    left: '左004',
    right: '右004'
  }
]
JsonList.push(...lifts)

// 闸机
const tages = [
  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 28, y: 1, z: 23.8 },
    bind: '_一号闸门_grp',
    left: '左透明003',
    right: '右透明003'
  },
  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 22, y: 1, z: 28.3 },
    // 内部
    internal: 1,
    bind: '_一号闸门_grp',
    left: '左透明003',
    right: '右透明003'
  },

  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 28, y: 1, z: 19.3 },
    bind: '_二号闸门_grp',
    left: '左透明002',
    right: '右透明002'
  },
  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 22, y: 1, z: 23.7 },
    // 内部
    internal: 1,
    bind: '_二号闸门_grp',
    left: '左透明002',
    right: '右透明002'
  },

  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 28, y: 1, z: 14.8 },
    bind: '_三号闸门_grp',
    left: '左透明001',
    right: '右透明001'
  },
  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 22, y: 1, z: 19.2 },
    // 内部
    internal: 1,
    bind: '_三号闸门_grp',
    left: '左透明001',
    right: '右透明001'
  },

  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 28, y: 1, z: 10.3 },
    bind: '_四号闸门_grp',
    left: '左透明',
    right: '右透明'
  },
  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 22, y: 1, z: 14.8 },
    // 内部
    internal: 1,
    bind: '_四号闸门_grp',
    left: '左透明',
    right: '右透明'
  }
]
JsonList.push(...tages)

// 灯光
const lights = [
  // {
  //   name: '前台聚光灯',
  //   type: 'spot_light_floor_2',
  //   position: { x: 17.7, y: 191, z: 55.7 }
  // },
  // {
  //   name: '前台聚光灯',
  //   type: 'spot_light_floor_2',
  //   position: { x: 14.1, y: 191, z: 55.7 }
  // },
  // {
  //   name: '前台聚光灯',
  //   type: 'spot_light_floor_2',
  //   position: { x: 22, y: 191, z: 61 }
  // },
  // {
  //   name: '前台聚光灯',
  //   type: 'spot_light_floor_2',
  //   position: { x: 32, y: 191, z: 61 }
  // },
  // {
  //   name: '前台聚光灯',
  //   type: 'spot_light_floor_2',
  //   position: { x: 42, y: 191, z: 61 }
  // },

  // 主机灯
  {
    name: '主机照明灯',
    type: 'spot_light_floor_1',
    position: { x: 23, y: 190.7, z: 54.6 },
    to: { x: 22.4, y: 190.4, z: 58 }
  },
  {
    name: '主机照明灯',
    type: 'spot_light_floor_1_2',
    position: { x: 25.5, y: 190.7, z: 53.1 },
    to: { x: 25.5, y: 190.7, z: 53.2 }
  },
  {
    name: '主机照明灯',
    type: 'spot_light_floor_1',
    position: { x: 25.1, y: 190.7, z: 54.6 },
    to: { x: 25.1, y: 188.7, z: 58.4 }
  },
  {
    name: '主机照明灯',
    type: 'spot_light_floor_1',
    position: { x: 27.8, y: 190.7, z: 54.6 },
    to: { x: 27.8, y: 189.1, z: 58.6 }
  },
  {
    name: '主机照明灯',
    type: 'spot_light_floor_1',
    position: { x: 30, y: 190.7, z: 54.6 },
    to: { x: 30.5, y: 189, z: 58.5 }
  },
  {
    name: '主机照明灯',
    type: 'spot_light_floor_1',
    position: { x: 30, y: 190.7, z: 52.5 },
    to: { x: 32.2, y: 186.7, z: 52.6 }
  },

  // 大会议室
  {
    name: '大会议室照明灯',
    type: 'spot_light_floor_2',
    position: { x: -32, y: 190.7, z: 58 }
  },
  {
    name: '大会议室照明灯',
    type: 'spot_light_floor_2',
    position: { x: -42, y: 190.7, z: 58 }
  },
  {
    name: '大会议室照明灯',
    type: 'spot_light_floor_2',
    position: { x: -32, y: 190.7, z: 50 }
  },
  {
    name: '大会议室照明灯',
    type: 'spot_light_floor_2',
    position: { x: -42, y: 190.7, z: 50 }
  },

  {
    name: '公司主灯光组',
    type: 'rect_area_light_1',
    position: { x: 7.7, y: 192, z: -2.1 },
    rotation: { x: -90, y: 0, z: 0 }
  },
  {
    name: '公司主灯光组',
    type: 'rect_area_light_2',
    position: { x: 7.7, y: 192, z: -2.1 },
    rotation: { x: -270, y: 0, z: 0 }
  },

  {
    name: '一楼灯光组',
    type: 'rect_area_light_1',
    position: { x: 7.7, y: 7.5, z: -2.1 },
    rotation: { x: -90, y: 0, z: 0 }
  },
  {
    name: '一楼灯光组',
    type: 'rect_area_light_2',
    position: { x: 7.7, y: 7.5, z: -2.1 },
    rotation: { x: -270, y: 0, z: 0 }
  }
]

let len = 0,
  x = -46 + (6 - len) * 10
// 区域A-通道
for (let i = 0; i < len; i++) {
  lights.push(
    {
      name: '区域A',
      type: 'spot_light_floor_2',
      position: { x, y: 191, z: 37 }
    },
    {
      name: '区域A',
      type: 'spot_light_floor_2',
      position: { x, y: 191, z: 45 }
    }
  )
  x += 10
}
let z = -30 + (6 - len) * 10
// 区域B-人事
for (let i = 0; i < len; i++) {
  lights.push(
    {
      name: '区域B',
      type: 'spot_light_floor_2',
      position: { x: -50, y: 191, z }
    },
    {
      name: '区域B',
      type: 'spot_light_floor_2',
      position: { x: -36, y: 191, z }
    },
    {
      name: '区域B',
      type: 'spot_light_floor_2',
      position: { x: -26, y: 191, z }
    }
  )
  z += 10
}
JsonList.push(...lights)

// 公司锚点高度
const anchorHeight = 187.6

// 灯关-锚点
const lightSwitchs = [
  // {
  //   name: '前台灯',
  //   type: 'LIGHT_SWITCH',
  //   position: { x: 14.7, y: anchorHeight, z: 56 },
  //   bind: '前台聚光灯'
  // },
  // {
  //   name: '过道灯',
  //   type: 'LIGHT_SWITCH',
  //   position: { x: 5.9, y: anchorHeight, z: 34.5 },
  //   bind: '区域A'
  // },
  // {
  //   name: '人事区域',
  //   type: 'LIGHT_SWITCH',
  //   position: { x: -39.7, y: anchorHeight, z: 26.8 },
  //   bind: '区域B'
  // },
  {
    name: '主机照明灯',
    type: 'LIGHT_SWITCH',
    position: { x: 25, y: anchorHeight, z: 53.8 },
    bind: '主机照明灯'
  },
  {
    name: '大会议室照明灯',
    type: 'LIGHT_SWITCH',
    position: { x: -30, y: anchorHeight, z: 58.6 },
    bind: '大会议室照明灯'
  },

  {
    name: '灯光总开关',
    type: 'LIGHT_SWITCH',
    deviceCode: 'kg-01',
    // position: { x: 14.7, y: 188, z: 49 },
    position: { x: 12.7, y: anchorHeight, z: 49 },
    bind: '公司主灯光组'
  }
  // {
  //   name: '灯光总开关',
  //   type: 'LIGHT_MAIN_SWITCH',
  //   position: { x: 12, y: 188, z: 49 }
  // },
]
JsonList.push(...lightSwitchs)

// 空调-锚点
const airSwitch = [
  {
    name: '空调总开关',
    type: 'AIR_SWITCH',
    position: { x: 13.3, y: anchorHeight, z: 49 },
    bind: '_空调风_grp'
  },

  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -41.1, y: anchorHeight, z: 31.8 },
    bind: '陈总办公室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -41.1, y: anchorHeight, z: 11.4 },
    bind: '逄总办公室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -41.1, y: anchorHeight, z: -9 },
    bind: '财务室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -46.1, y: anchorHeight, z: -14 },
    bind: 'CFO办公室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -31.5, y: anchorHeight, z: 58.6 },
    bind: '大会议室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: 61.1, y: anchorHeight, z: 24.7 },
    bind: '大洽谈室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: 61.1, y: anchorHeight, z: 23.8 },
    bind: '程总办公室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: 56.8, y: anchorHeight, z: 1.8 },
    bind: '_老板办公室_grp'
  }
]
JsonList.push(...airSwitch)

// 公司门
const companyDoors = [
  {
    name: '公司大门',
    type: 'DOUBLE_HORIZONTAL_SWITCH',
    position: { x: 14.14, y: anchorHeight, z: 28.9 },
    bind: '_公司大门_grp',
    // 移动轴
    axle: 'x'
  },
  {
    name: '公司大门',
    type: 'DOUBLE_HORIZONTAL_SWITCH',
    position: { x: 14.83, y: anchorHeight, z: 29.7 },
    bind: '_公司大门_grp',
    // 移动轴
    axle: 'x'
  },

  {
    name: '小会议室',
    type: 'DOUBLE_HORIZONTAL_SWITCH',
    position: { x: -9.78, y: anchorHeight, z: 30.4 },
    bind: '_小会议室-门_grp',
    // 移动轴
    axle: 'x'
  },
  {
    name: '小会议室',
    type: 'DOUBLE_HORIZONTAL_SWITCH',
    position: { x: -10.14, y: anchorHeight, z: 29.6 },
    bind: '_小会议室-门_grp',
    // 移动轴
    axle: 'x'
  },

  {
    name: '大会议室',
    type: 'DOUBLE_ROTATE_SWITCH',
    position: { x: -28, y: anchorHeight, z: 54.6 },
    bind: '_大会议室-门_grp',
    // 旋转轴
    axle: 'y',
    autoClose: 0
  },

  {
    name: '副总裁室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: 55.4, y: anchorHeight, z: 21.4 },
    bind: '_程总办公室-门_grp'
  },
  {
    name: '大洽谈室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: 55.4, y: anchorHeight, z: 26.5 },
    bind: '_大洽谈室-门_grp',
    internal: 1
  },
  {
    name: '茶室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: 46.5, y: anchorHeight, z: 16.3 },
    bind: '_茶室-门_grp',
    internal: 1
  },
  {
    name: '中洽谈室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: 46.5, y: anchorHeight, z: 20.9 },
    bind: '_中洽谈室-门_grp'
  },
  {
    name: '陈总办公室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: -40.1, y: anchorHeight, z: 29.5 },
    bind: '_陈总办公室-门_grp'
  },
  {
    name: '逄总办公室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: -40.1, y: anchorHeight, z: 9.6 },
    bind: '_逄总办公室_grp'
  },
  {
    name: '财务室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: -40.1, y: anchorHeight, z: -11.1 },
    bind: '_财务室-门_grp'
  },
  {
    name: 'CFO办公室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: -40.1, y: anchorHeight, z: -16.5 },
    bind: '_CFO办公室-门_grp',
    internal: 1
  },
  {
    name: '小洽谈室',
    type: 'ODD_ROTATE_SWITCH',
    position: { x: -29.7, y: anchorHeight, z: -12.4 },
    bind: '_小洽谈室-门_grp',
    internal: 1
  },

  {
    name: '老板办公室',
    type: 'DOUBLE_ROTATE_SWITCH',
    position: { x: 51, y: anchorHeight, z: 5.9 },
    bind: '_老板办公室-门_grp',
    autoClose: 0
  }
]
JsonList.push(...companyDoors)

// 视频
const videos = [
  {
    name: '公司大屏',
    type: 'SCREEN_EDIT',
    position: { x: 28.3, y: 189.1, z: 34.5 },
    bind: '公司大屏'
  },

  {
    name: '公司大屏',
    type: 'VIDEO_SWITCH',
    position: { x: 28.3, y: 188.4, z: 34.5 },
    bind: '公司大屏'
  },
  {
    name: '公司大屏-照明灯',
    type: 'spot_light_floor_3',
    position: { x: 34.8, y: 189.2, z: 37 },
    to: { x: 34.5, y: 189.5, z: 33.4 }
  },

  {
    name: '小会议室大屏',
    type: 'VIDEO_SWITCH',
    position: { x: -10.2, y: 188.6, z: 8.5 },
    bind: '小会议室大屏'
  },
  {
    name: '小会议室大屏-照明灯',
    type: 'spot_light_floor_4',
    position: { x: -9.6, y: 187.8, z: 10 },
    to: { x: -9.6, y: 188.6, z: 7.9 }
  },

  {
    name: '大会议电视屏幕',
    type: 'VIDEO_SWITCH',
    position: { x: -48, y: 187.4, z: 52.5 },
    bind: '大会议电视屏幕'
  },
  {
    name: '大会议电视屏幕-照明灯',
    type: 'spot_light_floor_5',
    position: { x: -45, y: 186.8, z: 52.2 },
    to: { x: -48.4, y: 187.6, z: 52.5 }
  }
]
JsonList.push(...videos)

// 窗帘
const curtains = [
  {
    name: '窗帘开关',
    type: 'CURTAIN_SWITCH',
    deviceCode: 'cl-01',
    position: { x: 12.1, y: anchorHeight, z: 49 },
    bind: '_GROUP_013_grp'
  }
]
JsonList.push(...curtains)

export default [
  {
    // 办公室数据
    url: '/d3/office',
    method: 'get',
    response: () =>
      builder({
        JsonList,
        Name: '写字楼展示',
        ConfigJson: {
          target: { x: 0, y: 0, z: 0 },
          to: { x: -799.2, y: 55, z: 376.3 },

          cruise: [
            // 起点前台
            [15.78, 184.63, 43],
            [-37.53, 184.63, 43],
            [-37.53, 184.63, -29.85],
            [-34.1, 184.63, -29.85],

            // 人事
            [-34.1, 184.63, -9.6],
            [-23.77, 184.63, -9.6],
            [-23.77, 184.63, 19.85],
            [-34.1, 184.63, 19.85],

            // 陈总门口
            [-34.1, 184.63, 37.31],
            // 大屏角落
            [49.01, 184.63, 37.31],
            [49.01, 184.63, 10.31],
            [53.06, 184.63, 10.31],
            // 研发
            [53.06, 184.63, 43]
          ],

          roamPoints: [
            [16, 188, 33.68],
            [16, 188, 53],

            // 大会议室门前
            [-18.74, 188, 53],
            [-36.7, 188, 35.3],
            // 人事区域
            [-18.87, 188, 20.05],
            [-18.87, 188, -8.82],
            [-36.05, 188, -8.82],
            [-36.05, 188, 15],
            // 陈总办公室门口
            [-36.05, 188, 41.26],
            [-10.05, 188, 41.26],
            [15.05, 188, 41.26],
            // 大屏角落
            [47.87, 188, 41.26],
            [47.87, 188, 9.62],
            [53.29, 188, 9.62],
            // 研发
            [53.29, 188, 24],
            [53.29, 188, 57.15],
            // 沙发
            [39, 188, 47.95],
            // 主机
            [25.78, 188, 56.1]
          ]
        }
      })
  },

  {
    // 模式
    url: '/d3/office_mode',
    method: 'get',
    response: () =>
      builder([
        {
          id: 1,
          children: [],
          projectId: 75507,
          groupCode: 'G1',
          name: '自动工作模式',
          isActive: 1,
          isAuto: 0
        },
        {
          id: 7,
          children: [],
          projectId: 75507,
          groupCode: 'G1',
          name: '访客来访',
          isActive: 0,
          isAuto: 0
        },
        {
          id: 8,
          children: [],
          projectId: 75507,
          groupCode: 'G1',
          name: '会议模式',
          isActive: 0,
          isAuto: 0
        },
        {
          id: 9,
          children: [],
          projectId: 75507,
          groupCode: 'G1',
          name: '自动开温控模式',
          isActive: 0,
          isAuto: 0
        },
        {
          id: 10,
          children: [],
          projectId: 75507,
          groupCode: 'G1',
          name: '自动开温控+灯模式',
          isActive: 0,
          isAuto: 0
        },
        {
          id: 43,
          children: [],
          projectId: 75507,
          groupCode: 'G1',
          name: '测试自动',
          isActive: 0,
          isAuto: 0
        }
      ])
  },
  {
    // 区域用电量
    url: '/d3/office_area_count',
    method: 'get',
    response: () => {
      const date = new Date()
      const year = date.getFullYear() - 2
      return builder(
        mock({
          'list|3': [
            {
              'year|+1': year,
              'list|12': [
                {
                  'month|+1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  date: '@../../year - @month',
                  'value|300-500': 0
                }
              ]
            }
          ]
        }).list
      )
    }
  }
]
