const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const ANCHOR_POS = 'ANCHOR_POS'
const MAIN_SCENE = 'MAIN_SCENE'

export const getPageOpts = () => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  skyCode: '221',
  env: '/oss/textures/hdr/6.hdr',

  // dot 点位类型值
  dotKey: 'DOT',
  dotShowStrict: false,

  config: {},

  anchorType: [ANCHOR_POS],
  animationModelType: [MAIN_SCENE],

  models: [
    {
      key: MAIN_SCENE,
      name: '场景',
      size: 50.6,
      url: '/深圳北站.glb'
    },
    {
      key: 'building',
      name: '楼宇',
      size: 0.3,
      url: '/楼宇.glb'
    },
    {
      key: 'residential',
      name: '居民楼',
      size: 0.08,
      url: '/居民楼.glb'
    },
    {
      key: 'small_residential',
      name: '小型居民楼',
      size: 0.08,
      url: '/小型居民楼.glb'
    },

    {
      key: ANCHOR_POS,
      name: '定位',
      type: 'sprite',
      range: { x: 4, y: 4 },
      mapUrl: '/pos.png'
    }
  ].map(item => {
    if (item.url) {
      item.url = '/oss/model/station' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/station' + item.mapUrl
    }
    return item as import('three-scene/types/model').ModelItem
  })
})
