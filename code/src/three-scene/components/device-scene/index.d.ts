import type { Fog, Render, Camera, Controls, Grid, Axes, Cruise, DirectionalLight } from '../../types/index'
import type { XYZ, ModelItem, ObjectItem } from '../../types/model'
import type { IndexDB } from '../../types/indexdb'
import type { Colors } from '../../types/color'

// 更新对象返回
export declare interface UpdateFnReturn {
  // 大于 0 则运行
  status: number
  // 大于 0 则故障
  error: number
  // 大于 0 则远程
  remote: number
  // 大于 0 则本地
  local: number
  // 大于 0 则禁用
  disabled: number
}

// 更新点位返回
export declare interface UpdateDotReturn {
  // 显示
  show: boolean
  // 值
  value?: number
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
  // 缩放
  scale?: number

  // 颜色
  colors?: import('../../types/utils').DeepPartial<Colors>

  // 数据库
  indexDB?: Partial<IndexDB>

  // 相机
  camera?: Partial<Camera>
  // 巡航
  cruise?: Partial<Cruise>
  // 雾化
  fog?: Partial<Fog>
  // 渲染
  render?: Partial<Render>
  // 控制器
  controls?: Partial<Controls>
  // 网格
  grid?: Partial<Grid>
  // 坐标轴
  axes?: Partial<Axes>
  // 平行光
  directionalLight?: Partial<DirectionalLight>

  // 模型(场景加载类型对应的模型)
  models: ModelItem[]

  // 对象列表（设备列表）
  objects: ObjectItem[]
  // DOT 类型 key 默认: 'DOT'
  dotKey?: string
  // dot 点位展示严格模式（设备运行时展示） 默认: true
  dotShowStrict?: boolean

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]

  // 获取颜色回调
  getColorCall?: (obj: ObjectItem) => string | number | undefined
  // 格式化数据方法
  formatObject: (list: ObjectItem[]) => ObjectItem[]
  // DOT 点位更新对象回调方法
  dotUpdateObjectCall?: (obj: ObjectItem, list: ThreeModelItem[]) => UpdateDotReturn
  // 更新对象回调方法
  updateObjectCall?: (obj: ObjectItem) => Partial<UpdateFnReturn>
  // 随机更新对象回调方法
  randomUpdateObjectCall?: (obj: ObjectItem) => Partial<UpdateFnReturn> | undefined

  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]
  // 动态模型类型(有动画)
  animationModelType?: string[]
  // 绘制名称立体文字的类型
  textModelType?: string[]
  // 锚点模型类型列表（精灵类型）该类型未绑定点击事件函数将作为 dialog 弹窗事件处理
  anchorType?: string[]

  // 主体变色
  mainBodyChangeColor?: boolean
  // 主体网格名称 默认: [ '主体' ]
  mainBodyMeshName?: string[]
}

export declare interface ExtendOptions {
  onDblclick: (e) => void
  onClickLeft: (e?) => void
  onClickRight: (e) => void
  animateCall: () => void
}
