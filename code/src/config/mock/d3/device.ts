import { builder } from '../util'

import deviceJson from './json/device'

export default [
  {
    // 设备系统数据
    url: '/d3/device',
    method: 'get',
    response: () =>
      builder({
        JsonList: deviceJson,
        ModelUrl: '/oss/model/ncl/场景.glb',
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
  }
]
