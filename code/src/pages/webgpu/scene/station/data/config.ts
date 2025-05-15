/* *
 * @description:
 * @file: config.ts
 * @author: Evan
 * @date: 2025.05.13 16:46:30
 * @week: 周二
 * @version: V
 * */

const baseUrl = import.meta.env.VITE_GIT_OSS
const localUrl = import.meta.env.VITE_OSS_BUCKET

export default {
  baseUrl,

  // 点位严格模式
  dotShowStrict: true,
  // 判断点击间隔时间
  clickIntervalTime: 150,

  indexDB: {
    cache: true,
    dbName: 'THREE__STATION__GPU_DB',
    tbName: 'TB',
    version: 2
  },

  skyCode: '104',
  env: '/textures/hdr/6.hdr',
  // 背景图
  bgSrc: baseUrl + '/imgs/station/bg.jpg',

  // 围栏贴图
  fanceImgs: [localUrl + '/textures/station/fance.png'],

  // 天空风格 hdr
  sky: {
    day: '/textures/hdr/101.hdr',
    evening: '/textures/hdr/201.hdr',
    night: '/textures/hdr/301.hdr'
  },

  // 场景风格时间段
  styleTimes: [
    [8, 18],
    [18, 20],
    [20, 8]
  ],

  // 默认移动速度
  moveFactor: 1,

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

  // 波纹图
  diffusionImg: baseUrl + '/textures/diffusion/101.png',

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

  // 碰撞间距
  collisionSpace: 1,

  // 模型地面网格名称
  groundMeshName: [
    '行走地面',
    '平面125',
    '平面126',
    '平面127',
    '平面128',
    '平面129',
    '平面130',
    '楼梯',
    '机房地面',
    '地面002',
    '地面005',
    '地面006',
    '立方体128',
    '立方体780_1',
    '11111',
    '22222'
  ],

  // 相机转场列表
  cameraTransitionList: [
    {
      name: '一楼大门',
      to: { x: -1.3, y: 6.2, z: 102.3 },
      target: { x: -1.4, y: 5.8, z: 97.4 }
    }
  ],

  // 机房名称
  machineRoomName: '机房'
}
