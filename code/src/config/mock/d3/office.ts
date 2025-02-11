import { builder } from '../util'

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
    position: { x: 7.7, y: 192.9, z: -2.1 },
    rotation: { x: -90, y: 0, z: 0 }
  }
  // {
  //   name: '公司主灯光组',
  //   type: 'rect_area_light_2',
  //   position: { x: 3, y: 187, z: 63.1 },
  //   rotation: { x: 0, y: 180, z: 0 }
  // },
  // {
  //   name: '公司主灯光组',
  //   type: 'rect_area_light_2',
  //   position: { x: 3, y: 187, z: -66.9 },
  //   rotation: { x: 0, y: 0, z: 0 }
  // },
  // {
  //   name: '公司主灯光组',
  //   type: 'rect_area_light_2',
  //   position: { x: 70.9, y: 187, z: -1.7 },
  //   rotation: { x: 0, y: -90, z: 0 }
  // },
  // {
  //   name: '公司主灯光组',
  //   type: 'rect_area_light_2',
  //   position: { x: -55.5, y: 187, z: -1.7 },
  //   rotation: { x: 0, y: 90, z: 0 }
  // }
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
const anchorHeight = 188

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
    // position: { x: 14.7, y: 188, z: 49 },
    position: { x: 12, y: 188, z: 49 },
    bind: '公司主灯光组'
  },
  // {
  //   name: '灯光总开关',
  //   type: 'LIGHT_MAIN_SWITCH',
  //   position: { x: 12, y: 188, z: 49 }
  // },

  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: 13.3, y: 188, z: 49 },
    // bind: '平面545'
    bind: '_空调风_grp'
  },

  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -41.1, y: 188, z: 31.8 },
    bind: '陈总办公室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -41.1, y: 188, z: 11.4 },
    bind: '逄总办公室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -41.1, y: 188, z: -9 },
    bind: '财务室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -46.1, y: 188, z: -14 },
    bind: 'CFO办公室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: -31.5, y: 188, z: 58.6 },
    bind: '大会议室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: 61.1, y: 188, z: 24.7 },
    bind: '大洽谈室'
  },
  {
    name: '空调开关',
    type: 'AIR_SWITCH',
    position: { x: 56.8, y: 188, z: 1.8 },
    bind: '_老板办公室_grp'
  }
]
JsonList.push(...lightSwitchs)

// 公司门
const companyDoors = [
  {
    name: '公司大门',
    type: 'DOUBLE_HORIZONTAL_SWITCH',
    position: { x: 14.5, y: anchorHeight, z: 28.7 },
    bind: '_公司大门_grp',
    // 移动轴
    axle: 'x'
  },
  {
    name: '公司大门',
    type: 'DOUBLE_HORIZONTAL_SWITCH',
    position: { x: 14.5, y: anchorHeight, z: 30 },
    bind: '_公司大门_grp',
    // 移动轴
    axle: 'x'
  },

  {
    name: '小会议室',
    type: 'DOUBLE_HORIZONTAL_SWITCH',
    position: { x: -10.2, y: anchorHeight, z: 29.5 },
    bind: '_小会议室-门_grp',
    // 移动轴
    axle: 'x'
  },
  {
    name: '小会议室',
    type: 'DOUBLE_HORIZONTAL_SWITCH',
    position: { x: -10.2, y: anchorHeight, z: 30.5 },
    bind: '_小会议室-门_grp',
    // 移动轴
    axle: 'x'
  },

  {
    name: '大会议室',
    type: 'DOUBLE_ROTATE_SWITCH',
    position: { x: -27.8, y: anchorHeight, z: 53.8 },
    bind: '_大会议室-门_grp',
    // 旋转轴
    axle: 'y'
  },
  {
    name: '大会议室',
    type: 'DOUBLE_ROTATE_SWITCH',
    position: { x: -29, y: anchorHeight, z: 53.8 },
    bind: '_大会议室-门_grp',
    // 旋转轴
    axle: 'y'
    // 内部
    // internal: 1
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
  // {
  //   name: '老板办公室',
  //   type: 'DOUBLE_ROTATE_SWITCH',
  //   position: { x: 51, y: anchorHeight, z: 4.8 },
  //   bind: '_老板办公室-门_grp',
  //   autoClose: 0
  // }
]
JsonList.push(...companyDoors)

// 视频
const videos = [
  {
    name: '公司大屏',
    type: 'SCREEN_EDIT',
    position: { x: 28.3, y: 189.5, z: 35 },
    bind: '公司大屏'
  },

  {
    name: '公司大屏',
    type: 'VIDEO_SWITCH',
    position: { x: 28.3, y: 188.2, z: 35 },
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
    position: { x: -10.2, y: 189.2, z: 8.5 },
    bind: '小会议室大屏'
  },
  {
    name: '小会议室大屏-照明灯',
    type: 'spot_light_floor_3',
    position: { x: -9.6, y: 192, z: 10 },
    to: { x: -9.6, y: 189.5, z: 7.9 }
  },

  {
    name: '大会议电视屏幕',
    type: 'VIDEO_SWITCH',
    position: { x: -48, y: 187.4, z: 52.5 },
    bind: '大会议电视屏幕'
  },
  {
    name: '大会议电视屏幕-照明灯',
    type: 'spot_light_floor_3',
    position: { x: -45, y: 192, z: 52.5 },
    to: { x: -48.4, y: 191, z: 52.5 }
  }
]
JsonList.push(...videos)

// 窗帘
const curtains = [
  {
    name: '窗帘开关',
    type: 'CURTAIN_SWITCH',
    position: { x: 10.7, y: 188, z: 49 },
    bind: '_GROUP_013_grp'
  }
]
JsonList.push(...curtains)

export default [
  {
    // 项目楼层数据
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
            [-120, 0.1, 101],
            [139, 0.1, 101],
            [139, 0.1, -122],
            [-120, 0.1, -122]
          ],

          roamPoints: [
            [14.4, 188, 14.77],
            [14.4, 188, 41.7],
            [-36.4, 188, 39.9],
            [-36.4, 188, -29.5],

            [-36.4, 188, 39.9],
            [14.4, 188, 41.7],
            [51, 188, 39.9],
            [51, 188, -26.5]

            // [1.7, -1.4, 51.3],
            // [80.5, 72.6, 75],
            // [87, 160, -72.4],
            // [13.2, 186, -72.4],
            // [13.2, 186, -61.3],
            // [52, 186, -28.2],
            // [52, 186, 42.7],
            // [-36.4, 186, 40],
            // [-38.2, 186, -26.8]
          ]
        }
      })
  }
]
