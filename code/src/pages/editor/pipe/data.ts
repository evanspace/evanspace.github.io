

import { DEVICE_KEY, DEVICE_TYPE, PIPE_TYPE } from '@/config/key'

const pipes = [
  { name: '冷冻回', type: PIPE_TYPE.LDH, color: '#2263E7' },
  { name: '冷冻供', type: PIPE_TYPE.LDG, color: '#2A19CC' },
  { name: '冷却供', type: PIPE_TYPE.LQG, color: '#CA691B' },
  { name: '冷却回', type: PIPE_TYPE.LQH, color: '#1F6C28' },
]

const devices = [
  { name: '冷冻泵', type: DEVICE_TYPE.LDB, key: DEVICE_KEY.CHWP },
  { name: '冷却泵', type: DEVICE_TYPE.LQB, key: DEVICE_KEY.CWP },
  { name: '阀门(冷冻)', type: DEVICE_TYPE.LDFM, key: DEVICE_KEY.CHWV },
  { name: '阀门(冷却)', type: DEVICE_TYPE.LQFM, key: DEVICE_KEY.CWV },
  { name: '冷却塔', type: DEVICE_TYPE.LQT, key: DEVICE_KEY.COT },
  { name: '离心机', type: DEVICE_TYPE.LXJ, key: DEVICE_KEY.CHL },
  { name: '分集水器', type: DEVICE_TYPE.JSQ },
  { name: '监测点', type: DEVICE_TYPE.DOT },
]

export const getPageOpts = (): {
  filters: Partial<import('./index').Filters>
  pipes: import('.').PipeType[]
  devices: import('.').DeviceType[]
  drag: import('.').Drag
  edit: import('.').Edit
} & SpliceFormItem<EFormItem, 'template' | 'animate' | 'lockeDev' | 'lockePipe' | 'display' | 'type'> => ( {
  filters: {},
  forms: {
    template: {
      label: '模板',
      type: 'select',
      clearable: true,
      items: []
    },
    animate: {
      label: '管路动画',
      type: 'switch',
      value: false,
      cols: 0.5
    },
    lockeDev: {
      label: '锁定设备',
      type: 'switch',
      value: false,
      cols: 0.5
    },
    lockePipe: {
      label: '锁定管路',
      type: 'switch',
      value: false,
      cols: 0.5
    },
    display: {
      label: '隐藏',
      type: 'switch',
      value: false,
      cols: 0.5
    },
    type: {
      label: '隐藏元素',
      type: 'checkbox',
      hide: true,
      custom: { label: 'name', value: 'type' },
      items: pipes.concat( devices as any )
    }
  },
  pipes,
  
  devices,

  drag: {
    width: 1200,
    height: 900,
    key: '',
    index: -1,
    zIndex: 0,
  },

  edit: {
    scale: 1,
    type: '',
    index: -1,
    devices: [],
    pipes: [],
    text: ''
  }
} )