const base = import.meta.env.VITE_BEFORE_STATIC_PATH

export const getPageOpts = (): {
  baseUrl: string
  models: import('three-scene/types/model').ModelItem[]
} => ({
  baseUrl: base,

  models: [
    {
      key: '',
      type: 'font',
      name: '字体',
      size: 27.6,
      url: '/oss/font/YaHei_Regular.json'
    }
  ]
})
