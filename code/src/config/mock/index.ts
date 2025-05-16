/* mock api */
// import { MockMethod } from 'vite-plugin-mock'
// import * as Mock from 'mockjs'
import user from './user'
import test from './test'
import monitor from './monitor'
import d3 from './d3'
import echarts from './echarts'
import common from './common'

const mock: Array<any> = [...user, ...test, ...monitor, ...d3, ...echarts, ...common].map(item => {
  item.url = '/mock' + item.url
  return item
})
export default mock
