

import type { EFormIemType, EFormItemSubType, EFormItemCustom } from '../type'
export interface Props {
  // 过滤 attrs
  value?: any
  // value
  modelValue?: string | any[] | number | boolean | Object | Date
  // 类型
  type?: EFormIemType
  // 二级类型（日期组件）
  subType?: EFormItemSubType
  // select 列表
  items?: any[]
  // 组
  isGroup?: boolean
  // 自定义展示字段
  custom?: EFormItemCustom
  // props
  props?: EFormItemCustom
  // 预定义颜色列表
  predefine?: string[]
  // 过滤 label
  label?: import('vue').StyleValue | string
}

export declare const EFormFilter: import('vue').DefineComponent<{
  readonly value: import('vue').PropType<string | any[] | number | boolean | Object | Date>
  readonly modelValue: import('vue').PropType<string | any[] | number | boolean | Object | Date>
  // readonly type: import('vue').PropType<'text' | 'textarea' | 'number' | 'password' | 'select' | 'cascader' | 'checkbox' | 'radio' | 'color' | 'rate' | 'switch' | 'slider' | 'date' | 'file' | 'editor' | 'tree' | 'time'>
  readonly type: import('vue').PropType<EFormIemType>
  // readonly subType: import('vue').PropType<'date' | 'year' | 'month' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange' | 'yearrange' | 'picker'>
  readonly subType: import('vue').PropType<EFormItemSubType>
  readonly items: import('vue').PropType<any[]>
  readonly isGroup: BooleanConstructor
  readonly custom: import('vue').PropType<EFormItemCustom>
  readonly props: import('vue').PropType<EFormItemCustom>
  readonly predefine: import('vue').PropType<string[]>
}, {

  slots: Readonly<{
    [name: string]: import('vue').Slot | undefined
  }>
}, {}, {}, {}, {}, {}, {
  loading: (el: boolean) => void
  'update:modelValue': (val: any) => void
  change: (...args: any[]) => void
}, {}, {}, Readonly<Props> & {
  onLoading?: ((el: boolean) => void) | undefined
  'onUpdate:modelValue'?: ((val: any) => void) | undefined
  onChange?: ((...args: any[]) => void) | undefined
}>