



const components = [
]
const install = function( app ) {
  components.forEach( ( component: any ) => {
    app.component( component.name, component )
  } )

}

export default install