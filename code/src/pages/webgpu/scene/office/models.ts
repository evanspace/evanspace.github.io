import KEYS from './keys'

export default [
  // 场景建筑
  {
    key: KEYS.M_MAIN_SCENE,
    name: '场景',
    size: 13.6,
    url: '/公司总部.glb'
  },
  {
    key: KEYS.M_CONPANT_FLOOR,
    name: '公司',
    size: 14.6,
    url: '/二十五楼.glb'
  },

  {
    key: 'floor_low',
    name: '低层',
    size: 6.1,
    url: '/低层.glb'
  },
  {
    key: KEYS.M_CURTAIN,
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
    key: KEYS.M_ROBOT,
    name: '机器人',
    size: 0.3,
    url: '/oss/model/common/机器人.glb'
  },
  {
    key: KEYS.M_PERSON,
    name: '人物',
    size: 1.8,
    url: '/oss/model/common/人物.glb'
  },

  // 灯光
  {
    key: 'spot_light_floor_1',
    type: 'spotlight',
    name: '主机聚光灯',
    intensity: 8,
    color: 0xffffed,
    castShadow: false,
    distance: 20,
    penumbra: 0.5,
    iesMap: '/oss/ies/06b4cfdc8805709e767b5e2e904be8ad.ies'
  },
  {
    key: 'spot_light_floor_2',
    type: 'spotlight',
    name: '会议室聚光灯',
    intensity: 2,
    color: 0xffffed,
    castShadow: false,
    penumbra: 0.5,
    angle: Math.PI * 0.36,
    distance: 10
  },

  {
    key: 'spot_light_floor_3',
    type: 'spotlight',
    name: '屏幕聚光灯',
    intensity: 1,
    color: 0xffffed,
    distance: 15,
    penumbra: 0.5,
    castShadow: false,
    angle: Math.PI * 0.36
  },
  {
    key: 'spot_light_floor_4',
    type: 'spotlight',
    name: '屏幕聚光灯',
    intensity: 2,
    color: 0xffffed,
    distance: 12,
    penumbra: 0.5,
    castShadow: false,
    angle: Math.PI * 0.4
  },
  {
    key: 'spot_light_floor_5',
    type: 'spotlight',
    name: '屏幕聚光灯',
    intensity: 2,
    color: 0xffffed,
    distance: 8,
    penumbra: 0.5,
    castShadow: false,
    angle: Math.PI * 0.23
  },

  {
    key: 'rect_area_light_1',
    type: 'planelight',
    name: '面光灯',
    intensity: 1.2,
    color: 0xffffff,
    width: 134,
    height: 134
  },
  {
    key: 'rect_area_light_2',
    type: 'planelight',
    name: '面光灯',
    intensity: 0.5,
    color: 0xffffff,
    width: 134,
    height: 134
  },

  // 精灵锚点
  {
    key: KEYS.M_ANCHOR_POS,
    name: '定位',
    type: 'sprite',
    range: { x: 4, y: 4 },
    mapUrl: '/pos.png'
  },
  {
    key: KEYS.M_ANCHOR_TARGET,
    name: '锚点',
    type: 'sprite',
    mapUrl: '/dw.png'
  },

  // 门-开关
  {
    key: KEYS.M_WAIT_LIFT,
    name: '电梯门',
    type: 'sprite',
    mapUrl: '/lift.png'
  },
  {
    key: KEYS.M_DOUBLE_HORIZONTAL_SWITCH,
    name: '双横推开关门',
    type: 'sprite',
    mapUrl: '/lift.png',
    range: { x: 0.3, y: 0.3 }
  },
  {
    key: KEYS.M_DOUBLE_ROTATE_SWITCH,
    name: '双旋转开关门',
    type: 'sprite',
    mapUrl: '/lift.png',
    range: { x: 0.3, y: 0.3 }
  },
  {
    key: KEYS.M_ODD_ROTATE_SWITCH,
    name: '单旋转开关门',
    type: 'sprite',
    mapUrl: '/lift.png',
    range: { x: 0.3, y: 0.3 }
  },
  {
    key: KEYS.M_GATE_SWITCH,
    name: '闸机开关',
    type: 'sprite',
    mapUrl: '/gate.png'
  },

  {
    key: KEYS.M_VIDEO_SWITCH,
    name: '视频播放开关',
    type: 'sprite',
    mapUrl: '/video.png'
  },
  {
    key: KEYS.M_SCREEN_EDIT,
    name: '编辑大屏按钮',
    type: 'sprite',
    mapUrl: '/edit.png'
  },
  {
    key: KEYS.M_CURTAIN_SWITCH,
    name: '窗帘-开关',
    type: 'sprite',
    mapUrl: '/curtain.png'
  },

  // 灯开关
  {
    key: KEYS.M_LIGHT_SWITCH,
    name: '开关灯',
    type: 'sprite',
    mapUrl: '/light.png'
  },
  {
    key: KEYS.M_LIGHT_MAIN_SWITCH,
    name: '开关灯',
    type: 'sprite',
    mapUrl: '/light.png'
  },
  {
    key: KEYS.M_AIR_SWITCH,
    name: '空调开关',
    type: 'sprite',
    mapUrl: '/air.png'
  },
  {
    key: KEYS.M_MODE_SWITCH,
    name: '模式切换按钮',
    type: 'sprite',
    mapUrl: '/mode.png'
  }
].map(item => {
  if (item.url && item.url.indexOf('oss') < 0) {
    item.url = '/oss/model/office' + item.url
  }
  if (item.mapUrl) {
    item.mapUrl = '/oss/textures/office' + item.mapUrl
  }
  if (!item.range) {
    item.range = { x: 0.5, y: 0.5 } as any
  }
  return item as import('three-scene/types/model').ModelItem
})
