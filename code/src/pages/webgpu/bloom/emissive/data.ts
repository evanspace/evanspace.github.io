const base = import.meta.env.VITE_GIT_OSS

export const getPageOpts = () => ({
  base,

  models: [
    {
      key: 'helmet',
      name: '头盔',
      size: 2.8,
      url: '/models/gpu/头盔.glb'
    }
  ],

  objects: [
    {
      type: 'helmet',
      name: '头盔'
    }
  ]
})
