import { StationThreeScene } from './methods'
import Emitter from './emitter'

export const onListen = (scene: InstanceType<typeof StationThreeScene>) => {
  // 漫游
  Emitter.on('CAMERA:ROAM', () => scene?.toggleRoam())
  // 巡航
  Emitter.on('CAMERA:CRUISE', () => scene?.toggleCruise())
  // 重置视角
  Emitter.on('CAMERA:RESET', () => scene?.controlReset())
  // 第一人称
  Emitter.on('CAMERA:FIRST', () => scene?.toggleSight(1))
  // 第三人称
  Emitter.on('CAMERA:THREE', () => scene?.toggleSight(3))
  // 机房
  Emitter.on('CAMERA:MACHINEROOM', () => scene?.toCoolMachineRoom())

  // 人物加速
  Emitter.on('PERSON:ADD', () => scene?.characterAccelerate())
  // 减速
  Emitter.on('PERSON:SUB', () => scene?.characterAccelerate(-1))
  // 人物动作
  Emitter.on('PERSON:ACTION', () => scene?.changeCharacterAction())

  // 场景坐标
  Emitter.on('SCENE:POS', () => scene?.getPosition())
}
