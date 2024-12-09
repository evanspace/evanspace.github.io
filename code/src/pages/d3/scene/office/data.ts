const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const ANCHOR_POS = 'ANCHOR_POS' // 定位
export const MAIN_SCENE = 'MAIN_SCENE' // 主场景
export const ROBOT = 'ROBOT' // 机器人
export const CHARACTER = 'CHARACTER' // 人物
export const WAIT_LIFT = 'WAIT_LIFT' // 等电梯

export const CRUISE_POINT_UP = 0.1 // y 巡航轴向量
const mxY = 146,
  maxZ = 104
const cruisePoints: any[] = []

for (let i = 0; i < 5; i++) {
  cruisePoints.push([mxY - i * 20, CRUISE_POINT_UP, -maxZ + ((i == 0 ? 1 : i) - 1) * 20])
  cruisePoints.push([mxY - i * 20, CRUISE_POINT_UP, maxZ - i * 20])
  cruisePoints.push([-mxY + i * 20, CRUISE_POINT_UP, maxZ - i * 20])
  cruisePoints.push([-mxY + i * 20, CRUISE_POINT_UP, -maxZ + i * 20])
}

export const getPageOpts = animateBack => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '221',
  env: '/oss/textures/hdr/14.hdr',

  config: {},

  // dot 点位类型值
  dotKey: 'DOT',
  dotShowStrict: false,

  anchorType: [ANCHOR_POS, WAIT_LIFT],
  animationModelType: [MAIN_SCENE],

  models: [
    {
      key: MAIN_SCENE,
      name: '场景',
      size: 3.1,
      url: '/电梯.glb'
    },

    {
      key: ANCHOR_POS,
      name: '定位',
      type: 'sprite',
      range: { x: 4, y: 4 },
      mapUrl: '/pos.png'
    },
    {
      key: WAIT_LIFT,
      name: '电梯门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/lift.png'
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
      item.url = '/oss/model/office' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/office' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  }),

  cruise: {
    visible: true,
    auto: true,
    // helper: true,
    mapUrl: '/oss/textures/cruise/line6.png', // 1-18
    repeat: [0.1, 1],
    width: 2,
    segment: 500,
    tension: 0,
    speed: 20,
    mapSpeed: 0.01,
    points: cruisePoints,
    close: false,
    offset: 5.2,
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
