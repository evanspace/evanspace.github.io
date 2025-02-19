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

  // 大门
  'CAMERA:GATE',
  // 前台
  'CAMERA:RECCEPTION',
  // 办公区域
  'CAMERA:OFFICE',
  // 大会议室
  'CAMERA:LCR',
  // 老板办公室
  'CAMERA:BOSS',

  // 人物加速
  'PERSON:ADD',
  // 人物减速
  'PERSON:SUB',

  // 前台灯开关
  'LIGHT:RECCEPTION',
  // 过道灯
  'LIGHT:AILSE',
  // 人事
  'LIGHT:PM',
  // 主机
  'LIGHT:HOST',
  // 大会议室
  'LIGHT:LCR',
  // 公司主灯光组
  'LIGHT:CLG',
  // 一楼灯光组
  'LIGHT:FIRSTFLOOR',

  // 关灯
  'LIGHT:CLOSE',
  // 自动
  'LIGHT:AUTO',

  // 窗帘
  'CURTAIN:TOGGLE',

  // 公司大门
  'DOOR:COMPANY',
  // 大会议室门
  'DOOR:LCR',
  // 老板办公室
  'DOOR:BOSS',

  // 大屏
  'SCREEN:COMPANY',
  // 欢迎词
  'SCREEN:WELCOM',
  // 小会议室大屏
  'SCREEN:SCR',
  // 大会议室大屏
  'SCREEN:LCR',

  // 空调
  'AIR:MAIN',
  // 单个空调
  'AIR:ODD',

  // 场景坐标
  'SCENE:POS',

  // 白天
  'SKY:DAY',
  // 傍晚
  'SKY:EVENING',
  // 夜晚
  'SKY:NIGHT',

  // 流光
  'EFFECT:FLEETING',

  // 鸟瞰视角-公司
  'BIRD:COMPANY'
] as const
type EventNames = (typeof eventNames)[number]

class EventEmitter {
  // 定义一个私有变量，用于存储事件监听器
  private listteners: Record<string, Set<Function>> = eventNames.reduce((obj, key) => {
    // 初始化每个事件对应的监听器集合
    obj[key] = new Set()
    return obj
  }, {})

  // 添加事件监听器
  on(eventName: EventNames, listtener: Function) {
    this.listteners[eventName].forEach(it => {
      if (it.toString() === listtener.toString()) {
        this.listteners[eventName].delete(it)
      }
    })
    // 将监听器添加到对应事件的监听器集合中
    this.listteners[eventName].add(listtener)
  }

  // 触发事件
  emit(eventName: EventNames, ...args: any[]) {
    // 遍历对应事件的监听器集合，并执行监听器函数
    this.listteners[eventName].forEach(listtener => listtener(...args))
  }
}

export default new EventEmitter()
