import fleetings from './fleetings'

// 配置
export default {
  // 判断点击间隔时间
  clickIntervalTime: 300,

  // 人物视线偏移坐标
  characterSightOffset: {
    x: 0,
    y: 3.5,
    z: 0.1
  },

  // 人物默认状态动画
  personDefaultAnimateName: 'PlayOne-Headnod',
  // 人物行走状态动画
  personRuningAnimateName: 'PlayOne-Walk',

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
    [-374.6, 30, 284.2],
    [-372, 30, 168.8],
    [-95.35, 30, 299.24],
    [-95.31, 30, 168.33],
    [272.61, 30, 299.17],
    [276.47, 30, 168.4],
    [271.04, 30, -58.709],
    [159.86, 30, -56.24],
    [-134.27, 30, 30.457],
    [-247.92, 30, -302.57]
  ],

  // 居民灯
  residentLights: [
    [-13, 169.8, 447.2],
    [668, 114.9, 481.9]
  ],

  // 公司模型名称
  companyModelName: '二十五楼'
}
