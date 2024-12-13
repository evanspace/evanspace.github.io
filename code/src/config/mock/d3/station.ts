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
    // to: { x: 20.2, y: 10.3, z: 218.5 },
    // target: { x: -1.57, y: -2.6, z: 173.4 },
    to: { x: -402.7, y: 185.8, z: 368.2 },
    target: { x: -43.6, y: -2.6, z: 68.6 },
    bind: 'Tree-03-2158'
  },
  {
    name: '二号机位',
    type: 'ANCHOR_POS',
    position: { x: 113.4, y: 43.6, z: 116.4 },
    to: { x: 134, y: 56.7, z: 128.9 },
    target: { x: 15.9, y: -2.6, z: 19.3 }
  },
  {
    name: '三号机位',
    type: 'ANCHOR_POS',
    position: { x: -317.9, y: 4, z: 295.6 },
    to: { x: -364.9, y: 10.5, z: 311.4 },
    target: { x: -290.8, y: -2.6, z: 274.7 }
  },

  {
    name: '右侧光伏',
    type: 'ANCHOR_POS',
    position: { x: 203.6, y: 61.6, z: 24.5 },
    to: { x: 150.7, y: 90, z: -24 },
    target: { x: 343, y: -2.6, z: 158.7 },
    bind: '_光伏大楼_2_grp'
  },

  {
    name: '左侧光伏',
    type: 'ANCHOR_POS',
    position: { x: -318, y: 70.9, z: 167.6 },
    to: { x: -430.9, y: 162.7, z: 258.4 },
    target: { x: -188.3, y: -2.6, z: 64 },
    bind: '_光伏大楼_1_grp'
  }
]
JsonList.push(...posList)

export default [
  {
    // 项目楼层数据
    url: '/d3/station',
    method: 'get',
    response: e => {
      console.log(e)
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
