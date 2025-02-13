// 事件
const eventNames = [
  // 漫游
  'CAMERA:ROAM',
  // 巡航
  'CAMERA:CRUISE',
  // 视角重置
  'CAMERA:RESET',
  // 第一人称
  'CAMERA:FIRST',
  // 第三人称
  'CAMERA:THREE',
  // 机房
  'CAMERA:MACHINEROOM',

  // 人物加速
  'PERSON:ADD',
  // 人物减速
  'PERSON:SUB',
  // 人物动作
  'PERSON:ACTION',

  // 场景坐标
  'SCENE:POS',

  // 设备更新
  'DEV:UPDATE'
] as const
type EventNames = (typeof eventNames)[number]

class EventEmitter {
  private listteners: Record<string, Set<Function>> = eventNames.reduce((obj, key) => {
    obj[key] = new Set()
    return obj
  }, {})

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
