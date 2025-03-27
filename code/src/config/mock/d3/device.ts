import { builder } from '../util'

import deviceJson from './json/device'
import device2Json from './json/device2'
import pipe2List from './json/pipe2'

export default [
  {
    // 设备系统数据
    url: '/d3/device',
    method: 'get',
    response: () =>
      builder({
        JsonList: deviceJson,
        ModelUrl: '/models/ncl/场景.glb',
        Name: '宁波海曙印象城',
        ConfigJson: {
          cruise: [
            [450, 0.1, 350],
            [450, 0.1, -350],
            [-450, 0.1, -350],
            [-450, 0.1, 350]
          ],
          target: { x: 0, y: 0, z: 0 },
          to: { x: 0, y: 650, z: 1000 }
        }
      })
  },
  {
    // 设备系统数据
    url: '/d3/device2',
    method: 'get',
    response: () =>
      builder({
        JsonList: device2Json,
        PipeList: pipe2List,
        ModelUrl: '/pipe/001.glb',
        Name: '制冷站监测系统',
        ConfigJson: {
          cruise: [
            [-300, 2, 250],
            [0, 2, 250],
            [240, 2, 250],
            [240, 2, 0],
            [240, 2, -250],
            [0, 2, -250],
            [-300, 2, -250],
            [-300, 2, 0]
          ],
          target: { x: 0, y: 0, z: 0 },
          to: { x: 0, y: 650, z: 1000 }
        }
      })
  }
]
