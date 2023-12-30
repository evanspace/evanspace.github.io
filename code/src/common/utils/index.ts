/* *
 * @description: 
 * @file: index.ts
 * @author: Evan
 * @date: 2023.07.22 14:31:45
 * @week: 周六
 * @version: V
* */
import * as win from './win'
import * as date from './date'
import * as format from './format'
import * as encrypt from './encrypt'
import * as reckon from './reckon'
import * as validate from './validate'
import * as array from './array'
import * as document from './document'
import * as storage from './storage'
import * as random from './random'


const fs: any = {
}

const copy = ( obj: any ) => {
  Object.keys( obj ).forEach( key => {
    fs[ key ] = obj[ key ]
  })
}

copy( win )
copy( date )
copy( format )
copy( encrypt )
copy( reckon )
copy( validate )
copy( array )
copy( document )
copy( storage )
copy( random )


const install = function( app: any ) {
  app.config.globalProperties.$utils = fs
}

export default {
  install,
  win,
  date,
  format,
  encrypt,
  reckon,
  validate,
  array,
  document,
  storage,
  random,
}