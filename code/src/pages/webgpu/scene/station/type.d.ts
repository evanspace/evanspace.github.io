/**
 * @description:
 * @file: type.d.ts
 * @author: Evan
 * @date: 2025.05.13 17:26:18
 * @week: 周二
 * @version: V
 * */

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

export declare interface ExtendOptions {
  /**
   * 地面网格名称
   */
  groundMeshName: string[]
  /**
   * 漫游坐标
   */
  roamPoints: number[][]
  /**
   * 双击模型名称
   */
  dblclickModelName: string[]
  /**
   * 双击事件
   */
  onDblclick: (e) => void
  /**
   * 鼠标左键
   */
  onClickLeft: (object?, intersct?) => void
  /**
   * 点击地面
   */
  onClickGround: (object?, intersct?) => void
  /**
   * 鼠标右键
   */
  onClickRight: (e) => void
  /**
   * 动画回调
   */
  animateCall: () => void
  /**
   * 锚点悬浮
   */
  onHoverCall: (
    intersct: AnyObject,
    style: {
      left: number
      top: number
    }
  ) => void
}
