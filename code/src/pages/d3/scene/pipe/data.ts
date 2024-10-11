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
    version: 2
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
    maxDistance: 5000,
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
    visible: false
  },
  ambientLight: {
    intensity: 1.5
  },
  directionalLight: {
    helper: !true
    // intensity: 1
    // position: [0, 500, -400],
    // position2: [0, 500, 400]
  },

  statusOffset: {
    TEXT: {
      JSQ: {
        position: { x: 0, y: 10, z: 20 }
      },
      LDB: {
        position: { x: 0, y: 0, z: 75 },
        rotation: { x: 0, y: 90, z: 0 }
      },
      LGJ_3: {
        position: { x: 0, y: 16, z: 50 },
        rotation: { x: -20, y: 0, z: 0 }
      },
      LQT: {
        position: { x: -55, y: 12, z: 0 }
      }
    },
    WARNING: {
      LDB: {
        position: { x: 0, y: 45, z: 4 },
        rotation: { x: 0, y: 90, z: 0 }
      },
      LQT: {
        position: { x: 0, y: 115, z: 0 }
      }
    }
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
      key: 'LGJ_3',
      name: '螺杆机',
      size: 1.2,
      url: '/螺杆机-三机头.glb'
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
      key: 'JGBS',
      name: '警告标识',
      size: 0.2,
      type: 'warning',
      url: '/警告标识.glb'
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
      key: 'LDH_PIPE_ERECT',
      type: 'pipe',
      name: '冷冻回水',
      size: 0.01,
      url: '/oss/model/pipe/冷冻回.glb',
      mapUrl: '/oss/model/pipe/002.png',
      mapMeshName: '贴图'
    },
    {
      key: 'LDH_PIPE_RIGHT_ANGLE',
      type: 'pipe',
      name: '冷冻回-弯头',
      size: 0.12,
      url: '/oss/model/pipe/冷冻回-弯头.glb',
      repeat: [1, 0.25],
      mapUrl: '/oss/model/pipe/002.png',
      mapMeshName: '贴图'
    },
    {
      key: 'LDG_PIPE_ERECT',
      type: 'pipe',
      name: '冷冻供水',
      size: 0.01,
      url: '/oss/model/pipe/冷冻供.glb',
      mapUrl: '/oss/model/pipe/002.png',
      mapMeshName: '贴图'
    },
    {
      key: 'LDG_PIPE_RIGHT_ANGLE',
      type: 'pipe',
      name: '冷冻供-弯头',
      size: 0.12,
      url: '/oss/model/pipe/冷冻供-弯头.glb',
      repeat: [1, 0.25],
      mapUrl: '/oss/model/pipe/002.png',
      mapMeshName: '贴图'
    },
    {
      key: 'LQG_PIPE_ERECT',
      type: 'pipe',
      name: '冷却供水',
      size: 0.01,
      url: '/oss/model/pipe/冷却供.glb',
      mapUrl: '/oss/model/pipe/002.png',
      mapMeshName: '贴图'
    },
    {
      key: 'LQG_PIPE_RIGHT_ANGLE',
      type: 'pipe',
      name: '冷却供-弯头',
      size: 0.12,
      repeat: [1, 0.25],
      url: '/oss/model/pipe/冷却供-弯头.glb',
      mapUrl: '/oss/model/pipe/002.png',
      mapMeshName: '贴图'
    },
    {
      key: 'LQH_PIPE_ERECT',
      type: 'pipe',
      name: '冷却回水',
      size: 0.01,
      url: '/oss/model/pipe/冷却回.glb',
      mapUrl: '/oss/model/pipe/002.png',
      mapMeshName: '贴图'
    },
    {
      key: 'LQH_PIPE_RIGHT_ANGLE',
      type: 'pipe',
      name: '冷却回-弯头',
      size: 0.12,
      url: '/oss/model/pipe/冷却回-弯头.glb',
      repeat: [1, 0.25],
      mapUrl: '/oss/model/pipe/002.png',
      mapMeshName: '贴图'
    },

    {
      key: 'FONT_WRYH',
      name: '微软雅黑字体',
      type: 'font',
      size: 26.35,
      url: '/oss/font/YaHei_Regular.json'
    }
  ].map(item => {
    if (item.type !== 'sprite' && item.url && item.url.indexOf('/oss') < 0) {
      item.url = '/oss/model/cool' + item.url
    }
    if (item.mapUrl && item.mapUrl.indexOf('/oss') < 0) {
      item.mapUrl = '/oss/textures/floor' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  }),
  objects: [],
  pipes: [],
  dotShowStrict: true,
  textChangeColor: true,
  mainBodyChangeColor: false,

  anchorType: ['COLD_CAMERA', 'COLD_ROOM_INLET', 'COLD_GPS'],
  colorMeshName: ['电动阀门', '叶轮', '螺杆A', '螺杆B', '螺杆C', '螺杆D', '螺杆E', '螺杆F', '螺杆G', '螺杆H'],
  animationModelType: ['LDB', 'LQB', 'SB', 'LXJ', 'LGJ', 'LGJ_3', 'LQT'],
  textModelType: ['LDB', 'LQB', 'JSQ', 'LXJ', 'LGJ', 'LGJ_3', 'LQT', 'BSHLQ']
})
