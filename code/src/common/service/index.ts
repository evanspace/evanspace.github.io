
import Server from './axios'
import Axios from './options'


const install = function( app: any ) {  
  app.config.globalProperties.$axios = Axios
}

export {
  Axios,
  Server,
}
export default install
