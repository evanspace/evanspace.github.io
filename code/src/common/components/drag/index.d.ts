
import type { HtmlAttrStyle } from '../type'

export interface Props {
  bgSrc?: string
  bgStyle?: HtmlAttrStyle
  scale?: boolean
  move?: boolean
  max?: number
  min?: number
  zIndex?: number
  action?: boolean
  width?: number
  height?: number
  zoom?: number
}
// 'load', 'mousedown', 'mousemove', 'mouseup', 'mouseleave', 'mousewheel', 'pick-dot'

export declare const EDrag: import('vue').DefineComponent<{
  readonly bgSrc: StringConstructor
  readonly bgStyle: HtmlAttrStyle
  readonly scale: BooleanConstructor
  readonly move: BooleanConstructor
  readonly max: NumberConstructor
  readonly min: NumberConstructor
  readonly zIndex: NumberConstructor
  readonly action: BooleanConstructor
  readonly width: NumberConstructor
  readonly height: NumberConstructor
}, {

  slots: Readonly<{
    [name: string]: import('vue').Slot | undefined
  }>
}, {}, {}, {}, {}, {}, {
  load: (el: HTMLElement) => void
  mousedown: (e: MouseEvent) => void
  mousemove: (e: MouseEvent) => void
  mouseup: (e: MouseEvent) => void
  mouseleave: (e: MouseEvent) => void
  mousewheel: (e: WheelEvent) => void
  pickDot: (e: { x: number, y: number}) => void
  'update:zoom': (zoom: number) => void
}, {}, {}, Readonly<Props> & {
  onLoad?: ((el: HTMLElement) => void) | undefined
  onMousedown?: ((e: MouseEvent) => void) | undefined
  onMousemove?: ((e: MouseEvent) => void) | undefined
  onMouseup?: ((e: MouseEvent) => void) | undefined
  onMouseleave?: ((e: MouseEvent) => void) | undefined
  onMousewheel?: ((e: WheelEvent) => void) | undefined
  onPickDot?: ((e: { x: number, y: number}) => void) | undefined
  'onUpdate:zoom'?: ((zoom: number) => void) | undefined
}>