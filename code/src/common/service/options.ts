/*
 * @description: axios 请求方式封装
 * @fileName: options.js
 * @author: Evan
 * @date: 2021-08-17 11:44:09
 * @version: V1.0.0
 */
import Service from './axios'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/es/components/loading/style/css'
import { ElNotification, ElLoading } from 'element-plus'

/* 请求配置 */
const AjaxLoding: any = {
  style: {
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  el: null
}

// 递归过滤所有参数的首尾空格
const clean = (obj: any) => {
  let out = obj
  if (obj instanceof FormData || typeof obj == 'string') {
    return obj
  }
  const filter = (value: any) => {
    return typeof value === 'string'
      ? value.replace(/^\s*|\s*$/g, '')
      : typeof value === 'number'
      ? value
      : clean(value)
  }

  if (Object.prototype.toString.call(obj) === '[object Array]') {
    out = []
    for (let i = 0; i < obj.length; i++) {
      out[i] = filter(obj[i])
    }
  } else if (typeof obj == 'object') {
    out = {}
    for (let key in obj) {
      const val = filter(obj[key])
      if (val == void 0) continue
      out[key] = val
    }
  }
  return out
}

const Ajax = function (config: any) {
  let silent = config.silent
  delete config.silent
  let loading = config.loading
  delete config.loading

  // 加载弹窗
  if (loading) {
    AjaxLoding.style.target = loading instanceof Element ? loading : null
    AjaxLoding.el = ElLoading.service(AjaxLoding.style)
  }

  // 需要头部
  let __NEED_HEADER__ = false

  // 过滤提交数据的首尾空格
  if (config.method === 'get' || config.method === 'delete') {
    // 如获取文件流需要更改请求类型
    let responseType = config.params.responseType
    delete config.params.responseType
    // 需要头部
    __NEED_HEADER__ = config.params.__NEED_HEADER__
    // 请求进度条
    let noNprogress = config.params.noNprogress
    delete config.params.noNprogress
    config.params = clean(config.params)
    config.responseType = responseType
    config.noNprogress = noNprogress
  } else {
    // 如获取文件流需要更改请求类型
    let responseType = config.data.responseType
    delete config.data.responseType
    // 需要头部
    __NEED_HEADER__ = config.data.__NEED_HEADER__
    // 请求进度条
    let noNprogress = config.data.noNprogress
    delete config.data.noNprogress
    config.data = clean(config.data)
    config.responseType = responseType
    config.noNprogress = noNprogress
  }

  return Service(config)
    .then(resp => {
      loading && AjaxLoding.el.close()
      let response = resp.data || {}
      if (resp.status == 200) {
        if (__NEED_HEADER__) {
          return resp
        }
        if (response.code != void 0) {
          if (response.code == 200 && response.data) {
            return response.data
          } else {
            return Promise.reject(response)
          }
        }
        return response
      } else {
        return Promise.reject(response)
      }
    })
    .catch(er => {
      loading && AjaxLoding.el.close()
      if (er.code) {
        er.code = parseInt(er.code, 10)
        er.data = er.data || ''
        if (er.code !== 0) {
          // 控制台输出信息，方便提交后台排错
          console.info(
            `错误编码：${er.code}\n错误信息：${er.msg}\n接口地址：${
              config.url
            }\n输入参数：${JSON.stringify(config.data || config.params)}`
          )
          // 页面错误提示
          if (!silent) {
            ElNotification({
              type: 'error',
              title: er.code.toString(),
              message: er.msg
            })
          }
        }
      }
      return Promise.reject(er)
    })
}

/**
 * get 请求
 * @param { String} url 请求链接
 * @param { Object } params 请求参数
 * @param { Boolean | Element } loading 加载弹窗 为dom元素则挂在到dom
 * @param { Boolean } silent 是否静默 默认值 false （会自动在页面抛出错误信息）
 * @returns { Promise } 接口返回数据
 */
Ajax.get = function (
  url: String,
  params = {},
  loading: Boolean | String | Document = true,
  silent = false
) {
  let config = { url, method: 'get', params, silent, loading }
  return this(config)
}

/**
 * post 请求
 * @param { String} url 请求链接
 * @param { Object } data 请求参数
 * @param { Boolean|Element } loading 加载弹窗 为dom元素则挂在到dom
 * @param { Boolean } silent 是否静默 默认值 false （会自动在页面抛出错误信息）
 * @returns { Promise } 接口返回数据
 */
Ajax.post = function (
  url: String,
  data = {},
  loading: Boolean | String | Document = true,
  silent = false
) {
  let config = { url, method: 'post', data, silent, loading }
  return this(config)
}

/**
 * put 请求
 * @param { String} url 请求链接
 * @param { Object } data 请求参数
 * @param { Boolean | Element } loading 加载弹窗 为dom元素则挂在到dom
 * @param { Boolean } silent 是否静默 默认值 false （会自动在页面抛出错误信息）
 * @returns { Promise } 接口返回数据
 */
Ajax.put = function (
  url: String,
  data = {},
  loading: Boolean | String | Document = true,
  silent = false
) {
  let config = { url, method: 'put', data, silent, loading }
  return this(config)
}

/**
 * delete 请求
 * @param { String} url 请求链接
 * @param { Object } params 请求参数
 * @param { Boolean | Element } loading 加载弹窗 为dom元素则挂在到dom
 * @param { Boolean } silent 是否静默 默认值 false （会自动在页面抛出错误信息）
 * @returns { Promise } 接口返回数据
 */
Ajax.delete = function (
  url: String,
  params = {},
  loading: Boolean | String | Document = true,
  silent = false
) {
  let config = { url, method: 'delete', params, silent, loading }
  return this(config)
}

export default Ajax
