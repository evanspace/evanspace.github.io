/*
 * @description: axios 封装对象
 * @fileName: axios.js
 * @author: Evan
 * @date: 2021-07-09 14:17:03
 * @version: V1.0.0
 */
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'

NProgress.configure( { showSpinner: false } )

// 常见Http错误状态码
const HTTP_ERROR_CODE: any = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  408: 'Request Timeout',
  414: 'Request URI Too Long',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported'
}

const server = axios.create( {
  //请求基地址
  baseURL: '/',
  timeout: 100000, // 超时时间
} )

// post请求添加请求头
// Service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'


// 请求拦截
server.interceptors.request.use( ( config: any ) => {
  // 是否显示进度条
  if ( !config.noNprogress ) {
    NProgress.start()
  }
	return config
}, error => {
	NProgress.done()
	return Promise.reject( error )
} )

// 响应拦截
server.interceptors.response.use( config => {
	// 处理响应数据
	NProgress.done()
	return config
},  error => {
	NProgress.done()
  let status = error.response.status

  // 错误状态码统一处理
  if ( status >= 400 ) {
    let result = error.response.data || {}
    error = {
      code: status,
      msg: result.message || HTTP_ERROR_CODE[ status ],
      data: null
    }
  }
  return Promise.reject( error )
} )

export default server

