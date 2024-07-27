/* mock api */
// import { MockMethod } from 'vite-plugin-mock'
// import * as Mock from 'mockjs'
import user from './user'
import test from './test'
import monitor from './monitor'

const mock: Array<any> = [
  ...user,
  ...test,
  ...monitor,
].map( ( item ) => {
  item.url = '/mock' + item.url
  return item
} )
export default mock