import { Axios, Api } from '@/config'

export const getConfig = () => {
  return Axios.get(Api.d3.office)
}

// 模式
export const getModes = () => {
  return Axios.get(Api.d3.office_mode)
}

// 区域用电量查询
export const getAreaCount = params => {
  return Axios.get(Api.d3.office_area_count, params)
}
