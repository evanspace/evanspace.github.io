/* *
 * @description:
 * @file: data.ts
 * @author: Evan
 * @date: 2025.05.13 16:22:51
 * @week: 周二
 * @version: V
 * */

import KEYS from './data/keys'
import models from './data/models'

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
   * 楼层类型
   */
  floorModelType: string[]
  /**
   * 配置
   */
  config: Partial<import('./type').Config>

  /**
   * 模型列表
   */
  models: import('three-scene/types/model').ModelItem[]

  /**
   * 巡航
   */
  cruise: Partial<import('three-scene/types/options').Cruise>
  /**
   * 漫游
   */
  roamPoints: number[][]
} => ({
  anchorType: [KEYS.M_ANCHOR_POS, KEYS.M_ANCHOR_TARGET, KEYS.S_OPEN_DOOR, KEYS.S_LIGHT_SWITCH],
  animationModelType: [KEYS.M_MAIN_SCENE, KEYS.M_MACHINE_ROOM, KEYS.M_WATER_PUMP],
  floorModelType: [KEYS.M_FLOOR],

  config: {},

  models,

  cruise: {
    color: 0x1fe4ec,
    visible: true,
    auto: false,
    alway: !true,
    // mapUrl: base + '/textures/cruise/line2.png', // 1-18
    repeat: [0.1, 1],
    width: 1.2,
    segment: 100,
    tension: 0.01,
    speed: 20,
    mapSpeed: 0.02,
    points: [],
    close: !false,
    bloomIntensity: 0.2,
    cameraAutoMove: false,
    maxDistance: 5
  },

  // 漫游坐标
  roamPoints: []
})

export const getTipOpts = () => ({
  show: false,
  style: {
    left: 0,
    top: 0
  },
  msg: ''
})
