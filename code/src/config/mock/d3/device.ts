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
        Name: '设备展示',
        ConfigJson: {
          cruise: [
            [-350, 2, 360],
            [0, 2, 360],
            [740, 2, 360],
            [740, 2, 0],
            [740, 2, -250],
            [0, 2, -250],
            [-350, 2, -250],
            [-350, 2, 0]
          ],
          target: { x: 0, y: 459, z: 0 },
          to: { x: 17.6, y: 673, z: 1660 }
        }
      })
  }
]
