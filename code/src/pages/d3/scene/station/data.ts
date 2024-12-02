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

  config: {},

  anchorType: ['monitor_camera'],
  animationModelType: [],

  models: [
    {
      key: 'SCENE',
      name: '场景',
      size: 14.7,
      url: '/场景.glb'
    },
    {
      key: 'car_tanker',
      name: '油罐车',
      size: 1,
      url: '/油罐车.glb'
    },

    {
      key: 'monitor_camera',
      name: '摄像头',
      type: 'sprite',
      size: 1,
      range: { x: 18.5, y: 38.5 },
      mapUrl: '/sxt.png'
    }
  ].map(item => {
    if (item.url) {
      item.url = '/oss/model/park' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/park' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  })
})
