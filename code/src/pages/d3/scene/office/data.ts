const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const ANCHOR_POS = 'ANCHOR_POS' // 定位
export const ANCHOR_TARGET = 'ANCHOR_TARGET' // 锚点
export const MAIN_SCENE = 'MAIN_SCENE' // 主场景
export const ROBOT = 'ROBOT' // 机器人
export const CHARACTER = 'CHARACTER' // 人物
export const WAIT_LIFT = 'WAIT_LIFT' // 等电梯
export const LIGHT_SWITCH = 'LIGHT_SWITCH' // 开关灯
export const GATE_TYPE = 'access_gate' // 闸机类型
export const GATE_SWITCH = 'GATE_SWITCH' // 闸机门禁

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
  env: '/oss/textures/hdr/3.hdr',

  config: {},

  // dot 点位类型值
  dotKey: 'DOT',
  dotShowStrict: false,

  anchorType: [ANCHOR_POS, ANCHOR_TARGET, WAIT_LIFT, LIGHT_SWITCH, GATE_SWITCH],
  animationModelType: [MAIN_SCENE],

  models: [
    {
      key: MAIN_SCENE,
      name: '场景',
      size: 3.1,
      url: '/电梯.glb'
    },

    // {
    //   key: 'campany_floor',
    //   name: '公司',
    //   size: 39.6,
    //   url: '/公司总部.glb'
    // },
    {
      key: GATE_TYPE,
      name: '闸机',
      size: 0.3,
      url: '/闸机.glb'
    },

    {
      key: ANCHOR_POS,
      name: '定位',
      type: 'sprite',
      range: { x: 4, y: 4 },
      mapUrl: '/pos.png'
    },
    {
      key: ANCHOR_TARGET,
      name: '锚点',
      type: 'sprite',
      range: { x: 4, y: 4 },
      mapUrl: '/dw.png'
    },
    {
      key: WAIT_LIFT,
      name: '电梯门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/lift.png'
    },
    {
      key: GATE_SWITCH,
      name: '闸机',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/gate.png'
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
    },

    {
      key: 'spot_light_floor_2',
      type: 'spotlight',
      name: '聚光灯',
      intensity: 8,
      color: 0x00e0ff,
      distance: 8
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
    mapUrl: '/oss/textures/cruise/line18.png', // 1-18
    repeat: [1, 1],
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
