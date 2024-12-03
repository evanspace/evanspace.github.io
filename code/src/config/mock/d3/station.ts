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
  [-170, -420],
  [-100, -420],
  [-50, -470],
  [120, -470],
  [-170, -200],
  [170, -200],
  [620, -140],
  [750, 40],
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
        z
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
  [370, 100],
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
  }
]
JsonList.push(...monitorCameras)

// 定位点
const posList = [
  {
    name: '点位 1',
    type: 'ANCHOR_POS',
    position: { x: 0, y: 0, z: 0 }
  }
]
JsonList.push(...posList)

export default [
  {
    // 项目楼层数据
    url: '/d3/station',
    method: 'get',
    response: () =>
      builder({
        JsonList,
        ModelUrl: '/oss/model/floor/场景.glb',
        Name: '园区展示',
        ConfigJson: {
          target: { x: -16.17, y: -2.6, z: 114.2 },
          to: { x: -4.85, y: 35.07, z: 351.78 }
        }
      })
  }
]
