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
  fleetings: fleetings
}
