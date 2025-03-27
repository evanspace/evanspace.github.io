const base = import.meta.env.VITE_GIT_OSS

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
      url: '/fonts/YaHei_Regular.json'
    }
  ]
})
