const base = import.meta.env.VITE_GIT_OSS

const devEnv = import.meta.env.VITE_MODE !== 'production'

export const getPageOpts = () => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '221',
  // env: '/textures/hdr/6.hdr'
  env: '/textures/exr/piz_compressed.exr'
})

export const getUploadOpts = () => ({
  accept: ['fbx', 'glb', 'gltf', 'ldr', 'mpd'],
  fileName: ''
})
