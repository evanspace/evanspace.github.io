import { builder } from '../util'

const JsonList = [
  {
    name: '场地',
    type: 'MAIN_SCENE',
    position: { x: 0, y: 0, z: 0 }
  }
]

// 楼宇 building
const buildings = [
  // [-170, 200],
  // [170, 200]

  [-170, -420],
  [-100, -420],
  [-50, -470],
  [120, -470],
  [-170, -200],
  [170, -200],
  [620, -140],
  [830, -500],
  [950, -500]
]

const getListByPos = (pos, type, name) => {
  let data: any[] = []
  for (let i = 0; i < pos.length; i++) {
    const [x, z] = pos[i]
    data.push({
      name: name + 'i',
      type,
      position: {
        x,
        y: 0.2,
        z: -z
      }
    })
  }
  return data
}

const buildingList = getListByPos(buildings, 'building', '楼宇')
JsonList.push(...buildingList)

// 居民楼 residential
const residentials = [
  [-702, 950],
  [-180, 920],
  [-10, 920],
  [-294, 1030],
  [100, 1058],
  [100, 1176],
  [-310, 1242],
  [12, 1310],
  [-114, 1310],
  [500, 910],
  [354, 1220],
  [354, 1332],
  [500, 1400],
  [640, 1400],
  [680, 900],
  [850, 900],
  [1040, 990],
  [1040, 1106],
  [1040, 1220],
  [1040, 1332],
  [1500, 490],
  [1500, 600],
  [1600, 730],
  [1500, 870],
  [2500, 470],
  [2430, 600],
  [2400, 767],
  [2400, 880]
]
const residentialList = getListByPos(residentials, 'residential', '居民楼')
JsonList.push(...residentialList)

// 小型居民楼 small_residential
const small_residentials = [
  [760, 1022],
  [830, 1022],
  [860, 1108],
  [780, 1108],
  [720, 1108],
  [640, 1108],
  [560, 1108],
  [500, 1108],
  [860, 1182],
  [780, 1182],
  [720, 1182],
  [640, 1182],
  [560, 1182],
  [500, 1182],
  [860, 1253],
  [780, 1253],
  [720, 1253],
  [640, 1253],
  [560, 1253],
  [500, 1253]
]
const small_residentialList = getListByPos(small_residentials, 'small_residential', '小型居民楼')
JsonList.push(...small_residentialList)

// 监测点
const monitorCameras = [
  {
    name: 'DOT',
    unit: '%',
    type: 'DOT',
    position: {
      x: 300,
      y: 10,
      z: 350
    }
  },

  {
    name: '右侧-光伏板',
    unit: 'kWh',
    type: 'DOT',
    position: {
      x: 263.7,
      y: 56.3,
      z: 110.3
    }
  },
  {
    name: '右侧-光伏板',
    unit: 'kWh',
    type: 'DOT',
    position: {
      x: 242.2,
      y: 56.3,
      z: 73.8
    }
  },

  {
    name: '左侧-光伏板',
    unit: 'kWh',
    type: 'DOT',
    position: {
      x: -259.5,
      y: 56.6,
      z: 111.1
    }
  },
  {
    name: '左侧-光伏板',
    unit: 'kWh',
    type: 'DOT',
    position: {
      x: -248.7,
      y: 56.3,
      z: 72.3
    }
  }
]
JsonList.push(...monitorCameras)

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
