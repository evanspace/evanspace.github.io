

import { builder } from '../util'
export default [
  {
    url: '/monitor/get_config',
    method: 'get',
    response: ( e ) => {
      const { id } = e.query || {}
      if ( id == '123456' ) {
        return builder( {
          id: 1,
          name: '制冷站监测系统',
        } )
      }
    }
  }
]