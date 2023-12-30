/* mock api */
// import { MockMethod } from 'vite-plugin-mock'
// import * as Mock from 'mockjs'
import user from './user'
import test from './test'

const mock: Array<any> = [
  ...user,
  ...test,
].map( ( item ) => {
  item.url = '/mock' + item.url
  return item
} )
export default mock