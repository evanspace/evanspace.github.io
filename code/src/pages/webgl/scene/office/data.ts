const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const ANCHOR_POS = 'ANCHOR_POS' // 定位
export const ANCHOR_TARGET = 'ANCHOR_TARGET' // 锚点
export const MAIN_SCENE = 'MAIN_SCENE' // 主场景
export const CONPANT_FLOOR = 'campany_floor' // 公司楼层
export const CURTAIN = 'curtain' // 窗帘

export const ROBOT = 'ROBOT' // 机器人
export const CHARACTER = 'CHARACTER' // 人物
export const WAIT_LIFT = 'WAIT_LIFT' // 等电梯
export const LIGHT_SWITCH = 'LIGHT_SWITCH' // 开关灯
export const LIGHT_MAIN_SWITCH = 'LIGHT_MAIN_SWITCH' // 灯总开关
export const AIR_SWITCH = 'AIR_SWITCH' // 空调开关
export const GATE_SWITCH = 'GATE_SWITCH' // 闸机门禁
export const DOUBLE_HORIZONTAL_SWITCH = 'DOUBLE_HORIZONTAL_SWITCH' // 双开横推门
export const DOUBLE_ROTATE_SWITCH = 'DOUBLE_ROTATE_SWITCH' // 双旋转开门
export const ODD_ROTATE_SWITCH = 'ODD_ROTATE_SWITCH' // 单旋转开门
export const VIDEO_SWITCH = 'VIDEO_SWITCH' // 视频
export const SCREEN_EDIT = 'SCREEN_EDIT' // 编辑
export const CURTAIN_SWITCH = 'CURTAIN_SWITCH' // 窗帘开关

export const CRUISE_POINT_UP = 0.1 // y 巡航轴向量

export const ROAM_POINT_UP = 186 // y 漫游轴向量

const cruisePoints: number[][] = [
  [-120, CRUISE_POINT_UP, 101],
  [139, CRUISE_POINT_UP, 101],
  [139, CRUISE_POINT_UP, -122],
  [-120, CRUISE_POINT_UP, -122]
]

export const getPageOpts = animateBack => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '101',
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
    LIGHT_MAIN_SWITCH,
    AIR_SWITCH,
    GATE_SWITCH,
    VIDEO_SWITCH,
    SCREEN_EDIT,
    DOUBLE_HORIZONTAL_SWITCH,
    ODD_ROTATE_SWITCH,
    DOUBLE_ROTATE_SWITCH,
    CURTAIN_SWITCH
  ],
  animationModelType: [MAIN_SCENE, CONPANT_FLOOR, CURTAIN],

  models: [
    {
      key: MAIN_SCENE,
      name: '场景',
      size: 26.6,
      url: '/公司总部.glb'
    },
    {
      key: 'floor_low',
      name: '低层',
      size: 6.1,
      url: '/低层.glb'
    },
    {
      key: CURTAIN,
      name: '窗帘',
      size: 0.2,
      url: '/窗帘.glb'
    },
    {
      key: 'floor_heigh',
      name: '高层',
      size: 2.7,
      url: '/高层.glb'
    },

    {
      key: CONPANT_FLOOR,
      name: '公司',
      size: 40.7,
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
      mapUrl: '/dw.png'
    },
    {
      key: WAIT_LIFT,
      name: '电梯门',
      type: 'sprite',
      mapUrl: '/lift.png'
    },
    {
      key: DOUBLE_HORIZONTAL_SWITCH,
      name: '双横推开关门',
      type: 'sprite',
      mapUrl: '/lift.png'
    },
    {
      key: DOUBLE_ROTATE_SWITCH,
      name: '双旋转开关门',
      type: 'sprite',
      mapUrl: '/lift.png'
    },
    {
      key: ODD_ROTATE_SWITCH,
      name: '单旋转开关门',
      type: 'sprite',
      mapUrl: '/lift.png'
    },
    {
      key: GATE_SWITCH,
      name: '闸机',
      type: 'sprite',
      mapUrl: '/gate.png'
    },

    {
      key: VIDEO_SWITCH,
      name: '视频',
      type: 'sprite',
      mapUrl: '/video.png'
    },
    {
      key: SCREEN_EDIT,
      name: '编辑',
      type: 'sprite',
      mapUrl: '/edit.png'
    },
    {
      key: CURTAIN_SWITCH,
      name: '窗帘',
      type: 'sprite',
      mapUrl: '/curtain.png'
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
      key: 'spot_light_floor_1',
      type: 'spotlight',
      name: '聚光灯',
      intensity: 8,
      color: 0x62d2a2,
      distance: 20
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
      mapUrl: '/light.png'
    },
    {
      key: LIGHT_MAIN_SWITCH,
      name: '开关灯',
      type: 'sprite',
      mapUrl: '/light.png'
    },
    {
      key: AIR_SWITCH,
      name: '空调',
      type: 'sprite',
      mapUrl: '/air.png'
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
    mapUrl: '/oss/textures/cruise/line18.png', // 1-18
    // mapUrl: '/oss/textures/cruise/diffuse.jpg', // 1-18
    repeat: [1, 1],
    width: 2,
    segment: 100,
    tension: 0.01,
    speed: 10,
    mapSpeed: 0.1,
    points: cruisePoints,
    close: true,
    offset: 5.2,
    animateBack: animateBack
  },

  // 漫游坐标
  roamPoints: [
    [1.7, -1.4, 51.3],
    [80.5, 72.6, 75],
    [87, 160, -72.4],
    [13.2, 186, -72.4],
    [13.2, 186, -61.3],
    [52, 186, -28.2],
    [52, 186, 42.7],
    [-36.4, 186, 40],
    [-38.2, 186, -26.8]

    // [-28.3, 5.8, 103.9],
    // [15.8, 186, 49.1],
    // [11.7, 184, 60.2],
    // [-31, 187.6, 49.7],
    // [56.6, 185.5, -15.6]

    // [-286, ROAM_POINT_UP, 257],
    // [286, ROAM_POINT_UP, 257],
    // [286, ROAM_POINT_UP, -600],
    // [-286, ROAM_POINT_UP, -600]
  ]
})

export const getFloorOpts = () => ({
  active: 2,
  show: false,
  targetName: '',
  list: [
    {
      target: '电梯-2',
      items: [
        // key 值需要与 配置的等电梯点位 bing 字段尾数相同
        { name: '一楼', key: 1, y: 0.1, bind: '_一楼电梯门-2_grp' },
        { name: '公司', key: 2, y: 184.7, bind: '_电梯外门_2_grp' }
      ]
    },
    {
      target: '电梯-1',
      items: [
        // key 值需要与 配置的等电梯点位 bing 字段尾数相同
        { name: '一楼', key: 1, y: 0.1, bind: '_一楼电梯门-1_grp' },
        { name: '公司', key: 2, y: 184.7, bind: '_电梯外门_1_grp' }
      ]
    }
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
