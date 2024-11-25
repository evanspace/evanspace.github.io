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
