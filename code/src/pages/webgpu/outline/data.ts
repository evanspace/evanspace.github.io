const base = import.meta.env.VITE_GIT_OSS

export const getPageOpts = () => ({
  base,

  models: [
    {
      key: 'tree',
      name: '大树',
      size: 0.1,
      url: '/models/gpu/tree.glb'
    }
  ],

  objects: [
    {
      type: 'tree',
      name: '大树'
    }
  ]
})
