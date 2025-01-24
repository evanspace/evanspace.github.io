const base = import.meta.env.VITE_BEFORE_STATIC_PATH

export const getPageOpts = () => ({
  base,

  models: [
    {
      key: 'tree',
      name: '大树',
      size: 0.1,
      url: '/oss/model/gpu/tree.glb'
    }
  ],

  objects: [
    {
      type: 'tree',
      name: '大树'
    }
  ]
})
