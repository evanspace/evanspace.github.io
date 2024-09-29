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
      main: 0x00ff00
    },
    runing: {
      main: 0xff0ff0,
      text: 0x000000
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
      [450, 490, 450],
      [450, 490, -450],
      [-450, 490, -450],
      [-450, 490, 450]
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
    visible: true,
    gridColor: 0xff0ff0,
    centerLineColor: 0xf00f00,
    fork: true
  },
  axes: {
    visible: true
  },
  directionalLight: {
    helper: true
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
  dotShowStrict: !true
})
