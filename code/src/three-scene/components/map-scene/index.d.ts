import type { Fog, Render, Camera, Controls, Grid, Axes, Cruise, DirectionalLight } from '../../types/index'

export declare interface Props {
  // 是否开发环境（开发环境下开启测试功能）
  devEnv?: boolean
  // 基础地址（加载资源地址）
  baseUrl: string
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
}
