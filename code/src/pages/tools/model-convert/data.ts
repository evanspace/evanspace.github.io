const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production'

export const getPageOpts = () => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '221',
  env: '/oss/textures/hdr/6.hdr'
})

export const getUploadOpts = () => ({
  accept: ['fbx', 'glb', 'gltf'],
  fileName: ''
})
