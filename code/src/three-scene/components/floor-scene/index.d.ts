import type { Fog, Render, Camera, Controls } from '../../types/index'

export declare interface XYZ {
  x: number
  y: number
  z: number
}

export declare interface ModelItem {
  // 模型 唯一 key（场景元素按照 对应 key 加载）
  key: string
  name: string
  // 模型文件大小 （M 为单位）
  size: number
  // 模型加载地址
  url: string
  // 模型类型
  // base-基础底座， device-场景设备, font-字体, map-精灵, pipe-管路贴图
  // warning-警告标识, remote-远程状态， local-本地标识， disabled-禁用标识
  type?: 'base' | 'device' | 'font' | 'map' | 'pipe' | 'warning' | 'remote' | 'local' | 'disabled'
  // 贴图倍数
  map?: Pick<XYZ, 'x' | 'y'>
  // 精灵贴图
  repeat?: number[]
}

export declare interface Props {
  // 是否开发环境（开发环境下开启测试功能）
  devEnv?: boolean
  // 基础地址（加载资源地址）
  baseUrl: string
  // 背景色
  bgColor?: string | number
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

export declare interface ProgressListItem {
  name: string
  pro: number
}

export declare interface Progress {
  percentage: number
  show: boolean
  isEnd: boolean
  list: ProgressListItem[]
  total: number
  loaded: number
}
