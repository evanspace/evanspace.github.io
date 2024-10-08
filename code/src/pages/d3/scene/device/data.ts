const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const getPageOpts = (): {} & Omit<
  import('three-scene/components/device-scene/index').Props,
  'formatObject'
> => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  // skyCode: '221',
  // bgUrl: '/oss/img/map/earth.jpg',
  // bgUrl: [`/posX.jpeg`, `/negX.jpeg`, `/posY.jpeg`, `/negY.jpeg`, `/posZ.jpeg`, `/negZ.jpeg`].map(
  //   u => `/oss/img/sky/216${u}`
  // ),
  env: '/oss/textures/hdr/skidpan_2k.hdr',

  colors: {
    normal: {
      main: [0x88a1b5, 0x292e31],
      text: 0xb9dbff,
      FM: 0x88a1b5
    },
    runing: {
      main: 0x2e77f8,
      FM: 0x067417
    }
  },

  indexDB: {
    cache: true,
    dbName: 'THREE__DEVICE__DB',
    tbName: 'TB',
    version: 1
  },
  camera: {
    far: 1000000
  },
  cruise: {
    visible: true,
    // helper: true,
    points: [
      [450, 0.1, 450],
      [450, 0.1, -450],
      [-450, 0.1, -450],
      [-450, 0.1, 450]
    ],
    offset: 10
  },
  render: {
    alpha: true
  },
  controls: {
    screenSpacePanning: false,
    maxDistance: 50000,
    maxPolarAngle: Math.PI * 0.46
  },
  grid: {
    visible: !true,
    gridColor: 0x00adb5,
    centerLineColor: 0x00adb5,
    fork: true,
    forkColor: 0x00adb5
  },
  axes: {
    visible: true
  },
  ambientLight: {
    intensity: 8
  },
  directionalLight: {
    helper: true,
    intensity: 3
  },
  config: {},

  models: [
    {
      key: 'JSQ',
      name: '分集水器',
      size: 2,
      url: '/分集水器.glb'
    },
    {
      key: 'LXJ',
      name: '离心机',
      size: 1.4,
      url: '/离心机.glb'
    },
    {
      key: 'LGJ',
      name: '螺杆机',
      size: 1.2,
      url: '/螺杆机.glb'
    },
    {
      key: 'LQT',
      name: '冷却塔',
      size: 0.8,
      url: '/冷却塔.glb'
    },
    {
      key: 'LDB',
      name: '冷冻泵',
      size: 2.5,
      url: '/冷冻泵.glb'
    },
    {
      key: 'LQB',
      name: '冷却泵',
      size: 2.5,
      url: '/冷却泵.glb'
    },
    {
      key: 'FM',
      name: '阀门',
      size: 0.05,
      url: '/阀门.glb'
    },
    {
      key: 'BSHLQ',
      name: '板式换热器-制冷',
      size: 0.4,
      url: '/板式换热器-制冷.glb'
    },

    {
      key: 'COLD_CAMERA',
      name: '摄像头',
      type: 'sprite',
      size: 1,
      range: { x: 37, y: 77 },
      mapUrl: '/sxt.png'
    },
    {
      key: 'COLD_ROOM_INLET',
      name: '房间入口',
      type: 'sprite',
      size: 1,
      range: { x: 37, y: 77 },
      mapUrl: '/fjdw.png'
    },
    {
      key: 'COLD_GPS',
      name: '定位',
      type: 'sprite',
      size: 1,
      range: { x: 51, y: 56 },
      mapUrl: '/dw.png'
    },

    {
      key: 'FONT_WRYH',
      name: '微软雅黑字体',
      type: 'font',
      size: 26.35,
      url: '/oss/font/YaHei_Regular.json'
    }
  ].map(item => {
    if (!item.type && item.url) {
      item.url = '/oss/model/ncl' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/floor' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  }),
  objects: [],
  dotShowStrict: !true,
  mainBodyChangeColor: true,

  colorMeshName: ['叶轮'],
  animationModelType: ['LDB', 'LQB', 'SB', 'LXJ', 'LGJ', 'LQT', 'FM']
})
