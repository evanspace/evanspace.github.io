const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

const OPTS = {
  // 地图深度
  depth: 2,
  // 地图缩放倍数
  scale: 40,
  // 波纹板半径
  plateRadius: 100
  // 右键间隔时间
  // rightClickBackDiffTime: 100
}

// 全局颜色
const COLOR = {
  // 主色（地图面）
  main: 0x338ad7,
  mainHover: 0x92ffff,
  // 边(区域侧边)
  borderColor: 0x92ffff,
  borderHoverColor: 0x10467a,
  // 浅色
  light: 0x10467a,
  lightHover: 0x92ffff,
  // 波纹板
  plateColor: 0x338ad7,
  plateLight: 0x10467a,
  // 线条(地图区块上下线条)
  line: 0x91dbf3,
  line2: 0x61fbfd,
  // 网格线
  gridColor: 0x0a2036,
  // 网格交叉
  gridFork: 0x0e2843,
  // 轮廓线
  outline: 0xb4eafc,
  // mark 颜色(光柱)
  markColor1: 0xcaffff,
  markColor2: 0x69f8ff,
  // 飞线
  flyColor1: 0x91dbf3,
  flyColor2: 0x61fbfd,
  // 散点
  scatterColor1: 0x91dbf3,
  scatterColor2: 0x61fbfd
}

export const getPageOpts = (): {} & import('three-scene/src/components/map-scene/index').Props => ({
  devEnv: devEnv,
  baseUrl: base,
  // skyCode: '217',
  bgColor: 0x071729,
  color: COLOR,
  config: {
    ...OPTS,
    areaLabel: true,
    markLight: true,
    // mapBg: false,
    // bgOutFactor: 0.5,
    // bgInnerFactor: 0.3,
    map: {
      // map: '/oss/textures/map/gz-map.jpg',
      // normal: '/oss/textures/map/gz-map-fx.jpg',
      // side: '/oss/textures/map/border.png',
      // bgOutCircle: '/oss/textures/map/out-circle.png',
      // bgInnerCircle: '/oss/textures/map/inner-circle.png'
    }
  },
  camera: {
    // helper: true,
    position: [0, 100, 200]
  },
  directionalLight: {
    helper: true
  },
  fog: {
    visible: false,
    near: 2000,
    far: 3000
  },
  render: {
    preserveDrawingBuffer: true
  },
  grid: {
    visible: true,
    gridColor: COLOR.gridColor,
    centerLineColor: COLOR.gridColor,
    fork: true,
    divisions: 40,
    width: OPTS.plateRadius * 2 * OPTS.scale,
    forkSize: 1.4 * OPTS.scale,
    forkColor: COLOR.gridFork
  },
  controls: {
    maxPolarAngle: Math.PI * 0.46,
    maxDistance: 5000,
    enableDamping: true,
    screenSpacePanning: false
  },
  axes: {
    visible: true
  },
  mapJson: null,
  outlineJson: null,
  flywire: [],
  barList: [],
  scatters: []
})
