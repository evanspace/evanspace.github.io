// 事件
const eventNames = [
  /**
   * 设备更新
   */
  'DEV:UPDATE'
] as const
type EventNames = (typeof eventNames)[number]

class EventEmitter {
  private listteners: Record<string, Set<Function>> = eventNames.reduce((obj, key) => {
    obj[key] = new Set()
    return obj
  }, {})

  on(eventName: EventNames, listtener: Function) {
    this.listteners[eventName].add(listtener)
  }

  emit(eventName: EventNames, ...args: any[]) {
    this.listteners[eventName].forEach(listtener => listtener(...args))
  }
}

export default new EventEmitter()
