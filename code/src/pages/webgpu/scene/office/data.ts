import KEYS from './keys'

export const getPageOpts = (): {
  /**
   * 锚点类型
   */
  anchorType: string[]
  /**
   * 动画模型类型
   */
  animationModelType: string[]
  /**
   * 配置
   */
  config: Partial<import('./index').Config>
  /**
   * 巡航
   */
  cruise: Partial<import('three-scene/types/options').Cruise>
  /**
   * 漫游
   */
  roamPoints: number[][]
  /**
   * 模型列表
   */
  models: import('three-scene/types/model').ModelItem[]
} => ({
  anchorType: [],
  animationModelType: [KEYS.S_MAIN_SCENE],

  config: {},
  cruise: {},
  roamPoints: [],

  models: [
    {
      key: KEYS.S_MAIN_SCENE,
      name: '场景',
      size: 13.6,
      url: '/公司总部.glb'
    },
    {
      key: KEYS.S_CONPANT_FLOOR,
      name: '公司',
      size: 16.6,
      url: '/二十五楼.glb'
    },

    {
      key: 'floor_low',
      name: '低层',
      size: 6.1,
      url: '/低层.glb'
    },
    {
      key: KEYS.S_CURTAIN,
      name: '窗帘',
      size: 0.2,
      url: '/窗帘.glb'
    },
    {
      key: 'floor_heigh',
      name: '高层',
      size: 2.7,
      url: '/高层.glb'
    },

    {
      key: KEYS.S_ANCHOR_POS,
      name: '定位',
      type: 'sprite',
      range: { x: 4, y: 4 },
      mapUrl: '/pos.png'
    },

    {
      key: 'spot_light_floor_1',
      type: 'GPUspotlight',
      name: '主机聚光灯',
      intensity: 8,
      color: 0xffffed,
      distance: 20
    },
    {
      key: 'spot_light_floor_2',
      type: 'GPUspotlight',
      name: '会议室聚光灯',
      intensity: 2,
      color: 0xffffed,
      castShadow: false,
      distance: 10
    },

    {
      key: 'spot_light_floor_3',
      type: 'GPUspotlight',
      name: '屏幕聚光灯',
      intensity: 1,
      color: 0xffffed,
      distance: 15,
      penumbra: 0.5,
      castShadow: false,
      angle: Math.PI * 0.36
    },
    {
      key: 'spot_light_floor_4',
      type: 'GPUspotlight',
      name: '屏幕聚光灯',
      intensity: 2,
      color: 0xffffed,
      distance: 12,
      penumbra: 0.5,
      castShadow: false,
      angle: Math.PI * 0.4
    },
    {
      key: 'spot_light_floor_5',
      type: 'GPUspotlight',
      name: '屏幕聚光灯',
      intensity: 2,
      color: 0xffffed,
      distance: 8,
      penumbra: 0.5,
      castShadow: false,
      angle: Math.PI * 0.23
    },

    {
      key: 'rect_area_light_1',
      type: 'GPUplanelight',
      name: '面光灯',
      intensity: 1.2,
      color: 0xffffff,
      width: 134,
      height: 134
    },
    {
      key: 'rect_area_light_2',
      type: 'GPUplanelight',
      name: '面光灯',
      intensity: 0.8,
      color: 0xffffff,
      width: 134,
      height: 134
    }
  ].map(item => {
    if (item.url && item.url.indexOf('oss') < 0) {
      item.url = '/oss/model/office' + item.url
    }
    if (item.mapUrl) {
      item.mapUrl = '/oss/textures/office' + item.mapUrl
    }
    if (!item.range) {
      item.range = { x: 0.5, y: 0.5 } as any
    }
    return item as import('three-scene/types/model').ModelItem
  })
})
