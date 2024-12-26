import { builder } from '../util'

const JsonList = [
  {
    name: '场地',
    type: 'MAIN_SCENE',
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
    name: '一号机位',
    type: 'ANCHOR_POS',
    position: { x: -1.15, y: 5.8, z: 186.36 },
    to: { x: 20.2, y: 10.3, z: 218.5 },
    target: { x: -1.57, y: -2.6, z: 173.4 },
    bind: 'Tree-03-2158'
  }
]
JsonList.push(...posList)

// 电梯
const lifts = [
  {
    name: '-楼等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: 4.3,
      y: 3,
      z: 19.1
    },
    // 电梯到当前位置
    to: {
      x: 0,
      y: 0.1,
      z: 8.9
    },
    bind: '_一楼电梯门-1_grp',
    left: '左006',
    right: '右006'
  },
  {
    name: '公司楼层等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: 4.3,
      y: 187,
      z: 19.1
    },
    // 电梯到当前位置
    to: {
      x: 0,
      y: 184.7,
      z: 8.9
    },
    bind: '电梯外门001',
    left: '左005',
    right: '右005'
  }
]
JsonList.push(...lifts)

// 灯光
const lights = [
  {
    name: '前台灯聚光灯-1',
    type: 'spot_light_floor_2',
    position: {
      x: 14.7,
      y: 191,
      z: 56
    },
    to: {
      x: 14.7,
      y: 186,
      z: 56
    }
  },
  {
    name: '主机照明灯-1',
    type: 'spot_light_floor_2',
    position: {
      x: 22.5,
      y: 191,
      z: 58
    },
    to: {
      x: 22.5,
      y: 186,
      z: 58
    }
  }
]
JsonList.push(...lights)

// 灯关-锚点
const lightSwitchs = [
  {
    name: '前台灯',
    type: 'LIGHT_SWITCH',
    position: {
      x: 14.7,
      y: 186,
      z: 56
    },
    bind: '前台灯聚光灯-1'
  },
  {
    name: '主机照明灯',
    type: 'LIGHT_SWITCH',
    position: {
      x: 22.5,
      y: 186,
      z: 57
    },
    bind: '主机照明灯-1'
  }
]
JsonList.push(...lightSwitchs)

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

// 公司门
const companyDoors = [
  {
    name: '公司大门',
    type: 'DUBLE_HORIZONTAL_SWITCH',
    position: { x: 14.5, y: 186, z: 28.7 },
    bind: '_公司大门_grp',
    // 移动轴
    axle: 'x'
  },
  {
    name: '公司大门',
    type: 'DUBLE_HORIZONTAL_SWITCH',
    position: { x: 14.5, y: 186, z: 30 },
    bind: '_公司大门_grp',
    // 移动轴
    axle: 'x'
  },

  {
    name: '小会议室',
    type: 'DUBLE_HORIZONTAL_SWITCH',
    position: { x: -10.2, y: 186, z: 29.5 },
    bind: '_小会议室-门_grp',
    // 移动轴
    axle: 'x'
  },
  {
    name: '小会议室',
    type: 'DUBLE_HORIZONTAL_SWITCH',
    position: { x: -10.2, y: 186, z: 30.5 },
    bind: '_小会议室-门_grp',
    // 移动轴
    axle: 'x'
  },

  {
    name: '大会议室',
    type: 'DUBLE_ROTATE_SWITCH',
    position: { x: -28, y: 186, z: 53.8 },
    bind: '_大会议室-门_grp',
    // 旋转轴
    axle: 'y'
  },
  {
    name: '大会议室',
    type: 'DUBLE_ROTATE_SWITCH',
    position: { x: -29, y: 186, z: 53.8 },
    bind: '_大会议室-门_grp',
    // 旋转轴
    axle: 'y'
    // 内部
    // internal: 1
  },

  {
    name: '老板办公室',
    type: 'DUBLE_ROTATE_SWITCH',
    position: { x: 51, y: 186, z: 5.9 },
    bind: '_老板办公室-门_grp'
  },
  {
    name: '老板办公室',
    type: 'DUBLE_ROTATE_SWITCH',
    position: { x: 51, y: 186, z: 4.8 },
    bind: '_老板办公室-门_grp'
  }
]
JsonList.push(...companyDoors)

// 视频
const videos = [
  {
    name: '公司大屏',
    type: 'VIDEO_SWITCH',
    position: { x: 34.5, y: 189.2, z: 34 },
    bind: '公司大屏'
  }
]
JsonList.push(...videos)

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
          target: { x: 78.6, y: -1.4, z: 194.8 },
          to: { x: -799.2, y: 55, z: 376.3 }
        }
      })
  }
]
