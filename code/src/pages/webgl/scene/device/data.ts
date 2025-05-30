const base = import.meta.env.VITE_GIT_OSS

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const getPageOpts = (): {} & Omit<
  import('@/components/device-scene/index').Props,
  'formatObject'
> => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  env: '/textures/hdr/skidpan_2k.hdr',

  colors: {
    normal: {
      main: [0x88a1b5, 0x292e31],
      text: 0xb9dbff,
      FM: 0x88a1b5
    },
    runing: {
      main: 0x2e77f8,
      FM: 0x00590f
    },
    error: {
      FM: 0xb53e09
    }
  },

  indexDB: {
    cache: true,
    dbName: 'THREE__DEVICE__DB',
    tbName: 'TB',
    version: 3
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
    alpha: true,
    preserveDrawingBuffer: true
  },
  controls: {
    screenSpacePanning: false,
    maxDistance: 1500,
    maxPolarAngle: Math.PI * 0.46
  },
  grid: {
    visible: !true,
    gridColor: 0x00adb5,
    centerLineColor: 0x00adb5,
    fork: !true,
    forkColor: 0x00adb5
  },
  axes: {
    visible: true
  },
  ambientLight: {
    intensity: 2
  },
  directionalLight: {
    helper: !true
    // intensity: 1
    // position: [0, 500, -400],
    // position2: [0, 500, 400]
  },
  config: {},

  models: [
    {
      key: 'JSQ',
      name: '分集水器',
      size: 0.2,
      url: '/分集水器.glb'
    },
    {
      key: 'LXJ',
      name: '离心机',
      size: 0.2,
      url: '/离心机.glb'
    },
    {
      key: 'LGJ',
      name: '螺杆机',
      size: 0.2,
      url: '/螺杆机.glb'
    },
    {
      key: 'LQT',
      name: '冷却塔',
      size: 0.09,
      url: '/冷却塔.glb'
    },
    {
      key: 'LDB',
      name: '冷冻泵',
      size: 0.2,
      url: '/冷冻泵.glb'
    },
    {
      key: 'LQB',
      name: '冷却泵',
      size: 0.2,
      url: '/冷却泵.glb'
    },
    {
      key: 'FM',
      name: '阀门',
      size: 0.02,
      url: '/阀门.glb'
    },
    {
      key: 'BSHLQ',
      name: '板式换热器-制冷',
      size: 0.07,
      url: '/板式换热器-制冷.glb'
    },

    {
      key: 'JGBS',
      name: '警告标识',
      size: 0.01,
      type: 'warning',
      url: '/警告标识.glb'
    },
    {
      key: 'JDBS',
      name: '就地标识',
      size: 0.01,
      type: 'local',
      url: '/就地.glb'
    },
    {
      key: 'JYBS',
      name: '禁用标识',
      size: 0.01,
      type: 'disabled',
      url: '/禁用.glb'
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
      url: '/fonts/YaHei_Regular.json'
    }
  ].map(item => {
    if (item.type !== 'sprite' && item.url && item.url.indexOf('/fonts') < 0) {
      item.url = '/models/ncl' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/textures/floor' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  }),
  objects: [],
  dotShowStrict: true,
  mainBodyChangeColor: true,

  anchorType: ['COLD_CAMERA', 'COLD_ROOM_INLET', 'COLD_GPS'],
  colorMeshName: ['叶轮', '电动阀门'],
  animationModelType: ['LDB', 'LQB', 'SB', 'LXJ', 'LGJ', 'LQT'],
  textModelType: ['LDB', 'LQB', 'JSQ', 'LXJ', 'LGJ', 'LQT', 'BSHLQ']
})
