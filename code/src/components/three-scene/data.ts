


import { colors } from './colors'

import type { ThreeConfig, FloorObj, Progress, Dialog } from '.'

// 配置
export const threeConfig = <ThreeConfig>( {
  colors,
  isCruise: false,
  // 模型 KB 倍数
  modelSizeKB: 1024 * 1024,
  // 加载零件
  loadPart: {},
  // 设备
  devices: [],
  // timer: null,
} )


// 楼层对象
export const floorObj = <FloorObj>( {
  list: []
} )


// 进度
export const progress = reactive<Progress>( {
  percentage: 0,
  show: false,
  isEnd: false,
  list: [],
  total: 0,
  loaded: 0,
} )

// 弹窗
export const dialog = reactive<Dialog>( {
  show: false,
  style: {
    left: '0px',
    top: '0px',
  },
  select: [],
  title: '',
  data: {},
  pos: {}
} )
