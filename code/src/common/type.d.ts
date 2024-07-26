

export type HtmlAttrStyle = import('element-plus/es/utils').EpPropFinalized<(new (...args: any[]) => import('vue').StyleValue & {}) | (() => import('vue').StyleValue) | ((new (...args: any[]) => import('vue').StyleValue & {}) | (() => import('vue').StyleValue))[], unknown, unknown, '', boolean>


// 表单
export type EFormIemType = 'text' | 'textarea' | 'number' | 'password' | 'select' | 'cascader' | 'checkbox' | 'radio' | 'color' | 'rate' | 'switch' | 'slider' | 'date' | 'file' | 'editor' | 'tree' | 'time' | 'json'
export type EFormItemSubType =  'date' | 'year' | 'month' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange' | 'yearrange' | 'picker' | 'image'

export type EFormSize = '' | 'large' | 'default' | 'small'

export type Placement = 'bottom-start' | 'bottom' | 'auto' | 'auto-start' | 'auto-end' | 'top' | 'right' | 'left' | 'top-start' | 'top-end' | 'bottom-end' | 'right-start' | 'right-end' | 'left-start' | 'left-end'

export type JsonModeType = '' | 'tree' | 'code' | 'form' | 'text' | 'view'

import type Node, { Resolve } from 'element-plus/es/components/cascader-panel/src/node'
export interface EFormItemCustom {
  label?: string
  value?: string
  append?: string
  showMore?: boolean
  type?: string
  grouplabel?: string
  children?: string
  // 指定选项的叶子节点的标志位为选项对象的某个属性值
  isLeaf?: string
  disabled?: string

  lazy?: boolean
  lazyLoad?: (node: Node, resolve: Resolve) => void
}


export interface EFormItemRule {
  validator?: ( rule: any, value: any, callback: any ) => any
  trigger?: 'blur' | 'change'
  type?: string
  required?: boolean
  pattern?: RegExp
  range?: any
  length?: number
  enum?: string[]
  transform?: ( value: any ) => any
  message?: string
  fields?: Omit<EFormItemRule, 'fields'>
}

export interface EFormItemDesc {
  // 列的数量
  span: number
  width: number | string
  minWidth: number | string
  align: 'left' | 'center' | 'right'
  labelAlign: string
  className: string
  labelClassName: string
}

export interface Popover {
  trigger?: 'click' | 'hover'
}

export interface EFormItem {
  // 标记
  code?: any
  label?: string
  type?: EFormIemType
  subType?: EFormItemSubType
  value?: any
  valueKey?: string
  placeholder?: string
  precision?: number
  items?: Array<any>

  // 指定从格式化器输入中提取的值。(仅当 type 是"text"时才起作用)
  parser?: (value: string) => string

  // 单列占宽
  cols?: number

  hide?: boolean
  isBlock?: boolean
  autoWidth?: boolean
  autoLabelWidth?: boolean

  border?: boolean
  disabled?: boolean
  readonly?: boolean
  showPassword?: boolean
  showWordLimit?: boolean


  // 是否可以清空选项
  clearable?: boolean
  // 文本框可输入
  editable?: boolean
  isRange?: boolean
  isGroup?: boolean
  custom?: EFormItemCustom
  props?: EFormItemCustom

  // 树类型 节点 key
  nodeKey?: string

  // 可选，选择器打开时默认显示的时间
  defaultValue?: Date | [ Date, Date ]
  // 控制按钮位置
  controlsPosition?: '' | 'right'

  // 搜索
  filterable?: boolean
  // 多选
  multiple?: boolean
  // 多选时是否将选中值按文字的形式展示
  collapseTags?: boolean
  // 当鼠标悬停于折叠标签的文本时，是否显示所有选中的标签。 要使用此属性，collapse-tags属性必须设定为 true
  collapseTagsTooltip?: boolean
  // multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制
  multipleLimit?: number
  
  // 多种类型组合表单，区分展示，为false则不展示 noExist(不存在)
  noExist?: boolean
  // 判断字段是否只为添加或者编辑
  // 列表数据空 && 编辑
  edit?: boolean
  // 列表数据 && 添加
  add?: boolean
  // 判断字段对应操作的禁用状态
  // 添加则隐藏
  addDisabled?: boolean
  // 编辑择禁用
  editDisabled?: boolean
  // 是否将下拉列表插入至 body 元素
  teleported?: boolean
  // 选择器下拉菜单的自定义类名
  popperClass?: string

  // 上传文件
  fileTypes?: string[]
  // 文件大小 单位 KB
  fileSize?: number
  // 文件夹
  folder?: string
  accept?: string
  // 地址前路径
  baseUrl?: string

  // textarea
  rows?: number
  autosize?: boolean | {
    minRows?: number
    maxRows?: number
  }

  // 描述属性(描述组件)
  desc?: EFormItemDesc
  // 描述现实字段 权重比 hide 高
  descShow?: boolean

  // tree popover
  popover?: Popover

  // json
  currentMode?: JsonModeType
  modeList?: JsonModeType[]

  // label 提示
  tooltip?: string

  // switch 开关绑定值
  activeValue?: string | number | boolean
  inactiveValue?: string | number | boolean
  activeText?: string
  inactiveText?: string
  inlinePrompt?: boolean,
  activeIcon?: string | Component
  inactiveIcon?: string | Component

  append?: string

  min?: number
  max?: number
  step?: number
  maxlength?: number

  height?: number
  // 富文本
  min_height?: number
  max_height?: number

  defaultTime?: Date | [ Date, Date ]
  disabledDate?: Function

  rules?: EFormItemRule[] | EFormItemRule

  style?: import('vue').StyleValue | string

  // input 事件 call 函数将回调的参数值作为新的 value
  onInput?: ( e: any, call?: ( ( e: any ) => void ) ) => void
  onChange?: ( e: any ) => void

  // 回显数据的 Key，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 formatter 的函数
  redirectVal?: string
  // 回显格式化
  formatter?: ( e: any, val: any ) => any
}

export interface EFormType {
  [ key: string ]: EFormItem
}

export interface ETableType {
  // 标题
  title: string
  size: EFormSize
  // 组件高度 (默认自适应高度，计算屏幕最大可用高度，不可与 maxHeight 属性同时使用)
  height: import('./table/index').Height
  // 表格高度偏差
  heightDeviation: number
  // 操作列
  col: Partial<import('./table/index').Col>[]
  // 数据源
  data: Array<any>
  // 查询
  query: Partial<Exclude<import('./table/index').Query, 'forms'>> & Required<Pick<import('./table/index').Query, 'forms'>>
  // 执行配置
  action: Partial<import('./table/index').Action>
  // 操作
  operation: Partial<import('./table/index').Operation>
  // 分页
  page: Partial<import('./table/index').Page>
  // 编辑
  edit: Partial<Exclude<import('./table/index').EditType, 'forms'>> & Required<Pick<import('./table/index').EditType, 'forms'>>
  api: Partial<import('./table/index').Api>

  // 接口查询过滤参数
  filters: any
  // table 属性
  tableAttrs: Partial<import('./table/index').TableAttrs>
  // 分页属性
  pagingAttrs: Partial<import('./table/index').PagingAttrs>
  // 弹窗属性
  dialogAttrs: Partial<import('./table/index').DialogAttrs>
  // form 属性
  formAttrs: Partial<import('./table/index').FormAttrs>
  // 添加前
  beforeAdd: () => boolean | Promise<boolean>
  // 提交前
  beforeSubmit: ( forms: object, rowInfo: null | object ) => object | Promise<object>
  // 编辑前
  beforeEdit: (scope: object ) => object | boolean | Promise<object>
  // 删除前
  beforeDelete: (selectData: object[] | null, rowInfo: object | null) => object | Promise<object>
  // 刷新前
  beforeRefresh: () => boolean | Promise<boolean>
  // 查询数据格式化
  formatter: (result: { total: number, data: any[] }) => object | Promise<object>
  // 打印配置
  printOption: import('./table/index').PrintOpts
}