
// props
export interface XYZ {
  x: number
  y: number
  z: number
}

export interface Font {
  size?: number
  color?: string
  position?: XYZ
  rotation?: XYZ
}

export interface Style {
  left?: string
  top?: string
  fontSize?: string
  color?: string
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
  bind?: ( string | string[] | string[][] )[]
  // 左
  left?: ( string | string[] | string[][] )[]
  // 右
  right?: ( string | string[] | string[][] )[]


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
  style: Style

  // 运行状态
  status?: number
  // 故障状态
  error?: number

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



// data
export interface Color {
  color: number
  main: number
  text?: number
}
export interface Colors {
  // 正常
  normal: Color
  // 运行
  runing: Color
  // 故障
  error: Color
}
export interface Extra {
  mixer: any
}

export interface ThreeModelItem {
  uuid: string
  visible: boolean
  _pos?: XYZ
  position: XYZ
  data?: Scene3DObjectItem
  extra?: Extra
  clear: Function
}

export interface ThreeConfig {
  colors: Colors
  isCruise: boolean
  modelSizeKB: number
  loadPart: object
  devices: ThreeModelItem[]
  timer?: NodeJS.Timeout
  sideToggleTimer?: NodeJS.Timeout
}

export interface WsConfig {
  timer?: NodeJS.Timeout
  shakeTime: number
  tsp: number
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
  setFromCamera: ((mouse: Vector, camera: any) => void)
  intersectObjects: ((objects: any[], recursive: boolean) => any[])
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


export interface Props {
  id?: string | number
  bgColor?: string | boolean
  skyCode?: SkyCode
  skyCodes?: SkyCode[]
  skyPath?: string
  hdr?: string
  grid?: boolean
  baseUrl: string
  
  // 模型
  models: ModelItem[]
  // 配置
  config?: Config
  // 对象列表（设备列表）
  objects: ObjectItem[]

  lightHelper?: boolean
  axesHelper?: boolean
  // 缩放
  scale?: number

  // 主体变色
  mainBodyChangeColor?: boolean
  // 主体网格名称
  mainBodyMeshName?: string[]

  // 初始化模型参数回调方法
  initModelItemCall?: (obj: ObjectItem) => object
  // 获取颜色回调
  getColorCall?: (obj: ObjectItem) => string | number

  // 动态模型类型
  animationModelType?: string[]
  // 管路材质名称（需要贴图的网格名称）
  pipeMeshName?: string[]
  // 管路模型类型
  pipeModelType?: string[]
  // 颜色材质名称（需要改变颜色的网格名称）
  colorMeshName?: string[]
  // 颜色状态类型（需要根据状态改变颜色的类型）
  colorModelType?: string[]
  // 绘制名称立体文字的类型
  textModelType?: string[]
  // 点位类型列表
  dotTypes?: string[]
  // 楼层模块类型
  floorModelType?: string[]

  // 巡航
  cruisePoints?: number[][]
  // 巡航分段（影响速度）
  cruiseSegment?: number
  // 巡航速度因子
  cruiseSpeed?: number
  // 管路
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

export declare const ThreeScene: import('vue').DefineComponent<{
  readonly id: import('vue').PropType<string | number>
  readonly skyCode: import('vue').PropType<'216' | '217' | '218' | '219' | '220' | '221' | '222' | '223' | '224' | '225'>
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
  readonly config: import('vue').PropType<config>
  readonly objects: {
    readonly type: import('vue').PropType<ObjectItem[]>
    required: true
  }
  readonly lightHelper: BooleanConstructor
  readonly axesHelper: BooleanConstructor
  readonly scale: NumberConstructor
  readonly mainBodyChangeColor: NumberConstructor
  readonly mainBodyMeshName: import('vue').PropType<string[]>
  readonly initModelItemCall: import('vue').PropType<((obj: ObjectItem) => object)>
  readonly getColorCall: import('vue').PropType<((obj: ThreeModelItem) => string | number)>
  readonly animationModelType: import('vue').PropType<string[]>
  readonly pipeMeshName: import('vue').PropType<string[]>
  readonly pipeModelType: import('vue').PropType<string[]>
  readonly colorMeshName: import('vue').PropType<string[]>
  readonly colorModelType: import('vue').PropType<string[]>
  readonly textModelType: import('vue').PropType<string[]>
  readonly dotTypes: import('vue').PropType<string[]>
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
}, {

  slots: Readonly<{
    [name: string]: import('vue').Slot | undefined
  }>
  floorAnimate: (index?: number) => void
}, {}, {}, {}, {}, {}, {
  loaded: () => void
  select: (object: ObjectItem) => void
  dblclick: (model: ThreeModelItem) => void
  clickDot: (dot: ObjectItem) => void
}, {}, {}, Readonly<Props> & {
  onLoaded?: (() => void) | undefined
  onSelect?: ((object: ObjectItem) => void) | undefined
  onDblclick?: ((model: ThreeModelItem) => void) | undefined
  onClickDot?: ((dot: ObjectItem) => void) | undefined
}>