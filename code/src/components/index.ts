import threeScene from './three-scene/index.vue'
import planeDevice from './plane-device/index.vue'
import echarts from './echarts/index.vue'

const components = [threeScene, planeDevice, echarts]
const install = function (app) {
  components.forEach((component: any) => {
    app.component(component.name, component)
  })
}

export default install
