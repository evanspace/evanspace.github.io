const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const getPageOpts = (): {} & import('three-scene/components/map-scene/index').Props => ({
  devEnv: devEnv,
  baseUrl: base,
  // skyCode: '217',
  bgColor: 0x071729,
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
    visible: true
  },
  controls: {
    maxPolarAngle: Math.PI * 0.46,
    maxDistance: 5000,
    enableDamping: true,
    screenSpacePanning: false
  },
  axes: {
    visible: true
  }
})
