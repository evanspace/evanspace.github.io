import { builder } from '../util'

const JsonList = [
  {
    name: '场地',
    type: 'MAIN_SCENE',
    position: { x: 0, y: 0, z: 0 }
  },

  {
    name: '公司楼层',
    type: 'campany_floor',
    position: { x: 0, y: 0, z: 0 },
    scale: { x: 0.1, y: 0.1, z: 0.1 }
  },

  {
    name: '通道闸机',
    type: 'access_gate',
    position: { x: 0, y: 0, z: 4 },
    scale: { x: 0.1, y: 0.1, z: 0.1 }
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
      x: -4,
      y: 3,
      z: 16.8
    },
    // 电梯到当前位置
    to: {
      x: 1.196,
      y: 0.2,
      z: -103.23
    },
    bind: '电梯门1'
  },
  {
    name: '二楼等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: -4,
      y: 17,
      z: 16.8
    },
    // 电梯到当前位置
    to: {
      x: 0.14,
      y: 13.8,
      z: -18.2
    },
    bind: '电梯门2'
  },
  {
    name: '三楼等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: -4,
      y: 23.8,
      z: 16.8
    },
    // 电梯到当前位置
    to: {
      x: 0.14,
      y: 19.83,
      z: -18.2
    },
    bind: '电梯门3'
  },
  {
    name: '五楼等电梯',
    type: 'WAIT_LIFT',
    position: {
      x: -4,
      y: 35.8,
      z: 16.8
    },
    // 电梯到当前位置
    to: {
      x: 0.14,
      y: 31.76,
      z: -18.2
    },
    bind: '电梯门5'
  }
]
JsonList.push(...lifts)

// 灯光
const lights = [
  {
    name: '2层聚光灯-1',
    type: 'spot_light_floor_2',
    position: {
      x: 3.6,
      y: 18.5,
      z: 5.6
    },
    to: {
      x: 3.6,
      y: 0,
      z: 5.6
    }
  },
  {
    name: '2层聚光灯-2',
    type: 'spot_light_floor_2',
    position: {
      x: 15.4,
      y: 18.5,
      z: 5.6
    },
    to: {
      x: 15.4,
      y: 0,
      z: 5.6
    }
  }
]
JsonList.push(...lights)

// 灯关-锚点
const lightSwitchs = [
  {
    name: '2层聚光灯',
    type: 'LIGHT_SWITCH',
    position: {
      x: 3.6,
      y: 14.5,
      z: 5.6
    },
    bind: '2层聚光灯-1'
  },
  {
    name: '2层聚光灯',
    type: 'LIGHT_SWITCH',
    position: {
      x: 15.4,
      y: 14.5,
      z: 5.6
    },
    bind: '2层聚光灯-2'
  }
]
JsonList.push(...lightSwitchs)

// 闸机
const tages = [
  {
    name: '通道闸机',
    type: 'GATE_SWITCH',
    position: { x: 0, y: 1, z: 2.5 },
    bind: '通道闸机'
  }
]
JsonList.push(...tages)

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
          to: { x: -4.85, y: 35.07, z: -251.78 }
        }
      })
  }
]
