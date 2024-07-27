
import { Axios, Api } from '@/config'

interface SceneInfoPar {
  projectCode: string | number
  groupCode: string
}

// 获取场景初始化数据
export const getSceneInit = ( params: SceneInfoPar ) => {
  return Axios.get( Api.monitor.init, params, false )
}

