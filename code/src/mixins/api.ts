
import { getFormatDate } from '@utils/date'
import { Axios } from '@/config'


// 文件保存
import { blobType } from './blob-types'
export const fileSave = ( type: string, res, fielName?: string ) => {
  let blob = new Blob( [ res ], { type: blobType[ type ] } )
  let a = document.createElement( 'a' )
  let href = window.URL.createObjectURL( blob )
  a.href = href
  a.target = '_blank'
  // 判断结尾是否为文件后缀 否则添加
  let name = ( fielName  || getFormatDate( 0, 'yyyy-MM-dd-hh_mm_ss' ) )
  if ( !name.endsWith( type ) ) {
    name += '.' + type
  }
  a.download = name
  document.body.appendChild( a )
  a.click()
  a.remove()
}

// 导出 文件
export const exportFile = ( url: string, params = {}, method = 'get' ) => {
  Axios[ method ]( url, { responseType: 'blob', ...params }, false )
  .then( ( res ) => {
    fileSave( 'xlsx', res )
  } )
}