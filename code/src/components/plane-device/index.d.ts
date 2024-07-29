

export interface DeviceType {
  name: string
  type: string
  key?: string
  status?: number
  error?: number
}

export interface Device extends DeviceType {
  rotate?: number
  style: Style
  deviceCode?: string
  value?: number
  unit?: string
  mx?: number
  my?: number
  color?: string
  zIndex?: number
}


export interface Prop {
  list: Device[]
  active?: number
  type?: string
  locked?: boolean
  display?: boolean
  showName?: boolean
  hideType?: string[]
}


export declare const PlaneDevice: import('vue').DefineComponent<{
  readonly list: {
    readonly type: import('vue').PropType<Device[]>
    required: true
  }
  readonly active: NumberConstructor
  readonly type: StringConstructor
  readonly locked: BooleanConstructor
  readonly display: BooleanConstructor
  readonly showName: BooleanConstructor
  readonly hideType: import('vue').PropType<string[]>
}, {

  slots: Readonly<{
    [name: string]: import('vue').Slot | undefined
  }>
  floorAnimate: (index?: number) => void
}, {}, {}, {}, {}, {}, {
  click: (index: number, item: Device, type?: string) => void
  mousedown: (e: MouseEvent, index: number, item: Device, type?: string) => void
  mouseup: (e: MouseEvent) => void
}, {}, {}, Readonly<Props> & {
  onClick?: ((index: number, item: Device, type?: string) => void) | undefined
  onMousedown?: ((e: MouseEvent, index: number, item: Device, type?: string) => void) | undefined
  onMouseup?: ((e: MouseEvent) => void) | undefined
}>