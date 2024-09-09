const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const devEnv = import.meta.env.VITE_MODE !== 'production-'

export const getPageOpts = (): {} & import('@/three-scene/components/floor-scene/index').Props => ({
  devEnv,
  baseUrl: base,
  bgColor: '',
  render: {
    alpha: true
  },
  // bgUrl: '/oss/img/map/earth.jpg',
  // bgUrl: [`/posX.jpeg`, `/negX.jpeg`, `/posY.jpeg`, `/negY.jpeg`, `/posZ.jpeg`, `/negZ.jpeg`].map(
  //   u => `/oss/img/sky/216${u}`
  // ),
  env: '/oss/textures/hdr/skidpan_2k.hdr',

  models: [
    {
      key: 'FLOOR_ONE',
      name: '大堂', // 高 140
      size: 8.5,
      url: '/1楼.glb'
    },
    {
      key: 'FLOOR_COMMON',
      name: '楼层', // 高 60
      size: 13.7,
      url: '/楼层.glb'
    },
    {
      key: 'FLOOR_ATTIC',
      name: '楼顶', // 高 350
      size: 0.1,
      url: '/楼顶.glb'
    }
  ].map(item => {
    if (item.url) {
      item.url = '/oss/model/floor' + item.url
    }
    return item
  })
})
