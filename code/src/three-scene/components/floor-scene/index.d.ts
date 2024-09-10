import type { Fog, Render, Camera, Controls } from '../../types/index'
import type { XYZ, ModelItem, ObjectItem } from '../../types/model'

export interface Config {
  // 场景相机位置
  to?: XYZ
  // 场景中心点/相机聚焦位置
  target?: XYZ
  // 楼层展开模式
  // UD -> up-down | BA -> before-after
  floorExpandMode?: 'UD' | 'BA'
  // 楼层展开间距
  floorExpandMargin?: number
  // 楼层展开后隐藏其他模型
  floorExpandHiddenOther?: boolean
  // 楼层展开的 索引(楼层类型列表索引)
  floorExpandIndex?: number
  // 楼层展开是否改变视角
  floorExpandChangeViewAngle?: boolean
  // 返回
  back?: Function
  // 加载
  load?: Function
}

export declare interface Props {
  // 是否开发环境（开发环境下开启测试功能）
  devEnv?: boolean
  // 基础地址（加载资源地址）
  baseUrl: string
  // draco 解压文件地址
  dracoUrl?: string
  // 背景色
  bgColor?: string | number
  // 天空背景
  skyCode?: string
  // 背景图片
  bgUrl?: string | string[]

  // 环境
  env?: string

  // 相机
  camera?: Partial<Camera>
  // 雾化
  fog?: Partial<Fog>
  // 渲染
  render?: Partial<Render>
  // 控制器
  controls?: Partial<Controls>

  // 模型(场景加载类型对应的模型)
  models: ModelItem[]
  // 配置
  config?: Config
  // 对象列表（设备列表）
  objects: ObjectItem[]
  // DOT 类型 key 默认: 'DOT'
  dotKey?: string

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]

  // 格式化数据方法
  formatObject: (list: ObjectItem[]) => ObjectItem[]

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]
  // 动态模型类型(有动画)
  animationModelType?: string[]
  // 楼层模块类型
  floorModelType?: string[]
  // 绘制名称立体文字的类型
  textModelType?: string[]
  // 锚点模型类型列表（精灵类型）该类型未绑定点击事件函数将作为 dialog 弹窗事件处理
  anchorType?: string[]
}

export declare interface ExtendOptions {
  onDblclick: (e) => void
  onClickLeft: (e) => void
  onClickRight: (e) => void
}
