const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const ANCHOR_POS = 'ANCHOR_POS' // 定位
export const ANCHOR_TARGET = 'ANCHOR_TARGET' // 锚点
export const MAIN_SCENE = 'MAIN_SCENE' // 主场景
export const CONPANT_FLOOR = 'campany_floor' // 公司楼层

export const ROBOT = 'ROBOT' // 机器人
export const CHARACTER = 'CHARACTER' // 人物
export const WAIT_LIFT = 'WAIT_LIFT' // 等电梯
export const LIGHT_SWITCH = 'LIGHT_SWITCH' // 开关灯
export const GATE_SWITCH = 'GATE_SWITCH' // 闸机门禁
export const DUBLE_HORIZONTAL_SWITCH = 'DUBLE_HORIZONTAL_SWITCH' // 双开横推门
export const DUBLE_ROTATE_SWITCH = 'DUBLE_ROTATE_SWITCH' // 双旋转开门
export const ODD_ROTATE_SWITCH = 'ODD_ROTATE_SWITCH' // 单旋转开门
export const VIDEO_SWITCH = 'VIDEO_SWITCH' // 视频

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
  env: '/oss/textures/hdr/6.hdr',

  config: {},

  // dot 点位类型值
  dotKey: 'DOT',
  dotShowStrict: false,

  anchorType: [
    ANCHOR_POS,
    ANCHOR_TARGET,
    WAIT_LIFT,
    LIGHT_SWITCH,
    GATE_SWITCH,
    VIDEO_SWITCH,
    DUBLE_HORIZONTAL_SWITCH,
    DUBLE_ROTATE_SWITCH
  ],
  animationModelType: [CONPANT_FLOOR],

  models: [
    {
      key: MAIN_SCENE,
      name: '场景',
      size: 18.6,
      url: '/公司总部.glb'
    },
    {
      key: 'floor_low',
      name: '低层',
      size: 26.7,
      url: '/低层.glb'
    },
    // {
    //   key: 'floor_heigh',
    //   name: '高层',
    //   size: 11.3,
    //   url: '/高层.glb'
    // },

    {
      key: CONPANT_FLOOR,
      name: '公司',
      size: 54.4,
      url: '/二十五楼.glb'
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
      key: DUBLE_HORIZONTAL_SWITCH,
      name: '双横推开关门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/lift.png'
    },
    {
      key: DUBLE_ROTATE_SWITCH,
      name: '双旋转开关门',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/lift.png'
    },
    {
      key: ODD_ROTATE_SWITCH,
      name: '单旋转开关门',
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
      key: VIDEO_SWITCH,
      name: '视频',
      type: 'sprite',
      range: { x: 1, y: 1 },
      mapUrl: '/video.png'
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
      distance: 10
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
    return item as import('three-scene/src/types/model').ModelItem
  }),

  cruise: {
    visible: true,
    auto: true,
    // helper: true,
    // tube: true,
    mapUrl: '/oss/textures/cruise/line18.png', // 1-18
    // mapUrl: '/oss/textures/cruise/diffuse.jpg', // 1-18
    repeat: [1, 1],
    width: 2,
    segment: 30,
    tension: 0.01,
    speed: 1,
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
    { name: '一楼', key: 1, y: 0.1, bind: '_一楼电梯门-1_grp' },
    { name: '公司', key: 2, y: 184.7, bind: '电梯外门001' }
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
