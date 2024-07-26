/* *
 * @description: 
 * @file: assets.ts
 * @author: Evan
 * @date: 2024.04.07 09:39:08
 * @week: 周日
 * @version: V
* */

import { defineStore } from 'pinia'

// 环境变量
const env = import.meta.env
const staticPath = env.VITE_BEFORE_STATIC_PATH

const assetsStore: import('./index').AssetsStore = {

  // 静态资源路径
  staticPath,

  // oss 资源
  oss:  env.VITE_OSS_BUCKET,
  origin: '',
  bucket: env.VITE_OSS_BUCKET,
  
}


export const useAssetsStore = defineStore( {
  id: 'assets',
  state: () => assetsStore
} )