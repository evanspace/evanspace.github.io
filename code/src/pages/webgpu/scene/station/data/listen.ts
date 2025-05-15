/**
 * @description:
 * @file: listen.ts
 * @author: Evan
 * @date: 2025.05.15 10:58:14
 * @week: 周四
 * @version: V
 */

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

  // 场景坐标
  Emitter.on('scene:pos', () => scene?.getPosition())
  Emitter.on('scene:test', () => scene?.openTest())

  // 标签-监控
  Emitter.on('tag:status', (item: ListItem) => {
    scene?.anchorToggle(item.key as string, item.value == 1)
  })
}
