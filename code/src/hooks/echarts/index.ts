// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口
import * as ECHARTS from 'echarts/core'
import type { ComposeOption, EChartsInitOpts } from 'echarts/core'

// 引入柱状图表，图表后缀都为 Chart
import {
  BarChart,
  ScatterChart,
  MapChart,
  LineChart,
  LinesChart,
  EffectScatterChart
} from 'echarts/charts'
// 系列类型的定义后缀都为 SeriesOption
import type {
  BarSeriesOption,
  ScatterSeriesOption,
  MapSeriesOption,
  LineSeriesOption,
  LinesSeriesOption,
  EffectScatterSeriesOption
} from 'echarts/charts'

// 引入组件 后缀名都为 Component
import {
  // 标题
  TitleComponent,
  // 提示框
  TooltipComponent,
  // 图列组件
  LegendComponent,
  // 直角坐标系
  GridComponent,
  // 数据集
  DatasetComponent,
  // 内置数据转换器
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  // 视觉映射
  VisualMapComponent,
  // 地理坐标
  GeoComponent
} from 'echarts/components'
// 组件类型的定义后缀都为 ComponentOption
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  ToolboxComponentOption,
  GridComponentOption,
  DatasetComponentOption,
  VisualMapComponentOption,
  GeoComponentOption
} from 'echarts/components'

// 标签自动布局、全局过度动画等特效
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 canvas 渲染器，注意 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

export const echarts = ECHARTS

// 注册必须的组件
echarts.use([
  BarChart,
  ScatterChart,
  MapChart,
  LineChart,
  LinesChart,
  EffectScatterChart,

  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  VisualMapComponent,
  GeoComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

// 自定义主题
~(function () {
  const list = import.meta.glob(`./theme/*.ts`, {
    eager: true, // 非异步
    import: 'default'
  })
  Object.entries(list).forEach(arr => {
    const name = arr[0].replace('./theme/', '').split('.')[0]
    const options = arr[1]
    echarts.registerTheme(name, options as any)
  })
})()

// 主题
type Theme = 'wonderland' | 'chalk' | 'westeros' | 'dark' | 'essos' | 'shine'

// 地图注册
export type RegisterMapParams = Parameters<typeof echarts.registerMap>

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOptions = ComposeOption<
  | MapSeriesOption
  | LineSeriesOption
  | LinesSeriesOption
  | EffectScatterSeriesOption
  | BarSeriesOption
  | ScatterSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | ToolboxComponentOption
  | GridComponentOption
  | DatasetComponentOption
  | VisualMapComponentOption
  | GeoComponentOption
>

// 判断 dom
const isDOM = (obj: any): boolean => {
  return (
    obj &&
    (typeof HTMLElement === 'object'
      ? obj instanceof HTMLElement
      : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string')
  )
}

export class Echarts {
  container: HTMLElement
  Echarts: ReturnType<typeof echarts.init>
  constructor(
    selector: string | HTMLElement,
    options: ECOptions,
    theme?: Theme | object,
    initOpts?: EChartsInitOpts
  ) {
    // 判断选择器
    if (isDOM(selector)) {
      this.container = selector as HTMLElement
    } else {
      this.container = document.querySelector(selector as string) as HTMLElement
    }
    this.Echarts = echarts.init(this.container, theme, initOpts)

    options && this.Echarts.setOption(options)
  }

  // 获取配置
  getOption() {
    return this.Echarts.getOption()
  }

  on(eventName, query, handler?) {
    this.Echarts.on(eventName, query, handler)
  }

  get domElement() {
    return this.container.getElementsByTagName('canvas')[0] as HTMLCanvasElement
  }

  resize() {
    this.Echarts.resize()
  }

  // 销毁
  dispose() {
    this.Echarts.dispose()
  }
}
