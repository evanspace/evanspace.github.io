

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


const install = function( app: any ) {
  app
  .use( svgIcon )
  .use( utils )
}
export default install

export {
  utils,
  axios,
}

