import fleetings from './fleetings'
import airWinds from './air-winds'

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
    version: 38
  },

  // 判断点击间隔时间
  clickIntervalTime: 300,

  // 人物视线偏移坐标
  personSightOffset: {
    x: 0,
    y: 3.5,
    z: 0.1
  },
  // 人物视角元素 class
  personSightClass: 'person-sight',
  // 人物视角键盘控制
  personKeys: [
    { code: 'W', desc: '前进' },
    { code: 'S', desc: '后退' },
    { code: 'A', desc: '向左转向' },
    { code: 'D', desc: '向右转向' },
    { code: 'X', desc: '加速' },
    { code: 'Z', desc: '减速' }
  ],
  // 人物默认状态动画
  personDefaultAnimateName: 'PlayOne-Headnod',
  // 人物行走状态动画
  personRuningAnimateName: 'PlayOne-Walk',

  // 电梯地面网格名称
  liftGroundMeshName: ['电梯地板002', '电梯地板'],
  // 模型地面网格名称
  groundMeshName: [
    '地面002',
    '立方体306',
    '平面118',
    '立方体475',
    '立方体514',
    '立方体552',
    '地面020',
    '地面',
    '平面391',

    '立方体474',
    '立方体1617',
    'ground'
  ],

  // 公司模型名称
  companyModelName: '二十五楼',

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

  // 空调风
  airWinds,

  // 波纹图
  diffusionImgs: [
    '/oss/textures/diffusion/1.png',
    '/oss/textures/diffusion/2.png',
    '/oss/textures/diffusion/3.png',
    '/oss/textures/diffusion/4.png',
    '/oss/textures/diffusion/5.png',
    '/oss/textures/diffusion/6.png',
    '/oss/textures/diffusion/7.png',
    '/oss/textures/diffusion/8.png',
    '/oss/textures/diffusion/9.png',
    '/oss/textures/diffusion/10.png',
    '/oss/textures/diffusion/11.png',
    '/oss/textures/diffusion/12.png'
  ].map(src => baseUrl + src),

  // 屏幕视频
  screenVideo: baseUrl + '/oss/textures/park/sintel.mp4',
  // 视频封面
  videoCover: baseUrl + '/oss/textures/office/cover.jpg',
  // 空调粒子纹理
  airParticleTexture: baseUrl + '/oss/textures/effect/snowflake.png'
}
