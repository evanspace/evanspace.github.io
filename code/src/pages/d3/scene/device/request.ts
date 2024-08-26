

import { Axios, Api } from '@/config'
import DATA from './data/index'


// 监控配置
export const getMonitorConfig = ( params: Pick<RequestPas, 'id' | 'type' > ): Promise<Pick<ReturnPas, 'jsonList' | 'pipConfig' | 'modelUrl' | 'configJson' | 'name'>> => {
  return Axios.get( Api.monitor.get_config, params, false ).then( res => {
    console.log( res )
    const obj = DATA.find( ( it: any ) => it.id == res.id )
    if ( obj ) {
      Object.keys( obj ).forEach( key => {
        res[ key ] = obj[ key ]
      } )
    }
    if ( typeof res.configJson == 'string' ) {
      try {
        res.configJson = JSON.parse( res.configJson )
      } catch( er ) {
        res.configJson = {}
      }
    }
    return res
  } )
}
