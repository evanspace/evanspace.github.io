import { Axios, Api } from '@/config'

// 配置
export const getConfig = () => {
  return Axios.get(Api.echarts.get)
}

// 地图数据
export const getMap = () => {
  return Axios.get(Api.echarts.map).then(list => {
    const projects: import('./index').MapPoint[] = []
    let max = 0
    const citys = list.map(item => {
      const len = item.projects.length
      let city = item.province
      item.projects.forEach(it => {
        projects.push({
          value: [it.lng, it.lat],
          name: it.name,
          carbon: it.carbon,
          use: it.use,
          count: len,
          city: item.province,
          id: it.id
        })
      })
      const value = item.total
      if (value > max) max = value
      return {
        name: city,
        code: item.code,
        count: len,
        city: item.province,
        value: 0
      }
    })
    return {
      projects,
      citys,
      max: Math.ceil(max / 100) * 100 || 100
    }
  })
}
