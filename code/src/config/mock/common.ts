/**
 * @description: 公共 mock 接口
 * @file: common.ts
 * @author: Evan
 * @date: 2025.05.16 08:59:20
 * @week: 周五
 * @version: V
 */

import { mock } from 'mockjs'
import { builder } from './util'

export default [
  // 列表
  {
    url: '/test/list',
    method: 'get',
    response: e => {
      const name = e.query.name || ''
      const list = 'ABCDEFGHIJKLMN'.split('').map(it => it + name)
      const len = list.length
      return builder(
        mock({
          [`list|1-${len}`]: [
            {
              id: '@id',
              'name|+1': list
            }
          ]
        }).list
      )
    }
  }
]
