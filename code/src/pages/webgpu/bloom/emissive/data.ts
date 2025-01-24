const base = import.meta.env.VITE_BEFORE_STATIC_PATH

export const getPageOpts = () => ({
  base,

  models: [
    {
      key: 'helmet',
      name: '头盔',
      size: 0.5,
      url: '/oss/model/gpu/头盔.glb'
    }
  ],

  objects: [
    {
      type: 'helmet',
      name: '头盔'
    }
  ]
})
