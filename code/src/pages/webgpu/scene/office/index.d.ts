import type { XYZ } from 'three-scene/types/model'

export interface Sky {
  /**
   * 白天
   */
  day: string
  /**
   * 傍晚
   */
  evening: string
  /**
   * 夜间
   */
  night: string
}

export interface Config {
  // 场景相机位置
  to: XYZ
  // 场景中心点/相机聚焦位置
  target: XYZ
}

export interface ExtendOptions {
  roamPoints: number[][]
  canvas: HTMLCanvasElement
  onDblclick: (e) => void
  onClickLeft: (object?, intersct?) => void
  onClickGround: (object?, intersct?) => void
  onClickRight: (e) => void
  animateCall: () => void
  // 悬浮回调
  onHoverCall: (object, style) => void
}
