import planeDevice from './plane-device/index.vue'

const components = [planeDevice]
const install = function (app) {
  components.forEach((component: any) => {
    app.component(component.name, component)
  })
}

export default install
