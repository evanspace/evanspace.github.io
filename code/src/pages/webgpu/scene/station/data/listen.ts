import { Scene } from '../class'
import Emitter from '../emitter'

export const onListen = (scene: InstanceType<typeof Scene>) => {
  // 漫游
  Emitter.on('camera:roam', () => scene?.toggleRoam())
  // 巡航
  Emitter.on('camera:cruise', () => scene?.toggleCruise())
  // 重置视角
  Emitter.on('camera:reset', () => scene?.controlReset())
  // 第一人称
  Emitter.on('camera:first', () => scene?.togglePersonSight(1))
  // 第三人称
  Emitter.on('camera:three', () => scene?.togglePersonSight(3))
  // 机房
  Emitter.on('camera:machineroom', () => scene?.toCoolMachineRoom())

  // 人物加速
  Emitter.on('person:add', () => scene?.personSpeed())
  // 减速
  Emitter.on('person:sub', () => scene?.personSpeed(-1))

  // 大门
  // Emitter.on('CAMERA:GATE', () => scene?.cameraTransitionByModelname('一楼大门'))

  // 场景坐标
  Emitter.on('scene:pos', () => scene?.getPosition())
  Emitter.on('scene:test', () => scene?.openTest())
}
