import { builder } from '../util'

const JsonList = [
  {
    name: '场地',
    type: 'MAIN_SCENE',
    position: { x: 0, y: 0, z: 0 }
  },
  {
    name: '机房',
    type: 'machine_room'
    // position: { x: -156.6, y: 1, z: 103 }
  }
]

// 楼宇 building
const buildings = [
  [-170, -420]
  // [-100, -420],
  // [-50, -470],
  // [120, -470],
  // [-170, -200],
  // [170, -200],
  // [620, -140],
  // [830, -500],
  // [950, -500]
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
  [-702, 950]
  // [-180, 920],
  // [-10, 920],
  // [-294, 1030],
  // [100, 1058],
  // [100, 1176],
  // [-310, 1242],
  // [12, 1310],
  // [-114, 1310],
  // [500, 910],
  // [354, 1220],
  // [354, 1332],
  // [500, 1400],
  // [640, 1400],
  // [680, 900],
  // [850, 900],
  // [1040, 990],
  // [1040, 1106],
  // [1040, 1220],
  // [1040, 1332],
  // [1500, 490],
  // [1500, 600],
  // [1600, 730],
  // [1500, 870],
  // [2500, 470],
  // [2430, 600],
  // [2400, 767],
  // [2400, 880]
]
const residentialList = getListByPos(residentials, 'residential', '居民楼')
JsonList.push(...residentialList)

// 小型居民楼 small_residential
const small_residentials = [
  [760, 1022]
  // [830, 1022],
  // [860, 1108],
  // [780, 1108],
  // [720, 1108],
  // [640, 1108],
  // [560, 1108],
  // [500, 1108],
  // [860, 1182],
  // [780, 1182],
  // [720, 1182],
  // [640, 1182],
  // [560, 1182],
  // [500, 1182],
  // [860, 1253],
  // [780, 1253],
  // [720, 1253],
  // [640, 1253],
  // [560, 1253],
  // [500, 1253]
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
  },
  {
    name: '楼层监测点',
    followMark: 'floor_common_0',
    unit: 'kWh',
    type: 'DOT',
    position: {
      x: 218.4,
      y: 1,
      z: 584.8
    }
  },

  {
    name: '制冷主机监测点',
    unit: '%',
    type: 'DOT',
    position: {
      x: -163,
      y: 12,
      z: 91.2
    }
  }
]
JsonList.push(...monitorCameras)

// 定位点
const posList = [
  {
    name: '东广场',
    type: 'ANCHOR_POS',
    position: { x: -1.15, y: 5.8, z: 186.36 },
    target: { x: 0, y: -2.6, z: 114.2 },
    to: { x: 0, y: 154.4, z: 637.2 }
  },
  {
    name: '西广场',
    type: 'ANCHOR_POS',
    position: { x: 113.4, y: 43.6, z: 116.4 },
    to: { x: 95.3, y: 57.4, z: -942.3 },
    target: { x: -143.6, y: -2.6, z: -263.6 }
  },
  {
    name: '候车室',
    type: 'ANCHOR_POS',
    // position: { x: 72.1, y: 4, z: -84 },
    to: { x: 88.5, y: 18.2, z: -62.4 },
    target: { x: 42.1, y: -2.6, z: -195.4 }
  },

  {
    name: '东辅楼',
    type: 'ANCHOR_POS',
    // position: { x: 203.6, y: 61.6, z: 24.5 },
    position: { x: 253.5, y: 58, z: 93.4 },
    to: { x: 150.7, y: 90, z: -24 },
    target: { x: 343, y: -2.6, z: 158.7 },
    bind: '_光伏大楼_2_grp'
  },

  {
    name: '西辅楼',
    type: 'ANCHOR_POS',
    // position: { x: -318, y: 70.9, z: 167.6 },
    position: { x: -254.4, y: 58, z: 100 },
    to: { x: -430.9, y: 162.7, z: 258.4 },
    target: { x: -188.3, y: -2.6, z: 64 },
    bind: '_光伏大楼_1_grp'
  },

  {
    name: '楼栋分层',
    type: 'ANCHOR_POS',
    position: { x: 207.4, y: 70.9, z: 603.2 },
    to: { x: 408.6, y: 146, z: 808 },
    target: { x: 13.3, y: -2.6, z: 486.6 },
    bind: 'build_1'
  }
]
JsonList.push(...posList)

// 锚点
const anchors = [
  {
    name: '右侧光伏',
    type: 'ANCHOR_TARGET',
    position: { x: 249.5, y: 60.4, z: 89.5 }
  },
  {
    name: '左侧光伏',
    type: 'ANCHOR_TARGET',
    position: { x: -249.5, y: 60.4, z: 101.4 }
  }
]
JsonList.push(...anchors)

// 开门锚点
const openDoors = [
  {
    name: '机房门禁',
    type: 'OPEN_DOOR',
    position: { x: -187.5, y: 29, z: 44.7 },
    bind: '南天门'
  }
]
JsonList.push(...openDoors)

// 抽屉楼层
const floors: any[] = []
const floorMap = {
  floor_common: 20
}

const list = [
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common',
  // 'floor_common'
]
let y = 0.2
for (let i = 0; i < list.length; i++) {
  y += floorMap[list[i - 1]] ?? 0
  floors.push({
    name: `${i + 1}楼`,
    type: list[i],
    mark: list[i] + '_' + i,
    group: 'build_1',
    position: {
      x: 218.4,
      y: y,
      z: 584.8
    }
  })
}
JsonList.push(...floors)

// 灯光
const lights = [
  {
    name: '候车室灯',
    type: 'waiting_room_spot_light',
    position: {
      x: 60,
      y: 22,
      z: -133.1
    }
  },
  {
    name: '候车室灯',
    type: 'waiting_room_spot_light',
    position: {
      x: -49.5,
      y: 22,
      z: -305.5
    }
  },
  {
    name: '候车室灯',
    type: 'waiting_room_spot_light',
    position: {
      x: 60,
      y: 22,
      z: -305.5
    }
  },
  {
    name: '候车室灯',
    type: 'waiting_room_spot_light',
    position: {
      x: -49.5,
      y: 22,
      z: -133.1
    }
  }
]
JsonList.push(...lights)

// 灯关-锚点
const lightSwitchs = [
  {
    name: '候车室灯',
    type: 'LIGHT_SWITCH',
    position: { x: 76, y: 5, z: -112.2 },
    bind: '候车室灯'
  }
]
JsonList.push(...lightSwitchs)

export default [
  {
    // 项目楼层数据
    url: '/d3/station',
    method: 'get',
    response: () => {
      return builder({
        JsonList,
        ModelUrl: '/oss/model/floor/场景.glb',
        Name: '车站展示',
        ConfigJson: {
          target: { x: 0, y: -2.6, z: 114.2 },
          to: { x: 25.3, y: 154.4, z: 637.2 }
        }
      })
    }
  }
]
