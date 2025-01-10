/* *
 * @description:
 * @file: ws.ts
 * @author: Evan
 * @date: 2023.09.23 17:28:02
 * @week: 周六
 * @version: V
 * */

import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useAssetsStore } from './assets'

import type { WsStore, WsInitOpts } from './index'
import KEYS, { DEVICE_KEY } from '@/config/key'

const wsStore: WsStore = {
  // 避免重复
  lockReconnect: false,
  // 重连间隔
  reconnectTime: 1000 * 5,
  // 最大重连次数
  reconnectTimes: 10,
  // 当前连接次数
  times: 0,
  // 设备监控 websocket 地址
  deviceWs: '',
  // 全地址
  allUrl: '',
  // 对象
  ws: null,
  // 重联定时器
  tt: null,
  // 心跳包发送频率
  time: 1000 * 30,
  // 心跳包定时器
  timer: null,

  // 数据更新标记
  dataMark: 0,
  // 数据
  data: [],
  // 转换后数据
  dataObj: {},
  // 其他数据
  otherData: [],

  groupCode: ''
}

export const useWsStore = defineStore({
  id: 'wx',
  state: () => wsStore,

  actions: {
    // 初始化
    initSocket(opts: WsInitOpts) {
      const { projectCode, isRefresh, groupCode, path = 'ws' } = opts
      const userStore = useUserStore()
      const assetsStore = useAssetsStore()

      const { protocol } = window.location
      const wst = protocol === 'https:' ? 'wss' : 'ws'
      let url = `${wst}://${assetsStore.wsIp}:8998/${path}?projectCode=${projectCode}&access_token=${userStore.token}&groupCode=${groupCode}`

      this.groupCode = groupCode
      this.allUrl = url
      this.resetOpts()

      // 判断是刷新则不创建
      if (!isRefresh) {
        this.wsCreate(url)
      }
    },

    // 扩展数据
    extend(data: any[]) {
      this.otherData = data
    },

    // 重置参数
    resetOpts() {
      this.ws && this.ws.close()
      clearInterval(this.timer)
      this.$patch({
        lockReconnect: false,
        times: 0,
        ws: undefined,
        dataObj: {}
      })
    },

    //  创建连接
    wsCreate(url: string) {
      console.log('WebSocket create...')
      // 重连锁定重置默认
      let BrowserWebSocket = window.WebSocket
      try {
        this.ws = new BrowserWebSocket(url)
        // 判断关闭时是否属于当前链接中间值
        this.ws.__ID__ = new Date().getTime()
        // 绑定事件
        this.wsEvent()
      } catch (er) {
        console.log('初始化失败', er)
        ElMessage({
          type: 'error',
          message: 'Ws 初始化失败！'
          // plain: true,
        })
        // 重连
        this.wsReconnect()
      }
    },

    // wocket 监听事件
    wsEvent() {
      console.log('WebSocket init...')
      this.ws.onopen = res => {
        this.wsOnOpen(res)
      }
      this.ws.onmessage = res => {
        this.wsOnMessage(res)
      }
      this.ws.onclose = res => {
        this.wsOnClose(res)
      }
      this.ws.onerror = res => {
        this.wsOnError(res)
      }
    },

    // 打开
    wsOnOpen(_) {
      console.log('webscoket open')
      // 连接成功后重置连接次数
      this.times = 0
      this.wsHeartCheck()
    },

    // 发送心跳包
    wsHeartCheck() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        let tsp = new Date().getTime() + ''
        // console.log( 'send heart', tsp)
        // 发送心跳包
        this.ws.send(tsp)
      }, this.time)
    },

    // message 事件
    wsOnMessage(res) {
      let data = res.data
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (er) {
          data = {}
          console.log(er)
        }
      }
      if (typeof data.Data === 'string') {
        try {
          data.Data = JSON.parse(data.Data)
        } catch (er) {
          data.Data = {}
        }
      }
      const { data: list, type } = data
      this.flatData(list, type)
    },

    // 扁平数据
    flatData(list, type?: string) {
      if (list.length == 0) return
      const obj = list.reduce((res, item) => ((res[item.pointCode] = item), res), {})
      if (!type || type.includes('全量')) {
        this.dataObj = obj
      } else {
        Object.keys(obj).forEach(key => {
          this.dataObj[key] = obj[key]
        })
      }
      // console.log( obj )
      this.dataMark = Date.now()
    },

    // 格式化数据
    formatData(list: import('three-scene/types/model').ObjectItem[], callbak?: Function) {
      return list.map((item, index) => {
        const obj = {
          id: index,
          ...item,
          status: 0,
          error: 0
        }
        if (typeof callbak === 'function') {
          const vals = callbak(obj)
          if (vals) {
            Object.assign(obj, vals)
          }
        }
        return obj
      })
    },

    getObj(obj, code, key) {
      let k = `${this.groupCode}_${code}${key ? '_' + key : ''}`
      return obj[k] || { value: 0 }
    },

    // 获取值
    getKeyValue(code: string, obj?) {
      !obj && (obj = this.dataObj)
      return this.getObj(obj, code, '')
    },

    // 获取状态
    getRunStatus(code: string, obj?) {
      const type = code.replace(/[^a-zA-Z]/g, '')
      let status = 0
      !obj && (obj = this.dataObj)
      switch (type) {
        case DEVICE_KEY.CHL:
          status = this.getObj(obj, code, KEYS.RUN_MODE).value
          break
        case DEVICE_KEY.CWP:
        case DEVICE_KEY.CHWP:
        case DEVICE_KEY.COT:
          status =
            this.getObj(obj, code, KEYS.ON_OFF).value ||
            this.getObj(obj, code, KEYS.VFD_ON_OFF).value
              ? 1
              : 0
          break
        case DEVICE_KEY.CWV:
        case DEVICE_KEY.CHWV:
          status = this.getObj(obj, code, KEYS.FO).value
          break
        case DEVICE_KEY.WV:
          status = 1
          break
      }
      return status
    },

    // 故障状态
    getErrorStatus(code: string, obj?) {
      const type = code.replace(/[^a-zA-Z]/g, '')
      let status = 0
      !obj && (obj = this.dataObj)
      switch (type) {
        case DEVICE_KEY.CHL:
        case DEVICE_KEY.CWV:
        case DEVICE_KEY.CHWV:
          status = this.getObj(obj, code, KEYS.ALM).value
          break
        case DEVICE_KEY.CWP:
        case DEVICE_KEY.CHWP:
        case DEVICE_KEY.COT:
          status =
            this.getObj(obj, code, KEYS.PWR_ALM).value || this.getObj(obj, code, KEYS.VFD_ALM).value
              ? 1
              : 0
          break
      }
      return status
    },

    // 关闭
    wsOnClose(res) {
      console.log('webscoket closed')
      if (!!this.ws) {
        // 判断 id 是否为当前id
        let __ID__ = res.target.__ID__
        let id = this.ws.__ID__
        if (__ID__ == id) {
          // 重连
          this.wsReconnect()
        }
      }
    },

    // 关闭连接
    wsClose() {
      console.log('webscoket close...')
      // 锁定重连
      this.lockReconnect = true
      // 清除心跳包
      clearInterval(this.timer)
      // 清空数据
      this.wsClear()
      this.ws && this.ws.close()
      this.ws = null
    },

    // 清空数据
    wsClear() {
      // 清空数据
      this.data.length = 0
      this.otherData.length = 0
    },

    // 错误
    wsOnError(res) {
      console.log('webscoket error', res)
      this.wsReconnect()
    },

    // 重连
    wsReconnect() {
      if (this.lockReconnect || this.times >= this.reconnectTimes) return

      console.log('webscoket reconnect...')
      this.lockReconnect = true
      this.times++
      //没连接上会一直重连，设置延迟避免请求过多
      this.tt && clearTimeout(this.tt)

      this.tt = setTimeout(() => {
        this.lockReconnect = false
        // 创建实例
        this.wsCreate(this.allUrl)
      }, this.reconnectTime)
    }
  }
})
