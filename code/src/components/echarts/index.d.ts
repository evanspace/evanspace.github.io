
export type Theme = 'light' | 'dark'

export interface Props {
	// 高度
	height?: string | number
	// 宽度
	width?: string | number
  // z-index
  zIndex?: number
  // 主题 'light' 和 'dark'。
  theme?: Theme
  // 延迟
  delay?: number
  // 自适应
  autoSize?: boolean
}

declare type RegisterMapParams = Parameters<typeof import('echarts/types/dist/echarts').registerMap>

export declare const EEcharts: import('vue').DefineComponent<{
  readonly height: import('vue').PropType<string | number>
  readonly width: import('vue').PropType<string | number>
  readonly zIndex: NumberConstructor
  readonly theme: import('vue').PropType<'light' | 'dark'>
  readonly delay: NumberConstructor
  readonly autoSize: BooleanConstructor
}, {

  slots: Readonly<{
    [name: string]: import('vue').Slot | undefined
  }>
  resize: () => void
	loading: (opts: object) => void
	hideLoading: () => void
	registerMap: (...args: RegisterMapParams) => void
	setOption: (options: import('echarts/types/dist/echarts').EChartsOption) => void
	update: (options: import('echarts/types/dist/echarts').EChartsOption) => void
	dispatchAction: (options: import('echarts/types/dist/echarts').Payload) => void
	getOption: () => import('echarts/types/dist/echarts').EChartsOption | null
	clear: () => void
}, {}, {}, {}, {}, {}, {
  clickDom: () => void
  click: (options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void
  dblclick: (options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void
  mousedown: (options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void
  mousemove: (options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void
  mouseup: (options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void
  mouseover: (options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void
  mouseout: (options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void
  globalout: (options: { event: { event: MouseEvent, type: string }, type: string}) => void
  contextmenu: (options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void
}, {}, {},  Readonly<Props> & {
  onClick?: ((options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void) | undefined
  onDblclick?: ((options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void) | undefined
  onMousedown?: ((options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void) | undefined
  onMousemove?: ((options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void) | undefined
  onMouseup?: ((options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void) | undefined
  onMouseover?: ((options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void) | undefined
  onMouseout?: ((options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void) | undefined
  onGlobalout?: ((options: { event: { event: MouseEvent, type: string }, type: string}) => void) | undefined
  onContextmenu?: ((options: import('echarts/types/dist/echarts').DefaultLabelFormatterCallbackParams) => void) | undefined
}>