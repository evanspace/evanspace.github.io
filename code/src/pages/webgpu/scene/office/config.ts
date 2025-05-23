import fleetings from './fleetings'
import airWinds from './air-winds'

const baseUrl = import.meta.env.VITE_GIT_OSS
const staticUrl = import.meta.env.VITE_BEFORE_STATIC_PATH

// 配置
export default {
  // 基础地址
  baseUrl,

  // 背景图
  bgSrc: baseUrl + '/imgs/office/bg.jpg',

  // 天空风格 hdr
  sky: {
    day: '/textures/hdr/101.hdr',
    evening: '/textures/hdr/201.hdr',
    night: '/textures/hdr/301.hdr'
  },

  // 本地数据库
  indexDB: {
    cache: true,
    dbName: 'THREE__OFFICE__GPU_DB',
    tbName: 'TB',
    version: 47
  },

  // hover 距离配置
  // 大于额定值则启用
  hoverDistance: {
    // 空组
    empty: 100
  },
  // 空组网格名称后缀
  hoverNameSuffix: '-区域',
  toBridMeshName: '主建筑',

  // 窗帘材质名称
  curtainMeshName: '_GROUP_013_grp',

  // 判断点击间隔时间
  clickIntervalTime: 150,

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
  // 人物行走基础速度
  personRuningSpeed: 5,

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
    [619, 179.7, 442.5]
  ],

  // 空调风
  airWinds,

  // 波纹图
  diffusionImg: baseUrl + '/textures/diffusion/101.png',

  // 屏幕视频 - 跨域问题，使用本地资源
  screenVideo: staticUrl + '/video/sintel.mp4',
  // 视频封面
  videoCover: baseUrl + '/textures/office/cover.jpg',
  // 空调粒子纹理
  airParticleTexture: baseUrl + '/textures/effect/snowflake.png',

  // 相机转场列表
  cameraTransitionList: [
    {
      name: '一楼大门',
      to: { x: -1.3, y: 6.2, z: 102.3 },
      target: { x: -1.4, y: 5.8, z: 97.4 }
    },
    {
      name: '前台',
      areaCode: 1,
      id: 86,
      to: { x: 15.3, y: 188, z: 33.2 },
      target: { x: 15.3, y: 188, z: 36.3 }
    },
    {
      name: '办公',
      areaCode: 2,
      id: 82,
      to: { x: -29.82, y: 188, z: 41.52 },
      target: { x: -25.43, y: 188, z: 43.88 }
    },
    {
      name: '大会议室',
      areaCode: 3,
      id: 75,
      to: { x: -28.8, y: 188, z: 52.7 },
      target: { x: -33.7, y: 188, z: 53.4 }
    },
    {
      name: '陈总办公室',
      areaCode: 4,
      id: 71,
      to: { x: -41.79, y: 188, z: 27.52 },
      target: { x: -43.1, y: 188, z: 29.4 }
    },
    {
      name: '逄总办公室',
      areaCode: 5,
      id: 72,
      to: { x: -43.1, y: 188, z: 8.2 },
      target: { x: -44.5, y: 188, z: 10.7 }
    },
    {
      name: '财务部',
      areaCode: 6,
      id: 74,
      to: { x: -42.57, y: 188, z: -13.37 },
      target: { x: -43.2, y: 188, z: -12.2 }
    },
    {
      name: 'CFO',
      areaCode: 7,
      id: 73,
      to: { x: -42.8, y: 188, z: -14.7 },
      target: { x: -44, y: 188, z: -17.2 }
    },
    {
      name: '洽谈室一',
      areaCode: 8,
      id: 79,
      to: { x: -14.47, y: 188, z: -25.92 },
      target: { x: -16.8, y: 188, z: -24.6 }
    },
    {
      name: '人事部',
      areaCode: 9,
      id: 181,
      to: { x: -16.35, y: 188, z: 32.75 },
      target: { x: -19.02, y: 188, z: 29.2 }
    },
    {
      name: '小会议室',
      areaCode: 10,
      id: 76,
      to: { x: -9.9, y: 188, z: 28.9 },
      target: { x: -10, y: 188, z: 26 }
    },
    {
      name: '洽谈室二',
      areaCode: 11,
      id: 78,
      to: { x: 46.3, y: 188, z: 28.9 },
      target: { x: 43.6, y: 188, z: 27.2 }
    },
    {
      name: '茶室',
      areaCode: 12,
      id: 80,
      to: { x: 42.8, y: 188, z: 3.27 },
      target: { x: 42, y: 188, z: 4.3 }
    },
    {
      name: '总裁',
      areaCode: 13,
      id: 85,
      to: { x: 69.4, y: 188, z: -0.4 },
      target: { x: 65, y: 188, z: -2.7 }
    },
    {
      name: '程总办公室',
      areaCode: 14,
      id: 81,
      to: { x: 56.57, y: 188, z: 23.3 },
      target: { x: 58.4, y: 188, z: 21.8 }
    },
    {
      name: '大洽谈室',
      areaCode: 15,
      id: 77,
      to: { x: 56.14, y: 188, z: 30.42 },
      target: { x: 59.1, y: 188, z: 30.3 }
    },
    {
      name: '研发及商务',
      areaCode: 16,
      id: 84,
      to: { x: 70.5, y: 188, z: 42.16 },
      target: { x: 68.9, y: 188, z: 43.1 }
    }
  ],

  // 区域选中对象
  selectObject: {
    color: 0x27ffb0,
    bloomIntensity: 0.3
  },

  // 相机转场视角最大值
  cameraMaxDistance: {
    indoor: 5, // 室内
    roam: 1, // 漫游
    threePerson: 8 // 第三人称
  },

  // 视角自动切换
  sightToggle: false,

  // 视角可视点位距离
  dotVisibleDistance: {
    max: 20,
    min: 7
  },
  // 节流时间
  debounceDuration: 1000 * 1,

  // 环境参数刷新频率限制时间
  envRefreshLimitTime: 1000 * 10
}
