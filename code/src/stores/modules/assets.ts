/* *
 * @description:
 * @file: assets.ts
 * @author: Evan
 * @date: 2024.04.07 09:39:08
 * @week: 周日
 * @version: V
 * */

import { getSession, setSession } from '@utils/storage'
import { defineStore } from 'pinia'

import { DEVICE_TYPE } from '@/config/key'

const wsIpKey = 'ws.ip'
const wsIp = getSession(wsIpKey) || ''

// 环境变量
const env = import.meta.env
const staticPath = env.VITE_BEFORE_STATIC_PATH

const assetsStore: import('./index').AssetsStore = {
  // 静态资源路径
  staticPath,

  // ws ip 地址
  wsIp,

  // oss 资源
  oss: env.VITE_OSS_BUCKET,
  origin: '',
  bucket: env.VITE_OSS_BUCKET,

  git: env.VITE_GIT_OSS
}

export const useAssetsStore = defineStore({
  id: 'assets',
  state: () => assetsStore,
  actions: {
    // 更新 ip
    updateWsIp(ip: string) {
      this.wsIp = ip
      setSession(wsIpKey, ip)
    },

    // 获取设备图片地址
    getDeviceSrc(item: import('@/mixins/type').PlaneDevice) {
      const { error = 0, status = 0 } = item
      let folder = error > 0 ? 'error' : status > 0 ? 'run' : 'normal'
      let type = item.type
      if ([DEVICE_TYPE.LDB, DEVICE_TYPE.LQB].includes(type)) type = 'LDB'
      else if ([DEVICE_TYPE.LXJ, DEVICE_TYPE.BSHLQ].includes(type)) type = 'LXJ'
      else if ([DEVICE_TYPE.LDFM, DEVICE_TYPE.LQFM].includes(type)) type = 'FM'
      return `${assetsStore.oss}/img/device/${folder}/${type}.png`
    }
  }
})
