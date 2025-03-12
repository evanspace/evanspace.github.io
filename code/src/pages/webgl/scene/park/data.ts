const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const ROBOT = 'ROBOT' // 机器人
export const CHARACTER = 'CHARACTER' // 人物、
export const GROUND = 'GROUND' // 地面
export const VIDEOPLAY = 'PARK_VIDEO' // 视频播放
export const OPEN_THE_DOOR = 'OPEN_THE_DOOR' // 开门
export const HALF_OPEN_THE_DOOR = 'HALF_OPEN_THE_DOOR' // 半开门-90 度开门
export const DOUBLE_OPEN_THE_DOOR = 'DOUBLE_OPEN_THE_DOOR' // 双开门
export const WAIT_LIFT = 'WAIT_LIFT' // 等电梯
export const SLIDING_DOOR = 'SLIDING_DOOR' // 推拉门
export const LIGHT_SWITCH = 'LIGHT_SWITCH' // 开关灯

// 点位向上向量
const POINT_UP = 0.2
export const getPageOpts = animateBack => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '104',
  env: '/oss/textures/hdr/3.hdr',

  // dot 点位类型值
  dotKey: 'DOT',
  dotShowStrict: false,

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName: [],
  // 楼层模块类型
  floorModelType: ['FLOOR_COMMON'],
  // 锚点模型类型列表（精灵类型）该类型未绑定点击事件函数将作为 dialog 弹窗事件处理
  anchorType: [
    'PARK_CAMERA',
    'PARK_ROOM_INLET',
    VIDEOPLAY,
    OPEN_THE_DOOR,
    HALF_OPEN_THE_DOOR,
    DOUBLE_OPEN_THE_DOOR,
    WAIT_LIFT,
    SLIDING_DOOR,
    LIGHT_SWITCH
  ],
  // 汽车类型，需要行驶
  carType: ['car_tanker', 'car_goods', 'car_trailer', 'car_crane'],
  // 动画模型类型
  animationModelType: ['building_commercial_2'],

  colors: {},
  config: {},

  cruise: {
    visible: true,
    auto: true,
    // helper: true,
    mapUrl: '/oss/textures/cruise/line2.png', // 1-18
    repeat: [0.1, 1],
    width: 2,
    segment: 100,
    tension: 0.1,
    speed: 20,
    mapSpeed: 0.01,
    points: [
      [-89.57, POINT_UP, 179.4],
      [-52.28, POINT_UP, 179.4],
      [-52.28, POINT_UP, 123.05],
      [-4.43, POINT_UP, 123.05],
      [-4.43, POINT_UP, 99.18],
      [6.26, POINT_UP, 99.18],
      [6.26, POINT_UP, 153.83],
      [92.71, POINT_UP, 153.83],

      [147.75, POINT_UP, 148.23],
      [147.75, POINT_UP, 135.93],
      [144.21, POINT_UP, 133.13],
      [144.21, POINT_UP, 126.7],

      [86.6, POINT_UP, 126.7],
      [86.6, POINT_UP, 152.35],
      [77.55, POINT_UP, 152.35],

      [77.55, POINT_UP, -137.3],
      // [59.33, POINT_UP, -137.3],
      [3.34, POINT_UP, -137.3],

      [3.34, POINT_UP, -52.04],
      [-89.57, POINT_UP, -52.04]
    ],
    offset: 1.8,
    animateBack: animateBack
  },

  models: [
    {
      key: 'SCENE',
      name: '场景',
      size: 14.7,
      url: '/场景.glb'
    },
    {
      key: GROUND,
      name: '地面',
      size: 4,
      url: '/地面.glb'
    },
    {
      key: 'PARKING_SPACE',
      name: '停车位',
      size: 0.06,
      url: '/停车位.glb'
    },

    /////////////////////
    {
      key: 'building_1',
      name: '楼栋1',
      size: 1.2,
      url: '/楼栋1.glb'
    },
    {
      key: 'building_2',
      name: '楼栋2',
      size: 2,
      url: '/楼栋2.glb'
    },
    {
      key: 'building_3',
      name: '楼栋3',
      size: 1.6,
      url: '/楼栋3.glb'
    },
    {
      key: 'building_4',
      name: '楼栋4',
      size: 2.8,
      url: '/楼栋4.glb'
    },
    {
      key: 'building_5',
      name: '楼栋5',
      size: 1.6,
      url: '/楼栋5.glb'
    },
    {
      key: 'building_warehouse',
      name: '仓库',
      size: 0.7,
      url: '/仓库.glb'
    },

    {
      key: 'building_commercial_1',
      name: '商业楼1',
      size: 3.6,
      url: '/商业楼1.glb'
    },
    {
      key: 'building_commercial_2',
      name: '商业楼2',
      size: 14.5,
      url: '/商业楼2.glb'
    },
    {
      key: 'building_commercial_3',
      name: '商业楼3',
      size: 0.6,
      url: '/商业楼3.glb'
    },
    {
      key: 'building_commercial_4',
      name: '电梯房',
      size: 9.6,
      url: '/电梯房.glb'
    },
    /////////////////////

    {
      key: 'car_tanker',
      name: '油罐车',
      size: 1,
      url: '/油罐车.glb'
    },
    {
      key: 'car_goods',
      name: '货车',
      size: 6.4,
      url: '/货车.glb'
    },
    {
      key: 'car_trailer',
      name: '拖车',
      size: 2,
      url: '/拖车.glb'
    },
    {
      key: 'car_crane',
      name: '吊车',
      size: 4.4,
      url: '/吊车.glb'
    },

    {
      key: 'car_aodi',
      name: '奥迪',
      size: 1,
      url: '/奥迪.glb'
    },
    {
      key: 'car_kaidilake',
      name: '凯迪拉克',
      size: 1.6,
      url: '/凯迪拉克.glb'
    },

    {
      key: 'ARBOR_ONE',
      name: '小树',
      size: 2,
      url: '/小树.glb'
    },

    {
      key: 'FENCE',
      name: '围栏',
      size: 0.8,
      url: '/围栏.glb'
    },

    {
      key: 'HANDRAIL',
      name: '栏杆',
      size: 0.1,
      url: '/栏杆.glb'
    },

    {
      key: ROBOT,
      name: '机器人',
      size: 0.3,
      url: '/oss/model/common/机器人.glb'
    },
    {
      key: CHARACTER,
      name: '人物',
      size: 0.3,
      url: '/oss/model/common/RootNode.glb'
    },

    {
      key: 'PARK_CAMERA',
      name: '摄像头',
      type: 'sprite',
      range: { x: 18.5, y: 38.5 },
      mapUrl: '/sxt.png'
    },
    {
      key: VIDEOPLAY,
      name: '视频播放',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/video.png'
    },
    {
      key: OPEN_THE_DOOR,
      name: '开门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/open.png'
    },
    {
      key: HALF_OPEN_THE_DOOR,
      name: '半开门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/open.png'
    },
    {
      key: DOUBLE_OPEN_THE_DOOR,
      name: '双开门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/open.png'
    },
    {
      key: SLIDING_DOOR,
      name: '推拉门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/open.png'
    },
    {
      key: WAIT_LIFT,
      name: '电梯门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/lift.png'
    },

    {
      key: 'spot_light_reception',
      type: 'spotlight',
      name: '聚光灯',
      // 强度
      intensity: 8,
      // 距离
      distance: 100,
      // 衰减
      decay: 0
    },
    {
      key: LIGHT_SWITCH,
      name: '开关灯',
      type: 'sprite',
      range: { x: 1.2, y: 1.2 },
      mapUrl: '/light.png'
    }
  ].map(item => {
    if (item.url && item.url.indexOf('oss') < 0) {
      item.url = '/oss/model/park' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/park' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  })
})

export const getFloorOpts = () => ({
  active: 1,
  show: false,
  list: [
    // key 值需要与 配置的等电梯点位 bing 字段尾数相同
    { name: '一楼', key: 1, y: 0.2 },
    { name: '二楼', key: 2, y: 13.8 },
    { name: '三楼', key: 3, y: 19.83 },
    { name: '五楼', key: 5, y: 31.76 }
  ]
})

export const getTipOpts = () => ({
  show: false,
  style: {
    left: 0,
    top: 0
  },
  msg: ''
})
