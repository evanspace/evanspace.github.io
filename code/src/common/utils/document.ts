/*
 * @description: dom 元素处理方法
 * @fileName: document.js
 * @author: Evan
 * @date: 2021-05-06 10:21:48
 * @version: V1.0.0
 */
import { ElMessage } from 'element-plus'

/**
 * 复制 (界面需交互后才可复制)
 * @param { string } text 复制内容
 * @example
 * copy( '复制一段文本！ )
 */
export const copy = ( text: string ) => {
  let textarea = document.createElement( 'textarea' )
  textarea.value = text
  let style: any  = {
    zIndex: 0,
    opacity: 0,
    position: 'absolute',
  }
  Object.keys( style ).forEach( ( key: any ) => {
    textarea.style[ key ] = style[ key ]
  } )
  document.body.appendChild( textarea )
  ElMessage.success( `复制成功！` )
  textarea.select()
  // 执行复制
  document.execCommand( 'copy' )
  document.body.removeChild( textarea )
}
