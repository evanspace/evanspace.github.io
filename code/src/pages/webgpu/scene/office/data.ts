import KEYS from './keys'

import models from './models'

/**
 * 获取页面配置
 * @returns
 */
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
  anchorType: [
    KEYS.M_ANCHOR_POS,
    KEYS.M_ANCHOR_TARGET,
    KEYS.M_WAIT_LIFT,
    KEYS.M_LIGHT_SWITCH,
    KEYS.M_LIGHT_MAIN_SWITCH,
    KEYS.M_AIR_SWITCH,
    KEYS.M_GATE_SWITCH,
    KEYS.M_VIDEO_SWITCH,
    KEYS.M_SCREEN_EDIT,
    KEYS.M_DOUBLE_HORIZONTAL_SWITCH,
    KEYS.M_ODD_ROTATE_SWITCH,
    KEYS.M_DOUBLE_ROTATE_SWITCH,
    KEYS.M_CURTAIN_SWITCH,
    KEYS.M_MODE_SWITCH
  ],
  animationModelType: [KEYS.M_MAIN_SCENE, KEYS.M_CAMPANY_FLOOR, KEYS.M_CURTAIN],

  config: {},
  cruise: {
    color: 0x1fe4ec,
    visible: true,
    auto: false,
    // alway: true,
    mapUrl: '/oss/textures/cruise/line2.png', // 1-18
    repeat: [0.2, 1],
    width: 2,
    segment: 100,
    tension: 0.01,
    speed: 20,
    mapSpeed: 0.02,
    points: [],
    close: true,
    offset: 5.2,
    bloomIntensity: 0.5
  },
  roamPoints: [],

  models
})

/**
 * 获取提示配置
 * @returns
 */
export const getTipOpts = () => ({
  show: false,
  style: {
    left: 0,
    top: 0
  },
  msg: ''
})

/**
 * 电梯楼层配置
 * @returns
 */
export const getFloorOpts = () => ({
  active: 2,
  show: false,
  targetName: '',
  list: [
    {
      target: '电梯-2',
      items: [
        // key 值需要与 配置的等电梯点位 bing 字段尾数相同
        { name: '一楼', key: 1, y: 0.1, bind: '_一楼电梯门-2_grp' },
        { name: '公司', key: 2, y: 184.7, bind: '_电梯外门_2_grp' }
      ]
    },
    {
      target: '电梯-1',
      items: [
        // key 值需要与 配置的等电梯点位 bing 字段尾数相同
        { name: '一楼', key: 1, y: 0.1, bind: '_一楼电梯门-1_grp' },
        { name: '公司', key: 2, y: 184.7, bind: '_电梯外门_1_grp' }
      ]
    }
  ]
})
