import { mock } from 'mockjs'
import { builder } from '../util'

export default [
  {
    // 项目地图数据
    url: '/d3/map',
    method: 'get',
    response: () => {
      return builder(
        mock({
          'list|5-34': [
            {
              code: '@guid',
              province: '@province',
              'total|0-100000': 0,
              'projects|1-10': [
                {
                  'lng|80-120.0-6': 0,
                  'lat|25-45.0-6': 0,
                  name: '@cword(5,10)',
                  'carbon|0-10000': 0,
                  'use|0-1000000': 0,
                  id: '@guid'
                }
              ]
            }
          ]
        }).list
      )
    }
  }
]
