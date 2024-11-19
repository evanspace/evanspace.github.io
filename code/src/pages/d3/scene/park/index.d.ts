import type { Colors, ColorObject } from 'three-scene/types/color'

export declare interface ExtendOptions {
  onDblclick: (e) => void
  onClickLeft: (e?) => void
  onClickRight: (e) => void
  animateCall: () => void
}

// 改变材质配置
export declare interface ChangeMaterialOpts {
  // 类型、
  type: string
  // 模型、
  el: any
  // 颜色对象、
  colorObj: ColorObject
  // 颜色、
  color: Color
  // 动画暂停状态、
  paused: boolean
  // 故障状态
  error: boolean
  // 远程状态
  remote: boolean
  // 本地状态
  local: boolean
  // 本地状态
  disabled: boolean
}
