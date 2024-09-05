import { Axios, Api } from '@/config'

// 查询地图配置
export const getMap = () => {
  return Axios.get(Api.d3.map).then(res => {
    const projects: import('./index').MapPoint[] = []
    const citys = res.list.map(item => {
      const len = item.projects.length
      let city = item.province
      if (['重庆', '北京', '天津', '上海'].includes(city)) city = city + '市'
      if (['台湾'].includes(city)) city = city + '省'
      item.projects.forEach(it => {
        projects.push({
          value: [it.lng, it.lat],
          name: it.name,
          carbon: it.carbon,
          use: it.use,
          total: len,
          city: item.province,
          id: it.id
        })
      })
      const value = item.total
      return {
        name: city,
        code: item.code,
        total: len,
        city: item.province,
        value
      }
    })
    return {
      citys,
      projects,
      lines: res.lines
    }
  })
}
