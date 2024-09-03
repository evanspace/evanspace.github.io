import { Axios, Api } from '@/config'

// 查询地图配置
export const getMap = () => {
  return Axios.get(Api.d3.map)
}
