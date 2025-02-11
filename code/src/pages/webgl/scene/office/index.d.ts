import type { XYZ } from 'three-scene/types/model'
import type { Colors, ColorObject } from 'three-scene/types/color'

export declare interface Config {
  // 场景相机位置
  to: XYZ
  // 场景中心点/相机聚焦位置
  target: XYZ
  // 返回
  back: Function
  // 加载
  load: Function
}

interface Sky {
  day: string
  evening: string
  night: string
}

export declare interface ExtendOptions {
  groundMeshName: string[]
  roamPoints: number[][]
  canvas: HTMLCanvasElement
  sky: Sky
  onDblclick: (e) => void
  onClickLeft: (object?, intersct?) => void
  onClickGround: (object?, intersct?) => void
  onClickRight: (e) => void
  animateCall: () => void
  onHoverAnchor: (object, style) => void
}
