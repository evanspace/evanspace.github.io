

// 字典查询
export type DictResItem = {
  label: string
  value: string
  Code: string
  [ key: string ]: any
}


// indexDb 数据库查询
export type DbGtKeyResult = {
  path: string
  data: ArrayBuffer | string
}

export type TableCol = {
  label: string
  key: string
}

// 报表
export type TableRes = {
  title: string
  col: TableCol[]
  list: any[]
}

// 表单时间范围
export type FormDateRangeFilters = {
  StartTime: number
  EndTime: number
}

// 坐标系
export type XYZ = {
  x: number
  y: number
  z: number
}