import type { XYZ } from 'three-scene/types/model'

export interface Sky {
  /**
   * 白天
   */
  day: string
  /**
   * 傍晚
   */
  evening: string
  /**
   * 夜间
   */
  night: string
}

export interface Config {
  /**
   * 场景相机位置
   */
  to: XYZ
  /**
   * 场景中心点/相机聚焦位置
   */
  target: XYZ
}

export interface UpdateDotItem {
  /**
   * 编码
   */
  code: string
  /**
   * 温度
   */
  temperature: number
  /**
   * 湿度
   */
  humidity: number
  /**
   * 二氧化碳浓度
   */
  co2: number
}

export interface ExtendOptions {
  /**
   * 漫游点位
   */
  roamPoints: number[][]
  /**
   * 画布-大屏材质
   */
  canvas: HTMLCanvasElement

  onDblclick: (e) => void
  onClickLeft: (object?, intersct?) => void
  /**
   * 点击地面
   * @param object 模型组
   * @param intersct 检测目标
   * @returns
   */
  onClickGround: (object?, intersct?) => void
  onClickRight: (e) => void
  /**
   * 悬浮回调
   * @param object 目标对象
   * @param style 计算平面样式
   * @returns
   */
  onHoverCall: (object, style) => void
  /**
   * 空组点击
   * @param data 空组绑定的数据
   * @returns
   */
  emptyGroupClick: (data) => void
}
