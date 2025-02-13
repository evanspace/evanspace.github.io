import fleetings from './fleetings'

// 配置
export default {
  // 判断点击间隔时间
  clickIntervalTime: 300,

  // 人物视线高度
  characterSightHeight: 3.5,

  // 碰撞间距
  collisionSpace: 1,

  // 默认移动速度
  moveFactor: 1,

  // 场景风格时间段
  styleTimes: [
    [8, 18],
    [18, 20],
    [20, 8]
  ],

  // 流光组
  fleetings,

  // 路灯
  streetLamps: [
    [-80.6, 30, 177.2],
    [169.9, 30, 146.5],
    [-150.9, 30, -189.3],
    [-140.8, 30, -360.2],
    [-5.7, 30, -473.3],
    [165.7, 30, -494.1],
    [168.4, 30, -188.3],
    [-263.6, 30, 89.9],
    [-404, 30, 224.4]
  ],

  // 居民灯
  residentLights: [
    [-13, 169.8, 447.2],
    [668, 114.9, 481.9]
  ]
}
