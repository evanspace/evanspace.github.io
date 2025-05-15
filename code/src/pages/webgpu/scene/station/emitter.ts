// 事件
const eventNames = [
  // 漫游
  'camera:roam',
  // 巡航
  'camera:cruise',
  // 视角重置
  'camera:reset',
  // 第一人称
  'camera:first',
  // 第三人称
  'camera:three',
  // 机房
  'camera:machineroom',

  // 人物加速
  'person:add',
  // 人物减速
  'person:sub',
  // 人物动作
  'person:action',

  // 场景坐标
  'scene:pos',
  // 测试
  'scene:test',

  // 设备更新
  'dev:update'
] as const
type EventNames = (typeof eventNames)[number]

class EventEmitter {
  private listteners: Record<string, Set<Function>> = eventNames.reduce((obj, key) => {
    obj[key] = new Set()
    return obj
  }, {} as Record<string, Set<Function>>)

  on(eventName: EventNames, listtener: Function) {
    this.listteners[eventName].forEach(it => {
      if (it.toString() === listtener.toString()) {
        this.listteners[eventName].delete(it)
      }
    })
    // 将监听器添加到对应事件的监听器集合中
    this.listteners[eventName].add(listtener)
  }

  emit(eventName: EventNames, ...args: any[]) {
    this.listteners[eventName].forEach(listtener => listtener(...args))
  }
}

export default new EventEmitter()
