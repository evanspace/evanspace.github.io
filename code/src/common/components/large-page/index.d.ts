// 名称 4 字限制
interface Menu {
  name: string
}
export interface Props {
  scale?: number
  width?: number
  height?: number
  zIndex?: number
  menus?: Menu[]
}

export declare const ELargePage: import('vue').DefineComponent<{
  readonly scale: NumberConstructor
  readonly width: NumberConstructor
  readonly height: NumberConstructor
  readonly zIndex: NumberConstructor
  readonly menus: import('vue').Prop<Menu[]>
}, {

  slots: Readonly<{
    [name: string]: import('vue').Slot | undefined
  }>
}, {}, {}, {}, {}, {}, {
  'update:scale': (val: number) => void
  'menu-click': ( item: Menu ) => void
}, {}, {}, Readonly<Props> & {
  'onUpdate:scale'?: ((val: number) => void) | undefined
  onMenuClick?: (( item: Menu ) => void) | undefined
}>