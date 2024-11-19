const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const getPageOpts = (): {} & Omit<import('three-scene/components/floor-scene/index').Props, 'formatObject'> => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '221',
  render: {
    alpha: true,
    preserveDrawingBuffer: true
  },
  // bgUrl: '/oss/img/map/earth.jpg',
  // bgUrl: [`/posX.jpeg`, `/negX.jpeg`, `/posY.jpeg`, `/negY.jpeg`, `/posZ.jpeg`, `/negZ.jpeg`].map(
  //   u => `/oss/img/sky/216${u}`
  // ),
  // env: '/oss/textures/hdr/skidpan_2k.hdr',
  env: '/oss/textures/hdr/3.hdr',
  camera: {
    far: 1000000
  },
  colors: {
    normal: {
      main: 0x00ff00
    },
    runing: {
      main: 0xff0ff0,
      text: 0x000000
    }
  },
  cruise: {
    visible: true,
    // helper: true,
    points: [
      [450, 490, 450],
      [450, 490, -450],
      [-450, 490, -450],
      [-450, 490, 450]
    ],
    offset: 10
  },
  controls: {
    screenSpacePanning: false,
    maxDistance: 5000,
    maxPolarAngle: Math.PI * 0.46
  },
  directionalLight: {
    helper: !true
  },
  grid: {
    visible: true
  },

  models: [
    {
      key: 'FLOOR_ONE',
      name: '大堂', // 高 140
      size: 8.5,
      url: '/1楼.glb'
    },
    {
      key: 'FLOOR_COMMON',
      name: '楼层', // 高 60
      size: 13.7,
      url: '/楼层.glb'
    },
    {
      key: 'FLOOR_ATTIC',
      name: '楼顶', // 高 350
      size: 0.1,
      url: '/楼顶.glb'
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
    }
  ].map(item => {
    if (item.url) {
      item.url = '/oss/model/floor' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/floor' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  }),
  objects: [],
  config: {},

  indexDB: {
    cache: true,
    dbName: 'THREE__FLOOR__DB',
    tbName: 'TB',
    version: 1
  },
  dotShowStrict: !true,
  colorMeshName: [],
  floorModelType: [
    'FLOOR_COMMON',
    'FLOOR_ONE',
    'FLOOR_TWO_FIVE',
    'FLOOR_SIX',
    'FLOOR_SEVEN_ELEVEN',
    'FLOOR_TWELVE_THIRTEEN',
    'FLOOR_FOURTEEN_SIXTEEN',
    'FLOOR_SEVENTEEN_EIGHTEEN'
  ],
  anchorType: ['COLD_CAMERA', 'COLD_ROOM_INLET', 'COLD_GPS'],
  mainBodyChangeColor: true,
  mainBodyMeshName: ['立方体062'],
  animationModelType: ['FLOOR_COMMON']
})
