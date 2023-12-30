import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import i18n from './locales'
import App from './App.vue'


// 环境变量
// const env = import.meta.env
// console.log( env )

/* 自定义配置 */
import CONFIG from './config'

/* 自定义组件 */
import common from './common'
import components from './components'

// 自定义覆盖样式
import './assets/css/reset.scss'


/* 权限控制 */
import './permission'


const app = createApp( App )

app.directive( 'focus', {
  // 当被绑定的元素挂载到 DOM 中时……
  mounted( el ) {
    // 聚焦元素
    el.focus()
  }
} )

app
.use( createPinia() )
.use( router )
.use( i18n )
.use( common )
.use( components )
.use( CONFIG )
.mount( '#app' )
