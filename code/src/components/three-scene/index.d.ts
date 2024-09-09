// props
export interface XYZ {
  x: number
  y: number
  z: number
}

export interface Font {
  size?: number | string
  color?: string
  position?: XYZ
  rotation?: XYZ
}

export interface StylePosition {
  left: number
  top: number
}

export interface ObjectItem {
  name: string
  type: string
  show?: boolean
  value?: number
  unit?: string
  code?: string
  deviceNo?: string
  deviceCode?: string

  position?: XYZ
  rotation?: XYZ
  scale?: XYZ

  // 管路
  // 贴图重复次数[x,y0]
  map?: number[]
  // 绑定设备（管路关联设备。设备动则动,只要满足一个设备运行则执行）
  // [ [ 'LDB_1-1', 'FM_1-1' ], [ 'LDB_1-2', 'FM_1-1' ] ]
  bind?: (string | string[] | string[][])[]
  // 左
  left?: (string | string[] | string[][])[]
  // 右
  right?: (string | string[] | string[][])[]

  // 字体
  font?: Font
  // 相机动画位置
  to?: XYZ
  // 场景中心点
  target?: XYZ
  url?: string
  // 标记
  mark?: string
  // 跟随标记
  followMark?: string

  id?: number

  // 运行状态
  status?: number
  // 故障状态
  error?: number
  // 远程状态
  remote?: number
  // 本地状态
  local?: number
  // 禁用状态
  disabled?: number

  // 双击事件
  onDblclick?: Function
  // 点击事件
  onClick?: Function
}

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

export type SkyCode = '216' | '217' | '218' | '219' | '220' | '221' | '222' | '223' | '224' | '225'

export interface ModelItem {
  key: string
  name: string
  size: number
  url?: string
  // 贴图倍数
  range?: Pick<XYZ, 'x' | 'y'>
  // 精灵贴图
  map?: string
  // 字体
  font?: string
  // 警告标识
  warning?: string
  // 远程状态标识
  remote?: string
  // 本地状态标识
  local?: string
  // 禁用标识
  disabled?: string
  // 管路贴图 管路需要贴图时，这条数据需要排在管路之前
  pipeMap?: string
  // 管路贴图 重复数量
  repeat?: number[]
}

// indexDb 数据库查询
export interface DbGtKeyResult {
  path: string
  data: ArrayBuffer | string
}

export type Color = number | string | (number | string)[]

// data
export interface ColorObject {
  // 默认颜色
  color: Color
  // 主体颜色
  main: Color
  // 文字颜色
  text?: Color
  // 其他
  [key: string]: Color
}
export interface Colors {
  // 正常
  normal: ColorObject
  // 运行
  runing: ColorObject
  // 故障
  error: ColorObject
}
export interface Extra {
  mixer: any
}

export interface ThreeModelItem {
  uuid: string
  visible: boolean
  _pos?: XYZ
  position: XYZ
  data?: ObjectItem
  extra?: Extra
  clear: Function
  element?: HTMLElement
}

export interface ThreeConfig {
  colors: Colors
  isCruise: boolean
  modelSizeKB: number
  loadPart: object
  devices: ThreeModelItem[]
  timer?: NodeJS.Timeout
}

export interface FloorObj {
  list: ThreeModelItem[]
}

export interface ProgressListItem {
  name: string
  pro: number
}
export interface Progress {
  percentage: number
  show: boolean
  isEnd: boolean
  list: ProgressListItem[]
  total: number
  loaded: number
}

export interface Dialog {
  show: boolean
  style: {
    left: string
    top: string
  }
  select: ThreeModelItem[]
  title: string
  data: Partial<ObjectItem>
  pos: {
    left?: number
    top?: number
  }
}

// three
export interface Clock {
  autoStart: boolean
  elapsedTime: number
  oldtime: number
  running: boolean
  startTime: number
  getDelta: () => number
}

export interface Vector {
  x: number
  y: number
}

export interface Raycaster {
  camera: any
  far: number
  layers: {
    mask: number
  }[]
  near: number
  ray: object
  setFromCamera: (mouse: Vector, camera: any) => void
  intersectObjects: (objects: any[], recursive: boolean) => any[]
}

export interface ControlType {
  // 最大相机移动距离(景深相机)
  minDistance?: number
  // 最小相机移动距离(景深相机)
  maxDistance?: number
  // 最大仰角
  maxPolarAngle?: number
  // 惯性滑动，
  enableDamping?: boolean
  // 滑动大小默认0.05
  dampingFactor?: number
  // 垂直平移
  screenSpacePanning?: boolean
}

// 改变材质配置
export interface ChangeMaterialOpts {
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
  remote?: boolean
  // 本地状态
  local?: boolean
  // 本地状态
  disabled?: boolean
}

export interface UpdateFnReturn {
  // 大于 0 则运行
  status?: number
  // 大于 0 则故障
  error?: number
  // 大于 0 则远程
  remote?: number
  // 大于 0 则本地
  local?: number
  // 大于 0 则禁用
  disabled?: number
}

export interface UpdateDotReturn {
  // 显示
  show: boolean
  // 值
  value?: number
}

export interface Props {
  // 是否开发环境（开发环境下开启测试功能）
  devEnv?: boolean

  id?: string | number
  // 背景色 默认: void 0
  bgColor?: string | boolean
  // 天空背景 默认： 217
  skyCode?: SkyCode
  // 天空背景 code 列表 默认: [ '216', '217', '218', '219', '220', '221', '222', '223', '224', '225' ]
  skyCodes?: SkyCode[]
  // 天空背景资源路径 默认: '/img/sky'
  skyPath?: string

  // hdr 环境
  hdr?: string
  grid?: boolean
  baseUrl: string

  // 模型
  models: ModelItem[]
  // 配置
  config?: Config
  // 对象列表（设备列表）
  objects: ObjectItem[]
  // DOT 类型 key 默认: 'DOT'
  dotKey?: string
  // dot 点位展示严格模式（设备运行时展示） 默认: true
  dotShowStrict?: boolean

  // 加载缓存 默认: true
  loadCache?: boolean

  lightHelper?: boolean
  axesHelper?: boolean
  // 缩放 默认: 1
  scale?: number

  // indexdb
  // 数据库名称
  dbName?: string
  // 表名称
  tbName?: string
  // 版本号
  dbVersion?: number

  // 主体变色
  mainBodyChangeColor?: boolean
  // 主体网格名称 默认: [ '主体' ]
  mainBodyMeshName?: string[]

  // 获取颜色回调
  getColorCall?: (obj: ObjectItem) => string | number | undefined

  // 格式化数据方法
  formatObject: (list: ObjectItem[]) => ObjectItem[]
  // DOT 点位更新对象回调方法
  dotUpdateObjectCall?: (obj: ObjectItem, list: ThreeModelItem[]) => UpdateDotReturn
  // 更新对象回调方法
  updateObjectCall?: (obj: ObjectItem) => UpdateFnReturn
  // 随机更新对象回调方法
  randomUpdateObjectCall?: (obj: ObjectItem) => UpdateFnReturn | undefined

  // 动态模型类型
  animationModelType?: string[]
  // 管路材质名称（需要贴图的网格名称）
  pipeMeshName?: string[]
  // 管路模型类型
  pipeModelType?: string[]
  // 状态材质名称（需要改变隐藏/展示的网格名称）
  statusMeshName?: string[]
  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]
  // 颜色状态类型（需要根据状态改变颜色的类型） 默认： [ 'FM', 'XFM' ]
  colorModelType?: string[]
  // 绘制名称立体文字的类型
  textModelType?: string[]
  // 锚点模型类型列表（精灵类型）该类型未绑定点击事件函数将作为 dialog 弹窗事件处理
  anchorType?: string[]
  // 楼层模块类型
  floorModelType?: string[]

  // 巡航
  cruisePoints?: number[][]
  // 巡航分段（影响速度）
  cruiseSegment?: number
  // 巡航速度因子
  cruiseSpeed?: number
  // 巡航管路
  cruiseTubeShow?: boolean
  // 路径背景
  pathBg?: string
  // 路径宽度
  pathWidth?: number
  // 路径贴图
  pathMap?: number[]
  // 路径曲线张力
  pathTension?: number
  // 路径贴图动态速度
  pathMapSpeed?: number
  // 续航偏差值（相对路径）
  cruisePathOffset?: number
}

export declare const ThreeScene: import('vue').DefineComponent<
  {
    readonly devEnv: BooleanConstructor
    readonly id: import('vue').PropType<string | number>
    readonly skyCode: import('vue').PropType<
      '216' | '217' | '218' | '219' | '220' | '221' | '222' | '223' | '224' | '225'
    >
    readonly skyCodes: import('vue').PropType<SkyCode[]>
    readonly skyPath: StringConstructor
    readonly bgColor: import('vue').PropType<string | boolean>
    readonly hdr: StringConstructor
    readonly grid: BooleanConstructor
    readonly baseUrl: {
      readonly type: StringConstructor
      required: true
    }
    readonly models: {
      readonly type: import('vue').PropType<ModelItem[]>
      required: true
    }

    readonly dotKey: StringConstructor
    readonly dotShowStrict: BooleanConstructor

    readonly config: import('vue').PropType<config>
    readonly objects: {
      readonly type: import('vue').PropType<ObjectItem[]>
      required: true
    }
    readonly loadCache: BooleanConstructor
    readonly lightHelper: BooleanConstructor
    readonly axesHelper: BooleanConstructor
    readonly scale: NumberConstructor

    readonly dbName: StringConstructor
    readonly tbName: StringConstructor
    readonly dbVersion: NumberConstructor

    readonly mainBodyChangeColor: NumberConstructor
    readonly mainBodyMeshName: import('vue').PropType<string[]>

    readonly getColorCall: import('vue').PropType<(obj: ThreeModelItem) => string | number>

    readonly formatObject: {
      readonly type: import('vue').PropType<(list: ObjectItem[]) => ObjectItem[]>
      required: true
    }
    readonly dotUpdateObjectCall: import('vue').PropType<
      (obj: ObjectItem, list: ThreeModelItem[]) => UpdateDotReturn
    >
    readonly updateObjectCall: {
      readonly type: import('vue').PropType<(obj: ObjectItem) => UpdateFnReturn>
      required: true
    }
    readonly randomUpdateObjectCall: import('vue').PropType<
      (obj: ObjectItem) => UpdateFnReturn | undefined
    >

    readonly animationModelType: import('vue').PropType<string[]>
    readonly pipeMeshName: import('vue').PropType<string[]>
    readonly pipeModelType: import('vue').PropType<string[]>
    readonly statusMeshName: import('vue').PropType<string[]>
    readonly colorMeshName: import('vue').PropType<string[]>
    readonly colorModelType: import('vue').PropType<string[]>
    readonly textModelType: import('vue').PropType<string[]>
    readonly anchorType: import('vue').PropType<string[]>
    readonly floorModelType: import('vue').PropType<string[]>
    readonly cruisePoints: import('vue').PropType<number[][]>
    readonly cruiseSegment: NumberConstructor
    readonly cruiseSpeed: NumberConstructor
    readonly cruiseTubeShow: BooleanConstructor
    readonly pathBg: StringConstructor
    readonly pathWidth: NumberConstructor
    readonly pathMap: import('vue').PropType<number[][]>
    readonly pathTension: NumberConstructor
    readonly pathMapSpeed: NumberConstructor
    readonly cruisePathOffset: NumberConstructor
  },
  {
    slots: Readonly<{
      [name: string]: import('vue').Slot | undefined
    }>
    floorAnimate: (index?: number) => void
    setControls: (opts: ControlType) => void
    resize: () => void
  },
  {},
  {},
  {},
  {},
  {},
  {
    loaded: () => void
    update: (list: ObjectItem[], isRando?: boolean) => void
    select: (object: ObjectItem) => void
    dblclick: (model: ThreeModelItem) => void
    clickDot: (dot: ObjectItem) => void
    clickDialogDot: (dot: ObjectItem, pos: StylePosition) => void
  },
  {},
  {},
  Readonly<Props> & {
    onLoaded?: (() => void) | undefined
    onUpdate?: ((list: ObjectItem[], isRando?: boolean) => void) | undefined
    onSelect?: ((object: ObjectItem) => void) | undefined
    onDblclick?: ((model: ThreeModelItem) => void) | undefined
    onClickDot?: ((dot: ObjectItem) => void) | undefined
    onClickDialogDot?: ((dot: ObjectItem, pos: StylePosition) => void) | undefined
  }
>
