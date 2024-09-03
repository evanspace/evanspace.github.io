/*
 * @description:
 * @fileName: config.js
 * @author: Evan
 * @date: 2021-07-08 11:22:04
 * @version: V1.0.0
 */
import { Axios } from '@axios'
import { ElNotification, ElMessage, ElLoading } from 'element-plus'

// const env = import.meta.env
// const apiBeforePath = env.VITE_API_BEFORE_PATH

const apiRoot = {
  api: '/mock',
  user: '/mock',
  monitor: '/mock',
  area: '/mock',
  test: '/mock'
}

const hostname = location.hostname
const webname = hostname.split('.').slice(-2, -1).join('.') //网页名字
const domian = hostname.split('.').slice(-3).join('.') //根域名
const Api = {
  apiRoot,
  base: {
    title: 'Vue3 前端训练基地',
    webname: webname,
    domian: String(domian) // 根域名
  },

  user: {
    login: '/user/login',
    logout: '/user/logout',
    getUserInfo: '/user/getUserInfo',
    changePwd: '/user/changePwd'
  },

  monitor: {
    init: '',
    get_config: '/monitor/get_config'
  },

  echarts: {
    get: '/echarts/get',
    map: '/echarts/map'
  },

  d3: {
    map: '/d3/map'
  },

  area: {
    tree: '/area'
  },

  test: {
    list: '/test/list',
    get: '/test/get',
    add: '/test/add',
    update: '/test/update',
    del: '/test/del',
    items: '/test/items',
    group: '/test/group'
  }
}

// 追加
const appendRoot = (key: number, path: String) => {
  return ((apiRoot as any)[key] || apiRoot.api || '') + path
}

// 格式化
const apiFormat = (obj: any, key: any, isFirst: Boolean = false) => {
  Object.keys(obj).forEach(k => {
    isFirst && (key = k)
    if (key == 'apiRoot' || key == 'base') return
    let o = obj[k]
    if (typeof o == 'object') {
      apiFormat(o, key)
    } else {
      obj[k] = appendRoot(key, o)
    }
  })
}
apiFormat(Api, null, true)

const install = function (app: any) {
  app.config.globalProperties.$api = Api
}
export default install

// 通知提示
type noType = 'success' | 'warning' | 'error' | 'info'
const Notip = (message = '', title = '提示', type: noType = 'success') => {
  ElNotification({
    type,
    title,
    message
  })
}

const Message = (message = '', type: noType = 'success') => {
  ElMessage({
    message,
    type
  })
}

const Loading = () => {
  return ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

export { Axios, Api, Notip, Message, Loading }
