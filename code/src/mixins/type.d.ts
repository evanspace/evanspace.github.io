

export type SectionCountItem = Partial<import('@/components/section/index').Count>

interface Extra {
  l_color?: string
  t_color?: string
}
type XAxis = import('echarts/types/dist/echarts').XAXisComponentOption & Extra
type yAxis = import('echarts/types/dist/echarts').YAXisComponentOption & Extra
interface EcOptions {
  color?: string | string[]
  unit?: string | string[] | (string[] | string)[]
  title?: import('echarts/types/dist/echarts').TitleComponentOption
  xAxis?: XAxis | XAxis[]
  yAxis?: yAxis | yAxis[]
  // 视觉映射
  visualMap?: import('echarts/types/dist/echarts').VisualMapComponentOption
  tooltip?: import('echarts/types/dist/echarts').TooltipComponentOption
  // 图列
  legend?: import('echarts/types/dist/echarts').LegendComponentOption
  // 网格
  grid?: import('echarts/types/dist/echarts').GridComponentOption
}

interface SectionEcColorItem {
  offset?: number
  color?: string
}

type SectionItem = {
  areaColors?: SectionEcColorItem[]
} & import('echarts/types/dist/echarts').SeriesOption

export interface SectionEc {
  list: SectionItem[]
  opts: EcOptions
}

export interface SectionFilters {
  StartTime?: number
  EndTime?: number
  [key: string]: any
}

export type TableCol = import('@/components/table-list/index').Col

// table 
export interface TableType {
  title?: string
  col: TableCol[]
  data: any[]
}


export interface ExportDialogType {
  title: string
  col: any[]
  data: any[]
}

export interface DialogViewType {
  show: boolean
  width?: string | number
  title?: string
  is?: object
}

export interface ListItem {
  name: string
  key?: string
  value?: number | string
  unit?: string
  color?: string
  ratio?: number
  isStatus?: boolean
}










// section 功能配置
export interface SectionType {
  icon: string
  title: string
  filters: SectionFilters
  count: SectionCountItem | SectionCountItem[],
  ec: SectionEc
  table: TableType
}


// 请求参数
export interface RequestPas {
  ProjectId: string
  StartTime: number
  EndTime: number
  Type: number
  Interval: string
  
  projectCode: string
  groupCode: string
  type: number | string
  id: string | number
}

type ObjectItem = import('@/components/three-scene/index').ObjectItem



export type PipePath = Pick<import('./index').XYZ, 'x' | 'y'>



export type PlaneDevice = Pick<ObjectItem, 'name' | 'deviceCode' | 'type' | 'unit' | 'value' | 'status' | 'error'> & {
  style: Pick<import('./index').XYZ, 'x' | 'y'>
  color?: string
  rotate?: number
  value?: number | string
}

export type Pipe = {
  name: string
  type: string
  style: Pick<import('./index').XYZ, 'x' | 'y'>
  paths: PipePath[]
  width?: number
  height?: number
  color?: string
  status?: number
  bind?: ( string | string[] | string[][] )[]
}

// 返回参数
export interface ReturnPas extends RequestPas {
  groupName: string

  name: string
  groupId: string
  jsonList: ObjectItem[]
  pipConfig: ObjectItem[]
  configJson: import('@/components/three-scene/index').Config
  modelUrl: string

  warn: number
  pointCode: string
  pointName: string
  msg: string
  
}


interface EchartPieces {
  gt: number,
  lte: number
  color: string
  _type_: string
}
// 图表请求返回结果
interface EchartMark {
  name: string
  yAxis: number
}
export interface EchartsReqRes {
  xAxisData: String[]
  seriesData: any[]
  count: number | number[]
  list: String[]
  table: any[]
  total: number
  table: any[]
  mark: EchartMark[]
  pieces: EchartPieces[]
  min: number[]
  max: number[]
  other: any
}