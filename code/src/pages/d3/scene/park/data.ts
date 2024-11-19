const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const getPageOpts = () => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '221',
  env: '/oss/textures/hdr/3.hdr',

  // dot 点位类型值
  dotKey: 'DOT',
  dotShowStrict: false,

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName: [],
  // 楼层模块类型
  floorModelType: ['FLOOR_COMMON'],
  // 锚点模型类型列表（精灵类型）该类型未绑定点击事件函数将作为 dialog 弹窗事件处理
  anchorType: ['PARK_CAMERA', 'PARK_ROOM_INLET', 'PARK_GPS'],
  // 汽车类型，需要行驶
  carType: ['CAR_TANKER', 'CAR_GOODS', 'CAR_TRAILER', 'CAR_CRANE'],

  colors: {},
  config: {},

  models: [
    {
      key: 'SCENE',
      name: '场景', // 高 140
      size: 28.2,
      url: '/场景.glb'
    },
    {
      key: 'BUILDING_ONE',
      name: '楼栋1', // 高 140
      size: 1.2,
      url: '/楼栋1.glb'
    },

    {
      key: 'CAR_TANKER',
      name: '油罐车', // 高 140
      size: 1,
      url: '/油罐车.glb'
    },
    {
      key: 'CAR_GOODS',
      name: '货车', // 高 140
      size: 6.4,
      url: '/货车.glb'
    },
    {
      key: 'CAR_TRAILER',
      name: '拖车', // 高 140
      size: 2,
      url: '/拖车.glb'
    },
    {
      key: 'CAR_CRANE',
      name: '吊车', // 高 140
      size: 4.4,
      url: '/吊车.glb'
    },

    {
      key: 'ARBOR_ONE',
      name: '小树', // 高 140
      size: 2,
      url: '/小树.glb'
    },

    {
      key: 'FENCE',
      name: '围栏', // 高 140
      size: 0.8,
      url: '/围栏.glb'
    },

    {
      key: 'HANDRAIL',
      name: '栏杆', // 高 140
      size: 0.1,
      url: '/栏杆.glb'
    },

    {
      key: 'PARK_CAMERA',
      name: '摄像头',
      type: 'sprite',
      size: 1,
      range: { x: 18.5, y: 38.5 },
      mapUrl: '/sxt.png'
    },
    {
      key: 'PARK_ROOM_INLET',
      name: '房间入口',
      type: 'sprite',
      size: 1,
      range: { x: 18.5, y: 38.5 },
      mapUrl: '/fjdw.png'
    }
  ].map(item => {
    if (item.url) {
      item.url = '/oss/model/park' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/floor' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  })
})
