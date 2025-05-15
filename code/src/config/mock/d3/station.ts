import { builder } from '../util'

const JsonList = [
  {
    name: '场地',
    type: 'MAIN_SCENE',
    position: { x: 0, y: 0, z: 0 }
  },
  {
    name: '机房',
    type: 'MACHINE_ROOM'
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

const getListByPos = (pos: number[][], type: string, name: string) => {
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

const deviecs: any[] = [
  {
    name: '泵组_1-1',
    type: 'WATER_PUMP',
    position: { x: 2.9, y: -34.9, z: -37.82 }
  },
  {
    name: '泵组_1-2',
    position: { x: 2.9, y: -34.9, z: -30.38 }
  },
  {
    name: '泵组_1-3',
    position: { x: 2.9, y: -34.9, z: -23 }
  },
  {
    name: '泵组_1-4',
    position: { x: 2.9, y: -34.9, z: -15.4 }
  },
  {
    name: '泵组_1-5',
    position: { x: 2.9, y: -34.9, z: -7.63 }
  },

  {
    name: '泵组_2-1',
    position: { x: -114.9, y: -34.9, z: 45.3 },
    rotation: { x: 0, y: -35, z: 0 }
  },
  {
    name: '泵组_2-2',
    position: { x: -100.9, y: -34.9, z: 45.3 },
    rotation: { x: 0, y: -35, z: 0 }
  },
  {
    name: '泵组_2-3',
    position: { x: -86.75, y: -34.9, z: 45.3 },
    rotation: { x: 0, y: -35, z: 0 }
  },
  {
    name: '泵组_2-4',
    position: { x: -72.33, y: -34.9, z: 45.3 },
    rotation: { x: 0, y: -35, z: 0 }
  },
  {
    name: '泵组_2-5',
    position: { x: -58.4, y: -34.9, z: 45.3 },
    rotation: { x: 0, y: -35, z: 0 }
  },

  {
    name: '泵组_3-1',
    position: { x: -113.4, y: -34.9, z: 57.4 }
  },
  {
    name: '泵组_3-2',
    position: { x: -95.6, y: -34.9, z: 57.4 }
  },
  {
    name: '泵组_3-3',
    position: { x: -76.5, y: -34.9, z: 57.4 }
  },
  {
    name: '泵组_3-4',
    position: { x: -58, y: -34.9, z: 57.4 }
  },

  {
    name: '泵组_4-1',
    position: { x: -115.1, y: -34.9, z: 71.2 },
    rotation: { x: 0, y: -35, z: 0 }
  },
  {
    name: '泵组_4-2',
    position: { x: -100.9, y: -34.9, z: 71.2 },
    rotation: { x: 0, y: -35, z: 0 }
  },
  {
    name: '泵组_4-3',
    position: { x: -86.6, y: -34.9, z: 71.2 },
    rotation: { x: 0, y: -35, z: 0 }
  },
  {
    name: '泵组_4-4',
    position: { x: -72.3, y: -34.9, z: 71.2 },
    rotation: { x: 0, y: -35, z: 0 }
  },
  {
    name: '泵组_4-5',
    position: { x: -58.3, y: -34.9, z: 71.2 },
    rotation: { x: 0, y: -35, z: 0 }
  }
].map(item => {
  item.type = 'WATER_PUMP'
  return item
})
JsonList.push(...deviecs)

// 监测点
const monitorCameras = [
  {
    name: '右侧-光伏板',
    unit: 'kWh',
    type: 'DOT',
    position: { x: 263.7, y: 56.3, z: 110.3 }
  },
  {
    name: '右侧-光伏板',
    unit: 'kWh',
    type: 'DOT',
    position: { x: 242.2, y: 56.3, z: 73.8 }
  },

  {
    name: '左侧-光伏板',
    unit: 'kWh',
    type: 'DOT',
    position: { x: -259.5, y: 56.6, z: 111.1 }
  },
  {
    name: '左侧-光伏板',
    unit: 'kWh',
    type: 'DOT',
    position: { x: -248.7, y: 56.3, z: 72.3 }
  },
  {
    name: '楼层监测点',
    followMark: 'floor_common_0',
    unit: 'kWh',
    type: 'DOT',
    position: { x: 218.4, y: 1, z: 584.8 }
  },

  {
    name: '1#主机',
    unit: 'kWh',
    position: { x: -106.3, y: -9.7, z: 6.9 }
  },
  {
    name: '2#主机',
    unit: 'kWh',
    position: { x: -102.9, y: -9.7, z: 6.9 }
  },

  {
    name: '制冷站水泵',
    unit: 'kWh',
    position: { x: -95.8, y: -9.7, z: 6.9 }
  },
  {
    name: '冷却塔',
    unit: 'kWh',
    position: { x: -86.9, y: -9.7, z: 6.9 }
  },

  {
    name: '1楼末端风柜',
    unit: 'kWh',
    position: { x: -77.9, y: -9.7, z: 6.9 }
  },
  {
    name: '2楼末端风柜',
    unit: 'kWh',
    position: { x: -69, y: -9.7, z: 6.9 }
  },
  {
    name: '3楼末端风柜',
    unit: 'kWh',
    position: { x: -60, y: -9.7, z: 6.9 }
  },
  {
    name: '4楼末端风柜',
    unit: 'kWh',
    position: { x: -51.1, y: -9.7, z: 6.9 }
  }
]
  .map(item => {
    item.type = 'DOT'
    return item as any
  })
  .concat(
    deviecs.map(item => {
      const { x, z } = item.position
      return {
        ...item,
        type: 'DOT',
        unit: 'Hz',
        position: { x, y: -28.3, z }
      }
    })
  )
JsonList.push(...monitorCameras)

// 定位点
const posList = [
  {
    name: '东广场',
    type: 'ANCHOR_POS',
    // position: { x: -1.15, y: 5.8, z: 186.36 },
    to: { x: 0, y: 154.4, z: 637.2 },
    target: { x: 0, y: 0, z: 114.2 }
  },
  {
    name: '西广场',
    type: 'ANCHOR_POS',
    // position: { x: 113.4, y: 43.6, z: 116.4 },
    to: { x: 74.7, y: 60.4, z: -833.8 },
    target: { x: 6.4, y: 0, z: -449 }
  },
  {
    name: '候车室',
    type: 'ANCHOR_POS',
    // position: { x: 72.1, y: 4, z: -84 },
    to: { x: 93.2, y: 31.3, z: -59.4 },
    target: { x: 89.5, y: 30, z: -65.7 }
  },

  {
    name: '东辅楼',
    type: 'ANCHOR_POS',
    // position: { x: 203.6, y: 61.6, z: 24.5 },
    position: { x: 253.5, y: 58, z: 93.4 },
    to: { x: 150.7, y: 90, z: -24 },
    target: { x: 253.5, y: 50, z: 93.4 },
    bind: '_光伏大楼_2_grp'
  },

  {
    name: '西辅楼',
    type: 'ANCHOR_POS',
    // position: { x: -318, y: 70.9, z: 167.6 },
    position: { x: -254.4, y: 58, z: 100 },
    to: { x: -430.9, y: 162.7, z: 258.4 },
    target: { x: -254.4, y: 50, z: 100 },
    bind: '_光伏大楼_1_grp'
  },

  {
    name: '楼栋分层',
    type: 'ANCHOR_POS',
    position: { x: 207.4, y: 70.9, z: 603.2 },
    to: { x: 408.6, y: 146, z: 808 },
    target: { x: 207.4, y: 60.9, z: 603.2 },
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

// 标签
const tags = [
  // 建筑楼栋
  {
    name: '商业体 1',
    type: 'TAG_BUILDING',
    position: { x: 249.5, y: 60.4, z: 89.5 }
  },
  {
    name: '商业体 2',
    type: 'TAG_BUILDING',
    position: { x: -249.5, y: 60.4, z: 101.4 }
  },

  // 监控
  {
    name: '监控1',
    type: 'TAG_CAMERA',
    position: { x: -129.5, y: 50.4, z: 101.4 }
  },
  {
    name: '监控2',
    type: 'TAG_CAMERA',
    position: { x: -109.5, y: 50.4, z: 101.4 }
  },

  // 站房
  {
    name: '站房 1',
    type: 'TAG_ROOM',
    position: { x: -89.5, y: 50.4, z: 101.4 }
  },
  {
    name: '站房 2',
    type: 'TAG_ROOM',
    position: { x: -69.5, y: 50.4, z: 101.4 }
  }
]
JsonList.push(...tags)

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
  'floor_common'
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
  y += floorMap[list[i - 1] as keyof typeof floorMap] ?? 0
  floors.push({
    name: `${i + 1}楼`,
    type: list[i],
    mark: list[i] + '_' + i,
    group: 'build_1',
    position: { x: 218.4, y: y, z: 584.8 }
  })
}
JsonList.push(...floors)

// 灯光
const lights = [
  {
    name: '候车室灯',
    type: 'waiting_room_spot_light',
    position: { x: 60, y: 37, z: -95.7 }
  },
  {
    name: '候车室灯',
    type: 'waiting_room_spot_light',
    position: { x: -49.5, y: 37, z: -305.5 }
  },
  {
    name: '候车室灯',
    type: 'waiting_room_spot_light',
    position: { x: 60, y: 37, z: -305.5 }
  },
  {
    name: '候车室灯',
    type: 'waiting_room_spot_light',
    position: { x: -49.5, y: 37, z: -95.7 }
  }
]
JsonList.push(...lights)

// 灯关-锚点
const lightSwitchs = [
  {
    name: '候车室灯',
    type: 'LIGHT_SWITCH',
    position: { x: 80.8, y: 27, z: -95.7 },
    bind: '候车室灯'
  }
]
JsonList.push(...lightSwitchs)

const CRUISE_POINT_UP = 27.5 // y 巡航轴向量
const ROAM_POINT_UP = 100 // y 漫游轴向量

export default [
  {
    // 项目楼层数据
    url: '/d3/station',
    method: 'get',
    response: () => {
      return builder({
        JsonList,
        Name: '车站展示',
        ConfigJson: {
          target: { x: 0, y: 1, z: 114.2 },
          to: { x: 0, y: 87, z: 429 },
          cruise: [
            [102.5, CRUISE_POINT_UP, 9.9],
            [102.5, CRUISE_POINT_UP, 291.9],
            [76, CRUISE_POINT_UP, 291.9],
            [76, CRUISE_POINT_UP, 129],
            [-76, CRUISE_POINT_UP, 129],
            [-76, CRUISE_POINT_UP, 291.9],
            [-107.7, CRUISE_POINT_UP, 291.9],
            [-107.7, CRUISE_POINT_UP, 9.9]
          ],
          roamPoints: [
            [-286, ROAM_POINT_UP, 257],
            [286, ROAM_POINT_UP, 257],
            [286, ROAM_POINT_UP, -600],
            [-286, ROAM_POINT_UP, -600]
          ]
        }
      })
    }
  }
]
