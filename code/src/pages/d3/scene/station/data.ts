const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const ANCHOR_POS = 'ANCHOR_POS' // 定位
export const MAIN_SCENE = 'MAIN_SCENE' // 主场景
export const ROBOT = 'ROBOT' // 机器人
export const CHARACTER = 'CHARACTER' // 人物

export const CRUISE_POINT_UP = 27.5 // y 巡航轴向量
export const getPageOpts = animateBack => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '221',
  env: '/oss/textures/hdr/6.hdr',

  // dot 点位类型值
  dotKey: 'DOT',
  dotShowStrict: false,

  config: {},

  anchorType: [ANCHOR_POS],
  animationModelType: [MAIN_SCENE],

  models: [
    {
      key: MAIN_SCENE,
      name: '场景',
      size: 54.8,
      url: '/深圳北站.glb'
    },
    {
      key: 'building',
      name: '楼宇',
      size: 0.3,
      url: '/楼宇.glb'
    },
    {
      key: 'residential',
      name: '居民楼',
      size: 0.08,
      url: '/居民楼.glb'
    },
    {
      key: 'small_residential',
      name: '小型居民楼',
      size: 0.08,
      url: '/小型居民楼.glb'
    },

    {
      key: ANCHOR_POS,
      name: '定位',
      type: 'sprite',
      range: { x: 4, y: 4 },
      mapUrl: '/pos.png'
    },

    {
      key: ROBOT,
      name: '机器人',
      size: 0.3,
      url: '/oss/model/park/机器人.glb'
    },
    {
      key: CHARACTER,
      name: '人物',
      size: 2.2,
      url: '/oss/model/park/RobotExpressive.glb'
    }
  ].map(item => {
    if (item.url && item.url.indexOf('oss') < 0) {
      item.url = '/oss/model/station' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/station' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  }),

  cruise: {
    visible: true,
    auto: true,
    // helper: true,
    mapUrl: '/oss/textures/cruise/line5.png', // 1-18
    repeat: [0.1, 1],
    width: 2,
    segment: 100,
    tension: 0,
    speed: 20,
    mapSpeed: 0.01,
    points: [
      [102.5, CRUISE_POINT_UP, 9.9],
      [102.5, CRUISE_POINT_UP, 291.9],
      [64.1, CRUISE_POINT_UP, 291.9],
      [64.1, CRUISE_POINT_UP, 129],
      [-75.2, CRUISE_POINT_UP, 129],
      [-75.2, CRUISE_POINT_UP, 291.9],
      [-107.7, CRUISE_POINT_UP, 291.9],
      [-107.7, CRUISE_POINT_UP, 9.9]
    ],
    offset: 1.8,
    animateBack: animateBack
  }
})

export const getTipOpts = () => ({
  show: false,
  style: {
    left: 0,
    top: 0
  },
  msg: ''
})
