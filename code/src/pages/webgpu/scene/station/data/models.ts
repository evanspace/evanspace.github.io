/**
 * @description:
 * @file: models.ts
 * @author: Evan
 * @date: 2025.05.13 16:55:36
 * @week: 周二
 * @version: V
 * */

import KEYS from './keys'

export default [
  {
    key: KEYS.M_MAIN_SCENE,
    name: '场景',
    size: 78.8,
    url: '/深圳北站.glb'
    // url: '/公司总部.glb'
  },
  {
    key: KEYS.M_MACHINE_ROOM,
    name: '机房',
    size: 3.8,
    url: '/机房.glb'
  },
  {
    key: KEYS.M_WATER_PUMP,
    name: '水泵',
    size: 0.1,
    url: '/水泵.glb'
  },

  {
    key: KEYS.M_FLOOR,
    name: '楼层',
    size: 6.3,
    url: '/楼层.glb'
  },
  {
    key: KEYS.M_ANCHOR_POS,
    name: '定位',
    type: 'sprite',
    range: { x: 4, y: 4 },
    mapUrl: '/dw.png'
  },
  {
    key: KEYS.M_ANCHOR_TARGET,
    name: '锚点',
    type: 'sprite',
    range: { x: 4, y: 4 },
    mapUrl: '/dw.png'
  },
  {
    key: KEYS.S_OPEN_DOOR,
    name: '开门',
    type: 'sprite',
    range: { x: 2, y: 2 },
    mapUrl: '/pos.png'
  },

  {
    key: KEYS.M_PERSON,
    name: '人物',
    size: 1.8,
    url: '/models/common/人物.glb'
  },

  {
    key: KEYS.L_WATTING_TOOM,
    type: 'spotlight',
    name: '聚光灯',
    intensity: 2,
    color: 0xfff8d2,
    penumbra: 0.5,
    castShadow: false,
    angle: Math.PI * 0.4,
    distance: 40
  },
  {
    key: KEYS.S_LIGHT_SWITCH,
    name: '开关灯',
    type: 'sprite',
    mapUrl: '/light.png',
    range: { x: 2, y: 2 }
  }
].map(item => {
  if (item.url && item.url.indexOf('models') < 0) {
    item.url = '/models/station' + item.url
  }
  if (item.mapUrl && item.mapUrl.split('/').length == 2) {
    item.mapUrl = '/textures/station' + item.mapUrl
  }
  if (!item.range) {
    item.range = { x: 0.5, y: 0.5 } as any
  }
  return item as import('three-scene/types/model.d.ts').ModelItem
})
