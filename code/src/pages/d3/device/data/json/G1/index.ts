
import jsonList from './device'
import pipConfig from './pipe'
export default {
  id: 1,
  name: '制冷站监测系统',
  jsonList,
  pipConfig,
  modelUrl: '/pipe/001.glb',
  configJson: `{"cruise":[[-300,2,250],[0,2,250],[240,2,250],[240,2,0],[240,2,-250],[0,2,-250],[-300,2,-250],[-300,2,0]]}`
}