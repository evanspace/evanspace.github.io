const base = import.meta.env.VITE_GIT_OSS

export const getPageOpts = () => ({
  base,

  models: [
    {
      key: 'gears',
      name: '齿轮',
      size: 0.07,
      url: '/models/gpu/gears.glb'
    }
  ],

  objects: [
    {
      type: 'gears',
      name: '齿轮',
      position: { x: 0, y: 150, z: 0 },
      scale: { x: 50, y: 50, z: 50 }
    }
  ]
})
