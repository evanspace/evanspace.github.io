// import { mock } from 'mockjs'
import { builder } from '../util'

const floorMap = {
  FLOOR_ONE: 138,
  FLOOR_ATTIC: 350,
  FLOOR_COMMON: 60
}

const list = [
  'FLOOR_ONE',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_COMMON',
  'FLOOR_ATTIC'
]
let floorData: any[] = [
    {
      name: '摄像头',
      type: 'COLD_CAMERA',
      followMark: 'FLOOR_COMMON_5',
      position: {
        x: 0,
        y: 500,
        z: 300
      }
    },
    {
      name: '房间入口',
      type: 'COLD_ROOM_INLET',
      position: {
        x: 100,
        y: 500,
        z: 300
      }
    },
    {
      name: '定位',
      type: 'COLD_GPS',
      position: {
        x: 200,
        y: 500,
        z: 300
      }
    },
    {
      name: 'DOT',
      unit: '%',
      type: 'DOT',
      position: {
        x: 300,
        y: 500,
        z: 350
      }
    }
  ],
  y = 0
for (let i = 0; i < list.length; i++) {
  y += floorMap[list[i - 1]] ?? 0
  floorData.push({
    name: `${i + 1}楼`,
    type: list[i],
    mark: list[i] + '_' + i,
    position: {
      x: 0,
      y: y,
      z: 0
    }
  })
}

floorData.push({
  name: 'DOT',
  unit: '%',
  type: 'DOT',
  followMark: 'FLOOR_COMMON_3',
  position: {
    x: 0,
    y: 260,
    z: 100
  }
})

export default [
  {
    // 项目楼层数据
    url: '/d3/floor',
    method: 'get',
    response: () =>
      builder({
        JsonList: floorData,
        ModelUrl: '/models/floor/场景.glb',
        Name: '楼层展示',
        ConfigJson: {
          // floorExpandIndex: 3,
          floorExpandMargin: 450,
          floorExpandMode: 'BA',
          target: { x: 0, y: 459, z: 0 },
          to: { x: 17.6, y: 673, z: 1660 }
        }
      })
  }
]
