
import threeScene from './three-scene/index.vue'


const components = [
  threeScene
]
const install = function( app ) {
  components.forEach( ( component: any ) => {
    app.component( component.name, component )
  } )

}

export default install