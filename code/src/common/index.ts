

/* 自定义 组件 */
import components from './components'

/* 自定义 svg 图标 */
import svgIcon from './icons'

/* 自定义方法 */
import utils from './utils'


/* 接口服务 */
import axios from './service'

// element-plus 暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'

/* global css */
import './assets/css/index.scss'


const install = function( app: import('vue').App<any>, opts: import('./index.d').InstallOption = {} ) {

  // for ( const [ key, component ] of Object.entries( elementPlusIconsVue ) ) {
  //   app.component( key, component )
  // }

  if ( !opts.namespace ) {
    opts.namespace = 'e'
  }

  app
  .use( components, opts )
  .use( svgIcon )
  .use( utils )
}
export default install

export {
  utils,
  axios,
}

