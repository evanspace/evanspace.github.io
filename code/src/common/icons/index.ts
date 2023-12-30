
import 'virtual:svg-icons-register'
import svgIcon from './svg-icon/index.vue'

const install = function( app: any ) {
  app.component( 'svg-icon', svgIcon )
}
export default install

export { svgIcon }