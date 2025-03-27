const base = import.meta.env.VITE_GIT_OSS

export const getPageOpts = () => ({
  base,

  models: [
    {
      key: 'coffeeMug',
      name: '咖啡杯',
      size: 0.5,
      url: '/models/gpu/coffeeMug.glb'
    }
  ],

  objects: [
    {
      type: 'coffeeMug',
      name: '咖啡杯',
      position: { x: -80, y: 25, z: 0 },
      scale: { x: 10, y: 10, z: 10 }
    }
  ]
})
