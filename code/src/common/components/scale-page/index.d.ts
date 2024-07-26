export interface MonthDateType {
  year: number
  month: number
}

export interface RangeType {
  start: MonthDateType
  end: MonthDateType
}

export interface ScreenOpts {
  scale: number
  minWidth: number
  maxHeight?: number
}

export interface Props {
  width?: number
  scale?: number
}

export declare const EScalePage: import('vue').DefineComponent<{
  readonly width: NumberConstructor
  readonly scale: NumberConstructor
}, {

  slots: Readonly<{
    [name: string]: import('vue').Slot | undefined
  }>
  resize: () => void
}, {}, {}, {}, {}, {}, {
  'update:scale': (val: number) => void
}, {}, {}, Readonly<Props> & {
  'onUpdate:scale'?: ((val: number) => void) | undefined
}>