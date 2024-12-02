import type { XYZ } from '.three-scene/types/model'
import type { Colors, ColorObject } from 'three-scene/types/color'

export declare interface Config {
  // 场景相机位置
  to: XYZ
  // 场景中心点/相机聚焦位置
  target: XYZ
  // 楼层展开模式
  // UD -> up-down | BA -> before-after
  floorExpandMode: 'UD' | 'BA'
  // 楼层展开间距
  floorExpandMargin: number
  // 楼层展开后隐藏其他模型
  floorExpandHiddenOther: boolean
  // 楼层展开的 索引(楼层类型列表索引)
  floorExpandIndex: number
  // 楼层展开是否改变视角
  floorExpandChangeViewAngle: boolean
  // 返回
  back: Function
  // 加载
  load: Function
}

export declare interface ExtendOptions {
  groundMeshName: string[]
  onDblclick: (e) => void
  onClickLeft: (object?, intersct?) => void
  onClickGround: (object?, intersct?) => void
  onClickRight: (e) => void
  animateCall: () => void
  onHoverAnchor: (object, style) => void
}
