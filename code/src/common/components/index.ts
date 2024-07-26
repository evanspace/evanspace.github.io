/* *
 * @description: 
 * @file: index.ts
 * @author: Evan
 * @date: 2023.07.27 17:00:58
 * @week: 周四
 * @version: V
* */
import scalePage from './scale-page/index.vue'
import drag from './drag/index.vue'
import largePage from './large-page/index.vue'
import config from './config/index.vue'
import form from './form/index.vue'

const components = [
  scalePage,
  drag,
  largePage,
  config,
  form,
]


const install = function( app, opts: import('../index.d').InstallOption = {} ) {
  components.forEach( component => {
    component.name = opts.namespace + '-' + component.name
    app.component( component.name, component )
  } )
}


// 输出对象
let componentsObj = {
  install
}

components.forEach( component => {
  componentsObj[ component.name as string ] = component
} )

export default componentsObj