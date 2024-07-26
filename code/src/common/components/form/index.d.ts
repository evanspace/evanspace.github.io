

import type { EFormItem, EFormSize } from '../type'
export interface Props {
  forms?:  { [key: string]: EFormItem }
  size?: EFormSize
  // 列数 无-0
  cols?: number
}

export declare const EForm: import('vue').DefineComponent<{
  readonly forms: import('vue').PropType<{ [key: string]: EFormItem }>
  readonly size: import('vue').PropType< '' | 'default' | 'small' | 'large'>
  readonly cols: NumberConstructor

  readonly labelPosition: import('vue').PropType<'top' | 'right' | 'left'>
  readonly requireAsteriskPosition: import('vue').PropType<'right' | 'left'>
  readonly labelWidth: import('vue').PropType<string | number>
  readonly labelSuffix: StringConstructor
  readonly inline: BooleanConstructor
  readonly inlineMessage: BooleanConstructor
  readonly statusIcon: BooleanConstructor
  readonly showMessage: BooleanConstructor
  readonly validateOnRuleChange: BooleanConstructor
  readonly hideRequiredAsterisk: BooleanConstructor
  readonly scrollToError: BooleanConstructor
  readonly scrollIntoViewOptions: import('vue').PropType<object | boolean>
  readonly disabled: BooleanConstructor
}, {

  slots: Readonly<{
    [name: string]: import('vue').Slot | undefined
  }>
  validate: () => Promise<object>
  validateField: (key: string, callback: Function) => void
  reset: (callback: Function) => void
  getModel: () => object,
  getRules: () => object,
}, {}, {}, {}, {}, {}, {
  loading: (el: boolean) => void
  'update:forms': (e: object) => void
  change: (...args: any[]) => void
}, {}, {}, Readonly<Props & {
  readonly labelPosition?: 'top' | 'right' | 'left'
  readonly requireAsteriskPosition?: 'right' | 'left'
  readonly labelWidth?: string | number
  readonly labelSuffix?: string
  readonly inline?: boolean
  readonly inlineMessage?: boolean
  readonly statusIcon?: boolean
  readonly showMessage?: boolean
  readonly validateOnRuleChange?: boolean
  readonly hideRequiredAsterisk?: boolean
  readonly scrollToError?: boolean
  readonly scrollIntoViewOptions?: object | boolean
  readonly disabled?: boolean
}> & {
  onLoading?: ((el: boolean) => void) | undefined
  'onUpdate:forms'?: ((e: object) => void) | undefined
  onChange?: ((...args: any[]) => void) | undefined
}>