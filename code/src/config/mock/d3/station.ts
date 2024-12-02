import { builder } from '../util'

const JsonList = [
  {
    name: '场地',
    type: 'SCENE',
    position: { x: 0, y: 0, z: 0 }
  }
]

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
          target: { x: -89.7, y: -2.6, z: 187.1 },
          to: { x: -118.4, y: 3, z: 220.4 }
        }
      })
  }
]
