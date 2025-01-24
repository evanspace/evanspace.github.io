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

export declare interface ExtendOptions {
  // 地面网格名称
  groundMeshName: string[]
  // 漫游坐标
  roamPoints: number[][]
  // 双击模型名称
  dblclickModelName: string[]
  onDblclick: (e) => void
  onClickLeft: (object?, intersct?) => void
  onClickGround: (object?, intersct?) => void
  onClickRight: (e) => void
  animateCall: () => void
  onHoverAnchor: (object, style) => void
}
