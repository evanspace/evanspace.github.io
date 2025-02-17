import fleetings from './fleetings'

const baseUrl = import.meta.env.VITE_BEFORE_STATIC_PATH

// 配置
export default {
  // 基础地址
  baseUrl,

  // 天空风格 hdr
  sky: {
    day: '/oss/textures/hdr/101.hdr',
    evening: '/oss/textures/hdr/201.hdr',
    night: '/oss/textures/hdr/301.hdr'
  },

  // 本地数据库
  indexDB: {
    cache: true,
    dbName: 'THREE__OFFICE__GPU_DB',
    tbName: 'TB',
    version: 30
  },

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
  ]
}
