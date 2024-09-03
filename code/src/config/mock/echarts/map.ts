import { mock } from 'mockjs'
import { builder } from '../util'

import DATA from './data'

export default [
  {
    // 项目地图数据
    url: '/echarts/map',
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
                  'carbonEmission|0-1': 0,
                  'use|0-1000000': 0,
                  id: '@guid'
                }
              ]
            }
          ]
        }).list
      )
    }
  },
  {
    url: '/echarts/get',
    methods: 'get',
    response: () => builder(DATA)
  }
]
